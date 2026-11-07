/* Forest friends scenes in the visualisation's style. The den and shop are the reviewed paintings,
   with the painted fox composited by a fixed perspective "lens" matched to each painting's floor.
   The forest is the explorable 3D world in forest3d.js, with the same painted characters.
   Interior coordinates are authored on a 1024×768 view of each painting (assets/forest-friends). */
import {THREE} from '../forest/materials.js';
import {createForest} from './forest3d.js';

const ART='assets/forest-friends/',IW=1448,IH=1086,FOV=30,F=.5/Math.tan(THREE.MathUtils.degToRad(FOV/2));
const lens=new THREE.PerspectiveCamera(FOV,IW/IH,.1,600);lens.position.set(0,12,0);lens.rotation.set(THREE.MathUtils.degToRad(-17),0,0);lens.updateMatrixWorld(true);lens.updateProjectionMatrix();
const floor=new THREE.Plane(new THREE.Vector3(0,1,0),0),view=new THREE.Vector3(0,0,-1).applyQuaternion(lens.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(lens.quaternion),side=new THREE.Vector3(1,0,0).applyQuaternion(lens.quaternion);
const at=(x,y)=>({u:x/1024,v:y/768});
function ray(u,v){const r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2(u*2-1,1-v*2),lens);return r.ray;}
function ground(u,v){const p=new THREE.Vector3();return ray(u,v).intersectPlane(floor,p)||p.set(0,0,-300);}
const depth=p=>p.clone().sub(lens.position).dot(view);
const heightAt=(p,fraction)=>fraction*depth(p)/F;
const pinPoint=(u,v)=>{const r=ray(u,v);return r.origin.clone().add(r.direction.clone().multiplyScalar(20));};
const scenes={den:{need:[.03,.2,.97,.92]},shop:{need:[.04,.28,.96,.96]}};
const denSpot=at(300,440),cushion=at(176,560),denFrac=.349;
const pins={den:{outside:at(859,346),drawing:at(899,668),sleep:at(116,540),games:at(497,150)},shop:{leaf:at(178,488),pencils:at(300,488),apple:at(560,488),bath:at(772,488),outside:at(84,708)}};

