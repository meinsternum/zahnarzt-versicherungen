# Meilenstein 1: Analyse und Plan (Stand 13.11.2026)

Branch `entwurf-grundgeruest`, Ausgangscommit 8431a02. In diesem Meilenstein wurde kein Code geändert.

Gelesen: claude/regelwerk-inhalte.md, CI (Skill meinsternum-ci und CI-Abschnitt in uebergabe-landingpage-themenneutral.md), marketing-skill.md, seiten/seitenuebersicht.md, seiten/offene-entscheidungen.md, claude/foto-pool.md, Skill meinsternum-website-seo. Eine eigene Datei „Stilguide“ gibt es im Projekt nicht. Ich habe den CI-Skill und den CI-Abschnitt der Übergabedatei als Stilguide behandelt.

## 1. Seiten im Repo

| URL | Zweck | Status | Fehlt / Auffällig |
|---|---|---|---|
| `/` | Startseite | Vorschau | Hero ohne Foto; Phasen „Studium“ und „Niederlassung“ nur mit „folgt“; Ablauf-Schritte ohne Beleg aus Über-uns; Bewertungszeile erst im 2. Abschnitt |
| `/ratgeber` | Ratgeber-Übersicht | Vorschau | nur Fragenliste, keine Kurzantwort, keine Gruppierung nach Phase, keine Bewertungszeile, kein CTA |
| `/ratgeber/berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen` | Artikel, reihenfolge 1 | geprueft (nur Vorschau) | kein Inhaltsverzeichnis, keine Breadcrumbs, kein Foto aus dem Pool, Quellen ohne eigene Stand-Angabe, Bewertungszeile fehlt |
| `/ratgeber/berufsunfaehigkeit-zahnaerztin-berufsstart` | Artikel, 2 | geprueft | wie oben |
| `/ratgeber/berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen` | Artikel, 3 | geprueft | wie oben |
| `/ratgeber/berufsunfaehigkeit-teilweise-zahnaerzt-innen` | Artikel, 4 | geprueft | wie oben |
| `/ueber-uns` | Über uns | freigegeben | Teamfoto nicht aus dem Pool (team-meinsternum.webp), Alt-Text abweichend vom Pool |
| `/impressum`, `/datenschutz`, `/erstinformation` | Rechtstexte | entwurf (nur Vorschau), mit [PRÜFEN]-Markern | Inhalte entscheidet Patrick, werden nicht angefasst |
| `/robots.txt` | Crawler-Steuerung | | siehe Abschnitt 3 |

Fehlt komplett: 404-Seite, Kontakt (Navigationspunkt verlangt, keine Seite vorhanden), Breadcrumbs, „Zum Inhalt springen“, Open-Graph-Bild, Twitter-Card, Sitemap mit lastmod (wird derzeit bewusst nicht erzeugt, siehe 3), zentrale Konstante für die Termin-URL (steht heute fest in 4 Dateien), KI-Hinweis im Template (Regelwerk), Foto-Zuordnung je Seite.

## 2. Ist-Messung (lokale Preview-Messung)

Methode: Production-Build-Ausgabe von `entwurf-grundgeruest` lokal mit `astro preview` ausgeliefert, Lighthouse 12.8.2, mobil (Standard-Drosselung), drei Läufe, Median. Das ist keine Messung der Netlify-Vorschau: Netlify-URL ist mir nicht bekannt, und Netlify liefert komprimiert über CDN aus. Werte sind daher nur untereinander vergleichbar (vorher/nachher mit derselben Methode).

| | Startseite | Artikel (Versorgungswerk) |
|---|---|---|
| Performance | 99 | 100 |
| SEO | 69 | 69 |
| Barrierefreiheit | 95 | 95 |
| LCP | 1,58 s (Element: Text-Absatz im Hero) | 1,52 s (Text-Absatz) |
| CLS | 0,000 | 0,000 |
| TBT (Ersatz für INP) | 0 ms | 0 ms |
| Seitengewicht | 125 KB, 9 Anfragen | 126 KB, 9 Anfragen |
| H1 / H2 / H3 | 1 / 5 / 7 | 1 / 9 / 3 |
| Schema-Typen | WebSite, Organization (+Person, PostalAddress), ItemList | Article, FAQPage (3 Fragen), Organization, Person |

