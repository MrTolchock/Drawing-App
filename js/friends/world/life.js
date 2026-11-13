/* Small moving life around Fuchs, wherever he is in the big world (it all travels with him, so it costs the
   same everywhere): leaves falling under the trees, butterflies, dragonflies over the water and little birds
   on the ground that fly up when he comes close, smoke from the picnic fire, ducks and a jumping fish on the beaver
   pond, a rainbow in the waterfall's mist and sunbeams slanting through the trees. Everything is drawn from small pictures made here; about
   a dozen draw calls together. With reduced motion the leaves hang still and the animals stay put. */
import {THREE} from '../../scene/materials.js';

const TAU = Math.PI * 2;

export function createLife({scene, canvasTex, groundY, walkable, terrain, random, fires = [], shaftMat = null}) {
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

  /* ---------- smoke rising from the picnic place's fire ---------- */
  const SMOKE = 9, smokeTex = canvasTex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,255,255,.9)'); q.addColorStop(.5, 'rgba(255,255,255,.45)'); q.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = q; g.fillRect(0, 0, 64, 64); });
  const smoke = fires.length ? new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SMOKE * 3), 3)).setAttribute('aSeed', new THREE.Float32BufferAttribute(Array.from({length: SMOKE}, (_, k) => (k + random() * .6) / SMOKE), 1)),
    new THREE.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {uMap: {value: smokeTex}, uTime: {value: 0}, uScale: {value: 600}, uFire: {value: new THREE.Vector3(fires[0][0], groundY(fires[0][0], fires[0][1]) + .35, fires[0][1])}},
      vertexShader: 'attribute float aSeed;uniform float uTime,uScale;uniform vec3 uFire;varying float vAge;void main(){vAge=fract(aSeed+uTime*.085);vec3 p=uFire+vec3(sin(aSeed*40.+vAge*3.)*.22*vAge+vAge*vAge*.5,vAge*2.9,cos(aSeed*23.+vAge*2.)*.2*vAge);vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(.28+vAge*.95)*uScale/-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'uniform sampler2D uMap;varying float vAge;void main(){float a=texture2D(uMap,gl_PointCoord).a*smoothstep(0.,.12,vAge)*(1.-vAge)*.34;gl_FragColor=vec4(vec3(.93,.92,.9),a);}'})) : null;
  if (smoke) { smoke.name = 'smoke'; smoke.frustumCulled = false; smoke.renderOrder = 6; smoke.visible = false; scene.add(smoke); }

  /* ---------- the beaver pond: two ducks swimming their rounds, and now and then a fish jumps ---------- */
  const pond = terrain.pools.find(q => q.id === 'pond'), pc = Math.cos(pond.rot), ps = Math.sin(pond.rot), onPond = (u, v) => [pond.x + u * pc - v * ps, pond.z + u * ps + v * pc];
  // Ducks are little models (a drake and a hen), built once from a dozen rounded shapes with painted colours.
  function duckModel(c) { const parts = [], add = (g, hex) => { g = g.toNonIndexed(); const col = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) a.set([col.r, col.g, col.b], i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); parts.push(g); };
    const ball = (r2, sx, sy, sz, x, y, z, hex, rx = 0) => add(new THREE.SphereGeometry(r2, 14, 10).scale(sx, sy, sz).rotateX(rx).translate(x, y, z), hex);
    ball(.16, .88, .72, 1.4, 0, .05, 0, c.body); ball(.125, .85, .8, .85, 0, .06, .15, c.breast); ball(.075, .75, .5, 1.5, 0, .13, -.24, c.tail, .45);
    for (const s of [-1, 1]) ball(.13, .38, .58, 1.15, s * .11, .1, -.03, c.wing, -.08);
    add(new THREE.CylinderGeometry(.045, .055, .14, 10).rotateX(.25).translate(0, .18, .16), c.head); if (c.ring) add(new THREE.TorusGeometry(.052, .014, 6, 14).rotateX(Math.PI / 2 + .25).translate(0, .14, .15), c.ring);
    ball(.078, 1, .95, 1.05, 0, .265, .19, c.head); ball(.05, .9, .42, 1.5, 0, .25, .275, c.beak);
    for (const s of [-1, 1]) ball(.013, 1, 1, 1, s * .052, .285, .225, '#14100c');
    const g = new THREE.BufferGeometry(); for (const name of ['position', 'normal', 'color']) { const n = parts.reduce((t, q) => t + q.attributes[name].array.length, 0), a = new Float32Array(n); let o = 0; for (const q of parts) { a.set(q.attributes[name].array, o); o += q.attributes[name].array.length; } g.setAttribute(name, new THREE.BufferAttribute(a, 3)); }
    parts.forEach(q => q.dispose()); return g; }
  const duckMat = new THREE.MeshLambertMaterial({vertexColors: true});
  const duckLooks = [{body: '#b9b1a4', breast: '#7d4c32', tail: '#2c2722', wing: '#8f8272', head: '#2f6f4c', ring: '#f3f0e8', beak: '#e9ab2e'}, {body: '#a98562', breast: '#b9946f', tail: '#6e5238', wing: '#8a6a48', head: '#9c7854', ring: null, beak: '#d98d2a'}];
  const solid = s => { Object.assign(s.material, {transparent: false, alphaTest: .5, depthWrite: true}); return s; };   // a cut-out that the blended water, drawn later, cannot cover
  const ducks = duckLooks.map((look, i) => { const m = new THREE.Mesh(duckModel(look), duckMat); m.name = 'duck'; m.scale.setScalar(i ? 1.45 : 1.6); m.visible = false; scene.add(m); return {m, a: i * 2.4, k: i ? .34 : .5, speed: i ? .075 : .06}; });
  const fishTex = canvasTex(64, 32, g => { g.fillStyle = '#4aa0b4'; g.beginPath(); g.ellipse(34, 16, 20, 10, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(16, 16); g.lineTo(2, 5); g.lineTo(2, 27); g.fill(); g.fillStyle = '#e8f0e4'; g.beginPath(); g.ellipse(36, 20, 15, 5, 0, 0, TAU); g.fill(); g.fillStyle = '#14100c'; g.beginPath(); g.arc(47, 13, 2, 0, TAU); g.fill(); });
  const fish = {s: solid(sprite(fishTex, .2, 4)), t: -1, next: 4, from: [0, 0], to: [0, 0]};
  const ringTex = canvasTex(64, 64, g => { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 4; g.beginPath(); g.arc(32, 32, 26, 0, TAU); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 2; g.beginPath(); g.arc(32, 32, 17, 0, TAU); g.stroke(); });
  const rings = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: ringTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0})); m.visible = false; m.renderOrder = 9; scene.add(m); return {m, t: -1}; });
  const splash = (k, x, z) => { rings[k].t = 0; rings[k].m.position.set(x, pond.level + .03, z); };

  /* ---------- paper boats drifting down the brook, from the den's bridge to the swamp, again and again ---------- */
  const brook = terrain.streams.find(q => q.id === 'brook'), boatTex = canvasTex(64, 48, g => { g.fillStyle = '#fbf6ea'; g.beginPath(); g.moveTo(4, 26); g.lineTo(60, 26); g.lineTo(48, 42); g.lineTo(16, 42); g.fill(); g.beginPath(); g.moveTo(32, 4); g.lineTo(46, 26); g.lineTo(18, 26); g.fill();
    g.strokeStyle = 'rgba(120,100,80,.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(32, 4); g.lineTo(32, 26); g.moveTo(4, 26); g.lineTo(60, 26); g.stroke(); g.fillStyle = '#d9543a'; g.beginPath(); g.moveTo(32, 4); g.lineTo(42, 9); g.lineTo(32, 13); g.fill(); });
  const boats = brook ? [0, .34, .67].map(at => ({s: solid(sprite(boatTex, .34, 3)), at})) : [];

  /* ---------- a rainbow in the waterfall's mist ---------- */
  const bowTex = canvasTex(256, 128, g => { const cols = ['255,80,70', '255,160,60', '255,235,90', '110,220,110', '90,170,255', '150,110,240']; cols.forEach((c, i) => { g.strokeStyle = `rgba(${c},.9)`; g.lineWidth = 7; g.beginPath(); g.arc(128, 150, 118 - i * 6.5, Math.PI, TAU); g.stroke(); });
    const fade = g.createLinearGradient(0, 0, 0, 128); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(.55, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = fade; g.fillRect(0, 0, 256, 128); });
  const bow = new THREE.Mesh(new THREE.PlaneGeometry(11, 5.5), new THREE.MeshBasicMaterial({map: bowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false, opacity: .3}));
  bow.name = 'rainbow'; bow.renderOrder = 5; bow.position.set(terrain.falls.base[0] - 1.5, terrain.falls.level + 3.1, terrain.falls.base[1] + 1.5); scene.add(bow);

  /* ---------- sunbeams through the trees, wherever Fuchs walks in the wood ---------- */
  const BEAMS = 6, beamPos = new Float32Array(BEAMS * 18), beamUv = new Float32Array(BEAMS * 12), quad = [[-.5, -.5, 0, 0], [.5, -.5, 1, 0], [.5, .5, 1, 1], [-.5, -.5, 0, 0], [.5, .5, 1, 1], [-.5, .5, 0, 1]];
  for (let b = 0; b < BEAMS; b++) quad.forEach((q, i) => { beamUv[b * 12 + i * 2] = q[2]; beamUv[b * 12 + i * 2 + 1] = q[3]; });
  const beams = shaftMat ? new THREE.Mesh(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(beamPos, 3)).setAttribute('uv', new THREE.BufferAttribute(beamUv, 2)), shaftMat) : null;
  if (beams) { beams.name = 'sunbeams'; beams.frustumCulled = false; beams.renderOrder = 4; scene.add(beams); }
  let beamCell = null; const bm = {}, hash = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); }, turn = new THREE.Matrix4(), v3 = new THREE.Vector3();
  function placeBeams(pos) { const C = 15, ci = Math.round(pos.x / C), cj = Math.round(pos.z / C), key = ci + ',' + cj; if (key === beamCell) return; beamCell = key;
    const found = []; for (let i = ci - 2; i <= ci + 2; i++) for (let j = cj - 2; j <= cj + 2; j++) { if (hash(i, j) > .5) continue; const x = (i + hash(j, i) - .5) * C, z = (j + hash(i + 7, j) - .5) * C; if (Math.hypot(x, z + 12) < 34) continue;   // the den has its own
      const b = terrain.biome(x, z, bm); if (b.meadow > .3 || b.swamp > .3 || b.rock > .3) continue; found.push([x, z, 2.2 + hash(i, j + 3) * 2.2, Math.hypot(x - pos.x, z - pos.z)]); }
    found.sort((a, b) => a[3] - b[3]);
    for (let b = 0; b < BEAMS; b++) { const f = found[b]; if (!f) { beamPos.fill(0, b * 18, b * 18 + 18); continue; }
      turn.makeRotationY(.5).multiply(new THREE.Matrix4().makeRotationZ(.48)); const y = groundY(f[0], f[1]) + 9;
      quad.forEach((q, i) => { v3.set(q[0] * f[2], q[1] * 22, 0).applyMatrix4(turn); beamPos.set([v3.x + f[0], v3.y + y, v3.z + f[1]], b * 18 + i * 3); }); }
    beams.geometry.attributes.position.needsUpdate = true; }

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
    if (smoke) { smoke.visible = Math.hypot(fires[0][0] - pos.x, fires[0][1] - pos.z) < 40; if (!reduced) smoke.material.uniforms.uTime.value = time; smoke.material.uniforms.uScale.value = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))); }
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
