/* Articulated 3D Forest friends in the character sheet's soft style: big heads, glossy eyes with
   highlights, cream muzzles and chests, fluffy tails. Every rig shares one update(dt,state) with
   procedural idle, walk and interaction poses, and normalises its height to `height`. */
import {THREE} from '../forest/materials.js';

const SPHERE=new THREE.SphereGeometry(1,28,20),TAU=Math.PI*2;
const mats=new Map();
function mat(color,rough=.78){const key=color+rough;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0}));return mats.get(key);}
const glossy=new THREE.MeshStandardMaterial({color:'#24160d',roughness:.18,metalness:0}),shine=new THREE.MeshBasicMaterial({color:'#ffffff',toneMapped:false});
function blob(parent,material,pos,scale,rot){const m=new THREE.Mesh(SPHERE,material);m.position.set(...pos);m.scale.set(...scale);if(rot)m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m;}
function joint(parent,pos){const g=new THREE.Group();g.position.set(...pos);parent.add(g);return g;}
function capsule(parent,material,r,len,pos,rot){const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,len,6,14),material);m.position.set(...pos);if(rot)m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m;}
function cone(parent,material,r,h,pos,rot,scale,seg=18){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),material);m.position.set(...pos);if(rot)m.rotation.set(...rot);if(scale)m.scale.set(...scale);m.castShadow=true;parent.add(m);return m;}
function eye(parent,x,y,z,r){const g=joint(parent,[x,y,z]);blob(g,glossy,[0,0,0],[r,r*1.18,r*.62]);blob(g,shine,[-r*.32,r*.42,r*.5],[r*.3,r*.3,r*.2]);blob(g,shine,[r*.3,-r*.28,r*.52],[r*.14,r*.14,r*.1]);return g;}
function smile(parent,y,z,w,color='#3a2416'){const m=new THREE.Mesh(new THREE.TorusGeometry(w,w*.16,6,16,Math.PI*.9),mat(color,.6));m.position.set(0,y,z);m.rotation.set(0,0,Math.PI+Math.PI*.05);parent.add(m);return m;}
function brow(parent,x,y,z,len,tilt){return capsule(parent,mat('#5a3420',.7),.016,len,[x,y,z],[0,0,Math.PI/2+tilt]);}

// Shared animation: breathing, blinking, head tilt, walk cycle and simple actions.
function animator(parts){
  let phase=0,blink=2+Math.random()*3,blinkT=0,hop=0,time=Math.random()*10;
  return function update(dt,{moving=false,speed=0,action='',reduced=false}={}){
    time+=dt;const t=reduced?0:time;phase+=dt*(moving?Math.max(4,speed*3.2):0);
    const walk=moving&&!reduced?1:0,s=Math.sin(phase),c=Math.cos(phase);
    blink-=dt;if(blink<0){blinkT=.14;blink=2.4+Math.random()*3.2;}blinkT=Math.max(0,blinkT-dt);
    const closed=action==='sleep'||blinkT>0;for(const e of parts.eyes||[])e.scale.y=closed?.12:1;
    const body=parts.body;if(body){body.position.y=parts.bodyY+(walk?Math.abs(s)*.035:Math.sin(t*2)*.008)+(action==='happy'||action==='wave'?Math.abs(Math.sin(t*6))*.05:0);body.rotation.z=walk?s*.04:0;}
    if(parts.head){parts.head.rotation.z=walk?-s*.05:Math.sin(t*.7)*.07+(action==='sleep'?.25:0);parts.head.rotation.x=action==='sleep'?.22:action==='eat'?Math.sin(t*9)*.08:walk?c*.04:Math.sin(t*.45)*.04;parts.head.rotation.y=walk?0:Math.sin(t*.33)*.18;}
    const legs=parts.legs||[];legs.forEach((l,i)=>{l.rotation.x=walk?(i?-s:s)*.75:action==='bath'?-.9:0;});
    const arms=parts.arms||[];arms.forEach((a,i)=>{let x=walk?(i?s:-s)*.6:Math.sin(t*1.4+i)*.04,z=(i?-1:1)*.08;
      if(action==='wave'&&i===1){x=-2.4;z=-.3+Math.sin(t*9)*.35;}
      if(action==='happy'){x=-2.2;z=(i?-1:1)*(.35+Math.sin(t*8)*.1);}
      if(action==='eat'&&i===1){x=-2.1;z=.35;}
      if(action==='bath'){x=-1.4+Math.sin(t*5+i*2)*.5;z=(i?-1:1)*.5;}
      if(action==='sleep'){x=-.5;z=(i?-1:1)*-.25;}
      a.rotation.x=x;a.rotation.z=z;});
    if(parts.tail){parts.tail.rotation.y=(parts.tailY||0)+Math.sin(t*(walk?6:1.4))*(walk?.35:.22);parts.tail.rotation.x=parts.tailX+(walk?s*.08:Math.sin(t*1.1)*.05);}
    for(const [i,e] of (parts.ears||[]).entries()){e.rotation.z=e.userData.z+(Math.sin(t*.9+i)>.97?.25:0);}
    for(const [i,w] of (parts.wings||[]).entries()){w.rotation.z=(i?-1:1)*(action==='wave'||action==='happy'?.6+Math.sin(t*12)*.45:.08+Math.sin(t*1.6)*.03);}
    hop=action==='hop'&&!reduced?Math.abs(Math.sin(t*5))*.12:0;parts.root.position.y=hop;
  };
}
function finish(group,parts,height){group.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(group);const h=box.max.y-box.min.y||1;const k=height/h;parts.root.scale.setScalar(k);parts.root.position.y=0;return {group,parts,update:animator(parts),height};}