- SEO 69 kommt allein von `noindex` (in der Vorschau gewollt). Ohne diesen Punkt keine SEO-Fehler.
- Barrierefreiheit: (1) Linkfarbe Light Teal `#2791a3` hat auf Weiß/`#fafafb` nur 3,55–3,7:1, nötig sind 4,5:1. Betrifft alle Textlinks, auch Quellen. (2) Logo-Link: `aria-label` enthält den sichtbaren Text nicht in gleicher Form.
- INP kann ich im Labor nicht messen (Lighthouse-Navigation misst kein INP). Die Seite hat kein JavaScript, TBT 0 ms. Echte INP-Werte gibt es erst über Felddaten (Search Console, CrUX) nach dem Livegang.
- Fonts: lokal über @fontsource (Inter 300/400/600/700), keine externen Anfragen.

## 3. sitemap.xml und robots.txt

Ist:
- `indexierung.json` steht auf `erlaubt: false`. Folge: alle Seiten `noindex, nofollow`, keine Sitemap (Build-Warnung „No pages found“), robots.txt ohne Sitemap-Zeile. Das ist so gewollt bis zur Freigabe der Rechtstexte.
- robots.txt: `User-agent: *` / `Allow: /`. Keine eigenen Regeln für KI-Crawler, damit sind alle zugelassen.
- Wenn freigeschaltet: Sitemap über @astrojs/sitemap ohne lastmod.

KI-Crawler (Dokumentationen am 13.11.2026 per Websuche geprüft; die Seiten direkt aufzurufen war nicht möglich, weil die Freigabe für den Abruf nicht beantwortet wurde):

| Bot | Betreiber | Zweck | robots.txt laut Betreiber | Empfehlung |
|---|---|---|---|---|
| GPTBot | OpenAI | Training | wird beachtet | erlauben (Option sperren: kein Einfluss auf ChatGPT-Suche) |
| OAI-SearchBot | OpenAI | Suche in ChatGPT | wird beachtet | erlauben |
| ChatGPT-User | OpenAI | Abruf auf Nutzeranfrage | „may not apply“ | erlauben (Sperre wirkt laut OpenAI ohnehin nicht sicher) |
| ClaudeBot | Anthropic | Training | wird beachtet | erlauben (Option sperren: kein Einfluss auf Claude-Suche) |
| Claude-SearchBot | Anthropic | Suchindex | wird beachtet | erlauben |
| Claude-User | Anthropic | Abruf auf Nutzeranfrage | wird beachtet | erlauben |
| PerplexityBot | Perplexity | Suchindex, laut Perplexity kein Training | wird beachtet | erlauben |
| Perplexity-User | Perplexity | Abruf auf Nutzeranfrage | wird laut Perplexity in der Regel ignoriert | erlauben |
| Google-Extended | Google | Kein eigener Crawler, Steuer-Token: Gemini-Training und Grounding in Gemini-Apps/Vertex AI; kein Einfluss auf Google-Suche und AI Overviews | wird beachtet | erlauben, weil eine Sperre auch das Grounding in Gemini abschaltet (das ist Abruf, nicht nur Training) |

Risiken: (1) robots.txt ist eine Bitte, keine Sperre; nutzerinitiierte Abrufe (ChatGPT-User, Perplexity-User) halten sich nach Betreiberangabe nicht verlässlich daran. (2) Eine Trainings-Sperre wirkt nur für künftige Abrufe. (3) Eigene Gruppen pro Bot überschreiben die `*`-Gruppe: Wer später unter `*` etwas sperrt, muss es in jeder Bot-Gruppe wiederholen. (4) Alte Tokens (anthropic-ai, Claude-Web) wirken nicht mehr und kommen nicht in die Datei. (5) Bot-Namen ändern sich; Prüfung vor jedem Livegang. Vorschlag zur Umsetzung in Meilenstein 4: Bots explizit mit `Allow: /` aufführen (dokumentiert die Entscheidung), Sitemap-Zeile nur bei `erlaubt: true`.

## 4. Designreferenzen

