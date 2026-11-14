// Inhalte der Startseite, gemeinsam für Entwurf A und B (gleiche Inhalte, gleiche Conversion-Logik).
// entwurf: true = neuer Text, wartet auf Freigabe durch Patrick.
// Quelle: Herkunft des Wortlauts (bestehende Startseite, Über-uns-Seite, Pflichthinweis).

export const hero = {
  h1: 'Absicherung für Zahnärzt*innen: Antworten auf konkrete Fragen', // bestehende Startseite
  lead: {
    text: 'zahnarzt-versicherungen.de ist ein Ratgeber der MEIN STERNUM Finanzberatung GmbH aus Köln. Hier findest du Antworten auf konkrete Fragen von Zahnärzt*innen zur Absicherung: kurz beantwortet, mit Quellen und dem Datum der letzten Prüfung.',
    entwurf: true,
  },
  cta: 'Erstgespräch buchen', // bestehende Startseite
  zweit: 'Zu den Fragen', // bestehende Startseite
};

export const themen = {
  h2: 'Fragen nach Thema',
  entwurf: true,
};

export const ablauf = {
  h2: 'So arbeiten wir',
  entwurf: true,
  schritte: [
    {
      titel: 'Termin wählen',
      // Angaben von Patrick, 13.11.2026
      text: 'Du suchst dir online einen Termin für das Erstgespräch aus. Es ist kostenlos und dauert in der Regel etwa eine Stunde.',
    },
    {
      titel: 'Gespräch',
      // Wortlaut nach bestehender Startseite
      text: 'Wir gehen deine Situation in Ruhe gemeinsam durch, per Zoom, telefonisch oder vor Ort in Köln.',
    },
    {
      titel: 'Empfehlung mit Begründung',
      // Wortlaut nach bestehender Startseite, Zeitpunkt und Form von Patrick, 13.11.2026
      text: 'Nach dem Gespräch bekommst du per E-Mail eine verständliche Übersicht: konkrete Empfehlungen und jeweils, warum wir sie dir geben. Entscheiden kannst du danach in Ruhe.',
    },
  ],
};

export const werWirSind = {
  h2: 'Wer wir sind',
  // Wortlaut aus der Über-uns-Seite (freigegeben 12.11.2026); im zweiten Absatz Firmenname durch
  // „das Unternehmen“ ersetzt, damit MEIN STERNUM nicht zu oft erscheint (Patrick, 13.11.2026).
  entwurf: true,
  absaetze: [
    'zahnarzt-versicherungen.de ist ein Angebot der MEIN STERNUM Finanzberatung GmbH aus Köln. Wir beraten Ärzt*innen in allen Karrierephasen zu Versicherungen, Finanzanlagen, Finanzierung und Niederlassung.',
    'Patrick Senn hat das Unternehmen 2015 mitgegründet und ist seitdem Geschäftsführer. Ärzt*innen berät er seit 2008, angefangen als Berater bei der HORBACH Wirtschaftsberatung in Köln. Er schreibt und verantwortet die Texte auf dieser Seite.',
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
      antwort: 'Du buchst online einen Termin. Das Erstgespräch ist kostenlos, dauert in der Regel etwa eine Stunde und findet digital per Zoom, telefonisch oder vor Ort in Köln statt. Die Empfehlungen erhältst du danach per E-Mail.',
    },
  ],
};

export const abschluss = {
  h2: 'Nächste Schritte', // bestehende Startseite
  text: 'Eine Ratgeberseite kann vieles erklären, aber nicht deine persönliche Situation. Die gehen wir im Erstgespräch gemeinsam durch.', // Stil-Skill, Entwurf zur Freigabe 14.11.2026
};
