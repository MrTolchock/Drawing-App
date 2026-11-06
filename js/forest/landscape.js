import { THREE, paint, solid, ellipsoid, limb, curveTube, seeded, paintedPath, roundedBlock } from './materials.js';
import { buildProjects } from './projects.js';
import { buildHeartOak } from './heart-oak.js';
import { paintedSprite, paintedProp, paintedGround, softShadow } from './painted.js';

function flatShape(points, material, y = 0) {
  const shape = new THREE.Shape();
  points.forEach((p, i) => i ? shape.lineTo(p[0], -p[1]) : shape.moveTo(p[0], -p[1])); shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape), uv = geometry.attributes.uv;
  const tile = material.userData.paintKind === 'water' ? 10 : 18;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / tile, uv.getY(i) / tile);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; mesh.receiveShadow = true; return mesh;
}

function tree(x, z, scale, seed, type = 'oak') {
  const root = new THREE.Group(), leaves = new THREE.Group();
  root.position.set(x, 0, z); root.scale.setScalar(scale); root.add(leaves);
  leaves.add(paintedSprite(type, 11.4));
  softShadow(root, 9, 6.5, 0.26);
  return { root, leaves, radius: 4.6 * scale, centre: new THREE.Vector3(x, 4.1 * scale, z) };
}

