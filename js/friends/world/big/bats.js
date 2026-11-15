/* The bats of the cave (layout CAVE.roost). By day they hang from the ceiling of the hall, wings folded, swaying a
   little. When Fuchs walks in under them they wake one after another, drop, and flutter in rounds through the hall;
   a few fly out along the passage, past Fuchs, into the open and come home a while later; the others settle again.
   At dusk some of them are out already and hunt in loops over the cave's mouth. With reduced motion they sleep on.
   One instanced mesh; the wings beat in the vertex shader. */
import {THREE} from '../../../scene/materials.js';
import {TAU, clamp, lerp, sstep, rng} from '../noise.js';
import {caveCeiling} from './cave.js';

const COUNT = 14, LEAVERS = 5, HUNTERS = 6;

function batGeometry() {
  const pos = [], col = [], wing = [], idx = [], fur = [.105, .075, .085], belly = [.22, .165, .15], skin = [.06, .042, .055], pink = [.34, .2, .2];
  const add = (g, c, w = 0) => { const p = g.attributes.position, base = pos.length / 3; for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); const k = typeof c === 'function' ? c(p.getX(i), p.getY(i), p.getZ(i)) : c; col.push(...k); wing.push(w); } for (const k of g.index.array) idx.push(base + k); g.dispose(); };
  add(new THREE.SphereGeometry(.055, 9, 7).scale(1, .95, 1.55), (x, y) => y < -.01 ? belly : fur);
  add(new THREE.SphereGeometry(.043, 9, 7).translate(0, .014, .088), (x, y, z) => z > .115 ? pink : fur);
  for (const s of [-1, 1]) { add(new THREE.ConeGeometry(.02, .06, 5).rotateZ(-s * .35).translate(s * .027, .058, .084), (x, y) => y > .07 ? skin : pink); add(new THREE.SphereGeometry(.0085, 6, 5).translate(s * .019, .026, .122), [1.5, 1.35, .9]); }
  // a wing: a fan of skin from the shoulder, scalloped along its trailing edge
  for (const s of [-1, 1]) { const base = pos.length / 3, P = [[.035, .008, .03], [.15, .012, .09], [.3, 0, .012], [.215, 0, -.06], [.168, 0, -.03], [.118, 0, -.09], [.082, 0, -.052], [.03, 0, -.08]];
    for (const [x, y, z] of P) { pos.push(x * s, y, z); col.push(...(x > .14 ? skin : fur.map(q => q * .85))); wing.push(s); }
    for (let k = 1; k < P.length - 1; k++) idx.push(base, base + k, base + k + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setAttribute('aW', new THREE.Float32BufferAttribute(wing, 1)); g.setIndex(idx); return g;
}

export function createBats({scene, world, fog}) {
  const T = world.terrain, C = world.layout.CAVE, R = rng(4711), ceil = caveCeiling(world), at = (u, v) => [C.x + u, C.z - v];
  const floor = (x, z) => T.ground(x, z), [rx, rz] = at(C.roost[0], C.roost[1]), [hx, hz] = at(15.6, 20.9), [mx, mz] = at(0, 1), mouthY = floor(mx, mz);
  // the way out: back along the cave's spine, then up and away over the trees
  const way = [...C.spine].reverse().map(([u, v]) => { const [x, z] = at(u, v); return new THREE.Vector3(x, floor(x, z) + 2.15, z); }); way.push(new THREE.Vector3(mx - 3, mouthY + 6, mz + 12), new THREE.Vector3(mx - 14, mouthY + 15, mz + 30));
  const geo = batGeometry(), state = new Float32Array(COUNT * 2); geo.setAttribute('aBat', new THREE.InstancedBufferAttribute(state, 2));
  const mat = new THREE.ShaderMaterial({side: THREE.DoubleSide, uniforms: {uTime: {value: 0}, fogColor: {value: fog.color}, fogNear: {value: 8}, fogFar: {value: 32}},
    vertexShader: `attribute vec3 color;attribute float aW;attribute vec2 aBat;uniform float uTime;varying vec3 vC;varying float vD;
      void main(){vec3 p=position;float am=aBat.y;
        if(aW!=0.){float x=(abs(p.x)-.035)*mix(.28,1.,am),th=(sin(uTime*24.+aBat.x)*.95+.12)*am*(.5+.8*x/.265)-(1.-am)*1.25;p.y+=sin(th)*x;p.x=aW*(.035+cos(th)*x);}
        vec4 mv=modelViewMatrix*instanceMatrix*vec4(p,1.);vD=-mv.z;vC=color;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform vec3 fogColor;uniform float fogNear,fogFar;varying vec3 vC;varying float vD;
      void main(){vec3 c=mix(vC,fogColor,smoothstep(fogNear,fogFar,vD)*step(vC.r,1.));gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT); mesh.name = 'bats'; mesh.frustumCulled = false; mesh.visible = false; scene.add(mesh);
  const HANG = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), e = new THREE.Euler(), m4 = new THREE.Matrix4(), v = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  const bats = Array.from({length: COUNT}, (_, k) => { const a = R() * TAU, d = Math.sqrt(R()) * C.roost[2], x = rx + Math.cos(a) * d, z = rz + Math.sin(a) * d, s = .9 + R() * .35;
    return {k, home: new THREE.Vector3(x, ceil(x, z) - .085 * s, z), p: new THREE.Vector3(), mode: 'roost', t: 0, wait: 0, am: 0, turn: R() * TAU, yaw: 0, bank: 0, a: R() * TAU, r: 1.5 + R() * 2.4, h: 2.5 + R() * 1.5, sp: (1.5 + R() * .9) * (R() < .5 ? 1 : -1), ph: R() * TAU, s, leg: 0, up: 0}; });
  for (const b of bats) b.p.copy(b.home);
  let cool = 0, left = true, woke = false, awake = 0;
  /** A place on a bat's round through the hall (or over the mouth when hunting outside). */
  function round(b, out) {
    if (b.mode === 'hunt') { const r = 5 + b.r * 1.6; return out.set(mx + Math.cos(b.a) * r * 1.3, mouthY + 5.5 + b.h + Math.sin(b.a * 1.7 + b.ph) * 1.6, mz - 2 + Math.sin(b.a) * r); }
    const x = hx + Math.cos(b.a) * b.r * 1.3, z = hz + Math.sin(b.a) * b.r; return out.set(x, Math.min(floor(x, z) + b.h + Math.sin(b.a * 1.7 + b.ph) * .7, ceil(x, z) - .5), z);
  }
  function steer(b, to, dt, speed) { v.copy(to).sub(b.p); const d = v.length(); if (d > 1e-4) { const yaw = Math.atan2(v.x, v.z), turn = Math.atan2(Math.sin(yaw - b.yaw), Math.cos(yaw - b.yaw)); b.yaw += turn * Math.min(1, dt * 6); b.bank += (clamp(-turn * 1.4, -.8, .8) - b.bank) * Math.min(1, dt * 5); b.up = v.y / d; b.p.addScaledVector(v, Math.min(1, speed * dt / d)); } return d; }
  function update(dt, time, pos, {caveK = 0, dusk = 0, reduced = false} = {}) {
    const far = Math.hypot(pos.x - hx, pos.z - hz); mesh.visible = far < 80; if (!mesh.visible) return false;
    mat.uniforms.uTime.value = reduced ? 0 : time; mat.uniforms.fogNear.value = scene.fog.near; mat.uniforms.fogFar.value = scene.fog.far;
    const under = caveK > .5 && Math.hypot(pos.x - rx, pos.z - rz) < 7.5; woke = false; cool = Math.max(0, cool - dt); if (!under) left = true;
    awake = bats.filter(b => b.mode !== 'roost').length;
    if (under && left && !cool && !reduced && bats.some(b => b.mode === 'roost')) { left = false; cool = 22; woke = true; let n = 0; for (const b of bats) if (b.mode === 'roost') { b.mode = 'drop'; b.t = 0; b.wait = n++ * .13 + R() * .5; } }
    // at dusk some are out hunting over the mouth (they change places only while Fuchs is not in the cave to see it)
    if (caveK < .05 && !reduced) for (const b of bats) { if (b.k < HUNTERS && b.mode === 'roost' && dusk > .6) { b.mode = 'hunt'; b.am = 1; round(b, b.p); } else if (b.mode === 'hunt' && dusk < .45) { b.mode = 'roost'; b.am = 0; b.p.copy(b.home); } }
    for (const b of bats) {
      if (b.mode === 'roost') { b.am = Math.max(0, b.am - dt * 2); e.set(0, b.turn, reduced ? 0 : Math.sin(time * 1.1 + b.ph) * .07); q.setFromEuler(e).multiply(HANG); }
      else if (b.mode === 'drop') { if ((b.wait -= dt) > 0) { e.set(0, b.turn, Math.sin(time * 9 + b.ph) * .12); q.setFromEuler(e).multiply(HANG); } else { b.t += dt / .7; b.am = Math.min(1, b.t * 1.6); b.p.y = b.home.y - .55 * Math.min(1, b.t) ** 2; b.yaw = b.turn; e.set(0, b.turn, 0); q2.setFromEuler(e); q.copy(q2).multiply(HANG).slerp(q2, sstep(0, 1, b.t)); if (b.t >= 1) { b.mode = 'fly'; b.t = 0; b.wait = b.k >= COUNT - LEAVERS ? 2.5 + R() * 3.5 : 9 + R() * 7; } } }
      else {
        if (b.mode === 'fly' || b.mode === 'hunt') { b.a += b.sp * dt * (b.mode === 'hunt' ? .55 : 1); steer(b, round(b, v.clone()), dt, 5.2); if (b.mode === 'fly' && (b.wait -= dt) <= 0) { b.mode = b.k >= COUNT - LEAVERS ? 'out' : 'home'; b.leg = 2; b.t = 0; } }
        else if (b.mode === 'home') { const d = steer(b, b.home, dt, 4.2); b.am = Math.min(b.am, sstep(0, .9, d) * .8 + .2); if (d < .04) { b.mode = 'roost'; b.turn = b.yaw; b.p.copy(b.home); } }
        else if (b.mode === 'out') { const w = way[b.leg], side = Math.sin(time * 3 + b.ph) * .45; if (steer(b, v.set(w.x + side, w.y + Math.sin(time * 4.1 + b.ph) * .2, w.z + side * .4), dt, 6.6) < .7 && ++b.leg >= way.length) { b.mode = 'gone'; b.wait = 16 + R() * 20; } }
        else if (b.mode === 'gone') { if ((b.wait -= dt) <= 0) { b.mode = 'back'; b.leg = way.length - 2; b.p.copy(way[way.length - 1]); } }
        else if (b.mode === 'back') { const w = b.leg >= 1 ? way[b.leg] : b.home; if (steer(b, v.set(w.x, w.y + Math.sin(time * 4.1 + b.ph) * .2, w.z), dt, 6) < .7 && --b.leg < 1) b.mode = 'home'; }
        b.am = b.mode === 'home' ? b.am : Math.min(1, b.am + dt * 3); e.set(-clamp(b.up, -.6, .6) * .7, b.yaw, b.bank, 'YXZ'); q.setFromEuler(e);
        if (b.mode === 'home') { const near = sstep(.7, 0, b.p.distanceTo(b.home)); e.set(0, b.yaw, 0); q2.setFromEuler(e).multiply(HANG); q.slerp(q2, near); }
      }
      const s = b.mode === 'gone' ? 0 : b.s; m4.compose(b.p, q, one.set(s, s, s)); mesh.setMatrixAt(b.k, m4); state[b.k * 2] = b.ph; state[b.k * 2 + 1] = b.am;
    }
    mesh.instanceMatrix.needsUpdate = true; geo.attributes.aBat.needsUpdate = true;
    return woke;
  }
  return {update, get counts() { return {bats: COUNT, awake}; }};
}
