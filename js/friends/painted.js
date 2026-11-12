/* Forest friends scenes in the visualisation's style. The den uses the reviewed painting,
   with the painted fox composited by a fixed perspective "lens" matched to each painting's floor.
   The forest is the explorable 3D world in forest3d.js, with the same painted characters.
   Interior coordinates are authored on a 1024×768 view of each painting (assets/forest-friends). */
import {THREE} from '../scene/materials.js';
import {createForest} from './forest3d.js';
import {characters} from './characters3d.js';
import {createPerf} from './perf.js';

const ART='assets/forest-friends/',IW=1448,IH=1086,FOV=30,F=.5/Math.tan(THREE.MathUtils.degToRad(FOV/2));
const lens=new THREE.PerspectiveCamera(FOV,IW/IH,.1,600);lens.position.set(0,12,0);lens.rotation.set(THREE.MathUtils.degToRad(-17),0,0);lens.updateMatrixWorld(true);lens.updateProjectionMatrix();
const floor=new THREE.Plane(new THREE.Vector3(0,1,0),0),view=new THREE.Vector3(0,0,-1).applyQuaternion(lens.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(lens.quaternion),side=new THREE.Vector3(1,0,0).applyQuaternion(lens.quaternion);
const at=(x,y)=>({u:x/1024,v:y/768});
function ray(u,v){const r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2(u*2-1,1-v*2),lens);return r.ray;}
function ground(u,v){const p=new THREE.Vector3();return ray(u,v).intersectPlane(floor,p)||p.set(0,0,-300);}
const depth=p=>p.clone().sub(lens.position).dot(view);
const heightAt=(p,fraction)=>fraction*depth(p)/F;
const pinPoint=(u,v)=>{const r=ray(u,v);return r.origin.clone().add(r.direction.clone().multiplyScalar(20));};
const scenes={den:{need:[.03,.2,.97,.92]}};
const denSpot=at(300,440),bedSpot=at(80,405),denFrac=.349;
const pins={den:{outside:at(859,346),drawing:at(899,668),sleep:at(70,410),games:at(370,205),gallery:at(626,650)}};

