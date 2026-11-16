#!/usr/bin/env node
/* One searchable catalogue of the existing drawn atlases; artwork and game revisions are never rewritten. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {environment}=require('../puzzle-environment.cjs'),{build}=require('../puzzle-review-build.cjs'),sharp=require('../node_modules/sharp');
const root=path.resolve(__dirname,'../..'),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function catalogue(){
 const env=environment({review:false}),{FK,ctx}=env;FK.STICKERS=[];FK.screen=()=>{};ctx.MutationObserver=class{observe(){}};ctx.document={body:{}};
 env.execute('js/ui/waldatelier.js');env.execute('js/screens/puzzle.js',s=>s.replace(/\}\)\(\);\s*$/,'FK.__imageLabels=labels;})();'));
 const {resources}=build(undefined,{includeResources:true}),games=FK.friendsLibrary.catalogue(),sheets=[];
 const recorded=JSON.parse(fs.readFileSync(path.join(root,'design/artwork/prompts/recorded-waldatelier.json')));
 for(const sheet of [...new Set(Object.values(FK.visual.subjects).map(rec=>rec.sheet))].sort()){
  const file=sheet+'.webp',bytes=fs.readFileSync(path.join(root,'assets/waldatelier',file)),metadata=await sharp(bytes).metadata(),rec=Object.values(FK.visual.subjects).find(rec=>rec.sheet===sheet);
  const manifest='design/illustrations/'+sheet+'.json',original=recorded.find(p=>p.id===sheet);
  const provenance=fs.existsSync(path.join(root,manifest))?{status:'recorded',manifest,guide:'design/illustrations/README.md'}:original?{status:'recorded-original',promptFile:'design/artwork/prompts/recorded-waldatelier.json',promptId:sheet,guide:'design/artwork/README.md'}:{status:'reconstruction-recipe',guide:'design/artwork/README.md',recipe:'design/artwork/prompts/puzzle-sheet-reconstruction.txt'};
  sheets.push({id:sheet,file,width:metadata.width,height:metadata.height,columns:rec.columns,rows:rec.rows,sha256:sha(bytes),provenance});
 }
 const images=Object.entries(FK.visual.subjects).sort(([a],[b])=>a.localeCompare(b)).map(([id,rec])=>{
  const sheet=sheets.find(s=>s.id===rec.sheet),width=sheet.width/rec.columns,height=sheet.height/rec.rows;
  return {id,label:FK.__imageLabels[id]||id.replaceAll('-',' '),sheet:rec.sheet,index:rec.index,column:rec.index%rec.columns,row:Math.floor(rec.index/rec.columns),sourceRect:{x:rec.index%rec.columns*width,y:Math.floor(rec.index/rec.columns)*height,width,height},tokens:Object.entries(FK.visual.tokens).filter(([,value])=>value===id).map(([token])=>token),usedBy:games.filter(g=>resources[g.id].includes(id)).map(g=>g.id)};
 });
 return {format:'waldpost-drawn-image-library',version:1,directory:'assets/waldatelier',guide:'design/artwork/README.md',runtimeRegistry:'js/ui/waldatelier.js',puzzles:Object.fromEntries(games.map(g=>[g.id,{title:g.title,host:g.host}])),sheets,images};
}
async function outputs(){
 const data=await catalogue(),lines=['# Drawn puzzle image library','','All drawn puzzle subjects live in this directory. Reuse their stable IDs with `FK.visual.art(id)`; their atlas cells stay in place.','', '[Browse, search and download individual pictures](https://mrtolchock.github.io/Drawing-App/assets/waldatelier/) · [Generator handoff and backgrounds](../../design/artwork/README.md) · [Machine-readable catalogue](library.json)','',`**${data.images.length} pictures · ${data.sheets.length} atlases · ${Object.keys(data.puzzles).length} active puzzles.** The browser library shows which pictures each puzzle uses, copies stable IDs and exports transparent PNGs from the existing atlas cells. Character portraits and backgrounds have separate roles, documented in the handoff.`, '', 'Generated with `node tools/illustrations/library.cjs`. Edit the runtime registry, then regenerate; do not edit the catalogue by hand. Existing image files are not repacked or moved.','','| Sheet | Pictures | Source |','| --- | ---: | --- |'];
 for(const s of data.sheets){const count=data.images.filter(i=>i.sheet===s.id).length;lines.push(`| [${s.id}](${s.file}) | ${count} | ${s.provenance.status==='recorded'?'[Recorded prompt and source](../../'+s.provenance.manifest+')':s.provenance.status==='recorded-original'?'[Original recorded prompt](../../'+s.provenance.promptFile+')':'[Reconstruction recipe](../../'+s.provenance.recipe+')'} |`);}
 lines.push('','For an individual file, open the browser library, search its ID/name, then choose **PNG herunterladen**. The PNG comes from the existing atlas; it is not newly generated. Atlas cell coordinates and exact pixel dimensions are also in `library.json`.','');
 return {'assets/waldatelier/library.json':JSON.stringify(data,null,2)+'\n','assets/waldatelier/README.md':lines.join('\n')};
}
module.exports={catalogue,outputs};
if(require.main===module)(async()=>{const files=await outputs(),stale=Object.entries(files).filter(([f,text])=>!fs.existsSync(path.join(root,f))||fs.readFileSync(path.join(root,f),'utf8')!==text).map(([f])=>f);
 if(process.argv.includes('--check')){if(stale.length)throw Error('Regenerate the image library: '+stale.join(', '));console.log('Drawn image library is current.');}
 else{for(const [file,text]of Object.entries(files))fs.writeFileSync(path.join(root,file),text);console.log('Wrote the drawn image library and GitHub index.');}
})().catch(error=>{console.error(error);process.exitCode=1;});
