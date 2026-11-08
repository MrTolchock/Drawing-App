/* The explorable 3D forest in the reviewed paintings' style: warm low sun, painted-look canvas
   textures, leaf-card canopies, mossy rocks, a flowing brook and the painted characters standing in
   the world as sprites. Decoration is visual only; simple circles keep the fox out of trunks, rocks
   and water. Places mirror the painting, so the picture map stays truthful. */
import {THREE,paint,curveTube,limb,roundedBlock,paintedPath,seeded} from '../forest/materials.js';
import {characters} from './characters3d.js';

const TAU=Math.PI*2,FOX_H=1.6,SPEED=3.6;
const pin=(x,y)=>({pu:x/1024,pv:y/768});
export const forestPlaces={
  home:{x:0,z:-3.3,picture:'door',name:'Nach Hause',...pin(392,262)},
  shop:{x:6.6,z:-2.5,picture:'bag',name:'Zum Laden',...pin(600,240)},
  squirrel:{x:-8.2,z:-10.4,picture:'squirrel',name:'Zu Eichhörnchen',...pin(86,134)},
  bird:{x:-7.2,z:.9,picture:'bird',name:'Zu Blaumeise',...pin(98,390)},
  owl:{x:-4.0,z:-2.6,picture:'owl',name:'Zu Waldkauz',...pin(262,300)},
  beaver:{x:16.9,z:-1.4,picture:'beaver',name:'Zu Biber',...pin(792,352)},
  mouse:{x:7.0,z:5.3,picture:'mouse',name:'Zu Maus',...pin(852,532)},
};
export const forestExits={den:forestPlaces.home,shop:forestPlaces.shop};
const leafSpots=[[4,1.4],[-12.5,-3],[-4,-13.5],[3.5,-12],[9.2,-9.5],[18.5,-6],[19,3.5],[11,10.5],[2.5,10],[-5,12],[-13,8],[-15.5,-9]];
export const forestCollectibles=leafSpots.map((_,i)=>'goldleaf-'+(i+1));

const stream=[[12.6,-34],[12.1,-20],[12.3,-10],[13,-3],[13.6,4],[14.4,12],[15.8,24],[17,36]];
const solids=[[0,-8,3.05],[5.7,-5.3,1.05],[7.5,-5.3,1.05],[-5.2,-4.2,1],[-10.3,-.7,.55],[-11.6,-14.2,1.1],[8.6,6.8,.95],[-9.6,7.2,.75],[-7.8,7.2,.75],[19.4,-3.9,1.05],[-13.5,-5,1],[-5.5,-16,1],[5,-15.5,1],[-14,4,.9],[3.5,13.5,.9],[-3,15,.9],[17,-10.5,1],[19,7.5,1],[-2,9,.6],[9.6,1.2,.55],[-12,-9,.6]].map(([x,z,r])=>({x,z,r}));
const trails=[[[1.5,-2.6],[-3,-5.8],[-6.5,-8],[-8.2,-10.4],[-9.6,-17.5]],[[0,-1.4],[-4,-.5],[-7.2,.9],[-10.5,2.6]],[[1.5,-1],[.5,6],[-.5,17]],[[6,-2.8],[10.2,-3]],[[15.8,-3],[16.9,-1.4],[19.5,1]],[[1,1],[4.5,4.2],[7,5.3]]];
function segment(px,pz,ax,az,bx,bz){const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((px-ax)*dx+(pz-az)*dz)/(dx*dx+dz*dz||1)));return Math.hypot(px-ax-dx*t,pz-az-dz*t);}
function lineDistance(px,pz,line){let d=Infinity;for(let i=0;i<line.length-1;i++)d=Math.min(d,segment(px,pz,line[i][0],line[i][1],line[i+1][0],line[i+1][1]));return d;}
const onBridge=(x,z)=>x>10.2&&x<15.8&&Math.abs(z+3)<.95;
const inWater=(x,z)=>lineDistance(x,z,stream)<2.35&&!onBridge(x,z);
export function walkable(x,z){return Math.hypot(x-2,z+2)<19.6&&!inWater(x,z)&&solids.every(s=>Math.hypot(x-s.x,z-s.z)>s.r+.25);}
const onTrail=(x,z)=>trails.some(t=>lineDistance(x,z,t)<1.6)||((x-2.2)/6.6)**2+((z+2.4)/4.8)**2<1;
const deck=x=>.5*Math.sin(Math.PI*THREE.MathUtils.clamp((x-10.2)/5.6,0,1));
const groundY=(x,z)=>onBridge(x,z)?deck(x):0;

