import { THREE } from './materials.js';
import { fox, beaver, hare, hedgehog, owl, kingfisher } from './characters.js';
import { buildLandscape } from './landscape.js';
import { loadPaintedArt } from './painted.js';
export const loadForestArt = loadPaintedArt;

export function createForest(canvas, callbacks = {}) {
  const model = window.FK.forestState;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#eee9d2'); scene.fog = new THREE.Fog('#eee9d2', 62, 125);
  scene.add(new THREE.HemisphereLight('#fff6df', '#a4af7c', 1.1));
  const sun = new THREE.DirectionalLight('#fff0d4', 1.2); sun.position.set(-14, 35, 20);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.normalBias = 0.055; sun.shadow.bias = -0.0003;
  sun.shadow.radius = 3; sun.shadow.blurSamples = 6;
  Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 25, bottom: -25, near: 1, far: 80 });
  sun.shadow.camera.updateProjectionMatrix(); scene.add(sun);
  const landscape = buildLandscape(scene, model);
  const player = fox(), residents = { beaver: beaver(), hare: hare(), hedgehog: hedgehog(), owl: owl(), kingfisher: kingfisher() };
  scene.add(player.group);
  const saved = model.get();
  player.group.position.set(saved.position.x, 0.06, saved.position.z); player.group.rotation.y = 0.3;
  residents.beaver.group.position.set(model.residents.beaver.x, 0.06, model.residents.beaver.z); residents.beaver.group.rotation.y = 0.6;
  residents.hare.group.position.set(model.residents.hare.x, 0.06, model.residents.hare.z); residents.hare.group.rotation.y = -0.5;
  residents.hedgehog.group.position.set(model.residents.hedgehog.x, 0.06, model.residents.hedgehog.z); residents.hedgehog.group.rotation.y = -2.45;
  residents.owl.group.position.set(model.residents.owl.x, 0.06, model.residents.owl.z); residents.owl.group.rotation.y = -2.4;
  residents.kingfisher.group.position.set(model.residents.kingfisher.x, 0.06, model.residents.kingfisher.z); residents.kingfisher.group.rotation.y = -0.8;
  Object.entries(residents).forEach(([id, rig]) => { scene.add(rig.group); rig.group.traverse(o => { o.userData.resident = id; }); });
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 64;
  const shadowContext = shadowCanvas.getContext('2d'), gradient = shadowContext.createRadialGradient(32, 32, 3, 32, 32, 31);
  gradient.addColorStop(0, '#45513135'); gradient.addColorStop(1, '#45513100'); shadowContext.fillStyle = gradient; shadowContext.fillRect(0, 0, 64, 64);
  const contactMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false });
  for (const rig of [player, ...Object.values(residents)]) {
    rig.group.traverse(mesh => { mesh.castShadow = false; });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.8), contactMaterial); shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.018; shadow.raycast = () => {}; rig.group.add(shadow);
  }
  const camera = new THREE.OrthographicCamera(-20, 20, 14, -14, 0.1, 160);
  const offset = new THREE.Vector3(12, 50, 32), focus = new THREE.Vector3(-2, 0, 4);
  let width = 1, height = 1, running = false, raf = 0, last = 0, time = 0;
  let waypoints = [], arrival = null, focusResident = null, repairStart = null, lastSave = 0, inputEnabled = true;
  let currentHalfHeight = 14, displayedRepaired = saved.bridgeRepaired, previousPortrait = null;
  let displayedRest = model.isComplete(model.REST), displayedGrove = saved.bridgeRepaired && saved.greetingSeen;
  let displayedHollow = model.residentAvailable('owl'), displayedSign = model.isComplete(model.TRAIL);
  let gathering = false, displayedGathering = false, projectSignature = '', fadeTimer = 0;
  const homeYaw = { beaver: 0.6, hare: -0.5, hedgehog: -2.45, owl: -2.4, kingfisher: -0.8 };
  const gatheringPlaces = { beaver: [-12, 8], hare: [-10.8, 10.5], hedgehog: [-5.7, 8.5], owl: [-3.9, 7.1], kingfisher: [-6.3, 5.1] };
  landscape.hero.traverse(o => { o.userData.landmark = 'home'; });
  const keys = new Set(), raycaster = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const destination = new THREE.Group();
  const markerMat = new THREE.MeshBasicMaterial({ color: '#f9edc1', transparent: true, opacity: 0.85, depthWrite: false });
  const pad = new THREE.Mesh(new THREE.CircleGeometry(0.24, 16), markerMat); pad.rotation.x = -Math.PI / 2; pad.scale.y = 0.8; destination.add(pad);
  for (const [x, z] of [[-0.25, -0.27], [0, -0.37], [0.25, -0.27]]) {
    const toe = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), markerMat); toe.rotation.x = -Math.PI / 2; toe.position.set(x, 0, z); destination.add(toe);
  }
  destination.visible = false; scene.add(destination);

  function viewGoal(portrait) {
    if (focusResident === 'home') return new THREE.Vector3(-8, 0, 6.2);
    if (focusResident === 'kingfisher') return new THREE.Vector3(-8, 0, 24);
    if (focusResident === 'owl') return new THREE.Vector3(7.5, 0, 26);
    if (focusResident === 'hedgehog') return new THREE.Vector3(20.5, 0, 15.5);
    if (focusResident) return new THREE.Vector3(0.2, 0, -6.2);
    const p = player.group.position, grove = Math.max(0, Math.min(1, Math.max((p.x - 11) / 6, (-p.x - 14) / 5, (p.z - 13) / 7)));
    const xFollow = portrait ? 0.92 : THREE.MathUtils.lerp(0.36, 0.92, grove);
    const zFollow = portrait ? 0.92 : THREE.MathUtils.lerp(0.48, 0.92, grove);
    return new THREE.Vector3(p.x * xFollow, 0, p.z * zFollow + 1);
  }
  function viewHeight(portrait) { return focusResident === 'home' ? (portrait ? 16.8 : 14.6) : ['hedgehog', 'owl', 'kingfisher'].includes(focusResident) ? (portrait ? 12.5 : 11.5) : focusResident ? (portrait ? 17.4 : 12.7) : portrait ? 12.5 : 14.4; }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect(); width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const portrait = aspect < 0.9, target = portrait ? 12.5 : 14.4;
    if (!running || portrait !== previousPortrait) {
      currentHalfHeight = focusResident ? viewHeight(portrait) : target;
      focus.copy(viewGoal(portrait));
      camera.position.copy(focus).add(offset); camera.lookAt(focus); camera.updateMatrixWorld();
    }
    previousPortrait = portrait;
    camera.left = -currentHalfHeight * aspect; camera.right = currentHalfHeight * aspect;
    camera.top = currentHalfHeight; camera.bottom = -currentHalfHeight; camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas.parentElement); resize();

  function persist() { model.position({ x: player.group.position.x, z: player.group.position.z }); }
  function targetAt(point, resident) {
    if (!inputEnabled) return;
    const position = player.group.position;
    waypoints = model.route({ x: position.x, z: position.z }, point);
    if (waypoints.length && model.distance(waypoints[0], position) < 0.08) waypoints.shift();
    arrival = resident || null;
    const end = waypoints.at(-1);
    if (end) {
      destination.position.set(end.x, landscape.height(end.x, end.z, model.get().bridgeRepaired) + 0.04, end.z);
      destination.visible = true; callbacks.onWalk?.();
    } else if (resident) callbacks.onArrive?.(resident);
  }
  function walkToResident(id) { if (residents[id] && model.residentAvailable(id)) targetAt(model.nodes[id], id); }
  let down = null;
  function pointerDown(event) { if (event.isPrimary) down = { x: event.clientX, y: event.clientY }; }
  function pointerUp(event) {
    if (!down || !event.isPrimary || !inputEnabled) return;
    const drag = Math.hypot(event.clientX - down.x, event.clientY - down.y); down = null;
    if (drag > 12) return;
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hits = raycaster.intersectObjects(Object.values(residents).filter(r => r.group.visible).map(r => r.group), true);
    if (hits.length) { walkToResident(hits[0].object.userData.resident); return; }
    if (raycaster.intersectObject(landscape.hero, true).length) { targetAt(model.nodes.home, 'home'); return; }
    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, hit)) targetAt({ x: hit.x, z: hit.z });
  }
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', () => { down = null; });
  function keyDown(event) {
    if (!running || !inputEnabled || event.altKey || event.metaKey || event.ctrlKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) { event.preventDefault(); keys.add(event.key); arrival = null; waypoints = []; }
  }
  window.addEventListener('keydown', keyDown); window.addEventListener('keyup', event => keys.delete(event.key));
  window.addEventListener('blur', () => { keys.clear(); persist(); });
  window.addEventListener('pagehide', persist);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { keys.clear(); persist(); } });

  function turn(target, amount) {
    let delta = (target - player.group.rotation.y + Math.PI) % (Math.PI * 2);
    if (delta < 0) delta += Math.PI * 2;
    delta -= Math.PI; player.group.rotation.y += delta * Math.min(1, amount);
  }
  function walk(dt) {
    const position = player.group.position;
    if (keys.size && inputEnabled) {
      const x = Number(keys.has('ArrowRight') || keys.has('d')) - Number(keys.has('ArrowLeft') || keys.has('a'));
      const z = Number(keys.has('ArrowDown') || keys.has('s')) - Number(keys.has('ArrowUp') || keys.has('w'));
      const direction = new THREE.Vector2(x * 0.936 + z * 0.351, -x * 0.351 + z * 0.936).normalize();
      const step = 4.8 * dt, next = model.snap({ x: position.x + direction.x * step, z: position.z + direction.y * step });
      const d = model.distance(position, next);
      if (d > 0.001 && d < step * 1.7) { turn(Math.atan2(next.x - position.x, next.z - position.z), dt * 12); position.x = next.x; position.z = next.z; callbacks.onWalk?.(); return true; }
    }
    if (!waypoints.length || !inputEnabled) return false;
    let remaining = dt * 5;
    while (waypoints.length && remaining > 0) {
      const target = waypoints[0], d = model.distance(position, target);
      if (d > 0.001) turn(Math.atan2(target.x - position.x, target.z - position.z), dt * 12);
      if (d <= remaining) { position.x = target.x; position.z = target.z; waypoints.shift(); remaining -= d; }
      else { position.x += (target.x - position.x) / d * remaining; position.z += (target.z - position.z) / d * remaining; remaining = 0; }
    }
    if (!waypoints.length) {
      destination.visible = false; persist(); const id = arrival; arrival = null;
      if (id) { if (residents[id]) turn(Math.atan2(residents[id].group.position.x - position.x, residents[id].group.position.z - position.z), 1); callbacks.onArrive?.(id); }
    }
    return true;
  }
  function project(point) {
    const p = point.clone().project(camera);
    return { x: (p.x + 1) * width / 2, y: (-p.y + 1) * height / 2, visible: p.z < 1 && Math.abs(p.x) < 0.95 && Math.abs(p.y) < 0.86 };
  }
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.2); last = now; time += dt;
    const moving = walk(dt), state = model.get(), repaired = state.bridgeRepaired;
    const grove = repaired && state.greetingSeen, rested = model.isComplete(model.REST);
    const hollow = model.residentAvailable('owl'), signed = model.isComplete(model.TRAIL);
    residents.hedgehog.group.visible = grove;
    residents.owl.group.visible = hollow;
    if (grove !== displayedGrove || rested !== displayedRest) renderer.shadowMap.needsUpdate = true;
    landscape.setGrove(grove, rested); displayedGrove = grove; displayedRest = rested;
    if (hollow !== displayedHollow || signed !== displayedSign) renderer.shadowMap.needsUpdate = true;
    landscape.setHollow(hollow, signed); displayedHollow = hollow; displayedSign = signed;
    residents.kingfisher.group.visible = model.residentAvailable('kingfisher');
    const signature = Object.keys(state.contributions).filter(id => state.contributions[id]).sort().join('|') + state.endingUnlocked;
    if (signature !== projectSignature || gathering !== displayedGathering) renderer.shadowMap.needsUpdate = true;
    landscape.setProjects(state); projectSignature = signature;
    if (gathering !== displayedGathering) {
      for (const [id, rig] of Object.entries(residents)) {
        const p = gathering ? { x: gatheringPlaces[id][0], z: gatheringPlaces[id][1] } : model.residents[id];
        rig.group.position.set(p.x, 0.06, p.z); rig.group.rotation.y = gathering ? Math.atan2(-8 - p.x, 8 - p.z) : homeYaw[id];
      }
      displayedGathering = gathering;
      canvas.parentElement.classList.remove('forest-scene-transition');
      if (!window.FK.reduced) { void canvas.offsetWidth; canvas.parentElement.classList.add('forest-scene-transition'); clearTimeout(fadeTimer); fadeTimer = setTimeout(() => canvas.parentElement.classList.remove('forest-scene-transition'), 750); }
    }
    player.group.position.y = THREE.MathUtils.lerp(player.group.position.y, landscape.height(player.group.position.x, player.group.position.z, repaired), 1 - Math.exp(-dt * 18));
    const decorativeTime = window.FK.reduced ? 0 : time;
    player.animate(moving ? time : decorativeTime, moving);
    Object.entries(residents).forEach(([id, rig]) => rig.animate(decorativeTime, focusResident === id || (repaired && !state.greetingSeen), id === 'hedgehog' && rested));
    let progress = 1;
    if (repairStart !== null) { progress = Math.min(1, (now / 1000 - repairStart) / 1.4); if (progress === 1) { repairStart = null; renderer.shadowMap.needsUpdate = true; } }
    if (repaired !== displayedRepaired || (repaired && repairStart !== null && progress > 0.95)) renderer.shadowMap.needsUpdate = true;
    landscape.setBridge(repaired, progress); displayedRepaired = repaired; landscape.animate(decorativeTime);
    const aspect = width / height, portrait = aspect < 0.9;
    const goal = viewGoal(portrait);
    focus.lerp(goal, 1 - Math.exp(-dt * 2.6));
    const half = viewHeight(portrait);
    currentHalfHeight = THREE.MathUtils.lerp(currentHalfHeight, half, 1 - Math.exp(-dt * 2.2));
    camera.left = -currentHalfHeight * aspect; camera.right = currentHalfHeight * aspect; camera.top = currentHalfHeight; camera.bottom = -currentHalfHeight; camera.updateProjectionMatrix();
    camera.position.copy(focus).add(offset); camera.lookAt(focus); camera.updateMatrixWorld();
    const foxHead = player.group.position.clone().add(new THREE.Vector3(0, 1.6, 0));
    const visibleHead = focusResident === 'home' ? gathering ? foxHead : new THREE.Vector3(-8, 2.6, 2.9) : focusResident ? residents[focusResident].group.position.clone().add(new THREE.Vector3(0, 1.2, 0)) : foxHead;
    const ray = new THREE.Ray(camera.position, visibleHead.clone().sub(camera.position).normalize());
    for (const tree of landscape.trees) {
      const closest = new THREE.Vector3(); ray.closestPointToPoint(tree.centre, closest);
      const hiding = closest.distanceTo(tree.centre) < tree.radius * 0.86 && closest.distanceTo(camera.position) < visibleHead.distanceTo(camera.position);
      tree.leaves.children.forEach(mesh => { mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, hiding ? 0.28 : 1, 1 - Math.exp(-dt * 10)); });
    }
    renderer.render(scene, camera);
    const projected = {};
    for (const [id, rig] of Object.entries(residents)) {
      const p = project(rig.group.position.clone().add(new THREE.Vector3(0, { beaver: 1.5, hare: 2, hedgehog: 0.9, owl: 1.8, kingfisher: 1.6 }[id], 0)));
      projected[id] = { ...p, visible: rig.group.visible && p.visible };
    }
    callbacks.onProject?.({ ...projected, home: project(new THREE.Vector3(-8, 2.5, 2.9)), fox: project(foxHead), spot: project(new THREE.Vector3(-12.0, 0.2, 5.0)) });
    if (moving && time - lastSave > 1.2) { persist(); lastSave = time; }
    raf = requestAnimationFrame(frame);
  }
  camera.position.copy(focus).add(offset); camera.lookAt(focus); landscape.setBridge(saved.bridgeRepaired);
  landscape.setGrove(displayedGrove, displayedRest); residents.hedgehog.group.visible = displayedGrove;
  landscape.setHollow(displayedHollow, displayedSign); residents.owl.group.visible = displayedHollow;
  landscape.setProjects(saved); residents.kingfisher.group.visible = model.residentAvailable('kingfisher');
  renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera);
  return {
    start() { if (!running) { running = true; last = 0; resize(); raf = requestAnimationFrame(frame); } },
    stop() { running = false; cancelAnimationFrame(raf); keys.clear(); persist(); },
    walkTo: targetAt, walkToResident,
    gather(enabled) { gathering = enabled === true; },
    focus(id) { focusResident = id || null; },
    input(enabled) { inputEnabled = enabled; if (!enabled) { keys.clear(); waypoints = []; arrival = null; destination.visible = false; persist(); } },
    repair() { if (!displayedRepaired) repairStart = performance.now() / 1000; },
    get position() { return { x: player.group.position.x, z: player.group.position.z }; },
    get renderer() { return renderer; },
    get scene() { return scene; },
    get camera() { return camera; },
    get running() { return running; },
    dispose() { this.stop(); clearTimeout(fadeTimer); observer.disconnect(); renderer.dispose(); },
  };
}
