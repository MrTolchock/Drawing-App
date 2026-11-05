import { THREE, paint, solid, ellipsoid, limb, curveTube, eyes, seeded } from './materials.js';

function ear(parent, material, x, y, z, side) {
  const shape = new THREE.Shape(); shape.moveTo(-0.28, 0); shape.quadraticCurveTo(-0.22, 0.5, 0, 0.85); shape.quadraticCurveTo(0.22, 0.6, 0.29, 0); shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: true, bevelSize: 0.055, bevelThickness: 0.04, bevelSegments: 2, steps: 1, curveSegments: 6 });
  const outer = new THREE.Mesh(geometry, material); outer.position.set(x, y, z); outer.rotation.z = -side * 0.18; outer.castShadow = true; parent.add(outer);
  const inner = new THREE.Mesh(geometry, solid('#f0cd9c')); inner.scale.set(0.6, 0.65, 0.1); inner.position.set(0, 0.08, 0.2); outer.add(inner);
  return outer;
}

export function fox() {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
  const fur = paint('#ce7e34', 'fur'), cream = paint('#f7e6c5', 'fur'), dark = solid('#704b32'), green = paint('#526d3d');
  ellipsoid(body, fur, [0, 1.08, -0.08], [0.61, 0.76, 0.98]);
  ellipsoid(body, cream, [0, 0.99, 0.66], [0.42, 0.6, 0.22]);
  const head = new THREE.Group(); head.position.set(0, 1.88, 0.68); body.add(head);
  ellipsoid(head, fur, [0, 0, 0], [0.73, 0.66, 0.65]);
  for (const side of [-1, 1]) ellipsoid(head, cream, [side * 0.39, -0.24, 0.4], [0.42, 0.31, 0.32], [0, 0, -side * 0.18]);
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.72, 20), cream);
  muzzle.rotation.x = Math.PI / 2; muzzle.position.set(0, -0.19, 0.73); muzzle.scale.x = 1.1; muzzle.scale.z = 0.72; head.add(muzzle);
  ellipsoid(head, solid('#383128'), [0, -0.16, 1.07], [0.13, 0.09, 0.11]);
  eyes(head, 0.13, 0.52, 0.38, 1.02);
  curveTube(head, dark, [[0, -0.3, 0.87], [0.18, -0.33, 0.74], [0.29, -0.25, 0.65]], 0.017);
  const ears = [-1, 1].map(side => ear(head, dark, side * 0.46, 0.35, -0.08, side));
  for (const e of ears) {
    const inset = new THREE.Mesh(e.geometry, fur); inset.scale.set(0.92, 0.88, 0.7); inset.position.z = 0.05; e.add(inset);
  }
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.115, 8, 24), green);
  scarf.rotation.x = Math.PI / 2; scarf.position.set(0, 1.52, 0.64); body.add(scarf);
  const cloth = new THREE.Shape(); cloth.moveTo(-0.29, 0.35); cloth.quadraticCurveTo(0.11, 0.25, 0.35, 0.34); cloth.lineTo(0.13, -0.36); cloth.quadraticCurveTo(-0.08, -0.2, -0.29, 0.35);
  const flap = new THREE.Mesh(new THREE.ExtrudeGeometry(cloth, { depth: 0.07, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.02, bevelSegments: 2 }), green);
  flap.position.set(0.08, 1.1, 0.91); flap.rotation.z = -0.18; body.add(flap);
  const legs = [];
  for (const x of [-0.43, 0.43]) for (const z of [-0.61, 0.55]) {
    const leg = new THREE.Group(); leg.position.set(x, 0.69, z); group.add(leg);
    ellipsoid(leg, fur, [0, -0.22, 0], [0.2, 0.42, 0.22]);
    ellipsoid(leg, dark, [0, -0.54, 0.09], [0.2, 0.16, 0.31]); legs.push(leg);
  }
  const tail = new THREE.Group(); body.add(tail);
  const tailCurve = new THREE.CatmullRomCurve3([[0, 1, -0.65], [0.25, 1.16, -1.5], [0.8, 1.66, -2.02], [1.07, 2.02, -2.02]].map(p => new THREE.Vector3(...p)));
  const tailGeometry = new THREE.TubeGeometry(tailCurve, 24, 1, 10, false);
  const attr = tailGeometry.attributes.position;
  for (let i = 0; i <= 24; i++) {
    const centre = tailCurve.getPointAt(i / 24), radius = 0.12 + Math.sin(Math.PI * i / 24) * 0.43;
    for (let j = 0; j <= 10; j++) {
      const index = i * 11 + j;
      attr.setXYZ(index, centre.x + (attr.getX(index) - centre.x) * radius,
        centre.y + (attr.getY(index) - centre.y) * radius, centre.z + (attr.getZ(index) - centre.z) * radius);
    }
  }
  tailGeometry.clearGroups(); tailGeometry.addGroup(0, 17 * 10 * 6, 0); tailGeometry.addGroup(17 * 10 * 6, 7 * 10 * 6, 1); tailGeometry.computeVertexNormals();
  const tailMesh = new THREE.Mesh(tailGeometry, [fur, cream]); tailMesh.castShadow = true; tail.add(tailMesh);
  ellipsoid(tail, cream, [1.07, 2.02, -2.02], [0.13, 0.14, 0.13]);
  group.name = 'fox';
  return { group, animate(time, moving) {
    legs.forEach((leg, i) => { leg.rotation.x = moving ? Math.sin(time * 11 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.56 : 0; });
    body.position.y = moving ? Math.abs(Math.sin(time * 11)) * 0.07 : Math.sin(time * 1.3) * 0.012;
    tail.rotation.y = Math.sin(time * (moving ? 5 : 1.1)) * (moving ? 0.14 : 0.035);
    head.rotation.z = moving ? 0 : Math.sin(time * 0.8) * 0.018;
  } };
}

