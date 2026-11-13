// Zuordnung der Ratgeberseiten zu Themengruppen (Entscheidung Patrick 13.11.2026).
// Gruppen ohne sichtbare Seite werden nicht angezeigt.
export const phasen = [
  { id: 'studium-berufsstart', titel: 'Studium und Berufsstart', icon: 'start' },
  { id: 'berufsunfaehigkeit', titel: 'Berufsunfähigkeit in jeder Berufsphase', icon: 'schild' },
  { id: 'niederlassung', titel: 'Niederlassung', icon: 'praxis' },
] as const;

export type PhaseId = (typeof phasen)[number]['id'];

export const phaseJeSeite: Record<string, PhaseId> = {
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'studium-berufsstart',
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'berufsunfaehigkeit',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'berufsunfaehigkeit',
};

export function gruppiere<T extends { id: string }>(seiten: T[]) {
  return phasen
    .map((p) => ({ ...p, seiten: seiten.filter((s) => (phaseJeSeite[s.id] ?? 'berufsunfaehigkeit') === p.id) }))
    .filter((p) => p.seiten.length > 0);
}
