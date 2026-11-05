/* Pictured world controls. NPC portraits are rendered from the actual 3D models. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  const paths = {
    eye: '<path d="M4 24q20-25 40 0Q24 49 4 24z" fill="#e9edcf" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="7" fill="currentColor"/><circle cx="26" cy="22" r="2" fill="#fff9e8"/>',
    basket: '<path d="M10 22h28l-4 19H14z" fill="#ddbf87" stroke="currentColor" stroke-width="2.5"/><path d="M15 22q0-24 18 0M18 25v12m6-12v12m6-12v12M13 30h22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    speaker: '<path d="M5 19h10l12-10v30L15 29H5z" fill="currentColor"/><path d="M33 17q7 7 0 14m6-20q13 13 0 26" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    muted: '<path d="M5 19h10l12-10v30L15 29H5z" fill="currentColor"/><path d="m33 18 11 13m0-13L33 31" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
    arrow: '<path d="M8 24h30M27 12l12 12-12 12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    close: '<path d="m13 13 22 22m0-22L13 35" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
    play: '<path d="m18 10 22 14-22 14z" fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="3"/>',
    book: '<path d="M24 12Q13 5 5 10v29q9-4 19 2 10-6 19-2V10q-9-5-19 2z" fill="#f1e3bb" stroke="currentColor" stroke-width="2.5"/><path d="M24 13v27M12 19l7 2m-7 6 7 2m11-8 7-2m-7 10 7-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    paw: '<ellipse cx="25" cy="31" rx="11" ry="9" fill="currentColor"/><ellipse cx="11" cy="22" rx="5" ry="7" transform="rotate(-25 11 22)" fill="currentColor"/><ellipse cx="21" cy="12" rx="5" ry="7" fill="currentColor"/><ellipse cx="33" cy="13" rx="5" ry="7" transform="rotate(20 33 13)" fill="currentColor"/><ellipse cx="41" cy="24" rx="4" ry="6" transform="rotate(30 41 24)" fill="currentColor"/>',
    check: '<path d="m9 25 10 10L40 13" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    hand: '<rect x="5" y="7" width="26" height="24" rx="5" fill="#e5eaca" stroke="currentColor" stroke-width="2"/><path d="M25 41 15 29q-3-5 1-6l7 6V15q0-5 4-4 3 0 3 4v11l3-2 4 3 3 1q5 7-2 15z" fill="#fff7e6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  };
  function icon(name, cls) { return h('span', { class: 'forest-icon ' + (cls || ''), 'aria-hidden': 'true', html: '<svg viewBox="0 0 48 48">' + (paths[name] || paths.paw) + '</svg>' }); }
  function character(id, cls) {
    const src = FK.forestPortraits?.[id];
    if (src) return h('img', { src, alt: '', class: 'forest-portrait ' + (cls || ''), draggable: 'false' });
    return FK.visual.art(id === 'hare' ? 'leaf' : id === 'beaver' ? 'beaver' : id === 'hedgehog' ? 'hedgehog' : 'fox', 'forest-portrait ' + (cls || ''));
  }
  function bridge(complete, cls) {
    const planks = complete ? [10, 19, 28, 37, 46, 55, 64] : [10, 19, 55, 64];
    const timber = planks.map(x => '<path d="M' + x + ' 25v29h8V25z" fill="#dcb77c" stroke="#a17c4d" stroke-width=".8"/>').join('');
    return h('span', { class: 'forest-bridge-picture ' + (cls || ''), 'aria-hidden': 'true', html:
      '<svg viewBox="0 0 84 74"><path d="M25 0Q49 20 30 39T46 74h25Q48 52 58 33T51 0z" fill="#b2d3d4"/>' + timber +
      '<path d="M8 24h14m34 0h18M8 56h14m34 0h18" stroke="#997447" stroke-width="3" stroke-linecap="round"/>' +
      (complete ? '<path d="M22 24h34M22 56h34" stroke="#997447" stroke-width="3"/>' : '') +
      '<path d="M7 20v40m68-40v40" stroke="#ae895b" stroke-width="6" stroke-linecap="round"/></svg>' });
  }
  function rest(complete, cls) {
    return h('span', { class: 'forest-bridge-picture forest-rest-picture ' + (cls || ''), 'aria-hidden': 'true', html:
      '<svg viewBox="0 0 84 74"><ellipse cx="42" cy="49" rx="35" ry="18" fill="#c8d0a0"/><path d="M12 48q29 17 60 0l-4 13q-27 13-52-1z" fill="#a5b17b"/>' +
      (complete ? '<path d="M16 44Q22 18 38 39Q37 11 52 34Q68 20 69 47Q43 66 16 44z" fill="#c7a16b"/><path d="m25 38 10 12m9-22v25m17-17-9 16" stroke="#9c7c50" stroke-width="2"/>' : '<path d="m24 47 13-8m7 12 16-7" stroke="#bca37c" stroke-width="4" stroke-linecap="round"/>') + '</svg>' });
  }
  function scenePicture(complete, resident = 'beaver') { return h('span', { class: 'forest-place-picture' }, character(resident), resident === 'hedgehog' ? rest(complete) : bridge(complete)); }
  FK.forestArt = { icon, character, bridge, rest, scenePicture };
})();
