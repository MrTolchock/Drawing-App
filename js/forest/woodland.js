/* Solid woodland scenery. Instances keep the richer forest affordable on phones. */
import { THREE, paint, ellipsoid, limb, seeded, paintedPath } from './materials.js';
import { WORLD, PLACES, terrainHeight } from './navigation.js';

const foliageGeometry = new THREE.SphereGeometry(1, 10, 7), trunkGeometry = new THREE.CylinderGeometry(0.72, 1, 1, 9);
const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
export function woodlandTree(x, z, scale, seed, type = 'oak') {
  const random = seeded(seed), root = new THREE.Group(), sway = new THREE.Group(), leaves = new THREE.Group();
  root.name = 'woodland-' + type; root.position.set(x, terrainHeight(x, z), z); root.scale.setScalar(scale);
  const bark = paint(type === 'beech' ? '#aaa58c' : '#8f7652', 'bark');
  limb(root, bark, [0, 0, 0], [0.06, 2.7, 0], 0.49, 0.34);
  sway.position.y = 2.5; root.add(sway); sway.add(leaves);
  const branches = new THREE.InstancedMesh(trunkGeometry, bark, 5);
  for (let i = 0; i < 5; i++) {
    const a = i * 2.4 + seed, start = new THREE.Vector3(0, i ? 0.8 + i * 0.35 : 0, 0);
    const end = i ? new THREE.Vector3(Math.sin(a) * 2.3, 3.2 + random() * 1.8, Math.cos(a) * 1.9) : new THREE.Vector3(0.18, 4.3, 0);
    matrix.compose(start.clone().add(end).multiplyScalar(0.5), quaternion.setFromUnitVectors(up, end.clone().sub(start).normalize()), new THREE.Vector3(i ? 0.15 : 0.3, start.distanceTo(end), i ? 0.15 : 0.3));
    branches.setMatrixAt(i, matrix);
  }
  branches.castShadow = true; branches.receiveShadow = true; sway.add(branches);
  const leafMaterial = paint(type === 'alder' ? '#6d9870' : type === 'beech' ? '#8aab61' : '#7c9d59', 'leaf').clone();
  leafMaterial.transparent = true;
  const canopy = new THREE.InstancedMesh(foliageGeometry, leafMaterial, 16); canopy.name = 'volumetric-canopy';
  for (let i = 0; i < 16; i++) {
    const a = i * 2.4, r = i < 5 ? 0.9 : 2.25, size = i < 5 ? 1.8 : 1.2;
    const p = new THREE.Vector3(Math.sin(a) * r, 4.3 + Math.cos(i * 1.7) * 1.2, Math.cos(a) * r * 0.8);
    quaternion.setFromEuler(new THREE.Euler(random(), random(), random()));
    matrix.compose(p, quaternion, new THREE.Vector3(size, size * (0.75 + random() * 0.3), size * 0.95)); canopy.setMatrixAt(i, matrix);
    canopy.setColorAt(i, new THREE.Color().setHSL(0.2 + random() * 0.04, 0.12, 0.7 + random() * 0.29));
  }
  canopy.castShadow = true; canopy.receiveShadow = true; leaves.add(canopy);
  return { root, leaves, sway, radius: 3.8 * scale, centre: new THREE.Vector3(x, root.position.y + 6.6 * scale, z), seed,
    animate(time) { const t = window.FK.reduced ? 0 : time; sway.rotation.z = t ? Math.sin(t * 0.7 + seed) * 0.018 + Math.sin(t * 0.29 + x * 0.1) * 0.012 : 0; sway.rotation.x = t ? Math.sin(t * 0.6 + z * 0.2) * 0.009 : 0; leaves.rotation.y = t ? Math.sin(t * 0.5 + seed) * 0.015 : 0; },
  };
}

