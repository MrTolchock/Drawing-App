/* Farbtupf – Klänge. Everything is synthesized with Web Audio; there are no sound files and no speech. */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});

  // Pentatonic scale (C major), low to high. note(i) never sounds wrong next to another note.
  const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0,
    1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0, 2349.32, 2637.02];

  let ac = null;
  let master = null;
  let noise = null;
  let scribble = null;
  let speaking = false;
  let lastTwinkle = 0;

  const enabled = () => !FK.settings || FK.settings.get('sound') !== false;

  function mixLevel() {
    if (!enabled() || document.hidden) return 0;
    return speaking ? .22 : .66;
  }

  function updateMix() {
    if (master) master.gain.setTargetAtTime(mixLevel(), ac.currentTime, .035);
  }

  function ensure() {
    if (ac) return ac;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ac = new AC();
    } catch (e) {
      return null;
    }
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    master = ac.createGain();
    master.gain.value = mixLevel();
    master.connect(comp);
    comp.connect(ac.destination);
    const len = Math.floor(ac.sampleRate * 1.5);
    noise = ac.createBuffer(1, len, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return ac;
  }

  // iOS starts audio only from touchend/click. Called from those events (see app.js).
  function unlock() {
    const c = ensure();
    if (!c || c.state === 'running') return;
    c.resume().catch(() => {});
    try {
      const b = c.createBuffer(1, 1, 22050);
      const s = c.createBufferSource();
      s.buffer = b;
      s.connect(c.destination);
      s.start(0);
    } catch (e) { /* ignore */ }
  }

  function ready() {
    if (!enabled() || document.hidden) return null;
    const c = ensure();
    if (!c) return null;
    if (c.state !== 'running') c.resume().catch(() => {});
    return c;
  }

  function tone(freq, o) {
    o = o || {};
    const c = ready();
    if (!c) return;
    const dur = o.dur || 0.25;
    const t = c.currentTime + (o.when || 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur * 0.9);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.25, t + (o.attack || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function noiseBurst(o) {
    o = o || {};
    const c = ready();
    if (!c) return;
    const dur = o.dur || 0.3;
    const t = c.currentTime + (o.when || 0);
    const s = c.createBufferSource();
    s.buffer = noise;
    const f = c.createBiquadFilter();
    f.type = o.type || 'bandpass';
    f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f0 || 2000, t);
    f.frequency.exponentialRampToValueAtTime(o.f1 || 400, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  }

  // A muted wooden bar: the short, inharmonic attack dies before the body.
  function wood(f, when = 0, strength = 1, decay = .24) {
    const pitch = f * (.993 + Math.random() * .014);
    tone(pitch, {when, dur: decay, vol: .145 * strength, attack: .003});
    tone(pitch * 2.72, {when, dur: decay * .22, vol: .036 * strength, attack: .002});
    noiseBurst({when, dur: .037, vol: .046 * strength, f0: 1700, f1: 820, q: .65});
  }

  function note(i, when) {
    const pitch = NOTES[Math.max(0, Math.min(NOTES.length - 1, i | 0))];
    wood(pitch * .75, when);
  }

  function phrase(notes, spacing) {
    notes.forEach((n, i) => note(n, i * spacing));
  }

  function paper() {
    noiseBurst({dur: .16, vol: .13, f0: 1200, f1: 3200, q: .65});
    noiseBurst({when: .09, dur: .19, vol: .095, f0: 2700, f1: 680, q: .8});
  }

  function drop(f, when) {
    tone(f, {when, dur: .068, vol: .09, to: f * 1.55});
    noiseBurst({when, dur: .05, vol: .055, f0: 1600, f1: 740});
  }

  FK.sound = {
    unlock,
    note,
    rainbow() { phrase([0, 2, 4, 5, 7, 9], .075); },
    tick() { wood(510, 0, .58, .09); },
    open() { paper(); },
    close() { wood(295, 0, .7, .12); },
    pop() { drop(440, 0); },
    balloon() {
      noiseBurst({dur: .095, vol: .17, f0: 3100, f1: 950, q: .7});
      wood(245, 0, .55, .09);
    },
    blub() { drop(340, 0); drop(460, .12); drop(580, .21); },
    swoosh() { noiseBurst({dur: .33, vol: .17, f0: 2200, f1: 460, q: .65}); },
    page: paper,
    undo() { wood(410, 0, .8); wood(325, .105, .72); },
    nope() { wood(260, 0, .72, .16); },
    wrong() { phrase([3, 1], .14); },
    right() { phrase([4, 6, 9], .09); },
    plip(n) { note(Math.min(17, 4 + (n | 0)), 0); },
    star() { phrase([7, 9, 12], .09); },
    click() { wood(630, 0, .52, .07); },
    tada() { phrase([2, 4, 7, 9], .11); },
    fanfare() { phrase([0, 2, 4, 7, 5, 9], .13); },
    twinkle() {
      const now = performance.now();
      if (now - lastTwinkle < 130) return;
      lastTwinkle = now;
      wood(780 + Math.random() * 260, 0, .28, .14);
    },

    // Continuous soft scribble noise while drawing; volume follows finger speed.
    scribbleStart(kind) {
      const c = ready();
      if (!c || scribble) return;
      const presets = {
        filz: { type: 'bandpass', f: 1700, q: 0.7, vol: 0.09 },
        wachs: { type: 'bandpass', f: 3200, q: 0.6, vol: 0.12 },
        neon: { type: 'lowpass', f: 700, q: 6, vol: 0.12 },
        spray: { type: 'highpass', f: 4200, q: 0.5, vol: 0.1 },
        glitzer: { type: 'bandpass', f: 2600, q: 1.5, vol: 0.06 },
        shape: { type: 'bandpass', f: 1200, q: 2, vol: 0.05 },
        eraser: { type: 'bandpass', f: 900, q: 1.1, vol: 0.13 },
        trace: { type: 'bandpass', f: 2200, q: 1.2, vol: 0.07 },
      };
      const p = presets[kind] || presets.filz;
      const s = c.createBufferSource();
      s.buffer = noise;
      s.loop = true;
      const f = c.createBiquadFilter();
      f.type = p.type;
      f.frequency.value = p.f;
      f.Q.value = p.q;
      const g = c.createGain();
      g.gain.value = 0.0001;
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start();
      scribble = { s, g, filter: f, preset: p, kind };
      if (kind === 'spray') g.gain.setTargetAtTime(p.vol, c.currentTime, 0.03);
    },
    scribbleSpeed(v) {
      if (!scribble || !ac || scribble.kind === 'spray') return;
      const speed = Math.max(0, Math.min(1, v / 1.4));
      const target = speed * scribble.preset.vol + 0.0001;
      scribble.filter.frequency.setTargetAtTime(scribble.preset.f * (.7 + .45 * speed), ac.currentTime, .045);
      scribble.s.playbackRate.setTargetAtTime(.75 + .5 * speed, ac.currentTime, .06);
      scribble.g.gain.setTargetAtTime(target, ac.currentTime, 0.04);
    },
    scribbleStop() {
      if (!scribble || !ac) return;
      const s = scribble.s;
      const g = scribble.g;
      scribble = null;
      g.gain.setTargetAtTime(0.0001, ac.currentTime, 0.04);
      try { s.stop(ac.currentTime + 0.25); } catch (e) { /* already stopped */ }
    },
  };

  if (FK.on) {
    FK.on('settings', e => {
      if (e.key !== 'sound') return;
      if (!e.value) FK.sound.scribbleStop();
      updateMix();
    });
    FK.on('speech', e => { speaking = e.active; updateMix(); });
  }
  document.addEventListener('visibilitychange', updateMix);
})();
