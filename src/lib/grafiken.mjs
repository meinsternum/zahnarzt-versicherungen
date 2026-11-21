// Erklärende Grafiken je Ratgeberseite (1 bis 2), als echtes HTML (für Suchmaschinen und KI lesbar).
// Regeln (claude/regelwerk-inhalte.md): nur Fakten, die auf der Seite selbst mit Quelle stehen,
// fiktive Beispiele gekennzeichnet, Fußzeile mit Stand und Quelle, keine neuen Zahlen.
// Typen: tabelle (Vergleichstabelle), karten (Karten-Infografik), ablauf (Schritte/Zeitachse).
// Platzierung: `nach` = Text der H2, an deren Abschnittsende die Grafik steht; 'start' = vor dem ersten H2.
// Status: alle Grafiken geprüft am 16.11.2026 (Regelwerk Fassung 5).

export const grafiken = {
  'berufsunfaehigkeit-versorgungswerk-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Was bedeutet „Praxis aufgeben“ für die Rente?',
      titel: 'Was „Praxis aufgeben“ in zwei Satzungen bedeutet',
      karten: [
        { kopf: 'Westfalen-Lippe', punkte: ['Rente bei dauerhafter Berufsunfähigkeit und aufgegebener Tätigkeit (§ 41 Abs. 1), befristet auch bei vorübergehender nach 26 Wochen und eingestellter Tätigkeit (§ 42)', 'Kein Anspruch, solange eine Vertretung oder Assistenz die Praxis weiterführt (§ 41 Abs. 3)'] },
        { kopf: 'Niedersachsen', punkte: ['Bei dauerhafter Berufsunfähigkeit: Aufgabe nachweisen, jedes Jahr bis 31. März erklären, sonst entfällt die Rente ab Mai (§ 17a); bei vorübergehender befristete Rente (§ 17b)', 'Gutachten durch nicht behandelnde Fachärzt*innen, Kosten trägst du, Nachuntersuchungen möglich (§ 17 Abs. 5 bis 8)'] },
      ],
      fuss: 'Stand: 16.11.2026, Beispiele aus den Satzungen Westfalen-Lippe und Niedersachsen (siehe Quellen). Deine Satzung kann anders regeln.',
    },
    {
      typ: 'tabelle', nach: 'Was regelt die private Berufsunfähigkeitsversicherung anders?',
      titel: 'Zwei Maßstäbe im Vergleich',
      spalten: ['', 'Versorgungswerk (zwei Beispiele)', 'Private BU (§ 172 VVG)'],
      zeilen: [
        ['Maßstab', 'Zahnärztliche Tätigkeit insgesamt', 'Zuletzt ausgeübter Beruf, ganz oder teilweise'],
        ['Andere Tätigkeit', 'Westfalen-Lippe: auch Nutzung außerhalb der Praxis zählt (§ 41 Abs. 2)', 'Verweisung nur, wenn der Vertrag sie vorsieht (§ 172 Abs. 3)'],
        ['Teilweise Berufsunfähigkeit', 'Keine Teilrente in den beiden Beispielen', 'Möglich, Schwelle steht in den Bedingungen'],
        ['Gesundheitsprüfung beim Eintritt', 'In beiden Regelwerken keine vorgesehen', 'Anzeigepflicht nach § 19 Abs. 1 VVG'],
      ],
      fuss: 'Stand: 16.11.2026, nach Gesetz und Satzungen (siehe Quellen). Maßgeblich sind deine Satzung und dein Vertrag.',
    },
  ],
  'berufsunfaehigkeit-zahnaerztin-berufsstart': [
    {
      typ: 'karten', nach: 'start',
      titel: 'Drei Dinge, die über den Zeitpunkt entscheiden',
      karten: [
        { kopf: 'Vertragsbeginn', punkte: ['Der Versicherer leistet für eine Berufsunfähigkeit, die nach Beginn der Versicherung eintritt (§ 172 Abs. 1 VVG)'] },
        { kopf: 'Gesundheitsfragen', punkte: ['Anzugeben ist, was dir bis zur Vertragserklärung bekannt ist und wonach in Textform gefragt wird (§ 19 Abs. 1 VVG)'] },
        { kopf: 'Bedingungen', punkte: ['Wechsel in den Beruf, Startphase, Nachversicherung: steht im Vertrag', 'Bedingungen bekommst du vor der Vertragserklärung in Textform (§ 7 Abs. 1 VVG)'] },
      ],
      fuss: 'Stand: 16.11.2026, nach VVG (siehe Quellen).',
    },
    {
      typ: 'tabelle', nach: 'Warum sind die Gesundheitsfragen so wichtig?',
      titel: 'Falsche Angaben: Was der Versicherer tun kann',
      spalten: ['Situation', 'Folge nach dem Gesetz', 'Fundstelle'],
      zeilen: [
        ['Pflicht vorsätzlich oder grob fahrlässig verletzt', 'Rücktritt möglich', '§ 19 Abs. 2 VVG'],
        ['Weder vorsätzlich noch grob fahrlässig', 'Kein Rücktritt, Kündigung mit Monatsfrist möglich', '§ 19 Abs. 3 VVG'],
        ['Versicherer hätte zu anderen Bedingungen geschlossen', 'Kein Rücktritt wegen grober Fahrlässigkeit, keine Kündigung, andere Bedingungen auf Verlangen des Versicherers', '§ 19 Abs. 4 VVG'],
        ['Keine gesonderte Belehrung in Textform', 'Rechte nach § 19 Abs. 2 bis 4 bestehen nicht', '§ 19 Abs. 5 VVG'],
        ['Frist für den Versicherer', 'Ein Monat ab Kenntnis, schriftlich', '§ 21 Abs. 1 VVG'],
        ['Erlöschen der Rechte', 'Fünf Jahre nach Vertragsschluss, bei Vorsatz oder Arglist zehn Jahre; nicht für Leistungsfälle, die vorher eingetreten sind', '§ 21 Abs. 3 VVG'],
      ],
      fuss: 'Vereinfachte Übersicht. Stand: 16.11.2026, nach VVG (siehe Quellen).',
    },
  ],
  'berufsunfaehigkeit-rentenhoehe-zahnaerzt-innen': [
    {
      typ: 'ablauf', nach: 'Wie rechnest du deine BU-Rente?',
      titel: 'Ein möglicher Rechenweg',
      schritte: [
        { titel: 'Laufende Ausgaben', text: 'Was bei Berufsunfähigkeit weiterläuft: Wohnen, Lebenshaltung, Kranken- und Pflegeversicherung, Altersvorsorge' },
        { titel: '+ Verpflichtungen', text: 'Darlehen für Wohnung oder Praxis, Unterhalt' },
        { titel: '− Leistung des Versorgungswerks', text: 'Nur soweit sie dir im Leistungsfall tatsächlich zusteht' },
        { titel: '= Lücke', text: 'Rechengröße vor Steuern, einmal mit und einmal ohne Versorgungswerk' },
      ],
      fuss: 'So rechnen wir in der Beratung, keine Vorgabe aus Gesetz oder Satzung.',
    },
    {
      typ: 'tabelle', nach: 'Wie sieht das in Zahlen aus?',
      titel: 'Fiktives Beispiel: Warum zwei Fälle?',
      spalten: ['', 'Fall A: Versorgungswerk zahlt', 'Fall B: Versorgungswerk zahlt nicht'],
      zeilen: [
        ['Laufende Ausgaben', '4.000 €', '4.000 €'],
        ['Leistung Versorgungswerk', '− 1.700 €', '− 0 €'],
        ['Lücke pro Monat, vor Steuern', '2.300 €', '4.000 €'],
      ],
      fuss: 'Fiktives Beispiel mit erfundenen Zahlen, kein Richtwert und keine Empfehlung.',
    },
  ],
  'berufsunfaehigkeit-teilweise-zahnaerzt-innen': [
    {
      typ: 'tabelle', nach: 'Was verlangt das Versorgungswerk?',
      titel: 'Teilweise berufsunfähig: drei Regelwerke im Vergleich',
      spalten: ['', 'Private BU (§ 172 VVG)', 'Versorgungswerk Westfalen-Lippe', 'Versorgungswerk Niedersachsen'],
      zeilen: [
        ['Maßstab', 'Zuletzt ausgeübter Beruf, ganz oder teilweise', 'Fähigkeiten auch außerhalb der Praxis in irgendeiner Weise nicht mehr wirtschaftlich nutzbar, Beruf aufgegeben', '„Völlig berufsunfähig“'],
        ['Schwelle', 'Nicht im Gesetz, steht in den Bedingungen', 'Keine Teilrente vorgesehen (§§ 41, 42)', 'Keine Teilrente vorgesehen (§§ 17 bis 17b)'],
      ],
      fuss: 'Stand: 16.11.2026, nach Gesetz und Satzungen (siehe Quellen). In den Bedingungen, die wir in der Beratung sehen, liegt die Schwelle meist bei 50 Prozent.',
    },
  ],
  'altersvorsorge-versorgungswerk-im-alter-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Wie entsteht eine Rentenlücke?',
      titel: 'Drei Punkte bestimmen die Lücke',
      karten: [
        { kopf: 'Dein Bedarf', punkte: ['Lebensstil, Verpflichtungen, Wohnsituation', 'Eine allgemeine Zahl gibt es nicht'] },
        { kopf: 'Die Beitragsgrenze', punkte: ['Beitragsbemessungsgrenze 2026: 101.400 € im Jahr', 'Beitragssatz 2026: 18,6 Prozent', 'Darüber wächst der Pflichtbeitrag nicht mit'] },
        { kopf: 'Die Preisentwicklung', punkte: ['Inflationsrate 2025: 2,2 Prozent', 'Oktober 2026: 2,8 Prozent', 'Messwerte, keine Prognose'] },
      ],
      fuss: 'Quellen: SVBezGrV 2026, Bekanntmachung Beitragssätze 2026, Statistisches Bundesamt (16.01.2026 und 11.11.2026).',
    },
    {
      typ: 'tabelle', nach: 'Wie sieht das in Zahlen aus?',
      titel: 'Fiktives Beispiel: Kaufkraft nach 30 Jahren',
      spalten: ['', 'Fall A: keine Anpassung', 'Fall B: Anpassung wie die Preise'],
      zeilen: [
        ['Rente in Euro bei Rentenbeginn', '2.000 €', 'rund 3.623 €'],
        ['Kaufkraft in heutigen Preisen', 'rund 1.104 €', '2.000 €'],
        ['Bedarf in heutigen Preisen', '4.000 €', '4.000 €'],
        ['Lücke pro Monat, vor Steuern', '2.896 €', '2.000 €'],
      ],
      fuss: 'Fiktives Beispiel mit erfundenen Zahlen und angenommenen 2 Prozent Preisentwicklung pro Jahr, keine Prognose.',
    },
  ],
  'berufshaftpflicht-pflicht-mindestsumme-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'start',
      titel: 'Woher die Pflicht kommt',
      karten: [
        { kopf: 'Berufsordnung der Kammer', punkte: ['In den drei Beispielen jeweils in § 4', 'Westfalen-Lippe, Sachsen: keine Summe genannt', 'Bayern: Mindestsummen nach § 114 Abs. 1 VVG (250.000 € je Fall, 1 Mio. € im Jahr)'] },
        { kopf: '§ 95e SGB V', punkte: ['Für Vertragszahnärzt*innen über § 72 Abs. 1 Satz 2 SGB V', '3 Mio. € je Versicherungsfall', 'Mit angestellten Zahnärzt*innen oder im MVZ: 5 Mio. €'] },
      ],
      fuss: 'Stand: 16.11.2026, nach Gesetz und Berufsordnungen (siehe Quellen).',
    },
    {
      typ: 'ablauf', nach: 'Was passiert, wenn der Nachweis fehlt?',
      titel: 'Nachweis beim Zulassungsausschuss',
      schritte: [
        { titel: 'Antrag', text: 'Versicherungsbescheinigung mit dem Antrag und auf Verlangen (§ 95e Abs. 3)' },
        { titel: 'Fehlender Schutz', text: 'Ausschuss fordert unverzüglich zur Vorlage auf (§ 95e Abs. 4 Satz 1)' },
        { titel: 'Keine Vorlage', text: 'Ruhen der Zulassung mit sofortiger Wirkung (Satz 2)' },
        { titel: 'Nach zwei Jahren', text: 'Endet das Ruhen nicht, wird die Zulassung entzogen (Satz 7)' },
      ],
      fuss: 'Gilt mit Kassenzulassung. Stand: 16.11.2026, nach SGB V (siehe Quellen).',
    },
  ],
  'krankengeld-luecke-zahnaerzt-innen': [
    {
      typ: 'ablauf', nach: 'Was leistet das gesetzliche Krankengeld?',
      titel: 'Zeitachse bei Krankheit (angestellt, gesetzlich versichert)',
      schritte: [
        { titel: 'Woche 1 bis 6', text: 'Arbeitgeber zahlt das Gehalt weiter (§ 3 Abs. 1 EntgFG)' },
        { titel: 'Ab Woche 7', text: 'Krankengeld: 70 Prozent des Regelentgelts, höchstens 90 Prozent netto, 2026 höchstens 4.068,75 € im Monat (§ 47 SGB V)' },
        { titel: 'Längstens 78 Wochen', text: 'Für dieselbe Krankheit innerhalb von drei Jahren, Entgeltfortzahlung zählt mit (§ 48 SGB V, BMG)' },
      ],
      fuss: 'Stand: 16.11.2026, nach SGB V, EntgFG und BMG (siehe Quellen).',
    },
    {
      typ: 'tabelle', nach: 'Wo entsteht bei gutem Gehalt die Lücke?',
      titel: 'Fiktives Beispiel: Gehalt und Krankengeld',
      spalten: ['Brutto im Monat', '70 Prozent, max. Beitragsbemessungsgrenze (vor Netto-Grenze)', 'Abstand zum Brutto (vor Netto-Grenze)'],
      zeilen: [
        ['7.000 €', '4.068,75 €', '2.931,25 €'],
        ['5.000 €', '3.500 €', '1.500 €'],
      ],
      fuss: 'Fiktives Beispiel, Stand 2026, ohne Steuern und Beitragsabzüge; die 90-Prozent-Netto-Grenze ist nicht gerechnet.',
    },
  ],
  'praxisinhalt-was-gehoert-hinein-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Benannte Gefahren oder Allgefahren: Was ist der Unterschied?',
      titel: 'Zwei Bauweisen der Praxisinhaltsversicherung',
      karten: [
        { kopf: 'Benannte Gefahren', punkte: ['Versichert ist nur, was vereinbart ist', 'Typisch: Feuer, Einbruchdiebstahl, Leitungswasser, Sturm und Hagel, Glasbruch', 'Passt der Schaden in keinen Baustein, gibt es nichts'] },
        { kopf: 'Allgefahren', punkte: ['Versichert sind alle unvorhergesehenen Schäden', 'Der Ausschluss muss im Vertrag stehen, den Schaden belegst du weiter', 'Aus unserer Sicht der robustere Schutz für viel Technik'] },
      ],
      fuss: 'Stand: 16.11.2026, nach Verbandsmustern und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'praxisinhalt-versicherungssumme-unterversicherung-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Gibt es Verträge ohne Unterversicherung?',
      titel: 'Drei Wege, wie Verträge mit Unterversicherung umgehen',
      karten: [
        { kopf: 'Summe ohne Verzicht', punkte: ['Gekürzt wird bei jedem Schaden im Verhältnis Summe zu Wert', 'Summe muss regelmäßig angepasst werden'] },
        { kopf: 'Summe mit Verzichtsklausel', punkte: ['Keine Kürzung bis zu vereinbarten Grenzen', 'Darüber wird der ganze Schaden im Verhältnis gekürzt'] },
        { kopf: 'Höchstgrenze statt Summe', punkte: ['Keine Unterversicherung im Vertrag', 'Beitrag zum Beispiel nach Behandlungsstühlen', 'Angaben, etwa eine Jahresmeldung, müssen stimmen'] },
      ],
      fuss: 'Stand: 16.11.2026, nach Gesetz, Verbandsmustern und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'praxisausfall-wann-zahlt-karenzzeit-leistungsdauer-zahnaerzt-innen': [
    {
      typ: 'ablauf', nach: 'Was bedeutet Haftzeit oder Leistungsdauer?',
      titel: 'So laufen Karenzzeit und Haftzeit',
      schritte: [
        { titel: 'Schadenereignis', text: 'Du bist ärztlich festgestellt arbeitsunfähig. Die Karenzzeit beginnt, je nach Vertrag auch schon die Haftzeit.' },
        { titel: 'Karenzzeit', text: 'Noch keine Leistung, die Praxis trägt die Kosten selbst.' },
        { titel: 'Leistung', text: 'Nach Ablauf der Karenzzeit, längstens bis zum Ende der vereinbarten Haftzeit.' },
      ],
      fuss: 'Stand: 16.11.2026, nach Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'karten', nach: 'Welche Pflichten hast du im Schadenfall?',
      titel: 'Deine Pflichten nach dem Versicherungsfall',
      karten: [
        { kopf: 'Anzeigen', punkte: ['Unverzüglich (§ 30 Abs. 1 VVG)'] },
        { kopf: 'Auskunft geben', punkte: ['Auf Verlangen, Belege soweit zumutbar (§ 31 VVG)'] },
        { kopf: 'Schaden mindern', punkte: ['Nach Möglichkeit (§ 82 Abs. 1 VVG)'] },
      ],
      fuss: 'Stand: VVG abgerufen am 16.11.2026. Weitere Pflichten kann dein Vertrag nennen.',
    },
  ],
  'praxisausfall-tagessatz-fixkosten-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Welche Kosten laufen weiter?',
      titel: 'Welche Kosten das fiktive Beispiel ansetzt',
      karten: [
        { kopf: 'Im Beispiel enthalten', punkte: ['Personal', 'Raumkosten', 'Leasing, Zinsen, Abschreibungen', 'Übrige laufende Kosten'] },
        { kopf: 'Im Beispiel nicht enthalten', punkte: ['Material', 'Fremdlabor', 'Hängen an der Behandlung (unsere Einschätzung)'] },
      ],
      fuss: 'Kostenarten des fiktiven Beispiels, angelehnt an KZBV Jahrbuch 2025, Tab. 5.3. Stand: 16.11.2026.',
    },
  ],
  'praxisausfall-oder-krankentagegeld-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'start',
      titel: 'Zwei Fragen, zwei Absicherungen',
      karten: [
        { kopf: 'Was fehlt mir persönlich?', punkte: ['Krankentagegeld: ersetzt deinen Verdienstausfall', 'Grenze: in der Regel dein Nettoeinkommen'] },
        { kopf: 'Was fehlt der Praxis?', punkte: ['Praxisausfallversicherung: laufende Kosten, je nach Vereinbarung auch entgehender Gewinn', 'Auslöser: deine Arbeitsunfähigkeit als Inhaberin oder Inhaber'] },
      ],
      fuss: 'Stand: 16.11.2026, nach Gesetz und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  // Rechtsschutz (17.11.2026, Entwurf, Prüfung siehe quellen/rechtsschutz-bedingungswerke.md)
  'rechtsschutz-welche-bausteine-zahnaerzt-innen': [
  {
    typ: 'tabelle', nach: 'Welche Bausteine passen in welcher Berufsphase?',
    titel: 'Welche Bausteine in welcher Berufsphase',
    spalten: ['', 'Assistenzzeit und Anstellung', 'Gründung und Übernahme', 'Eigene Praxis'],
    zeilen: [
      ['Passende Bereiche', 'Privat- und Berufs-Rechtsschutz', 'Baustein, der die geplante Selbstständigkeit einschließt', 'Rechtsschutz für Selbstständige, je nach Vertrag kombiniert mit Privat und Verkehr'],
      ['Worum es geht', 'Streit aus dem Arbeitsverhältnis, etwa mit der Praxis oder dem MVZ', 'Praxismiete, Kaufvertrag; Wartezeiten beachten', 'Team, Verträge der Praxis, Sozialgericht, berufsrechtliche Verfahren, Strafverfahren'],
      ['Gut zu wissen', 'Es gibt Verträge, die angestellte Zahnärzt*innen ausdrücklich nennen', 'Privat- und Berufs-Rechtsschutz decken in den Musterbedingungen nichts zur geplanten Selbstständigkeit', 'Spezial-Straf-Rechtsschutz je nach Vertrag als eigener Baustein'],
    ],
    fuss: 'Stand: 17.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-oder-berufshaftpflicht-zahnaerzt-innen': [
  {
    typ: 'karten', nach: 'Fiktives Beispiel: ein Vorwurf, drei Verfahren',
    titel: 'Ein Behandlungsfehlervorwurf, drei Zuständigkeiten',
    karten: [
      { kopf: 'Schadenersatz und Schmerzensgeld', punkte: ['Zuständig: Berufshaftpflicht', 'Prüft, wehrt unberechtigte Ansprüche ab, zahlt berechtigte', 'Rechtsschutz: Abwehr in der Regel ausgeschlossen, Ausnahme Vertragsverletzung, einige Verträge regeln den Vorrang der Berufshaftpflicht'] },
      { kopf: 'Strafanzeige', punkte: ['Fahrlässigkeit vorgeworfen: Straf-Rechtsschutz', 'Vorsatz vorgeworfen: Details auf der Seite zu Strafverfahren, je nach Vertrag erweiterter oder Spezial-Straf-Rechtsschutz'] },
      { kopf: 'Offene Rechnung', punkte: ['Vertrags-Rechtsschutz der Praxis, wenn vereinbart', 'In der Regel nur vor Gericht'] },
    ],
    fuss: 'Fiktives Beispiel. Stand: 17.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-strafverfahren-zahnaerzt-innen': [
  {
    typ: 'tabelle', nach: 'Was deckt ein Spezial-Straf-Rechtsschutz zusätzlich?',
    titel: 'Straf-Rechtsschutz und Spezial-Straf-Rechtsschutz im Vergleich',
    spalten: ['', 'Normaler Straf-Rechtsschutz', 'Spezial-Straf-Rechtsschutz'],
    zeilen: [
      ['Vorwurf eines fahrlässigen Vergehens (z. B. fahrlässige Körperverletzung, § 229 StGB)', 'Versichert', 'Versichert'],
      ['Vorwurf eines nur vorsätzlich begehbaren Vergehens (z. B. Betrug, § 263 StGB)', 'Nicht versichert, auch nicht bei Freispruch', 'Versichert, Rückzahlung bei rechtskräftiger Verurteilung wegen Vorsatz'],
      ['Verbrechen (z. B. gewerbsmäßiger Bandenbetrug, § 263 Abs. 5 StGB)', 'Nicht versichert', 'Je nach Vertrag: ausgeschlossen, teilweise oder mitversichert'],
      ['Versicherungsfall', 'Zeitpunkt der vorgeworfenen Tat', 'Einleitung des Ermittlungsverfahrens'],
      ['Zeugenbeistand, Firmenstellungnahme', 'Im normalen Baustein nicht vorgesehen', 'Versichert, Zeugenbeistand bei Gefahr der Selbstbelastung'],
      ['Anwaltshonorar', 'Gesetzliche Vergütung', 'Angemessenes vereinbartes Honorar, je nach Vertrag mit Höchstbeträgen'],
    ],
    fuss: 'Vereinfachte Übersicht. Zwischenstufe in einzelnen Verträgen: erweiterter Straf-Rechtsschutz, auch für nur vorsätzlich begehbare Vergehen, keine Verbrechen. Stand: 17.11.2026, nach Gesetz, Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-kzv-wirtschaftlichkeitspruefung-zahnaerzt-innen': [
  {
    typ: 'ablauf', nach: 'Ab welcher Stufe zahlt die Rechtsschutzversicherung?',
    titel: 'Wirtschaftlichkeitsprüfung: Wo Rechtsschutzverträge ansetzen',
    schritte: [
      { titel: 'Prüfungsstelle', text: 'Stellungnahme oder persönliches Erscheinen, danach Bescheid. In den verglichenen Bedingungen nicht ausdrücklich geregelt: vorher klären.' },
      { titel: 'Beschwerdeausschuss', text: 'Widerspruch mit aufschiebender Wirkung, gilt als Vorverfahren (§ 106c Abs. 3 SGB V). Versichert nur, wenn dein Vertrag Widerspruchs- oder Vorverfahren einschließt.' },
      { titel: 'Sozialgericht', text: 'Klage ohne aufschiebende Wirkung. Ab hier greift der Sozial-Rechtsschutz in der Regel, im Verbandsmuster erst ab dieser Stufe.' },
    ],
    fuss: 'Stand: 17.11.2026, nach SGB V, Veröffentlichungen der KZV Land Brandenburg und Versicherungsbedingungen (siehe Quellen). Prüfpunkt: Die Bedingungen nennen die Kassenärztliche Vereinigung, nicht die KZV. Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-zahnarztpraxis-team-vermieter-vertraege': [
  {
    typ: 'karten', nach: 'start',
    titel: 'Drei Streitfelder der Zahnarztpraxis',
    karten: [
      { kopf: 'Team', punkte: ['Arbeits-Rechtsschutz auf Arbeitgeberseite: in der Regel enthalten', 'Wartezeit in den Bedingungen, die wir vergleichen, drei bis sechs Monate', 'Beratung vor Kündigung oder Aufhebungsvertrag nur in einzelnen Verträgen'] },
      { kopf: 'Praxisräume', punkte: ['Wohnungs- und Grundstücks-Rechtsschutz', 'Je nach Vertrag alle selbst genutzten Gewerbeeinheiten, nur das Objekt im Versicherungsschein oder ein eigener Baustein', 'Umbau mit Genehmigungs- oder Anzeigepflicht ausgeschlossen'] },
      { kopf: 'Labor, Depot, Lieferanten', punkte: ['Hilfsgeschäfte rund um Räume und Einrichtung: in Verträgen für Selbstständige und Heilberufe in der Regel versichert', 'Verträge der Berufsausübung: je nach Vertrag gar nicht oder nur vor Gericht'] },
    ],
    fuss: 'Stand: 17.11.2026, nach Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
  {
    typ: 'tabelle', nach: 'Was gilt bei Streit mit Labor, Dentaldepot oder Lieferanten?',
    titel: 'Verträge der Berufsausübung: fünf Regelungen im Vergleich',
    spalten: ['Vertrag', 'Was versichert ist'],
    zeilen: [
      ['Vertrag 1', 'Hilfsgeschäfte sowie selbst genutzte technische Anlagen und Software bis 10.000 Euro je Fall; übrige Verträge nur als Zusatz, vor Gericht, ab Mindeststreitwert'],
      ['Vertrag 2', 'Als Zusatz für Heilberufe: nur vor Gericht, 300.000 Euro im Jahr, 250 Euro Selbstbeteiligung je Fall'],
      ['Vertrag 3', 'Nur vor Gericht, bis eine Million Euro je Fall'],
      ['Vertrag 4', 'Nur vor Gericht, ab 100 Euro Streitwert'],
      ['Vertrag 5', 'Gerichtsverfahren und außergerichtlicher Vergleich'],
    ],
    fuss: 'Stand: 17.11.2026, nach Versicherungsbedingungen von fünf Versicherern (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-praxisgruendung-uebernahme-bag-zahnaerzt-innen': [
  {
    typ: 'ablauf', nach: 'Warum zählt der Zeitpunkt des Abschlusses?',
    titel: 'Wann ein Streit aus der Gründung versichert ist',
    schritte: [
      { titel: 'Vertragsbeginn', text: 'Nur Streit, dessen erster Verstoß nach Vertragsbeginn liegt, kann versichert sein' },
      { titel: 'Wartezeit', text: 'Für Arbeits- und Mietstreit in den Bedingungen, die wir vergleichen, drei bis sechs Monate ab Vertragsbeginn; in einigen Verträgen auch für den Vertrags-Rechtsschutz von Selbstständigen' },
      { titel: 'Erster Verstoß', text: 'Maßgeblich ist in der Regel, wann zum ersten Mal gegen eine Pflicht verstoßen wird oder verstoßen worden sein soll. Je nach Vertrag können eine Erklärung oder ein Behördenantrag vor Vertragsbeginn den Schutz ausschließen' },
      { titel: 'Unsere Folgerung', text: 'Praxis-Rechtsschutz so früh, dass die Wartezeit abgelaufen ist, bevor die Verträge der neuen Praxis laufen' },
    ],
    fuss: 'Stand: 17.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
  {
    typ: 'karten', nach: 'Gibt es Schutz schon in der Vorbereitungszeit?',
    titel: 'Drei Regeln für die Zeit vor der Eröffnung, je nach Vertrag',
    karten: [
      { kopf: 'Vorbereitungszeit', punkte: ['Ein Vertrag für angestellte Ärzt*innen und Zahnärzt*innen: bis zu 24 Monate, einschließlich Praxiskauf (nur vor Gericht)', 'Scheitert die Niederlassung endgültig: nur gerichtlich, nach Mediationsversuch, bis 10.000 Euro je Niederlassungsversuch', 'Prüfpunkt: Wortlaut „als Arzt“, zahnärztliche Niederlassung bestätigen lassen'] },
      { kopf: 'Vorbereitende Tätigkeiten', punkte: ['Ein Vertrag in seiner höchsten Privatvariante: Anmietung der Räume, erste Anschaffung der Einrichtung', 'Nur, wenn die neue Tätigkeit ab Beginn beim selben Versicherer versichert wird'] },
      { kopf: 'Vorsorgeversicherung', punkte: ['Neue selbstständige Tätigkeit ohne Wartezeit mitversichert', 'Meldefrist zwischen drei und zwölf Monaten'] },
    ],
    fuss: 'Stand: 17.11.2026, nach Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-angestellte-zahnaerzt-innen': [
  {
    typ: 'tabelle', nach: 'Bist du über den Praxis-Rechtsschutz deines Arbeitgebers versichert?',
    titel: 'Praxisvertrag des Arbeitgebers oder eigener Vertrag',
    spalten: ['', 'Praxisvertrag des Arbeitgebers', 'Eigener Berufs-Rechtsschutz'],
    zeilen: [
      ['Wann du versichert bist', 'Nur bei der Tätigkeit im versicherten Betrieb und in Ausübung dieser Tätigkeit', 'Für deine nichtselbstständige Tätigkeit'],
      ['Streit mit dem Arbeitgeber', 'Ausgeschlossen (Mitversicherte gegen Versicherungsnehmer)', 'Arbeits-Rechtsschutz, nach drei bis sechs Monaten Wartezeit'],
      ['Mitsprache des Arbeitgebers', 'Je nach Vertrag kann er einer Leistung für dich widersprechen', '–'],
      ['Standes-Rechtsschutz', 'Nur bei der Tätigkeit im versicherten Betrieb, Arbeitgeber kann je nach Vertrag widersprechen', 'In der Regel enthalten'],
    ],
    fuss: 'Stand: 17.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
  {
    typ: 'karten', nach: 'Ist eine selbstständige Nebentätigkeit mitversichert?',
    titel: 'Nebentätigkeit auf Honorarbasis',
    karten: [
      { kopf: 'Grundregel', punkte: ['Berufs-Bausteine für Angestellte schließen selbstständige Tätigkeiten aus', 'Selbstständig ist, was kein Lohn, Gehalt oder Rente ist'] },
      { kopf: 'Ausnahme in einem Vertrag', punkte: ['Gelegentliche Nebentätigkeiten, etwa nicht operative Praxisvertretungen oder Gutachten', 'Gutachten an höchstens 60, übrige Tätigkeiten an höchstens 90 Tagen im Jahr', 'Prüfpunkt: Wortlaut „als Arzt“, zahnärztliche Tätigkeit schriftlich bestätigen lassen'] },
    ],
    fuss: 'Stand: 17.11.2026, nach Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  'rechtsschutz-kammer-berufsrecht-approbation-zahnaerzt-innen': [
  {
    typ: 'karten', nach: 'Was hat ein Strafverfahren mit Kammer und Approbation zu tun?',
    titel: 'Drei Verfahren, drei Bausteine',
    karten: [
      { kopf: 'Strafverfahren', punkte: ['Verteidigung über Straf- oder Spezial-Straf-Rechtsschutz', 'Ergebnis kann Berufsgericht und Approbation berühren'] },
      { kopf: 'Zahnärztekammer und Berufsgericht', punkte: ['Rüge der Kammer oder berufsgerichtliches Verfahren (Beispiel NRW, §§ 58e, 60 HeilBerG)', 'Bei erhobener öffentlicher Klage ausgesetzt (§ 76 HeilBerG NRW)', 'Verteidigung über Disziplinar- und Standes-Rechtsschutz, in der Regel enthalten'] },
      { kopf: 'Approbation', punkte: ['Ruhen schon während eines Strafverfahrens möglich, Widerruf bei Unwürdigkeit oder Unzuverlässigkeit (§§ 4, 5 ZHG)', 'Kein Standesverfahren: je nach Vertrag beruflicher Verwaltungs-Rechtsschutz, vorher schriftlich klären'] },
    ],
    fuss: 'Stand: 17.11.2026, nach ZHG, Heilberufsgesetz NRW als Beispiel und Versicherungsbedingungen (siehe Quellen). Dein Landesrecht und dein Vertrag können abweichen.',
  },
],
  'rechtsschutz-wartezeit-wechsel-nachhaftung-zahnaerzt-innen': [
  {
    typ: 'ablauf', nach: 'Was gilt nach der Praxisabgabe?',
    titel: 'Vom Vertragsbeginn bis zur Nachhaftung',
    schritte: [
      { titel: 'Vor Vertragsbeginn', text: 'Kein Schutz, wenn der erste Verstoß hier liegt. Verstöße, die länger als ein Jahr vor Beginn liegen, bleiben in der Regel außer Betracht.' },
      { titel: 'Wartezeit', text: 'In den Bedingungen, die wir vergleichen, drei bis sechs Monate je nach Leistungsart, im Straf-Rechtsschutz in der Regel keine. Bei lückenlosem Wechsel nur angerechnet oder entfallen, wenn der Vertrag das vorsieht.' },
      { titel: 'Laufzeit', text: 'Versichert sind Rechtsschutzfälle, deren erster Verstoß in diese Zeit fällt. Melden kannst du sie in der Regel bis drei Jahre nach Vertragsende.' },
      { titel: 'Nach Praxisabgabe', text: 'Endet der Vertrag durch Berufsaufgabe: Nachhaftung je nach Vertrag ein bis drei Jahre für neue Fälle aus der versicherten Tätigkeit, in einem Vertrag vier Jahre nur für KV-Verfahren. Nicht jeder Vertrag hat eine.' },
    ],
    fuss: 'Vereinfachte Übersicht. Stand: 17.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
  },
],
  // Cyber (18.11.2026, freigegeben 19.11.2026)
  'cyber-betriebsunterbrechung-zahnarztpraxis-praxisausfall': [
    {
      typ: 'ablauf', nach: 'Ab wann und wie lange zahlt die Versicherung?',
      titel: 'Stillstand nach Cyberangriff: So läuft die Zeit',
      schritte: [
        { titel: 'Unterbrechung beginnt', text: 'Daten oder IT-Systeme stehen nach einer Sicherheitsverletzung nicht zur Verfügung.' },
        { titel: 'Zeitlicher Selbstbehalt', text: 'Je nach Vertrag keine Entschädigung für den Ertragsausfall. Die Dauer steht im Versicherungsschein.' },
        { titel: 'Haftzeit', text: 'Ertragsausfall oder Tagessatz. Je nach Vertrag beginnt sie mit der Unterbrechung oder erst nach dem Selbstbehalt.' },
        { titel: 'Ende', text: 'Wenn kein Ertragsausfall mehr entsteht, spätestens mit Ablauf der Haftzeit.' },
      ],
      fuss: 'Stand: 19.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'tabelle', nach: 'Springt der Ertragsausfall aus der Inhaltsversicherung ein?',
      titel: 'Drei Verträge, drei Auslöser',
      spalten: ['Vertrag', 'Auslöser', 'Bei Cyberangriff'],
      zeilen: [
        ['Cyber-Betriebsunterbrechung', 'Sicherheitsverletzung der IT, etwa ein Angriff', 'Zahlt, wenn vereinbart, nach dem zeitlichen Selbstbehalt'],
        ['Praxisausfallversicherung', 'Deine Arbeitsunfähigkeit als Inhaberin oder Inhaber', 'Ein Angriff allein löst sie nicht aus'],
        ['Ertragsausfall zur Inhaltsversicherung', 'Sachschaden, etwa durch Brand oder Leitungswasser', 'Nicht für den Angriff allein, Daten sind keine Sachen'],
      ],
      fuss: 'Stand: 19.11.2026, nach Verbandsmustern, Versicherungsbedingungen und den Seiten zu Praxisausfall und Inhalt (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'cyber-datenleck-haftung-patienten-zahnarztpraxis': [
    {
      typ: 'karten', nach: 'Wo endet die Cyberversicherung, und wann zahlt die Berufshaftpflicht?',
      titel: 'Datenleck: Welcher Vertrag für welche Forderung?',
      karten: [
        { kopf: 'Cyberversicherung', punkte: ['Schadenersatz wegen Datenschutzverstoß, immaterielle Schäden je nach Vertrag', 'Prüft, wehrt unberechtigte Ansprüche ab, zahlt berechtigte'] },
        { kopf: 'Berufshaftpflicht', punkte: ['Gesundheitsschäden von Patient*innen, etwa nach Behandlung mit veränderten Daten', 'Reiner Datenschutzverstoß: in den eigenen Bedingungen prüfen'] },
        { kopf: 'Je nach Vertrag', punkte: ['Kosten eines Verfahrens der Datenschutzaufsicht', 'Freistellung externer Datenverarbeiter'] },
      ],
      fuss: 'Stand: 19.11.2026, nach DSGVO, Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'cyber-hackerangriff-zahnarztpraxis-erste-schritte-meldepflicht': [
    {
      typ: 'ablauf', nach: 'Wen rufst du nach einem Hackerangriff zuerst an?',
      titel: 'Die ersten Schritte nach einem Angriff',
      schritte: [
        { titel: 'Versicherer anrufen', text: 'Über den Meldeweg aus dem Versicherungsschein, parallel den IT-Dienstleister. Den Schaden unverzüglich melden.' },
        { titel: 'Weisungen befolgen', text: 'Weisungen des Versicherers befolgen; je nach Vertrag das Schadenbild unverändert lassen oder nachvollziehbar dokumentieren.' },
        { titel: 'Aufsicht informieren', text: 'Sind personenbezogene Daten betroffen: unverzüglich und möglichst binnen 72 Stunden, außer bei voraussichtlich keinem Risiko.' },
        { titel: 'Patient*innen informieren', text: 'Nur bei voraussichtlich hohem Risiko, dann unverzüglich.' },
        { titel: 'Dokumentieren', text: 'Jede Verletzung mit Fakten, Auswirkungen und Abhilfemaßnahmen festhalten.' },
      ],
      fuss: 'Stand: 19.11.2026, nach DSGVO, Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'tabelle', nach: 'Wann musst du deine Patient*innen informieren?',
      titel: 'Aufsicht oder Patient*innen: Wen du wann informierst',
      spalten: ['', 'Datenschutzaufsicht', 'Patient*innen'],
      zeilen: [
        ['Wann?', 'Außer bei voraussichtlich keinem Risiko für die Betroffenen', 'Nur bei voraussichtlich hohem Risiko'],
        ['Frist', 'Unverzüglich, möglichst binnen 72 Stunden', 'Unverzüglich, ohne feste Stundenfrist'],
        ['Entfällt auch', '–', 'Daten vorher für Unbefugte unzugänglich gemacht, Risiko beseitigt oder unverhältnismäßiger Aufwand (dann öffentliche Bekanntmachung)'],
        ['Grundlage', 'Art. 33 DSGVO', 'Art. 34 DSGVO'],
      ],
      fuss: 'Stand: 19.11.2026, nach Art. 33 und 34 DSGVO (siehe Quellen).',
    },
  ],
  'cyber-obliegenheiten-it-sicherheitsrichtlinie-zahnarztpraxis': [
    {
      typ: 'karten', nach: 'Was verlangt die IT-Sicherheitsrichtlinie der KZBV?',
      titel: 'Welche Anlagen der KZBV-Richtlinie gelten',
      karten: [
        { kopf: 'Praxis: bis 5 Personen', punkte: ['Anlage 1 und 5'] },
        { kopf: 'Mittlere Praxis: 6 bis 20', punkte: ['Anlage 1, 2 und 5'] },
        { kopf: 'Großpraxis: über 20', punkte: ['Anlage 1, 2, 3 und 5', 'Auch bei Datenverarbeitung in erheblichem Umfang, zum Beispiel Groß-MVZ mit krankenhausähnlichen Strukturen'] },
        { kopf: 'Medizinische Großgeräte', punkte: ['Zusätzlich Anlage 4, zum Beispiel bei einem Dental-MRT'] },
      ],
      fuss: 'Stand: 19.11.2026, nach der KZBV-Richtlinie Version 1.1 (siehe Quellen).',
    },
    {
      typ: 'tabelle', nach: 'Wo unterscheiden sich Richtlinie und Versicherungsbedingungen?',
      titel: 'KZBV-Richtlinie und Cyber-Bedingungen im Vergleich',
      spalten: ['', 'KZBV-Richtlinie', 'Cyber-Bedingungen'],
      zeilen: [
        ['Datensicherung', 'Regelmäßig (muss)', 'Mindestens wöchentlich'],
        ['Test der Sicherung', 'Soll', 'Je nach Vertrag Pflicht'],
        ['Sicherheitsupdates', 'Zeitnah (muss)', 'Je nach Vertrag unverzüglich, zeitnah oder in 14 bzw. 30 Tagen'],
        ['Systeme ohne Updates', 'Ausmustern oder separieren (muss)', 'In der Regel nur mit Zusatzschutz oder abgeschottet'],
        ['2-Faktor-Authentifizierung', 'In Anlage 1 nicht ausdrücklich gefordert', 'Je nach Vertrag Beispiel bei erhöhtem Risiko'],
        ['Firewall', 'Am Internetübergang (muss)', 'Je nach Vertrag Beispiel oder Pflicht'],
      ],
      fuss: 'Stand: 19.11.2026, nach der KZBV-Richtlinie Version 1.1 und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'cyber-was-zahlt-nicht-loesegeld-bussgeld-zahnarztpraxis': [
    {
      typ: 'tabelle', nach: 'start',
      titel: 'Ausschlüsse: in der Regel oder je nach Vertrag',
      spalten: ['Thema', 'Regelung'],
      zeilen: [
        ['Krieg, staatliche Angriffe', 'In der Regel ausgeschlossen'],
        ['Ausfall von öffentlichem Strom, Internet, Telefonnetz', 'In der Regel ausgeschlossen'],
        ['Vorsatz', 'In der Regel ausgeschlossen'],
        ['Personenschäden', 'In der Regel nicht versichert'],
        ['Lösegeld', 'Je nach Vertrag: ausgeschlossen, mit Zusatz oder Zustimmung, mitversichert'],
        ['Bußgelder', 'Je nach Vertrag: ausgeschlossen, nur im Ausland oder unter Vorbehalt'],
        ['Gefälschte Zahlungsanweisungen', 'Je nach Vertrag: ausgeschlossen, Zusatzbaustein oder Grunddeckung mit Grenzen'],
        ['Ausfall von IT-Dienstleister oder Cloud', 'Je nach Vertrag: eingeschlossen, Zusatzbaustein oder ausgeschlossen'],
        ['Bedienfehler', 'Je nach Vertrag'],
        ['Technische Störung ohne Angriff', 'Nur über Zusatzbausteine'],
      ],
      fuss: 'Stand: 19.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'cyberversicherung-zahnarztpraxis-braucht-man-das': [
    {
      typ: 'karten', nach: 'Was ist eine Cyberversicherung?',
      titel: 'Die drei Bereiche einer Cyberversicherung',
      karten: [
        { kopf: 'Eigenschäden', punkte: ['Kosten, um Daten und Programme wiederherzustellen', 'Hardware nur je nach Vertrag', 'Ertragsausfall je nach Vertrag in der Grunddeckung oder nur bei Vereinbarung'] },
        { kopf: 'Drittschäden', punkte: ['Schadenersatzansprüche anderer wegen eines Vermögensschadens, etwa von Patient*innen', 'Personenschäden in der Regel ausgeschlossen'] },
        { kopf: 'Service und Kosten', punkte: ['IT-Forensik', 'Meldepflichten prüfen, Betroffene benachrichtigen', 'Je nach Vertrag Notfallnummer, Krisendienstleister, Krisenkommunikation'] },
      ],
      fuss: 'Stand: 19.11.2026, nach Verbandsmuster und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'tabelle', nach: 'Zahlt nicht schon die Inhalts- oder Elektronikversicherung?',
      titel: 'Daten nach einem Angriff: Welcher Vertrag zahlt?',
      spalten: ['Vertrag', 'Verschlüsselte oder gelöschte Daten'],
      zeilen: [
        ['Inhaltsversicherung', 'Daten sind keine Sachen; Daten nur nach einem versicherten Schaden am Datenträger, Schadprogramme ausgeschlossen'],
        ['Elektronikversicherung', 'Daten sind keine Sachen; Wiederherstellung nur nach einem versicherten Schaden am Datenträger oder an der Anlage'],
        ['Cyberversicherung', 'Kosten der Wiederherstellung in der Regel versichert'],
      ],
      fuss: 'Stand: 19.11.2026, nach Verbandsmustern und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],


  'pkv-oder-gkv-wechsel-zahnaerzt-innen': [
    {
      typ: 'tabelle', nach: 'Wer darf als Zahnärztin oder Zahnarzt in die private Krankenversicherung?',
      titel: 'Wer kann zwischen PKV und GKV wählen?',
      spalten: ['Situation', 'Krankenversicherung'],
      zeilen: [
        ['Angestellt, auch in der Vorbereitungsassistenz, Gehalt bis zur Grenze', 'Versicherungspflicht in der gesetzlichen Kasse'],
        ['Angestellt, regelmäßiges Jahresgehalt über der Grenze (2026: 77.400 Euro)', 'versicherungsfrei: freiwillig gesetzlich oder privat'],
        ['Eigene Zahnarztpraxis, hauptberuflich selbstständig', 'nicht versicherungspflichtig: privat oder, nach ausreichender Vorversicherung, freiwillig gesetzlich'],
        ['Ab 55 eigentlich wieder versicherungspflichtig, vorher fünf Jahre nicht gesetzlich versichert', 'trotzdem versicherungsfrei unter den Voraussetzungen des § 6 Abs. 3a SGB V'],
      ],
      fuss: 'Stand: 19.11.2026, nach SGB V und Sozialversicherungs-Rechengrößenverordnung 2026 (siehe Quellen).',
    },
    {
      typ: 'ablauf', nach: 'Wie läuft der Wechsel als angestellte Zahnärztin oder angestellter Zahnarzt?',
      titel: 'Fiktives Beispiel: Wechsel bei 7.000 Euro Monatsgehalt',
      schritte: [
        { titel: 'Gehalt 2026', text: '12 × 7.000 Euro = 84.000 Euro, über der Grenze von 77.400 Euro' },
        { titel: 'Prüfung Folgejahr', text: 'Die Versicherungspflicht endet nur, wenn das Gehalt auch über der Grenze für 2027 liegt' },
        { titel: 'Hinweis der Kasse', text: 'Ohne Austritt binnen zwei Wochen geht es freiwillig gesetzlich weiter' },
        { titel: 'Ab 01.01.2027', text: 'Privat versichert, wenn der Austritt erklärt und die PKV nachgewiesen ist' },
      ],
      fuss: 'Stand: 19.11.2026, nach §§ 6 und 188 SGB V (siehe Quellen). Annahme: Gehaltserhöhung in bestehender Stelle, festes Gehalt, zwölf Monatsgehälter.',
    },
  ],


  'krankentagegeld-praxisinhaber-zahnaerzt-innen': [
    {
      typ: 'tabelle', nach: 'Wie hoch sollte das Krankentagegeld mit eigener Praxis sein?',
      titel: 'Was als Nettoeinkommen zählt',
      spalten: ['Grundlage', 'Obergrenze für das Tagegeld'],
      zeilen: [
        ['Musterbedingungen des PKV-Verbands', 'Nettoeinkommen aus dem Beruf, Durchschnitt der letzten zwölf Monate, wenn der Tarif nichts anderes vorsieht'],
        ['Ein Vertrag, niedergelassene Zahnärzt*innen', '80 Prozent des Praxisumsatzes, in der Berufsausübungsgemeinschaft dein Anteil'],
        ['Ein anderer Vertrag, Freiberufler*innen', '75 Prozent der Praxiseinnahmen der letzten zwölf Monate'],
      ],
      fuss: 'Stand: 20.11.2026, nach Musterbedingungen und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'ablauf', nach: 'Ab welchem Tag sollte das Krankentagegeld zahlen?',
      titel: 'Fiktives Beispiel: Was du bis zum Beginn selbst trägst',
      schritte: [
        { titel: 'Bedarf', text: '6.000 Euro im Monat, geteilt durch 30 Tage, ergibt 200 Euro Tagessatz' },
        { titel: 'Beginn ab dem 22. Tag', text: '21 Tage selbst tragen: 21 × 200 Euro = 4.200 Euro' },
        { titel: 'Beginn ab dem 43. Tag', text: '42 Tage selbst tragen: 42 × 200 Euro = 8.400 Euro' },
      ],
      fuss: 'Stand: 20.11.2026. Annahmen: privater Bedarf 6.000 Euro im Monat, Zahlung je Kalendertag einschließlich Wochenende, ohne Steuern.',
    },
  ],

  'pkv-im-alter-beitraege-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Was dämpft den Beitrag im Ruhestand?',
      titel: 'Was den Beitrag im Alter dämpft',
      karten: [
        { kopf: 'Alterungsrückstellung', punkte: ['Keine Erhöhung wegen des Älterwerdens allein', 'Anpassung nur bei veränderten Leistungen oder Lebenserwartung'] },
        { kopf: 'Gesetzlicher Zuschlag', punkte: ['10 Prozent in der Krankheitskostenvollversicherung, vom Jahr nach dem 21. bis zum Jahr des 60. Geburtstags', 'Ab 65 für Beitragserhöhungen, ab 80 zur Senkung'] },
        { kopf: 'Krankentagegeld endet', punkte: ['Mit dem Bezug von Altersrente, spätestens mit 65, wenn vereinbart', 'Sein Beitrag fällt weg'] },
        { kopf: 'Beitragsentlastungstarif', punkte: ['Vereinbarter Abzug vom Beitrag, in der Regel ab 67', 'Zusatzbeitrag läuft auch danach weiter'] },
      ],
      fuss: 'Stand: 20.11.2026, nach Gesetz, Musterbedingungen und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'tabelle', nach: 'Zahlt das Versorgungswerk einen Zuschuss zu meinem Beitrag?',
      titel: 'Wer zahlt im Ruhestand beim Beitrag mit?',
      spalten: ['Rente', 'Zuschuss zur Krankenversicherung'],
      zeilen: [
        ['Gesetzliche Rente, privat versichert', 'Ja, die Hälfte von allgemeinem Beitragssatz und durchschnittlichem Zusatzbeitrag auf die Rente, höchstens die Hälfte des Beitrags'],
        ['Rente aus dem Versorgungswerk Westfalen-Lippe', 'Nein, die Satzung (Stand Juli 2026) sieht keinen Zuschuss vor'],
        ['Angestellt bis zum Ruhestand', 'Arbeitgeberzuschuss endet mit der Beschäftigung'],
      ],
      fuss: 'Stand: 20.11.2026, nach SGB VI, SGB V und Satzung des Versorgungswerks der Zahnärztekammer Westfalen-Lippe, Stand Juli 2026 (siehe Quellen).',
    },
  ],
  // Unfallversicherung (21.11.2026, Entwurf)
  'unfallversicherung-zahnaerzt-innen-braucht-man-das': [
    {
      typ: 'tabelle', nach: 'Was unterscheidet die Unfallversicherung von BU und Versorgungswerk?',
      titel: 'Vier Ebenen im Vergleich',
      spalten: ['', 'Private Unfallversicherung', 'BGW (gesetzlich)', 'Private BU', 'Versorgungswerk'],
      zeilen: [
        ['Zahlt bei', 'Unfällen, weltweit und rund um die Uhr', 'Arbeits- und Wegeunfällen, Berufskrankheiten', 'Krankheit und Unfall', 'Berufsunfähigkeit nach der Satzung'],
        ['Maßstab', 'Invaliditätsgrad nach Gliedertaxe', 'Versicherungssumme, Minderung der Erwerbsfähigkeit', 'Berufsunfähigkeit nach dem Vertrag', 'Satzung, zum Beispiel Aufgabe der Tätigkeit'],
        ['Für dich mit eigener Praxis', 'Wenn abgeschlossen', 'Nur bei freiwilliger Versicherung', 'Wenn abgeschlossen', 'Nach der Satzung'],
      ],
      fuss: 'Vereinfachte Übersicht. Stand: 21.11.2026, nach Gesetz, Satzung der BGW und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'unfallversicherung-bgw-freiwillig-praxisinhaber-zahnaerzt-innen': [
    {
      typ: 'karten', nach: 'Bist du mit eigener Zahnarztpraxis gesetzlich unfallversichert?',
      titel: 'Wer in der Zahnarztpraxis bei der BGW versichert ist',
      karten: [
        { kopf: 'Angestelltes Team', punkte: ['Kraft Gesetzes versichert, auch angestellte Zahnärzt*innen'] },
        { kopf: 'Inhaberin oder Inhaber', punkte: ['Versicherungsfrei nach § 4 Abs. 3 SGB VII', 'Freiwillige Versicherung auf Antrag möglich'] },
        { kopf: 'Mitarbeitende Ehe- oder Lebenspartner*innen', punkte: ['Bei unentgeltlicher Mitarbeit freiwillige Versicherung möglich'] },
      ],
      fuss: 'Stand: 21.11.2026, nach SGB VII und Satzung der BGW, Fassung gültig ab 01.01.2026 (siehe Quellen).',
    },
    {
      typ: 'ablauf', nach: 'Welche Versicherungssumme ist sinnvoll?',
      titel: 'Fiktives Beispiel: 120.000 Euro Versicherungssumme',
      schritte: [
        { titel: 'Verletztengeld', text: '120.000 Euro geteilt durch 450 ergibt rund 266,67 Euro je Kalendertag' },
        { titel: 'Volle Rente', text: 'Zwei Drittel von 120.000 Euro ergeben 80.000 Euro im Jahr, rund 6.666,67 Euro im Monat' },
        { titel: 'Teilrente bei 30 Prozent', text: '30 Prozent der vollen Rente ergeben 24.000 Euro im Jahr, 2.000 Euro im Monat' },
      ],
      fuss: 'Fiktives Beispiel. Stand: 21.11.2026, nach Satzung und Merkblatt der BGW (siehe Quellen).',
    },
  ],
  'unfallversicherung-gliedertaxe-hand-finger-zahnaerzt-innen': [
    {
      typ: 'tabelle', nach: 'Warum sind Hand und Finger für Zahnärzt*innen so wichtig?',
      titel: 'Drei Gliedertaxen im Vergleich',
      spalten: ['Körperteil', 'Musterbedingungen', 'Verbessert, ohne Berufsbezug (Beispiel)', 'Heilberufe, Zahnärzt*innen (Beispiel)'],
      zeilen: [
        ['Hand', '55 %', '65 %', '100 %'],
        ['Daumen', '20 %', '25 %', '60 %'],
        ['Zeigefinger', '10 %', '15 %', '60 %'],
        ['Anderer Finger', '5 %', '10 %', '30 %'],
      ],
      fuss: 'Stand: 21.11.2026, nach Musterbedingungen des GDV und Versicherungsbedingungen (siehe Quellen). Dein Vertrag kann abweichen.',
    },
    {
      typ: 'ablauf', nach: 'Wie viel macht eine Gliedertaxe für Heilberufe aus?',
      titel: 'Fiktives Beispiel: Zeigefinger, 200.000 Euro Summe',
      schritte: [
        { titel: 'Musterbedingungen', text: '10 Prozent von 200.000 Euro ergeben 20.000 Euro' },
        { titel: 'Verbesserte Gliedertaxe', text: '15 Prozent von 200.000 Euro ergeben 30.000 Euro' },
        { titel: 'Gliedertaxe für Heilberufe', text: '60 Prozent von 200.000 Euro ergeben 120.000 Euro' },
      ],
      fuss: 'Fiktives Beispiel: Zeigefinger vollständig funktionsunfähig, keine Vorschädigung, keine Mitwirkung, keine Progression. Stand: 21.11.2026 (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'unfallversicherung-nadelstich-infektion-zahnaerzt-innen': [
    {
      typ: 'tabelle', nach: 'Was regelt eine Infektionsklausel für Heilberufe?',
      titel: 'Nadelstich: Musterbedingungen und Heilberufe-Klausel',
      spalten: ['', 'Musterbedingungen allgemein', 'Musterbedingungen für Heilberufe'],
      zeilen: [
        ['Infektion versichert?', 'Grundsätzlich ausgeschlossen, Ausnahmen etwa bei nicht nur geringfügiger Unfallverletzung', 'Ja, wenn bei der Berufsausübung infiziert'],
        ['Kleiner Stich', 'Geringfügig, wenn er ohne Infektion keine ärztliche Behandlung bräuchte', 'Reicht, wenn mindestens die äußere Hautschicht durchtrennt ist'],
        ['Fristen für die Invalidität', '15 Monate', '39 Monate'],
      ],
      fuss: 'Stand: 21.11.2026, nach Musterbedingungen des GDV (siehe Quellen). Dein Vertrag kann abweichen.',
    },
  ],
  'unfallversicherung-fristen-invaliditaet-zahnaerzt-innen': [
    {
      typ: 'ablauf', nach: 'Welche Fristen gelten für die Invaliditätsleistung?',
      titel: 'Nach dem Unfall: die Fristen der Musterbedingungen',
      schritte: [
        { titel: 'Unfalltag', text: 'Ärztin oder Arzt unverzüglich hinzuziehen, Versicherer unterrichten' },
        { titel: 'Bis 15 Monate', text: 'Invalidität eingetreten, schriftlich ärztlich festgestellt und beim Versicherer geltend gemacht' },
        { titel: 'Nach Eingang der Nachweise', text: 'Versicherer erklärt sich bei Invaliditätsleistung innerhalb von drei Monaten, zahlt dann binnen zwei Wochen' },
        { titel: 'Bis drei Jahre', text: 'Neubemessung des Invaliditätsgrads jährlich möglich' },
      ],
      fuss: 'Stand: 21.11.2026, nach Musterbedingungen des GDV (siehe Quellen). Dein Vertrag kann längere Fristen vorsehen.',
    },
  ],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function grafikHtml(g) {
  let innen = '';
  if (g.typ === 'tabelle') {
    const kopf = g.spalten.map((s) => `<th scope="col">${esc(s)}</th>`).join('');
    const zeilen = g.zeilen.map((z) => `<tr>${z.map((c, i) => (i === 0 ? `<th scope="row" data-label="${esc(g.spalten[0])}">${esc(c)}</th>` : `<td data-label="${esc(g.spalten[i])}">${esc(c)}</td>`)).join('')}</tr>`).join('');
    innen = `<div class="grafik-tabelle"><table><thead><tr>${kopf}</tr></thead><tbody>${zeilen}</tbody></table></div>`;
  } else if (g.typ === 'karten') {
    innen = `<ul class="grafik-karten">${g.karten.map((k, i) => `<li><p class="grafik-karte-kopf"><span class="grafik-nr" aria-hidden="true">${i + 1}</span>${esc(k.kopf)}</p><ul>${k.punkte.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></li>`).join('')}</ul>`;
  } else if (g.typ === 'ablauf') {
    innen = `<ol class="grafik-ablauf">${g.schritte.map((s) => `<li><p class="grafik-schritt-titel">${esc(s.titel)}</p><p>${esc(s.text)}</p></li>`).join('')}</ol>`;
  }
  return `<figure class="grafik grafik--${g.typ}"><figcaption class="grafik-titel">${esc(g.titel)}</figcaption>${innen}<p class="grafik-fuss">${esc(g.fuss)}</p></figure>`;
}

// Remark-Plugin: setzt die Grafiken einer Seite ans Ende des genannten Abschnitts.
function text(node) {
  return (node.children || []).map((c) => (c.type === 'text' || c.type === 'inlineCode' ? c.value : text(c))).join('');
}
export function remarkGrafiken() {
  return (tree, file) => {
    const pfad = String(file.path || file.history?.[0] || '');
    const m = pfad.match(/situationen\/([^/]+)\.md$/);
    if (!m) return;
    const liste = grafiken[m[1]];
    if (!liste) return;
    const norm = (s) => s.replace(/\\/g, '').trim();
    for (const g of liste) {
      const html = { type: 'html', value: grafikHtml(g) };
      const kinder = tree.children;
      if (g.nach === 'start') {
        const erstes = kinder.findIndex((n) => n.type === 'heading' && n.depth === 2);
        kinder.splice(erstes < 0 ? kinder.length : erstes, 0, html);
        continue;
      }
      const idx = kinder.findIndex((n) => n.type === 'heading' && n.depth === 2 && norm(text(n)) === norm(g.nach));
      if (idx < 0) throw new Error(`Grafik "${g.titel}": Abschnitt "${g.nach}" nicht gefunden (${m[1]})`);
      let ende = kinder.findIndex((n, i) => i > idx && n.type === 'heading' && n.depth <= 2);
      if (ende < 0) ende = kinder.length;
      kinder.splice(ende, 0, html);
    }
  };
}