export function buildLandscape(scene, model) {
  const ground = paintedGround(), sand = paint('#ecd3a3', 'sand'), water = paint('#83aeb5', 'water');
  const left = [[-100, -100]], right = [[100, -100]], waterLeft = [], waterRight = [];
  for (let z = -100; z <= 100; z += 2) {
    const width = model.riverHalfWidth(z), centre = model.riverX(z);
    left.push([centre - width, z]); right.push([centre + width, z]);
    waterLeft.push([centre - width, z]); waterRight.push([centre + width, z]);
  }
  left.push([-100, 100]); right.push([100, 100]);
  scene.add(flatShape(left, ground), flatShape(right, ground));
  const river = flatShape([...waterLeft, ...waterRight.reverse()], water, -0.13); scene.add(river);
  const bankMaterial = paint('#b2bd7f', 'ground');
  for (const side of [-1, 1]) {
    const outer = [], inner = [];
    for (let z = -40; z <= 40; z += 1) {
      const w = model.riverHalfWidth(z);
      outer.push([model.riverX(z) + side * (w + 0.33 + Math.sin(z * 1.8) * 0.07), z]); inner.push([model.riverX(z) + side * w, z]);
    }
    scene.add(flatShape([...outer, ...inner.reverse()], bankMaterial, 0.008));
  }
  // Broad continuous paths follow the same segments used by navigation.
  const grovePath = new THREE.Group(), hollow = new THREE.Group(); hollow.name = 'story-hollow'; scene.add(grovePath, hollow);
  for (const names of [['home', 'west', 'bend', 'brook', 'beaver', 'bridgeWest'],
    ['home', 'south', 'fordWest', 'fordEast', 'east', 'garden', 'hare', 'bridgeEast'],
    ['garden', 'mossTurn', 'mossPath', 'hedgehog'], ['hedgehog', 'hollowBend', 'hollowApproach', 'owl']]) {
    const parent = names.at(-1) === 'owl' ? hollow : names.at(-1) === 'hedgehog' ? grovePath : scene;
    parent.add(paintedPath(names.map(name => model.nodes[name])));
  }
  // The old crossing is deliberately plain and already usable.
  const causeway = new THREE.Mesh(roundedBlock(7.7, 0.2, 2.6, 0.12), paint('#b6af8f', 'stone'));
  causeway.position.set(1, -0.02, 12); causeway.receiveShadow = true; scene.add(causeway);
  const paving = roundedBlock(0.93, 0.2, 2.85, 0.15);
  for (let i = 0; i < 8; i++) {
    const slab = new THREE.Mesh(paving, paint(i % 2 ? '#c6bf9f' : '#b8b69a', 'stone'));
    slab.position.set(-2.35 + i * 0.96, 0.1, 12 + Math.sin(i * 3) * 0.05); slab.rotation.y = Math.sin(i * 5) * 0.018;
    slab.receiveShadow = true; scene.add(slab);
  }
  const stone = paint('#adae98', 'stone'), moss = paint('#a6af70');
  const rng = seeded(317);
  function rock(x, z, size = 0.65) {
    return paintedProp(scene, 'stones', x, z, size * 3.2);
  }
  [[-2.4, -13], [3.3, -11], [-1.7, -2], [3.8, 3], [-2.0, 8], [3.3, 16], [-2.7, 13.7], [4.4, 13.6], [-3.1, 10.4], [4.4, 10.3]].forEach(([x, z]) => rock(x, z, 0.5 + rng() * 0.3));
  [[-16, 2], [-10, 1.6], [11, -8.2], [13, 11], [-19, -5]].forEach(([x, z]) => rock(x, z, 0.6 + rng() * 0.25));

  const trees = [tree(-8, 2.2, 1.06, 41), tree(-20, -11, 0.8, 11), tree(-18, 12, 0.72, 17, 'beech'),
    tree(14, -13, 0.73, 7), tree(19, -1, 0.7, 37, 'beech'), tree(28, 10, 0.78, 22, 'beech'),
    tree(-5, -18, 0.67, 29, 'alder'), tree(5, -17, 0.62, 47, 'alder'),
    tree(-22, -1, 0.9, 71), tree(-17, -18, 0.85, 83), tree(23, -9, 0.9, 91), tree(-24, 19, 0.9, 79),
    tree(-17, 18, 0.78, 103), tree(14, 17, 0.9, 109)];
  trees.forEach(t => scene.add(t.root));
  // The oak anchors the meeting circle and every friendship's return scene.
  const hero=trees[0],heartOak=buildHeartOak(hero.root,hero.leaves);
  const heart=new THREE.Shape();heart.moveTo(0,.16);heart.bezierCurveTo(-.4,.62,-.76,.02,0,-.5);heart.bezierCurveTo(.76,.02,.4,.62,0,.16);

  function reeds(x, z) { return paintedProp(scene, 'reeds', x, z, 2.5); }
  [[-1.9, -10], [3, -2], [-1.4, 5], [3, 17]].forEach(p => reeds(...p));

  function shrub(x, z, size = 1) { return paintedProp(scene, 'hazel', x, z, size * 3.7); }
  [[-17, -5, 0.75], [-16, 15, 0.85], [15, -5, 0.8], [-11, -15, 0.75]].forEach(p => shrub(...p));
  for (const [x, z] of [[10, -7.3], [11.3, -4.5]]) paintedProp(scene, 'strawberry', x, z, 2.3);
  // Small, locally grouped details leave the sandy walking routes easy to see.
  for (const [x, z, size] of [[-12, 1, 1.7], [-15, 9, 1.4], [-5, -1, 1.2], [-13, -5, 1.3],
    [7, -10, 1.4], [14, -2, 1.6], [-20, 5, 1.8], [-7, 14, 1.4], [21, 12, 1.6], [14, 23, 1.5]])
    paintedProp(scene, 'grass', x, z, size);
  paintedProp(scene, 'mushrooms', -10.5, 2.1, 1.65);
  paintedProp(scene, 'log', -18, 8, 3.3);
  // A low hazel edge and Beaver's timber keep the residents' places distinct.
  for (const [x, z] of [[10.8, -9], [12.5, -7.8], [13.8, -6.3]]) shrub(x, z, 0.62);
  for (let i = 0; i < 3; i++) limb(scene, paint('#b99564', 'bark'), [-8.6, 0.25 + i * 0.2, -10.3], [-6.3, 0.3 + i * 0.2, -10.0], 0.13, 0.14);

  const restPlace = new THREE.Group(), bedding = new THREE.Group(); restPlace.name = 'hedgehog-resting-place'; bedding.name = 'hedgehog-bedding'; restPlace.position.set(21, 0, 17); scene.add(restPlace);
  ellipsoid(restPlace, moss, [0, 0.025, 0], [2.05, 0.13, 1.85]);
  restPlace.add(bedding);
  ellipsoid(bedding, paint('#b9b77d', 'leaf'), [0, 0.15, 0], [1.6, 0.25, 1.48]);
  for (let i = 0; i < 22; i++) {
    const a = i * 2.4, radius = 0.75 + (i % 3) * 0.23;
    ellipsoid(bedding, paint(['#bd9c67', '#c4ac73', '#acaa6a'][i % 3], 'leaf'),
      [Math.sin(a) * radius, 0.22 + (i % 2) * 0.03, Math.cos(a) * radius], [0.28, 0.045, 0.55], [0, a + 0.4, 0.09]);
  }
  for (const side of [-1, 1]) limb(restPlace, paint('#ac8e62', 'bark'), [side * 1.6, 0.12, -1.2], [side * 0.6, 0.14, -1.7], 0.13, 0.09);

  const hollowTree = tree(12, 25, 0.82, 63); trees.push(hollowTree); hollow.add(hollowTree.root);
  ellipsoid(hollowTree.root, paint('#735d42', 'bark'), [0.1, 2.1, 0.55], [0.53, 0.79, 0.13]);
  ellipsoid(hollowTree.root, paint('#514b36'), [0.1, 2.1, 0.66], [0.37, 0.6, 0.045]);
  ellipsoid(hollow, moss, [8.7, 0.025, 28], [3.3, 0.09, 2.7]);
  limb(hollow, paint('#b99564', 'bark'), [10.8, 0.35, 28.6], [13.6, 0.35, 28.6], 0.29, 0.27);
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.63), paint('#85996a')); book.position.set(12, 0.69, 28.6); book.rotation.y = -0.2; hollow.add(book);
  const bookLeaf = ellipsoid(hollow, paint('#e2d6aa'), [12, 0.75, 28.6], [0.13, 0.015, 0.22]); bookLeaf.rotation.y = -0.4;

  // Point along the return trail through the garden and the repaired bridge.
  const sign = new THREE.Group(); sign.position.set(5.4, 0, 21.3); sign.rotation.y = 0.55; sign.name = 'owl-trail-sign'; hollow.add(sign);
  limb(sign, paint('#b18d5b', 'bark'), [0, 0, 0], [0, 2.1, 0], 0.14, 0.11);
  const arrow = new THREE.Shape(); arrow.moveTo(-1.25, -0.37); arrow.lineTo(0.68, -0.37); arrow.lineTo(1.34, 0); arrow.lineTo(0.68, 0.37); arrow.lineTo(-1.25, 0.37); arrow.closePath();
  const signGeometry = new THREE.ExtrudeGeometry(arrow, { depth: 0.18, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.025, bevelSegments: 1 });
  const signMaterial = paint('#d9bd86', 'bark');
  const brokenSign = new THREE.Mesh(signGeometry, signMaterial); brokenSign.position.set(0.5, 0.26, 0.45); brokenSign.rotation.z = -0.25; sign.add(brokenSign);
  const restoredSign = new THREE.Group(); restoredSign.name = 'owl-picture-sign'; restoredSign.position.y = 1.85; sign.add(restoredSign);
  const signBoard = new THREE.Mesh(signGeometry, signMaterial); signBoard.castShadow = true; restoredSign.add(signBoard);
  for (const side of [-1, 1]) {
    const heartLabel = new THREE.Mesh(new THREE.ShapeGeometry(heart), paint('#71894c')); heartLabel.scale.setScalar(0.47);
    heartLabel.position.set(-0.35, 0, side > 0 ? 0.215 : -0.035); if (side < 0) heartLabel.rotation.y = Math.PI; restoredSign.add(heartLabel);
  }

  const bridge = new THREE.Group(); bridge.position.set(0.6, 0, -7); scene.add(bridge);
  const wood = paint('#b38a52', 'bark'), deckMaterial = paint('#d5b27a', 'bark'), middle = [], plankShape = roundedBlock(0.53, 0.16, 3.05, 0.065);
  for (let i = 0; i < 12; i++) {
    const plank = new THREE.Mesh(plankShape, deckMaterial);
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
  const projects = buildProjects(scene, model, { flatShape, tree, reeds }); trees.push(...projects.trees);
  return {
    trees,
    hero: trees[0].root,
    setProjects(state,displayGrowth,previewState=null) {
      projects.set(previewState||state);
      heartOak.setGrowth(window.FK.heartTree.count(state),displayGrowth);
    },
    setGrove(unlocked, complete) { grovePath.visible = unlocked; restPlace.visible = unlocked; bedding.visible = complete; },
    setHollow(unlocked, complete) { hollow.visible = unlocked; brokenSign.visible = !complete; restoredSign.visible = complete; },
    setBridge(repaired, progress = 1) {
      middle.forEach((mesh, i) => {
        mesh.visible = repaired;
        if (i < 4) mesh.position.y = 0.31 + (1 - Math.min(1, Math.max(0, progress * 1.6 - i * 0.14))) * 1.25;
      });
    },
    height(x, z, repaired) {
      const projectHeight = projects.height(x, z); if (projectHeight !== null) return projectHeight;
      if (repaired && x > -2.85 && x < 4.05 && Math.abs(z + 7) < 1.55) return 0.42;
      if (x > -2.85 && x < 4.85 && Math.abs(z - 12) < 1.55) return 0.21;
      return 0.06;
    },
    animate(time) { heartOak.update(time); ripples.forEach((r, i) => { r.material.opacity = 0.18 + Math.sin(time * 0.7 + i) * 0.04; }); },
  };
}
