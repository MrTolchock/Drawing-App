import { THREE, paint, solid, ellipsoid, limb, curveTube, seeded } from './materials.js';

function flatShape(points, material, y = 0) {
  const shape = new THREE.Shape();
  points.forEach((p, i) => i ? shape.lineTo(p[0], -p[1]) : shape.moveTo(p[0], -p[1])); shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), material);
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; mesh.receiveShadow = true; return mesh;
}

function tree(x, z, scale, seed, type = 'oak') {
  const rng = seeded(seed), root = new THREE.Group(); root.position.set(x, 0, z); root.scale.setScalar(scale);
  const bark = paint(type === 'beech' ? '#a49b7f' : '#b38a57', 'bark');
  const leaves = new THREE.Group(); root.add(leaves);
  curveTube(root, bark, [[0, -0.1, 0], [-0.16, 2, 0.08], [0.12, 4.3, -0.1], [0.15, 6.8, -0.2]], 0.52);
  limb(root, bark, [0, 0.1, 0], [-0.1, 4.5, 0.05], 0.8, 0.39);
  for (const [a, b] of [
    [[0, 2.9, 0], [-2.2, 6, 0.4]], [[0, 3.7, 0], [2.3, 6.5, 0.15]],
    [[0, 4.3, -0.1], [-1.3, 7.1, -1.7]], [[0, 4.5, 0], [1.0, 7, 1.7]],
  ]) limb(root, bark, a, b, 0.32, 0.11);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    curveTube(root, bark, [[Math.sin(a) * 1.7, 0.03, Math.cos(a) * 1.7], [Math.sin(a) * 0.9, 0.25, Math.cos(a) * 0.9], [0, 1.35, 0]], 0.15);
  }
  const centres = [[0, 7.5, 0], [-2.1, 6.3, 0.3], [2.1, 6.7, 0.1], [-1.3, 7.2, -1.6], [1.2, 7.8, -1.3], [0.4, 6.7, 1.8]];
  const palette = type === 'alder' ? ['#819763', '#718959', '#9da974'] : ['#93a34c', '#7b9345', '#a9b35e'];
  const geometry = new THREE.SphereGeometry(1, 16, 12), matrix = new THREE.Matrix4(), quat = new THREE.Quaternion();
  for (let color = 0; color < 3; color++) {
    const material = paint(palette[color], 'leaf').clone(); material.transparent = true;
    const mesh = new THREE.InstancedMesh(geometry, material, centres.length);
    centres.forEach(([cx, cy, cz], index) => {
      const radius = 1.3 + rng() * 0.56;
      matrix.compose(new THREE.Vector3(cx + (rng() - 0.5) * 1.75, cy + (rng() - 0.5) * 1.0, cz + (rng() - 0.5) * 1.55),
        quat, new THREE.Vector3(radius * (1.05 + rng() * 0.3), radius * 0.72, radius));
      mesh.setMatrixAt(index, matrix);
    });
    mesh.castShadow = mesh.receiveShadow = true; leaves.add(mesh);
  }
  if (type === 'oak') {
    const leaf = new THREE.Shape(); leaf.moveTo(0, -0.6);
    leaf.bezierCurveTo(-0.12, -0.38, -0.45, -0.48, -0.26, -0.25);
    leaf.bezierCurveTo(-0.62, -0.23, -0.54, 0.02, -0.27, -0.02);
    leaf.bezierCurveTo(-0.6, 0.16, -0.44, 0.38, -0.2, 0.2);
    leaf.bezierCurveTo(-0.33, 0.56, -0.04, 0.58, 0, 0.37);
    leaf.bezierCurveTo(0.08, 0.76, 0.35, 0.59, 0.2, 0.25);
    leaf.bezierCurveTo(0.54, 0.4, 0.63, 0.12, 0.29, 0.02);
    leaf.bezierCurveTo(0.6, -0.05, 0.54, -0.32, 0.25, -0.25);
    leaf.bezierCurveTo(0.41, -0.5, 0.1, -0.4, 0, -0.6);
    const leafMaterial = paint('#b0b969', 'leaf').clone(); leafMaterial.side = THREE.DoubleSide; leafMaterial.transparent = true;
    const accents = new THREE.InstancedMesh(new THREE.ShapeGeometry(leaf, 5), leafMaterial, centres.length * 3);
    centres.forEach(([cx, cy, cz], i) => {
      for (let j = 0; j < 3; j++) {
        const size = 0.6 + rng() * 0.3;
        quat.setFromEuler(new THREE.Euler(-0.7, (rng() - 0.5) * 0.6, (rng() - 0.5) * 1.5));
        matrix.compose(new THREE.Vector3(cx + (j - 1) * 0.6, cy + 0.65 + rng() * 0.45, cz + 1.15), quat, new THREE.Vector3(size, size, size));
        accents.setMatrixAt(i * 3 + j, matrix);
      }
    });
    accents.castShadow = false; leaves.add(accents);
  }
  return { root, leaves, radius: 4.1 * scale, centre: new THREE.Vector3(x, 6.5 * scale, z) };
}

