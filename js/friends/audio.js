/* Offline woodland sound, made in the browser (no recordings, nothing is fetched):
   three steady layers (leaves in the gusts, brook, waterfall; no constant wind, which sounded like noise) that follow the weather and the place, and single
   sounds on top: footsteps for each kind of ground, the birds of a Swiss wood (chaffinch, blackbird, robin, wren,
   blackcap, song thrush, great and blue tit, nuthatch; coal tit and goldcrest in the spruce; wood pigeon, and rarely
   cuckoo, woodpecker and jay), echoes off the Rock, a hollow knock in the old wood, gusts on the peak, frogs at the swamp, crickets and bees in the meadow, and bubbles in the brook. There is no music. js/friends/soundscape.js decides what plays when; this file only makes the sounds.
   Audio starts only after a gesture. There is no automatic speech or remote audio request.
   tests/audio-preview.html plays every sound by itself for listening. */
import {createDirector} from './soundscape.js';

const r = (a, b) => a + (b - a) * Math.random(), pick = list => list[Math.floor(Math.random() * list.length)];

/* ---------- building blocks ---------- */
export function makeNoise(ctx, colour, seconds) {
  const n = Math.floor(ctx.sampleRate * seconds), buffer = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) { const data = buffer.getChannelData(channel); let brown = 0;
    for (let i = 0; i < n; i++) { const white = Math.random() * 2 - 1; brown = (brown + white * .025) / 1.025; data[i] = colour === 'brown' ? brown * 3 : white * .35; }
    const fade = Math.floor(ctx.sampleRate * .04); for (let i = 0; i < fade; i++) data[i] = data[n - fade + i] * (1 - i / fade) + data[i] * (i / fade);   // seamless loop
  } return buffer;
}
const done = (...nodes) => () => nodes.forEach(n => n.disconnect());
// One sung or struck tone: glides from f to f1, soft start, soft end.
function tone(ctx, out, {t, dur, f, f1 = f, gain, type = 'sine', attack = .012, release = dur * .55, harm = 0}) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f1 !== f) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.setValueAtTime(gain, t + Math.max(attack, dur - release)); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .02); o.onended = done(o, g);
  if (harm) tone(ctx, out, {t, dur, f: f * 2, f1: f1 * 2, gain: gain * harm, attack, release});
  return t + dur;
}
// A short breath of filtered noise: rustle, thud, knock.
function hiss(ctx, out, noise, {t, dur, gain, type = 'bandpass', f, f1 = f, q = 1, attack = .004}) {
  const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise; fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t); if (f1 !== f) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(Math.max(gain * .02, .00002), t + dur); g.gain.linearRampToValueAtTime(0, t + dur + .012);
  s.connect(fl); fl.connect(g); g.connect(out); s.start(t, Math.random() * Math.max(.1, noise.duration - dur - .3), dur + .05); s.onended = done(s, fl, g);
  return t + dur;
}

// A sung syllable whose pitch follows a curve: `path` is [[fraction of the syllable, frequency], …]; a light
// vibrato and a rounded swell make it sound like a bird rather than a whistle.
function syllable(ctx, out, {t, dur, path, gain, vib = 0, attack = .006}) {
  const o = ctx.createOscillator(), g = ctx.createGain(), n = 24, curve = new Float32Array(n);
  for (let i = 0; i < n; i++) { const u = i / (n - 1); let k = 0; while (k < path.length - 2 && path[k + 1][0] < u) k++; const [u0, f0] = path[k], [u1, f1] = path[k + 1], e = Math.min(1, Math.max(0, (u - u0) / ((u1 - u0) || 1)));
    curve[i] = (f0 + (f1 - f0) * e * e * (3 - 2 * e)) * (1 + vib * Math.sin(u * dur * 70)); }
  o.frequency.setValueCurveAtTime(curve, t, dur); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + Math.min(attack, dur * .3)); g.gain.setTargetAtTime(0, t + dur * .55, dur * .18); g.gain.linearRampToValueAtTime(0, t + dur + .03);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05); o.onended = done(o, g); return t + dur;
}

