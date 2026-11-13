// Ordnung der Ratgeberseiten: nach Thema gruppiert, Berufsphase als Hinweis je Seite.
// (Patrick, 13.11.2026: gemischte Gruppen aus Phase und Produkt wirkten unstimmig.)
// Alle Inhalte bleiben sichtbar im HTML, kein Aufklappen, kein Filter per Skript.
export const themen = [
  { id: 'berufsunfaehigkeit', titel: 'Berufsunfähigkeit', icon: 'schild' },
] as const;

export type ThemaId = (typeof themen)[number]['id'];

export const themaJeSeite: Record<string, ThemaId> = {
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'berufsunfaehigkeit',
};

// Berufsphase je Seite (Kennzeichnung auf der Karte).
export const phaseJeSeite: Record<string, string> = {
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'Studium und Berufsstart',
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'Jede Berufsphase',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'Jede Berufsphase',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'Jede Berufsphase',
};

export function gruppiere<T extends { id: string }>(seiten: T[]) {
  return themen
    .map((t) => ({ ...t, seiten: seiten.filter((s) => (themaJeSeite[s.id] ?? 'berufsunfaehigkeit') === t.id) }))
    .filter((t) => t.seiten.length > 0);
}
