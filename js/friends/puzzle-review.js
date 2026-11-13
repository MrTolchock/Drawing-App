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
  function valid(d){return d&&d.version===1&&d.decisions&&typeof d.decisions==='object'&&!Array.isArray(d.decisions)&&d.seen&&typeof d.seen==='object'&&!Array.isArray(d.seen)&&Array.isArray(d.history)&&Object.values(d.seen).every(v=>typeof v==='string')&&[...Object.values(d.decisions),...d.history].every(v=>v&&typeof v.key==='string'&&typeof v.revision==='string'&&statuses.includes(v.status)&&typeof v.note==='string'&&v.note.length<=4000&&(v.reviewer===undefined||typeof v.reviewer==='string'&&v.reviewer.length<=120)&&typeof v.at==='string'&&Number.isFinite(Date.parse(v.at))&&(v.checks===undefined||Array.isArray(v.checks)&&v.checks.every(c=>typeof c==='string')));}
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
  function status(id,iteration){const k=recordKey(id,iteration),d=data.decisions[k],r=revision(id,iteration);return {status:d&&d.revision===r?d.status:'pending',stale:!!d&&d.revision!==r,decision:d?clone(d):null,seen:!!r&&data.seen[k]===r};}
  function seen(id,iteration){const r=revision(id,iteration);if(!r)return false;const next=clone(data);next.seen[recordKey(id,iteration)]=r;return persist(next);}
  function progress(id){const items=C.iterations(id),approved=items.filter(i=>status(id,i.id).status==='approved').length,improve=items.filter(i=>status(id,i.id).status==='improve').length;return {total:items.length,approved,improve,pending:items.length-approved-improve};}
  function ready(id){const p=progress(id);return p.total>=25&&p.approved===p.total&&status(id).status==='approved'&&(!FK.reviewRepository||FK.reviewRepository.confirmed(id));}
  function decide(id,iteration,value,note=''){
    const r=revision(id,iteration);if(!r||!statuses.includes(value)){error='Unbekannte Aufgabe oder Entscheidung.';return false;}
    note=String(note).trim().slice(0,4000);
    if(value==='approved'){
      if(iteration&&!status(id,iteration).seen){error='Bitte diese Iteration zuerst im Spiel ansehen.';return false;}
      if(!iteration&&progress(id).approved!==progress(id).total){error='Zuerst jede Iteration ansehen und freigeben.';return false;}
    }
    const next=clone(data),k=recordKey(id,iteration),old=next.decisions[k];if(old)next.history.push(old);
    next.decisions[k]={key:k,revision:r,status:value,note,at:new Date().toISOString()};return persist(next);
  }
  function exportData(){return {version:1,decisions:clone(data.decisions),seen:clone(data.seen),history:clone(data.history),exportedAt:new Date().toISOString(),catalogue:Object.fromEntries(FK.friendsLibrary.catalogue().map(g=>[g.id,C.puzzleRevision(g.id)]))};}
  function importData(raw){
    let d;try{d=typeof raw==='string'?JSON.parse(raw):clone(raw);}catch{error='Keine gültige JSON-Prüfdatei.';return false;}
    if(!valid(d)||Object.entries(d.decisions).some(([k,v])=>k!==v.key)){error='Ungültige Prüfdatei; die gespeicherte Prüfung bleibt erhalten.';return false;}
    // An import restores evidence, never manufactures a seen/approved revision.
    const next=clone(data);
    for(const [k,v]of Object.entries(d.decisions)){
      const id=k.startsWith('puzzle:')?k.slice(7):k.split('/')[0],iteration=k.startsWith('puzzle:')?null:k;
      if(!C.puzzle(id)||!revision(id,iteration)){error='Die Prüfdatei enthält unbekannte Puzzle-IDs.';return false;}
      if(v.status==='approved'&&iteration&&d.seen[k]!==v.revision){error='Die Prüfdatei enthält eine unvollständige Freigabe.';return false;}
      if(next.decisions[k])next.history.push(next.decisions[k]);next.decisions[k]=v;
    }
    Object.assign(next.seen,d.seen);next.history.push(...d.history);return persist(next);
  }
  function open(){
    const enter=()=>{authorized=true;FK.go('puzzle-review',{from:'friends'});};
    if(FK.current?.()==='settings')enter();else FK.ui.parentGate(enter);
  }
  function preview(id,iteration){if(!authorized)return false;const g=C.puzzle(id),it=item(id,iteration);if(!g||!it)return false;FK.go(g.screen,{game:id,reviewIteration:iteration,returnTo:'puzzle-review',from:'friends'});return true;}
  function start(id){if(!authorized||!C.puzzle(id))return false;FK.go(C.puzzle(id).screen,{game:id,reviewQueue:true,returnTo:'puzzle-review',from:'friends'});return true;}
  function previewSession(id,iteration){
    if(!authorized||!C.puzzle(id))return null;
    const first=iteration?item(id,iteration):null;if(iteration&&!first)return null;
    // Snapshot once: a rejected item is visited once, then stays open for the next run.
    const items=C.iterations(id).filter(it=>it.id!==iteration&&status(id,it.id).status!=='approved');
    if(first)items.unshift(first); // Explicit reinspection of an approved item is allowed.
    return {id,seed:0,round:0,solved:false,work:{},questions:C.prepare(items,Math.floor(Math.random()*0x100000000)).map(it=>it.question),iterationIds:items.map(it=>it.id),review:true,
      reviewRevision:C.puzzleRevision(id),reviewRevisions:items.map(it=>C.iterationRevision(id,it)),reviewResults:[]};
  }
  function currentReview(session){
    const id=session?.iterationIds?.[session.round];
    if(!authorized||!session.review||!id||session.reviewRevision!==C.puzzleRevision(session.id)||session.reviewRevisions[session.round]!==revision(session.id,id)){
      error='Diese Aufgabe wurde geändert. Bitte die Prüfung neu öffnen.';return null;
    }return id;
  }
  function visit(session){const id=currentReview(session);return !!id&&(status(session.id,id).seen||seen(session.id,id));}
  function sessionDecision(session,value,note=''){
    const id=currentReview(session);if(!id||!['approved','improve'].includes(value)||session.reviewResults[session.round])return false;
    if(!decide(session.id,id,value,note))return false;
    session.reviewResults[session.round]=value;return true;
  }
  function finishSession(session){
    if(!authorized||!session?.review||session.round!==session.questions.length||session.reviewRevision!==C.puzzleRevision(session.id)||session.reviewResults.filter(Boolean).length!==session.questions.length)return false;
    if(session.reviewResults.includes('improve')||progress(session.id).approved!==progress(session.id).total)return false;
    return decide(session.id,null,'approved');
  }
  window.addEventListener?.('storage',event=>{if(event.key!==key)return;try{const next=JSON.parse(event.newValue);if(valid(next)){data=next;error='';}else {data=empty();error='Prüfung wurde geändert. Bitte erneut prüfen.';}FK.emit?.('puzzle-review-change');}catch{data=empty();FK.emit?.('puzzle-review-change');}});
  FK.puzzleReview={key,status,seen,progress,ready,decide,exportData,importData,open,preview,start,previewSession,visit,sessionDecision,finishSession,get authorized(){return authorized;},get error(){return error;}};
  if(FK.ReviewRepository&&window.fetch&&window.document&&new URLSearchParams(location.search).get('dev')!=='1'){
    let tokenStorage;try{tokenStorage=window.sessionStorage;}catch{/* A temporary connection still works. */}
    FK.reviewRepository=FK.ReviewRepository.create({
      vault:{read:()=>data,write:next=>valid(next)&&persist(next,true)},
      catalogue:{games:()=>FK.friendsLibrary.catalogue(),iterations:C.iterations,puzzleRevision:C.puzzleRevision,iterationRevision:C.iterationRevision},
      fetch:window.fetch.bind(window),tokenStorage,onChange:()=>FK.emit?.('review-repository-change')
    });
    window.addEventListener('online',()=>FK.reviewRepository.resume());
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)FK.reviewRepository.resume();});
  }
})();
