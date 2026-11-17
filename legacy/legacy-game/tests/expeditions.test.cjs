const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const FK = {};
vm.runInNewContext(fs.readFileSync('js/learn/expeditions.js', 'utf8'), { window: { FK } });
const rngFor = seed => () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
for (const game of FK.expeditions.games) for (const stage of [1, 2, 3]) {
  test(`${game.id}, stage ${stage}: correct original tasks over 80 random sequences`, () => {
    const max = [5, 10, 20][stage - 1];
    for (let seed = 1; seed <= 80; seed++) {
      const rng = rngFor(seed);
      for (let round = 0; round < 5; round++) {
        const q = FK.expeditions.question(game.id, stage, round, rng, seed % 8);
        assert.ok(q.prompt && q.hint && q.explain && q.transfer);
        assert.equal(new Set(q.choices || []).size, (q.choices || []).length);
        if (q.kind === 'treasure') {
          assert.equal(q.objects.length, stage + 2);
          assert.equal(new Set(q.objects.map(o => o.name)).size, q.objects.length);
          assert.equal(q.objects[q.missing].name, q.answer);
          assert.equal(q.choices.length, 3);
          assert.equal(q.choices.filter(o => o.name === q.answer).length, 1);
          assert.ok(q.choices.every(o => q.objects.includes(o)));
          const remaining = q.objects.filter((_, i) => i !== q.missing);
          assert.equal(remaining.filter(o => o.name === q.answer).length, 0);
        } else if (q.kind === 'neighbours') {
          assert.equal(q.answer[0] + 1, q.n); assert.equal(q.answer[1] - 1, q.n);
          assert.ok(q.answer.every(n => n >= 0 && n <= max && q.choices.includes(n)));
          assert.ok(q.choices.every(n => n >= 0 && n <= max));
        } else if (q.kind === 'compare') {
          assert.ok(q.a >= 0 && q.a <= max && q.b >= 0 && q.b <= max);
          assert.equal(q.answer, q.a > q.b ? -1 : q.a < q.b ? 1 : 0);
          assert.ok(q.choices.includes(q.answer));
          if (round === 2) assert.equal(q.a, q.b);
        } else if (q.kind === 'mirror') {
          assert.equal(q.left.length, q.rows * q.width);
          assert.ok(q.left.some(Boolean) && q.left.some(v => !v));
          assert.equal(new Set(q.answer).size, q.answer.length);
          for (let r = 0; r < q.rows; r++) for (let c = 0; c < q.width; c++) {
            assert.equal(q.answer.includes(r * q.width + q.width - 1 - c), q.left[r * q.width + c]);
          }
        } else if (q.kind === 'tricks') {
          assert.equal(q.knownA + q.knownB, q.knownTotal); assert.equal(q.a + q.b, q.answer);
          assert.ok(q.answer >= 0 && q.answer <= max && q.knownTotal <= max && q.b >= 0);
          if (q.rule === 'swap') { assert.equal(q.a, q.knownB); assert.equal(q.b, q.knownA); }
          else { assert.equal(q.a, q.knownA); assert.equal(q.b, q.knownB + q.delta); assert.equal(Math.abs(q.delta), 1); }
          assert.ok(q.choices.includes(q.answer));
          assert.ok(q.choices.every(n => n >= 0 && n <= max));
        } else if (q.kind === 'vowels') {
          assert.match(q.answer, /^[aeiou]$/);
          assert.equal(q.word[q.index], q.answer);
          assert.ok(q.choices.includes(q.answer));
          assert.equal(q.choices.length, stage === 1 ? 3 : stage === 2 ? 4 : 5);
          assert.ok(!/au|ei|ie/i.test(q.word));
          const letters = Array.from(q.word); letters[q.index] = q.answer; assert.equal(letters.join(''), q.word);
        } else if (q.kind === 'survey') {
          assert.equal(new Set(q.counts).size, 3, 'extrema are unambiguous');
          assert.ok(q.counts.every(n => n >= 0 && n <= q.scale));
          if (q.task === 'count') assert.equal(q.answer, q.counts[q.target]);
          if (q.task === 'most' || q.task === 'least') {
            const index = q.fruit.findIndex(f => f.id === q.answer);
            assert.equal(q.counts[index], Math[q.task === 'most' ? 'max' : 'min'](...q.counts));
          }
          if (q.task === 'difference') assert.equal(q.answer, Math.abs(q.counts[q.target] - q.counts[q.other]));
          if (q.task === 'total') assert.equal(q.answer, q.counts.reduce((a, b) => a + b, 0));
          assert.ok(q.choices.includes(q.answer));
          if (typeof q.answer === 'number') assert.ok(q.answer >= 0 && q.answer <= 20);
        }
      }
    }
  });
}
test('five different picture words per session at every offset and stage', () => {
  for (const stage of [1, 2, 3]) for (let offset = 0; offset < 8; offset++) {
    const words = Array.from({ length: 5 }, (_, round) => FK.expeditions.question('vowels', stage, round, rngFor(123), offset).word);
    assert.equal(new Set(words).size, 5);
  }
});
test('boundary generators still produce valid zero neighbours and exact relations', () => {
  for (const edge of [0, 0.999999]) for (const stage of [1, 2, 3]) {
    const n = FK.expeditions.question('neighbours', stage, 0, () => edge);
    assert.ok(n.answer.every(v => n.choices.includes(v)));
    assert.ok(n.answer[0] >= 0 && n.answer[1] <= n.max);
    if (edge === 0) assert.equal(n.answer[0], 0);
    for (const game of FK.expeditions.games) assert.ok(FK.expeditions.question(game.id, stage, 4, () => edge).explain);
  }
});
test('parents get a readable UTF-8 source guide which is cached for offline use', () => {
  const guide = fs.readFileSync('docs/lernideen.html', 'utf8');
  assert.match(guide, /<meta charset="utf-8">/);
  assert.ok(guide.includes('Zürich') && guide.includes('Vokalversteck'));
  assert.ok(fs.readFileSync('js/screens/album.js', 'utf8').includes('href="docs/lernideen.html"'));
  assert.ok(fs.readFileSync('sw.js', 'utf8').includes("'./docs/lernideen.html'"));
});
