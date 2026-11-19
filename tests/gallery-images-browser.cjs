/* Download actual gallery images and compare their framing and pixels against the packed atlases. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/cua_node/lib/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const sharp = require('../tools/node_modules/sharp');
const library = require('../assets/waldatelier/library.json');
const repair = require('../design/illustrations/library-repair-2026-11-18.json');
const rose = require('../design/illustrations/rose-repair-2026-11-18.json');
const garden = require('../design/illustrations/puzzle-garden.json');
const base = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
const out = process.env.FARBTUPF_SHOTS || '/tmp/waldpost-gallery-images';
const root = path.resolve(__dirname, '..');
fs.mkdirSync(out, { recursive: true });

function framing(data, width, height) {
  let corners = 0, visible = 0, left = width, top = height, right = 0, bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if ((x < 20 || x >= width - 20) && (y < 20 || y >= height - 20)) corners = Math.max(corners, alpha);
      if (alpha < 32) continue;
      visible++;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  return {
    corners, visible,
    extent: Math.max((right - left + 1) / width, (bottom - top + 1) / height),
    centre: [(left + right + 1) / (2 * width), (top + bottom + 1) / (2 * height)]
  };
}

function expectedCell({ data, info }, rect, width, height) {
  // Match the fractional source rectangles of older sheets by sampling at pixel centres.
  const axis = (start, span, count, limit) => Array.from({ length: count }, (_, index) => {
    const centre = Math.max(0, Math.min(limit - 1, start + (index + 0.5) * span / count - 0.5));
    const first = Math.floor(centre);
    return { first, second: Math.min(first + 1, limit - 1), weight: centre - first };
  });
  const columns = axis(rect.x, rect.width, width, info.width);
  const rows = axis(rect.y, rect.height, height, info.height);
  const expected = Buffer.alloc(width * height * 3);
  let offset = 0;
  for (const y of rows) {
    for (const x of columns) {
      const top = (y.first * info.width + x.first) * 3;
      const bottom = (y.second * info.width + x.first) * 3;
      const stride = (x.second - x.first) * 3;
      for (let channel = 0; channel < 3; channel++) {
        const a = data[top + channel] * (1 - x.weight) + data[top + stride + channel] * x.weight;
        const b = data[bottom + channel] * (1 - x.weight) + data[bottom + stride + channel] * x.weight;
        expected[offset++] = Math.round(a * (1 - y.weight) + b * y.weight);
      }
    }
  }
  return expected;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  try {
    const context = await browser.newContext({ viewport: { width: 1080, height: 810 }, serviceWorkers: 'block', acceptDownloads: true });
    await context.addInitScript(() => {
      localStorage.setItem('gallery-storage-fixture', 'retained');
      // Collect the real export blobs without triggering Chromium's bulk-download limits.
      const click = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (!this.download || !this.href.startsWith('blob:')) return click.call(this);
        const filename = this.download;
        window.galleryExport = fetch(this.href).then(response => response.blob()).then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ filename, url: reader.result });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        }));
        if (window.allowGalleryDownload) click.call(this);
      };
    });
    const page = await context.newPage();
    const errors = [], report = [];
    const focalSheets = new Set(['forest-actions', 'forest-wildlife', 'rhyme-vocabulary', 'puzzle-vocabulary', 'animals', ...library.sheets.filter(s => s.id.startsWith('expansion-')).map(s => s.id)]);
    const originalSheets = new Set(['forest-actions', 'forest-objects', 'puzzle-flowers', 'review-nature']);
    const downloaded = new Set(['cat', 'cat-sit', 'dog', 'forest-lynx', 'rhyme-fly', 'forest-rose', 'firefly', 'watering-can']);
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/assets/waldatelier/');
    await page.waitForFunction(total => document.querySelector('#count').textContent.includes(String(total)), library.images.length);
    await page.getByLabel('Transparenzraster zeigen', { exact: true }).check();
    const search = page.getByLabel('Bildname oder ID', { exact: true });
    for (const sheet of library.sheets) {
      const repaired = new Set([...repair.sheets[sheet.id]?.ids || [], ...rose.sheets[sheet.id]?.ids || [],
        ...(sheet.id === 'puzzle-garden' ? garden.subjects.map(item => item.id) : []),
        ...(sheet.id.startsWith('expansion-') ? library.images.filter(item => item.sheet === sheet.id).map(item => item.id) : [])]);
      if (!repaired.size && !originalSheets.has(sheet.id)) continue;
      await page.getByLabel('Bildbogen', { exact: true }).selectOption(sheet.id);
      const entries = library.images.filter(item => item.sheet === sheet.id);
      assert.equal(await page.locator('.image-card').count(), entries.length);
      assert.match(await page.locator('.picture').first().evaluate(el => el.style.backgroundImage), new RegExp(sheet.sha256.slice(0, 16)));
      const atlas = await sharp(path.join(root, 'assets/waldatelier', sheet.file))
        .flatten({ background: '#fffaf0' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      if (focalSheets.has(sheet.id)) {
        await page.evaluate(async url => { const img = new Image(); img.src = url; await img.decode(); }, sheet.file + '?v=' + sheet.sha256.slice(0, 16));
        await page.screenshot({ path: out + '/' + sheet.id + '-1080.png', fullPage: true });
      }
      for (const entry of entries.filter(item => repaired.has(item.id) || originalSheets.has(sheet.id))) {
        await search.fill(entry.id);
        const card = page.locator('[data-image="' + entry.id + '"]');
        assert.equal(await card.count(), 1, entry.id);
        const realDownload = downloaded.has(entry.id);
        await page.evaluate(allow => {
          window.allowGalleryDownload = allow;
          window.galleryExport = null;
        }, realDownload);
        const pending = realDownload ? page.waitForEvent('download', { timeout: 15000 }) : null;
        await card.locator('.actions button').last().click();
        await page.waitForFunction(() => window.galleryExport !== null, null, { timeout: 15000 });
        const { filename, url } = await page.evaluate(() => window.galleryExport);
        assert.equal(filename, entry.id + '.png');
        assert.ok(url.startsWith('data:image/png;base64,'));
        const file = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
        if (pending) {
          const download = await pending;
          assert.equal(download.suggestedFilename(), filename);
          assert.deepEqual(fs.readFileSync(await download.path()), file);
        }
        const metadata = await sharp(file).metadata();
        const rect = entry.sourceRect;
        const width = Math.ceil(rect.width), height = Math.ceil(rect.height);
        assert.equal(metadata.format, 'png');
        assert.equal(metadata.width, width);
        assert.equal(metadata.height, height);
        assert.equal(metadata.hasAlpha, true);
        const actual = await sharp(file).flatten({ background: '#fffaf0' }).removeAlpha().raw().toBuffer();
        const expected = expectedCell(atlas, rect, width, height);
        let difference = 0;
        for (let i = 0; i < actual.length; i++) difference += Math.abs(actual[i] - expected[i]);
        const meanPixelError = difference / actual.length;
        assert.ok(meanPixelError < 2.5, entry.id + ' PNG matches its atlas cell: ' + meanPixelError);
        const pixels = await sharp(file).ensureAlpha().raw().toBuffer();
        const frame = framing(pixels, width, height);
        assert.ok(frame.visible > 1000, entry.id + ' is not empty');
        if (repaired.has(entry.id)) {
          assert.ok(frame.corners < 12, entry.id + ' has clean transparent corners: ' + frame.corners);
          assert.ok(Math.abs(frame.extent - repair.framing.longestSideRatio) < 0.018, entry.id + ' consistent subject scale');
          assert.ok(frame.centre.every((value, index) => Math.abs(value - repair.framing.centre[index]) < 0.012), entry.id + ' centred subject');
        } else {
          assert.equal(frame.corners, 0, entry.id + ' clean transparent corners');
        }
        report.push({ id: entry.id, meanPixelError, ...frame });
      }
      await search.fill('');
      await page.setViewportSize({ width: 390, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);
      if (focalSheets.has(sheet.id)) await page.screenshot({ path: out + '/' + sheet.id + '-390.png' });
      await page.setViewportSize({ width: 1080, height: 810 });
    }
    assert.deepEqual(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage))), { 'gallery-storage-fixture': 'retained' });
    assert.deepEqual(errors, []);
    fs.writeFileSync(out + '/report.json', JSON.stringify({ images: report, storageUnchanged: true, errors }, null, 2) + '\n');
    await context.close();
    console.log('PASS ' + report.length + ' transparent PNG exports, ' + downloaded.size + ' browser downloads, repaired cell framing and phone/tablet gallery.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
