/* Rain around Fuchs: thin streaks in a box that travels with him. Each drop is a quad stretched along its own
   fall (bright at the head, fading towards the tail, as a falling drop looks to the eye), slanting with a soft
   gusting wind; near drops are longer and a little wider, far ones fine and faint, so the shower has depth.
   Below it: rings on water and small crowns of droplets on the ground. On the snowy peak the drops fall as slow
   round flakes instead. Three draw calls; nothing at all while it is dry. With reduced motion the rain is not
   drawn (the darker light still shows). */
import {THREE} from '../../scene/materials.js';

const DROPS = 2200, FLAKES = 900, SPLASHES = 130;

export function createRain({scene, groundY, isWater = () => false, random}) {
  /* ---------- streaks ---------- */
  const seed = new Float32Array(DROPS * 4 * 4), corner = new Float32Array(DROPS * 4 * 2), index = [];
  for (let d = 0; d < DROPS; d++) { const s = [random(), random(), random(), random()];
    for (let k = 0; k < 4; k++) { seed.set(s, (d * 4 + k) * 4); corner.set([k % 2 ? 1 : -1, k < 2 ? 0 : 1], (d * 4 + k) * 2); }
    const b = d * 4; index.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
  const streakGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(DROPS * 4 * 3), 3)).setAttribute('aSeed', new THREE.BufferAttribute(seed, 4)).setAttribute('aCorner', new THREE.BufferAttribute(corner, 2)).setIndex(index);
  const streaks = new THREE.Mesh(streakGeo, new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {uTime: {value: 0}, uAmount: {value: 0}, uCentre: {value: new THREE.Vector3()}, uWind: {value: new THREE.Vector2(1.3, .5)}, uRes: {value: new THREE.Vector2(800, 600)}, uPx: {value: 1}},
    vertexShader: `attribute vec4 aSeed;attribute vec2 aCorner;uniform float uTime,uAmount,uPx;uniform vec3 uCentre;uniform vec2 uWind,uRes;varying float vA,vAlong,vSide;
      void main(){const float S=30.,H=15.;float speed=10.5+aSeed.w*4.;float fall=mod(aSeed.y*H+uTime*speed,H);
        vec3 dir=normalize(vec3(uWind.x,-speed,uWind.y));vec3 p;p.xz=uCentre.xz+mod(aSeed.xz*S-uCentre.xz+S*.5,S)-S*.5;p.y=uCentre.y+H*.78-fall;p.xz+=dir.xz/-dir.y*fall;
        vec4 head=projectionMatrix*viewMatrix*vec4(p,1.);float depth=head.w,len=mix(.32,.75,aSeed.z)*mix(1.2,.6,clamp(depth/24.,0.,1.));
        vec4 tail=projectionMatrix*viewMatrix*vec4(p-dir*len,1.);vec2 d=(head.xy/head.w-tail.xy/tail.w)*uRes;float L=length(d);vec2 n=L>1e-3?vec2(-d.y,d.x)/L:vec2(1.,0.);
        vec4 c=aCorner.y<.5?head:tail;float w=clamp(15./depth,.9,2.4)*uPx;c.xy+=n*aCorner.x*w/uRes*2.*c.w;
        vA=step(fract(aSeed.w*7.31+aSeed.x*3.7),uAmount)*smoothstep(0.,.8,fall)*smoothstep(H,H-1.5,fall)*smoothstep(28.,6.,depth)*smoothstep(.8,2.5,depth)*(.55+.45*aSeed.x)*step(0.,head.w);
        vAlong=aCorner.y;vSide=aCorner.x;gl_Position=c;}`,
    fragmentShader: `varying float vA,vAlong,vSide;void main(){float a=vA*(1.-vSide*vSide)*mix(1.,.05,vAlong);if(a<.01)discard;gl_FragColor=vec4(.88,.92,.97,a*.72);}`}));
  streaks.name = 'rain'; streaks.frustumCulled = false; streaks.renderOrder = 8; streaks.visible = false; scene.add(streaks);

  /* ---------- snowflakes on the peak ---------- */
  const fseeds = new Float32Array(FLAKES * 4); for (let i = 0; i < fseeds.length; i++) fseeds[i] = random();
  const flakes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(FLAKES * 3), 3)).setAttribute('aSeed', new THREE.BufferAttribute(fseeds, 4)),
    new THREE.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {uTime: {value: 0}, uScale: {value: 600}, uCentre: {value: new THREE.Vector3()}, uAmount: {value: 0}},
      vertexShader: `attribute vec4 aSeed;uniform float uTime,uScale,uAmount;uniform vec3 uCentre;varying float vShow;
        void main(){const float S=26.,H=13.;float fall=mod(aSeed.y*H+uTime*(1.1+aSeed.w*.6),H);vec3 p;p.xz=uCentre.xz+mod(aSeed.xz*S-uCentre.xz+S*.5,S)-S*.5;p.y=uCentre.y+H*.8-fall;
          p.x+=sin(uTime*.9+aSeed.x*30.)*.35;p.z+=cos(uTime*.7+aSeed.z*30.)*.3;vShow=step(aSeed.w,uAmount)*smoothstep(0.,1.,fall)*smoothstep(H,H-1.,fall);
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=min(.16*uScale/-mv.z,40.);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: 'varying float vShow;void main(){if(vShow<.5)discard;float a=smoothstep(.5,.2,length(gl_PointCoord-.5));gl_FragColor=vec4(1.,1.,1.,a*.9);}'}));
  flakes.name = 'snowfall'; flakes.frustumCulled = false; flakes.renderOrder = 8; flakes.visible = false; scene.add(flakes);

  /* ---------- splashes: rings on water, crowns of droplets on the ground ---------- */
  const sp = new Float32Array(SPLASHES * 3), phase = new Float32Array(SPLASHES), wet = new Float32Array(SPLASHES), life = Array.from({length: SPLASHES}, () => random());
  const splashes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sp, 3)).setAttribute('aPhase', new THREE.BufferAttribute(phase, 1)).setAttribute('aWater', new THREE.BufferAttribute(wet, 1)),
    new THREE.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {uScale: {value: 600}},
      vertexShader: 'attribute float aPhase,aWater;uniform float uScale;varying float vP,vW;void main(){vP=aPhase;vW=aWater;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(aWater>.5?.14+aPhase*.42:.22)*uScale/-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: `varying float vP,vW;void main(){vec2 c=gl_PointCoord-.5;float a;
        if(vW>.5){c.y*=2.4;float r=length(c);a=smoothstep(.07,.0,abs(r-.42))*(1.-vP);if(abs(gl_PointCoord.y-.5)>.22)a=0.;}
        else{float t=min(1.,vP*2.2);a=0.;for(int k=0;k<5;k++){float ang=3.1416*(.12+.19*float(k));vec2 q=vec2(cos(ang)*(.12+.3*t),-(sin(ang)*(.1+.4*t)-t*t*.32)+.18);a=max(a,smoothstep(.065,.02,length(c-q)));}a*=1.-t;}
        if(a<.02)discard;gl_FragColor=vec4(.9,.94,1.,a*.75);}`}));
  splashes.name = 'rain splashes'; splashes.frustumCulled = false; splashes.renderOrder = 8; splashes.visible = false; scene.add(splashes);
  const respawn = (k, pos) => { const a = random() * Math.PI * 2, d = .8 + Math.sqrt(random()) * 12, x = pos.x + Math.sin(a) * d, z = pos.z - 2.5 + Math.cos(a) * d; sp[k * 3] = x; sp[k * 3 + 1] = groundY(x, z) + .03; sp[k * 3 + 2] = z; wet[k] = isWater(x, z) ? 1 : 0; };

  let wind = 0;
  function update(dt, time, pos, {rain = 0, snow = 0, reduced = false, height = 800, width = 0, pixelRatio = 1, fov = 42} = {}) {
    const on = rain > .01 && !reduced, flaky = snow > .5; streaks.visible = on && !flaky; flakes.visible = on && flaky; splashes.visible = on && !flaky; if (!on) return;
    const scale = height * pixelRatio / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))), y = groundY(pos.x, pos.z);
    if (flaky) { const u = flakes.material.uniforms; u.uTime.value = time; u.uScale.value = scale; u.uCentre.value.set(pos.x, y, pos.z - 2); u.uAmount.value = rain; return; }
    wind = time; const u = streaks.material.uniforms; u.uTime.value = time; u.uAmount.value = rain; u.uCentre.value.set(pos.x, y, pos.z - 2.5); u.uPx.value = pixelRatio;
    u.uWind.value.set(1.1 + .7 * Math.sin(wind * .23) + .25 * Math.sin(wind * 1.1), .45 + .3 * Math.sin(wind * .17 + 1)); u.uRes.value.set((width || height * 1.4) * pixelRatio, height * pixelRatio);
    splashes.material.uniforms.uScale.value = scale;
    const n = Math.round(SPLASHES * rain); for (let k = 0; k < SPLASHES; k++) { life[k] += dt / (wet[k] ? .5 + (k % 5) * .06 : .28 + (k % 4) * .04); if (life[k] >= 1) { life[k] = 0; respawn(k, pos); } phase[k] = k < n ? life[k] : 1; }
    const g = splashes.geometry.attributes; g.position.needsUpdate = true; g.aPhase.needsUpdate = true; g.aWater.needsUpdate = true;
  }
  return {update};
}
