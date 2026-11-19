const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {setup}=require('../tools/puzzle-catalogue.cjs');
test('November 19 reviews merge the requested pools and add three-object rows',()=>{
 const {FK}=setup(),C=FK.puzzleCatalogue;
 assert.equal(FK.friendsLibrary.catalogue().length,22);
 for(const id of ['pattern','nature']){assert.equal(C.puzzle(id),null);assert.deepEqual(Array.from(C.iterations(id)),[]);assert.equal(FK.puzzleRounds.instructions[id],undefined);}
 const mountain=C.iterations('friends-ibex');assert.equal(mountain.length,60);assert.equal(mountain.filter(it=>it.id.includes('/woodland-')).length,30);
 const animals=C.iterations('friends-hedgehog');assert.equal(animals.length,50);assert.equal(animals.filter(it=>it.id.includes('/nature-question-')).length,25);
 for(const it of animals){assert.match(it.question.text,/\?$/);assert.equal(it.question.choices.length,2);}
 const rows=C.iterations('friends-beaver');assert.equal(rows.length,43);let three=0;
 for(const it of rows){const q=it.question;if(new Set(q.matrix.slice(0,3)).size===3)three++;for(let n=1;n<3;n++)assert.deepEqual([...q.matrix.slice(n*3,n*3+3)].sort(),[...q.matrix.slice(0,3)].sort());assert.equal(q.matrix[q.gap],q.answer);}
 assert.equal(three,18);assert.equal(C.iterations('friends-mouse').length,74);
});
test('system approval notes from either terminology are hidden without rewriting history',()=>{
 const {FK}=setup(),V=FK.puzzleReview,C=FK.puzzleCatalogue,id='add',data=V.exportData();
 data.history.push(...['Alle Iterationen zusammen bestätigt','Alle Aufgaben zusammen bestätigt'].map((note,i)=>({key:'puzzle:'+id,revision:'old-'+i,status:'approved',note,at:'2026-11-18T12:00:00Z'})));
 assert.ok(V.importData(data));assert.equal(V.feedback(id).length,0);assert.equal(V.exportData().history.length,2);
});
test('the yellow Swiss postbox has transparency and its retained source matches the generator record',async()=>{
 const sharp=require('../tools/node_modules/sharp'),crypto=require('node:crypto'),record=require('../design/artwork/generation-records/swiss-postbox.json');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(record.source)).digest('hex'),record.sourceSha256);
 const image=await sharp('assets/waldatelier/swiss-postbox.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.equal(image.info.width,640);assert.equal(image.info.height,640);let yellow=0,transparent=0;
 for(let y=0;y<320;y++)for(let x=0;x<320;x++){const p=(y*640+x)*4,r=image.data[p],g=image.data[p+1],b=image.data[p+2],a=image.data[p+3];if(!a)transparent++;if(a>180&&r>150&&g>90&&b<g*.75)yellow++;}
 assert.ok(yellow>5000,'recognizable yellow area');assert.ok(transparent>30000,'genuine alpha around the box');
});
