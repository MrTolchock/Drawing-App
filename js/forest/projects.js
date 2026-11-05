import { THREE, paint, ellipsoid, limb, curveTube } from './materials.js';

// Lasting story effects, kept separate from navigation and puzzle state.
export function buildProjects(scene, model, helpers) {
  const { flatShape, tree, reeds } = helpers, sand = paint('#e8ce99', 'sand');
  const world = new THREE.Group(); world.name = 'reed-pond'; scene.add(world);
  function ribbon(parent, points, width = 1.45) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, 0, p.z)), false, 'catmullrom', 0.1);
    const samples = curve.getPoints(130), left = [], right = [];
    samples.forEach((p, i) => {
      const a = samples[Math.max(0, i - 1)], b = samples[Math.min(samples.length - 1, i + 1)], length = Math.hypot(b.x - a.x, b.z - a.z) || 1;
      const x = -(b.z - a.z) / length * width, z = (b.x - a.x) / length * width;
      left.push([p.x + x, p.z + z]); right.push([p.x - x, p.z - z]);
    });
    parent.add(flatShape([...left, ...right.reverse()], sand, 0.04));
  }
  ribbon(world, ['owl', 'pondEast', 'pondWest', 'kingfisher', 'reeds', 'reedReturn', 'reedBend', 'bend'].map(id => model.nodes[id]));
  const ford = new THREE.Group(); ford.position.z = 29; world.add(ford);
  const causeway = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.22, 2.9), paint('#b7b59a', 'stone')); causeway.position.set(0.5, -0.02, 0); causeway.receiveShadow = true; ford.add(causeway);
  for (let i = 0; i < 9; i++) ellipsoid(ford, paint(i % 2 ? '#c6c5aa' : '#b5b59c', 'stone'), [-4.3 + i * 1.2, 0.14, 0], [0.72, 0.09, 1.2]);
  const pondTree = tree(-16, 27.5, 0.67, 97, 'alder'); world.add(pondTree.root);
  for (const [z, side] of [[19, -1], [21, 1], [27.5, -1], [31, 1]]) reeds(model.riverX(z) + side * (model.riverHalfWidth(z) + 0.25), z);
  const perch = new THREE.Group(); perch.position.set(-6.4, 0, 25.4); world.add(perch);
  limb(perch, paint('#ad926b', 'bark'), [-0.1, 0, 0], [0, 0.56, 0], 0.16, 0.13);
  limb(perch, paint('#b79c70', 'bark'), [-0.9, 0.5, 0], [0.9, 0.5, -0.1], 0.1, 0.08);
  const deck = new THREE.Group(); deck.name = 'water-view-deck'; world.add(deck);
  for (let i = 0; i < 6; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.42), paint('#ceb383', 'bark')); plank.position.set(-7.2, 0.08, 24 + i * 0.46); plank.receiveShadow = true; deck.add(plank);
  }
  const tangle = new THREE.Group(); world.add(tangle);
  for (let i = 0; i < 3; i++) limb(tangle, paint('#b3a17c', 'bark'), [-8.1 + i * 0.3, 0.2, 24.2], [-6.7 - i * 0.2, 0.3 + i * 0.08, 25.6], 0.09, 0.07);

  const gardenPath = new THREE.Group(); gardenPath.name = 'garden-shortcut'; scene.add(gardenPath);
  ribbon(gardenPath, [model.nodes.garden, model.nodes.hedgehog], 1.15);
  const bough = new THREE.Group(); bough.position.set(14, 0, 6); scene.add(bough);
  limb(bough, paint('#b89b6e', 'bark'), [-1, 0.2, 0], [0.9, 0.25, 0.1], 0.08, 0.04);
  for (const x of [-0.65, 0, 0.65]) ellipsoid(bough, paint('#a6b583'), [x, 0.3, 0.15], [0.48, 0.3, 0.48]);

  const shared = new THREE.Group(); shared.name = 'waterside-story-link'; scene.add(shared);
  const start = model.nodes.kingfisher, end = model.nodes.owl, length = model.distance(start, end), yaw = -Math.atan2(end.z - start.z, end.x - start.x);
  const span = new THREE.Group(); span.position.set((start.x + end.x) / 2, 0, (start.z + end.z) / 2); span.rotation.y = yaw; shared.add(span);
  for (let i = 0; i < 28; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(length / 28 - 0.03, 0.13, 2.45), paint('#d1b581', 'bark')); plank.position.set(-length / 2 + (i + 0.5) * length / 28, 0.23, 0); plank.receiveShadow = true; span.add(plank);
  }
  for (const z of [-1.27, 1.27]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.12, 0.12), paint('#ad8f60', 'bark')); rail.position.set(0, 0.82, z); span.add(rail);
    for (const x of [-length / 2 + 0.2, length / 2 - 0.2]) limb(span, paint('#ad8f60', 'bark'), [x, 0.1, z], [x, 0.98, z], 0.09, 0.08);
  }
  limb(shared, paint('#b69969', 'bark'), [-8.2, 0.4, 21.8], [-5.5, 0.4, 21.8], 0.28, 0.26);
  const storyBook = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.6), paint('#84996b')); storyBook.position.set(-6.8, 0.71, 21.8); shared.add(storyBook);

  const clearing = new THREE.Group(); clearing.name = 'restored-meeting-clearing'; scene.add(clearing);
  const clearingFloor = ellipsoid(clearing, paint('#e6dfb9', 'ground'), [-8, -0.035, 8.5], [6.3, 0.06, 4.7]); clearingFloor.receiveShadow = true;
  for (const [x, z] of [[-13, 7], [-12.8, 11], [-8.5, 13], [-3, 10], [-3.5, 5]]) ellipsoid(clearing, paint('#c2c3a2', 'stone'), [x, 0.07, z], [0.35, 0.09, 0.3]);
  const seating = new THREE.Group(); seating.name = 'shared-seating'; scene.add(seating);
  for (const x of [-13.4, -10.6]) for (const z of [12.1, 12.8]) limb(seating, paint('#ae8e60', 'bark'), [x, 0, z], [x, 0.62, z], 0.13, 0.1);
  for (let i = 0; i < 3; i++) { const plank = new THREE.Mesh(new THREE.BoxGeometry(4, 0.16, 0.29), paint('#d1b781', 'bark')); plank.position.set(-12, 0.62, 12.1 + i * 0.3); seating.add(plank); }
  for (const [x, z] of [[-5.7, 8.5], [-3.8, 8.3], [-6.1, 5.4]]) {
    ellipsoid(seating, paint('#aab47b'), [x, 0.07, z], [0.85, 0.12, 0.8]);
    for (let i = 0; i < 5; i++) ellipsoid(seating, paint('#c4b583', 'leaf'), [x + Math.sin(i * 1.3) * 0.45, 0.17, z + Math.cos(i * 1.3) * 0.4], [0.2, 0.035, 0.4], [0, i * 1.3, 0]);
  }
  limb(seating, paint('#b49a70', 'bark'), [-6.3, 0.05, 5.1], [-6.3, 0.55, 5.1], 0.12, 0.09);
  limb(seating, paint('#bea274', 'bark'), [-7, 0.54, 5.1], [-5.6, 0.54, 5.1], 0.08, 0.07);
  const invitation = new THREE.Group(); invitation.name = 'picture-invitations'; scene.add(invitation);
  curveTube(invitation, paint('#a9a17b'), [[-10.5, 3.5, 3.5], [-8, 3.1, 3.9], [-5.5, 3.5, 3.5]], 0.025);
  for (let i = 0; i < 5; i++) {
    const shape = new THREE.Shape(); shape.moveTo(-0.24, 0.2); shape.lineTo(0.24, 0.2); shape.lineTo(0.15, -0.35); shape.lineTo(0, -0.24); shape.lineTo(-0.15, -0.35); shape.closePath();
    const material = paint(i % 2 ? '#a3b57b' : '#e5d6a4').clone(); material.side = THREE.DoubleSide;
    const flag = new THREE.Mesh(new THREE.ShapeGeometry(shape), material); flag.position.set(-9.7 + i * 0.85, 3.05 + Math.abs(i - 2) * 0.06, 3.8); invitation.add(flag);
  }
  const roots = new THREE.Group(), leaves = new THREE.Group(), canopy = new THREE.Group(); roots.name = 'heart-tree-roots'; leaves.name = 'heart-tree-branches'; canopy.name = 'heart-tree-awake'; scene.add(roots, leaves, canopy);
  const light = new THREE.MeshStandardMaterial({ color: '#d1bb77', emissive: '#bda65d', emissiveIntensity: 0.3, roughness: 1 });
  for (const [x, z] of [[-10, 3.5], [-6, 3.5], [-9.3, 0.8], [-7, 0.7]]) curveTube(roots, light, [[-8, 0.19, 2.2], [(x - 8) / 2, 0.16, (z + 2.2) / 2], [x, 0.12, z]], 0.055);
  for (let i = 0; i < 7; i++) ellipsoid(leaves, paint('#adbc70', 'leaf'), [-9.8 + (i % 3) * 1.6, 5.5 + i % 2, 2.5 + Math.floor(i / 3) * 0.7], [0.42, 0.15, 0.65], [0.2, i, 0.2]);
  for (const [x, y, z] of [[-9.2, 8.2, 1.5], [-7.2, 8.8, 1.6], [-8.4, 7.6, 3.8]]) ellipsoid(canopy, paint('#c3c77e', 'leaf'), [x, y, z], [1.15, 0.62, 1.05]);
  return { trees: [pondTree], set(state) {
    const c = state.contributions, unlocked = state.bridgeRepaired && state.greetingSeen;
    world.visible = unlocked; deck.visible = c[model.WATER] === true; tangle.visible = !deck.visible;
    gardenPath.visible = c[model.GARDEN] === true; bough.position.set(gardenPath.visible ? 16 : 14, 0, gardenPath.visible ? 4.5 : 6);
    shared.visible = c[model.STORIES] === true; clearing.visible = c[model.CLEARING] === true; seating.visible = c[model.SEATING] === true; invitation.visible = c[model.INVITE] === true;
    roots.visible = FKChapter('meet', c); leaves.visible = FKChapter('reconnect', c); canopy.visible = state.endingUnlocked || state.endingSeen;
  }, height(x, z) {
    if (x > -5.25 && x < 6.25 && Math.abs(z - 29) < 1.5) return 0.25;
    if (model.isComplete(model.STORIES)) {
      const dx = end.x - start.x, dz = end.z - start.z, t = ((x - start.x) * dx + (z - start.z) * dz) / (dx * dx + dz * dz);
      if (t >= 0 && t <= 1 && Math.hypot(x - start.x - t * dx, z - start.z - t * dz) < 1.23) return 0.34;
    }
    return null;
  } };
  function FKChapter(chapter, contributions) { return window.FK.forestStory.chapters[chapter].every(id => contributions[id] === true); }
}
