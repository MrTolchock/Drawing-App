/* Tiles and landmarks dissolve in and out instead of appearing at once (a fine stipple on the screen over FADE
   seconds): a new tile, a tile that changes its detail (near ↔ far: the old and the new version use complementary
   stipples, so the ground is never doubled or missing for a moment) and a tile that leaves. A fading group draws with
   copies of the shared materials that carry its own progress. The copies of one material share a single program,
   compiled in advance (`warm`), so a dissolve never waits for a shader. */
import {THREE} from '../../scene/materials.js';

export const FADE = .6;
const SLOTS = 32;
const NOISE = 'uniform vec2 ffFade;\nfloat ffFadeNoise(vec2 p){return fract(52.9829189*fract(dot(floor(p),vec2(.06711056,.00583715))));}\n';
// ffFade.x: progress 0…1; ffFade.y: +1 a group that appears, -1 one that leaves (the complementary stipple)
const TEST = '\n{float ffN=ffFadeNoise(gl_FragCoord.xy);if(ffFade.y>0.?ffN>=ffFade.x:ffN<ffFade.x)discard;}\n';
const MAIN = /void\s+main\s*\(\s*\)\s*\{/;

function fadeCopy(base, uniform) {
  const m = base.clone();
  m.name = (base.name || base.type) + ' (dissolve)';
  if (base.isShaderMaterial) {
    m.uniforms = {...base.uniforms, ffFade: uniform};   // the same uniform objects as the original, so time, fog and light follow it
    m.fragmentShader = base.fragmentShader.replace(MAIN, s => NOISE + s + TEST);
  } else {
    const before = base.onBeforeCompile, key = base.customProgramCacheKey();
    m.onBeforeCompile = (sh, renderer) => {
      before.call(base, sh, renderer); sh.uniforms.ffFade = uniform;
      sh.fragmentShader = sh.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>' + TEST).replace(MAIN, s => NOISE + s);
    };
    m.customProgramCacheKey = () => key + '|ff-dissolve';
  }
  return m;
}

export function createFades() {
  const slots = Array.from({length: SLOTS}, () => ({u: {value: new THREE.Vector2(0, 1)}, copies: new Map(), group: null}));
  const rehearsal = {u: {value: new THREE.Vector2(1, 1)}, copies: new Map()};
  const running = new Set();
  const copyFor = (slot, base) => { let m = slot.copies.get(base); if (!m) { m = fadeCopy(base, slot.u); slot.copies.set(base, m); } return m; };
  function dress(group, slot) {
    group.traverse(o => { if (!o.material || o.userData.ffNoFade) return; if (!o.userData.ffBase) o.userData.ffBase = o.material; const b = o.userData.ffBase; o.material = Array.isArray(b) ? b.map(x => copyFor(slot, x)) : copyFor(slot, b); });
  }
  function undress(group) { group.traverse(o => { if (o.userData.ffBase) { o.material = o.userData.ffBase; delete o.userData.ffBase; } }); }
  function end(f, jump) {
    running.delete(f); f.slot.group = null; undress(f.group); delete f.group.userData.fading;
    if (f.dir < 0) f.group.visible = false;
    f.done?.(jump);
  }
  /** Start a dissolve: dir +1 shows `group`, -1 hides it. `done` runs when it has finished (or was cut short). */
  function start(group, dir, done = null) {
    stop(group, true);
    const slot = slots.find(s => !s.group);
    if (!slot) { group.visible = dir > 0; done?.(true); return null; }   // all busy: at once (rare)
    slot.group = group; slot.u.value.set(0, dir); dress(group, slot); group.visible = true;
    const f = {group, slot, dir, t: 0, done}; group.userData.fading = f; running.add(f); return f;
  }
  /** Reverse a running dissolve (a tile that is wanted again while it is still going); false if there is none. */
  function turn(group, done = null) { const f = group.userData.fading; if (!f) return false; f.dir = -f.dir; f.t = FADE - f.t; f.slot.u.value.set(Math.min(1, f.t / FADE), f.dir); f.done = done; return true; }
  /** Finish a group's dissolve at once (`silent`: without its callback). */
  function stop(group, silent = false) { const f = group.userData.fading; if (!f) return; if (silent) f.done = null; end(f, true); }
  return {
    start, stop, turn,
    in: (group, done) => start(group, 1, done),
    out: (group, done) => start(group, -1, done),
    update(dt) { for (const f of [...running]) { f.t += dt; const k = Math.min(1, f.t / FADE); f.slot.u.value.x = k; if (k >= 1) end(f, false); } },
    /** Finish every dissolve at once (Fuchs steps outside, a teleport). */
    finish() { for (const f of [...running]) end(f, true); },
    get count() { return running.size; },
    /** Dress everything in `group` that is not dissolving with dissolve copies, so that the renderer can compile their
        programs in advance (the copies of every slot share them); the returned function takes the copies off again. */
    rehearse(group) {
      const dressed = []; group.traverse(o => { if (o.material && !o.userData.ffBase && !o.userData.ffNoFade) dressed.push(o); });
      for (const o of dressed) { o.userData.ffBase = o.material; o.material = Array.isArray(o.material) ? o.material.map(x => copyFor(rehearsal, x)) : copyFor(rehearsal, o.material); }
      return () => { for (const o of dressed) { o.material = o.userData.ffBase; delete o.userData.ffBase; } };
    },
  };
}
