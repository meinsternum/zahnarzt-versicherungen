# Meilenstein 3: Navigation, Footer, Template, Seiten (Stand 13.11.2026)

Freigegeben von Patrick (13.11.2026): Startseite nach Entwurf A, vier BU-Seiten, Ratgeber-Übersicht, Über uns, Kontakt (neu), 404, Rahmen der Rechtstexte.

## Geändert
- Layout `src/layouts/Base.astro`: sticky Kopf (Startseite, Ratgeber, Über uns, Kontakt, Termin buchen), mobiles Menü ohne JS (`<details>`), „Zum Inhalt springen“, aktive Seite markiert, Brotkrumen mit BreadcrumbList-Schema, Fuß mit Kontakt, Seitenlinks, Pflichthinweis, KI-Hinweis (klein). Twitter-Card, og:site_name, Schriften 400/700 vorgeladen, Ersatzschrift an Inter angeglichen (gegen Layoutsprung).
- Startseite `src/pages/index.astro` (Entwurf A), Entwurfsseiten entfernt.
- Ratgeber-Übersicht: nach Thema, mit Phase, Frage, Kurzantwort, Link, CTA-Block mit Bewertungen.
- Artikel-Template: Phase, H1, „Kurz gesagt“-Block, Stand-Zeile mit Autor, Foto, Inhaltsverzeichnis (sticky am Desktop), Text unverändert, [GRAFIK-PLATZHALTER] (nur Vorschau), Häufige Fragen, Quellen mit URL und Stand, CTA-Block mit Bewertungen, verwandte Fragen. Schema: Article (dateModified aus stand, citation aus quellen), Organization, Person, FAQPage, BreadcrumbList.
- Über uns: Texte unverändert, Fotos aus dem Pool (patrick-01, team-02).
- Neu: /kontakt (ContactPage), 404 mit Themenlinks.
- Rechtstexte: nur Rahmen und Brotkrumen, Inhalt unverändert.
- Gelöscht: src/styles/global.css, src/components/Bewertung.astro, public/bilder/*.webp (ersetzt durch Pool-Fotos).
- Sitemap-Filter schließt /404 und /entwurf-* aus.

## Fotos je Seite
| Seite | Foto |
|---|---|
| Startseite | patrick-04 (Hero), kollege-02 (So arbeiten wir), team-02 (Wer wir sind) |
| BU Versorgungswerk | patrick-01 |
| BU Berufsstart | patrick-04 |
| BU Rentenhöhe | schreibtisch-01 |
| BU Teilweise | patrick-02 |
| Über uns | patrick-01, team-02 |

## Neue Texte zur Freigabe
- Startseite Meta-Beschreibung: „Antworten auf Versicherungsfragen von Zahnärzt*innen, mit Quellen und Stand. Ein Ratgeber der MEIN STERNUM Finanzberatung GmbH aus Köln.“
- Kontakt: Einleitung (Termin, kostenlos, etwa eine Stunde, Zoom/Telefon/Köln), Meta-Beschreibung.
- 404: „Diese Adresse gibt es nicht oder nicht mehr. Vielleicht findest du deine Frage hier:“
- Artikel: Label „Kurz gesagt“, Bildunterschrift „Patrick Senn schreibt und verantwortet die Texte auf dieser Seite.“ (Wortlaut Über uns), Satz unter den Quellen.

## Prüfung
12 Seiten bei 1440/768/390, mit und ohne JS: kein Überlauf, keine Konsolenfehler, alle Inhalte sichtbar, je ein H1, keine Sprünge in der Überschriftenfolge, kein toter interner Link oder Anker, JSON-LD gültig. Inhalte in src/content unverändert.
Lighthouse lokal mobil (3 Läufe, Median): Start 100/100 Barrierefreiheit, LCP 1,60 s, CLS 0; Artikel 100/100, LCP 1,43 s (vorher 1,52 s); Ratgeber 100/100, LCP 1,43 s. SEO 69 nur wegen noindex in der Vorschau.

## Offen
- WhatsApp-Nummer und Profil-Links (LinkedIn, Instagram, ggf. weitere): in src/lib/site.ts eintragen, erscheinen dann im Fuß, auf /kontakt und im Schema (sameAs).
- Grafik je Artikel: kommt aus dem Inhalts-Chat.
- KI-Hinweis: Wortlaut vorläufig.
