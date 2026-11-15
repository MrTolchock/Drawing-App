/* Parent workbench. Review uses the production viewport and an isolated open-item queue. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h,C=FK.puzzleCatalogue,V=FK.puzzleReview;
  let body,selected=null,filter='all',notice='';
  const names={pending:'Offen',approved:'Freigegeben',improve:'Verbessern'};
  const btn=(label,fn)=>FK.ui.btn({label,onClick:fn});
  const statusText=s=>(s.stale?'Geändert · ':'')+names[s.status];
  // Opening the page, a puzzle or the overview always starts at the top.
  function toTop(){requestAnimationFrame(()=>{if(body)body.scrollTop=0;window.scrollTo?.(0,0);});if(body)body.scrollTop=0;}
  async function approveAll(id){
    const p=C.puzzle(id);
    if(!await FK.ui.confirm('Alle '+V.progress(id).total+' Iterationen von «'+p.title+'» freigeben?','Alle bestätigen','Abbrechen'))return;
    notice=V.approveAll(id)?'Alle Iterationen von «'+p.title+'» bestätigt. '+(FK.reviewRepository?'Bitte den GitHub-Speicherstatus oben beachten.':''):(V.error||'Bestätigen fehlgeschlagen.');draw();
  }
  function message(){return h('p',{class:'review-notice',role:'status','aria-live':'polite',text:V.error||notice});}
  function draw(){
    FK.forestVoice.cancel();
    const games=FK.friendsLibrary.catalogue();
    const controls=h('div',{class:'review-controls'},btn('Alle Puzzles',()=>{selected=null;draw();toTop();}));
    const total=games.reduce((a,g)=>a+C.iterations(g.id).length,0),ready=games.filter(g=>V.ready(g.id)).length;
    body.replaceChildren(h('p',{class:'review-intro',text:ready+' / '+games.length+' Puzzles freigegeben · '+total+' einzelne Iterationen. Nur auf GitHub gespeicherte Freigaben sind für Kinder spielbar. Vorschauen verändern keinen Spielstand.'}),FK.reviewConnection.panel(),controls,message());
    if(!selected){
      const grid=h('div',{class:'review-grid'});
      for(const g of games){const p=C.puzzle(g.id),progress=V.progress(g.id);
        const card=btn(g.title,()=>{selected=g.id;filter='all';draw();toTop();});card.classList.add('review-puzzle');card.dataset.puzzle=g.id;
        card.replaceChildren(FK.friendsLibrary.portrait(g.host),h('b',{text:g.title}),h('span',{text:p.competence}),h('small',{text:p.reference}),h('span',{class:'review-status '+V.status(g.id).status,text:V.ready(g.id)?'Für Kinder freigegeben':statusText(V.status(g.id))}),h('small',{text:progress.approved+' / '+progress.total+' Iterationen · '+progress.improve+' verbessern'}));grid.append(card);
      }body.append(grid);return;
    }
    const p=C.puzzle(selected),progress=V.progress(selected);
    const speechStatus=h('p',{class:'review-speech-status',role:'status','aria-live':'polite'});
    const speech=FK.ui.btn({icon:'sound',label:'Spielerklärung anhören',onClick:()=>{speechStatus.textContent=FK.forestVoice.explain(p.instruction)?'Spielerklärung wird vorgelesen.':'Die Sprachausgabe ist auf diesem Gerät nicht verfügbar.';}});
    body.append(h('h2',{text:p.title}),h('p',{text:p.competence+' · '+p.reference}),h('p',{text:'Schwierigkeit: '+p.difficulty}),h('p',{text:progress.approved+' / '+progress.total+' freigegeben · '+progress.improve+' verbessern · '+progress.pending+' offen'}),h('section',{class:'review-speech'},h('h3',{text:'Spielerklärung'}),h('p',{text:p.instruction}),speech,speechStatus));
    const tabs=h('nav',{class:'review-actions','aria-label':'Aufgaben filtern'});
    for(const [value,label]of Object.entries({all:'Alle Iterationen',pending:'Offen',improve:'Verbessern',approved:'Freigegeben',stale:'Geändert'})){const b=btn(label,()=>{filter=value;draw();});b.setAttribute('aria-pressed',String(value===filter));tabs.append(b);}
    const all=btn('Alle bestätigen',()=>approveAll(selected));all.classList.add('review-approve-all');all.disabled=V.ready(selected)||(progress.approved===progress.total&&V.status(selected).status==='approved');
    body.append(h('div',{class:'review-start'},btn(progress.approved===progress.total?'Prüfung abschliessen und feiern':'Offene Iterationen prüfen ('+(progress.total-progress.approved)+')',()=>V.start(selected)),all),h('p',{class:'review-flow-help',text:'Richtig lösen gibt die Iteration frei und führt automatisch weiter. × öffnet eine optionale Notiz zum Ablehnen. Alle offenen und zu verbessernden Aufgaben kommen einmal dran; danach feiern wir. Sind alle freigegeben, wird auch das Puzzle freigegeben. «Alle bestätigen» gibt alle Iterationen dieses Puzzles auf einmal frei.'}),tabs);
    const list=h('ol',{class:'review-iterations'});
    for(const it of C.iterations(selected)){
      const s=V.status(selected,it.id);if(filter!=='all'&&(filter==='stale'?!s.stale:s.status!==filter))continue;
      const b=btn('Prüfen: '+it.label,()=>V.preview(selected,it.id));b.dataset.iteration=it.id;
      list.append(h('li',{},h('div',{},h('b',{text:it.label}),h('code',{text:it.id}),h('span',{class:'review-status '+s.status,text:statusText(s)}),s.decision?.note?h('small',{text:s.decision.note}):null),b));
    }
    body.append(list,FK.reviewConnection.statusLine());
    const history=V.exportData().history.filter(d=>d.key==='puzzle:'+selected||d.key.startsWith(selected+'/'));
    if(history.length)body.append(h('details',{},h('summary',{text:'Bisherige Entscheidungen ('+history.length+')'}),history.slice().reverse().map(d=>h('p',{text:d.key+' · '+names[d.status]+' · '+d.at+(d.note?' · '+d.note:'')}))));
  }
  function returnToGallery(id){selected=id;FK.go('puzzle-review');}
  function saveFailure(retry){
    FK.ui.modal({title:'Prüfung nicht gespeichert',body:h('p',{text:V.error||'Bitte erneut versuchen.'}),actions:[
      {label:'Erneut versuchen',onClick:retry},{label:'Zur Puzzle-Prüfung',onClick:()=>returnToGallery(document.querySelector('.screen:not([hidden])')?.dataset.game)}]});
  }
  function attachPreview(root,session,onReject,onPause=()=>{}){
    root.querySelector('.review-reject')?.remove();
    const iteration=session.iterationIds[session.round];root.dataset.reviewIteration=iteration||'';
    if(!iteration)return;
    const reject=h('button',{type:'button',class:'puzzle-button puzzle-listen review-reject','aria-label':'Iteration ablehnen',onclick:()=>{
      if(session.solved)return;
      onPause();
      const note=h('textarea',{'aria-label':'Kommentar (optional)',maxlength:4000,rows:4,placeholder:'Was soll verbessert werden?',text:V.status(session.id,iteration).decision?.note||''});
      const feedback=h('p',{role:'status',class:'review-notice'});
      const modal=FK.ui.modal({title:'Iteration verbessern',cls:'review-rejection',body:h('div',{},h('p',{text:C.iterations(session.id).find(it=>it.id===iteration).label}),h('label',{},'Kommentar (optional)',note),FK.reviewConnection.statusLine(),feedback),actions:[
        {label:'Ablehnen und weiter',keepOpen:true,onClick:()=>{
          if(!V.sessionDecision(session,'improve',note.value)){feedback.textContent=V.error;return;}
          FK.ui.closeModal();onReject();
        }},{label:'Weiter prüfen',onClick:()=>reject.focus()}
      ],onClose:()=>reject.focus()});
      requestAnimationFrame(()=>{if(modal.el.isConnected)note.focus();});
    }},FK.icons.element('close'));
    root.querySelector('.puzzle-context').append(reject);
    const markSeen=()=>{if(!V.visit(session))saveFailure(markSeen);};markSeen();
  }
  function finishPreview(session){
    const all=V.progress(session.id);
    if(!session.reviewResults.includes('improve')&&all.approved===all.total&&!V.finishSession(session)){saveFailure(()=>finishPreview(session));return;}
    notice=all.approved===all.total?'Alle Iterationen geprüft. Puzzle-Freigabe lokal gespeichert. '+(FK.reviewRepository?'Bitte den GitHub-Speicherstatus oben beachten.':''):(all.total-all.approved)+' Iterationen bleiben zur Verbesserung oder Prüfung offen.';
    returnToGallery(session.id);
  }
  V.attachPreview=attachPreview;V.saveFailure=saveFailure;V.finishPreview=finishPreview;
  let queuedRefresh=false;
  FK.on('puzzle-review-change',event=>{
    if(event?.source!=='github'||!event.changed||queuedRefresh)return;
    queuedRefresh=true;requestAnimationFrame(()=>{
      queuedRefresh=false;
      // A remote update must not erase an optional note that is still being typed.
      if(document.activeElement?.matches('input,textarea'))return;
      if(FK.current()==='puzzle-review'&&V.authorized)draw();
    });
  });
  FK.screen('puzzle-review',{
    build(root){root.classList.add('ff-settings-screen');body=h('div',{class:'review-body scroll'});root.append(FK.ui.topbar({title:'Puzzle-Prüfung',stars:false,onBack:()=>FK.go('settings',{},{isBack:true})}),body);},
    enter(){if(!V.authorized){V.open();return;}draw();toTop();},
    leave(){notice='';FK.forestVoice.cancel();}
  });
})();
