const {test}=require('node:test');
const assert=require('node:assert/strict');
const content=require('../js/friends/content.js');
const {create}=require('../js/friends/state.js');
function fixture(){const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};return {storage,state:create({storage,content})};}
function finishRound(state,host){assert.ok(state.start(host));for(let i=0;i<5;i++){const r=state.round(host);assert.ok(state.answer(host,r.tasks[r.index].answer));if(i<4)assert.ok(state.advance(host));}}

test('mail begins in the den, survives refresh and cycles through all friends without repeats',()=>{
 const {state,storage}=fixture();assert.deepEqual(state.mail(),{phase:'den-letter',host:'squirrel',index:0,completed:0});
 assert.equal(state.completeMail('squirrel'),false);assert.ok(state.openLetter());assert.equal(state.openLetter(),false);
 for(const [index,host]of ['squirrel','bird','owl','beaver','mouse','squirrel'].entries()){
  assert.equal(state.mail().host,host);assert.equal(state.mail().index,index);assert.equal(state.mail().phase,'to-friend');
  assert.deepEqual(create({storage,content}).mail(),state.mail());
  assert.equal(state.completeMail(host==='mouse'?'owl':'mouse'),false);assert.ok(state.completeMail(host));assert.equal(state.completeMail(host),false);assert.equal(state.mail().completed,index+1);assert.equal(state.mail().phase,'to-mailman');
  assert.deepEqual(create({storage,content}).mail(),state.mail());assert.ok(state.openLetter());
 }
});

test('a matching new round commits completion and the mailman phase together without currency',()=>{
 const {state,storage}=fixture();state.openLetter();finishRound(state,'owl');assert.equal(state.mail().phase,'to-friend');
 finishRound(state,'squirrel');assert.equal(state.mail().phase,'to-mailman');assert.equal(state.mail().completed,1);assert.deepEqual(state.get().wallet,{nuts:0,seeds:0,feathers:0,logs:0,berries:0});
 const restored=create({storage,content});assert.equal(restored.mail().phase,'to-mailman');assert.equal(restored.completeMail('squirrel'),false);assert.equal(restored.answer('squirrel','1'),false);assert.ok(restored.acknowledge('squirrel'));assert.ok(restored.openLetter());assert.equal(restored.mail().host,'bird');
 assert.ok(!restored.exportLog().events.some(e=>e.event==='resource_grant'));
});

test('an old supported save gains mail and free art tools while retaining data and backups',()=>{
 const {state,storage}=fixture(),old=state.get();delete old.mail;old.wallet.nuts=12;old.inventory.apple=3;old.unlocks={leaf:false,pencils:false};old.unknownLegacy={keep:true};old.drawings.free=[{colour:'#abc',points:[[.2,.3]]}];storage.setItem(state.key,JSON.stringify(old));
 const restored=create({storage,content});assert.equal(restored.blocked,false);assert.equal(restored.mail().phase,'den-letter');assert.equal(restored.get().wallet.nuts,12);assert.equal(restored.get().inventory.apple,3);assert.deepEqual(restored.get().unknownLegacy,{keep:true});assert.deepEqual(restored.get().drawings,old.drawings);assert.deepEqual(restored.get().unlocks,{leaf:true,pencils:true});assert.ok(restored.openLetter());assert.equal(storage.getItem(state.key+'.backup'),JSON.stringify(old));
});

test('failed final answer keeps both the unfinished task and outgoing mail intact',()=>{
 const {state,storage}=fixture();state.openLetter();state.start('squirrel');for(let i=0;i<4;i++){state.answer('squirrel',state.round('squirrel').tasks[i].answer);state.advance('squirrel');}
 const original=storage.setItem;storage.setItem=(key,value)=>{if(key===state.key)throw Error('quota');original(key,value);};const answer=state.round('squirrel').tasks[4].answer;assert.equal(state.answer('squirrel',answer),false);assert.equal(state.mail().phase,'to-friend');assert.equal(state.round('squirrel').index,4);
 storage.setItem=original;const restored=create({storage,content});assert.equal(restored.mail().phase,'to-friend');assert.ok(restored.answer('squirrel',answer));assert.equal(restored.mail().phase,'to-mailman');assert.equal(restored.mail().completed,1);
});

test('malformed saved mail is rejected, preserving raw data if no safe backup exists',()=>{
 const {state,storage}=fixture(),invalid=state.get();invalid.mail.phase='unknown';storage.setItem(state.key,JSON.stringify(invalid));storage.removeItem(state.key+'.backup');const restored=create({storage,content});assert.equal(restored.blocked,true);assert.equal(restored.openLetter(),false);assert.equal(storage.getItem(state.key),JSON.stringify(invalid));
});
