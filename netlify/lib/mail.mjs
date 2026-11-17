// E-Mail-Versand (Bestätigung, Absage, Verlegung, Erinnerung, Info an hallo@) inklusive Kalenderdatei.
import fs from 'node:fs/promises';
import path from 'node:path';
import { settings, appointmentTypes, staff as allStaff } from './config.mjs';
import { useSmtp, dataDir } from './env.mjs';
import { formatDateDe, formatTimeDe } from './tz.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const icsDate = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export function buildIcs(b, { cancel = false } = {}) {
  const type = appointmentTypes[b.type_id];
  const person = allStaff.find((s) => s.id === b.staff_id);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//meinsternum//Terminbuchung//DE',
    `METHOD:${cancel ? 'CANCEL' : 'PUBLISH'}`,
    'BEGIN:VEVENT',
    `UID:${b.id}@termin.meinsternum`,
    `SEQUENCE:${Math.floor(Date.parse(b.updated_at || b.created_at) / 60000)}`,
    `DTSTAMP:${icsDate(Date.now())}`,
    `DTSTART:${icsDate(Date.parse(b.start_at))}`,
    `DTEND:${icsDate(Date.parse(b.end_at))}`,
    `SUMMARY:${icsText(`${type.title} mit ${person.name}`)}`,
    ...(b.meet_link ? [`LOCATION:${icsText(b.meet_link)}`, `DESCRIPTION:${icsText(`Videolink: ${b.meet_link}`)}`] : []),
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

function wrap(html) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1f2937;max-width:560px">${html}</div>`;
}

