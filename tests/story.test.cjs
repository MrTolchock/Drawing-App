const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const plain = value => JSON.parse(JSON.stringify(value));
function boot(storage = new Map()) {
  const FK = { settings: { get: () => 3 } }, context = { window: { FK }, localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) } };
  for (const file of ['js/learn/learning.js', 'js/learn/expeditions.js', 'js/learn/adventures.js', 'js/learn/routes.js', 'js/forest/story.js', 'js/forest/model.js']) vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
  return { FK, model: FK.forestState, storage };
}
function item(FK, m, id) {
  const a = m.getActivity(id), game = m.definition(id).game;
  const q = game === 'pattern' ? FK.learning.question(game, 1, a.round) : game === 'treasure' ? FK.expeditions.question(game, 1, a.round, Math.random, 0, 'swiss-woodland') : FK.adventures.question(game, 1, a.round);
  m.question(q, game === 'pattern' ? q.choices.slice().reverse() : null, id);
  if (game === 'treasure') m.conceal(true, id);
  if (game !== 'robot') assert.equal(m.answer(q.answer, id), true);
  else {
    let p = m.getActivity(id).position;
    while (p % q.size !== q.goal % q.size) p = m.moveRoute(Math.sign(q.goal % q.size - p % q.size), 0, id).position;
    while (p !== q.goal) p = m.moveRoute(0, Math.sign(q.goal - p), id).position;
  }
  return m.advance(id);
}
function complete(FK, m, id, acknowledge = true) {
  assert.ok(m.startActivity(id));
  for (let i = 0; i < 5; i++) assert.equal(item(FK, m, id), i === 4);
  if (acknowledge) m.seePayoff(id);
}
function meet(FK, m) {
  complete(FK, m, m.QUEST); m.greet();
  for (const id of [m.REST, m.TRAIL, m.WATER]) complete(FK, m, id);
}
const permutations = values => values.length < 2 ? [values] : values.flatMap((v, i) => permutations(values.filter((_, j) => i !== j)).map(rest => [v, ...rest]));
test('the authored story has nine immutable helping projects, ten milestones and separate place collections', () => {
  const { FK, model: m } = boot();
  assert.equal(Object.keys(m.quests).length, 9);
  assert.equal(Object.values(FK.forestStory.chapters).flat().length + 1, 10);
  assert.equal(Object.values(FK.forestStory.collections).flat().length, 15);
  assert.ok(Object.values(m.quests).every(q => q.stage === 1));
});
test('all 72 chapter-order combinations reach the same ending without stars or optional practice', () => {
  const sample = boot().model;
  for (const intro of permutations([sample.REST, sample.TRAIL, sample.WATER])) for (const reconnect of permutations([sample.GARDEN, sample.STORIES, sample.CLEARING])) for (const gather of permutations([sample.SEATING, sample.INVITE])) {
    const { FK, model: m } = boot(); complete(FK, m, m.QUEST); m.greet();
    for (const id of intro) complete(FK, m, id);
    assert.equal(m.objective().chapter, 'reconnect'); assert.equal(m.acknowledgeChapter('reconnect'), true);
    for (const id of reconnect) complete(FK, m, id);
    assert.equal(m.objective().chapter, 'gather'); assert.equal(m.acknowledgeChapter('gather'), true);
    for (const id of gather) complete(FK, m, id);
    assert.equal(m.objective().kind, 'ending'); assert.equal(m.beginEnding(), true);
    for (let i = 0; i < 4; i++) m.endingNext();
    assert.equal(m.get().endingSeen, true); assert.equal(m.objective().kind, 'free');
    assert.equal(Object.keys(m.get().contributions).length, 9);
  }
});
test('chapter gates require the authored contributions and their visible payoffs', () => {
  const { FK, model: m } = boot();
  assert.equal(m.startActivity(m.GARDEN), null); assert.equal(m.acknowledgeChapter('gather'), false); assert.equal(m.beginEnding(), false);
  complete(FK, m, m.QUEST); m.greet(); complete(FK, m, m.REST); complete(FK, m, m.TRAIL); complete(FK, m, m.WATER, false);
  assert.equal(m.chapterReady('meet'), false); assert.equal(m.acknowledgeChapter('reconnect'), false);
  m.seePayoff(m.WATER); assert.equal(m.acknowledgeChapter('reconnect'), true);
  assert.equal(m.questAvailable(m.GARDEN), true); assert.equal(m.questAvailable(m.SEATING), false);
});
test('the garden and waterside repairs create useful shorter routes without closing the existing loop', () => {
  const { FK, model: m } = boot(); meet(FK, m); m.acknowledgeChapter('reconnect');
  const length = path => path.slice(1).reduce((sum, p, i) => sum + m.distance(p, path[i]), 0);
  const garden = length(m.route(m.nodes.garden, m.nodes.hedgehog)), water = length(m.route(m.nodes.owl, m.nodes.kingfisher));
  complete(FK, m, m.GARDEN); complete(FK, m, m.STORIES);
  assert.ok(length(m.route(m.nodes.garden, m.nodes.hedgehog)) < garden * 0.65);
  assert.ok(length(m.route(m.nodes.owl, m.nodes.kingfisher)) < water * 0.8);
  for (const id of Object.keys(m.residents)) assert.ok(m.route(m.nodes.home, m.nodes[id]).length > 1);
});
test('practice packs keep independent live sessions and never apply a story effect', () => {
  const { FK, model: m, storage } = boot();
  const a = m.startPractice('pattern', 'beaver'); item(FK, m, a.id);
  const b = m.startPractice('pattern', 'hare'); item(FK, m, b.id); item(FK, m, b.id);
  assert.equal(m.getActivity(a.id).round, 1); assert.equal(m.getActivity(b.id).round, 2);
  for (let i = 1; i < 5; i++) item(FK, m, a.id);
  assert.equal(m.get().bridgeRepaired, false); assert.equal(Object.keys(m.get().contributions).length, 0);
  const reloaded = boot(storage).model; assert.equal(reloaded.getActivity(b.id).round, 2);
  assert.equal(reloaded.startPractice('pattern', 'beaver').round, 0);
});
test('every new story session restores its live question and preserves the previously completed places', () => {
  const { FK, model: m, storage } = boot(); meet(FK, m); m.acknowledgeChapter('reconnect');
  const before = plain(m.get().contributions);
  for (const id of [m.GARDEN, m.STORIES, m.CLEARING]) {
    m.startActivity(id); item(FK, m, id);
    assert.deepEqual(plain(boot(storage).model.getActivity(id)), plain(m.getActivity(id)));
  }
  assert.deepEqual(plain(m.get().contributions), before);
});
test('the ending resumes at its saved picture, replay preserves completion, and new optional IDs cannot reset it', () => {
  const { FK, model: m, storage } = boot(); meet(FK, m); m.acknowledgeChapter('reconnect');
  for (const id of [m.GARDEN, m.STORIES, m.CLEARING]) complete(FK, m, id);
  m.acknowledgeChapter('gather'); complete(FK, m, m.SEATING); complete(FK, m, m.INVITE);
  m.beginEnding(); m.endingNext(); m.endingNext();
  let restored = boot(storage).model; assert.equal(restored.get().endingPage, 2); assert.equal(restored.get().endingSeen, false);
  restored.endingNext(); restored.endingNext(); assert.equal(restored.get().endingSeen, true);
  assert.equal(restored.beginEnding(true), true); assert.equal(restored.get().endingSeen, true); restored.stopReplay();
  const saved = restored.get(); saved.contributions['future-optional-episode-v1'] = true; storage.set(m.KEY, JSON.stringify(saved));
  restored = boot(storage).model; assert.equal(restored.get().endingSeen, true); assert.equal(restored.objective().kind, 'free');
  assert.equal(restored.isComplete('future-optional-episode-v1'), true);
});
