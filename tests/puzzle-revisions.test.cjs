const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {build,currentReader}=require('../tools/puzzle-review-build.cjs');
const base=build(),reader=currentReader();
const changed=(file,transform)=>{const source=reader.read(file).toString(),next=transform(source);assert.notEqual(next,source,'fixture must change '+file);return build({...reader,read:name=>name===file?Buffer.from(next):reader.read(name)});};
const same=(a,b,id)=>assert.equal(a.puzzles[id].presentation,b.puzzles[id].presentation,id+' keeps its presentation');
const different=(a,b,id)=>assert.notEqual(a.puzzles[id].presentation,b.puzzles[id].presentation,id+' changes its presentation');
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
 for(const g of FK.friendsLibrary.catalogue())for(const release of [v36,v37])assert.equal(FK.puzzleLegacyImplementations[g.id].includes(release.implementation),false,g.id+' has new shared artwork');
});
test('modern historical revisions recover only verified unchanged puzzles with their complete implementation token',()=>{
 const {FK}=require('../tools/puzzle-catalogue.cjs').setup(),C=FK.puzzleCatalogue;
 const {environment}=require('../tools/puzzle-environment.cjs'),{snapshotReader}=require('../tools/puzzle-review-build.cjs');
 const old=environment({read:snapshotReader('d030f8d0919c980ecf7fc49b80f9785ded68e09b').read,review:false});old.execute('js/friends/puzzle-implementation.js');
 const changed=new Set(['friends-squirrel','friends-hedgehog','friends-deer','friends-badger','trace-numbers']);
 for(const game of FK.friendsLibrary.catalogue()){
  assert.equal(C.acceptsRevision(game.id,null,old.FK.puzzleCatalogue.puzzleRevision(game.id)),!changed.has(game.id),game.id+' puzzle');
  for(const item of C.iterations(game.id)){
   const earlier=old.FK.puzzleCatalogue.iterations(game.id).find(it=>it.id===item.id);
   assert.equal(C.acceptsRevision(game.id,item.id,old.FK.puzzleCatalogue.iterationRevision(game.id,earlier)),!changed.has(game.id),item.id);
  }
 }
});
