/* Biber's works at the pond (built with the `pond` site, in small steps).
   The dam, as beavers build it: a wall of mud and stones across the outlet; heavy logs laid along its foot and
   leaning into the face; a thatch of sticks pushed in butt-first, bark still on some, others peeled pale; long
   poles laid along both edges of the crest, which stays free in the middle as Fuchs' way across; short sticks and
   drift caught on the pond side; grass and fresh leafy branches growing out of it; water that spills over two low
   places, runs down between the sticks and foams where it meets the brook.
   The lodge on its island: a mound of mud with a wet foot and moss on top, thatched with sticks that all point up
   to the top, where a loose crown of them lets the air out; an arched way in at the waterline, framed with gnawed
   logs, with a warm light inside at dusk; a raft of peeled sticks beside it.
   Around his place: the stumps of the trees he felled, trunks still lying there, a stack of cut poles.
   `s` runs across the dam (downstream positive), `t` along it. */
import {THREE} from '../../../scene/materials.js';
import {TAU, lerp, sstep, fbm} from '../noise.js';
import {Buffer, templates} from '../tiles.js';
import {waterMaterial} from './tiles.js';
import {ATLAS} from './atlas.js';

export const LODGE = [37.5, -18.6];
const PALE = [1.3, 1.48, 1.78];

