#!/usr/bin/env node
/* Bake the sculpted plush cast into assets/characters/<id>.glb (blueprint 6.2).
   Development tool, run by hand after changing design/visual-overhaul/lookdev/plush.js:

     cd tools && npm install          # three (exporter), meshoptimizer, gltfpack — dev only
     node tools/bake-characters.mjs   # from the repository root; needs Playwright + Chromium

   Each character is polygonised from its signed distance field in headless Chromium (tools/bake/),
   merged into two skinned meshes per level of detail, simplified to the budgets, exported as GLB and
   then quantised and meshopt-compressed with gltfpack (EXT_meshopt_compression). The game loads the
   results with GLTFLoader and the vendored meshopt decoder; nothing is polygonised on the iPad. */
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat, rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = path.join(ROOT, 'tools', 'node_modules');
const OUT = path.join(ROOT, 'assets', 'characters');
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const only = process.argv.slice(2);

const TYPES = {'.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.webp': 'image/webp', '.png': 'image/png', '.wasm': 'application/wasm', '.json': 'application/json'};
const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = url.startsWith('/__bake/') ? path.join(MODULES, url.slice(8)) : path.join(ROOT, url);
    if (!file.startsWith(ROOT)) throw new Error('outside');
    res.writeHead(200, {'content-type': TYPES[path.extname(file)] || 'application/octet-stream'}); res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page:', e.message));
  await page.goto(base + '/tools/bake/bake.html');
  await page.waitForFunction(() => window.bakeReady, null, {timeout: 60000});
  await mkdir(OUT, {recursive: true});
  const ids = only.length ? only : ['fox', 'squirrel', 'bird', 'owl', 'mouse', 'beaver', 'mailman'];
  let total = 0;
  for (const id of ids) {
    const t0 = Date.now();
    const {report, base64} = await page.evaluate(id => window.bake(id), id);
    const raw = path.join(OUT, id + '.raw.glb'), out = path.join(OUT, id + '.glb');
    await writeFile(raw, Buffer.from(base64, 'base64'));
    // quantise and compress; keep named nodes (the joints) and the two named materials
    execFileSync(process.execPath, [path.join(MODULES, 'gltfpack', 'cli.js'), '-i', raw, '-o', out, '-cc', '-kn', '-km', '-kv', '-vp', '12', '-vc', '8', '-vtf'], {stdio: 'pipe'});
    await rm(raw);
    const size = (await stat(out)).size; total += size;
    console.log(`${id.padEnd(9)} ${(size / 1024).toFixed(1).padStart(6)} KB  lod0 ${report.lod0.fur + report.lod0.gloss} tris (from ${report.lod0.source})  lod1 ${report.lod1.fur + report.lod1.gloss}  ${Date.now() - t0} ms`);
  }
  console.log(`total     ${(total / 1024).toFixed(1).padStart(6)} KB`);
} finally { await browser.close(); server.close(); }
