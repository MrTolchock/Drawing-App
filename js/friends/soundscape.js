/* The forest's sound director: decides what is heard and when. It makes no sound itself (no Web Audio),
   so a whole afternoon can be played through in a test (tests/soundscape.test.cjs).

   Rules it follows, so that twenty minutes of play stay pleasant:
   - nothing repeats on a fixed beat: every gap, pitch and place is drawn afresh;
   - nearby birds sing a few phrases from one spot and then fall silent; at most two sing at once, and now
     and then they pause for half a minute. Behind them a soft chorus of birds further off never stops for
     long, because there is no wind or other steady sound and the wood would otherwise seem switched off;
   - rare voices (cuckoo, woodpecker, dove) stay rare;
   - the wind comes in gusts with calm stretches between them;
   - footsteps grow softer during a long walk, and after some minutes everything settles a little;
   - the place decides the voices: frogs at the swamp, crickets and bees in the meadow, the brook and the
     waterfall only near the water;
   - in the den (indoors) a few garden birds are heard through the window, the old tree creaks now and then, a
     few crumbs of earth trickle from the roots, Fuchs' paws pad on the floor as he potters about and, asleep,
     he breathes slowly.

   step(now, env) returns the levels of the four steady layers and the single sounds to start.
   env: {indoors, sleeping, moving, speed, ground, trees, meadow, swamp, spruce, brook, falls, fallsPan, rain, fresh}. */

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
  robin: {phrases: [2, 4], gap: [3, 6], rest: 14},
  wren: {phrases: [1, 3], gap: [7.2, 10], rest: 20},
  blackcap: {phrases: [1, 3], gap: [4, 7.5], rest: 18},
  thrush: {phrases: [1, 2], gap: [3, 6], rest: 24},
  nuthatch: {phrases: [1, 2], gap: [5, 9], rest: 30},
  coalTit: {phrases: [2, 3], gap: [3, 6], rest: 16},
  goldcrest: {phrases: [1, 3], gap: [4, 7], rest: 18},
  jay: {phrases: [1, 1], gap: [0, 0], rest: 140, far: true},
  owl: {phrases: [1, 1], gap: [0, 0], rest: 65, far: true},
  frog: {phrases: [1, 3], gap: [3, 7], rest: 22},
  cricket: {phrases: [1, 2], gap: [5, 9], rest: 24},
  bee: {phrases: [1, 1], gap: [0, 0], rest: 70},
};
const OUTSIDE = {indoors: false, moving: false, speed: 0, ground: 'grass', trees: .8, meadow: 0, swamp: 0, spruce: 0, brook: 0, brookPan: 0, dusk: 0, falls: 0, fallsPan: 0, rock: 0, snow: 0, cave: 0};
/* How likely each voice is at a place. */
export function voicesAt(env) {
  if (env.cave > .8) return {};
  const night = env.sleeping ? 1 : (env.dusk || 0);
  if (night > .78) return {owl: env.indoors ? .5 : env.trees, frog: 6 * env.swamp || 0,
    cricket: (4 * env.meadow + env.swamp) * (1 - env.snow) || 0};
  if (env.indoors) return {blackbird: 2, robin: 1.5, greatTit: 1, dove: 1};
  // the birds of a Swiss mixed wood, by how common they are: chaffinch first; coal tit and goldcrest in the spruce
  const f = env.trees, sp = env.spruce || 0, broad = 1 - sp * .6, snowy = 1 - (env.snow || 0);
  return {chaffinch: 3.2 * f * (1 - sp * .3), blackbird: 2.6 * f + .4, robin: 2.4 * f + .2, wren: 1.9 * f, blackcap: 2 * f * broad, greatTit: 2 * f + .3, blueTit: 1.4 * f * broad + .1,
    thrush: 1.3 * f, nuthatch: 1.1 * f * broad, coalTit: 3 * sp * f, goldcrest: 2.4 * sp * f,
    dove: .9 * f, cuckoo: .3 * f, woodpecker: .45 * f * (1 - env.meadow), jay: .25 * f, frog: (5 + 3 * night) * env.swamp, cricket: (4 + 4 * night) * env.meadow * snowy, bee: 1.1 * env.meadow * snowy * (1 - (env.dusk || 0))};
}
export function createDirector({random = Math.random} = {}) {
  const range = (a, b) => a + (b - a) * random(), whole = (a, b) => Math.floor(range(a, b + 1));
  let start = null, last = 0, gust = .2, gustTo = .2, nextGust = 0, breezy = false, nextMood = 0;
  let nextSinger = 0, quietUntil = 0, lastKind = '', nextStep = 0, side = 1, walked = 0, wasMoving = false;
  let flutter = 1, nextFar = 0, nextKnock = 0, nextGustSound = 0, nextDrip = 0, nextCreak = 0, nextTrickle = 0, nextBreath = 0;
  const singers = [], sangAt = {};

  function chooseKind(now, env) {
    const w = voicesAt(env), varied = Object.values(w).filter(weight => weight > .02).length > 1; let total = 0; const open = [];
    for (const [kind, weight] of Object.entries(w)) { if (weight <= .02 || (kind === lastKind && varied) || now - (sangAt[kind] ?? -1e9) < SPECIES[kind].rest || singers.some(s => s.kind === kind)) continue; open.push([kind, weight]); total += weight; }
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
    const outside = 1 - env.cave;
    const exposed = env.indoors ? 0 : Math.max(env.rock, env.snow) * outside;
    const beds = {wind: exposed * (.16 + .84 * gust), grass: env.meadow * (.15 + gust) * outside,
      reeds: env.swamp * (.12 + gust) * outside, leaves: outside * cover * sstep(.3, 1, gust) * flutter, bright: clamp(.5 + .5 * env.meadow - .35 * env.spruce), brook: env.brook * outside, brookPan: env.brookPan, falls: env.falls * outside, fallsPan: env.fallsPan, gust};

    // birds and other voices
    const wetQuiet = (1 - .85 * (env.rain || 0)) * (1 - .8 * (env.cave || 0)), lively = Math.max(.05, settled * (1 - .48 * env.dusk) * (env.indoors ? (env.sleeping ? .2 : .4) : 1) * wetQuiet * (1 + .7 * (env.fresh || 0)));   // quiet in the rain, a burst of song after it
    if (now >= nextSinger && now >= quietUntil && singers.length < 2) {
      const kind = chooseKind(now, env);
      if (kind) { const sp = SPECIES[kind]; singers.push({kind, left: whole(...sp.phrases), next: now, pan: range(-.85, .85), far: sp.far ? range(.7, 1) : range(.15, .95)}); lastKind = kind; sangAt[kind] = now; }
      nextSinger = now + (kind ? range(5, 14) / lively : 2);
      if (kind && random() < .14) quietUntil = now + range(22, 42);
    }
    for (let i = singers.length - 1; i >= 0; i--) { const s = singers[i]; if (now < s.next) continue;
      if (!(voicesAt(env)[s.kind] > .02)) { singers.splice(i, 1); continue; }
      events.push({type: 'call', kind: s.kind, at: now + .05, pan: s.pan, far: s.far, level: settled}); sangAt[s.kind] = now;
      if (--s.left <= 0) singers.splice(i, 1); else s.next = now + range(...SPECIES[s.kind].gap); }

    // in the cave: water drips here and there, and every drip rings back from the rock
    if (!env.indoors && (env.cave || 0) > .3 && now >= nextDrip) { events.push({type: 'drip', at: now + .05, pan: range(-.7, .7), far: range(.1, .6), level: env.cave, lasts: 2.5}); nextDrip = now + range(.85, 3.7) / (1 + .7 * (env.storm || 0)); }
    // by the Rock the cliff throws a song back a moment later, softer and duller
    if (!env.indoors && env.rock > .25) for (const e of events) if (e.type === 'call' && !e.chorus) { e.echo = .4 * Math.min(1, env.rock * 1.4); e.echoDelay = range(.32, .5); }
    // a hollow knock now and then in the old wood (rare, never on a beat)
    if (!env.indoors && now >= nextKnock) { if (env.trees > .7 && (env.rain || 0) < .3 && nextKnock) events.push({type: 'hollow', at: now + .05, pan: range(-.8, .8), far: range(.4, .8), level: .8 * settled, lasts: 2.5}); nextKnock = now + range(35, 80); }
    // high on the peak: a gust of wind comes and goes (there is no steady wind sound)
    if (!env.indoors && (env.snow || 0) > .4 && now >= nextGustSound) { if (nextGustSound) events.push({type: 'gust', at: now + .05, pan: range(-.6, .6), far: 0, level: .9, lasts: 5}); nextGustSound = now + range(7, 16); }
    if ((env.snow || 0) <= .4 && nextGustSound > now + 3) nextGustSound = now + range(1.5, 4);

    // in the den: the old tree creaks, crumbs trickle from the roots (rare, never on a beat), and Fuchs breathes in his sleep
    if (env.indoors) {
      if (now >= nextCreak) { if (nextCreak) events.push({type: 'creak', near: true, at: now + .05, pan: range(-.6, .6), far: range(.2, .6), level: .9 * settled, lasts: 2}); nextCreak = now + range(28, 70); }
      if (now >= nextTrickle) { if (nextTrickle) events.push({type: 'trickle', near: true, at: now + .05, pan: range(-.8, .8), far: range(.1, .5), level: settled, lasts: 2}); nextTrickle = now + range(55, 130); }
      if (env.sleeping && now >= nextBreath) { events.push({type: 'breath', near: true, at: now + .05, pan: -.35, far: 0, level: 1, lasts: 4}); nextBreath = now + range(3.6, 4.4); }
    }
    if (!env.sleeping) nextBreath = Math.min(nextBreath, now + 1);

    // the chorus: birds further off, soft and often, so the wood is never empty (there is no wind or other steady sound)
    if (now >= nextFar && (env.rain || 0) < .5) { const w = voicesAt(env), kinds = Object.keys(w).filter(k => w[k] > .3 && !SPECIES[k].far && k !== 'dove' && k !== 'bee');
      if (kinds.length) events.push({type: 'call', chorus: true, kind: kinds[Math.floor(random() * kinds.length)], at: now + .05, pan: range(-1, 1), far: range(.8, 1), level: .6 * settled});
      nextFar = now + range(1.6, 5) / lively * (now < quietUntil ? 2 : 1); }

    // footsteps, in time with the walk, softer on a long walk
    if (env.moving && !env.sleeping) {
      if (!wasMoving) nextStep = now + .04; walked = Math.min(14, walked + dt);
      if (now >= nextStep) { const every = Math.PI / Math.max(4, env.speed * 3.2); side = -side; if (nextStep < now - .3) nextStep = now;
        // steps are planned a moment ahead, so they fall between two looks at the clock and keep their own rhythm
        events.push({type: 'step', ground: env.wade ? 'water' : env.ground, at: nextStep + .12, side, level: (1 - .45 * sstep(4, 14, walked)) * settled * (1 + .3 * (env.cave || 0)), cave: env.cave || 0});
        if (!env.wade && (env.ground === 'grass' || env.ground === 'needles') && random() < .012) events.push({type: 'twig', at: now + .03, level: settled});
        nextStep += every * range(.93, 1.07); }
    } else walked = Math.max(0, walked - dt * 3);
    wasMoving = env.moving && !env.sleeping;

    // the brook's bubbles and the swamp's plops
    if (beds.brook > .25 && !env.indoors) { let n = dt * (1.5 + 4.5 * env.brook) * env.brook; while (n > 0) { if (random() < n) events.push({type: 'bubble', at: now + random() * Math.max(dt, .05), level: env.brook, pan: clamp(env.brookPan * .75 + range(-.22, .22), -1, 1)}); n--; } }
    if (env.swamp > .4 && random() < dt * .06 * env.swamp) events.push({type: 'plop', at: now + .02, level: settled, pan: range(-.7, .7)});

    return {beds, events};
  }
  return {step, get singers() { return singers.length; }};
}
