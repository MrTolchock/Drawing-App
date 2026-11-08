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
  function cancel() { if (synth) synth.cancel(); current = null;FK.emit('speech',{active:false}); }
  function say(text,options={}) {
    if (FK.friendsLibrary?.active&&!options.explicit) return false;
    last = text || last;
    cancel();
    if (!last || !synth || !window.SpeechSynthesisUtterance || (!options.explicit&&FK.settings.get('sound') === false) || document.hidden) return false;
    const utterance = new SpeechSynthesisUtterance(last);
    const selected = voice();
    if (selected) utterance.voice = selected;
    const pitch={beaver:.88,hare:1.16,hedgehog:.98,owl:.86,kingfisher:1.2,fox:1.08,narrator:.96}[options.speaker]??1.08;
    utterance.lang = selected ? selected.lang : 'de-CH';utterance.rate=['sad','longing','worried'].includes(options.mood)?.79:options.mood==='excited'?.94:.86;
    utterance.pitch=pitch;utterance.volume=.95;
    current = utterance;
    utterance.onend = utterance.onerror = () => { if (current === utterance){current = null;FK.emit('speech',{active:false});} };
    try { synth.speak(utterance);FK.emit('speech',{active:true});return true; } catch (_) { current = null; return false; }
  }
  FK.forestVoice = { say, explain:text=>say(text,{explicit:true}), cancel, repeat: () => say(last), get available() { return !!voice(); } };
  FK.on('settings', e => { if (e.key === 'sound' && !e.value) cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
})();
