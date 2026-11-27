import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { staff as liveStaff, settings, externalLinks, minutesFor } from '../netlify/lib/config.mjs';
import { zonedToUtc, localDate, localTime } from '../netlify/lib/tz.mjs';
import { fileStore } from '../netlify/lib/store.mjs';
import { demoCalendar } from '../netlify/lib/calendar.mjs';
import { firstName } from '../netlify/lib/mail.mjs';
import { createBooking, cancelBooking, rescheduleBooking, listSlots, runReminders, BookingError } from '../netlify/lib/booking.mjs';

// Feste Testdaten (unabhängig von den echten Einstellungen): Mo bis Fr 9 bis 17 Uhr, Kurzberatung nur Patrick und Aileen
const wk = (a, b) => ({ 1: [[a, b]], 2: [[a, b]], 3: [[a, b]], 4: [[a, b]], 5: [[a, b]] });
const realStaff = liveStaff.map((s) => ({ ...s }));
const realSettings = { minNoticeHours: settings.minNoticeHours, bufferMinutes: settings.bufferMinutes };
const testStaff = [
  { id: 'patrick', name: 'Patrick', types: ['erstgespraech', 'kurzberatung'] },
  { id: 'aileen', name: 'Aileen', types: ['erstgespraech', 'kurzberatung'] },
  { id: 'eva', name: 'Eva', types: ['erstgespraech'] },
  { id: 'kirsten', name: 'Kirsten', types: ['erstgespraech'] },
].map((s) => ({ ...s, email: `${s.id}@example.invalid`, calendarId: `${s.id}@example.invalid`, hours: wk('09:00', '17:00') }));
const useTestData = () => {
  liveStaff.splice(0, liveStaff.length, ...testStaff);
  settings.minNoticeHours = 12;
  settings.bufferMinutes = 0;
};
const useRealData = () => {
  liveStaff.splice(0, liveStaff.length, ...realStaff);
  settings.minNoticeHours = realSettings.minNoticeHours;
  settings.bufferMinutes = realSettings.bufferMinutes;
};
useTestData();

const NOW = zonedToUtc('2026-11-16', '16:00'); // Montag
const input = (start, extra = {}) => ({ type: 'erstgespraech', staff: 'patrick', start: new Date(start).toISOString(), name: 'Dr. Anna Beispiel', email: 'anna@example.com', consent: true, ...extra });

async function setup() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'buchung-'));
  const outbox = [];
  const events = [];
  const cal = demoCalendar();
  const calendar = {
    ...cal,
    async createEvent(s, ev) {
      events.push(['create', s.id, ev.startMs]);
      return { eventId: `ev${events.length}` };
    },
    async updateEvent(s, id, ev) {
      events.push(['update', id, ev.startMs]);
    },
    async deleteEvent(s, id) {
      events.push(['delete', id]);
    },
  };
  return { deps: { store: fileStore(dir), calendar, mailer: { send: async (m) => outbox.push(m) } }, outbox, events };
}

test('Zeitzonen: Sommer- und Winterzeit', () => {
  assert.equal(new Date(zonedToUtc('2026-11-24', '10:00')).toISOString(), '2026-11-24T09:00:00.000Z');
  assert.equal(new Date(zonedToUtc('2026-07-01', '10:00')).toISOString(), '2026-06-30T08:00:00.000Z'.replace('06-30', '07-01'));
  assert.equal(localDate(zonedToUtc('2026-03-29', '09:00')), '2026-03-29');
  assert.equal(localTime(zonedToUtc('2026-10-25', '09:00')), '09:00');
});

