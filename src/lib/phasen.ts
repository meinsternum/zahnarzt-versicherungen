// Ordnung der Ratgeberseiten: nach Thema gruppiert, Berufsphase als Hinweis je Seite.
// (Patrick, 13.11.2026: gemischte Gruppen aus Phase und Produkt wirkten unstimmig.)
// Dieselbe Ordnung speist Ratgeber-Übersicht, Startseite und das Mega-Menü.
// Themen ohne sichtbare Seite werden nirgends angezeigt (keine toten Links).
export const themen = [
  { id: 'berufsunfaehigkeit', titel: 'Berufsunfähigkeit', icon: 'schild' },
  { id: 'altersvorsorge', titel: 'Altersvorsorge', icon: 'sparen' },
  { id: 'krankenversicherung', titel: 'Krankenversicherung', icon: 'puls' },
  { id: 'berufshaftpflicht', titel: 'Berufshaftpflicht', icon: 'waage' },
  { id: 'praxisinhalt', titel: 'Praxisinhalt', icon: 'praxis' },
  { id: 'praxisausfall', titel: 'Praxisausfall', icon: 'uhr' },
] as const;

export type ThemaId = (typeof themen)[number]['id'];

export const themaJeSeite: Record<string, ThemaId> = {
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'berufsunfaehigkeit',
  'altersvorsorge-versorgungswerk-im-alter-zahnaerzt-innen': 'altersvorsorge',
  'krankengeld-luecke-zahnaerzt-innen': 'krankenversicherung',
  'berufshaftpflicht-pflicht-mindestsumme-zahnaerzt-innen': 'berufshaftpflicht',
  'praxisinhalt-was-gehoert-hinein-zahnaerzt-innen': 'praxisinhalt',
  'praxisinhalt-versicherungssumme-unterversicherung-zahnaerzt-innen': 'praxisinhalt',
  'praxisausfall-wann-zahlt-karenzzeit-leistungsdauer-zahnaerzt-innen': 'praxisausfall',
  'praxisausfall-tagessatz-fixkosten-zahnaerzt-innen': 'praxisausfall',
  'praxisausfall-oder-krankentagegeld-zahnaerzt-innen': 'praxisausfall',
};

// Kurze Bezeichnung je Seite für das Menü (Entwurf zur Freigabe, 14.11.2026).
// Fehlt ein Eintrag, zeigt das Menü den Seitentitel.
export const menueTitel: Record<string, string> = {
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'Reicht die BU-Rente des Versorgungswerks?',
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'Wann eine BU abschließen?',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'Wie hoch sollte die BU-Rente sein?',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'Nur noch teilweise arbeiten können',
  'altersvorsorge-versorgungswerk-im-alter-zahnaerzt-innen': 'Reicht das Versorgungswerk im Alter?',
  'krankengeld-luecke-zahnaerzt-innen': 'Krankengeld-Lücke für Angestellte',
  'berufshaftpflicht-pflicht-mindestsumme-zahnaerzt-innen': 'Pflicht und Mindestsumme',
  'praxisinhalt-was-gehoert-hinein-zahnaerzt-innen': 'Was gehört hinein?',
  'praxisinhalt-versicherungssumme-unterversicherung-zahnaerzt-innen': 'Versicherungssumme und Unterversicherung',
  'praxisausfall-wann-zahlt-karenzzeit-leistungsdauer-zahnaerzt-innen': 'Wann zahlt sie? Karenzzeit',
  'praxisausfall-tagessatz-fixkosten-zahnaerzt-innen': 'Tagessatz aus den Fixkosten',
  'praxisausfall-oder-krankentagegeld-zahnaerzt-innen': 'Praxisausfall oder Krankentagegeld?',
};

// Berufsphase je Seite (Kennzeichnung auf der Karte).
export const phaseJeSeite: Record<string, string> = {
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'Studium und Berufsstart',
  'krankengeld-luecke-zahnaerzt-innen': 'Angestellt',
  'berufshaftpflicht-pflicht-mindestsumme-zahnaerzt-innen': 'Jede Berufsphase',
  'praxisinhalt-was-gehoert-hinein-zahnaerzt-innen': 'Praxisgründung und eigene Praxis',
  'praxisinhalt-versicherungssumme-unterversicherung-zahnaerzt-innen': 'Praxisgründung und eigene Praxis',
  'praxisausfall-wann-zahlt-karenzzeit-leistungsdauer-zahnaerzt-innen': 'Praxisgründung und eigene Praxis',
  'praxisausfall-tagessatz-fixkosten-zahnaerzt-innen': 'Praxisgründung und eigene Praxis',
  'praxisausfall-oder-krankentagegeld-zahnaerzt-innen': 'Praxisgründung und eigene Praxis',
};

export function gruppiere<T extends { id: string }>(seiten: T[]) {
  return themen
    .map((t) => ({ ...t, seiten: seiten.filter((s) => (themaJeSeite[s.id] ?? 'berufsunfaehigkeit') === t.id) }))
    .filter((t) => t.seiten.length > 0);
}
