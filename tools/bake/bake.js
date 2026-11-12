/* Bake page for tools/bake-characters.mjs (development only, never loaded by the game).
   Builds each sculpted plush character with the look-dev builders (design/visual-overhaul/lookdev/plush.js),
   merges its parts into two skinned meshes per level of detail — "fur" (felt, cloth, rough props)
   and "gloss" (eyes, nose, beak: shiny, with the painted eye in a small atlas) — binds every part
   rigidly to its joint bone, simplifies with meshoptimizer to the blueprint budgets (section 6.2) and
   exports one GLB per character. Joint names stay as in the game's rigs: body, head, ear_*, arm_*,
   leg_*, tail, wing_*, eye_*. */
import * as THREE from 'three';
import {GLTFExporter} from '/__bake/three/examples/jsm/exporters/GLTFExporter.js';
import {MeshoptSimplifier} from '/__bake/meshoptimizer/meshopt_simplifier.js';
import {plush} from '/design/visual-overhaul/lookdev/plush.js';

const JOINTS = new Set(['body', 'head', 'ear', 'arm', 'leg', 'tail', 'wing']);
// game id → [look-dev builder, LOD0 triangles, LOD1 triangles, LOD0 detail]
export const CAST = {fox: ['fox', 20000, 4000, 1], squirrel: ['squirrel', 12000, 4000, .9], bird: ['bluetit', 9000, 3000, .9], owl: ['owl', 12000, 4000, .9],
  mouse: ['mouse', 11000, 3500, .9], beaver: ['beaver', 12000, 4000, .9], mailman: ['hare', 12000, 4000, .9],
  deer: ['deer', 12000, 4000, .9], frog: ['frog', 9000, 3000, .9], hedgehog: ['hedgehog', 14000, 4500, .9], fish: ['fish', 8000, 3000, .9], kingfisher: ['kingfisher', 9000, 3000, .9], badger: ['badger', 13000, 4000, .9]};

/* The painted eye (left half) next to plain white (right half); kept here as the reference for characters3d.js. */
export function eyeAtlas() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'), TAU = Math.PI * 2;
  g.fillStyle = '#ffffff'; g.fillRect(256, 0, 256, 256);
  g.fillStyle = '#1c0f07'; g.fillRect(0, 0, 256, 256);
  const ir = g.createRadialGradient(128, 150, 10, 128, 140, 100); ir.addColorStop(0, '#2a1508'); ir.addColorStop(.45, '#5a3016'); ir.addColorStop(.8, '#9a5a28'); ir.addColorStop(1, '#3a1d0c');
  g.fillStyle = ir; g.beginPath(); g.arc(128, 132, 96, 0, TAU); g.fill();
  g.fillStyle = '#120804'; g.beginPath(); g.arc(128, 128, 52, 0, TAU); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(96, 92, 30, 24, -.5, 0, TAU); g.fill(); g.beginPath(); g.arc(160, 168, 11, 0, TAU); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.name = 'eye-atlas'; return t;
}

/* Build joints as bones, ordered left to right, and collect every mesh with the bone it hangs on. */
function rigOf(group) {
  group.updateMatrixWorld(true);
  const bones = [], byObject = new Map(), meshes = [];
  const root = new THREE.Bone(); root.name = 'root'; bones.push(root); byObject.set(group, root);
  const isEye = o => o.isGroup && !o.name && o.children.some(c => c.isMesh && c.material.map);
  function visit(o, parentBone) {
    let bone = parentBone;
    if (o !== group && (JOINTS.has(o.name) || isEye(o))) {
      bone = new THREE.Bone(); bone.name = o.name || 'eye'; bone.position.copy(o.position); bone.quaternion.copy(o.quaternion); bone.scale.copy(o.scale);
      parentBone.add(bone); bones.push(bone); byObject.set(o, bone); bone.userData.source = o;
    }
    if (o.isMesh) meshes.push({mesh: o, bone});
    for (const c of o.children) visit(c, bone);
  }
  for (const c of group.children) visit(c, root);
  // unique names: left (x < 0) first, as the game's rigs list ears, arms and legs
  const groups = new Map(); for (const b of bones.slice(1)) (groups.get(b.name) || groups.set(b.name, []).get(b.name)).push(b);
  for (const [name, list] of groups) {
    if (list.length < 2 && !['ear', 'arm', 'leg', 'wing', 'eye'].includes(name)) continue;
    const world = b => new THREE.Vector3().setFromMatrixPosition(b.userData.source.matrixWorld).x;
    list.sort((a, b) => world(a) - world(b)).forEach((b, i) => b.name = name + '_' + i);
  }
  return {bones, meshes};
}

