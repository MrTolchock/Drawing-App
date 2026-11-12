/* Editorial decisions belong to exact revisions, independently of child saves.
   This is a local adult workflow, not an identity/authentication service. */
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
  function persist(next){try{localStorage.setItem(key,JSON.stringify(next));data=next;error='';FK.emit?.('puzzle-review-change');return true;}catch{error='Prüfung konnte nicht gespeichert werden. Bitte Speicher freigeben und erneut versuchen.';return false;}}
  function item(id,iteration){return iteration?C.iterations(id).find(i=>i.id===iteration):null;}
  function revision(id,iteration){const it=item(id,iteration);return iteration?(it?C.iterationRevision(id,it):null):C.puzzle(id)?C.puzzleRevision(id):null;}
  const recordKey=(id,iteration)=>iteration||'puzzle:'+id;
  function status(id,iteration){const k=recordKey(id,iteration),d=data.decisions[k],r=revision(id,iteration);return {status:d&&d.revision===r?d.status:'pending',stale:!!d&&d.revision!==r,decision:d?clone(d):null,seen:!!r&&data.seen[k]===r};}
  function seen(id,iteration){const r=revision(id,iteration);if(!r)return false;const next=clone(data);next.seen[recordKey(id,iteration)]=r;return persist(next);}
  function progress(id){const items=C.iterations(id),approved=items.filter(i=>status(id,i.id).status==='approved').length,improve=items.filter(i=>status(id,i.id).status==='improve').length;return {total:items.length,approved,improve,pending:items.length-approved-improve};}
  function ready(id){const p=progress(id);return p.total>=25&&p.approved===p.total&&status(id).status==='approved';}
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
  function exportData(){return {...clone(data),exportedAt:new Date().toISOString(),catalogue:Object.fromEntries(FK.friendsLibrary.catalogue().map(g=>[g.id,C.puzzleRevision(g.id)]))};}
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
  function previewSession(id,iteration){if(!authorized)return null;const it=item(id,iteration);return it?{id,seed:0,round:0,solved:false,work:{},questions:[clone(it.question)],iterationIds:[it.id],review:true}:null;}
  window.addEventListener?.('storage',event=>{if(event.key!==key)return;try{const next=JSON.parse(event.newValue);if(valid(next)){data=next;error='';}else {data=empty();error='Prüfung wurde geändert. Bitte erneut prüfen.';}FK.emit?.('puzzle-review-change');}catch{data=empty();FK.emit?.('puzzle-review-change');}});
  FK.puzzleReview={key,status,seen,progress,ready,decide,exportData,importData,open,preview,previewSession,get authorized(){return authorized;},get error(){return error;}};
})();