// Foliage between the camera and the fox dissolves (dithered) so it never hides the play area.
function nearFade(m){m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n float nearFade=clamp((9.5-vViewPosition.z)/4.5,0.0,1.0);if(nearFade>0.0&&fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453)<nearFade)discard;');};m.customProgramCacheKey=()=>'ff-near-fade';return m;}
function drawn(w,h,draw,{repeat=0,linear=false}={}){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=linear?THREE.NoColorSpace:THREE.SRGBColorSpace;if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeat,repeat);}t.anisotropy=4;return t;}
function blot(g,x,y,s,color,w,h){for(const dx of [-w,0,w])for(const dy of [-h,0,h]){const r=g.createRadialGradient(x+dx,y+dy,0,x+dx,y+dy,s);r.addColorStop(0,color);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(x+dx-s,y+dy-s,s*2,s*2);}}
function leaf(g,len,wid,c0,c1,c2){const gr=g.createLinearGradient(-len/2,0,len/2,0);gr.addColorStop(0,c0);gr.addColorStop(.55,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.beginPath();g.moveTo(-len/2,0);g.bezierCurveTo(-len*.2,-wid*.62,len*.25,-wid*.55,len/2,0);g.bezierCurveTo(len*.25,wid*.55,-len*.2,wid*.62,-len/2,0);g.fill();g.strokeStyle='rgba(55,95,30,.5)';g.lineWidth=Math.max(1,len/45);g.beginPath();g.moveTo(-len/2,0);g.lineTo(len/2-3,0);g.stroke();}
function crossQuad(){const g=new THREE.BufferGeometry(),p=[],uv=[],n=[],idx=[];for(const a of [0,Math.PI/2]){const c=Math.cos(a)*.5,s=Math.sin(a)*.5,b=p.length/3;p.push(-c,0,-s,c,0,s,c,1,s,-c,1,-s);uv.push(0,0,1,0,1,1,0,1);n.push(0,1,0,0,1,0,0,1,0,0,1,0);idx.push(b,b+1,b+2,b,b+2,b+3,b,b+2,b+1,b,b+3,b+2);}
  g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setIndex(idx);return g;}
function ribbon(points,width,y){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,y,z))),n=180,pos=[],uv=[],nor=[],idx=[];let dist=0,prev=null;
  for(let i=0;i<=n;i++){const p=curve.getPoint(i/n),t=curve.getTangent(i/n);if(prev)dist+=p.distanceTo(prev);prev=p;const l=Math.hypot(t.x,t.z)||1,nx=-t.z/l*width/2,nz=t.x/l*width/2;pos.push(p.x+nx,y,p.z+nz,p.x-nx,y,p.z-nz);uv.push(0,dist/6,1,dist/6);nor.push(0,1,0,0,1,0);if(i<n){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const ax=pos[3]-pos[0],az=pos[5]-pos[2],bx=pos[6]-pos[0],bz=pos[8]-pos[2];if(az*bx-ax*bz<0)for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setIndex(idx);return g;}

// Merge static meshes that share a material into one draw call each (trunks, roots, stall, bridge...).
function bake(root){root.updateMatrixWorld(true);const groups=new Map();
  root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.userData.keep)(groups.get(o.material)||groups.set(o.material,[]).get(o.material)).push(o);});
  for(const [material,list]of groups){if(list.length<2)continue;const pos=[],nor=[],uv=[];let cast=false,receive=false,order=0;
    for(const m of list){const g=(m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone()).applyMatrix4(m.matrixWorld);if(!g.attributes.normal)g.computeVertexNormals();const n=g.attributes.position.count;
      pos.push(...g.attributes.position.array);nor.push(...g.attributes.normal.array);if(g.attributes.uv)uv.push(...g.attributes.uv.array);else for(let i=0;i<n;i++)uv.push(0,0);cast||=m.castShadow;receive||=m.receiveShadow;order=Math.min(order,m.renderOrder);m.removeFromParent();}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    const merged=new THREE.Mesh(geo,material);merged.castShadow=cast;merged.receiveShadow=receive;merged.renderOrder=order;root.add(merged);}}
