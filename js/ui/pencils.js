/* Farbklecks – Farbstift-Schachtel und Sprechblasen-Menüs (Popover) für die Mal-Bildschirme. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  function crayonSvg(c) {
    const fill = c.rainbow ? 'url(#fk-rainbow)' : c.hex;
    const band = c.rainbow ? '#ffffff' : FK.color.mix(c.hex, '#000000', 0.25);
    return '<svg viewBox="0 0 40 120" aria-hidden="true">' +
      '<path d="M6 37 L20 5 L34 37 Z" fill="#f3c891" stroke="#23203d" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M13.6 19.5 L20 5 L26.4 19.5 Q20 22 13.6 19.5 Z" fill="' + fill + '" stroke="#23203d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="6" y="35" width="28" height="92" rx="3" fill="' + fill + '" stroke="#23203d" stroke-width="3"/>' +
      '<rect x="10.5" y="40" width="5" height="80" rx="2.5" fill="#ffffff" opacity=".4"/>' +
      '<rect x="7.5" y="58" width="25" height="7" fill="' + band + '" opacity=".6"/>' +
      '</svg>';
  }

  // FK.ui.pencilBox({ onPick(color) }) → { el, set(colors, labels), select(id) }
  // labels: optional { colorId: 'text' } shown on a tag at the pencil (numbers, syllables, dice dots).
  function pencilBox(o) {
    const el = h('div', { class: 'box', role: 'radiogroup', 'aria-label': 'Farben' });
    let selected = null;
    let colors = [];

    function set(list, labels) {
      colors = list;
      el.innerHTML = '';
      el.classList.toggle('labelled', !!labels);
      el.style.setProperty('--n', list.length);
      el.dataset.count = String(list.length);
      list.forEach((c, i) => {
        const lab = labels && labels[c.id];
        const b = h('button', {
          type: 'button',
          class: 'crayon',
          role: 'radio',
          'aria-label': lab ? c.name + ' ' + lab : c.name,
          dataset: { color: c.id },
          html: crayonSvg(c),
        });
        if (lab) {
          const tag = h('span', { class: 'crayon-tag' + (lab.length > 2 ? ' long' : '') });
          if (lab.indexOf('•') === 0) tag.innerHTML = dice(lab.length);
          else tag.textContent = lab;
          b.append(tag);
        }
        b.addEventListener('click', () => {
          select(c.id);
          if (c.rainbow) FK.sound.rainbow();
          else FK.sound.note(Math.min(17, i + (labels ? 4 : 0)));
          if (o.onPick) o.onPick(c);
        });
        el.append(b);
      });
      if (selected) select(selected);
    }

    function select(id) {
      selected = id;
      el.querySelectorAll('.crayon').forEach((b) => {
        const on = b.dataset.color === id;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }

    return { el, set, select, get colors() { return colors; } };
  }

  // Dice face with n dots (1…6) as inline SVG.
  const DICE = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[26, 26], [50, 50], [74, 74]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
    6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
  };
  function dice(n) {
    const pts = DICE[n] || DICE[1];
    return '<svg class="dice" viewBox="0 0 100 100" aria-hidden="true">' + pts.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11"/>').join('') + '</svg>';
  }

  /* ---------- popover anchored to a rail button ---------- */
  let popEl = null;
  let popAnchor = null;

  function closePop(silent) {
    if (!popEl) return;
    popEl.remove();
    popEl = null;
    if (popAnchor) popAnchor.setAttribute('aria-expanded', 'false');
    popAnchor = null;
    if (!silent) FK.sound.close();
  }

  function pop(anchor, build) {
    closePop(true);
    const card = h('div', { class: 'pop-card', role: 'dialog' });
    build(card);
    popEl = h('div', { class: 'pop' }, card);
    popEl.addEventListener('pointerdown', (e) => {
      if (e.target === popEl) {
        e.preventDefault();
        closePop();
      }
    });
    document.body.append(popEl);
    popAnchor = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    position();
    FK.sound.open();
  }

  function position() {
    if (!popEl || !popAnchor) return;
    const c = popEl.firstChild;
    c.style.left = '0px';
    c.style.top = '0px';
    const a = popAnchor.getBoundingClientRect();
    const cw = c.offsetWidth;
    const ch = c.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = 10;
    const rail = popAnchor.closest('.rail');
    const row = rail && getComputedStyle(rail).flexDirection === 'row';
    let x;
    let y;
    if (row) {
      x = a.left + a.width / 2 - cw / 2;
      y = a.top > vh / 2 ? a.top - ch - 16 : a.bottom + 16;
    } else {
      y = a.top + a.height / 2 - ch / 2;
      x = a.left < vw / 2 ? a.right + 16 : a.left - cw - 16;
    }
    c.style.left = FK.clamp(x, m, Math.max(m, vw - cw - m)) + 'px';
    c.style.top = FK.clamp(y, m, Math.max(m, vh - ch - m)) + 'px';
  }
  window.addEventListener('resize', position);
  FK.on('screen', () => closePop(true));

  function popTitle(card, text) {
    card.append(h('p', { class: 'pop-title', text }));
  }

  function opt(label, on, onPick) {
    return h('button', { type: 'button', class: 'opt' + (on ? ' on' : ''), 'aria-label': label, onclick: onPick });
  }

  Object.assign(FK.ui, { pencilBox, dice, pop, closePop, popTitle, opt, popPosition: position });
})();
