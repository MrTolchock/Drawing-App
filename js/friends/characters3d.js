/* Articulated 3D Forest friends in the character sheet's soft style: big heads, glossy eyes with
   highlights, cream muzzles and chests, fluffy tapered tails. Fur is a soft felt material (fine
   stroke texture, gentle bump and a warm velvet rim) so the models read like the painted plush
   characters. Every rig shares one update(dt,state) with procedural idle, walk and interaction
   poses, and normalises its height to `height`. */
import {THREE} from '../scene/materials.js';

const TAU=Math.PI*2,SPHERE=new THREE.SphereGeometry(1,32,22);
const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);
function rand(seed){return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}

// Fine fur strokes, tiled, drawn once. Used as colour variation and as a soft bump.
let furTex=null,featherTex=null,scaleTex=null;
function canvasTexture(size,draw,repeat=[1,1]){const c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d'),size);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...repeat);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
function fur(){if(!furTex)furTex=canvasTexture(256,(g,S)=>{g.fillStyle='#ececec';g.fillRect(0,0,S,S);const r=rand(11);
  for(let i=0;i<5200;i++){const x=r()*S,y=r()*S,l=4+r()*9,a=Math.PI/2+(r()-.5)*.7,light=r()<.5;g.strokeStyle=light?'rgba(255,255,255,.7)':'rgba(96,74,56,.22)';g.lineWidth=.8+r()*1.1;g.lineCap='round';
    for(const ox of [0,-S])for(const oy of [0,-S]){g.beginPath();g.moveTo(x+ox,y+oy);g.lineTo(x+ox+Math.cos(a)*l,y+oy+Math.sin(a)*l);g.stroke();}}},[3,2]);return furTex;}
// Scalloped feathers in rows for the owl's front and wings.
function feathers(){if(!featherTex)featherTex=canvasTexture(256,(g,S)=>{g.fillStyle='#f2f2f2';g.fillRect(0,0,S,S);const rows=8,cols=6,w=S/cols,h=S/rows;
  for(let row=0;row<rows+1;row++)for(let col=-1;col<cols+1;col++){const x=col*w+(row%2?w/2:0)+w/2,y=row*h;g.fillStyle=row%2?'#f6f6f6':'#ffffff';g.strokeStyle='rgba(90,60,30,.42)';g.lineWidth=3;g.beginPath();g.moveTo(x-w*.5,y);g.quadraticCurveTo(x-w*.5,y+h*1.25,x,y+h*1.3);g.quadraticCurveTo(x+w*.5,y+h*1.25,x+w*.5,y);g.fill();g.stroke();
    g.strokeStyle='rgba(90,60,30,.18)';g.lineWidth=1.5;g.beginPath();g.moveTo(x,y+h*.2);g.lineTo(x,y+h*1.1);g.stroke();}},[2,2]);return featherTex;}
// Crosshatched scales for the beaver's paddle tail.
function scales(){if(!scaleTex)scaleTex=canvasTexture(128,(g,S)=>{g.fillStyle='#ffffff';g.fillRect(0,0,S,S);g.strokeStyle='rgba(30,20,12,.45)';g.lineWidth=2;for(let i=-S;i<S*2;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i+S,S);g.stroke();g.beginPath();g.moveTo(i,S);g.lineTo(i+S,0);g.stroke();}},[3,3]);return scaleTex;}

// Velvet rim: grazing light picks up a warm sheen of the surface colour, as on soft plush.
function velvet(m,amount=.55){m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <opaque_fragment>',
  'float ffRim=pow(1.0-clamp(dot(normal,normalize(vViewPosition)),0.0,1.0),2.2);\noutgoingLight+=(diffuseColor.rgb*vec3(1.0,.9,.75)+vec3(.05,.035,.02))*ffRim*'+amount.toFixed(2)+';\n#include <opaque_fragment>');};
  m.customProgramCacheKey=()=>'ff-velvet-'+amount;return m;}
const mats=new Map();
function mat(color,{rough=.92,map='fur',rim=.55,vc=false}={}){const key=[color,rough,map,rim,vc].join();if(!mats.has(key)){const tex=map==='fur'?fur():map==='feathers'?feathers():map==='scales'?scales():null;
  const m=new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0,map:tex,bumpMap:tex,bumpScale:tex?.9:0,vertexColors:vc});mats.set(key,rim?velvet(m,rim):m);}return mats.get(key);}
const glossy=new THREE.MeshStandardMaterial({color:'#2a170c',roughness:.12,metalness:0}),iris=new THREE.MeshStandardMaterial({color:'#5a3418',roughness:.2}),shine=new THREE.MeshBasicMaterial({color:'#ffffff',toneMapped:false});
const plain=(color,rough=.5)=>{const key='plain'+color+rough;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0}));return mats.get(key);};

function add(parent,mesh,pos,scale,rot){mesh.position.set(...pos);if(scale)mesh.scale.set(...scale);if(rot)mesh.rotation.set(...rot);mesh.castShadow=true;parent.add(mesh);return mesh;}
function blob(parent,material,pos,scale,rot){return add(parent,new THREE.Mesh(SPHERE,material),pos,scale,rot);}
function joint(parent,pos,rot){const g=new THREE.Group();g.position.set(...pos);if(rot)g.rotation.set(...rot);parent.add(g);return g;}
function capsule(parent,material,r,len,pos,rot){return add(parent,new THREE.Mesh(new THREE.CapsuleGeometry(r,len,8,18),material),pos,null,rot);}
function lathe(profile,seg=32){return new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),seg);}
// Teardrop tuft pointing +y (cheek fluff, chest fluff, ear tufts).
const TUFT=lathe([[0,0],[.62,.1],[.95,.3],[.9,.5],[.62,.72],[.3,.9],[.08,.99],[0,1]],24);
function tuft(parent,material,pos,scale,rot){return add(parent,new THREE.Mesh(TUFT,material),pos,scale,rot);}
// Colour a geometry by a function of its normalised height (vertex colours, linear space).
function tint(geo,fn){geo.computeBoundingBox();const b=geo.boundingBox,p=geo.attributes.position,c=[];for(let i=0;i<p.count;i++){const col=fn((p.getY(i)-b.min.y)/(b.max.y-b.min.y||1),p.getX(i),p.getZ(i));c.push(col.r,col.g,col.b);}geo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));return geo;}
const C=h=>new THREE.Color(h),mix=(a,b,t)=>new THREE.Color().lerpColors(a,b,THREE.MathUtils.clamp(t,0,1));
// A tube along a curve whose radius varies (tails); closed at the ends when the radius reaches zero.
function taper(points,radius,{seg=48,radial=20,color=null}={}){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),frames=curve.computeFrenetFrames(seg,false),len=curve.getLength();
  const pos=[],nor=[],uv=[],col=[],idx=[],n=new THREE.Vector3(),m=new THREE.Vector3();
  for(let i=0;i<=seg;i++){const t=i/seg,p=curve.getPointAt(t),T=frames.tangents[i],N=frames.normals[i],B=frames.binormals[i],r=radius(t),dr=(radius(Math.min(1,t+.01))-radius(Math.max(0,t-.01)))/(.02*len),c=color&&color(t);
    for(let j=0;j<=radial;j++){const a=j/radial*TAU;n.set(0,0,0).addScaledVector(N,Math.cos(a)).addScaledVector(B,Math.sin(a));pos.push(p.x+n.x*r,p.y+n.y*r,p.z+n.z*r);m.copy(n).addScaledVector(T,-dr).normalize();nor.push(m.x,m.y,m.z);uv.push(j/radial*2,t*2.5);if(c)col.push(c.r,c.g,c.b);}}
  for(let i=0;i<seg;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;idx.push(a,a+1,b,b,a+1,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));if(color)g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);return g;}
