/* Small things to discover beside the paths of the big world: a ring of toadstools, a hollow log, a circle of
   old stones, apple trees, berry bushes, a stone well, lanterns at the den, a stump laid as a table, signposts,
   a toadstool house, and a picnic place with a fire place (its smoke rises in world/life.js). Each is its own little site (layout.js WONDERS), built in one
   short step when Fuchs comes near, from a few hundred triangles on the shared rock, log, bark and soft
   materials; the solid ones have colliders (layout.js SOLIDS) and a small clearing (GLADES). */
import {THREE} from '../../../scene/materials.js';
import {rng} from '../noise.js';
import {Buffer, trunkGeometry, rootGeometries, crownCards, instanced} from '../tiles.js';
import {canvasTex, patch} from '../textures.js';

const TAU = Math.PI * 2;
function tinted(g, [r, gr, b]) { const c = new Float32Array(g.attributes.position.count * 3); for (let k = 0; k < c.length; k += 3) { c[k] = r; c[k + 1] = gr; c[k + 2] = b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; }
// a lumpy stone or blob: an icosphere with its points pushed in and out a little
function lump(R, r, detail = 1, rough = .16) { const g = new THREE.IcosahedronGeometry(r, detail), p = g.attributes.position, seen = new Map(); for (let i = 0; i < p.count; i++) { const key = p.getX(i).toFixed(3) + p.getY(i).toFixed(3) + p.getZ(i).toFixed(3); if (!seen.has(key)) seen.set(key, 1 + (R() - .5) * 2 * rough); const k = seen.get(key); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); } g.computeVertexNormals(); return g; }