export function beaver() {
  const group = new THREE.Group(), fur = paint('#a98254', 'fur'), light = paint('#c5a06f', 'fur'), dark = solid('#6c543e');
  ellipsoid(group, fur, [0, 1.02, 0], [0.82, 1.02, 0.94]);
  ellipsoid(group, light, [0, 1.04, 0.7], [0.56, 0.7, 0.21]);
  const head = new THREE.Group(); head.position.set(0, 1.87, 0.51); group.add(head);
  ellipsoid(head, fur, [0, 0, 0], [0.67, 0.59, 0.62]);
  for (const side of [-1, 1]) {
    ellipsoid(head, dark, [side * 0.53, 0.38, -0.04], [0.21, 0.22, 0.14]);
    ellipsoid(head, light, [side * 0.19, -0.16, 0.56], [0.29, 0.22, 0.26]);
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.21, 0.1), solid('#fff0cf')); tooth.position.set(side * 0.083, -0.38, 0.71); head.add(tooth);
  }
  eyes(head, 0.1, 0.51, 0.35, 0.87);
  ellipsoid(head, dark, [0, -0.05, 0.79], [0.18, 0.1, 0.1]);
  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(side * 0.7, 1.24, 0.31); group.add(arm);
    ellipsoid(arm, fur, [0, -0.28, 0.16], [0.2, 0.38, 0.22]);
    ellipsoid(arm, dark, [0, -0.5, 0.33], [0.21, 0.16, 0.22]); arms.push(arm);
    ellipsoid(group, dark, [side * 0.49, 0.12, 0.45], [0.35, 0.13, 0.49]);
  }
  ellipsoid(group, dark, [0, 0.14, -1.3], [0.64, 0.12, 1.13], [0, 0.18, 0]);
  for (let i = -2; i <= 2; i++) {
    const x = i * 0.17;
    curveTube(group, solid('#84694d'), [[x, 0.251, -0.5], [x + 0.03, 0.265, -1.2], [x + 0.1, 0.22, -2.15]], 0.014, 8);
  }
  for (let i = 0; i < 5; i++) curveTube(group, solid('#84694d'), [[-0.49, 0.24, -0.78 - i * 0.26], [0, 0.27, -0.82 - i * 0.26], [0.49, 0.24, -0.86 - i * 0.26]], 0.014, 8);
  group.name = 'beaver';
  return { group, animate(time, active) {
    head.rotation.z = Math.sin(time * 1.1) * 0.018;
    arms[1].rotation.z = active ? -0.8 + Math.sin(time * 4) * 0.18 : -0.12;
  } };
}

