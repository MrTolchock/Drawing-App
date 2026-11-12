/* Small moving life around Fuchs, wherever he is in the big world (it all travels with him, so it costs the
   same everywhere): leaves falling under the trees, butterflies, dragonflies over the water and little birds
   on the ground that fly up when he comes close. Everything is drawn from small pictures made here; about
   a dozen draw calls together. With reduced motion the leaves hang still and the animals stay put. */
import {THREE} from '../../scene/materials.js';

const TAU = Math.PI * 2;

export function createLife({scene, canvasTex, groundY, walkable, terrain, random, hives = []}) {
  const r = (a, b) => a + (b - a) * random();
  function sprite(map, h, order = 4) { const s = new THREE.Sprite(new THREE.SpriteMaterial({map, transparent: true, toneMapped: false, depthWrite: false, alphaTest: .02})); s.center.set(.5, .5); s.renderOrder = order; s.visible = false; s.userData.h = h; scene.add(s); return s; }
  const fit = (s, k = 1) => { const img = s.material.map.image; s.scale.set(s.userData.h * img.width / img.height * k, s.userData.h, 1); };
  // a free spot on walkable ground 8 to 16 m from Fuchs, preferably ahead of him
  function spotNear(pos, heading, from = 8, to = 16, test = walkable) { for (let k = 0; k < 10; k++) { const a = heading + r(-1.3, 1.3) + (k > 5 ? Math.PI : 0), d = r(from, to), x = pos.x + Math.sin(a) * d, z = pos.z + Math.cos(a) * d; if (test(x, z)) return [x, z]; } return null; }

  /* ---------- falling leaves ---------- */
  const LEAVES = 46, leafTex = canvasTex(64, 64, g => { g.translate(32, 32); g.rotate(-.6); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(0, -27); g.bezierCurveTo(21, -15, 19, 14, 0, 27); g.bezierCurveTo(-19, 14, -21, -15, 0, -27); g.fill(); g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, -24); g.lineTo(0, 25); g.stroke(); });
  const seeds = new Float32Array(LEAVES * 4); for (let i = 0; i < seeds.length; i++) seeds[i] = random();
  const leaves = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(LEAVES * 3), 3)).setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4)),
    new THREE.ShaderMaterial({uniforms: {uMap: {value: leafTex}, uTime: {value: 0}, uScale: {value: 600}, uCentre: {value: new THREE.Vector3()}, uAmount: {value: 0}},
      vertexShader: `attribute vec4 aSeed;uniform float uTime,uScale,uAmount;uniform vec3 uCentre;varying float vShow,vTurn,vTint;
        void main(){const float H=8.5,S=30.;vec3 p;p.xz=uCentre.xz+mod(aSeed.xz*S-uCentre.xz+S*.5,S)-S*.5;
          float fall=mod(aSeed.y*H+uTime*(.5+.45*aSeed.w),H);p.y=uCentre.y+H-fall;
          p.x+=sin(uTime*(.8+aSeed.w)+aSeed.x*40.)*.7*(.25+fall/H);p.z+=cos(uTime*.65+aSeed.z*40.)*.45;
          vShow=smoothstep(0.,.8,fall)*smoothstep(H,H-.5,fall)*step(fract(aSeed.w*7.13),uAmount);vTurn=uTime*(1.2+2.2*aSeed.w)+aSeed.x*6.28;vTint=aSeed.z;
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=min(.34*uScale/-mv.z,44.);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform sampler2D uMap;varying float vShow,vTurn,vTint;
        void main(){if(vShow<.5)discard;vec2 c=gl_PointCoord-.5;float s=sin(vTurn),k=cos(vTurn);c=vec2(c.x*k-c.y*s,c.x*s+c.y*k);c.y/=max(.3,abs(cos(vTurn*.6)));vec2 uv=c+.5;
          if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)discard;vec4 t=texture2D(uMap,uv);if(t.a<.5)discard;
          vec3 col=vTint<.45?mix(vec3(.2,.42,.07),vec3(.36,.56,.1),vTint*2.2):vTint<.8?vec3(.72,.56,.08):vec3(.66,.3,.06);
          gl_FragColor=vec4(col*t.rgb*(.82+.3*abs(cos(vTurn*.6))),1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`}));
  leaves.name = 'falling leaves'; leaves.frustumCulled = false; scene.add(leaves);

  /* ---------- butterflies: a handful that stay in Fuchs' neighbourhood ---------- */
  const wingTex = ['#f29a3a', '#7fb6e8', '#f5d24a', '#f7f3e6', '#e98fb0'].map(c => canvasTex(64, 48, g => { g.fillStyle = c; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(32 + s * 14, 16, 13, 12, s * .3, 0, TAU); g.fill(); g.beginPath(); g.ellipse(32 + s * 11, 33, 9, 8, -s * .3, 0, TAU); g.fill(); } g.fillStyle = 'rgba(255,255,255,.6)'; for (const s of [-1, 1]) { g.beginPath(); g.arc(32 + s * 16, 13, 3, 0, TAU); g.fill(); } g.fillStyle = 'rgba(60,40,30,.5)'; for (const s of [-1, 1]) { g.beginPath(); g.arc(32 + s * 12, 33, 2.4, 0, TAU); g.fill(); } g.fillStyle = '#4a3424'; g.fillRect(30, 8, 4, 32); }));
  const butterflies = wingTex.map((map, i) => ({s: sprite(map, .3), hx: 0, hz: 0, x: 0, z: 0, y: 1, phase: i * 1.7, flee: 0, placed: false}));

  /* ---------- dragonflies over brook and pond ---------- */
  const dragonTex = ['#3aa7c9', '#5fb04a', '#d9603a'].map(c => canvasTex(96, 48, g => { g.fillStyle = 'rgba(235,248,255,.62)'; for (const [x, y, a] of [[30, 14, -.25], [30, 34, .25], [58, 13, .2], [58, 35, -.2]]) { g.beginPath(); g.ellipse(x, y, 22, 6.5, a, 0, TAU); g.fill(); } g.strokeStyle = c; g.lineCap = 'round'; g.lineWidth = 5; g.beginPath(); g.moveTo(8, 24); g.lineTo(70, 24); g.stroke(); g.fillStyle = c; g.beginPath(); g.arc(76, 24, 7.5, 0, TAU); g.fill(); g.fillStyle = '#1d2a33'; g.beginPath(); g.arc(80, 21, 2.6, 0, TAU); g.fill(); }));
  const dragons = dragonTex.map((map, i) => ({s: sprite(map, .15), x: 0, y: 0, z: 0, tx: 0, ty: 0, tz: 0, wait: i * .7, on: false}));
  let water = null, nextWater = 0;
  function nearestWater(pos) { let best = 144, at = null; for (const s of terrain.streams) for (let i = 0; i <= s.N; i += 5) { const q = s.samples[i], d = (q.x - pos.x) ** 2 + (q.z - pos.z) ** 2; if (d < best) { best = d; at = [q.x, s.level[i], q.z]; } } return at; }

  /* ---------- little birds on the ground ---------- */
  const birdTex = [0, 1].map(up => canvasTex(64, 48, g => { g.fillStyle = '#8a6a4c'; g.beginPath(); g.ellipse(30, 28, 17, 12, -.15, 0, TAU); g.fill(); g.fillStyle = '#e9d6b8'; g.beginPath(); g.ellipse(33, 32, 11, 7, -.1, 0, TAU); g.fill();
    g.fillStyle = '#7a5a3e'; g.beginPath(); g.arc(46, 18, 9, 0, TAU); g.fill(); g.fillStyle = '#e3a13a'; g.beginPath(); g.moveTo(54, 16); g.lineTo(62, 19); g.lineTo(54, 22); g.fill(); g.fillStyle = '#1c120c'; g.beginPath(); g.arc(49, 16, 2, 0, TAU); g.fill();
    g.fillStyle = '#5e4630'; g.beginPath(); if (up) { g.moveTo(20, 24); g.quadraticCurveTo(22, 0, 38, 4); g.quadraticCurveTo(34, 18, 36, 26); } else { g.ellipse(27, 28, 12, 7, .35, 0, TAU); } g.fill(); g.beginPath(); g.moveTo(14, 26); g.lineTo(2, 22); g.lineTo(3, 31); g.fill(); }));
  const birds = [0, 1, 2].map(i => ({s: sprite(birdTex[0], .2, 3), state: 'wait', t: 1 + i * 1.5, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, hop: 0, face: 1}));
  let flockAt = null, heading = 0, last = null;

  /* ---------- bees round the hive ---------- */
  const BEES = 7, beeTex = canvasTex(32, 32, g => { g.fillStyle = 'rgba(235,245,255,.7)'; g.beginPath(); g.ellipse(11, 9, 8, 5, -.5, 0, TAU); g.fill(); g.beginPath(); g.ellipse(21, 9, 8, 5, .5, 0, TAU); g.fill(); g.fillStyle = '#f2b824'; g.beginPath(); g.ellipse(16, 18, 9, 7, 0, 0, TAU); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(12, 12, 3, 12); g.fillRect(18, 12, 3, 12); });
  const bees = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(BEES * 3), 3)), new THREE.PointsMaterial({map: beeTex, size: .13, transparent: true, alphaTest: .3, toneMapped: false}));
  bees.name = 'bees'; bees.frustumCulled = false; bees.visible = false; scene.add(bees);

  function update(dt, time, pos, {reduced = false, trees = 1, meadow = 0, height = 800, fov = 42} = {}) {
    const gy = groundY(pos.x, pos.z);
    if (last) { const dx = pos.x - last.x, dz = pos.z - last.z; if (dx * dx + dz * dz > 1e-5) heading = Math.atan2(dx, dz); } last = {x: pos.x, z: pos.z};
    // leaves
    const u = leaves.material.uniforms; if (!reduced) u.uTime.value = time; u.uCentre.value.set(pos.x, gy, pos.z); u.uAmount.value += (Math.min(1, trees * 1.1) - u.uAmount.value) * Math.min(1, dt * .5); u.uScale.value = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
    // butterflies: any that Fuchs has left behind settle somewhere new near him
    for (const b of butterflies) {
      if (!b.placed || Math.hypot(b.hx - pos.x, b.hz - pos.z) > 24) { const p = spotNear(pos, heading, b.placed ? 12 : 3, b.placed ? 18 : 12, () => true); b.hx = b.x = p[0]; b.hz = b.z = p[1]; b.placed = true; fit(b.s); }
      const t = time * .55 + b.phase, d = Math.hypot(b.x - pos.x, b.z - pos.z); if (d < 2.2) b.flee = 1.2; b.flee = Math.max(0, b.flee - dt);
      if (!reduced) { const tx = b.hx + Math.sin(t) * 2.4 + (b.flee ? (b.x - pos.x) / (d || 1) * 3 : 0), tz = b.hz + Math.cos(t * 1.3) * 1.8 + (b.flee ? (b.z - pos.z) / (d || 1) * 3 : 0), k = Math.min(1, dt * (b.flee ? 2.5 : .8)); b.x += (tx - b.x) * k; b.z += (tz - b.z) * k; }
      b.y = groundY(b.x, b.z) + 1 + Math.sin(t * 2.3) * .35 + (b.flee ? .8 : 0) - meadow * .2;
      b.s.visible = true; b.s.position.set(b.x, b.y, b.z); const flap = reduced ? 1 : .25 + Math.abs(Math.cos(time * 14 + b.phase)) * .75; b.s.scale.set(.4 * flap, .3, 1);
    }
    // dragonflies: hover, dart, hover, near the closest water
    if (time > nextWater) { water = nearestWater(pos); nextWater = time + 1; }
    for (const d of dragons) {
      if (!water) { d.s.visible = d.on = false; continue; }
      if (!d.on || Math.hypot(d.x - water[0], d.z - water[2]) > 9) { d.x = d.tx = water[0] + r(-1.5, 1.5); d.z = d.tz = water[2] + r(-1.5, 1.5); d.y = d.ty = water[1] + r(.35, .9); d.on = true; fit(d.s); }
      if (!reduced) { if ((d.wait -= dt) < 0) { d.wait = r(.5, 1.8); d.tx = water[0] + r(-2.6, 2.6); d.tz = water[2] + r(-2.6, 2.6); d.ty = Math.max(water[1], groundY(d.tx, d.tz)) + r(.3, 1); d.s.material.rotation = d.tx < d.x ? Math.PI : 0; }
        const k = Math.min(1, dt * 7); d.x += (d.tx - d.x) * k; d.y += (d.ty - d.y) * k; d.z += (d.tz - d.z) * k; }
      d.s.visible = true; d.s.position.set(d.x, d.y + (reduced ? 0 : Math.sin(time * 9 + d.tx) * .02), d.z);
    }
    // bees circle the nearest hive when Fuchs is in its neighbourhood
    { const hive = hives.find(h => Math.hypot(h[0] - pos.x, h[1] - pos.z) < 30); bees.visible = !!hive;
      if (hive) { const p = bees.geometry.attributes.position, hy = groundY(hive[0], hive[1]) + .95, t = reduced ? 0 : time;
        for (let k = 0; k < BEES; k++) { const a = t * (1.1 + k * .23) + k * 2.1, q = .35 + .5 * (.5 + .5 * Math.sin(t * .7 + k * 1.3)); p.setXYZ(k, hive[0] + Math.cos(a) * q, hy + Math.sin(t * 1.9 + k) * .28 + (k % 3) * .12, hive[1] + Math.sin(a * 1.13) * q); } p.needsUpdate = true; } }
    // little birds: a few hop about together ahead of Fuchs and fly off when he is close
    if (!flockAt && !reduced && birds.every(b => b.state === 'wait' && b.t <= 0)) { flockAt = spotNear(pos, heading, 9, 15, (x, z) => walkable(x, z) && !terrain.onCrossing(x, z)); if (flockAt) for (const b of birds) { b.state = 'ground'; b.x = flockAt[0] + r(-.9, .9); b.z = flockAt[1] + r(-.9, .9); b.y = groundY(b.x, b.z) + .1; b.t = r(.3, 1.5); b.s.material.map = birdTex[0]; fit(b.s); } }
    for (const b of birds) {
      b.t -= dt; const d = Math.hypot(b.x - pos.x, b.z - pos.z);
      if (b.state === 'ground') { const base = groundY(b.x, b.z) + .1;
        if (d < 3.4 || d > 30) { b.state = 'fly'; b.t = 2.6; const a = Math.atan2(b.x - pos.x, b.z - pos.z) + r(-.5, .5); b.vx = Math.sin(a) * r(3, 4.5); b.vz = Math.cos(a) * r(3, 4.5); b.vy = r(2.2, 3.2); b.face = b.vx < 0 ? -1 : 1; if (d > 30) { b.state = 'wait'; b.t = 0; b.s.visible = false; flockAt = null; continue; } }
        else { if (b.t < 0) { b.t = r(.6, 2.4); b.hop = .22; const a = r(0, TAU); b.vx = Math.sin(a) * .9; b.vz = Math.cos(a) * .9; b.face = b.vx < 0 ? -1 : 1; }
          if (b.hop > 0) { b.hop -= dt; const nx = b.x + b.vx * dt, nz = b.z + b.vz * dt; if (walkable(nx, nz)) { b.x = nx; b.z = nz; } b.y = base + Math.sin((1 - b.hop / .22) * Math.PI) * .09; } else b.y = base + (Math.sin(time * 5 + b.x * 9) > .86 ? -.025 : 0); }
      } else if (b.state === 'fly') { b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt; b.s.material.map = birdTex[Math.floor(time * 11) % 2]; if (b.t < 0) { b.state = 'wait'; b.t = r(5, 11); b.s.visible = false; flockAt = null; } }
      if (b.state !== 'wait') { b.s.visible = true; b.s.position.set(b.x, b.y, b.z); const k = b.state === 'fly' ? Math.max(.2, b.t / 2.6) : 1; b.s.scale.set(b.s.userData.h * 64 / 48 * b.face * k, b.s.userData.h * k, 1); }
    }
  }
  return {update, get counts() { return {leaves: LEAVES, butterflies: butterflies.length, dragonflies: dragons.filter(d => d.on).length, birds: birds.filter(b => b.state !== 'wait').length}; }};
}
