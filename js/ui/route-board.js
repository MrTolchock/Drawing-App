/* One flat route board for ordinary Roboterpost and the woodland story. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  FK.ui.routeBoard = function (options) {
    const q = options.question, pictured = options.pictured === true;
    let state = options.snapshot || FK.routes.initial(q);
    const root = h('div', { class: 'route-board' + (pictured ? ' route-pictured' : '') });
    const field = h('div', { class: 'adventure-map', style: { '--size': q.size }, role: 'group', 'aria-label': pictured ? 'Fuchs und Waldkauz auf der Wegekarte' : 'Postkarte mit ' + q.size + ' mal ' + q.size + ' Feldern' });
    const commands = h('p', { class: 'adventure-commands', role: 'status', 'aria-live': 'polite' });
    const arrows = h('div', { class: 'adventure-arrows', role: 'group', 'aria-label': pictured ? 'Fuchs bewegen' : 'Roboter steuern' });
    const cells = [], controls = [];
    for (let i = 0; i < q.size * q.size; i++) { const cell = h('span', { class: 'adventure-map-cell', 'aria-hidden': 'true' }); cells.push(cell); field.append(cell); }
    function update() {
      cells.forEach((cell, i) => {
        cell.replaceChildren(); cell.classList.toggle('route-goal', i === q.goal); cell.classList.toggle('route-arrived', i === q.goal && state.answered);
        if (!pictured) { cell.textContent = i === state.position ? '🤖' : i === q.goal ? '📬' : q.obstacles.includes(i) ? '🌳' : state.history.includes(i) ? '·' : ''; FK.visual?.decorate(cell); }
        else {
          if (i === q.goal) cell.append(FK.forestArt.character('owl'));
          if (i === state.position) cell.append(FK.forestArt.character('fox'));
          else if (q.obstacles.includes(i)) cell.append(FK.visual.art('tree'));
          else if (i !== q.goal && state.history.includes(i)) cell.append(h('span', { class: 'route-footprint' }, FK.forestArt.icon('paw')));
        }
      });
      commands.textContent = (pictured ? 'Fuchs' : 'Roboter') + ': Reihe ' + (Math.floor(state.position / q.size) + 1) + ', Spalte ' + (state.position % q.size + 1) + '.';
      controls.forEach(b => { b.disabled = state.answered || (options.demonstration === true && b.dataset.direction !== 'right'); }); undo.disabled = state.answered || state.history.length < 2;
      if (options.demonstration) {
        arrows.querySelector('.route-demo-hand')?.remove();
        if (!state.answered) arrows.querySelector('[data-direction="right"]').append(FK.forestArt.icon('hand', 'route-demo-hand'));
      }
    }
    function move(dx, dy) {
      if (state.answered) return;
      const next = options.move ? options.move(dx, dy) : FK.routes.move(q, state, dx, dy);
      if (!next) { options.onBlocked?.(); return; }
      state = next; FK.sound.tick(); update(); options.onChange?.(state);
      if (state.answered) options.onSuccess?.();
    }
    [['↑', 'Nach oben', 'up', 0, -1], ['←', 'Nach links', 'left', -1, 0], ['↓', 'Nach unten', 'down', 0, 1], ['→', 'Nach rechts', 'right', 1, 0]].forEach(([symbol, label, direction, dx, dy]) => {
      const b = h('button', { type: 'button', class: 'learn-button route-direction route-' + direction, 'data-direction': direction, 'aria-label': label, onclick: () => move(dx, dy) },
        pictured ? FK.forestArt.icon('arrow', 'route-arrow-' + direction) : document.createTextNode(symbol));
      controls.push(b); arrows.append(b);
    });
    const undo = h('button', { type: 'button', class: 'learn-button route-undo' + (pictured ? ' forest-button' : ''), 'aria-label': 'Einen Schritt zurück', onclick: () => {
      const next = options.undo ? options.undo() : FK.routes.undo(q, state);
      if (next) { state = next; FK.sound.tick(); update(); options.onChange?.(state); }
    } }, pictured ? FK.forestArt.icon('undo') : document.createTextNode('↶ Einen Schritt zurück'));
    if (!pictured) root.append(h('p', { text: 'Ziel: Reihe ' + (Math.floor(q.goal / q.size) + 1) + ', Spalte ' + (q.goal % q.size + 1) }));
    root.append(field, commands, h('div', { class: 'route-controls' }, arrows, undo)); update(); return root;
  };
})();
