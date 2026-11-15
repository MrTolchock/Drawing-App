/* Twenty minutes of forest sound, played through without a loudspeaker: the director (js/friends/soundscape.js)
   must stay varied, sparse and tied to the place, so the sound does not wear on a child who plays that long. */
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path'), {pathToFileURL} = require('node:url');
const load = file => import(pathToFileURL(path.join(__dirname, '..', file)).href);
function seeded(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
// Play `minutes` at ten steps a second; env may be a function of the time in seconds.
async function play(env, minutes = 20, seed = 7) {
  const {createDirector} = await load('js/friends/soundscape.js'), d = createDirector({random: seeded(seed)}), events = [], beds = []; let most = 0;
  for (let i = 0; i <= minutes * 600; i++) { const now = 100 + i / 10, out = d.step(now, typeof env === 'function' ? env(i / 10) : env); beds.push(out.beds); most = Math.max(most, d.singers); for (const e of out.events) events.push({...e, now: i / 10}); }
  return {events, beds, most, of: type => events.filter(e => type === 'chorus' ? e.chorus : e.type === type && !e.chorus)};
}
const WOOD = {trees: .9, meadow: 0, swamp: 0, spruce: .2, brook: 0, falls: 0};
const gaps = list => list.slice(1).map((e, i) => e.now - list[i].now);

test('birds: a few phrases a minute, never more than two singers, with quiet stretches and no fixed beat', async () => {
  for (const seed of [7, 99, 2024]) {
    const run = await play(WOOD, 20, seed), calls = run.of('call'), g = gaps(calls);
    const perMinute = m => calls.filter(c => c.now >= m * 60 && c.now < (m + 1) * 60).length;
    for (let m = 0; m < 20; m++) assert.ok(perMinute(m) <= 22, `minute ${m}: ${perMinute(m)} phrases`);
    // the soft chorus further off keeps the wood alive: never more than 16 s without any voice at all
    const all = [...calls, ...run.of('chorus')].sort((a, b) => a.now - b.now); assert.ok(Math.max(...gaps(all)) <= 16, 'never empty for long: ' + Math.max(...gaps(all)));
    assert.ok(run.of('chorus').every(c => c.far >= .8 && c.level <= .6), 'the chorus stays far and soft');
    assert.ok(calls.length / 20 >= 5 && calls.length / 20 <= 16, `phrases a minute: ${calls.length / 20}`);
    assert.ok(run.most <= 2, 'at most two singers at once');
    assert.ok(Math.max(...g) >= 20, 'nearby birds pause now and then');
    const mean = g.reduce((a, b) => a + b, 0) / g.length, spread = Math.sqrt(g.reduce((a, b) => a + (b - mean) ** 2, 0) / g.length);
    assert.ok(spread > 2.5, 'the pauses vary');
    // the first five minutes are livelier than the last five
    const early = calls.filter(c => c.now < 300).length, late = calls.filter(c => c.now >= 900).length; assert.ok(late <= early * 1.15, `settles: ${early} then ${late}`);
    assert.ok(calls.filter(c => c.kind === 'cuckoo').length <= 7, 'the cuckoo stays rare'); assert.ok(calls.filter(c => c.kind === 'woodpecker').length <= 14, 'the woodpecker stays rare');
    const kinds = new Set(calls.map(c => c.kind)); assert.ok(kinds.size >= 5, 'several kinds of bird: ' + [...kinds]);
    for (let i = 3; i < calls.length; i++) assert.ok(!(calls[i].kind === calls[i - 1].kind && calls[i].kind === calls[i - 2].kind && calls[i].kind === calls[i - 3].kind && calls[i].pan !== calls[i - 3].pan && calls[i - 1].pan !== calls[i - 2].pan), 'one kind does not take over');
  }
});

test('the place decides the voices', async () => {
  const wood = await play(WOOD), swamp = await play({trees: .3, meadow: 0, swamp: 1, spruce: 0}), meadow = await play({trees: .05, meadow: 1, swamp: 0, spruce: 0}), den = await play({indoors: true});
  const kinds = run => new Set(run.of('call').map(c => c.kind));
  assert.ok(!kinds(wood).has('frog') && !kinds(wood).has('cricket') && !kinds(wood).has('bee'));
  assert.ok(kinds(swamp).has('frog')); assert.ok(kinds(meadow).has('cricket'));
  assert.ok(!kinds(meadow).has('woodpecker') || meadow.of('call').filter(c => c.kind === 'woodpecker').length <= 2);
  assert.deepEqual([...kinds(den)].filter(k => !['blackbird', 'robin', 'greatTit', 'dove'].includes(k)), [], 'only a few voices reach the den');
  assert.ok(den.of('call').length < wood.of('call').length * .7, 'the den is quieter'); assert.equal(den.of('step').length, 0);
  assert.ok(swamp.of('plop').length > 0 && wood.of('plop').length === 0);
});

test('footsteps follow the walk, match the ground and soften on a long walk', async () => {
  // walk 40 s on grass, rest 10 s, walk 20 s over the boardwalk
  const env = t => ({...WOOD, moving: t < 40 || (t >= 50 && t < 70), speed: 2.6, ground: t < 45 ? 'grass' : 'wood'});
  const run = await play(env, 1.5), steps = run.of('step');
  assert.ok(steps.every(s => s.now < 40.2 || (s.now >= 50 && s.now < 70.2)), 'no steps while standing');
  const first = steps.filter(s => s.now < 40), rate = first.length / 40; assert.ok(Math.abs(rate - Math.max(4, 2.6 * 3.2) / Math.PI) < .25, 'in time with the walk: ' + rate);
  assert.ok(first.every((s, i) => !i || s.side === -first[i - 1].side), 'left, right');
  assert.ok(first[0].level > .95 && first[first.length - 1].level < .62, 'softer after a long walk');
  const again = steps.filter(s => s.now >= 50); assert.ok(again[0].level > .95, 'fresh again after a rest'); assert.ok(again.every(s => s.ground === 'wood'));
  const at = first.map(s => s.at), g = at.slice(1).map((v, i) => v - at[i]); assert.ok(Math.max(...g) - Math.min(...g) > .02 && Math.max(...g) < .5, 'not a metronome');
});

test('water is heard only near water; wind comes in gusts', async () => {
  const dry = await play(WOOD, 5), brook = await play({...WOOD, brook: .8}, 5);
  assert.equal(dry.of('bubble').length, 0); const perSecond = brook.of('bubble').length / 300; assert.ok(perSecond > 1 && perSecond < 8, 'bubbles a second: ' + perSecond);
  assert.ok(dry.beds.every(b => b.brook === 0 && b.falls === 0));
  const wind = (await play(WOOD)).beds.map(b => b.gust); assert.ok(Math.min(...wind) < .15 && Math.max(...wind) > .7, 'calm and gusts');
  assert.ok((await play(WOOD)).beds.every(b => b.leaves >= 0 && b.leaves <= 1.25));
  assert.ok((await play(WOOD)).beds.filter(b => b.leaves === 0).length > 2000, 'the leaves are still for long stretches (at least a sixth of the time)');
});

test('there is no music', async () => {
  assert.equal((await play({...WOOD, music: true})).of('note').length, 0);
});