export function buildTerrain(scene, model) {
  const geometry = new THREE.PlaneGeometry(180, 180, 180, 180); geometry.rotateX(-Math.PI / 2);
  const p = geometry.attributes.position, uv = geometry.attributes.uv, colors = [], color = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), bank = Math.abs(x - model.riverX(z)) - model.riverHalfWidth(z);
    const y = terrainHeight(x, z) - 0.72 * Math.max(0, Math.min(1, -bank / 0.85)); p.setY(i, y);
    uv.setXY(i, x / 14, z / 14);
    const patch = Math.sin(x * 0.15 + Math.sin(z * 0.2)) * Math.cos(z * 0.19) * 0.035;
    color.setHSL(0.21 + patch, 0.22 + Math.min(4, y) * 0.018, bank < 0.6 ? 0.54 : 0.67 - Math.min(5, y) * 0.017);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ map: paint('#dee1b2', 'ground').map, vertexColors: true, roughness: 1 });
  const mesh = new THREE.Mesh(geometry, material); mesh.name = 'woodland-terrain'; mesh.receiveShadow = true; scene.add(mesh); return mesh;
}

export function buildWilderness(scene, model, trees, obstacles) {
  const group = new THREE.Group(); group.name = 'explorable-woodland'; scene.add(group);
  const random = seeded(82363), windTime = { value: 0 }, butterflies = [], waterFoam = [], fish = [], clouds = [], mushrooms=[];
  const bark = paint('#95754c', 'bark'), stone = paint('#999e8b', 'stone'), moss = paint('#879b58', 'leaf');
  const paths = [
    [model.nodes.bend, { x: -22, z: -3 }, PLACES[0]],
    [model.nodes.west, { x: -24, z: 9 }, PLACES[1]],
    [model.nodes.hare, { x: 18, z: -10 }, PLACES[2]],
    [model.nodes.brook, { x: -8, z: -16 }, PLACES[3]],
    [model.nodes.reeds, { x: -9, z: 31 }, PLACES[4]],
    [model.nodes.hedgehog, { x: 27, z: 23 }, PLACES[5]],
  ];
  for (const points of paths) {
    const path = paintedPath(points, 0.85); path.name = 'exploration-trail'; const positions = path.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) positions.setY(i, terrainHeight(positions.getX(i), positions.getZ(i)) + 0.045);
    path.geometry.computeVertexNormals(); group.add(path);
  }
  const treePoints = [];
  for (let i = 0; i < 95; i++) {
    const x = WORLD.minX + 2 + random() * 72, z = WORLD.minZ + 2 + random() * 66;
    if (Math.abs(x - model.riverX(z)) < model.riverHalfWidth(z) + 2.7) continue;
    if (x > -16 && x < 16 && z > -17 && z < 16) continue;
    if (PLACES.some(p => Math.hypot(x - p.x, z - p.z) < 5.5)) continue;
    if (Object.values(model.residents).some(p => Math.hypot(x - p.x, z - p.z) < 5.3)) continue;
    if (Object.values(model.nodes).some(p => Math.hypot(x - p.x, z - p.z) < 3.0)) continue;
    if (trees.some(t => Math.hypot(t.root.position.x - x, t.root.position.z - z) < 5.2) || treePoints.some(p => Math.hypot(p.x - x, p.z - z) < 5.5)) continue;
    treePoints.push({ x, z });
    const t = woodlandTree(x, z, 0.66 + random() * 0.5, i + 1043, i % 3 ? 'oak' : 'beech'); trees.push(t); group.add(t.root);
    obstacles.push({ x, z, radius: 0.6 * t.root.scale.x });
  }
  // A distant tree line provides a horizon rather than an empty coloured plane.
  const distantTrunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.6, 7, 6), bark, 100);
  const distantCrowns = new THREE.InstancedMesh(foliageGeometry, paint('#78926d', 'leaf'), 100);
  for (let i = 0; i < 100; i++) {
    const a = i / 100 * Math.PI * 2, r = 50 + random() * 17, x = Math.sin(a) * r, z = 8 + Math.cos(a) * r;
    const scale = 1 + random() * 0.7, y = terrainHeight(x, z);
    matrix.makeScale(1, scale, 1); matrix.setPosition(x, y + 3 * scale, z); distantTrunks.setMatrixAt(i, matrix);
    matrix.makeScale(3.5, 3.0 * scale, 3.0); matrix.setPosition(x, y + 7 * scale, z); distantCrowns.setMatrixAt(i, matrix);
  }
  group.add(distantTrunks, distantCrowns);
  // Thousands of separate grass blades sway in just one draw call.
  const grassGeometry = new THREE.BufferGeometry();
  grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-.07,0,0,.07,0,0,-.035,.38,.04,.035,.38,.04,0,.76,.15],3));
  grassGeometry.setIndex([0,1,2,1,3,2,2,3,4]); grassGeometry.computeVertexNormals();
  const grassMaterial = new THREE.MeshLambertMaterial({ color: '#7e9a53', side: THREE.DoubleSide });
  grassMaterial.onBeforeCompile = shader => {
    shader.uniforms.forestWind = windTime;
    shader.vertexShader = 'uniform float forestWind;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvec4 rootPosition = instanceMatrix * vec4(0.,0.,0.,1.);\ntransformed.x += sin(forestWind*1.6+rootPosition.x*.45+rootPosition.z*.3)*.19*position.y*position.y;');
  };
  const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, 2100); grass.name = 'windblown-grass'; let blades = 0;
  for (let i = 0; i < 4700 && blades < 2100; i++) {
    const x = -36 + random() * 72, z = -25 + random() * 66;
    if (Math.abs(x - model.riverX(z)) < model.riverHalfWidth(z) + 0.7) continue;
    if (Object.values(model.nodes).some(p => Math.hypot(p.x - x, p.z - z) < 1.5)) continue;
    const scale = 0.45 + random() * 0.8;
    quaternion.setFromAxisAngle(up, random() * Math.PI * 2); matrix.compose(new THREE.Vector3(x, terrainHeight(x,z)+0.015,z),quaternion,new THREE.Vector3(scale,scale,scale)); grass.setMatrixAt(blades,matrix);
    grass.setColorAt(blades, new THREE.Color().setHSL(.21+random()*.05,.18,.68+random()*.25)); blades++;
  }
  grass.count = blades; group.add(grass);
  const rockBatch = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), stone, 65);
  for (let i=0;i<65;i++) {
    const a=i/65*Math.PI*2,s=Math.sin(a),c=Math.cos(a),x=Math.sign(s)*Math.pow(Math.abs(s),.25)*(37.8+random()*.6),z=8+Math.sign(c)*Math.pow(Math.abs(c),.25)*(34.8+random()*.6),size=.7+random()*1.2;
    quaternion.setFromEuler(new THREE.Euler(random(),random(),random()));matrix.compose(new THREE.Vector3(x,terrainHeight(x,z)+size*.15,z),quaternion,new THREE.Vector3(size,size*.6,size));rockBatch.setMatrixAt(i,matrix);
    obstacles.push({x,z,radius:size*.72});
  }
  rockBatch.castShadow=rockBatch.receiveShadow=true;group.add(rockBatch);
  function flowers(cx,cz,count,radius) {
    const stem = new THREE.InstancedMesh(new THREE.CylinderGeometry(.025,.025,.5,5),paint('#718d45'),count);
    const petals = new THREE.InstancedMesh(new THREE.SphereGeometry(1,7,5),paint('#f3e2ac'),count*5);
    const centres = new THREE.InstancedMesh(new THREE.SphereGeometry(.085,6,5),paint('#dcae4d'),count);
    for(let i=0;i<count;i++) {
      const a=random()*Math.PI*2,r=Math.sqrt(random())*radius,x=cx+Math.sin(a)*r,z=cz+Math.cos(a)*r,y=terrainHeight(x,z),h=.35+random()*.4;
      matrix.makeScale(1,h/.5,1);matrix.setPosition(x,y+h*.5,z);stem.setMatrixAt(i,matrix);
      matrix.makeTranslation(x,y+h,z);centres.setMatrixAt(i,matrix);
      for(let j=0;j<5;j++){const b=j*Math.PI*2/5;quaternion.setFromAxisAngle(up,-b);matrix.compose(new THREE.Vector3(x+Math.sin(b)*.11,y+h,z+Math.cos(b)*.11),quaternion,new THREE.Vector3(.09,.045,.17));petals.setMatrixAt(i*5+j,matrix);petals.setColorAt(i*5+j,new THREE.Color(i%4===0?'#c7b5e4':i%4===1?'#e5b5a4':'#fff1c8'));}
    }
    group.add(stem,petals,centres);
  }
  flowers(-27,16,110,5.5);flowers(29,32,35,4.2);flowers(12,-3,25,2.7);flowers(-18,-20,25,3);
  const wingGeometry=new THREE.SphereGeometry(1,7,5);
  for(let i=0;i<9;i++) {
    const butterfly=new THREE.Group(),wings=[];group.add(butterfly);butterfly.name='woodland-butterfly-'+i;
    const material=paint(i%3===0?'#dcae5b':i%3===1?'#a3bad0':'#d6b0c3');
    for(const side of [-1,1]){const wing=new THREE.Group();butterfly.add(wing);wings.push(wing);const mesh=new THREE.Mesh(wingGeometry,material);mesh.scale.set(.25,.025,.34);mesh.position.x=side*.22;wing.add(mesh);}
    ellipsoid(butterfly,paint('#6a6148'),[0,0,0],[.035,.03,.24]);butterflies.push({root:butterfly,wings,phase:i*2.4});
  }
  // Hollow fallen trunk with a visible opening and tiny lamps inside it.
  const log=new THREE.Group();log.name='hollow-glow-log';log.position.set(28,terrainHeight(28,-15),-17.5);log.rotation.y=-.25;group.add(log);
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.55,5.4,15,1,true),bark);shell.rotation.z=Math.PI/2;shell.position.y=1.05;log.add(shell);
  const innerMaterial=new THREE.MeshLambertMaterial({color:'#544b35',side:THREE.BackSide});const inside=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.4,5.42,15,1,true),innerMaterial);inside.rotation.z=Math.PI/2;inside.position.y=1.05;log.add(inside);
  for(const side of [-1,1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.32,.14,5,15),paint('#c1a16d','bark'));ring.rotation.y=Math.PI/2;ring.position.set(side*2.7,1.05,0);log.add(ring);obstacles.push({x:28+side*1.6,z:-18.3,radius:.65});}
  for(let i=0;i<8;i++){const x=25+random()*6,z=-15.6+random()*1.5,y=terrainHeight(x,z);limb(group,paint('#dbd0b0'),[x,y,z],[x,y+.35,z],.055);const cap=ellipsoid(group,new THREE.MeshStandardMaterial({color:'#c8dcc4',emissive:'#90be9d',emissiveIntensity:.65,roughness:1}),[x,y+.38,z],[.23,.12,.23]);cap.name='glowing-mushroom';mushrooms.push(cap);}
  // The spring pours over two rocky shelves into the existing river.
  const spring=new THREE.Group();spring.name='woodland-waterfall';group.add(spring);
  for(let i=0;i<7;i++){const x=model.riverX(-24)+(i%2?1:-1)*(1.4+random()),z=-24.5+random()*2;ellipsoid(spring,stone,[x,.55+random()*.4,z],[1.2,1.4+random(),1]);}
  const fallMaterial=new THREE.MeshStandardMaterial({color:'#b1d7d2',transparent:true,opacity:.78,roughness:.23,metalness:.08,side:THREE.DoubleSide});
  const fall=new THREE.Mesh(new THREE.PlaneGeometry(2.1,2.5,8,12),fallMaterial);fall.position.set(model.riverX(-24),1.15,-23.8);spring.add(fall);
  const foamGeometry=new THREE.BufferGeometry(),foamPositions=new Float32Array(38*3);foamGeometry.setAttribute('position',new THREE.BufferAttribute(foamPositions,3));
  const foam=new THREE.Points(foamGeometry,new THREE.PointsMaterial({color:'#eef9e5',size:.14,transparent:true,opacity:.7}));foam.name='spring-drops';spring.add(foam);waterFoam.push({geometry:foamGeometry,positions:foamPositions,x:fall.position.x});
  // A quiet bank with lily pads, fish and a small timber landing.
  for(let i=0;i<12;i++){const z=24+random()*7,x=model.riverX(z)+(random()-.5)*model.riverHalfWidth(z)*1.1;const pad=ellipsoid(group,moss,[x,-.10,z],[.35,.025,.3]);pad.castShadow=false;}
  for(let i=0;i<5;i++){const root=new THREE.Group();group.add(root);ellipsoid(root,paint(i%2?'#c9a85b':'#81a89a'),[0,0,0],[.12,.07,.35]);const tail=new THREE.Mesh(new THREE.ConeGeometry(.14,.24,3),paint('#a0b99d'));tail.rotation.x=Math.PI/2;tail.position.z=-.4;root.add(tail);fish.push({root,phase:i*1.7});}
  for(let i=0;i<7;i++){const plank=new THREE.Mesh(new THREE.BoxGeometry(2.6,.14,.35),paint('#c2a576','bark'));plank.position.set(-3.2,-.02,31.7+i*.4);group.add(plank);}
  // Low fences and a seat make each summit a recognisable destination.
  for(const place of [PLACES[0],PLACES[5]]){
    const y=terrainHeight(place.x,place.z);for(const side of [-1,1])limb(group,bark,[place.x+side*1.6,y,place.z-1.7],[place.x+side*1.6,y+1.1,place.z-1.7],.12);
    limb(group,bark,[place.x-1.6,y+.9,place.z-1.7],[place.x+1.6,y+.9,place.z-1.7],.1);
    limb(group,bark,[place.x-1.0,y+.4,place.z+1.7],[place.x+1,y+.4,place.z+1.7],.24);
  }
  for(let i=0;i<6;i++){const cloud=new THREE.Group(),mat=new THREE.MeshLambertMaterial({color:'#fff4d9',transparent:true,opacity:.7,depthWrite:false});for(let j=0;j<3;j++)ellipsoid(cloud,mat,[j*2,Math.sin(j)*.6,0],[2.6,1.1,1.5]);cloud.position.set(-42+i*16,22+i%2*4,-36-i%3*7);group.add(cloud);clouds.push({root:cloud,x:cloud.position.x});}
  let activePlace=null,reaction=0;
  function animate(time,player) {
    const t=window.FK.reduced?0:time;windTime.value=t;
    const nearMeadow=Math.hypot(player.x+27,player.z-16)<6;
    butterflies.forEach(({root,wings,phase})=>{const a=t*.25+phase,r=nearMeadow?2.5:4.3;root.position.set(-27+Math.sin(a)*r,1.2+Math.sin(t*.8+phase)*.4+(reaction>0&&activePlace==='meadow'?.9:0),16+Math.cos(a*.9)*r*.7);root.rotation.y=-a;wings.forEach((w,i)=>w.rotation.z=(i?1:-1)*(t?Math.sin(t*9+phase)*.65:.3));});
    waterFoam.forEach(({geometry,positions,x})=>{for(let i=0;i<positions.length/3;i++){positions[i*3]=x+Math.sin(i*4.7)*.85;positions[i*3+1]=2.5-((t*1.6+i*.18)%2.65);positions[i*3+2]=-23.65+Math.cos(i*2.4)*.12;}geometry.attributes.position.needsUpdate=true;});
    fish.forEach(({root,phase},i)=>{const z=i<2?32.2+Math.sin(t*.17+phase)*1.8:25+Math.sin(t*.17+phase)*3.1,jump=activePlace==='pond'&&reaction>.1&&i===0&&!window.FK.reduced?Math.max(0,Math.sin((1-reaction)*Math.PI*3))*.8:0;root.position.set(model.riverX(z)+Math.cos(t*.3+phase)*(i<2?.65:1.3),-.23+jump,z);root.rotation.y=Math.cos(t*.17+phase)>0?0:Math.PI;});
    mushrooms.forEach((m,i)=>m.material.emissiveIntensity=activePlace==='log'&&reaction>0?.65+reaction*(1+Math.sin(t*3+i))*.7:.65);
    clouds.forEach(({root,x},i)=>{root.position.x=x+(t?Math.sin(t*.018+i)*3:0);});
    reaction=Math.max(0,reaction-.016);
  }
  return {group,animate,react(id){activePlace=id;reaction=1;},places:PLACES};
}