export function wonderSteps(site, look, world, group) {
  const T = world.terrain, M = look.M, R = rng(Math.round(site.x * 131 + site.z * 17) + 5), [x0, z0] = [site.x, site.z], y0 = T.ground(x0, z0), yaw = site.yaw || 0;
  const r = (a, b) => a + (b - a) * R();
  const bufs = {}, buf = name => bufs[name] || (bufs[name] = new Buffer());
  const add = (name, g, colour, x = 0, y = 0, z = 0) => { g.translate(x, y, z); buf(name).addGeometry(tinted(g, colour)); g.dispose(); };
  const finish = () => { for (const [name, b] of Object.entries(bufs)) { const g = b.geometry(); if (!g) continue; const m = new THREE.Mesh(g, M[name]); m.name = site.kind + ' ' + name; m.castShadow = M.shadows; m.receiveShadow = M.shadows; group.add(m); } };
  const ground = (x, z) => T.ground(x, z);
  // a toadstool: cream stem, red cap with white dots
  function toadstool(x, z, s, cap = [.86, .14, .1]) { const y = ground(x, z);
    add('rock', new THREE.CylinderGeometry(.05 * s, .075 * s, .24 * s, 8), [1.05, .98, .86], x, y + .12 * s, z);
    add('rock', new THREE.SphereGeometry(.19 * s, 12, 6, 0, TAU, 0, Math.PI / 2).scale(1, .78, 1), cap, x, y + .22 * s, z);
    for (let k = 0; k < 5; k++) { const a = k * 1.26 + s * 3, q = k ? .11 * s : 0; add('rock', new THREE.SphereGeometry(.026 * s, 6, 4), [1.15, 1.12, 1.05], x + Math.cos(a) * q, y + .22 * s + Math.sqrt(Math.max(0, (.19 * s) ** 2 - q * q)) * .78 - .008, z + Math.sin(a) * q); } }

  /* A small tree made the way the forest's trees are: a fluted trunk with roots, a few boughs, and a crown of
     leaf cards shaded towards the sun (the shared leaf material, so it turns translucent in front of Fuchs). */
  function tree({girth = .3, height = .42, cards = 56, crown = 2, size = [1.3, .9], shade = null} = {}) {
    const t = {x: x0, z: z0, r: girth, s: 1, height}, {geo, crownY} = trunkGeometry(t, y0, R, {segments: 16, rings: 10}); buf('bark').addGeometry(geo); geo.dispose();
    for (const g of rootGeometries(t, T.ground, R, {count: 5})) { buf('bark').addGeometry(g); g.dispose(); }
    for (let k = 0; k < 4; k++) { const a = k * 1.6 + r(0, .6), out = r(.9, 1.4), pts = [[0, -1.1, 0], [Math.cos(a) * out * .35, -.45, Math.sin(a) * out * .35], [Math.cos(a) * out, .25, Math.sin(a) * out]].map(([x, y, z]) => new THREE.Vector3(x0 + x, crownY + y, z0 + z));
      add('bark', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, .085, 6), [1, .78, .6]); }
    const list = crownCards(x0, crownY + .15, z0, crown, cards, R, world.sunDir, size, .82); if (shade) for (const c of list) c.c = shade(c.c);
    const card = new THREE.PlaneGeometry(1, 1), n = card.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);
    const m = instanced(card, M.leaves, list, {cast: M.shadows, receive: false, depth: M.leafDepth, name: site.kind + ' leaves'}); if (m) group.add(m);
    return {crownY, list, card};
  }

  const kinds = {
    ring() { const n = 9; for (let k = 0; k < n; k++) { const a = k / n * TAU + r(-.12, .12), d = 1.35 + r(-.1, .1); toadstool(x0 + Math.cos(a) * d, z0 + Math.sin(a) * d, r(.75, 1.35)); }
      for (let k = 0; k < 3; k++) toadstool(x0 + r(-.3, .3), z0 + r(-.3, .3), r(.45, .6), [.78, .56, .3]); },
    // an old hollow trunk lying in the grass: furrowed bark with moss along the top, one end broken off in
    // splinters and one sawn clean with its rings showing, stubs of branches, moss cushions, toadstools, a snail
    log() { const len = 3.6, lay = g => g.rotateZ(Math.PI / 2).rotateY(yaw), y = y0 + .7, along = t => [x0 + Math.cos(yaw) * t, z0 - Math.sin(yaw) * t];
      const shell = new THREE.CylinderGeometry(.8, .86, len, 28, 12, true), p = shell.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
      for (let i = 0; i < p.count; i++) { const px = p.getX(i), py = p.getY(i), pz = p.getZ(i), a = Math.atan2(pz, px), rad = Math.hypot(px, pz), end = py / (len / 2);
        const furrow = 1 + .05 * Math.sin(a * 9 + py * 1.3) + .03 * Math.sin(a * 17 - py * 2.1) + .04 * Math.sin(py * 3 + a * 2);
        const jag = end < -.98 ? (.12 + .2 * Math.abs(Math.sin(a * 3.5 + 1)) + .1 * Math.sin(a * 11)) : 0;                        // the broken end: splinters of different length
        p.setXYZ(i, Math.cos(a) * rad * furrow, py - jag, Math.sin(a) * rad * furrow);
        // after it is laid down, the trunk's +x side is up: moss there, darker bark underneath
        const up = Math.cos(a), moss = Math.max(0, Math.min(1, (up - .35) * 2.2 + .25 * Math.sin(py * 4 + a * 5))); c.setRGB(1, .86, .72).lerp(new THREE.Color(.5, .72, .3), moss * .85).multiplyScalar(.82 + .18 * up + .1 * Math.sin(a * 9 + py * 1.3));
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
      shell.computeVertexNormals(); shell.setAttribute('color', new THREE.BufferAttribute(col, 3)); lay(shell).translate(x0, y, z0); buf('bark').addGeometry(shell); shell.dispose();
      const inner = lay(new THREE.CylinderGeometry(.68, .72, len - .1, 20, 1, true).scale(-1, 1, 1)); inner.computeVertexNormals(); add('log', inner, [.3, .22, .16], x0, y, z0);
      { const [x, z] = along(len / 2); add('log', new THREE.RingGeometry(.7, .86, 28, 3).rotateY(Math.PI / 2).rotateY(yaw), [1.55, 1.3, .95], x, y, z); add('log', new THREE.RingGeometry(.74, .78, 28).rotateY(Math.PI / 2).rotateY(yaw), [1.1, .85, .6], x + Math.cos(yaw) * .004, y, z - Math.sin(yaw) * .004); }
      for (const [t, a, l] of [[.7, .9, .5], [-.5, -1.1, .42], [1.2, 2.2, .3]]) { const [x, z] = along(t), g = new THREE.CylinderGeometry(.09, .13, l, 8).translate(0, l / 2 + .72, 0).rotateZ(a * .5).rotateX(a * .6).rotateY(yaw); add('bark', g, [1, .84, .7], x, y - .1, z); }
      for (let k = 0; k < 7; k++) { const [x, z] = along(r(-.42, .42) * len); add('soft', lump(R, r(.2, .34), 1, .22).scale(1.5, .3, 1.1), k % 2 ? [.3, .52, .16] : [.38, .6, .2], x + r(-.2, .2), y + .78, z + r(-.2, .2)); }
      for (let k = 0; k < 5; k++) { const t = r(-.45, .45) * len, side = k % 2 ? 1 : -1, [x, z] = along(t); toadstool(x + Math.sin(yaw) * side * r(.95, 1.2), z + Math.cos(yaw) * side * r(.95, 1.2), r(.55, .95), k % 2 ? [.86, .62, .28] : [.8, .5, .22]); }
      { const [x, z] = along(-.3); add('rock', new THREE.SphereGeometry(.075, 10, 8).scale(1, 1, .7), [.75, .55, .32], x, y + .93, z); add('rock', new THREE.TorusGeometry(.04, .018, 5, 10), [.5, .34, .2], x, y + .93, z + .055); add('rock', new THREE.SphereGeometry(.04, 8, 6).scale(2.4, .7, 1), [.78, .72, .6], x + .06, y + .86, z); } },
    stones() { const n = 6; for (let k = 0; k < n; k++) { const a = k / n * TAU + .3, d = 2.5, h = r(.55, .85), x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d;
        add('rock', lump(R, .5, 1, .14).scale(1.05, h * 2, .7).rotateY(-a + r(-.3, .3)).rotateZ(r(-.08, .08)), [.66, .65, .62], x, ground(x, z) + h * .75, z);
        add('rock', lump(R, .3, 1, .2).scale(1.25, .3, .95), [.34, .52, .2], x, ground(x, z) + h * 1.72, z); }
      add('rock', lump(R, .7, 1, .12).scale(1.2, .28, 1), [.6, .6, .57], x0, y0 + .12, z0); },
    berries() { const berry = site.berry === 'blue' ? [.26, .32, .95] : [1.25, .12, .12], dark = site.berry === 'blue' ? [.16, .2, .6] : [.8, .08, .1], cards = [];
      const domes = [[0, 0, .78], [.75, .25, .6], [-.6, .45, .55], [.15, -.7, .5]];
      for (const [dx, dz, s2] of domes) { const a = yaw, x = x0 + Math.cos(a) * dx - Math.sin(a) * dz, z = z0 + Math.sin(a) * dx + Math.cos(a) * dz, y = ground(x, z);
        for (let k = 0; k < 5; k++) { const b = k * 1.3 + s2 * 5; add('bark', new THREE.CylinderGeometry(.012, .028, s2 * .9, 5).translate(0, s2 * .45, 0).rotateZ(.5).rotateY(b), [.8, .62, .46], x, y, z); }
        const dome = crownCards(x, y + s2 * .55, z, s2 * .82, Math.round(26 * s2 + 8), R, world.sunDir, [.42, .3], .8); for (const c of dome) { c.c = new THREE.Color(c.c * .95, c.c * 1.08, c.c * .8); cards.push(c); }
        for (let k = 0; k < Math.round(16 * s2); k++) { const c = dome[(k * 5) % dome.length], ox = c.x - x, oz = c.z - z, d = Math.hypot(ox, oz) || 1, bx = c.x + ox / d * .07, by = c.y + r(-.06, .1), bz = c.z + oz / d * .07;
          for (let j = 0; j < 3; j++) add('rock', new THREE.SphereGeometry(r(.035, .05), 7, 5), j ? berry : dark, bx + r(-.05, .05), by + r(-.05, .05), bz + r(-.05, .05)); } }
      const card = new THREE.PlaneGeometry(1, 1), n = card.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);
      const m = instanced(card, M.leaves, cards, {cast: M.shadows, receive: false, depth: M.leafDepth, name: 'berry bush leaves'}); if (m) group.add(m); },
  };
  Object.assign(kinds, {
    // the well: a wall of single stones in three courses with a rim of cap stones, moss and paving round it,
    // a timber frame with braces, a shingled roof, a windlass with rope and crank, and a hooped bucket
    well() { const rot = g => g.rotateY(yaw), off = (dx, dz) => [x0 + Math.cos(yaw) * dx + Math.sin(yaw) * dz, z0 - Math.sin(yaw) * dx + Math.cos(yaw) * dz];
      const greys = [[.74, .72, .68], [.66, .65, .62], [.8, .76, .7], [.6, .6, .58]], timber = [1.02, .8, .6], dark = [.7, .52, .38];
      for (let row = 0; row < 3; row++) for (let k = 0; k < 12; k++) { const a = (k + row * .5) / 12 * TAU, s2 = r(.9, 1.1); add('rock', lump(R, .15, 1, .12).scale(1.55 * s2, .78, 1.05).rotateY(-a + Math.PI / 2), greys[(k + row) % 4], x0 + Math.cos(a) * .84, y0 + .12 + row * .215, z0 + Math.sin(a) * .84); }
      for (let k = 0; k < 12; k++) { const a = (k + .25) / 12 * TAU; add('rock', lump(R, .15, 1, .1).scale(1.7, .42, 1.35).rotateY(-a + Math.PI / 2), greys[(k * 3) % 4], x0 + Math.cos(a) * .85, y0 + .76, z0 + Math.sin(a) * .85); }
      const inner = new THREE.CylinderGeometry(.74, .74, .8, 16, 1, true).scale(-1, 1, 1); inner.computeVertexNormals(); add('rock', inner, [.26, .26, .27], x0, y0 + .4, z0);
      add('rock', new THREE.CylinderGeometry(.8, .84, .7, 16, 1, true), [.5, .5, .48], x0, y0 + .35, z0);
      add('rock', new THREE.CircleGeometry(.74, 16).rotateX(-Math.PI / 2), [.1, .32, .48], x0, y0 + .5, z0); add('rock', new THREE.RingGeometry(.3, .36, 14).rotateX(-Math.PI / 2), [.4, .62, .74], x0 + .12, y0 + .505, z0 - .1);
      for (let k = 0; k < 6; k++) { const a = r(0, TAU); add('rock', lump(R, r(.09, .15), 1, .25).scale(1.3, .4, 1), [.3, .5, .17], x0 + Math.cos(a) * .9, y0 + r(.3, .82), z0 + Math.sin(a) * .9); }
      for (let k = 0; k < 11; k++) { const a = k / 11 * TAU + r(-.1, .1), d = r(1.2, 1.5), x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d; add('rock', lump(R, r(.17, .25), 0, .15).scale(1, .16, .85).rotateY(r(0, 3)), greys[k % 4], x, ground(x, z) + .02, z); }
      for (const sd of [-1, 1]) { const [x, z] = off(sd * .98, 0); add('wood', new THREE.CylinderGeometry(.065, .08, 2.0, 8), timber, x, y0 + 1, z);
        for (const fb of [-1, 1]) { const [bx, bz] = off(sd * .98, fb * .2); add('wood', rot(new THREE.CylinderGeometry(.035, .035, .62, 6).rotateX(fb * -.7)), dark, bx, y0 + 1.72, bz); } }
      add('wood', rot(new THREE.CylinderGeometry(.075, .075, 2.3, 10).rotateZ(Math.PI / 2)), dark, x0, y0 + 1.42, z0);                       // windlass
      for (let k = -2; k <= 2; k++) { const [x, z] = off(k * .05, 0); add('rock', rot(new THREE.TorusGeometry(.09, .022, 5, 12).rotateY(Math.PI / 2)), [1.05, .9, .62], x, y0 + 1.42, z); }
      { const [x, z] = off(1.2, 0), [x2, z2] = off(1.2, .16), [x3, z3] = off(1.3, .16); add('wood', rot(new THREE.CylinderGeometry(.022, .022, .34, 6).rotateX(Math.PI / 2)), [.5, .42, .36], x, y0 + 1.42, z + 0); add('wood', new THREE.CylinderGeometry(.03, .03, .2, 6).rotateZ(Math.PI / 2).rotateY(yaw), timber, (x2 + x3) / 2, y0 + 1.42, (z2 + z3) / 2); }
      // the roof: rows of single shingles in mixed reds over dark boards, a ridge cap with knobs, timber gables
      // with trim boards, and a little moss
      { const TH = .7, cs = Math.cos(TH), sn = Math.sin(TH), ridge = 2.66, put = (name, g, colour, lx, ly, lz) => add(name, rot(g.translate(lx, ly, lz)), colour, x0, y0, z0);
        const reds = [[1.05, .44, .3], [.9, .36, .26], [1.16, .52, .35], [.8, .32, .24], [1, .4, .27]];
        for (const sd of [-1, 1]) { put('wood', new THREE.BoxGeometry(2.42, .03, 1.16).rotateX(sd * TH), [.42, .3, .24], 0, ridge - .03 - .56 * sn, sd * .56 * cs);
          for (let row = 0; row < 6; row++) { const s2 = .1 + row * .19, n = 9; for (let k = 0; k < n + (row % 2); k++) { const lx = (k - (n - 1 + (row % 2)) / 2) * .285, w = row % 2 && (k === 0 || k === n) ? .14 : .275;
            put('wood', new THREE.BoxGeometry(w, .034, .27).rotateX(sd * TH + sd * .06).rotateZ(r(-.012, .012)), reds[Math.floor(R() * reds.length)], row % 2 && k === 0 ? lx + .07 : row % 2 && k === n ? lx - .07 : lx, ridge + .035 - s2 * sn + r(-.004, .004), sd * s2 * cs); } }
          // trim boards along the gable edges, front and back
          for (const end of [-1, 1]) put('wood', new THREE.BoxGeometry(.06, .11, 1.3).rotateX(sd * TH), [1.2, 1, .8], end * 1.3, ridge - .04 - .58 * sn, sd * .58 * cs); }
        put('wood', new THREE.CylinderGeometry(.065, .065, 2.7, 8).rotateZ(Math.PI / 2), [.62, .26, .2], 0, ridge + .075, 0); for (const end of [-1, 1]) put('rock', new THREE.SphereGeometry(.085, 9, 7), [.62, .26, .2], end * 1.37, ridge + .075, 0);
        for (const end of [-1, 1]) { const tri = new THREE.Shape(); tri.moveTo(-.86, 0); tri.lineTo(.86, 0); tri.lineTo(0, .86 * sn / cs); tri.closePath(); put('wood', new THREE.ExtrudeGeometry(tri, {depth: .04, bevelEnabled: false}).translate(0, 0, -.02).rotateY(Math.PI / 2), [1.1, .86, .64], end * 1.02, ridge - .78, 0);
          put('rock', new THREE.CylinderGeometry(.1, .1, .05, 12).rotateZ(Math.PI / 2), [.3, .22, .18], end * 1.03, ridge - .42, 0); put('wood', new THREE.BoxGeometry(.07, .07, 1.74), dark, end * 1.02, ridge - .8, 0); }
        for (let k = 0; k < 3; k++) put('rock', lump(R, r(.12, .2), 1, .25).scale(1.3, .3, 1).rotateX(TH), [.32, .52, .18], r(-.9, .9), ridge + .05 - r(.5, .9) * sn, r(.5, .9) * cs); }
      // rope and bucket, hanging a little to one side
      { const [x, z] = off(.12, 0); add('rock', new THREE.CylinderGeometry(.014, .014, .42, 5), [1.05, .9, .62], x, y0 + 1.2, z);
        add('wood', new THREE.CylinderGeometry(.17, .13, .26, 12), [1.15, .9, .64], x, y0 + .88, z); for (const h of [.8, .95]) add('rock', new THREE.TorusGeometry(h > .9 ? .163 : .143, .014, 5, 14).rotateX(Math.PI / 2), [.34, .32, .32], x, y0 + h, z);
        add('rock', rot(new THREE.TorusGeometry(.15, .012, 5, 12, Math.PI)), [.34, .32, .32], x, y0 + 1.0, z); add('rock', new THREE.CircleGeometry(.15, 12).rotateX(-Math.PI / 2), [.12, .34, .5], x, y0 + .97, z); }
      // flowers at its foot
      for (let k = 0; k < 9; k++) { const a = r(0, TAU), d = r(1.0, 1.15), x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d, y = ground(x, z); add('rock', new THREE.CylinderGeometry(.008, .008, .16, 4), [.3, .55, .18], x, y + .08, z); add('rock', new THREE.SphereGeometry(.035, 6, 5), [[1.3, 1.05, .25], [.5, .55, 1.3], [1.3, 1.25, 1.2]][k % 3], x, y + .17, z); } },
    lanterns() { const lights = [];
      for (const [x, z, a] of site.posts) { const y = ground(x, z), lx = x + Math.cos(a) * .32, lz = z + Math.sin(a) * .32;
        add('wood', new THREE.CylinderGeometry(.05, .075, 1.75, 7), [.72, .55, .42], x, y + .87, z); add('wood', new THREE.BoxGeometry(.5, .06, .06).rotateY(-a), [.72, .55, .42], x + Math.cos(a) * .18, y + 1.72, z + Math.sin(a) * .18);
        add('rock', new THREE.BoxGeometry(.2, .05, .2), [.3, .24, .2], lx, y + 1.62, lz); add('rock', new THREE.BoxGeometry(.2, .04, .2), [.3, .24, .2], lx, y + 1.36, lz);
        add('rock', new THREE.BoxGeometry(.15, .22, .15), [3.4, 2.5, 1.1], lx, y + 1.49, lz); add('rock', new THREE.ConeGeometry(.16, .12, 4).rotateY(Math.PI / 4), [.3, .24, .2], lx, y + 1.7, lz);
        lights.push(lx, y + 1.49, lz); }
      const glow = canvasTex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,236,170,.9)'); q.addColorStop(.3, 'rgba(255,205,110,.4)'); q.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = q; g.fillRect(0, 0, 64, 64); });
      const p = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(lights, 3)), new THREE.PointsMaterial({map: glow, size: 1.5, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false}));
      p.name = 'lantern glow'; p.renderOrder = 5; group.add(p); },
    table() { add('log', new THREE.CylinderGeometry(.85, 1, .55, 18), [1.3, 1.05, .8], x0, y0 + .27, z0);
      for (let k = 0; k < 3; k++) { const a = k * 2.1 + .5, x = x0 + Math.cos(a) * 1.35, z = z0 + Math.sin(a) * 1.35; add('log', new THREE.CylinderGeometry(.27, .32, .32, 12), [1.2, .98, .76], x, ground(x, z) + .16, z); }
      add('rock', new THREE.CylinderGeometry(.6, .6, .015, 20), [1.25, 1.2, 1.05], x0, y0 + .56, z0);
      add('rock', new THREE.CylinderGeometry(.11, .11, .17, 10), [1.5, .95, .2], x0 + .28, y0 + .65, z0 - .12); add('rock', new THREE.CylinderGeometry(.12, .12, .03, 10), [.9, .7, .5], x0 + .28, y0 + .75, z0 - .12);
      add('rock', new THREE.CylinderGeometry(.17, .18, .1, 12), [1.3, 1.15, .9], x0 - .2, y0 + .62, z0 + .1); add('rock', new THREE.SphereGeometry(.04, 7, 5), [.9, .12, .14], x0 - .2, y0 + .7, z0 + .1);
      for (let k = 0; k < 3; k++) { const a = k * 2.1 + .5; add('rock', new THREE.SphereGeometry(.07, 9, 5, 0, TAU, Math.PI / 2, Math.PI / 2), [.62, .42, .24], x0 + Math.cos(a) * .42, y0 + .64, z0 + Math.sin(a) * .42); } },
    // a picnic place as in many Swiss woods: a heavy timber table with fixed benches, and a fire place with a
    // ring of stones, a swivelling grill on an iron post with two sausages on it, log seats and a pile of firewood
    picnic() { const wood = [1.18, .95, .7], woodDark = [.95, .74, .54], iron = [.2, .2, .22], put = (name, g, colour, lx, ly, lz) => add(name, g.translate(lx, ly, lz).rotateY(yaw), colour, x0, y0, z0);
      for (let k = -1; k <= 1; k++) put('wood', new THREE.BoxGeometry(2.3, .07, .27), k ? wood : [1.25, 1.02, .76], 0, .78, k * .285);
      for (const sd of [-1, 1]) { for (let k = 0; k < 2; k++) put('wood', new THREE.BoxGeometry(2.3, .06, .17), k ? wood : woodDark, 0, .46, sd * (.78 + k * .185));
        for (const end of [-1, 1]) { put('wood', new THREE.BoxGeometry(.1, .9, .1).rotateX(sd * -.42), woodDark, end * .85, .4, sd * .34); put('wood', new THREE.BoxGeometry(.1, .09, .5), woodDark, end * .85, .4, sd * .72); } }
      for (const end of [-1, 1]) { put('wood', new THREE.BoxGeometry(.1, .09, .86), woodDark, end * .85, .72, 0); put('wood', new THREE.BoxGeometry(.1, .09, 1.9), woodDark, end * .85, .4, 0); }
      put('wood', new THREE.BoxGeometry(1.7, .08, .08), woodDark, 0, .4, 0);
      // on the table: a loaf, a cup and an apple
      put('rock', new THREE.SphereGeometry(.13, 10, 7).scale(1.5, .7, 1), [1.05, .7, .38], -.45, .88, .05); put('rock', new THREE.CylinderGeometry(.055, .045, .1, 9), [.85, .2, .16], .2, .865, -.12); put('rock', new THREE.SphereGeometry(.06, 8, 6), [1.25, .14, .1], .5, .875, .1);
      // the fire place
      const [fx, fz] = site.fire, fy = ground(fx, fz), greys = [[.7, .68, .64], [.6, .6, .58], [.76, .72, .66]];
      for (let k = 0; k < 11; k++) { const a = k / 11 * TAU + r(-.08, .08); add('rock', lump(R, r(.15, .2), 1, .14).scale(1.25, .85, 1).rotateY(-a), greys[k % 3], fx + Math.cos(a) * .66, fy + .1, fz + Math.sin(a) * .66); }
      add('rock', new THREE.CircleGeometry(.6, 14).rotateX(-Math.PI / 2), [.16, .14, .13], fx, fy + .04, fz);
      for (let k = 0; k < 5; k++) { const a = k * 1.26; add('log', new THREE.CylinderGeometry(.045, .055, .62, 7).translate(0, .31, 0).rotateZ(.62).rotateY(a), k % 2 ? [.5, .34, .22] : [.26, .2, .17], fx + Math.cos(a) * .02, fy + .04, fz + Math.sin(a) * .02); }
      for (let k = 0; k < 7; k++) add('rock', new THREE.SphereGeometry(r(.035, .06), 6, 5), [4.2, 1.5, .3], fx + r(-.22, .22), fy + r(.07, .16), fz + r(-.22, .22));   // embers
      const glow = canvasTex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,190,90,.75)'); q.addColorStop(.4, 'rgba(255,130,50,.3)'); q.addColorStop(1, 'rgba(255,110,40,0)'); g.fillStyle = q; g.fillRect(0, 0, 64, 64); });
      const ember = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([fx, fy + .22, fz], 3)), new THREE.PointsMaterial({map: glow, size: 1.7, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false})); ember.name = 'fire glow'; ember.renderOrder = 5; group.add(ember);
      // swivel grill: post, arm, round grate with bars, two sausages
      add('rock', new THREE.CylinderGeometry(.03, .035, 1.25, 7), iron, fx + .82, fy + .62, fz); add('rock', new THREE.CylinderGeometry(.018, .018, .86, 6).rotateZ(Math.PI / 2), iron, fx + .4, fy + .62, fz);
      add('rock', new THREE.TorusGeometry(.36, .018, 5, 20).rotateX(Math.PI / 2), iron, fx, fy + .62, fz); for (let k = -3; k <= 3; k++) { const w = Math.sqrt(Math.max(0, .36 * .36 - (k * .09) ** 2)) * 2; add('rock', new THREE.CylinderGeometry(.008, .008, w, 4).rotateX(Math.PI / 2), iron, fx + k * .09, fy + .62, fz); }
      for (const dz of [-.1, .1]) { add('rock', new THREE.CapsuleGeometry(.035, .2, 4, 8).rotateZ(Math.PI / 2), [1.05, .36, .2], fx + r(-.05, .05), fy + .665, fz + dz); }
      // two log seats and the firewood
      for (const a of [2.3, 3.9]) { const x = fx + Math.cos(a) * 1.45, z = fz + Math.sin(a) * 1.45; add('log', new THREE.CylinderGeometry(.26, .3, .42, 12), [1.25, 1, .78], x, ground(x, z) + .21, z); }
      { const wx = fx + 1.7, wz = fz - 1.1, wy = ground(wx, wz); for (let row = 0; row < 3; row++) for (let k = 0; k < 4 - row; k++) add('log', new THREE.CylinderGeometry(.085, .085, .7, 8).rotateX(Math.PI / 2), (k + row) % 2 ? [1.2, .95, .72] : [1.05, .82, .6], wx + (k - (3 - row) / 2) * .18, wy + .09 + row * .155, wz); } },
    // a toadstool big enough to live in: door, round window with a light, chimney, stepping stones
    fairyhouse() { add('rock', new THREE.CylinderGeometry(.56, .72, 1.3, 14), [1.2, 1.1, .94], x0, y0 + .65, z0);
      add('soft', new THREE.SphereGeometry(1.3, 18, 9, 0, TAU, 0, Math.PI / 2).scale(1, .72, 1), [.9, .15, .11], x0, y0 + 1.22, z0);
      add('rock', new THREE.CircleGeometry(1.28, 18).rotateX(Math.PI / 2), [1.1, .95, .8], x0, y0 + 1.23, z0);
      for (let k = 0; k < 11; k++) { const a = k * 2.4, q = k ? r(.3, 1.05) : 0; add('soft', new THREE.SphereGeometry(r(.09, .16), 8, 5).scale(1, .5, 1), [1.25, 1.2, 1.1], x0 + Math.cos(a) * q, y0 + 1.22 + Math.sqrt(Math.max(0, 1.69 - q * q)) * .72, z0 + Math.sin(a) * q); }
      const front = (dx, y, out = .6) => [x0 + Math.sin(yaw) * out + Math.cos(yaw) * dx, y0 + y, z0 + Math.cos(yaw) * out - Math.sin(yaw) * dx];
      add('wood', new THREE.BoxGeometry(.34, .5, .08).rotateY(yaw), [.95, .6, .36], ...front(0, .27, .66)); add('wood', new THREE.CylinderGeometry(.17, .17, .08, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).rotateY(yaw), [.95, .6, .36], ...front(0, .52, .66));
      add('rock', new THREE.SphereGeometry(.03, 6, 5), [1.6, 1.2, .4], ...front(.1, .3, .72));
      add('rock', new THREE.CylinderGeometry(.15, .15, .06, 12).rotateX(Math.PI / 2).rotateY(yaw), [3.2, 2.5, 1.1], ...front(.36, .88, .5)); add('wood', new THREE.TorusGeometry(.15, .03, 5, 12).rotateY(yaw), [.95, .6, .36], ...front(.36, .88, .53));
      add('rock', new THREE.CylinderGeometry(.09, .11, .5, 8), [.62, .6, .58], x0 - .5, y0 + 2.05, z0 - .2); add('rock', new THREE.CylinderGeometry(.12, .12, .07, 8), [.5, .48, .46], x0 - .5, y0 + 2.32, z0 - .2);
      for (let k = 1; k <= 3; k++) { const [x, , z] = front(r(-.12, .12), 0, .75 + k * .5); add('rock', lump(R, .2, 0, .15).scale(1, .22, .85), [.68, .66, .62], x, ground(x, z) + .03, z); }
      for (let k = 0; k < 4; k++) { const a = yaw + 1.2 + k * .9; toadstool(x0 + Math.sin(a) * 1.25, z0 + Math.cos(a) * 1.25, r(.5, .8)); } },
    // an apple tree: leafy crown like the forest's trees, red and yellow-red apples hanging in it and lying in the grass
    apple() { const {list} = tree({cards: 64, crown: 2.05});
      for (let k = 0; k < 30; k++) { const c = list[(k * 7) % list.length], dx = c.x - x0, dz = c.z - z0, d = Math.hypot(dx, dz) || 1, red = k % 4 ? [1.3, .13, .08] : [1.35, .62, .12];
        add('soft', new THREE.SphereGeometry(r(.09, .12), 9, 7).scale(1, .92, 1), red, c.x + dx / d * .32, c.y - .28, c.z + dz / d * .32); add('soft', new THREE.CylinderGeometry(.008, .008, .09, 4), [.4, .3, .18], c.x + dx / d * .32, c.y - .14, c.z + dz / d * .32); }
      for (let k = 0; k < 7; k++) { const a = r(0, TAU), d = r(.8, 2.4), x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d; add('rock', new THREE.SphereGeometry(.1, 8, 6), k % 3 ? [1.3, .13, .08] : [1.35, .62, .12], x, ground(x, z) + .08, z); } },
    sign() { add('wood', new THREE.CylinderGeometry(.06, .085, 1.9, 7), [.85, .66, .5], x0, y0 + .95, z0);
      site.arms.forEach((a, k) => { const sh = new THREE.Shape(); sh.moveTo(0, -.1); sh.lineTo(.62, -.1); sh.lineTo(.8, 0); sh.lineTo(.62, .1); sh.lineTo(0, .1); sh.closePath();
        add('wood', new THREE.ExtrudeGeometry(sh, {depth: .045, bevelEnabled: false}).translate(.02, 0, -.022).rotateY(-a), [1.25, 1, .72], x0, y0 + 1.68 - k * .27, z0); });
      add('rock', new THREE.SphereGeometry(.085, 8, 6), [.85, .66, .5], x0, y0 + 1.92, z0); },
  });
  return [() => { kinds[site.kind]?.(); finish(); }];
}
