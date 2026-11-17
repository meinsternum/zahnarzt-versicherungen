# Meilenstein 2: Startseite in zwei Varianten (Stand 13.11.2026)

Vorschau: https://entwurf-grundgeruest--zahnarzt-versicherungen.netlify.app/entwurf-a und /entwurf-b
Beide Seiten: `noindex, nofollow`, nicht in der Sitemap, nicht verlinkt. Gleiche Inhalte (src/lib/startseite.ts), gleiche Conversion-Logik.

- **A, ruhig und typografisch:** Heller Grund, große Überschrift mit Kontrast aus kräftig und leicht (wie die Wortmarke), Hochformat-Porträt im Hero, nummerierte Abschnitte mit feinen Linien. Wirkt wie ein sorgfältiger Ratgeber, Akzente nur über Teal.
- **B, Verlauf und Karten:** Hero im Navy-Teal-Verlauf aus dem Logo mit Porträt, Themenkarten mit Symbolen, getönter Ablauf als Zeitleiste, Team als Karte. Mehr Farbe und Fläche, klarer Markenauftritt.

## Aufbau (beide)
Hero (Satz für Antwortmaschinen, Foto, Termin-CTA, Bewertungszeile) → Fragen nach Berufsphase (Frage + vollständige Kurzantwort aus den Seiten) → So arbeiten wir → Wer wir sind (nur Über-uns-Text) → Häufige Fragen → Abschluss-CTA mit Bewertungszeile.

## Neue Texte zur Freigabe (auf der Seite gelb markiert)
1. Hero-Satz: „zahnarzt-versicherungen.de ist ein Ratgeber der MEIN STERNUM Finanzberatung GmbH aus Köln. Er beantwortet Fragen von Zahnärzt\*innen zur Absicherung, derzeit zur Berufsunfähigkeit, mit Quellen und dem Datum der letzten Prüfung.“
2. So arbeiten wir: Termin wählen / Gespräch / Empfehlung mit Begründung. Schritt 2 und 3 im Wortlaut der bisherigen Startseite. Platzhalter: Dauer und Kosten des Erstgesprächs; Form und Zeitpunkt der Empfehlung.
3. Häufige Fragen (4 Fragen), Antworten nur aus Über uns, bisheriger Startseite und Pflichthinweis. FAQPage-Schema stimmt mit dem sichtbaren Text überein.

Übernommen ohne Änderung: H1, Buttons, „Wer wir sind“ (Über-uns-Wortlaut), Abschlusstext, Kurzantworten der Ratgeberseiten.

## Fotos
| Stelle | A | B |
|---|---|---|
| Hero | patrick-04 (Zuschnitt 4:5) | patrick-05 (Zuschnitt 1:1) |
| So arbeiten wir | schreibtisch-01 | kollege-02 |
| Wer wir sind | team-02 | gruppe-01 |
Verkleinerte Kopien in src/assets/fotos (max. 2000 px), Ausgabe als AVIF/WebP. Die nicht gewählte Variante gibt ihre Fotos frei.

## Messung
Lokal (Lighthouse 12.8.2 mobil, 3 Läufe, Median, Preview-Messung):

| | Start vorher | Entwurf A | Entwurf B |
|---|---|---|---|
| Performance | 99 | 100 | 99 |
| Barrierefreiheit | 95 | 100 | 100 |
| SEO (nur noindex) | 69 | 69 | 69 |
| LCP | 1,58 s | 1,59 s | 1,59 s |
| CLS | 0 | 0 | 0 |
| Gewicht | 125 KB | 150 KB | 150 KB |

Netlify-Vorschau (PageSpeed Insights mobil, 3 Läufe, Median): vorher Start LCP 0,8 s, CLS 0; Entwurf A LCP 0,9 s, CLS 0,013; Entwurf B LCP 0,9 s, CLS 0,013 (ein Lauf 0,107). LCP-Element ist in beiden Entwürfen der Hero-Text, nicht das Foto.

Nebeneffekt der Einstellung „CSS inline“: Bestehende Startseite lokal LCP 1,43 s (vorher 1,58 s), Artikel 1,20 s (vorher 1,52 s).

## Risiken
- CLS auf Netlify schwankt leicht (0,013, ein Ausreißer 0,107 bei B). Vermutete Ursache: Schriftwechsel beim Laden von Inter. Gegenmittel in Meilenstein 3: die zwei wichtigsten Schriftschnitte vorladen und Ersatzschrift angleichen.
- Gewicht +25 KB durch Fotos (AVIF), unkritisch.
- Referenzseiten konnten nicht direkt geprüft werden (Freigabe-Abfragen nicht beantwortet).