export function createForest({renderer,looks,texture,software,onPosition,onAction,onMove,onNear,onCollect,collected}){
  const rng=seeded(97),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,160);
  scene.background=new THREE.Color('#cdd39f');scene.fog=new THREE.Fog('#cdd39f',30,70);
  scene.add(new THREE.HemisphereLight('#ffe9c2','#6b5636',1.3));
  const sun=new THREE.DirectionalLight('#ffcf8c',2.6);sun.position.set(-11,21,-9);sun.target.position.set(2,0,-2);scene.add(sun,sun.target);
  if(!software){sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:80});sun.shadow.normalBias=.05;sun.shadow.bias=-.0004;}
  // Painted-look surfaces drawn once on canvases.
  const grassTex=drawn(512,512,(g,w,h)=>{g.fillStyle='#679a35';g.fillRect(0,0,w,h);for(let i=0;i<240;i++)blot(g,rng()*w,rng()*h,18+rng()*70,rng()<.5?'rgba(160,200,80,.2)':'rgba(55,95,28,.18)',w,h);
    for(let i=0;i<5200;i++){const x=rng()*w,y=rng()*h,l=4+rng()*9;g.strokeStyle=rng()<.5?'rgba(176,210,96,.5)':'rgba(50,90,28,.45)';g.lineWidth=1+rng()*1.3;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*4,y-l);g.stroke();}},{repeat:26});
  const dirtTex=drawn(512,512,(g,w,h)=>{g.fillStyle='#c27f4e';g.fillRect(0,0,w,h);for(let i=0;i<200;i++)blot(g,rng()*w,rng()*h,16+rng()*60,rng()<.5?'rgba(226,160,110,.22)':'rgba(140,82,48,.18)',w,h);
    for(let i=0;i<3200;i++){g.fillStyle=rng()<.5?'rgba(105,62,34,.35)':'rgba(238,190,146,.35)';g.fillRect(rng()*w,rng()*h,1+rng()*2,1+rng()*2);}
    for(let i=0;i<70;i++){const x=rng()*w,y=rng()*h,r=2+rng()*4;g.fillStyle='rgba(120,100,84,.65)';g.beginPath();g.ellipse(x,y,r*1.3,r,rng()*3,0,TAU);g.fill();g.fillStyle='rgba(240,225,205,.5)';g.beginPath();g.arc(x-r*.3,y-r*.3,r*.45,0,TAU);g.fill();}});
  const leafTex=drawn(256,256,(g)=>{for(let i=0;i<12;i++){const a=rng()*TAU,d=18+rng()*46;g.save();g.translate(128+Math.cos(a)*d*.6,128+Math.sin(a)*d*.6);g.rotate(a+(rng()-.5)*.6);leaf(g,74+rng()*40,34+rng()*14,'#4c862a','#7cb642','#b6dd6a');g.restore();}});
  const leafDepth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:leafTex,alphaTest:.5});
  const tuftTex=drawn(128,128,(g)=>{for(let i=0;i<22;i++){const x=64+(rng()-.5)*50,lean=(rng()-.5)*40,h=60+rng()*60;g.strokeStyle=['#5d9431','#7fb848','#9ccf5a'][i%3];g.lineWidth=3+rng()*3;g.lineCap='round';g.beginPath();g.moveTo(x,128);g.quadraticCurveTo(x+lean*.3,128-h*.6,x+lean,128-h);g.stroke();}});
  const lavenderTex=drawn(64,128,(g)=>{g.strokeStyle='#5d8a35';g.lineWidth=3;g.beginPath();g.moveTo(32,128);g.lineTo(32,40);g.stroke();for(let i=0;i<16;i++){const y=14+i*4.6,x=32+(i%2?5:-5);g.fillStyle=['#8a6fc9','#a084dc','#7259b5'][i%3];g.beginPath();g.ellipse(x,y,6,5,0,0,TAU);g.fill();}});
  const daisyTex=drawn(96,128,(g)=>{g.strokeStyle='#5d8a35';g.lineWidth=3;g.beginPath();g.moveTo(48,128);g.lineTo(48,40);g.stroke();g.fillStyle='#fffaf0';for(let i=0;i<10;i++){g.save();g.translate(48,34);g.rotate(i/10*TAU);g.beginPath();g.ellipse(0,-15,6,13,0,0,TAU);g.fill();g.restore();}g.fillStyle='#f2c33c';g.beginPath();g.arc(48,34,8,0,TAU);g.fill();});
  const fernTex=drawn(128,128,(g)=>{for(let f=0;f<5;f++){g.save();g.translate(64,126);g.rotate((f-2)*.42);for(let i=0;i<9;i++){const y=-12-i*11,s=16-i*1.4;g.fillStyle=i%2?'#6aa23a':'#4f8a2c';for(const side of [-1,1]){g.beginPath();g.ellipse(side*s*.7,y,s*.75,3.6,side*.5,0,TAU);g.fill();}}g.restore();}});
  const flowTex=drawn(128,256,(g,w,h)=>{g.fillStyle='#5ab3d6';g.fillRect(0,0,w,h);for(let i=0;i<60;i++)blot(g,rng()*w,rng()*h,10+rng()*30,rng()<.5?'rgba(140,215,235,.35)':'rgba(50,130,170,.25)',w,h);for(let i=0;i<70;i++){const x=rng()*w,y=rng()*h;g.strokeStyle='rgba(240,252,255,.55)';g.lineWidth=1.5+rng()*1.5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y+8,x+2,y+18+rng()*14);g.stroke();}});
  const ringTex=drawn(128,128,(g)=>{g.fillStyle='#e0b47c';g.fillRect(0,0,128,128);for(let r=8;r<64;r+=7){g.strokeStyle='rgba(150,96,52,.5)';g.lineWidth=2;g.beginPath();g.arc(64,64,r,0,TAU);g.stroke();}});
  const glowTex=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,236,170,1)');r.addColorStop(.35,'rgba(255,205,110,.55)');r.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  const softTex=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(48,30,14,.6)');r.addColorStop(1,'rgba(48,30,14,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  const dustTex=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(236,205,160,.85)');r.addColorStop(1,'rgba(236,205,160,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  const goldTex=drawn(128,128,(g)=>{g.translate(64,64);g.rotate(-.6);leaf(g,104,58,'#c98a14','#f2c23c','#fff0a0');g.strokeStyle='#a8700e';g.lineWidth=3;g.beginPath();g.moveTo(-52,0);g.lineTo(-62,4);g.stroke();});
  const starTex=drawn(32,32,(g)=>{g.fillStyle='#fff5c2';g.beginPath();for(let i=0;i<10;i++){const r=i%2?5:15,a=i/10*TAU-Math.PI/2;g.lineTo(16+Math.cos(a)*r,16+Math.sin(a)*r);}g.fill();});
  const butterflyTex=['#f29a3a','#7fb6e8','#f5d24a'].map(c=>drawn(64,48,(g)=>{g.fillStyle=c;for(const s of [-1,1]){g.beginPath();g.ellipse(32+s*14,16,13,12,s*.3,0,TAU);g.fill();g.beginPath();g.ellipse(32+s*11,33,9,8,-s*.3,0,TAU);g.fill();}g.fillStyle='rgba(255,255,255,.6)';for(const s of [-1,1]){g.beginPath();g.arc(32+s*16,13,3,0,TAU);g.fill();}g.fillStyle='#4a3424';g.fillRect(30,8,4,32);}));
  const grass=new THREE.MeshLambertMaterial({map:grassTex}),bark=paint('#9a5631','bark'),woodLight=paint('#d9985a','bark'),cream=paint('#f2e4c6'),moss=paint('#6f9c35'),red=paint('#c63a2c');
  const barks=new Map();function barkTiled(rx,ry){const key=rx+'x'+ry;if(!barks.has(key)){const m=bark.clone();m.map=bark.map.clone();m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;m.map.repeat.set(rx,ry);m.map.needsUpdate=true;barks.set(key,m);}return barks.get(key);}
  function mesh(geometry,material,parent=scene){const m=new THREE.Mesh(geometry,material);m.castShadow=m.receiveShadow=!software;parent.add(m);return m;}
  const ground=mesh(new THREE.PlaneGeometry(130,130),grass);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
  // Terracotta trails and the plaza in front of the home tree.
  let trailMaterial=null;for(const t of trails){const m=paintedPath(t.map(([x,z])=>({x,z})),1.3);trailMaterial=trailMaterial||new THREE.MeshLambertMaterial({map:dirtTex,alphaMap:m.material.alphaMap,transparent:true,depthWrite:false});m.material=trailMaterial;m.receiveShadow=true;scene.add(m);}
  {const plazaTex=dirtTex.clone();plazaTex.wrapS=plazaTex.wrapT=THREE.RepeatWrapping;plazaTex.repeat.set(3,3);plazaTex.needsUpdate=true;const fade=drawn(128,128,(g)=>{const r=g.createRadialGradient(64,64,30,64,64,64);r.addColorStop(0,'#fff');r.addColorStop(.72,'#fff');r.addColorStop(1,'#000');g.fillStyle=r;g.fillRect(0,0,128,128);},{linear:true});
   const plaza=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshLambertMaterial({map:plazaTex,alphaMap:fade,transparent:true,depthWrite:false}));plaza.rotation.x=-Math.PI/2;plaza.scale.set(6.6,4.8,1);plaza.position.set(2.2,.045,-2.4);plaza.receiveShadow=true;plaza.renderOrder=-3;scene.add(plaza);}
  // Brook with wet banks and a flowing surface.
  {const bank=new THREE.Mesh(ribbon(stream,6,.02),new THREE.MeshLambertMaterial({color:'#7d6a45'}));bank.receiveShadow=true;scene.add(bank);
   const water=new THREE.Mesh(ribbon(stream,4.6,.06),new THREE.MeshLambertMaterial({map:flowTex,transparent:true,opacity:.94}));water.receiveShadow=true;scene.add(water);}
  // Instanced foliage collected while building.
  const blobMaterial=nearFade(paint('#477f27').clone()),leafCards=[],heroCards=[],blobs=[],dummy=new THREE.Object3D(),tmp=new THREE.Color();
  function cluster(cx,cy,cz,R,list=leafCards){dummy.position.set(cx,cy,cz);dummy.rotation.set(0,0,0);dummy.scale.setScalar(R*.6);dummy.updateMatrix();blobs.push(dummy.matrix.clone());
    const count=Math.round(10+R*11);for(let i=0;i<count;i++){let x=rng()*2-1,y=rng()*1.6-.45,z=rng()*2-1;const l=Math.hypot(x,y,z)||1;x/=l;y/=l;z/=l;const d=R*(.55+rng()*.4);
      dummy.position.set(cx+x*d,cy+y*d,cz+z*d);dummy.lookAt(cx+x*d*2,cy+y*d*2,cz+z*d*2);dummy.rotateZ(rng()*TAU);dummy.scale.setScalar(R*(.82+rng()*.38));dummy.updateMatrix();
      tmp.setHSL(.23+rng()*.05,.55,.5+Math.max(0,y)*.18+rng()*.1);list.push({matrix:dummy.matrix.clone(),color:tmp.clone()});}}
  function tree(x,z,s,far=false){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const m=barkTiled(1,2);
    limb(g,m,[0,0,0],[0,4.4*s,0],.55*s,.34*s);for(let i=0;i<5;i++){const a=i*1.26+rng();curveTube(g,m,[[Math.cos(a)*.3*s,.6*s,Math.sin(a)*.3*s],[Math.cos(a)*1.1*s,.15*s,Math.sin(a)*1.1*s],[Math.cos(a)*1.7*s,0,Math.sin(a)*1.7*s]],.17*s);}
    for(const [ox,oy,oz,r]of far?[[0,5.3,0,2.2],[-1.3,4.9,.6,1.6],[1.4,5,-.2,1.6]]:[[0,5.4,0,1.9],[-1.4,4.8,.5,1.4],[1.4,5,-.3,1.5],[0,4.7,1.3,1.3],[.2,6.3,-.6,1.3]])cluster(x+ox*s,oy*s,z+oz*s,r*s);}
  function bush(x,z,k){cluster(x,.5*k,z,.75*k);}
  // Home tree: flared trunk, roots, glowing round door, lanterns and mushrooms.
  const homeBark=barkTiled(4,3);{const g=new THREE.Group();g.position.set(0,0,-8);scene.add(g);
    mesh(new THREE.LatheGeometry([[2.85,0],[2.6,.3],[2.45,.8],[2.38,1.6],[2.3,2.6],[2.15,4],[1.95,5.3],[1.6,6.4],[1.2,7.3],[1,7.8]].map(([r,y])=>new THREE.Vector2(r,y)),32),homeBark,g);
    for(let i=0;i<8;i++){const a=i/8*TAU+.2;if(Math.abs(Math.atan2(Math.sin(a-Math.PI/2),Math.cos(a-Math.PI/2)))<.5)continue;curveTube(g,homeBark,[[Math.cos(a)*2.1,1.7,Math.sin(a)*2.1],[Math.cos(a)*3.1,.6,Math.sin(a)*3.1],[Math.cos(a)*4.1,.05,Math.sin(a)*4.1]],.55);}
    for(let i=0;i<5;i++){const a=i/5*TAU+.6;curveTube(g,homeBark,[[0,5.8,0],[Math.cos(a)*1.9,7.2,Math.sin(a)*1.9],[Math.cos(a)*3.8,8.1,Math.sin(a)*3.8]],.48);}
    for(const [ox,oy,oz,r]of [[0,9.6,0,3.4],[-3.3,8.6,1.8,2.6],[3.4,8.8,1.6,2.7],[-1.6,9,-2.9,2.6],[2.3,9.3,-2.7,2.6],[0,8.3,3.6,2.5],[-5,7.8,-.4,2.2],[5.1,8,-.6,2.2],[-2.4,7.9,4.2,1.8],[2.6,8.1,4,1.8]])cluster(ox,oy,oz-8,r,heroCards);
    const doorTex=drawn(128,192,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ffd88a');gr.addColorStop(1,'#d97e2c');c.fillStyle=gr;c.fillRect(0,0,w,h);c.fillStyle='#7b4422';c.fillRect(8,64,36,104);c.fillStyle='#b65a30';for(let y=74;y<160;y+=20)c.fillRect(11,y,30,12);c.fillStyle='#e0a050';c.fillRect(70,110,44,40);c.fillStyle='#c4433a';c.beginPath();c.ellipse(70,178,44,10,0,0,TAU);c.fill();c.fillStyle='rgba(255,246,205,.95)';c.beginPath();c.arc(86,48,11,0,TAU);c.fill();});
    const arch=new THREE.Shape();arch.moveTo(-.8,0);arch.lineTo(-.8,1.4);arch.absarc(0,1.4,.8,Math.PI,0,true);arch.lineTo(.8,0);arch.lineTo(-.8,0);const shape=new THREE.ShapeGeometry(arch,16),uv=shape.attributes.uv,pos=shape.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+.8)/1.6,pos.getY(i)/2.2);
    const door=new THREE.Mesh(shape,new THREE.MeshBasicMaterial({map:doorTex,toneMapped:false}));door.position.set(0,.28,2.69);g.add(door);
    const frame=mesh(new THREE.TorusGeometry(.86,.13,8,24,Math.PI),woodLight,g);frame.position.set(0,1.68,2.74);for(const s of [-1,1])limb(g,woodLight,[s*.86,.28,2.74],[s*.86,1.68,2.74],.13);
    mesh(new THREE.CylinderGeometry(1,1,.12,24,1,false,0,Math.PI),woodLight,g).position.set(0,.22,2.7);
    for(const [mx,my,mz,k]of [[-2.1,1.8,1.05,1],[-2.3,1.4,.55,.8],[-1.85,2.2,1.4,.7]]){limb(g,cream,[mx+.2,my-.2,mz],[mx,my,mz],.07*k);const cap=mesh(new THREE.SphereGeometry(.38*k,14,8,0,TAU,0,Math.PI/2),paint('#d8ae80'),g);cap.position.set(mx,my,mz);cap.scale.y=.6;}
    const light=new THREE.PointLight('#ffb760',8,9,2);light.position.set(0,1.4,3.6);g.add(light);}
  const doormat=mesh(roundedBlock(1.8,.04,.9,.05),paint('#d8b071'));doormat.position.set(0,.03,-4.75);
  // Market stall with striped awning, apples, cushions and a lantern.
  {const g=new THREE.Group();g.position.set(6.6,0,-5.2);scene.add(g);
    mesh(roundedBlock(3.2,1.05,1.1,.08),woodLight,g).position.set(0,.53,.4);mesh(roundedBlock(3.4,.12,1.3,.06),paint('#b97a45','bark'),g).position.set(0,1.1,.4);
    mesh(roundedBlock(3.2,.1,.5,.04),woodLight,g).position.set(0,1.8,-.45);for(let i=0;i<4;i++){const jar=mesh(new THREE.CylinderGeometry(.13,.13,.3,10),paint(['#e8d5a8','#c6a46a','#9fbf8a','#e8d5a8'][i]),g);jar.position.set(-1.1+i*.7,2.0,-.45);}
    for(const sx of [-1.6,1.6])for(const sz of [-.75,.95])limb(g,woodLight,[sx,0,sz],[sx,2.65,sz],.09);
    for(let i=0;i<7;i++){const stripe=mesh(roundedBlock(.5,.06,1.95,.02),paint(i%2?'#f4ecd6':'#5f9433'),g);stripe.position.set(-1.5+i*.5,2.82,.25);stripe.rotation.x=.34;}
    for(let i=0;i<7;i++){const s=mesh(new THREE.CylinderGeometry(.25,.25,.06,12,1,false,0,Math.PI),paint(i%2?'#f4ecd6':'#5f9433'),g);s.rotation.set(Math.PI/2,0,Math.PI);s.position.set(-1.5+i*.5,2.5,1.17);}
    for(let i=0;i<5;i++)mesh(new THREE.SphereGeometry(.13,10,8),red,g).position.set(-1.1+i*.22,1.28,.55+(i%2)*.15);
    mesh(roundedBlock(.9,.55,.7,.05),woodLight,g).position.set(2.15,.3,1.05);for(let i=0;i<6;i++)mesh(new THREE.SphereGeometry(.14,10,8),red,g).position.set(1.85+(i%3)*.3,.66,.92+Math.floor(i/3)*.28);
    for(const [cx,cz,c]of [[-1.3,1.9,'#8faa49'],[-.2,2.1,'#e0b54d']]){const c1=mesh(new THREE.SphereGeometry(.45,16,10),paint(c),g);c1.position.set(cx,.22,cz);c1.scale.y=.45;}
    mesh(roundedBlock(2.6,.03,1.5,.05),paint('#d8b071'),g).position.set(-.6,.02,1.95);}
  // Arched bridge with rails.
  {for(let i=0;i<15;i++){const x=10.3+i*.38,y=deck(x)+.07,slope=deck(x+.2)-deck(x-.2);const p=mesh(roundedBlock(.34,.12,2.1,.04),woodLight);p.position.set(x,y,-3);p.rotation.z=Math.atan2(slope,.4);}
   for(const z of [-4.02,-1.98]){const tops=[];for(let i=0;i<=4;i++){const x=10.3+i*1.35,y=deck(x);limb(scene,bark,[x,y,z],[x,y+1.05,z],.09);tops.push([x,y+1,z]);}curveTube(scene,woodLight,tops,.075);}}
  // Mossy rocks (smooth spheres pushed out by position noise, moss on the tops).
  const rockGeo=new THREE.SphereGeometry(1,18,12);{const p=rockGeo.attributes.position,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=1+.14*Math.sin(v.x*3.1+v.y*1.7)+.1*Math.sin(v.z*4.3-v.x*2.2)+.06*Math.sin(v.y*7.1);v.multiplyScalar(n);p.setXYZ(i,v.x,v.y,v.z);}rockGeo.computeVertexNormals();const n=rockGeo.attributes.normal,c=[];for(let i=0;i<n.count;i++){const top=THREE.MathUtils.smoothstep(n.getY(i),.45,.85);c.push(.5-top*.16,.48+top*.06,.44-top*.22);}rockGeo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));}
  const rocks=[[-5.2,-4.2,1.05,.7],[-2,9,.65,.55],[9.6,1.2,.6,.5],[-12,-9,.65,.55]];
  for(let z=-30;z<34;z+=1.7){if(Math.abs(z+3)<1.6)continue;for(const side of [-1,1])if(rng()<.8)rocks.push([lineCenter(z)+side*(2.45+rng()*.6),z+rng()*.8,.3+rng()*.4,.6]);}
  function lineCenter(z){for(let i=0;i<stream.length-1;i++){const a=stream[i],b=stream[i+1];if(z>=a[1]&&z<=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);}return stream[0][0];}
  for(let i=0;i<400&&rocks.length<70;i++){const x=-22+rng()*44,z=-22+rng()*44;if(!onTrail(x,z)&&!inWater(x,z)&&Math.hypot(x-2,z+2)>8&&solids.every(s=>Math.hypot(x-s.x,z-s.z)>s.r+1))rocks.push([x,z,.25+rng()*.35,.6]);}
  {const im=new THREE.InstancedMesh(rockGeo,new THREE.MeshLambertMaterial({vertexColors:true}),rocks.length);rocks.forEach(([x,z,k,f],i)=>{dummy.position.set(x,k*.38,z);dummy.rotation.set(0,i*1.7,0);dummy.scale.set(k*1.15,k*f,k);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);});im.castShadow=im.receiveShadow=!software;scene.add(im);}
  // Trees, bushes and the forest edge.
  for(const [x,z]of [[-11.6,-14.2],[-13.5,-5],[-5.5,-16],[5,-15.5],[-14,4],[3.5,13.5],[-3,15],[17,-10.5],[19,7.5]])tree(x,z,1.05+rng()*.25);
  {const g=new THREE.Group();scene.add(g);const m=barkTiled(1,2);limb(g,m,[-10.3,0,-.7],[-10.3,3.3,-.7],.36,.22);curveTube(g,m,[[-10.25,2.0,-.65],[-9.3,2.2,-.4],[-8.2,2.42,-.2]],.09);cluster(-10.4,4.2,-.8,1.6);cluster(-7.9,2.95,-.45,.6);}
  for(let i=0;i<40;i++){const a=i/40*TAU+rng()*.1,r=24+rng()*9;tree(2+Math.cos(a)*r,-2+Math.sin(a)*r,1.15+rng()*.5,true);}
  for(let i=0;i<500&&blobs.length<420;i++){const a=rng()*TAU,r=8+rng()*13,x=2+Math.cos(a)*r,z=-2+Math.sin(a)*r;if(!onTrail(x,z)&&!inWater(x,z)&&walkable(x,z)&&Math.hypot(x,z+8)>4.5)bush(x,z,.6+rng()*.5);}
  function cards(list,shadow){const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),nearFade(new THREE.MeshLambertMaterial({map:leafTex,alphaTest:.5,side:THREE.DoubleSide,transparent:false})),list.length);list.forEach((c,i)=>{im.setMatrixAt(i,c.matrix);im.setColorAt(i,c.color);});im.castShadow=shadow&&!software;im.receiveShadow=!software;im.customDepthMaterial=leafDepth;scene.add(im);return im;}
  cards(leafCards,true);const hero=cards(heroCards,true);
  // Ground cover: grass, lavender, daisies, ferns.
  const cover=[[tuftTex,520,[.7,.55],26],[lavenderTex,90,[.38,.8],18],[daisyTex,110,[.42,.5],20],[fernTex,80,[1.0,.75],22]];
  for(const [tex,count,[w,h],range]of cover){const spots=[];for(let i=0;i<count*6&&spots.length<count;i++){const x=2+(rng()*2-1)*range,z=-2+(rng()*2-1)*range;if(!onTrail(x,z)&&!inWater(x,z)&&solids.every(s=>Math.hypot(x-s.x,z-s.z)>s.r+.2))spots.push([x,z]);}
    const im=new THREE.InstancedMesh(crossQuad(),new THREE.MeshLambertMaterial({map:tex,alphaTest:.45}),spots.length);spots.forEach(([x,z],i)=>{const k=.7+rng()*.6;dummy.position.set(x,0,z);dummy.rotation.set(0,rng()*TAU,0);dummy.scale.set(w*k,h*k,w*k);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);});im.receiveShadow=!software;scene.add(im);}
  // Friends' places: owl stone (a rock above), squirrel's acorns, mouse stump, log, beaver lodge.
  {for(let i=0;i<5;i++)mesh(new THREE.SphereGeometry(.09,8,6),paint('#8a5a2c'),scene).position.set(-9.0+i*.22,.08,-11.9+(i%2)*.2);
   const stump=mesh(new THREE.CylinderGeometry(.75,.9,.62,18),barkTiled(3,1));stump.position.set(8.6,.31,6.8);const top=new THREE.Mesh(new THREE.CircleGeometry(.75,24),new THREE.MeshLambertMaterial({map:ringTex}));top.rotation.x=-Math.PI/2;top.position.set(8.6,.625,6.8);scene.add(top);
   mesh(roundedBlock(.42,.1,.3,.02),paint('#b5443a'),scene).position.set(8.2,.68,6.55);mesh(roundedBlock(.4,.09,.28,.02),paint('#6d9a4a'),scene).position.set(8.2,.78,6.55);
   const log=mesh(new THREE.CylinderGeometry(.55,.6,4,16),barkTiled(4,1));log.rotation.z=Math.PI/2;log.position.set(-8.7,.55,7.2);const mossTop=mesh(new THREE.SphereGeometry(1,16,10),moss);mossTop.scale.set(1.9,.22,.5);mossTop.position.set(-8.9,1.02,7.1);
   for(const s of [-1,1]){const cap=new THREE.Mesh(new THREE.CircleGeometry(.56,20),new THREE.MeshLambertMaterial({map:ringTex}));cap.rotation.y=s*Math.PI/2;cap.position.set(-8.7+s*2.01,.55,7.2);scene.add(cap);}
   for(let i=0;i<16;i++){const a=i/16*Math.PI,r=1.05;limb(scene,bark,[19.4+Math.cos(a)*r,0,-3.9+Math.sin(a*2)*.4],[19.4+Math.cos(a)*.15,.9+rng()*.3,-3.9],.08);}}
  // Lanterns: glowing lamps with halos.
  const halos=[];function lantern(x,y,z){const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.3,10),new THREE.MeshBasicMaterial({color:'#ffd47e',toneMapped:false}));lamp.position.set(x,y,z);scene.add(lamp);const cap=mesh(new THREE.ConeGeometry(.2,.16,8),paint('#5e3f27'));cap.position.set(x,y+.23,z);const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));halo.position.set(x,y,z);halo.scale.setScalar(1.3);halo.renderOrder=5;scene.add(halo);halos.push(halo);}
  lantern(-1.45,1.6,-5.35);lantern(1.45,1.6,-5.35);lantern(8.2,2.25,-4.2);lantern(8.35,.9,6.5);
  {const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,14,10),blobMaterial,blobs.length);blobs.forEach((m,i)=>im.setMatrixAt(i,m));im.castShadow=!software;scene.add(im);}
  bake(scene);
  // Sprites: painted characters, collectibles, butterflies, dust.
  function sprite(map,h,order=2,anchor=0){const s=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,toneMapped:false,depthWrite:false,alphaTest:.02}));s.center.set(.5,anchor);s.renderOrder=order;s.userData.h=h;scene.add(s);return s;}
  function size(s,h=s.userData.h,flip=1){const img=s.material.map.image,a=img&&img.width?img.width/img.height:1;s.scale.set(h*a*flip,h,1);}
  function contact(x,z,r,y=.03,o=1){const m=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshBasicMaterial({map:softTex,transparent:true,depthWrite:false,opacity:o,toneMapped:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.scale.setScalar(r);m.renderOrder=1;scene.add(m);return m;}
  const friends={squirrel:{at:[-9.4,0,-12.3],yaw:.35,h:1.15},bird:{at:[-8.5,2.38,-.25],yaw:.4,h:.6},owl:{at:[-5.2,1.0,-4.2],yaw:.55,h:1.25},mouse:{at:[8.72,.62,6.88],yaw:-.55,h:1.1},beaver:{at:[18.2,0,-2.4],yaw:-1.2,h:1.2}};
  for(const [id,f]of Object.entries(friends)){f.rig=characters[id](f.h);f.rig.group.position.set(...f.at);f.rig.group.rotation.y=f.yaw;scene.add(f.rig.group);if(f.at[1]===0)contact(f.at[0],f.at[2],f.h*.42);}
  const foxRig=characters.fox(FOX_H),fox=foxRig.group,foxShadow=contact(0,0,.42,.04,1),pos=new THREE.Vector3(forestPlaces.home.x,0,forestPlaces.home.z),vel=new THREE.Vector2();scene.add(fox);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.4,.52,32),new THREE.MeshBasicMaterial({color:'#fff3c4',transparent:true,opacity:.85,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.visible=false;ring.renderOrder=1;scene.add(ring);
  const golden=leafSpots.map(([x,z],i)=>{const s=sprite(goldTex,.55,3,.5),h=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));h.scale.setScalar(1.4);h.renderOrder=2;scene.add(h);size(s);return {id:forestCollectibles[i],x,z,sprite:s,halo:h,taken:false};});
  const sparks=Array.from({length:10},()=>{const s=sprite(starTex,.22,6,.5);size(s);s.visible=false;return {s,v:new THREE.Vector3(),life:0};});
  const butterflies=Array.from({length:8},(_,i)=>{const s=sprite(butterflyTex[i%3],.32,4,.5);const home=[[-6,4],[3,7],[-9,-7],[9,-1],[-2,-11],[15,6],[-13,0],[5,-9]][i];return {s,hx:home[0],hz:home[1],x:home[0],z:home[1],y:1,phase:rng()*TAU,flee:0};});
  const puffs=Array.from({length:10},()=>{const s=sprite(dustTex,.4,1,.5);s.visible=false;return {s,life:0};});
  const motes=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:240},(_,i)=>i%3===1?.6+rng()*5:(rng()*2-1)*24+(i%3===0?2:-2)),3)),new THREE.PointsMaterial({size:.28,map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.75}));scene.add(motes);
  const pinPoints={home:[0,3.75,-5.3],shop:[6.6,3.55,-4.3],squirrel:[-9.4,1.75,-12.3],bird:[-8.55,3.35,-.25],owl:[-5.2,2.55,-4.2],beaver:[18.2,2.35,-2.4],mouse:[8.7,2.2,6.88]};
  const pins=Object.entries(pinPoints).map(([id,p])=>({id,point:new THREE.Vector3(...p)}));
  // Movement, routes and camera.
  let destination=null,path=[],arrival=null,near=null,facing='front',flip=1,lastSample=0,lastPuff=0,narrow=false,width=1,height=1;
  const focus=new THREE.Vector3(),raycaster=new THREE.Raycaster(),floor=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  const hubs=[[9.8,-3],[13,-3],[16.2,-3],[2,-2.4]];for(const s of solids)if(Math.hypot(s.x-2,s.z+2)<19)for(let i=0;i<8;i++){const a=i/8*TAU;hubs.push([s.x+Math.cos(a)*(s.r+.8),s.z+Math.sin(a)*(s.r+.8)]);}
  const hubPoints=hubs.filter(([x,z])=>walkable(x,z)).map(([x,z])=>new THREE.Vector3(x,0,z));
  function clear(a,b,skipStart=false){const d=Math.hypot(b.x-a.x,b.z-a.z),n=Math.max(2,Math.ceil(d/.3));for(let i=skipStart?1:0;i<=n;i++){const t=i/n;if(skipStart&&t*d<.35)continue;if(!walkable(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false;}return true;}
  function plan(target){if(clear(pos,target,true))return [target];const points=[pos.clone().setY(0),target,...hubPoints],cost=points.map(()=>Infinity),previous=[],visited=new Set();cost[0]=0;
    while(visited.size<points.length){let next=-1;for(let i=0;i<points.length;i++)if(!visited.has(i)&&(next<0||cost[i]<cost[next]))next=i;if(next<0||!Number.isFinite(cost[next])||next===1)break;visited.add(next);
      for(let i=0;i<points.length;i++){if(visited.has(i))continue;const c=cost[next]+points[next].distanceTo(points[i]);if(c>=cost[i]||!clear(points[next],points[i],next===0))continue;cost[i]=c;previous[i]=next;}}
    if(!Number.isFinite(cost[1]))return null;const route=[];let cursor=1;while(cursor!==0){route.unshift(points[cursor]);cursor=previous[cursor];}return route;}
  function nearestWalkable(p){if(walkable(p.x,p.z))return new THREE.Vector3(p.x,0,p.z);for(let r=.3;r<6;r+=.3)for(let i=0;i<16;i++){const a=i/16*TAU,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(walkable(x,z))return new THREE.Vector3(x,0,z);}return pos.clone().setY(0);}
  function walkTo(target,id=null){target=nearestWalkable(target);const route=plan(target);if(!route){onMove({event:'route_failure',reason:'blocked',area:'forest',destination:id});return;}path=route;destination=path.shift();arrival=id;ring.position.set(target.x,groundY(target.x,target.z)+.05,target.z);ring.visible=true;onMove({event:'movement_destination',destination:id,x:target.x,z:target.z,area:'forest'});}
  function snapCamera(){focus.set(pos.x,0,pos.z);placeCamera(1);}
  function placeCamera(k){const off=narrow?[0,10,14.4]:[0,9,14];camera.position.lerp(new THREE.Vector3(focus.x+off[0],focus.y+off[1],focus.z+off[2]),k);camera.lookAt(focus.x,focus.y+1.4,focus.z-3.2);}
  function setCollected(map){for(const g of golden){g.taken=!!map[g.id];g.sprite.visible=g.halo.visible=!g.taken;}}
  function collect(g){g.taken=true;g.sprite.visible=g.halo.visible=false;sparks.forEach((p,i)=>{p.s.visible=true;p.life=.8;p.s.position.set(g.x,.7,g.z);const a=i/sparks.length*TAU;p.v.set(Math.cos(a)*2.2,2.6+Math.sin(i*1.7)*.8,Math.sin(a)*2.2);});onCollect(g.id);}
  function update(dt,time,{keys,stick}){
    const reduced=window.FK.reduced;let dx=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'))+stick.x,dz=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'))+stick.z;
    const manual=Math.hypot(dx,dz)>0,want=new THREE.Vector2();
    if(manual){destination=null;path=[];arrival=null;ring.visible=false;want.set(dx,dz).normalize().multiplyScalar(SPEED*Math.min(1,Math.hypot(dx,dz)));}
    else if(destination){let ddx=destination.x-pos.x,ddz=destination.z-pos.z,d=Math.hypot(ddx,ddz);
      while(path.length&&d<.55){destination=path.shift();ddx=destination.x-pos.x;ddz=destination.z-pos.z;d=Math.hypot(ddx,ddz);}
      if(!path.length&&d<.1){destination=null;ring.visible=false;vel.set(0,0);onPosition(pos.x,pos.z);const reached=arrival;arrival=null;if(reached)onAction(reached);}
      else{const sp=SPEED*(path.length?1:Math.min(1,.25+d/1.2));want.set(ddx/d*sp,ddz/d*sp);}}
    vel.lerp(want,1-Math.exp(-dt*(want.lengthSq()?9:12)));const speed=vel.length(),moving=speed>.15;
    if(speed>.02){const nx=pos.x+vel.x*dt,nz=pos.z+vel.y*dt;if(walkable(nx,nz)){pos.x=nx;pos.z=nz;}else if(walkable(nx,pos.z)){pos.x=nx;vel.y*=.5;}else if(walkable(pos.x,nz)){pos.z=nz;vel.x*=.5;}else vel.multiplyScalar(.5);
      if(speed>.2){const target=Math.atan2(vel.x,vel.y);let diff=target-fox.rotation.y;diff=Math.atan2(Math.sin(diff),Math.cos(diff));fox.rotation.y+=diff*(1-Math.exp(-dt*12));}}
    if(moving&&time-lastSample>1){lastSample=time;onPosition(pos.x,pos.z);}
    let closest=null,best=3.2;for(const [id,p]of Object.entries(forestPlaces)){const d=Math.hypot(p.x-pos.x,p.z-pos.z);if(d<best){closest=id;best=d;}}if(closest!==near){near=closest;onNear(near);}
    const base=groundY(pos.x,pos.z);fox.position.set(pos.x,base,pos.z);
    foxRig.update(dt,{moving,speed,reduced});
    foxShadow.position.set(pos.x,base+.04,pos.z);foxShadow.scale.setScalar(.42);
    // Dust puffs while walking.
    if(moving&&!reduced&&time-lastPuff>.17){lastPuff=time;const p=puffs.find(q=>q.life<=0);if(p){p.life=.55;p.s.visible=true;p.s.position.set(pos.x+(rng()-.5)*.3,base+.12,pos.z+.15);}}
    for(const p of puffs)if(p.life>0){p.life-=dt;const k=1-p.life/.55;size(p.s,.25+k*.45);p.s.material.opacity=.5*(1-k);p.s.position.y+=dt*.25;if(p.life<=0)p.s.visible=false;}
    // Collectibles.
    for(const g of golden){if(g.taken)continue;const bob=reduced?0:Math.sin(time*2.4+g.x)*.12;g.sprite.position.set(g.x,.75+bob,g.z);g.sprite.material.rotation=reduced?0:Math.sin(time*1.6+g.z)*.4;g.halo.position.copy(g.sprite.position);g.halo.material.opacity=.55+Math.sin(time*3+g.x)*.2;if(Math.hypot(g.x-pos.x,g.z-pos.z)<1.1)collect(g);}
    for(const p of sparks)if(p.life>0){p.life-=dt;p.v.y-=6*dt;p.s.position.addScaledVector(p.v,dt);p.s.material.opacity=Math.min(1,p.life*2);p.s.material.rotation+=dt*6;if(p.life<=0)p.s.visible=false;}
    // Friends: gentle idle, a happy hop when the fox arrives.
    for(const [id,f]of Object.entries(friends))f.rig.update(dt,{action:near===id?(id==='bird'||id==='owl'?'wave':'hop'):'',reduced});
    // Butterflies wander and flutter away from the fox.
    for(const b of butterflies){const t=time*.55+b.phase,d=Math.hypot(b.x-pos.x,b.z-pos.z);if(d<2.2)b.flee=1.2;b.flee=Math.max(0,b.flee-dt);
      const tx=b.hx+Math.sin(t)*2.2+(b.flee?(b.x-pos.x)/(d||1)*3:0),tz=b.hz+Math.cos(t*1.3)*1.6+(b.flee?(b.z-pos.z)/(d||1)*3:0);b.x+=(tx-b.x)*Math.min(1,dt*(b.flee?2.5:.8));b.z+=(tz-b.z)*Math.min(1,dt*(b.flee?2.5:.8));b.y=1+Math.sin(t*2.3)*.35+(b.flee?.8:0);
      b.s.position.set(b.x,b.y,b.z);const flap=reduced?1:.25+Math.abs(Math.cos(time*14+b.phase))*.75;b.s.scale.set(.42*flap,.32,1);}
    for(const h of halos)h.material.opacity=reduced?.8:.72+Math.sin(time*7+h.position.x)*.08;
    if(!reduced){flowTex.offset.y-=dt*.22;motes.position.y=Math.sin(time*.35)*.3;motes.rotation.y=time*.01;}
    if(ring.visible)ring.material.opacity=.55+Math.sin(time*4)*.25;
    // Fade the home canopy when the fox walks behind the trunk.
    const behind=pos.z<-9.4&&Math.abs(pos.x)<5.5;hero.material.opacity+=((behind?.3:1)-hero.material.opacity)*Math.min(1,dt*5);hero.material.transparent=hero.material.opacity<.99;hero.material.depthWrite=!hero.material.transparent;
    focus.lerp(new THREE.Vector3(pos.x+vel.x*.35,base*.5,pos.z+vel.y*.35),reduced?1:1-Math.exp(-dt*2.6));placeCamera(1);
  }
  return {scene,camera,
    enter(position){const p=position&&walkable(position.x,position.z)?position:forestPlaces.home;pos.set(p.x,0,p.z);vel.set(0,0);fox.rotation.y=0;destination=null;path=[];arrival=null;ring.visible=false;near=null;setCollected(collected());snapCamera();renderer.shadowMap.needsUpdate=true;},
    resize(w,h){width=w;height=h;narrow=w<600;camera.aspect=w/Math.max(1,h);camera.fov=narrow?54:42;camera.updateProjectionMatrix();snapCamera();},
    update,route(id){const p=forestPlaces[id];if(p)walkTo(new THREE.Vector3(p.x,0,p.z),id);},
    pick(x,y){raycaster.setFromCamera(new THREE.Vector2(x,y),camera);const hit=new THREE.Vector3();if(raycaster.ray.intersectPlane(floor,hit))walkTo(hit);},

    stop(){destination=null;path=[];arrival=null;ring.visible=false;vel.set(0,0);},
    pins(){return pins.map(p=>{const q=p.point.clone().project(camera);return {id:p.id,x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z<1&&Math.abs(q.x)<1.02&&q.y>-1.02&&q.y<1.12};});},
    get position(){return {x:pos.x,z:pos.z};},get destination(){return destination;},get near(){return near;},
  };
}
