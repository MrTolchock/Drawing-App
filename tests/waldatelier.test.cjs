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
for (const path of ['js/data/stickers.js', 'js/ui/waldatelier.js', 'js/learn/words.js', 'js/learn/glyphs.js', 'js/learn/learning.js', 'js/learn/adventures.js', 'js/learn/expeditions.js', 'js/art/dsl.js', 'js/art/waldatelier.js']) {
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), context, { filename: path });
}
test('every reading word and handwriting picture has matching custom artwork', () => {
  for (const word of FK.words.list) assert.ok(FK.visual.supports(word.e), word.w + ' has no picture');
  for (const glyph of Object.values(FK.glyphs.data)) assert.ok(FK.visual.supports(glyph.emoji), glyph.word + ' has no picture');
  assert.notEqual(FK.visual.tokens['🐝'], FK.visual.tokens['🕷️']);
  assert.notEqual(FK.visual.tokens['🌲'], FK.visual.tokens['🌳']);
  assert.notEqual(FK.visual.tokens['🍌'], FK.visual.tokens['🥕']);
});
test('all original learning content has styled picture tokens', () => {
  const content = [FK.learning.stages, FK.learning.games, FK.adventures.games, FK.expeditions.games, FK.expeditions.words, FK.expeditions.treasures];
  for (const stage of [1, 2, 3]) for (let round = 0; round < 5; round++) {
    FK.learning.games.forEach(game => content.push(FK.learning.question(game.id, stage, round)));
    FK.adventures.games.forEach(game => content.push(FK.adventures.question(game.id, stage, round)));
    FK.expeditions.games.forEach(game => content.push(FK.expeditions.question(game.id, stage, round)));
  }
  const pictograms = JSON.stringify(content).match(/\p{Extended_Pictographic}[\p{Emoji_Modifier}\uFE0F]*(?:\u200D\p{Extended_Pictographic}[\p{Emoji_Modifier}\uFE0F]*)*/gu) || [];
  for (const token of new Set(pictograms)) assert.ok(FK.visual.supports(token), 'No custom art for ' + token);
});
test('all stamp and album choices can render the same illustration onto a canvas', async () => {
  await FK.visual.ready;
  assert.equal(FK.REWARDS.length, 42);
  for (const [token, name] of FK.REWARDS.concat(FK.STICKERS.flatMap(group => group.items))) {
    let drawn = false;
    const canvasContext = { drawImage: () => { drawn = true; } };
    assert.equal(FK.visual.draw(token, canvasContext, 0, 0, 128), true, name);
    assert.ok(drawn, name);
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
  assert.ok(sw.includes("'./assets/waldatelier/hero.png'"));
});
test('both Waldatelier colouring pages support all guided paint modes', () => {
  const pages = FK.art.list('waldatelier');
  assert.equal(pages.length, 2);
  for (const page of pages) {
    assert.ok(FK.art.hasLabels(page));
    assert.equal(page.colors.length, 6);
    for (const spot of page.spots) {
      assert.ok(spot.x > 0 && spot.x < 1000 && spot.y > 0 && spot.y < 1000);
      assert.ok(spot.c >= 1 && spot.c <= page.colors.length);
    }
  }
});