export const templates = {
  confirmation(b) {
    const type = appointmentTypes[b.type_id];
    const person = allStaff.find((s) => s.id === b.staff_id);
    const text = `Hallo ${firstName(b)},

dein ${type.title} ist bestätigt.

Wann: ${when(b)} (${type.minutes} Minuten)
Mit: ${person.name}
${b.meet_link ? `Videolink: ${b.meet_link}\n` : ''}
Du kannst den Termin hier absagen oder verschieben:
${manageUrl(b)}

Du bekommst vorab noch eine Erinnerung.

Viele Grüße
${person.name}`;
    const html = wrap(`<p>Hallo ${esc(firstName(b))},</p><p>dein <strong>${esc(type.title)}</strong> ist bestätigt.</p>
<p><strong>Wann:</strong> ${esc(when(b))} (${type.minutes} Minuten)<br><strong>Mit:</strong> ${esc(person.name)}${b.meet_link ? `<br><strong>Videolink:</strong> <a href="${esc(b.meet_link)}">${esc(b.meet_link)}</a>` : ''}</p>
<p><a href="${esc(manageUrl(b))}">Termin absagen oder verschieben</a></p><p>Du bekommst vorab noch eine Erinnerung.</p><p>Viele Grüße<br>${esc(person.name)}</p>`);
    return { subject: `Dein Termin am ${formatDateDe(Date.parse(b.start_at))}, ${formatTimeDe(Date.parse(b.start_at))}`, text, html, ics: buildIcs(b) };
  },
  reminder(b, hours) {
    const type = appointmentTypes[b.type_id];
    const person = allStaff.find((s) => s.id === b.staff_id);
    const lead = hours >= 48 ? 'in drei Tagen' : 'morgen';
    const text = `Hallo ${firstName(b)},

kurze Erinnerung: Dein ${type.title} mit ${person.name} ist ${lead}.

Wann: ${when(b)}
${b.meet_link ? `Videolink: ${b.meet_link}\n` : ''}
Falls es nicht passt, kannst du den Termin hier absagen oder verschieben:
${manageUrl(b)}

Viele Grüße
${person.name}`;
    const html = wrap(`<p>Hallo ${esc(firstName(b))},</p><p>kurze Erinnerung: Dein ${esc(type.title)} mit ${esc(person.name)} ist ${lead}.</p>
<p><strong>Wann:</strong> ${esc(when(b))}${b.meet_link ? `<br><strong>Videolink:</strong> <a href="${esc(b.meet_link)}">${esc(b.meet_link)}</a>` : ''}</p>
<p>Falls es nicht passt: <a href="${esc(manageUrl(b))}">Termin absagen oder verschieben</a></p><p>Viele Grüße<br>${esc(person.name)}</p>`);
    return { subject: `Erinnerung: ${type.title} ${lead}, ${formatTimeDe(Date.parse(b.start_at))}`, text, html };
  },
  rescheduled(b) {
    const type = appointmentTypes[b.type_id];
    const person = allStaff.find((s) => s.id === b.staff_id);
    const text = `Hallo ${firstName(b)},

dein ${type.title} wurde verschoben. Die neuen Angaben:

Wann: ${when(b)} (${type.minutes} Minuten)
Mit: ${person.name}
${b.meet_link ? `Videolink: ${b.meet_link}\n` : ''}
Absagen oder erneut verschieben:
${manageUrl(b)}

Viele Grüße
${person.name}`;
    const html = wrap(`<p>Hallo ${esc(firstName(b))},</p><p>dein <strong>${esc(type.title)}</strong> wurde verschoben. Die neuen Angaben:</p>
<p><strong>Wann:</strong> ${esc(when(b))} (${type.minutes} Minuten)<br><strong>Mit:</strong> ${esc(person.name)}${b.meet_link ? `<br><strong>Videolink:</strong> <a href="${esc(b.meet_link)}">${esc(b.meet_link)}</a>` : ''}</p>
<p><a href="${esc(manageUrl(b))}">Termin absagen oder erneut verschieben</a></p><p>Viele Grüße<br>${esc(person.name)}</p>`);
    return { subject: `Termin verschoben: ${formatDateDe(Date.parse(b.start_at))}, ${formatTimeDe(Date.parse(b.start_at))}`, text, html, ics: buildIcs(b) };
  },
  cancelled(b) {
    const type = appointmentTypes[b.type_id];
    const person = allStaff.find((s) => s.id === b.staff_id);
    const text = `Hallo ${firstName(b)},

dein ${type.title} am ${when(b)} wurde abgesagt.

Wenn du einen neuen Termin möchtest, kannst du hier direkt buchen:
${settings.siteUrl}${settings.bookPath}

Viele Grüße
${person.name}`;
    const html = wrap(`<p>Hallo ${esc(firstName(b))},</p><p>dein ${esc(type.title)} am ${esc(when(b))} wurde abgesagt.</p><p><a href="${esc(settings.siteUrl + settings.bookPath)}">Neuen Termin buchen</a></p><p>Viele Grüße<br>${esc(person.name)}</p>`);
    return { subject: `Termin abgesagt: ${formatDateDe(Date.parse(b.start_at))}`, text, html, ics: buildIcs(b, { cancel: true }) };
  },
  internal(kind, b, extra = '') {
    const type = appointmentTypes[b.type_id];
    const person = allStaff.find((s) => s.id === b.staff_id);
    const label = { new: 'Neue Buchung', cancelled: 'Absage', rescheduled: 'Verlegung' }[kind];
    const lines = [
      `${label}: ${type.title} mit ${person.name}`,
      `Wann: ${when(b)}`,
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
      html: wrap(lines.map(esc).join('<br>')),
    };
  },
};

export function createMailer() {
  const from = process.env.MAIL_FROM || `meinsternum <${settings.notifyEmail}>`;
  if (!useSmtp()) {
    // Testbetrieb: Mails werden nicht versendet, sondern ins Log geschrieben (Netlify: Functions > Logs) und lokal als Datei abgelegt.
    return {
      async send({ to, subject, text, ics }) {
        console.log(`[mail-test] An: ${to}\nBetreff: ${subject}\n\n${text}\n${ics ? '[Kalenderdatei angehängt]\n' : ''}`);
        try {
          const dir = path.join(dataDir(), 'outbox');
          await fs.mkdir(dir, { recursive: true });
          const name = `${new Date().toISOString().replace(/[:.]/g, '-')}-${to.replace(/[^a-z0-9]/gi, '_')}.txt`;
          await fs.writeFile(path.join(dir, name), `An: ${to}\nBetreff: ${subject}\n\n${text}\n${ics ? '\n[Kalenderdatei angehängt]\n' : ''}`);
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
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        replyTo: settings.notifyEmail,
        attachments: ics ? [{ filename: 'termin.ics', content: ics, contentType: `text/calendar; charset=utf-8; method=${ics.includes('METHOD:CANCEL') ? 'CANCEL' : 'PUBLISH'}` }] : [],
      });
    },
  };
}
