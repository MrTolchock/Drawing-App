/* Landmark sites of the big world: one-off objects built when Fuchs comes near (the streamer asks
   for a site's steps once). The den tree, the arched bridge and the log come from world/landmarks.js;
   stepping stones, the swamp's boardwalk, the waterfall, the beaver's dam, lodge and felled trees and the
   friends' props are built here. */
import {THREE} from '../../../scene/materials.js';
import {rng} from '../noise.js';
import {TAU, lerp, sstep} from '../noise.js';
import {Buffer, templates} from '../tiles.js';
import {canvasTex} from '../textures.js';
import {waterMaterial} from './tiles.js';
import {landmarkSteps} from '../landmarks.js';
import {wonderSteps} from './wonders.js';

/** Give a geometry one colour (the materials multiply their texture by it). */
function tinted(g, r, gr, b) { const c = new Float32Array(g.attributes.position.count * 3); for (let k = 0; k < c.length; k += 3) { c[k] = r; c[k + 1] = gr; c[k + 2] = b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; }

export function siteSteps(site, look, world, group, out) {
  if (site.kind) return wonderSteps(site, look, world, group);
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
  if (site.id === 'pond') {
    /* The beaver's dam, as beavers build it: a low wall of mud and stones across the outlet, its crest laid
       with long gnawed poles, the downstream face a thick thatch of sticks pushed in butt-first so that they
       lean against the water's weight, short sticks and mud on the pond side. Water seeps over the middle.
       Around Biber's place stand the stumps of the trees he felled, some trunks still lying there.
       Built in small steps. `s` runs across the dam (downstream positive), `t` along it. */
    const logs = new Buffer(), pale = new Buffer(), mud = new Buffer(), c = T.crossings.find(k => k.kind === 'dam'), D = T.dam;
    const ax = c.a[0], az = c.a[1], ux = (c.b[0] - ax) / D.len, uz = (c.b[1] - az) / D.len, dnx = -D.n[0], dnz = -D.n[1], H = c.y, len = D.len;
    const Q = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3();
    const at = (t, s2) => [ax + ux * len * t + dnx * s2, az + uz * len * t + dnz * s2];
    // the dam's surface: flat crest, a steep wet side to the pond, a longer slope down to the brook
    const surface = (t, s2) => { const [x, z] = at(t, s2), y = Math.abs(s2) <= .55 ? H - .02 : s2 < 0 ? H - .02 + (s2 + .55) * .8 : H - .02 - (s2 - .55) * .6; return Math.max(y, T.ground(x, z) + .05); };
    /** A stick from a point along a direction: tapered, with a gnawed pale point at its far end if `tip`. */
    const stick = (x, y, z, dx, dy, dz, l, r, v, tip = false, sides = 5) => {
      Q.setFromUnitVectors(UP, V.set(dx, dy, dz).normalize());
      add(logs, new THREE.CylinderGeometry(r * .72, r, l, sides, 1).translate(0, l / 2, 0).applyQuaternion(Q).translate(x, y, z), v, v * .88, v * .76);
      if (tip) add(pale, new THREE.ConeGeometry(r * .74, r * 2.6, sides).translate(0, l + r * 1.25, 0).applyQuaternion(Q).translate(x, y, z), 1.32, 1.5, 1.8);
    };
    steps.push(() => { // the wall of mud (where the bank is higher, the wall ends inside it)
      const S = [-1.7, -1.15, -.55, -.2, .2, .55, 1.05, 1.6, 2.2, 2.9], N = 18, pos = [], uv = [], idx = [];
      for (let i = 0; i <= N; i++) for (let k = 0; k < S.length; k++) { const t = lerp(-.03, 1.03, i / N), s2 = S[k] + (k && k < S.length - 1 ? (R() - .5) * .16 : 0), [x, z] = at(t, s2), y = surface(t, s2), g0 = T.ground(x, z);
        pos.push(x, y < g0 + .07 ? g0 - .14 : y + (Math.abs(s2) < .6 ? 0 : (R() - .5) * .07), z); uv.push(t * len * .6, s2 * .6); }
      for (let i = 0; i < N; i++) for (let k = 0; k < S.length - 1; k++) { const p0 = i * S.length + k, p1 = p0 + S.length; idx.push(p0, p0 + 1, p1, p1, p0 + 1, p1 + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
      if (g.attributes.normal.getY(S.length + 4) < 0) { g.setIndex(idx.map((v, n) => idx[n - n % 3 + [0, 2, 1][n % 3]])); g.computeVertexNormals(); }
      add(mud, g, .3, .22, .15);
      for (let k = 0; k < 9; k++) { const t = (k + .2 + R() * .6) / 9, s2 = -.45 - R() * .25, [x, z] = at(t, s2), v = .2 + R() * .06; add(mud, new THREE.SphereGeometry(1, 8, 5).scale(.26 + R() * .2, .08, .2 + R() * .14).rotateY(R() * 3).translate(x, surface(t, s2) + .02, z), v, v * .78, v * .55); }
    });
    const face = () => { for (let k = 0; k < 30; k++) { // sticks pushed into the downstream face, butt first, leaning down the slope
      const t = .03 + R() * .94, s0 = .25 + R() * 2.3, turn = (R() - .5) * (R() < .25 ? 2.6 : 1), cs = Math.cos(turn), sn = Math.sin(turn), hx = dnx * cs - dnz * sn, hz = dnz * cs + dnx * sn;
      const l = Math.min(.55 + R() * 1.15, (3.4 - s0) / Math.max(.4, cs)), [x, z] = at(t, s0), r = .02 + R() * .028, v = .62 + R() * .5;
      stick(x, surface(t, s0) + .02 + R() * .11, z, hx, -.6 * cs + (R() - .5) * .2, hz, l, r, v, R() < .35);
    } };
    const weave = () => { // long poles along the crest, cross sticks woven into the face, short ones into the pond side, stakes
      for (let k = 0; k < 7; k++) { const l = 1.5 + R() * 1.4, t = .02 + R() * Math.max(.05, .96 - l / len), s2 = (R() - .5) * 1.0, turn = (R() - .5) * .45, [x, z] = at(t, s2), r = .045 + R() * .03, v = .78 + R() * .34, cs = Math.cos(turn), sn = Math.sin(turn);
        stick(x, H - r * .5, z, ux * cs - uz * sn, (R() - .5) * .04, uz * cs + ux * sn, l, r, v, true, 6); }
      for (let k = 0; k < 8; k++) { const l = .9 + R() * 1.1, t = .03 + R() * (.94 - l / len), s2 = .7 + R() * 1.9, [x, z] = at(t, s2), turn = (R() - .5) * .9, cs = Math.cos(turn), sn = Math.sin(turn);
        stick(x, surface(t, s2) + .07 + R() * .08, z, ux * cs - uz * sn, (R() - .5) * .16, uz * cs + ux * sn, l, .024 + R() * .026, .66 + R() * .45, R() < .5); }
      for (let k = 0; k < 9; k++) { const t = .04 + R() * .92, turn = (R() - .5) * 1.2, cs = Math.cos(turn), sn = Math.sin(turn), [x, z] = at(t, -.2 - R() * .3);
        stick(x, H - .04, z, -(dnx * cs - dnz * sn), -.5 - R() * .2, -(dnz * cs + dnx * sn), .6 + R() * .7, .022 + R() * .025, .55 + R() * .3); }
      for (let k = 0; k < 3; k++) { const t = .05 + R() * .9, s2 = .35 + R() * 1.6, [x, z] = at(t, s2);
        stick(x, surface(t, s2) - .3, z, -dnx * .4 + (R() - .5) * .4, 1, -dnz * .4 + (R() - .5) * .4, .6 + R() * .35, .028 + R() * .018, .75 + R() * .3, true); }
    };
    steps.push(face, weave, face, face, weave, face, face, face, face, face);
    steps.push(() => { // water seeps over the middle of the crest and runs down between the sticks
      const pos = [], uv = [], idx = [];
      for (const [t0, w] of [[.44, .42], [.61, .3]]) { const base = pos.length / 3; let run = 0, prev = null;
        for (let k = 0; k <= 12; k++) { const s2 = -.5 + k * .29, half = w * (.55 + .45 * Math.sin(k * .9 + t0 * 9)) / len, y = (k < 4 ? Math.max(surface(t0, s2), H - .02) : surface(t0, s2)) + .045; if (prev !== null) run += Math.hypot(.29, y - prev); prev = y;
          for (const side of [-1, 1]) { const [x, z] = at(t0 + half * side, s2); pos.push(x, y, z); uv.push(side < 0 ? 0 : 1, run * 2.2); }
          if (k) { const p0 = base + (k - 1) * 2; idx.push(p0, p0 + 2, p0 + 1, p0 + 1, p0 + 2, p0 + 3); } } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeBoundingSphere();
      const water = waterMaterial(look, world.fog), fog = world.fog;
      const mat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: {uTime: water.uniforms.uTime, uNoise: {value: look.T.noise}, fogColor: {value: fog.color}, fogNear: {value: fog.near}, fogFar: {value: fog.far}},
        vertexShader: 'varying vec2 vUv;varying float vFog;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vFog=-mv.z;gl_Position=projectionMatrix*mv;}',
        fragmentShader: `uniform float uTime;uniform sampler2D uNoise;uniform vec3 fogColor;uniform float fogNear,fogFar;varying vec2 vUv;varying float vFog;
        void main(){float n1=texture2D(uNoise,vec2(vUv.x*.9,vUv.y*.12-uTime*.42)).r,n2=texture2D(uNoise,vec2(vUv.x*2.1+.4,vUv.y*.3-uTime*.7)).r;
          float streak=smoothstep(.38,.72,n1*.55+n2*.6),edge=smoothstep(0.,.28,vUv.x)*smoothstep(1.,.72,vUv.x);
          vec3 c=mix(vec3(.5,.78,.82),vec3(1.),streak*.85);float a=edge*(.26+.5*streak)*smoothstep(0.,.5,vUv.y);
          c=mix(c,fogColor,smoothstep(fogNear,fogFar,vFog)*.85);gl_FragColor=vec4(c,a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`});
      const m = new THREE.Mesh(g, mat); m.name = 'dam seep'; m.renderOrder = 3; group.add(m);
    });
    // the lodge: a dome of mud and sticks on its island in the pond, the entrance a dark hole at the waterline
    const [lx, lz] = [37.5, -18.6], ly = T.stillLevel(lx, lz) || H - .3;
    steps.push(() => add(mud, new THREE.SphereGeometry(1, 14, 8, 0, TAU, 0, Math.PI / 2).scale(2.1, 1.45, 1.9).translate(lx, ly - .1, lz), .3, .22, .15));
    const dome = () => { for (let k = 0; k < 24; k++) { const a = R() * TAU, u = R(), rr = lerp(2.3, .5, u), l = 1 + R() * 1.1, x = lx + Math.cos(a) * rr, z = lz + Math.sin(a) * rr * .9, y = ly + 1.38 * Math.sqrt(Math.max(0, 1 - (rr / 2.35) ** 2));
      const tx = lx - x + (R() - .5) * 1.6, tz = lz - z + (R() - .5) * 1.6, ty = ly + 1.9 - y, tl = Math.hypot(tx, ty, tz);
      stick(x - tx / tl * l * .5, y - ty / tl * l * .5 + .06, z - tz / tl * l * .5, tx, ty, tz, l, .035 + R() * .04, .7 + R() * .42, R() < .3); } };
    steps.push(dome, dome, dome, dome, () => add(mud, new THREE.CircleGeometry(.42, 12).rotateY(-.9).translate(lx - 1.75, ly + .32, lz + 1.05), .08, .06, .05));
    // what he felled: stumps gnawed to a point, wood chips around them, trunks lying where they fell, a stack of cut poles
    steps.push(() => { for (const [x, z, r] of L.STUMPS) { const y = T.ground(x, z), h = .26 + R() * .22, v = .6 + R() * .12;
      add(logs, new THREE.CylinderGeometry(r * .93, r * 1.16, h, 10, 1).translate(x, y + h / 2 - .06, z), v, v * .84, v * .7);
      add(pale, new THREE.ConeGeometry(r * .9, r * 1.35, 10).translate(x + (R() - .5) * r * .2, y + h - .06 + r * .67, z + (R() - .5) * r * .2), 1.3, 1.48, 1.78);
      for (let k = 0; k < 7; k++) { const a = R() * TAU, d = r + .12 + R() * .6, cx = x + Math.cos(a) * d, cz = z + Math.sin(a) * d; add(pale, new THREE.BoxGeometry(.07 + R() * .06, .016, .04 + R() * .03).rotateY(R() * TAU).translate(cx, T.ground(cx, cz) + .03, cz), 1.3, 1.5, 1.85); } } });
    steps.push(() => { for (const [x, z, r, yaw, l] of L.FELLED) { const dx = Math.sin(yaw), dz = Math.cos(yaw), x0 = x - dx * l / 2, z0 = z - dz * l / 2, y0 = T.ground(x0, z0) + r * .82, y1 = T.ground(x + dx * l / 2, z + dz * l / 2) + r * .7, v = .62 + R() * .1;
      Q.setFromUnitVectors(UP, V.set(dx * l, y1 - y0, dz * l).normalize());
      add(logs, new THREE.CylinderGeometry(r * .8, r, l, 9, 1).translate(0, l / 2, 0).applyQuaternion(Q).translate(x0, y0, z0), v, v * .84, v * .7);
      add(pale, new THREE.ConeGeometry(r * .97, r * 1.5, 9).rotateX(Math.PI).translate(0, -r * .74, 0).applyQuaternion(Q).translate(x0, y0, z0), 1.3, 1.48, 1.78);
      add(pale, new THREE.CylinderGeometry(r * .79, r * .79, .03, 9).translate(0, l + .012, 0).applyQuaternion(Q).translate(x0, y0, z0), 1.3, 1.5, 1.85);
      for (let k = 0; k < 3; k++) { const u = .35 + R() * .55, a = (R() - .5) * 1.6; stick(x0 + dx * l * u, y0 + (y1 - y0) * u + r * .5, z0 + dz * l * u, dx * .5 + Math.cos(yaw) * Math.sin(a), .8, dz * .5 - Math.sin(yaw) * Math.sin(a), .3 + R() * .35, .03 + R() * .02, .7 + R() * .2, true); } }
      const [px, pz, pyaw] = L.POLES, py = T.ground(px, pz), sx = Math.sin(pyaw), sz = Math.cos(pyaw);   // the stack of poles for the next repair
      [[-.16, 0], [0, 0], [.16, 0], [-.08, .135], [.08, .135], [0, .27]].forEach(([o, up]) => { const l = 1.25 + R() * .3, j = (R() - .5) * .16; stick(px + sz * o - sx * (l / 2 + j), py + .07 + up, pz - sx * o - sz * (l / 2 + j), sx, 0, sz, l, .075, .8 + R() * .3, true, 6); });
    }, () => mesh(mud, M.rock, 'dam mud', false), () => mesh(logs, M.log, 'dam and lodge'), () => mesh(pale, M.wood, 'gnawed wood'));
  }
  if (site.id === 'sett') {
    /* The badger's sett in the wooded slope: a mound of earth under the old oak, the main entrance a dark
       hole between two roots, a smaller hole at the side, fresh sandy spoil fanned out in front of it,
       a heap of dry grass that he airs as bedding, a few stones. Entrances face the path (and the camera). The mound itself
       is shaped like the ground around it (see `hill`), not a dome. */
    const earth = new Buffer(), roots = new Buffer(), straw = new Buffer(), [cx, cz, yaw] = L.SETT, fx = Math.sin(yaw), fz = Math.cos(yaw), sx = fz, sz = -fx, g0 = T.ground(cx, cz);
    const Q = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3();
    const at = (f, side) => [cx + fx * f + sx * side, cz + fz * f + sz * side];
    const limb = (buf, x, y, z, dx, dy, dz, l, r0, r1, c) => { Q.setFromUnitVectors(UP, V.set(dx, dy, dz).normalize()); add(buf, new THREE.CylinderGeometry(r1, r0, l, 7, 1).translate(0, l / 2, 0).applyQuaternion(Q).translate(x, y, z), ...c); };
    // The mound grows out of the woodland floor: a soft, uneven hillock whose rim takes the ground's own colour, grass
    // and moss on its back, bare dug earth on the front where the badger comes and goes.
    const hill = (() => { const RINGS = 16, SEG = 44, RAD = 3.3, H = 1.18, pos = [], col = [], idx = [], c = new THREE.Color(), moss = new THREE.Color('#5a7f30'), grass = new THREE.Color('#6f9238'), soil = new THREE.Color('#7b5636'), dark = new THREE.Color('#5a3d26');
      const height = (rn, a) => { const bump = Math.pow(Math.cos(Math.min(1, rn) * Math.PI / 2), 1.5), wob = .1 * Math.sin(a * 3 + 1.3) + .07 * Math.sin(a * 5 + .4) + .05 * Math.sin(a * 9); return H * bump * (1 + wob * (1 - rn)); };
      for (let i = 0; i <= RINGS; i++) for (let j = 0; j < SEG; j++) { const rn = i / RINGS, a = j / SEG * TAU, side = Math.cos(a), fwd = Math.sin(a), lx = side * RAD * 1.12 * rn, lf = fwd * RAD * rn,
          x = cx + sx * lx + fx * lf, z = cz + sz * lx + fz * lf, y = T.ground(x, z) + height(rn, a) - (i === RINGS ? .04 : 0); pos.push(x, y, z);
          T.colour(x, z, c); const top = 1 - THREE.MathUtils.smoothstep(rn, .55, .95), front = THREE.MathUtils.smoothstep(fwd, .15, .65) * THREE.MathUtils.smoothstep(rn, .25, .5) * (1 - THREE.MathUtils.smoothstep(rn, .88, 1));
          c.lerp(grass, top * .7).lerp(moss, top * .45 * (.5 + .5 * Math.sin(a * 4 + rn * 9))).lerp(soil, front * .9).lerp(dark, front * .35 * (.5 + .5 * Math.sin(a * 7 + rn * 13))); col.push(c.r, c.g, c.b); }
      for (let i = 0; i < RINGS; i++) for (let j = 0; j < SEG; j++) { const a = i * SEG + j, b = i * SEG + (j + 1) % SEG, d = a + SEG, e = b + SEG; idx.push(a, b, d, b, e, d); }
      const top = pos.length / 3; pos.push(cx, T.ground(cx, cz) + height(0, 0), cz); T.colour(cx, cz, c); c.lerp(grass, .7); col.push(c.r, c.g, c.b); for (let j = 0; j < SEG; j++) idx.push(top, (j + 1) % SEG, j);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; })();
    steps.push(() => { // the mound, then the two holes with their rims of trodden earth
      { const m = new THREE.Mesh(hill, M.ground); m.name = 'sett mound'; m.receiveShadow = M.shadows; group.add(m); }
      for (const [f, side, w, h] of [[1.78, 0, .62, .6], [1.05, -1.75, .4, .4]]) { const [x, z] = at(f, side), y = T.ground(x, z) + h * .62, turn = yaw + (side ? -1.0 : 0);
        add(earth, new THREE.SphereGeometry(1, 14, 10).scale(w, h, .5).rotateY(turn).translate(x - Math.sin(turn) * .12, y, z - Math.cos(turn) * .12), .05, .038, .03);
        add(earth, new THREE.TorusGeometry(1, .3, 8, 18, Math.PI * 1.15).rotateZ(-Math.PI * .075).scale(w * 1.12, h * 1.18, .55).rotateY(turn).translate(x, y - .02, z), .26, .19, .125); }
    });
    steps.push(() => { // roots of the oak that grip the mound and frame the main entrance
      const brown = [.5, .4, .32];
      for (const [side, lean] of [[-.78, .28], [.82, -.24], [-1.5, .5], [1.6, -.5]]) { const [x, z] = at(1.25 + Math.abs(side) * .12, side * .2), top = g0 + 1.25 - Math.abs(side) * .12;
        limb(roots, cx + sx * side * .15 - fx * .2, top, cz + sz * side * .15 - fz * .2, fx * .9 + sx * side * .55, -.38, fz * .9 + sz * side * .55, 1.5, .17, .11, brown);
        const [bx, bz] = at(1.75 + Math.abs(side) * .1, side * 1.0); limb(roots, bx - fx * .25 - sx * side * .2, top - .52, bz - fz * .25 - sz * side * .2, fx * .4 + sx * lean * -1, -1, fz * .4 + sz * lean * -1, .95, .11, .06, brown); void x; void z; }
    });
    steps.push(() => { // fresh spoil in front of the hole, clods and stones, the bedding heap with loose stalks
      const [ax, az] = at(3.05, .15), ay = T.ground(ax, az);
      add(earth, new THREE.SphereGeometry(1, 14, 6).scale(1.3, .15, .9).rotateY(yaw).translate(ax, ay + .01, az), .72, .5, .3);
      for (let k = 0; k < 5; k++) { const [x, z] = at(2.5 + R() * 1.1, (R() - .5) * 1.6), v = .55 + R() * .12; add(earth, new THREE.SphereGeometry(1, 8, 5).scale(.3 + R() * .25, .1 + R() * .06, .25 + R() * .2).rotateY(R() * 3).translate(x, T.ground(x, z) + .04, z), v, v * .78, v * .52); }
      for (let k = 0; k < 9; k++) { const [x, z] = at(2.3 + R() * 1.6, (R() - .5) * 2.6), r = .05 + R() * .08, v = .36 + R() * .16; add(earth, new THREE.SphereGeometry(r, 6, 4).scale(1, .7, 1).translate(x, T.ground(x, z) + r * .4, z), v, v * .82, v * .6); }
      const t = templates(); for (const [f, side, sc] of [[2.2, 2.3, .42], [1.2, 2.75, .3], [2.6, -2.4, .34]]) { const [x, z] = at(f, side), v = .82 + R() * .15; earth.add(t.rock, {x, y: T.ground(x, z) - sc * .3, z, ry: R() * TAU, sx: sc, sy: sc * .7, sz: sc * .9, c: new THREE.Color(v, v, v * .97)}); }
      const [hx, hz] = at(2.25, 1.55), hy = T.ground(hx, hz);
      add(straw, new THREE.SphereGeometry(1, 12, 7).scale(.55, .26, .45).rotateY(yaw + .5).translate(hx, hy + .1, hz), 1.5, 1.6, 1.25);
      for (let k = 0; k < 16; k++) { const a = R() * TAU, d = R() * .5; limb(straw, hx + Math.cos(a) * d, hy + .12 + R() * .12, hz + Math.sin(a) * d, Math.cos(a + R() - .5), .35 + R() * .5, Math.sin(a + R() - .5), .3 + R() * .35, .012, .006, [1.55, 1.7, 1.3]); }
    }, () => mesh(earth, M.rock, 'sett earth'), () => mesh(roots, M.log, 'sett roots'), () => mesh(straw, M.wood, 'sett bedding', false));
  }
  if (site.id === 'friends') steps.push(() => { // the friends' props: the mouse's stump, the squirrel's acorns
    const wood = new Buffer(), bits = new Buffer(), [mx, mz] = L.FRIENDS.mouse.at, my = T.ground(mx, mz);
    add(wood, new THREE.CylinderGeometry(.75, .9, .62, 18, 1).translate(mx, my + .31, mz), 1.25, 1, .78);
    const [qx, qz] = L.FRIENDS.squirrel.at; for (let i = 0; i < 5; i++) { const x = qx + .5 + i * .22, z = qz + .5 + (i % 2) * .2; add(bits, new THREE.SphereGeometry(.09, 10, 7).scale(1, 1.2, 1).translate(x, T.ground(x, z) + .08, z), .6, .39, .2); }
    mesh(wood, M.log, 'stump'); mesh(bits, M.rock, 'acorns', false);
  });
  return steps;
}
