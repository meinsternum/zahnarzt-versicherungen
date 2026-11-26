// Geschäftslogik: buchen, absagen, verlegen, erinnern. Abhängigkeiten (Speicher, Kalender, Mail) werden übergeben, damit alles testbar ist.
import { settings, appointmentTypes, staff as allStaff, sourceOptions, externalLinks, channels, office } from './config.mjs';
import { computeSlots, staffForType } from './slots.mjs';
import { localDate, formatDayShortDe, localTime, addDays } from './tz.mjs';
import { newId, newToken } from './store.mjs';
import { templates } from './mail.mjs';

// Beraterfotos liegen in public/termin-test/fotos/<id>.jpg
const PHOTOS = new Set(['patrick', 'aileen', 'michael', 'steffen', 'alexios', 'fatma', 'henry', 'frank']);
const photoOf = (id) => (PHOTOS.has(id) ? `/termin-test/fotos/${id}.jpg` : '');

export class BookingError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const HOUR = 3600e3;

function makeGetBusy({ store, calendar }, excludeBookingId = null) {
  return async (staff, fromMs, toMs) => {
    const [cal, own] = await Promise.all([calendar.freeBusy(staff, fromMs, toMs), store.listConfirmed(new Date(fromMs).toISOString(), new Date(toMs).toISOString())]);
    return [
      ...cal,
      ...own.filter((b) => b.staff_id === staff.id && b.id !== excludeBookingId).map((b) => ({ start: Date.parse(b.start_at), end: Date.parse(b.end_at) })),
    ];
  };
}

export function publicBooking(b) {
  const person = allStaff.find((s) => s.id === b.staff_id);
  return {
    typeId: b.type_id,
    typeTitle: appointmentTypes[b.type_id].title,
    minutes: appointmentTypes[b.type_id].minutes,
    staffId: b.staff_id,
    staffName: person.name,
    staffPhoto: photoOf(b.staff_id),
    start: b.start_at,
    end: b.end_at,
    status: b.status,
    channel: b.channel || 'online',
    changeable: b.status === 'confirmed' && Date.parse(b.start_at) - Date.now() >= settings.changeDeadlineHours * HOUR,
  };
}

export function publicConfig() {
  return {
    types: Object.values(appointmentTypes).map((t) => ({ id: t.id, title: t.title, minutes: t.minutes, description: t.description, staff: staffForType(t.id).map((s) => ({ id: s.id, name: s.name, blurb: t.id === 'kurzberatung' ? t.description : s.blurb || t.description, photo: photoOf(s.id) })) })),
    channels: Object.values(channels).map((c) => ({ id: c.id, label: c.label })),
    external: externalLinks,
    sources: sourceOptions,
    changeDeadlineHours: settings.changeDeadlineHours,
  };
}

export async function listSlots(deps, { typeId, staffId = 'any', fromDate, days = 14, now = Date.now(), rescheduleToken = null }) {
  if (!appointmentTypes[typeId]) throw new BookingError('unknown_type', 'Unbekannte Terminart');
  if (staffId !== 'any' && !staffForType(typeId).some((s) => s.id === staffId)) throw new BookingError('unknown_staff', 'Diese Person bietet die Terminart nicht an');
  const today = localDate(now);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate || '') || fromDate < today) fromDate = today;
  days = Math.min(Math.max(Number(days) || 14, 1), 31);
  // Beim Verlegen blockiert der eigene Termin die Auswahl nicht
  let own = null;
  if (rescheduleToken) {
    const b = await deps.store.getByToken(String(rescheduleToken));
    if (b && b.status === 'confirmed' && b.type_id === typeId && b.staff_id === staffId) own = b;
  }
  const slots = await computeSlots({
    typeId,
    staffId,
    fromDate,
    days,
    now,
    getBusy: makeGetBusy(deps, own?.id),
    ignore: own ? { staffId: own.staff_id, start: Date.parse(own.start_at), end: Date.parse(own.end_at) } : null,
  });
  const byDate = new Map();
  for (const s of slots) {
    const d = localDate(s.start);
    if (!byDate.has(d)) byDate.set(d, { date: d, label: formatDayShortDe(s.start), slots: [] });
    byDate.get(d).slots.push({ start: new Date(s.start).toISOString(), time: localTime(s.start), staffIds: s.staffIds });
  }
  const nextFrom = addDays(fromDate, days);
  return { days: [...byDate.values()], nextFrom, hasMore: nextFrom <= localDate(now + settings.maxDaysAhead * 24 * HOUR) };
}

