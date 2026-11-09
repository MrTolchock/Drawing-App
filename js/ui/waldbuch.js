/* Waldbuch celebration (blueprint 4.4): on a correct answer the tile shows a moss check,
   the page edge glows moss, the current twig item pops, the host hops twice and up to
   twelve painted leaves, flowers and host items burst from the tile. Purely visual: it
   adds classes and a temporary decorative layer, inside the existing advance delay.
   With reduced motion only the static end state (check badge, moss ring) is shown. */
(function () {
  'use strict';
  const FK = window.FK;
  const TILE = '.learn-answer,.learn-button,.ff-answer,.rd-card';
  const PAGE = '.learn-body,.rd-stage,.ff-illustrated-round';
  const HOST = '.play-context>.forest-portrait,.ff-card-top>.ff-card-portrait';
  const TWIG = '.rd-step.cur,.ff-progress>span:not(.done),.woodland-progress-leaf:not(.done)';
  // forest-objects.png cells: leaf, flower, then the host's item (set by data-host on an ancestor).
  const PIECES = ['100% 0%', '100% 33.333%', 'var(--wb-item)'];
  const DURATION = 1500;
  const timers = new WeakMap();

  function flag(el, cls) {
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    clearTimeout(timers.get(el)?.[cls]);
    const t = timers.get(el) || {}; t[cls] = setTimeout(() => el.classList.remove(cls), DURATION); timers.set(el, t);
  }
  function confetti(tile, scope) {
    const r = tile.getBoundingClientRect(); if (!r.width) return;
    const layer = document.createElement('div');
    layer.className = 'wb-confetti'; layer.setAttribute('aria-hidden', 'true');
    const host = scope.closest('[data-host]')?.dataset.host;
    if (host) layer.dataset.host = host;
    layer.style.left = r.left + r.width / 2 + 'px'; layer.style.top = r.top + r.height / 3 + 'px';
    for (let i = 0; i < 12; i++) {
      const piece = document.createElement('i'), angle = -Math.PI * (0.1 + 0.8 * i / 11), dist = 140 + (i * 37) % 120;
      piece.style.backgroundPosition = PIECES[i % 3];
      piece.style.setProperty('--x', Math.round(Math.cos(angle) * dist) + 'px');
      piece.style.setProperty('--y', Math.round(Math.sin(angle) * dist - 40) + 'px');
      piece.style.setProperty('--r', ((i % 2 ? 1 : -1) * (120 + i * 17)) + 'deg');
      piece.style.animationDelay = (i % 4) * 30 + 'ms';
      layer.append(piece);
    }
    document.body.append(layer);
    setTimeout(() => layer.remove(), DURATION);
  }
  function celebrate(tile) {
    if (!tile || !document.documentElement.classList.contains('friends-interface')) return;
    const page = tile.closest(PAGE), scope = tile.closest('.screen,.ff-overlay') || document;
    if (tile.matches(TILE)) flag(tile, 'wb-correct');
    flag(page, 'wb-won');
    flag(page?.querySelector(TWIG), 'wb-pop');
    flag(scope.querySelector(HOST), 'wb-hop');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) confetti(tile, page || scope);
  }
  FK.waldbuch = { celebrate };
})();
