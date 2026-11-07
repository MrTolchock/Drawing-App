/* Painted Forest friends scenes: the reviewed paintings fill the screen and the playable fox and
   the owl are painted cut-out sprites, composited by a fixed perspective "lens" that matches each
   painting's ground. Everything decorative comes from the paintings, so nothing here is solid.
   Coordinates are authored on a 1024×768 view of each painting (assets/forest-friends). */
import {THREE} from '../forest/materials.js';
import {actor} from './actors.js';

const ART='assets/forest-friends/',IW=1448,IH=1086,FOV=30,F=.5/Math.tan(THREE.MathUtils.degToRad(FOV/2)),SPEED=3.3;
const lens=new THREE.PerspectiveCamera(FOV,IW/IH,.1,600);lens.position.set(0,12,0);lens.rotation.set(THREE.MathUtils.degToRad(-17),0,0);lens.updateMatrixWorld(true);lens.updateProjectionMatrix();
const floor=new THREE.Plane(new THREE.Vector3(0,1,0),0),view=new THREE.Vector3(0,0,-1).applyQuaternion(lens.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(lens.quaternion),side=new THREE.Vector3(1,0,0).applyQuaternion(lens.quaternion);
const at=(x,y)=>({u:x/1024,v:y/768});
function ray(u,v){const r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2(u*2-1,1-v*2),lens);return r.ray;}
function ground(u,v){const p=new THREE.Vector3();return ray(u,v).intersectPlane(floor,p)||p.set(0,0,-300);}
function picture(p){const q=p.clone().project(lens);return {u:(q.x+1)/2,v:(1-q.y)/2};}
const depth=p=>p.clone().sub(lens.position).dot(view);
const heightAt=(p,fraction)=>fraction*depth(p)/F;
function lifted(u,v,base){const r=ray(u,v);return r.origin.clone().add(r.direction.clone().multiplyScalar(depth(base)/r.direction.dot(view)));}
const pinPoint=(u,v)=>{const r=ray(u,v);return r.origin.clone().add(r.direction.clone().multiplyScalar(20));};

// Forest: walkable painted dirt (paths, plaza and stall mats), route hubs, stops and pin anchors.
const walkArea=[[250,745],[232,660],[190,600],[150,560],[108,520],[58,472],[25,430],[20,330],[25,250],[52,205],[132,205],[152,255],[172,330],[195,445],[305,445],[335,402],[470,395],[500,398],[640,420],[648,450],[720,455],[762,442],[805,438],[815,468],[722,500],[708,560],[642,600],[616,650],[622,745]].map(([x,y])=>at(x,y));
const hubs=[[150,482],[330,470],[470,440],[640,472],[700,520],[96,330],[80,250],[430,600],[300,570]].map(([x,y])=>{const a=at(x,y);return ground(a.u,a.v);});
const spots={
  home:{stop:[400,432],pin:[392,262],picture:'door',name:'Nach Hause'},
  shop:{stop:[585,446],pin:[600,240],picture:'bag',name:'Zum Laden'},
  squirrel:{stop:[112,234],pin:[86,134],picture:'squirrel',name:'Zu Eichhörnchen'},
  bird:{stop:[180,480],pin:[98,390],picture:'bird',name:'Zu Blaumeise'},
  owl:{stop:[262,472],pin:[262,300],picture:'owl',name:'Zu Waldkauz'},
  beaver:{stop:[778,460],pin:[792,352],picture:'beaver',name:'Zu Biber'},
  mouse:{stop:[690,524],pin:[852,532],picture:'mouse',name:'Zu Maus'},
};
export const paintedPlaces=Object.fromEntries(Object.entries(spots).map(([id,s])=>{const a=at(...s.stop),g=ground(a.u,a.v),pin=at(...s.pin);return [id,{x:g.x,z:g.z,u:a.u,v:a.v,pu:pin.u,pv:pin.v,picture:s.picture,name:s.name}];}));
export const paintedExits={den:paintedPlaces.home,shop:paintedPlaces.shop};
function inside(u,v){let hit=false;for(let i=0,j=walkArea.length-1;i<walkArea.length;j=i++){const a=walkArea[i],b=walkArea[j];if((a.v>v)!==(b.v>v)&&u<(b.u-a.u)*(v-a.v)/(b.v-a.v)+a.u)hit=!hit;}return hit;}
const insideWorld=(x,z)=>{const q=picture(new THREE.Vector3(x,0,z));return inside(q.u,q.v);};
function nearestWalkable(p){const q=picture(p);if(inside(q.u,q.v))return p;let best=null,bestD=Infinity;
  for(let i=0;i<walkArea.length;i++){const a=walkArea[i],b=walkArea[(i+1)%walkArea.length],dx=b.u-a.u,dy=b.v-a.v,t=THREE.MathUtils.clamp(((q.u-a.u)*dx+(q.v-a.v)*dy)/(dx*dx+dy*dy||1),0,1),u=a.u+dx*t,v=a.v+dy*t,d=(u-q.u)**2+(v-q.v)**2;if(d<bestD){bestD=d;best={u,v};}}
  const c=at(400,520);return ground(best.u+(c.u-best.u)*.03,best.v+(c.v-best.v)*.03);}
