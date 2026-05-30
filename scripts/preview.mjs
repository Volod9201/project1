import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
const root = path.join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  let file = path.join(root, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!existsSync(file) || statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`Neon Drift preview: http://localhost:${port}`));
