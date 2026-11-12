/* The same solid, articulated animals inhabit the world and the story scenes. */
import { storyActor } from './story-actors.js';
import { THREE } from './materials.js';
const worldSphere=new THREE.SphereGeometry(1,12,8);
function resident(id) {
  const rig=storyActor(id);rig.group.name=id;rig.group.userData.kind='woodland-animal';
  rig.group.traverse(o=>{if(o.name.startsWith('cinema-'))o.name=o.name.replace('cinema-','woodland-');if(o.isMesh&&!o.isInstancedMesh&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius===1)o.geometry=worldSphere;});
  const animate=rig.animate;
  rig.animate=(time,active,resting=false,moving=false)=>animate(time,{mood:resting?'gentle':active?'joyful':'gentle',action:active&&!moving?'wave':'',moving,reduced:window.FK.reduced&&!moving});
  return rig;
}
export function fox(){const rig=resident('fox'),animate=rig.animate;rig.animate=(time,moving,reacting=false)=>animate(time,reacting&&!moving,false,moving);return rig;}
export const beaver=()=>resident('beaver');
export const hare=()=>resident('hare');
export const hedgehog=()=>resident('hedgehog');
export const owl=()=>resident('owl');
export const kingfisher=()=>resident('kingfisher');