// Rounded end: radius rises from `base` to `peak` at `at`, then closes like a soft brush tip.
const plume=(base,peak,at,tip=.75)=>t=>t<at?base+(peak-base)*Math.sin(Math.PI/2*t/at):peak*Math.pow(Math.max(0,1-((t-at)/(1-at))**2),tip);

function eye(parent,x,y,z,r,{yaw=0,brown=true}={}){const g=joint(parent,[x,y,z],[0,yaw,0]);blob(g,glossy,[0,0,0],[r,r*1.15,r*.6]);if(brown)blob(g,iris,[0,-r*.18,r*.3],[r*.72,r*.78,r*.38]);
  blob(g,glossy,[0,-r*.1,r*.42],[r*.46,r*.5,r*.24]);blob(g,shine,[-r*.3,r*.38,r*.5],[r*.3,r*.32,r*.16]);blob(g,shine,[r*.32,-r*.32,r*.5],[r*.13,r*.13,r*.08]);return g;}
function smile(parent,y,z,w,color='#3a2416'){const m=new THREE.Mesh(new THREE.TorusGeometry(w,w*.18,8,20,Math.PI*.8),plain(color,.6));m.position.set(0,y,z);m.rotation.set(-.2,0,Math.PI+Math.PI*.1);parent.add(m);return m;}
function brow(parent,x,y,z,w,tilt,color='#4a2a18'){const m=new THREE.Mesh(new THREE.TorusGeometry(w,w*.2,6,16,Math.PI*.6),plain(color,.8));m.position.set(x,y,z);m.rotation.set(-.25,x>0?-.35:.35,Math.PI*.2+tilt);parent.add(m);return m;}
function ear(parent,{r,h,outer,inner,tip=null,tipFrom=.72,depth=.42,innerScale=.66}){const geo=tint(new THREE.ConeGeometry(r,h,20,8),y=>tip?mix(C(outer),C(tip),smooth(tipFrom-.1,tipFrom+.08,y)):C(outer));
  const o=add(parent,new THREE.Mesh(geo,mat('#ffffff',{vc:true})),[0,h/2,0],[1,1,depth]);add(parent,new THREE.Mesh(new THREE.ConeGeometry(r*innerScale,h*.78,18),mat(inner,{rim:.3})),[0,h*.42,r*depth*.55],[1,1,depth*.6],[-.08,0,0]);return o;}

// Shared animation: breathing, blinking, head tilt, walk cycle, tail follow-through and actions.
function animator(parts){
  let phase=0,blink=2+Math.random()*3,blinkT=0,time=Math.random()*10,flick=0,flickT=3+Math.random()*4,tailLag=0,hopV=0,squash=0;
  const tailBase=parts.tail?{x:parts.tail.rotation.x,y:parts.tail.rotation.y}:null;
  return function update(dt,{moving=false,speed=0,action='',reduced=false}={}){
    time+=dt;const t=reduced?0:time;phase+=dt*(moving?Math.max(4,speed*3.2):0);
    const walk=moving&&!reduced?1:0,s=Math.sin(phase),c=Math.cos(phase);
    blink-=dt;if(blink<0){blinkT=.14;blink=2.4+Math.random()*3.2;}blinkT=Math.max(0,blinkT-dt);
    const closed=action==='sleep'||blinkT>0,happyEyes=action==='happy'&&!reduced;for(const e of parts.eyes||[])e.scale.y=closed?.1:happyEyes?.55+Math.abs(Math.sin(t*6))*.1:1;
    const sit=action==='sleep'&&parts.legs?.length?1:0,body=parts.body;if(body){const breathe=reduced?0:Math.sin(t*(sit?1.2:2.1))*(sit?.022:.012);body.position.y=parts.bodyY-sit*.2+(walk?Math.abs(s)*.035:0)+(action==='happy'||action==='wave'?Math.abs(Math.sin(t*6))*.045:0);
      body.rotation.z=walk?s*.045:0;body.rotation.x=walk?.07:0;body.scale.set(1-breathe*.5+squash*.5,1+breathe-squash,1-breathe*.5+squash*.5);}
    if(parts.head){parts.head.rotation.z=walk?-s*.05:Math.sin(t*.7)*.07+(action==='sleep'?.25:0)+(action==='wave'?.12:0);parts.head.rotation.x=action==='sleep'?.22:action==='eat'?Math.sin(t*9)*.08:walk?c*.04-.05:Math.sin(t*.45)*.04;parts.head.rotation.y=walk?0:Math.sin(t*.33)*.18;}
    const legs=parts.legs||[];legs.forEach((l,i)=>{l.rotation.x=walk?(i?-s:s)*.7:action==='bath'?-.9:sit?-1.45:0;l.rotation.z=sit?(i?-1:1)*.18:0;});
    const arms=parts.arms||[];arms.forEach((a,i)=>{let x=walk?(i?s:-s)*.6:Math.sin(t*1.4+i)*.04,z=(i?-1:1)*.1;
      if(action==='wave'&&i===1){x=-2.4;z=-.3+Math.sin(t*9)*.35;}
      if(action==='happy'){x=-2.2;z=(i?-1:1)*(.35+Math.sin(t*8)*.1);}
      if(action==='eat'&&i===1){x=-2.1;z=.35;}
      if(action==='bath'){x=-1.4+Math.sin(t*5+i*2)*.5;z=(i?-1:1)*.5;}
      if(action==='sleep'){x=-.5;z=(i?-1:1)*-.25;}
      a.rotation.x+=(x-a.rotation.x)*Math.min(1,dt*14);a.rotation.z+=(z-a.rotation.z)*Math.min(1,dt*14);});
    if(parts.tail){const wag=Math.sin(t*(walk?6:1.4))*(walk?.32:.2)+(action==='hop'||action==='happy'?Math.sin(t*10)*.25:0);tailLag+=(wag-tailLag)*Math.min(1,dt*7);
      parts.tail.rotation.y=tailBase.y+(sit?1.5:wag);parts.tail.rotation.x=tailBase.x+(walk?s*.08:Math.sin(t*1.1)*.05);if(parts.tailTip)parts.tailTip.rotation.y=(tailLag-wag)*1.4+wag*.35;}
    flickT-=dt;if(flickT<0){flick=.18;flickT=2.5+Math.random()*5;}flick=Math.max(0,flick-dt);
    for(const [i,e] of (parts.ears||[]).entries()){e.rotation.z=e.userData.z+(!reduced&&flick>0&&i===(Math.floor(flickT*10)%2)?Math.sin(flick/.18*Math.PI)*.3:0)+(walk?Math.sin(phase+i)*.04:0);}
    for(const [i,w] of (parts.wings||[]).entries()){w.rotation.z=(i?-1:1)*(action==='wave'||action==='happy'?.6+Math.sin(t*12)*.45:.06+Math.sin(t*1.6)*.03);}
    // Hops land with a little squash.
    if(action==='hop'&&!reduced){const y=Math.abs(Math.sin(t*5))*.12;parts.root.position.y=y;squash=y<.02?.06*(1-y/.02):0;}else{parts.root.position.y=0;squash*=Math.max(0,1-dt*10);}
  };
}
// Merge each joint's static meshes by material, so a character costs a few dozen draw calls.
function compact(node){const groups=new Map();for(const o of [...node.children]){if(o.isMesh){if(!groups.has(o.material))groups.set(o.material,[]);groups.get(o.material).push(o);}else compact(o);}
  for(const [material,list]of groups){if(list.length<2)continue;const attrs=['position','normal','uv'].concat(list.every(m=>m.geometry.attributes.color)?['color']:[]),data=Object.fromEntries(attrs.map(a=>[a,[]])),index=[];let base=0;
    for(const m of list){m.updateMatrix();const g=m.geometry.clone().applyMatrix4(m.matrix),n=g.attributes.position.count;for(const a of attrs){const src=g.attributes[a];if(src)data[a].push(...src.array);else data[a].push(...new Array(n*(a==='uv'?2:3)).fill(0));}
      if(g.index)for(const i of g.index.array)index.push(i+base);else for(let i=0;i<n;i++)index.push(i+base);base+=n;m.removeFromParent();}
    const geo=new THREE.BufferGeometry();for(const a of attrs)geo.setAttribute(a,new THREE.Float32BufferAttribute(data[a],a==='uv'?2:3));geo.setIndex(index);
    const merged=new THREE.Mesh(geo,material);merged.castShadow=true;node.add(merged);}}
