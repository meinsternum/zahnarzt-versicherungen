// Regel-Prüfung der Ratgeberseiten (Regelwerk im Projekt: claude/regelwerk-inhalte.md).
// Aufruf: npm run pruefen            -> Bericht, Exit 0
//         npm run pruefen -- --streng -> Exit 1, wenn es Fehler gibt (für den Build)
// Fehler = Verstoß gegen eine feste Regel. Hinweis = Empfehlung für SEO/GEO und Conversion.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ORDNER = 'src/content/situationen';
const streng = process.argv.includes('--streng');
const alsMarkdown = process.argv.includes('--md');

const VERBOTEN = [
  'unabhängig', 'transparent', 'spezialisiert', 'premium', 'exklusiv', 'maßgeschneidert',
  'revolutionär', 'mehrwert', 'kostenlos und unverbindlich', 'garantiert', 'mein sternum',
];
// Prozess-Sprache gehört nicht in Titel, Kurzantwort und Meta-Beschreibung (Antwort zuerst).
const PROZESS = /(haben wir (keine|nicht)|nicht gefunden|keine[^.]{0,40}(gefunden|fanden)|wo wir keine)/i;

const dateien = fs.readdirSync(ORDNER).filter((f) => f.endsWith('.md'));
const seiten = dateien.map((datei) => {
  const roh = fs.readFileSync(path.join(ORDNER, datei), 'utf8');
  const m = roh.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { slug: datei.replace(/\.md$/, ''), fm: {}, text: roh, kaputt: true };
  return { slug: datei.replace(/\.md$/, ''), fm: yaml.load(m[1]) ?? {}, text: m[2] };
});
const slugs = new Set(seiten.map((s) => s.slug));
const ohneZitate = (t) => t.replace(/„[^“]*“/g, ' ').replace(/"[^"]*"/g, ' ');

