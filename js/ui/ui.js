/* Farbklecks – Bausteine für alle Bildschirme und der Bildschirm-Wechsel (Router).

   Screens:
     FK.screen('name', {
       build(root) { … },          // once, root = <section class="screen" data-screen="name">
       enter(params) { … },        // every time the screen is shown
       leave() { … },              // when another screen is shown (stop timers, free canvases)
     });
     FK.go('name', params)  – show a screen (keeps a history)
     FK.back()              – previous screen (or the hub)
*/
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  /* ---------- router ---------- */
  const screens = {};
  const stack = [];
  let current = null;

  FK.screen = (name, def) => { screens[name] = { def, root: null }; };

  function rootFor(name) {
    const s = screens[name];
    if (!s.root) {
      s.root = h('section', { class: 'screen screen-' + name, 'data-screen': name, hidden: true });
      document.getElementById('screens').append(s.root);
      if (s.def.build) s.def.build(s.root);
    }
    return s.root;
  }

  FK.go = (name, params, opts) => {
    opts = opts || {};
    if (!screens[name]) throw new Error('unknown screen ' + name);
    FK.ui.closeModal();
    const prev = current;
    if (prev && screens[prev.name].def.leave) screens[prev.name].def.leave();
    if (prev && !opts.replace && !opts.isBack) stack.push(prev);
    // the hub is the root; never keep the target itself on top of the history (e.g. Malbuch → Bild → Malbuch)
    if (name === 'hub') stack.length = 0;
    while (stack.length && stack[stack.length - 1].name === name) stack.pop();
    const root = rootFor(name);
    if (prev && prev.name !== name) {
      const pr = screens[prev.name].root;
      pr.hidden = true;
      pr.classList.remove('in', 'in-back');
    }
    current = { name, params: params || {} };
    root.hidden = false;
    root.classList.remove('in', 'in-back');
    void root.offsetWidth;
    root.classList.add(opts.isBack ? 'in-back' : 'in');
    document.documentElement.dataset.screen = name;
    if (screens[name].def.enter) screens[name].def.enter(params || {});
    FK.emit('screen', current);
  };

  FK.back = () => {
    const prev = stack.pop();
    if (prev) FK.go(prev.name, prev.params, { isBack: true });
    else FK.go('hub', {}, { isBack: true });
  };
  FK.current = () => (current ? current.name : null);
  FK.screenExists = (name) => !!screens[name];

  /* ---------- components ---------- */

  function btn(o) {
    const b = h('button', {
      type: 'button',
      class: 'btn' + (o.cls ? ' ' + o.cls : ''),
      'aria-label': o.title || o.label || null,
      onclick: o.onClick ? (e) => { FK.sound.tick(); o.onClick(e); } : null,
    });
    if (o.icon) b.insertAdjacentHTML('beforeend', FK.icon(o.icon));
    if (o.emoji) b.append(h('span', { class: 'ic emoji', 'aria-hidden': 'true', text: o.emoji }));
    if (o.label) b.append(h('span', { class: 'lbl', text: o.label }));
    return b;
  }

  // o.onClick makes the counter a button (on the hub it opens the Sammelalbum).
  function starCounter(o) {
    o = o || {};
    const el = h(o.onClick ? 'button' : 'div', { class: 'star-count', 'aria-label': 'Sterne' });
    if (o.onClick) {
      el.type = 'button';
      el.addEventListener('click', () => { FK.sound.tick(); o.onClick(); });
    }
    el.innerHTML = FK.icon('star', 'ic star-ic') + '<b></b>';
    const val = el.querySelector('b');
    const set = () => { val.textContent = String(FK.progress.stars()); };
    set();
    FK.on('stars', set);
    return el;
  }

  // Header with a home/back button, a title and the star counter.
  function topbar(o) {
    const bar = h('header', { class: 'topbar' });
    if (o.back !== false) {
      bar.append(btn({
        icon: o.backIcon || 'home',
        cls: 'btn-round btn-back',
        title: o.backTitle || 'Zurück',
        onClick: o.onBack || (() => FK.back()),
      }));
    }
    const t = h('h1', { class: 'title' });
    if (o.title) t.textContent = o.title;
    bar.append(t);
    if (o.extra) o.extra.forEach((e) => bar.append(e));
    if (o.stars !== false) bar.append(starCounter());
    return bar;
  }

  let praiseTimer = 0;
  function praise(text, big) {
    const p = document.getElementById('praise');
    p.textContent = text;
    p.className = 'praise' + (big ? ' big' : '');
    p.hidden = false;
    p.style.animation = 'none';
    void p.offsetWidth;
    p.style.animation = '';
    clearTimeout(praiseTimer);
    praiseTimer = setTimeout(() => { p.hidden = true; }, 2000);
  }

  const PRAISE = ['Mega schön!', 'Bravo!', 'Super gemacht!', 'Wunderschön!', 'Grossartig!', 'Toll!', 'Juhui!', 'Wow!'];

  /* ---------- «Neuer Sticker!» ---------- */
  // A sticker for the Sammelalbum is earned every STARS_PER_STICKER stars. The 'stars' event comes
  // right before a celebration; the new stickers are announced when that celebration is over.
  let newStickers = [];
  FK.on('stars', (e) => {
    if (!e || !(e.added > 0) || !FK.REWARDS) return;
    const per = FK.STARS_PER_STICKER;
    const max = FK.REWARDS.length;
    const before = Math.min(max, Math.floor((e.total - e.added) / per));
    const after = Math.min(max, Math.floor(e.total / per));
    for (let i = before; i < after; i++) newStickers.push(i);
  });
  // stickers the child already saw in the Sammelalbum (or a reset) are not announced again
  FK.on('settings', (e) => {
    if (!e || e.key !== 'album.seen') return;
    const seen = e.value | 0;
    newStickers = seen ? newStickers.filter((i) => i >= seen) : [];
  });

  function stickerMoment() {
    const list = newStickers.slice(-3);
    newStickers = [];
    if (!list.length) return Promise.resolve();
    const title = FK.text.word(list.length > 1 ? 'Neue Sticker!' : 'Neuer Sticker!');
    const row = h('div', { class: 'ns-row n' + list.length });
    list.forEach((i, k) => {
      const st = h('span', { class: 'ns-sticker' }, h('span', { class: 'emoji', text: FK.REWARDS[i][0] }));
      st.style.setProperty('--k', k);
      st.style.setProperty('--tilt', (k % 2 ? 7 : -6) + 'deg');
      row.append(st);
    });
    const name = list.length === 1 ? h('span', { class: 'ns-name', text: FK.text.word(FK.REWARDS[list[0]][1]) }) : null;
    const album = h('span', { class: 'ns-album', html: FK.icon('album', 'ic') });
    const card = h('div', { class: 'ns-card' }, h('b', { class: 'ns-title', text: title }), row, name, album);
    const wrap = h('div', { class: 'new-sticker', role: 'status', 'aria-label': title }, card);
    document.body.append(wrap);
    FK.sound.rainbow();
    return new Promise((resolve) => {
      setTimeout(() => {
        const r = row.getBoundingClientRect();
        FK.fx.burst(r.left + r.width / 2, r.top + r.height / 2);
      }, 350);
      // after a moment the stickers fly into the album book; whatever comes next (end card) may
      // already appear underneath while they fly
      setTimeout(() => {
        const a = album.getBoundingClientRect();
        row.querySelectorAll('.ns-sticker').forEach((st) => {
          const b = st.getBoundingClientRect();
          st.style.setProperty('--dx', a.left + a.width / 2 - (b.left + b.width / 2) + 'px');
          st.style.setProperty('--dy', a.top + a.height / 2 - (b.top + b.height / 2) + 'px');
          st.classList.add('fly');
        });
        if (name) name.classList.add('fade');
        resolve();
      }, 1300);
      setTimeout(() => {
        FK.sound.twinkle();
        bounce(album);
      }, 1850);
      setTimeout(() => {
        wrap.classList.add('out');
        setTimeout(() => wrap.remove(), 260);
      }, 2350);
    });
  }

  // Sound + confetti + praise bubble + stars flying into the counter (+ new sticker). Resolves when done.
  async function celebrate(o) {
    o = o || {};
    const big = !!o.big;
    if (big) FK.sound.fanfare();
    else FK.sound.tada();
    praise(o.text || FK.pick(PRAISE), big);
    FK.fx.confetti(big ? 220 : 140);
    if (big) FK.fx.fireworks(5);
    await FK.wait(450);
    if (o.stars > 0) {
      FK.sound.star();
      await FK.fx.starFly(o.from || null, o.stars);
    } else {
      await FK.wait(700);
    }
    if (newStickers.length) {
      await FK.wait(120);
      await stickerMoment();
    }
  }

  /* ---------- word with Silbenbögen ---------- */
  // FK.ui.word('Ba-na-ne', { highlight: 'B', arcs: true }) – case follows the parents' setting.
  function word(w, o) {
    o = o || {};
    const parts = w.split('-');
    const el = h('span', { class: 'word' + (o.cls ? ' ' + o.cls : ''), 'aria-label': FK.text.word(parts.join('')) });
    let hlDone = !o.highlight;
    parts.forEach((p, i) => {
      const txt = FK.text.word(p);
      const syl = h('span', { class: 'syl syl-' + (i % 2) });
      if (!hlDone) {
        const idx = txt.toLocaleLowerCase('de-CH').indexOf(o.highlight.toLocaleLowerCase('de-CH'));
        if (idx >= 0) {
          hlDone = true;
          syl.append(txt.slice(0, idx), h('span', { class: 'hl', text: txt.slice(idx, idx + o.highlight.length) }), txt.slice(idx + o.highlight.length));
        } else syl.textContent = txt;
      } else syl.textContent = txt;
      if (o.arcs !== false) syl.insertAdjacentHTML('beforeend', '<svg class="arc" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 4 Q50 26 96 4"/></svg>');
      el.append(syl);
    });
    return el;
  }

  /* ---------- mascot «Klecksi» ---------- */
  function mascot(o) {
    o = o || {};
    const cheer = o.mood === 'cheer';
    const el = h('div', { class: 'mascot' + (o.mood ? ' mood-' + o.mood : '') + (o.cls ? ' ' + o.cls : ''), 'aria-hidden': 'true' });
    el.innerHTML =
      '<svg viewBox="0 0 120 120">' +
      '<g class="m-body">' +
      (cheer
        ? '<path class="m-arm" d="M22 60 C12 50 10 38 14 28" /><path class="m-arm" d="M98 60 C108 50 110 38 106 28" />'
        : '<path class="m-arm" d="M22 66 C10 60 6 50 9 44" /><path class="m-arm" d="M98 66 C110 60 114 50 111 44" />') +
      '<path class="m-blob" d="M60 14 C71 14 76 23 85 24 C97 25 108 32 107 46 C106 55 99 57 101 67 C104 79 108 90 97 99 C88 107 77 101 68 107 C59 113 47 114 38 107 C29 100 17 104 12 92 C7 80 17 73 14 63 C12 51 5 42 12 31 C19 20 33 25 40 19 C47 13 50 14 60 14 Z"/>' +
      '<g class="m-eyes"><ellipse cx="45" cy="54" rx="7" ry="9.5"/><ellipse cx="75" cy="54" rx="7" ry="9.5"/>' +
      '<circle class="m-shine" cx="47.5" cy="50.5" r="2.8"/><circle class="m-shine" cx="77.5" cy="50.5" r="2.8"/></g>' +
      '<ellipse class="m-cheek" cx="33" cy="70" rx="7" ry="4.5"/><ellipse class="m-cheek" cx="87" cy="70" rx="7" ry="4.5"/>' +
      (cheer ? '<path class="m-mouth open" d="M44 72 C48 90 72 90 76 72 Z"/>' : '<path class="m-mouth" d="M46 73 C51 84 69 84 74 73"/>') +
      '</g></svg>';
    return el;
  }

  /* ---------- modal ---------- */
  let modalEl = null;
  function closeModal() {
    if (!modalEl) return;
    const m = modalEl;
    modalEl = null;
    if (m._onClose) m._onClose();
    m.remove();
  }

  // A backdrop closes on pointerdown; the click of the same tap must not reach the button underneath.
  function eatClick() {
    const eat = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener('click', eat, true);
    setTimeout(() => document.removeEventListener('click', eat, true), 450);
  }

  // FK.ui.modal({ title, read, body: element, actions: [{ label, icon, cls, onClick }], wide, cls, onClose })
  // read: the title is a word the child reads (Andika). A card with a body and actions is laid out
  // side by side on low phone screens (.split), so the buttons never scroll away.
  function modal(o) {
    closeModal();
    const split = o.body && o.actions && o.actions.length;
    const card = h('div', { class: 'modal-card' + (o.wide ? ' wide' : '') + (split ? ' split' : '') + (o.cls ? ' ' + o.cls : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title || '' });
    if (o.title) card.append(h('h2', { class: 'modal-title' + (o.read ? ' read' : ''), text: o.title }));
    if (o.body) card.append(o.body);
    if (o.actions && o.actions.length) {
      const row = h('div', { class: 'modal-actions' });
      o.actions.forEach((a) => row.append(btn({
        icon: a.icon, label: a.label, cls: 'btn-big ' + (a.cls || ''),
        onClick: () => {
          if (a.keepOpen !== true) {
            // onClose is only for a modal dismissed without choosing an action (X, backdrop, Escape)
            if (modalEl === wrap) wrap._onClose = null;
            closeModal();
          }
          if (a.onClick) a.onClick();
        },
      })));
      card.append(row);
    }
    const close = btn({ icon: 'close', cls: 'btn-round modal-x', title: 'Schliessen', onClick: closeModal });
    card.append(close);
    const wrap = h('div', { class: 'modal' }, card);
    const opened = performance.now();
    wrap.addEventListener('pointerdown', (e) => {
      // a tap that was meant for the button underneath (e.g. a repeated «Fertig») must not close a fresh card
      if (e.target !== wrap || performance.now() - opened < 600) return;
      closeModal();
      eatClick();
    });
    wrap._onClose = o.onClose;
    document.body.append(wrap);
    modalEl = wrap;
    FK.sound.open();
    return { close: closeModal, el: card };
  }

  // danger: the safe answer is the big green one, the destructive one is red with a bin.
  // read: the question is for the child (Andika; the caller passes it through FK.text.word).
  function confirm(text, yesLabel, noLabel, o) {
    o = o || {};
    return new Promise((resolve) => {
      const yes = { label: yesLabel || 'Ja', icon: o.danger ? 'trash' : 'check', cls: o.danger ? 'btn-danger' : '', onClick: () => resolve(true) };
      const no = { label: noLabel || 'Nein', icon: o.danger ? 'check' : 'close', cls: o.danger ? 'btn-go' : '', onClick: () => resolve(false) };
      modal({
        title: text,
        read: o.read,
        actions: o.danger ? [no, yes] : [yes, no],
        onClose: () => resolve(false),
      });
    });
  }

  // Parent gate: an easy multiplication with four big answers. Right → fn(); wrong → just closes,
  // and the gate stays shut for a while, so guessing until it opens takes too long for a child.
  let gateShutUntil = 0;
  function parentGate(fn) {
    if (Date.now() < gateShutUntil) {
      FK.sound.nope();
      toast('Bitte kurz warten');
      return;
    }
    const x = 3 + Math.floor(Math.random() * 7);
    const y = 3 + Math.floor(Math.random() * 7);
    const right = x * y;
    const set = [right];
    const near = [right + x, right - x, right + y, right - y, right + 1, right - 1, right + 10, right - 10];
    while (set.length < 4 && near.length) {
      const v = near.splice(Math.floor(Math.random() * near.length), 1)[0];
      if (v > 0 && set.indexOf(v) < 0) set.push(v);
    }
    set.sort(() => Math.random() - 0.5);
    const grid = h('div', { class: 'gate-grid' });
    const m = modal({
      title: 'Für Eltern',
      cls: 'gate',
      body: h('div', { class: 'gate-body' }, h('p', { class: 'gate-task', text: x + ' × ' + y + ' = ?' }), grid),
    });
    set.forEach((v) => grid.append(btn({
      label: String(v),
      cls: 'gate-ans',
      onClick: () => {
        m.close();
        if (v === right) fn();
        else {
          gateShutUntil = Date.now() + 20000;
          FK.sound.nope();
        }
      },
    })));
  }

  // Calls fn after the element was held for `ms`. Shows a filling ring.
  function longPress(el, ms, fn) {
    let timer = 0;
    const start = (e) => {
      e.preventDefault();
      el.classList.add('holding');
      el.style.setProperty('--hold', ms + 'ms');
      timer = setTimeout(() => {
        el.classList.remove('holding');
        fn();
      }, ms);
    };
    const stop = () => {
      clearTimeout(timer);
      el.classList.remove('holding');
    };
    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointerleave', stop);
    el.addEventListener('pointercancel', stop);
  }

  // Shakes an element (wrong answer) or bounces it (right answer).
  function shake(el) {
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }
  function bounce(el) {
    if (!el) return;
    el.classList.remove('bounce');
    void el.offsetWidth;
    el.classList.add('bounce');
  }

  let toastTimer = 0;
  // o.read: a short message for the child (reading font, GROSS/normal setting)
  function toast(text, ms, o) {
    const t = document.getElementById('toast');
    const read = !!(o && o.read);
    t.textContent = read ? FK.text.word(text) : text;
    t.classList.toggle('read', read);
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms || 2200);
  }

  FK.ui = { btn, topbar, starCounter, praise, celebrate, word, mascot, modal, closeModal, confirm, parentGate, longPress, shake, bounce, toast, eatClick, PRAISE };
})();