function finish(group,parts,height){compact(group);group.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(group);const h=box.max.y-box.min.y||1;const k=height/h;parts.root.scale.setScalar(k);parts.root.position.y=0;return {group,parts,update:animator(parts),height};}

export function fox(height=1.6){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),orange=mat('#de6a26'),cream=mat('#f6e6cf'),dark=mat('#4b2817'),scarf=mat('#5b7d32',{rim:.35}),nose=plain('#24140c',.25);
  const body=joint(root,[0,0,0]);
  add(body,new THREE.Mesh(lathe([[0,.3],[.15,.31],[.235,.37],[.262,.48],[.252,.6],[.215,.73],[.165,.84],[.11,.92],[0,.96]]),orange),[0,0,0],[1,1,.86]);
  blob(body,cream,[0,.55,.12],[.165,.24,.13]);tuft(body,cream,[0,.78,.15],[.12,.12,.08],[Math.PI-.2,0,0]);
  // Green neckerchief: collar, a soft triangle on the chest and a little knot.
  const collar=add(body,new THREE.Mesh(new THREE.TorusGeometry(.165,.05,10,30),scarf),[0,.885,.0],null,[Math.PI/2-.18,0,0]);collar.scale.set(1,1.05,1);
  {const s=new THREE.Shape();s.moveTo(-.19,0);s.quadraticCurveTo(0,.03,.19,0);s.quadraticCurveTo(.07,-.12,0,-.23);s.quadraticCurveTo(-.07,-.12,-.19,0);
   const geo=new THREE.ExtrudeGeometry(s,{depth:.018,bevelEnabled:true,bevelThickness:.012,bevelSize:.014,bevelSegments:3,curveSegments:12});add(body,new THREE.Mesh(geo,scarf),[0,.9,.155],null,[-.32,0,0]);
   blob(body,scarf,[.1,.885,.15],[.045,.04,.04]);}
  const head=joint(body,[0,.98,.02]);
  blob(head,orange,[0,.25,0],[.4,.33,.355]);
  blob(head,cream,[0,.07,.17],[.18,.12,.17]);
  for(const sx of [-1,1]){blob(head,cream,[sx*.17,.115,.14],[.2,.135,.18],[0,0,sx*.42]);tuft(head,cream,[sx*.29,.09,.03],[.085,.12,.08],[0,sx*.2,-sx*(Math.PI/2+.95)]);}
  blob(head,cream,[0,.1,.29],[.125,.09,.16]);blob(head,orange,[0,.215,.24],[.08,.055,.15],[-.3,0,0]);
  blob(head,nose,[0,.16,.445],[.052,.04,.038]);smile(head,.075,.4,.04);
  const eyes=[eye(head,-.15,.27,.3,.085,{yaw:-.28}),eye(head,.15,.27,.3,.085,{yaw:.28})];brow(head,-.155,.385,.315,.07,.05);brow(head,.155,.385,.315,.07,-.05);
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.22,.47,-.05]);e.userData.z=sx*-.3;e.rotation.z=e.userData.z;ear(e,{r:.17,h:.38,outer:'#de6a26',inner:'#f6e6cf',tip:'#4b2817',tipFrom:.74,depth:.55});ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.225,.775,.03]);capsule(a,orange,.066,.13,[0,-.09,0]);capsule(a,dark,.064,.08,[0,-.2,.005]);blob(a,dark,[0,-.285,.02],[.074,.072,.074]);arms.push(a);}
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.12,.36,0]);blob(l,orange,[0,-.03,0],[.115,.13,.12]);capsule(l,dark,.078,.07,[0,-.17,0]);blob(l,dark,[0,-.295,.05],[.092,.062,.135]);legs.push(l);}
  // Big brush tail sweeping to one side, with a cream tip.
  const tail=joint(body,[0,.42,-.2]),tailTip=joint(tail,[0,0,0]);
  add(tailTip,new THREE.Mesh(taper([[0,0,0],[.02,-.03,-.18],[.1,.06,-.36],[.24,.26,-.44],[.32,.48,-.38],[.32,.62,-.27]],plume(.06,.215,.56,.6),{color:t=>mix(C('#de6a26'),C('#f8ecd8'),smooth(.64,.72,t))}),mat('#ffffff',{vc:true})),[0,0,0]);
  tail.rotation.set(.1,.55,0);
  const parts={root,body,bodyY:0,head,eyes,ears,arms,legs,tail,tailTip};const rig=finish(group,parts,height);
  const animate=rig.update,headRest=head.position.clone(),bodyRestY=body.rotation.y,tailRestZ=tail.rotation.z;
  rig.update=(dt,state={})=>{
    head.position.copy(headRest);body.rotation.y=bodyRestY;tail.rotation.z=tailRestZ;animate(dt,state);
    if(state.action==='sleep'){
      body.rotation.set(.08,.05,1.48);body.position.y=.25;
      head.position.y=.87;head.rotation.set(.15,.05,-.18);
      tail.rotation.set(-.15,2.25,-.12);tailTip.rotation.y=-.25;
      arms.forEach((a,i)=>a.rotation.set(-.9,0,i?-.35:.35));
      legs.forEach((l,i)=>l.rotation.set(-1.5,0,i?-.25:.25));
    }
  };
  rig.paw=arms[1];return rig;
}
export function squirrel(height=1.05){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#c4582a'),cream=mat('#f5dfc0'),dark=plain('#2a170e',.3),nut=mat('#9a6332',{rim:.3}),cap=mat('#6b4524',{rim:.3});
  const body=joint(root,[0,0,0]);
  add(body,new THREE.Mesh(lathe([[0,.08],[.17,.1],[.255,.2],[.27,.34],[.24,.5],[.18,.62],[.1,.69],[0,.71]]),fur),[0,0,0],[1,1,.9]);
  blob(body,cream,[0,.38,.12],[.16,.22,.13]);
  const head=joint(body,[0,.7,.04]);blob(head,fur,[0,.13,0],[.27,.24,.25]);
  blob(head,cream,[0,.05,.13],[.19,.12,.15]);for(const sx of [-1,1])blob(head,cream,[sx*.12,.06,.12],[.11,.09,.1]);
  blob(head,plain('#5a2e1a',.35),[0,.1,.255],[.035,.028,.025]);smile(head,.04,.24,.026);
  const eyes=[eye(head,-.105,.165,.19,.068,{yaw:-.3}),eye(head,.105,.165,.19,.068,{yaw:.3})];
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.15,.32,-.03]);e.userData.z=sx*-.22;e.rotation.z=e.userData.z;ear(e,{r:.075,h:.18,outer:'#c4582a',inner:'#f0c9a4',tip:'#8f3a18',tipFrom:.7,depth:.55});ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.15,.53,.13]);capsule(a,fur,.045,.09,[0,-.07,.03],[.6,0,0]);blob(a,fur,[sx*-.02,-.12,.08],[.05,.045,.05]);arms.push(a);}
  // The acorn held in both paws.
  blob(body,nut,[0,.44,.26],[.075,.09,.075]);blob(body,cap,[0,.51,.26],[.083,.042,.083]);capsule(body,cap,.008,.02,[0,.555,.26]);
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.16,.17,.05]);blob(l,fur,[0,0,0],[.12,.13,.15]);blob(l,fur,[0,-.13,.12],[.065,.04,.11]);legs.push(l);}
  // Bushy tail rising behind the back and curling over at the top.
  const tail=joint(body,[0,.15,-.18]),tailTip=joint(tail,[0,0,0]);
  add(tailTip,new THREE.Mesh(taper([[0,0,0],[0,.12,-.22],[0,.45,-.36],[0,.8,-.3],[0,1.0,-.12],[0,1.02,.06],[0,.92,.12]],plume(.08,.24,.42,.5),{color:t=>mix(C('#c4582a'),C('#e0884a'),smooth(.5,1,t))}),mat('#ffffff',{vc:true})),[0,0,0]);
  tail.rotation.set(0,0,0);
  const parts={root,body,bodyY:0,head,eyes,ears,arms:[],legs:[],tail,tailTip};return finish(group,parts,height);
}
export function bird(height=.55){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),blue=mat('#3f8fd6',{rim:.45}),teal=mat('#7aa78a',{rim:.45}),yellow=mat('#f3c936',{rim:.5}),white=mat('#fbf8f0',{rim:.35}),black=mat('#1f2430',{rim:.2}),beak=plain('#2a2a2e',.35),grey=plain('#6f7480',.6);
  const body=joint(root,[0,0,0]);
  blob(body,yellow,[0,.24,.03],[.17,.18,.17]);blob(body,teal,[0,.28,-.07],[.16,.16,.16]);
  blob(body,mat('#2c3a5c',{rim:.2}),[0,.27,.17],[.022,.07,.02]);
  const head=joint(body,[0,.42,.06]);blob(head,white,[0,0,0],[.135,.125,.13]);blob(head,blue,[0,.065,-.01],[.132,.08,.13]);
  blob(head,black,[0,.008,-.004],[.137,.017,.13]);blob(head,mat('#2c3a5c',{rim:.2}),[0,-.06,-.01],[.128,.022,.122]);blob(head,black,[0,-.075,.095],[.035,.03,.02]);
  const eyes=[eye(head,-.072,.02,.1,.03,{yaw:-.4,brown:false}),eye(head,.072,.02,.1,.03,{yaw:.4,brown:false})];add(head,new THREE.Mesh(new THREE.ConeGeometry(.028,.07,10),beak),[0,-.015,.15],null,[Math.PI/2,0,0]);
  const wings=[];for(const sx of [-1,1]){const w=joint(body,[sx*.145,.3,-.03]);tuft(w,blue,[sx*.015,.03,.02],[.055,.25,.13],[Math.PI-.6,0,sx*.15]);blob(w,white,[sx*.03,-.05,.0],[.02,.02,.08]);wings.push(w);}
  const tail=joint(body,[0,.2,-.17]);tuft(tail,blue,[0,0,0],[.07,.22,.03],[-Math.PI/2-.5,0,0]);
  for(const sx of [-1,1]){capsule(body,grey,.012,.08,[sx*.06,.05,.03]);capsule(body,grey,.01,.04,[sx*.06,.0,.06],[Math.PI/2,0,0]);}
  const parts={root,body,bodyY:0,head,eyes,wings,tail};return finish(group,parts,height);
}
export function owl(height=1.2){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),brown=mat('#a06a3c'),feather=mat('#a06a3c',{map:'feathers'}),belly=mat('#dcbb8a',{map:'feathers'}),disc=mat('#eed7ae',{rim:.35}),ring=mat('#8c5a30'),beak=plain('#d6a03e',.4),feet=plain('#e2a93c',.55),claw=plain('#4a3020',.3);
  const body=joint(root,[0,0,0]);
  add(body,new THREE.Mesh(lathe([[0,.02],[.22,.04],[.33,.15],[.37,.32],[.35,.5],[.29,.66],[.2,.76],[0,.8]]),feather),[0,0,0],[1,1,.92]);
  blob(body,belly,[0,.36,.15],[.26,.3,.2]);
  const head=joint(body,[0,.82,.02]);blob(head,brown,[0,0,0],[.34,.29,.31]);blob(head,brown,[0,.12,-.02],[.3,.2,.28]);
  for(const sx of [-1,1]){blob(head,ring,[sx*.135,-.01,.19],[.165,.175,.1]);blob(head,disc,[sx*.13,-.01,.215],[.15,.16,.09]);}
  blob(head,disc,[0,-.12,.21],[.12,.08,.07]);
  const eyes=[eye(head,-.13,0,.28,.078,{yaw:-.25}),eye(head,.13,0,.28,.078,{yaw:.25})];
  add(head,new THREE.Mesh(new THREE.ConeGeometry(.045,.12,12),beak),[0,-.09,.31],null,[Math.PI*.62,0,0]);
  const wings=[];for(const sx of [-1,1]){const w=joint(body,[sx*.33,.58,-.02]);tuft(w,feather,[sx*.02,.02,-.01],[.11,.48,.22],[Math.PI-.05,0,sx*-.12]);wings.push(w);}
  for(const sx of [-1,1])for(let k=-1;k<=1;k++){blob(body,feet,[sx*.12+k*.035,.025,.2],[.03,.026,.065]);blob(body,claw,[sx*.12+k*.035,.015,.26],[.012,.012,.02]);}
  const parts={root,body,bodyY:0,head,eyes,wings};return finish(group,parts,height);
}
export function mouse(height=1.05){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#d59a64'),cream=mat('#f5e0c4'),pink=mat('#f0a39a',{rim:.3}),nose=plain('#d9776f',.3),book=mat('#5e8c3a',{rim:.25,map:null}),page=plain('#fbf4e2',.8);
  const body=joint(root,[0,0,0]);
  add(body,new THREE.Mesh(lathe([[0,.06],[.16,.08],[.235,.2],[.245,.36],[.21,.52],[.14,.64],[0,.68]]),fur),[0,0,0],[1,1,.9]);
  blob(body,cream,[0,.34,.12],[.15,.21,.11]);
  const head=joint(body,[0,.69,.03]);blob(head,fur,[0,.11,0],[.26,.23,.235]);blob(head,cream,[0,.03,.14],[.17,.11,.14]);
  blob(head,cream,[0,.06,.2],[.1,.075,.1]);blob(head,nose,[0,.085,.29],[.035,.03,.028]);smile(head,.025,.25,.03);
  for(const sx of [-1,1])for(const k of [-1,1])capsule(head,plain('#7a5a44',.6),.003,.16,[sx*.12,.06+k*.012,.24],[0,0,Math.PI/2+sx*k*.12]);
  const eyes=[eye(head,-.1,.15,.19,.055,{yaw:-.3}),eye(head,.1,.15,.19,.055,{yaw:.3})];
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.19,.3,-.05]);e.userData.z=sx*-.12;e.rotation.z=e.userData.z;blob(e,fur,[0,0,0],[.16,.16,.04]);blob(e,pink,[0,-.01,.026],[.11,.11,.02]);ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.15,.47,.12]);capsule(a,fur,.042,.08,[0,-.06,.04],[.7,0,0]);arms.push(a);}
  const open=joint(body,[0,.44,.24]);for(const sx of [-1,1]){const cover=new THREE.Mesh(new THREE.BoxGeometry(.15,.19,.016),book);cover.position.set(sx*.072,0,0);cover.rotation.y=sx*-.35;open.add(cover);const p=new THREE.Mesh(new THREE.BoxGeometry(.13,.17,.012),page);p.position.set(sx*.066,0,.012);p.rotation.y=sx*-.35;open.add(p);}open.rotation.x=-.4;
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.13,.12,.08]);blob(l,fur,[0,0,0],[.1,.085,.13]);blob(l,pink,[0,-.06,.1],[.05,.025,.06]);legs.push(l);}
  const tail=joint(body,[0,.1,-.2]);add(tail,new THREE.Mesh(taper([[0,0,0],[.15,-.06,-.2],[.35,-.02,-.3],[.48,.12,-.25],[.5,.25,-.12]],t=>.024*(1-t*.6),{seg:30,radial:8}),pink),[0,0,0]);
  const parts={root,body,bodyY:0,head,eyes,ears,tail};return finish(group,parts,height);
}
export function beaver(height=1.15){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#8f5a34'),light=mat('#cfa47a'),dark=mat('#3b2416'),nose=plain('#2a1a10',.25),tooth=plain('#fffaf0',.3),tailMat=mat('#5a3e2c',{map:'scales',rim:.2,rough:.7});
  const body=joint(root,[0,0,0]);
  add(body,new THREE.Mesh(lathe([[0,.04],[.22,.06],[.33,.18],[.35,.36],[.32,.54],[.24,.7],[.14,.78],[0,.8]]),fur),[0,0,0],[1,1,.9]);
  blob(body,light,[0,.4,.22],[.23,.29,.12]);
  const head=joint(body,[0,.8,.04]);blob(head,fur,[0,.1,0],[.28,.25,.26]);
  blob(head,light,[0,.0,.16],[.18,.12,.14]);for(const sx of [-1,1])blob(head,light,[sx*.08,.01,.22],[.08,.07,.07]);
  blob(head,nose,[0,.07,.28],[.055,.038,.035]);
  for(const sx of [-1,1])add(head,new THREE.Mesh(new THREE.BoxGeometry(.04,.065,.022),tooth),[sx*.022,-.085,.255],null,[-.1,0,0]);
  const eyes=[eye(head,-.11,.15,.2,.052,{yaw:-.3}),eye(head,.11,.15,.2,.052,{yaw:.3})];brow(head,-.11,.24,.21,.045,.05);brow(head,.11,.24,.21,.045,-.05);
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.21,.24,-.03]);e.userData.z=0;blob(e,fur,[0,0,0],[.065,.065,.04]);blob(e,dark,[0,0,.02],[.035,.035,.02]);ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.31,.6,.08]);capsule(a,fur,.06,.12,[0,-.1,.02]);blob(a,dark,[0,-.2,.03],[.06,.05,.06]);arms.push(a);}
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.18,.15,.05]);blob(l,fur,[0,0,0],[.13,.12,.14]);blob(l,dark,[0,-.12,.1],[.1,.04,.13]);legs.push(l);}
  const tail=joint(body,[0,.1,-.28]);{const s=new THREE.Shape();s.absellipse(0,0,.19,.3,0,TAU);const geo=new THREE.ExtrudeGeometry(s,{depth:.04,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:3,curveSegments:24});geo.rotateX(Math.PI/2);add(tail,new THREE.Mesh(geo,tailMat),[0,-.02,-.3],null,[.22,0,0]);}
  const parts={root,body,bodyY:0,head,eyes,ears,arms,legs,tail};return finish(group,parts,height);
}
// A delivery friend, never a puzzle host: long ears, blue post cap and a leather mail satchel.
export function mailman(height=1.65){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#b78a61'),cream=mat('#f5e4cb'),pink=mat('#e7b6a1'),navy=plain('#416c91',.8),deepBlue=plain('#294a69',.8),leather=plain('#9a653d',.8),paper=plain('#fff8df',.9),gold=plain('#e6be66',.5);
  const body=joint(root,[0,0,0]);blob(body,fur,[0,.48,0],[.25,.33,.22]);blob(body,cream,[0,.46,.16],[.16,.23,.09]);
  const head=joint(body,[0,.86,.025]);blob(head,fur,[0,.1,0],[.29,.25,.25]);
  for(const sx of [-1,1])blob(head,cream,[sx*.1,.015,.2],[.11,.08,.1]);blob(head,pink,[0,.07,.29],[.04,.03,.03]);smile(head,-.015,.27,.035);
  const eyes=[eye(head,-.115,.15,.215,.06),eye(head,.115,.15,.215,.06)],ears=[];
  for(const sx of [-1,1]){const e=joint(head,[sx*.17,.31,-.025]);e.userData.z=sx*-.1;e.rotation.z=e.userData.z;blob(e,fur,[0,.24,0],[.075,.3,.06]);blob(e,pink,[0,.25,.04],[.043,.235,.025]);ears.push(e);}
  // Cap rests between the ears, with a forward visor and a little envelope badge.
  blob(head,navy,[0,.345,.01],[.245,.085,.205]);blob(head,deepBlue,[0,.31,.18],[.25,.027,.12]);
  const badge=new THREE.Mesh(new THREE.BoxGeometry(.095,.06,.012),gold);badge.position.set(0,.36,.2);head.add(badge);
  const flap=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.04,.385,.208),new THREE.Vector3(0,.355,.21),new THREE.Vector3(0,.355,.21),new THREE.Vector3(.04,.385,.208)]),new THREE.LineBasicMaterial({color:'#294a69'}));head.add(flap);
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.23,.66,.045]);capsule(a,fur,.055,.15,[0,-.12,0]);blob(a,cream,[0,-.25,.025],[.065,.07,.07]);arms.push(a);}
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.13,.22,.015]);capsule(l,fur,.075,.12,[0,-.07,0]);blob(l,cream,[0,-.18,.09],[.1,.065,.16]);legs.push(l);}
  blob(body,cream,[0,.35,-.23],[.12,.12,.1]);
  const strap=new THREE.Mesh(new THREE.BoxGeometry(.055,.63,.035),leather);strap.position.set(-.015,.57,.23);strap.rotation.z=-.65;body.add(strap);
  const bag=new THREE.Mesh(new THREE.BoxGeometry(.32,.3,.15),leather);bag.position.set(.28,.4,.17);bag.rotation.z=.06;body.add(bag);
  const lid=new THREE.Mesh(new THREE.BoxGeometry(.34,.12,.035),plain('#b6814e',.8));lid.position.set(.28,.49,.255);body.add(lid);
  const letter=new THREE.Mesh(new THREE.BoxGeometry(.23,.14,.012),paper);letter.position.set(.29,.58,.19);letter.rotation.z=-.12;body.add(letter);
  const seam=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(.18,.63,.202),new THREE.Vector3(.29,.56,.202),new THREE.Vector3(.29,.56,.202),new THREE.Vector3(.4,.63,.202)]),new THREE.LineBasicMaterial({color:'#9a653d'}));body.add(seam);
  const parts={root,body,bodyY:0,head,eyes,ears,arms,legs};return finish(group,parts,height);
}
const procedural={fox,squirrel,bird,owl,mouse,beaver,mailman};

