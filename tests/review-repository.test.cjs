const {test}=require('node:test'),assert=require('node:assert/strict');
const R=require('../js/friends/review-repository.js'),{remoteServer}=require('./review-repository-support.cjs');
const clone=v=>JSON.parse(JSON.stringify(v));
const catalogue={games:()=>[{id:'add'}],iterations:()=>Array.from({length:25},(_,i)=>({id:'add/'+i})),puzzleRevision:()=> 'puzzle-r1',iterationRevision:(_id,it)=>'r-'+it.id};
function client(server,saved,options={}){
 let data=saved?clone(saved):{version:1,decisions:{},seen:{},history:[]};const session=new Map();let index=0;
 const vault={read:()=>data,write:next=>{data=clone(next);return true;}};
 const repo=R.create({vault,catalogue,fetch:server.fetch,tokenStorage:{getItem:k=>session.get(k),setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)},newId:()=> 'operation-'+Math.random()+'-'+(++index),debounce:60000,...options});
 function decide(key,status,revision='r-'+key,note=''){
  const previous=clone(data),next=clone(data);next.seen[key]=revision;next.decisions[key]={key,revision,status,note,at:new Date().toISOString()};data=repo.stage(next,previous);
 }
 return {repo,decide,vault,session,get data(){return clone(data);}};
}
test('records survive a fresh device, refresh and lost browser storage through GitHub',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();a.decide('add/0','approved');
 assert.equal(a.repo.confirmed('add'),false);assert.ok(await a.repo.connect('test-review-token'));assert.equal(a.repo.state.pending,0);assert.equal(server.writes.length,1);
 const b=client(server);await b.repo.start();assert.equal(b.data.decisions['add/0'].status,'approved');assert.equal(b.repo.state.connected,false);
 const restarted=client(server,a.data);await restarted.repo.start();assert.equal(restarted.data.decisions['add/0'].status,'approved');assert.equal(restarted.repo.state.pending,0);
 a.repo.stop();b.repo.stop();restarted.repo.stop();
});
test('offline outbox survives restart and cannot masquerade as a published approval',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();server.offline=true;a.decide('add/1','approved');assert.equal(await a.repo.refresh(),false);assert.equal(a.repo.state.pending,1);
 const b=client(server,a.data);assert.equal(await b.repo.start(),false);assert.equal(b.repo.state.pending,1);assert.equal(b.data.decisions['add/1'].status,'approved');
 server.offline=false;await b.repo.connect('test-review-token');assert.equal(b.repo.state.phase,'saved');assert.equal(server.ledger.entries['add/1@r-add/1'].status,'approved');a.repo.stop();b.repo.stop();
});
test('legacy decisions without inspection proof are preserved without publishing an unverified approval',async()=>{
 const server=remoteServer(),old={version:1,decisions:{'add/0':{key:'add/0',revision:'older-revision',status:'approved',note:'Original review note',at:new Date().toISOString()}},seen:{},history:[]},a=client(server,old);
 await a.repo.start();assert.equal(a.repo.state.pending,1);await a.repo.connect('test-review-token');const entry=server.ledger.entries['add/0@older-revision'];
 assert.equal(entry.status,'pending');assert.equal(entry.legacyStatus,'approved');assert.equal(entry.note,'Original review note');assert.equal(a.repo.confirmed('add'),false);a.repo.stop();
});
test('a later compatible puzzle sign-off recovers downgraded iteration approvals read-only',async()=>{
 const ledger=R.empty();
 for(const it of catalogue.iterations('add')){
  const entry={key:it.id,revision:catalogue.iterationRevision('add',it),status:'approved',note:'',at:'2026-11-18T07:50:00Z',seen:true};
  ledger.entries[R.address(entry)]=entry;
 }
 const legacy=ledger.entries['add/0@r-add/0'];Object.assign(legacy,{status:'pending',seen:false,legacyStatus:'approved'});
 const server=remoteServer(ledger),a=client(server);await a.repo.start();
 assert.equal(a.repo.confirmed('add'),false);
 const signoff={key:'puzzle:add',revision:catalogue.puzzleRevision('add'),status:'approved',note:'',at:'2026-11-18T08:00:00Z',seen:true};
 ledger.entries[R.address(signoff)]=signoff;server.ledger=ledger;await a.repo.refresh();
 assert.equal(a.data.decisions['add/0'].status,'approved');assert.equal(a.data.seen['add/0'],legacy.revision);assert.equal(a.repo.confirmed('add'),true);
 assert.equal(server.ledger.entries['add/0@r-add/0'].status,'pending');assert.equal(server.writes.length,0);
 const later={key:legacy.key,revision:'later-revision',status:'improve',note:'Noch offen.',at:'2026-11-18T08:01:00Z',seen:true};
 ledger.entries[R.address(later)]=later;server.ledger=ledger;await a.repo.refresh();
 assert.equal(a.repo.confirmed('add'),false);assert.equal(a.data.decisions['add/0'].note,later.note);a.repo.stop();
});
test('independent browsers merge different items without losing either decision',async()=>{
 const server=remoteServer(),a=client(server),b=client(server);await a.repo.start();await b.repo.start();
 a.decide('add/1','approved');b.decide('add/2','improve');await a.repo.connect('test-review-token');await b.repo.connect('test-review-token');await a.repo.refresh();
 assert.equal(a.data.decisions['add/2'].status,'improve');assert.equal(b.data.decisions['add/1'].status,'approved');assert.equal(Object.keys(server.ledger.entries).length,2);a.repo.stop();b.repo.stop();
});
test('conflicting edits require an explicit choice and never silently overwrite GitHub',async()=>{
 const server=remoteServer(),a=client(server),b=client(server);await a.repo.start();await b.repo.start();a.decide('add/0','approved');b.decide('add/0','improve');
 await a.repo.connect('test-review-token');await b.repo.connect('test-review-token');assert.equal(b.repo.state.phase,'conflict');assert.equal(server.ledger.entries['add/0@r-add/0'].status,'approved');assert.equal(b.repo.state.pending,1);
 await b.repo.resolve('add/0@r-add/0','remote');assert.equal(b.data.decisions['add/0'].status,'approved');assert.equal(b.repo.state.pending,0);
 b.decide('add/0','improve');a.decide('add/0','pending');await a.repo.refresh();await b.repo.refresh();assert.equal(b.repo.state.phase,'conflict');
 await b.repo.resolve('add/0@r-add/0','local');assert.equal(server.ledger.entries['add/0@r-add/0'].status,'improve');a.repo.stop();b.repo.stop();
});
test('different content revisions coexist; older browsers cannot replace a newer sign-off',async()=>{
 const server=remoteServer(),a=client(server),b=client(server);await a.repo.start();await b.repo.start();a.decide('add/0','approved','new-revision');b.decide('add/0','improve','old-revision');
 await a.repo.connect('test-review-token');await b.repo.connect('test-review-token');assert.equal(server.ledger.entries['add/0@new-revision'].status,'approved');assert.equal(server.ledger.entries['add/0@old-revision'].status,'improve');a.repo.stop();b.repo.stop();
});
test('fresh devices restore older feedback without replacing current decisions, granting approval or uploading it',async()=>{
 const ledger=R.empty(),at='2026-11-15T20:58:24.776Z';
 const old={key:'add/0',revision:'before-new-pictures',status:'improve',note:'Die Äpfel in die Mitte setzen.',at,seen:true};
 const current={...old,revision:'r-add/0',status:'pending',note:'',at:'2026-11-16T12:00:00.000Z'};
 ledger.entries['add/0@before-new-pictures']=old;ledger.entries['add/0@r-add/0']=current;
 ledger.history.push({...old,note:'Die Tiere von den Feldern entfernen.'});
 const server=remoteServer(ledger),a=client(server);await a.repo.start();
 assert.equal(a.data.decisions['add/0'].revision,'r-add/0');assert.equal(a.data.decisions['add/0'].status,'pending');assert.equal(a.data.decisions['add/0'].note,'');
 assert.deepEqual(a.data.history.map(d=>d.note).sort(),['Die Tiere von den Feldern entfernen.','Die Äpfel in die Mitte setzen.'].sort());
 assert.equal(a.repo.confirmed('add'),false);assert.equal(a.repo.state.pending,0);assert.equal(server.writes.length,0);assert.deepEqual(server.ledger,ledger);
 await a.repo.refresh();assert.equal(a.data.history.length,2,'repeated refresh does not duplicate historical notes');
 server.offline=true;const cached=client(server,a.data);assert.equal(await cached.repo.start(),false);assert.equal(cached.data.history.length,2,'restored notes remain available offline');
 a.repo.stop();cached.repo.stop();
});
test('retry after a lost write response is idempotent, including another edit made during that write',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();await a.repo.connect('test-review-token');a.decide('add/0','approved');
 server.beforePut=async()=>{a.decide('add/0','improve');};server.loseResponse=true;assert.equal(await a.repo.refresh(),false);assert.equal(a.repo.state.pending,1);
 assert.equal(await a.repo.refresh(),true);assert.equal(a.repo.state.phase,'saved');assert.equal(server.ledger.entries['add/0@r-add/0'].status,'improve');assert.equal(server.writes.length,2);a.repo.stop();
});
test('GitHub SHA conflicts retry against the newest file, preserving unrelated writes',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();a.decide('add/0','approved');server.beforePut=async remote=>{const ledger=remote.ledger;ledger.entries['add/2@r-add/2']={key:'add/2',revision:'r-add/2',status:'improve',note:'',seen:true,at:new Date().toISOString()};remote.ledger=ledger;};
 await a.repo.connect('test-review-token');assert.equal(a.repo.state.phase,'saved');assert.equal(Object.keys(server.ledger.entries).length,2);a.repo.stop();
});
test('failed writes retain local edits and token stays out of data, commit bodies and public reads',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();a.decide('add/0','improve','r-add/0','Äpfel prüfen');server.failWrite=true;
 assert.equal(await a.repo.connect('test-review-token'),false);assert.equal(a.repo.state.pending,1);assert.equal(a.repo.state.phase,'error');assert.doesNotMatch(JSON.stringify(a.data),/test-review-token/);
 for(const request of server.requests){assert.doesNotMatch(request.url+String(request.body),/test-review-token/);if(request.url.startsWith('https://raw.'))assert.equal(request.headers.Authorization,undefined);}
 server.failWrite=false;await a.repo.refresh();assert.equal(server.ledger.entries['add/0@r-add/0'].note,'Äpfel prüfen');assert.doesNotMatch(JSON.stringify(server.ledger),/test-review-token/);a.repo.disconnect();assert.equal(a.session.size,0);a.repo.stop();
});
test('large review files are read by immutable blob SHA before merging',async()=>{
 const server=remoteServer();server.omitContent=true;const a=client(server);await a.repo.start();a.decide('add/0','improve');await a.repo.connect('test-review-token');
 assert.equal(a.repo.state.phase,'saved');assert.ok(server.requests.some(r=>r.url.includes('/git/blobs/sha-1')));assert.equal(server.ledger.entries['add/0@r-add/0'].status,'improve');a.repo.stop();
});
test('an expired editing token does not stop public review restoration',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();a.decide('add/0','approved');await a.repo.connect('test-review-token');
 const ledger=server.ledger;ledger.entries['add/0@r-add/0']={...ledger.entries['add/0@r-add/0'],status:'improve',operation:'other-device'};server.ledger=ledger;server.denyAuth=true;
 await a.repo.refresh();assert.equal(a.data.decisions['add/0'].status,'improve');assert.equal(a.repo.state.connected,false);assert.equal(a.session.size,0);assert.equal(a.repo.state.phase,'saved');a.repo.stop();
});
test('automatic saves batch quick decisions without making a commit for every tap',async()=>{
 const server=remoteServer(),a=client(server,null,{debounce:1,minWriteGap:80});await a.repo.start();await a.repo.connect('test-review-token');a.decide('add/0','approved');await a.repo.refresh();
 a.decide('add/1','improve');a.repo.schedule();a.decide('add/2','approved');a.repo.schedule();await new Promise(resolve=>setTimeout(resolve,10));assert.equal(server.writes.length,1);
 await new Promise(resolve=>setTimeout(resolve,110));assert.equal(server.writes.length,2);assert.equal(Object.keys(server.ledger.entries).length,3);assert.equal(a.repo.state.pending,0);a.repo.stop();
});
test('a GitHub rate limit retains the editing connection and every queued decision',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();await a.repo.connect('test-review-token');server.rateLimit=true;a.decide('add/0','improve');await a.repo.refresh();
 assert.equal(a.repo.state.connected,true);assert.equal(a.repo.state.pending,1);assert.match(a.repo.state.message,/Pause/);server.rateLimit=false;await a.repo.refresh();assert.equal(a.repo.state.pending,0);a.repo.stop();
});
test('only confirmed current-revision decisions release a complete puzzle',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();for(const item of catalogue.iterations())a.decide(item.id,'approved');a.decide('puzzle:add','approved','puzzle-r1');assert.equal(a.repo.confirmed('add'),false);
 await a.repo.connect('test-review-token');assert.equal(a.repo.confirmed('add'),true);catalogue.puzzleRevision=()=> 'puzzle-r2';assert.equal(a.repo.confirmed('add'),true,'an aggregate puzzle revision does not reopen unchanged iterations');catalogue.puzzleRevision=()=> 'puzzle-r1';
 const original=catalogue.iterationRevision;catalogue.iterationRevision=(id,it)=>it.id==='add/0'?'changed-task':original(id,it);assert.equal(a.repo.confirmed('add'),false);catalogue.iterationRevision=original;
 const ledger=server.ledger;delete ledger.entries['add/0@r-add/0'];server.ledger=ledger;await a.repo.refresh();assert.equal(a.data.decisions['add/0'],undefined);assert.equal(a.repo.confirmed('add'),false);a.repo.stop();
});
test('malformed or uninspected remote approvals preserve the last working cache',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();a.decide('add/0','approved');await a.repo.connect('test-review-token');const before=a.data.decisions;
 const ledger=server.ledger;ledger.entries['add/0@r-add/0'].seen=false;server.ledger=ledger;assert.equal(await a.repo.refresh(),false);assert.deepEqual(a.data.decisions,before);a.repo.stop();
});