export function buildLandscape(scene, model) {
  const ground = paint('#dce0af', 'ground'), sand = paint('#e8ce99', 'sand'), water = paint('#8fb8bd', 'water');
  const left = [[-100, -100]], right = [[100, -100]], waterLeft = [], waterRight = [];
  for (let z = -100; z <= 100; z += 2) {
    const width = 1.75 + Math.sin(z * 0.21) * 0.15, centre = model.riverX(z);
    left.push([centre - width, z]); right.push([centre + width, z]);
    waterLeft.push([centre - width, z]); waterRight.push([centre + width, z]);
  }
  left.push([-100, 100]); right.push([100, 100]);
  scene.add(flatShape(left, ground), flatShape(right, ground));
  const river = flatShape([...waterLeft, ...waterRight.reverse()], water, -0.13); scene.add(river);
  const bankMaterial = paint('#bac6a2');
  for (const side of [-1, 1]) {
    const outer = [], inner = [];
    for (let z = -40; z <= 40; z += 1) {
      const w = 1.75 + Math.sin(z * 0.21) * 0.15;
      outer.push([model.riverX(z) + side * (w + 0.19), z]); inner.push([model.riverX(z) + side * w, z]);
    }
    scene.add(flatShape([...outer, ...inner.reverse()], bankMaterial, 0.008));
  }
  const wash = [paint('#d6dca6'), paint('#e4e5bb'), paint('#cfd8a3')];
  for (const [i, p] of [[-9, 0, 5, 4], [-16, -8, 5, 4], [12, -6, 4, 4], [15, 7, 5, 4], [-18, 10, 4, 5], [8, -14, 4, 4], [-7, -15, 4, 3], [10, 15, 6, 3]].entries()) {
    const mesh = ellipsoid(scene, wash[i % wash.length], [p[0], -0.075, p[1]], [p[2], 0.09, p[3]]); mesh.castShadow = false;
  }
  // Broad continuous paths follow the same segments used by navigation.
  const grovePath = new THREE.Group(); scene.add(grovePath);
  for (const names of [['home', 'west', 'bend', 'brook', 'beaver', 'bridgeWest'],
    ['home', 'south', 'fordWest', 'fordEast', 'east', 'garden', 'hare', 'bridgeEast'],
    ['garden', 'mossTurn', 'mossPath', 'hedgehog']]) {
    const parent = names.at(-1) === 'hedgehog' ? grovePath : scene;
    const curve = new THREE.CatmullRomCurve3(names.map(name => new THREE.Vector3(model.nodes[name].x, 0, model.nodes[name].z)), false, 'catmullrom', 0.18);
    const points = curve.getPoints(140), l = [], r = [];
    points.forEach((p, i) => {
      const before = points[Math.max(0, i - 1)], after = points[Math.min(points.length - 1, i + 1)], dx = after.x - before.x, dz = after.z - before.z;
      const length = Math.hypot(dx, dz), nx = -dz / length * 1.45, nz = dx / length * 1.45;
      l.push([p.x + nx, p.z + nz]); r.push([p.x - nx, p.z - nz]);
    });
    parent.add(flatShape([...l, ...r.reverse()], sand, 0.035));
    for (const name of [names[0], names.at(-1)]) {
      const p = model.nodes[name], cap = ellipsoid(parent, sand, [p.x, 0.03, p.z], [1.45, 0.035, 1.45]); cap.castShadow = false;
    }
  }
  // The old crossing is deliberately plain and already usable.
  const causeway = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.32, 3.0), paint('#b6af8f', 'stone'));
  causeway.position.set(1, -0.02, 12); causeway.receiveShadow = true; scene.add(causeway);
  const crossingTop = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.055, 2.88), sand); crossingTop.position.set(1, 0.165, 12); crossingTop.receiveShadow = true; scene.add(crossingTop);
  const stone = paint('#adae98', 'stone'), moss = paint('#a6af70');
  const rng = seeded(317);
  function rock(x, z, size = 0.65) {
    const base = ellipsoid(scene, stone, [x, size * 0.33, z], [size, size * 0.47, size * 0.76], [0, rng() * 3, -0.12]);
    if (rng() > 0.5) ellipsoid(scene, moss, [x + size * 0.13, size * 0.7, z - 0.05], [size * 0.51, size * 0.12, size * 0.45]);
    return base;
  }
  [[-2.4, -13], [3.3, -11], [-1.7, -2], [3.8, 3], [-2.0, 8], [3.3, 16], [-2.7, 13.7], [4.4, 13.6], [-3.1, 10.4], [4.4, 10.3]].forEach(([x, z]) => rock(x, z, 0.5 + rng() * 0.3));
  [[-16, 2], [-10, 1.6], [11, -8.2], [13, 11], [-19, -5]].forEach(([x, z]) => rock(x, z, 0.6 + rng() * 0.25));

  const trees = [tree(-8, 2.2, 1.06, 41), tree(-20, -11, 0.8, 11), tree(-18, 12, 0.72, 17, 'beech'),
    tree(14, -13, 0.73, 7), tree(19, -1, 0.7, 37, 'beech'), tree(25, 11, 0.78, 22, 'beech'),
    tree(-5, -18, 0.57, 29, 'alder'), tree(5, -17, 0.52, 47, 'alder')];
  trees.forEach(t => scene.add(t.root));
  const heart = new THREE.Shape(); heart.moveTo(0, 0.16); heart.bezierCurveTo(-0.4, 0.62, -0.76, 0.02, 0, -0.5); heart.bezierCurveTo(0.76, 0.02, 0.4, 0.62, 0, 0.16);
  const heartMaterial = new THREE.MeshStandardMaterial({ color: '#ad804a', roughness: 1, emissive: '#ad804a', emissiveIntensity: 0 });
  const heartMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(heart, { depth: 0.035, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.025, bevelSegments: 2 }), heartMaterial);
  heartMesh.position.set(-7.96, 2.5, 2.85); heartMesh.rotation.y = 0.2; scene.add(heartMesh);

  function reeds(x, z) {
    const stem = paint('#82945b'), tip = solid('#897344');
    for (let i = 0; i < 5; i++) {
      const px = x + (rng() - 0.5) * 0.9, pz = z + (rng() - 0.5) * 0.7, height = 0.6 + rng() * 1.0;
      limb(scene, stem, [px, 0.02, pz], [px + 0.11, height, pz], 0.035, 0.022);
      if (i % 2) ellipsoid(scene, tip, [px + 0.11, height + 0.13, pz], [0.06, 0.23, 0.06]);
      else ellipsoid(scene, stem, [px + 0.13, height * 0.45, pz], [0.08, height * 0.6, 0.035], [0, 0, -0.24]);
    }
  }
  [[-1.9, -10], [3, -2], [-1.4, 5], [3, 17]].forEach(p => reeds(...p));

  function shrub(x, z, size = 1) {
    for (let i = 0; i < 3; i++) ellipsoid(scene, paint(['#a2b477', '#b4be84', '#91a76f'][i]), [x + (i - 1) * size * 0.45, 0.3 * size, z + (i % 2) * 0.3], [size * 0.58, size * 0.48, size * 0.58]);
  }
  [[-17, -5, 0.75], [-16, 15, 0.85], [15, -5, 0.8], [14, 6, 0.8], [-11, -15, 0.75]].forEach(p => shrub(...p));
  for (const [x, z] of [[10, -7.3], [11.3, -4.5]]) {
    shrub(x, z, 0.42);
    for (let i = 0; i < 3; i++) {
      ellipsoid(scene, solid('#bb6543'), [x + (i - 1) * 0.24, 0.19, z + 0.25], [0.12, 0.16, 0.12]);
      const centre = new THREE.Vector3(x + (i - 1) * 0.3, 0.51, z - 0.15);
      for (let j = 0; j < 5; j++) ellipsoid(scene, solid('#fff6d9'), [centre.x + Math.sin(j * 1.257) * 0.1, centre.y, centre.z + Math.cos(j * 1.257) * 0.1], [0.075, 0.025, 0.075]);
      ellipsoid(scene, solid('#d2ae55'), centre.toArray(), [0.045, 0.035, 0.045]);
    }
  }
  // A low hazel edge and Beaver's timber keep the residents' places distinct.
  for (const [x, z] of [[10.8, -9], [12.5, -7.8], [13.8, -6.3]]) shrub(x, z, 0.62);
  for (let i = 0; i < 3; i++) limb(scene, paint('#b99564', 'bark'), [-8.6, 0.25 + i * 0.2, -10.3], [-6.3, 0.3 + i * 0.2, -10.0], 0.13, 0.14);

  const restPlace = new THREE.Group(), bedding = new THREE.Group(); restPlace.position.set(21, 0, 17); scene.add(restPlace);
  ellipsoid(restPlace, moss, [0, 0.025, 0], [2.05, 0.13, 1.85]);
  restPlace.add(bedding);
  ellipsoid(bedding, paint('#b9b77d', 'leaf'), [0, 0.15, 0], [1.6, 0.25, 1.48]);
  for (let i = 0; i < 22; i++) {
    const a = i * 2.4, radius = 0.75 + (i % 3) * 0.23;
    ellipsoid(bedding, paint(['#bd9c67', '#c4ac73', '#acaa6a'][i % 3], 'leaf'),
      [Math.sin(a) * radius, 0.22 + (i % 2) * 0.03, Math.cos(a) * radius], [0.28, 0.045, 0.55], [0, a + 0.4, 0.09]);
  }
  for (const side of [-1, 1]) limb(restPlace, paint('#ac8e62', 'bark'), [side * 1.6, 0.12, -1.2], [side * 0.6, 0.14, -1.7], 0.13, 0.09);

  const bridge = new THREE.Group(); bridge.position.set(0.6, 0, -7); scene.add(bridge);
  const wood = paint('#c9a06a', 'bark'), deckMaterial = paint('#dec08a', 'bark'), middle = [];
  for (let i = 0; i < 12; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 3.05), deckMaterial);
    plank.position.set(-3.15 + i * 0.57, 0.31 + Math.sin(i * 3) * 0.012, 0); plank.castShadow = plank.receiveShadow = true; bridge.add(plank);
    if (i >= 4 && i <= 7) middle.push(plank);
  }
  for (const side of [-1, 1]) {
    for (const x of [-3.35, 3.35]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 1.22, 10), wood);
      post.position.set(x, 0.61, side * 1.52); post.castShadow = true; bridge.add(post);
      ellipsoid(bridge, deckMaterial, [x, 1.24, side * 1.52], [0.2, 0.08, 0.2]);
    }
    for (const x of [-2.3, 2.3]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.17, 0.13), wood); rail.position.set(x, 0.94, side * 1.52); bridge.add(rail);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.17, 0.13), wood); rail.position.set(0, 0.94, side * 1.52); bridge.add(rail); middle.push(rail);
  }
  const ripples = [];
  for (const z of [-16, -3, 3, 17]) {
    const rippleMaterial = new THREE.MeshBasicMaterial({ color: '#d7e5d9', transparent: true, opacity: 0.26, depthWrite: false });
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.44, 32), rippleMaterial);
    ripple.rotation.x = -Math.PI / 2; ripple.position.set(model.riverX(z), -0.115, z); ripple.scale.set(1, 1.7, 1); scene.add(ripple); ripples.push(ripple);
  }
  return {
    trees,
    setGrove(unlocked, complete) { grovePath.visible = unlocked; restPlace.visible = unlocked; bedding.visible = complete; },
    setBridge(repaired, progress = 1) {
      middle.forEach((mesh, i) => {
        mesh.visible = repaired;
        if (i < 4) mesh.position.y = 0.31 + (1 - Math.min(1, Math.max(0, progress * 1.6 - i * 0.14))) * 1.25;
      });
      heartMaterial.color.set(repaired ? '#d2ad60' : '#ad804a');
      heartMaterial.emissive.set(repaired ? '#d2a95b' : '#ad804a'); heartMaterial.emissiveIntensity = repaired ? 0.23 : 0;
    },
    height(x, z, repaired) {
      if (repaired && x > -2.85 && x < 4.05 && Math.abs(z + 7) < 1.55) return 0.42;
      if (x > -2.85 && x < 4.85 && Math.abs(z - 12) < 1.55) return 0.21;
      return 0.06;
    },
    animate(time) { ripples.forEach((r, i) => { r.material.opacity = 0.18 + Math.sin(time * 0.7 + i) * 0.04; }); },
  };
}
