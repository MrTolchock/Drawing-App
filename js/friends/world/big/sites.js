/* Landmark sites of the big world: one-off objects built when Fuchs comes near (the streamer asks
   for a site's steps once). The den tree, the arched bridge and the log come from world/landmarks.js;
   stepping stones, the swamp's boardwalk and a first, plain dam are built here.
   Still to come (see design/world-10x/PLAN.md): the waterfall, the lodge, the friends' props. */
import {THREE} from '../../../forest/materials.js';
import {rng} from '../noise.js';
import {Buffer} from '../tiles.js';
import {landmarkSteps} from '../landmarks.js';

/** Give a geometry one colour (the materials multiply their texture by it). */
function tinted(g, r, gr, b) { const c = new Float32Array(g.attributes.position.count * 3); for (let k = 0; k < c.length; k += 3) { c[k] = r; c[k + 1] = gr; c[k + 2] = b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; }

export function siteSteps(site, look, world, group, out) {
  const T = world.terrain, L = world.layout, M = look.M, R = rng(site.x * 31 + site.z);
  // the home builders expect a region: give them the parts they read
  const asRegion = landmarks => ({seed: 20261109, origin: [0, 0], ground: T.ground, deck: T.deck, home: L.DEN, crossings: T.crossings, landmarks, brook: null});
  const mesh = (buf, material, name, cast = true) => { const g = buf.geometry(); if (!g) return; const m = new THREE.Mesh(g, material); m.name = name; m.castShadow = cast && M.shadows; m.receiveShadow = M.shadows; group.add(m); };
  const near = c => Math.hypot((c.a[0] + c.b[0]) / 2 - site.x, (c.a[1] + c.b[1]) / 2 - site.z) < site.r;
  const add = (buf, g, r = 1, gr = r, b = r) => { buf.addGeometry(tinted(g, r, gr, b)); g.dispose(); };

  if (site.id === 'home') return landmarkSteps(asRegion(['homeTree', 'bridge']), look, world, group, out);
  const steps = [];
  if (site.id === 'swamp') {
    steps.push(...landmarkSteps(asRegion(['logBridge']), look, world, group, out));
    steps.push(() => { // the boardwalk: planks on posts
      const wood = new Buffer();
      for (const c of T.crossings.filter(k => k.kind === 'planks')) {
        const dx = c.b[0] - c.a[0], dz = c.b[1] - c.a[1], len = Math.hypot(dx, dz), yaw = Math.atan2(dx, dz), n = Math.round(len / .34);
        for (let k = 0; k <= n; k++) { const t = k / n, x = c.a[0] + dx * t, z = c.a[1] + dz * t, v = .82 + R() * .3; add(wood, new THREE.BoxGeometry(c.width + .1 + R() * .12, .07, .28).rotateY(yaw + (R() - .5) * .08).translate(x, c.y - .035 + (R() - .5) * .02, z), v, v, v); }
        for (let k = 0; k <= Math.ceil(len / 2.2); k++) { const t = k / Math.ceil(len / 2.2), x = c.a[0] + dx * t, z = c.a[1] + dz * t; for (const s of [-1, 1]) add(wood, new THREE.CylinderGeometry(.07, .08, 1.5, 6).translate(x + dz / len * s * c.width * .5, c.y - .6, z - dx / len * s * c.width * .5), .7, .66, .6); }
      }
      mesh(wood, M.wood, 'boardwalk');
    });
  }
  if (site.id === 'falls') steps.push(() => { // stepping stones across the upper brook
    const stones = new Buffer();
    for (const c of T.crossings.filter(k => k.kind === 'stones')) { const n = 4; for (let k = 0; k <= n; k++) { const t = k / n, x = c.a[0] + (c.b[0] - c.a[0]) * t + (R() - .5) * .12, z = c.a[1] + (c.b[1] - c.a[1]) * t + (R() - .5) * .12, v = .85 + R() * .2; add(stones, new THREE.CylinderGeometry(.34 + R() * .08, .42, .5, 9).translate(x, c.y - .26, z), v, v, v * .95); } }
    mesh(stones, M.rock, 'stepping stones', false);
  });
  if (site.id === 'pond') steps.push(() => { // the dam: a first, plain pile of logs (to be sculpted)
    const logs = new Buffer(), c = T.crossings.find(k => k.kind === 'dam'), dx = c.b[0] - c.a[0], dz = c.b[1] - c.a[1], len = Math.hypot(dx, dz), yaw = Math.atan2(dx, dz);
    for (let k = 0; k < 46; k++) { const t = R(), side = (R() - .5) * 2.4, l = 1.6 + R() * 1.8, x = c.a[0] + dx * t + dz / len * side, z = c.a[1] + dz * t - dx / len * side, y = c.y - .12 - Math.abs(side) * .55 + R() * .1, v = .8 + R() * .35;
      add(logs, new THREE.CylinderGeometry(.09 + R() * .06, .11 + R() * .07, l, 6).rotateX(Math.PI / 2 + (R() - .5) * .5).rotateY(yaw + (R() - .5) * 1.1).translate(x, y, z), v, v * .95, v * .88); }
    mesh(logs, M.log, 'dam');
  });
  return steps;
}
