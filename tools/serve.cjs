const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const portArg = process.argv.find(a => a.startsWith('--port='));
const port = Number(portArg ? portArg.slice(7) : 2051);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid port');
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.wasm':'application/wasm','.splinecode':'application/octet-stream'};
const server = http.createServer((req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end(); return; }
  if (pathname === '/') { res.writeHead(302, {Location:'/index.html'}); res.end(); return; }
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) { file = path.join(file, 'index.html'); }
    fs.stat(file, (error, info) => {
      if (error || !info.isFile()) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, {'Content-Type':types[path.extname(file).toLowerCase()] || 'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
    });
  });
});
server.on('error', e => { console.error('Cannot start BLOOM: ' + e.message); console.error('Try: node tools/serve.cjs --port=2052'); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}/index.html`;
  console.log('BLOOM: ' + url + '\nKeep this window open. Press Ctrl+C to stop.');
  if (!process.argv.includes('--no-open')) {
    if (process.platform === 'win32') spawn('cmd', ['/c','start','',url], {windowsHide:true, stdio:'ignore'}).on('error', () => {});
    else console.log('Open the address above in your browser.');
  }
});
