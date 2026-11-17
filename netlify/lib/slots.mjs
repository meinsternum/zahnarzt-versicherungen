import { settings, staff as allStaff, appointmentTypes } from './config.mjs';
import { zonedToUtc, addDays, weekdayOf } from './tz.mjs';

export function staffForType(typeId) {
  return allStaff.filter((s) => s.types.includes(typeId));
}

/**
 * Berechnet freie Startzeiten.
 * getBusy(staff, fromMs, toMs) -> [{start, end}] in UTC-Millisekunden
 * ignore: {staffId, start, end} blendet einen bestehenden Termin aus (beim Verlegen)
 * Rückgabe: [{start, end, staffIds}] sortiert, start/end in UTC-Millisekunden
 */
export async function computeSlots({ typeId, staffId = 'any', fromDate, days = 14, now = Date.now(), getBusy, ignore = null }) {
  const type = appointmentTypes[typeId];
  if (!type) throw new Error('unknown_type');
  const candidates = staffForType(typeId).filter((s) => staffId === 'any' || s.id === staffId);

  const earliest = now + settings.minNoticeHours * 3600e3;
  const latest = now + settings.maxDaysAhead * 86400e3;
  const rangeStart = zonedToUtc(fromDate, '00:00');
  const rangeEnd = zonedToUtc(addDays(fromDate, days), '00:00');
  const buf = settings.bufferMinutes * 60e3;
  const dur = type.minutes * 60e3;
  const step = type.stepMinutes * 60e3;
  const bySlot = new Map();

  for (const s of candidates) {
    let busy = await getBusy(s, rangeStart - buf, rangeEnd + buf);
    if (ignore && ignore.staffId === s.id) busy = busy.filter((b) => !(b.start === ignore.start && b.end === ignore.end));
    for (let i = 0; i < days; i++) {
      const date = addDays(fromDate, i);
      for (const [from, to] of s.hours[weekdayOf(date)] || []) {
        const ws = zonedToUtc(date, from);
        const we = zonedToUtc(date, to);
        for (let t = ws; t + dur <= we; t += step) {
          if (t < earliest || t > latest) continue;
          if (busy.some((b) => t - buf < b.end && t + dur + buf > b.start)) continue;
          if (!bySlot.has(t)) bySlot.set(t, []);
          bySlot.get(t).push(s.id);
        }
      }
    }
  }
  return [...bySlot.entries()].sort((a, b) => a[0] - b[0]).map(([start, staffIds]) => ({ start, end: start + dur, staffIds }));
}
