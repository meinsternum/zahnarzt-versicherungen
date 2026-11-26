import { getDeps } from '../lib/runtime.mjs';
import { runReminders, purgeOldBookings } from '../lib/booking.mjs';

// Läuft stündlich (Netlify Scheduled Function).
export const config = { schedule: '@hourly' };

export default async function handler() {
  const sent = await runReminders(getDeps());
  console.log(`Erinnerungen versendet: ${sent.length}`);
  const removed = await purgeOldBookings(getDeps());
  if (removed) console.log(`Alte Buchungen gelöscht: ${removed}`);
}