/* ---------- the baked plush cast (blueprint 6.2) ----------
   tools/bake-characters.mjs writes assets/characters/<id>.glb: two skinned meshes per level of detail
   ("fur" and "gloss"), every part bound rigidly to its joint bone (body, head, ear_*, arm_*, leg_*, tail,
   wing_*, eye_*). Rigs keep the joint names, the height normalisation and the animator above, so the
   forest, the den fox and the sleep pose work unchanged. Until the files have loaded (they come from the
   offline cache), a rig shows the procedural model and then swaps to the plush one in place. */
import {GLTFLoader} from '../../vendor/three/addons/GLTFLoader.js';
import {clone as cloneSkinned} from '../../vendor/three/addons/SkeletonUtils.js';
import {MeshoptDecoder} from '../../vendor/meshoptimizer/meshopt_decoder.js';

// The last six are the big world's neighbours: they exist only as baked models.
const CAST=['fox','squirrel','bird','owl','mouse','beaver','mailman','deer','frog','hedgehog','fish','kingfisher','badger'],baked={};
const NOISE=`
float plHash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float plNoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(plHash(i),plHash(i+vec3(1,0,0)),f.x),mix(plHash(i+vec3(0,1,0)),plHash(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(plHash(i+vec3(0,0,1)),plHash(i+vec3(1,0,1)),f.x),mix(plHash(i+vec3(0,1,1)),plHash(i+vec3(1,1,1)),f.x),f.y),f.z);}`;
// Plush fur: brushed strokes running down the body in colour and normal (in bind-pose space, so they never swim),
// soft clumps (both fade out with distance instead of turning into grain), a warm velvet rim and a little self-light. Same shader as tools/characters/plush.js.
function plushFur(source,{fuzz=1,rim=.5}={}){const m=source.clone();m.vertexColors=true;m.roughness=.92;m.metalness=0;
  m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vPl;').replace('#include <begin_vertex>','#include <begin_vertex>\nvPl=position;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vPl;'+NOISE)
      .replace('#include <color_fragment>',`#include <color_fragment>\n float plFw=length(fwidth(vPl)),plFine=clamp(1.4-plFw*300.,0.,1.),plCoarse=clamp(1.4-plFw*90.,0.,1.);\n float fz=mix(.5,plNoise(vPl*vec3(330.,62.,330.)),plFine)*.6+mix(.5,plNoise(vPl*95.+7.),plCoarse)*.4; diffuseColor.rgb*=mix(1.,.87+.24*fz,${fuzz.toFixed(2)});`)
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\n vec3 fzN=vec3(plNoise(vPl*vec3(280.,70.,280.)),plNoise(vPl*vec3(280.,70.,280.)+3.1),plNoise(vPl*vec3(280.,70.,280.)+5.7))-.5; normal=normalize(normal+fzN*plFine*${(.34*fuzz).toFixed(2)});`)
      .replace('#include <opaque_fragment>',`float plRim=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),2.4);\n outgoingLight+=diffuseColor.rgb*vec3(1.,.9,.78)*plRim*${rim.toFixed(2)}+diffuseColor.rgb*.07;\n #include <opaque_fragment>`);};
  m.customProgramCacheKey=()=>'plush-fur-'+fuzz+'-'+rim;return m;}
