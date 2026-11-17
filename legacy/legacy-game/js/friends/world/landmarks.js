/* One-off objects of a region (blueprint 6.1, 6.3), merged by material so the whole set costs a
   handful of draw calls: the home tree with its closed door, round window and lanterns, the arched
   bridge, the fallen-log bridge, the friends' props, and the brook's flowing water. */
import {THREE} from '../../forest/materials.js';
import {TAU, lerp, sstep, fbm, rng} from './noise.js';
import {canvasTex} from './textures.js';
import {trunkGeometry, rootGeometries, crownCards, instanced} from './tiles.js';

const C = h => new THREE.Color(h);
function tint(g, color) { const n = g.attributes.position.count, c = typeof color === 'function' ? null : C(color), out = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const k = c || color(g.attributes.position.getX(i), g.attributes.position.getY(i), g.attributes.position.getZ(i), i); out.set([k.r, k.g, k.b], i * 3); } g.setAttribute('color', new THREE.BufferAttribute(out, 3)); return g; }
function merge(geos) {
  const pos = [], nor = [], uv = [], col = [], idx = []; let base = 0;
  for (const g0 of geos) { const g = g0, p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv, c = g.attributes.color;
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); uv.push(u ? u.getX(i) : 0, u ? u.getY(i) : 0); col.push(c ? c.getX(i) : 1, c ? c.getY(i) : 1, c ? c.getZ(i) : 1); }
    if (g.index) for (const k of g.index.array) idx.push(base + k); else for (let i = 0; i < p.count; i++) idx.push(base + i);
    base += p.count; g.dispose(); }
  if (!base) return null;
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  out.setIndex(base > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1)); out.computeBoundingSphere(); return out;
}
const at = (g, x, y, z) => g.translate(x, y, z);

