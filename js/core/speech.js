/* Requested narration with the device's own German voice. Quality comes from choosing well: an enhanced, premium
   or natural voice is preferred (Swiss German first, then German), robotic engines are avoided, offline voices win
   when there is no network. The voice keeps its own pitch (only small differences between speakers, since stronger
   pitch shifts sound tinny), speaks at an easy pace and reads sentence by sentence, which sounds more natural and
   avoids browsers that cut long speech off. */
(function () {
  'use strict';
  const FK = window.FK;
  const synth = window.speechSynthesis;
  let last = '', current = null, chosen = null, queue = [];
  function score(v) {
    const lang = (v.lang || '').replace('_', '-').toLowerCase(), name = v.name || ''; if (!lang.startsWith('de')) return -Infinity;
    let s = lang === 'de-ch' ? 4 : lang === 'de-de' ? 3 : lang === 'de-at' ? 2.5 : 1;
    if (/premium|enhanced|natural|neural|wavenet|studio|siri/i.test(name)) s += 6;
    if (/google/i.test(name)) s += 3;
    if (/compact|espeak|e-speak|mbrola|festival|pico/i.test(name)) s -= 8;
    if (navigator.onLine === false && v.localService === false) s -= 20;   // an online voice is silent without network
    if (v.localService) s += .5;
    if (v.default) s += .3;
    return s;
  }
  function voice() {
    if (chosen && (navigator.onLine !== false || chosen.localService !== false)) return chosen;
    const voices = synth ? synth.getVoices() : [];
    chosen = voices.filter(v => score(v) > -Infinity).sort((a, b) => score(b) - score(a))[0] || null;
    return chosen;
  }
  if (synth && 'onvoiceschanged' in synth) synth.addEventListener?.('voiceschanged', () => { chosen = null; });
  window.addEventListener('online', () => { chosen = null; }); window.addEventListener('offline', () => { chosen = null; });
  // tidy text so the voice phrases it well: no dashes or symbols read aloud, every sentence ends
  function sentences(text) {
    const clean = String(text).replace(/\s+/g, ' ').replace(/\s[–—-]\s/g, ', ').replace(/[*_~#]/g, '').trim();
    const parts = clean.match(/[^.!?…]+[.!?…]+["“”«»']?|[^.!?…]+$/g) || [clean];
    return parts.map(p => p.trim()).filter(Boolean).map(p => /[.!?…]["“”«»']?$/.test(p) ? p : p + '.');
  }
  function stop() { queue = []; if (synth) synth.cancel(); current = null; }
  function cancel() { stop(); FK.emit('speech', {active: false}); }
  function say(text, options = {}) {
    if (FK.friendsLibrary?.active && !options.explicit) return false;
    last = text || last;
    stop();
    if (!last || !synth || !window.SpeechSynthesisUtterance || (!options.explicit && FK.settings.get('sound') === false) || document.hidden) { FK.emit('speech', {active: false}); return false; }
    const selected = voice();
    const pitch = 1 + ({beaver: -.06, owl: -.07, hedgehog: -.02, hare: .05, kingfisher: .06, fox: .03, narrator: 0}[options.speaker] ?? .02);
    const rate = ['sad', 'longing', 'worried'].includes(options.mood) ? .84 : options.mood === 'excited' ? .97 : .91;
    queue = sentences(last).map(part => { const u = new SpeechSynthesisUtterance(part); if (selected) u.voice = selected; u.lang = selected ? selected.lang : 'de-CH'; u.rate = rate; u.pitch = pitch; u.volume = 1; return u; });
    const next = () => {
      const u = queue.shift(); if (!u) { current = null; FK.emit('speech', {active: false}); return; }
      current = u; u.onend = () => { if (current === u) next(); }; u.onerror = () => { if (current === u) { queue = []; current = null; FK.emit('speech', {active: false}); } };
      try { if (synth.paused) synth.resume(); synth.speak(u); } catch (_) { queue = []; current = null; FK.emit('speech', {active: false}); }
    };
    try { FK.emit('speech', {active: true}); next(); return !!current; } catch (_) { current = null; return false; }
  }
  FK.forestVoice = {say, explain: text => say(text, {explicit: true}), cancel, repeat: () => say(last), get available() { return !!voice(); }, get voiceName() { return voice()?.name || null; }};
  FK.on('settings', e => { if (e.key === 'sound' && !e.value) cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
})();
