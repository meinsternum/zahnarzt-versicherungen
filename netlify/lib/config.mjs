// Zentrale Einstellungen. Hier werden Terminarten, Personen und Zeiten gepflegt.
// ACHTUNG: Personen, Kalender-Adressen und Sprechzeiten sind Platzhalter und müssen von Patrick geprüft werden.
// Die echten Kalender-Adressen stehen NICHT im Code (öffentliches Repo), sondern in den Umgebungsvariablen STAFF_*_EMAIL.

export const TZ = 'Europe/Berlin';

export const settings = {
  notifyEmail: process.env.NOTIFY_EMAIL || 'hallo@meinsternum.de',
  minNoticeHours: 12, // frühestens so viele Stunden im Voraus buchbar
  maxDaysAhead: 60, // so weit im Voraus buchbar
  bufferMinutes: 0, // Puffer vor und nach jedem Termin
  changeDeadlineHours: 2, // Absagen/Verlegen online nur bis so viele Stunden vorher
  reminderHours: [72, 24], // E-Mail-Erinnerungen: 3 Tage und 1 Tag vorher
  // Adresse der Seite: SITE_URL, sonst die Adresse der letzten Anfrage (passt dann auch zu Vorschau-Adressen)
  get siteUrl() {
    return process.env.SITE_URL || origin;
  },
  bookPath: process.env.BOOK_PATH || '/termin-test/',
  managePath: process.env.MANAGE_PATH || '/termin-test/termin.html',
};

let origin = 'http://localhost:8888';
export function setOrigin(o) {
  origin = o;
}

export const appointmentTypes = {
  erstgespraech: {
    id: 'erstgespraech',
    title: 'Erstgespräch',
    minutes: 90,
    stepMinutes: 30,
    description: 'Kostenlos und unverbindlich. Wir klären deine Situation und besprechen die nächsten Schritte.',
  },
  kurzberatung: {
    id: 'kurzberatung',
    title: 'Kurzberatung',
    minutes: 15,
    stepMinutes: 15,
    description: 'Eine konkrete Frage kurz klären.',
  },
};

const weekdays = (from, to) => ({ 1: [[from, to]], 2: [[from, to]], 3: [[from, to]], 4: [[from, to]], 5: [[from, to]] });

// calendarId = Google-Kalender, dessen Termine blockieren und in den gebucht wird (normalerweise die Haupt-Adresse).
// types = welche Terminarten bei dieser Person buchbar sind.
export const staff = [
  {
    id: 'patrick',
    name: 'Patrick',
    email: process.env.STAFF_PATRICK_EMAIL || 'patrick@example.invalid',
    types: ['erstgespraech', 'kurzberatung'],
    hours: weekdays('09:00', '17:00'),
  },
  {
    id: 'aileen',
    name: 'Aileen',
    email: process.env.STAFF_AILEEN_EMAIL || 'aileen@example.invalid',
    types: ['erstgespraech', 'kurzberatung'],
    hours: weekdays('09:00', '17:00'),
  },
  {
    id: 'eva',
    name: 'Eva',
    email: process.env.STAFF_EVA_EMAIL || 'eva@example.invalid',
    types: ['erstgespraech'],
    hours: weekdays('09:00', '17:00'),
  },
  {
    id: 'kirsten',
    name: 'Kirsten',
    email: process.env.STAFF_KIRSTEN_EMAIL || 'kirsten@example.invalid',
    types: ['erstgespraech'],
    hours: weekdays('09:00', '17:00'),
  },
].map((s) => ({ ...s, calendarId: s.email }));

export const sourceOptions = [
  { id: '', label: 'Bitte auswählen (optional)' },
  { id: 'google', label: 'Google-Suche' },
  { id: 'ki', label: 'KI-Assistent (z. B. ChatGPT)' },
  { id: 'empfehlung', label: 'Empfehlung' },
  { id: 'social', label: 'LinkedIn, Instagram oder YouTube' },
  { id: 'sonstiges', label: 'Sonstiges' },
];
