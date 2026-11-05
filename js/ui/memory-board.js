/* Shared Waldschatz board: look freely, hide one object, find it by tapping. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  FK.ui.memoryBoard = function (options) {
    const q = options.question, pictured = options.pictured === true;
    let concealed = options.concealed === true, answered = options.answered === true;
    const root = h('div', { class: 'memory-board' + (pictured ? ' memory-pictured' : '') });
    const instruction = h('p', { class: 'exp-instructions', role: 'status' });
    const field = h('div', { class: 'exp-treasures', role: 'group', 'aria-label': 'Dein Waldschatz' });
    const answers = h('div', { class: 'exp-treasure-answers' });
    const row = h('div', { class: 'learn-answers exp-picture-answers' });
    function show() {
      field.replaceChildren();
      q.objects.forEach((o, i) => {
        if (concealed && i === q.missing) {
          if (pictured) field.append(h('div', { class: 'exp-picture memory-gap', 'aria-label': 'Hier fehlt ein Ding' }));
        } else field.append(h('div', { class: 'exp-picture' }, h('span', { class: 'exp-art', text: o.emoji, 'aria-hidden': 'true' }), h('span', { class: 'memory-name', text: FK.text.word(o.name) })));
      });
      const label = concealed ? 'Nochmals schauen' : 'Ich bin bereit – verstecken!';
      toggle.setAttribute('aria-label', label);
      toggle.replaceChildren(...(pictured ? [FK.forestArt.icon(concealed ? 'eye' : 'basket')] : [document.createTextNode(label)]));
      if (options.demonstration && !concealed) toggle.append(FK.forestArt.icon('hand', 'memory-toggle-hand'));
      toggle.disabled = answered;
      answers.hidden = !concealed;
      instruction.textContent = concealed ? 'Ein Ding fehlt. Welches war vorher auch dabei?' : 'Schau so lange, wie du möchtest. Dann versteckt der Fuchs ein Ding.';
    }
    const toggle = h('button', { type: 'button', class: 'learn-button exp-hide' + (pictured ? ' forest-button forest-primary' : ''), onclick: () => {
      if (answered) return;
      concealed = !concealed; options.onToggle?.(concealed); show();
    } });
    q.choices.forEach(o => {
      const b = h('button', { type: 'button', class: 'learn-button learn-answer', 'aria-label': o.name, onclick: () => {
        if (answered || !concealed) return;
        const correct = o.name === q.answer;
        b.classList.add(correct ? 'correct' : 'try-again');
        options.onChoice(o.name, correct);
        if (correct) {
          answered = true; row.querySelectorAll('button').forEach(item => { item.disabled = true; }); toggle.disabled = true;
        }
      } }, h('span', { class: 'exp-art', text: o.emoji, 'aria-hidden': 'true' }), h('span', { class: 'memory-name', text: FK.text.word(o.name) }));
      b.disabled = answered; if (answered && o.name === q.answer) b.classList.add('correct');
      if (options.demonstration && o.name === q.answer) b.append(FK.forestArt.icon('hand', 'memory-demo-hand'));
      row.append(b);
    });
    answers.append(row); root.append(instruction, field, toggle, answers); show(); return root;
  };
})();
