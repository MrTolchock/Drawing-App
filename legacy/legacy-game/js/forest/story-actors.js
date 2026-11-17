/* Rounded, articulated 3D actors for the story scenes, in the woodland palette. */
import {THREE,paint,ellipsoid,curveTube} from './materials.js';

export function storyActor(id){
  const root=new THREE.Group(),figure=new THREE.Group();root.name='cinema-'+id;root.userData.kind='story-actor';root.add(figure);
  const colours={fox:'#c97c3d',beaver:'#987044',hare:'#ac916b',hedgehog:'#aa9067',owl:'#98774f',kingfisher:'#4e95a6'};
  const fur=paint(colours[id]),cream=paint(id==='fox'?'#f1dfb9':'#dbc8a3'),dark=new THREE.MeshStandardMaterial({color:'#302b23',roughness:.28});
  const rose=paint('#c3957b'),scarf=paint('#6f8c4b'),white=new THREE.MeshBasicMaterial({color:'#fff5d6'});
  const bird=id==='owl'||id==='kingfisher',small=id==='hedgehog';
  const body=ellipsoid(figure,fur,[0,small?.85:1.08,0],small?[.78,.63,.66]:bird?[.6,.82,.45]:[.61,.88,.46]);
  const head=new THREE.Group();head.name='cinema-'+id+'-head';head.position.set(0,small?1.35:id==='kingfisher'?1.9:2.15,.12);figure.add(head);
  ellipsoid(head,fur,[0,0,0],id==='beaver'?[.69,.61,.58]:id==='hare'?[.52,.59,.47]:small?[.49,.42,.47]:id==='kingfisher'?[.48,.42,.43]:[.65,.61,.56]);
  const legs=[],arms=[],ears=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group();leg.position.set(side*(small?.42:.3),small?.36:.48,0);figure.add(leg);legs.push(leg);
    ellipsoid(leg,fur,[0,-.14,0],[small?.15:.20,small?.15:.30,.2]);
    ellipsoid(leg,bird?paint('#b7894a'):fur,[0,-(small?.27:.34),.17],[small?.2:.25,.14,id==='hare'?.43:.3]);
    const arm=new THREE.Group();arm.position.set(side*(bird?.53:small?.5:.57),small?1:1.65,.03);figure.add(arm);arms.push(arm);
    ellipsoid(arm,fur,[0,-.35,0],bird?[.18,.52,.30]:[.17,.41,.18]);
    if(!bird)ellipsoid(arm,fur,[0,-.69,.05],[.21,.17,.2]);
    if(id==='fox'){
      const ear=new THREE.Group();ear.position.set(side*.43,.44,-.06);ear.rotation.z=-side*.18;head.add(ear);ears.push(ear);
      const cone=new THREE.Mesh(new THREE.ConeGeometry(.26,.63,3),fur);cone.position.y=.24;cone.rotation.y=Math.PI/3;ear.add(cone);
      const triangle=new THREE.Shape();triangle.moveTo(-.12,0);triangle.lineTo(.12,0);triangle.lineTo(0,.35);triangle.closePath();
      const inner=new THREE.Mesh(new THREE.ShapeGeometry(triangle),cream);inner.position.set(0,.07,.14);ear.add(inner);
    }else if(id==='hare'){
      const ear=new THREE.Group();ear.position.set(side*.24,.36,-.05);ear.rotation.z=-side*.10;head.add(ear);ears.push(ear);
      ellipsoid(ear,fur,[0,.52,0],[.16,.65,.13]);ellipsoid(ear,rose,[0,.52,.105],[.08,.47,.035]);ellipsoid(ear,paint('#61513b'),[0,1.02,0],[.12,.17,.11]);
    }else if(!bird){
      const ear=new THREE.Group();ear.position.set(side*.52,.4,0);head.add(ear);ears.push(ear);
      ellipsoid(ear,fur,[0,0,0],[.19,.21,.13]);ellipsoid(ear,rose,[0,0,.11],[.10,.11,.03]);
    }
  }
  let tail;
  if(id==='fox'){
    tail=new THREE.Group();tail.position.set(.1,.75,-.4);figure.add(tail);tail.rotation.x=-.45;tail.rotation.z=-.4;
    ellipsoid(tail,fur,[.22,.06,-.56],[.41,.46,.82]);ellipsoid(tail,cream,[.22,.12,-1.16],[.34,.35,.4]);
    ellipsoid(figure,cream,[0,1.3,.36],[.36,.54,.17]);
    const collar=new THREE.Mesh(new THREE.TorusGeometry(.36,.105,8,24),scarf);collar.rotation.x=Math.PI/2;collar.position.y=1.91;figure.add(collar);
    const cloth=new THREE.Shape();cloth.moveTo(-.28,.25);cloth.lineTo(.28,.25);cloth.lineTo(0,-.35);cloth.closePath();
    const bib=new THREE.Mesh(new THREE.ShapeGeometry(cloth),scarf);bib.position.set(0,1.65,.68);figure.add(bib);
    ellipsoid(figure,scarf,[.39,1.86,.06],[.16,.12,.12]);
    for(const side of [-1,1])ellipsoid(head,cream,[side*.27,-.18,.43],[.39,.27,.30]);
    ellipsoid(head,dark,[0,-.055,.86],[.13,.105,.10]);
  }else if(id==='beaver'){
    tail=new THREE.Group();tail.position.set(0,.34,-.4);tail.rotation.y=-.35;figure.add(tail);
    const tailMat=paint('#745a40','bark');ellipsoid(tail,tailMat,[0,0,-.68],[.43,.115,.95]);
    for(let i=0;i<4;i++)curveTube(tail,paint('#9a7951'),[[-.28,.105,-.3-i*.3],[0,.13,-.4-i*.3],[.28,.105,-.3-i*.3]],.018,8);
    ellipsoid(figure,paint('#b29365'),[0,1,.35],[.38,.54,.14]);
    ellipsoid(head,cream,[0,-.18,.47],[.46,.25,.25]);ellipsoid(head,dark,[0,-.035,.72],[.18,.115,.10]);
    for(const side of [-1,1]){const tooth=new THREE.Mesh(new THREE.BoxGeometry(.13,.24,.13),cream);tooth.position.set(side*.078,-.39,.65);head.add(tooth);}
  }else if(id==='hare'){
    ellipsoid(figure,cream,[0,1.15,.37],[.34,.52,.14]);ellipsoid(figure,cream,[0,.6,-.49],[.27,.26,.25]);
    for(const side of [-1,1])ellipsoid(head,cream,[side*.15,-.16,.38],[.23,.2,.21]);ellipsoid(head,rose,[0,-.02,.6],[.09,.07,.065]);
  }else if(small){
    const geometry=new THREE.ConeGeometry(.105,.38,5),quills=new THREE.InstancedMesh(geometry,paint('#785f3e'),40),matrix=new THREE.Matrix4(),quat=new THREE.Quaternion();
    for(let i=0;i<40;i++){
      const a=i*2.4,d=new THREE.Vector3(Math.sin(a)*.8,.25+(i%5)/5,-.15-Math.abs(Math.cos(a))*.7).normalize();
      matrix.compose(new THREE.Vector3(d.x*.75,.85+d.y*.59,-.07+d.z*.6),quat.setFromUnitVectors(new THREE.Vector3(0,1,0),d),new THREE.Vector3(1,1,1));quills.setMatrixAt(i,matrix);
    }
    figure.add(quills);ellipsoid(head,cream,[0,-.12,.31],[.35,.28,.40]);ellipsoid(head,dark,[0,-.10,.72],[.10,.075,.08]);
  }else if(id==='owl'){
    for(const side of [-1,1])ellipsoid(head,cream,[side*.275,.025,.46],[.32,.36,.095]);
    ellipsoid(figure,cream,[0,1,.33],[.4,.6,.14]);
    for(let i=0;i<7;i++)ellipsoid(figure,fur,[Math.sin(i*2.4)*.25,.65+(i%3)*.23,.46],[.035,.08,.025]);
  }else{
    ellipsoid(figure,paint('#c48b4f'),[0,1,.33],[.36,.57,.16]);
    for(const side of [-1,1]){ellipsoid(head,cream,[side*.36,-.06,.16],[.13,.11,.12]);ellipsoid(head,paint('#c48b4f'),[side*.33,-.16,.32],[.13,.13,.09]);}
  }
  let bill;
  if(bird){
    bill=new THREE.Mesh(new THREE.ConeGeometry(id==='owl'?.11:.075,id==='owl'?.29:.72,8),id==='owl'?paint('#bd9549'):dark);
    bill.rotation.x=Math.PI/2;bill.position.set(0,-.12,id==='owl'?.67:.73);head.add(bill);
  }
  const eyes=[],brows=[],eyeX=small?.21:id==='hare'?.22:id==='kingfisher'?.23:.27,eyeZ=small?.46:id==='hare'?.43:id==='kingfisher'?.36:.53;
  for(const side of [-1,1]){
    const eye=new THREE.Group();eye.position.set(side*eyeX,.13,eyeZ);head.add(eye);eyes.push(eye);
    if(id==='owl')ellipsoid(eye,paint('#cfad60'),[0,0,0],[.18,.205,.055]);
    ellipsoid(eye,dark,[0,0,.03],[id==='owl'?.095:.078,id==='owl'?.145:.105,.05]);ellipsoid(eye,white,[-.024,.042,.074],[.023,.031,.012]);
    const brow=ellipsoid(head,paint(id==='fox'?'#91582e':id==='kingfisher'?'#316c80':'#71573d'),[side*eyeX,.34,eyeZ],[.15,.032,.035]);brows.push(brow);
  }
  const mouthZ=id==='fox'?.77:id==='beaver'?.75:id==='hare'?.61:small?.73:.64;
  const mouth=ellipsoid(head,dark,[0,-.28,mouthZ],[.15,.025,.025]);if(bird)mouth.visible=false;
  mouth.name='cinema-'+id+'-mouth';
  const smile=curveMouth(false),frown=curveMouth(true);
  function curveMouth(sad){const line=new THREE.Group();head.add(line);curveTube(line,dark,[[-.13,sad?-.33:-.27,mouthZ],[0,sad?-.27:-.33,mouthZ+.02],[.13,sad?-.33:-.27,mouthZ]],.017,10);return line;}
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.9,24),new THREE.MeshBasicMaterial({color:'#4c563c',transparent:true,opacity:.16,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.02;root.add(shadow);
  root.traverse(mesh=>{mesh.castShadow=false;mesh.receiveShadow=false;});
  function animate(time,{mood='gentle',action='',talking=false,moving=false,reduced=false}={}){
    const t=reduced?0:time,sad=['sad','longing','worried'].includes(mood),joy=['joyful','excited','amazed'].includes(mood);
    root.userData.mood=mood;root.userData.action=action;
    head.rotation.x=sad?.24:mood==='curious'?-.10:joy?-.08:0;
    head.rotation.z=sad?-.09:mood==='curious'?.12:Math.sin(t*.85)*.018;
    head.rotation.y=mood==='worried'?Math.sin(t*.8)*.18:Math.sin(t*.55)*.025;
    const blink=!reduced&&Math.sin(t*.7+1)> .994;
    eyes.forEach(e=>e.scale.y=blink?.12:joy?1.12:1);
    brows.forEach((b,i)=>b.rotation.z=(i?1:-1)*(sad?-.42:joy?.18:0));
    ears.forEach((ear,i)=>{ear.rotation.z=(i?1:-1)*(sad?(id==='hare'?.55:.3):.1)+Math.sin(t*1.5+i)*.025;});
    const wave=action==='wave'||(action==='celebrate'&&joy),point=['point','map','plank','touch-heart','invitation','promise'].includes(action);
    arms.forEach((arm,i)=>{const side=i?1:-1;arm.rotation.z=side*(wave?1.9+Math.sin(t*4)*.12:.12);arm.rotation.x=point?-.9:talking?-.15-Math.sin(t*3+i)*.10:0;if(bird&&joy)arm.rotation.z=side*(.6+Math.sin(t*4)*.2);});
    legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(t*7+i*Math.PI)*.35:0);
    figure.position.y=moving?Math.abs(Math.sin(t*7))*.09:action==='shiver'?Math.sin(t*17)*.018:joy&&action==='celebrate'?Math.abs(Math.sin(t*3))*.12:Math.sin(t*1.5)*.018;
    body.scale.y=(small?.63:bird?.82:.88)*(1+Math.sin(t*1.6)*.012);
    mouth.visible=!bird&&talking;mouth.scale.y=.025*(talking?1.5+Math.abs(Math.sin(t*12))*2:sad?.6:1);
    smile.visible=!bird&&!talking&&!sad;frown.visible=!bird&&!talking&&sad;
    if(bill)bill.scale.y=talking?1+Math.sin(t*12)*.06:1;
    if(tail)tail.rotation.y=Math.sin(t*(joy?3:1))*(joy?.17:.035);
  }
  return {group:root,head,figure,arms,legs,tail,eyes,animate};
}
