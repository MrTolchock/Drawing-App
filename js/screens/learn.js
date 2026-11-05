/* Farbtupf: short, untimed finger-first learning rounds. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, current, locked, live, next, answers, root, bar, controls;
  let forest = false, demonstrating = false, quest;
  function returnToForest() { FK.forestActivity.leave(quest); }
  function forestPrompt() {
    if (!demonstrating && FK.forestState.getActivity(quest)?.finished) { FK.forestVoice.say(FK.forestActivity.backLabel(quest) + '.'); return; }
    FK.forestVoice.say(demonstrating ? 'Schau: Stern, Kreis. Stern, Kreis. Dann kommt wieder ein Stern.' : locked ? 'Das passt! Tippe auf den Pfeil.' : 'Wie geht es weiter? Tippe auf die passende Form.');
  }
  function demonstrate() {
    if (!forest) return;
    demonstrating = true; body.replaceChildren();
    const sequence = h('div', { class: 'forest-demo-pattern', 'aria-label': 'Beispiel: Stern, Kreis, Stern, Kreis. Danach wieder ein Stern.' });
    ['⭐', '🔵', '⭐', '🔵'].forEach(token => sequence.append(h('span', { text: token })));
    sequence.append(h('span', { class: 'forest-demo-gap' }, h('span', { text: '⭐' }), FK.forestArt.icon('hand')));
    body.append(h('section', { class: 'forest-demo' }, h('h2', { text: 'Schau, so geht’s.' }), sequence,
      h('button', { type: 'button', class: 'forest-button forest-primary', 'aria-label': 'Jetzt selber probieren', onclick: () => {
        FK.forestState.demoSeen(quest); demonstrating = false; draw();
      } }, FK.forestArt.icon('play'), h('span', { text: 'Jetzt du' }))));
    forestPrompt();
  }
  function button(label, fn, cls) {
    return h('button', { type: 'button', class: 'learn-button ' + (cls || ''), text: label, onclick: fn });
  }
  function dots(n, removed) {
    return h('div', { class: 'learn-objects', 'aria-label': n + ' Äpfel' }, Array.from({ length: n }, (_, i) =>
      h('span', { class: 'learn-object' + (i >= n - (removed || 0) ? ' removed' : ''), text: '🍎' })));
  }
  function draw() {
    demonstrating = false;
    let options;
    if (forest) {
      const session = FK.forestState.getActivity(quest);
      if (session.finished) { finish(); return; }
      round = session.round;
      current = session.question || FK.learning.question(game.id, stage, round);
      options = session.choices || FK.shuffle(current.choices);
      if (!session.question || !session.choices) FK.forestState.question(current, options, quest);
      locked = session.answered;
    } else { current = FK.learning.question(game.id, stage, round); locked = false; options = FK.shuffle(current.choices); }
    body.replaceChildren();
    body.append(h('p', { class: 'learn-meta', text: stage + '. Trimester · ' + FK.learning.stages[stage - 1] + ' · Aufgabe ' + (round + 1) + ' von 5' }),
      h('div', { class: 'learn-progress', 'aria-label': round + ' von 5 geschafft', text: '⭐'.repeat(round) + '☆'.repeat(5 - round) }),
      h('h2', { class: 'learn-prompt', text: current.prompt }));
    const visual = h('div', { class: 'learn-visual' });
    if (game.id === 'count') {
      const field = h('div', { class: 'learn-frame' });
      const size = [5, 10, 20][stage - 1];
      for (let i = 0; i < size; i++) {
        const cell = h('div', { class: 'learn-cell' });
        if (i < current.count) {
          const b = button('🐞', () => { b.classList.add('counted'); b.setAttribute('aria-pressed', 'true'); FK.sound.tick(); }, 'learn-bug');
          b.setAttribute('aria-label', 'Käfer ' + (i + 1)); b.setAttribute('aria-pressed', 'false'); cell.append(b);
        }
        field.append(cell);
      }
      visual.append(field);
    } else if (game.id === 'add') {
      visual.append(h('div', { class: 'learn-equation', text: current.a + (current.subtract ? ' − ' : ' + ') + current.b + ' = ?' }));
      if (current.subtract) visual.append(dots(current.a, current.b));
      else visual.append(dots(current.a), h('b', { text: '+' }), dots(current.b));
    } else if (game.id === 'pattern') {
      visual.append(h('div', { class: 'learn-train', 'aria-label': 'Muster' },
        h('span', { text: '🚂' }), current.sequence.map(s => h('span', { class: 'learn-wagon', text: s })), h('span', { class: 'learn-wagon' + (forest ? ' forest-live-gap' : ''), text: forest ? '' : '?', 'aria-label': 'Hier fehlt eine Form' })));
    } else visual.append(h('div', { class: 'learn-nature', text: '🔎🌿' }));
    body.append(visual);
    live = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: 'Tippe deine Antwort an.' });
    answers = h('div', { class: 'learn-answers' });
    options.forEach(value => {
      const b = button(String(value), () => {
        if (locked) return;
        if (value !== current.answer) {
          FK.sound.undo(); live.textContent = 'Versuche es nochmals. ' + current.hint;
          if (forest) FK.forestVoice.say('Schau noch einmal. Die kleine Gruppe wiederholt sich.');
          b.classList.add('try-again'); return;
        }
        locked = true;
        answers.querySelectorAll('button').forEach(x => { x.disabled = true; });
        b.classList.add('correct');
        if (forest) { FK.forestState.answer(value, quest); FK.sound.right(); FK.forestVoice.say('Das passt! Tippe auf den Pfeil.'); }
        else FK.sound.tada();
        live.textContent = game.id === 'nature' ? 'Bravo! ' + current.hint : 'Juhui! Das stimmt.';
        next.hidden = false;
      }, 'learn-answer');
      b.setAttribute('aria-label', String(value));
      if (locked) { b.disabled = true; if (value === current.answer) b.classList.add('correct'); }
      answers.append(b);
    });
    next = button(round === 4 ? '⭐ Geschafft!' : 'Weiter →', () => {
      if (!locked) return;
      if (forest) { if (FK.forestState.advance(quest)) finish(); else draw(); }
      else { round++; if (round === 5) finish(); else draw(); }
    }, 'learn-next');
    if (forest) { next.replaceChildren(FK.forestArt.icon('arrow')); next.setAttribute('aria-label', round === 4 ? 'Zum Ergebnis' : 'Nächstes Muster'); }
    next.hidden = !locked;
    body.append(answers, live, next, button('💡 Tipp', () => { live.textContent = current.hint; }, 'learn-hint'));
    if (forest) forestPrompt();
  }
  function finish() {
    if (forest) {
      FK.forestActivity.finish(body, quest); return;
    }
    const earned = FK.progress.finish('learn', game.id + ':' + stage, 1);
    body.replaceChildren(h('div', { class: 'learn-finish' }, FK.ui.mascot({ mood: 'cheer' }), h('h2', { text: 'Fünf Aufgaben geschafft!' }),
      h('p', { text: earned ? 'Ein Stern für dich! ⭐' : 'Das hast du wieder toll gemacht!' }),
      button('Nochmals spielen', () => { round = 0; draw(); }), button('Zur Lerninsel', () => FK.go('hub'))));
    FK.ui.celebrate({ stars: earned, from: body });
  }
  FK.screen('learn', {
    build(element) {
      root = element; bar = FK.ui.topbar({ title: 'Lernspiel', onBack: () => forest ? returnToForest() : FK.back() });
      title = bar.querySelector('.title'); controls = h('div', { class: 'forest-learning-controls', hidden: true });
      controls.append(h('button', { type: 'button', class: 'forest-button', 'aria-label': 'Aufgabe nochmals hören', onclick: forestPrompt }, FK.forestArt.icon('speaker')),
        h('button', { type: 'button', class: 'forest-button', 'aria-label': 'Beispiel nochmals zeigen', onclick: demonstrate }, FK.forestArt.icon('hand')));
      bar.append(controls); body = h('div', { class: 'learn-body scroll' }); root.append(bar, body);
    },
    enter(p) {
      forest = p.forest === true; quest = p.quest || FK.forestState.QUEST; demonstrating = false; root.classList.toggle('forest-activity', forest); controls.hidden = !forest;
      if (forest && FK.forestState.definition(quest)?.game !== 'pattern') { FK.go('forest'); return; }
      const back = bar.querySelector('.btn-back');
      back.replaceChildren(); back.insertAdjacentHTML('beforeend', forest ? '' : FK.icon('home'));
      back.setAttribute('aria-label', forest ? 'Zurück zum Biber' : 'Zurück');
      game = FK.learning.games.find(g => g.id === (forest ? 'pattern' : p.game)) || FK.learning.games[0];
      stage = forest ? 1 : FK.learning.stage(); round = 0; title.textContent = forest ? 'Waldspiele' : game.title; if (forest) FK.forestActivity.prepare(root, quest);
      if (forest) {
        const session = FK.forestState.getActivity(quest) || FK.forestState.startActivity(quest);
        if (session?.finished) { finish(); return; }
        if (!session) { returnToForest(); return; }
        if (!FK.forestState.hasDemo(quest)) { demonstrate(); return; }
      }
      draw();
    },
    leave() { locked = true; if (forest) FK.forestVoice.cancel(); },
  });
})();