export function fox(height=1.6){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),orange=mat('#e2722a'),cream=mat('#f7ead6'),dark=mat('#4a2a18'),green=mat('#5b8a36',.85),pink=mat('#f2d2b8');
  const body=joint(root,[0,0,0]),bodyY=0;
  blob(body,orange,[0,.64,0],[.27,.33,.25]);blob(body,cream,[0,.66,.15],[.17,.25,.12]);
  const neck=new THREE.Mesh(new THREE.TorusGeometry(.19,.06,10,24),green);neck.position.set(0,.9,.01);neck.rotation.x=Math.PI/2;neck.castShadow=true;body.add(neck);
  cone(body,green,.2,.3,[0,.79,.21],[Math.PI+.35,0,0],[1,1,.35],4);blob(body,green,[.07,.91,.2],[.07,.055,.055]);
  const head=joint(body,[0,1.0,.02]);blob(head,orange,[0,.24,0],[.45,.38,.4]);
  for(const sx of [-1,1])blob(head,cream,[sx*.19,.1,.22],[.17,.13,.15],[0,0,sx*.35]);
  blob(head,cream,[0,.11,.3],[.16,.11,.15]);blob(head,dark,[0,.16,.45],[.058,.046,.046]);smile(head,.06,.41,.05);
  const eyes=[eye(head,-.155,.28,.32,.09),eye(head,.155,.28,.32,.09)];brow(head,-.16,.42,.33,.085,.2);brow(head,.16,.42,.33,.085,-.2);
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.23,.52,-.03]);e.userData.z=sx*-.3;e.rotation.z=e.userData.z;cone(e,orange,.15,.4,[0,.15,0]);cone(e,pink,.09,.27,[0,.12,.06],[-.1,0,0]);cone(e,dark,.075,.15,[0,.3,0]);ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.23,.82,.04]);capsule(a,orange,.065,.2,[0,-.14,0]);blob(a,dark,[0,-.29,.02],[.075,.075,.075]);arms.push(a);}
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.12,.35,0]);capsule(l,orange,.09,.07,[0,-.07,0]);capsule(l,dark,.085,.08,[0,-.19,0]);blob(l,dark,[0,-.3,.06],[.095,.065,.14]);legs.push(l);}
  const tail=joint(body,[0,.42,-.2]);blob(tail,orange,[0,.02,-.2],[.17,.17,.27],[-.5,0,0]);blob(tail,orange,[0,.2,-.42],[.23,.23,.29],[-.85,0,0]);blob(tail,cream,[0,.42,-.56],[.18,.18,.2],[-1.1,0,0]);
  const parts={root,body,bodyY,head,eyes,ears,arms,legs,tail,tailX:.15,tailY:1.05};const rig=finish(group,parts,height);
  rig.paw=arms[1];return rig;
}
export function squirrel(height=1.05){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#b9552a'),cream=mat('#f4dcbc'),dark=mat('#4a2a18'),nut=mat('#8a5a2c'),cap=mat('#5e3d20'),back=mat('#9c4622');
  const body=joint(root,[0,0,0]);blob(body,fur,[0,.42,0],[.26,.32,.24]);blob(body,cream,[0,.42,.14],[.16,.22,.12]);
  const head=joint(body,[0,.72,.04]);blob(head,fur,[0,.12,0],[.26,.23,.24]);blob(head,cream,[0,.04,.17],[.12,.08,.09]);blob(head,dark,[0,.08,.26],[.035,.03,.03]);smile(head,.02,.24,.03);
  const eyes=[eye(head,-.1,.15,.19,.055),eye(head,.1,.15,.19,.055)];
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.15,.32,-.02]);e.userData.z=sx*-.2;e.rotation.z=e.userData.z;cone(e,fur,.07,.17,[0,.06,0]);cone(e,dark,.03,.07,[0,.16,0]);ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.15,.55,.12]);capsule(a,fur,.045,.1,[0,-.08,.03],[.5,0,0]);arms.push(a);}
  blob(body,nut,[0,.47,.27],[.075,.09,.075]);blob(body,cap,[0,.54,.27],[.08,.04,.08]);
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.15,.18,.06]);blob(l,fur,[0,0,0],[.11,.12,.14]);blob(l,dark,[0,-.13,.12],[.07,.04,.11]);legs.push(l);}
  blob(body,back,[0,.5,-.1],[.22,.26,.18]);const tail=joint(body,[0,.25,-.2]);[[0,.05,-.12,.14],[0,.3,-.32,.19],[0,.6,-.36,.22],[0,.9,-.24,.21],[0,1.06,-.02,.17]].forEach(([x,y,z,r],i)=>blob(tail,i===4?mat('#d9874a'):fur,[x,y,z],[r,r*1.05,r]));
  const parts={root,body,bodyY:0,head,eyes,ears,arms:[],legs:[],tail,tailX:0,tailY:.5};return finish(group,parts,height);
}
export function bird(height=.55){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),blue=mat('#4f95d1',.6),teal=mat('#6aa7a4',.65),yellow=mat('#f0c43a',.7),white=mat('#fbf8f0'),black=mat('#222428',.5),grey=mat('#7d7f86');
  const body=joint(root,[0,0,0]);blob(body,yellow,[0,.24,.04],[.17,.18,.17]);blob(body,teal,[0,.27,-.06],[.17,.17,.17]);
  const head=joint(body,[0,.43,.06]);blob(head,white,[0,0,0],[.13,.12,.13]);blob(head,blue,[0,.06,-.01],[.13,.08,.13]);blob(head,black,[0,.0,0],[.135,.022,.12]);
  const eyes=[eye(head,-.07,.02,.1,.03),eye(head,.07,.02,.1,.03)];cone(head,black,.03,.07,[0,-.02,.15],[Math.PI/2,0,0]);
  const wings=[];for(const sx of [-1,1]){const w=joint(body,[sx*.15,.3,-.03]);blob(w,blue,[sx*.02,-.04,-.04],[.06,.13,.15],[.3,0,sx*.15]);wings.push(w);}
  const tail=joint(body,[0,.2,-.17]);blob(tail,blue,[0,-.02,-.1],[.06,.03,.14],[.5,0,0]);
  for(const sx of [-1,1])capsule(body,grey,.012,.08,[sx*.06,.05,.03]);
  const parts={root,body,bodyY:0,head,eyes,wings,tail,tailX:0};return finish(group,parts,height);
}
export function owl(height=1.2){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),brown=mat('#9a6638'),belly=mat('#d8b483'),disc=mat('#ead2a6'),beak=mat('#c9963f'),feet=mat('#e2a93c'),spot=mat('#8a5a30');
  const body=joint(root,[0,0,0]);blob(body,brown,[0,.42,0],[.36,.42,.33]);blob(body,belly,[0,.38,.17],[.25,.31,.18]);
  for(let i=0;i<7;i++)blob(body,spot,[(i%3-1)*.1,.26+Math.floor(i/3)*.1,.33],[.025,.035,.012]);
  const head=joint(body,[0,.84,.02]);blob(head,brown,[0,0,0],[.33,.29,.3]);for(const sx of [-1,1])blob(head,disc,[sx*.13,-.01,.2],[.15,.16,.09]);
  const eyes=[eye(head,-.13,0,.27,.075),eye(head,.13,0,.27,.075)];cone(head,beak,.04,.1,[0,-.09,.3],[Math.PI*.6,0,0]);
  const wings=[];for(const sx of [-1,1]){const w=joint(body,[sx*.33,.55,-.02]);blob(w,brown,[sx*.03,-.18,-.02],[.1,.28,.22],[0,0,sx*.12]);wings.push(w);}
  for(const sx of [-1,1])for(let k=-1;k<=1;k++)blob(body,feet,[sx*.12+k*.035,.02,.2],[.03,.025,.06]);
  const parts={root,body,bodyY:0,head,eyes,wings};return finish(group,parts,height);
}
export function mouse(height=1.05){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#d49a62'),cream=mat('#f3dcbc'),pink=mat('#f0a49b'),dark=mat('#3a2416'),book=mat('#5e8c3a',.8),page=mat('#fbf4e2');
  const body=joint(root,[0,0,0]);blob(body,fur,[0,.38,0],[.24,.32,.22]);blob(body,cream,[0,.36,.13],[.15,.22,.1]);
  const head=joint(body,[0,.72,.03]);blob(head,fur,[0,.1,0],[.25,.22,.23]);blob(head,cream,[0,.03,.16],[.12,.08,.09]);blob(head,pink,[0,.07,.26],[.035,.03,.03]);smile(head,.0,.22,.03);
  const eyes=[eye(head,-.1,.14,.18,.052),eye(head,.1,.14,.18,.052)];
  const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.2,.3,-.04]);e.userData.z=0;blob(e,fur,[0,0,0],[.15,.15,.04]);blob(e,pink,[0,0,.025],[.1,.1,.02]);ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.15,.48,.12]);capsule(a,fur,.04,.08,[0,-.06,.04],[.7,0,0]);arms.push(a);}
  const open=joint(body,[0,.44,.24]);for(const sx of [-1,1]){const cover=new THREE.Mesh(new THREE.BoxGeometry(.14,.18,.015),book);cover.position.set(sx*.07,0,0);cover.rotation.y=sx*-.35;open.add(cover);const p=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.01),page);p.position.set(sx*.065,0,.01);p.rotation.y=sx*-.35;open.add(p);}open.rotation.x=-.4;
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.13,.12,.08]);blob(l,fur,[0,0,0],[.1,.08,.13]);legs.push(l);}
  const tail=joint(body,[0,.12,-.2]);const curve=new THREE.CatmullRomCurve3([[0,0,0],[.15,-.05,-.2],[.35,0,-.3],[.45,.12,-.25]].map(p=>new THREE.Vector3(...p)));const tm=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.02,6),pink);tail.add(tm);
  const parts={root,body,bodyY:0,head,eyes,ears,tail,tailX:0};return finish(group,parts,height);
}
export function beaver(height=1.15){
  const group=new THREE.Group(),root=joint(group,[0,0,0]),fur=mat('#8a5632'),light=mat('#c19065'),dark=mat('#3b2416'),tooth=mat('#fffaf0',.4),tailMat=mat('#5a3a26',.9);
  const body=joint(root,[0,0,0]);blob(body,fur,[0,.42,0],[.33,.38,.3]);blob(body,light,[0,.4,.17],[.22,.27,.13]);
  const head=joint(body,[0,.82,.04]);blob(head,fur,[0,.08,0],[.27,.24,.25]);blob(head,light,[0,.0,.18],[.15,.1,.11]);blob(head,dark,[0,.06,.28],[.05,.035,.035]);
  for(const sx of [-1,1]){const t=new THREE.Mesh(new THREE.BoxGeometry(.035,.06,.02),tooth);t.position.set(sx*.02,-.08,.27);head.add(t);}
  const eyes=[eye(head,-.11,.13,.2,.05),eye(head,.11,.13,.2,.05)];const ears=[];for(const sx of [-1,1]){const e=joint(head,[sx*.2,.22,-.02]);e.userData.z=0;blob(e,fur,[0,0,0],[.06,.06,.04]);ears.push(e);}
  const arms=[];for(const sx of [-1,1]){const a=joint(body,[sx*.25,.6,.1]);capsule(a,fur,.06,.12,[0,-.1,.02]);blob(a,dark,[0,-.2,.03],[.06,.05,.06]);arms.push(a);}
  const legs=[];for(const sx of [-1,1]){const l=joint(body,[sx*.17,.15,.05]);blob(l,fur,[0,0,0],[.12,.12,.13]);blob(l,dark,[0,-.12,.1],[.09,.04,.12]);legs.push(l);}
  const tail=joint(body,[0,.12,-.28]);blob(tail,tailMat,[0,-.04,-.24],[.2,.05,.3],[.25,0,0]);
  const parts={root,body,bodyY:0,head,eyes,ears,arms,legs,tail,tailX:0};return finish(group,parts,height);
}
export const characters={fox,squirrel,bird,owl,mouse,beaver};