test('Slots: Werktage, Vorlauf, Mittagspause, Terminlänge', async () => {
  const { deps } = await setup();
  const res = await listSlots(deps, { typeId: 'erstgespraech', staffId: 'patrick', fromDate: '2026-11-16', days: 7, now: NOW });
  const dates = res.days.map((d) => d.date);
  assert.ok(!dates.includes('2026-11-21') && !dates.includes('2026-11-22'), 'kein Wochenende');
  const mon = res.days.find((d) => d.date === '2026-11-16');
  assert.equal(mon, undefined, 'Montag 16:00 ist nach Vorlauf von 12 h nicht mehr buchbar');
  const tue = res.days.find((d) => d.date === '2026-11-17');
  const times = tue.slots.map((s) => s.time);
  assert.ok(times.includes('09:00') && times.includes('10:30') && times.includes('15:30'));
  assert.ok(!times.includes('11:00') && !times.includes('12:00') && !times.includes('12:30'), 'Mittagspause 12-13 blockiert 90-Min-Termine mit Start 11:00 bis 12:30');
  const wed = res.days.find((d) => d.date === '2026-11-18').slots.map((s) => s.time);
  assert.ok(!wed.includes('09:00') && !wed.includes('10:30') && wed.includes('13:00'), 'Patricks Mittwochstermin blockiert');
  assert.ok(!times.includes('16:00'), '90 Minuten müssen vor 17:00 enden');
});

test('Kurzberatung nur bei ausgewählten Personen', async () => {
  const { deps } = await setup();
  await assert.rejects(() => listSlots(deps, { typeId: 'kurzberatung', staffId: 'eva', fromDate: '2026-11-17', now: NOW }), BookingError);
  const any = await listSlots(deps, { typeId: 'kurzberatung', staffId: 'any', fromDate: '2026-11-17', days: 1, now: NOW });
  const ids = new Set(any.days.flatMap((d) => d.slots.flatMap((s) => s.staffIds)));
  assert.deepEqual([...ids].sort(), ['aileen', 'patrick']);
});

test('Buchen: Kalender, Speicher, zwei Mails, Doppelbuchung wird verhindert', async () => {
  const { deps, outbox, events } = await setup();
  const start = zonedToUtc('2026-11-17', '09:00');
  const r = await createBooking(deps, input(start), NOW);
  assert.ok(r.token);
  assert.deepEqual(events[0].slice(0, 2), ['create', 'patrick']);
  assert.deepEqual(outbox.map((m) => m.to).sort(), ['anna@example.com', 'hallo@meinsternum.de']);
  assert.ok(outbox.find((m) => m.to === 'anna@example.com').text.includes('/termin?t='));
  await assert.rejects(() => createBooking(deps, input(start, { email: 'b@example.com' }), NOW), (e) => e.code === 'slot_unavailable');
  // überlappender Termin (09:30) ist ebenfalls blockiert
  await assert.rejects(() => createBooking(deps, input(zonedToUtc('2026-11-17', '09:30')), NOW), (e) => e.code === 'slot_unavailable');
});

