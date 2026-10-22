/* Farbklecks – Meine Bilder: alle gespeicherten Bilder, ansehen, weitermalen, in die Fotos legen, löschen. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  let gridEl = null;
  let emptyEl = null;
  let urls = [];
  let token = 0;

  function revokeLater() {
    const old = urls;
    urls = [];
    setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 800);
  }

  // The full picture on ONE canvas: outline first (it needs a clear canvas), paint and paper slid beneath.
  async function composeRecord(rec) {
    const img = await FK.blobToImage(rec.paint);
    const c = document.createElement('canvas');
    c.width = rec.W;
    c.height = rec.H;
    const g = c.getContext('2d');
    const page = rec.pageId ? FK.art.find(rec.pageId) : null;
    if (page) FK.art.renderOutline(c, page, 4.2 * (rec.k || 2), [35, 32, 61]);
    g.globalCompositeOperation = 'destination-over';
    g.drawImage(img, 0, 0);
    if (img.close) img.close();
    g.fillStyle = rec.paper || '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = 'source-over';
    return c;
  }

  // PNG of the full picture; the big canvas is given back right away (iOS canvas memory).
  async function recordBlob(rec) {
    const c = await composeRecord(rec);
    try {
      return await FK.canvasBlob(c);
    } finally {
      c.width = c.height = 0;
    }
  }

  async function share(rec, blob) {
    try {
      if (!blob) blob = await recordBlob(rec);
    } catch (e) {
      FK.sound.nope();
      return;
    }
    const name = 'farbklecks-' + new Date(rec.updated || Date.now()).toISOString().slice(0, 10) + '.png';
    const file = window.File ? new File([blob], name, { type: 'image/png' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Mein Farbklecks-Bild' });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function openViewer(rec) {
    const img = h('img', { class: 'viewer-img', alt: rec.name || 'Mein Bild' });
    const thumbUrl = URL.createObjectURL(rec.thumb);
    urls.push(thumbUrl);
    img.src = thumbUrl;
    let full = null;
    recordBlob(rec).then((b) => {
      full = b;
      const u = URL.createObjectURL(b);
      urls.push(u);
      img.src = u;
    }).catch(() => {});
    const body = h('div', { class: 'viewer-body' }, h('div', { class: 'viewer-frame' }, img));
    // the name sits in the title row, so the close X never covers the picture
    FK.ui.modal({
      title: FK.text.word(rec.name || 'Mein Bild'),
      read: true,
      wide: true,
      body,
      actions: [
        { label: 'Weitermalen', icon: 'pencil', cls: 'btn-sun', onClick: () => {
          if (rec.kind === 'color' && rec.pageId && FK.art.find(rec.pageId)) FK.go('color', { pageId: rec.pageId, mode: rec.mode || 'frei', bild: rec });
          else FK.go('free', { bild: rec });
        } },
        { label: 'In Fotos', icon: 'share', keepOpen: true, onClick: () => share(rec, full) },
        { label: 'Löschen', icon: 'trash', onClick: async () => {
          const ok = await FK.ui.confirm(FK.text.word('Bild löschen?'), 'Löschen', 'Behalten', { danger: true, read: true });
          if (!ok) return;
          try {
            await FK.store.deleteBild(rec.id);
          } catch (e) { /* ignore */ }
          FK.sound.swoosh();
          render();
        } },
      ],
    });
  }

  async function render() {
    const t = ++token;
    revokeLater();
    let list = [];
    try {
      list = await FK.store.listBilder();
    } catch (e) { /* no storage */ }
    if (t !== token) return;
    gridEl.innerHTML = '';
    emptyEl.hidden = list.length > 0;
    const fmt = new Intl.DateTimeFormat('de-CH', { day: 'numeric', month: 'long' });
    list.forEach((rec, i) => {
      const img = h('img', { alt: (rec.name || 'Bild') + ' vom ' + fmt.format(new Date(rec.updated || rec.created)) });
      const u = URL.createObjectURL(rec.thumb);
      urls.push(u);
      img.src = u;
      gridEl.append(h('button', {
        type: 'button',
        class: 'card frame-card',
        style: { '--tilt': ((i % 3) - 1) * 1.4 + 'deg' },
        onclick: () => {
          FK.sound.tick();
          openViewer(rec);
        },
      }, img, h('span', { class: 'frame-date', text: fmt.format(new Date(rec.updated || rec.created)) })));
    });
  }

  FK.screen('gallery', {
    build(r) {
      gridEl = h('div', { class: 'gallery-grid' });
      emptyEl = h('div', { class: 'empty', hidden: true });
      emptyEl.innerHTML = FK.icon('camera', 'empty-ic') + '<p>Noch keine Bilder.<br>Mal ein Bild fertig – dann ist es hier!</p>';
      r.append(FK.ui.topbar({ title: 'Meine Bilder' }), h('div', { class: 'scroll gallery-scroll' }, gridEl, emptyEl));
    },
    enter() { render(); },
    leave() {
      token++;
      revokeLater();
    },
  });

  FK.gallery = { composeRecord, share };
})();
