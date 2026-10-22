/* Farbtupf – Startseite: Tupfi, das Malbuch und die Lernspiele. */
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  const LOGO_COLORS = ['#e5322d', '#ff8a1f', '#ffd60a', '#8bd448', '#1cc6c6', '#5bc0ff', '#8a4fe0', '#ff4fa3', '#ff8a1f', '#ffd60a'];

  let artCanvas = null;
  let lastPreview = null;
  let albumBadge = null;
  let starDot = null;

  const readSub = () => ['ma', 'mi', 'mo'].map((s) => FK.text.syllable(s)).join(' · ');

  // Pulsing number on the Sammelalbum tile: stickers earned but not yet looked at.
  function updateBadge() {
    if (!albumBadge) return;
    const n = Math.max(0, FK.rewardsUnlocked() - (FK.settings.get('album.seen') | 0));
    albumBadge.textContent = String(n);
    albumBadge.hidden = n === 0;
    albumBadge.closest('.tile').classList.toggle('has-new', n > 0);
    if (starDot) starDot.hidden = n === 0;
  }

  function open(name, params) {
    if (FK.screenExists(name)) FK.go(name, params);
    else FK.ui.toast('Kommt bald!', 0, { read: true });
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

  function mathArt() {
    // a Zehnerfeld with 3 + 4: the way first graders see numbers up to 10 and 20
    const d = h('div', { class: 'art-math' });
    let svg = '<svg viewBox="0 0 210 130"><rect x="20" y="14" width="170" height="70" rx="12" class="field"/><path d="M105 14 V84 M20 49 H190" class="grid"/>';
    for (let i = 0; i < 10; i++) {
      const x = 37 + (i % 5) * 34;
      const y = i < 5 ? 31 : 66;
      if (i < 7) svg += '<circle cx="' + x + '" cy="' + y + '" r="12" class="' + (i < 3 ? 'a' : 'b') + '"/>';
    }
    d.innerHTML = svg + '<text x="105" y="122" text-anchor="middle">3 + 4</text></svg>';
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
    if (artCanvas.width !== W) artCanvas.width = W;
    if (artCanvas.height !== H) artCanvas.height = H;
    FK.art.preview(artCanvas, page, 0.6, null, true);
  }

  FK.screen('hub', {
    build(root) {
      const gear = FK.ui.btn({ icon: 'gear', cls: 'btn-round btn-parents', title: 'Für Eltern: gedrückt halten' });
      // parent gate: hold the gear, then solve a small multiplication
      let held = false; // the click that ends a long press must not show the hint toast
      gear.addEventListener('pointerdown', () => { held = false; });
      FK.ui.longPress(gear, 1200, () => {
        held = true;
        FK.ui.parentGate(() => { FK.sound.open(); FK.go('parents'); });
      });
      gear.addEventListener('click', () => {
        if (!held) FK.ui.toast('Für Eltern: Knopf 1 Sekunde gedrückt halten');
        held = false;
      });

      const logo = h('h1', { class: 'logo', 'aria-label': 'Farbtupf' });
      'Farbtupf'.split('').forEach((ch, i) => {
        logo.append(h('span', { style: { color: LOGO_COLORS[i % LOGO_COLORS.length], '--r': (i % 2 ? 4 : -4) + 'deg' }, text: ch }));
      });
      const mascot = FK.ui.mascot({ cls: 'hub-mascot' });
      mascot.setAttribute('role', 'button');
      mascot.setAttribute('aria-label', 'Tupfi');
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
        tile({ cls: 'tile-rose', title: 'Lesen', sub: readSub(), go: 'read', art: readArt() }),
        tile({ cls: 'tile-apricot', title: 'Rechnen', sub: 'bis 20', go: 'math', art: mathArt() }),
        tile({ cls: 'tile-sky', title: 'Punkt zu Punkt', sub: '1 · 2 · 3', go: 'dots', art: dotsArt() }),
        h('div', { class: 'hub-small' },
          smallTile('brush', 'Freies Malen', 'free', 'tile-lilac'),
          smallTile('gallery', 'Meine Bilder', 'gallery'),
          smallTile('album', 'Sammelalbum', 'album', 'tile-mint')));
      // the badge sits on the album icon like an app badge
      albumBadge = h('span', { class: 'tile-count', 'aria-hidden': 'true', hidden: true });
      const albumIc = grid.querySelector('.tile-small:last-child .tile-ic');
      const icWrap = h('span', { class: 'tile-ic-wrap' });
      albumIc.replaceWith(icWrap);
      icWrap.append(albumIc, albumBadge);

      const stars = FK.ui.starCounter({ onClick: () => open('album') });
      starDot = h('span', { class: 'star-dot', 'aria-hidden': 'true', hidden: true });
      stars.append(starDot);

      root.append(
        h('header', { class: 'hub-top' }, gear, h('div', { class: 'hub-hero' }, mascot, logo), stars),
        h('div', { class: 'hub-body scroll' }, grid));

      // Words follow the parents' GROSS/normal setting.
      FK.on('settings', (e) => {
        if (e.key === 'album.seen') updateBadge();
        if (e.key !== 'schrift') return;
        const old = root.querySelector('.art-read');
        if (old) old.replaceWith(readArt());
        const sub = root.querySelector('.tile-rose .tile-sub');
        if (sub) sub.textContent = readSub();
      });
      FK.on('stars', updateBadge);
    },
    enter() {
      updateBadge();
      requestAnimationFrame(drawPreview);
    },
  });
})();