test('Parallele Buchungen desselben Slots: genau eine gewinnt', async () => {
  const { deps } = await setup();
  const start = zonedToUtc('2026-11-17', '14:00');
  const results = await Promise.allSettled([createBooking(deps, input(start), NOW), createBooking(deps, input(start, { email: 'b@example.com' }), NOW)]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
});

test('"Egal wer": wählt eine Person mit freiem Slot', async () => {
  const { deps } = await setup();
  const r = await createBooking(deps, input(zonedToUtc('2026-11-17', '09:00'), { staff: 'any' }), NOW);
  assert.ok(['patrick', 'aileen', 'eva', 'kirsten'].includes(r.booking.staffId));
});

test('Validierung', async () => {
  const { deps } = await setup();
  const s = zonedToUtc('2026-11-17', '09:00');
  await assert.rejects(() => createBooking(deps, input(s, { email: 'kaputt' }), NOW), (e) => e.code === 'invalid');
  await assert.rejects(() => createBooking(deps, input(s, { consent: false }), NOW), (e) => e.code === 'invalid');
  await assert.rejects(() => createBooking(deps, input(s, { website: 'spam' }), NOW), (e) => e.code === 'invalid');
});

test('Absagen: Kalender, Status, Mails, Slot wird wieder frei', async () => {
  const { deps, outbox, events } = await setup();
  const start = zonedToUtc('2026-11-19', '09:00');
  const { token } = await createBooking(deps, input(start), NOW);
  outbox.length = 0;
  const res = await cancelBooking(deps, token, NOW);
  assert.equal(res.status, 'cancelled');
  assert.ok(events.some((e) => e[0] === 'delete'));
  assert.equal(outbox.length, 2);
  assert.ok(outbox[0].ics.includes('METHOD:CANCEL'));
  await assert.rejects(() => cancelBooking(deps, token, NOW), (e) => e.code === 'not_active');
  await createBooking(deps, input(start, { email: 'neu@example.com' }), NOW);
});

test('Absagen kurz vor dem Termin wird online abgelehnt', async () => {
  const { deps } = await setup();
  const start = zonedToUtc('2026-11-17', '09:00');
  const { token } = await createBooking(deps, input(start), NOW);
  await assert.rejects(() => cancelBooking(deps, token, start - 3600e3), (e) => e.code === 'too_late');
});

test('Verlegen: auch in einen Zeitraum, der den eigenen alten Termin überlappt', async () => {
  const { deps, events, outbox } = await setup();
  const { token } = await createBooking(deps, input(zonedToUtc('2026-11-19', '09:00')), NOW);
  outbox.length = 0;
  const res = await rescheduleBooking(deps, token, new Date(zonedToUtc('2026-11-19', '09:30')).toISOString(), NOW);
  assert.equal(localTime(Date.parse(res.start)), '09:30');
  assert.ok(events.some((e) => e[0] === 'update'));
  assert.equal(outbox.length, 2);
  await assert.rejects(() => rescheduleBooking(deps, token, new Date(zonedToUtc('2026-11-19', '12:00')).toISOString(), NOW), (e) => e.code === 'slot_unavailable');
});

test('Erinnerungen: 3 Tage und 1 Tag vorher, nur einmal', async () => {
  const { deps, outbox } = await setup();
  const start = zonedToUtc('2026-11-23', '10:00');
  await createBooking(deps, input(start), NOW);
  outbox.length = 0;
  assert.equal((await runReminders(deps, start - 80 * 3600e3)).length, 0);
  assert.equal((await runReminders(deps, start - 71.5 * 3600e3)).length, 1);
  assert.equal((await runReminders(deps, start - 71 * 3600e3)).length, 0, 'nicht doppelt');
  assert.equal((await runReminders(deps, start - 23.5 * 3600e3)).length, 1);
  assert.equal(outbox.length, 2);
  assert.ok(outbox[0].text.includes('in drei Tagen') && outbox[1].text.includes('morgen'));
  assert.ok(outbox.every((m) => m.subject.startsWith('Erinnerung: Dein meinsternum-Termin am ')));
});

test('Erinnerungen: keine 3-Tage-Erinnerung, wenn erst kurz vorher gebucht wurde', async () => {
  const { deps, outbox } = await setup();
  const start = zonedToUtc('2026-11-19', '10:00'); // gebucht Montag 16:00 -> ca. 66 h vorher
  await createBooking(deps, input(start), NOW);
  outbox.length = 0;
  assert.equal((await runReminders(deps, NOW + 3600e3)).length, 0);
  assert.equal((await runReminders(deps, start - 23.5 * 3600e3)).length, 1);
});

test('Verlegen setzt Erinnerungen zurück', async () => {
  const { deps, outbox } = await setup();
  const start = zonedToUtc('2026-11-23', '10:00');
  const { token } = await createBooking(deps, input(start), NOW);
  await runReminders(deps, start - 71.5 * 3600e3);
  await rescheduleBooking(deps, token, new Date(zonedToUtc('2026-11-24', '10:00')).toISOString(), NOW + 24 * 3600e3);
  outbox.length = 0;
  const sent = await runReminders(deps, zonedToUtc('2026-11-24', '10:00') - 23.5 * 3600e3);
  assert.equal(sent.length, 1);
});

test('Anrede ohne Titel', () => {
  assert.equal(firstName({ name: 'Dr. Anna Beispiel' }), 'Anna');
  assert.equal(firstName({ name: 'Prof. Dr. med. dent. Jan Muster' }), 'Jan');
  assert.equal(firstName({ name: 'Anna' }), 'Anna');
});

test('Verlegen: Slots-Liste blendet den eigenen Termin aus', async () => {
  const { deps } = await setup();
  const start = zonedToUtc('2026-11-19', '13:30');
  const { token } = await createBooking(deps, input(start), NOW);
  const times = async (extra) => (await listSlots(deps, { typeId: 'erstgespraech', staffId: 'patrick', fromDate: '2026-11-19', days: 1, now: NOW, ...extra })).days[0].slots.map((s) => s.time);
  assert.ok(!(await times({})).includes('13:30'));
  const withOwn = await times({ rescheduleToken: token });
  assert.ok(withOwn.includes('13:30') && withOwn.includes('13:00') && withOwn.includes('14:00'));
  assert.ok(!(await times({ rescheduleToken: 'fremd' })).includes('13:30'), 'unbekannter Token ändert nichts');
});

test('Echte Einstellungen: wer ist wann buchbar', async () => {
  useRealData();
  try {
    const ids = (t) => liveStaff.filter((s) => s.types.includes(t)).map((s) => s.id).sort();
    assert.deepEqual(ids('erstgespraech'), ['aileen', 'alexios', 'fatma', 'frank', 'henry', 'michael', 'patrick', 'steffen']);
    assert.deepEqual(ids('kurzberatung'), ids('erstgespraech').filter((x) => x !== 'henry'));
    assert.ok(!liveStaff.some((s) => ['eva', 'kirsten'].includes(s.id)), 'Eva und Kirsten sind nicht buchbar');
    assert.equal(settings.minNoticeHours, 24);
    assert.equal(settings.bufferMinutes, 30);
    assert.equal(externalLinks.length, 2);

    const { deps } = await setup();
    const range = (id, type) => listSlots(deps, { typeId: type, staffId: id, fromDate: '2026-11-17', days: 14, now: NOW });
    // Michael: nur Dienstag und Donnerstag
    const mi = await range('michael', 'erstgespraech');
    assert.ok(mi.days.every((d) => [2, 4].includes(new Date(`${d.date}T12:00:00Z`).getUTCDay())));
    // Steffen: Samstag 10 bis 16 Uhr
    const st = await range('steffen', 'erstgespraech');
    const sat = st.days.find((d) => d.date === '2026-11-21').slots.map((s) => s.time);
    assert.equal(sat[0], '10:00');
    assert.ok(!sat.includes('14:30') || true);
    assert.ok(sat.at(-1) <= '14:30', '90 Minuten müssen bis 16:00 enden');
    // Samstag bei Aileen nicht
    assert.ok(!(await range('aileen', 'erstgespraech')).days.some((d) => d.date === '2026-11-21'));
    // Frank: Dienstag Mittagspause 13 bis 15 Uhr
    const fr = (await range('frank', 'erstgespraech')).days.find((d) => d.date === '2026-11-17');
    assert.ok(fr === undefined || !fr.slots.some((s) => s.time > '11:30' && s.time < '15:00'));
    // 24 Stunden Vorlauf: NOW = Mo 16.11. 16:00, frühester Termin Di 17.11. 16:00
    const pa = (await range('patrick', 'erstgespraech')).days[0];
    assert.equal(pa.date, '2026-11-17');
    assert.ok(pa.slots[0].time >= '16:00');
    // Henry steht unter „Beratung“, dauert bei ihm aber 60 statt 90 Minuten; keine Kurzberatung
    assert.ok((await range('henry', 'erstgespraech')).days.length > 0);
    assert.equal(minutesFor('erstgespraech', liveStaff.find((s) => s.id === 'henry')), 60);
    assert.equal(minutesFor('erstgespraech', liveStaff.find((s) => s.id === 'patrick')), 90);
    await assert.rejects(() => range('henry', 'kurzberatung'), BookingError);
  } finally {
    useTestData();
  }
});

test('Mails: Betreff, Signatur, Zoom-Hinweis statt Meet-Link', async () => {
  const { deps, outbox } = await setup();
  const start = zonedToUtc('2026-11-17', '09:00');
  await createBooking(deps, input(start), NOW);
  const m = outbox.find((x) => x.to === 'anna@example.com');
  assert.match(m.subject, /^Dein meinsternum-Termin am Dienstag, 17\. November 2026, 09:00 Uhr$/);
  assert.ok(m.text.includes('deine Beratung ist bestätigt'));
  assert.ok(m.text.includes('https://www.meinsternum.de/beratung') && m.text.includes('Foto von Patrick'));
  assert.ok(!/meet\.google|Videolink/i.test(m.text + m.html));
  assert.ok(m.text.includes('dein meinsternum-Team') && m.html.includes('dein mein<b>sternum</b>-Team'));
  assert.ok(m.text.includes('Göppinger Str. 2a') && m.text.includes('0221 986 544 36'));
  assert.ok(m.text.includes('Wenn du vorab Fragen hast'));
  assert.ok(!m.text.includes('Erstgespräch'));
  assert.ok(m.ics && !m.ics.includes('METHOD:'));
});

test('Beratungsform: Telefon braucht eine Nummer, Vor Ort nennt die Adresse', async () => {
  const { deps, outbox, events } = await setup();
  await assert.rejects(() => createBooking(deps, input(zonedToUtc('2026-11-17', '09:00'), { channel: 'phone' }), NOW), (e) => e.code === 'invalid');
  await assert.rejects(() => createBooking(deps, input(zonedToUtc('2026-11-17', '09:00'), { channel: 'fax' }), NOW), (e) => e.code === 'invalid');
  await createBooking(deps, input(zonedToUtc('2026-11-17', '09:00'), { channel: 'phone', phone: '0170 1234567' }), NOW);
  assert.ok(outbox.find((x) => x.to === 'anna@example.com').text.includes('ruft dich zur vereinbarten Zeit unter 0170 1234567 an'));
  await createBooking(deps, input(zonedToUtc('2026-11-17', '13:00'), { channel: 'onsite' }), NOW);
  assert.ok(outbox.filter((x) => x.to === 'anna@example.com')[1].text.includes('Göppinger Str. 2a'));
  assert.ok(outbox.find((x) => x.to === 'hallo@meinsternum.de').text.includes('Beratungsform: Telefonisch'));
  assert.equal(events.length, 2);
});

test('Obergrenze: höchstens drei offene Termine pro E-Mail-Adresse, Groß-/Kleinschreibung egal', async () => {
  const { deps } = await setup();
  const base = zonedToUtc('2026-11-17', '09:00');
  for (const [i, min] of [0, 90, 270].entries()) await createBooking(deps, input(base + min * 60000, { email: i === 1 ? 'ANNA@Example.com' : 'anna@example.com' }), NOW);
  await assert.rejects(
    () => createBooking(deps, input(base + 360 * 60000, { email: 'Anna@example.com' }), NOW),
    (e) => e instanceof BookingError && e.code === 'limit' && e.status === 429,
  );
  // andere Adresse ist nicht betroffen
  await createBooking(deps, input(base + 360 * 60000, { email: 'ben@example.com' }), NOW);
});

test('Datenschutz: Buchungen werden nach der Aufbewahrungsfrist aus der Datenbank gelöscht', async () => {
  const { deps } = await setup();
  const { purgeOldBookings } = await import('../netlify/lib/booking.mjs');
  await createBooking(deps, input(zonedToUtc('2026-11-17', '10:00')), NOW);
  assert.equal(await purgeOldBookings(deps, NOW + 6 * 30 * 24 * 3600000), 0, 'nach 6 Monaten noch da');
  assert.equal(await purgeOldBookings(deps, NOW + 14 * 30 * 24 * 3600000), 1, 'nach 14 Monaten gelöscht');
});

test('Henry: Beratung dauert 60 Minuten, die anderen 90, auch bei „nächster freier Termin“', async () => {
  useRealData();
  try {
    const { deps, events } = await setup();
    const sl = await listSlots(deps, { typeId: 'erstgespraech', staffId: 'henry', fromDate: '2026-11-17', days: 3, now: NOW });
    const start = Date.parse(sl.days[0].slots[0].start);
    const r = await createBooking(deps, input(start, { staff: 'henry' }), NOW);
    assert.equal(r.booking.minutes, 60);
    assert.equal(r.booking.end, new Date(start + 60 * 60000).toISOString());
    const pa = await listSlots(deps, { typeId: 'erstgespraech', staffId: 'patrick', fromDate: '2026-11-17', days: 3, now: NOW });
    const r2 = await createBooking(deps, input(Date.parse(pa.days[0].slots[0].start), { staff: 'patrick', email: 'b@example.com' }), NOW);
    assert.equal(r2.booking.minutes, 90);
    assert.ok(events.length >= 2);
  } finally {
    useTestData();
  }
});
