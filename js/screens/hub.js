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
    const heroCards = h('div', { class: 'wa-hero-cards' });
    const homes = [
      ['numbers','Zahlen',() => content.querySelector('#wa-learning').scrollIntoView({ behavior: FK.reduced ? 'auto' : 'smooth', block:'start' })],
      ['words','Wörter',() => launch('read',{lvl:stage})],
      ['nature','Natur',() => launch('learn',{game:'nature'})],
      ['shapes','Formen',() => launch('adventure',{game:'shapes'})],
      ['painting','Malen',() => launch('book')],
      ['pictures','Meine Bilder',() => launch('gallery')],
    ];
    homes.forEach(([art,label,fn]) => heroCards.append(h('button', { type:'button',class:'wa-home-card',onclick:fn }, FK.visual.art(art),h('span',{text:label}))));
    const welcome = h('section', { class:'wa-welcome', 'aria-label':'Willkommen im Waldatelier' },
      h('div',{class:'wa-hero-head'},h('p',{class:'wa-kicker',text:'Dein kleines Waldatelier'}),h('h1',{class:'wa-wordmark',text:'Farbtupf'}),h('p',{text:'Was möchtest du entdecken?'})),heroCards);
    const levels = h('div', { class: 'island-levels', role: 'group', 'aria-label': 'Trimester wählen' });
    FK.learning.stages.forEach((s, i) => levels.append(h('button', { type: 'button', class: 'island-level' + (stage === i + 1 ? ' selected' : ''), 'aria-pressed': String(stage === i + 1), onclick: () => { FK.settings.set('learning.stage', i + 1); render(); } }, h('b', { text: s }), h('span', { text: (i + 1) + '. Trimester' }))));
    const grid = h('div', { class: 'island-grid' });
    FK.learning.games.forEach(g => grid.append(card(g.emoji, g.title, g.sub[stage - 1], g.color, () => launch('learn', { game: g.id }), FK.progress.isDone('learn', g.id + ':' + stage))));
    grid.append(card('📖', 'Leseschatz', ['Kurze Wörter', 'Silben verbinden', 'Wörter entdecken'][stage - 1], 'lilac', () => launch('read', { lvl: stage })),
      card('👆', 'Schreibspuren', ['Erste Spuren', 'Mehr Buchstaben', 'Alle Zeichen'][stage - 1], 'apricot', () => launch('trace', { stage })),
      card('🔢', 'Zahlenwege', 'Punkt zu Punkt · Stufe ' + stage, 'sky', () => launch('dots', { level: stage })));
    const adventures = h('div', { class: 'island-grid' });
    FK.adventures.games.forEach(g => adventures.append(card(g.emoji, g.title, g.sub[stage - 1], g.color, () => launch('adventure', { game: g.id }), FK.progress.isDone('adventure', g.id + ':' + stage))));
    adventures.append(card('🎨', 'Kreativmissionen', FK.missions.length + ' Ideen zum Malen & Entdecken', 'lilac', () => launch('missions')));
    const expeditions = h('div', { class: 'island-grid' });
    FK.expeditions.games.forEach(g => expeditions.append(card(g.emoji, g.title, g.sub[stage - 1], g.color, () => launch('expedition', { game: g.id }), FK.progress.isDone('expedition', g.id + ':' + stage))));
    const extras = h('div', { class: 'island-extras' },
      card('🎨', 'Malatelier', 'Ausmalen', 'sun', () => launch('book')),
      card('🖐️', 'Freies Malen', 'Mit dem Finger', 'mint', () => launch('free')),
      card('🖼️', 'Meine Bilder', 'Deine Sammlung', 'rose', () => launch('gallery')),
      card('🌟', 'Sammelalbum', 'Deine Sticker', 'lilac', () => { FK.settings.set('album.seen', FK.rewardsUnlocked()); launch('album'); }));
    content.append(welcome,h('div',{class:'wa-section-heading',id:'wa-learning'},h('div',{},h('p',{class:'wa-kicker',text:'In deinem Tempo'}),h('h2', { class: 'island-heading', text: 'Deine Lerninsel' })),h('p', { class: 'island-intro', text: 'Spielen, staunen, ausprobieren.' })), levels, grid,
      h('p', { class: 'island-note', text: 'Wähle, was zu dir passt. Alle Stufen sind offen.' }),
      h('h2', { class: 'island-heading', text: 'Forschen & Knobeln' }), h('p', { class: 'island-intro', text: 'Sieben neue Spiele: Schätze merken, Spiegelbilder bauen und Rechenfreunde finden.' }), expeditions,
      h('h2', { class: 'island-heading', text: 'Neue Entdecker-Abenteuer' }), h('p', { class: 'island-intro', text: 'Teilen, trommeln, tüfteln – und eigene Bilder erfinden.' }), adventures,
      h('h2', { class: 'island-heading', text: 'Kreativpause & Schätze' }), extras);
  }
  FK.screen('hub', {
    build(root) {
      const gear = FK.ui.btn({ icon: 'gear', cls: 'btn-round btn-parents', title: 'Für Eltern: gedrückt halten' });
      FK.ui.longPress(gear, 1200, () => FK.ui.parentGate(() => FK.go('parents')));
      root.append(h('header', { class: 'island-header' }, gear, FK.ui.starCounter({ onClick: () => launch('album') })));
      content = h('div', { class: 'island-body scroll' }); root.append(content);
    },
    enter: render,
  });
})();
