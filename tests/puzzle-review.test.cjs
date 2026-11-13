const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {setup,check}=require('../tools/puzzle-catalogue.cjs');
const plain=v=>JSON.parse(JSON.stringify(v));
function approve(FK,id){const V=FK.puzzleReview,C=FK.puzzleCatalogue;for(const it of C.iterations(id)){assert.ok(V.seen(id,it.id));assert.ok(V.decide(id,it.id,'approved'));}assert.ok(V.decide(id,null,'approved'));}
test('every active puzzle has at least 25 unique finite definitions, competence and real artwork',()=>{
 const {FK,ctx}=setup();FK.STICKERS=[];ctx.MutationObserver=class{observe(){}};ctx.document={body:{}};vm.runInContext(fs.readFileSync('js/ui/waldatelier.js','utf8'),ctx);
 const C=FK.puzzleCatalogue,seen=new Set();let total=0;
 const art=id=>{if(id.startsWith('scene:'))return id.slice(6).split('+').forEach(art);const aliases={house:'vocab-house',table:'vocab-table',shoe:'vocab-shoe',leg:'vocab-leg',stone:'vocab-stone',cloth:'vocab-cloth',tower:'vocab-tower',worm:'vocab-worm',pot:'vocab-pot',head:'vocab-head',hand:'vocab-hand',sand:'vocab-sand',scarf:'vocab-scarf',rope:'vocab-rope',arrow:'vocab-arrow',cup:'vocab-cup',till:'vocab-till',bench:'vocab-bench',wardrobe:'vocab-wardrobe',seeds:'vocab-seed',hare:'hare-sit',nut:'forest-nut'};assert.ok(FK.visual.supports(aliases[id]||id),'missing art: '+id);};
 for(const g of FK.friendsLibrary.catalogue()){
  const p=C.puzzle(g.id),pool=C.iterations(g.id);assert.ok(p.reference&&p.competence&&p.difficulty&&p.instruction,g.id);assert.ok(pool.length>=25,g.id);total+=pool.length;
  assert.equal(new Set(pool.map(it=>C.canonical(it.question))).size,pool.length,g.id+' duplicate content');
  for(const it of pool){assert.ok(!seen.has(it.id));seen.add(it.id);const q=it.question;
   if(q.choices){assert.equal(new Set(q.choices.map(v=>JSON.stringify(v))).size,q.choices.length,it.id);if(q.answer!==undefined&&!Array.isArray(q.answer))assert.ok(q.choices.some(v=>Array.isArray(v)?v[0]===q.answer:v===q.answer),it.id);}
   if(q.kind==='reading')q.choices.forEach(art);if(q.kind==='rhyme'){art(q.picture);q.choices.forEach(w=>art(FK.puzzleRounds.wordArt[w]));}
   if(q.picture)art(q.picture);if(q.item)art(q.item);if(q.quantity)art(q.quantity.item);if(q.bugs)q.bugs.forEach(art);if(q.sequence)q.sequence.forEach(art);if(q.objects)q.objects.forEach(art);if(q.fruit)q.fruit.forEach(art);if(q.items)q.items.forEach(([id])=>art(id));
   if(q.kind==='trace')assert.ok(FK.glyphs.data[q.glyph]);
   if(q.kind==='count')assert.equal(q.bugs.filter(v=>v==='ladybird').length,q.answer);
   if(q.kind==='add')assert.ok(q.a+q.b===q.answer&&q.answer<=10);
   if(q.kind==='fireflies')assert.equal(q.filled+q.answer,q.total);
   if(q.kind==='picnic')assert.ok(q.each*q.friends===q.total&&q.total<=20);
   if(q.kind==='double')assert.equal(q.n*2,q.answer);
   if(q.kind==='vowels'){assert.equal(q.word[q.index],q.answer);assert.ok(!/(au|ei|ie|eu|äu)/i.test(q.word.slice(Math.max(0,q.index-1),q.index+2)),it.id);}
   if(q.kind==='matrix')assert.equal(q.matrix[q.gap],q.answer);
   if(q.kind==='robot')assert.ok(FK.routes.validQuestion(q),it.id);
   if(q.kind==='mirror')assert.deepEqual(plain(q.answer),Array.from(q.left,i=>Math.floor(i/3)*3+2-i%3).sort((a,b)=>a-b));
   if(q.kind==='survey'&&q.task==='most'){const max=Math.max(...q.counts);assert.equal(q.counts.filter(n=>n===max).length,1);assert.equal(q.answer,q.fruit[q.counts.indexOf(max)]);}
  }
 }
 assert.equal(total,1048);
});
test('five distinct questions are deterministic, restored verbatim and avoid the previous round',()=>{
 const {FK,memory}=setup(),C=FK.puzzleCatalogue,R=FK.puzzleRounds;
 for(const g of FK.friendsLibrary.catalogue()){
  for(let seed=0;seed<50;seed++){
   const a=C.select(g.id,seed);assert.equal(new Set(a.map(it=>it.id)).size,5);assert.equal(JSON.stringify(a),JSON.stringify(C.select(g.id,seed)));
   const next=C.select(g.id,seed+1,a.map(i=>i.id));assert.ok(next.every(i=>!a.some(j=>j.id===i.id)),g.id);
   if(g.id==='trace'){assert.equal(new Set(a.map(i=>i.question.glyph)).size,5);assert.ok(a.every(i=>seed%2?i.question.glyph===i.question.glyph.toUpperCase():i.question.glyph===i.question.glyph.toLowerCase()));}
  }
  const s=R.start(g.id);s.work={example:[1,2]};s.round=2;s.solved=true;assert.ok(R.save(s));assert.equal(JSON.stringify(setup(memory).FK.puzzleRounds.start(g.id)),JSON.stringify(s));assert.ok(C.matchesSession(s));
  R.complete(g.id);const n=R.start(g.id);assert.ok(n.iterationIds.every(id=>!s.iterationIds.includes(id)),g.id);
 }
});
test('approval requires inspecting every iteration, without names, notes or checklists',()=>{
 const {FK}=setup(),V=FK.puzzleReview,C=FK.puzzleCatalogue,id='add',it=C.iterations(id)[0];assert.equal(V.ready(id),false);
 assert.equal(V.decide(id,it.id,'approved'),false);assert.ok(V.seen(id,it.id));assert.ok(V.decide(id,it.id,'approved'));
 assert.equal(V.decide(id,null,'approved'),false);approve(FK,id);assert.ok(V.ready(id));
 assert.ok(V.decide(id,it.id,'improve'));assert.equal(V.status(id,it.id).decision.note,'');assert.equal(V.ready(id),false);
 assert.ok(V.decide(id,it.id,'approved'));assert.ok(V.decide(id,null,'improve'));assert.equal(V.ready(id),false);
 assert.ok(V.decide(id,null,'approved'));assert.ok(V.ready(id));assert.ok(V.exportData().history.length>0);
 const decision=V.status(id,it.id).decision;assert.equal('reviewer' in decision,false);assert.equal('checks' in decision,false);
});
test('Settings opens the gallery directly; outside Settings the existing adult gate still applies',()=>{
 const {FK}=setup(),V=FK.puzzleReview;let current='friends',gates=0,pending;
 FK.current=()=>current;FK.go=screen=>{current=screen;};FK.ui={parentGate:fn=>{gates++;pending=fn;}};
 V.open();assert.equal(gates,1);assert.equal(V.authorized,false);assert.equal(V.preview('add','add/1-1'),false);
 pending();assert.equal(V.authorized,true);assert.equal(current,'puzzle-review');
 const {FK:next}=setup();next.current=()=> 'settings';next.ui={parentGate:()=>{throw Error('Second calculation');}};next.go=screen=>{current=screen;};next.puzzleReview.open();assert.equal(next.puzzleReview.authorized,true);assert.equal(current,'puzzle-review');
});
test('export/import restores review decisions; malformed or incomplete files never erase stored work',()=>{
 const {FK,memory}=setup();approve(FK,'add');const file=FK.puzzleReview.exportData(),other=setup().FK.puzzleReview;
 assert.ok(other.importData(file));assert.ok(other.ready('add'));assert.ok(setup(memory).FK.puzzleReview.ready('add'));
 const before=JSON.stringify(other.exportData().decisions);assert.equal(other.importData('{broken'),false);assert.equal(other.importData({version:1}),false);assert.equal(JSON.stringify(other.exportData().decisions),before);
 const invalid=plain(file),k=Object.keys(invalid.decisions)[0];delete invalid.seen[k];assert.equal(other.importData(invalid),false);assert.equal(JSON.stringify(other.exportData().decisions),before);
});
test('previous backup metadata remains readable; new backups need no reviewer or checklist',()=>{
 const {FK}=setup();approve(FK,'add');const current=FK.puzzleReview.exportData();
 for(const d of Object.values(current.decisions)){assert.equal(d.reviewer,undefined);assert.equal(d.checks,undefined);}
 const legacy=plain(current);for(const d of Object.values(legacy.decisions)){d.reviewer='Earlier owner';d.checks=['sound','flow'];}
 const restored=setup().FK.puzzleReview;assert.ok(restored.importData(legacy));assert.ok(restored.ready('add'));
 assert.equal(restored.status('add','add/1-1').decision.reviewer,'Earlier owner');
});
test('changed content, difficulty, implementation or new iterations cannot inherit earlier sign-offs',()=>{
 const {FK}=setup(),C=FK.puzzleCatalogue,V=FK.puzzleReview;approve(FK,'add');const file=V.exportData();
 FK.puzzleImplementation='changed-renderer';assert.equal(V.ready('add'),false);assert.ok(V.status('add').stale);assert.ok(V.status('add',C.iterations('add')[0].id).stale);
 const fresh=setup().FK;fresh.puzzleCatalogue.meta.add[2]='Different difficulty';assert.ok(fresh.puzzleReview.importData(file));assert.equal(fresh.puzzleReview.ready('add'),false);assert.equal(fresh.puzzleReview.progress('add').approved,0);
 const {FK:again,ctx}=setup();approve(again,'add');const oldRevision=again.puzzleCatalogue.puzzleRevision('add');const source=fs.readFileSync('js/friends/puzzle-catalogue.js','utf8').replace('b<=9-a','b<=10-a');vm.runInContext(source,ctx);assert.notEqual(again.puzzleCatalogue.puzzleRevision('add'),oldRevision);vm.runInContext(fs.readFileSync('js/friends/puzzle-review.js','utf8'),ctx);assert.equal(again.puzzleReview.ready('add'),false);assert.equal(again.puzzleReview.status('add','add/1-1').status,'approved');assert.equal(again.puzzleReview.status('add','add/1-9').status,'pending');
});
test('legacy and corrupt round snapshots are retained separately, never substituted into the reviewed pool',()=>{
 const old={id:'count',seed:12,round:3,solved:false,work:{marks:[0,1]}};const {FK,memory}=setup([['farbtupf.puzzles.v1',JSON.stringify({version:1,sessions:{count:old}})]]);
 const s=FK.puzzleRounds.start('count');assert.equal(s.round,0);assert.ok(s.questions);assert.deepEqual(JSON.parse(memory.get('farbtupf.puzzles.v1')).legacy.count,old);
 s.questions[0].answer='corrupt';assert.ok(FK.puzzleRounds.save(s));const next=FK.puzzleRounds.start('count');assert.ok(FK.puzzleCatalogue.matchesSession(next));
 assert.equal(FK.puzzleRounds.save({...next,review:true}),false);
});
test('storage failure never reports an approval as saved',()=>{
 const {FK,ctx}=setup(),V=FK.puzzleReview,it=FK.puzzleCatalogue.iterations('add')[0];ctx.localStorage.setItem=()=>{throw Error('quota');};assert.equal(V.seen('add',it.id),false);assert.equal(V.status('add',it.id).seen,false);assert.match(V.error,/gespeichert/);
});
function owner(FK){FK.current=()=> 'settings';FK.go=()=>{};FK.puzzleReview.open();return FK.puzzleReview;}
test('review snapshots every unconfirmed item once, including rejected and stale items',()=>{
 const {FK}=setup(),V=owner(FK),pool=FK.puzzleCatalogue.iterations('add');
 assert.ok(V.seen('add',pool[0].id));assert.ok(V.decide('add',pool[0].id,'approved'));
 assert.ok(V.decide('add',pool[1].id,'improve','Check picture'));
 const s=V.previewSession('add');assert.equal(s.questions.length,pool.length-1);assert.ok(s.questions.length>5);assert.equal(s.iterationIds.includes(pool[0].id),false);assert.ok(s.iterationIds.includes(pool[1].id));
 assert.ok(V.visit(s));assert.ok(V.sessionDecision(s,'improve'));assert.equal(V.sessionDecision(s,'approved'),false);s.round++;
 assert.equal(s.questions.length,pool.length-1,'rejection is not re-added to the active run');
 const next=V.previewSession('add');assert.ok(next.iterationIds.includes(pool[1].id));
 FK.puzzleImplementation='new-interaction';assert.equal(V.previewSession('add').questions.length,pool.length);
});
test('correct review completion approves only visited items and the puzzle after the entire queue',()=>{
 const {FK,memory}=setup(),V=owner(FK),s=V.previewSession('add');
 assert.equal(V.sessionDecision(s,'approved'),false);assert.equal(V.finishSession(s),false);
 for(;s.round<s.questions.length;s.round++){assert.ok(V.visit(s));assert.ok(V.sessionDecision(s,'approved'));}
 assert.equal(V.status('add').status,'pending');assert.ok(V.finishSession(s));assert.ok(V.ready('add'));
 assert.ok(setup(memory).FK.puzzleReview.ready('add'));assert.equal(memory.has('farbtupf.puzzles.v1'),false,'review does not create a child round');
 assert.equal(V.previewSession('add').questions.length,0);assert.ok(V.finishSession(V.previewSession('add')),'an interrupted final celebration can be completed');
 const inspect=V.previewSession('add',s.iterationIds[0]);assert.equal(inspect.questions.length,1,'explicit reinspection remains possible');
});
test('rejection, a failed save, an unvisited queue or changed revision never grants release',()=>{
 const {FK,ctx}=setup(),V=owner(FK),s=V.previewSession('add');assert.ok(V.visit(s));
 const write=ctx.localStorage.setItem;ctx.localStorage.setItem=()=>{throw Error('full');};assert.equal(V.sessionDecision(s,'approved'),false);assert.equal(s.reviewResults.length,0);
 ctx.localStorage.setItem=write;assert.ok(V.sessionDecision(s,'improve',''));s.round++;
 for(;s.round<s.questions.length;s.round++){assert.ok(V.visit(s));assert.ok(V.sessionDecision(s,'approved'));}
 assert.equal(V.finishSession(s),false);assert.equal(V.ready('add'),false);
 const next=V.previewSession('add');assert.equal(next.questions.length,1);assert.ok(V.visit(next));FK.puzzleImplementation='changed';assert.equal(V.sessionDecision(next,'approved'),false);assert.match(V.error,/geändert/);
 const skipped=V.previewSession('add');skipped.round=skipped.questions.length;assert.equal(V.finishSession(skipped),false);
});
test('generated GitHub pages and revision reflect the exact runtime',()=>assert.deepEqual(check(),[]));