/* Merge the meshes of one class into a skinned geometry in model space (bind pose). */
function mergeClass(items, bones, gloss) {
  const pos = [], nor = [], col = [], uv = [], ji = [], idx = []; let base = 0;
  const m = new THREE.Matrix4(), nm = new THREE.Matrix3(), v = new THREE.Vector3(), n = new THREE.Vector3();
  for (const {mesh, bone} of items) {
    const g = mesh.geometry, p = g.attributes.position, nr = g.attributes.normal, c = g.attributes.color, u = g.attributes.uv, k = bones.indexOf(bone);
    m.copy(mesh.matrixWorld); nm.getNormalMatrix(m);
    const color = mesh.material.color, eye = !!mesh.material.map;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m); pos.push(v.x, v.y, v.z);
      n.fromBufferAttribute(nr, i).applyMatrix3(nm).normalize(); nor.push(n.x, n.y, n.z);
      if (c && !gloss) col.push(c.getX(i) * color.r, c.getY(i) * color.g, c.getZ(i) * color.b); else if (eye) col.push(1, 1, 1); else col.push(color.r, color.g, color.b);
      if (gloss) uv.push(eye && u ? u.getX(i) * .5 : .75, eye && u ? u.getY(i) : .5);
      ji.push(k, 0, 0, 0);
    }
    if (g.index) for (const q of g.index.array) idx.push(base + q); else for (let i = 0; i < p.count; i++) idx.push(base + i);
    base += p.count;
  }
  return {pos: new Float32Array(pos), nor: new Float32Array(nor), col: new Float32Array(col), uv: gloss ? new Float32Array(uv) : null, ji: new Uint16Array(ji), idx: new Uint32Array(idx)};
}
/* Simplify to a triangle budget, keeping colour regions, then drop unused vertices. */
function simplify(d, triangles, error) {
  let idx = d.idx;
  if (idx.length / 3 > triangles) {
    const attrs = new Float32Array(d.col.length * 2); for (let i = 0; i < d.col.length / 3; i++) { attrs.set([d.col[i * 3], d.col[i * 3 + 1], d.col[i * 3 + 2], d.nor[i * 3], d.nor[i * 3 + 1], d.nor[i * 3 + 2]], i * 6); }
    [idx] = MeshoptSimplifier.simplifyWithAttributes(d.idx, d.pos, 3, attrs, 6, [1.2, 1.2, 1.2, .25, .25, .25], null, Math.floor(triangles) * 3, error, []);
  }
  idx = new Uint32Array(idx);
  const [remap, count] = MeshoptSimplifier.compactMesh(idx);
  const pick = (src, size) => { if (!src) return null; const out = new src.constructor(count * size); for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) for (let k = 0; k < size; k++) out[remap[i] * size + k] = src[i * size + k]; return out; };
  return {pos: pick(d.pos, 3), nor: pick(d.nor, 3), col: pick(d.col, 3), uv: pick(d.uv, 2), ji: pick(d.ji, 4), idx};
}
function skinned(d, material, name, skeleton) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(d.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(d.nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(d.col, 3));
  if (d.uv) g.setAttribute('uv', new THREE.BufferAttribute(d.uv, 2));
  g.setAttribute('skinIndex', new THREE.BufferAttribute(d.ji, 4)); const w = new Float32Array(d.ji.length); for (let i = 0; i < w.length; i += 4) w[i] = 1; g.setAttribute('skinWeight', new THREE.BufferAttribute(w, 4));
  g.setIndex(new THREE.BufferAttribute(d.idx.length / 3 > 65535 ? d.idx : new Uint16Array(d.idx), 1));
  const mesh = new THREE.SkinnedMesh(g, material); mesh.name = name; mesh.bind(skeleton); return mesh;
}

export async function bake(id) {
  await MeshoptSimplifier.ready;
  const [builder, lod0, lod1, detail] = CAST[id];
  // The eye atlas is drawn by the game at load time (characters3d.js), so the files carry only its UVs.
  const fur = new THREE.MeshStandardMaterial({name: 'fur', vertexColors: true, roughness: .92, metalness: 0}), gloss = new THREE.MeshStandardMaterial({name: 'gloss', vertexColors: true, roughness: .12, metalness: 0});
  const scene = new THREE.Scene(), model = new THREE.Group(); model.name = id; scene.add(model);
  const report = {id};
  let skeleton = null, rootBone = null;
  for (const [lod, budget, d] of [[0, lod0, detail], [1, lod1, detail * .55]]) {
    const c = plush[builder]({detail: d}), {bones, meshes} = rigOf(c.group);
    if (!skeleton) { rootBone = bones[0]; model.add(rootBone); model.updateMatrixWorld(true); skeleton = new THREE.Skeleton(bones); }
    const glossItems = meshes.filter(({mesh}) => mesh.material.roughness < .5), furItems = meshes.filter(({mesh}) => mesh.material.roughness >= .5);
    // both levels bind to the first level's bones (same joints, same rest pose)
    const remapBones = items => items.map(({mesh, bone}) => ({mesh, bone: skeleton.bones.find(b => b.name === bone.name)}));
    const gData = mergeClass(remapBones(glossItems), skeleton.bones, true), fData = mergeClass(remapBones(furItems), skeleton.bones, false);
    const gBudget = Math.min(gData.idx.length / 3, lod ? 500 : 2600), fBudget = budget - gBudget;
    const gs = simplify(gData, gBudget, lod ? .03 : .004), fs = simplify(fData, fBudget, lod ? .05 : .006);
    model.add(skinned(fs, fur, 'fur_lod' + lod, skeleton), skinned(gs, gloss, 'gloss_lod' + lod, skeleton));
    report['lod' + lod] = {fur: fs.idx.length / 3, gloss: gs.idx.length / 3, source: (fData.idx.length + gData.idx.length) / 3};
  }
  report.bones = skeleton.bones.map(b => b.name);
  const glb = await new GLTFExporter().parseAsync(scene, {binary: true, onlyVisible: false});
  let s = ''; const bytes = new Uint8Array(glb); for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return {report, base64: btoa(s)};
}
window.bake = bake;
window.bakeReady = true;
