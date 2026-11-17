// Schreibweise der Marke auf der Seite (Patrick, 16.11.2026): „meinsternum“ klein, „sternum“ fett.
// Rechtstexte (Impressum, Erstinformation, Datenschutz) und Schema behalten den Firmennamen
// „MEIN STERNUM Finanzberatung GmbH“ unverändert.
export const MARKE_HTML = '<span class="ms">mein<strong>sternum</strong></span>';
export const MARKE_TEXT = 'meinsternum';

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Text sicher escapen und jedes „MEIN STERNUM“ als Marke ausgeben (für set:html). */
export const mitMarke = (t: string) => esc(t).replace(/MEIN[\s ]STERNUM/g, MARKE_HTML);
/** Für reinen Text (Alt-Texte, Meta): „MEIN STERNUM“ → „meinsternum“. */
export const markeText = (t: string) => t.replace(/MEIN[\s ]STERNUM/g, MARKE_TEXT);
