const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const FK = {};
FK.adventures={question(_id,stage){return {kind:'robot',mode:'route',size:stage+2,start:0,goal:(stage+2)**2-1,obstacles:stage===2?[5]:[]};}};
for (const file of ['js/learn/routes.js']) vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window: { FK } });
const plain = value => JSON.parse(JSON.stringify(value));

test('all existing route stages and corner starts remain reachable', () => {
  for (const stage of [1, 2, 3]) for (let round = 0; round < 5; round++) {
    const q = FK.adventures.question('robot', stage, round);
    assert.equal(q.size, stage + 2); assert.equal(FK.routes.validQuestion(q), true);
  }
});
test('route validation rejects malformed, blocked and disconnected destinations', () => {
  const q = FK.adventures.question('robot', 1, 0);
  for (const change of [{ size: 99 }, { start: -1 }, { goal: 9 }, { goal: 0 }, { obstacles: [8] }, { obstacles: [1, 3] }, { obstacles: [1, 1] }]) {
    assert.equal(FK.routes.validQuestion({ ...q, ...change }), false);
  }
});
test('only one cardinal step is allowed; edges and hedges leave the state untouched', () => {
  const q = FK.adventures.question('robot', 2, 0), start = FK.routes.initial(q);
  for (const [x, y] of [[-1, 0], [0, -1], [1, 1], [2, 0], [0, 0], [NaN, 0]]) assert.equal(FK.routes.move(q, start, x, y), null);
  const next = FK.routes.move(q, start, 0, 1);
  assert.equal(next.position, 4); assert.equal(FK.routes.move(q, next, 1, 0), null);
  assert.deepEqual(plain(start), { position: 0, history: [0], answered: false });
});
test('different valid paths reach the same pictured goal and lock the completed item', () => {
  const q = FK.adventures.question('robot', 1, 0);
  for (const path of [[[1, 0], [1, 0], [0, 1], [0, 1]], [[0, 1], [1, 0], [0, 1], [1, 0]]]) {
    let s = FK.routes.initial(q);
    path.forEach(([x, y], i) => { s = FK.routes.move(q, s, x, y); assert.equal(s.answered, i === 3); });
    assert.equal(s.position, 8); assert.equal(FK.routes.move(q, s, -1, 0), null); assert.equal(FK.routes.undo(q, s), null);
  }
});
test('undo and restored recent history preserve every supported step', () => {
  const q = FK.adventures.question('robot', 1, 0);
  let s = FK.routes.initial(q); s = FK.routes.move(q, s, 1, 0); s = FK.routes.move(q, s, 0, 1);
  s = FK.routes.undo(q, s); assert.equal(s.position, 1);
  assert.deepEqual(plain(FK.routes.restore(q, s)), plain(s));
  s = FK.routes.initial(q);
  for (let i = 0; i < 130; i++) s = FK.routes.move(q, s, i % 2 ? -1 : 1, 0);
  assert.equal(s.history.length, 64); assert.deepEqual(plain(FK.routes.restore(q, s)), plain(s));
});
test('corrupt snapshots cannot teleport, cross a row edge or claim success away from the goal', () => {
  const q = FK.adventures.question('robot', 1, 0);
  for (const s of [
    { position: 4, history: [0, 4], answered: false }, { position: 3, history: [2, 3], answered: false },
    { position: 1, history: [0, 1], answered: true }, { position: 8, history: [0, 1], answered: false },
    { position: 5, history: [8, 5], answered: false }, { position: 0, history: [], answered: false },
  ]) assert.equal(FK.routes.restore(q, s), null);
});
