const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function boot(storage = new Map()) {
  const FK = { settings: { get: () => 3 } };
  const context = { window: { FK }, localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) } };
  for (const name of ['js/learn/learning.js', 'js/learn/expeditions.js', 'js/forest/model.js']) vm.runInNewContext(fs.readFileSync(name, 'utf8'), context, { filename: name });
  return { FK, state: FK.forestState, storage };
}
function round(FK, state) {
  const q = FK.learning.question('pattern', 1, state.get().activity.round);
  state.question(q, q.choices.slice().reverse());
  assert.equal(state.answer(q.answer), true);
  return state.advance();
}
const plain = value => JSON.parse(JSON.stringify(value));

test('both neighbours are reachable before repair; the repair creates a substantially shorter route', () => {
  const { state } = boot(), n = state.nodes;
  const before = state.route(n.beaver, n.hare, false), after = state.route(n.beaver, n.hare, true);
  const length = route => route.slice(1).reduce((total, p, i) => total + state.distance(p, route[i]), 0);
  assert.ok(before.some(p => state.distance(p, n.home) < 0.01));
  assert.ok(before.some(p => state.distance(p, n.fordEast) < 0.01));
  assert.ok(!before.some(p => state.distance(p, n.bridgeEast) < 0.01));
  assert.ok(after.some(p => state.distance(p, n.bridgeEast) < 0.01));
  assert.ok(length(after) < length(before) / 2);
  for (const target of [n.beaver, n.hare]) assert.ok(state.route(n.home, target, false).length > 1);
});
test('a water tap stays on the current bank and invalid destinations do not create a route', () => {
  const { state } = boot();
  const water = { x: state.riverX(-7), z: -7 };
  const west = state.route(state.nodes.beaver, water, false).at(-1);
  const east = state.route(state.nodes.hare, water, false).at(-1);
  assert.ok(west.x < state.riverX(west.z)); assert.ok(east.x > state.riverX(east.z));
  assert.equal(state.route({ x: NaN, z: 0 }, water).length, 0);
});
test('conversation landings leave room between the fox and native residents on the same safe bank', () => {
  const { state } = boot();
  for (const id of Object.keys(state.residents)) {
    const p = state.nodes[id], npc = state.residents[id];
    assert.ok(state.distance(p, npc) > 3.5);
    assert.ok(Math.abs(p.x - state.riverX(p.z)) > 2);
    assert.equal(Math.sign(p.x - state.riverX(p.z)), Math.sign(npc.x - state.riverX(npc.z)));
  }
});
test('the forest stage is independent of the existing global learning stage', () => {
  const { FK, state } = boot(); state.startActivity();
  assert.equal(FK.learning.stage(), 3); assert.equal(state.get().activity.stage, 1);
  assert.equal(state.get().activity.game, 'pattern');
});
test('wrong answers and repeated advancing cannot repair the bridge', () => {
  const { FK, state } = boot(); state.startActivity();
  const q = FK.learning.question('pattern', 1, 0); state.question(q, q.choices);
  assert.equal(state.answer(q.choices.find(v => v !== q.answer)), false);
  assert.equal(state.advance(), false); assert.equal(state.get().activity.round, 0);
  assert.equal(state.get().bridgeRepaired, false);
  state.answer(q.answer); state.advance(); state.advance();
  assert.equal(state.get().activity.round, 1);
});
test('five fresh successful items save one durable repair without depending on learning stars', () => {
  const { FK, state, storage } = boot();
  FK.progress = { finish() { throw new Error('World progression must not depend on stars'); } };
  state.startActivity();
  for (let i = 0; i < 5; i++) assert.equal(round(FK, state), i === 4);
  assert.equal(state.get().bridgeRepaired, true); assert.equal(state.get().activity.finished, true);
  assert.equal(Object.keys(state.get().contributions).length, 1);
  assert.equal(state.advance(), false); assert.equal(state.startActivity(), null);
  const reloaded = boot(storage).state;
  assert.equal(reloaded.get().bridgeRepaired, true); assert.equal(reloaded.get().payoffSeen, false);
  reloaded.seePayoff(); assert.equal(boot(storage).state.get().payoffSeen, true);
});
test('leaving and reloading preserve the live item, answer order and answered state', () => {
  const { FK, state, storage } = boot(); state.startActivity();
  round(FK, state);
  const q = FK.learning.question('pattern', 1, 1), choices = q.choices.slice().reverse();
  state.question(q, choices); state.answer(q.answer); state.demoSeen(); state.position(state.nodes.beaver);
  const saved = plain(state.get()), reloaded = plain(boot(storage).state.get());
  assert.deepEqual(reloaded.activity, saved.activity); assert.equal(reloaded.demoSeen, true);
  assert.equal(reloaded.bridgeRepaired, false); assert.equal(reloaded.activity.round, 1);
  assert.deepEqual(reloaded.activity.choices, plain(choices));
});
test('forest state never renames, replaces or clears legacy progress and settings', () => {
  const storage = new Map([['farbklecks.settings.v2', '{"learning.stage":3}'], ['farbklecks.progress.v1', '{"stars":7,"done":{"learn:pattern:1":2}}']]);
  const before = [...storage.entries()]; const { FK, state } = boot(storage); state.startActivity();
  for (let i = 0; i < 5; i++) round(FK, state);
  for (const [key, value] of before) assert.equal(storage.get(key), value);
  assert.equal(storage.size, 3);
});
test('malformed data recovers to a safe start; blocked storage remains playable in memory', () => {
  const storage = new Map([['farbtupf.forest.v1', '{broken']]);
  assert.equal(boot(storage).state.get().bridgeRepaired, false);
  storage.set('farbtupf.forest.v1', JSON.stringify({ version: 1, bridgeRepaired: 'yes', position: { x: 'far', z: 0 } }));
  const state = boot(storage).state; assert.equal(state.get().bridgeRepaired, false);
  assert.ok(Number.isFinite(state.get().position.x));
  const FK = {};
  vm.runInNewContext(fs.readFileSync('js/forest/model.js', 'utf8'), { window: { FK }, localStorage: { getItem() { throw Error(); }, setItem() { throw Error(); } } });
  assert.doesNotThrow(() => { FK.forestState.welcome(); FK.forestState.startActivity(); });
  assert.equal(FK.forestState.get().welcomed, true);
});
test('all local Three.js imports and first-slice assets are present in the offline cache', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const modules = ['materials', 'characters', 'landscape', 'scene'];
  for (const file of [...modules.map(name => 'js/forest/' + name + '.js'), 'vendor/three/three.module.js']) {
    for (const [, dependency] of fs.readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), dependency));
      assert.ok(fs.existsSync(resolved), resolved); assert.ok(sw.includes("'./" + resolved + "'"), resolved);
    }
  }
  for (const name of ['css/forest.css', 'js/forest/model.js', 'js/forest/speech.js', 'js/forest/art.js', 'js/forest/memory.js', 'js/ui/memory-board.js', 'js/screens/forest.js']) assert.ok(sw.includes("'./" + name + "'"), name);
});
function unlockGrove(FK, state) {
  state.startActivity(); for (let i = 0; i < 5; i++) round(FK, state); state.greet();
}
function memoryQuestion(FK, state) {
  const q = FK.expeditions.question('treasure', 1, state.getActivity(state.REST).round, Math.random, 0, 'swiss-woodland');
  state.question(q, null, state.REST); return q;
}
test('the grove opens after the bridge introduction and uses a safe route past the garden', () => {
  const { FK, state } = boot();
  assert.equal(state.startActivity(state.REST), null);
  assert.ok(state.distance(state.route(state.nodes.home, state.nodes.hedgehog).at(-1), state.nodes.hedgehog) > 5);
  unlockGrove(FK, state);
  const path = state.route(state.nodes.hare, state.nodes.hedgehog);
  assert.ok(path.some(p => state.distance(p, state.nodes.garden) < 0.01));
  assert.ok(path.every(p => p.x > state.riverX(p.z) + 2));
  assert.ok(state.distance(path.at(-1), state.nodes.hedgehog) < 0.01);
  assert.equal(state.startActivity(state.REST).stage, 1); assert.equal(FK.learning.stage(), 3);
});
test('the woodland memory pack retains the existing three-object rules and library pool', () => {
  const { FK } = boot();
  for (let i = 0; i < 30; i++) {
    const q = FK.expeditions.question('treasure', 1, i, Math.random, 0, 'swiss-woodland');
    assert.equal(q.objects.length, 3); assert.equal(q.choices.length, 3);
    assert.ok(q.objects.every(o => FK.expeditions.woodlandTreasures.some(p => p.name === o.name)));
    assert.equal(q.objects[q.missing].name, q.answer);
  }
  assert.equal(FK.expeditions.treasures.length, 12);
  assert.equal(FK.expeditions.question('treasure', 3, 0).objects.length, 5);
});
test('memory requires hiding first; looking again, wrong answers and repeated advancing do not complete it', () => {
  const { FK, state } = boot(); unlockGrove(FK, state); state.startActivity(state.REST);
  const q = memoryQuestion(FK, state);
  assert.equal(state.answer(q.answer, state.REST), false);
  state.conceal(true); assert.equal(state.answer('wrong', state.REST), false);
  assert.equal(state.advance(state.REST), false); state.conceal(false);
  assert.equal(state.answer(q.answer, state.REST), false);
  state.conceal(true); state.answer(q.answer, state.REST); state.advance(state.REST); state.advance(state.REST);
  assert.equal(state.getActivity(state.REST).round, 1); assert.equal(state.isComplete(state.REST), false);
});
test('memory preserves concealed and answered snapshots across leaving and reloading', () => {
  const { FK, state, storage } = boot(); unlockGrove(FK, state); state.startActivity(state.REST);
  const q = memoryQuestion(FK, state); state.demoSeen(state.REST); state.conceal(true);
  assert.deepEqual(plain(boot(storage).state.getActivity(state.REST)), plain(state.getActivity(state.REST)));
  state.answer(q.answer, state.REST); state.position(state.nodes.hedgehog);
  const reloaded = boot(storage).state;
  assert.deepEqual(plain(reloaded.getActivity(state.REST)), plain(state.getActivity(state.REST)));
  assert.equal(reloaded.hasDemo(state.REST), true); assert.equal(reloaded.isComplete(state.REST), false);
});
test('two complete quest arcs survive reload independently and preserve future milestones', () => {
  const { FK, state, storage } = boot(); unlockGrove(FK, state); state.startActivity(state.REST);
  const originalBridge = plain(state.get().activity);
  for (let i = 0; i < 5; i++) {
    const q = memoryQuestion(FK, state); state.conceal(true); state.answer(q.answer, state.REST);
    assert.equal(state.advance(state.REST), i === 4);
  }
  assert.equal(state.isComplete(state.REST), true); assert.equal(state.startActivity(state.REST), null);
  assert.deepEqual(plain(state.get().activity), originalBridge);
  state.seePayoff(state.REST); state.rewardRecorded(state.REST);
  const saved = JSON.parse(storage.get(state.KEY)); saved.contributions['future-story-v1'] = true;
  storage.set(state.KEY, JSON.stringify(saved));
  const reloaded = boot(storage).state;
  assert.equal(reloaded.isComplete(state.QUEST), true); assert.equal(reloaded.isComplete(state.REST), true);
  assert.equal(reloaded.isComplete('future-story-v1'), true);
  assert.equal(reloaded.get().payoffsSeen[state.REST], true); assert.equal(reloaded.getActivity(state.REST).rewardRecorded, true);
});
test('a first-slice save upgrades without losing its bridge, settings or position', () => {
  const { FK, state, storage } = boot(); unlockGrove(FK, state); state.position(state.nodes.hare);
  const old = state.get(); delete old.activities; delete old.guidanceSeen; delete old.payoffsSeen; delete old.met.hedgehog;
  storage.set(state.KEY, JSON.stringify(old));
  const upgraded = boot(storage).state;
  assert.equal(upgraded.get().bridgeRepaired, true); assert.equal(upgraded.get().greetingSeen, true);
  assert.deepEqual(plain(upgraded.get().position), plain(old.position)); assert.ok(upgraded.startActivity(upgraded.REST));
});
test('narration prefers Swiss German-language voices, cancels older speech and respects mute', () => {
  const spoken = []; let cancelled = 0, muted = false;
  const FK = { settings: { get: () => !muted }, on() {} };
  const voices = [{ lang: 'en-US' }, { lang: 'de-DE' }, { lang: 'de-CH' }];
  const Utterance = class { constructor(text) { this.text = text; } };
  const context = { window: { FK, SpeechSynthesisUtterance: Utterance, speechSynthesis: { getVoices: () => voices, cancel: () => cancelled++, speak: u => spoken.push(u) } },
    SpeechSynthesisUtterance: Utterance, document: { hidden: false, addEventListener() {} } };
  vm.runInNewContext(fs.readFileSync('js/forest/speech.js', 'utf8'), context);
  FK.forestVoice.say('Tippe auf den Weg.'); FK.forestVoice.say('Hilfst du mir?');
  assert.equal(spoken.length, 2); assert.equal(spoken[0].lang, 'de-CH'); assert.equal(cancelled, 2);
  muted = true; assert.equal(FK.forestVoice.repeat(), false); assert.equal(spoken.length, 2);
});
