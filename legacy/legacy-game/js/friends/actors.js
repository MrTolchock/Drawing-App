import {THREE,paint,ellipsoid,curveTube} from '../forest/materials.js';
import {storyActor} from '../forest/story-actors.js';
export function actor(id){
  if(['fox','owl','beaver'].includes(id))return storyActor(id);
  const group=new THREE.Group(),figure=new THREE.Group();group.name='friends-'+id;group.add(figure);
  const bird=id==='bird',mouse=id==='mouse',fur=paint(bird?'#619bb1':mouse?'#b09a79':'#b77942'),cream=paint('#efe0bc'),dark=paint('#3e352a');
  ellipsoid(figure,fur,[0,.8,0],bird?[.45,.60,.36]:[.46,.63,.4]);
  ellipsoid(figure,bird?paint('#e3cc76'):cream,[0,.8,.33],[.32,.45,.12]);
  const head=new THREE.Group();head.position.set(0,1.6,.1);figure.add(head);
  ellipsoid(head,fur,[0,0,0],[.50,.46,.43]);
  const arms=[],legs=[],eyes=[];
  for(const side of [-1,1]){
    const arm=new THREE.Group();arm.position.set(side*.44,1.2,0);figure.add(arm);arms.push(arm);ellipsoid(arm,fur,[side*.05,-.24,.02],[.13,.33,.15]);
    const leg=new THREE.Group();leg.position.set(side*.25,.26,0);figure.add(leg);legs.push(leg);ellipsoid(leg,fur,[0,-.12,.10],[.17,.16,.25]);
    if(!bird){ellipsoid(head,fur,[side*.39,.38,0],mouse?[.26,.29,.14]:[.14,.28,.13]);ellipsoid(head,paint('#d1a690'),[side*.39,.38,.12],mouse?[.16,.18,.04]:[.07,.17,.03]);}
    else ellipsoid(head,cream,[side*.30,-.02,.25],[.18,.17,.12]);
    const eye=ellipsoid(head,dark,[side*.21,.08,.39],[.064,.09,.05]);eyes.push(eye);ellipsoid(head,paint('#fff7de'),[side*.21-.018,.11,.43],[.018,.025,.012]);
  }
  ellipsoid(head,cream,[0,-.17,.35],[.32,.17,.19]);ellipsoid(head,dark,[0,-.11,.54],[.07,.055,.05]);
  const tail=new THREE.Group();tail.position.set(0,.5,-.32);figure.add(tail);
  if(mouse)curveTube(tail,paint('#b9927d'),[[0,0,0],[.5,-.2,-.5],[.8,-.25,-.85],[.5,-.15,-1]],.045);
  else if(!bird){ellipsoid(tail,fur,[.12,.30,-.48],[.38,.72,.4]);ellipsoid(tail,fur,[.12,.92,-.36],[.33,.45,.32]);}
  else ellipsoid(tail,fur,[0,-.10,-.4],[.16,.12,.55]);
  if(bird){const bill=new THREE.Mesh(new THREE.ConeGeometry(.08,.28,8),dark);bill.rotation.x=Math.PI/2;bill.position.set(0,-.13,.61);head.add(bill);}
  group.scale.setScalar(mouse?.78:bird?.84:1);
  function animate(time,{moving=false,action='',mood='gentle',reduced=false}={}){
    const t=reduced?0:time;figure.position.y=moving?Math.abs(Math.sin(t*8))*.06:Math.sin(t*1.7)*.015;
    head.rotation.z=Math.sin(t*.8)*.035;head.rotation.y=Math.sin(t*.5)*.05;
    arms.forEach((a,i)=>{a.rotation.z=(i?1:-1)*(action==='wave'||action==='celebrate'?1.4+Math.sin(t*4)*.15:.12);a.rotation.x=moving?Math.sin(t*8+i*Math.PI)*.25:0;});
    legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(t*8+i*Math.PI)*.4:0);
    tail.rotation.y=Math.sin(t*1.8)*.10;eyes.forEach(e=>e.scale.y=Math.sin(t*.8)>.995?.02:.09);
  }
  return {group,figure,head,arms,legs,tail,eyes,animate};
}
