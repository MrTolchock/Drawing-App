/* The single games library: the same neighbours, stars and return path as the forest. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h, art = FK.forestArt, model = FK.forestState, story = FK.forestStory;
  let body, resident = 'all', returnTo = 'forest';
  const button = (label, children, fn, cls = '') => h('button', { type:'button', class:'forest-button ' + cls, 'aria-label':label, onclick:fn }, children);
  function launch(screen, game) { FK.sound.tick(); FK.go(screen, { game, lvl:FK.learning.stage(), stage:FK.learning.stage(), level:FK.learning.stage() }); }
  function card(screen, game, id = game.id) {
    const earned = FK.progress.isDone(screen, id + ':' + FK.learning.stage()) || (id==='add' && FK.progress.isDone('expedition','tricks:'+FK.learning.stage()));
    const b = button(game.title, h('span', {}, FK.play.gamePicture(game), h('b', {text:game.title}),
      h('small', {text:game.sub?.[FK.learning.stage()-1] || ''}), earned ? h('span', {class:'play-earned',text:'⭐'}) : null), () => launch(screen, id), 'forest-book-game');
    b.dataset.game = id; return b;
  }
  function tourCard(){
    const state=FK.journey.get(),next=FK.journey.step();
    const begin=()=>{FK.journey.start({stage:FK.learning.stage(),resident});FK.journey.launch();};
    const preview=next?state.tour:null;
    return h('section',{class:'journey-card'},h('div',{class:'journey-card-copy'},art.character('fox'),h('div',{},h('h2',{text:next?'Dein Abenteuer wartet':'Eine kleine Entdeckertour'}),h('p',{text:next?'Dein nächster Halt: '+next.title+' · Stufe '+next.stage:'Drei Spiele, drei Entdeckungen. In deinem Tempo.'}))),
      preview?FK.play.tourPictures(preview):null,
      button(next?'Entdeckertour fortsetzen':'Entdeckertour starten',h('span',{},art.icon(next?'paw':'play'),h('b',{text:next?'Weiterreisen':'Los geht’s'})),begin,'journey-start'));
  }
  function draw() {
    if(FK.friendsLibrary?.active){FK.friendsLibrary.render(body,resident,id=>{resident=id;draw();});return;}
    const tabs = h('nav', {class:'forest-book-neighbours', 'aria-label':'Spiele mit deinen Waldfreunden'});
    for (const [id, label] of Object.entries({all:'Alle',...story.names, atelier:'Malatelier'})) {
      const b = button(id === 'all' ? 'Alle Waldspiele' : id === 'atelier' ? label : 'Mit '+label+' spielen', h('span', {}, id === 'all' ? art.icon('book') : id === 'atelier' ? FK.visual.art('painting') : art.character(id), h('small', {text:label})), () => { resident=id; draw(); }, 'forest-book-neighbour');
      b.setAttribute('aria-pressed', String(id === resident)); tabs.append(b);
    }
    const levels = h('div', {class:'island-levels', role:'group', 'aria-label':'Spielstufe wählen'});
    FK.learning.stages.forEach((label,i) => levels.append(h('button', {type:'button',class:'island-level'+(FK.learning.stage()===i+1?' selected':''), 'aria-pressed':String(FK.learning.stage()===i+1), onclick:() => {FK.settings.set('learning.stage',i+1); draw();}}, h('b',{text:label}),h('span',{text:'Stufe '+(i+1)}))));
    const games = h('div', {class:'forest-book-games'});
    const visible = id => resident === 'all' || FK.play.friends[id] === resident;
    for (const [screen, entries] of [['learn',FK.learning.games],['adventure',FK.adventures.games],['expedition',FK.expeditions.games.filter(g=>g.id!=='tricks')]]) {
      entries.filter(g=>visible(g.id)).forEach(g=>games.append(card(screen,g)));
    }
    [['read','Leseschatz','📖'],['trace','Schreibspuren','✏️'],['dots','Zahlenwege','🔢']].forEach(([id,title,emoji])=>{
      if(visible(id)) games.append(card(id,{id,title,emoji,sub:['Entdecken','Üben','Knobeln']}));
    });
    if(resident === 'all' || resident === 'atelier') {
      [['book','Ausmalen','🎨'],['gallery','Meine Bilder','🖼️'],['album','Waldalbum','⭐']].forEach(([id,title,emoji])=>games.append(card(id,{id,title,emoji})));
    }
    const guided = h('div', {class:'forest-book-games forest-guided-games'});
    if (story.collections[resident] && model.residentAvailable(resident)) {
      for(const pack of story.collections[resident]) guided.append(button(pack.title+' spielen', h('span',{},art.practice(pack.game,resident),h('b',{text:pack.title})),()=>{
        if(model.startPractice(pack.game,resident)) FK.forestActivity.launch(pack.id);
      },'forest-book-game'));
    }
    body.replaceChildren(...[h('section',{class:'play-library-intro'},art.character(resident === 'all' || resident === 'atelier'?'fox':resident),
      h('div',{},h('h2',{text:resident==='all'?'Ein Wald voller Spiele':resident==='atelier'?'Dein Malatelier':'Spielen mit '+story.names[resident]}),h('p',{text:'Spielen. Helfen. Freunde finden.'}))),
      resident==='atelier'?null:tourCard(),tabs, resident==='atelier'?null:levels,h('h3',{class:'journey-free-label',text:resident==='atelier'?'Wähle, was du machen möchtest':'Oder wähle dein eigenes Spiel'}), games, guided.childElementCount ? h('h3',{text:'Noch mehr mit '+story.names[resident]}) : null, guided].filter(Boolean));
  }
  FK.screen('forest-book', {
    build(root) {
      root.classList.add('forest-activity');
      const bar = FK.ui.topbar({title:'Waldspiele',onBack:()=>FK.go(returnTo)});
      const back = bar.querySelector('.btn-back'); back.replaceChildren(art.character('fox')); back.setAttribute('aria-label','Zurück zum Wald');
      bar.append(FK.play.listen(sayText,'Spielebuch erklären'), FK.timerUI.launcher(), FK.ui.settingsButton());
      body = h('div',{class:'forest-book-body scroll'}); root.append(bar,body);
    },
    enter(params) {
      const v2=FK.friendsLibrary?.active;
      if(!v2)FK.forestActivity.recoverRewards();
      returnTo=v2?'friends':'forest';
      const names=v2?window.FriendsContent.hosts:story.names;
      if(params.resident&&(names[params.resident]||params.resident==='atelier'))resident=params.resident;
      else if(params.from==='friends'||!names[resident]&&resident!=='atelier')resident='all';
      const back=body.parentElement.querySelector('.btn-back');
      back.replaceChildren(v2?FK.friendsLibrary.portrait('fox'):art.character('fox'));
      draw();
    },
    leave() { FK.forestVoice.cancel(); },
  });
  function sayText() { if(FK.friendsLibrary?.active)return 'Wähle ein Spielbild. Oder wähle oben einen Freund. Beim Fuchs findest du das Malatelier. Mit dem Pfeil geht es zurück in den Wald.'; return 'Wähle ein Waldspiel. Oder wähle oben einen Freund. Alle Stufen sind offen. Mit dem Fuchs geht es zurück in den Wald.'; }
})();
