/* Fuchs' paw prints: left and right in turn while he walks, where the ground keeps them: always in snow, in the
   swamp's mud and on the soft banks of the brook, and on paths and grass while they are still wet after a shower.
   When he slides down the snowy peak he leaves a slide mark instead: one smooth furrow, laid end to end along the
   way he slid (no paws touch the snow then). Each print or piece of furrow lies flat on the slope under it and fades
   slowly (snow keeps them longest). One instanced draw call for each kind; the oldest is reused when they run out.
   Nothing is laid with reduced motion. */
import {THREE} from '../../scene/materials.js';

const PRINTS = 90, SPACING = .4, SIDE = .11, SIZE = .28, SLIDES = 140, STRETCH = .3, FURROW = .44;
// how long a print lasts (s) and its colour, by ground
const KEEP = {snow: [80, [.36, .43, .6], .85], mud: [45, [.14, .09, .05], .62], wet: [32, [.15, .1, .05], .62]};

export function createFootprints({scene, canvasTex, ground}) {
  const paw = canvasTex(64, 64, g => { g.fillStyle = '#fff';
    g.beginPath(); g.ellipse(32, 41, 13, 11.5, 0, 0, Math.PI * 2); g.fill();
    for (const [x, y, r] of [[17, 25, 5.4], [27, 17, 5.6], [37, 17, 5.6], [47, 25, 5.4]]) { g.beginPath(); g.ellipse(x, y, r, r * 1.2, 0, 0, Math.PI * 2); g.fill(); } });
  // the furrow, seen across: pressed-down rims on both sides, a softer smooth middle and a few fine drag lines of
  // fur. Along it each piece fades in and out again (a tent), and the pieces overlap by half, so together they make
  // one even, unbroken mark without seams where they meet.
  const furrow = canvasTex(64, 64, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = Math.abs(x + .5 - w / 2) / (w / 2), rim = Math.exp(-(((u - .76) / .13) ** 2)), body = .4 * (1 - u * u), lines = [21, 27, 36, 43].includes(x) ? .16 : 0;
      const across = Math.min(1, rim * .8 + body + lines) * Math.max(0, Math.min(1, (1 - u) * 12)), along = 1 - Math.abs((y + .5) / h * 2 - 1), i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.round(255 * across * along); }
    g.putImageData(img, 0, 0); });
  function decals(name, map, count, width, length) {
    const geo = new THREE.PlaneGeometry(width, length).rotateX(-Math.PI / 2);
    const alpha = new THREE.InstancedBufferAttribute(new Float32Array(count), 1), tint = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    geo.setAttribute('aAlpha', alpha); geo.setAttribute('aTint', tint);
    const mat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, uniforms: {uMap: {value: map}},
      vertexShader: 'attribute float aAlpha;attribute vec3 aTint;varying float vA;varying vec3 vT;varying vec2 vUv;void main(){vUv=uv;vA=aAlpha;vT=aTint;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform sampler2D uMap;varying float vA;varying vec3 vT;varying vec2 vUv;void main(){float a=texture2D(uMap,vUv).a*vA;if(a<.01)discard;gl_FragColor=vec4(vT,a);}'});
    const mesh = new THREE.InstancedMesh(geo, mat, count); mesh.name = name; mesh.frustumCulled = false; mesh.renderOrder = 1; scene.add(mesh);
    const age = new Float32Array(count).fill(Infinity), keep = new Float32Array(count).fill(1), strength = new Float32Array(count);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), turn = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), n = new THREE.Vector3(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, m.makeScale(0, 0, 0));
    let next = 0, live = 0;
    return {
      lay(x, z, heading, kind, k = 1) {
        const [life, c, s] = KEEP[kind], e = .25, hx = ground(x + e, z) - ground(x - e, z), hz = ground(x, z + e) - ground(x, z - e);
        n.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); q.setFromUnitVectors(up, n).multiply(turn.setFromAxisAngle(up, heading + Math.PI));
        p.set(x, ground(x, z) + .045, z); m.compose(p, q, one); mesh.setMatrixAt(next, m);
        tint.setXYZ(next, c[0], c[1], c[2]); age[next] = 0; keep[next] = life; strength[next] = s * k; next = (next + 1) % count;
        mesh.instanceMatrix.needsUpdate = true; tint.needsUpdate = true;
      },
      age(dt) {
        live = 0; for (let i = 0; i < count; i++) { if (age[i] === Infinity) { alpha.setX(i, 0); continue; } age[i] += dt; const k = age[i] / keep[i];
          if (k >= 1) { age[i] = Infinity; alpha.setX(i, 0); mesh.setMatrixAt(i, m.makeScale(0, 0, 0)); mesh.instanceMatrix.needsUpdate = true; continue; }
          live++; alpha.setX(i, strength[i] * Math.min(1, age[i] * 6) * (1 - k * k)); }
        alpha.needsUpdate = true; mesh.visible = live > 0;
      },
      get live() { return live; },
    };
  }
  const prints = decals('paw prints', paw, PRINTS, SIZE, SIZE * 1.15), slides = decals('slide marks', furrow, SLIDES, FURROW, STRETCH * 2);
  let walked = 0, slid = 0, side = 1, last = null;

  /** `where` is what the ground under Fuchs keeps: 'snow', 'mud', 'wet' or null; `sliding`: he slides on the snow. */
  function update(dt, pos, heading, where, reduced, sliding = false) {
    const d = last ? Math.hypot(pos.x - last.x, pos.z - last.z) : 0;
    if (last && !reduced && where && sliding && d > 1e-4 && d < 4) {
      // the furrow follows the way he actually slid: a piece every STRETCH metres, reaching half a piece back
      const way = Math.atan2(pos.x - last.x, pos.z - last.z);
      for (let at = STRETCH - slid; at <= d; at += STRETCH) { const k = at / d, x = last.x + (pos.x - last.x) * k, z = last.z + (pos.z - last.z) * k; slides.lay(x, z, way, where, .62); slid = 0; }
      slid = (slid + d) % STRETCH; walked = SPACING * .7;
    } else if (last && !reduced && where && !sliding) { slid = STRETCH * .5;
      // every stride along the way, also when one long frame covers several
      for (let at = SPACING - walked; at <= d && d < 4; at += SPACING) { const k = at / d, x = last.x + (pos.x - last.x) * k, z = last.z + (pos.z - last.z) * k; side = -side; prints.lay(x + Math.cos(heading) * SIDE * side, z - Math.sin(heading) * SIDE * side, heading, where); walked = 0; }
      walked = d < 4 ? (walked + d) % SPACING : 0; }
    else { walked = SPACING * .7; slid = STRETCH * .5; }
    last = {x: pos.x, z: pos.z};
    prints.age(dt); slides.age(dt);
  }
  return {update, get count() { return prints.live; }, get slides() { return slides.live; }};
}
