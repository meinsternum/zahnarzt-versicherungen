import { TZ } from './config.mjs';

const fmtCache = new Map();
function fmt(tz) {
  if (!fmtCache.has(tz)) {
    fmtCache.set(
      tz,
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    );
  }
  return fmtCache.get(tz);
}

const pad = (n) => String(n).padStart(2, '0');

export function parts(ms, tz = TZ) {
  const o = {};
  for (const p of fmt(tz).formatToParts(new Date(ms))) if (p.type !== 'literal') o[p.type] = Number(p.value);
  if (o.hour === 24) o.hour = 0;
  return o;
}

export function tzOffsetMs(utcMs, tz = TZ) {
  const p = parts(utcMs, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(utcMs / 1000) * 1000;
}

// Ortszeit (Datum 'YYYY-MM-DD', Uhrzeit 'HH:MM') in Berlin -> UTC-Millisekunden
export function zonedToUtc(date, time, tz = TZ) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const t1 = guess - tzOffsetMs(guess, tz);
  return guess - tzOffsetMs(t1, tz);
}

export function localDate(ms, tz = TZ) {
  const p = parts(ms, tz);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function localTime(ms, tz = TZ) {
  const p = parts(ms, tz);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

export function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function formatDateDe(ms) {
  return new Intl.DateTimeFormat('de-DE', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ms));
}

export function formatDayShortDe(ms) {
  return new Intl.DateTimeFormat('de-DE', { timeZone: TZ, weekday: 'short', day: '2-digit', month: '2-digit' }).format(new Date(ms));
}

export function formatTimeDe(ms) {
  return `${localTime(ms)} Uhr`;
}
