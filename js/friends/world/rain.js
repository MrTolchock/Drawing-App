/* Rain around Fuchs: thin streaks falling a little aslant in a box that travels with him, and small splash
   rings on the ground and the water. On the snowy peak the same drops fall as slow flakes. Two draw calls;
   nothing at all while it is dry. With reduced motion the rain is not drawn (the darker light still shows). */
import {THREE} from '../../scene/materials.js';

const DROPS = 900, SPLASHES = 70;

export function createRain({scene, groundY, random}) {
  const seeds = new Float32Array(DROPS * 4); for (let i = 0; i < seeds.length; i++) seeds[i] = random();
  const drops = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(DROPS * 3), 3)).setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4)),
    new THREE.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {uTime: {value: 0}, uScale: {value: 600}, uCentre: {value: new THREE.Vector3()}, uAmount: {value: 0}, uSnow: {value: 0}},
      vertexShader: `attribute vec4 aSeed;uniform float uTime,uScale,uAmount,uSnow;uniform vec3 uCentre;varying float vShow,vSnow;
        void main(){const float S=26.,H=13.;vSnow=uSnow;float speed=mix(9.5+aSeed.w*3.,1.1+aSeed.w*.6,uSnow),fall=mod(aSeed.y*H+uTime*speed,H);
          vec3 p;p.xz=uCentre.xz+mod(aSeed.xz*S-uCentre.xz+S*.5,S)-S*.5;p.y=uCentre.y+H*.8-fall;
          p.x+=fall*mix(.13,.0,uSnow)+uSnow*sin(uTime*.9+aSeed.x*30.)*.35;p.z+=uSnow*cos(uTime*.7+aSeed.z*30.)*.3;
          vShow=step(aSeed.w,uAmount)*smoothstep(0.,1.,fall)*smoothstep(H,H-1.,fall);
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=min(mix(.62,.16,uSnow)*uScale/-mv.z,90.);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying float vShow,vSnow;
        void main(){if(vShow<.5)discard;vec2 c=gl_PointCoord-.5;float a;
          if(vSnow>.5){a=smoothstep(.5,.2,length(c));gl_FragColor=vec4(1.,1.,1.,a*.9);return;}
          c.x+=c.y*.13;a=smoothstep(.045,.01,abs(c.x))*smoothstep(.5,.25,abs(c.y));gl_FragColor=vec4(.88,.92,.97,a*.62);}`}));
  drops.name = 'rain'; drops.frustumCulled = false; drops.renderOrder = 8; drops.visible = false; scene.add(drops);

  // splashes: each ring lives a short while at a random spot near Fuchs, then starts again somewhere else
  const sp = new Float32Array(SPLASHES * 3), phase = new Float32Array(SPLASHES), life = Array.from({length: SPLASHES}, () => random());
  const splashes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sp, 3)).setAttribute('aPhase', new THREE.BufferAttribute(phase, 1)),
    new THREE.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {uScale: {value: 600}},
      vertexShader: 'attribute float aPhase;uniform float uScale;varying float vP;void main(){vP=aPhase;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(.12+aPhase*.32)*uScale/-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'varying float vP;void main(){vec2 c=gl_PointCoord-.5;c.y*=2.4;float r=length(c),ring=smoothstep(.07,.0,abs(r-.42))*(1.-vP);if(ring<.02||abs(gl_PointCoord.y-.5)>.22)discard;gl_FragColor=vec4(.9,.94,1.,ring*.75);}'}));
  splashes.name = 'rain splashes'; splashes.frustumCulled = false; splashes.renderOrder = 8; splashes.visible = false; scene.add(splashes);
  const respawn = (k, pos) => { const a = random() * Math.PI * 2, d = 1 + Math.sqrt(random()) * 11, x = pos.x + Math.sin(a) * d, z = pos.z - 2 + Math.cos(a) * d; sp[k * 3] = x; sp[k * 3 + 1] = groundY(x, z) + .03; sp[k * 3 + 2] = z; };

  function update(dt, time, pos, {rain = 0, snow = 0, reduced = false, height = 800, fov = 42} = {}) {
    const on = rain > .01 && !reduced; drops.visible = on; splashes.visible = on && snow < .5; if (!on) return;
    const scale = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))), u = drops.material.uniforms;
    u.uTime.value = time; u.uScale.value = scale; u.uCentre.value.set(pos.x, groundY(pos.x, pos.z), pos.z - 2); u.uAmount.value = rain; u.uSnow.value = snow > .5 ? 1 : 0;
    splashes.material.uniforms.uScale.value = scale;
    if (splashes.visible) { const n = Math.round(SPLASHES * rain); for (let k = 0; k < SPLASHES; k++) { life[k] += dt / (.35 + (k % 5) * .06); if (life[k] >= 1) { life[k] = 0; respawn(k, pos); } phase[k] = k < n ? life[k] : 1; }
      splashes.geometry.attributes.position.needsUpdate = true; splashes.geometry.attributes.aPhase.needsUpdate = true; }
  }
  return {update};
}
