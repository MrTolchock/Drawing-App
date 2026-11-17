/* Compatibility for old bookmarks; there is only one games book. */
(function () {
  'use strict';
  window.FK.screen('hub', { enter() { window.FK.go('forest-book', {}, {replace:true}); } });
})();
