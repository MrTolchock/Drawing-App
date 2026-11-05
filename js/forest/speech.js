/* Local prototype narration uses the device's German voice when available. */
(function () {
  'use strict';
  const FK = window.FK;
  let last = '', current = null;
  const synth = window.speechSynthesis;
  function voice() {
    const voices = synth ? synth.getVoices() : [];
    return voices.find(v => /^de[-_]CH$/i.test(v.lang)) || voices.find(v => /^de/i.test(v.lang)) || null;
  }
  function cancel() { if (synth) synth.cancel(); current = null; }
  function say(text) {
    last = text || last;
    cancel();
    if (!last || !synth || !window.SpeechSynthesisUtterance || FK.settings.get('sound') === false || document.hidden) return false;
    const utterance = new SpeechSynthesisUtterance(last);
    const selected = voice();
    if (selected) utterance.voice = selected;
    utterance.lang = selected ? selected.lang : 'de-CH'; utterance.rate = 0.86; utterance.pitch = 1.08; utterance.volume = 0.95;
    current = utterance;
    utterance.onend = utterance.onerror = () => { if (current === utterance) current = null; };
    try { synth.speak(utterance); return true; } catch (_) { current = null; return false; }
  }
  FK.forestVoice = { say, cancel, repeat: () => say(last), get available() { return !!voice(); } };
  FK.on('settings', e => { if (e.key === 'sound' && !e.value) cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
})();
