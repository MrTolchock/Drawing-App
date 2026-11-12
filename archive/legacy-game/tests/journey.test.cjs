const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function app(options = {}) {
  const saved = options.saved === undefined ? new Map() : options.saved;
  const navigation = [], settingChanges = [];
  const FK = {
    settings: { get: key => key === 'learning.stage' ? options.stage || 1 : undefined,
      set: (key, value) => settingChanges.push([key, value]) },
    progress: { isDone: (screen, key) => !!options.done?.has(screen + ':' + key) },
    go: (screen, params) => navigation.push({ screen, params }),
  };
  const localStorage = {
    getItem: key => { if (options.blocked) throw Error('Storage unavailable'); return saved.get(key) ?? null; },
    setItem: (key, value) => { if (options.blocked) throw Error('Storage unavailable'); saved.set(key, value); },
  };
  const context = { window: { FK }, localStorage };
  for (const file of ['js/learn/learning.js', 'js/learn/adventures.js', 'js/learn/expeditions.js', 'js/core/journey.js']) {
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  }
  return { FK, journey: FK.journey, saved, navigation, settingChanges };
}
const plain = value => JSON.parse(JSON.stringify(value));
const finish = (journey, step = journey.step(), summary) => journey.complete(step.screen, step.game, step.stage, summary);

test('a new tour offers three distinct pictured games with different woodland friends', () => {
  const { journey } = app({ stage: 2 });
  assert.equal(journey.catalogue().length, 18);
  assert.equal(new Set(journey.catalogue().map(s => s.screen + ':' + s.game)).size, 18);
  assert.ok(journey.catalogue().every(s => s.title && s.emoji && s.friend && s.game !== 'tricks'));
  assert.equal(journey.step(), null);
  journey.start();
  const steps = journey.get().tour.steps;
  assert.equal(steps.length, 3);
  assert.ok(steps.every(s => s.stage === 2));
  const friends = steps.map(s => journey.catalogue().find(c => c.screen === s.screen && c.game === s.game).friend);
  assert.equal(new Set(friends).size, 3);
});

test('each friend offers three different games and already explored games are rotated', () => {
  for (const resident of ['beaver', 'hare', 'hedgehog', 'owl', 'kingfisher']) {
    const { journey } = app();
    journey.start({ resident });
    const steps = journey.get().tour.steps;
    assert.equal(new Set(steps.map(s => s.game)).size, 3);
    assert.ok(steps.every(s => journey.catalogue().find(c => c.game === s.game).friend === resident));
  }
  const { journey } = app({ done: new Set(['learn:count:1']) });
  journey.start();
  assert.ok(!journey.get().tour.steps.some(s => s.game === 'count'), 'prefer an unexplored beaver game');
});

test('exit and reload preserve the next incomplete stop and its chosen level', () => {
  const first = app();
  first.journey.start({ stage: 3, resident: 'owl' });
  finish(first.journey);
  const snapshot = plain(first.journey.get()), expected = plain(first.journey.step());
  const restored = app({ saved: first.saved, stage: 1 });
  assert.deepEqual(plain(restored.journey.get()), snapshot);
  assert.deepEqual(plain(restored.journey.start({ stage: 1, resident: 'hare' })), expected);
  assert.deepEqual(plain(restored.journey.get()), snapshot, 'starting an active tour only resumes it');
});

test('free games, another level and invalid games cannot advance the selected stop', () => {
  const { journey } = app();
  journey.start({ stage: 2 });
  const current = journey.step(), other = journey.catalogue().find(s => s.game !== current.game);
  assert.equal(journey.complete(other.screen, other.game, 2).advanced, false);
  assert.equal(journey.complete(current.screen, current.game, 1).advanced, false);
  const beforeInvalid = plain(journey.get());
  for (const [screen, game, stage] of [['learn', 'missing', 2], ['adventure', 'count', 2], ['learn', 'count', 0], ['learn', 'count', 4], ['learn', 'count', '2']]) {
    assert.equal(journey.complete(screen, game, stage).advanced, false);
  }
  assert.deepEqual(plain(journey.get()), beforeInvalid);
  assert.equal(journey.get().tour.index, 0);
  assert.equal(Object.keys(journey.get().records).length, 2, 'valid free practice is remembered separately');
});

