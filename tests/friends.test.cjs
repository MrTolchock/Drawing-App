const {test}=require('node:test');
const assert=require('node:assert/strict');
const content=require('../js/friends/content.js');
const {create}=require('../js/friends/state.js');
function storage(){const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),map};}
function fixture(options={}){const s=options.storage||storage();return {storage:s,state:create({storage:s,content,...options})};}
function round(state,host){assert.ok(state.start(host));for(let i=0;i<5;i++){const r=state.get().rounds[host];assert.ok(state.answer(host,r.tasks[r.index].answer,100));if(i<4)assert.ok(state.advance(host));}}
test('new playthroughs start without narration and retired leaves preserve old save data',()=>{
  const {state,storage:s}=fixture();assert.equal(state.get().settings.speech,false);
  const old=state.get();old.collected={'goldleaf-1':true};s.setItem(state.key,JSON.stringify(old));
  const restored=create({storage:s,content}),before=restored.get();assert.equal(restored.collect('goldleaf-2'),false);assert.deepEqual(restored.get(),before);assert.deepEqual(restored.get().collected,{'goldleaf-1':true});
});
test('versioned content has valid, distinct five-task rounds and separate examples',()=>{
  for(const [host,pool] of Object.entries(content.pools)){
    assert.ok(pool.length>=15,host);assert.equal(new Set(pool.map(t=>t.id)).size,pool.length);
    for(const task of pool){assert.equal(task.host,host);assert.equal(new Set(task.choices).size,task.choices.length);assert.ok(task.choices.includes(task.answer));assert.notEqual(task.target,content.examples[host].target||'__example__');}
  }
  assert.ok(content.pools.squirrel.every(t=>t.count>=0&&t.count<=20));
  assert.ok(content.pools.owl.every(t=>t.target.split(' ').length===3&&t.choices.length===2));
});
test('all five rounds record completion without granting currency or duplicate answers',()=>{
  const {state,storage:s}=fixture();for(const [host,data] of Object.entries(content.hosts)){
    round(state,host);assert.equal(state.get().wallet[data.resource],0);assert.equal(state.answer(host,'x'),false);
    const restored=create({storage:s,content});assert.equal(restored.get().wallet[data.resource],0);assert.equal(restored.get().rounds[host].index,5);
    assert.ok(state.acknowledge(host));assert.equal(state.acknowledge(host),false);
  }
});
test('interrupted answers, attempts, support, order and feedback recover as exact snapshots',()=>{
  const {state,storage:s}=fixture();state.start('mouse');let r=state.get().rounds.mouse;const t=r.tasks[0];state.help('mouse','hint');state.answer('mouse',t.choices.find(v=>v!==t.answer),250);state.duration('mouse',200);
  const before=state.get().rounds.mouse;const restored=create({storage:s,content:{...content,version:'future-content',pools:{}}});assert.deepEqual(restored.get().rounds.mouse,before);assert.equal(before.activeMilliseconds,450);
  restored.answer('mouse',t.answer,300);const again=create({storage:s,content});assert.equal(again.get().rounds.mouse.feedback,'correct');assert.equal(again.answer('mouse',t.answer),false);assert.ok(again.advance('mouse'));assert.equal(again.get().rounds.mouse.index,1);
});
test('visiting another host retains interrupted work and subsequent rounds avoid last set',()=>{
  const {state}=fixture();state.start('mouse');const saved=state.get().rounds.mouse;state.start('owl');assert.deepEqual(state.get().rounds.mouse,saved);round(state,'squirrel');const previous=state.get().rounds.squirrel.tasks.map(t=>t.id);state.acknowledge('squirrel');state.start('squirrel');assert.ok(state.get().rounds.squirrel.tasks.every(t=>!previous.includes(t.id)));
});
test('shop and paid treats are disabled while drawing unlocks are available freely',()=>{
  const {state}=fixture(),before=state.get();assert.equal(state.buy('apple'),false);assert.equal(state.buy('leaf'),false);assert.equal(state.use('apple','forest'),false);assert.deepEqual(state.get(),before);assert.deepEqual(state.get().unlocks,{leaf:true,pencils:true});assert.ok(state.selectPage('leaf'));
});
test('storage failure rolls back letter opening, then retry works',()=>{
  const {state,storage:s}=fixture();const before=state.get(),original=s.setItem;s.setItem=(k,v)=>{if(k===state.key)throw Error('quota');original(k,v);};assert.equal(state.openLetter(),false);assert.deepEqual(state.get(),before);assert.match(state.error,/nicht gespeichert/);assert.deepEqual(create({storage:s,content}).get().mail,before.mail);s.setItem=original;assert.ok(state.openLetter());assert.equal(state.get().mail.phase,'to-friend');
});
test('refresh at final-answer failure retains the task without currency rewards',()=>{
  const {state,storage:s}=fixture();state.start('squirrel');for(let i=0;i<4;i++){state.answer('squirrel',state.get().rounds.squirrel.tasks[i].answer);state.advance('squirrel');}const original=s.setItem;s.setItem=(k,v)=>{if(k===state.key)throw Error();original(k,v);};assert.equal(state.answer('squirrel',state.get().rounds.squirrel.tasks[4].answer),false);assert.equal(state.get().wallet.nuts,0);s.setItem=original;const restored=create({storage:s,content});assert.equal(restored.get().rounds.squirrel.index,4);restored.answer('squirrel',restored.get().rounds.squirrel.tasks[4].answer);assert.equal(restored.get().wallet.nuts,0);
});
test('saved legacy inventory and interrupted animation survive without another consumption',()=>{
  const {state,storage:s}=fixture();const prior=state.get();prior.wallet.nuts=13;prior.inventory.apple=2;prior.animation={item:'apple',transactionId:'old-use',returnTo:'forest',world:{x:-5,z:9}};s.setItem(state.key,JSON.stringify(prior));const restored=create({storage:s,content});assert.equal(restored.use('apple','forest'),false);assert.ok(restored.finishAnimation(true));assert.equal(restored.get().inventory.apple,2);assert.equal(restored.get().wallet.nuts,13);assert.equal(restored.finishAnimation(),false);
});
test('drawing pages, palette, audio settings, unknown legacy fields and old stores survive',()=>{
  const s=storage();s.setItem('farbklecks.progress.v1','{"stars":47}');s.setItem('farbtupf.forest.v1','{"version":1,"furniture":{"chair":true}}');const {state}=fixture({storage:s});round(state,'bird');const strokes=[{colour:'#abc',points:[[0,0],[1,1]]}];state.draw('free',strokes);state.selectPage('leaf');state.draw('leaf',[{colour:'#def',points:[[.5,.5]]}]);state.setting('speech',false);const restored=create({storage:s,content});assert.deepEqual(restored.get().drawings.free,strokes);assert.equal(restored.get().drawings.leaf.length,1);assert.equal(restored.get().selectedPage,'leaf');assert.equal(restored.get().settings.speech,false);assert.equal(s.getItem('farbklecks.progress.v1'),'{"stars":47}');assert.match(s.getItem('farbtupf.forest.v1'),/furniture/);
});
test('invalid current save recovers validated backup; unreadable records are never overwritten',()=>{
  const {state,storage:s}=fixture();state.position(2,3);s.setItem(state.key,'{broken');const recovered=create({storage:s,content});assert.match(recovered.error,/sichere/);assert.ok(recovered.retrySave());assert.equal(JSON.parse(s.getItem(state.key)).schema,1);
  s.setItem(state.key,'{broken');s.setItem(state.key+'.backup','bad too');const blocked=create({storage:s,content});assert.equal(blocked.blocked,true);assert.equal(blocked.buy('apple'),false);assert.equal(s.getItem(state.key),'{broken');
});
test('concurrent tab cannot overwrite newer progress',()=>{
  const {state,storage:s}=fixture();const other=create({storage:s,content});state.position(2,3);assert.equal(other.position(7,8),false);assert.match(other.error,/anderen Fenster/);assert.deepEqual(create({storage:s,content}).get().world,{x:2,z:3});
});
test('developer skips and economy are isolated from the child save',()=>{
  const {state,storage:s}=fixture();const dev=create({storage:s,content,development:true});dev.start('squirrel');for(let i=0;i<5;i++){const r=dev.get().rounds.squirrel;dev.answer('squirrel',r.tasks[r.index].answer,0,true);if(i<4)dev.advance('squirrel');}assert.equal(dev.get().wallet.nuts,0);assert.equal(state.get().completed.squirrel,undefined);assert.notEqual(dev.key,state.key);assert.ok(dev.exportLog().events.some(e=>e.event==='development_skip'&&e.development));assert.equal(state.answer('squirrel','1',0,true),false);
});
test('logs stay bounded, filter expired events and clear independently of progress',()=>{
  let time=100;const {state}=fixture({now:()=>time});state.record('old');time+=8*86400000;state.record('new');assert.ok(state.exportLog().events.every(e=>e.timestamp===time));assert.equal(state.exportLog().retention.truncated,true);for(let i=0;i<10001;i++)state.record('sample',{i});assert.ok(state.exportLog().events.length>0&&state.exportLog().events.length<=10000);state.clearLog();assert.equal(state.exportLog().events.length,0);assert.equal(state.get().schema,1);
});
test('newer schemas and malformed drawing records cannot be overwritten',()=>{
 const {state,storage:s}=fixture();state.position(1,2);const future={...state.get(),schema:99};s.setItem(state.key,JSON.stringify(future));const blocked=create({storage:s,content});assert.equal(blocked.blocked,true);assert.equal(blocked.retrySave(),false);assert.equal(JSON.parse(s.getItem(state.key)).schema,99);
 s.removeItem(state.key+'.backup');const broken={...future,schema:1,drawings:{free:[{colour:'#abc',points:[[NaN,0]]}],leaf:[]}};s.setItem(state.key,JSON.stringify(broken));assert.equal(create({storage:s,content}).blocked,true);
});
test('temporarily inaccessible storage can recover without overwriting an existing save',()=>{
 const {state,storage:s}=fixture();state.position(4,6);const original=s.getItem;s.getItem=()=>{throw Error('blocked');};const locked=create({storage:s,content});assert.equal(locked.blocked,true);assert.equal(locked.retrySave(),false);s.getItem=original;assert.ok(locked.retrySave());assert.deepEqual(locked.get().world,{x:4,z:6});
});
test('malformed local logs do not block valid player state',()=>{
 const s=storage();s.setItem('farbtupf.friends.v1.log',JSON.stringify({events:[null,{}, {event:'valid',timestamp:Date.now()}]}));const {state}=fixture({storage:s});assert.equal(state.blocked,false);assert.ok(state.start('mouse'));assert.ok(state.exportLog().events.every(e=>typeof e.event==='string'));
});
test('the ?world=10x test world keeps its own save; the home save format is unchanged',()=>{
  const s=storage(),home=create({storage:s,content}),tenfold=create({storage:s,content,namespace:'world10x'});
  assert.equal(tenfold.key,'farbtupf.friends.world10x.v1');assert.notEqual(tenfold.key,home.key);
  assert.ok(home.position(1.5,-2));assert.ok(tenfold.position(112,-51,'r3'));
  assert.deepEqual(create({storage:s,content}).get().world,{x:1.5,z:-2});
  assert.deepEqual(create({storage:s,content,namespace:'world10x'}).get().world,{region:'r3',x:112,z:-51});
  assert.ok(home.position(3,4,'home'));assert.deepEqual(create({storage:s,content}).get().world,{x:3,z:4});
});
