/* Local, bounded observations for improving the game. No network or player identity. */
(function(root){
  'use strict';
  const copy=value=>JSON.parse(JSON.stringify(value));
  const DAY=86400000,MAX_EVENTS=10000,MAX_CHARS=750000;
  const important=new Set(['session_start','session_end','letter_opened','letter_session_started','letter_session_finished','mail_puzzle_completed','puzzle_started','puzzle_resumed','iteration_presented','puzzle_attempt','iteration_interrupted','puzzle_completed','puzzle_visit_ended','pause','answer_submitted','development_skip']);
  function createRecorder({storage,key,now=()=>Date.now(),metadata=()=>({}),enabled=()=>true,schedule=fn=>{const t=setTimeout(fn,800);t.unref?.();return t;},cancel=clearTimeout}){
    let events=[],definitions={},truncated=false,dropped=0,sequence=0,timer=null,error='',dirty=false;
    const valid=e=>e&&typeof e.event==='string'&&Number.isFinite(e.timestamp);
    try{const old=JSON.parse(storage.getItem(key));events=Array.isArray(old?.events)?old.events.filter(valid):[];definitions=old?.definitions&&typeof old.definitions==='object'?old.definitions:{};truncated=!!old?.truncated;dropped=Number.isSafeInteger(old?.dropped)?old.dropped:0;sequence=Math.max(0,...events.map(e=>Number.isSafeInteger(e.sequence)?e.sequence:0));}catch{/* Recording can still work in memory. */}
    function trim(){const kept=events.filter(e=>e.timestamp>=now()-7*DAY).slice(-MAX_EVENTS);if(kept.length<events.length){truncated=true;dropped+=events.length-kept.length;events=kept;dirty=true;}}
    const referenced=rows=>{const keys=new Set(rows.map(e=>e.taskKey).filter(Boolean));return Object.fromEntries(Object.entries(definitions).filter(([key])=>keys.has(key)));};
    function flush(){
      if(timer!==null){cancel(timer);timer=null;}trim();if(!dirty)return !error;
      let kept=events.slice(),failed=false;
      while(true){
        const defs=referenced(kept),removed=events.length-kept.length;
        const raw=JSON.stringify({version:2,events:kept,definitions:defs,truncated:truncated||removed>0,dropped:dropped+removed});
        if(raw.length<=MAX_CHARS){
          try{storage.setItem(key,raw);events=kept;definitions=defs;truncated=truncated||removed>0;dropped+=removed;dirty=false;error='';return true;}catch{failed=true;}
        }
        if(!kept.length)break;
        kept=kept.slice(Math.max(1,Math.ceil(kept.length*(failed ? 0.5 : 0.15))));
      }
      // Keep the in-memory observations available for an export if storage is unavailable.
      error='Das Protokoll konnte nicht dauerhaft auf diesem Gerät gespeichert werden.';return false;
    }
    function record(event,details={}){
      try{
        const meta=metadata();if(!enabled()||meta.development)return false;
        const data=copy(details);
        if(data.definition&&data.taskKey){definitions[data.taskKey]=data.definition;delete data.definition;}
        const timestamp=now();events.push({...data,...meta,event,timestamp,sequence:++sequence,eventId:meta.sessionId?meta.sessionId+':'+sequence:undefined});dirty=true;trim();
        if(important.has(event))flush();else if(timer===null)timer=schedule(()=>{timer=null;flush();});
        return true;
      }catch{error='Ein Ereignis konnte nicht protokolliert werden.';return false;}
    }
    function exportData(){flush();trim();const rows=copy(events),defs=copy(referenced(events));return {
      format:'farbtupf-play-log',schema:2,exportedAt:new Date(now()).toISOString(),...metadata(),
      recording:{enabled:enabled()&&!metadata().development},
      retention:{days:7,maxEvents:MAX_EVENTS,maxStorageCharacters:MAX_CHARS,truncated,droppedEvents:dropped},
      storage:{localOnly:true,persisted:!dirty&&!error,error:error||null},
      retainedFrom:rows[0]?.timestamp??null,retainedTo:rows.at(-1)?.timestamp??null,
      analysisGuide:{purpose:'Improve game flow, puzzle clarity, input usability and fixed difficulty.',
        timing:'activeMs is foreground task time within this visit, excluding background, open dialogs and correct-feedback/celebration delays. It includes thinking and unattended visible time.',
        interpretation:['Compare the same puzzle/iteration revision and input method. Use sample counts; this is not a diagnosis of a child.','Separate wrong answers from cancelled taps, handwriting off-path events, route failures and storage errors.','First-try rates apply only to choice questions with an observed beginning. Construction and handwriting require action/trace analysis as well as completion.','A paused visit can be resumed; it is not proof of abandonment. A missing result is not a wrong answer.','Legacy events without run/iteration IDs are retained but excluded from puzzle outcome summaries.','Do not automatically change difficulty or approve content. Suggested changes still require adult review.'],
        questions:['Which exact iterations need clearer wording or pictures?','Where do retries, rule requests, input problems or long task times cluster?','Where do children visit the wrong friend, open the map repeatedly or struggle to reach a destination?']},
      definitions:defs,summary:summarize(rows,defs),events:rows
    };}
    function clear(){try{storage.removeItem(key);}catch{error='Das lokale Protokoll konnte nicht gelöscht werden.';return false;}if(timer!==null)cancel(timer);timer=null;events=[];definitions={};truncated=false;dropped=0;dirty=false;error='';return true;}
    return {record,flush,exportData,clear,status:()=>({enabled:enabled()&&!metadata().development,events:events.length,error,persisted:!dirty&&!error,truncated,droppedEvents:dropped})};
  }
  const median=values=>{if(!values.length)return null;const a=values.slice().sort((x,y)=>x-y),i=Math.floor(a.length/2);return Math.round(a.length%2?a[i]:(a[i-1]+a[i])/2);};
  function summarize(events,definitions){
    const rows=events.filter(e=>!e.development),groups=new Map(),puzzles=new Map();
    for(const e of rows){
      if(!e.runId||!e.puzzleId)continue;
      const puzzleKey=e.puzzleId+'@'+e.puzzleRevision,p=puzzles.get(puzzleKey)||{puzzleId:e.puzzleId,puzzleRevision:e.puzzleRevision,runs:new Set(),visits:new Set(),completed:new Set(),wrongAnswers:0,ruleRequests:0,resets:0,reinspections:0,inputIssues:0,strokeIssues:0};puzzles.set(puzzleKey,p);p.runs.add(e.runId);if(e.visitId)p.visits.add(e.visitId);
      if(e.event==='puzzle_completed')p.completed.add(e.runId);
      if(e.event==='instruction_requested')p.ruleRequests++;
      if(e.event==='puzzle_action'&&e.action==='reset')p.resets++;
      if(e.event==='puzzle_action'&&e.action==='reinspect')p.reinspections++;
      if(e.event==='input_issue')p.inputIssues++;
      if(e.event==='trace_issue')p.strokeIssues++;
      if(e.event==='puzzle_attempt'&&e.correct===false)p.wrongAnswers++;
      if(!e.taskKey)continue;
      const key=e.runId+'|'+e.taskKey,g=groups.get(key)||{taskKey:e.taskKey,puzzleId:e.puzzleId,runId:e.runId,attempts:0,wrong:0,completed:false,fromStart:false,activeMs:0};groups.set(key,g);
      if(e.event==='iteration_presented'&&!e.resumed)g.fromStart=true;
      if(e.event==='puzzle_attempt'){g.attempts++;if(e.correct===false)g.wrong++;if(e.correct){g.completed=true;g.activeMs+=Number(e.activeMs)||0;}}
      if(e.event==='iteration_interrupted')g.activeMs+=Number(e.activeMs)||0;
    }
    const iterations=new Map();
    for(const g of groups.values()){
      const questionKind=definitions[g.taskKey]?.question.kind,responseModel=!questionKind?'unknown':['picnic','build','robot','order','mirror','neighbours','syllables','trace'].includes(questionKind)?'construction_or_tracing':'choice';
      const row=iterations.get(g.taskKey)||{taskKey:g.taskKey,puzzleId:g.puzzleId,iterationId:definitions[g.taskKey]?.iterationId||null,responseModel,runsObserved:0,completedRuns:0,wrongAnswers:0,knownFirstAttemptRuns:0,firstTryCorrectRuns:0,activeTimesMs:[]};iterations.set(g.taskKey,row);
      row.runsObserved++;row.wrongAnswers+=g.wrong;if(g.completed){row.completedRuns++;row.activeTimesMs.push(g.activeMs);if(g.fromStart&&responseModel==='choice'){row.knownFirstAttemptRuns++;if(g.attempts===1)row.firstTryCorrectRuns++;}}
    }
    return {events:events.length,legacyEvents:events.filter(e=>!e.eventId).length,unattributedPuzzleEvents:events.filter(e=>e.event==='puzzle_attempt'&&(!e.runId||!e.taskKey)).length,developmentEvents:events.filter(e=>e.development).length,
      puzzles:[...puzzles.values()].map(p=>({...p,runs:p.runs.size,visits:p.visits.size,completedRuns:p.completed.size,completed:undefined})),
      iterations:[...iterations.values()].map(r=>({...r,medianActiveMs:median(r.activeTimesMs),activeTimesMs:undefined,firstTryRate:r.knownFirstAttemptRuns?r.firstTryCorrectRuns/r.knownFirstAttemptRuns:null})),
      flow:{journeysStarted:rows.filter(e=>e.event==='letter_session_started').length,journeysFinished:rows.filter(e=>e.event==='letter_session_finished').length,lettersOpened:rows.filter(e=>e.event==='letter_opened').length,mapsOpened:rows.filter(e=>e.event==='map_opened').length,wrongFriendVisits:rows.filter(e=>e.event==='friend_unavailable'&&e.reason==='wrong_letter').length,routeFailures:rows.filter(e=>e.event==='route_failure').length,storageIssues:rows.filter(e=>e.event==='storage_error').length},
      unfinishedVisits:rows.filter(e=>e.event==='puzzle_visit_ended'&&!e.completed).length};
  }
  function createVisit({session,puzzle,record,definition,now=()=>performance.now(),id=()=>crypto.randomUUID(),paused=[]}){
    const resumed=!!session.logTested||!!session.logRunId||session.round>0||session.solved||Object.keys(session.work).length>0;
    session.logRunId=session.logRunId||id();const runId=session.logRunId,visitId=id(),firstRound=session.round,reasons=new Set(paused);
    let last=now(),elapsed=0,current=null,closed=false,completed=false;
    const clock=()=>{const t=now();if(!reasons.size)elapsed+=Math.max(0,t-last);last=t;return Math.round(elapsed);};
    const emit=(event,data={})=>record(event,{puzzleId:session.id,puzzleRevision:puzzle.revision,host:puzzle.host,runId,visitId,...(current?{iterationId:current.id,taskKey:current.key,round:current.round}:{}),...data});
    emit(resumed?'puzzle_resumed':'puzzle_started',{puzzleRevision:puzzle.revision,total:session.questions.length,round:session.round});
    function show(question){
      const iterationId=session.iterationIds[session.round];if(current?.id===iterationId)return;
      clock();reasons.delete('feedback');current={id:iterationId,key:'',round:session.round,start:clock(),correct:!!session.solved,attempts:0};
      const def=definition(iterationId),key=iterationId+'@'+def.revision;current.key=key;
      emit('iteration_presented',{definition:def,resumed:resumed&&session.round===firstRound,alreadySolved:!!session.solved,presentation:{choices:question.choices,order:question.order,bugs:question.bugs},partialWork:session.work});
      if(session.solved)reasons.add('feedback');
    }
    function answer(selected,correct,feedback,context={}){
      if(!current||current.correct||closed)return;
      const activeMs=clock()-current.start;current.attempts++;emit('puzzle_attempt',{...context,selected,correct,feedback,attemptInVisit:current.attempts,activeMs});
      if(correct){current.correct=true;reasons.add('feedback');}
    }
    function action(event,details={}){if(closed||!current||current.correct)return;emit(event,{...details,activeMs:clock()-current.start});}
    function pause(reason,on){if(closed)return;clock();const had=reasons.has(reason);if(on)reasons.add(reason);else reasons.delete(reason);if(had!==on)emit(on?'pause':'resume',{reason,visitActiveMs:clock()});}
    function finish(){if(closed||completed)return;completed=true;clock();reasons.add('complete');emit('puzzle_completed',{total:session.questions.length,visitActiveMs:clock()});}
    function stop(reason='navigation'){if(closed)return;const active=clock();if(current&&!current.correct)emit('iteration_interrupted',{activeMs:active-current.start});emit('puzzle_visit_ended',{reason,completed,visitActiveMs:active});closed=true;}
    return {show,answer,action,pause,finish,stop,celebration:()=>emit('celebration_finished')};
  }
  const api={createRecorder,createVisit,summarize};
  if(typeof module!=='undefined')module.exports=api;else{
    root.PlayLog=api;const FK=root.FK;let active=null,activeSession=null;
    const safe=fn=>{try{return fn();}catch{/* Diagnostics must not change game behaviour. */}};
    const record=(event,data)=>FK.friends?.record(event,data);
    const uuid=()=>root.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
    const development=()=>FK.settings.get('developerMode')===true||new URLSearchParams(location.search).get('dev')==='1';
    function markTested(session){delete session.logRunId;session.logTested=true;FK.puzzleRounds.save(session);}
    FK.playLog={
      development,
      setDevelopment(value){
        FK.friends?.flushLog();FK.settings.set('developerMode',!!value);
        if(!value&&new URLSearchParams(location.search).get('dev')==='1'){const url=new URL(location.href);url.searchParams.delete('dev');location.assign(url.href);}
      },
      begin(session){safe(()=>{
        active?.stop();active=null;activeSession=null;if(!session||session.review||session.blocked)return;
        if(development()){markTested(session);return;}
        if(session.logTested)delete session.logRunId;
        activeSession=session;
        const C=FK.puzzleCatalogue,puzzle=C.puzzle(session.id);
        active=createVisit({session,puzzle:{...puzzle,revision:C.puzzleRevision(session.id)},record,id:uuid,paused:[...(document.hidden?['background']:[]),...(document.querySelector('.modal')?['dialog']:[])],definition:iterationId=>{
          const it=C.iterations(session.id).find(i=>i.id===iterationId);
          return {puzzleId:session.id,iterationId,revision:C.iterationRevision(session.id,it),puzzleRevision:C.puzzleRevision(session.id),title:puzzle.title,competence:puzzle.competence,reference:puzzle.reference,difficulty:puzzle.difficulty,instruction:puzzle.instruction,question:it.question,...(it.question.kind==='trace'?{authoredStrokes:FK.glyphs.data[it.question.glyph].strokes}:{})};
        }});delete session.logTested;FK.puzzleRounds.save(session);
      });},
      show:question=>safe(()=>active?.show(question)),answer:(value,correct,feedback)=>safe(()=>active?.answer(value,correct,feedback,{inputMethod:FK.play?.inputMethod?.()||'unknown'})),
      button(label,node){safe(()=>{const r=node?.getBoundingClientRect();active?.action(label==='Spiel erklären'?'instruction_requested':'puzzle_action',{control:label,action:/zurücksetzen|neu ordnen/i.test(label)?'reset':/nochmals anschauen/i.test(label)?'reinspect':'button',selection:node?{answer:node.dataset.answer,shape:node.dataset.shape,rotation:node.dataset.rotation,cell:node.dataset.cell,part:node.dataset.part,pressedBefore:node.getAttribute('aria-pressed')}:undefined,inputMethod:FK.play?.inputMethod?.()||'unknown',targetSize:r?{width:Math.round(r.width),height:Math.round(r.height)}:undefined});});},
      issue:(reason,node,inputMethod)=>safe(()=>{if(node?.closest('.screen-puzzle,.screen-trace')&&!node.closest('.topbar'))active?.action('input_issue',{reason,control:node.getAttribute('aria-label')||null,inputMethod});}),
      trace:(event,data)=>safe(()=>active?.action(event,{inputMethod:FK.play?.inputMethod?.()||'unknown',...data})),
      finish:()=>safe(()=>active?.finish()),celebration:()=>safe(()=>active?.celebration()),
      stop(reason){safe(()=>active?.stop(reason));active=null;activeSession=null;},
      pause:(reason,on)=>safe(()=>active?.pause(reason,on))
    };
    FK.on('settings',event=>{if(event.key==='developerMode'&&development()){safe(()=>{if(activeSession)markTested(activeSession);});FK.playLog.stop('developer_mode');}});
    document.addEventListener('visibilitychange',()=>{FK.playLog.pause('background',document.hidden);if(document.hidden)FK.friends?.flushLog();});
    root.addEventListener('pagehide',event=>{if(event.persisted)FK.playLog.pause('page_cache',true);else FK.playLog.stop('pagehide');FK.friends?.flushLog();});
    root.addEventListener('pageshow',event=>{if(event.persisted)FK.playLog.pause('page_cache',false);});
    FK.on('modal-opened',()=>FK.playLog.pause('dialog',true));FK.on('modal-closed',()=>FK.playLog.pause('dialog',false));
  }
})(typeof window!=='undefined'?window:globalThis);
