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
  bookPath: process.env.BOOK_PATH || '/termin-test',
  managePath: process.env.MANAGE_PATH || '/termin-test/termin',
};

let origin = 'http://localhost:8888';
export function setOrigin(o) {
  origin = o;
}

// Beratungsformen, die Kund*innen bei der Buchung wählen. „online“ läuft über den persönlichen Zoom-Raum der Person
// (Zugang über das Foto auf meinsternum.de/beratung), nicht über einen Meet-Link.
export const channels = {
  online: { id: 'online', label: 'Online per Zoom', short: 'Zoom' },
  phone: { id: 'phone', label: 'Telefonisch', short: 'Telefon' },
  onsite: { id: 'onsite', label: 'Vor Ort im Kölner Büro', short: 'Vor Ort' },
};
export const office = {
  company: 'MEIN STERNUM Finanzberatung GmbH',
  street: 'Göppinger Str. 2a',
  zip: '50739',
  city: 'Köln',
  phone: '0221 986 544 36',
  email: 'hallo@meinsternum.de',
  web: 'https://www.meinsternum.de',
  zoomPage: 'https://www.meinsternum.de/beratung',
  // Pflichtangaben für Geschäftsbriefe (aus dem Impressum, Stand 25.11.2026)
  legal: 'Geschäftsführer: Patrick Senn · Amtsgericht Köln, HRB 84954',
};

export const appointmentTypes = {
  // Die Kennung bleibt „erstgespraech“ (steht in bestehenden Buchungen); für Kund*innen heißt der Termin „Beratung“,
  // weil er auch als Folgetermin für Bestandskund*innen genutzt wird.
  erstgespraech: {
    id: 'erstgespraech',
    title: 'Beratung',
    minutes: 90,
    stepMinutes: 30,
    description: 'Wir klären, was für dich gerade wichtig ist: Versicherungen, Finanzen oder Vorsorge.',
  },
  kurzberatung: {
    id: 'kurzberatung',
    title: 'Kurzberatung',
    minutes: 15,
    stepMinutes: 15,
    description: 'Klarheit in 15 Minuten: Deine Frage, klare Antwort. Orientierung statt Grübeln.',
  },
  finanzierung: {
    id: 'finanzierung',
    title: 'Beratung zu Immobilienfinanzierung',
    minutes: 60,
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
  { id: 'patrick', blurb: 'Beratung zu Versicherungen und Geldanlage in ETFs und Investmentfonds, sowie Jahresupdate.', name: 'Patrick', types: ['erstgespraech', 'kurzberatung'], hours: { ...days([1], ['10:30', '21:30']), ...days([2, 3, 4, 5], ['10:00', '21:30']) } },
  { id: 'aileen', blurb: 'Beratung zu Versicherungen und Immobilien zur Kapitalanlage.', name: 'Aileen', types: ['erstgespraech', 'kurzberatung'], hours: days(MO_FR, ['10:00', '21:30']) },
  { id: 'michael', blurb: 'Beratung zu Versicherungen und zu deiner Niederlassung.', name: 'Michael', types: ['erstgespraech', 'kurzberatung'], hours: days([2, 4], ['10:30', '13:00'], ['17:00', '19:00']) },
  { id: 'steffen', blurb: 'Beratung zu sämtlichen Versicherungen und ETFs & Investmentfonds.', name: 'Steffen', types: ['erstgespraech', 'kurzberatung'], hours: { ...days(MO_FR, ['08:00', '22:00']), ...days([6], ['10:00', '16:00']) } },
  {
    id: 'alexios',
    blurb: 'Beratung zu sämtlichen Versicherungen.',
    name: 'Alexios',
    types: ['erstgespraech', 'kurzberatung'],
    hours: { ...days([1, 3, 5], ['11:00', '20:30']), ...days([2, 4], ['11:00', '19:30']) },
  },
  { id: 'fatma', blurb: 'Beratung zu sämtlichen Versicherungen.', name: 'Fatma', types: ['erstgespraech', 'kurzberatung'], hours: days(MO_FR, ['11:00', '21:30']) },
  { id: 'frank', blurb: 'Beratung zu Geldanlage, Immobilien-Kapitalanlage, Photovoltaik-Investments und Versicherungen.', name: 'Frank', types: ['erstgespraech', 'kurzberatung'], hours: { ...days([2], ['11:00', '13:00'], ['15:00', '18:00']), ...days([5], ['11:00', '13:00'], ['15:00', '17:00']) } },
  // Henry berät nur zu Finanzierung: nur diese Terminart, nicht Erstgespräch oder Kurzberatung.
  { id: 'henry', blurb: 'Henry hilft dir bei deinen Fragen zur Immobilienfinanzierung.', name: 'Henry', types: ['finanzierung'], hours: days(MO_FR, ['11:00', '21:30']) },
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
    description: 'Sebastian & Christoph helfen bei betrieblicher Altersvorsorge und betrieblicher Krankenversicherung für die Arztpraxis.',
    photo: '/termin-test/fotos/gfbv.jpg',
    url: 'https://meetings-eu1.hubspot.com/meetings/sebastian-dreschmann/sternum-link-arbeitgebergesprach?uuid=b674b0eb-1344-42f8-a7fc-67d31c7cd421',
  },
  {
    title: 'Beratung zu Steuern',
    description: 'Gerrit hilft dir bei steuerlichen Fragen. Als externer Kooperationspartner berät er viele unserer Kund*innen.',
    photo: '/termin-test/fotos/gerrit.jpg',
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
