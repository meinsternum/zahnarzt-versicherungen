// Inhalte der Startseite, gemeinsam für Entwurf A und B (gleiche Inhalte, gleiche Conversion-Logik).
// entwurf: true = neuer Text, wartet auf Freigabe durch Patrick.
// Quelle: Herkunft des Wortlauts (bestehende Startseite, Über-uns-Seite, Pflichthinweis).

export const hero = {
  h1: 'Absicherung für Zahnärzt*innen: Antworten auf konkrete Fragen', // bestehende Startseite
  lead: {
    text: 'zahnarzt-versicherungen.de ist ein Ratgeber der MEIN STERNUM Finanzberatung GmbH aus Köln. Er beantwortet Fragen von Zahnärzt*innen zur Absicherung, derzeit zur Berufsunfähigkeit, mit Quellen und dem Datum der letzten Prüfung.',
    entwurf: true,
  },
  cta: 'Erstgespräch buchen', // bestehende Startseite
  zweit: 'Zu den Fragen', // bestehende Startseite
};

export const themen = {
  h2: 'Fragen nach Berufsphase', // bestehende Startseite
};

export const ablauf = {
  h2: 'So arbeiten wir',
  entwurf: true,
  schritte: [
    {
      titel: 'Termin wählen',
      text: 'Du buchst online einen Termin für ein Erstgespräch.',
      platzhalter: 'Dauer des Erstgesprächs und ob Kosten entstehen',
    },
    {
      titel: 'Gespräch',
      // Wortlaut nach bestehender Startseite
      text: 'Wir gehen deine Situation gemeinsam durch, digital per Zoom, telefonisch oder vor Ort in Köln.',
    },
    {
      titel: 'Empfehlung mit Begründung',
      // Wortlaut nach bestehender Startseite
      text: 'Du erhältst eine verständliche Übersicht mit konkreten Empfehlungen und der Begründung dazu.',
      platzhalter: 'Form und Zeitpunkt, z. B. schriftlich nach dem Gespräch',
    },
  ],
};

export const werWirSind = {
  h2: 'Wer wir sind',
  // Wortlaut aus der Über-uns-Seite (freigegeben 12.11.2026)
  absaetze: [
    'zahnarzt-versicherungen.de ist ein Angebot der MEIN STERNUM Finanzberatung GmbH aus Köln. Wir beraten Ärzt*innen in allen Karrierephasen zu Versicherungen, Finanzanlagen, Finanzierung und Niederlassung.',
    'Patrick Senn hat die MEIN STERNUM Finanzberatung GmbH 2015 mitgegründet und ist seitdem Geschäftsführer. Er hat 2008 als Berater bei der HORBACH Wirtschaftsberatung in Köln begonnen und berät seitdem Ärzt*innen. Er schreibt und verantwortet die Texte auf dieser Seite.',
  ],
  link: 'Mehr über Patrick Senn und das Team', // bestehende Startseite
};

export const faq = {
  h2: 'Häufige Fragen',
  entwurf: true,
  eintraege: [
    {
      frage: 'Wer steht hinter zahnarzt-versicherungen.de?',
      antwort: 'Die MEIN STERNUM Finanzberatung GmbH aus Köln. Geschäftsführer Patrick Senn schreibt und verantwortet die Texte auf dieser Seite.',
    },
    {
      frage: 'Woher stammen die Angaben auf den Seiten?',
      antwort: 'Die fachlichen Aussagen stützen sich auf Gesetze, Satzungen und weitere Primärquellen. Jede Seite nennt ihre Quellen und das Datum der letzten Prüfung.',
    },
    {
      frage: 'Ersetzen die Seiten eine Beratung?',
      antwort: 'Nein. Die Inhalte sind allgemeine Informationen und ersetzen keine individuelle Beratung.',
    },
    {
      frage: 'Wie läuft ein Gespräch ab?',
      antwort: 'Du buchst online einen Termin. Das Gespräch findet digital per Zoom, telefonisch oder vor Ort in Köln statt.',
    },
  ],
};

export const abschluss = {
  h2: 'Nächste Schritte', // bestehende Startseite
  text: 'Persönliche Fragen klären wir im Gespräch. Im Erstgespräch gehen wir deine Situation gemeinsam durch.', // bestehende Startseite
};
