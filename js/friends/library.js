/* V2 uses the original illustrated activities, with its own hosts and one level.
   Legacy story/book entry points and their saved difficulty remain independent. */
(function () {
  'use strict';
  const FK=window.FK, h=FK.h;
  const hosts={count:'squirrel',add:'squirrel',rocket:'squirrel',neighbours:'squirrel',compare:'squirrel',tricks:'squirrel',picnic:'squirrel',
    rhyme:'bird',syllable:'bird',nature:'bird',read:'mouse',vowels:'mouse',trace:'mouse',
    pattern:'owl',sequence:'owl',treasure:'owl',survey:'owl',robot:'beaver',double:'beaver',mirror:'beaver',shapes:'beaver',dots:'beaver'};
  const rounds={squirrel:['Nüsse zählen','forest-nut'],bird:['Reimpaare lesen','words'],owl:['Lies und zeig','book'],beaver:['Welche Form fehlt?','shapes'],mouse:['Wörter und Bilder','mouse-sit']};
  function portrait(id){
    const pic=FK.friendsArt.portrait(id);pic.classList.add('forest-portrait');return pic;
  }
  function catalogue(){
    return [['learn',FK.learning.games],['adventure',FK.adventures.games],['expedition',FK.expeditions.games.filter(g=>g.id!=='tricks')]]
      .flatMap(([screen,games])=>games.map(g=>({...g,title:FK.puzzles.names[g.id]||g.title,picture:FK.puzzles.icons[g.id],screen,host:hosts[g.id]})))
      .concat(FK.puzzles.reading,[['trace','Schreibspuren','✏️'],['dots','Zahlenwege','🔢']].map(([id,title,emoji])=>({id,screen:id,title,emoji,host:hosts[id]})));
  }
  function launch(g){FK.go(g.screen,{game:g.id,stage:1,lvl:1,level:1,...g.params});}
  function render(body,resident,select){
    const button=(label,pic,fn,cls)=>h('button',{type:'button',class:'forest-button '+cls,'aria-label':label,onclick:fn},pic);
    const tabs=h('nav',{class:'forest-book-neighbours ff-library-tabs','aria-label':'Spiele mit deinen Waldfreunden'});
    for(const [id,label]of Object.entries({all:'Alle',...Object.fromEntries(Object.entries(window.FriendsContent.hosts).map(([id,v])=>[id,v.name])),atelier:'Malatelier'})){
      const b=button(id==='all'?'Alle Waldspiele':id==='atelier'?label:'Mit '+label+' spielen',h('span',{},id==='all'?FK.visual.art('book'):id==='atelier'?FK.visual.art('painting'):portrait(id),h('small',{text:label})),()=>select(id),'forest-book-neighbour');
      b.setAttribute('aria-pressed',String(id===resident));tabs.append(b);
    }
    const games=h('div',{class:'forest-book-games'});
    function card(id,title,pic,fn,owner){
      const b=button(title,h('span',{},pic,h('b',{text:title}),owner?h('small',{class:'ff-library-host'},portrait(owner),window.FriendsContent.hosts[owner].name):null),fn,'forest-book-game');
      b.dataset.game=id;games.append(b);
    }
    for(const [id,[title,pic]]of Object.entries(rounds))if(resident==='all'||resident===id)
      card('friends-'+id,title,FK.visual.art(pic),()=>FK.friendsStartRound(id),id);
    for(const g of catalogue())if(resident==='all'||resident===g.host)
      card(g.id,g.title,FK.play.gamePicture(g),()=>launch(g),g.host);
    if(resident==='all'||resident==='atelier'){
      for(const [id,title,pic]of [['book','Ausmalen','painting'],['gallery','Meine Bilder','pictures']])
        card(id,title,FK.visual.art(pic),()=>FK.go(id));
    }
    body.replaceChildren(h('section',{class:'play-library-intro'},portrait(resident==='all'||resident==='atelier'?'fox':resident),h('div',{},h('h2',{text:resident==='atelier'?'Dein Malatelier':resident==='all'?'Ein Wald voller Spiele':'Spielen mit '+window.FriendsContent.hosts[resident].name}),h('p',{text:resident==='atelier'?'Ausmalen und Bilder sammeln.':'Wähle ein Bild und spiele mit.'}))),tabs,games);
  }
  FK.friendsLibrary={active:false,hosts,portrait,catalogue,render,launch};
})();