export function hare() {
  const group = new THREE.Group(), fur = paint('#ae8d64', 'fur'), light = paint('#d6bd95', 'fur'), tip = solid('#594f40');
  ellipsoid(group, fur, [0, 1.08, -0.12], [0.59, 0.87, 0.68]);
  ellipsoid(group, light, [0, 1.03, 0.44], [0.36, 0.62, 0.19]);
  const head = new THREE.Group(); head.position.set(0, 1.99, 0.32); group.add(head);
  ellipsoid(head, fur, [0, 0, 0], [0.47, 0.55, 0.5]);
  for (const side of [-1, 1]) {
    ellipsoid(head, light, [side * 0.14, -0.19, 0.44], [0.23, 0.19, 0.23]);
    const e = new THREE.Group(); e.position.set(side * 0.23, 0.43, -0.06); e.rotation.z = -side * 0.13; head.add(e);
    ellipsoid(e, fur, [0, 0.68, 0], [0.16, 0.83, 0.15]);
    ellipsoid(e, tip, [0, 1.27, 0.005], [0.13, 0.24, 0.13]);
    ellipsoid(e, solid('#b69379'), [0, 0.64, 0.13], [0.075, 0.57, 0.033]);
    ellipsoid(group, fur, [side * 0.45, 0.56, -0.1], [0.33, 0.46, 0.51]);
    ellipsoid(group, light, [side * 0.46, 0.14, 0.3], [0.25, 0.14, 0.62]);
    limb(group, fur, [side * 0.25, 1.1, 0.3], [side * 0.29, 0.25, 0.54], 0.11, 0.14);
  }
  eyes(head, 0.09, 0.43, 0.26, 0.76);
  ellipsoid(head, tip, [0, -0.12, 0.64], [0.09, 0.07, 0.07]);
  curveTube(head, tip, [[0, -0.2, 0.61], [0.13, -0.25, 0.52], [0.21, -0.2, 0.48]], 0.011);
  ellipsoid(group, light, [0, 0.84, -0.78], [0.2, 0.23, 0.23]);
  group.name = 'hare';
  return { group, animate(time, active) { head.rotation.z = Math.sin(time * 0.8) * 0.022 + (active ? -0.07 : 0); } };
}

// European hedgehog: low brown body, short spines and a pointed muzzle.
export function hedgehog() {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
  const fur = paint('#bba07d', 'fur'), brown = paint('#796448', 'fur'), dark = solid('#493e30');
  ellipsoid(body, brown, [0, 0.72, -0.18], [0.87, 0.72, 1.03]);
  const head = new THREE.Group(); head.position.set(0, 0.78, 0.72); body.add(head);
  ellipsoid(head, fur, [0, 0, 0], [0.48, 0.43, 0.56]);
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.79, 18), fur);
  muzzle.rotation.x = Math.PI / 2; muzzle.position.set(0, -0.11, 0.55); head.add(muzzle);
  ellipsoid(head, dark, [0, -0.1, 0.97], [0.12, 0.1, 0.1]); eyes(head, 0.1, 0.39, 0.3, 0.83);
  for (const side of [-1, 1]) {
    ellipsoid(head, brown, [side * 0.4, 0.23, -0.1], [0.16, 0.19, 0.1]);
    for (const z of [-0.55, 0.52]) ellipsoid(group, dark, [side * 0.51, 0.12, z], [0.2, 0.13, 0.29]);
  }
  const rng = seeded(907), geometry = new THREE.ConeGeometry(0.065, 0.36, 5), matrix = new THREE.Matrix4();
  const spines = new THREE.InstancedMesh(geometry, paint('#9c8965', 'fur'), 150);
  for (let i = 0; i < 150; i++) {
    const theta = rng() * Math.PI * 2, up = 0.1 + rng() * 0.88, radius = Math.sqrt(1 - up * up);
    const normal = new THREE.Vector3(Math.cos(theta) * radius, up, Math.sin(theta) * radius);
    const p = new THREE.Vector3(normal.x * 0.84, 0.71 + normal.y * 0.71, -0.26 + normal.z * 0.91);
    matrix.compose(p, new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal), new THREE.Vector3(1, 0.8 + rng() * 0.5, 1));
    spines.setMatrixAt(i, matrix);
  }
  body.add(spines); group.name = 'hedgehog';
  return { group, animate(time, active, resting = false) {
    body.position.y = (resting ? -0.12 : 0) + Math.sin(time * 0.9) * 0.012;
    head.rotation.z = active ? Math.sin(time * 0.8) * 0.035 : 0;
    head.rotation.x = resting ? 0.14 : 0;
  } };
}
