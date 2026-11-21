// Foto-Pool (claude/foto-pool.md). Nur echte Fotos, keine KI-Personen.
// Dateien in src/assets/fotos/ sind verkleinerte Kopien der Originale (max. 2000 px), teils im Zuschnitt 4:5.
// Astro erzeugt daraus beim Build AVIF/WebP in passenden Breiten.
import type { ImageMetadata } from 'astro';
import patrick01Hoch from '../assets/fotos/patrick-01-hoch.jpg';
import patrick02Hoch from '../assets/fotos/patrick-02-hoch.jpg';
import patrick04Hoch from '../assets/fotos/patrick-04-hoch.jpg';
import schreibtisch01 from '../assets/fotos/schreibtisch-01.jpg';
import schreibtisch01Hoch from '../assets/fotos/schreibtisch-01-hoch.jpg';
import kollege02 from '../assets/fotos/kollege-02.jpg';
import team02 from '../assets/fotos/team-02.jpg';
import gruppe01 from '../assets/fotos/gruppe-01.jpg';
import patrick01Kreis from '../assets/fotos/patrick-01-kreis.jpg';
import patrick02Kreis from '../assets/fotos/patrick-02-kreis.jpg';
import patrick04Kreis from '../assets/fotos/patrick-04-kreis.jpg';
import schreibtisch01Kreis from '../assets/fotos/schreibtisch-01-kreis.jpg';
// Zuschnitte vom 16.11.2026 (4:5 und Kopf 1:1)
import patrick03Hoch from '../assets/fotos/patrick-03-hoch.jpg';
import patrick03Kreis from '../assets/fotos/patrick-03-kreis.jpg';
import patrick05Hoch from '../assets/fotos/patrick-05-hoch.jpg';
import patrick05Kreis from '../assets/fotos/patrick-05-kreis.jpg';
import patrick06Hoch from '../assets/fotos/patrick-06-hoch.jpg';
import patrick06Kreis from '../assets/fotos/patrick-06-kreis.jpg';
import patrick07Hoch from '../assets/fotos/patrick-07-hoch.jpg';
import patrick07Kreis from '../assets/fotos/patrick-07-kreis.jpg';
import schreibtisch02Hoch from '../assets/fotos/schreibtisch-02-hoch.jpg';
import schreibtisch02Kreis from '../assets/fotos/schreibtisch-02-kreis.jpg';
import kollege01Hoch from '../assets/fotos/kollege-01-hoch.jpg';
import kollege01Kreis from '../assets/fotos/kollege-01-kreis.jpg';

export type Foto = { name: string; datei: string; bild: ImageMetadata; alt: string };

const PATRICK = 'Patrick Senn, Gründer von meinsternum';
const TEAM = 'Team von meinsternum';