test('the first connected sync creates the missing data branch with only reviews.json, then saves to it',async()=>{
 const server=remoteServer();server.missing=true;const a=client(server);
 await a.repo.start();assert.notEqual(a.repo.state.phase,'error','reading without a connection treats a missing file as nothing shared yet');
 a.decide('add/0','approved');assert.ok(await a.repo.connect('test-review-token'));
 assert.equal(server.missing,false);assert.equal(server.ledger.entries['add/0@r-add/0'].status,'approved');assert.equal(a.repo.state.pending,0);a.repo.stop();
});
test('verified equivalent approvals restore read-only and later decisions across aliases take precedence',async()=>{
 const aliases={...catalogue,revisions:(id,item)=>[item?'r-'+item.id:'puzzle-r1',item?'legacy-'+item.id:'legacy-puzzle']};
 const ledger=R.empty(),at='2026-11-14T12:00:00.000Z';
 for(const key of ['puzzle:add',...catalogue.iterations().map(it=>it.id)]){const revision=key.startsWith('puzzle:')?'legacy-puzzle':'legacy-'+key;ledger.entries[key+'@'+revision]={key,revision,status:'approved',note:'Original decision',at,seen:true};}
 const server=remoteServer(ledger),a=client(server,null,{catalogue:aliases});await a.repo.start();assert.ok(a.repo.confirmed('add'));assert.equal(a.repo.state.pending,0);assert.equal(a.repo.state.connected,false);assert.equal(server.writes.length,0);assert.deepEqual(server.ledger,ledger);
 const next=server.ledger;next.entries['add/0@r-add/0']={...next.entries['add/0@legacy-add/0'],revision:'r-add/0',status:'improve',note:'Later rejection',at:'2026-11-14T13:00:00Z'};server.ledger=next;await a.repo.refresh();assert.equal(a.repo.confirmed('add'),false);assert.equal(a.data.decisions['add/0'].status,'improve');
 // An older app can also flag the same unchanged content. Equal-time rejections win.
 next.entries['add/0@r-add/0'].status='approved';next.entries['add/0@legacy-add/0']={...next.entries['add/0@legacy-add/0'],status:'improve',at:'2026-11-14T13:00:00.000Z'};server.ledger=next;await a.repo.refresh();assert.equal(a.repo.confirmed('add'),false);assert.equal(a.data.decisions['add/0'].revision,'legacy-add/0');assert.equal(a.repo.state.pending,0);assert.equal(server.writes.length,0);a.repo.stop();
});
test('later restrictions on other revisions survive recovery and offline restart without rewriting GitHub',async()=>{
 for(const status of ['improve','pending']){
  const aliases={...catalogue,revisions:(id,item)=>[item?'r-'+item.id:'puzzle-r1',item?'legacy-'+item.id:'legacy-puzzle']};
  const ledger=R.empty(),at='2026-11-17T10:00:00Z';
  for(const key of ['puzzle:add',...catalogue.iterations().map(it=>it.id)]){const revision=key.startsWith('puzzle:')?'legacy-puzzle':'legacy-'+key;ledger.entries[key+'@'+revision]={key,revision,status:'approved',note:'Original decision',at,seen:true};}
  const server=remoteServer(ledger),a=client(server,null,{catalogue:aliases});await a.repo.start();assert.equal(a.repo.confirmed('add'),true);
  const later={key:'add/0',revision:'unrecognized-later-renderer',status,note:'Späterer Hinweis bleibt erhalten.',at:'2026-11-17T11:00:00Z',seen:true},next=server.ledger;next.entries[R.address(later)]=later;server.ledger=next;
  await a.repo.refresh();assert.equal(a.repo.confirmed('add'),false);assert.equal(a.data.decisions['add/0'].status,status);assert.equal(a.data.decisions['add/0'].note,later.note);
  server.offline=true;const cached=client(server,a.data,{catalogue:aliases});assert.equal(await cached.repo.start(),false);assert.equal(cached.repo.confirmed('add'),false);assert.equal(cached.data.decisions['add/0'].at,later.at);
  server.offline=false;const fresh=client(server,null,{catalogue:aliases});await fresh.repo.start();assert.deepEqual(fresh.data.decisions['add/0'],a.data.decisions['add/0']);assert.equal(fresh.repo.state.pending,0);assert.equal(server.writes.length,0);assert.deepEqual(server.ledger,next);
  const approved=server.ledger;approved.entries['add/0@r-add/0']={...later,revision:'r-add/0',status:'approved',at:'2026-11-17T12:00:00Z'};server.ledger=approved;await a.repo.refresh();assert.equal(a.repo.confirmed('add'),true,'a later explicit compatible approval can resolve the restriction');
  for(const c of [a,cached,fresh])c.repo.stop();
 }
});

