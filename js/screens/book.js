/* Farbklecks – Malbuch: Kategorien, Ausmalbilder und die Wahl, wie gemalt wird. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  let root = null;
  let tabsEl = null;
  let gridEl = null;
  let cat = null;
  let urls = [];
  let renderToken = 0;

  function cats() {
    const list = FK.art.CATS.filter((c) => !c.hidden && FK.art.list(c.id).length);
    // finished connect-the-dots pictures can be coloured too
    const dots = FK.art.list('punkte').filter((p) => FK.progress.isDone('dots', p.id));
    if (dots.length) list.push({ id: 'punkte', name: 'Punkt zu Punkt', icon: '✏️' });
    return list;
  }

  function revoke(later) {
    const old = urls;
    urls = [];
    if (later) setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 500);
    else old.forEach((u) => URL.revokeObjectURL(u));
  }

  function modeSample(m) {
    if (m === 'frei') return h('span', { class: 'ms-ic', html: FK.icon('crayon', 'ic') });
    if (m === 'wuerfel') return h('span', { class: 'ms-dice', html: FK.ui.dice(3) });
    if (m === 'zahlen') return h('span', { class: 'ms-read', text: '1 2 3' });
    if (m === 'silben') return h('span', { class: 'ms-read', text: ['Ma', 'mi', 'mo'].map((s) => FK.text.syllable(s)).join(' ') });
    return h('span', { class: 'ms-read ms-words' }, h('b', { style: { color: '#e5322d' }, text: FK.text.word('rot') }), ' ', h('b', { style: { color: '#2f5bea' }, text: FK.text.word('blau') }));
  }

  function chooseMode(page) {
    const idx = (FK.settings.get('color.index') || {})[page.id] || {};
    const body = h('div', { class: 'mode-body' });
    const pic = h('canvas', { class: 'mode-pic', width: 480, height: 360 });
    FK.art.preview(pic, page, 0.5);
    body.append(pic);
    const grid = h('div', { class: 'mode-grid' });
    const modes = FK.art.hasLabels(page) ? FK.COLOR_MODE_ORDER : ['frei'];
    modes.forEach((m) => {
      const done = FK.progress.isDone('color', page.id + ':' + m);
      const started = idx.mode === m || (idx.done && idx.done[m]);
      const b = h('button', {
        type: 'button',
        class: 'mode-btn mode-' + m,
        'aria-label': FK.COLOR_MODES[m].name,
        onclick: () => {
          FK.sound.tick();
          FK.ui.closeModal();
          FK.go('color', { pageId: page.id, mode: m });
        },
      }, modeSample(m), h('span', { class: 'mode-name', text: FK.text.word(FK.COLOR_MODES[m].short) }));
      if (done) b.insertAdjacentHTML('beforeend', FK.icon('star', 'ic mode-star'));
      else if (started) b.append(h('span', { class: 'mode-dot', 'aria-hidden': 'true' }));
      grid.append(b);
    });
    body.append(grid);
    FK.ui.modal({ title: FK.text.word(page.name), read: true, body, wide: true });
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    cats().forEach((c) => {
      tabsEl.append(h('button', {
        type: 'button',
        class: 'cat-tab' + (c.id === cat ? ' on' : ''),
        'aria-label': c.name,
        onclick: () => {
          if (cat === c.id) return;
          cat = c.id;
          FK.sound.page();
          renderTabs();
          renderGrid();
        },
      }, h('span', { class: 'emoji', text: c.icon }), h('span', { class: 'cat-name', text: FK.text.word(c.name) })));
    });
  }

  function renderGrid() {
    revoke();
    const token = ++renderToken;
    gridEl.innerHTML = '';
    gridEl.scrollTop = 0;
    if (gridEl.parentNode) gridEl.parentNode.scrollTop = 0;
    const idx = FK.settings.get('color.index') || {};
    const pages = FK.art.list(cat);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const jobs = [];
    pages.forEach((p, i) => {
      const card = h('button', { type: 'button', class: 'card book-card', 'aria-label': p.name, style: { '--tilt': ((i % 3) - 1) * 1.1 + 'deg' } });
      const c = h('canvas', { width: Math.round(240 * dpr), height: Math.round(180 * dpr) });
      const stars = h('div', { class: 'book-stars' });
      FK.COLOR_MODE_ORDER.forEach((m) => {
        if (FK.progress.isDone('color', p.id + ':' + m)) stars.insertAdjacentHTML('beforeend', FK.icon('star', 'ic'));
      });
      card.append(c, h('span', { class: 'name', text: FK.text.word(p.name) }), stars);
      card.addEventListener('click', () => {
        FK.sound.tick();
        chooseMode(p);
      });
      gridEl.append(card);
      jobs.push(() => {
        const info = idx[p.id];
        if (info) {
          FK.store.get('c:' + p.id + ':' + info.mode).then((rec) => {
            if (token !== renderToken || !rec || !rec.thumb) return FK.art.thumb(c, p);
            const img = new Image();
            const u = URL.createObjectURL(rec.thumb);
            urls.push(u);
            img.className = 'book-thumb';
            img.alt = '';
            img.src = u;
            c.replaceWith(img);
          }).catch(() => FK.art.thumb(c, p));
        } else {
          FK.art.thumb(c, p);
        }
      });
    });
    // draw thumbnails a few at a time so the screen appears immediately
    const run = () => {
      if (token !== renderToken) return;
      const t0 = performance.now();
      while (jobs.length && performance.now() - t0 < 24) jobs.shift()();
      if (jobs.length) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
    fitNames();
  }

  // Long names (SCHMETTERLING, FEUERWEHRAUTO) shrink to fit their card instead of being cut off.
  function fitNames() {
    if (!gridEl) return;
    gridEl.querySelectorAll('.book-card .name').forEach((n) => {
      n.style.fontSize = '';
      const cw = n.clientWidth;
      const sw = n.scrollWidth;
      if (cw > 0 && sw > cw + 1) {
        const fs = parseFloat(getComputedStyle(n).fontSize) || 19;
        n.style.fontSize = Math.max(12, Math.floor((fs * cw) / sw * 10) / 10) + 'px';
      }
    });
  }

  FK.screen('book', {
    build(r) {
      root = r;
      tabsEl = h('nav', { class: 'cat-tabs scroll-x', 'aria-label': 'Kategorien' });
      gridEl = h('div', { class: 'book-grid' });
      r.append(FK.ui.topbar({ title: 'Malbuch' }), tabsEl, h('div', { class: 'scroll book-scroll' }, gridEl));
      const refit = () => { if (FK.current() === 'book') fitNames(); };
      window.addEventListener('resize', refit);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
    },
    enter(params) {
      const list = cats();
      if (params && params.cat && list.some((c) => c.id === params.cat)) cat = params.cat;
      if (!cat || !list.some((c) => c.id === cat)) cat = list.length ? list[0].id : null;
      renderTabs();
      renderGrid();
    },
    leave() {
      renderToken++;
      revoke(true);
    },
  });
})();