// Scenes: painting, area that must stay visible on any screen, and object/pin anchors.
const scenes={den:{need:[.03,.2,.97,.92]},forest:{need:[.35,.25,.65,.75]},shop:{need:[.04,.28,.96,.96]}};
const denSpot=at(300,440),cushion=at(176,560),denFrac=.349,forestFrac=.228;
const pins={
  den:{outside:at(859,346),drawing:at(899,668),sleep:at(116,540)},
  shop:{leaf:at(178,488),pencils:at(300,488),apple:at(560,488),bath:at(772,488),outside:at(84,708)},
  forest:Object.fromEntries(Object.entries(paintedPlaces).map(([id,p])=>[id,{u:p.pu,v:p.pv}])),
};

export function createPaintedWorld(canvas,{position,onPosition,onNear,onAction,onMove,onAnimationEnd,onProject}){
  const software=new URLSearchParams(location.search).has('software');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(software?.5:Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0,0);
  canvas.classList.add('ff-painted');canvas.parentElement?.classList.add('ff-painted-game');
  const fill=document.createElement('div');fill.className='ff-painted-fill';fill.setAttribute('aria-hidden','true');canvas.before(fill);
  const night=document.createElement('div');night.className='ff-painted-night';night.setAttribute('aria-hidden','true');canvas.after(night);
  const scene=new THREE.Scene(),camera=lens.clone();
  scene.add(new THREE.HemisphereLight('#ffe4b0','#7c5a34',1.5));{const sun=new THREE.DirectionalLight('#ffd49a',2.2);sun.position.set(-6,14,6);scene.add(sun);}
  const loader=new THREE.TextureLoader();
  function texture(name){const t=loader.load(ART+name+'.webp',()=>{t.userData.ready=true;});t.colorSpace=THREE.SRGBColorSpace;return t;}
  function drawn(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.userData.ready=true;return t;}
  function sprite(map,order=2,anchor=0){const s=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,toneMapped:false,depthWrite:false}));s.center.set(.5,anchor);s.renderOrder=order;s.userData.on=true;scene.add(s);return s;}
  function size(s,h,flip=1){const img=s.material.map.image,a=img&&img.width?img.width/img.height:.7;s.scale.set(h*a*flip,h,1);}
  const soft=drawn(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(48,26,10,.6)');r.addColorStop(1,'rgba(48,26,10,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  function contact(){const m=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshBasicMaterial({map:soft,transparent:true,depthWrite:false,toneMapped:false}));m.rotation.x=-Math.PI/2;m.renderOrder=1;scene.add(m);return m;}
  const looks={front:texture('fox-front'),side:texture('fox-side'),back:texture('fox-back'),happy:texture('fox-happy')};
  const fox=sprite(looks.front),foxShadow=contact(),foxPos=new THREE.Vector3();
  const forestH=(()=>{const a=at(400,650);return heightAt(ground(a.u,a.v),forestFrac);})(),denH=heightAt(ground(denSpot.u,denSpot.v),denFrac),sleepH=heightAt(ground(cushion.u,cushion.v),.3);
  // Owl on the stone beside the home tree; beaver beside the bridge.
  const owlBase=(()=>{const a=at(262,430);return ground(a.u,a.v);})(),owl=sprite(texture('owl'));owl.position.copy(lifted(...Object.values(at(262,394)),owlBase));const owlH=heightAt(owlBase,.108);
  const owlShadow=contact();owlShadow.position.copy(owl.position);owlShadow.scale.setScalar(owlH*.3);owlShadow.material.opacity=.5;
  const beaver=actor('beaver'),beaverBase=(()=>{const a=at(792,452);return ground(a.u,a.v);})();beaver.group.position.copy(beaverBase);beaver.group.rotation.y=-.5;scene.add(beaver.group);
  {const box=new THREE.Box3().setFromObject(beaver.group),h=box.max.y-box.min.y||1;beaver.group.scale.multiplyScalar(heightAt(beaverBase,.13)/h);}
  const beaverShadow=contact();beaverShadow.position.copy(beaverBase);beaverShadow.scale.setScalar(heightAt(beaverBase,.13)*.4);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.78,1,32),new THREE.MeshBasicMaterial({color:'#fff3c4',transparent:true,opacity:.85,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.renderOrder=1;ring.visible=false;scene.add(ring);
  // Temporary treat props are drawn here and never saved.
  const appleTex=drawn(128,128,(g)=>{const r=g.createRadialGradient(52,60,6,64,74,50);r.addColorStop(0,'#f2766a');r.addColorStop(.6,'#d5443a');r.addColorStop(1,'#9e2a24');g.fillStyle=r;g.beginPath();g.arc(64,76,46,0,Math.PI*2);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(46,58,10,15,-.5,0,Math.PI*2);g.fill();g.strokeStyle='#6b4423';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(64,34);g.quadraticCurveTo(66,22,72,12);g.stroke();g.fillStyle='#6f9a3c';g.beginPath();g.ellipse(84,22,16,8,-.4,0,Math.PI*2);g.fill();});
  const tubTex=drawn(256,170,(g)=>{const w=g.createLinearGradient(0,0,256,0);w.addColorStop(0,'#a8693a');w.addColorStop(.5,'#dba468');w.addColorStop(1,'#a0622f');g.fillStyle=w;g.beginPath();g.moveTo(26,70);g.lineTo(230,70);g.lineTo(208,166);g.lineTo(48,166);g.closePath();g.fill();g.strokeStyle='rgba(90,52,24,.35)';g.lineWidth=2;for(let x=50;x<220;x+=22){g.beginPath();g.moveTo(x,72);g.lineTo(x+(128-x)*.12,164);g.stroke();}g.fillStyle='#7a4a28';g.fillRect(34,100,188,9);g.fillRect(42,140,172,9);g.fillStyle='#9fd0d2';g.beginPath();g.ellipse(128,70,104,18,0,0,Math.PI*2);g.fill();g.fillStyle='#fffaf0';for(let i=0;i<14;i++){const x=34+i*14.5,y=62+Math.sin(i*1.7)*6;g.beginPath();g.arc(x,y,10+(i%3)*4,0,Math.PI*2);g.fill();}});
  const bubbleTex=drawn(64,64,(g)=>{g.fillStyle='rgba(255,255,255,.28)';g.strokeStyle='#d8eef0';g.lineWidth=3;g.beginPath();g.arc(32,32,26,0,Math.PI*2);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(23,22,6,0,Math.PI*2);g.fill();});
  const zTex=drawn(64,64,(g)=>{g.font='bold 52px Andika, sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle='#4c5f8f';g.strokeText('z',32,34);g.fillStyle='#fff6d8';g.fillText('z',32,34);});
  const apple=sprite(appleTex,3,.5),tub=sprite(tubTex,3,0),bubbles=Array.from({length:9},()=>sprite(bubbleTex,4,.5)),zs=Array.from({length:3},()=>sprite(zTex,4,.5));
  const props=[apple,tub,...bubbles,...zs];props.forEach(p=>p.userData.on=false);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  let area='den',paused=false,destination=null,arrival=null,path=[],near=null,last=performance.now(),time=0,lastSample=0,raf,anim=null,keys=new Set(),stick={x:0,z:0},width=0,height=0,facing='front',flip=1;
  const crop={x:0,y:0,ready:false};
  const pinList={den:[],shop:[],forest:[]};for(const [name,list]of Object.entries(pins))for(const [id,p]of Object.entries(list))pinList[name].push({id,point:pinPoint(p.u,p.v)});
  function layout(snap,dt=0){
    const w=canvas.clientWidth||1,h=canvas.clientHeight||1;if(w!==width||h!==height){width=w;height=h;renderer.setSize(w,h,false);snap=true;}
    const need=scenes[area].need;let s=Math.max(w/IW,h/IH);s=Math.min(s,w/((need[2]-need[0])*IW),h/((need[3]-need[1])*IH));
    const fw=IW*s,fh=IH*s;let fu=(need[0]+need[2])/2,fv=(need[1]+need[3])/2;
    if(area==='forest'&&!anim){const q=picture(foxPos);fu=q.u;fv=q.v-.1;}
    const tx=fw>w?THREE.MathUtils.clamp(fu*fw-w/2,0,fw-w):(fw-w)/2,ty=fh>h?THREE.MathUtils.clamp(fv*fh-h/2,0,fh-h):(fh-h)/2;
    if(snap||!crop.ready||window.FK.reduced){crop.x=tx;crop.y=ty;crop.ready=true;}else{const k=1-Math.exp(-dt*3);crop.x+=(tx-crop.x)*k;crop.y+=(ty-crop.y)*k;}
    camera.setViewOffset(fw,fh,crop.x,crop.y,w,h);
    canvas.style.backgroundSize=fw+'px '+fh+'px';canvas.style.backgroundPosition=(-crop.x)+'px '+(-crop.y)+'px';
  }
  function setArea(next){area=next;destination=null;path=[];arrival=null;ring.visible=false;near=null;onNear(null);finishProps();
    const url='url('+ART+next+'.webp)';canvas.style.backgroundImage=url;fill.style.backgroundImage=url;
    const forest=next==='forest';owl.userData.on=forest;owlShadow.visible=forest;beaver.group.visible=forest;beaverShadow.visible=forest;fox.userData.on=next!=='shop';foxShadow.visible=next!=='shop';
    if(forest){const p=position();if(p&&insideWorld(p.x,p.z))foxPos.set(p.x,0,p.z);else foxPos.set(paintedPlaces.home.x,0,paintedPlaces.home.z);}else foxPos.copy(ground(denSpot.u,denSpot.v));
    facing='front';flip=1;layout(true);
  }
  function clear(a,b){const A=picture(a),B=picture(b);for(let i=1;i<20;i++){const t=i/20;if(!inside(A.u+(B.u-A.u)*t,A.v+(B.v-A.v)*t))return false;}return true;}
  function plan(target){
    const points=[foxPos.clone(),target.clone(),...hubs],cost=points.map(()=>Infinity),previous=[],visited=new Set();cost[0]=0;
    while(visited.size<points.length){let next=-1;for(let i=0;i<points.length;i++)if(!visited.has(i)&&(next<0||cost[i]<cost[next]))next=i;if(next<0||!Number.isFinite(cost[next])||next===1)break;visited.add(next);
      for(let i=0;i<points.length;i++){if(visited.has(i)||!clear(points[next],points[i]))continue;const c=cost[next]+points[next].distanceTo(points[i]);if(c<cost[i]){cost[i]=c;previous[i]=next;}}}
    if(!Number.isFinite(cost[1]))return null;const route=[];let cursor=1;while(cursor!==0){route.unshift(points[cursor]);cursor=previous[cursor];}return route;
  }
  function walkTo(target,id=null){target=nearestWalkable(target);const route=plan(target);if(!route){onMove({event:'route_failure',reason:'blocked',area,destination:id});return;}
    path=route;destination=path.shift();arrival=id;ring.position.set(target.x,.02,target.z);ring.scale.setScalar(forestH*.32);ring.visible=true;onMove({event:'movement_destination',destination:id,x:target.x,z:target.z,area});}
  function route(id){if(area!=='forest')return;const p=paintedPlaces[id];walkTo(new THREE.Vector3(p.x,0,p.z),id);}
  function project(p){const q=p.clone().project(camera);return {x:(q.x*.5+.5)*width,y:(-q.y*.5+.5)*height,visible:q.z<1&&Math.abs(q.x)<1.02&&q.y>-1.02&&q.y<1.12};}
  function pick(event){if(paused||anim||event.button>0||area!=='forest')return;const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=new THREE.Vector3();if(raycaster.ray.intersectPlane(floor,hit))walkTo(hit);}
  canvas.addEventListener('pointerup',pick);
  const visibility=()=>{last=performance.now();keys.clear();stick={x:0,z:0};};document.addEventListener('visibilitychange',visibility);
  const keydown=e=>{if(paused||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){keys.add(e.key);e.preventDefault();}},keyup=e=>{if(keys.delete(e.key)&&area==='forest')onPosition(foxPos.x,foxPos.z);},blur=()=>{keys.clear();stick={x:0,z:0};};
  document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
  const observer=new ResizeObserver(()=>layout(true));observer.observe(canvas);
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
    let moving=false;
    if(anim)animateTreat(elapsed);
    else if(area==='forest'&&!paused){
      let dx=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'))+stick.x,dz=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'))+stick.z;
      const manual=Math.hypot(dx,dz)>0;
      if(manual){destination=null;path=[];arrival=null;ring.visible=false;}else if(destination){dx=destination.x-foxPos.x;dz=destination.z-foxPos.z;}
      const distance=Math.hypot(dx,dz);
      if(distance>.08){const step=Math.min(manual?Infinity:distance,SPEED*dt),nx=foxPos.x+dx/distance*step,nz=foxPos.z+dz/distance*step;
        if(insideWorld(nx,nz)){foxPos.x=nx;foxPos.z=nz;}else if(insideWorld(nx,foxPos.z))foxPos.x=nx;else if(insideWorld(foxPos.x,nz))foxPos.z=nz;
        if(Math.abs(dx)>Math.abs(dz)*.7){facing='side';flip=dx<0?-1:1;}else{facing=dz<0?'back':'front';flip=1;}moving=true;}
      else if(destination){if(path.length)destination=path.shift();else{destination=null;ring.visible=false;onPosition(foxPos.x,foxPos.z);const reached=arrival;arrival=null;if(reached)onAction(reached);}}
      if(moving&&time-lastSample>1){lastSample=time;onPosition(foxPos.x,foxPos.z);}
      let closest=null,dist=3.2;for(const [id,p]of Object.entries(paintedPlaces)){const d=Math.hypot(p.x-foxPos.x,p.z-foxPos.z);if(d<dist){closest=id;dist=d;}}
      if(closest!==near){near=closest;onNear(near);}
    }
    if(!anim){const reduced=window.FK.reduced,h=area==='forest'?forestH:denH;fox.material.map=looks[facing];fox.position.copy(foxPos);
      if(moving&&!reduced){fox.position.addScaledVector(up,Math.abs(Math.sin(time*11))*h*.03);fox.material.rotation=Math.sin(time*11)*.05;}else fox.material.rotation=0;
      size(fox,h*(moving||reduced?1:1+Math.sin(time*2.2)*.008),facing==='side'?flip:1);
    }else size(fox,anim.item==='sleep'?sleepH:denH);
    foxShadow.position.set(foxPos.x,.01,foxPos.z);foxShadow.scale.setScalar((area==='forest'?forestH:anim?.item==='sleep'?sleepH:denH)*.3);
    size(owl,owlH*(window.FK.reduced?1:1+Math.sin(time*1.6)*.01));beaver.animate(time,{action:near==='beaver'?'wave':'',mood:near==='beaver'?'joyful':'gentle',reduced:window.FK.reduced});
    for(const s of [fox,owl,...props])s.visible=s.userData.on&&!!s.material.map.userData.ready;
    if(ring.visible)ring.material.opacity=.55+Math.sin(time*4)*.25;
    layout(false,dt);renderer.render(scene,camera);
    onProject(pinList[area].map(p=>({id:p.id,...project(p.point)})));
  }
  setArea('den');raf=requestAnimationFrame(frame);
  return {setArea(next){setArea(next);},route,pause(value){paused=value;if(value){blur();if(area==='forest')onPosition(foxPos.x,foxPos.z);}},steer(x,z){stick={x,z};if(!x&&!z&&area==='forest')onPosition(foxPos.x,foxPos.z);},
    sequence(item){destination=null;path=[];ring.visible=false;anim={item,elapsed:0};foxPos.copy(item==='sleep'?ground(cushion.u,cushion.v):ground(denSpot.u,denSpot.v));fox.position.copy(foxPos);},
    skip(){anim=null;finishProps();fox.material.map=looks.front;foxPos.copy(ground(denSpot.u,denSpot.v));},
    get diagnostics(){return {area,paused,time,keys:[...keys],destination:destination?.toArray(),position:{x:foxPos.x,z:foxPos.z},painted:true};},get area(){return area;},get position(){return {x:foxPos.x,z:foxPos.z};},
    dispose(){cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerup',pick);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);fill.remove();night.remove();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});renderer.dispose();},
  };
}
