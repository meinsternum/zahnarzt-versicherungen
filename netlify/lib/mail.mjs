// E-Mail-Versand (Bestätigung, Absage, Verlegung, Erinnerung, Info an hallo@) inklusive Kalenderdatei.
import fs from 'node:fs/promises';
import path from 'node:path';
import { settings, appointmentTypes, staff as allStaff, channels, office } from './config.mjs';
import { useSmtp, dataDir } from './env.mjs';
import { formatDateDe, formatTimeDe } from './tz.mjs';
import { logoPng } from './logo.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const icsDate = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const NAVY = '#39537c';
const TEAL = '#31708f';
const TEXT = '#25324a';
const LEISE = '#566479';

export const minutesLabel = (m) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return [h ? `${h} Std.` : '', r ? `${r} Min.` : ''].filter(Boolean).join(' ');
};

const addressLine = `${office.company}, ${office.street}, ${office.zip} ${office.city}`;

// Wie nimmt die Person am Termin teil? Text und HTML-Variante.
function channelInfo(b, person) {
  const ch = b.channel || 'online';
  if (ch === 'phone') {
    const nr = b.phone || 'der angegebenen Nummer';
    return { label: channels.phone.label, text: `${person.name} ruft dich zur vereinbarten Zeit unter ${nr} an.`, html: `${esc(person.name)} ruft dich zur vereinbarten Zeit unter ${esc(nr)} an.` };
  }
  if (ch === 'onsite') {
    return { label: channels.onsite.label, text: `Wir treffen uns in unserem Büro: ${addressLine}.`, html: `Wir treffen uns in unserem Büro:<br>${esc(addressLine)}` };
  }
  return {
    label: channels.online.label,
    text: `So nimmst du teil: Öffne zur vereinbarten Zeit ${office.zoomPage} und klicke dort auf das Foto von ${person.name}. Du kommst direkt in den persönlichen Zoom-Raum.`,
    html: `So nimmst du teil: Öffne zur vereinbarten Zeit <a href="${office.zoomPage}" style="color:${TEAL}">${office.zoomPage.replace('https://', '')}</a> und klicke dort auf das Foto von ${esc(person.name)}. Du kommst direkt in den persönlichen Zoom-Raum.`,
  };
}

