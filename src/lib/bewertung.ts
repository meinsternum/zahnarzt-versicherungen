// Google-Bewertungen von MEIN STERNUM (Google Business Profile, Köln).
// Beim Build werden Schnitt und Anzahl über die Google Places API geladen, wenn die Umgebungsvariable
// GOOGLE_PLACES_API_KEY gesetzt ist (Netlify > Site configuration > Environment variables).
// Ohne Schlüssel oder bei einem Fehler gelten die Werte unten (zuletzt geprüft am 17.11.2026: 5,0 bei 82).
// Die Abfrage läuft nur beim Bauen, Besucher*innen laden nichts von Google (kein Widget, keine Cookies).
// Täglicher Neubau: .github/workflows/bewertung-taeglich.yml (Netlify-Build-Hook als GitHub-Secret).
const PLACE_ID = 'ChIJt1gykQUlv0cR9H-KWSmNHfg';
const FALLBACK = { wert: '5,0', anzahl: 82 };

async function laden() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return FALLBACK;
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = (await r.json()) as { rating?: number; userRatingCount?: number };
    if (typeof d.rating !== 'number' || typeof d.userRatingCount !== 'number') throw new Error('unvollständig');
    return { wert: d.rating.toFixed(1).replace('.', ','), anzahl: d.userRatingCount };
  } catch (e) {
    console.warn(`[bewertung] Google-Abruf fehlgeschlagen, nutze gespeicherte Werte: ${e}`);
    return FALLBACK;
  }
}

export const bewertung = {
  ...(await laden()),
  url: 'https://www.google.com/maps?cid=17878601304466161652',
};
