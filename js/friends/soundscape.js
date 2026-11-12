/* The forest's sound director: decides what is heard and when. It makes no sound itself (no Web Audio),
   so a whole afternoon can be played through in a test (tests/soundscape.test.cjs).

   Rules it follows, so that twenty minutes of play stay pleasant:
   - nothing repeats on a fixed beat: every gap, pitch and place is drawn afresh;
   - birds sing a few phrases from one spot and then fall silent; at most two sing at once, and now and
     then the wood is quiet for half a minute;
   - rare voices (cuckoo, woodpecker, dove) stay rare;
   - the wind comes in gusts with calm stretches between them;
   - footsteps grow softer during a long walk, and after some minutes everything settles a little;
   - the place decides the voices: frogs at the swamp, crickets and bees in the meadow, the brook and the
     waterfall only near the water.

   step(now, env) returns the levels of the four steady layers and the single sounds to start.
   env: {indoors, moving, speed, ground, trees, meadow, swamp, spruce, brook, falls, fallsPan}. */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/* phrases a singer gives from one spot, pause between them, rest before the same kind sings again (seconds) */
export const SPECIES = {
  blackbird: {phrases: [2, 4], gap: [3.4, 6.5], rest: 14},
  chaffinch: {phrases: [1, 3], gap: [4.5, 8], rest: 16},
  greatTit: {phrases: [2, 3], gap: [3, 5.5], rest: 16},
  blueTit: {phrases: [1, 3], gap: [3.5, 6.5], rest: 16},
  dove: {phrases: [1, 2], gap: [7, 11], rest: 50},
  cuckoo: {phrases: [1, 1], gap: [0, 0], rest: 170, far: true},
  woodpecker: {phrases: [1, 2], gap: [6, 10], rest: 100, far: true},
  frog: {phrases: [1, 3], gap: [3, 7], rest: 22},
  cricket: {phrases: [1, 2], gap: [5, 9], rest: 24},
  bee: {phrases: [1, 1], gap: [0, 0], rest: 70},
};
const OUTSIDE = {indoors: false, moving: false, speed: 0, ground: 'grass', trees: .8, meadow: 0, swamp: 0, spruce: 0, brook: 0, falls: 0, fallsPan: 0};
/* How likely each voice is at a place. */
export function voicesAt(env) {
  if (env.indoors) return {blackbird: 2, greatTit: 1, dove: 1};
  const f = env.trees;
  return {blackbird: 3 * f + .5, chaffinch: 3 * f * (1 - env.spruce * .5), greatTit: 2.4 * f + .3, blueTit: 2 * f * (1 - env.spruce * .6) + .2,
    dove: 1.1 * f, cuckoo: .32 * f, woodpecker: .45 * f, frog: 4.5 * env.swamp, cricket: 3 * env.meadow, bee: 1.1 * env.meadow};
}
export function createDirector({random = Math.random} = {}) {
  const range = (a, b) => a + (b - a) * random(), whole = (a, b) => Math.floor(range(a, b + 1));
  let start = null, last = 0, gust = .2, gustTo = .2, nextGust = 0, breezy = false, nextMood = 0;
  let nextSinger = 0, quietUntil = 0, lastKind = '', nextStep = 0, side = 1, walked = 0, wasMoving = false;
  let flutter = 1;
  const singers = [], sangAt = {};

  function chooseKind(now, env) {
    const w = voicesAt(env); let total = 0; const open = [];
    for (const [kind, weight] of Object.entries(w)) { if (weight <= .02 || kind === lastKind || now - (sangAt[kind] ?? -1e9) < SPECIES[kind].rest || singers.some(s => s.kind === kind)) continue; open.push([kind, weight]); total += weight; }
    let pick = random() * total; for (const [kind, weight] of open) { if ((pick -= weight) <= 0) return kind; } return open.length ? open[open.length - 1][0] : null;
  }

  function step(now, given) {
    const env = {...OUTSIDE, ...given}, events = [];
    if (start === null) { start = last = now; nextGust = now; nextMood = now + range(30, 70); nextSinger = now + range(1.2, 3.5); }
    const dt = clamp(now - last, 0, .5); last = now;
    const age = now - start, settled = 1 - .32 * sstep(360, 1080, age);      // after six minutes everything eases off, down to two thirds

    // wind: gusts and calm stretches
    if (now >= nextMood) { breezy = random() < .4; nextMood = now + range(40, 110); }
    if (now >= nextGust) { gustTo = breezy ? range(.35, 1) : range(0, .42); nextGust = now + range(3, 9); }
    gust += (gustTo - gust) * (1 - Math.exp(-dt / 2.4)); flutter = .78 + .44 * random();
    const cover = Math.max(env.trees, env.meadow * .55, env.swamp * .4);
    const beds = {wind: .3 + .7 * gust, leaves: cover * sstep(.3, 1, gust) * flutter, bright: clamp(.5 + .5 * env.meadow - .35 * env.spruce), brook: env.brook, falls: env.falls, fallsPan: env.fallsPan, gust};

    // birds and other voices
    const lively = settled * (env.indoors ? .4 : 1);
    if (now >= nextSinger && now >= quietUntil && singers.length < 2) {
      const kind = chooseKind(now, env);
      if (kind) { const sp = SPECIES[kind]; singers.push({kind, left: whole(...sp.phrases), next: now, pan: range(-.85, .85), far: sp.far ? range(.7, 1) : range(.15, .95)}); lastKind = kind; sangAt[kind] = now; }
      nextSinger = now + range(10, 26) / lively;
      if (random() < .14) quietUntil = now + range(22, 42);
    }
    for (let i = singers.length - 1; i >= 0; i--) { const s = singers[i]; if (now < s.next) continue;
      events.push({type: 'call', kind: s.kind, at: now + .05, pan: s.pan, far: s.far, level: settled}); sangAt[s.kind] = now;
      if (--s.left <= 0) singers.splice(i, 1); else s.next = now + range(...SPECIES[s.kind].gap); }

    // footsteps, in time with the walk, softer on a long walk
    if (env.moving && !env.indoors) {
      if (!wasMoving) nextStep = now + .04; walked = Math.min(14, walked + dt);
      if (now >= nextStep) { const every = Math.PI / Math.max(4, env.speed * 3.2); side = -side; if (nextStep < now - .3) nextStep = now;
        // steps are planned a moment ahead, so they fall between two looks at the clock and keep their own rhythm
        events.push({type: 'step', ground: env.ground, at: nextStep + .12, side, level: (1 - .45 * sstep(4, 14, walked)) * settled});
        if ((env.ground === 'grass' || env.ground === 'needles') && random() < .012) events.push({type: 'twig', at: now + .03, level: settled});
        nextStep += every * range(.93, 1.07); }
    } else walked = Math.max(0, walked - dt * 3);
    wasMoving = env.moving && !env.indoors;

    // the brook's bubbles and the swamp's plops
    if (env.brook > .25 && !env.indoors) { let n = dt * (1.5 + 4.5 * env.brook) * env.brook; while (n > 0) { if (random() < n) events.push({type: 'bubble', at: now + random() * Math.max(dt, .05), level: env.brook, pan: range(-.5, .5)}); n--; } }
    if (env.swamp > .4 && random() < dt * .06 * env.swamp) events.push({type: 'plop', at: now + .02, level: settled, pan: range(-.7, .7)});

    return {beds, events};
  }
  return {step, get singers() { return singers.length; }};
}