export function createPaintedWorld(canvas,{position,onPosition,onNear,onAction,onMove,onAnimationEnd,onProject}){
  const software=new URLSearchParams(location.search).has('software');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  const perf=createPerf(renderer,{software});window.FK.perf=perf;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.setClearColor(0,0);
  renderer.shadowMap.enabled=!software;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  canvas.classList.add('ff-painted');canvas.parentElement?.classList.add('ff-painted-game');
  const fill=document.createElement('div');fill.className='ff-painted-fill';fill.setAttribute('aria-hidden','true');canvas.before(fill);
  const night=document.createElement('div');night.className='ff-painted-night';night.setAttribute('aria-hidden','true');canvas.after(night);
  const scene=new THREE.Scene(),camera=lens.clone();
  function drawn(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.userData.ready=true;return t;}
  function sprite(map,order=2,anchor=0){const s=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,toneMapped:false,depthWrite:false}));s.center.set(.5,anchor);s.renderOrder=order;s.userData.on=true;scene.add(s);return s;}
  function size(s,h,flip=1){const img=s.material.map.image,a=img&&img.width?img.width/img.height:.7;s.scale.set(h*a*flip,h,1);}
  const soft=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(48,26,10,.6)');r.addColorStop(1,'rgba(48,26,10,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  const foxShadow=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshBasicMaterial({map:soft,transparent:true,depthWrite:false,toneMapped:false}));foxShadow.rotation.x=-Math.PI/2;foxShadow.renderOrder=1;scene.add(foxShadow);
  const denH=heightAt(ground(denSpot.u,denSpot.v),denFrac),sleepH=heightAt(ground(bedSpot.u,bedSpot.v),.22);
  // The den's 3D fox, lit like the painting (warm daylight from the door, soft fill from the window).
  scene.add(new THREE.HemisphereLight('#ffe6c4','#7a4a2c',1.3));{const key=new THREE.DirectionalLight('#ffd49a',2.3);key.position.set(40,60,30);scene.add(key);const rim=new THREE.DirectionalLight('#ffb98a',.7);rim.position.set(-40,30,10);scene.add(rim);}
  const foxRig=characters.fox(denH),fox=foxRig.group,foxPos=new THREE.Vector3();scene.add(fox);
  // The den fox gets its own copies of the shared fur materials: a material drawn by both the den
  // (no shadows) and the forest (shadows) on one renderer left the forest fox undrawn.
  fox.traverse(o=>{if(!o.isMesh)return;const m=o.material.clone();m.onBeforeCompile=o.material.onBeforeCompile;if(Object.prototype.hasOwnProperty.call(o.material,'customProgramCacheKey'))m.customProgramCacheKey=o.material.customProgramCacheKey;o.material=m;});
  const red=new THREE.MeshStandardMaterial({color:'#d4402f',roughness:.45}),wood=new THREE.MeshStandardMaterial({color:'#c98a4c',roughness:.8});
  const apple=new THREE.Group();{const body=new THREE.Mesh(new THREE.SphereGeometry(.1,16,12),red);apple.add(body);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.01,.012,.06,6),wood);stem.position.y=.1;apple.add(stem);}apple.position.set(0,-.34,.09);apple.visible=false;foxRig.paw.add(apple);foxRig.ready.then(()=>{foxRig.paw.add(apple);apple.position.set(0,-.2,.06);apple.scale.setScalar(.6);});
  const tub=new THREE.Group();{const side=new THREE.Mesh(new THREE.CylinderGeometry(.62,.5,.55,28,1,true),wood);side.material.side=THREE.DoubleSide;side.position.y=.28;tub.add(side);for(const y of [.12,.44]){const band=new THREE.Mesh(new THREE.TorusGeometry(.6-y*.18,.025,6,28),new THREE.MeshStandardMaterial({color:'#6b4426'}));band.rotation.x=Math.PI/2;band.position.y=y;tub.add(band);}
    const water=new THREE.Mesh(new THREE.CircleGeometry(.6,28),new THREE.MeshStandardMaterial({color:'#9fd0d2',roughness:.3}));water.rotation.x=-Math.PI/2;water.position.y=.5;tub.add(water);
    const foam=new THREE.MeshStandardMaterial({color:'#fffaf2',roughness:.9});for(let i=0;i<16;i++){const a=i/16*Math.PI*2,b=new THREE.Mesh(new THREE.SphereGeometry(.12+(i%3)*.04,12,8),foam);b.position.set(Math.cos(a)*.48,.55+(i%2)*.04,Math.sin(a)*.48);tub.add(b);}}
  tub.scale.setScalar(denH/1.6);tub.visible=false;scene.add(tub);
  // Den ambience follows the painted window light; the closed door does not cast a sunbeam.
  const glowTex=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,240,200,1)');r.addColorStop(.4,'rgba(255,220,160,.45)');r.addColorStop(1,'rgba(255,210,150,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  const motes=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({map:glowTex,size:.55,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.7,toneMapped:false}));
  {const seeds=[],pos=[];for(let i=0;i<70;i++){const u=.12+Math.random()*.8,v=.12+Math.random()*.6,d=26+Math.random()*16,r=ray(u,v),p=r.origin.clone().add(r.direction.clone().multiplyScalar(d/r.direction.dot(view)));seeds.push(p.x,p.y,p.z,Math.random()*6.3);pos.push(p.x,p.y,p.z);}motes.geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));motes.userData.seeds=seeds;}scene.add(motes);
  const windowGlow=sprite(glowTex,1,.5);windowGlow.material.blending=THREE.AdditiveBlending;
  {   const w=ray(...Object.values(at(150,192)));windowGlow.position.copy(w.origin.clone().add(w.direction.clone().multiplyScalar(60/w.direction.dot(view))));windowGlow.scale.setScalar(denH*1.5);}
  const ambience=[windowGlow,motes];
  // The fox potters about the den between a few spots on the floor when left alone.
  const spots=[denSpot,at(430,470),at(560,515),at(250,505),at(390,560)].map(a=>ground(a.u,a.v));
  const idle={target:null,wait:4,greet:0,turn:.35};
  // Temporary treat props are drawn here and never saved.
  const appleTex=drawn(128,128,(g)=>{const r=g.createRadialGradient(52,60,6,64,74,50);r.addColorStop(0,'#f2766a');r.addColorStop(.6,'#d5443a');r.addColorStop(1,'#9e2a24');g.fillStyle=r;g.beginPath();g.arc(64,76,46,0,Math.PI*2);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(46,58,10,15,-.5,0,Math.PI*2);g.fill();g.strokeStyle='#6b4423';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(64,34);g.quadraticCurveTo(66,22,72,12);g.stroke();g.fillStyle='#6f9a3c';g.beginPath();g.ellipse(84,22,16,8,-.4,0,Math.PI*2);g.fill();});
  const tubTex=drawn(256,170,(g)=>{const w=g.createLinearGradient(0,0,256,0);w.addColorStop(0,'#a8693a');w.addColorStop(.5,'#dba468');w.addColorStop(1,'#a0622f');g.fillStyle=w;g.beginPath();g.moveTo(26,70);g.lineTo(230,70);g.lineTo(208,166);g.lineTo(48,166);g.closePath();g.fill();g.strokeStyle='rgba(90,52,24,.35)';g.lineWidth=2;for(let x=50;x<220;x+=22){g.beginPath();g.moveTo(x,72);g.lineTo(x+(128-x)*.12,164);g.stroke();}g.fillStyle='#7a4a28';g.fillRect(34,100,188,9);g.fillRect(42,140,172,9);g.fillStyle='#9fd0d2';g.beginPath();g.ellipse(128,70,104,18,0,0,Math.PI*2);g.fill();g.fillStyle='#fffaf0';for(let i=0;i<14;i++){const x=34+i*14.5,y=62+Math.sin(i*1.7)*6;g.beginPath();g.arc(x,y,10+(i%3)*4,0,Math.PI*2);g.fill();}});
  const bubbleTex=drawn(64,64,(g)=>{g.fillStyle='rgba(255,255,255,.28)';g.strokeStyle='#d8eef0';g.lineWidth=3;g.beginPath();g.arc(32,32,26,0,Math.PI*2);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(23,22,6,0,Math.PI*2);g.fill();});
  const zTex=drawn(64,64,(g)=>{g.font='bold 52px Andika, sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle='#4c5f8f';g.strokeText('z',32,34);g.fillStyle='#fff6d8';g.fillText('z',32,34);});
  const bubbles=Array.from({length:9},()=>sprite(bubbleTex,4,.5)),zs=Array.from({length:3},()=>sprite(zTex,4,.5));
  const props=[...bubbles,...zs];props.forEach(p=>p.userData.on=false);
  let area='den',paused=false,last=performance.now(),time=0,raf,anim=null,keys=new Set(),stick={x:0,z:0},width=0,height=0;
  const forest=createForest({renderer,software,onPosition,onAction,onMove,onNear,perf});window.FK.friendsForest=forest;window.__r=renderer;
  const crop={x:0,y:0};
  const pinList={den:[]};for(const [name,list]of Object.entries(pins))for(const [id,p]of Object.entries(list))pinList[name].push({id,point:pinPoint(p.u,p.v)});
  function layout(){
    const w=canvas.clientWidth||1,h=canvas.clientHeight||1;if(w!==width||h!==height){width=w;height=h;renderer.setSize(w,h,false);forest.resize(w,h);}
    if(area==='forest')return;
    const need=scenes[area].need;let s=Math.max(w/IW,h/IH);s=Math.min(s,w/((need[2]-need[0])*IW),h/((need[3]-need[1])*IH));
    const fw=IW*s,fh=IH*s,fu=(need[0]+need[2])/2,fv=(need[1]+need[3])/2;
    crop.x=fw>w?THREE.MathUtils.clamp(fu*fw-w/2,0,fw-w):(fw-w)/2;crop.y=fh>h?THREE.MathUtils.clamp(fv*fh-h/2,0,fh-h):(fh-h)/2;
    camera.setViewOffset(fw,fh,crop.x,crop.y,w,h);
    canvas.style.backgroundSize=fw+'px '+fh+'px';canvas.style.backgroundPosition=(-crop.x)+'px '+(-crop.y)+'px';
  }
  function setArea(next){if(!['den','forest'].includes(next))next='den';area=next;finishProps();onNear(null);
    if(next==='forest'){canvas.style.backgroundImage='none';fill.hidden=true;forest.enter(position());}
    else{const url='url('+ART+(next==='den'?'den-v2':next)+'.webp)';canvas.style.backgroundImage=url;fill.style.backgroundImage=url;fill.hidden=false;forest.stop();fox.visible=next==='den';foxShadow.visible=next==='den';ambience.forEach(a=>a.visible=next==='den');foxPos.copy(spots[0]);fox.position.copy(foxPos);fox.rotation.y=.35;idle.target=null;idle.wait=5;idle.greet=next==='den'?1.6:0;}
    layout();
  }
  function project(p){const q=p.clone().project(camera);return {x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z<1&&Math.abs(q.x)<1.02&&q.y>-1.02&&q.y<1.12};}
  function pick(event){if(paused||anim||event.button>0||area!=='forest')return;const rect=canvas.getBoundingClientRect();forest.pick((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);}
  canvas.addEventListener('pointerup',pick);
  const visibility=()=>{last=performance.now();keys.clear();stick={x:0,z:0};};document.addEventListener('visibilitychange',visibility);
  // iPadOS may drop the WebGL context while the home-screen app is in the background (blueprint 7B).
  // Stop drawing while it is lost; three.js re-uploads geometry and textures from the same objects on
  // restore, and the static shadow map is baked again.
  let lost=false;
  const contextLost=e=>{e.preventDefault();lost=true;perf.stats.lost=true;};
  const contextRestored=()=>{lost=false;perf.stats.lost=false;renderer.shadowMap.needsUpdate=true;forest.restored?.();last=performance.now();};
  canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
  const keydown=()=>{},keyup=()=>{},blur=()=>{keys.clear();stick={x:0,z:0};};
  const observer=new ResizeObserver(()=>layout());observer.observe(canvas);
  function finishProps(){props.forEach(p=>{p.userData.on=false;});night.classList.remove('on');apple.visible=false;tub.visible=false;fox.scale.setScalar(1);fox.rotation.set(0,.35,0);foxRig.update(0,{reduced:window.FK.reduced});}
  function projectedBounds(){
    fox.updateMatrixWorld(true);const points=[];
    fox.traverse(o=>{if(!o.isMesh||!o.visible)return;for(let parent=o.parent;parent&&parent!==fox;parent=parent.parent)if(!parent.visible)return;
      // skinned plush parts are measured in their posed shape, not the bind pose
      let b;if(o.isSkinnedMesh){o.skeleton.update();o.computeBoundingBox();b=o.boundingBox;}else{if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();b=o.geometry.boundingBox;}
      for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(project(new THREE.Vector3(x,y,z).applyMatrix4(o.matrixWorld)));
    });
    const left=Math.min(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y));
    return {x:left,y:top,width:Math.max(...points.map(p=>p.x))-left,height:Math.max(...points.map(p=>p.y))-top};
  }
  function fitSleepingFox(){
    const [fw,fh]=canvas.style.backgroundSize.split(' ').map(parseFloat),[bx,by]=canvas.style.backgroundPosition.split(' ').map(parseFloat);
    // Size the curled body relative to the standing fox, not the narrow mattress.
    fox.scale.setScalar(1);
    let bounds=projectedBounds();
    fox.scale.multiplyScalar(Math.min(fh*denFrac*.82,width*.8)/bounds.width);
    bounds=projectedBounds();
    const target={x:Math.max(4,bx+fw*115/IW-bounds.width/2),y:by+fh*565/IH-bounds.height/2,width:bounds.width,height:bounds.height};
    const ndc=fox.position.clone().project(camera),point=(x,y)=>new THREE.Vector3(x/width*2-1,1-y/height*2,ndc.z).unproject(camera);
    for(let i=0;i<2;i++){bounds=projectedBounds();fox.position.add(point(target.x+target.width/2,target.y+target.height/2).sub(point(bounds.x+bounds.width/2,bounds.y+bounds.height/2)));}
    anim.sleepPosition=fox.position.clone();anim.sleepScale=fox.scale.x;anim.sleepViewport=[width,height];
    anim.zBase=point(target.x+target.width*.8,target.y-14);
  }
  function animateTreat(dt){
    anim.elapsed+=dt;const t=anim.elapsed,reduced=window.FK.reduced,h=anim.item==='sleep'?sleepH:denH,base=foxPos.clone();
    if(anim.item==='apple'){
      apple.visible=t<3.8;apple.scale.setScalar(t<2?1:t<3?.72:.42);fox.position.copy(base);foxRig.update(dt,{action:t<3.8?'eat':'happy',reduced});
    }else if(anim.item==='bath'){
      tub.visible=true;tub.position.copy(base);fox.position.copy(base).addScaledVector(new THREE.Vector3(0,1,0),-h*.12);foxRig.update(dt,{action:'bath',reduced});
      bubbles.forEach((b,i)=>{const k=reduced?.4:((t*.32+i*.137)%1);b.userData.on=true;b.position.copy(base).addScaledVector(up,h*(.48+k*.55)).addScaledVector(side,h*(-.38+(i/8)*.76+Math.sin(t*1.6+i)*.03));size(b,h*(.05+(i%3)*.02));b.material.opacity=1-k*.8;});
    }else{
      fox.position.copy(anim.sleepPosition||base);fox.scale.setScalar(anim.sleepScale||sleepH/denH);fox.rotation.set(-.12,.2,0);foxRig.update(dt,{action:'sleep',reduced});
      if(!anim.sleepViewport||anim.sleepViewport[0]!==width||anim.sleepViewport[1]!==height)fitSleepingFox();
      night.classList.add('on');
      zs.forEach((z,i)=>{const k=reduced?.5:((t*.35+i*.33)%1);z.userData.on=true;z.position.copy(anim.zBase).addScaledVector(up,h*k*.3).addScaledVector(side,h*k*.12);size(z,h*(.1+i*.03));z.material.opacity=1-k;});
    }
    if(t>=5&&!anim.finished){if(anim.hold)anim.finished=true;else{anim=null;finishProps();foxPos.copy(spots[0]);fox.position.copy(foxPos);}onAnimationEnd();}
  }
  function potter(dt){const reduced=window.FK.reduced;let moving=false,speed=0;
    if(idle.greet>0){idle.greet-=dt;foxRig.update(dt,{action:'wave',reduced});return;}
    if(!idle.target&&!reduced){idle.wait-=dt;if(idle.wait<0){const choices=spots.filter(s=>s.distanceTo(foxPos)>1);idle.target=choices[Math.floor(Math.random()*choices.length)].clone();}}
    if(idle.target){const dx=idle.target.x-foxPos.x,dz=idle.target.z-foxPos.z,d=Math.hypot(dx,dz),step=Math.min(d,denH*.75*dt);
      if(d<.05){idle.target=null;idle.wait=6+Math.random()*7;}else{foxPos.x+=dx/d*step;foxPos.z+=dz/d*step;moving=true;speed=3;const want=Math.atan2(dx,dz);let diff=want-fox.rotation.y;diff=Math.atan2(Math.sin(diff),Math.cos(diff));fox.rotation.y+=diff*Math.min(1,dt*8);}}
    else{let diff=idle.turn-fox.rotation.y;diff=Math.atan2(Math.sin(diff),Math.cos(diff));fox.rotation.y+=diff*Math.min(1,dt*3);}
    fox.position.copy(foxPos);foxRig.update(dt,{moving,speed,reduced});}
  let denFrame=0;
  function frame(now){raf=requestAnimationFrame(frame);const elapsed=Math.max(0,(now-last)/1000),dt=Math.min(.25,elapsed);last=now;
    perf.frame(elapsed*1000,now,!document.hidden&&!lost&&(!paused||!!anim));
    if(document.hidden||lost)return;
    // Blueprint 7B: the den shows at once; the forest is built in slices while the child is inside.
    if(area!=='forest'&&forest.pending)forest.build(8);if(paused&&!anim)return;time+=dt;
    layout();
    if(area==='forest'&&!anim){forest.update(dt,time,{keys,stick});renderer.render(forest.scene,forest.camera);perf.rendered(forest.budget?.()||{});onProject(forest.pins());return;}
    // P5: an idle den (no walk, greeting or animation) is drawn every second frame.
    const idleDen=area==='den'&&!anim&&!idle.target&&idle.greet<=0;if(idleDen&&(++denFrame&1)){potter(dt);return;}
    if(anim)animateTreat(elapsed);
    else if(area==='den')potter(dt);
    foxShadow.visible=area==='den'&&anim?.item!=='sleep';
    foxShadow.position.set(fox.position.x,.01,fox.position.z);foxShadow.scale.setScalar((anim?.item==='sleep'?sleepH:denH)*.3);
    for(const s of props)s.visible=s.userData.on&&!!s.material.map.userData.ready;
    if(area==='den'&&!window.FK.reduced){const p=motes.geometry.attributes.position,sd=motes.userData.seeds;for(let i=0;i<p.count;i++){const k=sd[i*4+3];p.setXYZ(i,sd[i*4]+Math.sin(time*.23+k)*.9,sd[i*4+1]+Math.sin(time*.17+k*1.7)*.7,sd[i*4+2]);}p.needsUpdate=true;windowGlow.material.opacity=.18+Math.sin(time*.8+1)*.025;}
    renderer.render(scene,camera);perf.rendered();
    onProject((pinList[area]||[]).map(p=>({id:p.id,...project(p.point)})));
  }
  setArea('den');raf=requestAnimationFrame(frame);
  return {setArea(next){setArea(next);},get soundscape(){return area==='forest'&&!paused?forest.soundscape:null;},route(id){if(area==='forest')forest.route(id);},mailTarget(id){forest.mailTarget(id);},summonMailman(){forest.summonMailman();},get mailman(){return forest.mailman;},pause(value){paused=value;if(value){blur();if(area==='forest')onPosition(forest.position.x,forest.position.z,forest.region);}},
    steer(x,z){stick={x,z};if(!x&&!z&&area==='forest')onPosition(forest.position.x,forest.position.z,forest.region);},
    sequence(item,{hold=false}={}){anim={item,elapsed:0,hold};idle.target=null;fox.rotation.set(0,.35,0);foxPos.copy(item==='sleep'?ground(bedSpot.u,bedSpot.v):spots[0]);fox.position.copy(foxPos);if(item==='sleep'){fox.scale.setScalar(sleepH/denH);fox.rotation.set(-.12,.2,0);foxRig.update(0,{action:'sleep',reduced:window.FK.reduced});fitSleepingFox();}},
    skip(){anim=null;finishProps();foxPos.copy(spots[0]);fox.position.copy(foxPos);},
    get diagnostics(){const p=area==='forest'?forest.position:{x:foxPos.x,z:foxPos.z};return {area,paused,time,animation:anim?.item||null,foxBounds:area==='den'?projectedBounds():null,sleepBounds:anim?.item==='sleep'?projectedBounds():null,keys:[...keys],destination:area==='forest'?forest.destination?.toArray():undefined,position:p,mailTarget:forest.guideTarget,mailman:forest.mailman,painted:true};},get area(){return area;},get position(){return area==='forest'?forest.position:{x:foxPos.x,z:foxPos.z};},
    dispose(){cancelAnimationFrame(raf);observer.disconnect();perf.dispose();canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);canvas.removeEventListener('pointerup',pick);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);fill.remove();night.remove();renderer.dispose();},
  };
}
