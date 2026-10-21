/* Farbklecks – Klänge. Everything is synthesized with Web Audio; there are no sound files and no speech. */
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
  let lastTwinkle = 0;

  const enabled = () => !FK.settings || FK.settings.get('sound') !== false;

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
    master.gain.value = 0.75;
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
    if (!enabled()) return null;
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

  // Marimba-like note: sine plus a short, quiet overtone.
  function note(i, when) {
    const f = NOTES[Math.max(0, Math.min(NOTES.length - 1, i | 0))];
    tone(f, { dur: 0.45, vol: 0.26, when });
    tone(f * 4, { dur: 0.08, vol: 0.045, when });
  }

  FK.sound = {
    unlock,
    note,
    rainbow() { [0, 2, 4, 5, 7, 9].forEach((n, k) => note(n + 2, k * 0.055)); },
    tick() { tone(1400, { dur: 0.06, vol: 0.12, type: 'triangle' }); },
    open() { tone(520, { dur: 0.16, vol: 0.15, to: 880, type: 'triangle' }); },
    close() { tone(700, { dur: 0.14, vol: 0.11, to: 420, type: 'triangle' }); },
    pop() {
      tone(320, { dur: 0.12, vol: 0.3, to: 980 });
      noiseBurst({ dur: 0.06, vol: 0.08, f0: 3000, f1: 1500, q: 2 });
    },
    balloon() {
      noiseBurst({ dur: 0.12, vol: 0.4, f0: 5000, f1: 900, q: 0.7, type: 'highpass' });
      tone(900, { dur: 0.1, vol: 0.18, to: 300 });
    },
    blub() {
      tone(180, { dur: 0.28, vol: 0.28, to: 620 });
      tone(420, { dur: 0.16, vol: 0.15, to: 900, when: 0.12 });
      tone(600, { dur: 0.14, vol: 0.11, to: 1300, when: 0.22 });
    },
    swoosh() { noiseBurst({ dur: 0.45, vol: 0.3, f0: 3200, f1: 260, q: 0.9 }); },
    page() { noiseBurst({ dur: 0.25, vol: 0.18, f0: 1800, f1: 5000, q: 0.6 }); },
    undo() { tone(900, { dur: 0.18, vol: 0.17, to: 380, type: 'triangle' }); },
    nope() { tone(300, { dur: 0.12, vol: 0.13, type: 'square', to: 240 }); },
    // gentle "not quite": two soft low notes
    wrong() {
      tone(330, { dur: 0.16, vol: 0.16, type: 'triangle' });
      tone(262, { dur: 0.22, vol: 0.16, type: 'triangle', when: 0.13 });
    },
    // bright "yes!": three quick rising notes
    right() {
      note(7);
      note(9, 0.08);
      note(12, 0.16);
    },
    // rising "plip" for the n-th dot / syllable (n = 0, 1, 2 …)
    plip(n) { note(Math.min(17, 4 + (n | 0)), 0); },
    star() {
      [12, 14, 16].forEach((n, k) => note(n, k * 0.07));
      for (let k = 0; k < 4; k++) tone(2600 + Math.random() * 1600, { dur: 0.09, vol: 0.04, when: 0.2 + k * 0.05 });
    },
    click() {
      noiseBurst({ dur: 0.07, vol: 0.18, f0: 6000, f1: 2500, q: 3 });
      tone(1800, { dur: 0.05, vol: 0.08 });
    },
    tada() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => tone(f, { dur: 0.35, vol: 0.21, type: 'triangle', when: k * 0.09 }));
      tone(1567.98, { dur: 0.6, vol: 0.12, when: 0.38 });
      for (let k = 0; k < 6; k++) tone(2000 + Math.random() * 2000, { dur: 0.1, vol: 0.05, when: 0.45 + k * 0.06 });
    },
    // A longer fanfare for big wins (whole picture done by numbers, all letters …).
    fanfare() {
      const seq = [[523.25, 0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.36], [783.99, 0.52], [1046.5, 0.64]];
      seq.forEach(([f, w]) => {
        tone(f, { dur: 0.3, vol: 0.2, type: 'triangle', when: w });
        tone(f / 2, { dur: 0.3, vol: 0.1, type: 'sine', when: w });
      });
      for (let k = 0; k < 10; k++) tone(2200 + Math.random() * 2400, { dur: 0.1, vol: 0.045, when: 0.7 + k * 0.05 });
    },
    twinkle() {
      const now = performance.now();
      if (now - lastTwinkle < 70) return;
      lastTwinkle = now;
      tone(1800 + Math.random() * 1800, { dur: 0.12, vol: 0.05 });
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
      scribble = { s, g, vol: p.vol, kind };
      if (kind === 'spray') g.gain.setTargetAtTime(p.vol, c.currentTime, 0.03);
    },
    scribbleSpeed(v) {
      if (!scribble || !ac || scribble.kind === 'spray') return;
      const target = Math.min(1, v / 1.4) * scribble.vol + 0.0001;
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

  if (FK.on) FK.on('settings', (e) => { if (e.key === 'sound' && !e.value) FK.sound.scribbleStop(); });
})();
