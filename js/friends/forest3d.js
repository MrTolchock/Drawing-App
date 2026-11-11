/* The explorable 3D forest in the Waldbuch look (blueprint 6): the big world of js/friends/world/big/
   (hills, the Rock and its waterfall, brook, beaver pond, meadow, swamp, trails), streamed in 16 m tiles
   round Fuchs, with the cast, guidance fireflies, haze per area and a hazy backdrop of distant hills.
   Building is time-sliced while the child is in the den; nothing is downloaded. */
import {THREE} from '../forest/materials.js';
import {characters} from './characters3d.js';
import {createWorld} from './world/index.js';
import {createLook, foxView, canvasTex} from './world/textures.js';
import {createStreamer, NEAR} from './world/streamer.js';
import {TAU, rng} from './world/noise.js';

const WORLD = createWorld();
const FOX_H = 1.6, SPEED = 3.6, MAX_ANIMATED = 6;
export const forestPlaces = WORLD.places;
export const forestExits = {den: forestPlaces.home};
export const walkable = (x, z) => WORLD.walkable(x, z);
const groundY = (x, z) => WORLD.groundY(x, z);

export function createForest({renderer, software, onPosition, onAction, onMove, onNear, perf}) {
  const R = rng(97), scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(42, 1, .1, 160);
  scene.background = WORLD.fog.color; scene.fog = new THREE.Fog(WORLD.fog.color, WORLD.fog.near, WORLD.fog.far);
  const sunDir = WORLD.sunDir;
  // Sky: warm haze at the horizon, pale mint above, a soft glow around the low sun.
  { const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 16), new THREE.ShaderMaterial({side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {top: {value: new THREE.Color('#a9d3c6')}, horizon: {value: new THREE.Color('#f3e3b2')}, sun: {value: sunDir}},
      vertexShader: 'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 top,horizon,sun;varying vec3 vD;void main(){float h=clamp(vD.y,0.,1.);vec3 c=mix(horizon,top,pow(h,.55));float g=pow(max(dot(vD,sun),0.),24.);c+=vec3(1.,.86,.55)*g*.6;gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));
    sky.renderOrder = -10; sky.frustumCulled = false; sky.name = 'sky'; camera.add(sky); }
  // A painted horizon band hides the edge of the world beyond the haze.
  const horizon = new THREE.Mesh(new THREE.CylinderGeometry(84, 84, 30, 48, 1, true), new THREE.MeshBasicMaterial({color: WORLD.fog.color, side: THREE.BackSide, fog: false, depthWrite: false, transparent: true, opacity: .92}));
  horizon.position.y = 4; horizon.renderOrder = -9; horizon.name = 'horizon'; scene.add(horizon);
  scene.add(new THREE.HemisphereLight('#e4f0ff', '#8a7444', 1.35));
  const sun = new THREE.DirectionalLight('#ffe0ab', 2.6); scene.add(sun, sun.target);
  const shadowAt = new THREE.Vector3(Infinity, 0, 0);
  function aimSun(x, z) { sun.target.position.set(x, WORLD.ground(x, z), z); sun.position.copy(sunDir).multiplyScalar(40).add(sun.target.position); sun.target.updateMatrixWorld(); shadowAt.set(x, 0, z); renderer.shadowMap.needsUpdate = true; }
  if (!software) { sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, {left: -30, right: 30, top: 30, bottom: -30, near: 5, far: 95}); sun.shadow.bias = -.0004; sun.shadow.normalBias = .04; }
  aimSun(2, -2);
  const fill = new THREE.DirectionalLight('#fff4e0', .55); scene.add(fill, fill.target);   // camera-side fill so faces read against the low sun

  /* ---------- the world, streamed in tiles ---------- */
  const look = createLook({software, big: true});
  const streamer = createStreamer(WORLD, look, scene, {onSlice: ms => perf?.slice(ms)});
  streamer.focus(forestPlaces.home.x, forestPlaces.home.z);
  let compiled = false;
  function compile() { if (compiled) return; compiled = true; try { (renderer.compileAsync || renderer.compile).call(renderer, scene, camera); } catch (e) { /* compiled on first draw instead */ } }

  /* ---------- the big world: hazy hills far away, and each area's own light ---------- */
  let backdrop = null; const mood = {near: WORLD.fog.near, far: WORLD.fog.far, bm: {}};
  {
    // One coarse mesh of the whole land (tree tops included) in the colour of the haze, drawn behind
    // everything and only beyond the far ring: the Rock and the wooded hills stay on the horizon.
    const T = WORLD.terrain, E = WORLD.extent, G = 8, M = 40, nx = (E.x1 - E.x0 + 2 * M) / G, nz = (E.z1 - E.z0 + 2 * M) / G, pos = [], col = [], idx = [], bm = {};
    for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
      const x = E.x0 - M + i * G, z = E.z0 - M + j * G, b = T.biome(x, z, bm), wood = (1 - b.meadow) * (1 - b.swamp) * (1 - b.rock) * (1 - b.glade), h = T.ground(x, z) + wood * (b.spruce > .5 ? 9 : 7);
      const shade = .93 - wood * .07 + b.rock * .02 + Math.min(.05, h * .004) + ((i * 7 + j * 13) % 5) * .004; pos.push(x, h, z); col.push(shade * .97, shade, shade * (1 + b.rock * .04 - wood * .03));
    }
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, c, b, b, c, d); }   // north first: the camera looks north
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
    backdrop = new THREE.Mesh(g, new THREE.ShaderMaterial({depthWrite: false, uniforms: {uHaze: {value: WORLD.fog.color}, uFox: {value: new THREE.Vector3()}},
      vertexShader: 'attribute vec3 color;varying vec3 vC;varying vec3 vW;void main(){vC=color;vW=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 uHaze,uFox;varying vec3 vC;varying vec3 vW;void main(){float d=distance(vW.xz,uFox.xz);if(d<58.)discard;float far=smoothstep(58.,150.,d);gl_FragColor=vec4(uHaze*mix(vC,vec3(1.),far*.55),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));
    backdrop.name = 'backdrop hills'; backdrop.renderOrder = -8; backdrop.frustumCulled = false; scene.add(backdrop);
  }
  const MOODS = {wood: ['#e8dcae', 24, 72], meadow: ['#f1e8bd', 30, 78], swamp: ['#c5d2ae', 11, 50], rock: ['#e0e6d6', 26, 78], spruce: ['#d3d8b2', 18, 62]}, moodC = new THREE.Color(), moodT = new THREE.Color();
  /** Lean the haze toward the area Fuchs is in (the water and the backdrop share the colour object). */
  function updateMood(dt, x, z) {
    const b = WORLD.terrain.biome(x, z, mood.bm), w = {meadow: b.meadow, swamp: b.swamp, rock: b.rock * .8, spruce: b.spruce}; let rest = 1, near = 0, far = 0; moodT.setRGB(0, 0, 0);
    for (const k in w) { const v = Math.min(rest, w[k]); rest -= v; moodC.set(MOODS[k][0]); moodT.r += moodC.r * v; moodT.g += moodC.g * v; moodT.b += moodC.b * v; near += MOODS[k][1] * v; far += MOODS[k][2] * v; }
    moodC.set(MOODS.wood[0]); moodT.r += moodC.r * rest; moodT.g += moodC.g * rest; moodT.b += moodC.b * rest; near += MOODS.wood[1] * rest; far += MOODS.wood[2] * rest;
    const k = 1 - Math.exp(-dt * .9); WORLD.fog.color.lerp(moodT, k); mood.near += (near - mood.near) * k; mood.far += (far - mood.far) * k; scene.fog.near = mood.near; scene.fog.far = mood.far;
    if (look.M.water) { look.M.water.uniforms.fogNear.value = mood.near; look.M.water.uniforms.fogFar.value = mood.far; }
  }

  /* ---------- atmosphere: light shafts, pollen motes, butterflies, dust, vignette ---------- */
  const glow = canvasTex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 1, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,230,1)'); r.addColorStop(.25, 'rgba(255,228,150,.85)'); r.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const softTex = canvasTex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(42,26,12,.55)'); r.addColorStop(1, 'rgba(42,26,12,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const dustTex = canvasTex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(236,205,160,.85)'); r.addColorStop(1, 'rgba(236,205,160,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const shaftTex = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,236,180,0)'); gr.addColorStop(.25, 'rgba(255,236,180,.8)'); gr.addColorStop(1, 'rgba(255,236,180,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const hg = g.createLinearGradient(0, 0, w, 0); hg.addColorStop(0, 'rgba(0,0,0,1)'); hg.addColorStop(.5, 'rgba(0,0,0,0)'); hg.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = hg; g.fillRect(0, 0, w, h); });
  const shaftMat = new THREE.MeshBasicMaterial({map: shaftTex, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false, toneMapped: false});
  { const g = []; for (const [x, z, w] of [[-4, -14, 2.6], [3, -18, 3.4], [10, -12, 2.4], [-11, -9, 2.2], [6, -26, 4]]) g.push(new THREE.PlaneGeometry(w, 22).rotateZ(.48).rotateY(.5).translate(x, 9, z)); const m = new THREE.Mesh(mergePlain(g), shaftMat); m.name = 'light shafts'; m.renderOrder = 4; scene.add(m); }
  const butterflyTex = ['#f29a3a', '#7fb6e8', '#f5d24a'].map(c => canvasTex(64, 48, (g) => { g.fillStyle = c; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(32 + s * 14, 16, 13, 12, s * .3, 0, TAU); g.fill(); g.beginPath(); g.ellipse(32 + s * 11, 33, 9, 8, -s * .3, 0, TAU); g.fill(); } g.fillStyle = 'rgba(255,255,255,.6)'; for (const s of [-1, 1]) { g.beginPath(); g.arc(32 + s * 16, 13, 3, 0, TAU); g.fill(); } g.fillStyle = '#4a3424'; g.fillRect(30, 8, 4, 32); }));
  function sprite(map, h, order = 2, anchor = 0) { const s = new THREE.Sprite(new THREE.SpriteMaterial({map, transparent: true, toneMapped: false, depthWrite: false, alphaTest: .02})); s.center.set(.5, anchor); s.renderOrder = order; s.userData.h = h; scene.add(s); return s; }
  function size(s, h = s.userData.h) { const img = s.material.map.image, a = img && img.width ? img.width / img.height : 1; s.scale.set(h * a, h, 1); }
  const butterflies = Array.from({length: 5}, (_, i) => { const s = sprite(butterflyTex[i % 3], .32, 4, .5), h = [[-6, 4], [3, 7], [-9, -7], [9, -1], [-2, -11]][i]; return {s, hx: h[0], hz: h[1], x: h[0], z: h[1], y: 1, phase: R() * TAU, flee: 0}; });
  const puffs = Array.from({length: 8}, () => { const s = sprite(dustTex, .4, 1, .5); s.visible = false; return {s, life: 0}; });
  const motes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({length: 240}, (_, i) => i % 3 === 1 ? .4 + R() * 5 : (R() * 2 - 1) * 15 + (i % 3 === 0 ? 1 : -5)), 3)), new THREE.PointsMaterial({size: .08, map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .8}));
  motes.name = 'pollen'; scene.add(motes);
  const vignette = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({map: canvasTex(256, 256, (g) => { const r = g.createRadialGradient(128, 118, 70, 128, 128, 184); r.addColorStop(0, 'rgba(80,46,16,0)'); r.addColorStop(.58, 'rgba(59,36,15,.06)'); r.addColorStop(1, 'rgba(42,23,8,.36)'); g.fillStyle = r; g.fillRect(0, 0, 256, 256); }), transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false}));
  vignette.position.z = -1; vignette.renderOrder = 30; vignette.frustumCulled = false; camera.add(vignette); scene.add(camera);

  /* ---------- characters ---------- */
  function contact(r, o = 1) { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshBasicMaterial({map: softTex, transparent: true, depthWrite: false, opacity: o, toneMapped: false})); m.rotation.x = -Math.PI / 2; m.scale.setScalar(r); m.renderOrder = 1; scene.add(m); return m; }
  const friends = {}, noCast = rig => { const off = () => rig.group.traverse(o => { o.castShadow = false; }); off(); rig.ready.then(off); return rig; };
  // The puzzle friends and, in the big world, the new neighbours (those whose models exist already).
  for (const [id, f] of Object.entries({...WORLD.friends, ...WORLD.neighbours})) {
    if (!characters[id]) continue;
    const rig = noCast(characters[id](f.h)), [x, z] = f.at, y = groundY(x, z) + f.y;
    rig.group.position.set(x, y, z); rig.group.rotation.y = f.yaw; scene.add(rig.group);
    friends[id] = {...f, rig, x, z, y, shadow: f.y === 0 ? contact(f.h * .42) : null};
    if (friends[id].shadow) friends[id].shadow.position.set(x, y + .03, z);
  }
  const foxRig = noCast(characters.fox(FOX_H)), fox = foxRig.group, foxShadow = contact(.42), pos = new THREE.Vector3(forestPlaces.home.x, 0, forestPlaces.home.z), vel = new THREE.Vector2();
  fox.name = 'fox'; scene.add(fox);
  const courierRig = noCast(characters.mailman(1.72)), courier = courierRig.group, mailPos = new THREE.Vector3(forestPlaces.mailman.x, 0, forestPlaces.mailman.z), courierShadow = contact(.48, .85);
  courier.name = 'rabbit-mailman'; scene.add(courier); let courierGoal = null, courierWait = 2;

  /* ---------- guidance: fireflies from Fuchs toward the invited friend ---------- */
  const fireflies = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Array(21).fill(0), 3)),
    new THREE.PointsMaterial({size: .5, map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, color: '#fff2b0'}));
  fireflies.name = 'letter-fireflies'; fireflies.visible = false; fireflies.frustumCulled = false; fireflies.renderOrder = 6; scene.add(fireflies);
  let guideTarget = null, guidePoints = [], guideFrom = new THREE.Vector3(Infinity, 0, Infinity), guideEnd = new THREE.Vector3(Infinity, 0, Infinity), guideNext = 0;
  const ring = new THREE.Mesh(new THREE.RingGeometry(.4, .52, 32), new THREE.MeshBasicMaterial({color: '#fff3c4', transparent: true, opacity: .85, depthWrite: false, toneMapped: false}));
  ring.rotation.x = -Math.PI / 2; ring.visible = false; ring.renderOrder = 1; scene.add(ring);
  const pins = Object.entries(WORLD.pins).map(([id, [x, y, z]]) => ({id, point: new THREE.Vector3(x, y + groundY(x, z), z)}));

  /* ---------- movement, routes and camera ---------- */
  let destination = null, path = [], arrival = null, near = null, lastSample = 0, lastPuff = 0, narrow = false, width = 1, height = 1, speedScale = 1;
  const focus = new THREE.Vector3(), raycaster = new THREE.Raycaster(), floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function clear(a, b, skipStart = false) { const d = Math.hypot(b.x - a.x, b.z - a.z), n = Math.max(2, Math.ceil(d / .3)); for (let i = skipStart ? 1 : 0; i <= n; i++) { const t = i / n; if (skipStart && t * d < .35) continue; if (!walkable(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)) return false; } return true; }
  // Routes come from the world's grid search; a short straight walk needs none.
  function plan(target) {
    if (pos.distanceTo(target) < 10 && clear(pos, target, true)) return [target];
    const route = WORLD.plan(pos.x, pos.z, target.x, target.z); return route && route.map(([x, z]) => new THREE.Vector3(x, 0, z));
  }
  function nearestWalkable(p) { if (walkable(p.x, p.z)) return new THREE.Vector3(p.x, 0, p.z); for (let r = .3; r < 6; r += .3) for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, x = p.x + Math.cos(a) * r, z = p.z + Math.sin(a) * r; if (walkable(x, z)) return new THREE.Vector3(x, 0, z); } return pos.clone().setY(0); }
  function walkTo(target, id = null) { target = nearestWalkable(target); const route = plan(target); if (!route) { onMove({event: 'route_failure', reason: 'blocked', area: 'forest', destination: id}); return; } path = route; destination = path.shift(); arrival = id; ring.position.set(target.x, groundY(target.x, target.z) + .05, target.z); ring.visible = true; onMove({event: 'movement_destination', destination: id, x: target.x, z: target.z, area: 'forest'}); }
  // On the hills the camera follows the full height of the ground and never sinks into a slope.
  const lift = 1;
  function snapCamera() { focus.set(pos.x, groundY(pos.x, pos.z) * lift, pos.z); placeCamera(1); }
  function placeCamera(k) { const off = narrow ? [0, 10, 14.4] : [0, 9, 14]; camera.position.lerp(new THREE.Vector3(focus.x + off[0], focus.y + off[1], focus.z + off[2]), k); camera.position.y = Math.max(camera.position.y, WORLD.ground(camera.position.x, camera.position.z) + 3.5); camera.lookAt(focus.x, focus.y + 1.4, focus.z - 3.2); camera.updateMatrixWorld(); foxView.value.set(pos.x, groundY(pos.x, pos.z) + .9, pos.z).applyMatrix4(camera.matrixWorldInverse); fill.position.copy(camera.position).add(new THREE.Vector3(0, 4, 0)); fill.target.position.copy(focus); fill.target.updateMatrixWorld(); horizon.position.x = camera.position.x; horizon.position.z = camera.position.z - 20; }
  function publishMailPosition() { const p = forestPlaces.mailman; p.x = mailPos.x; p.z = mailPos.z; p.pu = THREE.MathUtils.clamp(.5 + mailPos.x * .023, .07, .93); p.pv = THREE.MathUtils.clamp(.49 + mailPos.z * .025, .1, .9); }
  function summonMailman() {
    let chosen = null; for (const radius of [2.2, 2.7, 3.2, 3.8]) { for (let i = 0; i < 16; i++) { const a = -.5 + i / 16 * TAU, candidate = new THREE.Vector3(pos.x + Math.cos(a) * radius, 0, pos.z + Math.sin(a) * radius); if (walkable(candidate.x, candidate.z) && clear(pos, candidate, true)) { chosen = candidate; break; } } if (chosen) break; }
    mailPos.copy(chosen || nearestWalkable(new THREE.Vector3(pos.x + 2.5, 0, pos.z))); courierGoal = null; courierWait = 5; publishMailPosition(); courier.position.set(mailPos.x, groundY(mailPos.x, mailPos.z), mailPos.z); guidePoints = []; guideNext = 0;
  }
  function updateMailman(dt, reduced, animate) {
    courierWait = Math.max(0, courierWait - dt); const distance = mailPos.distanceTo(pos), greeting = guideTarget === 'mailman' && distance < 3.1;
    if (greeting) { courierGoal = null; courierWait = Math.max(courierWait, 1.2); }
    if (!courierGoal && !courierWait) { for (let i = 0; i < 16; i++) { const a = R() * TAU, r = 2 + R() * 3, target = new THREE.Vector3(mailPos.x + Math.cos(a) * r, 0, mailPos.z + Math.sin(a) * r); if (walkable(target.x, target.z) && clear(mailPos, target)) { courierGoal = target; break; } } courierWait = 2 + R() * 4; }
    let moving = false; if (courierGoal) { const d = courierGoal.distanceTo(mailPos); if (d < .12) { courierGoal = null; courierWait = 2 + R() * 4; } else { const direction = courierGoal.clone().sub(mailPos).normalize(); mailPos.addScaledVector(direction, Math.min(d, dt * .75)); const yaw = Math.atan2(direction.x, direction.z), diff = Math.atan2(Math.sin(yaw - courier.rotation.y), Math.cos(yaw - courier.rotation.y)); courier.rotation.y += diff * Math.min(1, dt * 7); moving = true; } }
    if (greeting) { const yaw = Math.atan2(pos.x - mailPos.x, pos.z - mailPos.z), diff = Math.atan2(Math.sin(yaw - courier.rotation.y), Math.cos(yaw - courier.rotation.y)); courier.rotation.y += diff * Math.min(1, dt * 5); }
    const y = groundY(mailPos.x, mailPos.z); courier.position.set(mailPos.x, y, mailPos.z); courierShadow.position.set(mailPos.x, y + .04, mailPos.z);
    if (animate) courierRig.update(dt, {moving, speed: .75, action: greeting ? 'wave' : '', reduced}); publishMailPosition();
  }
  function updateGuide(time) {
    const place = forestPlaces[guideTarget]; fireflies.visible = !!place; if (!place) return;
    const endpoint = nearestWalkable(place);
    if (time > guideNext && (guideFrom.distanceTo(pos) > 3 || guideEnd.distanceTo(endpoint) > 1.2 || !guidePoints.length)) { guidePoints = plan(endpoint) || [endpoint]; guideFrom.copy(pos); guideEnd.copy(endpoint); guideNext = time + 1; }
    while (guidePoints.length > 1 && guidePoints[0].distanceTo(pos) < 1.9) guidePoints.shift();
    // seven fireflies spaced along the route ahead of Fuchs, gently bobbing
    const line = [pos.clone().setY(0), ...guidePoints], p = fireflies.geometry.attributes.position, reduced = window.FK.reduced;
    let seg = 0, along = 0, target = 1.1;
    for (let k = 0; k < 7; k++, target += .85) {
      while (seg < line.length - 1 && along + line[seg].distanceTo(line[seg + 1]) < target) { along += line[seg].distanceTo(line[seg + 1]); seg++; }
      const a = line[Math.min(seg, line.length - 1)], b = line[Math.min(seg + 1, line.length - 1)], l = a.distanceTo(b) || 1, u = Math.min(1, (target - along) / l), x = a.x + (b.x - a.x) * u + Math.sin(k * 1.9 + (reduced ? 0 : time * .8)) * .25, z = a.z + (b.z - a.z) * u;
      p.setXYZ(k, x, groundY(x, z) + .55 + Math.sin(k * 2.3 + (reduced ? 0 : time * 2.2)) * .16, z);
    }
    p.needsUpdate = true; fireflies.material.opacity = reduced ? .9 : .75 + Math.sin(time * 3) * .2;
  }
  function update(dt, time, {keys, stick}) {
    const reduced = window.FK.reduced;
    let dx = Number(keys.has('ArrowRight') || keys.has('d')) - Number(keys.has('ArrowLeft') || keys.has('a')) + stick.x, dz = Number(keys.has('ArrowDown') || keys.has('s')) - Number(keys.has('ArrowUp') || keys.has('w')) + stick.z;
    const manual = Math.hypot(dx, dz) > 0, want = new THREE.Vector2(), speedMax = SPEED * speedScale;
    if (manual) { destination = null; path = []; arrival = null; ring.visible = false; want.set(dx, dz).normalize().multiplyScalar(speedMax * Math.min(1, Math.hypot(dx, dz))); }
    else if (destination) { let ddx = destination.x - pos.x, ddz = destination.z - pos.z, d = Math.hypot(ddx, ddz);
      while (path.length && d < .55) { destination = path.shift(); ddx = destination.x - pos.x; ddz = destination.z - pos.z; d = Math.hypot(ddx, ddz); }
      if (!path.length && d < .1) { destination = null; ring.visible = false; vel.set(0, 0); onPosition(pos.x, pos.z, WORLD.regionAt(pos.x, pos.z)?.id); const reached = arrival; arrival = null; if (reached) onAction(reached); }
      else { const sp = speedMax * (path.length ? 1 : Math.min(1, .25 + d / 1.2)); want.set(ddx / d * sp, ddz / d * sp); } }
    vel.lerp(want, 1 - Math.exp(-dt * (want.lengthSq() ? 9 : 12))); const speed = vel.length(), moving = speed > .15;
    if (speed > .02) { let nx = pos.x + vel.x * dt, nz = pos.z + vel.y * dt;
      // the last step lands on the target instead of overshooting it (long frames, fast walking)
      if (destination && !path.length && !manual && Math.hypot(destination.x - pos.x, destination.z - pos.z) <= speed * dt) { nx = destination.x; nz = destination.z; } if (walkable(nx, nz)) { pos.x = nx; pos.z = nz; } else if (walkable(nx, pos.z)) { pos.x = nx; vel.y *= .5; } else if (walkable(pos.x, nz)) { pos.z = nz; vel.x *= .5; } else vel.multiplyScalar(.5);
      if (speed > .2) { const target = Math.atan2(vel.x, vel.y); let diff = target - fox.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); fox.rotation.y += diff * (1 - Math.exp(-dt * 12)); } }
    if (moving && time - lastSample > 1) { lastSample = time; onPosition(pos.x, pos.z, WORLD.regionAt(pos.x, pos.z)?.id); }
    let closest = null, best = 3.2; for (const [id, p] of Object.entries(forestPlaces)) { const d = Math.hypot(p.x - pos.x, p.z - pos.z); if (d < best) { closest = id; best = d; } } if (closest !== near) { near = closest; onNear(near); }
    const base = groundY(pos.x, pos.z); fox.position.set(pos.x, base, pos.z); foxRig.update(dt, {moving, speed, reduced});
    foxShadow.position.set(pos.x, base + .04, pos.z);
    // Only characters in the near ring are drawn; at most six are animated (Fuchs always).
    const others = [...Object.entries(friends).map(([id, f]) => ({id, f, d: Math.hypot(f.x - pos.x, f.z - pos.z)})), {id: 'mailman', d: mailPos.distanceTo(pos)}].sort((a, b) => a.d - b.d);
    let animated = 1;
    for (const o of others) { const show = o.d < NEAR, anim = show && animated < MAX_ANIMATED; if (anim) animated++;
      if (o.id === 'mailman') { courier.visible = courierShadow.visible = show; courierRig.lod(o.d < 8 ? 0 : 1); updateMailman(dt, reduced, anim); }
      else { o.f.rig.group.visible = show; if (o.f.shadow) o.f.shadow.visible = show; o.f.rig.lod(o.d < 8 ? 0 : 1); if (anim) o.f.rig.update(dt, {action: near === o.id ? (o.id === 'bird' || o.id === 'owl' ? 'wave' : 'hop') : '', reduced}); } }
    animatedCount = animated;
    if (moving && !reduced && time - lastPuff > .17) { lastPuff = time; const p = puffs.find(q => q.life <= 0); if (p) { p.life = .55; p.s.visible = true; p.s.position.set(pos.x + (R() - .5) * .3, base + .12, pos.z + .15); } }
    for (const p of puffs) if (p.life > 0) { p.life -= dt; const k = 1 - p.life / .55; size(p.s, .25 + k * .45); p.s.material.opacity = .5 * (1 - k); p.s.position.y += dt * .25; if (p.life <= 0) p.s.visible = false; }
    for (const b of butterflies) { const t = time * .55 + b.phase, d = Math.hypot(b.x - pos.x, b.z - pos.z); if (d < 2.2) b.flee = 1.2; b.flee = Math.max(0, b.flee - dt);
      const tx = b.hx + Math.sin(t) * 2.2 + (b.flee ? (b.x - pos.x) / (d || 1) * 3 : 0), tz = b.hz + Math.cos(t * 1.3) * 1.6 + (b.flee ? (b.z - pos.z) / (d || 1) * 3 : 0); b.x += (tx - b.x) * Math.min(1, dt * (b.flee ? 2.5 : .8)); b.z += (tz - b.z) * Math.min(1, dt * (b.flee ? 2.5 : .8)); b.y = groundY(b.x, b.z) + 1 + Math.sin(t * 2.3) * .35 + (b.flee ? .8 : 0);
      b.s.position.set(b.x, b.y, b.z); const flap = reduced ? 1 : .25 + Math.abs(Math.cos(time * 14 + b.phase)) * .75; b.s.scale.set(.42 * flap, .32, 1); }
    const halos = streamer.landmarks.home?.halos; if (halos) halos.material.opacity = reduced ? .55 : .5 + Math.sin(time * 7) * .06;
    shaftMat.opacity = reduced ? .15 : .14 + Math.sin(time * .35) * .04;
    if (!reduced) { if (look.M.water) look.M.water.uniforms.uTime.value += dt; motes.position.set(pos.x, Math.sin(time * .35) * .3, pos.z); motes.rotation.y = time * .01; } else motes.position.set(pos.x, 0, pos.z);
    if (ring.visible) ring.material.opacity = .55 + Math.sin(time * 4) * .25;
    updateGuide(time);
    { updateMood(dt, pos.x, pos.z); backdrop.material.uniforms.uFox.value.copy(pos); const sw = streamer.landmarks.swamp; if (sw?.glow) sw.glow.material.opacity = reduced ? .8 : .55 + .4 * Math.sin(time * 1.7); if (sw?.mist && !reduced) sw.mist.position.x = Math.sin(time * .12) * 1.5; }
    focus.lerp(new THREE.Vector3(pos.x + vel.x * .35, base * lift, pos.z + vel.y * .35), reduced ? 1 : 1 - Math.exp(-dt * 2.6)); placeCamera(1);
    // stream tiles around Fuchs and ahead of him (≤ 4 ms per frame); move the static shadow with him
    // (when frames are already long, a tenth of the frame: the wait for new ground matters more than the slice)
    streamer.focus(pos.x, pos.z, pos.x + vel.x * 2, pos.z + vel.y * 2); streamer.work(Math.max(3, Math.min(6, dt * 100)));
    if (Math.hypot(pos.x - shadowAt.x, pos.z - shadowAt.z) > 8) aimSun(pos.x, pos.z);
  }
  let animatedCount = 0;
  return {scene, camera,
    /** Build in slices while the child is in the den; returns true while work remains. */
    build(budget = 8) {
      const t0 = performance.now(), more = streamer.work(budget);
      const filling = !more && WORLD.nav.work(Math.max(1, budget - (performance.now() - t0))); if (!more && !filling) compile(); return more || filling;
    },
    get pending() { return streamer.pending() || WORLD.nav.pending; },
    enter(position) {
      const p = position && walkable(position.x, position.z) ? position : forestPlaces.home; pos.set(p.x, 0, p.z); vel.set(0, 0); fox.rotation.y = 0; destination = null; path = []; arrival = null; ring.visible = false; near = null;
      streamer.focus(pos.x, pos.z); const finishing = streamer.complete(); if (perf) perf.stats.enterBuildMs = finishing; compile(); aimSun(pos.x, pos.z); snapCamera(); renderer.shadowMap.needsUpdate = true;
    },
    resize(w, h) { width = w; height = h; narrow = w < 600; camera.aspect = w / Math.max(1, h); camera.fov = narrow ? 54 : 42; camera.updateProjectionMatrix(); const vh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.02; vignette.scale.set(vh * camera.aspect, vh, 1); snapCamera(); },
    update, route(id) { const p = forestPlaces[id]; if (id === 'mailman') { courierGoal = null; courierWait = 20; } if (p) walkTo(new THREE.Vector3(p.x, 0, p.z), id); },
    walkTo(x, z) { walkTo(new THREE.Vector3(x, 0, z)); },
    /** Development: put Fuchs somewhere at once. */
    teleport(x, z) { const p = nearestWalkable(new THREE.Vector3(x, 0, z)); pos.set(p.x, 0, p.z); vel.set(0, 0); destination = null; path = []; ring.visible = false; streamer.focus(pos.x, pos.z); streamer.complete(); aimSun(pos.x, pos.z); snapCamera(); },
    mailTarget(id) { guideTarget = forestPlaces[id] ? id : null; guidePoints = []; guideNext = 0; if (id === 'mailman' && mailPos.distanceTo(pos) > 6.5) summonMailman(); }, summonMailman,
    pick(x, y) {
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      if (raycaster.intersectObject(courier, true).length) { courierGoal = null; courierWait = 20; if (mailPos.distanceTo(pos) < 3.2) onAction('mailman'); else walkTo(mailPos.clone(), 'mailman'); return; }
      const hit = raycaster.intersectObjects(streamer.terrain(), false)[0]?.point || raycaster.ray.intersectPlane(floor, new THREE.Vector3());
      if (hit) walkTo(hit);
    },
    stop() { destination = null; path = []; arrival = null; ring.visible = false; vel.set(0, 0); },
    restored() { renderer.shadowMap.needsUpdate = true; },
    budget() { const c = streamer.counts; return {liveTiles: c.near, farTiles: c.far, animated: animatedCount}; },
    set speed(k) { speedScale = k; },
    pins() { return [...pins, {id: 'mailman', point: new THREE.Vector3(mailPos.x, groundY(mailPos.x, mailPos.z) + 2.2, mailPos.z)}].map(p => { const q = p.point.clone().project(camera); return {id: p.id, x: (q.x * .5 + .5) * width, y: (-q.y * .5 + .5) * height, visible: q.z < 1 && Math.abs(q.x) < 1.02 && q.y > -1.02 && q.y < 1.12 && p.point.distanceTo(pos) < NEAR}; }); },
    get mailman() { return {x: mailPos.x, z: mailPos.z}; }, get guideTarget() { return guideTarget; }, get position() { return {x: pos.x, z: pos.z}; }, get destination() { return destination; }, get near() { return near; },
    get world() { return WORLD; },
    get region() { return WORLD.regionAt(pos.x, pos.z)?.id || 'wild'; },
  };
}
function mergePlain(geos) {
  const pos = [], uv = [], nor = [], idx = []; let base = 0;
  for (const g of geos) { const p = g.attributes.position, u = g.attributes.uv, n = g.attributes.normal; for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); uv.push(u.getX(i), u.getY(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); } for (const k of g.index.array) idx.push(base + k); base += p.count; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx); return g;
}
