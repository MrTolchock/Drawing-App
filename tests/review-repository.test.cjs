const {test}=require('node:test'),assert=require('node:assert/strict');
const R=require('../js/friends/review-repository.js'),{remoteServer}=require('./review-repository-support.cjs');
const clone=v=>JSON.parse(JSON.stringify(v));
const catalogue={games:()=>[{id:'add'}],iterations:()=>Array.from({length:25},(_,i)=>({id:'add/'+i})),puzzleRevision:()=> 'puzzle-r1',iterationRevision:(_id,it)=>'r-'+it.id};
function client(server,saved){
 let data=saved?clone(saved):{version:1,decisions:{},seen:{},history:[]};const session=new Map();let index=0;
 const vault={read:()=>data,write:next=>{data=clone(next);return true;}};
 const repo=R.create({vault,catalogue,fetch:server.fetch,tokenStorage:{getItem:k=>session.get(k),setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)},newId:()=> 'operation-'+Math.random()+'-'+(++index),debounce:60000});
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
test('only confirmed current-revision decisions release a complete puzzle',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();for(const item of catalogue.iterations())a.decide(item.id,'approved');a.decide('puzzle:add','approved','puzzle-r1');assert.equal(a.repo.confirmed('add'),false);
 await a.repo.connect('test-review-token');assert.equal(a.repo.confirmed('add'),true);catalogue.puzzleRevision=()=> 'puzzle-r2';assert.equal(a.repo.confirmed('add'),false);catalogue.puzzleRevision=()=> 'puzzle-r1';
 const ledger=server.ledger;delete ledger.entries['add/0@r-add/0'];server.ledger=ledger;await a.repo.refresh();assert.equal(a.data.decisions['add/0'],undefined);assert.equal(a.repo.confirmed('add'),false);a.repo.stop();
});
test('malformed or uninspected remote approvals preserve the last working cache',async()=>{
 const server=remoteServer(),a=client(server);await a.repo.start();a.decide('add/0','approved');await a.repo.connect('test-review-token');const before=a.data.decisions;
 const ledger=server.ledger;ledger.entries['add/0@r-add/0'].seen=false;server.ledger=ledger;assert.equal(await a.repo.refresh(),false);assert.deepEqual(a.data.decisions,before);a.repo.stop();
});
