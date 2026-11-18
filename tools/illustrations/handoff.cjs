#!/usr/bin/env node
/* Portable documentation of every image request and shipped artwork input; never generates or changes art. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('../node_modules/sharp'),style=require('./style.cjs'),{catalogue}=require('./library.cjs');
const {readRepair}=require('./prepare-library-repair.cjs');
const root=path.resolve(__dirname,'../..'),output='design/artwork/generator-inputs.json';
const read=file=>fs.readFileSync(path.join(root,file)),json=file=>JSON.parse(read(file));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const relative=(from,to)=>path.posix.normalize(path.posix.join(path.posix.dirname(from),to));
function assertCoverage(assets,offlineSource){
 const documented=new Set(assets.flatMap(asset=>(asset.files||[]).map(file=>file.path)));
 const offline=[...offlineSource.matchAll(/['"]\.\/([^'"]+\.(?:png|webp|svg|jpe?g))['"]/gi)].map(match=>match[1]);
 const missing=[...new Set(offline)].filter(file=>!documented.has(file));
 if(missing.length)throw Error('Undocumented offline artwork: '+missing.join(', '));
 return [...new Set(offline)].sort();
}
async function bundle(){
 const inventory=json('design/artwork/assets.json'),spec=json(inventory.styleContract),library=await catalogue();
 const errors=style.check();if(errors.length)throw Error(errors.join('\n'));
 const requests=Object.fromEntries(spec.prompts.map(item=>{
  const packet=style.request(item.id),references=[...spec.references,...(spec.roles[item.role].references||[]),...(item.references||[])];
  if(packet.prompt!==read(item.path).toString())throw Error('Regenerate prompt: '+item.path);
  return [item.id,{role:item.role,promptFile:item.path,brief:item.brief,
   requiresBriefCustomization:['subject-sheet','background','layout-repair','transparency-repair'].includes(item.id),
   request:{...packet,referenced_image_paths:references.map(ref=>ref.path)},references}];
 }));
 const cellRepairs=new Map();
 async function fileInfo(file){
  const bytes=read(file),metadata=await sharp(bytes).metadata();
  return {path:file,sha256:sha(bytes),width:metadata.width,height:metadata.height,hasAlpha:metadata.hasAlpha};
 }
 async function assetRecord(record,kind){
  if(['learning-sheet','current-artwork','preparation-input'].includes(kind)&&!record.requestId)throw Error('Missing specific generation request for '+record.id);
  if(record.requestId&&!requests[record.requestId])throw Error('Missing request for '+record.id);
  if(record.forwardPrompt&&requests[record.requestId]?.promptFile!==record.forwardPrompt)throw Error('Mismatched forward prompt for '+record.id);
  const files=await Promise.all((record.outputs||[record.file]).filter(Boolean).map(fileInfo));
  const result={...record,kind,files};
  if(record.cellRepair){
   if(!cellRepairs.has(record.cellRepair))cellRepairs.set(record.cellRepair,readRepair(record.cellRepair));
   const {repair,redraws}=cellRepairs.get(record.cellRepair),sheet=repair.sheets[record.id];
   if(!sheet||sheet.width!==files[0].width||sheet.height!==files[0].height||sheet.ids.some(id=>!record.subjects.some(subject=>subject.id===id)))throw Error('Invalid cell preparation for '+record.id);
   result.preparation={manifest:record.cellRepair,baseCommit:repair.baseCommit,framing:repair.framing,affectedSubjects:sheet.ids,
    redrawRecords:redraws.filter(redraw=>redraw.subjects.some(id=>sheet.ids.includes(id))).map(redraw=>redraw.recordFile),
    command:'node tools/illustrations/prepare-library-repair.cjs '+record.cellRepair+' assets/waldatelier '+record.id};
   result.source={path:record.file,commit:repair.baseCommit};
  }else if(record.manifest){
   const manifest=json(record.manifest);
   result.preparation={manifest:record.manifest,pathsRelativeTo:path.posix.dirname(record.manifest),settings:manifest,
    command:'node tools/illustrations/'+(manifest.format==='waldpost-illustration-atlas'?'pack-atlas.cjs':'prepare-image.cjs')+' '+record.manifest};
   result.source={path:relative(record.manifest,manifest.source),sha256:sha(read(relative(record.manifest,manifest.source)))};
  }
  return result;
 }
 const assets=[];
 for(const sheet of library.sheets){
  const record=inventory.learningSheets[sheet.id],manifest='design/illustrations/'+sheet.id+'.json';
  if(!record.requestId||record.requestId==='subject-sheet')throw Error('Learning sheet needs a specific request: '+sheet.id);
  const subjects=library.images.filter(image=>image.sheet===sheet.id).sort((a,b)=>a.index-b.index);
  const brief=read(requests[record.requestId].brief).toString();
  for(const subject of subjects)if(!new RegExp('(^|[^a-z0-9-])'+subject.id+'([^a-z0-9-]|$)').test(brief))throw Error('Brief lacks stable cell ID '+subject.id+': '+sheet.id);
  assets.push(await assetRecord({id:sheet.id,...record,file:'assets/waldatelier/'+sheet.file,columns:sheet.columns,rows:sheet.rows,subjects,
   ...(fs.existsSync(path.join(root,manifest))?{[record.cellRepair?'priorPreparationManifest':'manifest']:manifest}:{}),
   ...(!record.cellRepair&&!fs.existsSync(path.join(root,manifest))?{preparationNote:'No original packing manifest is retained. For a new PNG, create an atlas manifest with this exact grid and ordered subject list; see GENERATOR-INPUTS.md.'}:{})},'learning-sheet'));
 }
 for(const [key,kind]of [['currentGenerated','current-artwork'],['retainedGenerated','retained-legacy'],['preparationInputs','preparation-input'],['designDrafts','design-record'],['retiredRuntimeArtwork','retired-artwork']]){
  for(const record of inventory[key]||[]){
   if(record.directory)continue;
   assets.push(await assetRecord(record,kind));
  }
 }
 const offlineImages=assertCoverage(assets,read('sw.js').toString());
 return {format:'waldpost-generator-inputs',version:1,guide:'design/artwork/GENERATOR-INPUTS.md',
  style:{id:spec.id,contract:inventory.styleContract,guide:spec.canonicalGuide},
  pathConvention:'All paths are repository-relative, except paths inside embedded preparation settings, which are relative to their manifest. Rebase request.referenced_image_paths to the checkout root or upload those files in exactly that order.',
  parameters:{model:null,seed:null,providerSpecificOptions:null,note:'Model identifiers and deterministic seeds were not retained/exposed. Current requests are model-independent recipes, not claims of pixel-identical replay. File dimensions are export targets, not recovered generator size arguments.'},
  requests,assets,offlineImages,codePipelines:inventory.codePipelines,history:inventory.history};
}
async function outputs(){return {[output]:JSON.stringify(await bundle(),null,2)+'\n'};}
module.exports={bundle,outputs,assertCoverage};
if(require.main===module)(async()=>{
 const args=process.argv.slice(2);if(args.length&&!(args.length===1&&args[0]==='--check'))throw Error('Usage: node tools/illustrations/handoff.cjs [--check]');
 for(const [file,contents]of Object.entries(await outputs())){
  if(args[0]==='--check'){
   if(!fs.existsSync(path.join(root,file))||read(file).toString()!==contents)throw Error('Regenerate image-generator inputs: node tools/illustrations/handoff.cjs');
   console.log('All offline images, complete prompts, reference pixels and preparation inputs are documented.');
  }else{fs.writeFileSync(path.join(root,file),contents);console.log('Wrote '+file);}
 }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
