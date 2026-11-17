const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const FK = { settings: { get: () => undefined } };
const context = {
  window: { FK }, document: { body: {} },
  Image: class { set src(value) { this.url = value; this.complete = true; this.naturalWidth = this.naturalHeight = 1254; this.onload(); } },
  MutationObserver: class { observe() {} },
};
for (const path of ['js/ui/waldatelier.js', 'js/learn/glyphs.js']) {
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), context, { filename: path });
}
test('every current handwriting picture has matching custom artwork', () => {
  for (const glyph of Object.values(FK.glyphs.data)) assert.ok(FK.visual.supports(glyph.emoji), glyph.word + ' has no picture');
  assert.notEqual(FK.visual.tokens['🐝'], FK.visual.tokens['🕷️']);
  assert.notEqual(FK.visual.tokens['🌲'], FK.visual.tokens['🌳']);
  assert.notEqual(FK.visual.tokens['🍌'], FK.visual.tokens['🥕']);
});
test('current library pictures draw from their atlas cells within the bounded canvas cache', async () => {
  for (const id of Object.keys(FK.visual.subjects)) {
    await FK.visual.load([id]);
    let drawn = false;
    assert.equal(FK.visual.draw(id, { drawImage: () => { drawn = true; } }, 0, 0, 128), true, id);
    assert.ok(drawn, id);
    assert.ok(FK.visual.loadedSheets().length <= 6, FK.visual.loadedSheets().join());
  }
});
test('every production illustration is available offline', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const sheets = new Map(Object.values(FK.visual.subjects).map(subject => [subject.sheet, subject]));
  for (const [sheet, {columns, rows}] of sheets) {
    const file = FK.visual.source(sheet);
    const bytes = fs.readFileSync(file);
    // PNG sheets, or the master cast's WebP postcard sheet (VP8X canvas size).
    const webp = bytes.toString('ascii', 8, 16) === 'WEBPVP8X';
    assert.ok(webp || bytes.toString('ascii', 1, 4) === 'PNG', file);
    const [width, height] = webp ? [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1] : [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    assert.equal(width / columns, height / rows, file + ' must have square sprite cells');
    assert.ok(sw.includes("'./" + file + "'"), file + ' missing from offline cache');
  }
});
