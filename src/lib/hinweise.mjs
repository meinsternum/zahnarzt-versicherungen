// Handlungsaufrufe im Text (Feld `hinweise` im Frontmatter, höchstens 2 je Seite).
// Jeder Hinweis steht als <aside> am Ende des genannten H2-Abschnitts, nie in Kurzantwort oder FAQ.
// art: termin (Erstgespräch), einschaetzen (Situation einschätzen lassen, ebenfalls Termin), mail (Frage per E-Mail), whatsapp (kurze Frage).
import { terminLink, mailLink, WHATSAPP_URL } from './kontakt.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const STANDARD = {
  termin: 'Erstgespräch buchen',
  einschaetzen: 'Situation einschätzen lassen',
  mail: 'Frage per E-Mail stellen',
  whatsapp: 'Kurz per WhatsApp fragen',
};

export function hinweisHtml(h, slug, titel) {
  const art = STANDARD[h.art] ? h.art : 'termin';
  const href = art === 'mail' ? mailLink(`Frage zu: ${titel}`) : art === 'whatsapp' ? WHATSAPP_URL : terminLink(slug);
  const knopf = h.button || STANDARD[art];
  return `<aside class="zwischen-cta zwischen-cta--${art}" aria-label="${esc(knopf)}"><p>${esc(h.text)}</p><a class="knopf knopf-klein${art === 'mail' || art === 'whatsapp' ? ' knopf-rand' : ''}" href="${esc(href)}">${esc(knopf)}</a></aside>`;
}

function text(node) {
  return (node.children || []).map((c) => (c.type === 'text' || c.type === 'inlineCode' ? c.value : text(c))).join('');
}
export function remarkHinweise() {
  return (tree, file) => {
    const pfad = String(file.path || file.history?.[0] || '');
    const m = pfad.match(/situationen\/([^/]+)\.md$/);
    if (!m) return;
    const fm = file.data?.astro?.frontmatter ?? {};
    const liste = fm.hinweise ?? [];
    if (liste.length > 2) throw new Error(`${m[1]}: höchstens 2 Hinweise im Text erlaubt`);
    const norm = (s) => s.replace(/\\/g, '').trim();
    for (const h of liste) {
      const kinder = tree.children;
      const idx = kinder.findIndex((n) => n.type === 'heading' && n.depth === 2 && norm(text(n)) === norm(h.nach));
      if (idx < 0) throw new Error(`Hinweis: Abschnitt "${h.nach}" nicht gefunden (${m[1]})`);
      let ende = kinder.findIndex((n, i) => i > idx && n.type === 'heading' && n.depth <= 2);
      if (ende < 0) ende = kinder.length;
      kinder.splice(ende, 0, { type: 'html', value: hinweisHtml(h, m[1], fm.titel ?? '') });
    }
  };
}
