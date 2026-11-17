import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const situationen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/situationen' }),
  schema: z.object({
    frage: z.string(),
    titel: z.string().max(60), // kurzer Seitentitel für Suchergebnisse
    kurzantwort: z.string(),
    metaDescription: z.string().max(170),
    // entwurf = Text ungeprüft, geprueft = Inhalts-Chat hat geprüft (nur Vorschau), freigegeben = geht live
    status: z.enum(['entwurf', 'geprueft', 'freigegeben']).default('entwurf'),
    stand: z.string(), // Datum der letzten fachlichen Prüfung, z. B. 2026-11-12
    quellen: z.array(z.object({ titel: z.string(), url: z.string().optional() })).default([]),
    faq: z.array(z.object({ frage: z.string(), antwort: z.string() })).default([]),
    verwandt: z.array(z.string()).default([]),
    reihenfolge: z.number().default(99),
    // Themenspezifischer Termin-Block (Regelwerk „Conversion“). Fehlt er, gilt der Standardtext.
    cta: z.object({ titel: z.string().max(70), text: z.string().max(220), button: z.string().max(30).optional() }).optional(),
    // Nächste Aktualitätsprüfung (JJJJ-MM-TT). Bei Jahreswerten spätestens der 15.01. des Folgejahres.
    pruefenBis: z.string().optional(),
    // Handlungsaufrufe im Text (höchstens 2, am Ende des genannten H2-Abschnitts; src/lib/hinweise.mjs).
    hinweise: z.array(z.object({
      nach: z.string(),
      art: z.enum(['termin', 'einschaetzen', 'mail', 'whatsapp']),
      text: z.string().max(200),
      button: z.string().max(34).optional(),
    })).max(2).default([]),
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
