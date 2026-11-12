/* Tile streaming keeps up with a steady walk: new tiles are planned from where Fuchs is now, compared with
   the place of the last plan (a walk moves a few centimetres per frame). On the iPad this once left plain green ground and holes to the sky. */
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path'), {pathToFileURL} = require('node:url');
const load = file => import(pathToFileURL(path.join(__dirname, '..', file)).href);

test('a steady walk keeps the ground built around Fuchs', async () => {
  const {createStreamer, NEAR, FAR} = await load('js/friends/world/streamer.js'), {THREE} = await load('js/scene/materials.js'), {TILE} = await load('js/friends/world/tiles.js');
  const tiles = []; for (let i = -40; i < 40; i++) for (let j = -8; j < 8; j++) tiles.push([i, j]);
  const built = [];
  const world = {tiles: () => tiles, regions: [], landmarkSteps: () => [],
    *buildTile(w, look, i, j, ring) { yield 'ground'; yield 'plants'; built.push(i + ',' + j + ',' + ring); return new THREE.Group(); }};
  const streamer = createStreamer(world, {steps: []}, new THREE.Scene());
  streamer.focus(0, 0); streamer.complete();
  assert.deepEqual(streamer.gaps(), {holes: 0, plain: 0});
  // 300 m east at 4.5 m/s and 60 frames per second, one build step per frame at most (a slow device)
  let worst = {holes: 0, plain: 0};
  for (let x = 0; x < 300; x += 4.5 / 60) {
    streamer.focus(x, 0, x + 9, 0); streamer.work(0);
    const g = streamer.gaps(); worst = {holes: Math.max(worst.holes, g.holes), plain: Math.max(worst.plain, g.plain)};
  }
  assert.deepEqual(worst, {holes: 0, plain: 0});
  const c = streamer.counts; assert.ok(c.near > 0 && c.near <= 25 && c.far <= 40, JSON.stringify(c));
  assert.ok(NEAR < FAR && TILE > 0);
});
