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

// Foliage between the camera and the fox dissolves (ordered dither) so it never hides the play area;
// foliage elsewhere stays whole, and only leaves right at the lens clear everywhere.
const foxView={value:new THREE.Vector3(0,0,-16)};
function nearFade(m){m.onBeforeCompile=sh=>{sh.uniforms.ffFox=foxView;sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 ffFox;\nfloat ffBayer2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}\nfloat ffBayer4(vec2 a){return ffBayer2(.5*a)*.25+ffBayer2(a);}')
  .replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n vec3 ffP=-vViewPosition;float ffLine=smoothstep(.962,.973,dot(normalize(ffP),normalize(ffFox)))*smoothstep(ffFox.z+.8,ffFox.z+1.8,ffP.z);\n float nearFade=max(ffLine,clamp((6.0-vViewPosition.z)/1.2,0.0,1.0));if(nearFade>0.0&&ffBayer4(gl_FragCoord.xy)+.03<nearFade)discard;');};m.customProgramCacheKey=()=>'ff-near-fade-2';return m;}
function drawn(w,h,draw,{repeat=0,linear=false}={}){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=linear?THREE.NoColorSpace:THREE.SRGBColorSpace;if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeat,repeat);}t.anisotropy=4;return t;}
function blot(g,x,y,s,color,w,h){for(const dx of [-w,0,w])for(const dy of [-h,0,h]){const r=g.createRadialGradient(x+dx,y+dy,0,x+dx,y+dy,s);r.addColorStop(0,color);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(x+dx-s,y+dy-s,s*2,s*2);}}
function leaf(g,len,wid,c0,c1,c2){const gr=g.createLinearGradient(-len/2,0,len/2,0);gr.addColorStop(0,c0);gr.addColorStop(.55,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.beginPath();g.moveTo(-len/2,0);g.bezierCurveTo(-len*.2,-wid*.62,len*.25,-wid*.55,len/2,0);g.bezierCurveTo(len*.25,wid*.55,-len*.2,wid*.62,-len/2,0);g.fill();g.strokeStyle='rgba(55,95,30,.5)';g.lineWidth=Math.max(1,len/45);g.beginPath();g.moveTo(-len/2,0);g.lineTo(len/2-3,0);g.stroke();}
// A broad leaf with a serrated edge, midrib and side veins (canopy cards and ground plants).
function broadLeaf(g,len,wid,c0,c1,c2,r){const pts=[],n=9;for(let i=0;i<=n;i++){const t=i/n,hw=wid/2*Math.sin(Math.PI*Math.pow(t,.72))*(i%2?1.08:.94)*(1+(r()-.5)*.08);pts.push([-len/2+len*t,hw]);}
  const gr=g.createLinearGradient(-len/2,0,len/2,0);gr.addColorStop(0,c0);gr.addColorStop(.55,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.beginPath();g.moveTo(-len/2,0);for(const [x,y]of pts)g.lineTo(x,-y);for(const [x,y]of [...pts].reverse())g.lineTo(x,y);g.closePath();g.fill();
  const sh=g.createLinearGradient(0,-wid/2,0,wid/2);sh.addColorStop(0,'rgba(255,255,220,.18)');sh.addColorStop(.5,'rgba(255,255,220,0)');sh.addColorStop(1,'rgba(20,50,10,.22)');g.fillStyle=sh;g.fill();
  g.strokeStyle='rgba(225,240,170,.55)';g.lineWidth=Math.max(1,len/60);g.beginPath();g.moveTo(-len/2,0);g.lineTo(len/2-len*.04,0);g.stroke();g.lineWidth=Math.max(.7,len/110);g.strokeStyle='rgba(225,240,170,.38)';
  for(let i=1;i<6;i++){const x=-len/2+len*i/6.5;for(const sd of [-1,1]){g.beginPath();g.moveTo(x,0);g.quadraticCurveTo(x+len*.06,sd*wid*.18,x+len*.13,sd*wid*.34);g.stroke();}}}
// A fluted, gently twisted trunk: a lathe whose ridges deepen into buttress roots at the base.
// `door` keeps the front smooth low down, where the home tree's door sits.
function trunk(profile,{flutes=6,twist=.25,depth=.07,flare=.32,phase=0,door=false}={}){
  const seg=40,geo=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),seg),p=geo.attributes.position,top=profile[profile.length-1][1],n=profile.length;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=Math.hypot(x,z);if(r<1e-5)continue;const h=y/top,a=Math.atan2(x,z);
    let amp=depth+flare*Math.pow(1-h,3);if(door)amp*=THREE.MathUtils.lerp(THREE.MathUtils.smoothstep(Math.abs(a),.4,.95),1,THREE.MathUtils.smoothstep(h,.3,.45));
    const k=1+amp*Math.cos(flutes*a+twist*h*TAU+phase);p.setX(i,x*k);p.setZ(i,z*k);}
  geo.computeVertexNormals();const nr=geo.attributes.normal;for(let j=0;j<n;j++){const a=j,b=seg*n+j,v=new THREE.Vector3(nr.getX(a)+nr.getX(b),nr.getY(a)+nr.getY(b),nr.getZ(a)+nr.getZ(b)).normalize();nr.setXYZ(a,v.x,v.y,v.z);nr.setXYZ(b,v.x,v.y,v.z);}
  return geo;}
