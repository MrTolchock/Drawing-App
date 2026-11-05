/* A story adapter for the existing flat Waldschatz game and its shared board. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, model = FK.forestState, art = FK.forestArt, voice = FK.forestVoice;
  let QUEST = model.REST;
  let root, body, demonstrating = false, active = false;
  const button = (label, children, fn, cls = '') => h('button', { type: 'button', class: 'forest-button ' + cls, 'aria-label': label, onclick: fn }, children);
  function returnToForest() { FK.forestActivity.leave(QUEST); }
  function prompt() {
    const a = model.getActivity(QUEST);
    if (!demonstrating && a?.finished) { voice.say(FK.forestActivity.backLabel(QUEST) + '.'); return; }
    voice.say(demonstrating ? 'Schau dir die Dinge an. Tippe auf den Korb. Ein Ding fehlt. Die Hand zeigt es dir. Danach bist du dran.' :
      a?.answered ? 'Gefunden! Tippe auf den Pfeil.' : a?.concealed ? 'Ein Ding fehlt. Welches war vorher auch dabei? Du kannst mit dem Auge nochmals schauen.' :
        'Schau dir die drei Dinge an. Wenn du bereit bist, tippe auf den Korb.');
  }
  function ensureQuestion() {
    const a = model.getActivity(QUEST);
    if (a && !a.finished && !a.question) model.question(FK.expeditions.question('treasure', 1, a.round, Math.random, 0, 'swiss-woodland'), null, QUEST);
    return model.getActivity(QUEST);
  }
  function demonstrate() {
    if (!active) return;
    demonstrating = true;
    const live = ensureQuestion(), pool = FK.expeditions.woodlandTreasures;
    // The worked example never cues the live answer, even when help is replayed.
    const example = pool.filter(o => o.name !== live?.question?.answer).slice(0, 3);
    const sample = { objects: example, choices: example.slice().reverse(), missing: 0, answer: example[0].name };
    const board = FK.ui.memoryBoard({ question: sample, pictured: true, demonstration: true,
      onToggle: hidden => voice.say(hidden ? 'Die Hand zeigt das fehlende Ding. Tippe darauf.' : 'Schau dir die drei Dinge an. Tippe dann auf den Korb.'),
      onChoice: (_, correct) => { if (correct) { FK.sound.right(); voice.say('Genau! Jetzt bist du dran.'); } } });
    body.replaceChildren(h('section', { class: 'forest-demo forest-memory-demo' }, h('h2', { text: 'Schau, so geht’s.' }), board,
      button('Jetzt selber probieren', h('span', {}, art.icon('play'), h('span', { text: 'Jetzt du' })), () => { model.demoSeen(QUEST); draw(); }, 'forest-primary')));
    prompt();
  }
  function draw() {
    demonstrating = false;
    const a = ensureQuestion(); if (!a) { returnToForest(); return; } if (a.finished) { finish(); return; }
    const next = button(a.round === 4 ? 'Zum Ergebnis' : 'Nächster Waldschatz', art.icon('arrow'), () => {
      if (!model.getActivity(QUEST)?.answered) return;
      if (model.advance(QUEST)) finish(); else draw();
    }, 'learn-next'); next.hidden = !a.answered;
    const feedback = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: a.answered ? 'Gefunden!' : '' });
    const board = FK.ui.memoryBoard({ question: a.question, pictured: true, concealed: a.concealed, answered: a.answered,
      onToggle: concealed => { model.conceal(concealed, QUEST); FK.sound.tick(); prompt(); },
      onChoice: (value, correct) => {
        if (!correct) { FK.sound.undo(); feedback.textContent = 'Schau nochmals hin.'; voice.say('Schau nochmals hin. Mit dem Auge kannst du die Dinge wieder ansehen.'); return; }
        model.answer(value, QUEST); FK.sound.right(); feedback.textContent = 'Gefunden!'; next.hidden = false; prompt();
      } });
    body.replaceChildren(h('div', { class: 'learn-progress', 'aria-label': a.round + ' von 5 geschafft', text: '⭐'.repeat(a.round) + '☆'.repeat(5 - a.round) }),
      h('h2', { class: 'learn-prompt', text: 'Was fehlt?' }), board, feedback, next); body.scrollTop = 0; prompt();
  }
  function finish() { demonstrating = false; FK.forestActivity.finish(body, QUEST); }
  FK.screen('forest-memory', {
    build(element) {
      root = element; root.classList.add('forest-activity');
      const bar = FK.ui.topbar({ title: 'Für den Igel', onBack: returnToForest });
      const back = bar.querySelector('.btn-back'); back.replaceChildren(art.scenePicture(false, 'hedgehog')); back.setAttribute('aria-label', 'Zurück zum Igel');
      bar.append(h('div', { class: 'forest-learning-controls' }, button('Aufgabe nochmals hören', art.icon('speaker'), prompt), button('Beispiel nochmals zeigen', art.icon('hand'), demonstrate)));
      body = h('div', { class: 'learn-body scroll' }); root.append(bar, body);
    },
    enter(params) {
      QUEST = params.quest || model.REST;
      if (model.definition(QUEST)?.game !== 'treasure') { FK.go('forest'); return; }
      FK.forestActivity.prepare(root, QUEST);
      active = true; const a = model.getActivity(QUEST) || model.startActivity(QUEST);
      if (!a) { returnToForest(); return; }
      if (a.finished) finish(); else if (!model.hasDemo(QUEST)) demonstrate(); else draw();
    },
    leave() { active = false; voice.cancel(); },
  });
})();
