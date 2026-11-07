import {THREE,paint,ellipsoid,limb,curveTube,roundedBlock,paintedPath,seeded} from '../forest/materials.js';
import {actor} from './actors.js';
import {createPaintedWorld} from './painted.js';
import {forestPlaces,forestExits,forestCollectibles} from './forest3d.js';
// The painted scenes match the reviewed visualisation; ?world3d keeps the earlier procedural 3D world.
export const painted=!new URLSearchParams(location.search).has('world3d');
const places3d={home:{x:0,z:2,picture:'door',name:'Nach Hause'},shop:{x:8,z:2,picture:'bag',name:'Zum Laden'},squirrel:{x:-8,z:-3,picture:'squirrel',name:'Zu Eichhörnchen'},bird:{x:8,z:-9,picture:'bird',name:'Zu Blaumeise'},owl:{x:-9,z:-12,picture:'owl',name:'Zu Waldkauz'},beaver:{x:11,z:11,picture:'beaver',name:'Zu Biber'},mouse:{x:-7,z:11,picture:'mouse',name:'Zu Maus'}};
export const places=painted?forestPlaces:places3d;
export const exitPoints=painted?forestExits:{den:{x:0,z:3.6},shop:{x:8,z:3.6}};
export const collectibles=painted?forestCollectibles:[];
export function createWorld(canvas,options){return painted?createPaintedWorld(canvas,options):createProceduralWorld(canvas,options);}
function createProceduralWorld(canvas,{position,onPosition,onNear,onAction,onMove,onAnimationEnd,onProject}){
  const places=places3d;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  const software=new URLSearchParams(location.search).has('software');
  renderer.setPixelRatio(software?.5:Math.min(devicePixelRatio||1,1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
  renderer.shadowMap.enabled=!software;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  const scene=new THREE.Scene(),forestSky=new THREE.Color('#c9d391');scene.background=forestSky;scene.fog=new THREE.Fog('#c9d391',34,78);
  scene.add(new THREE.HemisphereLight('#ffe4b0','#7c5a34',1.35));
  const sun=new THREE.DirectionalLight('#ffcd85',2.7);sun.position.set(-15,17,11);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:65});sun.shadow.normalBias=.05;scene.add(sun);
  const forest=new THREE.Group(),den=new THREE.Group(),shop=new THREE.Group();scene.add(forest,den,shop);
  const player=actor('fox');scene.add(player.group);player.group.scale.setScalar(.68);
  const occluders=[];
  const residents={},sway=[],hotspots=[],indoorHotspots={den:[],shop:[]};
  const wood=paint('#a3603a','bark'),woodLight=paint('#da9a5c','bark'),green=paint('#78a83a'),leafLight=paint('#88ba42'),leafDeep=paint('#5f8f2f'),cream=paint('#f1e3c4'),earth=paint('#c26c3f'),stoneGrey=paint('#a9a69c');
  const glow=c=>new THREE.MeshBasicMaterial({color:c,toneMapped:false});
  function lantern(parent,x,y,z){limb(parent,paint('#6d4a2e'),[x,y+.42,z],[x,y+.55,z],.03);const cap=new THREE.Mesh(new THREE.ConeGeometry(.26,.2,8),paint('#6d4a2e'));cap.position.set(x,y+.36,z);parent.add(cap);const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.4,10),glow('#ffd47e'));lamp.position.set(x,y+.08,z);parent.add(lamp);const base=new THREE.Mesh(new THREE.CylinderGeometry(.21,.21,.07,10),paint('#6d4a2e'));base.position.set(x,y-.15,z);parent.add(base);}
  function blob(parent,x,y,z,sx,sy,sz,mat){return ellipsoid(parent,mat,[x,y,z],[sx,sy,sz]);}
  function block(parent,x,y,z,w,h,d,mat){const m=new THREE.Mesh(roundedBlock(w,h,d,.12),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
  function tree(parent,x,z,size=1,hero=false){
    const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(size);parent.add(g);
    limb(g,wood,[0,0,0],[0,hero?5.7:4.4,0],hero?1.5:.5,hero?1:.32);
    for(let i=0;i<5;i++){const a=i*1.257;curveTube(g,wood,[[0,.4,0],[Math.cos(a)*1.2,.18,Math.sin(a)*1.2],[Math.cos(a)*2.2,.06,Math.sin(a)*2.2]],hero?.28:.12);}
    for(const [x1,y,z1,r,m]of [[0,5.2,0,2.5,leafDeep],[-1.9,5.3,.4,1.6,green],[1.9,5.4,-.3,1.7,green],[-.9,6.2,-1.1,1.6,green],[1.1,6.3,1.0,1.5,leafLight],[0,6.6,0,1.9,leafLight],[0,5.1,1.5,1.8,green]])blob(g,x1,y,z1,r,r*.8,r,m);
    if(!hero)sway.push(g.children[g.children.length-1]);else{g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;}});occluders.push(g);}return g;
  }
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),paint('#679436','ground').clone());ground.material.color.setRGB(.8,.88,.72);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;forest.add(ground);
  const rng=seeded(64);
  let dirt;function dirtTrail(points,width){const m=paintedPath(points,width);if(!dirt){dirt=m.material.clone();dirt.color.setRGB(.8,.52,.37);}m.material=dirt;return m;}
  {const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),fade=g.createRadialGradient(64,64,20,64,64,64);fade.addColorStop(0,'#fff');fade.addColorStop(.72,'#fff');fade.addColorStop(1,'#000');g.fillStyle=fade;g.fillRect(0,0,128,128);
   const plaza=new THREE.Mesh(new THREE.CircleGeometry(6.4,40),paint('#ecd3a3','sand').clone());plaza.material.color.setRGB(.8,.52,.37);plaza.material.alphaMap=new THREE.CanvasTexture(c);plaza.material.transparent=true;plaza.material.depthWrite=false;plaza.rotation.x=-Math.PI/2;plaza.position.set(3.4,.05,4.2);plaza.scale.set(1.25,.8,1);plaza.renderOrder=-2;forest.add(plaza);}
  for(let i=0;i<38;i++){const a=i/38*Math.PI*2,r=21+rng()*9;tree(forest,Math.cos(a)*r,Math.sin(a)*r,.8+rng()*.6);}
  for(const [x,z,s]of [[-15,4,.85],[16,-3,1],[1,-17,1.1],[-16,-8,1],[15,16,.9]])tree(forest,x,z,s);
  tree(forest,0,-1,1.3,true);tree(forest,9,0,.7,true);
  for(const [id,p]of Object.entries(places)){
    forest.add(dirtTrail([{x:0,z:5},{x:p.x*.45,z:(p.z+5)*.5},{x:p.x,z:p.z}],1.3));
    if(!['home','shop'].includes(id)){const rig=actor(id);rig.group.position.set(p.x,0,p.z);rig.group.rotation.y=.2;residents[id]=rig;forest.add(rig.group);hotspots.push({id,point:new THREE.Vector3(p.x,2.6,p.z)});}
  }
  // Safe, permanent boardwalk. Stream and stones never gate access to friends.
  const water=new THREE.Mesh(new THREE.PlaneGeometry(4,45),paint('#58aecb','water'));water.rotation.x=-Math.PI/2;water.rotation.z=-.12;water.position.set(15,.025,0);forest.add(water);
  for(let i=0;i<8;i++)block(forest,13.7+i*.38,.12,8, .34,.18,3.5,woodLight);
  for(const z of [6.35,9.65]){for(const x of [13.5,15,16.6])limb(forest,wood,[x,0,z],[x,1.05,z],.11);limb(forest,woodLight,[13.4,.95,z],[16.7,.95,z],.08);}
  const ripples=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.3+rng()*.4,.015,4,22),paint('#eef8f4'));m.rotation.x=Math.PI/2;m.position.set(14+rng()*2,.05,-15+rng()*30);forest.add(m);ripples.push(m);}
  for(let i=0;i<70;i++){const a=rng()*Math.PI*2,r=17+rng()*6,x=Math.cos(a)*r,z=Math.sin(a)*r;blob(forest,x,.12,z,.18,.13,.18,i%3?green:paint('#e3ca80'));}
  // Meadow dressing: instanced flowers, grass tufts and mushrooms. Decorative only; never solid or pickable.
  function meadow(geo,mat,count,place){const m=new THREE.InstancedMesh(geo,mat,count),o=new THREE.Object3D(),c=new THREE.Color();for(let i=0;i<count;i++){o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);if(place(i,o,c))m.setColorAt(i,c);o.updateMatrix();m.setMatrixAt(i,o.matrix);}m.castShadow=m.receiveShadow=true;forest.add(m);return m;}
  const open=(x,z)=>Object.values(places).every(p=>Math.hypot(x-p.x,z-p.z)>2.7)&&Math.abs(x-15+z*.12)>2.8&&Math.hypot(x,z+1)>3.4&&Math.hypot(x-9,z)>2.6;
  const spots=[];for(let i=0;i<400&&spots.length<46;i++){const x=-19+rng()*33,z=-17+rng()*35;if(open(x,z))spots.push([x,z,rng()]);}
  const blooms=spots.flatMap(([x,z,k],i)=>[0,1,2].map(j=>[x+Math.cos(j*2.1+k*6)*.38,z+Math.sin(j*2.1+k*6)*.38,i]));
  const bloomColors=['#f4c84a','#ef9787','#fbf4e4','#b7a3e3','#f6a6c1'];
  meadow(new THREE.SphereGeometry(.2,9,6),paint('#ffffff'),blooms.length,(i,o,c)=>{const [x,z,g]=blooms[i];o.position.set(x,.36+(i%3)*.05,z);o.scale.set(1,.5,1);c.set(bloomColors[g%bloomColors.length]);return true;});
  meadow(new THREE.SphereGeometry(.08,6,4),paint('#ffffff'),blooms.length,(i,o,c)=>{const [x,z]=blooms[i];o.position.set(x,.43+(i%3)*.05,z);c.set('#e8a03a');return true;});
  meadow(new THREE.CylinderGeometry(.03,.04,.36,5),paint('#5f8a44'),blooms.length,(i,o)=>{const [x,z]=blooms[i];o.position.set(x,.18,z);});
  const tufts=[];for(let i=0;i<500&&tufts.length<110;i++){const x=-20+rng()*36,z=-18+rng()*37;if(open(x,z))tufts.push([x,z,rng()]);}
  meadow(new THREE.ConeGeometry(.16,.7,4),paint('#ffffff'),tufts.length*3,(i,o,c)=>{const [x,z,k]=tufts[Math.floor(i/3)],j=i%3;o.position.set(x+(j-1)*.14,.3,z+(j===1?.08:0));o.rotation.set(0,k*3,(j-1)*.35);o.scale.set(1,.8+k*.5,1);c.set(j===1?'#7ea052':'#97b565');return true;});
  const caps=[[-14.6,3.2],[-9.8,-4.6],[3.2,-14.8],[-10.2,13.6],[13.4,13.2],[-2.4,-3.4],[2.6,-2.6],[18.4,-2.2]];
  meadow(new THREE.SphereGeometry(.34,12,8,0,Math.PI*2,0,Math.PI/2),paint('#ffffff'),caps.length,(i,o,c)=>{o.position.set(caps[i][0],.42,caps[i][1]);o.scale.set(1,.75,1);c.set(i%3?'#c9573f':'#d9a35a');return true;});
  meadow(new THREE.CylinderGeometry(.11,.14,.44,8),paint('#f3e6c8'),caps.length,(i,o)=>{o.position.set(caps[i][0],.22,caps[i][1]);});
  // Drifting pollen motes catch the light above the clearing.
  const moteCanvas=document.createElement('canvas');moteCanvas.width=moteCanvas.height=32;{const g=moteCanvas.getContext('2d'),r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'#fffbe6');r.addColorStop(.35,'#fff1b8cc');r.addColorStop(1,'#fff1b800');g.fillStyle=r;g.fillRect(0,0,32,32);}
  const moteGeo=new THREE.BufferGeometry(),motePos=new Float32Array(90*3);for(let i=0;i<90;i++){motePos.set([-20+rng()*38,.6+rng()*4.5,-18+rng()*36],i*3);}moteGeo.setAttribute('position',new THREE.BufferAttribute(motePos,3));
  const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({size:.32,map:new THREE.CanvasTexture(moteCanvas),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.85}));forest.add(motes);
  function doorway(parent,x,z,id){
    const frame=new THREE.Mesh(new THREE.TorusGeometry(1.05,.2,8,28,Math.PI),woodLight);frame.position.set(x,1.2,z);parent.add(frame);
    block(parent,x-1.05,.6,z,.35,1.2,.35,woodLight);block(parent,x+1.05,.6,z,.35,1.2,.35,woodLight);
    block(parent,x,1,z+.04,1.8,2,.14,parent===forest?glow('#e9a24e'):glow('#c6e38a'));if(parent===forest){lantern(parent,x-1.45,1.25,z+.35);lantern(parent,x+1.45,1.25,z+.35);}return {id,point:new THREE.Vector3(x,2.5,z)};
  }
  hotspots.push(doorway(forest,0,1,'home'),doorway(forest,8,1,'shop'));
  // Market stall at the shop tree and mushrooms on the home tree, as in the forest reference. Decorative, never solid.
  const red=paint('#c63a2c');
  for(let i=0;i<6;i++){const stripe=block(forest,6.75+i*.5,2.78,1.8,.5,.09,1.55,i%2?glow('#f3ead2'):paint('#5f9433'));stripe.rotation.x=.3;}
  for(const x of [6.55,9.45])limb(forest,woodLight,[x,0,2.45],[x,2.6,2.45],.09);
  block(forest,10.1,.55,2.5,1.3,1.1,.9,woodLight);for(const [x,z]of [[9.8,2.35],[10.1,2.65],[10.4,2.4]])blob(forest,x,1.27,z,.17,.16,.16,red);
  block(forest,5.9,.32,2.6,.95,.6,.75,woodLight);for(let i=0;i<5;i++)blob(forest,5.6+(i%3)*.3,.68,2.45+Math.floor(i/3)*.3,.15,.14,.15,red);
  blob(forest,5.4,.24,3.7,.42,.22,.42,paint('#8faa49'));blob(forest,6.3,.24,3.9,.42,.22,.42,paint('#e0b54d'));
  lantern(forest,9.45,2.15,2.75);
  for(const [x,y,z,k]of [[-1.75,1.5,.15,1],[-1.45,1.85,.5,.8],[-2.0,1.25,-.25,.7]]){limb(forest,cream,[x+.25,y-.12,z],[x,y,z],.07*k);blob(forest,x,y+.04,z,.34*k,.15*k,.34*k,paint('#d6ad80'));}
  // Rounded boulders along the brook and the clearing's edge; bushes frame the paths.
  const stones=[];for(let z=-17;z<18;z+=1.6){if(z>5.6&&z<10.4)continue;for(const side of [-1,1])if(rng()<.75)stones.push([15-z*.12+side*(2.3+rng()*.5),z+rng()*.8,.35+rng()*.45]);}
  for(let i=0;i<300&&stones.length<62;i++){const a=rng()*Math.PI*2,d=12+rng()*7,x=Math.cos(a)*d,z=Math.sin(a)*d;if(open(x,z))stones.push([x,z,.3+rng()*.5]);}
  meadow(new THREE.SphereGeometry(1,12,9),paint('#ffffff'),stones.length,(i,o,c)=>{const [x,z,k]=stones[i];o.position.set(x,k*.28,z);o.scale.set(k*1.15,k*.72,k);o.rotation.y=i;c.setHSL(.11,.05,.66+(i%4)*.04);return true;});
  const bushes=[];for(let i=0;i<400&&bushes.length<44;i++){const a=rng()*Math.PI*2,d=9+rng()*10,x=Math.cos(a)*d,z=Math.sin(a)*d;if(open(x,z)&&x<12.5)bushes.push([x,z,.42+rng()*.38]);}
  meadow(new THREE.SphereGeometry(1,12,9),paint('#ffffff'),bushes.length*2,(i,o,c)=>{const [x,z,k]=bushes[i>>1],j=i&1;o.position.set(x+j*.45*k,k*(.42-j*.08),z+j*.3*k);o.scale.set(k*(1-j*.25),k*(.75-j*.15),k*(.9-j*.2));c.set(j?'#8dbd45':'#5f9330');return true;});
  // Den: open front, warm root arch, round window, functional bed and drawing table.
  function room(parent){
    const floor=new THREE.Mesh(new THREE.CylinderGeometry(8.1,8.2,.28,48),paint('#bb7444'));floor.receiveShadow=true;parent.add(floor);
    const outer=new THREE.Mesh(new THREE.CircleGeometry(34,40),paint('#bb7444'));outer.rotation.x=-Math.PI/2;outer.position.y=.12;outer.receiveShadow=true;parent.add(outer);
    const wall=new THREE.Mesh(new THREE.CylinderGeometry(8,8,17,40,1,true,Math.PI/2,Math.PI),earth);wall.material=earth.clone();wall.material.side=THREE.DoubleSide;wall.position.y=8.5;parent.add(wall);
    for(const i of [0,1,4,5]){const x=-6+i*2.4;curveTube(parent,wood,[[x,.1,-5],[x*.9,3,-5.6],[x*.55,5.1,-4],[x*.35,5.5,-2]],.37);}
    const windowFrame=new THREE.Mesh(new THREE.TorusGeometry(.92,.15,8,32),woodLight);windowFrame.position.set(-3,3.1,-6.7);parent.add(windowFrame);
    blob(parent,-3,3.1,-6.8,.86,.86,.1,glow('#c6e38a'));block(parent,-3,3.1,-6.65,.09,1.7,.1,woodLight);block(parent,-3,3.1,-6.65,1.7,.09,.1,woodLight);
    // Root canopy, shelf, books and trailing leaves are fixed parts of the starter den.
    curveTube(parent,wood,[[-7,1,-3],[-6,4,-4],[-3,5.7,-4],[0,5.8,-4],[4,5,-4],[7,1,-3]],.48);
    block(parent,-.6,2.7,-7,3.8,.18,.8,woodLight);
    for(let i=0;i<3;i++){const book=block(parent,-1.8+i*.4,3.15,-6.9,.3,.8,.48,paint(['#788c51','#c5a459','#a56e4b'][i]));book.rotation.z=(i-1)*.08;}
    blob(parent,.5,3,-6.9,.4,.4,.34,paint('#c69758'));
    for(let i=0;i<15;i++){const a=i*2.4;blob(parent,.5+Math.sin(a)*.55,3.4-Math.max(0,i-8)*.14,-6.7+Math.cos(a)*.3,.21,.09,.32,green);}
    // Moss on the root canopy and trailing ivy, as in the den reference.
    for(const [x,y,z,k]of [[-6.2,3.6,-3.7,1],[-4.6,5.1,-4,1.2],[-1.5,5.75,-4,.9],[2.4,5.5,-4,1],[5.6,3.6,-3.6,1.1]])blob(parent,x,y,z,.62*k,.32*k,.5*k,leafDeep);
    for(let i=0;i<14;i++){const t=i/13;blob(parent,-5.4+t*1.6+Math.sin(i*1.7)*.25,5.4-t*2.4,-4.6+Math.cos(i)*.2,.24,.12,.3,i%3?green:leafLight);}
    const light=new THREE.PointLight('#ffcf8a',38,22,2);light.position.set(-3,3.4,1);parent.add(light);
  }
  room(den);room(shop);
  block(den,-4,.55,1.5,3.2,.8,2.1,woodLight);block(den,-3.85,1.02,1.5,2.75,.28,2,paint('#76a537'));blob(den,-5.05,1.3,1.5,.5,.24,.78,cream);
  block(den,-5.62,1.4,1.5,.18,.9,2.1,woodLight);for(const x of [-5.62,-2.38])for(const z of [.48,2.52])limb(den,woodLight,[x,0,z],[x,x<-4?1.95:1.3,z],.16);
  blob(den,-1.9,.34,3.5,.72,.2,.62,cream);
  {const basket=new THREE.Mesh(new THREE.CylinderGeometry(.7,.55,.9,18),paint('#c88e48','bark'));basket.position.set(1.1,.55,-6.2);basket.castShadow=true;den.add(basket);const rim=new THREE.Mesh(new THREE.TorusGeometry(.7,.07,6,24),paint('#a87335'));rim.rotation.x=Math.PI/2;rim.position.set(1.1,1,-6.2);den.add(rim);}
  for(const [x,z,w,m]of [[-5.4,4.3,1.2,leafDeep],[-4.2,5.1,.85,green],[5.5,4.4,1.25,leafDeep],[4.4,5.2,.8,green]])blob(den,x,.3,z,w,w*.48,w*.85,m);
  for(const [x,z,k]of [[-3.6,4.5,.5],[6.2,3.5,.45],[3.8,5.4,.42]])blob(den,x,.3,z,k*1.2,k*.75,k,stoneGrey);
  for(const x of [2.5,5.4])for(const z of [-1,1])block(den,x,.7,z,.2,1.2,.2,wood);
  block(den,4,1.4,0,3.6,.22,2.5,woodLight);block(den,4,1.54,0,1.8,.04,1.5,cream);
  for(let i=0;i<4;i++)limb(den,paint(['#b67d59','#d5b458','#7d9b67','#6999ad'][i]),[4.8+i*.12,1.6,.5],[4.8+i*.12,1.6,-.4],.05);
  const rug=blob(den,0,.22,2,2.3,.025,1.5,paint('#c4583b'));
  {const cup=new THREE.Mesh(new THREE.CylinderGeometry(.22,.2,.5,12),woodLight);cup.position.set(5.3,1.78,-.7);den.add(cup);for(let i=0;i<3;i++)limb(den,paint(['#d6a24a','#b5674a','#d9b56a'][i]),[5.22+i*.08,1.8,-.72+i*.04],[5.18+i*.12,2.45,-.75+i*.06],.04);}
  indoorHotspots.den.push(doorway(den,3,-6,'outside'),{id:'drawing',point:new THREE.Vector3(4,2.2,0)},{id:'sleep',point:new THREE.Vector3(-4,2,1.5)});
  // Fixed shelves and goods: purchases change only inventory or drawing unlocks.
  for(const z of [-5,-2])block(shop,0,1.4,z,11,.25,1.4,woodLight);
  for(const x of [-5,5])block(shop,x,1.8,-5,.3,3.5,.5,wood);
  const goods={leaf:[-3,-2],pencils:[-.8,-2],apple:[1.6,-2],bath:[4,-2]};
  for(const[id,[x,z]]of Object.entries(goods)){
    if(id==='leaf'){block(shop,x,1.6,z,1.3,.04,1,cream);blob(shop,x,1.68,z,.35,.025,.55,green);}
    if(id==='pencils')for(let i=0;i<4;i++)limb(shop,paint(['#bd7756','#e1bc66','#879f6c','#749fa8'][i]),[x+i*.16,1.5,z],[x+i*.16,2.5,z],.07);
    if(id==='apple'){blob(shop,x,1.9,z,.36,.35,.34,paint('#d28b57'));limb(shop,wood,[x,2.18,z],[x+.04,2.38,z],.04);}
    if(id==='bath')block(shop,x,1.95,z,.6,.85,.5,paint('#b3c4b6'));
    indoorHotspots.shop.push({id,point:new THREE.Vector3(x,3,z)});
  }
  for(const cx of [-1.9,2.8]){for(const dx of [-2,2])limb(shop,woodLight,[cx+dx,1.5,-2.75],[cx+dx,3.7,-2.75],.17);const arch=new THREE.Mesh(new THREE.TorusGeometry(2,.17,8,28,Math.PI),woodLight);arch.position.set(cx,3.7,-2.75);arch.scale.y=.32;shop.add(arch);block(shop,cx,2.85,-2.98,4,2.5,.1,new THREE.MeshLambertMaterial({color:'#9a4f2e'}));}
  lantern(shop,-5.6,4.2,-4.6);{const l=new THREE.PointLight('#ffc070',14,10,2);l.position.set(-5.4,4.1,-3.8);shop.add(l);}
  const shopDoor=doorway(shop,-4,-6,'outside');shopDoor.point.y=4.3;indoorHotspots.shop.push(shopDoor);
  // Lantern-lit dust drifts slowly through the den and shop.
  const dustGeo=new THREE.BufferGeometry(),dustPos=new Float32Array(40*3);for(let i=0;i<40;i++)dustPos.set([-6+rng()*12,1+rng()*4,-5+rng()*8],i*3);dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
  const dust=[den,shop].map(g=>{const d=new THREE.Points(dustGeo,motes.material.clone());d.material.size=.18;d.material.opacity=.6;g.add(d);return d;});
  // Temporary props live only in this scene group and are never attached to the world save.
  const temporary=new THREE.Group();scene.add(temporary);temporary.visible=false;
  const apple=new THREE.Group();blob(apple,0,0,0,.22,.24,.21,paint('#d78456'));limb(apple,wood,[0,.20,0],[.02,.34,0],.025);temporary.add(apple);
  const tub=new THREE.Group();temporary.add(tub);blob(tub,0,.48,0,1.25,.55,.9,woodLight);blob(tub,0,.9,0,1.13,.05,.78,paint('#b4d0cb'));
  const bubbles=[];for(let i=0;i<15;i++){const b=blob(tub,(rng()-.5)*1.9,.99+rng()*.15,(rng()-.5)*1.2,.12+rng()*.10,.15,.15,paint('#f7f2dd'));bubbles.push({mesh:b,x:b.position.x,y:b.position.y});}
  const simpleSphere=new THREE.SphereGeometry(1,12,8);
  scene.traverse(o=>{if(o.isMesh&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius===1)o.geometry=simpleSphere;});
  const marker=new THREE.Group();forest.add(marker);marker.visible=false;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.52,.07,6,24),paint('#f2d18a'));ring.rotation.x=Math.PI/2;ring.position.y=.10;marker.add(ring);
  const arrow=new THREE.Mesh(new THREE.ConeGeometry(.19,.5,3),paint('#fff0ba'));arrow.rotation.x=-Math.PI/2;arrow.position.set(0,.2,-.65);marker.add(arrow);
  const camera=new THREE.PerspectiveCamera(42,1,.1,110),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
  let area='den',paused=false,destination=null,arrival=null,near=null,last=performance.now(),time=0,lastSample=0,raf,anim=null,keys=new Set(),stick={x:0,z:0},width=1,height=1;
  const focus=new THREE.Vector3(),wanted=new THREE.Vector3(),cameraOffset=new THREE.Vector3(0,15,19);
  function indoorCamera(){const wide=canvas.clientWidth>=600;camera.position.set(0,wide?6.4:10,wide?14.2:20.8);camera.lookAt(0,1.7,wide?-1.6:-1);}
  function setArea(next){area=next;forest.visible=area==='forest';den.visible=area==='den';shop.visible=area==='shop';scene.fog=area==='forest'?new THREE.Fog('#c9d391',34,78):null;renderer.shadowMap.needsUpdate=true;scene.background=area==='forest'?forestSky:null;destination=null;waypoints=[];arrival=null;if(typeof marker!=='undefined')marker.visible=false;near=null;onNear(null);
    const p=area==='forest'?position():{x:-.4,z:1.9};player.group.position.set(p.x,.2,p.z);player.group.rotation.y=.2;focus.set(p.x,1,p.z);if(area==='forest'){camera.position.copy(focus).add(cameraOffset);camera.lookAt(focus);}else indoorCamera();
  }
  const trunks=[{x:0,z:-1,r:1.6},{x:9,z:0,r:1}];
  let waypoints=[];
  function plan(target){
    const start=player.group.position.clone(),points=[start,target];
    for(const trunk of trunks)for(let i=0;i<8;i++){const a=i*Math.PI/4;points.push(new THREE.Vector3(trunk.x+Math.cos(a)*(trunk.r+.6),0,trunk.z+Math.sin(a)*(trunk.r+.6)));}
    function clear(a,b){const dx=b.x-a.x,dz=b.z-a.z,length=dx*dx+dz*dz;return trunks.every(t=>{const along=length?THREE.MathUtils.clamp(((t.x-a.x)*dx+(t.z-a.z)*dz)/length,0,1):0;return Math.hypot(a.x+dx*along-t.x,a.z+dz*along-t.z)>=t.r+.08;});}
    const cost=points.map(()=>Infinity),previous=[],visited=new Set();cost[0]=0;
    while(visited.size<points.length){let next=-1;for(let i=0;i<points.length;i++)if(!visited.has(i)&&(next<0||cost[i]<cost[next]))next=i;if(next<0||!Number.isFinite(cost[next])||next===1)break;visited.add(next);
      for(let i=0;i<points.length;i++){if(visited.has(i)||!clear(points[next],points[i]))continue;const c=cost[next]+Math.hypot(points[next].x-points[i].x,points[next].z-points[i].z);if(c<cost[i]){cost[i]=c;previous[i]=next;}}
    }
    if(!Number.isFinite(cost[1]))return null;const path=[];let cursor=1;while(cursor!==0){path.unshift(points[cursor]);cursor=previous[cursor];}return path;
  }
  function walkTo(target,id=null){
    for(const trunk of trunks){let dx=target.x-trunk.x,dz=target.z-trunk.z,d=Math.hypot(dx,dz);if(d<trunk.r+.15){if(d<.01){dx=player.group.position.x-trunk.x;dz=player.group.position.z-trunk.z;d=Math.hypot(dx,dz)||1;}target.x=trunk.x+dx/d*(trunk.r+.3);target.z=trunk.z+dz/d*(trunk.r+.3);}}
    const path=plan(target);if(!path){onMove({event:'route_failure',reason:'blocked',area,destination:id});return;}
    waypoints=path;destination=waypoints.shift();arrival=id;marker.position.copy(target);marker.visible=true;onMove({event:'movement_destination',destination:id,x:target.x,z:target.z,area});
  }
  function route(id){if(area!=='forest')return;const p=places[id];walkTo(new THREE.Vector3(p.x,0,p.z+1.6),id);}
  function project(p){const q=p.clone().project(camera);return {x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z<1&&Math.abs(q.x)<.94&&Math.abs(q.y)<.88};}
  function pick(event){if(paused||anim||event.button>0)return;const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
    if(!raycaster.ray.intersectPlane(plane,hit))return;if(area!=='forest')return;
    walkTo(new THREE.Vector3(THREE.MathUtils.clamp(hit.x,-17,12.5),0,THREE.MathUtils.clamp(hit.z,-16,17)));
  }
  canvas.addEventListener('pointerup',pick);
  const visibility=()=>{last=performance.now();keys.clear();stick={x:0,z:0};};document.addEventListener('visibilitychange',visibility);
  const keydown=e=>{if(paused||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){keys.add(e.key);e.preventDefault();}},keyup=e=>{if(keys.delete(e.key)&&area==='forest')onPosition(player.group.position.x,player.group.position.z);},blur=()=>{keys.clear();stick={x:0,z:0};};
  document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
  function resize(){width=canvas.clientWidth;height=canvas.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/Math.max(1,height);camera.fov=width<600?(area==='forest'?57:62):42;camera.updateProjectionMatrix();if(area!=='forest'&&!anim)indoorCamera();}
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  function animateTreat(dt){
    anim.elapsed+=dt;const t=anim.elapsed,reduced=window.FK.reduced;
    player.animate(time,{mood:'joyful',reduced});
    if(anim.item==='apple'){
      apple.visible=t<3.8;tub.visible=false;
      const lift=reduced?1:Math.min(1,t/1.1);apple.scale.setScalar(t<2?1:t<3?.72:.40);
      player.arms[1].rotation.x=-lift*1.9;player.arms[1].rotation.z=-.2;player.group.updateMatrixWorld(true);apple.position.copy(player.arms[1].localToWorld(new THREE.Vector3(0,-.69,.1)));player.head.rotation.x=reduced?0:Math.sin(t*9)*.04;
    }else if(anim.item==='bath'){
      apple.visible=false;tub.visible=true;tub.position.set(0,0,4);player.group.position.y=.4;player.group.position.z=4;
      player.arms.forEach((a,i)=>{a.rotation.z=(i?1:-1)*.8;a.rotation.x=reduced?0:Math.sin(t*3+i)*.35;});
      bubbles.forEach(({mesh,x,y},i)=>{mesh.position.y=y+(reduced?0:Math.max(0,Math.sin(t*1.7+i))*.5);mesh.position.x=x+(reduced?0:Math.sin(t+i)*.07);});
    }else{apple.visible=false;tub.visible=false;player.group.rotation.z=reduced?1.3:Math.min(1,t)*1.3;player.head.rotation.x=.25;player.eyes.forEach(e=>e.scale.y=.08);}
    if(t>=5){anim=null;temporary.visible=false;player.group.rotation.z=0;onAnimationEnd();}
  }

  const blocked=(x,z)=>trunks.some(t=>Math.hypot(x-t.x,z-t.z)<t.r);
  function frame(now){raf=requestAnimationFrame(frame);const elapsed=Math.max(0,(now-last)/1000),dt=Math.min(.25,elapsed);last=now;if(document.hidden)return;if(paused&&!anim)return;time+=dt;
    resizeIfNeeded();let moving=false;
    if(anim)animateTreat(elapsed);
    else{
      if(area==='forest'&&!paused){
        let dx=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'))+stick.x,dz=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'))+stick.z;
        const manual=Math.hypot(dx,dz)>0;
        if(manual){destination=null;waypoints=[];arrival=null;marker.visible=false;}else if(destination){dx=destination.x-player.group.position.x;dz=destination.z-player.group.position.z;}
        const distance=Math.hypot(dx,dz);
        if(distance>.08){const step=Math.min(manual?Infinity:distance,3.3*dt);const current=player.group.position,nx=THREE.MathUtils.clamp(current.x+dx/distance*step,-17,12.5),nz=THREE.MathUtils.clamp(current.z+dz/distance*step,-16,17);
          if(!blocked(nx,nz)){current.x=nx;current.z=nz;}
          else if(!blocked(nx,current.z))current.x=nx;
          else if(!blocked(current.x,nz))current.z=nz;
          else if(!manual){const side=dx>=0?1:-1;const sx=current.x+side*step;if(!blocked(sx,current.z))current.x=sx;}
          player.group.rotation.y=Math.atan2(dx,dz);moving=true;}
        else if(destination){if(waypoints.length)destination=waypoints.shift();else{destination=null;marker.visible=false;onPosition(player.group.position.x,player.group.position.z);const reached=arrival;arrival=null;if(reached)onAction(reached);}}
        if(moving&&time-lastSample>1){lastSample=time;onPosition(player.group.position.x,player.group.position.z);}
        let closest=null,dist=3.2;for(const[id,p]of Object.entries(places)){const d=Math.hypot(p.x-player.group.position.x,p.z-player.group.position.z);if(d<dist){closest=id;dist=d;}}
        if(closest!==near){near=closest;onNear(near);}
      }
      player.animate(time,{moving,reduced:window.FK.reduced});
      for(const[id,r]of Object.entries(residents))r.animate(time,{action:near===id?'wave':'',mood:near===id?'joyful':'gentle',reduced:window.FK.reduced});
    }
    for(const tree of occluders){const p=player.group.position,hidden=area==='forest'&&tree.position.z>p.z&&tree.position.z<p.z+16&&Math.abs(tree.position.x-p.x)<2.6;tree.traverse(o=>{if(o.isMesh){o.material.opacity=hidden?.25:1;o.material.depthWrite=!hidden;}});}
    if(marker.visible)marker.rotation.y=Math.atan2(player.group.position.x-marker.position.x,player.group.position.z-marker.position.z);
    sway.forEach((m,i)=>{m.rotation.z=window.FK.reduced?0:Math.sin(time*.7+i)*.02;});if(!window.FK.reduced){motes.position.y=Math.sin(time*.35)*.35;motes.rotation.y=time*.012;for(const d of dust){d.position.y=Math.sin(time*.25)*.25;d.position.x=Math.sin(time*.13)*.4;}}ripples.forEach((m,i)=>{m.scale.setScalar(window.FK.reduced?1:1+Math.sin(time+i)*.12);});
    if(area==='forest'&&!anim){wanted.copy(player.group.position);wanted.y=1;focus.lerp(wanted,1-Math.exp(-dt*3));camera.position.copy(focus).add(cameraOffset);camera.lookAt(focus);}
    renderer.render(scene,camera);
    onProject((area==='forest'?hotspots:indoorHotspots[area]||[]).map(h=>({id:h.id,...project(h.point)})));
  }
  function resizeIfNeeded(){if(width!==canvas.clientWidth||height!==canvas.clientHeight)resize();}
  setArea('den');resize();raf=requestAnimationFrame(frame);
  return {setArea(next){setArea(next);resize();},route,pause(value){paused=value;if(value){blur();if(area==='forest')onPosition(player.group.position.x,player.group.position.z);}},steer(x,z){stick={x,z};if(!x&&!z&&area==='forest')onPosition(player.group.position.x,player.group.position.z);},
    sequence(item){destination=null;anim={item,elapsed:0};temporary.visible=true;player.group.position.set(0,.2,4);player.group.rotation.set(0,0,0);camera.position.set(0,4.5,12);camera.lookAt(0,1.2,4);if(item==='sleep'){player.group.position.set(-3.3,1.2,1.5);camera.position.set(-4,4.8,10);camera.lookAt(-4,1.6,1.5);}},
    skip(){anim=null;temporary.visible=false;player.group.rotation.z=0;},
    get diagnostics(){return {area,paused,time,keys:[...keys],destination:destination?.toArray(),position:{x:player.group.position.x,z:player.group.position.z}};},get area(){return area;},get position(){return {x:player.group.position.x,z:player.group.position.z};},
    dispose(){cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerup',pick);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});renderer.dispose();},
  };
}
