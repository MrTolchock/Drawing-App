import * as THREE from '../../vendor/three/three.module.js';

const materials = new Map();
export function seeded(seed = 1) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}
export function paint(color, kind = 'soft') {
  const key = color + ':' + kind;
  if (materials.has(key)) return materials.get(key);
  const terrain = ['ground', 'sand', 'water'].includes(kind), size = terrain ? 512 : 192;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color; ctx.fillRect(0, 0, size, size);
  const rng = seeded([...key].reduce((n, c) => n + c.charCodeAt(0), 17));
  for (let i = 0; i < 90; i++) {
    const x = rng() * size, y = rng() * size, r = size * (0.03 + rng() * 0.16);
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
      const wash = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
      wash.addColorStop(0, i % 2 ? '#fff2c622' : '#77834b18'); wash.addColorStop(1, '#ffffff00');
      ctx.fillStyle = wash; ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
    }
  }
  for (let i = 0; i < (terrain ? 9500 : 2100); i++) {
    ctx.fillStyle = i % 2 ? '#fff5d51b' : '#655b3a0e';
    const x = rng() * size, y = rng() * size;
    ctx.fillRect(x, y, 0.4 + rng() * 1.4, kind === 'bark' ? 3 + rng() * 22 : 0.5 + rng() * 1.5);
  }
  if (kind === 'ground') for (let i = 0; i < 950; i++) {
    const x = rng() * size, y = rng() * size, height = 2 + rng() * 7;
    ctx.strokeStyle = i % 3 ? '#7d944333' : '#f0edaf88'; ctx.lineWidth = 0.7 + rng();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 2, y - height * 0.6, x - 3, y - height); ctx.stroke();
  }
  if (kind === 'water') for (let i = 0; i < 110; i++) {
    const x = rng() * size, y = rng() * size;
    ctx.strokeStyle = i % 3 ? '#e6f0d834' : '#527f8c24'; ctx.lineWidth = 1 + rng() * 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 8, y - 4, x + 18, y + 3, x + 22 + rng() * 28, y - 1); ctx.stroke();
  }
  if (kind === 'bark') for (let i = 0; i < 12; i++) {
    const x = rng() * size;
    ctx.strokeStyle = '#84633a2a'; ctx.lineWidth = 0.5 + rng(); ctx.beginPath(); ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 9, size * 0.35, x - 9, size * 0.7, x + 4, size); ctx.stroke();
  }
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  const material = terrain ? new THREE.MeshBasicMaterial({ map, toneMapped: false }) : new THREE.MeshLambertMaterial({ map });
  material.userData.paintKind = kind;
  materials.set(key, material); return material;
}
export function solid(color) { return paint(color, 'plain'); }
let pathMaterial;
export function paintedPath(points, width = 1.45) {
  if (!pathMaterial) {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d'), fade = ctx.createLinearGradient(0, 0, 256, 0);
    for (const [stop, value] of [[0, 0], [0.06, 0.4], [0.13, 0.94], [0.2, 1], [0.8, 1], [0.87, 0.94], [0.94, 0.4], [1, 0]])
      fade.addColorStop(stop, 'rgb(' + Math.round(value * 255) + ' ' + Math.round(value * 255) + ' ' + Math.round(value * 255) + ')');
    ctx.fillStyle = fade; ctx.fillRect(0, 0, 256, 128);
    const random = seeded(531);
    for (let i = 0; i < 1800; i++) {
      const x = random() < 0.5 ? random() * 33 : 223 + random() * 33;
      ctx.fillStyle = '#00000026'; ctx.fillRect(x, random() * 128, 1 + random() * 3, 1 + random() * 4);
    }
    const alphaMap = new THREE.CanvasTexture(canvas); alphaMap.wrapT = THREE.RepeatWrapping;
    pathMaterial = paint('#ecd3a3', 'sand').clone();
    pathMaterial.alphaMap = alphaMap; pathMaterial.transparent = true; pathMaterial.alphaTest = 0.025; pathMaterial.depthWrite = false;
  }
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, 0, p.z)), false, 'catmullrom', 0.12);
  const samples = curve.getPoints(140), positions = [], uv = [], indices = [];
  let distance = 0;
  samples.forEach((p, i) => {
    const a = samples[Math.max(0, i - 1)], b = samples[Math.min(samples.length - 1, i + 1)];
    if (i) distance += p.distanceTo(a);
    const length = Math.hypot(b.x - a.x, b.z - a.z) || 1, size = width + Math.sin(distance * 2.1) * 0.035;
    const nx = -(b.z - a.z) / length * size, nz = (b.x - a.x) / length * size;
    positions.push(p.x + nx, 0.055, p.z + nz, p.x - nx, 0.055, p.z - nz);
    uv.push(0, distance / 6, 1, distance / 6);
    if (i < samples.length - 1) { const n = i * 2; indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3); }
  });
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, pathMaterial); mesh.renderOrder = -2; mesh.name = 'painted-sandy-path'; return mesh;
}
export function roundedBlock(width, height, depth, radius = 0.08) {
  const x = width / 2, z = depth / 2, r = Math.min(radius, x * 0.4, z * 0.4), shape = new THREE.Shape();
  shape.moveTo(-x + r, -z); shape.lineTo(x - r, -z); shape.quadraticCurveTo(x, -z, x, -z + r);
  shape.lineTo(x, z - r); shape.quadraticCurveTo(x, z, x - r, z); shape.lineTo(-x + r, z);
  shape.quadraticCurveTo(-x, z, -x, z - r); shape.lineTo(-x, -z + r); shape.quadraticCurveTo(-x, -z, -x + r, -z);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, steps: 1, bevelEnabled: true, bevelThickness: height * 0.18, bevelSize: r * 0.4, bevelSegments: 2, curveSegments: 3 });
  geometry.rotateX(-Math.PI / 2); geometry.translate(0, -height / 2, 0); return geometry;
}
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
