// Foto-Pool (claude/foto-pool.md). Nur echte Fotos, keine KI-Personen.
// Dateien in src/assets/fotos/ sind verkleinerte Kopien der Originale (max. 2000 px).
// Astro erzeugt daraus beim Build AVIF/WebP in passenden Breiten.
import type { ImageMetadata } from 'astro';
import patrick04Hoch from '../assets/fotos/patrick-04-hoch.jpg';
import patrick05Quadrat from '../assets/fotos/patrick-05-quadrat.jpg';
import schreibtisch01 from '../assets/fotos/schreibtisch-01.jpg';
import kollege02 from '../assets/fotos/kollege-02.jpg';
import team02 from '../assets/fotos/team-02.jpg';
import gruppe01 from '../assets/fotos/gruppe-01.jpg';

export type Foto = { name: string; datei: string; bild: ImageMetadata; alt: string };

const PATRICK = 'Patrick Senn, Gründer von MEIN STERNUM';
const TEAM = 'Team von MEIN STERNUM';

export const fotos = {
  'patrick-04-hoch': { name: 'patrick-04', datei: '2M3A0103.jpg (Zuschnitt 4:5)', bild: patrick04Hoch, alt: PATRICK },
  'patrick-05-quadrat': { name: 'patrick-05', datei: '2M3A0104.jpg (Zuschnitt 1:1)', bild: patrick05Quadrat, alt: PATRICK },
  'schreibtisch-01': { name: 'schreibtisch-01', datei: '2M3A0116.jpg', bild: schreibtisch01, alt: 'Patrick Senn bei der Arbeit am Schreibtisch' },
  'kollege-02': { name: 'kollege-02', datei: '2M3A0045.jpg', bild: kollege02, alt: 'Patrick Senn mit einem Teammitglied von MEIN STERNUM' },
  'team-02': { name: 'team-02', datei: 'IMG_9666.JPG', bild: team02, alt: TEAM },
  'gruppe-01': { name: 'gruppe-01', datei: '2M3A0052.jpg', bild: gruppe01, alt: TEAM },
} satisfies Record<string, Foto>;

export type FotoKey = keyof typeof fotos;

// Feste Zuordnung Ratgeberseite -> Foto (Vorschlag aus foto-pool.md, Entscheidung Patrick 13.11.2026:
// Zuordnung hier statt im Frontmatter). Wird in Meilenstein 3 mit den Artikelfotos gefüllt.
export const fotoJeSeite: Record<string, string> = {
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': 'patrick-01',
  'berufsunfaehigkeit-zahnaerztin-berufsstart': 'patrick-04',
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': 'schreibtisch-01',
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': 'patrick-02',
};
