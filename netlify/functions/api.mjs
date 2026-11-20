import { getDeps } from '../lib/runtime.mjs';
import { BookingError, publicConfig, listSlots, createBooking, getBooking, cancelBooking, rescheduleBooking, runReminders } from '../lib/booking.mjs';
import { setOrigin } from '../lib/config.mjs';
import { useGoogle, testMode } from '../lib/env.mjs';

export const config = { path: '/api/*' };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

async function body(req) {
  try {
    return await req.json();
  } catch {
    throw new BookingError('invalid', 'Ungültige Anfrage');
  }
}

export default async function handler(req) {
  const url = new URL(req.url);
  setOrigin(url.origin);
  const route = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
  try {
    if (req.method === 'GET' && route === 'config') return json({ ...publicConfig(), testMode: testMode() });
    const deps = getDeps();
    if (req.method === 'GET' && route === 'slots') {
      const q = url.searchParams;
      return json(await listSlots(deps, { typeId: q.get('type'), staffId: q.get('staff') || 'any', fromDate: q.get('from'), days: q.get('days'), rescheduleToken: q.get('reschedule') }));
    }
    if (req.method === 'GET' && route === 'booking') return json(await getBooking(deps, url.searchParams.get('t')));
    if (req.method === 'POST' && route === 'book') return json(await createBooking(deps, await body(req)), 201);
    if (req.method === 'POST' && route === 'cancel') return json({ booking: await cancelBooking(deps, (await body(req)).t) });
    if (req.method === 'POST' && route === 'reschedule') {
      const b = await body(req);
      return json({ booking: await rescheduleBooking(deps, b.t, b.start) });
    }
    if (req.method === 'POST' && route === 'dev/run-reminders' && !useGoogle()) return json({ sent: await runReminders(deps) });
    return json({ error: 'not_found', message: 'Nicht gefunden' }, 404);
  } catch (e) {
    if (e instanceof BookingError) return json({ error: e.code, message: e.message }, e.status);
    console.error(e);
    return json({ error: 'server_error', message: 'Es ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.' }, 500);
  }
}
