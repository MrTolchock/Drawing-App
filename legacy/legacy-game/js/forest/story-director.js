/* Camera, articulated actors and a travelling heartlight inside the real world. */
import {THREE,paint,ellipsoid,roundedBlock} from './materials.js';
import {storyActor} from './story-actors.js';

export function createStoryDirector({scene,model,landscape,player,residents,places}){
  const stage=new THREE.Group();stage.name='forest-story-stage';stage.visible=false;scene.add(stage);
  const keyLight=new THREE.DirectionalLight('#fff1d6',1.1),lightTarget=new THREE.Object3D();stage.add(keyLight,lightTarget);keyLight.target=lightTarget;
  let actors=null,frame=null,storyTime=0,lastTick=null,wasReduced=window.FK.reduced,origin=new THREE.Vector3(),flight=null;
  const tree=new THREE.Vector3(-8,4.4,3.6),heart=new THREE.Vector3(-7.95,2.8,3.1);
  const spark=new THREE.Group();spark.name='friendship-heartlight';stage.add(spark);
  const heartlightShape=new THREE.Shape();heartlightShape.moveTo(0,.08);heartlightShape.bezierCurveTo(-.25,.36,-.51,.02,0,-.32);heartlightShape.bezierCurveTo(.51,.02,.25,.36,0,.08);
  const heartlightCore=new THREE.Mesh(new THREE.ExtrudeGeometry(heartlightShape,{depth:.06,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:2}),new THREE.MeshBasicMaterial({color:'#ffe8a3'}));heartlightCore.rotation.y=.25;spark.add(heartlightCore);
  ellipsoid(spark,new THREE.MeshBasicMaterial({color:'#f6d87d',transparent:true,opacity:.16,depthWrite:false}),[0,0,0],[.45,.48,.4]);
  const glow=new THREE.PointLight('#ffdc8b',1.3,6,2);spark.add(glow);
  const trailGeo=new THREE.BufferGeometry(),trailPositions=new Float32Array(30*3);trailGeo.setAttribute('position',new THREE.BufferAttribute(trailPositions,3));
  const trail=new THREE.Points(trailGeo,new THREE.PointsMaterial({color:'#f8d78b',size:.09,transparent:true,opacity:.8,depthWrite:false}));trail.name='heartlight-trail';trail.frustumCulled=false;stage.add(trail);
  const prop=new THREE.Group();prop.name='story-held-object';stage.add(prop);
  const plank=new THREE.Mesh(roundedBlock(1.15,.12,.35,.05),paint('#c29d64','bark'));prop.add(plank);
  for(let i=0;i<4;i++)ellipsoid(plank,paint(i%2?'#9b7547':'#7c9c57'),[(i-2)*.2,.085,0],i%2?[.065,.035,.065]:[.045,.018,.095],[0,i*.3,0]);
  const missing=new THREE.Mesh(new THREE.RingGeometry(.045,.06,16),paint('#f1dda1'));missing.rotation.x=-Math.PI/2;missing.position.set(.4,.087,0);plank.add(missing);
  const paper=new THREE.Group(),sheet=new THREE.Mesh(new THREE.BoxGeometry(.85,.65,.035),paint('#eee2b9'));paper.add(sheet);prop.add(paper);
  const icon=new THREE.Shape();icon.moveTo(0,.06);icon.bezierCurveTo(-.16,.23,-.32,.01,0,-.2);icon.bezierCurveTo(.32,.01,.16,.23,0,.06);
  const picture=new THREE.Mesh(new THREE.ShapeGeometry(icon),paint('#829b58'));picture.position.z=.025;paper.add(picture);
  const leaves=new THREE.Group();prop.add(leaves);
  for(let i=0;i<4;i++)ellipsoid(leaves,paint(['#aab876','#cfb579','#93a76a'][i%3],'leaf'),[(i%2-.5)*.35,Math.floor(i/2)*.11,0],[.17,.035,.32],[.35,i*.9,0]);
  function ensureActors(){if(!actors){actors=Object.fromEntries(['fox',...Object.keys(residents)].map(id=>{const rig=storyActor(id);stage.add(rig.group);return[id,rig];}));}}
  function setActor(id,x,z,yaw=.4){
    const rig=actors[id];rig.group.position.set(x,landscape.height(x,z,model.get().bridgeRepaired),z);rig.group.rotation.y=yaw;rig.group.visible=true;
  }
  const isTree=shot=>shot.startsWith('tree')||shot==='empty-clearing';
  function setFrame(next){
    if(!next){end();return;}
    ensureActors();frame={...next};storyTime=0;lastTick=null;wasReduced=window.FK.reduced;stage.visible=true;
    stage.userData.active=true;stage.userData.shot=frame.shot;stage.userData.speaker=frame.speaker;stage.userData.action=frame.action||'';
    const place=places[frame.project],home=model.residents[frame.resident]||model.residents.beaver;
    const p=place?.centre||[home.x,home.z];origin.set(p[0],0,p[1]);
    Object.values(actors).forEach(rig=>rig.group.visible=false);
    if(isTree(frame.shot)){
      origin.set(-8,0,6.2);setActor('fox',-8.9,7.1,.55);
      if(frame.shot==='tree-friends'||frame.action==='gather'||frame.action==='bloom'){
        Object.keys(residents).forEach((id,i)=>{setActor(id,-8+[-3.3,-1.65,0,1.65,3.3][i],4.7+[.1,1.1,1.6,1.1,.1][i],.35-i*.13);});
        setActor('fox',-8.2,8.1,.3);
        setActor('hedgehog',-9.6,8,-.1);setActor('fox',-7.4,8.6,.3);
      }else if(frame.action==='grow'&&frame.resident)setActor(frame.resident,-6.7,6.5,-.2);
    }else if(['bridge','across','reunion'].includes(frame.shot)||frame.project==='bridge'){
      origin.set(-.5,0,-7);setActor('fox',-6.9,-6.7,.85);setActor('beaver',-4.7,-8.2,-.25);setActor('hare',6.1,-7,-.55);
      if(frame.shot==='friend'){origin.set(-5.6,0,-8.1);}
      if(frame.action==='reunion'||frame.shot==='reunion'){setActor('beaver',4,-7,.9);setActor('hare',7.4,-6.8,-.45);}
      if(frame.shot==='together'&&!['reunion','spark'].includes(frame.action)){origin.set(-5.6,0,-8.1);}
      if(frame.action==='spark'){setActor('beaver',-3.9,-7.5,-.35);setActor('hare',6.3,-7,-.55);setActor('fox',-5.7,-6.6,.6);origin.set(.8,0,-7);}
      if(frame.meeting){origin.set(6,0,-6.6);setActor('fox',4.5,-5.7,.75);setActor('beaver',frame.shot==='across'||frame.action==='reunion'?4:6,-7,-.35);setActor('hare',7.4,-6.8,-.55);}
    }else{
      setActor(frame.resident,origin.x+.75,origin.z,-.35);setActor('fox',origin.x-1.45,origin.z+1.05,.9);
      if(frame.partner)setActor(frame.partner,origin.x+2.2,origin.z+.5,-.65);
    }
    const carryStart=new THREE.Vector3(origin.x,2.25,origin.z);
    keyLight.position.set(origin.x+4,9,origin.z+8);lightTarget.position.set(origin.x,1.5,origin.z);
    flight=new THREE.CatmullRomCurve3([carryStart,new THREE.Vector3(origin.x*.65+heart.x*.35,5,origin.z*.65+heart.z*.35),new THREE.Vector3(heart.x-.6,5.6,heart.z+.8),heart]);
    plank.visible=frame.action==='plank';paper.visible=['map','invitation'].includes(frame.action);leaves.visible=['leaves','last-leaf'].includes(frame.action);
    spark.visible=['spark','carry','promise','touch-heart','grow','bloom','pulse'].includes(frame.action);trail.visible=frame.action==='carry';
    // Authored progress stays intact even when the film holds the previous bough
    // for a moment, so the child can see the new leaf arrive.
    const state=model.get();landscape.setProjects(state,frame.visualGrowth??frame.growth,previewState(state));
  }
  function end(){
    frame=null;stage.visible=false;stage.userData.active=false;
    landscape.hero.visible=true;
    player.group.visible=true;for(const [id,rig]of Object.entries(residents))rig.group.visible=model.residentAvailable(id);
    landscape.setProjects(model.get());
    landscape.setBridge(model.get().bridgeRepaired);
  }
  function previewState(state){return frame?.preview==='beginning'?{...state,contributions:{},bridgeRepaired:false,greetingSeen:false,endingUnlocked:false,endingSeen:false}:null;}
  function update(now){
    if(!frame)return;
    const reduced=window.FK.reduced;
    // Slow devices must still show a journey, rather than skip it between draws.
    if(!reduced&&!wasReduced&&lastTick!==null)storyTime+=Math.min(.2,Math.max(0,(now-lastTick)/1000));
    lastTick=now;wasReduced=reduced;
    const elapsed=storyTime,t=reduced?0:elapsed;
    const speech=window.speechSynthesis?.speaking&&!window.speechSynthesis?.paused;
    player.group.visible=false;Object.values(residents).forEach(rig=>rig.group.visible=false);
    const reunion=frame.action==='reunion'||frame.shot==='reunion';
    if(reunion){
      const progress=reduced?1:THREE.MathUtils.smoothstep(Math.min(elapsed/3,1),0,1);
      actors.beaver.group.position.x=THREE.MathUtils.lerp(4,6,progress);actors.beaver.group.position.z=-7;actors.beaver.group.position.y=landscape.height(actors.beaver.group.position.x,-7,true);
      actors.beaver.group.rotation.y=progress<1?Math.PI/2:-.35;
    }
    for(const [id,rig]of Object.entries(actors)){
      if(!rig.group.visible)continue;
      let mood=id===frame.speaker?frame.mood:frame.mood==='joyful'||frame.action==='bloom'?'joyful':id==='fox'?'curious':'gentle';
      if(frame.action==='gap'&&id!=='fox')mood='sad';
      rig.animate(t,{mood,action:id===frame.speaker||id==='fox'?frame.action:reunion?'celebrate':'',talking:id===frame.speaker&&speech,moving:reunion&&id==='beaver'&&elapsed<3,reduced});
    }
    const holder=actors[frame.speaker==='narrator'?'fox':frame.speaker]||actors.fox;
    prop.visible=plank.visible||paper.visible||leaves.visible;prop.position.copy(holder.group.position).add(new THREE.Vector3(.15,1.45,.72));
    prop.rotation.set(paper.visible?-.12:0,holder.group.rotation.y,Math.sin(t)*.025);paper.rotation.z=-.15;
    if(frame.action==='last-leaf'){
      prop.position.set(-7.2+Math.sin(t)*.5,Math.max(.2,5-t*.45),3.3+Math.cos(t)*.3);prop.rotation.z=t*.3;
    }
    const duration=3.4,progress=reduced?1:THREE.MathUtils.smoothstep(Math.min(elapsed/duration,1),0,1);
    if(frame.action==='carry'){
      spark.position.copy(flight.getPoint(progress));
      for(let i=0;i<30;i++){const p=flight.getPoint(Math.max(0,progress-i*.012));trailPositions[i*3]=p.x;trailPositions[i*3+1]=p.y;trailPositions[i*3+2]=p.z;}
      trailGeo.attributes.position.needsUpdate=true;
    }else if(['grow','bloom','pulse','touch-heart','promise'].includes(frame.action))spark.position.copy(heart).add(new THREE.Vector3(Math.sin(t)*.15,Math.sin(t*1.5)*.12,.3));
    else spark.position.set(origin.x,2.15+Math.sin(t)*.12,origin.z+.5);
    spark.scale.setScalar(1+Math.sin(t*3)*.12);
    if(frame.action==='gather'&&!reduced)Object.values(actors).forEach((rig,i)=>{if(rig.group.visible)rig.group.position.z+=Math.sin(t*1.4+i)*.0005;});
  }
  function camera(now,portrait,aspect=1,height=900){
    if(!frame)return null;
    const elapsed=storyTime,t=window.FK.reduced?1:Math.min(1,elapsed/3.4);
    let target,half,offset;
    if(frame.shot==='spark-flight'){
      const p=flight.getPoint(THREE.MathUtils.smoothstep(t,0,1));target=p.clone().add(new THREE.Vector3(0,1,0));
      half=portrait?11.8:8.2;offset=new THREE.Vector3(8,17,23);
    }else if(isTree(frame.shot)){
      const close=frame.shot==='tree-close'&&!['grow','bloom'].includes(frame.action);
      target=close?new THREE.Vector3(-8,2.7,3.1):tree.clone();
      half=close?(portrait?7.3:5.5):portrait?13.4:8.7;
      if(frame.shot==='tree-fox'){target=new THREE.Vector3(-8,3,4);half=portrait?10.1:7;}
      offset=close?new THREE.Vector3(3,7,15):new THREE.Vector3(4,13,23);
    }else if(frame.shot==='reunion'){
      target=new THREE.Vector3(5.8,1.5,-6.6);half=portrait?7.1:4;offset=new THREE.Vector3(3.8,8,15);
    }else if(frame.shot==='bridge'){
      target=new THREE.Vector3(.8,1.3,-7);half=portrait?15:6.1;offset=new THREE.Vector3(5,13,22);
    }else if(frame.shot==='across'){
      target=new THREE.Vector3(frame.meeting?7.3:6,1.45,-6.9);half=portrait?6.6:3.7;offset=new THREE.Vector3(4,7,13);
    }else{
      target=new THREE.Vector3(origin.x-.25,1.5,origin.z+.5);half=portrait?(frame.shot==='friend'?6.3:frame.partner?8.5:7):4.3;offset=new THREE.Vector3(3.8,8,15);
      if(frame.shot==='project'){half=portrait?10:7.1;target.y=1.7;}
    }
    // Phone landscape has a side tray. Other shapes keep faces above the bottom tray.
    if(height<=560&&aspect>1.2)target.add(new THREE.Vector3(offset.z,0,-offset.x).normalize().multiplyScalar(half*aspect*.36));
    else target.y-=half*(portrait&&height<700?.24:.12);
    return {target,offset,half};
  }
  return {setFrame,end,update,camera,previewState,get active(){return !!frame;},get frame(){return frame?{...frame}:null;},get growth(){return frame?.visualGrowth??frame?.growth;},get bridgePreview(){return frame?.action==='gap'||frame?.preview==='beginning'?false:null;},stage};
}