/* ---------- landmarks, built in steps ---------- */
export function landmarkSteps(region, look, world, group, out) {
  const {M, T} = look, R = rng(region.seed + 77), ground = region.ground;
  const bark = [], rocks = [], logs = [], wood = [], lamps = [], halos = [], leafCards = [];
  const steps = [];
  const has = id => (region.landmarks || []).includes(id);
  const home = region.home;

  if (has('homeTree')) steps.push(() => {
    // A wide old trunk, flattened at the front where the den door sits; roots run into the ground
    // except in front of the doorstep.
    const hx = home.x, hz = home.z, y0 = ground(hx, hz) - .05;
    const prof = [[3.6, 0], [2.95, .3], [2.55, .8], [2.36, 1.5], [2.26, 2.6], [2.14, 4], [1.98, 5.6], [1.84, 7.2], [1.72, 8.6], [1.62, 10]];
    const geo = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 40, 30), pp = geo.attributes.position;
    for (let i = 0; i < pp.count; i++) { let x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i); const a = Math.atan2(z, x), r = Math.hypot(x, z), tw = a + y * .05, k = 1 + .07 * Math.sin(tw * 7 + y * .3) + .34 * Math.max(0, Math.sin(tw * 6 + .4)) * Math.max(0, 1 - y / 1.8); x = Math.cos(a) * r * k; z = Math.sin(a) * r * k; if (z > 0 && Math.abs(x) < 1.35 && y < 2.9) z = Math.min(z, 2.3 + .25 * sstep(1.0, 1.35, Math.abs(x)) + .2 * sstep(2.5, 2.9, y)); pp.setXYZ(i, x, y, z); }
    geo.computeVertexNormals(); geo.translate(hx, y0, hz);
    tint(geo, (x, y, z) => C('#ffe3cc').lerp(C('#8fb35a'), sstep(1.2, .1, y - y0) * sstep(.3, .65, fbm(x * 2, z * 2 + y)))); bark.push(geo);
  });
  if (has('homeTree')) steps.push(() => {
    const hx = home.x, hz = home.z, y0 = ground(hx, hz) - .05;
    bark.push(...rootGeometries({x: hx, z: hz, r: 1.25}, ground, R, {count: 7, length: 1.6, radius: .625, skip: a => Math.abs(Math.sin(a) - 1) < .25}));
    leafCardsPush(crownCards(hx, y0 + 10.5, hz, 6.4, 150, R, world.sunDir, [2.6, 1.6], .6));
  });
  if (has('homeTree')) steps.push(() => {
    const hx = home.x, hz = home.z;
    // the closed den door: planks, strap hinges on the right, brass mail lid, knob on the left
    const door = canvasTex(256, 352, (c, w, h) => {
      c.fillStyle = '#6e4224'; c.fillRect(0, 0, w, h); const pw = w / 5;
      for (let i = 0; i < 5; i++) { const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, i % 2 ? '#cf9152' : '#c88a4e'); g2.addColorStop(1, i % 2 ? '#a86c38' : '#a26634'); c.fillStyle = g2; c.fillRect(i * pw + 2, 0, pw - 4, h); c.fillStyle = 'rgba(255,230,190,.14)'; c.fillRect(i * pw + 6, 0, 3, h); }
      c.fillStyle = '#2f2621'; for (const y of [h * .24, h * .76]) { c.beginPath(); c.moveTo(w, y - 9); c.lineTo(w * .34, y - 9); c.lineTo(w * .26, y); c.lineTo(w * .34, y + 9); c.lineTo(w, y + 9); c.fill(); }
      c.fillStyle = '#8a6420'; c.beginPath(); c.roundRect(w * .3, h * .5, w * .4, h * .075, 5); c.fill(); c.fillStyle = '#d9ab4c'; c.beginPath(); c.roundRect(w * .31, h * .505, w * .38, h * .065, 4); c.fill(); c.fillStyle = '#5a4214'; c.fillRect(w * .36, h * .525, w * .28, h * .022);
      c.fillStyle = '#8a6420'; c.beginPath(); c.arc(w * .15, h * .6, 13, 0, TAU); c.fill(); c.fillStyle = '#e6bb58'; c.beginPath(); c.arc(w * .15, h * .6, 10, 0, TAU); c.fill(); c.fillStyle = '#fff3c0'; c.beginPath(); c.arc(w * .14, h * .59, 3, 0, TAU); c.fill();
    });
    const dy = ground(hx, hz + 2.3) - .02, arch = new THREE.Shape(); arch.moveTo(-.62, 0); arch.lineTo(-.62, 1.32); arch.absarc(0, 1.32, .62, Math.PI, 0, true); arch.lineTo(.62, 0); arch.lineTo(-.62, 0);
    const sg = new THREE.ShapeGeometry(arch, 20), uv = sg.attributes.uv, sp = sg.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (sp.getX(i) + .62) / 1.24, sp.getY(i) / 1.94);
    const doorMesh = new THREE.Mesh(sg, new THREE.MeshLambertMaterial({map: door})); doorMesh.name = 'den-door'; doorMesh.position.set(hx, dy, hz + 2.33); doorMesh.receiveShadow = M.shadows; group.add(doorMesh);
    const frame = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-.74, -.05], [-.74, 1.3], [-.52, 1.86], [0, 2.06], [.52, 1.86], [.74, 1.3], [.74, -.05]].map(([x, y]) => new THREE.Vector3(x, y, 0))), 40, .12, 8);
    bark.push(tint(at(frame, hx, dy, hz + 2.35), '#8a5a34'));
    rocks.push(tint(at(new THREE.CylinderGeometry(.9, 1, .16, 20, 1).scale(1, 1, .55), hx, dy + .02, hz + 2.8), '#9a8a74'));
    // the round window, lit from inside, to the right of the door
    const winTex = canvasTex(128, 128, (c, w, h) => { const g2 = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g2.addColorStop(0, '#fff6d0'); g2.addColorStop(.6, '#ffd987'); g2.addColorStop(1, '#e8a24a'); c.fillStyle = g2; c.fillRect(0, 0, w, h); c.strokeStyle = '#7a4a28'; c.lineWidth = 8; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke(); });
    const wx = 1.5, wy = 2.7, wz = Math.sqrt(2.62 ** 2 - wx * wx) + .02, ang = Math.atan2(wx, wz);
    const win = new THREE.Mesh(new THREE.CircleGeometry(.36, 28), new THREE.MeshBasicMaterial({map: winTex, toneMapped: false})); win.name = 'den-window'; win.position.set(hx + wx, dy + wy, hz + wz); win.rotation.y = ang; group.add(win);
    bark.push(tint(new THREE.TorusGeometry(.38, .09, 8, 28).rotateY(ang).translate(hx + wx, dy + wy, hz + wz), '#8a5a34'));
    for (const sx of [-1, 1]) lantern(hx + sx * 1.05, dy + 1.75, hz + 2.42);
    out.door = {x: hx, z: hz + 2.33};
  });
  function leafCardsPush(list) { leafCards.push(...list); }
  function lantern(x, y, z) {
    lamps.push(at(new THREE.CylinderGeometry(.11, .13, .26, 8), x, y, z));
    bark.push(tint(at(new THREE.ConeGeometry(.17, .14, 8), x, y + .2, z), '#5a3a26'));
    halos.push(x, y, z);
  }
  if (has('bridge')) steps.push(() => {
    const c = region.crossings.find(k => k.kind === 'bridge'), dx = c.b[0] - c.a[0], dz = c.b[1] - c.a[1], len = Math.hypot(dx, dz), dir = [dx / len, dz / len], side = [-dir[1], dir[0]], yaw = Math.atan2(dir[0], dir[1]);
    const n = Math.round(c.span / .3);
    for (let k = 0; k <= n; k++) { const t = k / n, x = c.a[0] + dx * t, z = c.a[1] + dz * t, y = region.deck(c, t) - .04, slope = Math.atan2(region.deck(c, Math.min(1, t + .02)) - region.deck(c, Math.max(0, t - .02)), .04 * len);
      const g = new THREE.BoxGeometry(.26, .08, c.width + .1); g.rotateZ(-slope); g.rotateY(yaw - Math.PI / 2); wood.push(tint(at(g, x, y, z), new THREE.Color(1, 1, 1).multiplyScalar(.88 + R() * .22))); }
    for (const sd of [-1, 1]) {
      const rail = [], mid = []; for (let k = 0; k <= 8; k++) { const t = .04 + k / 8 * .92, x = c.a[0] + dx * t + side[0] * c.width / 2 * sd, z = c.a[1] + dz * t + side[1] * c.width / 2 * sd, y = region.deck(c, t); rail.push(new THREE.Vector3(x, y + .66, z)); mid.push(new THREE.Vector3(x, y + .36, z)); }
      wood.push(tint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rail), 24, .05, 6), '#ffffff'), tint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mid), 24, .035, 6), '#e8dccc'));
      for (const t of [.04, .35, .65, .96]) { const x = c.a[0] + dx * t + side[0] * c.width / 2 * sd, z = c.a[1] + dz * t + side[1] * c.width / 2 * sd, y = region.deck(c, t); wood.push(tint(at(new THREE.CylinderGeometry(.05, .06, .74, 6), x, y + .3, z), '#d6c4ae')); }
    }
  });
  if (has('logBridge')) steps.push(() => {
    const c = region.crossings.find(k => k.kind === 'log'), a = new THREE.Vector3(c.a[0], c.ya, c.a[1]), b = new THREE.Vector3(c.b[0], c.yb, c.b[1]);
    const pts = [0, .25, .5, .75, 1].map(u => { const p = a.clone().lerp(b, u); p.y -= Math.sin(u * Math.PI) * .06; p.x += Math.sin(u * 5) * .04; return p; });
    const curve = new THREE.CatmullRomCurve3(pts), seg = 40, geo = new THREE.TubeGeometry(curve, seg, c.radius, 14, false), pp = geo.attributes.position;
    for (let i = 0; i < pp.count; i++) { const ring = Math.floor(i / 15), u = ring / seg, cp = curve.getPointAt(Math.min(1, u)), k = (1 - u * .28) * (1 + .06 * Math.sin(i * 1.7)); pp.setXYZ(i, cp.x + (pp.getX(i) - cp.x) * k, cp.y + (pp.getY(i) - cp.y) * k, cp.z + (pp.getZ(i) - cp.z) * k); }
    geo.computeVertexNormals(); const nn = geo.attributes.normal;
    tint(geo, (x, y, z, i) => C('#f0d8c0').lerp(C('#9cc25a'), sstep(.45, .8, nn.getY(i) + (fbm(x * 3, z * 3) - .5) * .6) * .95)); logs.push(geo);
    const ax = a.clone().sub(b).setY(0).normalize(), perp = new THREE.Vector3(-ax.z, 0, ax.x);
    const plate = new THREE.SphereGeometry(.62, 18, 12).scale(.35, 1, 1); plate.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.atan2(ax.x, ax.z) + Math.PI / 2)); at(plate, a.x + ax.x * .1, c.ya + .12, a.z + ax.z * .1);
    logs.push(tint(plate, (x, y, z) => C('#c9a27a').lerp(C('#a07a54'), fbm(x * 5, y * 5 + z))));
    for (let k = 0; k < 9; k++) { const ang = k / 9 * TAU, r0 = new THREE.Vector3(a.x + ax.x * .05, c.ya + .12 + Math.sin(ang) * .35, a.z + ax.z * .05).addScaledVector(perp, Math.cos(ang) * .35), r1 = r0.clone().addScaledVector(perp, Math.cos(ang) * .45).add(new THREE.Vector3(0, Math.sin(ang) * .4, 0)).addScaledVector(ax, .25);
      logs.push(tint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([r0, r0.clone().lerp(r1, .5).addScaledVector(ax, .1), r1]), 6, .045 - k * .002, 5), '#d9b896')); }
    for (const u of [.3, .36, .7]) { const p = curve.getPointAt(u); rocks.push(tint(at(new THREE.CylinderGeometry(.12, .1, .03, 14, 1), p.x + perp.x * .26, p.y + .02 + u * .05, p.z + perp.z * .26), '#e9c68a')); }
  });
  if (has('acorns')) steps.push(() => { for (let i = 0; i < 5; i++) { const x = -9.0 + i * .22 + region.origin[0], z = -11.9 + (i % 2) * .2 + region.origin[1]; rocks.push(tint(at(new THREE.SphereGeometry(.09, 10, 7).scale(1, 1.2, 1), x, ground(x, z) + .08, z), '#9a6332')); } });
  if (has('stump')) steps.push(() => {
    const [x, z] = [8.6 + region.origin[0], 6.8 + region.origin[1]], y = ground(x, z);
    bark.push(tint(at(new THREE.CylinderGeometry(.75, .9, .62, 18, 1, true), x, y + .31, z), '#e0b48a'));
    const top = new THREE.CircleGeometry(.75, 24).rotateX(-Math.PI / 2); rocks.push(tint(at(top, x, y + .62, z), (px, py, pz) => { const d = Math.hypot(px - x, pz - z); return C('#e8c48c').lerp(C('#b88a58'), Math.abs(Math.sin(d * 28)) * .45); }));
    rocks.push(tint(at(new THREE.BoxGeometry(.42, .08, .3), x - .4, y + .67, z - .25), '#b5443a'), tint(at(new THREE.BoxGeometry(.4, .08, .28), x - .4, y + .76, z - .25), '#6d9a4a'));
    lantern(8.35 + region.origin[0], y + .9, 6.5 + region.origin[1]);
  });
  if (has('fallenLog')) steps.push(() => {
    const [x, z] = [-8.7 + region.origin[0], 7.2 + region.origin[1]], y = ground(x, z);
    logs.push(tint(at(new THREE.CylinderGeometry(.55, .6, 4, 16).rotateZ(Math.PI / 2), x, y + .52, z), '#f0dcc4'));
    rocks.push(tint(at(new THREE.SphereGeometry(1, 16, 10).scale(1.9, .22, .5), x - .2, y + .98, z - .1), '#7a9e48'));
  });
  if (has('lodge')) steps.push(() => {
    const [cx, cz] = [19.4 + region.origin[0], -3.9 + region.origin[1]], y = ground(cx, cz);
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI, r = 1.05 + R() * .15, from = new THREE.Vector3(cx + Math.cos(a) * r, y, cz + Math.sin(a * 2) * .4), to = new THREE.Vector3(cx + Math.cos(a) * .15, y + .9 + R() * .3, cz);
      bark.push(tint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([from, from.clone().lerp(to, .5).add(new THREE.Vector3(0, .1, 0)), to]), 6, .08, 5), '#c99a72')); }
  });
  // finally, one mesh per material
  const mk = (geos, material, name, cast = true) => { const g = merge(geos); if (!g) return; const m = new THREE.Mesh(g, material); m.name = name; m.castShadow = cast && M.shadows; m.receiveShadow = M.shadows; group.add(m); };
  steps.push(() => mk(bark, M.bark, 'landmark bark'), () => mk(rocks, M.rock, 'landmark rocks', false), () => mk(logs, M.log, 'log bridge'), () => mk(wood, M.wood, 'bridge'));
  steps.push(() => {
    const leaves = instanced(new THREE.PlaneGeometry(1, 1), M.leaves, leafCards, {cast: M.shadows, receive: false, depth: M.leafDepth, name: 'home canopy'});
    if (leaves) { const n = leaves.geometry.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); group.add(leaves); out.canopy = leaves; }
    if (lamps.length) { const g = merge(lamps); const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({color: '#ffd889', toneMapped: false})); m.name = 'lanterns'; group.add(m); }
    if (halos.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(halos, 3)); const p = new THREE.Points(g, new THREE.PointsMaterial({map: T.glow, size: 1.1, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55, toneMapped: false})); p.name = 'lantern halos'; group.add(p); out.halos = p; }
  });
  void lerp;
  return steps;
}
