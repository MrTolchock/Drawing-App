#!/usr/bin/env node
/* One current style, frozen reference pixels and complete forward-generation prompts. No image-service calls. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),configFile='design/illustrations/style.json';
const readDefault=f=>fs.readFileSync(path.join(root,f)),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const walk=dir=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);
const safe=f=>typeof f==='string'&&!path.isAbsolute(f)&&path.posix.normalize(f)===f&&!f.startsWith('../');
function state(read=readDefault){const spec=JSON.parse(read(configFile));return {spec,block:read(spec.styleBlock).toString().trimEnd(),read};}
function promptFor(s,item){
 const role=s.spec.roles[item.role],references=[...s.spec.references,...(role.references||[]),...(item.references||[])];
 return s.block+'\n\nROLE: '+item.role+'\n'+role.instruction+'\n\nATTACH THESE ACTUAL IMAGE FILES IN THIS ORDER:\n'+references.map((r,i)=>(i+1)+'. '+r.path+' — '+r.usage+': '+r.purpose).join('\n')+'\n\nSUBJECT AND LAYOUT BRIEF:\n'+s.read(item.brief).toString().trimEnd()+'\n\nSTYLE PRIORITY: The brief changes subjects and layout only. Keep '+s.spec.id+' and the supplied canonical reference technique throughout; do not import the style of a composition-only reference.\n';
}
function outputs(read=readDefault){const s=state(read);return Object.fromEntries(s.spec.prompts.map(item=>[item.path,promptFor(s,item)]));}
function request(id,read=readDefault){const s=state(read),item=s.spec.prompts.find(p=>p.id===id);if(!item)throw Error('Unknown prompt: '+id);const role=s.spec.roles[item.role];return {prompt:promptFor(s,item),referenced_image_paths:[...s.spec.references,...(role.references||[]),...(item.references||[])].map(r=>path.join(root,r.path)),transparent_background:item.transparent};}
function check({read=readDefault,files=walk('design'),archiveFiles=walk('archive')}={}){
 const errors=[];let s;try{s=state(read);}catch(e){return ['Cannot read the illustration style: '+e.message];}const {spec}=s;
 if(spec.format!=='waldpost-illustration-style'||spec.version!==1||spec.id!=='waldpost-watercolour-pencil-v1')errors.push('Unknown current illustration style.');
 if(spec.styleBlock!=='design/illustrations/STYLE.txt')errors.push('The canonical style block must stay in the current style kit.');
 if(spec.canonicalGuide!=='design/illustrations/STYLE.md'||!read(spec.canonicalGuide).toString().includes(spec.id))errors.push('The canonical guide must identify the current style.');
 if(sha(read(spec.styleBlock))!==spec.styleBlockSha256)errors.push('Canonical style block changed without updating its recorded hash.');
 if(!s.block.includes(spec.id))errors.push('The style block must name the current style ID.');
 if(!Array.isArray(spec.references)||spec.references.length!==2)errors.push('Use the two canonical style references.');
 const verifyReference=(ref,canonical=false)=>{try{
  if(!safe(ref.path)||ref.path.startsWith('archive/'))throw Error('Archived/unsafe reference is forbidden for generation: '+ref.path);
  if(canonical&&!ref.path.startsWith('design/illustrations/references/watercolour-pencil-v1/'))throw Error('Style references must be frozen in the current style kit.');
  if(canonical&&ref.usage!=='canonical-style')throw Error('Primary references must declare canonical style usage.');
  if(sha(read(ref.path))!==ref.sha256)throw Error('Reference pixels changed: '+ref.path);
 }catch(e){errors.push(e.message);}};
 for(const ref of spec.references||[])verifyReference(ref,true);
 if(spec.preview)verifyReference(spec.preview,true);
 const ids=new Set(),paths=new Set(),allowedText=new Set([spec.styleBlock]);
 for(const item of spec.prompts||[]){
  if(ids.has(item.id)||paths.has(item.path))errors.push('Duplicate prompt: '+item.id);ids.add(item.id);paths.add(item.path);allowedText.add(item.path);allowedText.add(item.brief);
  if(!safe(item.path)||!/^design\/(?:illustrations|artwork)\/prompts\/[^/]+\.txt$/.test(item.path)||!safe(item.brief)||!/^design\/(?:illustrations|artwork)\/briefs\/[^/]+\.txt$/.test(item.brief))errors.push('Prompt/brief must be registered in the active directories: '+item.id);
  if(!spec.roles[item.role]||typeof item.transparent!=='boolean'){errors.push('Invalid prompt role: '+item.id);continue;}
  for(const ref of spec.roles[item.role].references||[]){verifyReference(ref);if(item.role!=='navigation'||ref.usage!=='navigation-simplicity')errors.push('Only the prescribed navigation simplicity reference may supplement the canonical style pair.');}
  for(const ref of item.references||[]){verifyReference(ref);if(ref.usage!=='composition-only')errors.push('Additional target references must be composition-only: '+item.id);}
  try{const expected=promptFor(s,item);if(read(item.path).toString()!==expected)errors.push('Regenerate complete style prompt: '+item.path);if(expected.includes('archive/'))errors.push('Historical inputs leaked into a forward prompt: '+item.id);}catch(e){errors.push('Missing prompt/brief: '+item.id+' ('+e.message+')');}
 }
 for(const file of files)if(file.endsWith('.txt')&&!allowedText.has(file))errors.push('Unregistered active prompt/text recipe: '+file);
 for(const file of files.filter(f=>/^design\/(?:illustrations|artwork)\/prompts\//.test(f)))if(!paths.has(file))errors.push('Historical or unregistered file in an active prompt directory: '+file);
 for(const file of archiveFiles)if(/\/(?:AGENTS|CLAUDE)\.md$/.test(file)&&!['archive/AGENTS.md','archive/CLAUDE.md'].includes(file))errors.push('Historical working instructions must use an inert .record.md filename: '+file);
 for(const file of spec.preparationManifests||[]){try{const m=JSON.parse(read(file)),p=m.provenance,base=path.posix.dirname(file);if(path.posix.normalize(path.posix.join(base,p.styleContract))!==configFile)errors.push('Preparation manifest lacks the canonical style contract: '+file);if(!paths.has(path.posix.normalize(path.posix.join(base,p.forwardPrompt))))errors.push('Preparation manifest lacks a current forward prompt: '+file);const source=path.posix.normalize(path.posix.join(base,m.source));if(source.startsWith('archive/')||sha(read(source))!==p.sourceSha256)errors.push('Current editable source changed or moved to archive: '+file);const record=path.posix.normalize(path.posix.join(base,p.generationRecord));if(!record.startsWith(spec.history+'/'))errors.push('Generation record must be historical: '+file);read(record);}catch(e){errors.push('Invalid preparation record: '+file+' ('+e.message+')');}}
 for(const f of ['AGENTS.md','CLAUDE.md'])if(!read(f).toString().includes('design/illustrations/STYLE.md'))errors.push(f+' must direct assistants to the canonical style.');
 return [...new Set(errors)];
}
module.exports={outputs,request,check};
if(require.main===module){try{
 const args=process.argv.slice(2);
 if(args[0]==='--request'&&args.length===2){const errors=check();if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify(request(args[1]),null,2));}
 else if(args.length===1&&args[0]==='--check'){const errors=check();if(errors.length)throw Error(errors.join('\n'));console.log('Canonical style, frozen references, all forward prompts and source records are consistent.');}
 else if(!args.length){for(const [file,text]of Object.entries(outputs())){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),text);}console.log('Generated all complete prompts from the canonical style.');}
 else throw Error('Usage: node tools/illustrations/style.cjs [--check | --request <id>]');
}catch(e){console.error(e.message);process.exitCode=1;}}
