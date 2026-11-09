/* Farbtupf – Start der App. */
(function () {
  'use strict';
  const FK = window.FK;

  FK.fx.init();
  FK.timerUI.init();

  // iOS only starts audio from touchend/click, and only shows :active styles when a touchstart listener exists.
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchend', () => FK.sound.unlock(), { passive: true });
  document.addEventListener('click', () => FK.sound.unlock(), true);

  // Keep iOS from zooming, scrolling the page or showing callouts while children play.
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  // Touch scrolling is only allowed inside an element that really can scroll (lists, tab bars, tool rails).
  function canScroll(el) {
    for (; el && el !== document.body; el = el.parentElement) {
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
        const st = getComputedStyle(el);
        if (/(auto|scroll)/.test(st.overflowY + st.overflowX)) return true;
      }
    }
    return false;
  }
  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 1) e.preventDefault();
    else if (!canScroll(e.target)) e.preventDefault();
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (FK.current() === 'friends') return;
      if (document.querySelector('.modal')) { FK.ui.closeModal(); return; }
      if (FK.current() === 'forest') { FK.forestScreen?.closeOverlay(); return; }
      if (FK.current() !== 'hub') FK.back();
    }
  });

  FK.store.persist();
  const entry = new URLSearchParams(location.search).get('screen');
  let started = Promise.resolve();
  if (entry === 'hub' || entry === 'forest') FK.go(entry);
  else started = import('./friends/game.js').catch(error => {
    console.error(error);
    document.getElementById('screens').textContent = 'Der Wald konnte nicht geöffnet werden. Bitte lade die Seite neu.';
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(async (reg) => {
        // An update downloaded during an earlier visit waits (sw.js). Apply it now, at the start, while
        // the child is still in the den; otherwise it waits for the next start.
        await started;
        const waiting = reg.waiting, inDen = FK.current() === 'friends' && FK.friendsView?.().area === 'den';
        if (!waiting || !navigator.serviceWorker.controller || !inDen) return;
        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
        waiting.postMessage('activate');
      }).catch(() => { /* e.g. inside a sandboxed preview */ });
    });
  }
})();
