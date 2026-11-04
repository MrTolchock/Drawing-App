/* Farbtupf: learning comes first; drawing remains a creative companion. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  let content;
  function launch(name, params) { FK.sound.tick(); FK.go(name, params); }
  function card(emoji, title, sub, color, fn, done) {
    return h('button', { type: 'button', class: 'island-card tile-' + color, onclick: fn },
      h('span', { class: 'island-emoji', 'aria-hidden': 'true', text: emoji }),
      h('span', { class: 'island-card-title', text: title }), h('span', { class: 'island-sub', text: sub }),
      done ? h('span', { class: 'island-earned', 'aria-label': 'Stern verdient', text: '⭐' }) : null);
  }
  function render() {
    const stage = FK.learning.stage(); content.replaceChildren();
    const levels = h('div', { class: 'island-levels', role: 'group', 'aria-label': 'Trimester wählen' });
    FK.learning.stages.forEach((s, i) => levels.append(h('button', { type: 'button', class: 'island-level' + (stage === i + 1 ? ' selected' : ''), 'aria-pressed': String(stage === i + 1), onclick: () => { FK.settings.set('learning.stage', i + 1); render(); } }, h('b', { text: s }), h('span', { text: (i + 1) + '. Trimester' }))));
    const grid = h('div', { class: 'island-grid' });
    FK.learning.games.forEach(g => grid.append(card(g.emoji, g.title, g.sub[stage - 1], g.color, () => launch('learn', { game: g.id }), FK.progress.isDone('learn', g.id + ':' + stage))));
    grid.append(card('📖', 'Leseschatz', ['Kurze Wörter', 'Silben verbinden', 'Wörter entdecken'][stage - 1], 'lilac', () => launch('read', { lvl: stage })),
      card('👆', 'Schreibspuren', ['Erste Spuren', 'Mehr Buchstaben', 'Alle Zeichen'][stage - 1], 'apricot', () => launch('trace', { stage })),
      card('🔢', 'Zahlenwege', 'Punkt zu Punkt · Stufe ' + stage, 'sky', () => launch('dots', { level: stage })));
    const extras = h('div', { class: 'island-extras' },
      card('🎨', 'Malatelier', 'Ausmalen', 'sun', () => launch('book')),
      card('🖐️', 'Freies Malen', 'Mit dem Finger', 'mint', () => launch('free')),
      card('🖼️', 'Meine Bilder', 'Deine Sammlung', 'rose', () => launch('gallery')),
      card('🌟', 'Sammelalbum', 'Deine Sticker', 'lilac', () => { FK.settings.set('album.seen', FK.rewardsUnlocked()); launch('album'); }));
    content.append(h('h2', { class: 'island-heading', text: 'Deine Lerninsel' }), h('p', { class: 'island-intro', text: 'Spielen, staunen, ausprobieren. Mit deinem Finger!' }), levels, grid,
      h('p', { class: 'island-note', text: 'Wähle, was zu dir passt. Alle Stufen sind offen.' }), h('h2', { class: 'island-heading', text: 'Kreativpause & Schätze' }), extras);
  }
  FK.screen('hub', {
    build(root) {
      const gear = FK.ui.btn({ icon: 'gear', cls: 'btn-round btn-parents', title: 'Für Eltern: gedrückt halten' });
      FK.ui.longPress(gear, 1200, () => FK.ui.parentGate(() => FK.go('parents')));
      root.append(h('header', { class: 'island-header' }, gear, h('h1', { class: 'island-logo', text: 'Farbtupf' }), FK.ui.starCounter({ onClick: () => launch('album') })));
      content = h('div', { class: 'island-body scroll' }); root.append(content);
    },
    enter: render,
  });
})();