/* ---------- voices: each sings one phrase starting at t and returns when it ends ---------- */
export const voices = {
  // Amsel: a few mellow flute notes, each bending a little, sometimes a soft twitter at the end
  blackbird(ctx, out, t) { const notes = [1568, 1760, 1976, 2093, 2349, 2637, 2794]; let i = Math.floor(r(1, 5));
    for (let k = Math.floor(r(3, 6)); k > 0; k--) { const f = notes[i] * r(.985, 1.015), dur = r(.17, .33); tone(ctx, out, {t, dur, f, f1: f * pick([.92, .96, 1.04, 1.09, 1.12]), gain: .075, attack: .03, release: dur * .5, harm: .22}); t += dur + r(.04, .1); i = Math.min(notes.length - 1, Math.max(0, i + pick([-2, -1, 1, 1, 2]))); }
    if (Math.random() < .4) for (let k = 0; k < 3; k++) { tone(ctx, out, {t, dur: .05, f: r(3300, 3900), f1: r(3600, 4200), gain: .022, attack: .008}); t += .075; }
    return t; },
  // Buchfink: a quick run downhill that ends in a flourish
  chaffinch(ctx, out, t) { const n = Math.floor(r(8, 13)), top = r(4000, 4500);
    for (let k = 0; k < n; k++) { const f = top * (2550 / top) ** (k / (n - 1)) * r(.985, 1.015), dur = .07 - k * .0018; tone(ctx, out, {t, dur, f, f1: f * .93, gain: .042, attack: .008}); t += .135 - k * .005; }
    tone(ctx, out, {t, dur: .09, f: 2600, f1: 3450, gain: .045, attack: .01}); return tone(ctx, out, {t: t + .09, dur: .13, f: 3450, f1: 2250, gain: .045, attack: .005}); },
  // Kohlmeise: two notes, see-saw
  greatTit(ctx, out, t) { const hi = r(3750, 4200), lo = hi * r(.76, .8);
    for (let k = Math.floor(r(3, 5)); k > 0; k--) { tone(ctx, out, {t, dur: .11, f: hi, f1: hi * .985, gain: .045, attack: .01}); tone(ctx, out, {t: t + .15, dur: .12, f: lo, f1: lo * .985, gain: .045, attack: .01}); t += r(.33, .37); }
    return t; },
  // Blaumeise: two or three thin notes and a little trill
  blueTit(ctx, out, t) { const f = r(4700, 5200);
    for (let k = Math.floor(r(2, 4)); k > 0; k--) { tone(ctx, out, {t, dur: .075, f, f1: f * .97, gain: .03, attack: .008}); t += .13; }
    const tr = f * r(.8, .86); for (let k = Math.floor(r(9, 15)); k > 0; k--) { tone(ctx, out, {t, dur: .03, f: tr, f1: tr * .97, gain: .026, attack: .005}); t += .046; }
    return t; },
  // Ringeltaube: five soft low coos
  dove(ctx, out, t) { const f = r(430, 480); for (const [dur, gap, up] of [[.3, .12, 1], [.52, .14, 1.07], [.3, .34, 1], [.28, .12, 1], [.3, 0, .97]]) { tone(ctx, out, {t, dur, f: f * up, f1: f * up * .95, gain: .1, attack: .07, release: dur * .6, harm: .08}); t += dur + gap; } return t; },
  // Kuckuck, far away: two notes, a third apart, two to four times
  cuckoo(ctx, out, t) { const f = r(640, 680); for (let k = Math.floor(r(2, 5)); k > 0; k--) { tone(ctx, out, {t, dur: .2, f, gain: .1, attack: .025, harm: .12}); tone(ctx, out, {t: t + .3, dur: .3, f: f * .8, gain: .1, attack: .025, harm: .12}); t += r(1.1, 1.25); } return t; },
  // Specht, far away: a short drum roll on a hollow trunk
  woodpecker(ctx, out, t, noise) { const n = Math.floor(r(11, 17)), f = r(900, 1300); for (let k = 0; k < n; k++) { const g = .11 * (1 - .55 * k / n); hiss(ctx, out, noise, {t, dur: .022, gain: g, f, q: 4, attack: .002}); tone(ctx, out, {t, dur: .02, f: f * .7, f1: f * .45, gain: g * .5, attack: .002}); t += .058 - k * .0012; } return t; },
  // Rotkehlchen: a wistful, tinkling phrase: thin high notes, little slurs and quick trills, wandering up and down
  robin(ctx, out, t) { for (let k = Math.floor(r(5, 10)); k > 0; k--) { const kind = Math.random();
      if (kind < .45) { const f = r(3200, 7200), dur = r(.06, .16); t = syllable(ctx, out, {t, dur, path: [[0, f], [1, f * pick([.7, .82, 1.18, 1.3])]], gain: .028}); }
      else if (kind < .75) { const f = r(4200, 6800); for (let j = Math.floor(r(3, 7)); j > 0; j--) t = syllable(ctx, out, {t, dur: .028, path: [[0, f], [1, f * .9]], gain: .022}) + .012; }
      else { const f = r(2600, 3600); t = syllable(ctx, out, {t, dur: r(.18, .3), path: [[0, f], [.5, f * 1.25], [1, f * .95]], gain: .03, vib: .012}); }
      t += r(.03, .09); } return t; },
  // Zaunkönig: tiny bird, big voice: a fast, bright tumble of notes and two rattling trills at different pitches
  wren(ctx, out, t) { for (let k = Math.floor(r(4, 8)); k > 0; k--) { const f = r(4500, 7500); t = syllable(ctx, out, {t, dur: .045, path: [[0, f], [1, f * r(.8, 1.15)]], gain: .036}) + .02; }
    for (const f of [r(4200, 5200), r(5600, 6600)]) { for (let j = Math.floor(r(10, 18)); j > 0; j--) t = syllable(ctx, out, {t, dur: .026, path: [[0, f * 1.08], [1, f * .9]], gain: .034}) + .018; t += .04; }
    return t; },
  // Mönchsgrasmücke: a soft chattering warble that breaks into a clear, loud flute phrase
  blackcap(ctx, out, t) { for (let k = Math.floor(r(8, 14)); k > 0; k--) { const f = r(2400, 5200); t = syllable(ctx, out, {t, dur: r(.035, .07), path: [[0, f], [1, f * r(.75, 1.3)]], gain: .016}) + .012; }
    const base = r(1700, 2100); for (const [m, d] of [[1, .14], [1.33, .12], [1.5, .2], [1.2, .14], [1.68, .26]].slice(0, Math.floor(r(3, 6)))) t = syllable(ctx, out, {t, dur: d, path: [[0, base * m * .96], [.4, base * m * 1.04], [1, base * m]], gain: .06, vib: .008}) + .035;
    return t; },
  // Singdrossel: each little motif is sung two to four times before the next
  thrush(ctx, out, t) { for (let m = Math.floor(r(2, 4)); m > 0; m--) { const notes = Array.from({length: Math.floor(r(1, 4))}, () => [r(2200, 4800), r(.07, .16), pick([.8, .95, 1.12, 1.25])]);
      for (let rep = Math.floor(r(2, 5)); rep > 0; rep--) { for (const [f, d, bend] of notes) t = syllable(ctx, out, {t, dur: d, path: [[0, f], [1, f * bend]], gain: .045, vib: .006}) + .025; t += .09; } t += r(.25, .45); } return t; },
  // Kleiber: loud rising whistles, tüi tüi tüi, or a quick wiwiwi
  nuthatch(ctx, out, t) { const fast = Math.random() < .35, f = fast ? r(2600, 3000) : r(1500, 1800);
    for (let k = Math.floor(fast ? r(10, 16) : r(4, 8)); k > 0; k--) t = syllable(ctx, out, {t, dur: fast ? .05 : .17, path: fast ? [[0, f], [1, f * 1.12]] : [[0, f], [.7, f * 1.45], [1, f * 1.5]], gain: .05}) + (fast ? .03 : .11);
    return t; },
  // Tannenmeise (in the spruce): a quick, high see-saw, sitüi sitüi, lighter than the great tit's
  coalTit(ctx, out, t) { const hi = r(6000, 6800), lo = hi * r(.68, .74); for (let k = Math.floor(r(3, 6)); k > 0; k--) { t = syllable(ctx, out, {t, dur: .07, path: [[0, hi], [1, hi * .96]], gain: .03}) + .02; t = syllable(ctx, out, {t, dur: .09, path: [[0, lo], [1, lo * 1.12]], gain: .03}) + .09; } return t; },
  // Wintergoldhähnchen (in the spruce): very high, very thin, si-si-sisi with a little flourish at the end
  goldcrest(ctx, out, t) { const f = r(7200, 7900); for (let k = Math.floor(r(5, 8)); k > 0; k--) { t = syllable(ctx, out, {t, dur: .05, path: [[0, f], [1, f * .9]], gain: .014}) + .02; t = syllable(ctx, out, {t, dur: .045, path: [[0, f * .82], [1, f * .78]], gain: .013}) + .045; }
    for (let k = 0; k < 4; k++) t = syllable(ctx, out, {t, dur: .04, path: [[0, f * (.7 + k * .08)], [1, f * (.78 + k * .08)]], gain: .014}) + .01; return t; },
  // Eichelhäher, now and then and far: a hoarse screech
  jay(ctx, out, t, noise) { for (let k = Math.floor(r(1, 3)); k > 0; k--) { for (let p = 0; p < 7; p++) hiss(ctx, out, noise, {t: t + p * .028, dur: .03, gain: .09 * (1 - p / 9), f: r(1700, 2400), q: 2.5, attack: .003}); t += .45; } return t; },
  // Frosch: two to four short, purring croaks
  frog(ctx, out, t) { const f = r(430, 560);
    for (let k = Math.floor(r(2, 5)); k > 0; k--) { const dur = r(.2, .3); for (let p = 0; p * .036 < dur; p++) tone(ctx, out, {t: t + p * .036, dur: .03, f: f * (1 + .25 * Math.sin(p * .5)), f1: f * .8, gain: .06, attack: .004, harm: .3}); t += dur + r(.16, .3); }
    return t; },
  // Grille: a soft, even chirping for a few seconds
  cricket(ctx, out, t) { const f = r(4100, 4600); for (let k = Math.floor(r(6, 12)); k > 0; k--) { for (let p = 0; p < 3; p++) tone(ctx, out, {t: t + p * .03, dur: .02, f, gain: .014, attack: .004}); t += r(.27, .31); } return t; },
  // Biene: a hum that passes by
  bee(ctx, out, t) { const f = r(150, 185), dur = r(1.4, 2.2), o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * r(.9, 1.12), t + dur);
    lp.type = 'lowpass'; lp.frequency.value = 700; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035, t + dur * .45); g.gain.linearRampToValueAtTime(0, t + dur); o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .02); o.onended = done(o, lp, g); return t + dur; },
};
/* One footstep on a kind of ground. */
export function footstep(ctx, out, noise, ground, t, level = 1) {
  const v = level * r(.75, 1.1), w = r(.88, 1.12);
  const thump = (f, gain, dur = .05) => tone(ctx, out, {t, dur, f, f1: f * .6, gain: gain * v, attack: .004});
  // (small loudspeakers carry little below 200 Hz, so a step is mostly its rustle; the thump only rounds it off)
  if (ground === 'wood') { tone(ctx, out, {t, dur: .09, f: 340 * w, f1: 285 * w, gain: .055 * v, attack: .003, harm: .2}); hiss(ctx, out, noise, {t, dur: .04, gain: .2 * v, f: 900 * w, q: 3}); }
  else if (ground === 'sticks') { hiss(ctx, out, noise, {t, dur: .045, gain: .32 * v, f: 1500 * w, q: 2.5}); hiss(ctx, out, noise, {t: t + .03, dur: .025, gain: .15 * v, f: 2600 * w, q: 2}); thump(210, .02); }
  else if (ground === 'earth') { hiss(ctx, out, noise, {t, dur: .06, gain: .17 * v, type: 'lowpass', f: 1300 * w}); hiss(ctx, out, noise, {t: t + .01, dur: .02, gain: .05 * v, f: 3200, q: 1}); thump(180, .035); }
  else if (ground === 'rock') { hiss(ctx, out, noise, {t, dur: .03, gain: .28 * v, f: 2100 * w, q: 2}); thump(240, .015, .03); }
  else if (ground === 'wet') { hiss(ctx, out, noise, {t, dur: .12, gain: .2 * v, type: 'lowpass', f: 1250 * w, f1: 450, attack: .012}); tone(ctx, out, {t: t + .05, dur: .05, f: 420 * w, f1: 760 * w, gain: .02 * v, attack: .006}); }
  else if (ground === 'snow') { hiss(ctx, out, noise, {t, dur: .11, gain: .2 * v, type: 'lowpass', f: 2100 * w, f1: 900, attack: .012}); hiss(ctx, out, noise, {t: t + .035, dur: .05, gain: .09 * v, f: 3400 * w, q: 1.2, attack: .008}); }   // a soft crunch
  else if (ground === 'meadow') { hiss(ctx, out, noise, {t, dur: .12, gain: .17 * v, f: 3100 * w, q: .6, attack: .02}); thump(190, .012); }
  else if (ground === 'needles') { hiss(ctx, out, noise, {t, dur: .085, gain: .2 * v, f: 1400 * w, q: .7, attack: .008}); thump(185, .02); }
  else { hiss(ctx, out, noise, {t, dur: .075, gain: .2 * v, f: 2400 * w, q: .8, attack: .006}); thump(195, .016); }   // grass
}
export const details = {
  // a hollow knock somewhere in the old wood (a branch, a woodpecker's single blow)
  hollow(ctx, out, noise, t, level = 1) { for (let k = Math.floor(r(1, 4)); k > 0; k--) { const f = r(220, 320); tone(ctx, out, {t, dur: .09, f, f1: f * .85, gain: .07 * level, attack: .002, harm: .5}); hiss(ctx, out, noise, {t, dur: .02, gain: .05 * level, f: 1600, q: 1.5}); t += r(.28, .5); } },
  // wind high on the peak: one gust that swells and dies away (there is no steady wind)
  gust(ctx, out, noise, t, level = 1) { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), dur = r(2.6, 4.2); s.buffer = noise; f.type = 'bandpass'; f.Q.value = .6;
    f.frequency.setValueAtTime(380, t); f.frequency.linearRampToValueAtTime(r(800, 1100), t + dur * .45); f.frequency.linearRampToValueAtTime(420, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16 * level, t + dur * .4); g.gain.linearRampToValueAtTime(.05 * level, t + dur * .7); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * Math.max(.1, noise.duration - dur - .3), dur + .1); s.onended = done(s, f, g); },
  // the mailman's whistle when a new letter is ready: a short note and a long rising one, a little off-key
  whistle(ctx, out, noise, t, level = 1) { const f = r(1650, 1800); syllable(ctx, out, {t, dur: .16, path: [[0, f * .9], [.6, f * 1.05], [1, f]], gain: .08 * level, vib: .004}); syllable(ctx, out, {t: t + .24, dur: .5, path: [[0, f], [.35, f * 1.33], [1, f * 1.38]], gain: .085 * level, vib: .01}); },
  // one-off sounds for what Fuchs does at the things to discover (forest3d.js `react`)
  sniff(ctx, out, noise, t, level = 1) { for (let k = 0; k < 4; k++) hiss(ctx, out, noise, {t: t + k * r(.11, .15), dur: r(.05, .08), gain: .1 * level, f: r(3200, 4200), q: 1.2, attack: .008}); },
  knock(ctx, out, noise, t, level = 1) { for (let k = 0; k < 2; k++) { const f = r(150, 175); tone(ctx, out, {t: t + k * .2, dur: .22, f, f1: f * .82, gain: .09 * level, attack: .002, harm: .45}); hiss(ctx, out, noise, {t: t + k * .2, dur: .03, gain: .05 * level, type: 'lowpass', f: 900}); } },
  crackle(ctx, out, noise, t, level = 1) { for (let k = 0; k < 14; k++) hiss(ctx, out, noise, {t: t + Math.random() * 2.6, dur: r(.006, .02), gain: r(.04, .12) * level, f: r(1500, 5200), q: r(.8, 2.5), attack: .001}); },
  // a little call down the well that comes back three times, each softer and duller
  echo(ctx, out, noise, t, level = 1) { const call = (at, g, bright) => { tone(ctx, out, {t: at, dur: .2, f: 620 * bright, f1: 760 * bright, gain: g, attack: .02, harm: .3}); tone(ctx, out, {t: at + .22, dur: .28, f: 760 * bright, f1: 560 * bright, gain: g, attack: .02, harm: .3}); };
    call(t, .07 * level, 1); for (let k = 1; k <= 3; k++) call(t + k * .55, .07 * level * Math.pow(.42, k), 1 - k * .03); },
  twig(ctx, out, noise, t, level) { for (let k = 0; k < 2 + (Math.random() < .5); k++) hiss(ctx, out, noise, {t: t + k * r(.025, .05), dur: .016, gain: .2 * level * r(.6, 1), f: 2600, q: .7, attack: .001}); },
  bubble(ctx, out, noise, t, level) { const f = r(480, 1500), dur = r(.035, .09); tone(ctx, out, {t, dur, f, f1: f * r(1.4, 2.1), gain: r(.008, .026) * level, attack: .006}); },
  plop(ctx, out, noise, t, level) { const f = r(260, 420); tone(ctx, out, {t, dur: .09, f, f1: f * 2.2, gain: .05 * level, attack: .006}); hiss(ctx, out, noise, {t: t + .02, dur: .08, gain: .02 * level, type: 'lowpass', f: 1200, f1: 500}); },
};
/* ---------- the game's sound ---------- */
export function createAudio(settings, environment = () => null) {
  let ctx, ambience, room, analyser, timer, area = 'den', speaking = false, birdCalls = 0, steps = 0, noise, beds = null, director;
  const sources = [];
  function gain(node, value) { node.gain.cancelScheduledValues(ctx.currentTime); if (document.hidden) node.gain.setValueAtTime(0, ctx.currentTime); else node.gain.setTargetAtTime(value, ctx.currentTime, .3); }
  function update() { if (!ctx || ctx.state === 'closed') return; const s = settings(), audible = !document.hidden;
    gain(ambience, s.ambience && audible ? (area === 'forest' ? 1.4 : .6) * (speaking ? .3 : 1) : 0);
    room.frequency.setTargetAtTime(area === 'forest' ? 16000 : 750, ctx.currentTime, .35); }                // in the den the wood is heard through the wall
  const loop = (buffer, rate) => { const s = ctx.createBufferSource(); s.buffer = buffer; s.loop = true; s.playbackRate.value = rate; s.start(0, Math.random() * buffer.duration); sources.push(s); return s; };
  const filter = (type, frequency, q = .5) => { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = frequency; f.Q.value = q; return f; };
  const level = (value = 0) => { const g = ctx.createGain(); g.gain.value = value; return g; };
  const chain = (...nodes) => { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes; };
  function buildBeds(brown, white) {
    const leaves = {tone: filter('bandpass', 3400, .5), out: level()}; chain(loop(white, .87), filter('highpass', 1500, .4), leaves.tone, leaves.out, room);
    const brook = {bands: [[700, 2.2, 1], [1750, 1.6, .7], [2900, 1.2, .35]].map(([f, q, g]) => ({f, node: filter('bandpass', f, q), g: level(g)})), out: level()}, water = loop(white, 1.19);
    for (const b of brook.bands) chain(water, b.node, b.g, brook.out); brook.out.connect(room);
    const falls = {out: level(), pan: ctx.createStereoPanner?.()}; chain(loop(white, .71), filter('lowpass', 2600, .3), falls.out); chain(loop(brown, 1.31), filter('lowpass', 520, .3), level(1.6), falls.out); if (falls.pan) chain(falls.out, falls.pan, room); else falls.out.connect(room);
    // rain: a very soft, warm hush underneath (no bright noise), the patter itself is single drops (rainDrops)
    const rain = {out: level(), pans: [-.7, 0, .7].map(v => { const p = ctx.createStereoPanner?.(), g = level(1); if (p) { p.pan.value = v; chain(g, p, room); } else g.connect(room); return g; })};
    chain(loop(white, .63), filter('lowpass', 1100, .3), filter('highpass', 280, .3), rain.out, room);
    return {leaves, brook, falls, rain};
  }
  function setBeds(b) { const t = ctx.currentTime, to = (param, value, tc = .5) => param.setTargetAtTime(value, t, tc); to(beds.rain.out.gain, .055 * rainNow ** 1.4, 1.5);
    to(beds.leaves.out.gain, .11 * b.leaves, .22); to(beds.leaves.tone.frequency, 2500 + 1900 * b.bright, 1.5);
    to(beds.brook.out.gain, .5 * b.brook ** 1.5, .5); for (const band of beds.brook.bands) to(band.node.frequency, band.f * r(.84, 1.18), .12);   // the bands wander: babbling
    to(beds.falls.out.gain, .17 * b.falls ** 1.7, .6); if (beds.falls.pan) to(beds.falls.pan.pan, b.fallsPan * .7, .6);
  }
  // A place in the wood for one voice: further away is quieter and duller.
  function place(pan, far, lasts) { const g = level(1.1 * (1 - .68 * far)), lp = filter('lowpass', 9500 - 6000 * far, .3), p = ctx.createStereoPanner?.(); if (p) { p.pan.value = pan; chain(g, lp, p, room); } else chain(g, lp, room);
    setTimeout(() => { g.disconnect(); lp.disconnect(); p?.disconnect(); }, (lasts + 1) * 1000); return g; }
  function play(e) { const t = Math.max(e.at, ctx.currentTime + .01);
    if (e.type === 'call') { const out = level(e.level), end = voices[e.kind](ctx, out, t, noise); out.connect(place(e.pan, e.far, end - ctx.currentTime)); setTimeout(() => out.disconnect(), (end - ctx.currentTime + 2) * 1000); birdCalls++;
      // by the Rock: the same phrase comes back off the cliff, later, softer, duller and from the other side
      if (e.echo) { const d = ctx.createDelay(1), lp = filter('lowpass', 2400, .4), g = level(e.echo); d.delayTime.value = e.echoDelay || .4; chain(out, d, lp, g, place(-e.pan * .6, 1, end - ctx.currentTime + 1)); setTimeout(() => { d.disconnect(); lp.disconnect(); g.disconnect(); }, (end - ctx.currentTime + 2) * 1000); } }
    else if (e.type === 'step') { footstep(ctx, place(e.side * .07, 0, .4), noise, e.ground, t, e.level * .3); steps++; /* steps stay well under the birds and the water */ }
    else details[e.type]?.(ctx, place(e.pan || 0, e.far ?? .2, e.lasts || 1.5), noise, t, e.level);
  }
  /* The patter: single drops on leaves (short, bright, each a little different), now and then a heavier drip
     from a branch. Up to about thirty a second in a full shower, scattered left, centre and right. */
  let rainNow = 0;
  function rainDrops(rain, span) {
    if (rain < .02) return; const t0 = ctx.currentTime + .02;
    for (let n = Math.floor(rain * 30 * span + Math.random()); n > 0; n--) { const t = t0 + Math.random() * span, bus = beds.rain.pans[Math.floor(Math.random() * 3)], v = (.25 + .75 * Math.random()) * rain;
      if (Math.random() < .07) { const f = r(700, 1300); tone(ctx, bus, {t, dur: .06, f, f1: f * r(1.5, 2.2), gain: .03 * v, attack: .004}); }
      else hiss(ctx, bus, noise, {t, dur: r(.008, .02), gain: .07 * v, f: r(2200, 6500), q: r(1.5, 4), attack: .001}); }
  }
  function tick() {
    if (!ctx || document.hidden || ctx.state !== 'running') return; const s = settings();
    const here = environment() || {}, {beds: b, events} = director.step(ctx.currentTime, {...here, indoors: area !== 'forest'});
    rainNow = here.rain || 0; if (!s.ambience) return;
    setBeds(b); for (const e of events) play(e); rainDrops(rainNow, .1);
    if (here.cues?.length) for (const c of here.cues.splice(0)) details[c.type]?.(ctx, place(c.pan || 0, 0, 3.5), noise, ctx.currentTime + .02, c.level ?? 1);
  }
  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return; }
    const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio || document.hidden) return;
    try {
      ctx = new Audio(); const master = ctx.createGain(), limiter = ctx.createDynamicsCompressor(); master.gain.value = .55; limiter.threshold.value = -14; limiter.ratio.value = 6; limiter.attack.value = .004; limiter.release.value = .25;
      analyser = ctx.createAnalyser(); analyser.fftSize = 1024; chain(master, limiter, analyser, ctx.destination);
      ambience = ctx.createGain(); ambience.gain.value = 0; ambience.connect(master);
      room = filter('lowpass', 750, .3); room.connect(ambience);
      noise = makeNoise(ctx, 'white', 5); beds = buildBeds(makeNoise(ctx, 'brown', 7), noise); director = createDirector();
      timer = setInterval(tick, 100); update(); ctx.resume().catch(() => {});
    } catch { ctx?.close().catch(() => {}); ctx = null; }
  }
  const key = e => { if (e.key === 'Enter' || e.key === ' ') unlock(); };
  const visibility = () => { update(); if (document.hidden) window.FK.forestVoice.cancel(); };
  document.addEventListener('pointerdown', unlock, {passive: true}); document.addEventListener('keydown', key); document.addEventListener('visibilitychange', visibility);
  const offSettings = window.FK.on('friends-audio', () => { unlock(); update(); }), offSpeech = window.FK.on('speech', event => { speaking = event.active; update(); });
  return {unlock, update, setArea(value) { area = value; update(); },
    get diagnostics() { const data = new Float32Array(analyser?.fftSize || 0); analyser?.getFloatTimeDomainData(data);
      return {state: ctx?.state || 'locked', area, layers: beds ? Object.keys(beds).length : 0, birdCalls, steps, audible: !!ambience && ambience.gain.value > .01, ambience: settings().ambience, rms: data.length ? Math.sqrt(data.reduce((n, v) => n + v * v, 0) / data.length) : 0}; },
    dispose() { clearInterval(timer); offSettings(); offSpeech(); document.removeEventListener('pointerdown', unlock); document.removeEventListener('keydown', key); document.removeEventListener('visibilitychange', visibility); sources.forEach(s => s.stop()); ctx?.close(); }
  };
}
