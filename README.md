# zahnarzt-versicherungen.de

Statische Seite (Astro), Hosting über Netlify, Inhalte als Markdown in `src/content/`.

- Inhalte: `src/content/situationen/*.md` (Frontmatter `status: entwurf | freigegeben`)
- Entwürfe erscheinen nur in Deploy-Vorschauen, nie in der Produktion.
- Produktions-Build bricht ab, wenn eine freigegebene Seite noch `[PRÜFEN` enthält.
- Rechtstexte: `src/content/rechtliches/` (ebenfalls erst live, wenn `freigegeben`).
- Cookie-Banner: Script-URL in `src/components/CookieBanner.astro` eintragen.