test('duplicate completion cannot skip a stop or finish and reward the tour twice', () => {
  const { journey } = app();
  journey.start();
  const first = journey.step();
  assert.equal(finish(journey, first, { independent: 5 }).advanced, true);
  assert.equal(finish(journey, first).advanced, false);
  assert.equal(journey.get().tour.index, 1);
  assert.equal(journey.get().records[first.screen + ':' + first.game + ':1'].rounds, 2);
  finish(journey);
  const last = journey.step();
  assert.equal(finish(journey, last).finished, true);
  assert.equal(journey.step(), null);
  assert.equal(journey.get().completed, 1);
  assert.equal(finish(journey, last).finished, false);
  assert.equal(journey.get().completed, 1);
  assert.equal(journey.get().tour.index, 3, 'a completed tour remains complete until explicitly starting another');
  const restored = app({ saved: appSaved(journey) }).journey;
  assert.equal(restored.step(), null);
  assert.equal(restored.get().completed, 1);
});
function appSaved(journey) { return new Map([[journey.KEY, JSON.stringify(journey.get())]]); }

test('stage recommendations are explicit and practice suggestions stay with the same friend', () => {
  const { journey, settingChanges, navigation } = app();
  const level = journey.recommendation('learn', 'count', 1, { independent: 4 });
  assert.deepEqual(plain({ screen: level.screen, game: level.game, stage: level.stage, kind: level.kind }), { screen: 'learn', game: 'count', stage: 2, kind: 'level' });
  assert.equal(journey.recommendation('learn', 'count', 2, { independent: 5 }).stage, 3);
  for (const [stage, independent] of [[1, 3], [3, 5]]) {
    const suggestion = journey.recommendation('learn', 'count', stage, { independent });
    assert.equal(suggestion.kind, 'game');
    assert.equal(suggestion.friend, 'beaver');
    assert.notEqual(suggestion.game, 'count');
    assert.equal(suggestion.stage, stage);
  }
  assert.deepEqual(settingChanges, []);
  assert.deepEqual(navigation, []);
  assert.equal(journey.launch(level), true);
  assert.deepEqual(settingChanges, [['learning.stage', 2]]);
  assert.deepEqual(plain(navigation), [{ screen: 'learn', params: { game: 'count', stage: 2 } }]);
});

test('launch validates destinations, stage inputs are bounded and snapshots cannot mutate live state', () => {
  const { journey, navigation } = app();
  assert.equal(journey.launch(), false);
  for (const value of [undefined, null, NaN, -10, 0, 'invalid']) assert.equal(journey.stageOf(value), 1);
  for (const value of [4, 100, Infinity]) assert.equal(journey.stageOf(value), 3);
  assert.equal(journey.stageOf(2.9), 2);
  for (const invalid of [{ screen: 'learn', game: 'count', stage: 7 }, { screen: 'other', game: 'count', stage: 1 }, { screen: 'learn', game: 'tricks', stage: 1 }]) assert.equal(journey.launch(invalid), false);
  assert.deepEqual(navigation, []);
  journey.start({ stage: 999 });
  const snapshot = journey.get();
  snapshot.tour.steps[0].stage = 1;
  assert.equal(journey.step().stage, 3);
});

test('corrupt and unavailable storage recover without affecting the story or blocking play', () => {
  const key = app().journey.KEY;
  for (const invalid of ['{', 'null', '[]', JSON.stringify({ version: 99 }), JSON.stringify({ version: 1, tour: { steps: [], index: 0 }, records: null })]) {
    const { journey } = app({ saved: new Map([[key, invalid]]) });
    assert.equal(journey.step(), null);
    assert.equal(journey.get().completed, 0);
    assert.ok(journey.start());
  }
  const original = app(); original.journey.start();
  const state = plain(original.journey.get());
  for (const change of [s => s.tour.index = 4, s => s.tour.steps[0].stage = 0, s => s.tour.steps[0].game = 'missing', s => s.tour.steps[1] = s.tour.steps[0]]) {
    const malformed = JSON.parse(JSON.stringify(state)); change(malformed);
    assert.equal(app({ saved: new Map([[key, JSON.stringify(malformed)]]) }).journey.step(), null);
  }
  const { journey, saved } = app({ blocked: true });
  assert.ok(journey.start());
  assert.equal(finish(journey).advanced, true);
  assert.equal(journey.get().tour.index, 1);
  assert.equal(saved.size, 0);
});