function validate(input) {
  const err = (m) => new BookingError('invalid', m);
  if (input.website) throw new BookingError('invalid', 'Ungültige Anfrage'); // Honeypot
  if (!appointmentTypes[input.type]) throw err('Bitte wähle eine Terminart.');
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim();
  if (name.length < 2 || name.length > 100) throw err('Bitte gib deinen Namen an.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) throw err('Bitte gib eine gültige E-Mail-Adresse an.');
  if (input.consent !== true) throw err('Bitte bestätige die Datenschutzhinweise.');
  const start = Date.parse(input.start);
  if (Number.isNaN(start)) throw err('Bitte wähle eine Uhrzeit.');
  const source = sourceOptions.some((s) => s.id === input.source) ? input.source : '';
  const channel = input.channel === undefined || input.channel === '' ? 'online' : String(input.channel);
  if (!channels[channel]) throw err('Bitte wähle, wie die Beratung stattfinden soll.');
  const phone = String(input.phone || '').trim().slice(0, 40);
  if (channel === 'phone' && phone.replace(/\D/g, '').length < 6) throw err('Für eine telefonische Beratung brauchen wir deine Telefonnummer.');
  return {
    typeId: input.type,
    staffId: input.staff || 'any',
    start,
    name,
    email,
    phone,
    channel,
    note: String(input.note || '').trim().slice(0, 1000),
    source,
  };
}

async function safeSend(mailer, msg) {
  try {
    await mailer.send(msg);
    return true;
  } catch (e) {
    console.error('Mailversand fehlgeschlagen:', msg.to, e.message);
    return false;
  }
}

function pickStaff(slot, staffId) {
  return staffId !== 'any' ? staffId : slot.staffIds[Math.floor(Math.random() * slot.staffIds.length)];
}

export async function createBooking(deps, input, now = Date.now()) {
  const v = validate(input);
  const type = appointmentTypes[v.typeId];
  const slots = await computeSlots({ typeId: v.typeId, staffId: v.staffId, fromDate: localDate(v.start), days: 1, now, getBusy: makeGetBusy(deps) });
  const slot = slots.find((s) => s.start === v.start);
  if (!slot) throw new BookingError('slot_unavailable', 'Dieser Termin ist leider nicht mehr frei. Bitte wähle eine andere Zeit.', 409);

  const staffId = pickStaff(slot, v.staffId);
  const person = allStaff.find((s) => s.id === staffId);
  const row = {
    id: newId(),
    token: newToken(),
    type_id: v.typeId,
    staff_id: staffId,
    start_at: new Date(slot.start).toISOString(),
    end_at: new Date(slot.end).toISOString(),
    name: v.name,
    email: v.email,
    phone: v.phone,
    channel: v.channel,
    note: v.note,
    source: v.source,
    status: 'confirmed',
    event_id: '',
    meet_link: '',
    reminders_sent: [],
    created_at: new Date(now).toISOString(),
  };

  let booking;
  try {
    booking = await deps.store.insert(row); // reserviert den Termin (Schutz vor Doppelbuchung)
  } catch (e) {
    if (e.code === 'CONFLICT') throw new BookingError('slot_unavailable', 'Dieser Termin wurde gerade vergeben. Bitte wähle eine andere Zeit.', 409);
    throw e;
  }

  try {
    const ev = await deps.calendar.createEvent(person, {
      summary: `${type.title} (${channels[v.channel].short}): ${v.name}`,
      description: [
        `Kontakt: ${v.name}`,
        `E-Mail: ${v.email}`,
        v.phone && `Telefon: ${v.phone}`,
        `Beratungsform: ${channels[v.channel].label}`,
        v.channel === 'online' && `Zoom: persönlicher Raum, Zugang über ${office.zoomPage}`,
        v.note && `Anliegen: ${v.note}`,
        'Gebucht über die Online-Terminbuchung',
      ].filter(Boolean).join('\n'),
      location: v.channel === 'onsite' ? `${office.company}, ${office.street}, ${office.zip} ${office.city}` : v.channel === 'online' ? office.zoomPage : '',
      startMs: slot.start,
      endMs: slot.end,
    });
    booking = await deps.store.update(booking.id, { event_id: ev.eventId });
  } catch (e) {
    await deps.store.update(booking.id, { status: 'cancelled' }).catch(() => {});
    console.error('Kalendereintrag fehlgeschlagen:', e);
    throw new BookingError('calendar_failed', 'Der Termin konnte gerade nicht eingetragen werden. Bitte versuche es später noch einmal oder schreibe uns an hallo@meinsternum.de.', 502);
  }

  const c = templates.confirmation(booking);
  await safeSend(deps.mailer, { to: booking.email, ...c });
  await safeSend(deps.mailer, { to: settings.notifyEmail, ...templates.internal('new', booking) });
  return { token: booking.token, booking: publicBooking(booking) };
}

async function loadChangeable(deps, token, now) {
  const b = token ? await deps.store.getByToken(String(token)) : null;
  if (!b) throw new BookingError('not_found', 'Termin nicht gefunden.', 404);
  if (b.status !== 'confirmed') throw new BookingError('not_active', 'Dieser Termin wurde bereits abgesagt.', 409);
  if (Date.parse(b.start_at) - now < settings.changeDeadlineHours * HOUR)
    throw new BookingError('too_late', `Kurz vor dem Termin geht das online nicht mehr. Bitte schreibe uns an ${settings.notifyEmail}.`, 409);
  return b;
}

export async function getBooking(deps, token) {
  const b = token ? await deps.store.getByToken(String(token)) : null;
  if (!b) throw new BookingError('not_found', 'Termin nicht gefunden.', 404);
  return publicBooking(b);
}

export async function cancelBooking(deps, token, now = Date.now()) {
  const b = await loadChangeable(deps, token, now);
  const person = allStaff.find((s) => s.id === b.staff_id);
  if (b.event_id) await deps.calendar.deleteEvent(person, b.event_id);
  const updated = await deps.store.update(b.id, { status: 'cancelled' });
  await safeSend(deps.mailer, { to: updated.email, ...templates.cancelled(updated) });
  await safeSend(deps.mailer, { to: settings.notifyEmail, ...templates.internal('cancelled', updated) });
  return publicBooking(updated);
}

export async function rescheduleBooking(deps, token, newStartIso, now = Date.now()) {
  const b = await loadChangeable(deps, token, now);
  const start = Date.parse(newStartIso);
  if (Number.isNaN(start)) throw new BookingError('invalid', 'Bitte wähle eine Uhrzeit.');
  const person = allStaff.find((s) => s.id === b.staff_id);
  const oldStart = Date.parse(b.start_at);
  const oldEnd = Date.parse(b.end_at);
  const slots = await computeSlots({
    typeId: b.type_id,
    staffId: b.staff_id,
    fromDate: localDate(start),
    days: 1,
    now,
    getBusy: makeGetBusy(deps, b.id),
    ignore: { staffId: b.staff_id, start: oldStart, end: oldEnd },
  });
  const slot = slots.find((s) => s.start === start);
  if (!slot) throw new BookingError('slot_unavailable', 'Dieser Termin ist leider nicht frei. Bitte wähle eine andere Zeit.', 409);

  let updated;
  try {
    updated = await deps.store.update(b.id, { start_at: new Date(slot.start).toISOString(), end_at: new Date(slot.end).toISOString(), reminders_sent: [] });
  } catch (e) {
    if (e.code === 'CONFLICT') throw new BookingError('slot_unavailable', 'Dieser Termin wurde gerade vergeben. Bitte wähle eine andere Zeit.', 409);
    throw e;
  }
  try {
    if (b.event_id) await deps.calendar.updateEvent(person, b.event_id, { startMs: slot.start, endMs: slot.end });
  } catch (e) {
    await deps.store.update(b.id, { start_at: b.start_at, end_at: b.end_at, reminders_sent: b.reminders_sent }).catch(() => {});
    console.error('Kalender-Update fehlgeschlagen:', e);
    throw new BookingError('calendar_failed', 'Der Termin konnte gerade nicht verschoben werden. Bitte versuche es später noch einmal.', 502);
  }
  await safeSend(deps.mailer, { to: updated.email, ...templates.rescheduled(updated) });
  await safeSend(deps.mailer, {
    to: settings.notifyEmail,
    ...templates.internal('rescheduled', updated, `Vorher: ${new Date(oldStart).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`),
  });
  return publicBooking(updated);
}

/**
 * Erinnerungen (stündlich aufrufen). Je Regel in settings.reminderHours:
 * - senden, sobald der Termin innerhalb der Frist liegt (Toleranz 12 Stunden, falls ein Lauf ausfiel)
 * - nicht senden, wenn der Termin erst nach dem Erinnerungszeitpunkt gebucht wurde
 */
export async function runReminders(deps, now = Date.now()) {
  const upcoming = await deps.store.listConfirmed(new Date(now).toISOString(), new Date(now + (Math.max(...settings.reminderHours) + 1) * HOUR).toISOString());
  const sent = [];
  for (const b of upcoming) {
    const done = new Set(b.reminders_sent || []);
    const startMs = Date.parse(b.start_at);
    const until = (startMs - now) / HOUR;
    for (const h of settings.reminderHours) {
      if (done.has(h) || until > h) continue;
      const tooLate = until < h - 12;
      const bookedAfter = Date.parse(b.created_at) > startMs - h * HOUR;
      if (!tooLate && !bookedAfter) {
        const ok = await safeSend(deps.mailer, { to: b.email, ...templates.reminder(b, h) });
        if (!ok) continue; // nächster Lauf versucht es erneut
        sent.push({ id: b.id, hours: h });
      }
      done.add(h);
    }
    if (done.size !== (b.reminders_sent || []).length) await deps.store.update(b.id, { reminders_sent: [...done] });
  }
  return sent;
}