// The painted eye, as on the friends sheet (left half: cream eyeball shaded round its rim, thick dark upper lid,
// big warm-brown iris lighter at the bottom, large pupil, two catchlights) next to plain white (right half) for
// noses, teeth and buttons, which take their colour from the vertices. Drawn once, shared.
let eyeAtlas=null;
function eyes(){if(eyeAtlas)return eyeAtlas;const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');
  g.fillStyle='#ffffff';g.fillRect(256,0,256,256);g.fillStyle='#2a1810';g.fillRect(0,0,256,256);
  const ball=g.createRadialGradient(128,128,60,128,128,124);ball.addColorStop(0,'#fbf3e4');ball.addColorStop(.7,'#f4e6cf');ball.addColorStop(1,'#c9ac86');g.fillStyle=ball;g.beginPath();g.arc(128,128,121,0,TAU);g.fill();
  const ir=g.createRadialGradient(128,168,8,128,138,84);ir.addColorStop(0,'#a5642e');ir.addColorStop(.55,'#6f3d1b');ir.addColorStop(.9,'#43220f');ir.addColorStop(1,'#2c160a');g.fillStyle=ir;g.beginPath();g.arc(128,138,84,0,TAU);g.fill();
  g.fillStyle='#150b06';g.beginPath();g.arc(128,136,50,0,TAU);g.fill();
  g.save();g.beginPath();g.rect(0,0,256,256);g.arc(128,163,134,0,TAU,true);g.clip('evenodd');g.fillStyle='#2a1810';g.fillRect(0,0,256,256);g.restore();
  g.fillStyle='#fff';g.beginPath();g.ellipse(158,104,19,17,.4,0,TAU);g.fill();g.globalAlpha=.9;g.beginPath();g.arc(102,170,8,0,TAU);g.fill();g.globalAlpha=1;
  eyeAtlas=new THREE.CanvasTexture(c);eyeAtlas.colorSpace=THREE.SRGBColorSpace;return eyeAtlas;}   // flipY stays on: the baked eye UVs run bottom to top