const bericht = [];
for (const s of seiten) {
  const fehler = [];
  const hinweise = [];
  const { fm, text } = s;
  if (s.kaputt) fehler.push('Frontmatter nicht lesbar');
  const faq = fm.faq ?? [];
  const alles = [fm.frage, fm.titel, fm.kurzantwort, fm.metaDescription, text,
    ...faq.flatMap((f) => [f.frage, f.antwort])].filter(Boolean).join('\n');

  // Feste Regeln
  if ((fm.titel ?? '').length > 60) fehler.push(`Titel ${fm.titel.length} Zeichen (max. 60)`);
  if ((fm.metaDescription ?? '').length > 160) fehler.push(`Meta-Beschreibung ${fm.metaDescription.length} Zeichen (max. 160)`);
  for (const w of VERBOTEN) {
    if (alles.toLowerCase().includes(w)) fehler.push(`Verbotenes Wort: „${w}“`);
  }
  if (/\b(ich|mein(e|er|em|en)?|mir|mich)\b/i.test(ohneZitate(text).replace(/mein\*\*sternum\*\*|meinsternum/gi, ''))) {
    hinweise.push('Mögliche Ich-Form im Text (ich, mir, mein): prüfen, ob es eine Leserfrage ist');
  }
  if (!(fm.quellen ?? []).length) fehler.push('Keine Quellen');
  for (const q of fm.quellen ?? []) {
    const anonym = /eines Versicherers/.test(q.titel ?? '');
    if (!q.url && !anonym) fehler.push(`Quelle ohne URL: ${q.titel}`);
    if (anonym && !/Stand|abgerufen/.test(q.titel)) fehler.push(`Anonyme Quelle ohne Stand: ${q.titel}`);
  }
  for (const v of fm.verwandt ?? []) if (!slugs.has(v)) fehler.push(`verwandt zeigt auf unbekannte Seite: ${v}`);
  if (!/keine individuelle Beratung/i.test(text)) fehler.push('Pflichthinweis fehlt im Text');
  if (/[a-zäöüß]\*(?!\*)[a-zäöüß]/i.test(text.replace(/\\\*/g, '').replace(/\*\*[^*]+\*\*/g, ''))) {
    fehler.push('Gendersternchen im Fließtext nicht maskiert (\\*)');
  }
  for (const l of text.matchAll(/\]\(\/ratgeber\/([^)#]+)\)/g)) {
    if (!slugs.has(l[1].replace(/\/$/, ''))) fehler.push(`Interner Link ins Leere: ${l[1]}`);
  }
  if (/\[PRÜFEN/.test(alles)) fehler.push('[PRÜFEN]-Marker im Text');

  // Antwort zuerst, Zahnarzt-Bezug, Maschinenlesbarkeit
  const ka = fm.kurzantwort ?? '';
  if (PROZESS.test(ka)) fehler.push('Kurzantwort enthält Prozess-Sprache („nicht gefunden“) statt einer Antwort');
  if (PROZESS.test(fm.metaDescription ?? '') || PROZESS.test(fm.titel ?? '')) fehler.push('Titel oder Meta-Beschreibung mit Prozess-Sprache');
  if (ka.length > 320) hinweise.push(`Kurzantwort ${ka.length} Zeichen (Ziel 150 bis 320)`);
  if (!/zahn/i.test(`${fm.titel} ${fm.frage}`)) hinweise.push('„Zahnärzt*innen“ oder „Zahnarztpraxis“ fehlt in Titel und Frage');
  if (!/zahn|praxis/i.test(ka)) hinweise.push('Kurzantwort ohne Bezug zu Zahnärzt*innen oder Praxis');
  const zahnImText = (text.match(/zahn/gi) ?? []).length;
  if (zahnImText < 4) hinweise.push(`Nur ${zahnImText} zahnärztliche Bezüge im Text (Seite wirkt austauschbar)`);
  if (faq.length < 5 || faq.length > 8) hinweise.push(`${faq.length} FAQ (Ziel 5 bis 8)`);
  const h2 = [...text.matchAll(/^## (.+)$/gm)].map((x) => x[1].trim());
  const fragen = h2.filter((h) => h.endsWith('?')).length;
  if (h2.length && fragen / h2.length < 0.5) hinweise.push(`${fragen} von ${h2.length} Zwischenüberschriften sind Fragen (Ziel: mindestens die Hälfte)`);
  if (/„[^“]{12,}“(?!\]\()/.test(text) && /Seite[n]? „/.test(text)) hinweise.push('Seitentitel in Anführungszeichen statt als Link [Titel](/ratgeber/slug)');
  for (const v of fm.verwandt ?? []) {
    const ziel = seiten.find((x) => x.slug === v);
    if (ziel && !(ziel.fm.verwandt ?? []).includes(s.slug)) hinweise.push(`Gegenverweis fehlt: ${v} nennt diese Seite nicht`);
  }
  if (!fm.cta) hinweise.push('Kein themenspezifischer CTA (Feld cta)');
  const hw = fm.hinweise ?? [];
  if (hw.length > 2) fehler.push(`${hw.length} Handlungsaufrufe im Text (höchstens 2)`);
  if (!hw.length) hinweise.push('Kein Handlungsaufruf im Text (Feld hinweise, 1 bis 2)');
  if (hw.length === 2 && hw[0].art === hw[1].art) hinweise.push('Beide Handlungsaufrufe im Text haben dieselbe Art (abwechseln: einschaetzen/termin und mail/whatsapp)');
  if (/Bedingungswerk [A-Z]|Produktunterlage [A-Z]|vollständig gelesen|nennen wir nicht/.test(alles)) fehler.push('Interne Quellenbezeichnung auf der Seite (Bedingungswerk A, „vollständig gelesen“ …)');
  const faellig = fm.pruefenBis ?? (fm.stand ? `${Number(String(fm.stand).slice(0, 4)) + 1}${String(fm.stand).slice(4)}` : null);
  if (faellig && new Date(faellig) < new Date()) fehler.push(`Prüfung überfällig (fällig ${faellig})`);
  if (!fm.pruefenBis) hinweise.push('Feld pruefenBis fehlt (nächste Aktualitätsprüfung)');

  bericht.push({ slug: s.slug, status: fm.status ?? 'entwurf', stand: fm.stand ?? '', fehler, hinweise });
}

const summeF = bericht.reduce((n, b) => n + b.fehler.length, 0);
const summeH = bericht.reduce((n, b) => n + b.hinweise.length, 0);
if (alsMarkdown) {
  console.log(`| Seite | Status | Stand | Fehler | Hinweise |\n|---|---|---|---|---|`);
  for (const b of bericht) console.log(`| ${b.slug} | ${b.status} | ${b.stand} | ${b.fehler.join('; ') || '–'} | ${b.hinweise.join('; ') || '–'} |`);
} else {
  for (const b of bericht) {
    console.log(`\n${b.slug} (${b.status}, Stand ${b.stand})`);
    for (const f of b.fehler) console.log(`  FEHLER   ${f}`);
    for (const h of b.hinweise) console.log(`  Hinweis  ${h}`);
    if (!b.fehler.length && !b.hinweise.length) console.log('  in Ordnung');
  }
}
console.log(`\n${bericht.length} Seiten, ${summeF} Fehler, ${summeH} Hinweise.`);
if (streng && summeF > 0) process.exit(1);
