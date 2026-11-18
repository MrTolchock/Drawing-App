const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function fixture(voices, online = true) {
  const events = [], spoken = [], clips = [];
  const window = {
    FK: {emit: (_, e) => events.push(e), on() {}, settings: {get: () => false}},
    speechSynthesis: {getVoices: () => voices, cancel() {}, speak: u => spoken.push(u)},
    SpeechSynthesisUtterance: class {constructor(text) { this.text = text; }},
    Audio: class {
      constructor(src) { this.src = src; clips.push(this); }
      play() { return Promise.resolve(); }
      pause() { this.paused = true; }
    }
  };
  const context = vm.createContext({...window, window, navigator: {onLine: online},
    document: {addEventListener() {}}, setTimeout, clearTimeout});
  for (const file of ['assets/audio/narration/clips.js', 'js/core/speech.js'])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
  return {voice: window.FK.forestVoice, rule: window.FK.narrationClips.keys().next().value, spoken, events, clips};
}

test('a Swiss voice can fail into the offline recording once, even if cancelled native callbacks arrive late', () => {
  const {voice, rule, spoken, clips, events} = fixture([{lang:'de-CH',name:'Anna',localService:true}]);
  assert.ok(voice.explain(rule));
  assert.equal(spoken[0].text, rule);
  const late = spoken[0].onend;
  spoken[0].onerror();
  const clip = clips[0];
  clip.onplaying();
  late();
  assert.equal(events.at(-1).state, 'playing');
  voice.explain(rule);
  assert.ok(clip.paused);
  assert.equal(events.at(-1).state, 'stopped');
  assert.equal(clips.length, 1);
});

test('offline rule playback bypasses a network-only voice, and repeat still works with game effects muted', () => {
  const {voice, rule, spoken, clips, events} = fixture([{lang:'de-CH',name:'Online',localService:false}], false);
  voice.explain(rule);
  clips[0].onended();
  assert.equal(events.at(-1).state, 'ended');
  assert.ok(voice.repeat());
  assert.equal(clips.length, 2);
  assert.equal(spoken.length, 0);
  voice.cancel();
});

test('long arbitrary text is read in order and cancel discards the remaining words', () => {
  const {voice, spoken, events} = fixture([]);
  const words = 'Unter den Tannen am Bach '.repeat(30).trim();
  voice.explain(words);
  for (let i=0; i<spoken.length; i++) {
    assert.ok(spoken[i].text.length <= 200);
    spoken[i].onend();
  }
  assert.equal(spoken.map(u=>u.text).join(' '), words);
  assert.equal(events.at(-1).state, 'ended');
  voice.repeat();
  const late = spoken.at(-1).onend, count = spoken.length;
  voice.cancel(); late();
  assert.equal(spoken.length, count);
  assert.equal(events.at(-1).state, 'stopped');
});

test('every current puzzle instruction has an exact recording in the installed game', () => {
  const root = path.join(__dirname, '..');
  const window = {FK:{}, FriendsContent:require('../js/friends/content.js')};
  const context = vm.createContext({window, location:{search:''}, URLSearchParams});
  for (const file of ['js/friends/puzzle-rounds.js', 'assets/audio/narration/clips.js'])
    vm.runInContext(fs.readFileSync(path.join(root, file),'utf8'), context);
  const worker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  for (const text of Object.values(window.FK.puzzleRounds.instructions))
    assert.ok(window.FK.narrationClips.has(text), 'Missing narration for '+text);
  for (const name of window.FK.narrationClips.values()) {
    const file = 'assets/audio/narration/'+name+'.mp3';
    assert.ok(fs.existsSync(path.join(root, file)) && worker.includes("'./"+file+"'"), file);
  }
});