const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
export const castReady=Promise.all(CAST.map(id=>loader.loadAsync(new URL('../../assets/characters/'+id+'.glb',import.meta.url).href).then(g=>{baked[id]=g.scene;}).catch(()=>{/* keep the procedural model */}))).then(()=>CAST.filter(id=>baked[id]));

// Sleep pose for the plush Fuchs: lying stretched out, head resting on his front paws, legs tucked
// under, the brush tail lying behind him (body turned first, then lowered: Euler order YXZ).
function plushSleep(p){
  p.body.rotation.order='YXZ';p.body.rotation.set(1.5,1.55,.35);p.body.position.y=p.bodyY+.11;
  if(p.head)p.head.rotation.set(-1.4,-1.15,.25);
  if(p.tail)p.tail.rotation.set(-1.6,1.5,0);
  p.arms.forEach((a,i)=>a.rotation.set(-2.5,0,i?-.15:.15));p.legs.forEach((l,i)=>l.rotation.set(.35,0,i?-.3:.3));
}
/* How a few friends move in their own way, layered over the shared animator (forest only; reduced motion keeps
   the shared, calmer poses). The squirrel bounds in short dashes with both hind legs together, snaps its head
   round, flicks its tail and nibbles; the deer walks smoothly without bobbing, grazes now and then with flicking
   ears, and lifts its head to look at Fuchs. `greet` is a short welcome: a hop or two, then they stand and look. */
