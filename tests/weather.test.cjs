/* Half an hour of forest weather, without a screen: mostly sun, a few short showers that ease in and out,
   never rain in the first minutes, and the ground dries again afterwards. */
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path'), {pathToFileURL} = require('node:url');
const load = file => import(pathToFileURL(path.join(__dirname, '..', file)).href);
const seeded = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

async function play(seed, minutes = 30) {
  const {createWeather} = await load('js/friends/weather.js'), w = createWeather({random: seeded(seed)}), log = [];
  for (let t = 0; t <= minutes * 60; t += .1) { const s = w.step(.1); log.push({t, rain: s.rain, wet: s.wet, fresh: s.fresh, phase: s.phase}); }
  return log;
}
const runs = log => { const out = []; let start = null; for (const e of log) { if (e.phase === 'rain' && start === null) start = e.t; if (e.phase !== 'rain' && start !== null) { out.push([start, e.t]); start = null; } } if (start !== null) out.push([start, log[log.length - 1].t]); return out; };

test('mostly sun, with a few short showers and long dry spells', async () => {
  for (const seed of [7, 99, 2024, 31337]) {
    const log = await play(seed), showers = runs(log), raining = log.filter(e => e.rain > .5).length / log.length;
    assert.ok(showers.length >= 2 && showers.length <= 7, `showers in 30 min: ${showers.length}`);
    assert.ok(raining > .04 && raining < .25, `share of time raining: ${raining.toFixed(2)}`);
    assert.ok(showers[0][0] >= 149.5, 'the first minutes are dry: ' + showers[0][0].toFixed(0));
    for (const [a, b] of showers) { if (b < 30 * 60 - 1) assert.ok(b - a >= 59.8 && b - a <= 120.2, 'a shower lasts one to two minutes: ' + (b - a).toFixed(0)); }
    for (let i = 1; i < showers.length; i++) assert.ok(showers[i][0] - showers[i - 1][1] >= 299.8, 'several minutes of sun between showers');
  }
});

test('rain eases in and out, the ground dries, and a clear spell follows', async () => {
  const log = await play(7), [a, b] = runs(log)[0];
  let jump = 0; for (let i = 1; i < log.length; i++) jump = Math.max(jump, Math.abs(log[i].rain - log[i - 1].rain)); assert.ok(jump <= .1 / 12 + 1e-9, 'no sudden change');
  const at = t => log.find(e => e.t >= t);
  assert.ok(at(a + 6).rain > .3 && at(a + 6).rain < .7, 'half-way in after six seconds');
  assert.equal(at(b + 20).rain, 0); assert.ok(at(b + 20).wet > .3, 'still wet just after'); assert.ok(at(b + 100).wet === 0, 'dry again after a while');
  assert.ok(at(b + 20).fresh > .5 && at(b + 90).fresh === 0, 'a clear spell after the shower');
});

test('a shower can be started and stopped at once (development)', async () => {
  const {createWeather} = await load('js/friends/weather.js'), w = createWeather({random: seeded(1)});
  assert.equal(w.force(true).phase, 'rain'); for (let i = 0; i < 200; i++) w.step(.1); assert.equal(w.state.rain, 1);
  assert.equal(w.force(false).phase, 'dry'); for (let i = 0; i < 200; i++) w.step(.1); assert.equal(w.state.rain, 0);
});
