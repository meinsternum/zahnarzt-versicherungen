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
