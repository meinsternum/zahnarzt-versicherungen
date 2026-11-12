# zahnarzt-versicherungen.de

Statische Seite (Astro), Hosting über Netlify, Inhalte als Markdown in `src/content/`.

- Inhalte: `src/content/situationen/*.md` (Frontmatter `status: entwurf | freigegeben`)
- Entwürfe erscheinen nur in Deploy-Vorschauen, nie in der Produktion.
- Produktions-Build bricht ab, wenn eine freigegebene Seite noch `[PRÜFEN` enthält.
- Rechtstexte: `src/content/rechtliches/` (ebenfalls erst live, wenn `freigegeben`).
- Cookie-Banner: Script-URL in `src/components/CookieBanner.astro` eintragen.

## Frage → Seite (jede Frage genau einer Seite)
- Wann BU abschließen? → /ratgeber/berufsunfaehigkeit-zahnaerztin-berufsstart
- Reicht die BU-Rente des Versorgungswerks? → /ratgeber/berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen
- Wie hoch sollte die BU-Rente sein? → /ratgeber/berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen

## Indexierung
`indexierung.json` steuert noindex, Sitemap und robots.txt. Solange `erlaubt: false`, ist die Live-Seite nicht indexierbar.

## Vor dem Livegang prüfen
- `indexierung.json`: `erlaubt` erst auf `true`, wenn Impressum, Datenschutz, Erstinformation freigegeben und alle Seiten geprüft sind.
- Produktions-Build lokal testen: `CONTEXT=production npm run build`, dann Canonical (zahnarzt-versicherungen.de), robots-Meta, Sitemap, robots.txt prüfen.
- Vorschau-Domain (netlify.app) ist immer noindex und darf nirgends fest im Code stehen (Links sind relativ, Canonical zeigt auf die Hauptdomain).
- Google-Bewertung: Werte in `src/lib/bewertung.ts` mit dem aktuellen Profil abgleichen, Beleg in `belege/` aktualisieren.
- Seiten mit Status `geprueft` sind nur in der Vorschau sichtbar, live erst mit `freigegeben`.
