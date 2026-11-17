// Lokaler Testserver ohne Netlify CLI: statische Dateien aus public/ plus die API-Funktion.
// Start: npm run termin:dev  -> http://localhost:8888 (Demo-Modus, simulierte Kalender, Mails landen in .data/outbox)
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import handler from '../netlify/functions/api.mjs';

const PUBLIC = path.join(process.cwd(), 'public', 'termin-test');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const port = Number(process.env.PORT || 8888);

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const r = await handler(new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body }));
      res.writeHead(r.status, Object.fromEntries(r.headers));
      return res.end(Buffer.from(await r.arrayBuffer()));
    }
    let rel = url.pathname.replace(/^\/termin-test/, '') || '/';
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC)) return res.writeHead(403).end();
    try {
      const data = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404).end('Nicht gefunden');
    }
  })
  .listen(port, () => console.log(`Demo läuft auf http://localhost:${port}/termin-test/`));
