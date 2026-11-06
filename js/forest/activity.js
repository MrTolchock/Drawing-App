/* The same three accessible puzzle adapters serve story and optional collections. */
(function () {
  'use strict';
  const FK = window.FK, model = FK.forestState, art = FK.forestArt, h = FK.h;
  const dative = { beaver: 'Biber', hare: 'Hasen', hedgehog: 'Igel', owl: 'Waldkauz', kingfisher: 'Eisvogel' };
  function backLabel(id) { const def = model.definition(id); return def.practice ? 'Zurück zu den Waldspielen' : 'Zurück zum ' + dative[def.resident]; }
  function picture(id, complete) { const def = model.definition(id); return art.scenePicture(complete, def.resident, def.practice ? 'book' : def.picture); }
  function leave(id) {
    const def = model.definition(id);
    if (def.practice) FK.go('forest-book', { resident: def.resident }, { replace: true });
    else FK.go('forest', { returned: true, quest: id }, { replace: true });
  }
  function launch(id) {
    const def = model.definition(id); if (!def) return false;
    const session = model.getActivity(id) || model.startActivity(id); if (!session) return false;
    FK.go({ pattern: 'learn', treasure: 'forest-memory', robot: 'forest-trail' }[def.game], { forest: true, game: def.game, quest: id }); return true;
  }
  function prepare(root, id) {
    const def = model.definition(id), bar = root.querySelector('.topbar'), back = bar.querySelector('.btn-back');
    back.replaceChildren(picture(id, model.isComplete(id))); back.setAttribute('aria-label', backLabel(id));
    bar.querySelector('.title').textContent = def.practice ? 'Waldspiele' : 'Für den ' + dative[def.resident];
    root.dataset.woodlandPlace = def.resident;
    let context = root.querySelector('.woodland-context');
    if (!context) { context = h('div', { class: 'woodland-context', 'aria-hidden': 'true' }); root.append(context); }
    context.replaceChildren(FK.woodland.vignette(def.resident));
  }
  function finish(body, id) {
    const a = model.getActivity(id), def = model.definition(id); if (!a?.finished) return;
    let earned=0;
    if (!a.rewardRecorded) { earned=FK.progress.finish(def.rewardGroup, def.game + ':1', 1); model.rewardRecorded(id); }
    const root = body.closest('.screen'); prepare(root, id);
    const back = root.querySelector('.btn-back'); back.replaceChildren(picture(id, true));
    body.replaceChildren(h('section', { class: 'forest-round-finish' }, art.icon('check'),
      h('button', { type: 'button', class: 'forest-button forest-scene-return', 'aria-label': backLabel(id), onclick: () => leave(id) },
        h('span', { class: 'woodland-return-scene' }, FK.woodland.vignette(def.resident)), h('span', { class: 'woodland-return-invitation' }, art.character(def.resident), art.icon('arrow'))),
      h('p', { class: 'forest-finish-note', text: def.practice ? 'Schön, dass du weiter entdeckst.' : def.result }),
      def.practice ? null : h('div',{class:'forest-tree-growth'},FK.heartTree.picture(),h('p',{text:'Ein neuer Ast wird grün! '+FK.heartTree.count()+' von 9.'}))));
    FK.ui.celebrate({stars:earned,from:body,text:def.practice?'Gemeinsam geschafft!':'Der Herzbaum wächst!'});
    FK.forestVoice.say(def.practice ? 'Gut gemacht! Im Buch warten noch mehr Waldspiele.' : def.result + ' Ein neuer Ast am Herzbaum wird grün! Komm zurück zu mir.');
  }
  function recoverRewards() {
    const ids = Object.keys(model.quests).concat(Object.values(FK.forestStory.collections).flat().map(pack => pack.id));
    for (const id of ids) {
      const a = model.getActivity(id), def = model.definition(id); if (!a?.finished || a.rewardRecorded) continue;
      if (!FK.progress.isDone(def.rewardGroup, def.game + ':1')) FK.progress.finish(def.rewardGroup, def.game + ':1', 1);
      model.rewardRecorded(id);
    }
  }
  FK.forestActivity = { backLabel, picture, leave, launch, prepare, finish, recoverRewards, dative };
})();