const MANNERS={
  squirrel(p){let hp=0,air=0,look=0,lookTo=0,lookT=.5,flick=0,flickT=1.5,nib=0,nibT=5+Math.random()*6,greet=0,was='';
    return (dt,{moving,action})=>{
      if(action==='greet'&&was!=='greet')greet=.95;was=action;greet=Math.max(0,greet-dt);
      flickT-=dt;if(flickT<0){flick=.35;flickT=1.2+Math.random()*3;}flick=Math.max(0,flick-dt);
      const tailUp=flick>0?Math.sin(flick/.35*Math.PI)*.45:0;
      if(moving||greet>0){hp+=dt*(moving?8.6:9.4);const k=Math.abs(Math.sin(hp));air=moving?k*.085:k*.07*Math.min(1,greet/.3);
        p.root.position.y=air;if(p.body){p.body.rotation.x=moving?.22-Math.cos(hp*2)*.08:0;p.body.position.y=p.bodyY;}
        for(const l of p.legs)l.rotation.x=moving?-.5+Math.cos(hp*2)*.55:-.3*k;   // both hind legs push off together
        for(const a of p.arms)a.rotation.x=moving?-.7-Math.cos(hp*2)*.4:-.5;
        if(p.tail)p.tail.rotation.x+=(moving?-.25+Math.sin(hp*2)*.18:0)+tailUp;nib=0;return;}
      p.root.position.y=0;
      // alert: quick glances in a new direction, then stillness
      lookT-=dt;if(lookT<0){lookTo=action==='look'?(Math.random()-.5)*.3:(Math.random()-.5)*1.3;lookT=.5+Math.random()*1.8;}
      look+=(lookTo-look)*Math.min(1,dt*16);if(p.head){p.head.rotation.y=look;p.head.rotation.z*=.4;}
      if(p.tail)p.tail.rotation.x+=tailUp;
      nibT-=dt;if(nibT<0&&!nib){nib=2.6;nibT=6+Math.random()*8;}if(nib>0){nib=Math.max(0,nib-dt);for(const a of p.arms){a.rotation.x=-2.05;a.rotation.z*=.3;}if(p.head)p.head.rotation.x=.18+Math.sin(nib*24)*.05;}
    };},
  deer(p){let graze=0,grazeT=3+Math.random()*5,down=0,flick=0,flickT=1,fe=0,ph=0;
    return (dt,{moving,speed,action})=>{
      const alert=action==='look'||action==='greet';
      if(moving){ph+=dt*Math.max(3.2,speed*3.4);const s=Math.sin(ph);
        if(p.body){p.body.position.y=p.bodyY+Math.abs(s)*.008;p.body.rotation.z=s*.018;p.body.rotation.x=.04;}
        for(const [i,l]of p.legs.entries())l.rotation.x=(i?-s:s)*.42;for(const [i,a]of p.arms.entries())a.rotation.x=(i?s:-s)*.25;
        if(p.head){p.head.rotation.x=-.04+Math.cos(ph*2)*.035;p.head.rotation.z=0;}graze=0;}
      else if(!alert){grazeT-=dt;if(grazeT<0&&!graze){graze=3+Math.random()*4;grazeT=5+Math.random()*7;}}
      if(alert)graze=0;if(graze>0)graze=Math.max(0,graze-dt);
      down+=((graze>.5?1:0)-down)*Math.min(1,dt*2.2);
      if(!moving&&p.body){p.body.rotation.x+=down*.36;}
      if(!moving&&p.head){p.head.rotation.x+=down*(.62+Math.sin(graze*9)*.04)-(alert?.08:0);if(alert)p.head.rotation.y*=.3;}
      
      flickT-=dt;if(flickT<0){flick=.22;fe=Math.random()<.5?0:1;flickT=(alert?.7:1.5)+Math.random()*2.5;}flick=Math.max(0,flick-dt);
      for(const [i,e]of p.ears.entries())e.rotation.z+=(i===fe&&flick>0?Math.sin(flick/.22*Math.PI)*(i?-.35:.35):0)+(alert?(i?-.12:.12):0);
      p.root.position.y=0;
    };},
};
/* Little tricks a friend shows when Fuchs visits without a letter for them (forest3d.js `visit`), played over
   `u` = 0…1, and the pose that points the way (`point`: the friend's group is turned toward the place). */
