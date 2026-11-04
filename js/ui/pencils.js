/* Farbtupf – Farbstift-Schachtel und Sprechblasen-Menüs (Popover) für die Mal-Bildschirme. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  function crayonSvg(c) {
    const fill = c.rainbow ? 'url(#fk-rainbow)' : c.hex;
    const band = c.rainbow ? '#ffffff' : FK.color.mix(c.hex, '#000000', 0.25);
    // «slice»: a shorter box cuts the crayon's end (hidden behind the box front) instead of shrinking it
    return '<svg viewBox="0 0 40 120" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' +
      '<path d="M6 37 L20 5 L34 37 Z" fill="#f3c891" stroke="#23203d" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M13.6 19.5 L20 5 L26.4 19.5 Q20 22 13.6 19.5 Z" fill="' + fill + '" stroke="#23203d" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="6" y="35" width="28" height="92" rx="3" fill="' + fill + '" stroke="#23203d" stroke-width="3"/>' +
      '<rect x="10.5" y="40" width="5" height="80" rx="2.5" fill="#ffffff" opacity=".4"/>' +
      '<rect x="7.5" y="58" width="25" height="7" fill="' + band + '" opacity=".6"/>' +
      '</svg>';
  }

  // FK.ui.pencilBox({ onPick(color) }) → { el, set(colors, labels), select(id), button(id), hint(id, text) }
  // labels: optional { colorId: 'text' } shown on a tag at the pencil (numbers, syllables, dice dots).
  // Any labels object (also {}) gives the few big centred pencils of the «Malen nach …» modes.
  // hint(id, text) puts a tag on one pencil later (e.g. the colour word after a wrong fill).
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
      // the free palette wraps into rows of 9 on narrow screens: empty slots complete the last row
      if (!labels) {
        for (let i = list.length % 9 ? 9 - (list.length % 9) : 0; i > 0; i--) el.append(h('span', { class: 'crayon crayon-fill', 'aria-hidden': 'true' }));
      }
      if (selected) select(selected);
    }

    function button(id) {
      return Array.from(el.querySelectorAll('.crayon[data-color]')).find((b) => b.dataset.color === id) || null;
    }

    function hint(id, text) {
      const b = button(id);
      if (!b) return null;
      let tag = b.querySelector('.crayon-tag');
      if (!tag) {
        tag = h('span', { class: 'crayon-tag word' });
        b.append(tag);
      }
      tag.textContent = text;
      b.setAttribute('aria-label', text);
      // long words shrink until they (nearly) fit the pencil's column, never below 12px
      tag.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(tag).fontSize) || 16;
      while (tag.offsetWidth > b.offsetWidth + 8 && fs > 12) {
        fs -= 1;
        tag.style.fontSize = fs + 'px';
      }
      packTags();
      return b;
    }

    // Word tags wider than their pencil must not cover each other (narrow phones): they slide
    // sideways into the room that shorter or missing tags leave, staying inside the box.
    function packTags() {
      const tags = Array.from(el.querySelectorAll('.crayon-tag.word'));
      const box = el.getBoundingClientRect();
      if (!tags.length || !box.width) return;
      const GAP = 3;
      const items = tags.map((t) => {
        t.style.marginLeft = '';
        const r = t.getBoundingClientRect();
        return { t, c: r.left + r.width / 2, w: t.offsetWidth * 1.08, l: 0 }; // room for the chosen tag's 1.08 scale
      }).sort((a, b) => a.c - b.c);
      let total = items.reduce((n, it) => n + it.w + GAP, -GAP);
      // still too wide for the screen: all words get a bit smaller together (never below 12px)
      const room = Math.min(box.width + 24, window.innerWidth - 8);
      for (let k = 0; k < 12 && total > room; k++) {
        let shrunk = false;
        items.forEach((it) => {
          const fs = parseFloat(getComputedStyle(it.t).fontSize) || 12;
          if (fs > 12) {
            it.t.style.fontSize = Math.max(12, fs - 1) + 'px';
            shrunk = true;
          }
          it.w = it.t.offsetWidth * 1.08;
        });
        total = items.reduce((n, it) => n + it.w + GAP, -GAP);
        if (!shrunk) break;
      }
      // each tag as close to its pencil as it can be, without touching its neighbours, inside lo…hi
      const place = (row, lo, hi) => {
        let edge = lo;
        row.forEach((it) => {
          it.l = Math.max(it.c - it.w / 2, edge);
          edge = it.l + it.w + GAP;
        });
        edge = hi;
        for (let i = row.length - 1; i >= 0; i--) {
          const it = row[i];
          if (it.l + it.w > edge) it.l = edge - it.w;
          edge = it.l - GAP;
        }
      };
      items.forEach((it) => { it.t.style.marginBottom = ''; });
      if (total <= box.width - 4) place(items, box.left + 2, box.right - 2);
      else if (total <= room) {
        // too many long words for the box: one tight row, centred, a little wider than the box
        let x = Math.max(4, Math.min(box.left + box.width / 2 - total / 2, window.innerWidth - 4 - total));
        items.forEach((it) => {
          it.l = x;
          x += it.w + GAP;
        });
      } else {
        // not even that: every second word moves up a row (over the pencils)
        const lo = Math.max(4, box.left - 12);
        const hi = Math.min(window.innerWidth - 4, box.right + 12);
        place(items.filter((it, i) => i % 2 === 0), lo, hi);
        const up = items.filter((it, i) => i % 2 === 1);
        place(up, lo, hi);
        up.forEach((it) => { it.t.style.marginBottom = it.t.offsetHeight + 4 + 'px'; });
      }
      items.forEach((it) => {
        const d = it.l + it.w / 2 - it.c;
        if (Math.abs(d) > 0.5) it.t.style.marginLeft = d.toFixed(1) + 'px';
      });
    }
    window.addEventListener('resize', () => {
      if (el.querySelector('.crayon-tag.word')) requestAnimationFrame(packTags);
    });

    function select(id) {
      selected = id;
      el.querySelectorAll('.crayon[data-color]').forEach((b) => {
        const on = b.dataset.color === id;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }

    return { el, set, select, button, hint, get colors() { return colors; } };
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
  // r = pip radius (of 100); small dice on the paper use bigger pips
  function dice(n, r) {
    const pts = DICE[n] || DICE[1];
    return '<svg class="dice" viewBox="0 0 100 100" aria-hidden="true">' + pts.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r || 11) + '"/>').join('') + '</svg>';
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
        FK.ui.eatClick();
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
