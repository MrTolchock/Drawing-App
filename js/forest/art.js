/* Pictured world controls. NPC portraits are rendered from the actual 3D models. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  const paths = {
    undo: '<path d="M17 12 6 22l11 10V12z" fill="currentColor"/><path d="M9 22h18q16 0 13 12-2 8-13 7" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
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
    if (id === 'owl') return h('span', { class: 'forest-portrait forest-owl-fallback ' + (cls || ''), 'aria-hidden': 'true', html: '<svg viewBox="0 0 84 84"><ellipse cx="42" cy="49" rx="24" ry="27" fill="#a38b65"/><circle cx="42" cy="30" r="25" fill="#9b815b"/><circle cx="30" cy="30" r="13" fill="#dfcdab"/><circle cx="54" cy="30" r="13" fill="#dfcdab"/><circle cx="31" cy="30" r="6" fill="#40392c"/><circle cx="53" cy="30" r="6" fill="#40392c"/><path d="m38 37 4 9 5-9" fill="#b6a17d"/></svg>' });
    if (id === 'home') return project('tree', true, 'forest-portrait ' + (cls || ''));
    if (id === 'kingfisher') return h('span', { class: 'forest-portrait forest-owl-fallback ' + (cls || ''), 'aria-hidden': 'true', html: '<svg viewBox="0 0 84 84"><ellipse cx="38" cy="46" rx="18" ry="24" fill="#438fa0"/><ellipse cx="42" cy="50" rx="12" ry="17" fill="#ca975f"/><circle cx="39" cy="25" r="17" fill="#438fa0"/><path d="m52 23 27 8-26 3" fill="#42594f"/><circle cx="45" cy="23" r="3" fill="#313d36"/><path d="m25 57-9 16 17-5" fill="#3a7286"/></svg>' });
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
  function sign(complete, cls) {
    return h('span', { class: 'forest-bridge-picture forest-sign-picture ' + (cls || ''), 'aria-hidden': 'true', html:
      '<svg viewBox="0 0 84 74"><ellipse cx="42" cy="65" rx="30" ry="6" fill="#d4dbad"/><path d="M42 21v45" stroke="#ad8a59" stroke-width="7" stroke-linecap="round"/>' +
      (complete ? '<path d="M16 16h43l14 13-14 13H16z" fill="#dfc08b" stroke="#ab8858" stroke-width="2"/><path d="M34 25q-7-9-11 0-2 6 11 13 13-7 11-13-4-9-11 0" fill="#7e965a"/>' : '<path d="m16 51 40-8 15 10-12 15-40 8z" fill="#ceb17f" transform="translate(0 -5)"/><path d="m35 25 12 6" stroke="#b19465" stroke-width="5"/>') + '</svg>' });
  }
  function project(name, complete, cls) {
    if (name === 'bridge') return bridge(complete, cls);
    if (name === 'rest') return rest(complete, cls);
    if (name === 'sign') return sign(complete, cls);
    if (name === 'book') return icon('book', cls);
    const tree = '<path d="M40 64V32" stroke="#aa895c" stroke-width="8" stroke-linecap="round"/><path d="M23 34q-13-18 3-22 3-15 19-6 21-7 22 12 17 13-1 23-21 15-43-7z" fill="' + (complete ? '#aaba6c' : '#a7ad87') + '"/><path d="M40 24q-7-9-11 0-2 6 11 13 13-7 11-13-4-9-11 0" fill="#e7d49c"/>';
    const images = {
      tree, clearing: '<ellipse cx="42" cy="49" rx="36" ry="21" fill="#e5dab5"/>' + tree,
      water: '<path d="M5 44q18-12 36 0t38 0v20H5z" fill="#accdd0"/><path d="M17 45V17m-5 18 5-5 6 5m44 16V23" stroke="#8ba16b" stroke-width="4"/><path d="M22 52h37" stroke="#c5a16c" stroke-width="' + (complete ? '9' : '3') + '"/>',
      path: '<path d="M9 64Q60 54 34 36T70 8" fill="none" stroke="#d1b781" stroke-width="' + (complete ? '15' : '5') + '" stroke-linecap="round"/><path d="m10 26 7-7m48 38 7-7" stroke="#92a671" stroke-width="9" stroke-linecap="round"/>',
      stories: '<path d="M2 52q20-12 40 0t40 0v20H2z" fill="#b3d0cf"/><path d="M8 32h66M14 32v25m53-25v25" stroke="#b29562" stroke-width="7"/><path d="M30 19q8-5 12 0 7-5 14 0v23q-7-4-14 0-6-4-12 0z" fill="#eee0b4" stroke="#8f9c6c" stroke-width="2"/>',
      bench: '<path d="M10 39h64M16 44v20m52-20v20M16 17v20m52-20v20M14 20h57M14 29h57" stroke="#b59660" stroke-width="' + (complete ? '8' : '4') + '" stroke-linecap="round"/><ellipse cx="42" cy="61" rx="12" ry="6" fill="#a6b781"/>',
      invitation: '<path d="M8 17h68v43H8z" fill="#e8d9aa" stroke="#b9a271" stroke-width="2"/><path d="m10 19 32 26 32-26" fill="none" stroke="#b9a271" stroke-width="2"/><path d="M42 27q-8-10-13 0-2 7 13 15 15-8 13-15-5-10-13 0" fill="#8fa56a"/>',
    };
    return h('span', { class: 'forest-bridge-picture forest-project-picture ' + (cls || ''), 'aria-hidden': 'true', html: '<svg viewBox="0 0 84 74">' + (images[name] || tree) + '</svg>' });
  }
  function scenePicture(complete, resident = 'beaver', picture) { return h('span', { class: 'forest-place-picture' }, character(resident), project(picture || { owl: 'sign', hedgehog: 'rest', kingfisher: 'water' }[resident] || 'bridge', complete)); }
  function practice(game) {
    return h('span', { class: 'forest-practice-picture' }, ...(game === 'pattern' ? ['⭐', '🔵', '⭐'].map(text => h('span', { text })) : game === 'treasure' ? ['🍃', '🪶', '🍓'].map(text => h('span', { text })) : [icon('paw'), icon('arrow')]));
  }
  FK.forestArt = { icon, character, bridge, rest, sign, project, practice, scenePicture };
})();
