import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
const indexierung = JSON.parse(readFileSync(new URL('./indexierung.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://zahnarzt-versicherungen.de',
  integrations: [sitemap({ filter: () => indexierung.erlaubt })],
  trailingSlash: 'never',
  build: { format: 'file' },
});
