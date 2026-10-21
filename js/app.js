/* Farbklecks – Start der App. */
(function () {
  'use strict';
  const FK = window.FK;

  FK.fx.init();

  // iOS only starts audio from touchend/click, and only shows :active styles when a touchstart listener exists.
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchend', () => FK.sound.unlock(), { passive: true });
  document.addEventListener('click', () => FK.sound.unlock(), true);

  // Keep iOS from zooming, scrolling the page or showing callouts while children play.
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('touchmove', (e) => {
    if (!e.target.closest || !e.target.closest('.scroll, .modal-card, .pop-card')) e.preventDefault();
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.querySelector('.modal')) FK.ui.closeModal();
      else if (FK.current() !== 'hub') FK.back();
    }
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* e.g. inside a sandboxed preview */ });
    });
  }

  FK.store.persist();
  FK.go('hub');
})();
