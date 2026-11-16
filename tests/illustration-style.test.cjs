const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {check,request}=require('../tools/illustrations/style.cjs'),root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f));
const modified=(file,transform)=>f=>f===file?Buffer.from(transform(read(f).toString())):read(f);
test('all registered generation and repair requests carry the canonical style and actual fixed reference images',()=>{
 assert.deepEqual(check(),[]);const spec=JSON.parse(read('design/illustrations/style.json'));
 for(const item of spec.prompts){const packet=request(item.id);assert.ok(packet.prompt.startsWith(read(spec.styleBlock).toString().trimEnd()));assert.equal(packet.transparent_background,item.transparent);assert.deepEqual(packet.referenced_image_paths.slice(0,2),spec.references.map(ref=>path.join(root,ref.path)));assert.ok(packet.referenced_image_paths.every(f=>fs.existsSync(f)&&!f.includes('/archive/')));assert.equal(packet.prompt,read(item.path).toString());}
});
test('missing style text in a forward prompt is rejected',()=>{
 const file='design/illustrations/prompts/forest-actions.txt';assert.ok(check({read:modified(file,s=>s.slice(s.indexOf('SUBJECT AND LAYOUT BRIEF:')))}).some(e=>e.includes('Regenerate complete style prompt')));
});
test('unregistered or historical prompts cannot be added to the live design area',()=>{
 assert.ok(check({files:['design/artwork/prompts/old-style.json']}).some(e=>e.includes('unregistered file')));
 assert.ok(check({files:['design/alternative-style.txt']}).some(e=>e.includes('Unregistered active prompt')));
});
test('altered reference pixels and archived style inputs are rejected',()=>{
 const spec=JSON.parse(read('design/illustrations/style.json')),file=spec.references[0].path;
 assert.ok(check({read:f=>f===file?Buffer.from('replacement pixels'):read(f)}).some(e=>e.includes('Reference pixels changed')));
 const changed=modified('design/illustrations/style.json',s=>{const v=JSON.parse(s);v.references[0].path='archive/old.png';return JSON.stringify(v);});assert.ok(check({read:changed}).some(e=>e.includes('Archived/unsafe reference')));
});
test('current preparation records must link the canonical style and a registered forward prompt',()=>{
 const file='design/illustrations/forest-actions.json',changed=modified(file,s=>{const v=JSON.parse(s);v.provenance.forwardPrompt='prompts/old-generation.txt';return JSON.stringify(v);});assert.ok(check({read:changed}).some(e=>e.includes('lacks a current forward prompt')));
});
