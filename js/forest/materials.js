import * as THREE from '../../vendor/three/three.module.js';

const materials = new Map();
export function seeded(seed = 1) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}
export function paint(color, kind = 'soft') {
  const key = color + ':' + kind;
  if (materials.has(key)) return materials.get(key);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color; ctx.fillRect(0, 0, 128, 128);
  const rng = seeded([...key].reduce((n, c) => n + c.charCodeAt(0), 17));
  for (let i = 0; i < 42; i++) {
    const x = rng() * 128, y = rng() * 128, r = 5 + rng() * 30;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, i % 2 ? '#fff9e61b' : '#504b2710'); g.addColorStop(1, '#ffffff00');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = i % 2 ? '#fff6df13' : '#3e402b0c';
    const x = rng() * 128, y = rng() * 128;
    if (kind === 'bark') ctx.fillRect(x, y, 0.4 + rng(), 2 + rng() * 12);
    else ctx.fillRect(x, y, 0.4 + rng() * 1.5, 0.4 + rng() * 1.5);
  }
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  const material = new THREE.MeshLambertMaterial({ map });
  materials.set(key, material); return material;
}
export function solid(color) { return paint(color, 'plain'); }
const sphere = new THREE.SphereGeometry(1, 20, 14);
export function ellipsoid(parent, material, position, scale, rotation) {
  const mesh = new THREE.Mesh(sphere, material);
  mesh.position.set(...position); mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
export function limb(parent, material, from, to, bottom, top = bottom) {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, a.distanceTo(b), 10, 1), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
  mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
export function curveTube(parent, material, points, radius, segments = 16) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), material);
  mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
export function eyes(parent, y, z, width, size = 1) {
  for (const side of [-1, 1]) {
    ellipsoid(parent, solid('#fff2d3'), [side * width, y, z], [0.155 * size, 0.195 * size, 0.1 * size]);
    ellipsoid(parent, solid('#2e2c26'), [side * width + 0.015, y - 0.005, z + 0.078], [0.1 * size, 0.142 * size, 0.06 * size]);
    const light = ellipsoid(parent, solid('#fffdf0'), [side * width - 0.025, y + 0.05, z + 0.131], [0.03 * size, 0.039 * size, 0.015 * size]);
    light.castShadow = false;
  }
}
export { THREE };
