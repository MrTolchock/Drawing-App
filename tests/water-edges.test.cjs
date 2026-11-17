/* Water ends where the ground comes out of it, never at an invisible boundary in the code (9.3.92). Such a boundary
   is drawn on the half-metre water grid and shows as a toothed line: once where Fisch's plunge pool ran into the
   upper brook, once along the west and south shore of Frosch's swamp. */
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path'), {pathToFileURL} = require('node:url');
const load = file => import(pathToFileURL(path.join(__dirname, '..', file)).href);
let world;
const big = async () => world ||= (await load('js/friends/world/big/index.js')).createBigWorld();

test('the bog ends in a bank above its water all the way round', async () => {
  const T = (await big()).terrain, S = T.swamp; let edge = 0, lowest = Infinity;
  // every spot just inside the bog's outline, where its still water stops existing
  for (let x = S.x - S.rx * 1.3; x <= S.x + S.rx * 1.3; x += .25) for (let z = S.z - S.rz * 1.3; z <= S.z + S.rz * 1.3; z += .25) {
    const m = T.swampMask(x, z); if (m <= .04 || m > .06) continue; edge++;
    const s = T.site(x, z); if (s.still !== s.still || s.still !== S.level) continue;
    const st = T.streamAt(x, z); if (st.d < st.w / 2 + 1) continue;   // the brook's own channel, where it runs into the bog
    lowest = Math.min(lowest, s.h - S.level);
    assert.ok(s.h - S.level > .05, `water at the bog's outline (${x.toFixed(2)}, ${z.toFixed(2)}): ground ${(s.h - S.level).toFixed(3)} m above the water`);
    assert.ok(s.fade < .05, `the bog's shore tint does not stop at its outline (${x.toFixed(2)}, ${z.toFixed(2)})`);
  }
  assert.ok(edge > 500, 'the whole outline was sampled');
  assert.ok(lowest < .3, 'the bank stays low');
});

test('the swamp keeps its water, its Steg and Frosch', async () => {
  const W = await big(), T = W.terrain, S = T.swamp; let water = 0;
  for (let x = S.x - S.rx * 1.3; x < S.x + S.rx * 1.3; x += .5) for (let z = S.z - S.rz * 1.3; z < S.z + S.rz * 1.3; z += .5) if (T.stillDepth(x, z) > 0) water++;
  assert.ok(water / 4 > 1000, `open water: ${water / 4} m²`);
  // the Steg's first section starts on firm ground below its deck
  const first = T.crossings.find(c => c.kind === 'planks'), h = T.ground(...first.a);
  assert.ok(h > S.level && h < first.y, `Steg start: ground ${h.toFixed(3)}, deck ${first.y.toFixed(3)}`);
  assert.equal(T.stillLevel(...W.layout.NEIGHBOURS.frog.at), S.level);
});

test('a pool runs into its brook without an edge', async () => {
  const {THREE} = await load('js/scene/materials.js'), T = (await big()).terrain, upper = T.streams.find(s => s.id === 'upper'), a = new THREE.Color(), b = new THREE.Color();
  for (const [pool, end] of [['plunge', 0], ['pond', upper.N]]) {
    const p = T.pools.find(q => q.id === pool), e = i => T.poolE(p, upper.samples[i].x, upper.samples[i].z);
    // the brook's flowing water is not drawn over the open pool, and is fully there once it has left it
    const inside = [], outside = []; for (let i = 0; i <= upper.N; i++) (e(i) < .78 ? inside : e(i) > 1 && e(i) < 1.6 ? outside : []).push(i);
    assert.ok(inside.length && outside.length, pool);
    assert.ok(inside.every(i => upper.fade[i] === 0), `${pool}: the brook is drawn inside the pool`);
    assert.ok(outside.every(i => upper.fade[i] === 1), `${pool}: the brook is faded outside the pool`);
    assert.equal(upper.fade[end], 0);
    // where the pool's still water stops, down the channel, it has already given way entirely, on the water and the bed
    let crossed = 0;
    for (const i of outside) {
      const s0 = upper.samples[i], s1 = upper.samples[Math.min(upper.N, i + 1)], dx = s1.x - s0.x, dz = s1.z - s0.z, l = Math.hypot(dx, dz), hw = upper.width(i) / 2;
      for (let o = -(hw + 1); o <= hw + 1; o += .25) {
        const x = s0.x - dz / l * o, z = s0.z + dx / l * o, here = T.site(x, z);
        if (here.still !== here.still) continue;
        // a neighbour a quarter metre further from the pool without still water: the pool's outline is right here
        const fx = x + dx / l * .25 * (end ? -1 : 1), fz = z + dz / l * .25 * (end ? -1 : 1), there = T.site(fx, fz); if (there.still === there.still) continue;
        crossed++;
        assert.equal(T.site(x, z).fade, 0, `${pool}: still water ends visibly at (${x.toFixed(2)}, ${z.toFixed(2)})`);
        T.colour(x, z, a); T.colour(fx, fz, b);
        assert.ok(Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < .08, `${pool}: the bed changes colour at the pool's outline (${x.toFixed(2)}, ${z.toFixed(2)}): #${a.getHexString()} / #${b.getHexString()}`);
      }
    }
    assert.ok(crossed > 3, `${pool}: the channel crosses the pool's outline`);
  }
});
