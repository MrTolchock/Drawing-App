const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {setup,check}=require('../tools/puzzle-catalogue.cjs');
const plain=v=>JSON.parse(JSON.stringify(v));
// Component fixture for a release whose picture cells were verified unchanged.
// Current production art may legitimately have no compatible historical release.
function compatibleSetup(saved){return setup(saved);}
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
   if(q.kind==='trace'){assert.ok(FK.glyphs.data[q.glyph]);if(q.quantity)assert.equal(q.quantity.count,Number(q.glyph),'pictured quantity matches the digit');}
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
 assert.equal(total,849);
});
test('rhyme pairs are distinct even when their word order is ignored',()=>{
 const pool=setup().FK.puzzleCatalogue.iterations('friends-bird'),pairs=pool.map(it=>[it.question.text,it.question.answer].map(w=>w.toLocaleLowerCase('de-CH')).sort().join('/'));
 assert.equal(pool.length,25);
 assert.equal(new Set(pairs).size,pool.length,'a reversed pair cannot count as another iteration');
 assert.equal(pairs.filter(pair=>pair==='fisch/tisch').length,1);
});
test('owl reading uses one sentence and two pictures; beaver needs the upper rows to establish shape quantities',()=>{
 const C=setup().FK.puzzleCatalogue,owl=C.iterations('friends-owl'),beaver=C.iterations('friends-beaver').filter(it=>/^friends-beaver\/matrix-\d+$/.test(it.id));
 assert.equal(owl.length,25);assert.equal(beaver.length,25);
 for(const it of owl){
  const q=it.question;
  assert.match(q.text,/^[^.?!]+\.$/,it.id+' has exactly one sentence');
  assert.equal(q.prompt,'Welches Bild passt zum Satz?',it.id+' uses the same task format');
  assert.equal(q.choices.length,2,it.id+' has exactly two pictures');
  assert.ok(q.choices.every(id=>!id.startsWith('scene:')),it.id+' has one animal per picture');
  assert.ok(q.choices.includes(q.answer));
  assert.ok(q.choices.every(id=>id.split('-')[0]===q.answer.split('-')[0]),it.id+' compares actions of the same animal');
 }
 assert.equal(new Set(owl.map(it=>it.question.text)).size,25,'new animals supply genuinely different sentences');
 assert.equal(new Set(owl.map(it=>it.question.answer)).size,25,'every sentence has its own pictured action');
 assert.equal(owl.find(it=>it.id==='friends-owl/sentence-4').question.answer,'mouse-sleep');
 assert.equal(new Set(beaver.map(it=>C.canonical(it.question))).size,25);
 for(const it of beaver){
  const q=it.question;
  assert.deepEqual([...q.choices].sort(),['forest-feather','forest-leaf','forest-nut']);
  const expected=[...q.matrix.slice(0,3)].sort(),counts=q.choices.map(s=>expected.filter(v=>v===s).length).sort();
  assert.deepEqual([...counts],[0,1,2],it.id+' has two of one shape and one of another, not a fixed set of all three');
  for(let row=1;row<3;row++)assert.deepEqual([...q.matrix.slice(row*3,row*3+3)].sort(),expected,it.id+' row '+row+' preserves the first row quantities');
  assert.notDeepEqual(q.matrix.slice(0,3),q.matrix.slice(3,6),'rows show different arrangements');
  assert.ok(q.gap>=6&&q.gap<=8,'gap is in the row to complete');
  const matches=q.choices.filter(shape=>{const line=q.matrix.slice(6);line[q.gap-6]=shape;return JSON.stringify(line.sort())===JSON.stringify(expected);});
  assert.deepEqual([...matches],[q.answer],'the first two rows imply exactly one completion');
  assert.equal(q.matrix[q.gap],q.answer);
 }
 assert.equal(new Set(beaver.map(it=>[...it.question.matrix.slice(0,3)].sort().join(','))).size,6,'both repeated quantities occur for every pair of shapes');
});
test('hedgehog riddles and every distractor use Swiss forest wildlife',()=>{
 const pool=setup().FK.puzzleCatalogue.iterations('friends-hedgehog').filter(it=>it.id.includes('/riddle-'));
 const allowed=new Set(['hedgehog','bird-sit','fish-swim','bee','snail','spider','butterfly','caterpillar','ladybird','hare-sit','squirrel-sit','squirrel-nut','badger-walk','beaver','frog-sit','ant','mouse-sit','fox-run','roe-stand','forest-woodpecker','forest-bat','forest-owl','forest-robin','forest-lynx','forest-marten','forest-fox','vocab-worm']);
 assert.equal(pool.length,25);assert.equal(new Set(pool.map(it=>it.question.answer)).size,25);
 for(const it of pool){assert.equal(it.question.choices.length,2);assert.ok(it.question.text.split(/\s+/).length<=6,it.id+' has a short clue');assert.ok(it.question.choices.every(id=>allowed.has(id)),it.id+' contains only local wildlife');assert.doesNotMatch(it.question.text,/Honig|wird ein|Ameisenhaufen|Pinsel|klopft|schläft/i,it.id+' asks about the visible picture rather than hidden facts');}
});
test('latest review fixes apply throughout the relevant pools and retire the requested puzzles',()=>{
 const {FK}=setup(),C=FK.puzzleCatalogue;
 for(const id of ['double','shapes','survey','friends-fish','trace','trace-numbers','friends-frog','friends-kingfisher','read-colours','read-leaves','read-word','pattern','nature']){assert.equal(C.puzzle(id),null);assert.equal(C.iterations(id).length,0);assert.equal(FK.puzzleRounds.instructions[id],undefined);}
 const animalPictures=new Set(['frog','hedgehog','bee','snail','dog','cat','spider','caterpillar','bear','sheep','pig','forest-fox','duck-swim','ant','ladybird','tortoise','squirrel-sit','zebra','lion','penguin','camel','tiger','elephant','giraffe','badger']);
 const mouse=C.iterations('friends-mouse');assert.equal(new Set(mouse.map(it=>it.question.text)).size,mouse.length);assert.ok(mouse.some(it=>it.id.includes('friends-frog-animal-'))&&mouse.some(it=>it.id.includes('read-word-word-')));
 for(const it of mouse.filter(it=>it.id.includes('friends-frog-animal-')))assert.ok(it.question.choices.every(id=>animalPictures.has(id)),it.id+' has only animals');
 const added=C.iterations('friends-hedgehog').filter(it=>it.id.includes('/nature-question-'));assert.equal(added.length,25);
 for(const it of added){assert.match(it.question.text,/^[^.!?]+\?$/,it.id+' is a question');assert.equal(it.question.choices.length,2);}
 assert.equal(C.iterations('friends-badger')[16].question.text,'Was braucht eine Pflanze zum Wachsen?');
 assert.equal(C.iterations('friends-badger')[24].question.text,'Was ernten wir vom Birnbaum?');
 assert.equal(C.iterations('friends-badger')[22].question.answer,'watering-can');
 for(const it of C.iterations('syllable')){assert.equal(it.question.prompt,'Wie viele Silben hat das Wort?');assert.equal(it.question.answer,it.question.parts.length);assert.equal(it.question.choices.length,3);}
 assert.ok(C.iterations('syllable').some(it=>it.question.answer===4));assert.ok(C.iterations('syllable').some(it=>it.question.answer===5));
 for(const {question} of C.iterations('treasure'))assert.ok(question.choices.every(choice=>choice===question.answer||!question.objects.includes(choice)));
});
test('feedback remains readable across changed revisions without changing the review decision',()=>{
 const {FK}=setup(),V=FK.puzzleReview,C=FK.puzzleCatalogue,id='syllable',key='syllable/word-6',old={key,revision:'before-new-pictures',status:'improve',note:'Einfach nur Silben zählen.',at:'2026-11-15T20:58:24.776Z'};
 const data=V.exportData();data.decisions[key]={key,revision:C.iterationRevision(id,C.iterations(id).find(it=>it.id===key)),status:'pending',note:'',at:'2026-11-16T12:00:00.000Z'};data.history.push(old,{...old,revision:'another-older-picture'}, {...old,key:'puzzle:syllable',note:"Alle Aufgaben zusammen bestätigt"});
 assert.ok(V.importData(data));const before=plain(V.exportData());delete before.exportedAt;
 const notes=plain(V.feedback(id));assert.equal(notes.length,1);assert.equal(notes[0].note,old.note);assert.equal(notes[0].at,old.at);assert.equal(notes[0].stale,true);
 const after=plain(V.exportData());delete after.exportedAt;assert.deepEqual(after,before);assert.equal(V.status(id,key).status,'pending');assert.equal(V.ready(id),false);
});
test('a stale rejection remains marked for improvement while a stale approval cannot release changed content',()=>{
 const {FK}=setup(),V=FK.puzzleReview,id='add',items=FK.puzzleCatalogue.iterations(id),data=V.exportData();
 for(const [index,status]of ['approved','improve'].entries()){const key=items[index].id;data.seen[key]='different-content';data.decisions[key]={key,revision:'different-content',status,note:'Original note',at:'2026-11-17T12:00:00Z'};}
 assert.ok(V.importData(data));assert.equal(V.status(id,items[0].id).status,'pending');assert.equal(V.status(id,items[1].id).status,'improve');assert.equal(V.status(id,items[1].id).stale,true);assert.equal(V.status(id,items[1].id).decision.note,'Original note');assert.equal(V.ready(id),false);
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
 const selected=V.previewSession('add',pool[1].id);assert.equal(selected.iterationIds[0],pool[1].id);assert.equal(new Set(selected.iterationIds).size,s.questions.length);assert.equal(selected.questions.length,s.questions.length);
 assert.ok(V.visit(s));assert.ok(V.sessionDecision(s,'improve'));assert.equal(V.sessionDecision(s,'approved'),false);s.round++;
 assert.equal(s.questions.length,pool.length-1,'rejection is not re-added to the active run');
 const next=V.previewSession('add');assert.ok(next.iterationIds.includes(pool[1].id));
 FK.puzzleImplementation='new-interaction';assert.equal(V.previewSession('add').questions.length,pool.length);
});
test('a puzzle becomes approved when every seen or answered iteration is approved',()=>{
 const {FK,memory}=setup(),V=owner(FK),s=V.previewSession('add');
 assert.equal(V.finishSession(s),false);
 // answering the task on screen counts as having seen it, even if the mark from showing it was lost
 assert.equal(V.status('add',s.iterationIds[0]).seen,false);assert.ok(V.sessionDecision(s,'approved'));assert.equal(V.status('add',s.iterationIds[0]).seen,true);s.round++;
 for(;s.round<s.questions.length;s.round++){assert.ok(V.visit(s));assert.ok(V.sessionDecision(s,'approved'));}
 assert.equal(V.status('add').status,'approved');assert.ok(V.ready('add'));assert.ok(V.finishSession(s));
 assert.ok(setup(memory).FK.puzzleReview.ready('add'));assert.equal(memory.has('farbtupf.puzzles.v1'),false,'review does not create a child round');
 assert.equal(V.previewSession('add').questions.length,0);assert.equal(V.start('add'),false,'the completed puzzle needs no empty review queue');
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
test('verified unchanged historical reviews remain valid without rewriting decisions or inspection evidence',()=>{
 const id='mirror',{environment}=require('../tools/puzzle-environment.cjs'),{snapshotReader}=require('../tools/puzzle-review-build.cjs'),old=environment({read:snapshotReader('073657f32f87daa47739910df090e4250289cc55').read});old.execute('js/friends/puzzle-implementation.js');approve(old.FK,id);
 const memory=old.memory,before=JSON.stringify([...memory]),{FK}=compatibleSetup(memory),C=FK.puzzleCatalogue,items=C.iterations(id);
 assert.equal(FK.puzzleReview.status(id,items[0].id).status,'approved');assert.equal(FK.puzzleReview.status(id,items[0].id).seen,true);assert.ok(FK.puzzleReview.ready(id));
 assert.equal(JSON.stringify([...memory]),before,'read-only recovery preserves timestamps, notes and history');
 const V=owner(FK);assert.ok(V.decide(id,items[0].id,'approved'));
 assert.equal(V.exportData().seen[items[0].id],C.iterationRevision(id,items[0]),'an explicit review records exact inspection evidence');
 const key=memory.keys().next().value,raw=JSON.parse(memory.get(key));raw.decisions[items[1].id].revision='0000000000000000';memory.set(key,JSON.stringify(raw));
 const restored=compatibleSetup(memory).FK.puzzleReview;assert.equal(restored.status(id,items[0].id).status,'approved');assert.equal(restored.status(id,items[1].id).status,'pending');assert.equal(restored.ready(id),false);
});
test('the expanded mouse reading pool keeps approval for all 25 original word cards',()=>{
 const {environment}=require('../tools/puzzle-environment.cjs'),{snapshotReader}=require('../tools/puzzle-review-build.cjs');
 const old=environment({read:snapshotReader('12511e417e384f8e912be4a62496fce2c234c1e8').read});old.execute('js/friends/puzzle-implementation.js');
 const id='friends-mouse',former=old.FK.puzzleCatalogue,current=compatibleSetup().FK.puzzleCatalogue,items=former.iterations(id);
 assert.equal(items.length,25);assert.ok(current.iterations(id).length>items.length);
 for(const item of items)assert.ok(current.acceptsRevision(id,item.id,former.iterationRevision(id,item)),item.id);
});
test('verified unchanged partial rounds resume verbatim; changed questions remain archived',()=>{
 const {FK,memory}=compatibleSetup(),id='friends-squirrel',s=FK.puzzleRounds.start(id);s.round=2;s.work={};s.catalogueRevision=FK.puzzleCatalogue.formerPuzzleRevisions(id)[0];FK.puzzleRounds.save(s);
 assert.deepEqual(plain(compatibleSetup(memory).FK.puzzleRounds.start(id)),plain(s));
 s.questions[0].count=99;FK.puzzleRounds.save(s);const restored=compatibleSetup(memory),next=restored.FK.puzzleRounds.start(id);assert.equal(next.round,0);assert.equal(JSON.parse(restored.memory.get('farbtupf.puzzles.v1')).legacy[id].questions[0].count,99,'the earlier snapshot is archived');
});

test('general puzzle comments reopen the puzzle and retain individual decisions',()=>{
 const {FK,memory}=setup(),V=owner(FK);
 assert.ok(V.comment('add','  Gemeinsame Rückmeldung  '));assert.equal(V.status('add').decision.note,'Gemeinsame Rückmeldung');assert.equal(V.status('add').status,'improve');assert.equal(V.ready('add'),false);
 assert.equal(setup(memory).FK.puzzleReview.status('add').decision.note,'Gemeinsame Rückmeldung');
 const session=V.previewSession('add');for(;session.round<session.questions.length;session.round++)assert.ok(V.sessionDecision(session,'approved'));
 assert.ok(V.finishSession(session));assert.equal(V.status('add').decision.note,'Gemeinsame Rückmeldung');assert.ok(V.ready('add'));
 const before=V.progress('add');assert.ok(V.comment('add','Bilder prüfen.'));assert.equal(V.ready('add'),false);assert.deepEqual(V.progress('add'),before);
 assert.equal(V.comment('add','  '),false);assert.equal(V.status('add').decision.note,'Bilder prüfen.');
 assert.ok(V.approveAll('add'));assert.ok(V.ready('add'));assert.equal(V.status('add').decision.note,'Bilder prüfen.');
 const id='add/1-1';assert.ok(V.decide('add',id,'pending'));const earlier=V.previewSession('add');
 assert.ok(V.sessionDecision(earlier,'approved'));earlier.round++;
 assert.ok(V.comment('add','Späterer allgemeiner Hinweis.'));
 assert.ok(V.finishSession(earlier));assert.equal(V.ready('add'),false);assert.equal(V.status('add').decision.note,'Späterer allgemeiner Hinweis.');
});
test('one changed iteration leaves all other approvals intact and the puzzle opens until that item passes',()=>{
 const {FK,execute}=setup(),id='friends-hedgehog';approve(FK,id);const before=plain(FK.puzzleReview.exportData().decisions);
 execute('js/friends/puzzle-catalogue.js',source=>source.replace('Wer hält eine Nuss?','Wer trägt eine Nuss?'));execute('js/friends/puzzle-review.js');
 const C=FK.puzzleCatalogue,V=owner(FK),key=id+'/riddle-10';assert.equal(V.progress(id).approved,C.iterations(id).length-1);assert.equal(V.status(id).status,'pending');assert.equal(V.ready(id),false);
 assert.deepEqual(plain(V.previewSession(id).iterationIds),[key]);
 for(const it of C.iterations(id))if(it.id!==key){assert.equal(V.status(id,it.id).status,'approved');assert.deepEqual(plain(V.status(id,it.id).decision),before[it.id]);}
 assert.ok(V.seen(id,key));assert.ok(V.decide(id,key,'approved'));assert.equal(V.ready(id),true);assert.equal(V.status(id).status,'approved','no unrelated whole-puzzle sign-off is required');
});
test('an unrelated iteration change cannot invalidate the task currently being inspected',()=>{
 const {FK}=setup(),V=owner(FK),id='friends-hedgehog',session=V.previewSession(id),changed=id+'/riddle-10';FK.puzzleIterationImplementations[changed]='changed-rendering';
 assert.ok(V.sessionDecision(session,'approved'),'the unchanged task on screen can still be confirmed');session.round=session.iterationIds.indexOf(changed);assert.equal(V.sessionDecision(session,'approved'),false,'the changed task itself requires a fresh preview');assert.match(V.error,/geändert/);
});

test('deleting a displayed comment removes every older duplicate but preserves all decisions and inspection evidence',()=>{
 const {FK,memory}=setup(),V=owner(FK),id='add',key='add/1-1',d={key,revision:'old-art',status:'improve',note:'Bilder prüfen.',at:'2026-11-15T12:00:00.000Z'};
 const saved=V.exportData();saved.decisions[key]=d;saved.history.push({...d,revision:'older-art'},{...d,note:'Anderer Hinweis.'},{...d,key:'add/1-2'});assert.ok(V.importData(saved));
 assert.ok(V.comment(id,'Allgemeiner Hinweis.'));const before=V.exportData(),note=V.feedback(id).find(v=>v.key===key&&v.note===d.note);
 assert.ok(V.deleteFeedback(id,note));assert.equal(V.feedback(id).filter(v=>v.key===key&&v.note===d.note).length,0);
 assert.deepEqual(plain(V.exportData().decisions),plain(before.decisions));assert.deepEqual(plain(V.exportData().seen),plain(before.seen));assert.equal(V.status(id,key).decision.note,'');assert.equal(V.status(id,key).stale,true);assert.equal(V.ready(id),false);
 assert.equal(V.feedback(id).length,3,'other notes, other iterations and puzzle comment are retained');assert.equal(V.deleteFeedback(id,note),false,'a disappeared row cannot be deleted twice');
 const restored=setup(memory).FK.puzzleReview;assert.equal(restored.feedback(id).some(v=>v.key===key&&v.note===d.note),false,'reload retains deletion');
 const general=V.feedback(id).find(v=>v.key==='puzzle:'+id);assert.ok(V.deleteFeedback(id,general));assert.equal(V.status(id).decision.note,'');
 assert.ok(V.comment(id,general.note));assert.equal(V.feedback(id).some(v=>v.key===general.key&&v.note===general.note),true,'explicitly saving the same comment again is allowed');
 const exported=V.exportData(),other=setup().FK.puzzleReview;assert.ok(other.importData(exported));assert.equal(other.feedback(id).some(v=>v.key===key&&v.note===d.note),false,'backups retain deletions too');
});
test('comment deletion requires the adult review and a successful local write; approved puzzles remain approved',()=>{
 const {FK,ctx}=setup(),V=owner(FK);assert.ok(V.comment('add','Prüfnotiz.'));const note=V.feedback('add')[0],saved=V.exportData();
 const unauthorized=setup().FK.puzzleReview;assert.ok(unauthorized.importData(saved));assert.equal(unauthorized.deleteFeedback('add',note),false);
 const write=ctx.localStorage.setItem;ctx.localStorage.setItem=()=>{throw Error('quota');};assert.equal(V.deleteFeedback('add',note),false);assert.equal(V.feedback('add').length,1);ctx.localStorage.setItem=write;
 assert.ok(V.approveAll('add'));assert.ok(V.ready('add'));const before=plain(V.exportData().decisions);assert.ok(V.deleteFeedback('add',V.feedback('add')[0]));assert.ok(V.ready('add'));assert.deepEqual(plain(V.exportData().decisions),before);
});

test('November 17 follow-up uses a pictured nut, real swimming habitat and a short replacement growth question',()=>{
 const C=setup().FK.puzzleCatalogue,q=(id,key)=>C.iterations(id).find(it=>it.id===id+'/'+key).question;
 const squirrel=q('friends-hedgehog','riddle-10');assert.equal(squirrel.text,'Wer hält eine Nuss?');assert.equal(squirrel.answer,'squirrel-nut');assert.ok(squirrel.choices.includes('squirrel-nut'));
 for(const key of ['riddle-0','riddle-22']){const item=q('friends-deer',key);assert.equal(item.answer,'habitat-pond');assert.ok(!item.choices.includes('water'));}
 const growth=q('friends-badger','riddle-23');assert.equal(growth.text,'Was wächst aus einer Eichel?');assert.equal(growth.answer,'tree');assert.equal(q('friends-badger','riddle-6').answer,'water','watering questions still use water rather than a habitat');
 assert.equal(C.puzzle('friends-fish'),null);assert.equal(C.iterations('friends-fish').length,0);
});