Die fünf Seiten konnte ich nicht aufrufen (Abruf-Freigabe blieb unbeantwortet). Die Muster unten stützen sich nur auf die von dir genannten Merkmale. Wenn du die Abrufe freigibst, prüfe ich sie vor Meilenstein 2 nach.

| Referenz | Übertragbare Muster | Bewusst nicht übernommen |
|---|---|---|
| Mercury | große ruhige Typografie mit klarer Skala; viel Weißraum zwischen Abschnitten; zurückhaltende Farbflächen statt Effekten | Dunkelmodus, Produkt-Screenshots, Zahlenbanner |
| Attio | warme helle Flächen mit dezentem Verlauf; feine Kartenränder und klare Rasterkarten; ruhige Hover-/Fokus-Zustände | Logo-Wand, Produkt-UI, Video-Hero, scrollgesteuerte Animation |
| Ramp | Hero mit einer eindeutigen Aussage und einem Haupt-Button; Themenkarten mit Frage und Kurztext; CTA am Seitenende wiederholt | Zahlen- und Testimonial-Banner, App-Badges, Pop-ups |
| One Medical | echte Personen im Bild, warm ausgeleuchtet; klare Servicekarten mit kurzem Text; Vertrauensaufbau über Menschen statt Siegelwand | Mitglieds-Funnel, Chat-Widget, klinische Bildsprache |
| Maven Clinic | Zielgruppenführung nach Lebensphase; einladende Ansprache in der Headline; strukturierte Einstiege („für wen“) | Formular-Funnel, Pop-ups, Karussells mit Inhalten |

Geprüft gegen die Prioritäten: Alles in der rechten Spalte entfällt, weil es Inhalte versteckt, JS braucht, Gewicht erhöht oder unbelegte Zahlen bräuchte. Das Hero-Foto ist das größte Risiko für den LCP (siehe Risiken).

## 5. Umsetzungsplan

