// Speicher für Buchungen. Demo: JSON-Datei. Live: Supabase (REST, nur mit Service-Key auf dem Server).
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { useSupabase, onNetlify, dataDir } from './env.mjs';

export const newToken = () => crypto.randomBytes(24).toString('base64url');
export const newId = () => crypto.randomUUID();

function conflict() {
  return Object.assign(new Error('conflict'), { code: 'CONFLICT' });
}

const overlaps = (a, b) => Date.parse(a.start_at) < Date.parse(b.end_at) && Date.parse(a.end_at) > Date.parse(b.start_at);

export function fileStore(dir = dataDir()) {
  const file = path.join(dir, 'bookings.json');
  let chain = Promise.resolve();
  const read = async () => {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8'));
    } catch {
      return [];
    }
  };
  const write = async (rows) => {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, JSON.stringify(rows, null, 2));
  };
  // alle Schreibzugriffe nacheinander, damit parallele Buchungen sich nicht überschreiben
  const locked = (fn) => (chain = chain.then(fn, fn));

  return {
    insert: (b) =>
      locked(async () => {
        const rows = await read();
        if (rows.some((r) => r.status === 'confirmed' && r.staff_id === b.staff_id && overlaps(r, b))) throw conflict();
        const row = { ...b, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        rows.push(row);
        await write(rows);
        return row;
      }),
    getByToken: async (token) => (await read()).find((r) => r.token === token) || null,
    update: (id, patch) =>
      locked(async () => {
        const rows = await read();
        const i = rows.findIndex((r) => r.id === id);
        if (i < 0) throw new Error('not_found');
        const next = { ...rows[i], ...patch };
        if (next.status === 'confirmed' && rows.some((r) => r.id !== id && r.status === 'confirmed' && r.staff_id === next.staff_id && overlaps(r, next))) throw conflict();
        rows[i] = { ...next, updated_at: new Date().toISOString() };
        await write(rows);
        return rows[i];
      }),
    listConfirmed: async (fromIso, toIso) =>
      (await read()).filter((r) => r.status === 'confirmed' && Date.parse(r.end_at) > Date.parse(fromIso) && Date.parse(r.start_at) < Date.parse(toIso)),
  };
}

export function supabaseStore(url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY) {
  const call = async (method, query, body) => {
    const res = await fetch(`${url}/rest/v1/bookings${query}`, {
      method,
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 409 || text.includes('23P01') || text.includes('23505')) throw conflict();
      throw new Error(`supabase_${res.status}: ${text}`);
    }
    return res.status === 204 ? null : res.json();
  };
  return {
    insert: async (b) => (await call('POST', '', b))[0],
    getByToken: async (token) => (await call('GET', `?token=eq.${encodeURIComponent(token)}&limit=1`))[0] || null,
    update: async (id, patch) => (await call('PATCH', `?id=eq.${id}`, { ...patch, updated_at: new Date().toISOString() }))[0],
    listConfirmed: (fromIso, toIso) =>
      call('GET', `?status=eq.confirmed&end_at=gt.${encodeURIComponent(fromIso)}&start_at=lt.${encodeURIComponent(toIso)}&order=start_at`),
  };
}

export function createStore() {
  if (useSupabase()) return supabaseStore();
  if (onNetlify()) throw new Error('SUPABASE_URL und SUPABASE_SERVICE_KEY fehlen: Ohne Datenbank gehen Buchungen auf Netlify verloren.');
  return fileStore();
}
