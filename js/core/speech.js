/* On-demand German narration. Prefer a Swiss device voice for Swiss Standard
   German. Fixed instructions also have an offline recording of their exact text. */
(function () {
  'use strict';
  const FK = window.FK;
  const synth = window.speechSynthesis;
  let active = null, last = null;

  // Web Speech supplies names and languages but no standard gender field.
  const female = v => /\b(female|weiblich|anna|amelie|petra|helena|hedda|katja|amala|seraphina|ingrid|liesl|vicki|marlene|birgit|gunda|elke)(?:Neural)?\b/i.test(v?.name || '');
  function voice() {
    const voices = (synth?.getVoices() || []).filter(v =>
      /^de(?:[-_]|$)/i.test(v.lang) && (navigator.onLine !== false || v.localService !== false));
    function score(v) {
      let rating = /^de[-_]CH\b/i.test(v.lang) ? 8 : 0;
      if (/premium|enhanced|natural|neural|wavenet|studio|siri/i.test(v.name)) rating += 4;
      if (/compact|espeak|mbrola|festival|pico/i.test(v.name)) rating -= 6;
      return (female(v) ? 30 : 0) + rating + (v.localService ? 2 : 0) + (v.default ? .5 : 0);
    }
    return voices.sort((a, b) => score(b) - score(a))[0] || null;
  }
  // Some browsers only populate the installed voices after this first request.
  synth?.getVoices();

  function chunks(text) {
    if (text.length <= 220) return [text];
    const parts = [];
    let rest = text;
    while (rest.length > 200) {
      const start = rest.slice(0, 201);
      const ends = [...start.matchAll(/[.!?…][»“”"]?\s+|[,;:]\s+/g)];
      const boundary = ends.at(-1);
      const space = start.lastIndexOf(' ');
      const cut = boundary ? boundary.index + boundary[0].length : space > 0 ? space : 200;
      parts.push(rest.slice(0, cut).trimEnd());
      rest = rest.slice(cut).trimStart();
    }
    if (rest) parts.push(rest);
    return parts;
  }

  function notify(request, state) {
    const playing = state === 'playing';
    FK.emit('speech', {active: playing, state, text: request.text});
    request.onState?.(state);
  }

  function release(request) {
    clearTimeout(request.timer);
    if (request.audio) {
      request.audio.onplaying = request.audio.onended = request.audio.onerror = null;
      request.audio.pause();
      request.audio = null;
    }
    if (request.utterance) {
      request.utterance.onstart = request.utterance.onend = request.utterance.onerror = null;
      request.utterance = null;
      synth.cancel();
    }
  }
  function finish(request, state) {
    if (active !== request) return;
    active = null;
    release(request);
    notify(request, state);
  }
  function cancel() { if (active) finish(active, 'stopped'); }

  function say(text, options = {}) {
    if (FK.friendsLibrary?.active && !options.explicit) return false;
    const words = String(text || last?.text || '').trim();
    cancel();
    if (!words || document.hidden || (!options.explicit && FK.settings.get('sound') === false)) return false;
    const {speaker = 'narrator', mood, explicit = false, onState} = options;
    last = {text: words, options: {speaker, mood, explicit}};
    const request = {text: words, onState};
    active = request;
    const clip = typeof window.Audio === 'function' && FK.narrationClips?.get(words);
    const selected = voice();
    const native = !!(synth && window.SpeechSynthesisUtterance);
    let triedClip = false, triedNative = false;
    notify(request, 'loading');

    function failed() {
      if (active !== request) return;
      release(request);
      if (clip && !triedClip) playClip();
      else if (native && !triedNative) read();
      else finish(request, 'error');
    }
    function playClip() {
      triedClip = true;
      const audio = request.audio = new Audio('assets/audio/narration/' + clip + '.mp3');
      audio.onplaying = () => { if (request.audio === audio) notify(request, 'playing'); };
      audio.onended = () => { if (request.audio === audio) finish(request, 'ended'); };
      const fail = () => { if (request.audio === audio) failed(); };
      audio.onerror = fail;
      try { audio.play()?.catch(fail); } catch { fail(); }
    }
    function read() {
      triedNative = true;
      const parts = chunks(words);
      function next() {
        if (active !== request) return;
        const part = parts.shift();
        if (!part) { finish(request, 'ended'); return; }
        const u = request.utterance = new SpeechSynthesisUtterance(part);
        if (selected) u.voice = selected;
        u.lang = selected?.lang || 'de-CH';
        u.pitch = 1 + ({beaver: -.06, owl: -.07, hedgehog: -.02, hare: .05, kingfisher: .06, fox: .03}[speaker] || 0);
        u.rate = ['sad', 'longing', 'worried'].includes(mood) ? .86 : mood === 'excited' ? .97 : .92;
        u.onstart = () => {
          if (request.utterance !== u) return;
          clearTimeout(request.timer);
          notify(request, 'playing');
        };
        u.onend = () => {
          if (request.utterance !== u) return;
          clearTimeout(request.timer);
          request.utterance = null;
          next();
        };
        u.onerror = () => { if (request.utterance === u) failed(); };
        // A missing voice can leave speak() queued forever without an error.
        request.timer = setTimeout(() => { if (request.utterance === u) failed(); }, 4000);
        try { if (synth.paused) synth.resume(); synth.speak(u); } catch { failed(); }
      }
      next();
    }
    if (clip && (!native || !female(selected) ||
        /espeak|mbrola|festival|pico/i.test(selected.name))) playClip();
    else if (native) read();
    else finish(request, 'error');
    return active === request;
  }

  function explain(text, onState) {
    if (active?.text === text) { cancel(); return false; }
    return say(text, {explicit: true, onState});
  }
  FK.forestVoice = {say, explain, cancel, repeat: () => last ? say(last.text, last.options) : false,
    get playingClip() { return !!active?.audio && !active.audio.paused; },
    get available() { return !!(FK.narrationClips?.size || voice()); },
    get voiceName() { return voice()?.name || null; }};
  FK.on('settings', e => { if (e.key === 'sound' && !e.value) cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
})();
