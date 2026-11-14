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

export type Foto = { name: string; datei: string; bild: ImageMetadata; alt: string };

const PATRICK = 'Patrick Senn, Gründer von MEIN STERNUM';
const TEAM = 'Team von MEIN STERNUM';

export const fotos = {
  'patrick-01-hoch': { name: 'patrick-01', datei: '2M3A9875.jpg (Zuschnitt 4:5)', bild: patrick01Hoch, alt: PATRICK },
  'patrick-02-hoch': { name: 'patrick-02', datei: '2M3A9881.jpg (Zuschnitt 4:5)', bild: patrick02Hoch, alt: PATRICK },
  'patrick-04-hoch': { name: 'patrick-04', datei: '2M3A0103.jpg (Zuschnitt 4:5)', bild: patrick04Hoch, alt: PATRICK },
  'schreibtisch-01': { name: 'schreibtisch-01', datei: '2M3A0116.jpg', bild: schreibtisch01, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'schreibtisch-01-hoch': { name: 'schreibtisch-01', datei: '2M3A0116.jpg (Zuschnitt 4:5)', bild: schreibtisch01Hoch, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'kollege-02': { name: 'kollege-02', datei: '2M3A0045.jpg', bild: kollege02, alt: 'Patrick Senn mit einem Teammitglied von MEIN STERNUM' },
  'team-02': { name: 'team-02', datei: 'IMG_9666.JPG', bild: team02, alt: TEAM },
  'gruppe-01': { name: 'gruppe-01', datei: '2M3A0052.jpg', bild: gruppe01, alt: TEAM },
  // Quadratische Kopf-Zuschnitte für den Kreis auf dem Handy (Gesicht mittig, Kopf nicht angeschnitten).
  'patrick-01-kreis': { name: 'patrick-01', datei: '2M3A9875.jpg (Zuschnitt Kopf 1:1)', bild: patrick01Kreis, alt: PATRICK },
  'patrick-02-kreis': { name: 'patrick-02', datei: '2M3A9881.jpg (Zuschnitt Kopf 1:1)', bild: patrick02Kreis, alt: PATRICK },
  'patrick-04-kreis': { name: 'patrick-04', datei: '2M3A0103.jpg (Zuschnitt Kopf 1:1)', bild: patrick04Kreis, alt: PATRICK },
  'schreibtisch-01-kreis': { name: 'schreibtisch-01', datei: '2M3A0116.jpg (Zuschnitt Kopf 1:1)', bild: schreibtisch01Kreis, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
} satisfies Record<string, Foto>;

// Passender Kreis-Zuschnitt zu einem Hochformat-Foto (für die Ratgeberseiten auf dem Handy).
export const kreisZu: Partial<Record<FotoKey, FotoKey>> = {
  'patrick-01-hoch': 'patrick-01-kreis',
  'patrick-02-hoch': 'patrick-02-kreis',
  'patrick-04-hoch': 'patrick-04-kreis',
  'schreibtisch-01-hoch': 'schreibtisch-01-kreis',
};

export type FotoKey = keyof typeof fotos;

// Feste Zuordnung Ratgeberseite -> Foto (Vorschlag aus foto-pool.md; Entscheidung Patrick 13.11.2026:
// Zuordnung hier statt im Frontmatter). Benachbarte Seiten (reihenfolge) haben unterschiedliche Fotos.
export const fotoJeSeite: Record<string, FotoKey> = {
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'patrick-01-hoch',
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'patrick-04-hoch',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'schreibtisch-01-hoch',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'patrick-02-hoch',
};
export const STANDARD_FOTO: FotoKey = 'patrick-01-hoch';
