/* Landmark sites of the big world: one-off objects built when Fuchs comes near (the streamer asks
   for a site's steps once). The den tree, the arched bridge and the log come from world/landmarks.js;
   stepping stones, the swamp's boardwalk and a first, plain dam are built here.
   Still to come (see design/world-10x/PLAN.md): the waterfall, the lodge, the friends' props. */
import {THREE} from '../../../forest/materials.js';
import {rng} from '../noise.js';
import {TAU, lerp, sstep} from '../noise.js';
import {Buffer, templates} from '../tiles.js';
import {canvasTex} from '../textures.js';
import {waterMaterial} from './tiles.js';
import {landmarkSteps} from '../landmarks.js';

/** Give a geometry one colour (the materials multiply their texture by it). */
function tinted(g, r, gr, b) { const c = new Float32Array(g.attributes.position.count * 3); for (let k = 0; k < c.length; k += 3) { c[k] = r; c[k + 1] = gr; c[k + 2] = b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; }

export function siteSteps(site, look, world, group, out) {
  const T = world.terrain, L = world.layout, M = look.M, R = rng(site.x * 31 + site.z);
  // the home builders expect a region: give them the parts they read
  const asRegion = landmarks => ({seed: 20261109, origin: [0, 0], ground: T.ground, deck: T.deck, home: L.DEN, crossings: T.crossings, landmarks, brook: null});
  const mesh = (buf, material, name, cast = true) => { const g = buf.geometry(); if (!g) return; const m = new THREE.Mesh(g, material); m.name = name; m.castShadow = cast && M.shadows; m.receiveShadow = M.shadows; group.add(m); };
  const near = c => Math.hypot((c.a[0] + c.b[0]) / 2 - site.x, (c.a[1] + c.b[1]) / 2 - site.z) < site.r;
  const add = (buf, g, r = 1, gr = r, b = r) => { buf.addGeometry(tinted(g, r, gr, b)); g.dispose(); };

  if (site.id === 'home') return landmarkSteps(asRegion(['homeTree', 'bridge']), look, world, group, out);
  const steps = [];
  if (site.id === 'swamp') {
    steps.push(...landmarkSteps(asRegion(['logBridge']), look, world, group, out));
    steps.push(() => { // the boardwalk: planks on posts
      const wood = new Buffer();
      for (const c of T.crossings.filter(k => k.kind === 'planks')) {
        const dx = c.b[0] - c.a[0], dz = c.b[1] - c.a[1], len = Math.hypot(dx, dz), yaw = Math.atan2(dx, dz), n = Math.round(len / .34);
        for (let k = 0; k <= n; k++) { const t = k / n, x = c.a[0] + dx * t, z = c.a[1] + dz * t, v = .82 + R() * .3; add(wood, new THREE.BoxGeometry(c.width + .1 + R() * .12, .07, .28).rotateY(yaw + (R() - .5) * .08).translate(x, c.y - .035 + (R() - .5) * .02, z), v, v, v); }
        for (let k = 0; k <= Math.ceil(len / 2.2); k++) { const t = k / Math.ceil(len / 2.2), x = c.a[0] + dx * t, z = c.a[1] + dz * t; for (const s of [-1, 1]) add(wood, new THREE.CylinderGeometry(.07, .08, 1.5, 6).translate(x + dz / len * s * c.width * .5, c.y - .6, z - dx / len * s * c.width * .5), .7, .66, .6); }
      }
      mesh(wood, M.wood, 'boardwalk');
    });
  }
  if (site.id === 'swamp') steps.push(() => { // mist over the pools, fireflies among the reeds
    const S = T.swamp, soft = canvasTex(64, 64, (c) => { const r = c.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(240,250,235,.6)'); r.addColorStop(1, 'rgba(240,250,235,0)'); c.fillStyle = r; c.fillRect(0, 0, 64, 64); });
    const mist = [], glow = [];
    for (let k = 0; k < 400 && mist.length < 46 * 3; k++) { const x = S.x + (R() * 2 - 1) * S.rx, z = S.z + (R() * 2 - 1) * S.rz; if (T.stillDepth(x, z) > .1) mist.push(x, S.level + .5 + R() * .7, z); }
    for (let k = 0; k < 400 && glow.length < 40 * 3; k++) { const x = S.x + (R() * 2 - 1) * S.rx, z = S.z + (R() * 2 - 1) * S.rz; if (T.swampMask(x, z) > .3) glow.push(x, Math.max(T.ground(x, z), S.level) + .4 + R() * 1.3, z); }
    const points = (arr, mat, name) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const p = new THREE.Points(g, mat); p.name = name; p.renderOrder = 4; group.add(p); return p; };
    out.mist = points(mist, new THREE.PointsMaterial({map: soft, size: 6.5, transparent: true, opacity: .26, depthWrite: false}), 'swamp mist');
    out.glow = points(glow, new THREE.PointsMaterial({map: look.T.glow, size: .42, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, color: '#d8ff9a'}), 'swamp fireflies');
  });
  if (site.id === 'falls') steps.push(() => { // stepping stones across the upper brook
    const stones = new Buffer();
    for (const c of T.crossings.filter(k => k.kind === 'stones')) { const n = 4; for (let k = 0; k <= n; k++) { const t = k / n, x = c.a[0] + (c.b[0] - c.a[0]) * t + (R() - .5) * .12, z = c.a[1] + (c.b[1] - c.a[1]) * t + (R() - .5) * .12, v = .85 + R() * .2; add(stones, new THREE.CylinderGeometry(.34 + R() * .08, .42, .5, 9).translate(x, c.y - .26, z), v, v, v * .95); } }
    mesh(stones, M.rock, 'stepping stones', false);
  });
  if (site.id === 'falls') steps.push(() => { // the waterfall: a ribbon of white water down the cliff, foam where it lands, mist
    const F = T.falls, [dx, dz] = F.dir, sx = -dz, sz = dx, pos = [], uv = [], idx = []; let y = F.top, run = 0, prev = null, rows = 0;
    for (let s = -1.2; s < 9 && y > F.level + .03; s += .14) {
      const u = sstep(-1.2, 4.2, s), half = lerp(.5, 1.25, u), cx = F.lip[0] + dx * s, cz = F.lip[1] + dz * s;
      let g = -Infinity; for (const o of [-1.1, -.55, 0, .55, 1.1]) for (const f of [0, .3]) g = Math.max(g, T.ground(cx + sx * half * o + dx * f, cz + sz * half * o + dz * f)); g += .32;
      y = Math.max(F.level + .02, Math.min(y, s < 0 ? F.top + .02 : g));
      if (prev) run += Math.hypot(.14, y - prev); prev = y;
      for (const side of [-1, 1]) { pos.push(cx + sx * half * side, y, cz + sz * half * side); uv.push(side < 0 ? 0 : 1, run); }
      if (rows) { const a = (rows - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } rows++;
    }
    // foam on the pool where the water lands (uv.x = -1 marks it; uv.y is the distance from the middle, 0…1)
    const fx = pos[pos.length - 6] * .5 + pos[pos.length - 3] * .5, fz = pos[pos.length - 4] * .5 + pos[pos.length - 1] * .5, base = pos.length / 3, RF = 2.6;
    pos.push(fx, F.level + .03, fz); uv.push(-1, 0);
    for (let k = 0; k <= 24; k++) { const a = k / 24 * TAU; pos.push(fx + Math.cos(a) * RF, F.level + .03, fz + Math.sin(a) * RF); uv.push(-1, 1); if (k) idx.push(base, base + k, base + k + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeBoundingSphere();
    const water = waterMaterial(look, world.fog), fog = world.fog;
    const mat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: {uTime: water.uniforms.uTime, uNoise: {value: look.T.noise}, fogColor: {value: fog.color}, fogNear: {value: fog.near}, fogFar: {value: fog.far}},
      vertexShader: 'varying vec2 vUv;varying float vFog;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vFog=-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: `uniform float uTime;uniform sampler2D uNoise;uniform vec3 fogColor;uniform float fogNear,fogFar;varying vec2 vUv;varying float vFog;
      void main(){vec3 c;float a;
        if(vUv.x<-.5){float r=vUv.y;float n=texture2D(uNoise,vec2(r*.9-uTime*.22,atan(r)*.4+uTime*.05)).r;float rings=.5+.5*sin(r*26.-uTime*5.+n*6.);
          a=(1.-smoothstep(.25,1.,r))*(.55+.45*rings)*smoothstep(.3,.6,n+.25*(1.-r));c=vec3(.97,1.,.98);}
        else{float n1=texture2D(uNoise,vec2(vUv.x*1.1,vUv.y*.1-uTime*.5)).r,n2=texture2D(uNoise,vec2(vUv.x*2.4+.4,vUv.y*.23-uTime*.85)).r;
          float streak=smoothstep(.36,.7,n1*.55+n2*.6);float edge=smoothstep(0.,.2,vUv.x)*smoothstep(1.,.8,vUv.x);
          c=mix(vec3(.52,.8,.84),vec3(1.),streak*.9);a=edge*(.62+.38*streak)*smoothstep(0.,.5,vUv.y);}
        c=mix(c,fogColor,smoothstep(fogNear,fogFar,vFog)*.85);gl_FragColor=vec4(c,a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
    const m = new THREE.Mesh(g, mat); m.name = 'waterfall'; m.renderOrder = 3; group.add(m);
    const soft = canvasTex(64, 64, (c) => { const r = c.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,.75)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(0, 0, 64, 64); });
    const mist = []; for (let k = 0; k < 16; k++) { const a = R() * TAU, d = R() * 2.4; mist.push(fx + Math.cos(a) * d, F.level + .3 + R() * 2.4 * (1 - d / 2.6), fz + Math.sin(a) * d); }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(mist, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({map: soft, size: 3.4, transparent: true, opacity: .34, depthWrite: false})); pts.name = 'mist'; pts.renderOrder = 4; group.add(pts); out.mist = pts;
  }, () => { // boulders flank the fall and lie at the cliff's foot
    const rocks = new Buffer(), t = templates(), F = T.falls, [dx, dz] = F.dir, sx = -dz, sz = dx;
    for (let k = 0; k < 26; k++) { const s = -1 + R() * 7.5, side = (R() < .5 ? -1 : 1) * (1.5 + R() * R() * 7), x = F.lip[0] + dx * s + sx * side, z = F.lip[1] + dz * s + sz * side; if (T.slope(x, z) < .8 || world.walkable(x, z, .9) || T.stillDepth(x, z) > .25) continue; const sc = .45 + R() * .8, v = .8 + R() * .25;
      rocks.add(t.rock, {x, y: T.ground(x, z) - sc * .3, z, ry: R() * TAU, sx: sc, sy: sc * (.6 + R() * .5), sz: sc * (.8 + R() * .4), c: new THREE.Color(v, v, v * .97)}); }
    mesh(rocks, M.rock, 'fall boulders');
  });
  if (site.id === 'pond') { // the beaver's dam: a tight weave of gnawed logs and sticks, packed with mud (built in small steps)
    const logs = new Buffer(), mud = new Buffer(), c = T.crossings.find(k => k.kind === 'dam'), dx = c.b[0] - c.a[0], dz = c.b[1] - c.a[1], len = Math.hypot(dx, dz), yaw = Math.atan2(dx, dz), nx = dz / len, nz = -dx / len;
    steps.push(() => { for (let k = 0; k <= 12; k++) { const t = k / 12, x = c.a[0] + dx * t, z = c.a[1] + dz * t, v = .62 + R() * .12; add(mud, new THREE.SphereGeometry(1, 9, 6).scale(.95 + R() * .3, .5, .8 + R() * .2).translate(x + nx * (R() - .5) * .3, c.y - .42, z + nz * (R() - .5) * .3), v, v * .8, v * .6); } });
    const sticks = () => { for (let k = 0; k < 28; k++) { // sticks lean against the downstream face and lie along the crest
      const t = R(), crest = R() < .35, side = crest ? (R() - .5) * 1.1 : (R() < .72 ? 1 : -1) * (.5 + R() * 1.4), l = crest ? 1.2 + R() * 1.8 : 1.1 + R() * 1.4, x = c.a[0] + dx * t + nx * side, z = c.a[1] + dz * t + nz * side, y = c.y - .02 - Math.abs(side) * .5 + R() * .12, v = .78 + R() * .4, r0 = crest ? .05 + R() * .05 : .035 + R() * .05;
      const g = new THREE.CylinderGeometry(r0 * .7, r0, l, 5).rotateX(Math.PI / 2);
      if (crest) g.rotateY(yaw + (R() - .5) * .7); else g.rotateX((side > 0 ? 1 : -1) * (.5 + R() * .4)).rotateY(yaw + Math.PI / 2 + (R() - .5) * .8);
      add(logs, g.translate(x, y, z), v, v * .93, v * .84);
    } };
    steps.push(sticks, sticks, sticks, sticks);
    // the lodge: a dome of sticks on its island in the pond
    const [lx, lz] = [37.5, -18.6], ly = T.stillLevel(lx, lz) || c.y - .3;
    steps.push(() => {
    add(mud, new THREE.SphereGeometry(1, 14, 8, 0, TAU, 0, Math.PI / 2).scale(2.1, 1.45, 1.9).translate(lx, ly - .1, lz), .5, .4, .3);
    });
    const dome = () => { for (let k = 0; k < 30; k++) { const a = R() * TAU, u = R(), rr = lerp(2.25, .4, u), l = 1 + R() * 1.2, v = .75 + R() * .4, x = lx + Math.cos(a) * rr, z = lz + Math.sin(a) * rr * .9, y = ly + 1.4 * Math.sqrt(Math.max(0, 1 - (rr / 2.3) ** 2));
      add(logs, new THREE.CylinderGeometry(.03 + R() * .03, .05 + R() * .04, l, 5).rotateZ(.5 + u * .7 + (R() - .5) * .4).rotateY(-a + (R() - .5) * .6).translate(x, y + .05, z), v, v * .93, v * .84); } };
    steps.push(dome, dome, dome, () => {
    add(mud, new THREE.CircleGeometry(.42, 12).rotateY(-.9).translate(lx - 1.75, ly + .32, lz + 1.05), .08, .06, .05);
    mesh(mud, M.rock, 'dam mud', false); }, () => mesh(logs, M.log, 'dam and lodge'));
  }
  if (site.id === 'friends') steps.push(() => { // the friends' props: the mouse's stump, the squirrel's acorns
    const wood = new Buffer(), bits = new Buffer(), [mx, mz] = L.FRIENDS.mouse.at, my = T.ground(mx, mz);
    add(wood, new THREE.CylinderGeometry(.75, .9, .62, 18, 1).translate(mx, my + .31, mz), 1.25, 1, .78);
    const [qx, qz] = L.FRIENDS.squirrel.at; for (let i = 0; i < 5; i++) { const x = qx + .5 + i * .22, z = qz + .5 + (i % 2) * .2; add(bits, new THREE.SphereGeometry(.09, 10, 7).scale(1, 1.2, 1).translate(x, T.ground(x, z) + .08, z), .6, .39, .2); }
    mesh(wood, M.log, 'stump'); mesh(bits, M.rock, 'acorns', false);
  });
  return steps;
}
