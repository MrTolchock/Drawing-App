const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const content=require('../js/friends/content.js'),{create}=require('../js/friends/state.js');
function fixture(saved){const map=new Map(saved||[]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};return{map,storage,state:create({storage,content})};}
test('each parent-chosen limit counts whole puzzles and ends with home, sleep and a durable game over',()=>{
 for(const limit of [1,2,3,11,50]){
  const {state:s,storage}=fixture();assert.ok(s.startLetterSession(limit));assert.equal(s.mail().phase,'den-letter');assert.equal(s.mail().session.completed,0);
  for(let n=0;n<limit;n++){
   assert.ok(s.openLetter());const host=s.mail().host;assert.ok(s.canPuzzle(host));assert.equal(s.canPuzzle(host==='bird'?'mouse':'bird'),false);
   assert.equal(s.completeMail('mailman'),false);assert.ok(s.completeMail(host));assert.equal(s.completeMail(host),false);assert.equal(s.mail().session.completed,n+1);
   assert.equal(s.mail().phase,n+1===limit?'return-home':'to-mailman');assert.deepEqual(create({storage,content}).mail(),s.mail());
  }
  assert.equal(s.openLetter(),false);assert.equal(s.canPuzzle(s.mail().host),false);assert.equal(s.finishLetterSession(),false);assert.ok(s.beginSleep());assert.equal(s.beginSleep(),false);assert.ok(s.finishLetterSession());assert.equal(s.finishLetterSession(),false);
  const restored=create({storage,content});assert.equal(restored.mail().phase,'finished');assert.equal(restored.openLetter(),false);assert.equal(restored.canPuzzle(restored.mail().host),false);
  const host=restored.mail().host;assert.ok(restored.startLetterSession(2));assert.equal(restored.mail().phase,'den-letter');assert.notEqual(restored.mail().host,host);assert.equal(restored.mail().session.completed,0);
 }
});
test('limit changes apply before the first letter or to the next journey, without resetting an active allowance',()=>{
 const {state:s,storage}=fixture();assert.ok(s.setLetterLimit(5));assert.equal(s.mail().session.limit,5);s.openLetter();s.completeMail('squirrel');assert.ok(s.setLetterLimit(1));assert.equal(s.get().settings.letterLimit,1);assert.equal(s.mail().session.limit,5);assert.equal(s.mail().session.completed,1);
 for(const n of [0,-1,1.5,51,'3',NaN])assert.equal(s.setLetterLimit(n),false);
 const r=create({storage,content});assert.equal(r.mail().session.completed,1);assert.equal(r.mail().session.limit,5);assert.ok(r.startLetterSession());assert.equal(r.mail().session.limit,1);assert.equal(r.mail().phase,'den-letter');
});
test('failed completion does not spend a letter; failed sleep and restart preserve their durable phases',()=>{
 const {state:s,storage}=fixture();s.startLetterSession(1);s.openLetter();const set=storage.setItem;storage.setItem=(key,v)=>{if(key===s.key)throw Error('quota');set(key,v);};assert.equal(s.completeMail('squirrel'),false);assert.equal(s.mail().session.completed,0);assert.equal(s.mail().phase,'to-friend');
 storage.setItem=set;assert.ok(s.completeMail('squirrel'));storage.setItem=(key,v)=>{if(key===s.key)throw Error('quota');set(key,v);};assert.equal(s.beginSleep(),false);assert.equal(s.mail().phase,'return-home');assert.equal(s.startLetterSession(3),false);assert.equal(s.mail().session.limit,1);
});
test('old mail and dormant timer preferences survive without granting an unlimited session',()=>{
 const {state:s,storage,map}=fixture(),old=s.get();delete old.mail.session;delete old.settings.letterLimit;old.mail.phase='to-mailman';old.mail.completed=17;old.legacyField={keep:true};storage.setItem(s.key,JSON.stringify(old));storage.setItem('farbtupf.timer.v1','{"version":1,"mode":"countdown","running":true}');
 const r=create({storage,content});assert.equal(r.blocked,false);assert.equal(r.mail().session.limit,3);assert.equal(r.mail().session.completed,1);assert.equal(r.get().mail.completed,17);assert.deepEqual(r.get().legacyField,{keep:true});assert.equal(map.get('farbtupf.timer.v1'),'{"version":1,"mode":"countdown","running":true}');assert.ok(r.openLetter());
});
test('inconsistent session budgets are rejected instead of silently removing the limit',()=>{
 for(const change of [s=>s.mail.session.limit=0,s=>s.mail.session.completed=4,s=>s.mail.phase='finished',s=>delete s.mail.session&& (s.mail.phase='return-home')]){
  const {state:s,storage}=fixture(),bad=s.get();change(bad);storage.setItem(s.key,JSON.stringify(bad));storage.removeItem(s.key+'.backup');const r=create({storage,content});assert.equal(r.blocked,true);assert.equal(r.openLetter(),false);
 }
});
test('no timer runtime, stylesheet or initialization remains in the active app',()=>{
 for(const p of ['index.html','sw.js','js/app.js','js/friends/settings.js','js/screens/album.js'])assert.doesNotMatch(fs.readFileSync(p,'utf8'),/timerUI|playTimer|css\/timer|js\/(core|ui)\/timer/);
});
