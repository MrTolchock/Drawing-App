/* Pictured, guided practice collections. The full original library stays linked. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, art = FK.forestArt, model = FK.forestState, story = FK.forestStory;
  let root, body, resident = 'beaver';
  function say() { FK.forestVoice.say('Wähle einen Freund. Dann ein Waldspiel. Mit dem Fuchs gehst du zurück in den Wald.'); }
  const button = (label, children, fn, cls = '') => h('button', { type: 'button', class: 'forest-button ' + cls, 'aria-label': label, onclick: fn }, children);
  function draw() {
    const tabs = h('nav', { class: 'forest-book-neighbours', 'aria-label': 'Mit wem möchtest du spielen?' });
    for (const id of Object.keys(story.names).filter(model.residentAvailable)) {
      const b = button('Mit ' + story.names[id] + ' spielen', art.character(id), () => { resident = id; draw(); FK.sound.tick(); }, 'forest-book-neighbour');
      b.setAttribute('aria-pressed', String(id === resident)); tabs.append(b);
    }
    const games = h('div', { class: 'forest-book-games' });
    for (const pack of story.collections[resident]) {
      const a = model.getActivity(pack.id), resume = a && !a.finished;
      games.append(button(pack.title + (resume ? ' fortsetzen' : ' spielen'), h('span', {}, art.practice(pack.game),
        h('b', { text: pack.title }), h('span', { class: 'forest-book-card-action' }, art.icon(resume ? 'paw' : 'play'))), () => {
        if (model.startPractice(pack.game, resident)) FK.forestActivity.launch(pack.id);
      }, 'forest-book-game'));
    }
    body.replaceChildren(h('h2', { text: 'Gemeinsam entdecken' }), tabs, games,
      button('Alle Spiele öffnen', h('span', {}, art.icon('book'), h('span', { text: 'Alle Spiele' })), () => FK.go('hub'), 'forest-book-all'));
  }
  FK.screen('forest-book', {
    build(element) {
      root = element; root.classList.add('forest-activity');
      const bar = FK.ui.topbar({ title: 'Waldspiele', onBack: () => FK.go('forest') });
      const back = bar.querySelector('.btn-back'); back.replaceChildren(art.character('fox')); back.setAttribute('aria-label', 'Zurück zum Wald');
      bar.append(button('Nochmals hören', art.icon('speaker'), say, 'forest-round'));
      bar.append(FK.timerUI.launcher());
      body = h('div', { class: 'forest-book-body scroll' }); root.append(bar, body);
    },
    enter(params) { FK.forestActivity.recoverRewards(); if (model.residentAvailable(params.resident)) resident = params.resident; if (!model.residentAvailable(resident)) resident = 'beaver'; draw(); say(); },
    leave() { FK.forestVoice.cancel(); },
  });
})();
