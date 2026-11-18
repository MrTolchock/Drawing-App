const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {build,currentReader}=require('../tools/puzzle-review-build.cjs');
const base=build(),reader=currentReader();
const changed=(file,transform)=>{const source=reader.read(file).toString(),next=transform(source);assert.notEqual(next,source,'fixture must change '+file);return build({...reader,read:name=>name===file?Buffer.from(next):reader.read(name)});};
const same=(a,b,id)=>assert.equal(a.puzzles[id].presentation,b.puzzles[id].presentation,id+' keeps its presentation');
const different=(a,b,id)=>{
 assert.notEqual(a.puzzles[id].presentation,b.puzzles[id].presentation,id+' changes its presentation');
 assert.notEqual(a.puzzles[id].reviewPresentation,b.puzzles[id].reviewPresentation,id+' requires review');
};
test('unrelated content and renderer changes keep counting approvals valid',()=>{
 const content=changed('js/friends/puzzle-catalogue.js',s=>s.replace('Welches Wort reimt sich?','Welches Wort klingt gleich?'));
 same(base,content,'friends-squirrel');assert.notEqual(base.puzzles['friends-bird'].definition,content.puzzles['friends-bird'].definition);
 const renderer=changed('js/screens/puzzle.js',s=>s.replace('function renderMatrix(q) {','function renderMatrix(q) { const layoutRevision=2;'));
 same(base,renderer,'friends-squirrel');different(base,renderer,'friends-beaver');
});
test('zero-basket rendering only reopens puzzles that can display an empty basket',()=>{
 const basket=changed('js/screens/puzzle.js',s=>s.replace("function picture(id,label='') {","function picture(id,label='') { if(id==='empty-basket')return h('span',{class:'puzzle-basket-fixture'},'Korb');"));
 for(const id of ['friends-squirrel','trace-numbers'])different(base,basket,id);
 for(const id of ['friends-bird','friends-beaver','friends-kingfisher','count','add','trace'])same(base,basket,id);
});
test('puzzle-specific CSS stays scoped; shared progress CSS invalidates affected puzzles',()=>{
 const matrix=changed('css/puzzle-rounds.css',s=>s+'\n.puzzle-matrix{row-gap:27px}\n');same(base,matrix,'friends-squirrel');different(base,matrix,'friends-beaver');
 const common=changed('css/puzzle-rounds.css',s=>s+'\n.puzzle-progress{gap:27px}\n');different(base,common,'friends-squirrel');different(base,common,'friends-bird');different(base,common,'trace');
});
test('typography corrections retain review compatibility while exact rendered revisions still change',()=>{
 const typography=changed('css/puzzle-rounds.css',s=>s+'\n.puzzle-read-text{font-size:32px;font-weight:700;line-height:1.4;letter-spacing:0;overflow-wrap:anywhere}\n');
 for(const id of ['friends-owl','friends-mouse','friends-hedgehog','friends-deer','friends-frog']){
  assert.notEqual(base.puzzles[id].presentation,typography.puzzles[id].presentation,id+' retains its exact display revision');
  assert.equal(base.puzzles[id].reviewPresentation,typography.puzzles[id].reviewPresentation,id+' keeps its content approval');
  assert.equal(base.puzzles[id].definition,typography.puzzles[id].definition);
 }
 const hidden=changed('css/puzzle-rounds.css',s=>s+'\n.puzzle-read-text{display:none}\n');
 different(base,hidden,'friends-owl');
});
test('the previous release stays review-compatible only for typography corrections and the same answer pictures',()=>{
 const {snapshotReader}=require('../tools/puzzle-review-build.cjs');
 const previous=build(snapshotReader('94948722951a6196b39524b3ffe804cbb724e637'));
 for(const id of ['friends-owl','friends-deer','friends-frog','add','read-leaves','read-colours']){
  assert.equal(previous.puzzles[id].definition,base.puzzles[id].definition,id);
  assert.equal(previous.puzzles[id].reviewPresentation,base.puzzles[id].reviewPresentation,id);
 }
 for(const key of ['friends-hedgehog/riddle-16','friends-hedgehog/riddle-18','friends-badger/riddle-14','friends-badger/riddle-22']){
  assert.notEqual(previous.iterations[key].definition,base.iterations[key].definition,key+' has changed content');
 }
 for(const id of ['friends-bird','friends-mouse']){
  assert.notEqual(previous.puzzles[id].reviewPresentation,base.puzzles[id].reviewPresentation,id+' contains the new rose');
 }
});
test('only actual image cells affect a puzzle, including shared-atlas changes',async()=>{
 const sharp=require('../tools/node_modules/sharp'),file='assets/waldatelier/forest-objects.webp';
 const {data,info}=await sharp(reader.read(file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 async function cell(index){const pixels=Buffer.from(data),x=Math.floor((index%4+.5)*info.width/4),y=Math.floor((Math.floor(index/4)+.5)*info.height/4),at=(y*info.width+x)*4;pixels.set([255,0,255,255],at);const bytes=await sharp(pixels,{raw:info}).png().toBuffer();return build({...reader,read:name=>name===file?bytes:reader.read(name)});}
 const lantern=await cell(12);same(base,lantern,'friends-squirrel');different(base,lantern,'friends-owl');
 const nut=await cell(0);different(base,nut,'friends-squirrel');
 const basketFile='assets/waldatelier/review-nature.webp',basket=await sharp(reader.read(basketFile)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 basket.data.set([255,0,255,255],(Math.floor(basket.info.height/4)*basket.info.width+Math.floor(basket.info.width/4))*4);
 const basketBytes=await sharp(basket.data,{raw:basket.info}).png().toBuffer(),basketChange=build({...reader,read:name=>name===basketFile?basketBytes:reader.read(name)});
 for(const id of ['friends-squirrel','trace-numbers'])different(base,basketChange,id);
 for(const id of ['friends-beaver','friends-kingfisher','count','add','trace'])same(base,basketChange,id);
 assert.deepEqual(Object.keys(base.iterations).filter(key=>base.iterations[key].presentation!==basketChange.iterations[key].presentation),['friends-squirrel/count-0',...['forest-nut','forest-apple','forest-feather'].map(item=>'trace-numbers/digit-0-'+item)]);
});
test('registered but unused artwork does not reopen existing puzzles',()=>{
 const unused=changed('js/ui/waldatelier.js',s=>s.replace('const sheets = {','const sheets = { unused:["unused-subject"],'));
 assert.deepEqual(unused,base);
 const unusedWord=changed('js/friends/puzzle-rounds.js',s=>s.replace('const wordArt={','const wordArt={Unbenutzt:"vocab-unused",'));
 assert.deepEqual(unusedWord,base);
});
test('the actual shared text helper invalidates reading tasks without reopening numeric counting',()=>{
 const text=changed('js/core/util.js',s=>s.replace("mode() { return 'normal'; }","mode() { return 'gross'; }"));
 same(base,text,'friends-squirrel');different(base,text,'friends-bird');different(base,text,'read-puzzle');
});
test('approvals from the former shared leaf cannot approve the redrawn gallery artwork',()=>{
 const {FK}=require('../tools/puzzle-catalogue.cjs').setup(),releases=JSON.parse(fs.readFileSync(path.join(__dirname,'../tools/puzzle-review-baselines.json'))).releases;
 const v36=releases.find(r=>r.commit.startsWith('9379fcd')),v37=releases.find(r=>r.commit.startsWith('719a907'));
 for(const g of FK.friendsLibrary.catalogue())for(const release of [v36,v37])for(const it of FK.puzzleCatalogue.iterations(g.id))assert.equal(FK.puzzleCatalogue.acceptsRevision(g.id,it.id,release.iterations[it.id]?.revision),false,it.id+' has new shared artwork');
});
test('the iteration recovery release retained verified historical decisions with their complete implementation token',()=>{
 const {environment}=require('../tools/puzzle-environment.cjs'),{snapshotReader}=require('../tools/puzzle-review-build.cjs');
 const release=environment({read:snapshotReader('b7c77ec0a318ac52e36ad5e1fcfdac9e249d4467').read,review:false});release.execute('js/friends/puzzle-implementation.js');
 const {FK}=release,C=FK.puzzleCatalogue;
 const old=environment({read:snapshotReader('d030f8d0919c980ecf7fc49b80f9785ded68e09b').read,review:false});old.execute('js/friends/puzzle-implementation.js');
 const changed=new Set(['friends-squirrel','friends-hedgehog','friends-deer','friends-badger','trace-numbers']);
 for(const game of FK.friendsLibrary.catalogue()){
  assert.equal(C.acceptsRevision(game.id,null,old.FK.puzzleCatalogue.puzzleRevision(game.id)),!changed.has(game.id),game.id+' puzzle');
  for(const item of C.iterations(game.id)){
   const earlier=old.FK.puzzleCatalogue.iterations(game.id).find(it=>it.id===item.id);
   const questionChanged=JSON.stringify(item.question)!==JSON.stringify(earlier.question),basketChanged=item.question.kind==='nuts'&&item.question.count===0||item.question.quantity?.count===0;
   assert.equal(C.acceptsRevision(game.id,item.id,old.FK.puzzleCatalogue.iterationRevision(game.id,earlier)),!questionChanged&&!basketChanged,item.id);
  }
 }
});
test('one edited question reopens only its iteration while menu text and summaries retain all approvals',()=>{
 const question=changed('js/friends/puzzle-catalogue.js',s=>s.replace('Wer hält eine Nuss?','Wer trägt eine Nuss?'));
 const affected=built=>Object.keys(base.iterations).filter(key=>JSON.stringify(base.iterations[key])!==JSON.stringify(built.iterations[key]));
 assert.deepEqual(affected(question),['friends-hedgehog/riddle-10']);
 const summary=changed('js/friends/puzzle-catalogue.js',s=>s.replace("'Mengen zählen'","'Anzahlen bestimmen'"));assert.deepEqual(affected(summary),[]);
 const menu=changed('css/puzzle-review.css',s=>s+'\n.review-grid{gap:31px}\n');assert.deepEqual(affected(menu),[]);
});
test('a handwriting path change preserves all other glyph approvals when their shared frame is unchanged',()=>{
 const glyph=changed('js/learn/glyphs.js',s=>s.replace('M7 100 L44 0 L81 100','M9 100 L44 0 L81 100'));
 assert.deepEqual(Object.keys(base.iterations).filter(key=>base.iterations[key].presentation!==glyph.iterations[key].presentation),['trace/letter-A']);
});
