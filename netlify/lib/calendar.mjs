// Kalender-Anbindung. Live: Google Calendar über ein Dienstkonto mit domainweiter Delegation.
// Demo: simulierte Kalender, damit alles ohne Zugangsdaten ausprobiert werden kann.
import crypto from 'node:crypto';
import { TZ } from './config.mjs';
import { useGoogle } from './env.mjs';
import { zonedToUtc, weekdayOf, localDate, addDays } from './tz.mjs';

const API = 'https://www.googleapis.com/calendar/v3';

export function googleCalendar(credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  const creds = JSON.parse(credentialsJson);
  const clients = new Map();
  const clientFor = async (staff) => {
    if (!clients.has(staff.email)) {
      const { JWT } = await import('google-auth-library');
      clients.set(
        staff.email,
        new JWT({ email: creds.client_email, key: creds.private_key, scopes: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.freebusy'], subject: staff.email }),
      );
    }
    return clients.get(staff.email);
  };
  const req = async (staff, opts) => (await clientFor(staff)).request(opts);
  const cal = (staff) => `${API}/calendars/${encodeURIComponent(staff.calendarId)}`;

  return {
    async freeBusy(staff, fromMs, toMs) {
      const ids = [staff.calendarId, ...(staff.extraCalendars || [])];
      const res = await req(staff, {
        url: `${API}/freeBusy`,
        method: 'POST',
        data: { timeMin: new Date(fromMs).toISOString(), timeMax: new Date(toMs).toISOString(), timeZone: TZ, items: ids.map((id) => ({ id })) },
      });
      // Sicher statt großzügig: Ist ein Kalender nicht lesbar (z. B. Freigabe fehlt), wird die Person nicht angeboten, statt Zeiten zu verschenken.
      // Die Fehlermeldung nennt nur die Person und den Grund, keine Adressen.
      const busy = [];
      for (const id of ids) {
        const entry = res.data.calendars?.[id];
        if (!entry || entry.errors?.length) throw new Error(`freebusy_failed_${staff.id}${id === staff.calendarId ? '' : '_extra'}: ${entry?.errors?.[0]?.reason || 'no data'}`);
        busy.push(...entry.busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) })));
      }
      return busy;
    },
    async createEvent(staff, { summary, description, location, startMs, endMs }) {
      const res = await req(staff, {
        url: `${cal(staff)}/events?sendUpdates=none`,
        method: 'POST',
        data: {
          summary,
          description,
          ...(location ? { location } : {}),
          start: { dateTime: new Date(startMs).toISOString(), timeZone: TZ },
          end: { dateTime: new Date(endMs).toISOString(), timeZone: TZ },
        },
      });
      return { eventId: res.data.id };
    },
    async updateEvent(staff, eventId, { startMs, endMs }) {
      await req(staff, {
        url: `${cal(staff)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
        method: 'PATCH',
        data: { start: { dateTime: new Date(startMs).toISOString(), timeZone: TZ }, end: { dateTime: new Date(endMs).toISOString(), timeZone: TZ } },
      });
    },
    async deleteEvent(staff, eventId) {
      try {
        await req(staff, { url: `${cal(staff)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`, method: 'DELETE' });
      } catch (e) {
        const code = e?.response?.status;
        if (code !== 404 && code !== 410) throw e; // bereits gelöscht ist in Ordnung
      }
    },
  };
}

// Demo: jede Person hat werktags 12:00-13:00 Mittagspause, Patrick zusätzlich mittwochs 10:00-11:30 einen Fantasie-Termin.
export function demoCalendar() {
  return {
    async freeBusy(staff, fromMs, toMs) {
      const busy = [];
      let date = localDate(fromMs);
      const last = localDate(toMs);
      for (let guard = 0; date <= last && guard < 120; guard++, date = addDays(date, 1)) {
        const wd = weekdayOf(date);
        if (wd === 0 || wd === 6) continue;
        busy.push({ start: zonedToUtc(date, '12:00'), end: zonedToUtc(date, '13:00') });
        if (wd === 3 && staff.id === 'patrick') busy.push({ start: zonedToUtc(date, '10:00'), end: zonedToUtc(date, '11:30') });
      }
      return busy;
    },
    async createEvent(staff, ev) {
      console.log(`[demo-kalender] Termin angelegt bei ${staff.name}: ${ev.summary}`);
      return { eventId: `demo-${crypto.randomUUID()}` };
    },
    async updateEvent(staff, eventId) {
      console.log(`[demo-kalender] Termin verschoben bei ${staff.name}: ${eventId}`);
    },
    async deleteEvent(staff, eventId) {
      console.log(`[demo-kalender] Termin gelöscht bei ${staff.name}: ${eventId}`);
    },
  };
}

export function createCalendar() {
  return useGoogle() ? googleCalendar() : demoCalendar();
}
