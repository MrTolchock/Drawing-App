/* Fuchs' paw prints: left and right in turn while he walks, where the ground keeps them: always in snow, in the
   swamp's mud and on the soft banks of the brook, and on paths and grass while they are still wet after a shower.
   Each print lies flat on the slope under it and fades slowly (snow keeps them longest). One instanced draw call
   for all of them; the oldest is reused when they run out. Nothing is laid with reduced motion. */
import {THREE} from '../../scene/materials.js';

const PRINTS = 90, SPACING = .4, SIDE = .11, SIZE = .28;
// how long a print lasts (s) and its colour, by ground
const KEEP = {snow: [80, [.36, .43, .6], .85], mud: [45, [.14, .09, .05], .62], wet: [32, [.15, .1, .05], .62]};

export function createFootprints({scene, canvasTex, ground}) {
  const tex = canvasTex(64, 64, g => { g.fillStyle = '#fff';
    g.beginPath(); g.ellipse(32, 41, 13, 11.5, 0, 0, Math.PI * 2); g.fill();
    for (const [x, y, r] of [[17, 25, 5.4], [27, 17, 5.6], [37, 17, 5.6], [47, 25, 5.4]]) { g.beginPath(); g.ellipse(x, y, r, r * 1.2, 0, 0, Math.PI * 2); g.fill(); } });
  const geo = new THREE.PlaneGeometry(SIZE, SIZE * 1.15).rotateX(-Math.PI / 2);
  const alpha = new THREE.InstancedBufferAttribute(new Float32Array(PRINTS), 1), tint = new THREE.InstancedBufferAttribute(new Float32Array(PRINTS * 3), 3);
  geo.setAttribute('aAlpha', alpha); geo.setAttribute('aTint', tint);
  const mat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, uniforms: {uMap: {value: tex}},
    vertexShader: 'attribute float aAlpha;attribute vec3 aTint;varying float vA;varying vec3 vT;varying vec2 vUv;void main(){vUv=uv;vA=aAlpha;vT=aTint;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform sampler2D uMap;varying float vA;varying vec3 vT;varying vec2 vUv;void main(){float a=texture2D(uMap,vUv).a*vA;if(a<.01)discard;gl_FragColor=vec4(vT,a);}'});
  const mesh = new THREE.InstancedMesh(geo, mat, PRINTS); mesh.name = 'paw prints'; mesh.frustumCulled = false; mesh.renderOrder = 1; scene.add(mesh);
  const age = new Float32Array(PRINTS).fill(Infinity), keep = new Float32Array(PRINTS).fill(1), strength = new Float32Array(PRINTS);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), turn = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), n = new THREE.Vector3(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < PRINTS; i++) { mesh.setMatrixAt(i, m.makeScale(0, 0, 0)); }
  let next = 0, walked = 0, side = 1, last = null, live = 0;

  function lay(x, z, heading, kind) {
    const [life, c, s] = KEEP[kind], e = .25, hx = ground(x + e, z) - ground(x - e, z), hz = ground(x, z + e) - ground(x, z - e);
    n.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize(); q.setFromUnitVectors(up, n).multiply(turn.setFromAxisAngle(up, heading + Math.PI));
    p.set(x, ground(x, z) + .045, z); m.compose(p, q, one); mesh.setMatrixAt(next, m);
    tint.setXYZ(next, c[0], c[1], c[2]); age[next] = 0; keep[next] = life; strength[next] = s; next = (next + 1) % PRINTS;
    mesh.instanceMatrix.needsUpdate = true; tint.needsUpdate = true;
  }
  /** `where` is what the ground under Fuchs keeps: 'snow', 'mud', 'wet' or null. */
  function update(dt, pos, heading, where, reduced) {
    if (last && !reduced && where) { const d = Math.hypot(pos.x - last.x, pos.z - last.z);
      // every stride along the way, also when one long frame covers several
      for (let at = SPACING - walked; at <= d && d < 4; at += SPACING) { const k = at / d, x = last.x + (pos.x - last.x) * k, z = last.z + (pos.z - last.z) * k; side = -side; lay(x + Math.cos(heading) * SIDE * side, z - Math.sin(heading) * SIDE * side, heading, where); walked = 0; }
      walked = d < 4 ? (walked + d) % SPACING : 0; }
    else walked = SPACING * .7;
    last = {x: pos.x, z: pos.z};
    live = 0; for (let i = 0; i < PRINTS; i++) { if (age[i] === Infinity) { alpha.setX(i, 0); continue; } age[i] += dt; const k = age[i] / keep[i];
      if (k >= 1) { age[i] = Infinity; alpha.setX(i, 0); mesh.setMatrixAt(i, m.makeScale(0, 0, 0)); mesh.instanceMatrix.needsUpdate = true; continue; }
      live++; alpha.setX(i, strength[i] * Math.min(1, age[i] * 6) * (1 - k * k)); }
    alpha.needsUpdate = true; mesh.visible = live > 0;
  }
  return {update, get count() { return live; }};
}
