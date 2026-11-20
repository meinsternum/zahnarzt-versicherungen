// Zentrale Einstellungen. Hier werden Terminarten, Personen und Zeiten gepflegt.
// ACHTUNG: Personen, Kalender-Adressen und Sprechzeiten sind Platzhalter und müssen von Patrick geprüft werden.
// Die echten Kalender-Adressen stehen NICHT im Code (öffentliches Repo), sondern in den Umgebungsvariablen STAFF_*_EMAIL.

export const TZ = 'Europe/Berlin';

export const settings = {
  notifyEmail: process.env.NOTIFY_EMAIL || 'hallo@meinsternum.de',
  minNoticeHours: 24, // frühestens so viele Stunden im Voraus buchbar
  maxDaysAhead: 60, // so weit im Voraus buchbar
  bufferMinutes: 30, // Puffer vor und nach jedem Termin
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
  finanzierung: {
    id: 'finanzierung',
    title: 'Beratung zu Immobilienfinanzierung',
    minutes: 90,
    stepMinutes: 30,
    description: 'Beratung zur Finanzierung, zum Beispiel für Immobilie oder Praxis.',
  },
};

// Sprechzeiten wie in den Wix-Einstellungen (Stand 18.11.2026). Mehrere Zeitfenster pro Tag sind möglich.
// Ein Termin muss komplett in ein Zeitfenster passen.
const days = (list, ...windows) => Object.fromEntries(list.map((d) => [d, windows]));
const MO_FR = [1, 2, 3, 4, 5];

// calendarId = Google-Kalender, dessen Termine blockieren und in den gebucht wird (normalerweise die Haupt-Adresse).
// types = welche Terminarten bei dieser Person buchbar sind.
// Kirsten und Eva sind bewusst nicht buchbar und stehen deshalb nicht in der Liste.
export const staff = [
  { id: 'patrick', name: 'Patrick', types: ['erstgespraech', 'kurzberatung'], hours: { ...days([1], ['10:30', '21:30']), ...days([2, 3, 4, 5], ['10:00', '21:30']) } },
  { id: 'aileen', name: 'Aileen', types: ['erstgespraech', 'kurzberatung'], hours: days(MO_FR, ['10:00', '21:30']) },
  { id: 'michael', name: 'Michael', types: ['erstgespraech', 'kurzberatung'], hours: days([2, 4], ['10:30', '13:00'], ['17:00', '19:00']) },
  { id: 'steffen', name: 'Steffen', types: ['erstgespraech', 'kurzberatung'], hours: { ...days(MO_FR, ['08:00', '22:00']), ...days([6], ['10:00', '16:00']) } },
  {
    id: 'alexios',
    name: 'Alexios',
    types: ['erstgespraech', 'kurzberatung'],
    hours: { ...days([1, 3, 5], ['11:00', '20:30']), ...days([2, 4], ['11:00', '19:30']) },
  },
  { id: 'fatma', name: 'Fatma', types: ['erstgespraech', 'kurzberatung'], hours: days(MO_FR, ['11:00', '21:30']) },
  { id: 'frank', name: 'Frank', types: ['erstgespraech', 'kurzberatung'], hours: { ...days([2], ['11:00', '13:00'], ['15:00', '18:00']), ...days([5], ['11:00', '13:00'], ['15:00', '17:00']) } },
  // Henry berät nur zu Finanzierung: nur diese Terminart, nicht Erstgespräch oder Kurzberatung.
  { id: 'henry', name: 'Henry', types: ['finanzierung'], hours: days(MO_FR, ['11:00', '21:30']) },
].map((s) => ({
  ...s,
  // Kalender-Adresse je Person aus STAFF_<ID>_EMAIL (nicht im öffentlichen Code); ohne Eintrag eine ungültige Platzhalter-Adresse
  email: process.env[`STAFF_${s.id.toUpperCase()}_EMAIL`] || `${s.id}@example.invalid`,
  configured: Boolean(process.env[`STAFF_${s.id.toUpperCase()}_EMAIL`]),
}))
  .map((s) => ({ ...s, calendarId: s.email }));

// Externe Buchungsseiten (nicht Teil dieser Buchung), werden unter den Terminarten verlinkt.
export const externalLinks = [
  {
    title: 'Beratung zu bAV und bKV',
    description: 'Betriebliche Altersvorsorge und Krankenversicherung, Termin über einen externen Kalender.',
    url: 'https://meetings-eu1.hubspot.com/meetings/sebastian-dreschmann/sternum-link-arbeitgebergesprach?uuid=b674b0eb-1344-42f8-a7fc-67d31c7cd421',
  },
  {
    title: 'Beratung zu Steuern',
    description: 'Steuerberatung mit Gerrit, Termin über einen externen Kalender.',
    url: 'https://outlook.office365.com/owa/calendar/sternum@wilde-partner.de/bookings/',
  },
];

export const sourceOptions = [
  { id: '', label: 'Bitte auswählen (optional)' },
  { id: 'google', label: 'Google-Suche' },
  { id: 'ki', label: 'KI-Assistent (z. B. ChatGPT)' },
  { id: 'empfehlung', label: 'Empfehlung' },
  { id: 'social', label: 'LinkedIn, Instagram oder YouTube' },
  { id: 'sonstiges', label: 'Sonstiges' },
];
