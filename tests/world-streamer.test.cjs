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

test('the near ring follows the picture: far ahead where the camera looks, not behind it', async () => {
  const {createStreamer} = await load('js/friends/world/streamer.js'), {THREE} = await load('js/scene/materials.js');
  const tiles = []; for (let i = -12; i < 12; i++) for (let j = -40; j < 12; j++) tiles.push([i, j]);
  const world = {tiles: () => tiles, regions: [], landmarkSteps: () => [], *buildTile() { yield 'ground'; yield 'plants'; return new THREE.Group(); }};
  const streamer = createStreamer(world, {steps: []}, new THREE.Scene());
  // an iPad in landscape: 42° tall picture, 4:3
  const half = Math.atan(Math.tan(21 * Math.PI / 180) * 4 / 3);
  streamer.setView({back: 24, tan: Math.tan(half + .2), near: Math.tan(half + .06), far: 112});
  streamer.focus(8, 8); streamer.complete();
  assert.equal(streamer.nearWanted(0, -3), true, 'full detail 48 m ahead in the picture');
  assert.equal(streamer.nearWanted(0, 2), false, 'none 28 m behind Fuchs, behind the camera');
  assert.equal(streamer.nearWanted(1, 0), true, 'beside him in the picture');
  assert.equal(streamer.nearWanted(2, 0), false, 'but not 32 m to the side, outside it');
  // 300 m north at 4.5 m/s, two build steps per frame
  let worst = {holes: 0, plain: 0}, most = 0;
  for (let z = 8; z > -300 + 8; z -= 4.5 / 60) {
    streamer.focus(8, z, 8, z - 9); streamer.work(0); streamer.work(0);
    const g = streamer.gaps(); worst = {holes: Math.max(worst.holes, g.holes), plain: Math.max(worst.plain, g.plain)}; most = Math.max(most, streamer.counts.near);
  }
  assert.deepEqual(worst, {holes: 0, plain: 0});
  assert.ok(most <= 25, 'near tiles ' + most);
});