const ease=u=>u<=0?0:u>=1?1:u*u*(3-2*u),bell=(u,a=.12,b=.88)=>ease(u/a)*(1-ease((u-b)/(1-b)));
const TRICKS={
  dig(p,u,t){const e=bell(u,.15,.75),up=ease((u-.75)/.2)*(1-ease((u-.95)/.05));if(p.body)p.body.rotation.x+=e*.85;if(p.head)p.head.rotation.x+=e*.35;
    p.arms.forEach((a,i)=>{a.rotation.x=-1.1*e+Math.sin(t*19+i*Math.PI)*.55*e+(-2.2*up);});if(p.tail)p.tail.rotation.x+=up*.4;},
  slap(p,u){const lift=ease(u/.45)*(1-ease((u-.5)/.06)),bang=u>.5?Math.exp(-(u-.5)*14):0;if(p.tail)p.tail.rotation.x+=-1.1*lift+.25*bang;if(p.body)p.body.rotation.x+=.18*lift-.06*bang;p.root.position.y=bang*.05;},
  headturn(p,u){const a=Math.sin(Math.min(1,u/.9)*Math.PI*2)*2.4*bell(u,.08,.92);if(p.head){p.head.rotation.y=a;p.head.rotation.z=Math.sin(u*Math.PI*4)*.12;}},
  spin(p,u){const k=ease((u-.1)/.7);p.root.rotation.y=k*Math.PI*2;p.root.position.y=Math.sin(Math.min(1,Math.max(0,(u-.1)/.7))*Math.PI)*.12;p.arms.forEach((a,i)=>{a.rotation.x=-2.3*bell(u);a.rotation.z=(i?-1:1)*.5*bell(u);});},
  flutter(p,u,t){const e=bell(u);p.root.position.y=e*(.12+Math.sin(t*9)*.03);(p.wings||[]).forEach((w,i)=>{w.rotation.z=(i?-1:1)*(.4+Math.sin(t*34)*.7)*e;});p.arms.forEach((a,i)=>{a.rotation.x+=-1.6*e+Math.sin(t*34)*.5*e;});},
  curl(p,u){const e=bell(u,.18,.72);if(p.body){p.body.rotation.x+=e*1.05;p.body.scale.multiplyScalar(1).y*=1-e*.12;}if(p.head)p.head.rotation.x+=e*.6;p.legs.forEach(l=>{l.rotation.x=-1.3*e;});p.arms.forEach(a=>{a.rotation.x=-.9*e;});p.root.position.y=e*.04;},
  leap(p,u){const j=Math.min(1,Math.max(0,(u-.25)/.5)),crouch=bell(u,.1,.25)*(u<.3?1:0);p.root.position.y=Math.sin(j*Math.PI)*.42;if(p.body)p.body.rotation.x+=Math.sin(j*Math.PI)*-.15+crouch*.2;p.legs.forEach(l=>{l.rotation.x=j>0&&j<1?-.9:-.4*crouch;});p.arms.forEach(a=>{a.rotation.x=j>0&&j<1?-1.4:0;});},
  jump(p,u){const j=Math.min(1,Math.max(0,(u-.2)/.55));p.root.position.y=Math.sin(j*Math.PI)*.55;p.root.rotation.x=(j-.5)*2.2*(j>0&&j<1?1:0);if(p.tail)p.tail.rotation.y+=Math.sin(u*40)*.4;},
};
function pointPose(p,e){const a=p.legs.length?p.arms[1]:null;if(a){a.rotation.x=-1.5*e;a.rotation.z=-.15*e;}if(p.head)p.head.rotation.x-=.08*e;}
export const TRICK_OF={squirrel:'dig',badger:'dig',beaver:'slap',owl:'headturn',mouse:'spin',bird:'flutter',kingfisher:'flutter',hedgehog:'curl',deer:'leap',frog:'leap',fish:'jump'};
function plushModel(id,height){
  const model=cloneSkinned(baked[id]),bones={},meshes=[];
  // Characters stay out of the static shadow map (it is not redrawn as they move); each has a soft contact shadow.
  model.traverse(o=>{if(o.isBone)bones[o.name]=o;if(o.isSkinnedMesh){meshes.push(o);o.castShadow=false;o.frustumCulled=false;}});
  const own=new Map();for(const m of meshes){if(!own.has(m.material))own.set(m.material,m.material.name==='fur'?plushFur(m.material):Object.assign(m.material.clone(),{map:eyes(),roughness:.12}));m.material=own.get(m.material);}
  const list=prefix=>Object.keys(bones).filter(n=>n.startsWith(prefix+'_')).sort((a,b)=>+a.split('_')[1]-+b.split('_')[1]).map(n=>bones[n]);
  const root=new THREE.Group();root.add(model);
  const parts={root,body:bones.body,bodyY:bones.body?bones.body.position.y:0,head:bones.head,eyes:list('eye'),ears:list('ear'),arms:list('arm'),legs:list('leg'),tail:bones.tail,tailTip:null,wings:list('wing')};
  for(const e of parts.ears)e.userData.z=e.rotation.z;
  // Levels of detail: per material, the mesh with more triangles is the near one (gltfpack renames nodes).
  for(const name of ['fur','gloss'])meshes.filter(m=>m.material.name===name).sort((a,b)=>b.geometry.index.count-a.geometry.index.count).forEach((m,i)=>m.userData.lod=i);
  const lod=level=>{for(const m of meshes)m.visible=m.userData.lod===level;};lod(0);
  // height normalisation on the near level, measured in the posed (skinned, dequantised) shape
  model.updateMatrixWorld(true);const box=new THREE.Box3();for(const m of meshes)if(m.visible){m.skeleton.update();m.computeBoundingBox();box.union(m.boundingBox.clone().applyMatrix4(m.matrixWorld));}
  root.scale.setScalar(height/((box.max.y-box.min.y)||1));
  const rest=new Map();model.traverse(o=>{if(o.isBone)rest.set(o,{p:o.position.clone(),q:o.quaternion.clone()});});
  const animate=animator(parts),manner=MANNERS[id]?.(parts);let clock=0;
  function update(dt,state={}){
    for(const [b,r]of rest){if(b===parts.body||b===parts.head||b===parts.tail||parts.arms.includes(b)||parts.legs.includes(b)){b.position.copy(r.p);}}
    if(parts.body){parts.body.rotation.set(0,0,0);parts.body.scale.set(1,1,1);}parts.root.rotation.set(0,0,0);
    if(parts.tail)parts.tail.rotation.setFromQuaternion(rest.get(parts.tail).q);
    const showing=state.action==='trick'||state.action==='point',own=manner&&!state.reduced&&!showing,shared=(own&&(state.action==='greet'||state.action==='look'))||showing?{...state,action:''}:state;
    animate(dt,shared);if(state.action==='sleep'&&id==='fox')plushSleep(parts);if(own)manner(dt,state);
    if(state.action==='trick'&&!state.reduced&&TRICKS[state.trick]){clock+=dt;TRICKS[state.trick](parts,state.u||0,clock);}
    if(state.action==='point')pointPose(parts,state.reduced?1:Math.min(1,state.u??1));
  }
  return {root,parts,update,lod,meshes,paw:parts.arms[1]||parts.body};
}
// A rig shows the procedural model at once and becomes the baked plush model when it has loaded.
function rig(id,height){
  const made=procedural[id]?procedural[id](height):{group:new THREE.Group(),parts:{},update(){}},group=made.group;
  const out={group,height,get parts(){return current.parts;},update:(dt,s)=>current.update(dt,s),lod:level=>current.lod?.(level),plush:false,paw:made.paw||made.parts.arms?.[1]||made.parts.body};
  let current=made;
  function upgrade(){if(!baked[id])return;const p=plushModel(id,height);group.clear();group.add(p.root);current=p;out.paw=p.paw;out.plush=true;}
  if(baked[id])upgrade();
  out.ready=castReady.then(()=>{if(!out.plush)upgrade();return out;});
  return out;
}
export const characters=Object.fromEntries(CAST.map(id=>[id,height=>rig(id,height)]));
