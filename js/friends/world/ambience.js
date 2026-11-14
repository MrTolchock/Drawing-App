/* Light and air that change with the journey and the weather (forest3d.js drives it):
   - dusk: the den's round window and the lanterns glow brighter, and fireflies dance round Fuchs in the wood
     and the meadow (not in the rain);
   - morning: mist lies low over the swamp, the beaver pond and the plunge pool, and lifts as the day goes on
     (a thinner mist also rises from wet ground after a shower);
   - after some showers (not all of them) a rainbow stands in the sky for a while;
   - puddles gather in the dips of the paths while it rains and dry up slowly afterwards.
   Everything is drawn from small pictures made here; with reduced motion it holds still. */
import {THREE} from '../../scene/materials.js';

const TAU = Math.PI * 2, FLIES = 36, MISTS = 22, PUDDLES = 14;

export function createAmbience({scene, camera, canvasTex, terrain, groundY, random}) {
  const r = (a, b) => a + (b - a) * random();
  const soft = canvasTex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,255,255,1)'); q.addColorStop(.45, 'rgba(255,255,255,.45)'); q.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = q; g.fillRect(0, 0, 64, 64); });
  const flyTex = canvasTex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,255,225,1)'); q.addColorStop(.18, 'rgba(250,250,160,.95)'); q.addColorStop(.45, 'rgba(200,240,110,.35)'); q.addColorStop(1, 'rgba(180,230,90,0)'); g.fillStyle = q; g.fillRect(0, 0, 64, 64); });

  /* ---------- fireflies at dusk ---------- */
  const fseed = new Float32Array(FLIES * 4); for (let i = 0; i < fseed.length; i++) fseed[i] = random();
  const flies = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(FLIES * 3), 3)).setAttribute('aSeed', new THREE.BufferAttribute(fseed, 4)),
    new THREE.ShaderMaterial({transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: {uMap: {value: flyTex}, uTime: {value: 0}, uScale: {value: 600}, uCentre: {value: new THREE.Vector3()}, uAmount: {value: 0}},
      vertexShader: `attribute vec4 aSeed;uniform float uTime,uScale,uAmount;uniform vec3 uCentre;varying float vGlow;
        void main(){const float S=22.;vec3 p;p.xz=uCentre.xz+mod(aSeed.xz*S-uCentre.xz+S*.5,S)-S*.5;float t=uTime*(.25+aSeed.w*.3)+aSeed.y*40.;
          p.x+=sin(t)*1.2+sin(t*2.3)*.3;p.z+=cos(t*.8)*1.1;p.y=uCentre.y+.5+aSeed.y*1.8+sin(t*1.7)*.35;
          float blink=pow(max(0.,sin(uTime*(1.1+aSeed.x)+aSeed.z*30.)),4.);vGlow=blink*uAmount*step(aSeed.w,.35+.65*uAmount);
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=.38*uScale/-mv.z;gl_Position=projectionMatrix*mv;}`,
      fragmentShader: 'uniform sampler2D uMap;varying float vGlow;void main(){vec4 c=texture2D(uMap,gl_PointCoord);if(vGlow<.01)discard;gl_FragColor=vec4(c.rgb*c.a*vGlow,1.);}'}));
  flies.name = 'dusk fireflies'; flies.frustumCulled = false; flies.renderOrder = 6; flies.visible = false; scene.add(flies);

  /* ---------- the den window's glow and the lanterns ---------- */
  const windowGlow = new THREE.Sprite(new THREE.SpriteMaterial({map: soft, color: '#ffd27a', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0}));
  windowGlow.scale.setScalar(1.9); windowGlow.renderOrder = 5; windowGlow.visible = false; scene.add(windowGlow);
  let lights = [], denWindow = null, nextLook = 0; const out = new THREE.Vector3();
  function findLights() { lights = []; scene.traverse(o => { if (o.name === 'lantern glow' || o.name === 'home halos' || o.name === 'lantern halos') { o.userData.day = o.userData.day || {opacity: o.material.opacity, size: o.material.size}; lights.push(o); } if (o.name === 'den-window') denWindow = o; }); }

  /* ---------- morning mist over still water ---------- */
  const mistSpots = []; { const pond = terrain.pools.find(p => p.id === 'pond'), plunge = terrain.pools.find(p => p.id === 'plunge'), S = terrain.swamp;
    for (let k = 0; k < 9; k++) mistSpots.push([S.x + r(-.7, .7) * S.rx, S.z + r(-.6, .6) * S.rz, r(10, 15)]);
    for (let k = 0; k < 9; k++) mistSpots.push([pond.x + r(-.8, .8) * pond.rx, pond.z + r(-.8, .8) * pond.rz, r(7, 11)]);
    for (let k = 0; k < 4; k++) mistSpots.push([plunge.x + r(-.6, .6) * plunge.rx, plunge.z + r(-.6, .6) * plunge.rz, r(5, 8)]); }
  const mists = mistSpots.slice(0, MISTS).map(([x, z, s], i) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({map: soft, color: '#f4f2ea', transparent: true, depthWrite: false, opacity: 0, fog: true}));
    m.scale.set(s, s * .28, 1); m.position.set(x, (terrain.stillLevel(x, z) === terrain.stillLevel(x, z) ? terrain.stillLevel(x, z) : groundY(x, z)) + .45, z); m.renderOrder = 7; m.visible = false; m.userData = {x, z, phase: i * 1.7}; scene.add(m); return m; });

  /* ---------- a rainbow in the sky after some showers ---------- */
  const bowTex = canvasTex(512, 256, g => { const cols = ['255,90,80', '255,165,70', '255,236,110', '120,220,120', '100,175,255', '160,120,240']; cols.forEach((c, i) => { g.strokeStyle = `rgba(${c},.85)`; g.lineWidth = 9; g.beginPath(); g.arc(256, 300, 240 - i * 9, Math.PI, TAU); g.stroke(); });
    g.globalCompositeOperation = 'destination-out'; const fade = g.createLinearGradient(0, 0, 0, 256); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(.6, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = fade; g.fillRect(0, 0, 512, 256); });
  const rainbow = new THREE.Mesh(new THREE.PlaneGeometry(84, 42), new THREE.MeshBasicMaterial({map: bowTex, transparent: true, depthWrite: false, toneMapped: false, fog: false, opacity: 0}));
  rainbow.name = 'sky rainbow'; rainbow.renderOrder = -7; rainbow.frustumCulled = false; rainbow.visible = false; scene.add(rainbow);
  let bow = 0, bowFor = -1, lastShowers = -1, wantBow = false;

  /* ---------- puddles on the paths ---------- */
  const pudTex = canvasTex(64, 64, g => { g.fillStyle = '#fff'; g.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * TAU, rr = 24 + 4 * Math.sin(a * 3 + 1) + 3 * Math.sin(a * 5); g.lineTo(32 + Math.cos(a) * rr, 32 + Math.sin(a) * rr * .8); } g.fill(); });
  const pudMat = new THREE.MeshBasicMaterial({map: pudTex, color: '#9fb2bb', transparent: true, depthWrite: false, opacity: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2});
  const pudShine = new THREE.MeshBasicMaterial({map: soft, color: '#ffffff', transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3});
  const puddles = Array.from({length: PUDDLES}, () => { const g = new THREE.Group(), base = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), pudMat), shine = new THREE.Mesh(new THREE.PlaneGeometry(.5, .18).rotateX(-Math.PI / 2), pudShine);
    shine.position.set(-.1, .005, -.1); g.add(base, shine); g.name = 'puddle'; g.visible = false; g.renderOrder = 1; scene.add(g); return {g, life: 0, on: false}; });
  let pudLevel = 0, nextPud = 0;
  function placePuddle(p, pos) {
    for (let k = 0; k < 12; k++) { const a = r(0, TAU), d = r(3, 22), x = pos.x + Math.sin(a) * d, z = pos.z - 4 + Math.cos(a) * d, pa = terrain.pathAt(x, z);
      if (pa.d > pa.w / 2 - .05 || terrain.slope(x, z) > .18 || terrain.snow(x, z) > .1 || terrain.onCrossing(x, z)) continue;
      if (puddles.some(q => q.on && Math.hypot(q.g.position.x - x, q.g.position.z - z) < 2)) continue;
      const s = r(.9, 1.7); p.g.position.set(x, groundY(x, z) + .06, z); p.g.scale.set(s * r(.9, 1.4), 1, s); p.g.rotation.y = r(0, TAU); p.on = true; p.g.visible = true; return true; }
    return false;
  }

  /** dusk 0…1, morning 0…1, weather state, Fuchs' position. */
  function update(dt, time, pos, {dusk = 0, morning = 0, weather, trees = 1, meadow = 0, swamp = 0, reduced = false, height = 800, fov = 42}) {
    const rain = weather.rain, wet = weather.wet;
    // fireflies
    const want = dusk * (1 - Math.min(1, rain * 3)) * Math.max(trees, meadow * .8, swamp);
    flies.visible = want > .02; if (flies.visible) { const u = flies.material.uniforms; u.uTime.value = reduced ? 0 : time; u.uAmount.value = want; u.uCentre.value.set(pos.x, groundY(pos.x, pos.z), pos.z - 3); u.uScale.value = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))); }
    // lanterns and the den window
    if (time > nextLook) { nextLook = time + 2; findLights(); }
    for (const o of lights) { const d = o.userData.day; o.material.opacity = Math.min(1, d.opacity * (1 + dusk * .9)); o.material.size = d.size * (1 + dusk * .7); }
    if (denWindow && dusk > .02) { denWindow.getWorldPosition(windowGlow.position); windowGlow.position.addScaledVector(denWindow.getWorldDirection(out), .45); windowGlow.visible = true; windowGlow.material.opacity = dusk * (reduced ? .75 : .7 + .08 * Math.sin(time * 2.3)); } else windowGlow.visible = false;
    // mist: thick in the morning, a little after a shower, gone by afternoon
    const mistK = Math.max(morning, wet * .45 * (1 - rain * .5));
    for (const m of mists) { const d = Math.hypot(m.userData.x - pos.x, m.userData.z - pos.z); m.visible = mistK > .02 && d < 60; if (!m.visible) continue;
      m.material.opacity = mistK * .85 * THREE.MathUtils.smoothstep(d, 2, 8); if (!reduced) m.position.x = m.userData.x + Math.sin(time * .07 + m.userData.phase) * 1.6; }
    // a rainbow after some showers: decided once per shower, shown during the fresh, clear spell after it
    if (lastShowers === -2) lastShowers = weather.showers; else if (weather.showers !== lastShowers) { lastShowers = weather.showers; wantBow = weather.showers > 0 && random() < .55; }
    const bowTo = wantBow && weather.phase === 'dry' && rain < .05 && weather.fresh > .15 ? 1 : 0; bow += (bowTo - bow) * Math.min(1, dt * .25);
    rainbow.visible = bow > .01; // it stands far ahead in the haze, seen between the trees (the camera looks down at Fuchs, so not into the open sky)
    if (rainbow.visible) { camera.getWorldDirection(out); out.y = 0; out.normalize(); rainbow.position.set(camera.position.x + out.x * 58 - 8, camera.position.y - 13.5, camera.position.z + out.z * 58); rainbow.lookAt(camera.position.x, rainbow.position.y, camera.position.z); rainbow.material.opacity = bow * .5 * (1 - dusk * .6); }
    // puddles: gather while it rains, shrink and dry when it stops
    pudLevel = rain > .3 ? Math.min(1, pudLevel + dt / 25) : Math.max(0, pudLevel - dt / 140 * (wet > .2 ? .5 : 1.5));
    if (pudLevel > .1 && time > nextPud) { nextPud = time + .7; const free = puddles.find(p => !p.on); if (free) placePuddle(free, pos); }
    for (const p of puddles) { if (!p.on) continue; if (pudLevel <= 0 || Math.hypot(p.g.position.x - pos.x, p.g.position.z - pos.z) > 45) { p.on = false; p.g.visible = false; } }
    pudMat.opacity = .78 * Math.min(1, pudLevel * 1.6); pudShine.opacity = .3 * Math.min(1, pudLevel * 1.6) * (1 - rain * .6) * (1 - dusk * .5);
    for (const p of puddles) if (p.on) p.g.children[0].scale.setScalar(.5 + .5 * Math.min(1, pudLevel * 1.4));
  }
  return {update, /** Development: show the rainbow after this shower (true) or not. */ rainbow(on = true) { wantBow = on; lastShowers = -2; }, get counts() { return {fireflies: flies.visible, puddles: puddles.filter(p => p.on).length, mist: mists.filter(m => m.visible).length, rainbow: bow}; }};
}
