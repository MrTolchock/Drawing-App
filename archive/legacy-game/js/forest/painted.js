/* Painted cutouts live in the same Three.js world as the paths and timberwork. */
import { THREE } from './materials.js';

const { cells, sources: paths } = window.FK.woodland;
const sources = Object.fromEntries(Object.entries(paths).map(([id, path]) => [id, new URL(path, document.baseURI).href]));
sources.ground = new URL('../../assets/woodland/ground.webp', import.meta.url).href;
const sheets = {}, alpha = {}, maps = new Map();
const loader = new THREE.TextureLoader();
const ready = Promise.all(Object.entries(sources).map(async ([id, url]) => {
  const texture = await loader.loadAsync(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter;
  sheets[id] = texture;
  if (id !== 'ground') {
    const canvas = document.createElement('canvas'); canvas.width = texture.image.width; canvas.height = texture.image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(texture.image, 0, 0);
    alpha[id] = { width: canvas.width, height: canvas.height, pixels: ctx.getImageData(0, 0, canvas.width, canvas.height).data };
  }
}));
export async function loadPaintedArt() { await ready; }
export function paintedGround() {
  const map = sheets.ground; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({ map, toneMapped: false }); material.userData.paintKind = 'ground'; return material;
}
function mapFor(id) {
  if (maps.has(id)) return maps.get(id);
  const [sheet, column, row] = cells[id], rows = sheet === 'cast' ? 4 : 2;
  const map = sheets[sheet].clone(), inset = 0.003;
  map.repeat.set(0.25 - inset * 2, 1 / rows - inset * 2);
  map.offset.set(column / 4 + inset, 1 - (row + 1) / rows + inset);
  map.userData.sheet = sheet;
  map.needsUpdate = true; maps.set(id, map); return map;
}
export function paintedSprite(id, size, anchor = 0.08) {
  const material = new THREE.SpriteMaterial({ map: mapFor(id), transparent: true, alphaTest: 0.23,
    depthWrite: false, toneMapped: false });
  const sprite = new THREE.Sprite(material);
  sprite.center.set(0.5, anchor); sprite.scale.set(size, size, 1); sprite.userData.painting = id;
  sprite.name = 'painted-' + id;
  sprite.raycast = function (raycaster, intersections) {
    const hits = []; THREE.Sprite.prototype.raycast.call(this, raycaster, hits);
    for (const hit of hits) {
      const uv = hit.uv.clone(), map = this.material.map, sheet = alpha[map.userData.sheet];
      map.updateMatrix(); map.transformUv(uv);
      const x = Math.max(0, Math.min(sheet.width - 1, Math.floor(uv.x * sheet.width)));
      const y = Math.max(0, Math.min(sheet.height - 1, Math.floor(uv.y * sheet.height)));
      if (sheet.pixels[(y * sheet.width + x) * 4 + 3] / 255 >= this.material.alphaTest) intersections.push(hit);
    }
  };
  return sprite;
}
let shadowMap;
export function softShadow(parent, width, depth, opacity = 0.2) {
  if (!shadowMap) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d'), wash = ctx.createRadialGradient(64, 64, 7, 64, 64, 63);
    wash.addColorStop(0, '#435638b3'); wash.addColorStop(0.55, '#43563866'); wash.addColorStop(1, '#43563800');
    ctx.fillStyle = wash; ctx.fillRect(0, 0, 128, 128); shadowMap = new THREE.CanvasTexture(canvas);
  }
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({ map: shadowMap,
    transparent: true, opacity, depthWrite: false, toneMapped: false }));
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = 0.065; mesh.renderOrder = -1;
  mesh.raycast = () => {}; parent.add(mesh); return mesh;
}
export function paintedProp(parent, id, x, z, size, anchor) {
  const group = new THREE.Group(); group.position.set(x, 0.045, z);
  const sprite = paintedSprite(id, size, anchor); group.add(sprite); parent.add(group); return group;
}
