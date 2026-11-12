/* Parent workbench. Previews use the production renderers with an in-memory session. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h,C=FK.puzzleCatalogue,V=FK.puzzleReview;
  let body,selected=null,filter='all',query='',notice='';
  const names={pending:'Offen',approved:'Freigegeben',improve:'Verbessern'};
  const btn=(label,fn)=>FK.ui.btn({label,onClick:fn});
  const statusText=s=>(s.stale?'Geändert · ':'')+names[s.status];
  function download(){const url=URL.createObjectURL(new Blob([JSON.stringify(V.exportData(),null,2)],{type:'application/json'}));h('a',{href:url,download:'farbtupf-puzzle-pruefung.json'}).click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function message(){return h('p',{class:'review-notice',role:'status','aria-live':'polite',text:V.error||notice});}
  function decisionForm(id,iteration,refresh){
    const d=V.status(id,iteration),note=h('textarea',{'aria-label':'Prüfnotiz (optional)',maxlength:4000,rows:2,placeholder:'Optionale Notiz',text:d.decision?.note||''});
    const form=h('section',{class:'review-decision'});
    const feedback=message();
    const decide=value=>{if(V.decide(id,iteration,value,note.value)){notice=FK.reviewRepository?'Lokal gesichert. Der GitHub-Status zeigt die gemeinsame Speicherung.':value==='approved'?'Freigabe gespeichert.':'Entscheidung gespeichert.';refresh();}else feedback.textContent=V.error;};
    const approve=btn(iteration?'Iteration freigeben':'Puzzle freigeben',()=>decide('approved'));
    approve.disabled=iteration?!d.seen:V.progress(id).approved!==V.progress(id).total;
    form.append(h('div',{class:'review-actions'},approve,btn('Verbessern',()=>decide('improve')),btn('Wieder öffnen',()=>decide('pending'))),feedback);
    form.append(FK.reviewConnection.statusLine());
    form.append(h('details',{open:!!d.decision?.note},h('summary',{text:'Notiz hinzufügen (optional)'}),h('label',{},'Prüfnotiz (optional)',note)));
    if(d.decision)form.append(h('small',{text:statusText(d)+' · '+new Date(d.decision.at).toLocaleString('de-CH')}));
    return form;
  }
  function draw(){
    FK.forestVoice.cancel();
    const games=FK.friendsLibrary.catalogue();
    const search=h('input',{type:'search',value:query,placeholder:'Puzzle oder Aufgaben-ID suchen','aria-label':'Puzzle oder Aufgaben-ID suchen'});
    search.addEventListener('change',()=>{query=search.value;draw();});
    const file=h('input',{type:'file',accept:'.json,application/json','aria-label':'Prüfdatei importieren'});
    file.addEventListener('change',async()=>{try{if(!file.files[0])return;if(file.files[0].size>5*1024*1024){notice='Die Prüfdatei ist zu gross.';}else if(V.importData(await file.files[0].text()))notice='Prüfung importiert. Geänderte Inhalte bleiben offen.';}catch{notice='Die Datei konnte nicht gelesen werden.';}draw();});
    const controls=h('div',{class:'review-controls'},btn('Alle Puzzles',()=>{selected=null;draw();}),btn('Prüfung exportieren',download),h('label',{},'Prüfung importieren',file),search);
    const total=games.reduce((a,g)=>a+C.iterations(g.id).length,0),ready=games.filter(g=>V.ready(g.id)).length;
    body.replaceChildren(h('p',{class:'review-intro',text:ready+' / '+games.length+' Puzzles freigegeben · '+total+' einzelne Iterationen. Nur auf GitHub gespeicherte Freigaben sind für Kinder spielbar. Vorschauen verändern keinen Spielstand.'}),FK.reviewConnection.panel(),controls,message());
    if(!selected){
      const grid=h('div',{class:'review-grid'});
      for(const g of games){const p=C.puzzle(g.id),progress=V.progress(g.id);if(query&&!JSON.stringify(p).toLowerCase().includes(query.toLowerCase()))continue;
        const card=btn(g.title,()=>{selected=g.id;filter='all';draw();});card.classList.add('review-puzzle');card.dataset.puzzle=g.id;
        card.replaceChildren(FK.friendsLibrary.portrait(g.host),h('b',{text:g.title}),h('span',{text:p.competence}),h('small',{text:p.reference}),h('span',{class:'review-status '+V.status(g.id).status,text:V.ready(g.id)?'Für Kinder freigegeben':statusText(V.status(g.id))}),h('small',{text:progress.approved+' / '+progress.total+' Iterationen · '+progress.improve+' verbessern'}));grid.append(card);
      }body.append(grid);return;
    }
    const p=C.puzzle(selected),progress=V.progress(selected);
    const speechStatus=h('p',{class:'review-speech-status',role:'status','aria-live':'polite'});
    const speech=FK.ui.btn({icon:'sound',label:'Spielerklärung anhören',onClick:()=>{speechStatus.textContent=FK.forestVoice.explain(p.instruction)?'Spielerklärung wird vorgelesen.':'Die Sprachausgabe ist auf diesem Gerät nicht verfügbar.';}});
    body.append(h('h2',{text:p.title}),h('p',{text:p.competence+' · '+p.reference}),h('p',{text:'Schwierigkeit: '+p.difficulty}),h('p',{text:progress.approved+' / '+progress.total+' freigegeben · '+progress.improve+' verbessern · '+progress.pending+' offen'}),h('section',{class:'review-speech'},h('h3',{text:'Spielerklärung'}),h('p',{text:p.instruction}),speech,speechStatus));
    const tabs=h('nav',{class:'review-actions','aria-label':'Aufgaben filtern'});
    for(const [value,label]of Object.entries({all:'Alle Iterationen',pending:'Offen',improve:'Verbessern',approved:'Freigegeben',stale:'Geändert'})){const b=btn(label,()=>{filter=value;draw();});b.setAttribute('aria-pressed',String(value===filter));tabs.append(b);}
    body.append(tabs);
    const list=h('ol',{class:'review-iterations'});
    for(const it of C.iterations(selected)){
      const s=V.status(selected,it.id);if(filter!=='all'&&(filter==='stale'?!s.stale:s.status!==filter))continue;if(query&&!JSON.stringify(it).toLowerCase().includes(query.toLowerCase()))continue;
      const b=btn('Prüfen: '+it.label,()=>V.preview(selected,it.id));b.dataset.iteration=it.id;
      list.append(h('li',{},h('div',{},h('b',{text:it.label}),h('code',{text:it.id}),h('span',{class:'review-status '+s.status,text:statusText(s)}),s.decision?.note?h('small',{text:s.decision.note}):null),b));
    }
    body.append(list,h('h3',{text:'Puzzle als Ganzes freigeben'}),h('p',{text:'Sobald jede Iteration freigegeben ist, kannst du das Puzzle freigeben. Notizen sind optional.'}),btn('Fünfer-Runde und Feier prüfen',()=>previewRound(selected)),btn('Feier ansehen',()=>previewCelebration(selected)),decisionForm(selected,null,draw));
    const history=V.exportData().history.filter(d=>d.key==='puzzle:'+selected||d.key.startsWith(selected+'/'));
    if(history.length)body.append(h('details',{},h('summary',{text:'Bisherige Entscheidungen ('+history.length+')'}),history.slice().reverse().map(d=>h('p',{text:d.key+' · '+names[d.status]+' · '+d.at+(d.note?' · '+d.note:'')}))));
  }
  function previewRound(id){if(!V.authorized)return;const p=C.puzzle(id);FK.go(p.screen,{game:id,reviewRound:true,returnTo:'puzzle-review',from:'friends'});}
  function previewCelebration(id){const modal=FK.ui.modal({title:'Feier prüfen',body:h('div',{class:'review-celebration'}),actions:[{label:'Schliessen',onClick:()=>FK.ui.closeModal()}]});const target=document.querySelector('.review-celebration');if(target)FK.puzzleUI.completion(target,C.puzzle(id).host,()=>{});}
  function attachPreview(root,id,iteration){
    root.querySelector('.review-preview')?.remove();
    const refresh=()=>attachPreview(root,id,iteration),p=C.puzzle(id),items=C.iterations(id),index=items.findIndex(i=>i.id===iteration);
    const toolbar=h('aside',{class:'review-preview','aria-label':'Erwachsenenvorschau'},h('b',{text:iteration?'Vorschau · '+items[index].label:'Vorschau · Fünfer-Runde (keine Einzelfreigaben)'}),h('small',{text:p.competence+' · '+p.difficulty}),btn('Zur Puzzle-Prüfung',()=>{selected=id;FK.go('puzzle-review');}));
    toolbar.dataset.reviewGame=id;toolbar.dataset.reviewIteration=iteration||'';
    if(iteration){
      toolbar.append(h('code',{text:iteration}),h('div',{class:'review-actions'},btn('Vorherige Iteration',()=>V.preview(id,items[(index+items.length-1)%items.length].id)),btn('Nächste Iteration',()=>V.preview(id,items[(index+1)%items.length].id))),decisionForm(id,iteration,refresh));
      const solution=h('pre',{text:JSON.stringify(items[index].question,null,2)});toolbar.append(h('details',{},h('summary',{text:'Aufgabe und erwartete Lösung'}),solution));
    }
    root.append(toolbar);
  }
  V.attachPreview=attachPreview;
  let queuedRefresh=false;
  FK.on('puzzle-review-change',event=>{
    if(event?.source!=='github'||!event.changed||queuedRefresh)return;
    queuedRefresh=true;requestAnimationFrame(()=>{
      queuedRefresh=false;
      // A remote update must not erase an optional note or search that is still being typed.
      if(document.activeElement?.matches('input,textarea'))return;
      if(FK.current()==='puzzle-review'&&V.authorized)draw();
      else {const toolbar=document.querySelector('.screen:not([hidden]) .review-preview');if(toolbar)attachPreview(toolbar.closest('.screen'),toolbar.dataset.reviewGame,toolbar.dataset.reviewIteration||null);}
    });
  });
  FK.screen('puzzle-review',{
    build(root){root.classList.add('ff-settings-screen');body=h('div',{class:'review-body scroll'});root.append(FK.ui.topbar({title:'Puzzle-Prüfung',stars:false,onBack:()=>FK.go('settings')}),body);},
    enter(){if(!V.authorized){V.open();return;}draw();},
    leave(){notice='';FK.forestVoice.cancel();}
  });
})();