export function buildIcs(b, { cancel = false } = {}) {
  const type = appointmentTypes[b.type_id];
  const person = allStaff.find((s) => s.id === b.staff_id);
  const info = channelInfo(b, person);
  const ch = b.channel || 'online';
  const location = ch === 'onsite' ? addressLine : ch === 'online' ? office.zoomPage : '';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//meinsternum//Terminbuchung//DE',
    // Ohne METHOD zeigen Mailprogramme die Datei als normalen Anhang, nicht als Import-Meldung.
    ...(cancel ? ['METHOD:CANCEL'] : []),
    'BEGIN:VEVENT',
    `UID:${b.id}@termin.meinsternum`,
    `SEQUENCE:${Math.floor(Date.parse(b.updated_at || b.created_at) / 60000)}`,
    `DTSTAMP:${icsDate(Date.now())}`,
    `DTSTART:${icsDate(Date.parse(b.start_at))}`,
    `DTEND:${icsDate(Date.parse(b.end_at))}`,
    `SUMMARY:${icsText(`meinsternum: ${type.title} mit ${person.name}`)}`,
    ...(location ? [`LOCATION:${icsText(location)}`] : []),
    `DESCRIPTION:${icsText(info.text)}`,
    `STATUS:${cancel ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export const manageUrl = (b) => `${settings.siteUrl}${settings.managePath}?t=${encodeURIComponent(b.token)}`;

function when(b) {
  const s = Date.parse(b.start_at);
  return `${formatDateDe(s)}, ${formatTimeDe(s)}`;
}
// Vorname ohne Titel: "Dr. med. Anna Beispiel" -> "Anna"
export const firstName = (b) => {
  const tokens = b.name.trim().split(/\s+/);
  const i = tokens.findIndex((t) => !/^(dr|prof|med|dent|dipl|priv|doz|univ)\.?(-\w+\.?)?$/i.test(t));
  return tokens[i < 0 ? 0 : i];
};

// Markenschreibweise: „mein“ normal, „sternum“ fett
const markeHtml = 'mein<b>sternum</b>';

const questionsText = `Wenn du vorab Fragen hast, melde dich gerne bei uns: ${office.email} oder ${office.phone}.`;
const questionsHtml = `Wenn du vorab Fragen hast, melde dich gerne bei uns: <a href="mailto:${office.email}" style="color:${TEAL}">${office.email}</a> oder ${esc(office.phone)}.`;

const signatureText = `Viele Grüße
dein meinsternum-Team

--
${office.company}
${office.street}, ${office.zip} ${office.city}
Telefon ${office.phone} · ${office.email}
${office.web.replace('https://', '')}
${office.legal}`;

const signatureHtml = `<p style="margin:24px 0 0">Viele Grüße<br>dein ${markeHtml}-Team</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid #e1e6ee;width:100%"><tr><td style="padding-top:16px;font-size:13px;line-height:1.55;color:${LEISE}">
<strong style="color:${NAVY}">${esc(office.company)}</strong><br>
${esc(office.street)}, ${esc(office.zip)} ${esc(office.city)}<br>
Telefon ${esc(office.phone)} · <a href="mailto:${office.email}" style="color:${TEAL}">${office.email}</a><br>
<a href="${office.web}" style="color:${TEAL}">${office.web.replace('https://', '')}</a>
<div style="margin-top:8px;font-size:12px;color:#8793a6">${esc(office.legal)}</div>
</td></tr></table>`;

const button = (href, label) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:${NAVY};border-radius:999px"><a href="${esc(href)}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px">${esc(label)}</a></td></tr></table>`;

const buttonLight = (href, label) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px"><tr><td style="border:1px solid ${NAVY};border-radius:999px"><a href="${esc(href)}" style="display:inline-block;padding:10px 20px;color:${NAVY};text-decoration:none;font-weight:600;font-size:14px">${esc(label)}</a></td></tr></table>`;

// Links zum Eintragen in Google, Outlook oder per .ics-Datei
function calendarLinks(b) {
  const type = appointmentTypes[b.type_id];
  const person = allStaff.find((s) => s.id === b.staff_id);
  const info = channelInfo(b, person);
  const ch = b.channel || 'online';
  const location = ch === 'onsite' ? addressLine : ch === 'online' ? office.zoomPage : '';
  const title = `meinsternum: ${type.title} mit ${person.name}`;
  const start = Date.parse(b.start_at);
  const end = Date.parse(b.end_at);
  const q = (o) => new URLSearchParams(o).toString();
  return {
    google: `https://calendar.google.com/calendar/render?${q({ action: 'TEMPLATE', text: title, dates: `${icsDate(start)}/${icsDate(end)}`, details: info.text, location })}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?${q({ path: '/calendar/action/compose', rru: 'addevent', subject: title, startdt: new Date(start).toISOString(), enddt: new Date(end).toISOString(), body: info.text, location })}`,
    ics: `${settings.siteUrl}/api/ics?t=${encodeURIComponent(b.token)}`,
  };
}

const detailsBox = (rows) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f2f5f9;border-radius:12px;margin:16px 0"><tr><td style="padding:16px 18px;font-size:15px;line-height:1.6;color:${TEXT}">${rows
    .map(([k, v]) => `<strong style="color:${NAVY}">${esc(k)}:</strong> ${esc(v)}`)
    .join('<br>')}</td></tr></table>`;

// Gemeinsamer Rahmen: Kopf mit Logo und Wortmarke, Inhalt, Signatur
function layout(inner) {
  return `<!doctype html><html lang="de"><body style="margin:0;padding:0;background:#fafafb">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#fafafb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e1e6ee;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:${TEXT}">
