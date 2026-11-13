import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
const indexierung = JSON.parse(readFileSync(new URL('./indexierung.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://zahnarzt-versicherungen.de',
  // Entwurfsseiten (/entwurf-*) nie in der Sitemap.
  integrations: [sitemap({ filter: (page) => indexierung.erlaubt && !/\/(entwurf-|404)/.test(page) })],
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' }, // CSS inline: keine render-blockierenden Anfragen
});
