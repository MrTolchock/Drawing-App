/* One validated localStorage envelope is the transaction boundary for all player changes.
   Legacy farbklecks/farbtupf keys and IndexedDB stores are deliberately left intact. */
(function(root){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x));
  const SCHEMA=1;
  const Logging=typeof module!=='undefined'?require('./play-log.js'):root.PlayLog;
  function create({storage,content,development=false,namespace='',now=()=>Date.now(),random=Math.random,onStatus=()=>{},appVersion=()=>root.FK?.VERSION||'unknown',logContext=()=>({})}){
    const key='farbtupf.friends.'+(namespace?namespace+'.':development?'development.':'')+'v1', backup=key+'.backup', logKey=key+'.log';
    let state,blocked=false,readFailed=false,expected=null,error='';
    const uid=()=>now().toString(36)+'-'+random().toString(36).slice(2,12);
    const sessionId=uid();
    // An invitation stays stable; future friends come from a saved shuffled bag.
    const mailHosts=['squirrel','bird','owl','beaver','mouse','hedgehog','fish','deer','kingfisher','frog','badger'];
    const letterLimit=n=>Number.isInteger(n)&&n>=1&&n<=50;
    const session=(limit=3)=>({id:uid(),limit,completed:0});
    const firstMail=()=>{const [host,...remaining]=shuffled(mailHosts);return {phase:'den-letter',host,remaining,index:0,completed:0,session:session()};};
    const prepare=s=>{s.settings.letterLimit=letterLimit(s.settings.letterLimit)?s.settings.letterLimit:3;s.mail=s.mail||firstMail();if(!s.mail.remaining)s.mail.remaining=shuffled(mailHosts.filter(id=>id!==s.mail.host));if(!s.mail.session){s.mail.session=session(s.settings.letterLimit);if(s.mail.phase==='to-mailman')s.mail.session.completed=1;if(s.mail.session.completed>=s.mail.session.limit)s.mail.phase='return-home';}s.unlocks.leaf=true;s.unlocks.pencils=true;return s;};
    function nextHost(s){
      const m=s.mail;if(!m.remaining.length)m.remaining=shuffled(mailHosts);
      if(m.remaining[0]===m.host){if(m.remaining.length===1)m.remaining=shuffled(mailHosts);const other=m.remaining.findIndex(id=>id!==m.host);[m.remaining[0],m.remaining[other]]=[m.remaining[other],m.remaining[0]];}
      m.host=m.remaining.shift();m.index++;
    }
    function finishMail(s,host){if(s.mail.phase!=='to-friend'||s.mail.host!==host||s.mail.session.completed>=s.mail.session.limit)return false;s.mail.completed++;s.mail.session.completed++;s.mail.phase=s.mail.session.completed>=s.mail.session.limit?'return-home':'to-mailman';return true;}
    const fresh=()=>({schema:SCHEMA,revision:0,contentVersion:content.version,wallet:{nuts:0,seeds:0,feathers:0,logs:0,berries:0},inventory:{apple:0,bath:0},unlocks:{leaf:true,pencils:true},rounds:{},previous:{},completed:{},seenExamples:{},selectedPage:'free',drawings:{free:[],leaf:[]},settings:{music:true,ambience:true,speech:false,letterLimit:3},world:{x:0,z:5},collected:{},animation:null,transactions:[],legacyPreserved:true,mail:firstMail()});
    function valid(s){
      const quantity=n=>Number.isSafeInteger(n)&&n>=0;
      const object=o=>o&&typeof o==='object'&&!Array.isArray(o);
      const point=p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1);
      const strokes=a=>Array.isArray(a)&&a.length<=2000&&a.every(stroke=>/^#[0-9a-f]{3,8}$/i.test(stroke?.colour)&&Array.isArray(stroke.points)&&stroke.points.length>0&&stroke.points.length<=4000&&stroke.points.every(point));
      if(s?.schema!==SCHEMA||!quantity(s.revision))return false;
      if(s.mail!==undefined&&(!object(s.mail)||!['den-letter','to-friend','to-mailman','return-home','sleeping','finished'].includes(s.mail.phase)||!quantity(s.mail.index)||!quantity(s.mail.completed)||!mailHosts.includes(s.mail.host)))return false;
      if(s.mail?.remaining!==undefined&&(!Array.isArray(s.mail.remaining)||s.mail.remaining.length>mailHosts.length||new Set(s.mail.remaining).size!==s.mail.remaining.length||!s.mail.remaining.every(id=>mailHosts.includes(id))))return false;
      if(s.mail&&['return-home','sleeping','finished'].includes(s.mail.phase)&&s.mail.session===undefined)return false;
      if(s.mail?.session!==undefined){const m=s.mail,j=m.session;if(!object(j)||typeof j.id!=='string'||!letterLimit(j.limit)||!quantity(j.completed)||j.completed>j.limit)return false;
        if(['return-home','sleeping','finished'].includes(m.phase)!==(j.completed===j.limit))return false;
        if(m.phase==='den-letter'&&j.completed!==0)return false;
      }
      if(s.settings?.letterLimit!==undefined&&!letterLimit(s.settings.letterLimit))return false;
      if(!['nuts','seeds','feathers','logs','berries'].every(k=>quantity(s.wallet?.[k])))return false;
      if(!['apple','bath'].every(k=>quantity(s.inventory?.[k]))||!['leaf','pencils'].every(k=>typeof s.unlocks?.[k]==='boolean'))return false;
      if(!object(s.rounds)||!Object.entries(s.rounds).every(([host,r])=>content.hosts[host]&&r&&r.host===host&&typeof r.id==='string'&&r.tasks?.length===5&&r.tasks.every(t=>typeof t.id==='string'&&Array.isArray(t.choices)&&t.choices.includes(t.answer)&&t.choices.every(v=>typeof v==='string')&&['count','shape','sentence','word','rhyme'].includes(t.kind))&&Number.isInteger(r.index)&&r.index>=0&&r.index<=5&&Array.isArray(r.attempts)&&Array.isArray(r.support)&&Number.isFinite(r.activeMilliseconds)&&r.activeMilliseconds>=0&&typeof r.rewarded==='boolean'&&(r.index===5)===r.rewarded))return false;
      if(!s.drawings||!['free','leaf'].every(k=>strokes(s.drawings[k]))||!['free','leaf'].includes(s.selectedPage))return false;
      if(!s.settings||!['speech','music','ambience'].every(k=>typeof s.settings[k]==='boolean'))return false;
      if(!s.world||!Number.isFinite(s.world.x)||!Number.isFinite(s.world.z)||(s.world.region!==undefined&&typeof s.world.region!=='string'))return false;
      if(s.collected!==undefined&&!(object(s.collected)&&Object.entries(s.collected).every(([id,v])=>/^goldleaf-\d{1,2}$/.test(id)&&v===true)))return false;
      if(s.animation!==null&&(!['apple','bath'].includes(s.animation?.item)||typeof s.animation.transactionId!=='string'||!['den','forest','shop'].includes(s.animation.returnTo)))return false;
      return object(s.previous)&&object(s.completed)&&object(s.seenExamples)&&Array.isArray(s.transactions);
    }
    function decode(raw){try{const s=JSON.parse(raw);return valid(s)?s:null;}catch{return null;}}
    function status(message=''){error=message;onStatus({saved:!error,error,blocked});}
    const log=Logging.createRecorder({storage,key:logKey,now,metadata:()=>({sessionId,development,appVersion:typeof appVersion==='function'?appVersion():appVersion,saveVersion:SCHEMA,contentVersion:content.version,...(state?{journeyId:state.mail?.session?.id,letterIndex:state.mail?.index,mailPhase:state.mail?.phase,invitedHost:state.mail?.host}:{}),...logContext()})});
    function record(event,details={}){return log.record(event,details);}
    try{
      expected=storage.getItem(key);state=decode(expected);
      if(!state&&expected!==null){
        let newer=false;try{newer=JSON.parse(expected)?.schema>SCHEMA;}catch{}
        const fallback=newer?null:decode(storage.getItem(backup));
        if(fallback){state=fallback;status('Der letzte sichere Spielstand wurde geladen. Bitte erneut speichern.');}
        else{state=fresh();blocked=true;status('Dein Spielstand konnte nicht geladen werden. Die gespeicherten Daten bleiben erhalten.');}
      }else if(!state)state=fresh();
    }catch{state=fresh();blocked=true;readFailed=true;status('Dein Spielstand konnte nicht geladen werden.');}
    prepare(state);
    function commit(change,event,details={}){
      if(blocked)return false;
      const next=clone(state);if(change(next)===false)return false;
      next.schema=SCHEMA;next.revision=state.revision+1;
      if(!valid(next))throw new Error('Invalid friends save');
      try{
        if(storage.getItem(key)!==expected){blocked=true;status('Das Spiel ist in einem anderen Fenster verändert worden. Bitte neu laden.');return false;}
        // Keep the previous validated envelope before replacing it. setItem itself is atomic.
        if(decode(expected))storage.setItem(backup,expected);
        const raw=JSON.stringify(next);storage.setItem(key,raw);expected=raw;state=next;status();
        if(event)record(event,details);return true;
      }catch{status('Dein Spielstand konnte nicht gespeichert werden.');record('storage_error',{scope:'journey_state',operation:event});return false;}
    }
    record('session_start',{loaded:expected!==null});
    if(expected===null&&!blocked)commit(()=>{},'save_created');
    function shuffled(a){const out=clone(a);for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
    function start(host){
      if(!content.hosts[host])return false;
      if(state.rounds[host]){record('task_resume',{host,roundId:state.rounds[host].id,taskId:state.rounds[host].tasks[state.rounds[host].index]?.id});return true;}
      let pool=shuffled(content.pools[host]);const previous=state.previous[host]||[];
      pool.sort((a,b)=>Number(previous.includes(a.id))-Number(previous.includes(b.id)));
      const tasks=pool.slice(0,5).map(t=>({...t,choices:shuffled(t.choices)}));const id=uid();
      return commit(s=>{s.rounds[host]={id,host,tasks,index:0,attempts:[],support:[],activeMilliseconds:0,feedback:null,rewarded:false,skipped:false};},'round_start',{host,roundId:id,category:content.hosts[host].category,reference:content.hosts[host].reference,tasks});
    }
    function answer(host,value,activeMilliseconds=0,skip=false){
      const r=state.rounds[host];if(!r||r.index>=5||r.feedback==='correct'||(skip&&!development))return false;
      const t=r.tasks[r.index];if(!skip&&!t.choices.includes(value))return false;
      const correct=skip||value===t.answer, completed=correct&&r.index===4;
      const details={host,roundId:r.id,taskId:t.id,prompt:t,answer:value,correct:skip?null:correct,attempt:r.attempts.filter(a=>a.taskId===t.id).length+1,supportUsed:r.support.filter(a=>a.taskId===t.id),activeMilliseconds};
      let mailAdvanced=false;
      return commit(s=>{
        const round=s.rounds[host];round.attempts.push({...details,prompt:undefined});round.activeMilliseconds+=activeMilliseconds;round.feedback=correct?'correct':'retry';round.selection=value;round.skipped=round.skipped||skip;
        if(completed){round.index=5;round.rewarded=true;round.feedback=null;s.previous[host]=round.tasks.map(t=>t.id);s.completed[host]=(s.completed[host]||0)+1;
          mailAdvanced=finishMail(s,host);
        }
      },skip?'development_skip':'answer_submitted',details)&&(!completed||(record('puzzle_completed',{host,roundId:r.id,mailAdvanced}),true));
    }
    const api={key,get:()=>clone(state),round:host=>clone(state.rounds[host]||null),audioSettings:()=>({...state.settings}),get error(){return error;},get blocked(){return blocked;},development,record,start,answer,
      mail:()=>clone(state.mail),
      openLetter(){return commit(s=>{if(!['den-letter','to-mailman'].includes(s.mail.phase)||s.mail.session.completed>=s.mail.session.limit)return false;if(s.mail.phase==='to-mailman')nextHost(s);s.mail.phase='to-friend';},'letter_opened');},
      canPuzzle(host){return state.mail.phase==='to-friend'&&state.mail.host===host&&state.mail.session.completed<state.mail.session.limit;},
      setLetterLimit(limit){if(!letterLimit(limit))return false;return commit(s=>{s.settings.letterLimit=limit;if(s.mail.phase==='den-letter')s.mail.session.limit=limit;},'letter_limit',{limit});},
      startLetterSession(limit=state.settings.letterLimit){if(!letterLimit(limit))return false;return commit(s=>{
        // An unopened invitation can return later; a restart must choose a different friend.
        if(s.mail.phase==='den-letter'&&!s.mail.remaining.includes(s.mail.host))s.mail.remaining.push(s.mail.host);
        nextHost(s);
        s.settings.letterLimit=limit;s.mail.phase='den-letter';s.mail.session=session(limit);
      },'letter_session_started',{limit});},
      beginSleep(){return commit(s=>{if(s.mail.phase!=='return-home')return false;s.mail.phase='sleeping';},'letter_session_sleep');},
      finishLetterSession(){return commit(s=>{if(s.mail.phase!=='sleeping')return false;s.mail.phase='finished';},'letter_session_finished');},
      completeMail(host){return commit(s=>finishMail(s,host),'mail_puzzle_completed',{host});},
      retrySave(){
        if(readFailed){
          try{const raw=storage.getItem(key),loaded=raw===null?fresh():decode(raw);if(!loaded)return false;state=prepare(loaded);expected=raw;blocked=false;readFailed=false;}
          catch{return false;}
        }
        return commit(()=>{},'save_retry');
      },
      duration(host,milliseconds){return commit(s=>{if(!s.rounds[host])return false;s.rounds[host].activeMilliseconds+=milliseconds;},'task_duration',{host,activeMilliseconds:milliseconds});},
      advance(host){return commit(s=>{const r=s.rounds[host];if(!r||r.feedback!=='correct'||r.index>=5)return false;r.index++;r.feedback=null;r.selection=null;},'task_start',{host});},
      acknowledge(host){return commit(s=>{if(!s.rounds[host]?.rewarded)return false;delete s.rounds[host];},'round_acknowledged',{host});},
      help(host,kind){const r=state.rounds[host];if(!r||r.index>=5)return false;return commit(s=>{s.rounds[host].support.push({taskId:r.tasks[r.index].id,kind});},'help',{host,roundId:r.id,taskId:r.tasks[r.index].id,kind});},
      seenExample(host){return commit(s=>{s.seenExamples[host]=true;},'example',{host});},
      // Old collected records remain readable; golden leaves are retired.
      collect(){return false;},
      // Kept as inert compatibility methods: purchases and paid treats no longer exist.
      buy(){return false;},
      use(){return false;},
      finishAnimation(skipped=false){return commit(s=>{if(!s.animation)return false;s.animation=null;},skipped?'animation_skip':'animation_complete');},
      setting(name,value){if(!['music','ambience','speech'].includes(name))return false;return commit(s=>{s.settings[name]=!!value;},'setting',{name,value});},
      // Positions are {x,z} in world metres; outside region `home` the region id is added ({region,x,z}).
      position(x,z,region){return commit(s=>{s.world=region&&region!=='home'?{region,x,z}:{x,z};},'movement_sample',{area:'forest',x,z,...(region&&region!=='home'?{region}:{})});},
      selectPage(page){return commit(s=>{if(!['free','leaf'].includes(page))return false;s.selectedPage=page;},'drawing_page',{page});},
      draw(page,strokes){return commit(s=>{if(!['free','leaf'].includes(page))return false;s.drawings[page]=clone(strokes);},'drawing_saved',{page,strokes:strokes.length});},
      exportLog:()=>log.exportData(),
      flushLog:()=>log.flush(),
      get logStatus(){return log.status();},
      clearLog:()=>log.clear(),
      exportSave:()=>({schema:SCHEMA,save:clone(state),original:blocked?expected:undefined}),
    };return api;
  }
  const api={create,SCHEMA};if(typeof module!=='undefined')module.exports=api;else root.FriendsState=api;
})(typeof window!=='undefined'?window:globalThis);
