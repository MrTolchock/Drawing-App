/* Requested narration with the device's own German voice. Quality comes from choosing well: an enhanced, premium
   or natural voice is preferred (Swiss German first, then German), robotic engines are avoided, offline voices win
   when there is no network. The voice keeps its own pitch (only small differences between speakers, since stronger
   pitch shifts sound tinny) and speaks at an easy pace; long texts are read in groups of sentences, which avoids
   browsers that cut long speech off. */
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
  const german = () => (synth ? synth.getVoices() : []).filter(v => score(v) > -Infinity).sort((a, b) => score(b) - score(a));
  // an adult may pick the voice in Settings (FK.settings 'stimme', the voice's name); otherwise the best one is used
  function voice() {
    const wanted = FK.settings?.get('stimme');
    if (chosen && chosen.name === (wanted || chosen.name) && (navigator.onLine !== false || chosen.localService !== false)) return chosen;
    const list = german(); chosen = (wanted && list.find(v => v.name === wanted)) || list[0] || null;
    return chosen;
  }
  if (synth && 'onvoiceschanged' in synth) synth.addEventListener?.('voiceschanged', () => { chosen = null; });
  window.addEventListener('online', () => { chosen = null; }); window.addEventListener('offline', () => { chosen = null; });
  // A short text (every puzzle rule) is read as one utterance, exactly as written. A long one is tidied (no dashes or
  // symbols read aloud) and read in groups of whole sentences, which some browsers would otherwise cut off.
  function sentences(text) {
    const raw = String(text).trim(); if (raw.length <= 220) return [raw];
    const clean = raw.replace(/\s+/g, ' ').replace(/\s[–—-]\s/g, ', ').replace(/[*_~#]/g, '');
    const parts = (clean.match(/[^.!?…]+[.!?…]+["“”«»']?|[^.!?…]+$/g) || [clean]).map(p => p.trim()).filter(Boolean).map(p => /[.!?…]["“”«»']?$/.test(p) ? p : p + '.');
    const groups = []; for (const p of parts) { if (groups.length && (groups[groups.length - 1] + ' ' + p).length <= 200) groups[groups.length - 1] += ' ' + p; else groups.push(p); }
    return groups;
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
    queue = sentences(last).map(part => { const u = new SpeechSynthesisUtterance(part); if (selected) try { u.voice = selected; } catch (_) { /* the language below still applies */ } u.lang = selected ? selected.lang : 'de-CH'; u.rate = rate; u.pitch = pitch; u.volume = 1; return u; });
    const next = () => {
      const u = queue.shift(); if (!u) { current = null; FK.emit('speech', {active: false}); return; }
      current = u; u.onend = () => { if (current === u) next(); }; u.onerror = () => { if (current === u) { queue = []; current = null; FK.emit('speech', {active: false}); } };
      try { if (synth.paused) synth.resume(); synth.speak(u); } catch (_) { queue = []; current = null; FK.emit('speech', {active: false}); }
    };
    try { FK.emit('speech', {active: true}); next(); return !!current; } catch (_) { current = null; return false; }
  }
  /** The German voices on this device, best first: [{name, lang, quality}] (for the voice choice in Settings). */
  function voices() { return german().map(v => ({name: v.name, lang: v.lang, quality: /premium|enhanced|natural|neural|wavenet|studio|siri/i.test(v.name) ? 'hoch' : /compact|espeak/i.test(v.name) ? 'einfach' : ''})); }
  FK.forestVoice = {say, explain: text => say(text, {explicit: true}), cancel, repeat: () => say(last), voices, sample: () => say('Hallo, ich bin Fuchs. Komm, wir lesen zusammen den Brief.', {explicit: true, speaker: 'fox'}),
    get available() { return !!voice(); }, get voiceName() { return voice()?.name || null; }};
  if (synth) synth.addEventListener?.('voiceschanged', () => FK.emit?.('voices'));
  FK.on('settings', e => { if (e.key === 'stimme') chosen = null; });
  FK.on('settings', e => { if (e.key === 'sound' && !e.value) cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
})();
