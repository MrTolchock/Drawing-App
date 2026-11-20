/* Parent workbench. Review uses the production viewport and an isolated open-item queue. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h,C=FK.puzzleCatalogue,V=FK.puzzleReview;
  let body,backButton,selected=null,filter='all',notice='',displayedNotes='',displayedRelease='';
  const drafts=new Map();
  // Describe the bounded practice in this puzzle; these are explanations, not curriculum quotations.
  const competences={
    'colour-words':'Das Kind liest ein Farbwort im Satz und ordnet es der passenden gezeichneten Blume zu.',
    'shape-match':'Das Kind erkennt Kreis, Dreieck, Quadrat und Rechteck in unterschiedlichen Lagen wieder.',
    'friends-squirrel':'Das Kind zählt abgebildete Nüsse bis 20 und nutzt Vierer- oder Fünferreihen, um Mengen zu überblicken.',
    'friends-bird':'Das Kind liest vertraute Wörter und erkennt an ihrem Klang, welche Wörter sich reimen.',
    'friends-owl':'Das Kind liest einen kurzen Satz, versteht die beschriebene Handlung und wählt das passende Tierbild.',
    'friends-beaver':'Das Kind vergleicht die ersten zwei Reihen mit zwei oder drei verschiedenen Waldgegenständen. Es ergänzt die dritte Reihe so, dass die Mengen wieder stimmen.',
    'friends-mouse':'Das Kind liest ein vertrautes Nomen und verbindet das gelesene Wort mit dem passenden Bild.',
    'friends-hedgehog':'Das Kind versteht kurze Tierfragen und ordnet Merkmale, Tierlaute und bekannte Verhaltensweisen dem passenden Tier zu.',
    'friends-deer':'Das Kind liest Naturfragen und ordnet Tieren passende Lebensräume oder Nahrung zu.',
    'friends-kingfisher':'Das Kind zählt unterschiedliche Gegenstände am Bach und bestimmt ihre Anzahl bis 20.',
    'friends-frog':'Das Kind liest Tiernamen und erkennt, welches Tierbild zum gelesenen Wort gehört.',
    'friends-ibex':'Das Kind erkennt wiederkehrende Gruppen aus Berg- und Waldgegenständen und ergänzt ein fehlendes Bild innerhalb oder am Ende des Musters.',
    'friends-badger':'Das Kind liest kurze Naturfragen und erkennt Zusammenhänge bei Pflanzenwachstum, Wetter und Entwicklung.',
    count:'Das Kind unterscheidet Marienkäfer von anderen kleinen Tieren und zählt gezielt nur die gesuchte Menge.',
    add:'Das Kind fasst zwei sichtbare Gruppen zu einer Gesamtmenge zusammen und bestimmt ihre Summe bis 10.',
    pattern:'Das Kind erkennt die wiederkehrende Einheit eines Musters und setzt die Folge nach derselben Regel fort.',
    nature:'Das Kind liest einen kurzen Hinweis und findet das passende Tierbild.',
    rocket:'Das Kind vergleicht besetzte mit freien Plätzen und bestimmt, wie viele bis zur Gesamtmenge von 5 bis 10 fehlen.',
    picnic:'Das Kind verteilt Beeren einzeln auf zwei bis vier Freunde, bis alle gleich viele erhalten haben.',
    syllable:'Das Kind erkennt die Sprechsilben eines vertrauten Bildworts und bestimmt, ob das Wort eine, zwei oder drei Silben hat.',
    robot:'Das Kind plant eine Folge benachbarter Schritte auf einem Raster, um ein sichtbares Ziel zu erreichen und Hindernisse zu umgehen.',
    sequence:'Das Kind erkennt den zeitlichen Zusammenhang dreier Bilder und ordnet sie zu einer sinnvollen Geschichte.',
    treasure:'Das Kind merkt sich vier abgebildete Gegenstände und erkennt nach dem Vergleich, welcher Gegenstand fehlt. Dies ist eine ergänzende Gedächtnisübung ohne Lehrplancode.',
    neighbours:'Das Kind orientiert sich in der Zahlenfolge und bestimmt die Zahl unmittelbar vor oder nach einer gegebenen Zahl.',
    compare:'Das Kind vergleicht zwei sichtbare Mengen bis 10 und entscheidet, wo mehr oder ob gleich viele Beeren liegen.',
    mirror:'Das Kind erkennt die Lage von Blättern zur senkrechten Spiegelachse und überträgt das Muster spiegelbildlich auf die andere Seite.',
    vowels:'Das Kind verbindet ein Bild mit seinem Wort und ergänzt den fehlenden Vokal an der passenden Stelle.',
    'read-puzzle':'Das Kind liest einzelne Silben und setzt sie in der richtigen Reihenfolge zu einem passenden Bildwort zusammen.',
    'read-word':'Das Kind liest vertraute Waldwörter und verbindet das gelesene Wort mit seiner bildlichen Bedeutung.',
    'read-leaves':'Das Kind erkennt Buchstabenfolgen in kurzen Silben und unterscheidet ähnlich aussehende Silben beim Lesen.',
    'read-colours':'Das Kind liest Farbsätze genau und verbindet Farbwörter und gegebenenfalls links/rechts mit dem passenden Bild.',
    trace:'Das Kind folgt den vorgegebenen Strichen grosser und kleiner Buchstaben und übt deren Form und Bewegungsrichtung. Freies Schreiben wird dabei nicht beurteilt.',
    'trace-numbers':'Das Kind folgt den vorgegebenen Strichen der Ziffern 0 bis 9 und verbindet die Ziffer mit einer gezeichneten Menge. Freies Schreiben wird dabei nicht beurteilt.'
  };
  const names={pending:'Offen',approved:'Freigegeben',improve:'Verbessern'};
  const btn=(label,fn)=>FK.ui.btn({label,onClick:fn});
  const statusText=s=>(s.stale?'Geändert · ':'')+names[s.status];
  // Opening the page, a puzzle or the overview always starts at the top.
  function toTop(){const reset=()=>{if(body)body.parentElement.scrollTop=0;window.scrollTo?.(0,0);};reset();requestAnimationFrame(reset);}
  async function approveAll(id){
    const p=C.puzzle(id);
    if(!await FK.ui.confirm('Alle '+V.progress(id).total+" Aufgaben von «"+p.title+'» freigeben?','Alle bestätigen','Abbrechen'))return;
    notice=V.approveAll(id)?"Alle Aufgaben von «"+p.title+'» bestätigt. '+(FK.reviewRepository?'Bitte den GitHub-Speicherstatus unten beachten.':''):(V.error||'Bestätigen fehlgeschlagen.');draw();
  }
  function message(){return h('p',{class:'review-notice',role:'status','aria-live':'polite',text:V.error||notice,hidden:!(V.error||notice)});}
  const releasedPuzzles=()=>FK.friendsLibrary.catalogue().filter(g=>V.ready(g.id)).map(g=>g.id);
  function draw(){
    FK.forestVoice.cancel();
    const games=FK.friendsLibrary.catalogue().sort((a,b)=>a.title.localeCompare(b.title,'de-CH'));
    const total=games.reduce((a,g)=>a+C.iterations(g.id).length,0),ready=new Set(releasedPuzzles());
    displayedRelease=[...ready].join();
    backButton.setAttribute('aria-label',selected?"Zur Rätsel-Übersicht":'Zurück zu Einstellungen');
    body.replaceChildren();
    if(!selected){
      displayedNotes='';
      body.append(h('p',{class:'review-intro',text:ready.size+' / '+games.length+" Rätsel freigegeben · "+total+" einzelne Aufgaben. Nur auf GitHub gespeicherte Freigaben sind spielbar. Vorschauen verändern keinen Spielstand."}),FK.reviewConnection.panel(),message());
      const grid=h('div',{class:'review-grid'});
      for(const g of games){const p=C.puzzle(g.id),progress=V.progress(g.id);
        const card=btn(g.title,()=>{selected=g.id;filter='all';draw();toTop();});card.classList.add('review-puzzle');card.dataset.puzzle=g.id;
        const state=V.status(g.id),released=ready.has(g.id);
        const label=released?'Freigegeben':state.status==='approved'?'Freigabe wartet auf GitHub':'Offen';
        card.replaceChildren(FK.friendsLibrary.portrait(g.host),h('b',{text:g.title}),h('span',{class:'review-status '+(released?'approved':'pending'),text:label}),h('small',{text:progress.approved+' / '+progress.total+" Aufgaben · "+progress.improve+' verbessern'}));grid.append(card);
      }body.append(grid);return;
    }
    const p=C.puzzle(selected),progress=V.progress(selected);
    const speechStatus=h('p',{class:'review-speech-status',role:'status','aria-live':'polite'});
    const messages={loading:'',playing:'Spielerklärung wird vorgelesen.',stopped:'Vorlesen gestoppt.',ended:'',error:'Die Sprachausgabe ist auf diesem Gerät nicht verfügbar.'};
    const speech=FK.ui.btn({icon:'sound',label:'Spielerklärung anhören',onClick:()=>FK.forestVoice.explain(p.instruction,state=>{
      speechStatus.textContent=messages[state];
      speech.setAttribute('aria-pressed',String(state==='loading'||state==='playing'));
    })});
    speech.setAttribute('aria-pressed','false');
    body.append(message(),h('h2',{text:p.title}),h('section',{class:'review-competence'},h('h3',{text:'Geübte Kompetenz'}),h('p',{text:competences[selected]}),h('p',{text:'Lehrplanbezug: '+p.reference})),h('p',{text:'Schwierigkeit: '+p.displayDifficulty}),h('p',{text:progress.approved+' / '+progress.total+' freigegeben · '+progress.improve+' verbessern · '+progress.pending+' offen'}),V.status(selected).status==='improve'?h('p',{class:'review-status pending',text:"Rätsel offen · allgemeiner Hinweis"}):null,h('section',{class:'review-speech'},h('h3',{text:'Spielerklärung'}),h('p',{text:p.instruction}),speech,speechStatus));
    const id=selected,note=h('textarea',{'aria-label':"Allgemeiner Kommentar zum Rätsel",maxlength:4000,rows:4,placeholder:"Was möchtest du zum gesamten Rätsel festhalten?",text:drafts.get(id)??''});
    const saved=h('p',{class:'review-notice',role:'status','aria-live':'polite'});
    note.addEventListener('input',()=>{drafts.set(id,note.value);saved.textContent='Noch nicht gespeichert.';});
    body.append(h('section',{class:'review-comment'},h('h3',{text:"Allgemeiner Kommentar zum Rätsel"}),h('label',{},'Kommentar (optional)',note),btn('Kommentar speichern',()=>{
      if(V.comment(id,note.value)){drafts.delete(id);notice="Kommentar gespeichert. Das Rätsel ist wieder offen.";draw();}else saved.textContent=V.error;
    }),saved));
    const notes=V.feedback(id);
    displayedNotes=C.canonical(notes);
    if(notes.length){
      const items=C.iterations(id),list=h('ul',{class:'review-feedback-list'});
      for(const entry of notes){
        const iteration=items.find(it=>it.id===entry.key),date=new Date(entry.at).toLocaleDateString('de-CH');
        const label=entry.key==='puzzle:'+id?"Zum gesamten Rätsel":iteration?.label||entry.key;
        const remove=FK.ui.btn({icon:'close',label:'Kommentar löschen: '+label,onClick:()=>{
          if(V.deleteFeedback(id,entry)){notice='Kommentar gelöscht. '+(FK.reviewRepository?'Bitte den GitHub-Speicherstatus unten beachten.':'');draw();body.querySelector('.review-delete-comment,.review-comment .btn')?.focus();}
          else {notice=V.error;draw();}
        }});remove.classList.add('review-delete-comment');
        list.append(h('li',{'data-feedback-key':entry.key},h('div',{class:'review-feedback-heading'},h('b',{text:label}),remove),h('small',{text:date+(entry.stale?' · Frühere Version':'')}),h('p',{text:entry.note}),iteration?btn('Aktuelle Aufgabe ansehen',()=>V.preview(id,iteration.id)):null));
      }
      body.append(h('section',{class:'review-feedback'},h('h3',{text:'Bisherige Hinweise'}),h('p',{text:"Frühere Notizen bleiben auch nach Änderungen am Rätsel sichtbar."}),list));
    }
    const tabs=h('nav',{class:'review-actions','aria-label':'Aufgaben filtern'});
    for(const [value,label]of Object.entries({all:"Alle Aufgaben",pending:'Offen',improve:'Verbessern',approved:'Freigegeben',stale:'Geändert'})){const b=btn(label,()=>{filter=value;draw();});b.setAttribute('aria-pressed',String(value===filter));tabs.append(b);}
    const all=btn('Alle bestätigen',()=>approveAll(selected));all.classList.add('review-approve-all');all.disabled=V.ready(selected)||(progress.approved===progress.total&&V.status(selected).status==='approved');
    const open=progress.total-progress.approved;
    body.append(h('div',{class:'review-start'},open?btn("Offene Aufgaben prüfen ("+open+')',()=>V.start(selected)):null,all),h('p',{class:'review-flow-help',text:"Richtig lösen gibt die Aufgabe frei und führt automatisch weiter. Mit × lehnst du die Aufgabe ab. Ein allgemeiner Kommentar öffnet das Rätsel wieder. «Alle bestätigen» gibt alle Aufgaben dieses Rätsels auf einmal frei."}),tabs);
    const list=h('ol',{class:'review-iterations'});
    for(const it of C.iterations(selected)){
      const s=V.status(selected,it.id);if(filter!=='all'&&(filter==='stale'?!s.stale:s.status!==filter))continue;
      const b=btn('Prüfen: '+it.label,()=>V.preview(selected,it.id));b.dataset.iteration=it.id;
      list.append(h('li',{},h('div',{},h('b',{text:it.label}),h('code',{text:it.id}),h('span',{class:'review-status '+s.status,text:statusText(s)}),s.decision?.note?h('small',{text:s.decision.note==='Alle Iterationen zusammen bestätigt'?'Alle Aufgaben zusammen bestätigt':s.decision.note}):null),b));
    }
    body.append(list,FK.reviewConnection.statusLine());
    const history=V.exportData().history.filter(d=>d.key==='puzzle:'+selected||d.key.startsWith(selected+'/'));
    if(history.length)body.append(h('details',{},h('summary',{text:'Bisherige Entscheidungen ('+history.length+')'}),history.slice().reverse().map(d=>h('p',{text:d.key+' · '+names[d.status]+' · '+d.at}))));
  }
  function returnToGallery(id){FK.go('puzzle-review',{reviewPuzzle:id});}
  function saveFailure(retry){
    FK.ui.modal({title:'Prüfung nicht gespeichert',body:h('p',{text:V.error||'Bitte erneut versuchen.'}),actions:[
      {label:'Erneut versuchen',onClick:retry},{label:"Zur Rätsel-Prüfung",onClick:()=>returnToGallery(document.querySelector('.screen:not([hidden])')?.dataset.game)}]});
  }
  function attachPreview(root,session,onReject,onPause=()=>{}){
    root.querySelector('.review-reject')?.remove();
    const iteration=session.iterationIds[session.round];root.dataset.reviewIteration=iteration||'';
    if(!iteration)return;
    const reject=h('button',{type:'button',class:'puzzle-button puzzle-listen review-reject','aria-label':"Aufgabe ablehnen",onclick:()=>{
      if(session.solved)return;
      onPause();
      const note=h('textarea',{'aria-label':'Kommentar (optional)',maxlength:4000,rows:4,placeholder:'Was soll verbessert werden?',text:V.status(session.id,iteration).decision?.note||''});
      const feedback=h('p',{role:'status',class:'review-notice'});
      const modal=FK.ui.modal({title:"Aufgabe verbessern",cls:'review-rejection',body:h('div',{},h('p',{text:C.iterations(session.id).find(it=>it.id===iteration).label}),h('label',{},'Kommentar (optional)',note),FK.reviewConnection.statusLine(),feedback),actions:[
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
    if(session.questions.length&&!session.reviewResults.includes('improve')&&all.approved===all.total&&!V.finishSession(session)){saveFailure(()=>finishPreview(session));return;}
    notice=all.approved===all.total?(V.status(session.id).status==='improve'?"Das Rätsel ist wegen eines allgemeinen Hinweises offen.":"Alle Aufgaben geprüft. "+(FK.reviewRepository?'Bitte den GitHub-Speicherstatus unten beachten.':"Das Rätsel ist freigegeben.")):(all.total-all.approved)+" Aufgaben bleiben zur Verbesserung oder Prüfung offen.";
    returnToGallery(session.id);
  }
  V.attachPreview=attachPreview;V.saveFailure=saveFailure;V.finishPreview=finishPreview;
  let queuedRefresh=false;
  FK.on('puzzle-review-change',event=>{
    if(event?.source!=='github'||FK.current()!=='puzzle-review'||queuedRefresh)return;
    if(!event.changed&&(selected?C.canonical(V.feedback(selected)):'')===displayedNotes&&releasedPuzzles().join()===displayedRelease)return;
    queuedRefresh=true;requestAnimationFrame(()=>{
      queuedRefresh=false;
      // A remote update must not erase an optional note that is still being typed.
      if(document.activeElement?.matches('input,textarea'))return;
      if(FK.current()==='puzzle-review'&&V.authorized)draw();
    });
  });
  FK.screen('puzzle-review',{
    build(root){root.classList.add('ff-settings-screen');body=h('div',{class:'ff-settings-body review-body'});
      const bar=FK.ui.topbar({title:"Rätsel-Prüfung",stars:false,onBack:()=>{
        if(selected){selected=null;filter='all';notice='';draw();toTop();}else FK.go('settings',{},{isBack:true});
      }});backButton=bar.querySelector('.btn-back');root.append(bar,h('div',{class:'scroll'},body));
    },
    enter(params){if(!V.authorized){V.open();return;}selected=C.puzzle(params.reviewPuzzle)?params.reviewPuzzle:null;filter='all';draw();toTop();},
    leave(){notice='';FK.forestVoice.cancel();}
  });
})();
