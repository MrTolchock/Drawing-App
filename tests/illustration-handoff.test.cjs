'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {bundle,assertCoverage}=require('../tools/illustrations/handoff.cjs');
const root=path.resolve(__dirname,'..');
test('generator handoff covers shipped artwork with portable inputs and specific puzzle-sheet requests',async()=>{
 const data=await bundle();
 assert.equal(JSON.stringify(data,null,2)+'\n',fs.readFileSync(path.join(root,'design/artwork/generator-inputs.json'),'utf8'));
 const sheets=data.assets.filter(asset=>asset.kind==='learning-sheet');
 assert.equal(sheets.length,19);
 assert.equal(sheets.reduce((count,sheet)=>count+sheet.subjects.length,0),240);
 for(const sheet of sheets){
  const packet=data.requests[sheet.requestId];
  assert.equal(packet.requiresBriefCustomization,false,sheet.id);
  assert.equal(packet.request.transparent_background,true,sheet.id);
  assert.deepEqual(sheet.subjects.map(subject=>subject.index),Array.from({length:sheet.subjects.length},(_,index)=>index));
 }
 for(const packet of Object.values(data.requests)){
  assert.ok(packet.request.referenced_image_paths.every(file=>!path.isAbsolute(file)&&fs.existsSync(path.join(root,file))));
  assert.deepEqual(packet.request.referenced_image_paths.slice(0,2),[
   'design/illustrations/references/watercolour-pencil-v1/animals.png',
   'design/illustrations/references/watercolour-pencil-v1/objects.png'
  ]);
 }
 for(const id of ['den','clearing'])assert.equal(data.assets.find(asset=>asset.id===id).originalFinalRequestRetained,false);
 const colouring=data.assets.find(asset=>asset.id==='colouring-friends');
 assert.equal(colouring.forwardPrompt,null);assert.equal(colouring.subjects.length,6);
});
test('new offline art or a missing inventory record fails generator coverage',()=>{
 const source="'./assets/forest-friends/den-v2.webp', './icons/icon.svg', './js/app.js'";
 const assets=[{files:[{path:'assets/forest-friends/den-v2.webp'},{path:'icons/icon.svg'}]}];
 assert.equal(assertCoverage(assets,source).length,2);
 assert.throws(()=>assertCoverage(assets,source+", './assets/interface/new-picture.png'"),/Undocumented offline artwork: assets\/interface\/new-picture\.png/);
 assert.throws(()=>assertCoverage(assets,source+', "./assets/interface/another-picture.webp"'),/Undocumented offline artwork: assets\/interface\/another-picture\.webp/);
 assert.throws(()=>assertCoverage([],source),/den-v2\.webp.*icon\.svg/);
});
