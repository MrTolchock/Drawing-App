/* The same original painted artwork is used by the world and the flat activities. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  const sources = { cast: 'assets/woodland/characters-nature.png', props: 'assets/woodland/forest-props.png' };
  const cells = {
    'fox-right': ['cast', 0, 0], 'fox-left': ['cast', 1, 0], 'fox-away-right': ['cast', 2, 0], 'fox-away-left': ['cast', 3, 0],
    beaver: ['cast', 0, 1], hare: ['cast', 1, 1], hedgehog: ['cast', 2, 1], owl: ['cast', 3, 1],
    kingfisher: ['cast', 0, 2], oak: ['cast', 1, 2], hazel: ['cast', 3, 2],
    leaf: ['cast', 0, 3], nut: ['cast', 1, 3], feather: ['cast', 2, 3],
    reeds: ['props', 0, 0], stones: ['props', 1, 0], grass: ['props', 2, 0], mushrooms: ['props', 3, 0],
    strawberry: ['props', 0, 1], beech: ['props', 1, 1], alder: ['props', 2, 1], log: ['props', 3, 1],
  };
  function art(name, cls = '') {
    if(FK.friendsLibrary?.active){
      const themed=FK.puzzles?.pictures[name];
      if(themed)return FK.visual.art(themed,'woodland-art '+cls);
    }
    const id = { fox: 'fox-right', home: 'oak' }[name] || name;
    const [sheet, column, row] = cells[id] || cells.leaf, rows = sheet === 'cast' ? 4 : 2;
    return h('span', { class: 'woodland-art ' + cls, 'aria-hidden': 'true', 'data-painting': id,
      style: { backgroundImage: 'url("' + sources[sheet] + '")', backgroundSize: '400% ' + rows * 100 + '%',
        backgroundPosition: column / 3 * 100 + '% ' + row / (rows - 1) * 100 + '%' } });
  }
  const places = { home: 0, beaver: 1, hare: 2, hedgehog: 3, owl: 4, kingfisher: 5 };
  function vignette(place = 'home', cls = '') {
    const i = places[place] ?? 0;
    return h('span', { class: 'woodland-vignette ' + cls, 'aria-hidden': 'true', 'data-place': place,
      style: { backgroundPosition: i % 3 * 50 + '% ' + Math.floor(i / 3) * 100 + '%' } });
  }
  const patternName = value => ({ '🔵': 'Blatt', '⭐': 'Haselnuss', '❤️': 'Feder' }[value] || value);
  const pattern = value => art({ '🔵': 'leaf', '⭐': 'nut', '❤️': 'feather' }[value] || 'leaf');
  const treasure = object => art({ Blatt: 'leaf', Feder: 'feather', Pilz: 'mushrooms', Stein: 'stones', Walderdbeere: 'strawberry' }[object.name] || 'leaf');
  function progress(round) {
    return h('div', { class: 'learn-progress woodland-progress', 'aria-label': round + ' von 5 geschafft' },
      Array.from({ length: 5 }, (_, i) => h('span', { class: 'woodland-progress-leaf' + (i < round ? ' done' : '') }, art('leaf'))));
  }
  FK.woodland = { sources, cells, art, vignette, pattern, patternName, treasure, progress };
})();
