// Netlify setzt CONTEXT=production nur beim Live-Build der Hauptseite.
// Vorschau-Builds und lokale Builds zeigen auch Entwürfe.
import indexierung from '../../indexierung.json';
// Solange false: auch die Live-Seite trägt noindex, keine Sitemap. Schalter in indexierung.json.
export const indexierungErlaubt: boolean = indexierung.erlaubt;

export const isProduction = process.env.CONTEXT === 'production';

type Item = { data: { status: string; kurzantwort?: string; faq?: { frage: string; antwort: string }[] }; body?: string; id: string };

export function visible<T extends Item>(items: T[]): T[] {
  if (!isProduction) return items;
  const live = items.filter((i) => i.data.status === 'freigegeben');
  // Sicherung: Freigegebene Seiten dürfen keine offenen Prüfmarker enthalten.
  for (const i of live) {
    const text = [i.body ?? '', i.data.kurzantwort ?? '', ...(i.data.faq ?? []).map((f) => f.antwort)].join('\n');
    if (text.includes('[PRÜFEN')) {
      throw new Error(`Seite "${i.id}" ist freigegeben, enthält aber noch [PRÜFEN]-Marker. Build abgebrochen.`);
    }
  }
  return live;
}