export function beaverSteps(site, look, world, group, out, R) {
  const T = world.terrain, L = world.layout, M = look.M, steps = [], tpl = templates();
  const logs = new Buffer(), pale = new Buffer(), mud = new Buffer(), green = new Buffer(), c = T.crossings.find(k => k.kind === 'dam'), D = T.dam;
  const ax = c.a[0], az = c.a[1], ux = (c.b[0] - ax) / D.len, uz = (c.b[1] - az) / D.len, dnx = -D.n[0], dnz = -D.n[1], H = c.y, len = D.len, pond = T.pools.find(p => p.id === 'pond').level;
  const Q = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3(), tone = new THREE.Color(), tone2 = new THREE.Color();
  const paint = (g, r, gr, b) => { const k = new Float32Array(g.attributes.position.count * 3); for (let i = 0; i < k.length; i += 3) { k[i] = r; k[i + 1] = gr; k[i + 2] = b; } g.setAttribute('color', new THREE.BufferAttribute(k, 3)); return g; };
  const add = (buf, g, r = 1, gr = r, b = r) => { buf.addGeometry(paint(g, r, gr, b)); g.dispose(); };
  const mesh = (buf, material, name, cast = true) => { const g = buf.geometry(); if (!g) return; const m = new THREE.Mesh(g, material); m.name = name; m.castShadow = cast && M.shadows; m.receiveShadow = M.shadows; group.add(m); };
  const at = (t, s) => [ax + ux * len * t + dnx * s, az + uz * len * t + dnz * s];
  // the dam's surface: flat crest, a steep wet side to the pond, a longer slope down to the brook
  const surface = (t, s) => { const [x, z] = at(t, s), y = Math.abs(s) <= .55 ? H - .02 : s < 0 ? H - .02 + (s + .55) * .8 : H - .02 - (s - .55) * .6; return Math.max(y, T.ground(x, z) + .05); };
  const profile = (t, s) => Math.abs(s) <= .55 ? H - .02 : s < 0 ? H - .02 + (s + .55) * .8 : H - .02 - (s - .55) * .6, onDam = (t, s) => t > 0 && t < 1 && profile(t, s) > T.ground(...at(t, s)) + .1;   // not where the bank stands higher than the dam
  // bark: reddish, weathered grey or dark and wet
  const bark = () => { const v = .5 + R() * .55, q = R(); return q < .45 ? [v, v * .86, v * .72] : q < .8 ? [v * .86, v * .84, v * .8] : [v * .6, v * .52, v * .46]; }, peeled = () => { const v = .95 + R() * .22; return [1.2 * v, 1.32 * v, 1.52 * v]; };
  /** A stick from a point along a direction: a little bent, tapered; `tip` 'gnawed' gives it a pale point, 'bark' a blunt end. */
  const twig = (buf, x, y, z, dx, dy, dz, l, r, col, {tip = 'bark', bend = .09, sides = 5, taper = .62} = {}) => {
    const d = V.set(dx, dy, dz).normalize().clone(), flat = Math.hypot(d.x, d.z), side = (flat > 1e-3 ? new THREE.Vector3(d.z / flat, 0, -d.x / flat) : new THREE.Vector3(1, 0, 0)).multiplyScalar((R() - .5) * 2 * bend * l);
    const p0 = new THREE.Vector3(x, y, z), p2 = p0.clone().addScaledVector(d, l), p1 = p0.clone().addScaledVector(d, l * .5).add(side); p1.y += (R() - .3) * bend * l;
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2), SEG = 3, g = new THREE.TubeGeometry(curve, SEG, r, sides, false), p = g.attributes.position;
    for (let i = 0; i <= SEG; i++) { const o = curve.getPointAt(i / SEG), k = 1 - (1 - taper) * i / SEG; for (let j = 0; j <= sides; j++) { const n = i * (sides + 1) + j; p.setXYZ(n, o.x + (p.getX(n) - o.x) * k, o.y + (p.getY(n) - o.y) * k, o.z + (p.getZ(n) - o.z) * k); } }
    add(buf, g, ...col);
    if (tip) { const gn = tip === 'gnawed', h = r * (gn ? 2.4 : 1.1); Q.setFromUnitVectors(UP, curve.getTangentAt(1)); add(gn ? pale : buf, new THREE.ConeGeometry(r * taper * 1.03, h, sides).translate(0, h / 2, 0).applyQuaternion(Q).translate(p2.x, p2.y, p2.z), ...(gn ? PALE : col)); }
  };
  /** A stick of either kind: most with their bark, some peeled. */
  const stick = (x, y, z, dx, dy, dz, l, r, o = {}) => { const pl = R() < .24; twig(pl ? pale : logs, x, y, z, dx, dy, dz, l, r, pl ? peeled() : bark(), {tip: R() < .4 ? 'gnawed' : 'bark', ...o}); };
  const tuft = (x, y, z, s = 1, cell = ATLAS.grass) => { const v = .85 + R() * .3; green.add(cell === ATLAS.bush ? tpl.crown : cell === ATLAS.reeds ? tpl.reeds : tpl.grass, {x, y, z, ry: R() * TAU, sx: s, sy: s * (cell === ATLAS.bush ? 1 : .8 + R() * .5), sz: s, cell, up: true, c: tone.setRGB(v, v, v * .88)}); };

  /* ---------- the dam ---------- */
  steps.push(() => { // the wall of mud: trodden pale on the crest, dark and wet at the water (where the bank is higher, the wall ends inside it)
    const S = [-1.7, -1.15, -.55, -.2, .2, .55, 1.05, 1.6, 2.2, 2.9], N = 22, pos = [], col = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) for (let k = 0; k < S.length; k++) { const t = lerp(-.03, 1.03, i / N), s = S[k] + (k && k < S.length - 1 ? (R() - .5) * .16 : 0), [x, z] = at(t, s), y = surface(t, s), g0 = T.ground(x, z), yy = y < g0 + .07 ? g0 - .14 : y + (Math.abs(s) < .6 ? (R() - .5) * .03 : (R() - .5) * .09);
      pos.push(x, yy, z); uv.push(t * len * .6, s * .6); const n = fbm(x * 2.1, z * 2.1), wet = s < 0 ? sstep(pond + .22, pond + .02, yy) : sstep(H - .9, H - 1.3, yy) * .6, crest = sstep(.5, .2, Math.abs(s));
      tone.setRGB(.33, .245, .165).multiplyScalar(.8 + .4 * n).lerp(tone2.setRGB(.5, .39, .27), crest * .55).lerp(tone2.setRGB(.15, .115, .09), wet); col.push(tone.r, tone.g, tone.b); }
    for (let i = 0; i < N; i++) for (let k = 0; k < S.length - 1; k++) { const p0 = i * S.length + k, p1 = p0 + S.length; idx.push(p0, p0 + 1, p1, p1, p0 + 1, p1 + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
    if (g.attributes.normal.getY(S.length + 4) < 0) { g.setIndex(idx.map((v, n) => idx[n - n % 3 + [0, 2, 1][n % 3]])); g.computeVertexNormals(); }
    mud.addGeometry(g); g.dispose();
    // stones pressed into both feet of the wall and a few on the crest's edges
    for (let k = 0; k < 22; k++) { const t = .03 + R() * .94, s = k < 9 ? -.5 - R() * .5 : k < 17 ? 2.3 + R() * .9 : (R() < .5 ? -1 : 1) * (.5 + R() * .1), [x, z] = at(t, s), sc = .14 + R() * .16, v = .78 + R() * .25;
      mud.add(tpl.stone, {x, y: surface(t, s) + sc * .1, z, ry: R() * TAU, sx: sc, sy: sc * (.5 + R() * .4), sz: sc * (.7 + R() * .4), c: tone.setRGB(v, v * .97, v * .92)}); }
  });
  steps.push(() => { // heavy logs: some along the foot of the face, some leaning into it
    for (let k = 0; k < 7; k++) { const l = 1.5 + R() * 1.2, t = .08 + R() * Math.max(.05, .84 - l / len), s = 1.7 + R() * 1.2, [x, z] = at(t, s), turn = (R() - .5) * .5, cs = Math.cos(turn), sn = Math.sin(turn), r = .085 + R() * .04; if (!onDam(t, s) || !onDam(t + l / len, s)) continue;
      twig(logs, x, surface(t, s) + r * .5, z, ux * cs - uz * sn, (R() - .5) * .08, uz * cs + ux * sn, l, r, bark(), {tip: 'gnawed', sides: 7, bend: .04, taper: .8}); }
    for (let k = 0; k < 7; k++) { const t = .08 + k / 7 * .84 + (R() - .5) * .06, s = 2.5 + R() * .5, [x, z] = at(t, s), turn = (R() - .5) * .7, cs = Math.cos(turn), sn = Math.sin(turn), r = .06 + R() * .035; if (!onDam(t, s)) continue;
      twig(logs, x, surface(t, s) - .05, z, -(dnx * cs - dnz * sn), .5 + R() * .15, -(dnz * cs + dnx * sn), 1.3 + R() * .5, r, bark(), {tip: 'gnawed', sides: 6, bend: .05, taper: .7}); }
  });
  const face = thick => () => { for (let k = 0; k < 30; k++) { // sticks pushed into the downstream face, butt first, leaning down the slope
    const t = .03 + R() * .94, s0 = .3 + R() * 2.2, turn = (R() - .5) * (R() < .25 ? 2.4 : 1), cs = Math.cos(turn), sn = Math.sin(turn), hx = dnx * cs - dnz * sn, hz = dnz * cs + dnx * sn;
    const l = Math.min(.6 + R() * 1.2, (3.5 - s0) / Math.max(.4, cs)), [x, z] = at(t, s0); if (!onDam(t, s0) || !onDam(t, Math.min(3.3, s0 + l * cs * .8))) continue;
    stick(x, surface(t, s0) + .03 + R() * .14, z, hx, -.58 * cs + (R() - .5) * .2, hz, l, (.024 + R() * .028) * thick);
  } };
  const mat = () => { for (let k = 0; k < 26; k++) { // a mat of brushwood laid across the face, along the dam
    const l = .7 + R() * 1.1, t = .03 + R() * Math.max(.05, .94 - l / len), s = .6 + R() * 2.3, [x, z] = at(t, s), turn = (R() - .5) * .7, cs = Math.cos(turn), sn = Math.sin(turn); if (!onDam(t, s) || !onDam(t + l / len, s)) continue;
    stick(x, surface(t, s) + .02 + R() * .08, z, ux * cs - uz * sn, (R() - .5) * .14, uz * cs + ux * sn, l, .022 + R() * .03); } };
  steps.push(mat, face(2), mat, face(1.6), face(1.3), mat, face(1.1), face(1), face(1), face(.8));
  steps.push(() => { // the crest: long poles along both edges, cross sticks woven into the face, short ones into the pond side, stakes
    for (const side of [-1, 1]) for (let k = 0; k < 4; k++) { const l = 1.6 + R() * 1.5, t = .02 + R() * Math.max(.05, .95 - l / len), s = side * (.5 + R() * .18), turn = (R() - .5) * .2, [x, z] = at(t, s), r = .05 + R() * .03, cs = Math.cos(turn), sn = Math.sin(turn);
      twig(R() < .3 ? pale : logs, x, H + r * .4, z, ux * cs - uz * sn, (R() - .5) * .03, uz * cs + ux * sn, l, r, R() < .3 ? peeled() : bark(), {tip: 'gnawed', sides: 6, bend: .03, taper: .8}); }
    for (let k = 0; k < 10; k++) { const l = .9 + R() * 1.1, t = .03 + R() * (.94 - l / len), s = .75 + R() * 1.8, [x, z] = at(t, s), turn = (R() - .5) * .9, cs = Math.cos(turn), sn = Math.sin(turn); if (!onDam(t, s)) continue;
      stick(x, surface(t, s) + .08 + R() * .08, z, ux * cs - uz * sn, (R() - .5) * .16, uz * cs + ux * sn, l, .024 + R() * .026); }
    for (let k = 0; k < 12; k++) { const t = .04 + R() * .92, turn = (R() - .5) * 1.2, cs = Math.cos(turn), sn = Math.sin(turn), [x, z] = at(t, -.55 - R() * .2);
      stick(x, H - .06, z, -(dnx * cs - dnz * sn), -.5 - R() * .2, -(dnz * cs + dnx * sn), .6 + R() * .7, .022 + R() * .025, {tip: 'bark'}); }
    for (let k = 0; k < 6; k++) { const t = .06 + R() * .88, s = .75 + R() * 1.4, [x, z] = at(t, s); if (!onDam(t, s)) continue; stick(x, surface(t, s) - .3, z, -dnx * .4 + (R() - .5) * .4, 1, -dnz * .4 + (R() - .5) * .4, .6 + R() * .35, .03 + R() * .018, {tip: 'gnawed'}); }
    // drift caught against the pond side: peeled sticks afloat, a leaf or two
    for (let k = 0; k < 11; k++) { const t = .06 + R() * .88, s = -1.25 - R() * .9, [x, z] = at(t, s); if (T.stillDepth(x, z) < .05) continue; const a = R() * TAU;
      twig(pale, x, pond + .012, z, Math.cos(a), 0, Math.sin(a), .35 + R() * .5, .02 + R() * .014, peeled(), {tip: 'bark', bend: .03});
      if (R() < .4) green.add(tpl.flat, {x: x + .2, y: pond + .014, z: z + .1, ry: R() * TAU, sx: .3, sy: 1, sz: .3, cell: ATLAS.litter, up: true}); }
  });
  steps.push(() => { // what grows on it: grass along the crest's edges and at both ends, fresh leafy branches stuck in the face
    for (let k = 0; k < 20; k++) { const t = R(), s = (R() < .5 ? -1 : 1) * (.62 + R() * .35), [x, z] = at(t, s); tuft(x, surface(t, s) - .03, z, .55 + R() * .4); }
    for (const t of [-.06, 1.06]) for (let k = 0; k < 5; k++) { const [x, z] = at(t + (R() - .5) * .06, (R() - .5) * 2.2); tuft(x, T.ground(x, z) - .02, z, .9 + R() * .4); }
    for (const [t, s] of [[.16, 1.3], [.5, 1.9], [.83, 1.1], [.67, -.7]]) { const [x, z] = at(t, s); tuft(x, surface(t, s) - .12, z, .5 + R() * .2, ATLAS.bush); }
  });
  steps.push(() => { // water spills over two low places in the crest, runs down between the sticks and foams where it lands
    const pos = [], uv = [], idx = [];
    for (const [t0, w] of [[.44, .5], [.62, .34]]) { const base = pos.length / 3; let run = 0, prev = null, end = null;
      for (let k = 0; k <= 13; k++) { const s = -.5 + k * .29, half = w * (.55 + .45 * Math.sin(k * .9 + t0 * 9)) / len, y = (k < 4 ? Math.max(surface(t0, s), H - .02) : surface(t0, s)) + .05; if (prev !== null) run += Math.hypot(.29, y - prev); prev = y;
        for (const side of [-1, 1]) { const [x, z] = at(t0 + half * side, s); pos.push(x, y, z); uv.push(side < 0 ? 0 : 1, run * 2.2); }
        if (k) { const p0 = base + (k - 1) * 2; idx.push(p0, p0 + 2, p0 + 1, p0 + 1, p0 + 2, p0 + 3); } end = [s, y]; }
      // foam on the brook below (uv.x = -1 marks it; uv.y is the distance from the middle, 0…1)
      const [fx, fz] = at(t0, end[0] - .1), st = T.streamAt(fx, fz), fy = (st.stream ? Math.max(st.level, end[1] - .25) : end[1] - .1) + .03, fb = pos.length / 3, RF = .5 + w;
      pos.push(fx, fy, fz); uv.push(-1, 0); for (let k = 0; k <= 16; k++) { const a = k / 16 * TAU; pos.push(fx + Math.cos(a) * RF, fy, fz + Math.sin(a) * RF); uv.push(-1, 1); if (k) idx.push(fb, fb + k, fb + k + 1); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeBoundingSphere();
    const water = waterMaterial(look, world.fog), fog = world.fog;
    const mat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: {uTime: water.uniforms.uTime, uNoise: {value: look.T.noise}, fogColor: {value: fog.color}, fogNear: water.uniforms.fogNear, fogFar: water.uniforms.fogFar},
      vertexShader: 'varying vec2 vUv;varying float vFog;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vFog=-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader: `uniform float uTime;uniform sampler2D uNoise;uniform vec3 fogColor;uniform float fogNear,fogFar;varying vec2 vUv;varying float vFog;
      void main(){vec3 c;float a;
        if(vUv.x<-.5){float r=vUv.y,n=texture2D(uNoise,vec2(r*.9-uTime*.2,atan(r)*.4+uTime*.05)).r,rings=.5+.5*sin(r*20.-uTime*4.6+n*6.);a=(1.-smoothstep(.2,1.,r))*(.5+.5*rings)*smoothstep(.3,.6,n+.3*(1.-r));c=vec3(.97,1.,.98);}
        else{float n1=texture2D(uNoise,vec2(vUv.x*.9,vUv.y*.12-uTime*.42)).r,n2=texture2D(uNoise,vec2(vUv.x*2.1+.4,vUv.y*.3-uTime*.7)).r;
          float streak=smoothstep(.36,.7,n1*.55+n2*.6),edge=smoothstep(0.,.25,vUv.x)*(1.-smoothstep(.75,1.,vUv.x));
          c=mix(vec3(.5,.78,.82),vec3(1.),streak*.9);a=edge*(.34+.56*streak)*smoothstep(0.,.5,vUv.y);}
        c=mix(c,fogColor,smoothstep(fogNear,fogFar,vFog)*.85);gl_FragColor=vec4(c,a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
    const m = new THREE.Mesh(g, mat); m.name = 'dam spill'; m.renderOrder = 3; group.add(m);
  });

  /* ---------- the lodge ---------- */
  const [lx, lz] = LODGE, ly = T.stillLevel(lx, lz) || H - .3, RX = 1.06, RZ = .92, door = Math.atan2(.97, -.26);
  const PROFILE = [[2.3, -.3], [2.22, 0], [2.0, .42], [1.6, .92], [1.08, 1.38], [.52, 1.7], [0, 1.82]];
  const radiusAt = y => { for (let k = 0; k < PROFILE.length - 1; k++) if (y <= PROFILE[k + 1][1]) { const [r0, y0] = PROFILE[k], [r1, y1] = PROFILE[k + 1]; return lerp(r0, r1, (y - y0) / (y1 - y0)); } return 0; };
  const onLodge = (a, y, lift = 0) => { const r = radiusAt(y) + lift; return [lx + Math.cos(a) * r * RX, ly + y, lz + Math.sin(a) * r * RZ]; };
  const away = a => Math.abs(Math.atan2(Math.sin(a - door), Math.cos(a - door)));
  steps.push(() => { // the mound: wet and dark at its foot, moss on its top
    const g = new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 30).scale(RX, 1, RZ), p = g.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + (fbm(x * 1.3 + 4, z * 1.3 + y * 1.7) - .5) * .16 * sstep(1.8, 1.2, y); p.setXYZ(i, x * k + lx, y + ly, z * k + lz);
      tone.setRGB(.34, .25, .17).multiplyScalar(.8 + .45 * fbm(x * 2.3, z * 2.3 + y * 2)).lerp(tone2.setRGB(.15, .115, .09), sstep(.22, .02, y)).lerp(tone2.setRGB(.3, .4, .17), sstep(.55, .75, fbm(x * .9 + 2, z * .9)) * sstep(.5, 1.2, y) * .8); col.push(tone.r, tone.g, tone.b); }
    g.computeVertexNormals(); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); mud.addGeometry(g); g.dispose();
  });
  // the thatch: every stick lies on the mound and points up towards the top; heavy ones stand in the water at the foot
  const band = (y0, y1, n, lmin, lmax, r0) => () => { for (let k = 0; k < n; k++) { const a = k / n * TAU + R() * .3, y = lerp(y0, y1, R()); if (away(a) < .5 && y < 1.25) continue;
    const l = lerp(lmin, lmax, R()), [x, yy, z] = onLodge(a, y, .03 + R() * .08), [tx, ty, tz] = onLodge(a + (R() - .5) * .9, Math.min(1.78, y + l * .62), .1 + R() * .12);
    stick(x, yy, z, tx - x, ty - yy, tz - z, l, r0 * (.7 + R() * .6)); } };
  steps.push(band(-.25, .2, 34, 1.3, 2.1, .075), band(-.1, .45, 34, 1.2, 1.9, .065), band(.2, .7, 32, 1.1, 1.7, .058), band(.4, .95, 30, 1, 1.5, .05), band(.65, 1.2, 26, .9, 1.4, .045), band(.9, 1.4, 22, .8, 1.2, .04), band(1.15, 1.6, 16, .6, 1, .034));
  steps.push(() => { // the loose crown where the air goes out, tufts of grass on the top, fresh branches on the flank
    for (let k = 0; k < 9; k++) { const a = k / 9 * TAU + R() * .5, [x, y, z] = onLodge(a, 1.5 + R() * .15, 0); stick(x, y, z, Math.cos(a) * -.35 + (R() - .5) * .3, 1, Math.sin(a) * -.35 + (R() - .5) * .3, .5 + R() * .45, .024 + R() * .016, {tip: 'gnawed'}); }
    for (let k = 0; k < 9; k++) { const a = R() * TAU, y = .95 + R() * .7, [x, yy, z] = onLodge(a, y, -.03); tuft(x, yy, z, .5 + R() * .35); }
    for (const [a, y] of [[door + 1.5, .5], [door - 1.9, .75], [door + 2.9, .35]]) { const [x, yy, z] = onLodge(a, y, .1); tuft(x, yy - .1, z, .55, ATLAS.bush); }
    for (let k = 0; k < 7; k++) { const a = door + 1 + R() * 4.3, [x, , z] = onLodge(a, 0, .15 + R() * .3); tuft(x, ly - .06, z, .7 + R() * .3, ATLAS.reeds); }
  });
  steps.push(() => { // the way in: a dark arch at the waterline, framed with gnawed logs; a raft of peeled sticks beside it
    const dx = Math.cos(door), dz = Math.sin(door), yaw = Math.atan2(dx * RX, dz * RZ), [x, , z] = onLodge(door, .3, -.2), sx = Math.cos(yaw), sz = -Math.sin(yaw), W = .68, HH = 1.02;
    add(mud, new THREE.CircleGeometry(1, 16, 0, Math.PI).scale(W, HH, 1).rotateY(yaw).translate(x, ly - .04, z), .035, .028, .024);
    add(mud, new THREE.SphereGeometry(1, 12, 8).scale(W * .95, HH * .9, .22).rotateY(yaw).translate(x - dx * .3, ly + .02, z - dz * .3), .03, .024, .02);
    for (let k = 0; k <= 6; k++) { const a = k / 6 * Math.PI, px = x + sx * Math.cos(a) * (W + .07) + dx * .06, pz = z + sz * Math.cos(a) * (W + .07) + dz * .06, py = ly - .06 + Math.sin(a) * (HH + .07), b = a + Math.PI / 2;
      twig(k % 3 === 1 ? pale : logs, px - sx * Math.cos(b) * .32, py - Math.sin(b) * .32, pz - sz * Math.cos(b) * .32, sx * Math.cos(b), Math.sin(b), sz * Math.cos(b), .64, .075, k % 3 === 1 ? peeled() : bark(), {tip: 'gnawed', sides: 6, bend: .02, taper: .85}); }
    const glow = new THREE.Mesh(new THREE.CircleGeometry(1, 16, 0, Math.PI).scale(W * .8, HH * .8, 1).rotateY(yaw).translate(x + dx * .01, ly - .03, z + dz * .01), new THREE.MeshBasicMaterial({color: '#ffb55a', transparent: true, opacity: 0, depthWrite: false, toneMapped: false}));
    glow.name = 'lodge light'; glow.renderOrder = 2; group.add(glow); out.lodgeGlow = glow;
    const [rx, , rz] = onLodge(door - .75, 0, .75); for (let k = 0; k < 8; k++) { const a = yaw + Math.PI / 2 + (R() - .5) * .5; twig(pale, rx + (R() - .5) * .5 - Math.sin(a) * .35, ly + .02, rz + (R() - .5) * .5 - Math.cos(a) * .35, Math.sin(a), 0, Math.cos(a), .55 + R() * .3, .026 + R() * .012, peeled(), {tip: 'gnawed', bend: .02}); }
  });

  /* ---------- what he felled: stumps gnawed to a point, wood chips, trunks lying where they fell, a stack of cut poles ---------- */
  steps.push(() => { for (const [x, z, r] of L.STUMPS) { const y = T.ground(x, z), h = .26 + R() * .22, v = .6 + R() * .12;
    add(logs, new THREE.CylinderGeometry(r * .93, r * 1.16, h, 10, 1).translate(x, y + h / 2 - .06, z), v, v * .84, v * .7);
    add(pale, new THREE.ConeGeometry(r * .9, r * 1.35, 10).translate(x + (R() - .5) * r * .2, y + h - .06 + r * .67, z + (R() - .5) * r * .2), 1.3, 1.48, 1.78);
    for (let k = 0; k < 7; k++) { const a = R() * TAU, d = r + .12 + R() * .6, cx = x + Math.cos(a) * d, cz = z + Math.sin(a) * d; add(pale, new THREE.BoxGeometry(.07 + R() * .06, .016, .04 + R() * .03).rotateY(R() * TAU).translate(cx, T.ground(cx, cz) + .03, cz), 1.3, 1.5, 1.85); } } });
  steps.push(() => { for (const [x, z, r, yaw, l] of L.FELLED) { const dx = Math.sin(yaw), dz = Math.cos(yaw), x0 = x - dx * l / 2, z0 = z - dz * l / 2, y0 = T.ground(x0, z0) + r * .82, y1 = T.ground(x + dx * l / 2, z + dz * l / 2) + r * .7, v = .62 + R() * .1;
      Q.setFromUnitVectors(UP, V.set(dx * l, y1 - y0, dz * l).normalize());
      add(logs, new THREE.CylinderGeometry(r * .8, r, l, 9, 1).translate(0, l / 2, 0).applyQuaternion(Q).translate(x0, y0, z0), v, v * .84, v * .7);
      add(pale, new THREE.ConeGeometry(r * .97, r * 1.5, 9).rotateX(Math.PI).translate(0, -r * .74, 0).applyQuaternion(Q).translate(x0, y0, z0), 1.3, 1.48, 1.78);
      add(pale, new THREE.CylinderGeometry(r * .79, r * .79, .03, 9).translate(0, l + .012, 0).applyQuaternion(Q).translate(x0, y0, z0), 1.3, 1.5, 1.85);
      for (let k = 0; k < 3; k++) { const u = .35 + R() * .55, a = (R() - .5) * 1.6; twig(logs, x0 + dx * l * u, y0 + (y1 - y0) * u + r * .5, z0 + dz * l * u, dx * .5 + Math.cos(yaw) * Math.sin(a), .8, dz * .5 - Math.sin(yaw) * Math.sin(a), .3 + R() * .35, .03 + R() * .02, bark(), {tip: 'gnawed'}); } }
    const [px, pz, pyaw] = L.POLES, py = T.ground(px, pz), sx = Math.sin(pyaw), sz = Math.cos(pyaw);   // the stack of poles for the next repair
    [[-.16, 0], [0, 0], [.16, 0], [-.08, .135], [.08, .135], [0, .27]].forEach(([o, up]) => { const l = 1.25 + R() * .3, j = (R() - .5) * .16; twig(logs, px + sz * o - sx * (l / 2 + j), py + .07 + up, pz - sx * o - sz * (l / 2 + j), sx, 0, sz, l, .075, bark(), {tip: 'gnawed', sides: 6, bend: .01, taper: .9}); });
  }, () => mesh(mud, M.rock, 'dam mud', false), () => mesh(logs, M.log, 'dam and lodge'), () => mesh(pale, M.wood, 'gnawed wood'), () => mesh(green, M.plants, 'beaver greens', false));
  return steps;
}
