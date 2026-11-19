/* The way up the Rock's face from the cave's path to the Steinbock (layout `ibex-cave` trail, graded by RAMPS): Fuchs
   must be able to walk it. Once it only looked right: the 1 m path grid saw it as broken (too narrow at the hairpin
   and at the top turn, a step between two parts), so a tap up there sent Fuchs the long way round or nowhere. */
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path'), {pathToFileURL} = require('node:url');
const load = file => import(pathToFileURL(path.join(__dirname, '..', file)).href);
let world;
const bigWorld = async () => world ||= (await load('js/friends/world/big/index.js')).createBigWorld();
const length = (start, route) => route.reduce((a, p, i) => a + Math.hypot(p[0] - (i ? route[i - 1][0] : start[0]), p[1] - (i ? route[i - 1][1] : start[1])), 0);

test('from the cave path a short route climbs the new way to the Steinbock', async () => {
  const W = await bigWorld(), L = W.layout, ibex = L.PLACES.ibex, start = [86.5, -44];
  const route = W.plan(...start, ibex.x, ibex.z); assert.ok(route, 'a route exists');
  assert.ok(length(start, route) < 45, 'it takes the way up the face, not the long way round: ' + length(start, route).toFixed(1) + ' m');
  // every step of it can be walked, and it climbs from the meadow to the rim
  let previous = start, top = -Infinity;
  for (const next of route) {
    const n = Math.max(1, Math.ceil(Math.hypot(next[0] - previous[0], next[1] - previous[1]) / .1));
    for (let i = 1; i <= n; i++) { const x = previous[0] + (next[0] - previous[0]) * i / n, z = previous[1] + (next[1] - previous[1]) * i / n; assert.ok(W.walkable(x, z), 'walkable at ' + [x.toFixed(2), z.toFixed(2)]); top = Math.max(top, W.terrain.ground(x, z)); }
    previous = next;
  }
  assert.ok(top > W.terrain.ground(...start) + 8, 'the route climbs onto the Rock');
});

test('the graded way is gentle, level across, and leaves the Steinbock rim as it was', async () => {
  const W = await bigWorld(), T = W.terrain, trail = T.trails.find(t => t.id === 'ibex-cave');
  for (const p of trail.samples) { assert.ok(W.walkable(p.x, p.z), 'trail walkable at ' + [p.x.toFixed(1), p.z.toFixed(1)]); assert.ok(T.slope(p.x, p.z) < .95, 'not too steep at ' + [p.x.toFixed(1), p.z.toFixed(1)] + ': ' + T.slope(p.x, p.z).toFixed(2)); }
  // the plateau round the Steinbock's crag is still there to stand on
  const ibex = W.layout.PLACES.ibex; assert.ok(T.ground(ibex.x, ibex.z) > 11.5, 'the place in front of his crag is on the rim');
});
