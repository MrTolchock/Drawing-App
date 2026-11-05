/* A picture-led story adapter for the existing Roboterpost route family. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, model = FK.forestState, art = FK.forestArt, voice = FK.forestVoice, QUEST = model.TRAIL;
  let body, active = false, demonstrating = false;
  const button = (label, children, fn, cls = '') => h('button', { type: 'button', class: 'forest-button ' + cls, 'aria-label': label, onclick: fn }, children);
  function returnToForest() { FK.go('forest', { returned: true, quest: QUEST }, { replace: true }); }
  function prompt() {
    voice.say(demonstrating ? 'Schau: Der Fuchs will zum Waldkauz. Die Hand zeigt den rechten Pfeil. Tippe zweimal darauf. Dann bist du dran.' :
      model.getActivity(QUEST)?.answered ? 'Du bist angekommen! Tippe auf den Pfeil.' :
        'Bringe den Fuchs zum Waldkauz. Die Pfeile bewegen ihn ein Feld. Mit dem gebogenen Pfeil gehst du einen Schritt zurück.');
  }
  function ensureQuestion() {
    const a = model.getActivity(QUEST);
    if (a && !a.finished && !a.question) model.question(FK.adventures.question('robot', 1, a.round), null, QUEST);
    return model.getActivity(QUEST);
  }
  function demonstrate() {
    if (!active) return;
    demonstrating = true; ensureQuestion();
    const sample = { kind: 'robot', mode: 'route', size: 3, start: 3, goal: 5, obstacles: [] };
    const board = FK.ui.routeBoard({ question: sample, pictured: true, demonstration: true,
      onChange: state => { if (!state.answered) voice.say('Ein Feld weiter. Tippe nochmals auf den rechten Pfeil.'); },
      onSuccess: () => { FK.sound.right(); voice.say('Da ist der Waldkauz! Jetzt bist du dran.'); } });
    body.replaceChildren(h('section', { class: 'forest-demo forest-trail-demo' }, h('h2', { text: 'Schau, so geht’s.' }), board,
      button('Jetzt selber probieren', h('span', {}, art.icon('play'), h('span', { text: 'Jetzt du' })), () => { model.demoSeen(QUEST); draw(); }, 'forest-primary')));
    prompt();
  }
  function draw() {
    demonstrating = false;
    const a = ensureQuestion(); if (!a) { returnToForest(); return; } if (a.finished) { finish(); return; }
    const feedback = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: a.answered ? 'Angekommen!' : '' });
    const next = button(a.round === 4 ? 'Zum Ergebnis' : 'Nächster Weg', art.icon('arrow'), () => {
      if (!model.getActivity(QUEST)?.answered) return;
      if (model.advance(QUEST)) finish(); else draw();
    }, 'learn-next'); next.hidden = !a.answered;
    const board = FK.ui.routeBoard({ question: a.question, pictured: true, snapshot: a,
      move: (dx, dy) => model.moveRoute(dx, dy), undo: () => model.undoRoute(),
      onBlocked: () => { FK.sound.undo(); feedback.textContent = 'Probiere einen anderen Pfeil.'; voice.say('Dort ist der Rand. Probiere einen anderen Pfeil.'); },
      onChange: () => { feedback.textContent = ''; },
      onSuccess: () => { FK.sound.right(); feedback.textContent = 'Angekommen!'; next.hidden = false; prompt(); } });
    body.replaceChildren(h('div', { class: 'learn-progress', 'aria-label': a.round + ' von 5 geschafft', text: '⭐'.repeat(a.round) + '☆'.repeat(5 - a.round) }),
      h('h2', { class: 'learn-prompt', text: 'Zum Waldkauz' }), board, feedback, next); body.scrollTop = 0; prompt();
  }
  function finish() {
    demonstrating = false;
    const a = model.getActivity(QUEST); if (!a?.finished) return;
    if (!a.rewardRecorded) { FK.progress.finish('adventure', 'robot:1', 1); model.rewardRecorded(QUEST); }
    body.closest('.screen').querySelector('.btn-back').replaceChildren(art.scenePicture(true, 'owl'));
    body.replaceChildren(h('section', { class: 'forest-round-finish' }, art.icon('check'),
      button('Zurück zum Waldkauz', h('span', {}, art.scenePicture(true, 'owl'), art.icon('arrow')), returnToForest, 'forest-scene-return'),
      h('p', { class: 'forest-finish-note', text: 'Der alte Wegweiser zeigt wieder zum Herzbaum.' })));
    voice.say('Gut gemacht! Komm zurück zum Waldkauz. Der Wegweiser ist wieder fertig.');
  }
  FK.screen('forest-trail', {
    build(root) {
      root.classList.add('forest-activity', 'forest-route-activity');
      const bar = FK.ui.topbar({ title: 'Für den Kauz', onBack: returnToForest });
      const back = bar.querySelector('.btn-back'); back.replaceChildren(art.scenePicture(false, 'owl')); back.setAttribute('aria-label', 'Zurück zum Waldkauz');
      bar.append(h('div', { class: 'forest-learning-controls' }, button('Aufgabe nochmals hören', art.icon('speaker'), prompt), button('Beispiel nochmals zeigen', art.icon('hand'), demonstrate)));
      body = h('div', { class: 'learn-body scroll' }); root.append(bar, body);
    },
    enter() {
      active = true; const a = model.getActivity(QUEST) || model.startActivity(QUEST);
      if (!a) { returnToForest(); return; }
      if (a.finished) finish(); else if (!model.hasDemo(QUEST)) demonstrate(); else draw();
    },
    leave() { active = false; voice.cancel(); },
  });
})();
