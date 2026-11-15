/* The shadows of Fuchs and the friends beside him. The forest's shadow map is drawn once and stands still (trees,
   rocks, the lie of the land), so those who move get their own: each is drawn as a dark shape from where the sun
   stands into a small picture of its own, and that picture is laid on the ground along the sun's rays, on a little
   grid that follows the ground. So a shadow has the character's outline, moves with every step and wave, grows long
   at dusk and fades under clouds. Four at most; only Fuchs' is redrawn every frame. */
import {THREE} from '../../scene/materials.js';

const SLOTS = 4, SIZE = 128, G = 6, LIFT = .2;   // the shadow lies a hand above the ground, so that it falls on the grass too

export function createCastShadows({renderer, scene, sunDir, groundY}) {
  const dark = new THREE.MeshBasicMaterial({color: '#000000', fog: false}), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 40), right = new THREE.Vector3(), up = new THREE.Vector3(), o = new THREE.Vector3(), swapped = [];
  const slots = Array.from({length: SLOTS}, (_, k) => {
    const target = new THREE.WebGLRenderTarget(SIZE, SIZE, {depthBuffer: true}); target.texture.name = 'cast shadow ' + k;
    const geo = new THREE.PlaneGeometry(2, 2, G, G), uniforms = {uMap: {value: target.texture}, uStrength: {value: 0}};
    const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, uniforms,
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `uniform sampler2D uMap;uniform float uStrength;varying vec2 vUv;
        void main(){float e=${(1.1 / SIZE).toFixed(5)},a=texture2D(uMap,vUv).a*.4+(texture2D(uMap,vUv+vec2(e,e)).a+texture2D(uMap,vUv+vec2(-e,e)).a+texture2D(uMap,vUv+vec2(e,-e)).a+texture2D(uMap,vUv+vec2(-e,-e)).a)*.15;
          vec2 q=abs(vUv-.5)*2.;a*=uStrength*(1.-smoothstep(.8,1.,max(q.x,q.y)));gl_FragColor=vec4(.11,.075,.06,a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`}));
    mesh.name = 'cast shadow'; mesh.renderOrder = 1; mesh.frustumCulled = false; mesh.visible = false; scene.add(mesh);
    return {target, mesh, uniforms, at: new THREE.Vector3(Infinity, 0, 0), sun: new THREE.Vector3(), tick: k};
  });
  let frame = 0;
  /** `who`: [{group, x, y, z, h}] nearest first (Fuchs first); `strength` 0…1 (clouds, the cave). */
  function update(who, strength) {
    frame++;
    const keepTarget = renderer.getRenderTarget();
    for (let k = 0; k < SLOTS; k++) {
      const s = slots[k], c = who[k]; if (!c || strength < .02 || sunDir.y < .08) { s.mesh.visible = false; continue; }
      const half = c.h * .78, cy = c.y + c.h * .5; s.mesh.visible = true; s.uniforms.uStrength.value = strength * (.42 + .26 * Math.min(1, sunDir.y * 2.2));
      cam.left = -half; cam.right = half; cam.top = half; cam.bottom = -half; cam.updateProjectionMatrix(); cam.position.set(c.x, cy, c.z).addScaledVector(sunDir, 14); cam.lookAt(c.x, cy, c.z); cam.updateMatrixWorld();
      // the picture: Fuchs' every frame, the others' every third (they mostly stand)
      if (k === 0 || (frame + s.tick) % 3 === 0) {
        swapped.length = 0; c.group.traverse(m => { if (m.isMesh && m.visible) { swapped.push(m, m.material); m.material = dark; } });
        renderer.setRenderTarget(s.target); renderer.clear(); renderer.render(c.group, cam);
        for (let i = 0; i < swapped.length; i += 2) swapped[i].material = swapped[i + 1];
      }
      // the grid on the ground, when the character or the sun has moved
      if (Math.abs(s.at.x - c.x) + Math.abs(s.at.z - c.z) + Math.abs(s.at.y - c.y) > .015 || s.sun.distanceToSquared(sunDir) > 1e-6) {
        s.at.set(c.x, c.y, c.z); s.sun.copy(sunDir); right.setFromMatrixColumn(cam.matrixWorld, 0); up.setFromMatrixColumn(cam.matrixWorld, 1);
        const p = s.mesh.geometry.attributes.position, uv = s.mesh.geometry.attributes.uv;
        for (let i = 0; i < p.count; i++) { const u = uv.getX(i) * 2 - 1, v = uv.getY(i) * 2 - 1; o.set(c.x, cy, c.z).addScaledVector(right, u * half).addScaledVector(up, v * half);
          let t = (o.y - c.y) / sunDir.y, x = o.x - sunDir.x * t, z = o.z - sunDir.z * t; const g = groundY(x, z); t = (o.y - Math.max(g, c.y - .8)) / sunDir.y; x = o.x - sunDir.x * t; z = o.z - sunDir.z * t;
          p.setXYZ(i, x, Math.max(g, c.y - .8) + LIFT, z); }
        p.needsUpdate = true;
      }
    }
    renderer.setRenderTarget(keepTarget);
  }
  return {update, get count() { return slots.filter(s => s.mesh.visible).length; }};
}
