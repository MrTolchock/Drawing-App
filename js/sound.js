/* Farbklecks – Klänge (Web Audio, alles synthetisch) und Vorlesen (Sprachausgabe). */
(function () {
  'use strict';
  const FK = (window.FK = window.FK || {});

  // Pentatonic scale (C major), one note per pencil, from low to high.
  const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0,
    1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0];

  let ac = null;
  let master = null;
  let noise = null;
  let enabled = true;
  let scribble = null;
  let lastTwinkle = 0;

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

  // iOS only lets audio start inside a user gesture: call this from the first touch.
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
    if (!enabled) return null;
    const c = ensure();
    if (!c) return null;
    if (c.state !== 'running') c.resume().catch(() => {});
    return c;
  }

  function tone(freq, { type = 'sine', dur = 0.25, vol = 0.25, when = 0, to = 0, attack = 0.006 } = {}) {
    const c = ready();
    if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.9);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function noiseBurst({ dur = 0.3, vol = 0.2, f0 = 2000, f1 = 400, q = 1, type = 'bandpass', when = 0 } = {}) {
    const c = ready();
    if (!c) return;
    const t = c.currentTime + when;
    const s = c.createBufferSource();
    s.buffer = noise;
    const f = c.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  }

  // Marimba-like note: sine plus a short, quiet overtone.
  function note(i) {
    const f = NOTES[Math.max(0, Math.min(NOTES.length - 1, i))];
    tone(f, { dur: 0.45, vol: 0.28 });
    tone(f * 4, { dur: 0.08, vol: 0.05 });
  }

  const S = {
    unlock,
    get enabled() { return enabled; },
    set enabled(v) {
      enabled = !!v;
      if (!enabled) S.scribbleStop();
    },

    note,
    rainbow() {
      [0, 2, 4, 5, 7, 9].forEach((n, k) => setTimeout(() => note(n + 2), k * 55));
    },
    tick() { tone(1400, { dur: 0.06, vol: 0.12, type: 'triangle' }); },
    open() { tone(520, { dur: 0.16, vol: 0.16, to: 880, type: 'triangle' }); },
    close() { tone(700, { dur: 0.14, vol: 0.12, to: 420, type: 'triangle' }); },
    pop() {
      tone(320, { dur: 0.12, vol: 0.32, to: 980 });
      noiseBurst({ dur: 0.06, vol: 0.08, f0: 3000, f1: 1500, q: 2 });
    },
    blub() {
      tone(180, { dur: 0.28, vol: 0.3, to: 620 });
      tone(420, { dur: 0.16, vol: 0.16, to: 900, when: 0.12 });
      tone(600, { dur: 0.14, vol: 0.12, to: 1300, when: 0.22 });
    },
    swoosh() { noiseBurst({ dur: 0.45, vol: 0.32, f0: 3200, f1: 260, q: 0.9 }); },
    undo() {
      tone(900, { dur: 0.18, vol: 0.18, to: 380, type: 'triangle' });
    },
    nope() {
      tone(300, { dur: 0.12, vol: 0.14, type: 'square', to: 240 });
    },
    click() {
      noiseBurst({ dur: 0.07, vol: 0.18, f0: 6000, f1: 2500, q: 3, type: 'bandpass' });
      tone(1800, { dur: 0.05, vol: 0.08 });
    },
    tada() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => {
        tone(f, { dur: 0.35, vol: 0.22, type: 'triangle', when: k * 0.09 });
      });
      tone(1567.98, { dur: 0.6, vol: 0.12, when: 0.38 });
      for (let k = 0; k < 6; k++) tone(2000 + Math.random() * 2000, { dur: 0.1, vol: 0.05, when: 0.45 + k * 0.06 });
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
      if (!scribble || !ac) return;
      if (scribble.kind === 'spray') return;
      const target = Math.min(1, v / 1.4) * scribble.vol + 0.0001;
      scribble.g.gain.setTargetAtTime(target, ac.currentTime, 0.04);
    },
    scribbleStop() {
      if (!scribble || !ac) return;
      const { s, g } = scribble;
      scribble = null;
      g.gain.setTargetAtTime(0.0001, ac.currentTime, 0.04);
      try { s.stop(ac.currentTime + 0.25); } catch (e) { /* already stopped */ }
    },
  };

  FK.sound = S;

  /* ---------- Vorlesen ---------- */
  let voiceOn = true;
  let voice = null;
  let speakTimer = 0;
  const synth = window.speechSynthesis;

  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices() || [];
    const de = vs.filter((v) => /^de/i.test(v.lang));
    voice =
      de.find((v) => /de[-_]CH/i.test(v.lang)) ||
      de.find((v) => /Anna|Helena|Petra|Marlene|Sandy|Shelley/i.test(v.name)) ||
      de.find((v) => /de[-_]DE/i.test(v.lang)) ||
      de[0] || null;
  }
  if (synth) {
    pickVoice();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', pickVoice);
    else synth.onvoiceschanged = pickVoice;
  }

  FK.voice = {
    get enabled() { return voiceOn; },
    set enabled(v) {
      voiceOn = !!v;
      if (!voiceOn && synth) synth.cancel();
    },
    say(text) {
      if (!voiceOn || !synth || !text) return;
      const speak = () => {
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = voice ? voice.lang : 'de-CH';
          if (voice) u.voice = voice;
          u.rate = 1;
          u.pitch = 1.15;
          u.volume = 1;
          synth.speak(u);
        } catch (e) { /* ignore */ }
      };
      clearTimeout(speakTimer);
      if (synth.speaking || synth.pending) {
        synth.cancel();
        // Safari drops an utterance queued in the same tick as cancel().
        speakTimer = setTimeout(speak, 60);
      } else {
        speak();
      }
    },
  };
})();