export function createPaintedWorld(canvas,{position,onPosition,onNear,onAction,onMove,onAnimationEnd,onProject,onCollect=()=>{},collected=()=>({}),onJump=()=>{}}){
  const software=new URLSearchParams(location.search).has('software');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(software?.5:Math.min(devicePixelRatio||1,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.setClearColor(0,0);
  renderer.shadowMap.enabled=!software;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  canvas.classList.add('ff-painted');canvas.parentElement?.classList.add('ff-painted-game');
  const fill=document.createElement('div');fill.className='ff-painted-fill';fill.setAttribute('aria-hidden','true');canvas.before(fill);
  const night=document.createElement('div');night.className='ff-painted-night';night.setAttribute('aria-hidden','true');canvas.after(night);
  const scene=new THREE.Scene(),camera=lens.clone();
  const loader=new THREE.TextureLoader();
  function texture(name){const t=loader.load(ART+name+'.webp',()=>{t.userData.ready=true;});t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
  function drawn(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.userData.ready=true;return t;}
  function sprite(map,order=2,anchor=0){const s=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,toneMapped:false,depthWrite:false}));s.center.set(.5,anchor);s.renderOrder=order;s.userData.on=true;scene.add(s);return s;}
  function size(s,h,flip=1){const img=s.material.map.image,a=img&&img.width?img.width/img.height:.7;s.scale.set(h*a*flip,h,1);}
  const soft=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(48,26,10,.6)');r.addColorStop(1,'rgba(48,26,10,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  const looks={front:texture('fox-front'),side:texture('fox-side'),back:texture('fox-back'),happy:texture('fox-happy')};
  const fox=sprite(looks.front),foxPos=new THREE.Vector3();
  const foxShadow=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshBasicMaterial({map:soft,transparent:true,depthWrite:false,toneMapped:false}));foxShadow.rotation.x=-Math.PI/2;foxShadow.renderOrder=1;scene.add(foxShadow);
  const denH=heightAt(ground(denSpot.u,denSpot.v),denFrac),sleepH=heightAt(ground(cushion.u,cushion.v),.3);
  // Temporary treat props are drawn here and never saved.
  const appleTex=drawn(128,128,(g)=>{const r=g.createRadialGradient(52,60,6,64,74,50);r.addColorStop(0,'#f2766a');r.addColorStop(.6,'#d5443a');r.addColorStop(1,'#9e2a24');g.fillStyle=r;g.beginPath();g.arc(64,76,46,0,Math.PI*2);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(46,58,10,15,-.5,0,Math.PI*2);g.fill();g.strokeStyle='#6b4423';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(64,34);g.quadraticCurveTo(66,22,72,12);g.stroke();g.fillStyle='#6f9a3c';g.beginPath();g.ellipse(84,22,16,8,-.4,0,Math.PI*2);g.fill();});
  const tubTex=drawn(256,170,(g)=>{const w=g.createLinearGradient(0,0,256,0);w.addColorStop(0,'#a8693a');w.addColorStop(.5,'#dba468');w.addColorStop(1,'#a0622f');g.fillStyle=w;g.beginPath();g.moveTo(26,70);g.lineTo(230,70);g.lineTo(208,166);g.lineTo(48,166);g.closePath();g.fill();g.strokeStyle='rgba(90,52,24,.35)';g.lineWidth=2;for(let x=50;x<220;x+=22){g.beginPath();g.moveTo(x,72);g.lineTo(x+(128-x)*.12,164);g.stroke();}g.fillStyle='#7a4a28';g.fillRect(34,100,188,9);g.fillRect(42,140,172,9);g.fillStyle='#9fd0d2';g.beginPath();g.ellipse(128,70,104,18,0,0,Math.PI*2);g.fill();g.fillStyle='#fffaf0';for(let i=0;i<14;i++){const x=34+i*14.5,y=62+Math.sin(i*1.7)*6;g.beginPath();g.arc(x,y,10+(i%3)*4,0,Math.PI*2);g.fill();}});
  const bubbleTex=drawn(64,64,(g)=>{g.fillStyle='rgba(255,255,255,.28)';g.strokeStyle='#d8eef0';g.lineWidth=3;g.beginPath();g.arc(32,32,26,0,Math.PI*2);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(23,22,6,0,Math.PI*2);g.fill();});
  const zTex=drawn(64,64,(g)=>{g.font='bold 52px Andika, sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle='#4c5f8f';g.strokeText('z',32,34);g.fillStyle='#fff6d8';g.fillText('z',32,34);});
  const apple=sprite(appleTex,3,.5),tub=sprite(tubTex,3,0),bubbles=Array.from({length:9},()=>sprite(bubbleTex,4,.5)),zs=Array.from({length:3},()=>sprite(zTex,4,.5));
  const props=[apple,tub,...bubbles,...zs];props.forEach(p=>p.userData.on=false);
  let area='den',paused=false,last=performance.now(),time=0,raf,anim=null,keys=new Set(),stick={x:0,z:0},width=0,height=0;
  const forest=createForest({renderer,looks,texture,software,onPosition,onAction,onMove,onNear,onCollect,collected});
  const crop={x:0,y:0};
  const pinList={den:[],shop:[]};for(const [name,list]of Object.entries(pins))for(const [id,p]of Object.entries(list))pinList[name].push({id,point:pinPoint(p.u,p.v)});
  function layout(){
    const w=canvas.clientWidth||1,h=canvas.clientHeight||1;if(w!==width||h!==height){width=w;height=h;renderer.setSize(w,h,false);forest.resize(w,h);}
    if(area==='forest')return;
    const need=scenes[area].need;let s=Math.max(w/IW,h/IH);s=Math.min(s,w/((need[2]-need[0])*IW),h/((need[3]-need[1])*IH));
    const fw=IW*s,fh=IH*s,fu=(need[0]+need[2])/2,fv=(need[1]+need[3])/2;
    crop.x=fw>w?THREE.MathUtils.clamp(fu*fw-w/2,0,fw-w):(fw-w)/2;crop.y=fh>h?THREE.MathUtils.clamp(fv*fh-h/2,0,fh-h):(fh-h)/2;
    camera.setViewOffset(fw,fh,crop.x,crop.y,w,h);
    canvas.style.backgroundSize=fw+'px '+fh+'px';canvas.style.backgroundPosition=(-crop.x)+'px '+(-crop.y)+'px';
  }
  function setArea(next){area=next;finishProps();onNear(null);
    if(next==='forest'){canvas.style.backgroundImage='none';fill.hidden=true;forest.enter(position());}
    else{const url='url('+ART+next+'.webp)';canvas.style.backgroundImage=url;fill.style.backgroundImage=url;fill.hidden=false;forest.stop();fox.userData.on=next==='den';foxShadow.visible=next==='den';foxPos.copy(ground(denSpot.u,denSpot.v));}
    layout();
  }
  function project(p){const q=p.clone().project(camera);return {x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z<1&&Math.abs(q.x)<1.02&&q.y>-1.02&&q.y<1.12};}
  function pick(event){if(paused||anim||event.button>0||area!=='forest')return;const rect=canvas.getBoundingClientRect();forest.pick((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);}
  canvas.addEventListener('pointerup',pick);
  const visibility=()=>{last=performance.now();keys.clear();stick={x:0,z:0};};document.addEventListener('visibilitychange',visibility);
  const keydown=e=>{if(paused||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){keys.add(e.key);e.preventDefault();}else if(e.key===' '&&area==='forest'&&!e.repeat&&e.target===document.body){if(forest.jump())onJump();e.preventDefault();}},
    keyup=e=>{if(keys.delete(e.key)&&area==='forest')onPosition(forest.position.x,forest.position.z);},blur=()=>{keys.clear();stick={x:0,z:0};};
  document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
  const observer=new ResizeObserver(()=>layout());observer.observe(canvas);
  function finishProps(){props.forEach(p=>{p.userData.on=false;});night.classList.remove('on');fox.material.rotation=0;}
  function animateTreat(dt){
    anim.elapsed+=dt;const t=anim.elapsed,reduced=window.FK.reduced,h=anim.item==='sleep'?sleepH:denH,base=foxPos.clone();
    if(anim.item==='apple'){
      fox.material.map=t<3.8?looks.front:looks.happy;apple.userData.on=t<3.8;size(apple,h*.17*(t<2?1:t<3?.72:.42));apple.position.copy(base).addScaledVector(up,h*.43).addScaledVector(side,h*.03);
      fox.position.copy(base).addScaledVector(up,reduced?0:Math.abs(Math.sin(t*7))*h*.012);
    }else if(anim.item==='bath'){
      fox.material.map=looks.happy;tub.userData.on=true;tub.position.copy(base).addScaledVector(up,-h*.03);size(tub,h*.5);tub.scale.x=h*.95;
      fox.position.copy(base).addScaledVector(up,reduced?h*.04:h*(.04+Math.abs(Math.sin(t*2.6))*.02));
      bubbles.forEach((b,i)=>{const k=reduced?.4:((t*.32+i*.137)%1);b.userData.on=true;b.position.copy(base).addScaledVector(up,h*(.48+k*.55)).addScaledVector(side,h*(-.38+(i/8)*.76+Math.sin(t*1.6+i)*.03));size(b,h*(.05+(i%3)*.02));b.material.opacity=1-k*.8;});
    }else{
      fox.material.map=looks.happy;fox.position.copy(base);fox.material.rotation=reduced?.08:.08+Math.sin(t*1.4)*.03;night.classList.add('on');
      zs.forEach((z,i)=>{const k=reduced?.5:((t*.35+i*.33)%1);z.userData.on=true;z.position.copy(base).addScaledVector(up,h*(.95+k*.45)).addScaledVector(side,h*(.12+k*.25));size(z,h*(.1+i*.03));z.material.opacity=1-k;});
    }
    if(t>=5){anim=null;finishProps();fox.material.map=looks.front;foxPos.copy(ground(denSpot.u,denSpot.v));onAnimationEnd();}
  }
  function frame(now){raf=requestAnimationFrame(frame);const elapsed=Math.max(0,(now-last)/1000),dt=Math.min(.25,elapsed);last=now;if(document.hidden)return;if(paused&&!anim)return;time+=dt;
    layout();
    if(area==='forest'&&!anim){forest.update(dt,time,{keys,stick});renderer.render(forest.scene,forest.camera);onProject(forest.pins());return;}
    if(anim)animateTreat(elapsed);
    else{const reduced=window.FK.reduced;fox.material.map=looks.front;fox.position.copy(foxPos);fox.material.rotation=0;size(fox,denH*(reduced?1:1+Math.sin(time*2.2)*.008));}
    if(anim)size(fox,anim.item==='sleep'?sleepH:denH);
    foxShadow.position.set(foxPos.x,.01,foxPos.z);foxShadow.scale.setScalar((anim?.item==='sleep'?sleepH:denH)*.3);
    for(const s of [fox,...props])s.visible=s.userData.on&&!!s.material.map.userData.ready;
    renderer.render(scene,camera);
    onProject((pinList[area]||[]).map(p=>({id:p.id,...project(p.point)})));
  }
  setArea('den');raf=requestAnimationFrame(frame);
  return {setArea(next){setArea(next);},route(id){if(area==='forest')forest.route(id);},pause(value){paused=value;if(value){blur();if(area==='forest')onPosition(forest.position.x,forest.position.z);}},
    steer(x,z){stick={x,z};if(!x&&!z&&area==='forest')onPosition(forest.position.x,forest.position.z);},jump(){const ok=area==='forest'&&!paused&&forest.jump();if(ok)onJump();return ok;},
    sequence(item){anim={item,elapsed:0};foxPos.copy(item==='sleep'?ground(cushion.u,cushion.v):ground(denSpot.u,denSpot.v));fox.position.copy(foxPos);},
    skip(){anim=null;finishProps();fox.material.map=looks.front;foxPos.copy(ground(denSpot.u,denSpot.v));},
    get diagnostics(){const p=area==='forest'?forest.position:{x:foxPos.x,z:foxPos.z};return {area,paused,time,keys:[...keys],destination:area==='forest'?forest.destination?.toArray():undefined,position:p,painted:true};},get area(){return area;},get position(){return area==='forest'?forest.position:{x:foxPos.x,z:foxPos.z};},
    dispose(){cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerup',pick);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);fill.remove();night.remove();renderer.dispose();},
  };
}
