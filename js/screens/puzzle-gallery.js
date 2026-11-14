/* Puzzle-Galerie (adults, from settings): every puzzle that is signed off for children, filtered by friend.
   A card plays a normal round of five tasks of that puzzle. Gallery rounds are never saved as the child's round,
   never complete a letter and are not observed by the usage log (FK.puzzleReview.play). The review of puzzles
   is a separate screen, Puzzle-Prüfung (js/screens/puzzle-review.js). */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h,C=FK.puzzleCatalogue,V=FK.puzzleReview;
  let body,friend='all';
  function draw(){
    FK.forestVoice.cancel();
    const games=FK.friendsLibrary.catalogue(),open=games.filter(g=>V.ready(g.id)),hosts=[...new Set(games.map(g=>g.host))];
    const tabs=h('nav',{class:'gallery-friends','aria-label':'Nach Freund filtern'});
    const tab=(id,label,pic,count)=>{const b=h('button',{type:'button',class:'gallery-friend','aria-pressed':String(friend===id),'aria-label':label+' ('+count+')',onclick:()=>{friend=id;draw();}},pic,h('small',{text:label}),h('span',{class:'gallery-count',text:String(count)}));if(!count&&id!=='all')b.disabled=true;return b;};
    tabs.append(tab('all','Alle',FK.visual?.art?.('book')||'',open.length));
    for(const id of hosts)tabs.append(tab(id,C.puzzle(games.find(g=>g.host===id).id)?.hostName||id,FK.friendsLibrary.portrait(id),open.filter(g=>g.host===id).length));
    const shown=open.filter(g=>friend==='all'||g.host===friend);
    body.replaceChildren(h('p',{class:'review-intro',text:open.length+' von '+games.length+' Puzzles sind für Kinder freigegeben. Ein Puzzle antippen spielt eine Runde mit fünf Aufgaben. Galerie-Runden verändern keinen Spielstand und keinen Brief.'}),tabs);
    if(!open.length){body.append(h('p',{class:'gallery-empty',text:'Noch kein Puzzle ist freigegeben. Puzzles werden in der Puzzle-Prüfung geprüft und freigegeben.'}),FK.ui.btn({label:'Zur Puzzle-Prüfung',onClick:()=>V.open()}));return;}
    const grid=h('div',{class:'review-grid gallery-grid'});
    for(const g of shown){const p=C.puzzle(g.id);
      const card=h('button',{type:'button',class:'btn review-puzzle gallery-puzzle','data-puzzle':g.id,'aria-label':g.title+' spielen',onclick:()=>V.play(g.id)},FK.friendsLibrary.portrait(g.host),h('b',{text:g.title}),h('span',{text:p.competence}),h('small',{text:p.hostName}),h('span',{class:'gallery-play',text:'Spielen · 5 Aufgaben'}));
      grid.append(card);}
    body.append(grid);
  }
  FK.screen('puzzle-gallery',{
    build(root){root.classList.add('ff-settings-screen');body=h('div',{class:'review-body scroll'});root.append(FK.ui.topbar({title:'Puzzle-Galerie',stars:false,onBack:()=>FK.go('settings',{},{isBack:true})}),body);},
    enter(){if(!V.authorized){FK.go('settings');return;}draw();},
    leave(){FK.forestVoice.cancel();}
  });
  FK.on?.('puzzle-review-change',()=>{if(FK.current?.()==='puzzle-gallery')draw();});
})();
