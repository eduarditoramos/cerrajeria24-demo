import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png' };
http.createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = path === '/' ? 'index.html' : path.slice(1);
    if (relative.split('/').some(part => part.startsWith('.'))) throw new Error('Invalid path');
    let file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
    if (root.endsWith('/cerra24demo') && (relative.startsWith('assets/') || relative === 'robots.txt' || relative === 'manus-routes.json')) file = resolve(root, 'public', relative);
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' });
    res.end('No encontrado');
  }
}).listen(port, '0.0.0.0', () => console.log(`Cerrajería 24 escuchando en 0.0.0.0:${port}`));
