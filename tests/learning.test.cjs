const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const FK = { settings: { get: () => undefined } };
vm.runInNewContext(fs.readFileSync('js/learn/learning.js', 'utf8'), { window: { FK } });
for (const game of FK.learning.games) for (let stage = 1; stage <= 3; stage++) {
  test(`${game.id}: stage ${stage}, valid tasks and distinct answers`, () => {
    for (let seed = 1; seed <= 30; seed++) {
      let state = seed;
      const rng = () => ((state = state * 16807 % 2147483647) - 1) / 2147483646;
      for (let round = 0; round < 5; round++) {
        const q = FK.learning.question(game.id, stage, round, rng);
        assert.ok(q.choices.includes(q.answer));
        assert.equal(new Set(q.choices).size, q.choices.length);
        assert.ok(q.prompt && q.hint);
        if (game.id === 'count' || game.id === 'add') {
          const max = [5, 10, 20][stage - 1];
          assert.ok(q.answer >= 0 && q.answer <= max);
          assert.ok(q.choices.every(x => x >= 0 && x <= max));
        }
        if (game.id === 'add') assert.equal(q.answer, q.subtract ? q.a - q.b : q.a + q.b);
        if (game.id === 'pattern') assert.ok(q.sequence.length >= 4);
      }
    }
  });
}
test('every runtime script and stylesheet is available offline', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  for (const [, file] of html.matchAll(/(?:src|href)="((?:js|css)\/[^\"]+)"/g)) {
    assert.ok(fs.existsSync(file), file);
    assert.ok(sw.includes("'./" + file + "'"), file + ' absent from offline cache');
  }
  // ES modules reached through import statements are runtime files too.
  const path = require('node:path'), seen = new Set(), queue = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]);
  while (queue.length) {
    const file = queue.pop(); if (seen.has(file) || !file.endsWith('.js')) continue; seen.add(file);
    const source = fs.readFileSync(file, 'utf8');
    for (const [, spec] of source.matchAll(/(?:import\s[^'"]*?from\s*|import\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
      assert.ok(fs.existsSync(target), target + ' imported by ' + file);
      assert.ok(sw.includes("'./" + target + "'"), target + ' (imported by ' + file + ') absent from offline cache');
      queue.push(target);
    }
  }
});
test('branding preserves the legacy local progress and picture database', () => {
  const store = fs.readFileSync('js/core/store.js', 'utf8');
  assert.ok(store.includes("'farbklecks.settings.v2'"));
  assert.ok(store.includes("'farbklecks.progress.v1'"));
  assert.ok(store.includes("DB_NAME = 'farbklecks'"));
  assert.equal(JSON.parse(fs.readFileSync('manifest.webmanifest')).name, 'Farbtupf');
});
