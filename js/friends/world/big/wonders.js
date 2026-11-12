/* Small things to discover beside the paths of the big world: a ring of toadstools, a hollow log, a circle of
   old stones, a tree in blossom, berry bushes, a stone well, lanterns at the den, a stump laid as a table,
   a beehive (its bees fly in world/life.js) and signposts. Each is its own little site (layout.js WONDERS), built in one
   short step when Fuchs comes near, from a few hundred triangles on the shared rock, log, bark and soft
   materials; the solid ones have colliders (layout.js SOLIDS) and a small clearing (GLADES). */
import {THREE} from '../../../scene/materials.js';
import {rng} from '../noise.js';
import {Buffer} from '../tiles.js';
import {canvasTex} from '../textures.js';

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

  const kinds = {
    ring() { const n = 9; for (let k = 0; k < n; k++) { const a = k / n * TAU + r(-.12, .12), d = 1.35 + r(-.1, .1); toadstool(x0 + Math.cos(a) * d, z0 + Math.sin(a) * d, r(.75, 1.35)); }
      for (let k = 0; k < 3; k++) toadstool(x0 + r(-.3, .3), z0 + r(-.3, .3), r(.45, .6), [.78, .56, .3]); },
    log() { const len = 3.4, turn = g => g.rotateZ(Math.PI / 2).rotateY(yaw), y = y0 + .68;
      add('log', turn(new THREE.CylinderGeometry(.76, .8, len, 16, 1, true)), [1.05, .9, .76], x0, y, z0);
      const inner = turn(new THREE.CylinderGeometry(.66, .7, len, 16, 1, true).scale(-1, 1, 1)); inner.computeVertexNormals(); add('log', inner, [.34, .25, .18], x0, y, z0);
      for (const s of [-1, 1]) add('log', new THREE.RingGeometry(.67, .79, 18).rotateY(s * Math.PI / 2).rotateY(yaw), [1.5, 1.25, .9], x0 + Math.cos(yaw) * s * len / 2, y, z0 - Math.sin(yaw) * s * len / 2);
      for (let k = 0; k < 4; k++) { const t = r(-.38, .38) * len; add('soft', lump(R, r(.3, .46), 1, .2).scale(1.5, .32, 1), [.3, .5, .16], x0 + Math.cos(yaw) * t, y + .72, z0 - Math.sin(yaw) * t); }
      for (let k = 0; k < 3; k++) { const t = r(-.4, .4) * len, side = k % 2 ? 1 : -1; toadstool(x0 + Math.cos(yaw) * t + Math.sin(yaw) * side * .95, z0 - Math.sin(yaw) * t + Math.cos(yaw) * side * .95, r(.6, .9), [.86, .62, .28]); } },
    stones() { const n = 6; for (let k = 0; k < n; k++) { const a = k / n * TAU + .3, d = 2.5, h = r(.55, .85), x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d;
        add('rock', lump(R, .5, 1, .14).scale(1.05, h * 2, .7).rotateY(-a + r(-.3, .3)).rotateZ(r(-.08, .08)), [.66, .65, .62], x, ground(x, z) + h * .75, z);
        add('rock', lump(R, .3, 1, .2).scale(1.25, .3, .95), [.34, .52, .2], x, ground(x, z) + h * 1.72, z); }
      add('rock', lump(R, .7, 1, .12).scale(1.2, .28, 1), [.6, .6, .57], x0, y0 + .12, z0); },
    blossom() { add('bark', new THREE.CylinderGeometry(.2, .36, 2.5, 10), [1.1, .95, .9], x0, y0 + 1.25, z0);
      for (let k = 0; k < 4; k++) { const a = k * 1.7 + .4; add('bark', new THREE.CylinderGeometry(.07, .13, 1.5, 7).translate(0, .75, 0).rotateZ(.75).rotateY(a), [1.1, .95, .9], x0, y0 + 2.1, z0); }
      const pinks = [[1.3, .46, .66], [1.36, .62, .78], [1.22, .38, .58], [1.4, .78, .88]];
      for (let k = 0; k < 26; k++) { const a = k * 2.4, d = k ? r(.4, 1.75) : 0, x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d; add('soft', new THREE.SphereGeometry(r(.42, .72), 10, 7).scale(1, .86, 1), pinks[k % 4], x, y0 + 3 + r(0, 1.5) - d * .3, z); }
      for (let k = 0; k < 46; k++) { const a = r(0, TAU), d = Math.sqrt(R()) * 3.2, x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d; add('rock', new THREE.CircleGeometry(r(.035, .06), 5).rotateX(-Math.PI / 2).rotateY(r(0, 3)), pinks[k % 4], x, ground(x, z) + .03, z); } },
    berries() { const berry = site.berry === 'blue' ? [.24, .3, .78] : [.86, .12, .14];
      for (let k = 0; k < 3; k++) { const a = k * 2.1 + yaw, d = k ? .42 : 0, x = x0 + Math.cos(a) * d, z = z0 + Math.sin(a) * d, s = r(.48, .64), y = ground(x, z) + s * .62;
        add('rock', lump(R, s, 1, .2).scale(1, .82, 1), k % 2 ? [.24, .44, .14] : [.3, .52, .17], x, y, z);
        for (let j = 0; j < 9; j++) { const u = r(0, TAU), v = r(.15, 1.25), q = s * 1.02; add('rock', new THREE.SphereGeometry(r(.045, .06), 7, 5), berry, x + Math.sin(v) * Math.cos(u) * q, y + Math.cos(v) * q * .82, z + Math.sin(v) * Math.sin(u) * q); } } },
  };
  Object.assign(kinds, {
    well() { const rot = g => g.rotateY(yaw), off = (dx, dz) => [x0 + Math.cos(yaw) * dx + Math.sin(yaw) * dz, z0 - Math.sin(yaw) * dx + Math.cos(yaw) * dz];
      add('rock', new THREE.CylinderGeometry(.84, .9, .72, 14, 1, true), [.72, .7, .66], x0, y0 + .36, z0);
      const inner = new THREE.CylinderGeometry(.7, .7, .72, 14, 1, true).scale(-1, 1, 1); inner.computeVertexNormals(); add('rock', inner, [.3, .3, .3], x0, y0 + .36, z0);
      add('rock', new THREE.TorusGeometry(.77, .11, 6, 16).rotateX(Math.PI / 2), [.8, .78, .73], x0, y0 + .72, z0);
      for (let k = 0; k < 9; k++) { const a = k / 9 * TAU; add('rock', lump(R, .13, 0, .2).scale(1.3, .8, 1), [.6, .6, .57], x0 + Math.cos(a) * .9, y0 + r(.12, .5), z0 + Math.sin(a) * .9); }
      add('rock', new THREE.CircleGeometry(.7, 14).rotateX(-Math.PI / 2), [.1, .3, .46], x0, y0 + .46, z0);
      for (const sd of [-1, 1]) { const [x, z] = off(sd * .86, 0); add('wood', new THREE.BoxGeometry(.13, 1.75, .13), [1.05, .85, .68], x, y0 + .87, z); }
      add('wood', rot(new THREE.CylinderGeometry(.05, .05, 1.8, 8).rotateZ(Math.PI / 2)), [.9, .72, .56], x0, y0 + 1.5, z0);
      for (const sd of [-1, 1]) { const [x, z] = off(0, sd * .36); add('wood', rot(new THREE.BoxGeometry(2.1, .07, .86).rotateX(sd * .62)), [1.05, .5, .36], x, y0 + 1.98, z); }
      add('wood', new THREE.CylinderGeometry(.012, .012, .55, 5), [.7, .6, .45], x0, y0 + 1.22, z0); add('wood', new THREE.CylinderGeometry(.15, .12, .22, 9), [1.1, .85, .6], x0, y0 + .9, z0); },
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
    hive() { add('log', new THREE.CylinderGeometry(.46, .54, .5, 14), [1.25, 1, .78], x0, y0 + .25, z0);
      for (let k = 0; k < 6; k++) add('rock', new THREE.TorusGeometry(.37 - k * .052, .085, 7, 16).rotateX(Math.PI / 2), k % 2 ? [1.3, .98, .38] : [1.2, .88, .3], x0, y0 + .58 + k * .125, z0);
      add('rock', new THREE.SphereGeometry(.1, 8, 6), [1.25, .93, .34], x0, y0 + 1.3, z0); add('rock', new THREE.SphereGeometry(.07, 8, 6).scale(1, 1, .5), [.2, .13, .08], x0, y0 + .62, z0 + .43); },
    sign() { add('wood', new THREE.CylinderGeometry(.06, .085, 1.9, 7), [.85, .66, .5], x0, y0 + .95, z0);
      site.arms.forEach((a, k) => { const sh = new THREE.Shape(); sh.moveTo(0, -.1); sh.lineTo(.62, -.1); sh.lineTo(.8, 0); sh.lineTo(.62, .1); sh.lineTo(0, .1); sh.closePath();
        add('wood', new THREE.ExtrudeGeometry(sh, {depth: .045, bevelEnabled: false}).translate(.02, 0, -.022).rotateY(-a), [1.25, 1, .72], x0, y0 + 1.68 - k * .27, z0); });
      add('rock', new THREE.SphereGeometry(.085, 8, 6), [.85, .66, .5], x0, y0 + 1.92, z0); },
  });
  return [() => { kinds[site.kind]?.(); finish(); }];
}
