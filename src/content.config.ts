import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const situationen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/situationen' }),
  schema: z.object({
    frage: z.string(),
    kurzantwort: z.string(),
    metaDescription: z.string().max(170),
    // entwurf = nur in Vorschau sichtbar, freigegeben = geht live
    status: z.enum(['entwurf', 'freigegeben']).default('entwurf'),
    stand: z.string(), // Datum der letzten fachlichen Prüfung, z. B. 2026-11-12
    quellen: z.array(z.object({ titel: z.string(), url: z.string().optional() })).default([]),
    faq: z.array(z.object({ frage: z.string(), antwort: z.string() })).default([]),
    verwandt: z.array(z.string()).default([]),
  }),
});

const rechtliches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rechtliches' }),
  schema: z.object({
    titel: z.string(),
    status: z.enum(['entwurf', 'freigegeben']).default('entwurf'),
  }),
});

export const collections = { situationen, rechtliches };
