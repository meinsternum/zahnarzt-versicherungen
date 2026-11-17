// Kontaktwege als reines JS, damit sie auch im Markdown-Plugin (astro.config) nutzbar sind.
// Patrick setzt die endgültige Buchungs-URL später ein; bis dahin Buchungsseite von meinsternum.de.
export const TERMIN_URL = 'https://meinsternum.de/online-buchen';
export const EMAIL = 'hallo@meinsternum.de';
export const WHATSAPP_URL = 'https://wa.me/4922198654436';

// Termin-Link mit Kennung der Seite (Messung, Regelwerk Abschnitt „Messung“).
export function terminLink(kampagne) {
  if (!kampagne) return TERMIN_URL;
  const p = new URLSearchParams({ utm_source: 'zahnarzt-versicherungen', utm_medium: 'website', utm_campaign: kampagne });
  return `${TERMIN_URL}?${p}`;
}
export function mailLink(betreff) {
  return `mailto:${EMAIL}${betreff ? `?subject=${encodeURIComponent(betreff)}` : ''}`;
}
