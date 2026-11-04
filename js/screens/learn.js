/* Farbtupf: short, untimed finger-first learning rounds. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, current, locked, live, next, answers;
  function button(label, fn, cls) {
    return h('button', { type: 'button', class: 'learn-button ' + (cls || ''), text: label, onclick: fn });
  }
  function dots(n, removed) {
    return h('div', { class: 'learn-objects', 'aria-label': n + ' Äpfel' }, Array.from({ length: n }, (_, i) =>
      h('span', { class: 'learn-object' + (i >= n - (removed || 0) ? ' removed' : ''), text: '🍎' })));
  }
  function draw() {
    current = FK.learning.question(game.id, stage, round);
    locked = false;
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
        h('span', { text: '🚂' }), current.sequence.map(s => h('span', { class: 'learn-wagon', text: s })), h('span', { class: 'learn-wagon', text: '?' })));
    } else visual.append(h('div', { class: 'learn-nature', text: '🔎🌿' }));
    body.append(visual);
    live = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: 'Tippe deine Antwort an.' });
    answers = h('div', { class: 'learn-answers' });
    FK.shuffle(current.choices).forEach(value => {
      const b = button(String(value), () => {
        if (locked) return;
        if (value !== current.answer) {
          FK.sound.undo(); live.textContent = 'Versuche es nochmals. ' + current.hint;
          b.classList.add('try-again'); return;
        }
        locked = true;
        answers.querySelectorAll('button').forEach(x => { x.disabled = true; });
        b.classList.add('correct'); FK.sound.tada();
        live.textContent = game.id === 'nature' ? 'Bravo! ' + current.hint : 'Juhui! Das stimmt.';
        next.hidden = false;
      }, 'learn-answer'); answers.append(b);
    });
    next = button(round === 4 ? '⭐ Geschafft!' : 'Weiter →', () => { if (!locked) return; round++; if (round === 5) finish(); else draw(); }, 'learn-next');
    next.hidden = true;
    body.append(answers, live, next, button('💡 Tipp', () => { live.textContent = current.hint; }, 'learn-hint'));
  }
  function finish() {
    const earned = FK.progress.finish('learn', game.id + ':' + stage, 1);
    body.replaceChildren(h('div', { class: 'learn-finish' }, FK.ui.mascot({ mood: 'cheer' }), h('h2', { text: 'Fünf Aufgaben geschafft!' }),
      h('p', { text: earned ? 'Ein Stern für dich! ⭐' : 'Das hast du wieder toll gemacht!' }),
      button('Nochmals spielen', () => { round = 0; draw(); }), button('Zur Lerninsel', () => FK.go('hub'))));
    FK.ui.celebrate({ stars: earned, from: body });
  }
  FK.screen('learn', {
    build(root) { const bar = FK.ui.topbar({ title: 'Lernspiel' }); title = bar.querySelector('.title'); body = h('div', { class: 'learn-body scroll' }); root.append(bar, body); },
    enter(p) { game = FK.learning.games.find(g => g.id === p.game) || FK.learning.games[0]; stage = FK.learning.stage(); round = 0; title.textContent = game.title; draw(); },
    leave() { locked = true; },
  });
})();