export const fotos = {
  'patrick-01-hoch': { name: 'patrick-01', datei: '2M3A9875.jpg (Zuschnitt 4:5)', bild: patrick01Hoch, alt: PATRICK },
  'patrick-02-hoch': { name: 'patrick-02', datei: '2M3A9881.jpg (Zuschnitt 4:5)', bild: patrick02Hoch, alt: PATRICK },
  'patrick-04-hoch': { name: 'patrick-04', datei: '2M3A0103.jpg (Zuschnitt 4:5)', bild: patrick04Hoch, alt: PATRICK },
  'schreibtisch-01': { name: 'schreibtisch-01', datei: '2M3A0116.jpg', bild: schreibtisch01, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'schreibtisch-01-hoch': { name: 'schreibtisch-01', datei: '2M3A0116.jpg (Zuschnitt 4:5, mittig, 16.11.2026)', bild: schreibtisch01Hoch, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'kollege-02': { name: 'kollege-02', datei: '2M3A0045.jpg', bild: kollege02, alt: 'Patrick Senn mit einem Teammitglied von meinsternum' },
  'team-02': { name: 'team-02', datei: 'IMG_9666.JPG', bild: team02, alt: TEAM },
  'gruppe-01': { name: 'gruppe-01', datei: '2M3A0052.jpg', bild: gruppe01, alt: TEAM },
  // Quadratische Kopf-Zuschnitte für den Kreis auf dem Handy (Gesicht mittig, Kopf nicht angeschnitten).
  'patrick-01-kreis': { name: 'patrick-01', datei: '2M3A9875.jpg (Zuschnitt Kopf 1:1)', bild: patrick01Kreis, alt: PATRICK },
  'patrick-02-kreis': { name: 'patrick-02', datei: '2M3A9881.jpg (Zuschnitt Kopf 1:1)', bild: patrick02Kreis, alt: PATRICK },
  'patrick-04-kreis': { name: 'patrick-04', datei: '2M3A0103.jpg (Zuschnitt Kopf 1:1)', bild: patrick04Kreis, alt: PATRICK },
  'schreibtisch-01-kreis': { name: 'schreibtisch-01', datei: '2M3A0116.jpg (Zuschnitt Kopf 1:1)', bild: schreibtisch01Kreis, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'patrick-03-hoch': { name: 'patrick-03', datei: '2M3A9884.jpg (Zuschnitt 4:5)', bild: patrick03Hoch, alt: PATRICK },
  'patrick-03-kreis': { name: 'patrick-03', datei: '2M3A9884.jpg (Zuschnitt Kopf 1:1)', bild: patrick03Kreis, alt: PATRICK },
  'patrick-05-hoch': { name: 'patrick-05', datei: '2M3A0104.jpg (Zuschnitt 4:5)', bild: patrick05Hoch, alt: PATRICK },
  'patrick-05-kreis': { name: 'patrick-05', datei: '2M3A0104.jpg (Zuschnitt Kopf 1:1)', bild: patrick05Kreis, alt: PATRICK },
  'patrick-06-hoch': { name: 'patrick-06', datei: '2M3A0107.jpg (Zuschnitt 4:5)', bild: patrick06Hoch, alt: PATRICK },
  'patrick-06-kreis': { name: 'patrick-06', datei: '2M3A0107.jpg (Zuschnitt Kopf 1:1)', bild: patrick06Kreis, alt: PATRICK },
  'patrick-07-hoch': { name: 'patrick-07', datei: 'IMG_9670.JPG (Zuschnitt 4:5)', bild: patrick07Hoch, alt: PATRICK },
  'patrick-07-kreis': { name: 'patrick-07', datei: 'IMG_9670.JPG (Zuschnitt Kopf 1:1)', bild: patrick07Kreis, alt: PATRICK },
  'schreibtisch-02-hoch': { name: 'schreibtisch-02', datei: '2M3A0117.jpg (Zuschnitt 4:5)', bild: schreibtisch02Hoch, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'schreibtisch-02-kreis': { name: 'schreibtisch-02', datei: '2M3A0117.jpg (Zuschnitt Kopf 1:1)', bild: schreibtisch02Kreis, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'kollege-01-hoch': { name: 'kollege-01', datei: '2M3A0041.jpg (Zuschnitt 4:5)', bild: kollege01Hoch, alt: 'Patrick Senn mit einem Teammitglied von meinsternum' },
  'kollege-01-kreis': { name: 'kollege-01', datei: '2M3A0041.jpg (Zuschnitt Kopf 1:1)', bild: kollege01Kreis, alt: PATRICK },
} satisfies Record<string, Foto>;

// Passender Kreis-Zuschnitt zu einem Hochformat-Foto (für die Ratgeberseiten auf dem Handy).
export const kreisZu: Partial<Record<FotoKey, FotoKey>> = {
  'patrick-01-hoch': 'patrick-01-kreis',
  'patrick-02-hoch': 'patrick-02-kreis',
  'patrick-04-hoch': 'patrick-04-kreis',
  'schreibtisch-01-hoch': 'schreibtisch-01-kreis',
  'patrick-03-hoch': 'patrick-03-kreis',
  'patrick-05-hoch': 'patrick-05-kreis',
  'patrick-06-hoch': 'patrick-06-kreis',
  'patrick-07-hoch': 'patrick-07-kreis',
  'schreibtisch-02-hoch': 'schreibtisch-02-kreis',
  'kollege-01-hoch': 'kollege-01-kreis',
};

export type FotoKey = keyof typeof fotos;

// Feste Zuordnung Ratgeberseite -> Foto (Vorschlag aus foto-pool.md; Entscheidung Patrick 13.11.2026:
// Zuordnung hier statt im Frontmatter). Benachbarte Seiten (reihenfolge) haben unterschiedliche Fotos.
export const fotoJeSeite: Record<string, FotoKey> = {
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'patrick-01-hoch',
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'patrick-04-hoch',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'schreibtisch-01-hoch',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'patrick-02-hoch',
  'altersvorsorge-versorgungswerk-im-alter-zahnaerzt-innen': 'patrick-06-hoch',
  'krankengeld-luecke-zahnaerzt-innen': 'schreibtisch-02-hoch',
  'pkv-oder-gkv-wechsel-zahnaerzt-innen': 'patrick-03-hoch',
  'krankentagegeld-praxisinhaber-zahnaerzt-innen': 'patrick-06-hoch',
  'pkv-im-alter-beitraege-zahnaerzt-innen': 'kollege-01-hoch',
  'berufshaftpflicht-pflicht-mindestsumme-zahnaerzt-innen': 'kollege-01-hoch',
  'praxisinhalt-was-gehoert-hinein-zahnaerzt-innen': 'patrick-05-hoch',
  'praxisinhalt-versicherungssumme-unterversicherung-zahnaerzt-innen': 'patrick-07-hoch',
  'praxisausfall-oder-krankentagegeld-zahnaerzt-innen': 'patrick-03-hoch',
  'praxisausfall-wann-zahlt-karenzzeit-leistungsdauer-zahnaerzt-innen': 'schreibtisch-01-hoch',
  'praxisausfall-tagessatz-fixkosten-zahnaerzt-innen': 'patrick-01-hoch',
  // Rechtsschutz (17.11.2026): acht verschiedene Fotos; 70 und 78 teilen patrick-03 (nur acht Motive ohne Doppel 04/05 und 01/07).
  'rechtsschutz-welche-bausteine-zahnaerzt-innen': 'patrick-03-hoch',
  'rechtsschutz-oder-berufshaftpflicht-zahnaerzt-innen': 'kollege-01-hoch',
  'rechtsschutz-strafverfahren-zahnaerzt-innen': 'patrick-06-hoch',
  'rechtsschutz-kzv-wirtschaftlichkeitspruefung-zahnaerzt-innen': 'schreibtisch-02-hoch',
  'rechtsschutz-zahnarztpraxis-team-vermieter-vertraege': 'patrick-02-hoch',
  'rechtsschutz-praxisgruendung-uebernahme-bag-zahnaerzt-innen': 'schreibtisch-01-hoch',
  'rechtsschutz-angestellte-zahnaerzt-innen': 'patrick-04-hoch',
  'rechtsschutz-kammer-berufsrecht-approbation-zahnaerzt-innen': 'patrick-01-hoch',
  'rechtsschutz-wartezeit-wechsel-nachhaftung-zahnaerzt-innen': 'patrick-03-hoch',
  // Cyber (18.11.2026): sechs verschiedene Motive, kein patrick-03 auf 80 (78 hat es), 04/05 und 01/07 nicht gemeinsam.
  'cyberversicherung-zahnarztpraxis-braucht-man-das': 'kollege-01-hoch',
  'cyber-hackerangriff-zahnarztpraxis-erste-schritte-meldepflicht': 'schreibtisch-02-hoch',
  'cyber-obliegenheiten-it-sicherheitsrichtlinie-zahnarztpraxis': 'patrick-06-hoch',
  'cyber-was-zahlt-nicht-loesegeld-bussgeld-zahnarztpraxis': 'patrick-02-hoch',
  'cyber-datenleck-haftung-patienten-zahnarztpraxis': 'patrick-04-hoch',
  'cyber-betriebsunterbrechung-zahnarztpraxis-praxisausfall': 'schreibtisch-01-hoch',
  // Unfallversicherung (21.11.2026): fünf verschiedene Motive, 90 nicht kollege-01/schreibtisch-01 (Nachbarn 80, 85).
  'unfallversicherung-zahnaerzt-innen-braucht-man-das': 'patrick-03-hoch',
  'unfallversicherung-bgw-freiwillig-praxisinhaber-zahnaerzt-innen': 'schreibtisch-02-hoch',
  'unfallversicherung-gliedertaxe-hand-finger-zahnaerzt-innen': 'patrick-06-hoch',
  'unfallversicherung-nadelstich-infektion-zahnaerzt-innen': 'patrick-02-hoch',
  'unfallversicherung-fristen-invaliditaet-zahnaerzt-innen': 'patrick-05-hoch',
};
export const STANDARD_FOTO: FotoKey = 'patrick-01-hoch';
