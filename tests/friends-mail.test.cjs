const {test}=require('node:test');
const assert=require('node:assert/strict');
const content=require('../js/friends/content.js');
const {create}=require('../js/friends/state.js');
function fixture(){const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};return {storage,state:create({storage,content})};}
function finishRound(state,host){assert.ok(state.start(host));for(let i=0;i<5;i++){const r=state.round(host);assert.ok(state.answer(host,r.tasks[r.index].answer));if(i<4)assert.ok(state.advance(host));}}

test('mail begins in the den and keeps a complete shuffled friend cycle across reloads',()=>{
 const {state,storage}=fixture();assert.equal(state.mail().phase,'den-letter');assert.ok(state.startLetterSession(50));assert.ok(state.openLetter());assert.equal(state.openLetter(),false);
 const seen=[];for(let n=0;n<22;n++){
  const host=state.mail().host;seen.push(host);assert.deepEqual(create({storage,content}).mail(),state.mail());
  assert.equal(state.completeMail(host==='mouse'?'owl':'mouse'),false);assert.ok(state.completeMail(host));assert.equal(state.completeMail(host),false);assert.equal(state.mail().completed,n+1);
  assert.deepEqual(create({storage,content}).mail(),state.mail());assert.ok(state.openLetter());
 }
 assert.equal(new Set(seen.slice(0,11)).size,11);assert.equal(new Set(seen.slice(11)).size,11);assert.ok(seen.every((host,i)=>!i||host!==seen[i-1]));
});
test('older invitations retain their recipient and gain a durable mixed order for future letters',()=>{
 const {state,storage}=fixture(),old=state.get();old.mail={phase:'to-mailman',host:'owl',index:7,completed:7};storage.setItem(state.key,JSON.stringify(old));
 const restored=create({storage,content});assert.equal(restored.mail().host,'owl');assert.equal(restored.mail().phase,'to-mailman');assert.equal(restored.mail().index,7);
 assert.ok(restored.openLetter());assert.notEqual(restored.mail().host,'owl');assert.equal(restored.mail().index,8);assert.deepEqual(create({storage,content}).mail(),restored.mail());
});
test('a matching round commits completion and mail together without currency',()=>{
 const {state,storage}=fixture();state.openLetter();const host=state.mail().host;finishRound(state,host==='owl'?'squirrel':'owl');assert.equal(state.mail().phase,'to-friend');
 finishRound(state,host);assert.equal(state.mail().phase,'to-mailman');assert.equal(state.mail().completed,1);assert.deepEqual(state.get().wallet,{nuts:0,seeds:0,feathers:0,logs:0,berries:0});
 const restored=create({storage,content});assert.equal(restored.completeMail(host),false);assert.equal(restored.answer(host,'1'),false);assert.ok(restored.acknowledge(host));assert.ok(restored.openLetter());assert.notEqual(restored.mail().host,host);
 assert.ok(!restored.exportLog().events.some(e=>e.event==='resource_grant'));
});

test('an old supported save gains mail and free art tools while retaining data and backups',()=>{
 const {state,storage}=fixture(),old=state.get();delete old.mail;old.wallet.nuts=12;old.inventory.apple=3;old.unlocks={leaf:false,pencils:false};old.unknownLegacy={keep:true};old.drawings.free=[{colour:'#abc',points:[[.2,.3]]}];storage.setItem(state.key,JSON.stringify(old));
 const restored=create({storage,content});assert.equal(restored.blocked,false);assert.equal(restored.mail().phase,'den-letter');assert.equal(restored.get().wallet.nuts,12);assert.equal(restored.get().inventory.apple,3);assert.deepEqual(restored.get().unknownLegacy,{keep:true});assert.deepEqual(restored.get().drawings,old.drawings);assert.deepEqual(restored.get().unlocks,{leaf:true,pencils:true});assert.ok(restored.openLetter());assert.equal(storage.getItem(state.key+'.backup'),JSON.stringify(old));
});

test('failed final answer keeps both unfinished task and outgoing mail intact',()=>{
 const {state,storage}=fixture();state.openLetter();const host=state.mail().host;state.start(host);for(let i=0;i<4;i++){state.answer(host,state.round(host).tasks[i].answer);state.advance(host);}
 const original=storage.setItem;storage.setItem=(key,value)=>{if(key===state.key)throw Error('quota');original(key,value);};const answer=state.round(host).tasks[4].answer;assert.equal(state.answer(host,answer),false);assert.equal(state.mail().phase,'to-friend');assert.equal(state.round(host).index,4);
 storage.setItem=original;const restored=create({storage,content});assert.ok(restored.answer(host,answer));assert.equal(restored.mail().phase,'to-mailman');assert.equal(restored.mail().completed,1);
});

test('malformed saved mail is rejected, preserving raw data if no safe backup exists',()=>{
 const {state,storage}=fixture(),invalid=state.get();invalid.mail.phase='unknown';storage.setItem(state.key,JSON.stringify(invalid));storage.removeItem(state.key+'.backup');const restored=create({storage,content});assert.equal(restored.blocked,true);assert.equal(restored.openLetter(),false);assert.equal(storage.getItem(state.key),JSON.stringify(invalid));
});

test('new sessions vary their first friend and never restart with the current recipient',()=>{
 const starts=new Set();for(let seed=1;seed<=40;seed++){
  let n=seed;const random=()=>((n=Math.imul(1664525,n)+1013904223>>>0)/4294967296),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
  const s=create({storage,content,random});for(let j=0;j<5;j++){const before=s.mail().host;assert.ok(s.startLetterSession(3));assert.notEqual(s.mail().host,before);starts.add(s.mail().host);s.openLetter();const invitation=s.mail();assert.deepEqual(create({storage,content}).mail(),invitation);}
 }assert.equal(starts.size,11);
});
