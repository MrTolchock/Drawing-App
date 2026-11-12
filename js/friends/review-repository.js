/* Durable editorial records. GitHub is authoritative; the device keeps an offline cache and an outbox. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.FK.ReviewRepository=api;
})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  const CONFIG={owner:'MrTolchock',repo:'Drawing-App',branch:'puzzle-review-data',path:'reviews.json'};
  const clone=value=>JSON.parse(JSON.stringify(value));
  const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}':JSON.stringify(value);
  const same=(a,b)=>canonical(a??null)===canonical(b??null);
  const equivalent=(a,b)=>!!a&&!!b&&['key','revision','status','note','seen'].every(key=>same(a[key],b[key]));
  const address=entry=>entry.key+'@'+entry.revision;
  const empty=()=>({format:'farbtupf-review-ledger',version:1,entries:{},history:[]});
  const isObject=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  function validEntry(entry){
    return isObject(entry)&&typeof entry.key==='string'&&entry.key.length<=250&&typeof entry.revision==='string'&&entry.revision.length<=100&&
      ['pending','approved','improve'].includes(entry.status)&&typeof entry.note==='string'&&entry.note.length<=4000&&
      typeof entry.at==='string'&&Number.isFinite(Date.parse(entry.at))&&typeof entry.seen==='boolean'&&
      (entry.operation===undefined||typeof entry.operation==='string'&&entry.operation.length<=150)&&
      (entry.status!=='approved'||entry.key.startsWith('puzzle:')||entry.seen);
  }
  function validate(ledger){
    if(!isObject(ledger)||ledger.format!=='farbtupf-review-ledger'||ledger.version!==1||!isObject(ledger.entries)||!Array.isArray(ledger.history)||
      !Object.entries(ledger.entries).every(([key,value])=>validEntry(value)&&address(value)===key)||!ledger.history.every(validEntry))throw Error('Ungültige GitHub-Prüfdaten. Die lokale Sicherung bleibt erhalten.');
    return ledger;
  }
  function merge(ledger,pending){
    const next=clone(validate(ledger)),conflicts={},accepted=[];
    for(const [key,change]of Object.entries(pending)){
      if(!isObject(change)||!validEntry(change.entry)||address(change.entry)!==key||change.base!==null&&!validEntry(change.base))throw Error('Die lokale Warteschlange ist ungültig. Bitte die Prüfung exportieren.');
      const remote=next.entries[key]||null;
      if(equivalent(remote,change.entry)||remote?.operation&&remote.operation===change.entry.operation){accepted.push(key);continue;}
      if(!same(remote,change.base)){conflicts[key]={remote,local:change.entry};continue;}
      if(remote)next.history.push(remote);
      next.entries[key]=clone(change.entry);accepted.push(key);
    }
    return {ledger:next,conflicts,accepted};
  }
  function create({vault,catalogue,fetch:request,tokenStorage,config=CONFIG,onChange=()=>{},now=()=>new Date().toISOString(),newId=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),debounce=1000}){
    const tokenKey='farbtupf.github-review-session.v1',baseURL='https://api.github.com/repos/'+config.owner+'/'+config.repo;
    const fileURL=baseURL+'/contents/'+config.path,rawURL='https://raw.githubusercontent.com/'+config.owner+'/'+config.repo+'/'+config.branch+'/'+config.path;
    let token='',busy=null,timer=null,stopped=false,lastPull=0,observed=null;
    let state={phase:'idle',message:'Prüfung wird von GitHub geladen.',pending:0,conflicts:{},connected:false,lastSyncedAt:null};
    try{token=tokenStorage?.getItem(tokenKey)||'';}catch{/* Reading and offline play do not need a token. */}
    const read=()=>vault.read();
    const meta=data=>isObject(data.repository)&&isObject(data.repository.base)&&isObject(data.repository.pending)?data.repository:{base:{},pending:{},checked:false,lastSyncedAt:null};
    function publish(phase,message,extra={}){
      const m=meta(read());state={...state,...extra,phase,message,pending:Object.keys(m.pending).length,connected:!!token,lastSyncedAt:m.lastSyncedAt};onChange(clone(state));return state;
    }
    function entryFor(decision,data){return {key:decision.key,revision:decision.revision,status:decision.status,note:decision.note,at:decision.at,seen:decision.key.startsWith('puzzle:')||data.seen[decision.key]===decision.revision,operation:newId()};}
    function stage(next,previous){
      next=clone(next);next.repository=clone(meta(previous));
      for(const [key,decision]of Object.entries(next.decisions))if(!same(decision,previous.decisions[key])){
        const entry=entryFor(decision,next),id=address(entry),old=next.repository.pending[id];
        // An old record without inspection evidence stays local and must be reviewed again.
        if(validEntry(entry))next.repository.pending[id]={base:old?old.base:next.repository.base[id]||null,entry,ancestors:old?[...(old.ancestors||[]),old.entry.operation].filter(Boolean).slice(-1000):[]};
      }
      return next;
    }
    function initialise(){
      const data=read();if(isObject(data.repository)&&isObject(data.repository.base)&&isObject(data.repository.pending))return;
      // Preserve decisions made before shared storage existed; they remain in the outbox until saved.
      const next=stage(data,{...data,decisions:{}});if(!vault.write(next))throw Error('Die lokale Prüfung konnte nicht gesichert werden.');
    }
    function currentIds(){
      const ids=new Set();for(const game of catalogue.games()){
        ids.add('puzzle:'+game.id+'@'+catalogue.puzzleRevision(game.id));
        for(const item of catalogue.iterations(game.id))ids.add(item.id+'@'+catalogue.iterationRevision(game.id,item));
      }return ids;
    }
    function apply(ledger){
      validate(ledger);observed=ledger;const data=read(),m=clone(meta(data)),next=clone(data),wanted=currentIds();
      const pending=m.pending;
      for(const [id,change]of Object.entries(pending))if(equivalent(ledger.entries[id],change.entry)||ledger.entries[id]?.operation===change.entry.operation)delete pending[id];
      for(const [id,change]of Object.entries(pending))if(ledger.entries[id]?.operation&&Array.isArray(change.ancestors)&&change.ancestors.includes(ledger.entries[id].operation))change.base=clone(ledger.entries[id]);
      const selected={};
      for(const entry of Object.values(ledger.entries)){
        const old=selected[entry.key],preferred=wanted.has(address(entry));
        if(!old||preferred&&!wanted.has(address(old))||preferred===wanted.has(address(old))&&entry.at>old.at)selected[entry.key]=entry;
      }
      for(const [key,decision]of Object.entries(data.decisions))if(m.base[key+'@'+decision.revision]&&!selected[key]&&!Object.values(pending).some(change=>change.entry.key===key))delete next.decisions[key];
      // GitHub's current record wins unless this device has an explicit unsaved edit for that revision.
      for(const [key,entry]of Object.entries(selected))next.decisions[key]={key,revision:entry.revision,status:entry.status,note:entry.note,at:entry.at};
      for(const change of Object.values(pending)){
        const entry=change.entry,key=entry.key;
        if(wanted.has(address(entry))||!selected[key])next.decisions[key]={key,revision:entry.revision,status:entry.status,note:entry.note,at:entry.at};
      }
      for(const [key,decision]of Object.entries(data.decisions))if(!same(decision,next.decisions[key]))next.history.push(clone(decision));
      for(const entry of [...Object.values(selected),...Object.values(pending).map(change=>change.entry)])if(entry.seen&&next.decisions[entry.key]?.revision===entry.revision)next.seen[entry.key]=entry.revision;
      const keep=new Set([...wanted,...Object.keys(pending),...Object.values(selected).map(address)]);
      next.repository={base:Object.fromEntries(Object.entries(ledger.entries).filter(([id])=>keep.has(id))),pending,checked:true,lastSyncedAt:now()};
      if(!vault.write(next))throw Error('GitHub wurde gelesen, aber die lokale Sicherung konnte nicht gespeichert werden.');
      state.conflicts=merge(ledger,pending).conflicts;
    }
    function headers(auth=false){return {Accept:'application/vnd.github+json',...(auth?{Authorization:'Bearer '+token}:{}),'X-GitHub-Api-Version':'2022-11-28'};}
    function forgetToken(){token='';try{tokenStorage?.removeItem(tokenKey);}catch{}}
    async function json(response){
      if(!response.ok){
        if(response.status===401||response.status===403){const error=Error('GitHub-Verbindung prüfen: Zugriff fehlt oder ist abgelaufen. Änderungen bleiben lokal gesichert.');error.status=response.status;throw error;}
        if(response.status===404)throw Error('Die GitHub-Prüfdatei wurde nicht gefunden. Änderungen bleiben lokal gesichert.');
        throw Error('GitHub ist gerade nicht erreichbar ('+response.status+'). Änderungen bleiben lokal gesichert.');
      }return response.json();
    }
    async function load(auth=false){
      if(!auth){const response=await request(rawURL+'?check='+Date.now(),{cache:'no-store',credentials:'omit'});return {ledger:validate(await json(response))};}
      const file=await json(await request(fileURL+'?ref='+encodeURIComponent(config.branch),{headers:headers(true),cache:'no-store',credentials:'omit'}));
      // Larger files omit inline content. Read their immutable blob, never a moving branch with an older SHA.
      const blob=file.content?file:await json(await request(baseURL+'/git/blobs/'+file.sha,{headers:headers(true),cache:'no-store',credentials:'omit'}));
      const binary=globalThis.atob?globalThis.atob(blob.content.replace(/\s/g,'')):Buffer.from(blob.content,'base64').toString('binary');
      const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0)),ledger=JSON.parse(new TextDecoder().decode(bytes));
      return {ledger:validate(ledger),sha:file.sha};
    }
    function encode(value){const bytes=new TextEncoder().encode(JSON.stringify(value,null,2)+'\n');let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return globalThis.btoa?globalThis.btoa(binary):Buffer.from(bytes).toString('base64');}
    async function run(write=false){
      if(stopped)return false;
      if(busy){await busy;if(write&&token&&Object.keys(meta(read()).pending).length)return run(true);return true;}
      busy=(async()=>{
        let lostConnection=false;
        try{
          initialise();publish('loading',write?'Änderungen werden auf GitHub gespeichert.':'Prüfung wird von GitHub geladen.');
          for(let attempt=0;attempt<3;attempt++){
            let remote;
            try{remote=await load(!!token);}catch(error){
              if(token&&(error.status===401||error.status===403)){forgetToken();lostConnection=true;remote=await load(false);}else throw error;
            }
            apply(remote.ledger);lastPull=Date.now();
            const pending=clone(meta(read()).pending),result=merge(remote.ledger,pending);
            if(!write||!token||!Object.keys(meta(read()).pending).length)break;
            if(same(result.ledger,remote.ledger))break;
            const response=await request(fileURL,{method:'PUT',headers:{...headers(true),'Content-Type':'application/json'},credentials:'omit',body:JSON.stringify({message:'Update puzzle review decisions',branch:config.branch,sha:remote.sha,content:encode(result.ledger)})});
            if(response.status===409||response.status===422){if(attempt===2)throw Error('GitHub wurde gleichzeitig geändert. Bitte nochmals synchronisieren.');continue;}
            await json(response);apply(result.ledger);
            if(!Object.keys(meta(read()).pending).length)break;
          }
          const m=meta(read()),count=Object.keys(m.pending).length,conflicts=state.conflicts;
          if(Object.keys(conflicts).length)publish('conflict','Änderungen auf einem anderen Gerät gefunden. Bitte die Entscheidung auswählen.',{conflicts});
          else if(count)publish('pending',token?'Weitere Änderungen warten auf GitHub.':'Nur lokal gesichert. Zum Speichern auf GitHub verbinden.');
          else publish('saved',lostConnection?'Prüfung geladen. GitHub zum Bearbeiten erneut verbinden.':'Auf GitHub gespeichert. Auf anderen Geräten wieder verfügbar.',{conflicts:{}});
          return true;
        }catch(error){if(error.status===401||error.status===403)forgetToken();publish('error',error instanceof TypeError?'GitHub ist nicht erreichbar. Änderungen bleiben lokal gesichert und werden später übertragen.':error.message||'GitHub ist nicht erreichbar. Die lokale Sicherung bleibt erhalten.');return false;}
      })();
      try{return await busy;}finally{busy=null;}
    }
    function schedule(){
      if(stopped)return;clearTimeout(timer);
      const count=Object.keys(meta(read()).pending).length;
      if(!count)return;
      publish('pending',token?'Lokal gesichert. Speichern auf GitHub folgt.':'Nur lokal gesichert. Zum Speichern auf GitHub verbinden.');
      if(token)timer=setTimeout(()=>run(true),debounce);
    }
    async function connect(value){
      const candidate=String(value).trim();if(!candidate||candidate.length>500){publish('error','Bitte einen gültigen GitHub-Zugriffstoken eingeben.');return false;}
      const old=token;token=candidate;
      try{
        const user=await json(await request('https://api.github.com/user',{headers:headers(true),credentials:'omit'}));
        if(user.login.toLowerCase()!==config.owner.toLowerCase())throw Error('Diese Prüfung gehört zum GitHub-Konto '+config.owner+'.');
        await json(await request(baseURL,{headers:headers(true),credentials:'omit'}));
        try{tokenStorage?.setItem(tokenKey,token);}catch{/* A temporary in-memory connection still works. */}
        await run(true);return !!token&&state.phase!=='error';
      }catch(error){token=old;publish('error',error.message);return false;}
    }
    function disconnect(){clearTimeout(timer);forgetToken();publish('idle','GitHub getrennt. Lesen und lokale Sicherung bleiben verfügbar.');}
    async function resolve(id,choice){
      const data=read(),m=clone(meta(data)),change=m.pending[id];if(!change)return false;
      if(choice==='remote'){delete m.pending[id];}
      else if(choice==='local'){change.base=observed?.entries[id]||null;change.entry={...change.entry,at:now(),operation:newId()};m.pending[id]=change;}
      else return false;
      const next=clone(data);next.repository=m;if(!vault.write(next))return false;
      if(observed)apply(observed);return run(true);
    }
    function confirmed(id){
      const m=meta(read()),base=observed?.entries||m.base;
      if(!m.checked&&!observed)return false;
      const okay=(key,revision)=>base[key+'@'+revision]?.status==='approved';
      return okay('puzzle:'+id,catalogue.puzzleRevision(id))&&catalogue.iterations(id).every(item=>okay(item.id,catalogue.iterationRevision(id,item)));
    }
    function refresh(){return run(!!token);}
    function resume(){if(Date.now()-lastPull>60000||Object.keys(meta(read()).pending).length)return refresh();return Promise.resolve(true);}
    function stop(){stopped=true;clearTimeout(timer);}
    return {stage,schedule,connect,disconnect,refresh,resume,resolve,confirmed,stop,start:refresh,get state(){return clone(state);},url:'https://github.com/'+config.owner+'/'+config.repo+'/blob/'+config.branch+'/'+config.path,config:clone(config)};
  }
  return {CONFIG,create,empty,validate,merge,address};
});
