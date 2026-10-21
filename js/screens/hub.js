/* Farbklecks – Startseite: Klecksi, das Malbuch und die Lernspiele. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  const LOGO_COLORS = ['#e5322d', '#ff8a1f', '#ffd60a', '#8bd448', '#1cc6c6', '#5bc0ff', '#8a4fe0', '#ff4fa3', '#ff8a1f', '#ffd60a'];

  let artCanvas = null;
  let lastPreview = null;

  function open(name, params) {
    if (FK.screenExists(name)) FK.go(name, params);
    else FK.ui.toast('Kommt bald!');
  }

  function tile(o) {
    const t = h('button', { type: 'button', class: 'tile ' + o.cls, 'aria-label': o.title, onclick: () => { FK.sound.tick(); open(o.go); } });
    if (o.art) t.append(h('div', { class: 'tile-art', 'aria-hidden': 'true' }, o.art));
    t.append(h('span', { class: 'tile-title', text: o.title }));
    if (o.sub) t.append(h('span', { class: 'tile-sub', text: o.sub }));
    return t;
  }

  function traceArt() {
    const d = h('div', { class: 'art-trace' });
    d.innerHTML =
      '<svg viewBox="0 0 220 120"><path d="M0 22 H220 M0 98 H220" class="ln"/><path d="M0 60 H220" class="ln mid"/>' +
      '<text x="14" y="98" class="dash">A</text><text x="100" y="98" class="solid">b</text><text x="160" y="98" class="dash">3</text>' +
      '<circle cx="47" cy="24" r="7" class="start"/></svg>';
    return d;
  }

  function readArt() {
    const d = h('div', { class: 'art-read' });
    d.append(h('span', { class: 'card-mini' }, FK.ui.word('Ma-mi')), h('span', { class: 'card-mini emoji', text: '🐭' }));
    return d;
  }

  function dotsArt() {
    const d = h('div', { class: 'art-dots' });
    const pts = [[30, 92], [62, 40], [102, 80], [142, 34], [182, 90]];
    let svg = '<svg viewBox="0 0 210 130"><path d="M30 92 L62 40 L102 80" class="done"/><path d="M102 80 L142 34 L182 90" class="todo"/>';
    pts.forEach((p, i) => {
      svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7"/><text x="' + (p[0] - 6) + '" y="' + (p[1] + (i % 2 ? -14 : 32)) + '">' + (i + 1) + '</text>';
    });
    d.innerHTML = svg + '</svg>';
    return d;
  }

  function smallTile(icon, title, go, cls) {
    const t = h('button', { type: 'button', class: 'tile tile-small ' + (cls || ''), 'aria-label': title, onclick: () => { FK.sound.tick(); open(go); } });
    t.insertAdjacentHTML('beforeend', FK.icon(icon, 'ic tile-ic'));
    t.append(h('span', { class: 'tile-title', text: title }));
    return t;
  }

  function drawPreview() {
    if (!artCanvas) return;
    let pages = FK.art.list().filter((p) => p.cat !== 'punkte' && FK.art.hasLabels(p));
    if (!pages.length) pages = FK.art.list().filter((p) => p.cat !== 'punkte');
    if (!pages.length) return;
    let page = FK.pick(pages);
    if (pages.length > 1 && page === lastPreview) page = FK.pick(pages);
    lastPreview = page;
    const r = artCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(200, Math.round((r.width || 360) * dpr));
    const H = Math.max(150, Math.round((r.height || 270) * dpr));
    artCanvas.width = W;
    artCanvas.height = H;
    FK.art.preview(artCanvas, page, 0.6);
  }

  FK.screen('hub', {
    build(root) {
      const gear = FK.ui.btn({ icon: 'gear', cls: 'btn-round btn-parents', title: 'Für Eltern: gedrückt halten' });
      FK.ui.longPress(gear, 1200, () => { FK.sound.open(); FK.go('parents'); });
      gear.addEventListener('click', () => FK.ui.toast('Für Eltern: Knopf 1 Sekunde gedrückt halten'));

      const logo = h('h1', { class: 'logo', 'aria-label': 'Farbklecks' });
      'Farbklecks'.split('').forEach((ch, i) => {
        logo.append(h('span', { style: { color: LOGO_COLORS[i % LOGO_COLORS.length], '--r': (i % 2 ? 4 : -4) + 'deg' }, text: ch }));
      });
      const mascot = FK.ui.mascot({ cls: 'hub-mascot' });
      mascot.setAttribute('role', 'button');
      mascot.setAttribute('aria-label', 'Klecksi');
      mascot.addEventListener('click', () => {
        const m = FK.ui.mascot({ mood: 'cheer', cls: 'hub-mascot' });
        mascot.innerHTML = m.innerHTML;
        FK.sound.rainbow();
        const r = mascot.getBoundingClientRect();
        FK.fx.burst(r.left + r.width / 2, r.top + r.height / 3);
        clearTimeout(mascot._t);
        mascot._t = setTimeout(() => { mascot.innerHTML = FK.ui.mascot({}).innerHTML; }, 1600);
      });

      artCanvas = h('canvas', { class: 'art-color' });
      const big = tile({ cls: 'tile-big tile-sun', title: 'Ausmalen', sub: 'Mein Malbuch', go: 'book', art: artCanvas });
      big.insertAdjacentHTML('beforeend', FK.icon('crayon', 'ic tile-badge'));

      const grid = h('div', { class: 'hub-grid' },
        big,
        tile({ cls: 'tile-mint', title: 'Schreiben', sub: 'ABC · 123', go: 'trace', art: traceArt() }),
        tile({ cls: 'tile-rose', title: 'Lesen', sub: 'ma · mi · mo', go: 'read', art: readArt() }),
        tile({ cls: 'tile-sky tile-wide', title: 'Punkt zu Punkt', sub: '1 · 2 · 3', go: 'dots', art: dotsArt() }),
        h('div', { class: 'hub-small' },
          smallTile('brush', 'Freies Malen', 'free', 'tile-lilac'),
          smallTile('gallery', 'Meine Bilder', 'gallery'),
          smallTile('album', 'Sammelalbum', 'album', 'tile-apricot')));

      root.append(
        h('header', { class: 'hub-top' }, gear, h('div', { class: 'hub-hero' }, mascot, logo), FK.ui.starCounter()),
        h('div', { class: 'hub-body scroll' }, grid));

      // Words follow the parents' GROSS/normal setting.
      FK.on('settings', (e) => {
        if (e.key !== 'schrift') return;
        const old = root.querySelector('.art-read');
        if (old) old.replaceWith(readArt());
      });
    },
    enter() {
      requestAnimationFrame(drawPreview);
    },
  });
})();
