// Minimal static file server, no dependencies.
// Browsers refuse to load modules and models from file://, hence this server.
// Usage: node serve.js [port]

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.argv[2]) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.bin': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const filePath = normalize(join(root, urlPath === '/' ? 'index.html' : urlPath));
  if (filePath !== root && !filePath.startsWith(root + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(port, () => {
  console.log(`Space Station running at http://localhost:${port}`);
});
