/* Shared, quietly drawn sepia utility icons. Existing symbol IDs stay stable. */
(function () {
  'use strict';
  const icons = {
    brush:'<path d="M19 25 36 5c3-3 7 0 4 3L25 31" fill="#d6b27b"/><path d="M24 27c-12-6-7 14-18 13 14 8 23-4 18-13Z" fill="#8c9c64"/>',
    bucket:'<path d="M10 17C9 3 35 3 35 17M8 18h30l-4 23H12Z" fill="#ead9b7"/><ellipse cx="23" cy="18" rx="15" ry="4" fill="#8fa57a"/><path d="M40 23c-7 9-5 15-1 15s7-5 1-15Z" fill="#8fa57a"/>',
    eraser:'<path d="m8 27 18-20c2-2 4-2 6 0l10 9c2 2 2 4 0 6L24 42H14L8 35c-2-3-2-5 0-8Z" fill="#e6d0ba"/><path d="m17 18 18 16M14 42h27"/>',
    'mirror-off':'<path d="M24 5v38" stroke-dasharray="3 4"/><path d="M18 13C7 5 3 17 8 26l10 10Z" fill="#c3d1ab"/><path d="M30 13c11-8 15 4 10 13L30 36Z" stroke-dasharray="3 4"/>',
    mirror:'<path d="M24 5v38" stroke-dasharray="3 4"/><path d="M18 13C7 5 3 17 8 26l10 10Zm12 0c11-8 15 4 10 13L30 36Z" fill="#bdceab"/>',
    kaleido:'<path d="M24 23C7-2 3 18 21 24 0 39 20 47 24 27c4 20 24 12 3-3C45 18 41-2 24 23Z" fill="#bdceab"/><circle cx="24" cy="24" r="5" fill="#edcd7c"/>',
    undo:'<path d="M17 10 6 20l11 10M7 20h20c20 0 18 22-1 22H16"/>',
    new:'<path d="M10 4h20l9 9v31H10ZM30 4v10h9" fill="#fffaf0"/><path d="M24 22v14m-7-7h14"/>',
    camera:'<rect x="5" y="13" width="38" height="29" rx="6" fill="#e0c8a2"/><path d="m14 13 4-7h12l4 7"/><circle cx="24" cy="27" r="9" fill="#cbdde0"/><circle cx="24" cy="27" r="4"/>',
    gallery:'<rect x="13" y="5" width="30" height="28" rx="3" fill="#f4e4c9"/><rect x="4" y="14" width="31" height="29" rx="3" fill="#fffaf0"/><path d="m8 36 8-10 7 7 5-5 4 8" fill="#b0c3a3"/><circle cx="27" cy="23" r="3" fill="#e9c570"/>',
    close:'<path d="m13 13 22 22m0-22L13 35"/>',
    check:'<path d="m9 25 11 11 21-25"/>',
    share:'<path d="M13 20H7v23h34V20h-6M24 31V4m-10 10L24 4l10 10"/>',
    trash:'<path d="M6 12h36M18 11V5h12v6M11 13l3 30h20l3-30m-18 8v15m10-15v15"/>',
    pencil:'<path d="m6 42 5-15L34 4l10 10-23 23Z" fill="#dfc28f"/><path d="m11 27 10 10m-5-5L39 9M6 42l6-2-4-4"/>',
    sound:'<path d="M6 18h9L26 8v32L15 30H6Z" fill="#ead49c"/><path d="M33 16c5 4 5 12 0 16m5-23c10 8 10 22 0 30"/>',
    pages:'<rect x="8" y="4" width="32" height="40" rx="4" fill="#fffaf0"/><path d="M24 35C6 25 14 13 24 21c10-8 18 4 0 14Z" fill="#d5b194"/>',
    home:'<path d="M4 23 24 5l20 18M10 20v23h28V20" fill="#f0ddbb"/><path d="M20 43V29h9v14"/>',
    back:'<path d="M31 8 15 24l16 16"/>',
    next:'<path d="m17 8 16 16-16 16"/>',
    star:'<path d="m24 4 6 13 14 2-10 10 3 14-13-7-13 7 3-14L4 19l14-2Z" fill="#e5bd5e"/>',
    'star-empty':'<path d="m24 4 6 13 14 2-10 10 3 14-13-7-13 7 3-14L4 19l14-2Z" fill="#f8f3e6" stroke="#b9af92"/>',
    crayon:'<path d="M17 15 24 3l7 12v29H17Z" fill="#cfad77"/><path d="M17 23h14v13H17Z" fill="#f8f0da"/>',
    marker:'<path d="M19 13 24 3l5 10M17 13h14v9H17Zm-1 9h16v22H16Z" fill="#d3b179"/>',
    glitter:'<path d="m8 41 24-24M31 3l3 8 9 3-9 3-3 9-3-9-9-3 9-3Zm9 30 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z" fill="#e4c270"/>',
    pattern:'<rect x="5" y="5" width="38" height="38" rx="6" fill="#faf4e6"/><path d="M24 5v38M5 24h38M8 12h12M8 18h12m9 12 9 9m-9-9 9-9"/><circle cx="33" cy="14" r="4" fill="#a0b189"/><circle cx="14" cy="33" r="4" fill="#d9b66b"/>',
    zoom:'<circle cx="20" cy="20" r="13" fill="#deebeb"/><path d="m30 30 13 13M14 20h12m-6-6v12"/>',
    book:'<path d="M24 12C18 7 9 6 4 9v31c5-3 14-2 20 3 6-5 15-6 20-3V9c-5-3-14-2-20 3Z" fill="#fff7e5"/><path d="M24 12v31M10 18l8 2m-8 7 8 2m12-9 8-2m-8 11 8-2"/>',
    album:'<rect x="8" y="4" width="32" height="40" rx="4" fill="#dce3c6"/><path d="M15 4v40m13-31 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z" fill="#e4c270"/>',
    refresh:'<path d="M40 22a16 16 0 1 0-6 15m-3-15h10V10"/>',
    lock:'<path d="M15 22v-9a9 9 0 0 1 18 0v9"/><rect x="9" y="22" width="30" height="22" rx="4" fill="#e4d1a5"/><path d="M24 30v7"/>',
    gear:'<path d="m20 5-1 6-5 3-6-2-4 7 5 4v5l-4 4 4 7 6-2 5 3 1 5h8l1-6 5-3 6 2 4-7-5-4v-5l4-4-4-7-6 2-5-3-1-5Z" fill="#ece2ca"/><circle cx="24" cy="25" r="7" fill="#fff9eb"/>',
  };
  Object.keys(icons).forEach(id => {
    const symbol = document.getElementById('i-' + id);
    if (symbol) symbol.innerHTML = '<g fill="none" stroke="#75593c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + icons[id] + '</g>';
  });
})();
