/* Shared picture-book characters, placed and moved in the Three.js woodland. */
import { THREE } from './materials.js';
import { paintedSprite } from './painted.js';

function resident(id, size) {
  const group = new THREE.Group(), painting = paintedSprite(id, size);
  group.name = id; group.add(painting);
  return { group, painting, animate(time, active, resting = false) {
    painting.position.y = resting ? -0.07 : active && time ? Math.abs(Math.sin(time * 3.2)) * 0.12 : time ? Math.sin(time * 1.2) * 0.018 : 0;
    painting.material.rotation = active && time ? Math.sin(time * 2.2) * 0.04 : 0;
  } };
}
export function fox() {
  const rig = resident('fox-right', 3.45), views = ['fox-right', 'fox-left', 'fox-away-right', 'fox-away-left'];
  rig.group.name = 'fox';
  const pictures = views.map(id => paintedSprite(id, 3.45));
  rig.group.remove(rig.painting); pictures.forEach((p, i) => { p.visible = i === 0; rig.group.add(p); });
  rig.animate = (time, moving) => {
    const yaw = rig.group.rotation.y, dx = Math.sin(yaw), dz = Math.cos(yaw);
    const screenX = dx * 0.936 - dz * 0.351, away = dx * 0.351 + dz * 0.936 < -0.2;
    const index = (away ? 2 : 0) + (screenX < 0 ? 1 : 0);
    pictures.forEach((picture, i) => {
      picture.visible = i === index;
      picture.position.y = moving ? Math.abs(Math.sin(time * 10)) * 0.09 : 0;
      picture.material.rotation = moving ? Math.sin(time * 10) * 0.025 : 0;
    });
  };
  return rig;
}
export const beaver = () => resident('beaver', 3.8);
export const hare = () => resident('hare', 3.8);
export const hedgehog = () => resident('hedgehog', 2.9);
export const owl = () => resident('owl', 3.4);
export const kingfisher = () => resident('kingfisher', 2.9);