Meilenstein 2 (Startseite A/B):
- `src/pages/entwurf-a.astro`, `src/pages/entwurf-b.astro`: noindex, im Sitemap-Filter ausgeschlossen, nicht verlinkt.
- Neu: `src/lib/site.ts` (Konstante TERMIN_URL = https://meinsternum.de/online-buchen, Organisationsdaten aus dem Impressum), `src/lib/fotos.ts` (Pool-Katalog und feste Zuordnung Slug → Foto), `src/lib/phasen.ts` (Zuordnung Slug → Karrierephase), `src/components/Foto.astro` (astro:assets, AVIF/WebP, feste Seitenverhältnisse), `Bewertung.astro` überarbeitet.
- Fotos: nur die tatsächlich genutzten Pool-Fotos, vorab auf max. 2400 px verkleinert, nach `src/assets/fotos/`. Astro erzeugt beim Build AVIF/WebP (braucht `sharp` als Build-Abhängigkeit, kein Code im Browser).

Meilenstein 3 (nach deiner Wahl):
- `src/components/`: Header (sticky, mobil Menü über `<details>`, funktioniert ohne JS, Termin-Button immer sichtbar), Footer, Breadcrumbs, SkipLink, CtaBlock, Kurzantwort, Inhaltsverzeichnis (aus den H2 von `render()`, statisches HTML), Quellen, Verwandt, Pflichthinweis, KiHinweis, Icons (SVG).
- `src/layouts/Base.astro`: Header/Footer, Open Graph, Twitter-Card, JSON-LD-Bausteine aus `src/lib/schema.ts`.
- `src/pages/ratgeber/[slug].astro` (Artikel-Template), `src/pages/ratgeber/index.astro` (nach Phase mit Frage, Kurzantwort, Link), `src/pages/404.astro`, ggf. `src/pages/kontakt.astro`, `ueber-uns.astro` (Fotos aus dem Pool), `[recht].astro` nur Rahmen.
- `src/styles/global.css` neu gegliedert (Typo-Skala, Abstände, Karten, Bewegung mit `prefers-reduced-motion`). Optional ein Skript unter 1 KB für sanftes Einblenden; Inhalte sind ohne JS sichtbar.
- Markdown-Inhalte, Frontmatter, Slugs bleiben unverändert.

Meilenstein 4: Sitemap mit lastmod aus `stand`, robots.txt nach deiner Entscheidung, Schema (Organization, WebSite, BreadcrumbList, Article, FAQPage), Messung wie oben, Abschlussprüfung.

Reihenfolge: site.ts und Fotos zuerst (Grundlage), dann Startseiten-Varianten, dann Layout und Template, zuletzt Technik.

## 6. Risiken

1. LCP durch Hero-Foto: heute ist Text das LCP-Element (1,5 s). Ein Foto wird zum neuen LCP. Gegenmittel: AVIF in passenden Breiten, feste Maße, `fetchpriority="high"`, kein Lazy Loading im Hero. Wird in Meilenstein 2 gemessen; verschlechtert sich der LCP über 2,5 s, kommt das Foto neben statt hinter den Text.
2. Foto-Originale sind ca. 7 MB; ungeprüft eingecheckt würden sie das Repo aufblähen. Deshalb verkleinerte Kopien.
3. Light Teal als Linkfarbe verfehlt den Kontrast. Vorschlag: Textlinks in Teal `#31708f` (CI-Farbe, rechnerisch rund 5,5:1 auf Weiß), Light Teal nur für Flächen und große Elemente.
4. „So arbeiten wir“ soll nur aus der Über-uns-Seite kommen. Dort steht kein Ablauf. Die vier Schritte auf der heutigen Startseite haben keinen Beleg auf Über-uns. Folge: [PLATZHALTER], bis du einen Ablauf freigibst.
5. Phasen „Studium“ und „Niederlassung“ haben noch keine Seiten. Leere Karten wirken dünn; Vorschlag siehe offene Entscheidungen.
6. `datePublished`: Es gibt kein Feld dafür, nur `stand`. Beide Werte aus `stand` zu setzen wäre technisch möglich, aber fachlich ungenau.
7. Die Messung ist lokal, nicht auf Netlify (siehe 2).

## 7. Offene Entscheidungen für dich

1. robots.txt: Empfehlungen je Bot in Abschnitt 3 übernehmen? Insbesondere: Training (GPTBot, ClaudeBot, Google-Extended) erlauben oder sperren?
2. Kontakt: eigene Seite `/kontakt` (Telefon, E-Mail, Anschrift aus dem Impressum, Termin-Link) oder Navigationspunkt als Sprung zum Kontaktbereich auf Über uns?
3. Phasen: Zuordnung der vier BU-Seiten. Mein Vorschlag: Berufsstart → „Studium und Berufsstart“; Versorgungswerk, Rentenhöhe, Teilweise → phasenübergreifend „Berufsunfähigkeit“. Phasen ohne Seiten ausblenden statt „folgt“ zeigen?
4. „So arbeiten wir“: Platzhalter lassen oder einen Ablauf zur Freigabe liefern?
5. KI-Hinweis: Wortlaut „Mit KI-Unterstützung erstellt, redaktionell geprüft.“ so übernehmen (bis zu deiner rechtlichen Klärung)?
6. Foto-Zuordnung: statt neuem Frontmatter-Feld `foto` eine Zuordnungsdatei `src/lib/fotos.ts` (Slug → Foto, Vorschlag aus foto-pool.md). Damit bleibt das Frontmatter unverändert. Einverstanden?
7. `datePublished`: neues optionales Feld `veroeffentlicht` (nur Vorschlag) oder bis dahin weglassen?
8. Linkfarbe Teal statt Light Teal (Risiko 3)?
9. Netlify-Vorschau-URL nennen, dann messe ich Vorher/Nachher zusätzlich dort. Und: Abrufe der Referenzseiten und Bot-Dokumentationen freigeben, wenn du sie direkt geprüft haben willst.

## 8. Hinweis zu Regelkonflikten

- marketing-skill.md erlaubt „ich arbeite ausschließlich mit Ärzt*innen“, das Regelwerk verbietet die Aussage. Ich folge dem Regelwerk.
- Die Rechtstexte liegen als Entwurf mit Inhalt im Repo. „Rechtstexte [PLATZHALTER]“ setze ich so um, dass ich die vorhandenen Entwürfe nicht ändere und nur Rahmen, Navigation und Links baue.
