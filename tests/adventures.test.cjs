const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const FK = {};
for (const file of ['adventures', 'missions']) vm.runInNewContext(fs.readFileSync('js/learn/' + file + '.js', 'utf8'), { window: { FK } });
for (const game of FK.adventures.games) for (let stage = 1; stage <= 3; stage++) {
  test(`${game.id}, stage ${stage}: reachable, valid learning tasks`, () => {
    for (let seed = 1; seed <= 40; seed++) {
      let state = seed;
      const rng = () => ((state = state * 16807 % 2147483647) - 1) / 2147483646;
      for (let round = 0; round < 5; round++) {
        const q = FK.adventures.question(game.id, stage, round, rng);
        assert.ok(q.prompt && q.hint && q.explain && q.transfer);
        if (q.choices) {
          assert.ok(q.choices.includes(q.answer));
          assert.equal(new Set(q.choices).size, q.choices.length);
        }
        if (q.kind === 'rocket') {
          assert.ok(q.total <= [5, 10, 20][stage - 1]);
          assert.equal(q.filled + q.answer, q.total);
          assert.ok(q.answer > 0 && q.filled >= 0);
        }
        if (q.kind === 'picnic') assert.equal(q.answer * 2, q.total);
        if (q.kind === 'double') {
          assert.equal(q.answer, 2 * q.n);
          assert.ok(q.answer <= [6, 10, 20][stage - 1]);
        }
        if (q.kind === 'syllable') {
          assert.equal(q.answer, q.parts.length);
          assert.equal(q.word, q.parts.join(''));
          assert.ok(q.answer <= [2, 3, 4][stage - 1]);
        }
        if (q.kind === 'sequence') {
          assert.equal(q.ordered.length, stage + 1);
          assert.equal(new Set(q.ordered).size, q.ordered.length);
        }
        if (q.kind === 'robot') {
          const reachable = new Set([q.start]), queue = [q.start];
          for (let i = 0; i < queue.length; i++) {
            const p = queue[i], x = p % q.size, y = Math.floor(p / q.size);
            for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
              const nx = x + dx, ny = y + dy, n = ny * q.size + nx;
              if (nx < 0 || ny < 0 || nx >= q.size || ny >= q.size || q.obstacles.includes(n) || reachable.has(n)) continue;
              reachable.add(n); queue.push(n);
            }
          }
          assert.ok(reachable.has(q.goal), 'mailbox must be reachable');
          assert.notEqual(q.start, q.goal);
        }
      }
    }
  });
}
test('all three stages have six complete original creative missions', () => {
  assert.equal(new Set(FK.missions.map(m => m.id)).size, 18);
  for (const stage of [1, 2, 3]) assert.equal(FK.missions.filter(m => m.stage === stage).length, 6);
  for (const m of FK.missions) {
    assert.equal(m.steps.length, 3);
    assert.ok(m.goal && m.hint && m.talk && m.stretch && m.sources.length);
  }
});
