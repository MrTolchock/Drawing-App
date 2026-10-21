/* Farbklecks – Meine Bilder: alle gespeicherten Bilder, ansehen, weitermalen, sichern, löschen. */
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

  async function composeRecord(rec) {
    const img = await FK.blobToImage(rec.paint);
    const c = document.createElement('canvas');
    c.width = rec.W;
    c.height = rec.H;
    const g = c.getContext('2d');
    g.fillStyle = rec.paper || '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, 0, 0);
    const page = rec.pageId ? FK.art.find(rec.pageId) : null;
    if (page) {
      const oc = document.createElement('canvas');
      oc.width = rec.W;
      oc.height = rec.H;
      FK.art.renderOutline(oc, page, 4.2 * (rec.k || 2), [35, 32, 61]);
      g.drawImage(oc, 0, 0);
    }
    return c;
  }

  async function share(rec, blob) {
    try {
      if (!blob) blob = await FK.canvasBlob(await composeRecord(rec));
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
    composeRecord(rec).then((c) => FK.canvasBlob(c)).then((b) => {
      full = b;
      const u = URL.createObjectURL(b);
      urls.push(u);
      img.src = u;
    }).catch(() => {});
    const body = h('div', { class: 'viewer-body' }, h('div', { class: 'viewer-frame' }, img));
    if (rec.name) body.append(h('p', { class: 'viewer-name', text: FK.text.word(rec.name) }));
    FK.ui.modal({
      wide: true,
      body,
      actions: [
        { label: 'Weitermalen', icon: 'pencil', cls: 'btn-sun', onClick: () => {
          if (rec.kind === 'color' && rec.pageId && FK.art.find(rec.pageId)) FK.go('color', { pageId: rec.pageId, mode: rec.mode || 'frei', bild: rec });
          else FK.go('free', { bild: rec });
        } },
        { label: 'Sichern', icon: 'share', keepOpen: true, onClick: () => share(rec, full) },
        { label: 'Löschen', icon: 'trash', onClick: async () => {
          const ok = await FK.ui.confirm('Bild wirklich löschen?', 'Ja, löschen', 'Nein');
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
