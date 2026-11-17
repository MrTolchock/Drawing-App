#!/usr/bin/env node
/* Validate live dependencies, editorial picture roles, documentation and preserved history. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {historicalPath}=require('./legacy-paths.cjs');
const root=path.resolve(__dirname,'..'),errors=[];
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
const walk=dir=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);
const need=(from,to)=>{if(!exists(to))errors.push(from+' → missing '+to);if(/^(?:archive|legacy)\//.test(to)||to.startsWith('design/'))errors.push(from+' → retired/design runtime dependency '+to);};
const assets=new Set([...read('sw.js').matchAll(/'\.\/([^']*)'/g)].map(m=>m[1]||'index.html'));
for(const f of assets)need('offline cache',f);
const live=['index.html',...walk('js'),...walk('css')],dependencies=new Map();
for(const f of live){
 const source=read(f),refs=[],targets=[];
 if(f.endsWith('.html'))for(const m of source.matchAll(/(?:src|href)="([^"#]+)"/g))refs.push(m[1]);
 if(f.endsWith('.css'))for(const m of source.matchAll(/url\(['"]?([^)'"#]+)['"]?\)/g))refs.push(m[1]);
 if(f.endsWith('.js'))for(const m of source.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]/g))refs.push(m[1]);
 for(const ref of refs){
  if(/^(?:https?:|data:|blob:)/.test(ref))continue;
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(f),ref.split('?')[0]));targets.push(target);need(f,target);
  if(!assets.has(target))errors.push(f+' → dependency absent from offline cache '+target);
 }
 dependencies.set(f,targets);
 if(/(?:src|url|from|import)\s*[^\n]*['"](?:\.\.\/)*(?:archive|legacy)\//.test(source))errors.push(f+' loads legacy material');
}
// Active source directories contain only dependencies reached from the current entry point.
const reached=new Set(),pending=['index.html'];
while(pending.length){const file=pending.pop();if(reached.has(file))continue;reached.add(file);pending.push(...(dependencies.get(file)||[]));}
for(const file of live)if(!reached.has(file))errors.push('Unused live source; maintain under tools/tests or retire to legacy: '+file);
// Check the active docs, including every generated competence page. Historical links stay historical.
for(const f of ['README.md','AGENTS.md','CLAUDE.md',...walk('design').filter(f=>f.endsWith('.md')),...walk('docs').filter(f=>f.endsWith('.md'))]){
 for(const m of read(f).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const ref=m[1].split('#')[0];if(!ref||/^(?:https?:|mailto:)/.test(ref))continue;
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(f),ref));if(!exists(target))errors.push(f+' → broken document link '+ref);
 }
}
const historical=JSON.parse(read('legacy/design-history/manifest.json'));
const migration=JSON.parse(read('legacy/manifest.json'));
const records=[...historical.map(r=>({...r,archived:historicalPath(r.archived)})),...migration.records,...migration.relocations.map(r=>({...r,archived:r.current}))];
for(const r of records){if(!exists(r.archived)){errors.push('Missing legacy file '+r.archived);continue;}const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,r.archived))).digest('hex');if(hash!==r.sha256)errors.push('Legacy bytes changed: '+r.archived);}
const rules=JSON.parse(read('design/asset-rules.json')),{FK,ctx}=require('./puzzle-catalogue.cjs').setup();
FK.STICKERS=[];ctx.MutationObserver=class{observe(){}};ctx.document={body:{}};vm.runInContext(read('js/ui/waldatelier.js'),ctx);
const canonical=JSON.stringify(FK.friendsLibrary.catalogue().flatMap(g=>FK.puzzleCatalogue.iterations(g.id)));
for(const token of rules.subject.forbiddenTokens)if(canonical.includes('"'+token+'"'))errors.push('Scored content uses identity token '+token);
for(const [id,rec]of Object.entries(FK.visual.subjects))if(!FK.visual.source(rec.sheet).startsWith(rules.subject.directory+'/'))errors.push('Learning picture outside drawn library: '+id);
for(const g of FK.friendsLibrary.catalogue()){
 const p=FK.puzzleCatalogue.puzzle(g.id),pool=FK.puzzleCatalogue.iterations(g.id);
 if(pool.length<rules.puzzle.minimumPool||!p.competence||!p.difficulty)errors.push('Incomplete puzzle contract '+g.id);
}
if(!assets.has(rules.character.source))errors.push('Character identity atlas unavailable offline');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Design checks passed: ${live.length} live sources, ${assets.size} offline files, ${FK.friendsLibrary.catalogue().length} puzzle mappings, ${new Set(records.map(r=>r.archived)).size} preserved files and current document links.`);