test('comment deletions sync without altering decisions, survive fresh devices and merge independent offline deletions',async()=>{
 const old={key:'add/0',revision:'old-r',status:'improve',note:'Frühere Notiz.',at:'2026-11-15T10:00:00.000Z',seen:true};
 const ledger=R.empty();ledger.entries['add/0@old-r']=old;ledger.history.push({...old,revision:'even-older-r'});
 const server=remoteServer(ledger),a=client(server),b=client(server);await a.repo.start();await b.repo.start();
 function remove(client,key,note){const previous=client.data,next=clone(previous);next.deletedNotes=[...(next.deletedNotes||[]),{key,note,at:'2026-11-17T20:00:00.000Z'}];client.vault.write(client.repo.stage(next,previous));client.repo.schedule();}
 server.offline=true;remove(a,old.key,old.note);assert.equal(a.repo.state.pending,1);assert.equal(await a.repo.refresh(),false);
 const restarted=client(server,a.data);assert.equal(await restarted.repo.start(),false);assert.equal(restarted.repo.state.pending,1,'deletion remains pending after an offline restart');
 server.offline=false;remove(b,'puzzle:add','Andere Notiz.');await b.repo.connect('test-review-token');await restarted.repo.connect('test-review-token');
 assert.equal(restarted.repo.state.pending,0);assert.equal(server.ledger.deletedNotes.length,2);assert.deepEqual(server.ledger.entries,ledger.entries);assert.deepEqual(server.ledger.history,ledger.history);
 const fresh=client(server);await fresh.repo.start();assert.equal(fresh.data.deletedNotes.length,2);assert.equal(fresh.repo.state.pending,0,'restoring deletions does not upload anything');
 const writes=server.writes.length;await restarted.repo.refresh();assert.equal(server.writes.length,writes,'refresh does not repeat a deletion');
 const stale=client(server,a.data);await stale.repo.start();assert.equal(stale.repo.state.pending,0,'another browser acknowledges the same deletion');
 for(const c of [a,b,restarted,fresh,stale])c.repo.stop();
});
test('lost deletion write responses and simultaneous decision conflicts retain the deletion without changing approvals',async()=>{
 const server=remoteServer(),a=client(server),b=client(server);await a.repo.start();await b.repo.start();await a.repo.connect('test-review-token');
 a.decide('add/0','approved');await a.repo.refresh();b.decide('add/0','improve');
 const previous=b.data,next=clone(previous);next.deletedNotes=[{key:'add/1',note:'Überholte Notiz.',at:'2026-11-17T20:00:00.000Z'}];b.vault.write(b.repo.stage(next,previous));
 server.loseResponse=true;await b.repo.connect('test-review-token');assert.equal(b.repo.state.phase,'error');assert.equal(server.ledger.deletedNotes.length,1);assert.equal(server.ledger.entries['add/0@r-add/0'].status,'approved');
 await b.repo.refresh();assert.equal(b.repo.state.phase,'conflict');assert.equal(b.repo.state.pending,1,'only the conflicting decision remains pending');assert.equal(server.ledger.deletedNotes.length,1);
 await b.repo.resolve('add/0@r-add/0','remote');assert.equal(b.repo.state.pending,0);assert.equal(server.ledger.entries['add/0@r-add/0'].status,'approved');a.repo.stop();b.repo.stop();
});
test('malformed comment deletions preserve the working cache',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();const before=a.data;server.ledger={...R.empty(),deletedNotes:[{key:'add/0',note:'Notiz',at:'invalid'}]};
 assert.equal(await a.repo.refresh(),false);assert.deepEqual(a.data,before);a.repo.stop();
});