const taperProfile=(rBase,rTop,height,steps=10)=>Array.from({length:steps+1},(_,i)=>{const t=i/steps;return [rTop+(rBase-rTop)*Math.pow(1-t,1.6),t*height];});
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
  const rng=seeded(97),art=seeded(41),plants=seeded(73),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,160);
  scene.background=new THREE.Color('#e4d9a7');scene.fog=new THREE.Fog('#e4d9a7',28,74);
  // Sky dome: pale mint overhead fading to the warm haze that the fog shares at the horizon.
  {const sky=new THREE.Mesh(new THREE.SphereGeometry(140,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new THREE.Color('#bcd9c2')},haze:{value:new THREE.Color('#e4d9a7')}},
    vertexShader:'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform vec3 top,haze;varying vec3 vP;void main(){gl_FragColor=vec4(mix(haze,top,smoothstep(.04,.55,vP.y)),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));sky.renderOrder=-10;sky.frustumCulled=false;scene.add(sky);}
  scene.add(new THREE.HemisphereLight('#fff0d0','#6d5a34',1.35));
  const sun=new THREE.DirectionalLight('#ffd089',2.75);sun.position.set(-11,21,-9);sun.target.position.set(2,0,-2);scene.add(sun,sun.target);
  if(!software){sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:80});sun.shadow.normalBias=.05;sun.shadow.bias=-.0004;}
  // Painted-look surfaces drawn once on canvases.
  const grassTex=drawn(512,512,(g,w,h)=>{g.fillStyle='#679a35';g.fillRect(0,0,w,h);for(let i=0;i<240;i++)blot(g,rng()*w,rng()*h,18+rng()*70,rng()<.5?'rgba(160,200,80,.2)':'rgba(55,95,28,.18)',w,h);
    for(let i=0;i<5200;i++){const x=rng()*w,y=rng()*h,l=4+rng()*9;g.strokeStyle=rng()<.5?'rgba(176,210,96,.5)':'rgba(50,90,28,.45)';g.lineWidth=1+rng()*1.3;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*4,y-l);g.stroke();}},{repeat:26});
  const dirtTex=drawn(512,512,(g,w,h)=>{g.fillStyle='#c27f4e';g.fillRect(0,0,w,h);for(let i=0;i<200;i++)blot(g,rng()*w,rng()*h,16+rng()*60,rng()<.5?'rgba(226,160,110,.22)':'rgba(140,82,48,.18)',w,h);
    for(let i=0;i<3200;i++){g.fillStyle=rng()<.5?'rgba(105,62,34,.35)':'rgba(238,190,146,.35)';g.fillRect(rng()*w,rng()*h,1+rng()*2,1+rng()*2);}
    for(let i=0;i<70;i++){const x=rng()*w,y=rng()*h,r=2+rng()*4;g.fillStyle='rgba(120,100,84,.65)';g.beginPath();g.ellipse(x,y,r*1.3,r,rng()*3,0,TAU);g.fill();g.fillStyle='rgba(240,225,205,.5)';g.beginPath();g.arc(x-r*.3,y-r*.3,r*.45,0,TAU);g.fill();}});
  const leafTex=drawn(256,256,(g)=>{for(let i=0;i<60;i++)rng();for(let i=0;i<9;i++){const a=i/9*TAU+art()*.5,d=30+art()*30;g.save();g.translate(128+Math.cos(a)*d*.7,128+Math.sin(a)*d*.7);g.rotate(a+(art()-.5)*.5);broadLeaf(g,92+art()*30,50+art()*12,i%3?'#5c9a2e':'#4d8a28','#8cc64a','#cbe57a',art);g.restore();}
    g.save();g.translate(128,128);g.rotate(art()*TAU);broadLeaf(g,96,54,'#5c9a2e','#94cc52','#d4ea86',art);g.restore();});
  const plantTex=drawn(128,256,(g)=>{g.translate(64,250);g.rotate(-Math.PI/2);g.strokeStyle='#5d8a35';g.lineWidth=5;g.beginPath();g.moveTo(0,0);g.lineTo(22,0);g.stroke();g.translate(128,0);broadLeaf(g,214,104,'#4a8a28','#7fbd44','#bfe073',art);});
  const leafDepth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:leafTex,alphaTest:.5});
  const tuftTex=drawn(128,128,(g)=>{for(let i=0;i<22;i++){const x=64+(rng()-.5)*50,lean=(rng()-.5)*40,h=60+rng()*60;g.strokeStyle=['#5d9431','#7fb848','#9ccf5a'][i%3];g.lineWidth=3+rng()*3;g.lineCap='round';g.beginPath();g.moveTo(x,128);g.quadraticCurveTo(x+lean*.3,128-h*.6,x+lean,128-h);g.stroke();}});
  const lavenderTex=drawn(64,128,(g)=>{g.strokeStyle='#5d8a35';g.lineWidth=3;g.beginPath();g.moveTo(32,128);g.lineTo(32,40);g.stroke();for(let i=0;i<16;i++){const y=14+i*4.6,x=32+(i%2?5:-5);g.fillStyle=['#8a6fc9','#a084dc','#7259b5'][i%3];g.beginPath();g.ellipse(x,y,6,5,0,0,TAU);g.fill();}});
  const daisyTex=drawn(96,128,(g)=>{g.strokeStyle='#5d8a35';g.lineWidth=3;g.beginPath();g.moveTo(48,128);g.lineTo(48,40);g.stroke();g.fillStyle='#fffaf0';for(let i=0;i<10;i++){g.save();g.translate(48,34);g.rotate(i/10*TAU);g.beginPath();g.ellipse(0,-15,6,13,0,0,TAU);g.fill();g.restore();}g.fillStyle='#f2c33c';g.beginPath();g.arc(48,34,8,0,TAU);g.fill();});
  const fernTex=drawn(128,128,(g)=>{for(let f=0;f<5;f++){g.save();g.translate(64,126);g.rotate((f-2)*.42);for(let i=0;i<9;i++){const y=-12-i*11,s=16-i*1.4;g.fillStyle=i%2?'#6aa23a':'#4f8a2c';for(const side of [-1,1]){g.beginPath();g.ellipse(side*s*.7,y,s*.75,3.6,side*.5,0,TAU);g.fill();}}g.restore();}});
  const flowTex=drawn(128,256,(g,w,h)=>{g.fillStyle='#5ab3d6';g.fillRect(0,0,w,h);for(let i=0;i<60;i++)blot(g,rng()*w,rng()*h,10+rng()*30,rng()<.5?'rgba(140,215,235,.35)':'rgba(50,130,170,.25)',w,h);for(let i=0;i<70;i++){const x=rng()*w,y=rng()*h;g.strokeStyle='rgba(240,252,255,.55)';g.lineWidth=1.5+rng()*1.5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y+8,x+2,y+18+rng()*14);g.stroke();}
    const across=g.createLinearGradient(0,0,w,0);across.addColorStop(0,'rgba(30,100,130,.45)');across.addColorStop(.22,'rgba(60,170,200,0)');across.addColorStop(.5,'rgba(150,230,240,.22)');across.addColorStop(.78,'rgba(60,170,200,0)');across.addColorStop(1,'rgba(30,100,130,.45)');g.fillStyle=across;g.fillRect(0,0,w,h);
    for(let i=0;i<55;i++){const x=art()*w,y=art()*h,l=10+art()*26;g.strokeStyle='rgba(255,255,255,'+(.35+art()*.4)+')';g.lineWidth=1+art()*2.2;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+5,y+l*.3,x-5,y+l*.7,x+1,y+l);g.stroke();if(y+l>h){g.beginPath();g.moveTo(x,y-h);g.bezierCurveTo(x+5,y-h+l*.3,x-5,y-h+l*.7,x+1,y-h+l);g.stroke();}}
    for(let i=0;i<40;i++){g.fillStyle='rgba(255,255,240,.85)';g.beginPath();g.arc(art()*w,art()*h,.8+art()*1.4,0,TAU);g.fill();}});
  // White foam along the banks, drawn into the edges of a slightly wider ribbon.
  const foamTex=drawn(128,256,(g,w,h)=>{for(let i=0;i<520;i++){const edge=art()<.5,x=edge?art()*w*.17:w-art()*w*.17,y=art()*h,r=1.5+art()*5.5*(1-Math.abs(x-w/2)/(w/2)*.4);g.fillStyle='rgba(255,255,255,'+(.35+art()*.55)+')';for(const oy of [0,-h,h]){g.beginPath();g.arc(x,y+oy,r,0,TAU);g.fill();}}});
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
   const water=new THREE.Mesh(ribbon(stream,4.6,.06),new THREE.MeshLambertMaterial({map:flowTex,transparent:true,opacity:.95,emissive:'#1d5a6a',emissiveIntensity:.25}));water.receiveShadow=true;scene.add(water);
   const foam=new THREE.Mesh(ribbon(stream,4.9,.07),new THREE.MeshLambertMaterial({map:foamTex,transparent:true,depthWrite:false,emissive:'#ffffff',emissiveIntensity:.18}));foam.renderOrder=1;scene.add(foam);}
  // Instanced foliage collected while building.
  const leafyTex=drawn(256,256,(g,w,h)=>{g.fillStyle='#3d7522';g.fillRect(0,0,w,h);for(let i=0;i<46;i++){const x=art()*w,y=art()*h,a=art()*TAU,l=40+art()*30;for(const ox of [-w,0,w])for(const oy of [-h,0,h]){g.save();g.translate(x+ox,y+oy);g.rotate(a);broadLeaf(g,l,l*.52,'#3f7a22','#5f9a32','#86bb4a',art);g.restore();}}},{repeat:0});
  leafyTex.wrapS=leafyTex.wrapT=THREE.RepeatWrapping;leafyTex.repeat.set(3,2);
  const blobMaterial=nearFade(new THREE.MeshLambertMaterial({map:leafyTex})),leafCards=[],heroCards=[],blobs=[],dummy=new THREE.Object3D(),tmp=new THREE.Color();
  function cluster(cx,cy,cz,R,list=leafCards){dummy.position.set(cx,cy,cz);dummy.rotation.set(0,0,0);dummy.scale.setScalar(R*.6);dummy.updateMatrix();blobs.push(dummy.matrix.clone());
    const count=Math.round(10+R*11);for(let i=0;i<count;i++){let x=rng()*2-1,y=rng()*1.6-.45,z=rng()*2-1;const l=Math.hypot(x,y,z)||1;x/=l;y/=l;z/=l;const d=R*(.55+rng()*.4);
      dummy.position.set(cx+x*d,cy+y*d,cz+z*d);dummy.lookAt(cx+x*d*2,cy+y*d*2,cz+z*d*2);dummy.rotateZ(rng()*TAU);dummy.scale.setScalar(R*(.82+rng()*.38));dummy.updateMatrix();
      tmp.setHSL(.2+rng()*.05,.45,.62+Math.max(0,y)*.14+rng()*.1);list.push({matrix:dummy.matrix.clone(),color:tmp.clone()});}}
  function tree(x,z,s,far=false){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const m=barkTiled(1,2);
    mesh(trunk(taperProfile(.62*s,.32*s,4.6*s),{flutes:5,twist:.2+art()*.3,depth:.06,flare:.38,phase:art()*TAU}),m,g);for(let i=0;i<5;i++){const a=i*1.26+rng();curveTube(g,m,[[Math.cos(a)*.3*s,.6*s,Math.sin(a)*.3*s],[Math.cos(a)*1.1*s,.15*s,Math.sin(a)*1.1*s],[Math.cos(a)*1.7*s,0,Math.sin(a)*1.7*s]],.17*s);}
    for(const [ox,oy,oz,r]of far?[[0,5.3,0,2.2],[-1.3,4.9,.6,1.6],[1.4,5,-.2,1.6]]:[[0,5.4,0,1.9],[-1.4,4.8,.5,1.4],[1.4,5,-.3,1.5],[0,4.7,1.3,1.3],[.2,6.3,-.6,1.3]])cluster(x+ox*s,oy*s,z+oz*s,r*s);}
  const plantLeaves=[];
  function plant(x,z,k){const n=6+Math.floor(plants()*4),base=plants()*TAU;dummy.rotation.order='YXZ';
    for(let i=0;i<n;i++){dummy.position.set(x+(plants()-.5)*.2,0,z+(plants()-.5)*.2);dummy.rotation.set(.5+plants()*.65,base+i/n*TAU+(plants()-.5)*.5,(plants()-.5)*.3);const sc=k*(.7+plants()*.45);dummy.scale.set(sc*.5,sc*1.05,sc);dummy.updateMatrix();
      tmp.setHSL(.2+plants()*.06,.5,.66+plants()*.18);plantLeaves.push({matrix:dummy.matrix.clone(),color:tmp.clone()});}dummy.rotation.order='XYZ';}
  // Most bushes become broad-leaf plants; the leafy cluster is still built and discarded so the authored layout stream is unchanged.
  function bush(x,z,k){if(plants()<.62){cluster(x,.5*k,z,.75*k,[]);blobs.pop();plant(x,z,k*1.2);}else cluster(x,.5*k,z,.75*k);}
  // Home tree: flared trunk, roots, glowing round door, lanterns and mushrooms.
  const homeBark=barkTiled(4,3);{const g=new THREE.Group();g.position.set(0,0,-8);scene.add(g);
    mesh(trunk([[3.05,0],[2.72,.35],[2.5,.8],[2.4,1.4],[2.34,2],[2.28,2.7],[2.2,3.4],[2.08,4.1],[1.95,4.8],[1.78,5.5],[1.58,6.2],[1.36,6.9],[1.15,7.5],[1,7.8]],{flutes:7,twist:.42,depth:.075,flare:.3,phase:.4,door:true}),homeBark,g);
    for(let i=0;i<8;i++){const a=i/8*TAU+.2;if(Math.abs(Math.atan2(Math.sin(a-Math.PI/2),Math.cos(a-Math.PI/2)))<.5)continue;curveTube(g,homeBark,[[Math.cos(a)*2.1,1.7,Math.sin(a)*2.1],[Math.cos(a)*3.1,.6,Math.sin(a)*3.1],[Math.cos(a)*4.1,.05,Math.sin(a)*4.1]],.55);}
    for(let i=0;i<5;i++){const a=i/5*TAU+.6;curveTube(g,homeBark,[[0,5.8,0],[Math.cos(a)*1.9,7.2,Math.sin(a)*1.9],[Math.cos(a)*3.8,8.1,Math.sin(a)*3.8]],.48);}
    for(const [ox,oy,oz,r]of [[0,9.6,0,3.4],[-3.3,8.6,1.8,2.6],[3.4,8.8,1.6,2.7],[-1.6,9,-2.9,2.6],[2.3,9.3,-2.7,2.6],[0,8.3,3.6,2.5],[-5,7.8,-.4,2.2],[5.1,8,-.6,2.2],[-2.4,7.9,4.2,1.8],[2.6,8.1,4,1.8]])cluster(ox,oy,oz-8,r,heroCards);
    // The lit room seen through the round door: bookshelf, armchair, hanging lantern and a red rug.
    const doorTex=drawn(256,352,(c,w,h)=>{const bg=c.createRadialGradient(w*.62,h*.3,10,w*.55,h*.45,h*.75);bg.addColorStop(0,'#ffe7a8');bg.addColorStop(.45,'#efb062');bg.addColorStop(1,'#8f4f22');c.fillStyle=bg;c.fillRect(0,0,w,h);
      c.fillStyle='rgba(120,62,26,.35)';c.fillRect(0,h*.78,w,h*.22);
      c.fillStyle='#6e3b1c';c.fillRect(14,96,92,190);c.fillStyle='#8a4d26';c.fillRect(20,102,80,178);const books=['#7c8f4e','#c9a14f','#a4583a','#5f7fa0','#d1813f','#6f9a52'];
      for(const [y0,hh] of [[108,46],[166,46],[224,50]]){c.fillStyle='#5a2f16';c.fillRect(20,y0+hh,80,6);let x=24;for(let i=0;x<92;i++){const bw=8+((i*7)%5),bh=hh-4-((i*5)%9);c.fillStyle=books[(i+y0)%books.length];c.fillRect(x,y0+hh-bh,bw,bh);c.fillStyle='rgba(255,240,200,.35)';c.fillRect(x+2,y0+hh-bh+5,bw-4,2);x+=bw+2;}}
      c.fillStyle='#d98a3a';c.beginPath();c.roundRect(140,200,92,78,18);c.fill();c.fillStyle='#e9a44c';c.beginPath();c.roundRect(150,226,72,44,12);c.fill();c.fillStyle='#c8762f';for(const x of [134,220])c.beginPath(),c.roundRect(x,214,20,66,9),c.fill();
      c.fillStyle='#5a2f16';c.fillRect(150,278,8,16);c.fillRect(214,278,8,16);
      c.strokeStyle='#4a2a16';c.lineWidth=3;c.beginPath();c.moveTo(176,0);c.lineTo(176,64);c.stroke();const lg=c.createRadialGradient(176,86,2,176,86,46);lg.addColorStop(0,'rgba(255,250,220,1)');lg.addColorStop(.35,'rgba(255,214,130,.7)');lg.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=lg;c.fillRect(120,30,112,112);
      c.fillStyle='#4a2a16';c.fillRect(164,62,24,6);c.fillRect(164,104,24,6);c.fillStyle='#ffe9a6';c.fillRect(167,68,18,36);
      c.fillStyle='#c4433a';c.beginPath();c.ellipse(128,318,86,20,0,0,TAU);c.fill();c.strokeStyle='#e4785f';c.lineWidth=4;c.beginPath();c.ellipse(128,318,62,13,0,0,TAU);c.stroke();
      const edge=c.createRadialGradient(w/2,h*.55,h*.25,w/2,h*.5,h*.62);edge.addColorStop(0,'rgba(60,28,10,0)');edge.addColorStop(1,'rgba(60,28,10,.55)');c.fillStyle=edge;c.fillRect(0,0,w,h);});
    const arch=new THREE.Shape();arch.moveTo(-.8,0);arch.lineTo(-.8,1.4);arch.absarc(0,1.4,.8,Math.PI,0,true);arch.lineTo(.8,0);arch.lineTo(-.8,0);const shape=new THREE.ShapeGeometry(arch,16),uv=shape.attributes.uv,pos=shape.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+.8)/1.6,pos.getY(i)/2.2);
    const door=new THREE.Mesh(shape,new THREE.MeshBasicMaterial({map:doorTex,toneMapped:false}));door.position.set(0,.28,2.69);g.add(door);
    const frame=mesh(new THREE.TorusGeometry(.86,.13,8,24,Math.PI),woodLight,g);frame.position.set(0,1.68,2.74);for(const s of [-1,1])limb(g,woodLight,[s*.86,.28,2.74],[s*.86,1.68,2.74],.13);
    mesh(new THREE.CylinderGeometry(.95,.95,.12,24,1,false,0,Math.PI),paint('#b97a45','bark'),g).position.set(0,.2,2.72);
    for(const [mx,my,mz,k]of [[-2.1,1.8,1.05,1],[-2.3,1.4,.55,.8],[-1.85,2.2,1.4,.7]]){limb(g,cream,[mx+.2,my-.2,mz],[mx,my,mz],.07*k);const cap=mesh(new THREE.SphereGeometry(.38*k,14,8,0,TAU,0,Math.PI/2),paint('#d8ae80'),g);cap.position.set(mx,my,mz);cap.scale.y=.6;}
    for(const [x,y,z,k]of [[-.62,2.18,2.72,1],[0,2.4,2.74,1.2],[.6,2.2,2.72,.9],[-.9,1.85,2.7,.7],[.92,1.9,2.7,.75]]){const m=mesh(new THREE.SphereGeometry(1,12,8),moss,g);m.position.set(x,y,z);m.scale.set(.32*k,.13*k,.2*k);}
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
  // Chunky arched bridge: planks on curved stringers, square posts with round caps, top and middle rails.
  {const plankB=paint('#c98b52','bark'),beam=paint('#a86638','bark');
   for(let i=0;i<15;i++){const x=10.3+i*.38,y=deck(x)+.07,slope=deck(x+.2)-deck(x-.2);const p=mesh(roundedBlock(.34,.12,2.15,.04),i%3===1?plankB:woodLight);p.position.set(x,y,-3+(i%2?.03:-.03));p.rotation.z=Math.atan2(slope,.4);}
   for(const z of [-4.1,-1.9]){for(let i=0;i<14;i++){const x=10.15+i*.43,slope=deck(x+.2)-deck(x-.2);const b=mesh(roundedBlock(.46,.2,.16,.04),beam);b.position.set(x,deck(x)-.05,z);b.rotation.z=Math.atan2(slope,.4);}
     const tops=[],mids=[];for(let i=0;i<=4;i++){const x=10.3+i*1.35,y=deck(x),end=i===0||i===4,h=end?1.2:1.05;mesh(roundedBlock(end?.2:.15,h+.2,end?.2:.15,.04),bark).position.set(x,y+h/2-.1,z);
       const cap=mesh(new THREE.SphereGeometry(end?.13:.1,12,8),woodLight);cap.position.set(x,y+h+.02,z);cap.scale.y=.75;tops.push([x,y+1,z]);mids.push([x,y+.55,z]);}
     curveTube(scene,woodLight,tops,.075);curveTube(scene,woodLight,mids,.05);}}
  // Mossy rocks (smooth spheres pushed out by position noise, moss on the tops).
  const rockGeo=new THREE.SphereGeometry(1,18,12);{const p=rockGeo.attributes.position,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=1+.14*Math.sin(v.x*3.1+v.y*1.7)+.1*Math.sin(v.z*4.3-v.x*2.2)+.06*Math.sin(v.y*7.1);v.multiplyScalar(n);p.setXYZ(i,v.x,v.y,v.z);}rockGeo.computeVertexNormals();const n=rockGeo.attributes.normal,c=[];for(let i=0;i<n.count;i++){const top=THREE.MathUtils.smoothstep(n.getY(i),.45,.85);c.push(.47-top*.17,.45-top*.03,.41-top*.26);}rockGeo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));}
  const rocks=[[-5.2,-4.2,1.05,.7],[-2,9,.65,.55],[9.6,1.2,.6,.5],[-12,-9,.65,.55]];
  for(let z=-30;z<34;z+=1.7){if(Math.abs(z+3)<1.6)continue;for(const side of [-1,1])if(rng()<.8)rocks.push([lineCenter(z)+side*(2.45+rng()*.6),z+rng()*.8,.3+rng()*.4,.6]);}
  function lineCenter(z){for(let i=0;i<stream.length-1;i++){const a=stream[i],b=stream[i+1];if(z>=a[1]&&z<=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);}return stream[0][0];}
  for(let i=0;i<400&&rocks.length<70;i++){const x=-22+rng()*44,z=-22+rng()*44;if(!onTrail(x,z)&&!inWater(x,z)&&Math.hypot(x-2,z+2)>8&&solids.every(s=>Math.hypot(x-s.x,z-s.z)>s.r+1))rocks.push([x,z,.25+rng()*.35,.6]);}
  // Pebbles along the trail edges and stones in the brook's little rapids (art stream, layout untouched).
  for(const t of trails)for(let i=0;i<t.length-1;i++){const [ax,az]=t[i],[bx,bz]=t[i+1],len=Math.hypot(bx-ax,bz-az);for(let d=0;d<len;d+=.9){const u=d/len,nx=-(bz-az)/len,nz=(bx-ax)/len,side=art()<.5?-1:1,o=1.05+art()*.4,x=ax+(bx-ax)*u+nx*side*o,z=az+(bz-az)*u+nz*side*o;if(art()<.55&&!inWater(x,z)&&!onBridge(x,z))rocks.push([x,z,.07+art()*.08,.6]);}}
  const rapids=[-15,7.5,19].map(z=>{const cx=lineCenter(z);rocks.push([cx-1.3,z+.25,.36,.5],[cx+.3,z-.35,.26,.5],[cx+1.35,z+.3,.32,.55]);return [cx,z];});
  const speckle=drawn(128,128,(g,w,h)=>{g.fillStyle='#f4f1ea';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=art()<.5?'rgba(90,80,70,.22)':'rgba(255,255,250,.4)';g.fillRect(art()*w,art()*h,1+art()*2,1+art()*2);}for(let i=0;i<30;i++)blot(g,art()*w,art()*h,8+art()*20,'rgba(100,90,70,.12)',w,h);},{repeat:2});
  {const im=new THREE.InstancedMesh(rockGeo,new THREE.MeshLambertMaterial({vertexColors:true,map:speckle}),rocks.length);rocks.forEach(([x,z,k,f],i)=>{dummy.position.set(x,k*.38,z);dummy.rotation.set(0,i*1.7,0);dummy.scale.set(k*1.15,k*f,k);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);});im.castShadow=im.receiveShadow=!software;scene.add(im);}
  const rapidTex=drawn(128,64,(g,w,h)=>{for(let i=0;i<190;i++){const x=art()*w,y=art()*h,rx=2+art()*7,ry=1+art()*2.6;g.fillStyle='rgba(255,255,255,'+(.35+art()*.55)+')';for(const ox of [-w,0,w])for(const oy of [-h,0,h]){g.beginPath();g.ellipse(x+ox,y+oy,rx,ry,0,0,TAU);g.fill();}}},{repeat:0});
  rapidTex.wrapS=rapidTex.wrapT=THREE.RepeatWrapping;
  {const m=new THREE.MeshLambertMaterial({map:rapidTex,transparent:true,depthWrite:false,emissive:'#ffffff',emissiveIntensity:.25,alphaMap:drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,8,32,32,32);r.addColorStop(0,'#fff');r.addColorStop(1,'#000');g.fillStyle=r;g.fillRect(0,0,64,64);},{linear:true})});
   for(const [x,z]of rapids){const f=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.6),m);f.rotation.x=-Math.PI/2;f.position.set(x,.08,z);f.renderOrder=2;scene.add(f);}}
  // Trees, bushes and the forest edge.
  for(const [x,z]of [[-11.6,-14.2],[-13.5,-5],[-5.5,-16],[5,-15.5],[-14,4],[3.5,13.5],[-3,15],[17,-10.5],[19,7.5]])tree(x,z,1.05+rng()*.25);
  {const g=new THREE.Group();scene.add(g);const m=barkTiled(1,2);mesh(trunk(taperProfile(.4,.21,3.4),{flutes:5,twist:.35,depth:.06,flare:.35,phase:1.3}),m,g).position.set(-10.3,0,-.7);curveTube(g,m,[[-10.25,2.0,-.65],[-9.3,2.2,-.4],[-8.2,2.42,-.2]],.09);cluster(-10.4,4.2,-.8,1.6);cluster(-7.9,2.95,-.45,.6);}
  for(let i=0;i<40;i++){const a=i/40*TAU+rng()*.1,r=24+rng()*9;tree(2+Math.cos(a)*r,-2+Math.sin(a)*r,1.15+rng()*.5,true);}
  {let made=blobs.length;for(let i=0;i<500&&made<420;i++){const a=rng()*TAU,r=8+rng()*13,x=2+Math.cos(a)*r,z=-2+Math.sin(a)*r;if(!onTrail(x,z)&&!inWater(x,z)&&walkable(x,z)&&Math.hypot(x,z+8)>4.5){bush(x,z,.6+rng()*.5);made++;}}}
  function cards(list,shadow){const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),nearFade(new THREE.MeshLambertMaterial({map:leafTex,alphaTest:.5,side:THREE.DoubleSide,transparent:false})),list.length);list.forEach((c,i)=>{im.setMatrixAt(i,c.matrix);im.setColorAt(i,c.color);});im.castShadow=shadow&&!software;im.receiveShadow=!software;im.customDepthMaterial=leafDepth;scene.add(im);return im;}
  cards(leafCards,true);const hero=cards(heroCards,true);
  {const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).translate(0,.5,0),new THREE.MeshLambertMaterial({map:plantTex,alphaTest:.5,side:THREE.DoubleSide}),plantLeaves.length);plantLeaves.forEach((c,i)=>{im.setMatrixAt(i,c.matrix);im.setColorAt(i,c.color);});
   im.castShadow=im.receiveShadow=!software;im.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:plantTex,alphaTest:.5});scene.add(im);}
  // Ground cover: grass, lavender, daisies, ferns.
  const cover=[[tuftTex,520,[.7,.55],26],[lavenderTex,90,[.38,.8],18],[daisyTex,110,[.42,.5],20],[fernTex,80,[1.0,.75],22]];
  for(const [tex,count,[w,h],range]of cover){const spots=[];for(let i=0;i<count*6&&spots.length<count;i++){const x=2+(rng()*2-1)*range,z=-2+(rng()*2-1)*range;if(!onTrail(x,z)&&!inWater(x,z)&&solids.every(s=>Math.hypot(x-s.x,z-s.z)>s.r+.2))spots.push([x,z]);}
    const im=new THREE.InstancedMesh(crossQuad(),new THREE.MeshLambertMaterial({map:tex,alphaTest:.45}),spots.length);spots.forEach(([x,z],i)=>{const k=.7+rng()*.6;dummy.position.set(x,0,z);dummy.rotation.set(0,rng()*TAU,0);dummy.scale.set(w*k,h*k,w*k);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);});im.receiveShadow=!software;scene.add(im);}
  {const edge=[];for(const t of trails)for(let i=0;i<t.length-1;i++){const [ax,az]=t[i],[bx,bz]=t[i+1],len=Math.hypot(bx-ax,bz-az);for(let d=0;d<len;d+=.42){const u=d/len,nx=-(bz-az)/len,nz=(bx-ax)/len,side=art()<.5?-1:1,o=1.15+art()*.45,x=ax+(bx-ax)*u+nx*side*o,z=az+(bz-az)*u+nz*side*o;
     if(!inWater(x,z)&&!onBridge(x,z)&&solids.every(s=>Math.hypot(x-s.x,z-s.z)>s.r+.2)&&trails.every(q=>lineDistance(x,z,q)>1.12)&&((x-2.2)/6.6)**2+((z+2.4)/4.8)**2>1.08)edge.push([x,z,art()]);}}
   const im=new THREE.InstancedMesh(crossQuad(),new THREE.MeshLambertMaterial({map:tuftTex,alphaTest:.45}),edge.length);edge.forEach(([x,z,k],i)=>{dummy.position.set(x,0,z);dummy.rotation.set(0,k*TAU,0);const sc=.55+k*.5;dummy.scale.set(.75*sc,.5*sc,.75*sc);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);});im.receiveShadow=!software;scene.add(im);}
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
  const beamTex=drawn(64,256,(g)=>{const l=g.createLinearGradient(0,0,0,256);l.addColorStop(0,'rgba(255,240,200,0)');l.addColorStop(.35,'rgba(255,236,190,.55)');l.addColorStop(1,'rgba(255,236,190,0)');g.fillStyle=l;g.fillRect(0,0,64,256);
    g.globalCompositeOperation='destination-in';const w=g.createLinearGradient(0,0,64,0);w.addColorStop(0,'rgba(0,0,0,0)');w.addColorStop(.5,'rgba(0,0,0,1)');w.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=w;g.fillRect(0,0,64,256);});
  const shafts=[[-8,-12,2.6],[-2.6,-15.5,3.4],[4.2,-13,2.4],[10.5,-15,3],[16.5,-9.5,2.2],[-14,-6,2.4]].map(([x,z,w],i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:beamTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,toneMapped:false,opacity:.16}));
    m.position.set(x,6.5,z);m.scale.set(w,15,1);m.rotation.z=.42;m.renderOrder=4;scene.add(m);return m;});
  const vignette=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:drawn(256,256,(g)=>{const r=g.createRadialGradient(128,120,70,128,128,184);r.addColorStop(0,'rgba(80,46,16,0)');r.addColorStop(.55,'rgba(80,46,16,.05)');r.addColorStop(1,'rgba(64,34,12,.38)');g.fillStyle=r;g.fillRect(0,0,256,256);}),transparent:true,depthTest:false,depthWrite:false,fog:false,toneMapped:false}));
  vignette.position.z=-1;vignette.renderOrder=30;vignette.frustumCulled=false;camera.add(vignette);scene.add(camera);
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
  function placeCamera(k){const off=narrow?[0,10,14.4]:[0,9,14];camera.position.lerp(new THREE.Vector3(focus.x+off[0],focus.y+off[1],focus.z+off[2]),k);camera.lookAt(focus.x,focus.y+1.4,focus.z-3.2);camera.updateMatrixWorld();foxView.value.set(pos.x,groundY(pos.x,pos.z)+.9,pos.z).applyMatrix4(camera.matrixWorldInverse);}
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
    shafts.forEach((b,i)=>b.material.opacity=reduced?.15:.14+Math.sin(time*.35+i*1.7)*.05);
    if(!reduced){flowTex.offset.y-=dt*.22;foamTex.offset.y-=dt*.12;rapidTex.offset.y+=dt*.5;motes.position.y=Math.sin(time*.35)*.3;motes.rotation.y=time*.01;}
    if(ring.visible)ring.material.opacity=.55+Math.sin(time*4)*.25;
    // Fade the home canopy when the fox walks behind the trunk.
    const behind=pos.z<-9.4&&Math.abs(pos.x)<5.5;hero.material.opacity+=((behind?.3:1)-hero.material.opacity)*Math.min(1,dt*5);hero.material.transparent=hero.material.opacity<.99;hero.material.depthWrite=!hero.material.transparent;
    focus.lerp(new THREE.Vector3(pos.x+vel.x*.35,base*.5,pos.z+vel.y*.35),reduced?1:1-Math.exp(-dt*2.6));placeCamera(1);
  }
  return {scene,camera,
    enter(position){const p=position&&walkable(position.x,position.z)?position:forestPlaces.home;pos.set(p.x,0,p.z);vel.set(0,0);fox.rotation.y=0;destination=null;path=[];arrival=null;ring.visible=false;near=null;setCollected(collected());snapCamera();renderer.shadowMap.needsUpdate=true;},
    resize(w,h){width=w;height=h;narrow=w<600;camera.aspect=w/Math.max(1,h);camera.fov=narrow?54:42;camera.updateProjectionMatrix();const vh=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*1.02;vignette.scale.set(vh*camera.aspect,vh,1);snapCamera();},
    update,route(id){const p=forestPlaces[id];if(p)walkTo(new THREE.Vector3(p.x,0,p.z),id);},
    pick(x,y){raycaster.setFromCamera(new THREE.Vector2(x,y),camera);const hit=new THREE.Vector3();if(raycaster.ray.intersectPlane(floor,hit))walkTo(hit);},

    stop(){destination=null;path=[];arrival=null;ring.visible=false;vel.set(0,0);},
    pins(){return pins.map(p=>{const q=p.point.clone().project(camera);return {id:p.id,x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z<1&&Math.abs(q.x)<1.02&&q.y>-1.02&&q.y<1.12};});},
    get position(){return {x:pos.x,z:pos.z};},get destination(){return destination;},get near(){return near;},
  };
}
