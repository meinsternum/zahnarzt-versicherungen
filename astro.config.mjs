import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkGrafiken } from './src/lib/grafiken.mjs';
import { remarkHinweise } from './src/lib/hinweise.mjs';
import { readFileSync } from 'node:fs';
const indexierung = JSON.parse(readFileSync(new URL('./indexierung.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://zahnarzt-versicherungen.de',
  // Entwurfsseiten (/entwurf-*) nie in der Sitemap.
  integrations: [sitemap({ filter: (page) => indexierung.erlaubt && !/\/(entwurf-|404)/.test(page) })],
  markdown: { remarkPlugins: [remarkGrafiken, remarkHinweise] }, // Hinweise = Handlungsaufrufe im Text (src/lib/hinweise.mjs); // erklärende Grafiken je Seite (src/lib/grafiken.mjs)
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' }, // CSS inline: keine render-blockierenden Anfragen
});
