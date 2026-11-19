/* Editorial decisions belong to exact revisions, independently of child saves.
   The local outbox synchronizes with the separate GitHub review ledger. */
(function () {
  'use strict';
  const FK=window.FK,C=FK.puzzleCatalogue;
  const key='farbtupf.puzzle-review.'+(new URLSearchParams(location.search).get('dev')==='1'?'development.':'')+'v1';
  const empty=()=>({version:1,decisions:{},seen:{},history:[]});
  const statuses=['approved','improve','pending'],clone=v=>JSON.parse(JSON.stringify(v));
  let data=empty(),error='',authorized=false;
  // Older backups may contain reviewer/checklist metadata; keep it readable without requiring it.
  function valid(d){return d&&d.version===1&&d.decisions&&typeof d.decisions==='object'&&!Array.isArray(d.decisions)&&d.seen&&typeof d.seen==='object'&&!Array.isArray(d.seen)&&Array.isArray(d.history)&&(d.deletedNotes===undefined||Array.isArray(d.deletedNotes)&&d.deletedNotes.every(v=>v&&typeof v.key==='string'&&typeof v.note==='string'&&v.note.length<=4000&&Number.isFinite(Date.parse(v.at))))&&Object.values(d.seen).every(v=>typeof v==='string')&&[...Object.values(d.decisions),...d.history].every(v=>v&&typeof v.key==='string'&&typeof v.revision==='string'&&statuses.includes(v.status)&&typeof v.note==='string'&&v.note.length<=4000&&(v.reviewer===undefined||typeof v.reviewer==='string'&&v.reviewer.length<=120)&&typeof v.at==='string'&&Number.isFinite(Date.parse(v.at))&&(v.checks===undefined||Array.isArray(v.checks)&&v.checks.every(c=>typeof c==='string')));}
  try{const raw=localStorage.getItem(key);if(raw){const d=JSON.parse(raw);if(valid(d))data=d;else error='Die gespeicherte Prüfung ist ungültig. Bitte eine Sicherung importieren.';}}catch{error='Die Prüfung konnte nicht geladen werden. Bitte eine Sicherung importieren.';}
  function persist(next,fromRepository=false){try{
    if(!fromRepository&&FK.reviewRepository)next=FK.reviewRepository.stage(next,data);
    const changed=C.canonical(next.decisions)!==C.canonical(data.decisions);
    localStorage.setItem(key,JSON.stringify(next));data=next;error='';FK.emit?.('puzzle-review-change',{source:fromRepository?'github':'local',changed});
    if(!fromRepository)FK.reviewRepository?.schedule();return true;
  }catch{error='Prüfung konnte nicht gespeichert werden. Bitte Speicher freigeben und erneut versuchen.';return false;}}
  function item(id,iteration){return iteration?C.iterations(id).find(i=>i.id===iteration):null;}
  function revision(id,iteration){const it=item(id,iteration);return iteration?(it?C.iterationRevision(id,it):null):C.puzzle(id)?C.puzzleRevision(id):null;}
  const recordKey=(id,iteration)=>iteration||'puzzle:'+id;
  const noteDeleted=d=>(data.deletedNotes||[]).some(v=>v.key===d.key&&v.note===d.note&&Date.parse(v.at)>=Date.parse(d.at));
  const noteTime=(key,note)=>new Date(Math.max(Date.now(),...(data.deletedNotes||[]).filter(d=>d.key===key&&d.note===note).map(d=>Date.parse(d.at)+1))).toISOString();
  function status(id,iteration){const k=recordKey(id,iteration),d=data.decisions[k],valid=d&&C.acceptsRevision(id,iteration,d.revision),state={status:valid?d.status:d?.status==='improve'?'improve':'pending',stale:!!d&&!valid,decision:d?{...clone(d),note:noteDeleted(d)?'':d.note}:null,seen:C.acceptsRevision(id,iteration,data.seen[k])};
    if(!iteration){const p=progress(id);state.status=d?.status==='improve'?'improve':p.total>=25&&p.approved===p.total?'approved':'pending';state.stale=C.iterations(id).some(it=>status(id,it.id).stale);}return state;
  }
  function seen(id,iteration){const r=revision(id,iteration);if(!r)return false;const next=clone(data);next.seen[recordKey(id,iteration)]=r;return persist(next);}
  function progress(id){const items=C.iterations(id),approved=items.filter(i=>status(id,i.id).status==='approved').length,improve=items.filter(i=>status(id,i.id).status==='improve').length;return {total:items.length,approved,improve,pending:items.length-approved-improve};}
  function feedback(id){
    const notes=[...Object.values(data.decisions),...data.history].filter(d=>(d.key==='puzzle:'+id||d.key.startsWith(id+'/'))&&d.note.trim()&&!['Alle Iterationen zusammen bestätigt','Alle Aufgaben zusammen bestätigt'].includes(d.note)&&!noteDeleted(d)).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at)),unique=new Set();
    return notes.filter(d=>{const signature=d.key+'\n'+d.note;if(unique.has(signature))return false;unique.add(signature);return true;}).map(d=>({...clone(d),stale:!C.acceptsRevision(id,d.key.startsWith('puzzle:')?null:d.key,d.revision)}));
  }
  // Delete the displayed note across duplicate revisions, independently of all review decisions.
  function deleteFeedback(id,entry){
    if(!authorized||!feedback(id).some(d=>d.key===entry?.key&&d.note===entry.note)){error='Dieser Kommentar ist nicht mehr vorhanden.';return false;}
    const next=clone(data),at=new Date(Math.max(Date.now(),...[...Object.values(data.decisions),...data.history].filter(d=>d.key===entry.key&&d.note===entry.note).map(d=>Date.parse(d.at)))).toISOString();
    next.deletedNotes=(next.deletedNotes||[]).filter(d=>d.key!==entry.key||d.note!==entry.note);
    next.deletedNotes.push({key:entry.key,note:entry.note,at});return persist(next);
  }
  function ready(id){const p=progress(id);return p.total>=25&&p.approved===p.total&&data.decisions[recordKey(id)]?.status!=='improve'&&(!FK.reviewRepository||FK.reviewRepository.confirmed(id));}
  function decide(id,iteration,value,note){
    const r=revision(id,iteration);if(!r||!statuses.includes(value)){error='Unbekannte Aufgabe oder Entscheidung.';return false;}
    note=String(note??(!iteration?status(id).decision?.note:'')??'').trim().slice(0,4000);
    if(value==='approved'){
      if(iteration&&!status(id,iteration).seen){error="Bitte diese Aufgabe zuerst im Spiel ansehen.";return false;}
      if(!iteration&&progress(id).approved!==progress(id).total){error="Zuerst jede Aufgabe ansehen und freigeben.";return false;}
    }
    const next=clone(data),k=recordKey(id,iteration),old=next.decisions[k];if(old)next.history.push(old);
    // An explicit approval of the displayed task belongs to its exact revision.
    if(iteration&&value==='approved')next.seen[k]=r;
    next.decisions[k]={key:k,revision:r,status:value,note,at:noteTime(k,note)};return persist(next);
  }
  function comment(id,note){
    if(!authorized||!C.puzzle(id)){error="Bitte die Rätsel-Prüfung öffnen.";return false;}
    const message=String(note??'').trim();
    if(!message){error='Bitte einen Kommentar eingeben.';return false;}
    return decide(id,null,'improve',message);
  }
  function exportData(){return {version:1,decisions:clone(data.decisions),seen:clone(data.seen),history:clone(data.history),...(data.deletedNotes?{deletedNotes:clone(data.deletedNotes)}:{}),exportedAt:new Date().toISOString(),catalogue:Object.fromEntries(FK.friendsLibrary.catalogue().map(g=>[g.id,C.puzzleRevision(g.id)]))};}
  function importData(raw){
    let d;try{d=typeof raw==='string'?JSON.parse(raw):clone(raw);}catch{error='Keine gültige JSON-Prüfdatei.';return false;}
    if(!valid(d)||Object.entries(d.decisions).some(([k,v])=>k!==v.key)){error='Ungültige Prüfdatei; die gespeicherte Prüfung bleibt erhalten.';return false;}
    // An import restores evidence, never manufactures a seen/approved revision.
    const next=clone(data);
    for(const [k,v]of Object.entries(d.decisions)){
      const id=k.startsWith('puzzle:')?k.slice(7):k.split('/')[0],iteration=k.startsWith('puzzle:')?null:k;
      if(!C.puzzle(id)||!revision(id,iteration)){error="Die Prüfdatei enthält unbekannte Rätsel-IDs.";return false;}
      if(v.status==='approved'&&iteration&&d.seen[k]!==v.revision){error='Die Prüfdatei enthält eine unvollständige Freigabe.';return false;}
      if(next.decisions[k])next.history.push(next.decisions[k]);next.decisions[k]=v;
    }
    Object.assign(next.seen,d.seen);next.history.push(...d.history);if(d.deletedNotes)next.deletedNotes=[...(next.deletedNotes||[]),...d.deletedNotes];return persist(next);
  }
  // One adult calculation per visit: coming from Settings, the Puzzle-Galerie or the Prüfung itself (already past the
  // gate) opens directly; any other way in asks once.
  const adultHere=()=>authorized&&['settings','puzzle-gallery','puzzle-review'].includes(FK.current?.())||FK.current?.()==='settings';
  function open(){
    const enter=()=>{authorized=true;FK.go('puzzle-review',{from:'friends'});};
    if(adultHere())enter();else FK.ui.parentGate(enter);
  }
  /* Puzzle-Galerie (adults, from settings): only signed-off puzzles; a round of five tasks drawn like a child's
     round, but never saved as the child's round, never completing a letter and never observed by the usage log. */
  function openGallery(){const enter=()=>{authorized=true;FK.go('puzzle-gallery');};if(adultHere())enter();else FK.ui.parentGate(enter);}
  function gallerySession(id){
    if(!authorized||!C.puzzle(id)||!ready(id))return null;
    const seed=Math.floor(Math.random()*0x100000000),items=C.select(id,seed,[]);
    return {id,seed,round:0,solved:false,work:{},questions:items.map(i=>i.question),iterationIds:items.map(i=>i.id),catalogueRevision:C.puzzleRevision(id),gallery:true};
  }
  function play(id){if(!gallerySession(id))return false;FK.go(C.puzzle(id).screen,{game:id,gallery:true,returnTo:'puzzle-gallery',from:'friends'});return true;}
  function preview(id,iteration){if(!authorized)return false;const g=C.puzzle(id),it=item(id,iteration);if(!g||!it)return false;FK.go(g.screen,{game:id,reviewIteration:iteration,returnTo:'puzzle-review',from:'friends'});return true;}
  function start(id){
    if(!authorized||!C.puzzle(id))return false;
    const p=progress(id);if(p.approved===p.total)return false;
    FK.go(C.puzzle(id).screen,{game:id,reviewQueue:true,returnTo:'puzzle-review',from:'friends'});return true;
  }
  function previewSession(id,iteration){
    if(!authorized||!C.puzzle(id))return null;
    const first=iteration?item(id,iteration):null;if(iteration&&!first)return null;
    // Snapshot once: a rejected item is visited once, then stays open for the next run.
    const open=C.iterations(id).filter(it=>status(id,it.id).status!=='approved');
    const items=first?[first,...open.filter(it=>it.id!==first.id)]:open;
    return {id,seed:0,round:0,solved:false,work:{},questions:C.prepare(items,Math.floor(Math.random()*0x100000000)).map(it=>it.question),iterationIds:items.map(it=>it.id),review:true,
      reviewRevision:C.puzzleRevision(id),reviewRevisions:items.map(it=>C.iterationRevision(id,it)),reviewResults:[],
      hasOpenItems:open.length>0,reviewHold:data.decisions[recordKey(id)]?.status==='improve'?data.decisions[recordKey(id)].at:null};
  }
  function currentReview(session){
    const id=session?.iterationIds?.[session.round];
    if(!authorized||!session?.review||!id||session.reviewRevisions[session.round]!==revision(session.id,id)){
      error='Diese Aufgabe wurde geändert. Bitte die Prüfung neu öffnen.';return null;
    }return id;
  }
  function visit(session){const id=currentReview(session);return !!id&&(status(session.id,id).seen||seen(session.id,id));}
  function sessionDecision(session,value,note=''){
    const id=currentReview(session);if(!id||!['approved','improve'].includes(value)||session.reviewResults[session.round])return false;
    // The answer was given to the task on screen, so it has been seen: record that together with the decision.
    // (The seen mark set when the task appeared can be lost, e.g. when another tab replaces the local record.)
    if(!status(session.id,id).seen&&!seen(session.id,id))return false;
    if(!decide(session.id,id,value,note))return false;
    session.reviewResults[session.round]=value;return true;
  }
  /* An adult may confirm every iteration of one puzzle together (Puzzle-Prüfung: "Alle bestätigen"): each current
     iteration is marked seen and approved, and the puzzle with them, in one save. Earlier decisions stay in history. */
  function approveAll(id,note="Alle Aufgaben zusammen bestätigt"){
    if(!authorized||!C.puzzle(id)){error="Unbekanntes Rätsel.";return false;}
    const next=clone(data),at=new Date().toISOString(),put=(k,r)=>{const old=next.decisions[k];if(old&&old.revision===r&&old.status==='approved'&&(k.startsWith('puzzle:')||data.seen[k]===r))return;if(old)next.history.push(old);next.decisions[k]={key:k,revision:r,status:'approved',note,at};};
    for(const it of C.iterations(id)){const r=C.iterationRevision(id,it);next.seen[it.id]=r;put(it.id,r);}
    put(recordKey(id),C.puzzleRevision(id));next.decisions[recordKey(id)].note=status(id).decision?.note||'';return persist(next);
  }
  function finishSession(session){
    if(!authorized||!session?.review||!session.questions.length||session.round!==session.questions.length||session.reviewResults.filter(Boolean).length!==session.questions.length)return false;
    if(session.reviewResults.includes('improve')||progress(session.id).approved!==progress(session.id).total)return false;
    const hold=data.decisions[recordKey(session.id)];
    if(hold?.status==='improve'&&(!session.hasOpenItems||hold.at!==session.reviewHold))return true;
    return decide(session.id,null,'approved');
  }
  window.addEventListener?.('storage',event=>{if(event.key!==key)return;try{const next=JSON.parse(event.newValue);if(valid(next)){data=next;error='';}else {data=empty();error='Prüfung wurde geändert. Bitte erneut prüfen.';}FK.emit?.('puzzle-review-change');}catch{data=empty();FK.emit?.('puzzle-review-change');}});
  FK.puzzleReview={key,status,seen,progress,feedback,deleteFeedback,ready,decide,comment,approveAll,exportData,importData,open,openGallery,gallerySession,play,preview,start,previewSession,visit,sessionDecision,finishSession,get authorized(){return authorized;},get error(){return error;}};
  if(FK.ReviewRepository&&window.fetch&&window.document&&new URLSearchParams(location.search).get('dev')!=='1'){
    let tokenStorage;try{tokenStorage=window.sessionStorage;}catch{/* A temporary connection still works. */}
    FK.reviewRepository=FK.ReviewRepository.create({
      vault:{read:()=>data,write:next=>valid(next)&&persist(next,true)},
      catalogue:{games:()=>FK.friendsLibrary.catalogue(),iterations:C.iterations,puzzleRevision:C.puzzleRevision,iterationRevision:C.iterationRevision,revisions:(id,it)=>it?C.iterationRevisions(id,it):C.puzzleRevisions(id)},
      fetch:window.fetch.bind(window),tokenStorage,onChange:()=>FK.emit?.('review-repository-change')
    });
    window.addEventListener('online',()=>FK.reviewRepository.resume());
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)FK.reviewRepository.resume();});
  }
})();
