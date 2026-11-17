# Terminbuchung (Test)

Eigene Online-Terminbuchung als Ersatz für die Wix-Buchung. Die Seite liegt unter `/termin-test/` (noindex, nicht verlinkt), die Funktionen unter `/api/*` (Netlify Functions in `netlify/functions`, Logik in `netlify/lib`). Buchungen liegen in Supabase, Termine in den Google-Kalendern des Teams.

**Dieser Zweig ist nur für die Deploy-Vorschau gedacht und wird nicht in die Live-Seite übernommen.**

## Lokal ausprobieren

```
npm install
npm run termin:dev     # http://localhost:8888/termin-test/
npm run termin:test
```

Ohne Umgebungsvariablen läuft alles simuliert: Buchungen in `.data/bookings.json`, Kalender simuliert (werktags 12 bis 13 Uhr belegt, Patrick mittwochs 10 bis 11:30), Mails als Textdateien in `.data/outbox/`.

## Netlify-Vorschau: Stufe 1 (Datenbank echt, Rest simuliert)

In Netlify unter *Site configuration > Environment variables* für die Vorschau eintragen:

| Variable | Inhalt |
|---|---|
| `SUPABASE_URL` | Projekt-URL aus Supabase (Project Settings > API) |
| `SUPABASE_SERVICE_KEY` | geheimer Schlüssel (`service_role` bzw. Secret Key), nur serverseitig, mit Scope "Functions" |

Ohne `GOOGLE_SERVICE_ACCOUNT_JSON` ist der Kalender simuliert, ohne `SMTP_HOST` werden Mails nur ins Log geschrieben (Netlify > Logs > Functions > `api`). Auf der Seite erscheint dann der Hinweis "Testmodus". Die Tabelle `bookings` ist in Supabase bereits angelegt (`schema.sql`).

## Stufe 2 (echte Kalender und Mails)

Jede Komponente schaltet sich selbst um, sobald ihre Variablen gesetzt sind:

| Komponente | wird echt, wenn gesetzt |
|---|---|
| Speicher | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` |
| Kalender | `GOOGLE_SERVICE_ACCOUNT_JSON` |
| Mail | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` |

Erzwingen lässt sich der Testbetrieb mit `STORE=file`, `CALENDAR=demo`, `MAIL=log`. Kalender-Adressen der Kolleg*innen stehen nicht im Code (öffentliches Repo), sondern in `STAFF_PATRICK_EMAIL`, `STAFF_AILEEN_EMAIL`, `STAFF_EVA_EMAIL`, `STAFF_KIRSTEN_EMAIL`.

## Was vor dem Livegang zu prüfen ist

In `netlify/lib/config.mjs` stehen **Platzhalter**, die Patrick bestätigen muss:

- Wer bietet welche Terminart an (aktuell: Kurzberatung nur Patrick und Aileen)
- Kalender-Adressen der Kolleg*innen (aktuell `@example.invalid` für Aileen, Eva, Kirsten, per Umgebungsvariable oder direkt in der Datei)
- Sprechzeiten (aktuell Mo bis Fr 9 bis 17 Uhr), Mindestvorlauf 12 Stunden, Absagen online bis 2 Stunden vorher
- Terminbeschreibungen und Mailtexte
- Link zur Datenschutzerklärung in `public/termin-test/index.html` (`/datenschutz`)

**Einbindung beim Livegang:** Die Buchungsseite (`public/termin-test/`) lässt sich als eigene Astro-Seite übernehmen oder per `<iframe>` einbetten. Pfade stehen in `BOOK_PATH` und `MANAGE_PATH` (Standard `/termin-test/`), die Website-Adresse in `SITE_URL`.

## Offen (bewusst nicht im Prototyp)

- SMS-Erinnerung (Anbieter wählen, Einwilligung zur Telefonnummer)
- Auftragsverarbeitungsverträge mit Netlify, Supabase und dem Mailanbieter, Absatz in der Datenschutzerklärung
- Löschfrist für alte Buchungen
- Ratenbegrenzung gegen Massenbuchungen, Tracking-Ereignis für Anzeigen
- Test mit echten Kalendern (Frei/Belegt, Meet-Link, Zeitzonenwechsel) vor dem Livegang
