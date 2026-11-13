const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(saved){
 const memory=new Map(saved||[]),settings=new Map(),FK={shuffle:xs=>xs.slice().reverse(),settings:{get:k=>settings.get(k),set:(k,v)=>settings.set(k,v)}};
 const ctx=vm.createContext({window:{FK,FriendsContent:require('../js/friends/content.js')},URLSearchParams,location:{search:''},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)}});
 for(const path of ['js/learn/glyphs.js','js/learn/routes.js','js/friends/puzzles.js','js/friends/library.js','js/friends/puzzle-rounds.js','js/friends/puzzle-catalogue.js'])vm.runInContext(fs.readFileSync(path,'utf8'),ctx);
 return {FK,memory};
}
test('all 34 active puzzles have one route, one instruction and five tasks; retired games are absent',()=>{
 const {FK}=setup(),entries=FK.friendsLibrary.catalogue();assert.equal(entries.length,34);assert.equal(new Set(entries.map(g=>g.id)).size,34);
 for(const g of entries){assert.ok(FK.puzzleRounds.instructions[g.id],g.id);assert.ok(g.host);assert.ok(['puzzle','trace'].includes(g.screen));}
 assert.ok(!entries.some(g=>['rhyme','dots'].includes(g.id)));assert.ok(entries.some(g=>g.id==='trace-numbers'));
});
test('generated questions stay deterministic, solvable and distinct in a five-task session',()=>{
 const {FK}=setup(),R=FK.puzzleRounds;
 for(let seed=0;seed<80;seed++)for(const {id}of FK.friendsLibrary.catalogue().filter(g=>!g.id.startsWith('friends-'))){
  const questions=Array.from({length:5},(_,i)=>R.question(id,i,seed));
  for(const [i,q]of questions.entries()){
   assert.equal(JSON.stringify(q),JSON.stringify(R.question(id,i,seed)),id);
   if(q.choices){assert.equal(new Set(q.choices.map(v=>Array.isArray(v)?v[0]:v)).size,q.choices.length,id);if(q.answer!==undefined&&!Array.isArray(q.answer))assert.ok(q.choices.some(v=>Array.isArray(v)?v[0]===q.answer:v===q.answer),id);}
   if(id==='count'){assert.equal(q.bugs.filter(v=>v==='ladybird').length,q.answer);assert.ok(q.answer>5&&q.bugs.length>q.answer);}
   if(id==='add')assert.equal(q.a+q.b,q.answer);
   if(id==='robot')assert.ok(FK.routes.validQuestion(q));
   if(id==='mirror')assert.deepEqual(Array.from(q.answer),Array.from(q.left,i=>Math.floor(i/3)*3+2-i%3).sort((a,b)=>a-b));
   if(id==='picnic')assert.equal(q.each*q.friends,q.total);
   if(id==='shapes'){assert.equal(q.holes.length,2);assert.equal(new Set(q.holes).size,2);assert.ok(q.holes.every(i=>q.choices.includes(q.parts[i][0])));}
   if(id==='rocket')assert.equal(q.filled+q.answer,q.total);
   if(id==='vowels'){assert.equal(q.word[q.index],q.answer);assert.ok(!/(au|ei|ie|eu|äu)/i.test(q.word));}
  }
  const property=['trace','trace-numbers'].includes(id)?'glyph':id==='read-word'?'text':['syllable','vowels','read-puzzle'].includes(id)?'word':null;
  if(property)assert.equal(new Set(questions.map(q=>q[property])).size,5,id);
  if(['trace','trace-numbers'].includes(id))assert.ok(questions.every(q=>FK.glyphs.data[q.glyph]),id+' has a real stroke model');
 }
});
test('partial work and the correct-answer transition survive a fresh runtime',()=>{
 const {FK,memory}=setup(),R=FK.puzzleRounds,s=R.start('mirror');s.round=2;s.work={mirror:[1,3]};s.solved=true;R.save(s);
 const restored=setup(memory).FK.puzzleRounds.start('mirror');assert.equal(JSON.stringify(s),JSON.stringify(restored));
 assert.ok(R.pending('mirror'));R.clear('mirror');assert.equal(R.pending('mirror'),false);
});
test('friends use saved shuffled game bags, avoid repeated kinds and resume unfinished work',()=>{
 const {FK}=setup(),R=FK.puzzleRounds,L=FK.friendsLibrary;
 FK.go=()=>{};FK.friends={canPuzzle:()=>true,mail:()=>({session:{id:'test'},index:0})};
 for(const host of ['squirrel','bird','owl','beaver','mouse']){
  const pool=L.catalogue().filter(g=>g.host===host),seen=[];
  for(let i=0;i<pool.length;i++){const g=L.pick(host);assert.equal(L.pick(host).id,g.id,'selection stays stable until launched');seen.push(g.id);assert.ok(L.visit(g));L.complete(host,g.id);}
  assert.equal(new Set(seen).size,pool.length);assert.notEqual(L.pick(host).id,seen.at(-1));
 }
 const session=R.start('robot');session.round=2;R.save(session);FK.settings.set('friends.active.beaver','robot');assert.equal(L.pick('beaver').id,'robot');
 FK.settings.set('friends.active.beaver',null);FK.settings.set('friends.lastPuzzle','friends-beaver');FK.settings.set('friends.queue.beaver',['friends-beaver','robot']);assert.equal(L.pick('beaver').id,'robot','prefer a different interaction kind');
 const other=setup().FK;other.settings=FK.settings;assert.equal(other.friendsLibrary.pick('beaver').id,'robot','bag survives a new runtime');
});
test('corrupt sessions are ignored without clearing historical saves',()=>{
 const key='farbtupf.puzzles.v1',old='{"doNotTouch":true}';
 const {FK,memory}=setup([[key,JSON.stringify({version:1,sessions:{count:{id:'count',seed:-1,round:999,solved:false,work:{}}}})],['farbtupf.friends.v1',old]]);
 assert.equal(FK.puzzleRounds.start('count').round,0);assert.equal(memory.get('farbtupf.friends.v1'),old);
});
test('puzzle snapshot write failure is reported for diagnostics',()=>{
 const {FK,memory}=setup(),session=FK.puzzleRounds.start('add'),write=memory.set.bind(memory),issues=[];
 FK.friends={record:(event,data)=>issues.push({event,...data})};memory.set=(key,value)=>{if(key==='farbtupf.puzzles.v1')throw Error('quota');return write(key,value);};
 assert.equal(FK.puzzleRounds.save(session),false);assert.deepEqual(issues,[{event:'storage_error',scope:'puzzle_round',puzzleId:'add'}]);
});
