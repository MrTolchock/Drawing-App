/* Touch and keyboard friendly explorations. No timers or penalties. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let body, title, game, stage, round, q, locked, feedback, next;
  function button(text, fn, cls) {
    return h('button', { type: 'button', class: 'learn-button ' + (cls || ''), text, onclick: fn });
  }
  function say(text) { feedback.textContent = text; }
  function success() {
    if (locked) return;
    locked = true;
    body.querySelectorAll('.adventure-work button').forEach(b => { b.disabled = true; });
    say('Juhui! ' + q.explain);
    FK.sound.tada();
    next.hidden = false;
    body.querySelector('.adventure-transfer').hidden = false;
  }
  function check(ok) {
    if (locked) return;
    if (ok) success();
    else { FK.sound.undo(); say('Probiere weiter. ' + q.hint); }
  }
  function stars(n) {
    return h('span', { class: 'adventure-quantity', 'aria-label': n + ' Sterne', text: '⭐'.repeat(n) });
  }
  function shape(id, rotated) {
    const paths = {
      circle: '<circle cx="60" cy="60" r="36"/>', triangle: '<path d="M60 16 L104 98 L16 98 Z"/>',
      square: '<rect x="27" y="27" width="66" height="66"/>', rectangle: '<rect x="14" y="38" width="92" height="44"/>',
    };
    return '<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="#8fd3ff" stroke="#23203d" stroke-width="4"' + (rotated ? ' transform="rotate(25 60 60)"' : '') + '>' + paths[id] + '</g></svg>';
  }
  function work(host) {
    if (q.mode === 'fill') {
      const selected = new Set();
      const meter = h('p', { class: 'adventure-meter', role: 'status', text: q.filled + ' Sterne an Bord · 0 ergänzt' });
      const field = h('div', { class: 'learn-frame adventure-seats' });
      for (let i = 0; i < q.total; i++) {
        const cell = h('div', { class: 'learn-cell' });
        if (i < q.filled) cell.append(h('span', { class: 'adventure-fixed', 'aria-label': 'Stern schon an Bord', text: '⭐' }));
        else {
          const b = button('＋', () => {
            if (selected.has(i)) selected.delete(i); else selected.add(i);
            b.textContent = selected.has(i) ? '⭐' : '＋';
            b.setAttribute('aria-pressed', String(selected.has(i)));
            meter.textContent = q.filled + ' Sterne an Bord · ' + selected.size + ' ergänzt'; FK.sound.tick();
          }, 'learn-bug');
          b.setAttribute('aria-label', 'Sternplatz ' + (i + 1)); b.setAttribute('aria-pressed', 'false'); cell.append(b);
        }
        field.append(cell);
      }
      host.append(h('div', { class: 'adventure-scene', 'aria-hidden': 'true', text: '🚀' }), field, meter,
        button('Rakete starten!', () => check(selected.size === q.answer), 'learn-next'));
    } else if (q.mode === 'share') {
      const placed = [], counts = [0, 0], plates = [];
      const meter = h('p', { class: 'adventure-meter', role: 'status' });
      function update() {
        meter.textContent = (q.total - placed.length) + ' Beeren im Korb';
        plates.forEach((p, i) => { p.lastChild.textContent = counts[i] ? '🫐'.repeat(counts[i]) : 'Leerer Teller'; p.setAttribute('aria-label', (i ? 'Dachs' : 'Fuchs') + ': ' + counts[i] + ' Beeren. Eine Beere geben'); });
      }
      const row = h('div', { class: 'adventure-plates' });
      ['🦊 Fuchs', '🦡 Dachs'].forEach((name, i) => {
        const b = button('', () => { if (placed.length >= q.total) { say('Der Korb ist leer. Du kannst prüfen oder die letzte Beere zurücknehmen.'); return; } placed.push(i); counts[i]++; update(); FK.sound.tick(); }, 'adventure-plate');
        b.append(h('b', { text: name }), h('span', { class: 'adventure-berries' })); plates.push(b); row.append(b);
      });
      host.append(h('div', { class: 'adventure-scene', text: '🧺', 'aria-hidden': 'true' }), meter, row,
        button('↶ Zurück', () => { if (placed.length) { counts[placed.pop()]--; update(); } }),
        button('Gerecht geteilt?', () => check(placed.length === q.total && counts[0] === q.answer && counts[1] === q.answer), 'learn-next'));
      update();
    } else if (q.mode === 'clap') {
      let count = 0;
      const meter = h('p', { class: 'adventure-meter', role: 'status', text: '0 Schläge' });
      host.append(h('div', { class: 'adventure-scene', text: q.emoji }), h('p', { class: 'adventure-word', text: FK.text.word(q.word) }),
        button('🥁 Trommeln', () => { if (count < 8) { count++; meter.textContent = count + (count === 1 ? ' Schlag' : ' Schläge'); FK.sound.tick(); } else say('Nimm einen Schlag zurück oder prüfe deine Antwort.'); }, 'adventure-drum'), meter,
        button('↶ Zurück', () => { count = Math.max(0, count - 1); meter.textContent = count + (count === 1 ? ' Schlag' : ' Schläge'); }),
        button('Prüfen', () => check(count === q.answer), 'learn-next'));
    } else if (q.mode === 'route') {
      let pos = q.start;
      const history = [pos], cells = [];
      const field = h('div', { class: 'adventure-map', style: { '--size': q.size }, role: 'group', 'aria-label': 'Postkarte mit ' + q.size + ' mal ' + q.size + ' Feldern' });
      const commands = h('p', { class: 'adventure-commands', role: 'status' });
      function update() {
        cells.forEach((c, i) => { c.textContent = i === pos ? '🤖' : i === q.goal ? '📬' : q.obstacles.includes(i) ? '🌳' : history.includes(i) ? '·' : ''; });
        commands.textContent = 'Roboter: Reihe ' + (Math.floor(pos / q.size) + 1) + ', Spalte ' + (pos % q.size + 1) + '. ' + (history.length - 1) + ' Schritte.';
      }
      function move(dx, dy) {
        if (locked) return;
        const x = pos % q.size + dx, y = Math.floor(pos / q.size) + dy, dest = y * q.size + x;
        if (x < 0 || y < 0 || x >= q.size || y >= q.size || q.obstacles.includes(dest)) { say('Dort ist der Rand oder eine Hecke. Probiere einen anderen Pfeil.'); return; }
        pos = dest; history.push(pos); update(); FK.sound.tick();
        if (pos === q.goal) success();
      }
      for (let i = 0; i < q.size * q.size; i++) { const c = h('span', { class: 'adventure-map-cell', 'aria-hidden': 'true' }); cells.push(c); field.append(c); }
      const arrows = h('div', { class: 'adventure-arrows', role: 'group', 'aria-label': 'Roboter steuern' });
      [['↑', 'Nach oben', 0, -1], ['←', 'Nach links', -1, 0], ['↓', 'Nach unten', 0, 1], ['→', 'Nach rechts', 1, 0]].forEach(a => {
        const b = button(a[0], () => move(a[2], a[3])); b.setAttribute('aria-label', a[1]); arrows.append(b);
      });
      host.append(h('p', { text: 'Ziel: Reihe ' + (Math.floor(q.goal / q.size) + 1) + ', Spalte ' + (q.goal % q.size + 1) }), field, commands, arrows,
        button('↶ Einen Schritt zurück', () => { if (history.length > 1) { history.pop(); pos = history[history.length - 1]; update(); } }));
      update();
    } else if (q.mode === 'order') {
      const selected = [];
      const line = h('ol', { class: 'adventure-order', 'aria-label': 'Deine Reihenfolge', 'aria-live': 'polite' });
      const choices = h('div', { class: 'learn-answers' });
      let shuffled = FK.shuffle(q.ordered);
      if (shuffled.every((v, i) => v === q.ordered[i])) shuffled = shuffled.slice(1).concat(shuffled[0]);
      shuffled.forEach(value => {
        const b = button(value, () => { selected.push(value); line.append(h('li', { text: value })); b.disabled = true; }, 'adventure-order-card'); choices.append(b);
      });
      host.append(line, choices, button('Neu ordnen', () => { selected.length = 0; line.replaceChildren(); choices.querySelectorAll('button').forEach(b => { b.disabled = false; }); }),
        button('Geschichte prüfen', () => check(selected.length === q.ordered.length && selected.every((v, i) => v === q.ordered[i])), 'learn-next'));
    } else {
      if (q.kind === 'double') host.append(h('div', { class: 'adventure-twins' }, stars(q.n), h('span', { text: '🪞', 'aria-hidden': 'true' }), stars(q.n)));
      if (q.kind === 'rhyme') host.append(h('div', { class: 'adventure-scene', 'aria-hidden': 'true', text: '🎪' }), h('p', { class: 'adventure-word', text: FK.text.word(q.word) }), h('p', { text: 'Sprich laut oder lass dir vorlesen.' }));
      const choices = h('div', { class: 'learn-answers' });
      FK.shuffle(q.choices).forEach(value => {
        const name = q.kind === 'shapes' ? FK.adventures.shapes.find(s => s.id === value).name : String(value);
        const b = button(q.kind === 'rhyme' ? FK.text.word(name) : name, () => { if (locked) return; check(value === q.answer); b.classList.add(value === q.answer ? 'correct' : 'try-again'); }, 'learn-answer' + (q.kind === 'shapes' ? ' adventure-shape' : ''));
        if (q.kind === 'shapes') { b.textContent = ''; b.innerHTML = shape(value, q.rotated); b.setAttribute('aria-label', name); }
        choices.append(b);
      });
      host.append(choices);
    }
  }
  function draw() {
    q = FK.adventures.question(game.id, stage, round); locked = false;
    const host = h('div', { class: 'adventure-work adventure-' + q.kind });
    feedback = h('p', { class: 'learn-feedback', role: 'status', 'aria-live': 'polite', text: 'Probiere aus. Du hast Zeit.' });
    next = button(round === 4 ? '⭐ Geschafft!' : 'Weiter →', () => { if (!locked) return; round++; if (round === 5) finish(); else draw(); }, 'learn-next adventure-next'); next.hidden = true;
    body.replaceChildren(h('p', { class: 'learn-meta', text: stage + '. Stufe · ' + FK.learning.stages[stage - 1] + ' · Aufgabe ' + (round + 1) + ' von 5' }),
      h('div', { class: 'learn-progress', 'aria-label': round + ' von 5 geschafft', text: '⭐'.repeat(round) + '☆'.repeat(5 - round) }),
      h('h2', { class: 'learn-prompt', text: q.prompt }), host, feedback, next,
      button('💡 Tipp', () => say(q.hint), 'learn-hint'),
      h('p', { class: 'adventure-transfer', hidden: true, text: '💬 ' + q.transfer }));
    work(host);
    body.scrollTop = 0;
  }
  function finish() {
    const earned = FK.progress.finish('adventure', game.id + ':' + stage, 1);
    body.replaceChildren(h('div', { class: 'learn-finish' }, FK.ui.mascot({ mood: 'cheer' }),
      h('h2', { text: 'Fünf Abenteuer geschafft!' }), h('p', { text: earned ? 'Ein Stern für deine Entdeckungen! ⭐' : 'Schön, dass du weiter übst!' }),
      button('Nochmals spielen', () => { round = 0; draw(); }), button('🎨 Kreativmission', () => FK.go('missions')), button('Zur Lerninsel', () => FK.go('hub'))));
    FK.ui.celebrate({ stars: earned, from: body });
  }
  FK.screen('adventure', {
    build(root) { const bar = FK.ui.topbar({ title: 'Lernabenteuer' }); title = bar.querySelector('.title'); body = h('div', { class: 'learn-body scroll' }); root.append(bar, body); },
    enter(p) { game = FK.adventures.games.find(g => g.id === (p || {}).game) || FK.adventures.games[0]; stage = FK.learning.stage(); round = 0; title.textContent = game.title; draw(); },
    leave() { locked = true; },
  });
})();
