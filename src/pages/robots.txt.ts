import type { APIRoute } from 'astro';
import { indexierungErlaubt } from '../lib/status';

// Alle Bots zugelassen (Entscheidung des Inhabers). Sitemap nur, wenn Indexierung freigegeben ist.
export const GET: APIRoute = () => {
  const zeilen = ['User-agent: *', 'Allow: /'];
  if (indexierungErlaubt) zeilen.push('', 'Sitemap: https://zahnarzt-versicherungen.de/sitemap-index.xml');
  return new Response(zeilen.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