<tr><td style="height:5px;line-height:5px;font-size:0;background:${TEAL};background-image:linear-gradient(90deg,#2f4770,#39537c 40%,#31708f 75%,#1f7f95)">&nbsp;</td></tr>
<tr><td style="padding:20px 28px 4px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><img src="cid:logo" width="44" height="44" alt="" style="display:block;border:0"></td>
<td style="vertical-align:middle;padding-left:12px;font-size:22px;color:${NAVY}"><span style="font-weight:300">mein</span><span style="font-weight:700">sternum</span></td>
</tr></table></td></tr>
<tr><td style="padding:28px 28px 26px;font-size:15px;line-height:1.6">${inner}${signatureHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

const typeAndPerson = (b) => ({ type: appointmentTypes[b.type_id], person: allStaff.find((s) => s.id === b.staff_id) });
const dateSubject = (b) => `${formatDateDe(Date.parse(b.start_at))}, ${formatTimeDe(Date.parse(b.start_at))}`;

// Zeilen für den Detailkasten (Text und HTML)
function detailRows(b, type, person, info) {
  return [
    ['Wann', when(b)],
    ['Dauer', minutesLabel(Math.round((Date.parse(b.end_at) - Date.parse(b.start_at)) / 60000))],
    ['Mit', person.name],
    ['Beratungsform', info.label],
  ];
}
const detailText = (rows) => rows.map(([k, v]) => `${k}: ${v}`).join('\n');

export const templates = {
  confirmation(b) {
    const { type, person } = typeAndPerson(b);
    const info = channelInfo(b, person);
    const rows = detailRows(b, type, person, info);
    const text = `Hallo ${firstName(b)},

deine ${type.title} ist bestätigt.

${detailText(rows)}

${info.text}

Im Kalender eintragen:
Google: ${calendarLinks(b).google}
Outlook: ${calendarLinks(b).outlook}
Apple und andere (.ics): ${calendarLinks(b).ics}

Du kannst den Termin hier absagen oder verschieben:
${manageUrl(b)}

${questionsText}

${signatureText}`;
    const html = layout(`<p style="margin:0 0 14px">Hallo ${esc(firstName(b))},</p>
<p style="margin:0 0 6px">deine ${esc(type.title)} ist bestätigt.</p>
${detailsBox(rows)}
<p style="margin:0 0 4px">${info.html}</p>
${button(calendarLinks(b).google, 'Im Google Kalender eintragen')}
<p style="margin:-8px 0 20px;font-size:14px;color:${LEISE}">Andere Kalender: <a href="${esc(calendarLinks(b).outlook)}" style="color:${TEAL}">Outlook</a> · <a href="${esc(calendarLinks(b).ics)}" style="color:${TEAL}">Apple Kalender und andere (.ics)</a></p>
<p style="margin:0 0 4px">Möchtest du den Termin ändern?</p>
${buttonLight(manageUrl(b), 'Absagen oder verschieben')}
<p style="margin:0">${questionsHtml}</p>`);
    return { subject: `Dein meinsternum-Termin am ${dateSubject(b)}`, text, html, ics: buildIcs(b) };
  },
  reminder(b, hours) {
    const { type, person } = typeAndPerson(b);
    const info = channelInfo(b, person);
    const rows = detailRows(b, type, person, info);
    const lead = hours >= 48 ? 'in drei Tagen' : 'morgen';
    const text = `Hallo ${firstName(b)},

kurze Erinnerung: Deine ${type.title} mit ${person.name} ist ${lead}.

${detailText(rows)}

${info.text}

Falls es nicht passt, kannst du den Termin hier absagen oder verschieben:
${manageUrl(b)}

${questionsText}

${signatureText}`;
    const html = layout(`<p style="margin:0 0 14px">Hallo ${esc(firstName(b))},</p>
<p style="margin:0 0 6px">kurze Erinnerung: Deine ${esc(type.title)} mit ${esc(person.name)} ist ${lead}.</p>
${detailsBox(rows)}
<p style="margin:0 0 4px">${info.html}</p>
<p style="margin:14px 0 0">Falls es nicht passt, kannst du den Termin hier absagen oder verschieben:</p>
${button(manageUrl(b), 'Termin absagen oder verschieben')}
<p style="margin:0">${questionsHtml}</p>`);
    return { subject: `Erinnerung: Dein meinsternum-Termin am ${dateSubject(b)}`, text, html };
  },
  rescheduled(b) {
    const { type, person } = typeAndPerson(b);
    const info = channelInfo(b, person);
    const rows = detailRows(b, type, person, info);
    const text = `Hallo ${firstName(b)},

deine ${type.title} wurde verschoben. Die neuen Angaben:

${detailText(rows)}

${info.text}

Absagen oder erneut verschieben:
${manageUrl(b)}

${questionsText}

${signatureText}`;
    const html = layout(`<p style="margin:0 0 14px">Hallo ${esc(firstName(b))},</p>
<p style="margin:0 0 6px">deine ${esc(type.title)} wurde verschoben. Die neuen Angaben:</p>
${detailsBox(rows)}
<p style="margin:0 0 4px">${info.html}</p>
${button(manageUrl(b), 'Termin absagen oder erneut verschieben')}
<p style="margin:0">${questionsHtml}</p>`);
    return { subject: `Dein meinsternum-Termin wurde verschoben auf den ${dateSubject(b)}`, text, html, ics: buildIcs(b) };
  },
  cancelled(b) {
    const { type, person } = typeAndPerson(b);
    const bookUrl = settings.siteUrl + settings.bookPath;
    const text = `Hallo ${firstName(b)},

deine ${type.title} mit ${person.name} am ${when(b)} wurde abgesagt.

Wenn du einen neuen Termin möchtest, kannst du hier direkt buchen:
${bookUrl}

${signatureText}`;
    const html = layout(`<p style="margin:0 0 14px">Hallo ${esc(firstName(b))},</p>
<p style="margin:0 0 6px">deine ${esc(type.title)} mit ${esc(person.name)} am ${esc(when(b))} wurde abgesagt.</p>
<p style="margin:14px 0 0">Wenn du einen neuen Termin möchtest, kannst du hier direkt buchen:</p>
${button(bookUrl, 'Neuen Termin buchen')}`);
    return { subject: `Dein meinsternum-Termin am ${dateSubject(b)} wurde abgesagt`, text, html, ics: buildIcs(b, { cancel: true }) };
  },
  internal(kind, b, extra = '') {
    const { type, person } = typeAndPerson(b);
    const label = { new: 'Neue Buchung', cancelled: 'Absage', rescheduled: 'Verlegung' }[kind];
    const lines = [
      `${label}: ${type.title} mit ${person.name}`,
      `Wann: ${when(b)}`,
      `Beratungsform: ${channels[b.channel || 'online'].label}`,
      `Name: ${b.name}`,
      `E-Mail: ${b.email}`,
      `Telefon: ${b.phone || '-'}`,
      `Wie gefunden: ${b.source || '-'}`,
      `Anliegen: ${b.note || '-'}`,
      ...(extra ? [extra] : []),
    ];
    return {
      subject: `${label}: ${b.name}, ${formatDateDe(Date.parse(b.start_at))} ${formatTimeDe(Date.parse(b.start_at))}`,
      text: lines.join('\n'),
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:${TEXT};max-width:560px">${lines.map(esc).join('<br>')}</div>`,
    };
  },
};

export function createMailer() {
  const from = process.env.MAIL_FROM || `meinsternum <${settings.notifyEmail}>`;
  if (!useSmtp()) {
    // Testbetrieb: Mails werden nicht versendet, sondern ins Log geschrieben (Netlify: Functions > Logs) und lokal als Datei abgelegt.
    return {
      async send({ to, subject, text, html, ics }) {
        console.log(`[mail-test] An: ${to}\nBetreff: ${subject}\n\n${text}\n${ics ? '[Kalenderdatei angehängt]\n' : ''}`);
        try {
          const dir = path.join(dataDir(), 'outbox');
          await fs.mkdir(dir, { recursive: true });
          const name = `${new Date().toISOString().replace(/[:.]/g, '-')}-${to.replace(/[^a-z0-9]/gi, '_')}`;
          await fs.writeFile(path.join(dir, `${name}.txt`), `An: ${to}\nBetreff: ${subject}\n\n${text}\n${ics ? '\n[Kalenderdatei angehängt]\n' : ''}`);
          if (html) await fs.writeFile(path.join(dir, `${name}.html`), html.replace('cid:logo', `data:image/png;base64,${logoPng.toString('base64')}`));
        } catch {
          /* Dateiablage ist nur Zugabe */
        }
      },
    };
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) throw new Error('SMTP_USER und SMTP_PASS fehlen.');
  let transporter;
  return {
    async send({ to, subject, text, html, ics }) {
      if (!transporter) {
        const nodemailer = (await import('nodemailer')).default;
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
      }
      const attachments = [];
      if (html && html.includes('cid:logo')) attachments.push({ filename: 'logo.png', content: logoPng, cid: 'logo', contentType: 'image/png', contentDisposition: 'inline' });
      if (ics) attachments.push({ filename: 'termin.ics', content: ics, contentType: `text/calendar; charset=utf-8${ics.includes('METHOD:CANCEL') ? '; method=CANCEL' : ''}` });
      await transporter.sendMail({ from, to, subject, text, html, replyTo: settings.notifyEmail, attachments });
    },
  };
}
