/* Farbklecks – Freies Malen: Pinsel, Stempel, Spiegel, farbiges Papier. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  const PAPERS = [
    { hex: '#ffffff', name: 'Weiss' },
    { hex: '#1d1b3a', name: 'Nacht' },
    { hex: '#cdeaff', name: 'Himmel' },
    { hex: '#fff1b8', name: 'Sonne' },
    { hex: '#ffd9e8', name: 'Rosa' },
    { hex: '#d4f5e2', name: 'Minze' },
    { hex: '#d8b48a', name: 'Karton' },
  ];
  const MIRRORS = [
    { id: 'off', name: 'Aus', icon: 'mirror-off' },
    { id: 'spiegel', name: 'Spiegel', icon: 'mirror' },
    { id: 'kaleido', name: 'Kaleidoskop', icon: 'kaleido' },
  ];
  const SIZE_INFO = [{ name: 'Klein', dot: 10, r: 5 }, { name: 'Mittel', dot: 18, r: 8 }, { name: 'Gross', dot: 28, r: 12 }, { name: 'Riesig', dot: 42, r: 16 }];

  const saved = FK.settings.get('free.tool') || {};
  const T = {
    kind: ['fill', 'brush', 'stamp', 'eraser'].indexOf(saved.kind) >= 0 ? saved.kind : 'brush',
    brush: FK.BRUSH_ORDER.indexOf(saved.brush) >= 0 ? saved.brush : 'filz',
    colorId: saved.colorId || 'rot',
    size: [0, 1, 2, 3].indexOf(saved.size) >= 0 ? saved.size : 1,
    emoji: saved.emoji || '🐱',
    stickerTab: saved.stickerTab | 0,
    mirror: ['off', 'spiegel', 'kaleido'].indexOf(saved.mirror) >= 0 ? saved.mirror : 'off',
  };
  const persist = () => FK.settings.set('free.tool', T);

  let eng = null;
  let pencils = null;
  let gid = null;
  let saveTimer = 0;
  let loaded = false;
  let loadToken = 0;
  const el = {};

  function applyTool() {
    const c = FK.color.byId(T.colorId) || FK.COLORS[0];
    eng.setTool({ kind: T.kind, brush: T.brush, color: c.hex, rainbow: !!c.rainbow, pattern: 'voll', size: T.size, emoji: T.emoji, mirror: T.mirror });
    document.documentElement.style.setProperty('--cur', c.rainbow ? 'url(#fk-rainbow)' : c.hex);
    el.brush.classList.toggle('on', T.kind === 'brush');
    el.stamp.classList.toggle('on', T.kind === 'stamp');
    el.fill.classList.toggle('on', T.kind === 'fill');
    el.eraser.classList.toggle('on', T.kind === 'eraser');
    el.stamp.querySelector('.emoji').textContent = T.emoji;
    el.size.querySelector('circle').setAttribute('r', SIZE_INFO[T.size].r);
    el.mirror.querySelector('use').setAttribute('href', '#i-' + MIRRORS.find((m) => m.id === T.mirror).icon);
    el.mirror.classList.toggle('on', T.mirror !== 'off');
  }
  function setKind(k) {
    T.kind = k;
    persist();
    applyTool();
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 1500);
  }
  async function save() {
    clearTimeout(saveTimer);
    if (!eng || !eng.W || !loaded) return;
    if (eng.busy) {
      saveTimer = setTimeout(save, 800);
      return;
    }
    const meta = { W: eng.W, H: eng.H, paper: eng.paper, gid };
    const paintP = eng.paintBlob();
    try {
      const paint = await paintP;
      await FK.store.put('free', Object.assign(meta, { paint, t: Date.now() }));
    } catch (e) { /* storage unavailable */ }
  }

  async function snap() {
    eng.settle();
    eng.flash();
    FK.sound.click();
    try {
      const paint = await eng.paintBlob();
      const thumb = await FK.canvasBlob(eng.compose(420), 'image/jpeg', 0.86);
      const now = Date.now();
      const old = await FK.store.getBild(gid).catch(() => null);
      await FK.store.putBild({ id: gid, kind: 'free', name: 'Freies Malen', created: old ? old.created : now, updated: now, W: eng.W, H: eng.H, k: eng.paperScale(), paper: eng.paper, paint, thumb });
      const stars = FK.progress.finish('free', gid, 1);
      save();
      FK.ui.celebrate({ stars, from: el.save });
    } catch (e) {
      FK.sound.nope();
      FK.ui.toast('Hoppla, das ging nicht.');
    }
  }

  function brushPop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Pinsel');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 4 } });
      const c = FK.color.byId(T.colorId) || FK.COLORS[0];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      FK.BRUSH_ORDER.forEach((id) => {
        const br = FK.BRUSHES[id];
        const b = FK.ui.opt(br.name, T.kind === 'brush' && T.brush === id, () => {
          T.brush = id;
          setKind('brush');
          FK.ui.closePop(true);
        });
        const pc = h('canvas', { width: Math.round(72 * dpr), height: Math.round(44 * dpr) });
        FK.brushes.preview(pc, id, c.hex === '#ffffff' && eng.paper === '#ffffff' ? '#d9dcef' : c.hex, !!c.rainbow);
        b.append(pc, h('span', { text: br.name }));
        grid.append(b);
      });
      card.append(grid);
    });
  }
  function sizePop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Grösse');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 4 } });
      SIZE_INFO.forEach((sz, i) => {
        const b = FK.ui.opt(sz.name, T.size === i, () => {
          T.size = i;
          persist();
          applyTool();
          FK.sound.note(3 + i * 2);
          FK.ui.closePop(true);
        });
        b.append(h('span', { class: 'dotbox' }, h('span', { class: 'size-dot', style: { width: sz.dot + 'px', height: sz.dot + 'px' } })), h('span', { text: sz.name }));
        grid.append(b);
      });
      card.append(grid);
    });
  }
  function mirrorPop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Spiegel');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 3 } });
      MIRRORS.forEach((m) => {
        const b = FK.ui.opt(m.name, T.mirror === m.id, () => {
          T.mirror = m.id;
          persist();
          applyTool();
          FK.ui.closePop(true);
        });
        b.innerHTML = FK.icon(m.icon) + '<span></span>';
        b.lastChild.textContent = m.name;
        grid.append(b);
      });
      card.append(grid);
    });
  }
  function paperPop(anchor) {
    FK.ui.pop(anchor, (card) => {
      FK.ui.popTitle(card, 'Neues Blatt');
      const grid = h('div', { class: 'grid-opts', style: { '--cols': 4 } });
      PAPERS.forEach((p) => {
        const b = FK.ui.opt(p.name, false, () => {
          FK.ui.closePop(true);
          gid = 'f' + Date.now().toString(36);
          eng.newPage({ paper: p.hex, keepUndo: true, animate: true });
        });
        b.append(h('span', { class: 'paper-chip', style: { background: p.hex } }), h('span', { text: p.name }));
        grid.append(b);
      });
      card.append(grid);
    });
  }

  FK.screen('free', {
    build(r) {
      el.brush = FK.ui.btn({ icon: 'brush', label: 'Pinsel', onClick: (e) => {
        if (T.kind !== 'brush') setKind('brush');
        brushPop(e.currentTarget);
      } });
      el.stamp = FK.ui.btn({ emoji: T.emoji, label: 'Stempel', onClick: (e) => {
        if (T.kind !== 'stamp') setKind('stamp');
        FK.ui.pop(e.currentTarget, (card) => FK.ui.stickerPicker(card, T, () => {
          setKind('stamp');
          FK.sound.pop();
          FK.ui.closePop(true);
        }, persist));
      } });
      el.fill = FK.ui.btn({ icon: 'bucket', label: 'Eimer', onClick: () => setKind('fill') });
      el.eraser = FK.ui.btn({ icon: 'eraser', label: 'Radierer', onClick: () => setKind('eraser') });
      el.size = FK.ui.btn({ label: 'Grösse', onClick: (e) => sizePop(e.currentTarget) });
      el.size.insertAdjacentHTML('afterbegin', '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="8" fill="#23203d"/></svg>');
      el.mirror = FK.ui.btn({ icon: 'mirror-off', label: 'Spiegel', onClick: (e) => mirrorPop(e.currentTarget) });

      el.undo = FK.ui.btn({ icon: 'undo', label: 'Zurück', onClick: () => {
        FK.ui.closePop(true);
        if (eng.undo()) FK.sound.undo();
        else {
          FK.sound.nope();
          FK.ui.shake(el.undo);
        }
      } });
      el.newp = FK.ui.btn({ icon: 'new', label: 'Neu', onClick: (e) => paperPop(e.currentTarget) });
      el.save = FK.ui.btn({ icon: 'camera', label: 'Speichern', onClick: snap });

      const tools = h('nav', { class: 'rail rail-tools' }, el.brush, el.stamp, el.fill, el.eraser, el.size, el.mirror);
      const actions = h('nav', { class: 'rail rail-actions' }, el.undo, el.newp, el.save);
      const stageHost = h('div', { class: 'cl-stage' });
      pencils = FK.ui.pencilBox({
        onPick: (c) => {
          T.colorId = c.id;
          if (T.kind === 'eraser' || T.kind === 'stamp') T.kind = 'brush';
          persist();
          applyTool();
        },
      });
      r.append(FK.ui.topbar({ title: 'Freies Malen' }), h('div', { class: 'paint-grid' }, tools, stageHost, actions, h('div', { class: 'box-wrap' }, pencils.el)));
      eng = FK.engine.create({ host: stageHost, kind: 'free', onChange: scheduleSave });
      pencils.set(FK.COLORS.slice());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && FK.current() === 'free') save();
      });
    },
    enter(params) {
      pencils.select(T.colorId);
      applyTool();
      loaded = false;
      const token = ++loadToken;
      requestAnimationFrame(async () => {
        eng.fit();
        let rec = null;
        let img = null;
        if (params && params.bild) rec = params.bild;
        else {
          try {
            rec = (await FK.store.get('free')) || (await FK.store.get('current'));
          } catch (e) { /* no storage */ }
        }
        if (rec && rec.paint) {
          try {
            img = await FK.blobToImage(rec.paint);
          } catch (e) { img = null; }
        }
        if (token !== loadToken) return;
        if (img) {
          eng.load({ W: rec.W, H: rec.H, paper: rec.paper }, img);
          gid = (params && params.bild && params.bild.id) || rec.gid || rec.galleryId || 'f' + Date.now().toString(36);
        } else {
          await eng.newPage({ paper: '#ffffff' });
          gid = 'f' + Date.now().toString(36);
        }
        loaded = true;
        if (params && params.bild) save();
      });
    },
    leave() {
      loadToken++;
      FK.ui.closePop(true);
      if (eng.W && loaded) {
        eng.settle();
        Promise.resolve(save()).then(() => { if (FK.current() !== 'free') eng.release(); });
      } else if (FK.current() !== 'free') {
        eng.release();
      }
    },
  });
})();
