/* Review fingerprints follow the code, CSS and picture cells actually used by each puzzle. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const acorn=require('acorn'),postcss=require('postcss'),selectors=require('postcss-selector-parser'),{environment}=require('./puzzle-environment.cjs');
const root=path.resolve(__dirname,'..'),SCHEMA=crypto.createHash('sha256').update('waldpost-per-iteration-review-v2').digest('hex');
const hash=value=>crypto.createHash('sha256').update(typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value)).digest('hex');
const walk=(node,visit,parent,key)=>{if(!node||typeof node!=='object')return;visit(node,parent,key);for(const [k,v]of Object.entries(node))if(v&&typeof v==='object')Array.isArray(v)?v.forEach(n=>walk(n,visit,node,k)):walk(v,visit,node,k);};
function moduleOf(source){
 const ast=acorn.parse(source,{ecmaVersion:'latest'}),body=ast.body.find(n=>n.type==='ExpressionStatement'&&n.expression.type==='CallExpression')?.expression.callee.body?.body;
 if(!body)throw Error('Expected a reviewed IIFE module.');
 const bindings=new Map();for(const node of body){if(node.type==='FunctionDeclaration')bindings.set(node.id.name,node);if(node.type==='VariableDeclaration')for(const d of node.declarations)if(d.id.type==='Identifier')bindings.set(d.id.name,d);}
 return {body,bindings};
}
const property=node=>node?.computed?node.property?.value:node?.property?.name;
function normal(node,{kinds=[],special={},items=[],pictureIds=[]}={},owner=''){
 if(!node||typeof node!=='object')return node;
 if(Array.isArray(node))return node.map(x=>normal(x,{kinds,special,items,pictureIds},owner)).filter(x=>x?.type!=='ExcludedReviewBranch');
 if(['VariableDeclarator','FunctionDeclaration'].includes(node.type)&&Object.hasOwn(special,node.id.name))return {type:'SelectedData',name:node.id.name,value:special[node.id.name]};
 if(node.type==='FunctionDeclaration')owner=node.id.name;
 const values=n=>{
  if(n?.type==='Literal')return [n.value];
  if(n?.type==='MemberExpression'&&['q','question'].includes(n.object?.name)&&['kind','item'].includes(property(n)))return [...new Set(items.map(q=>q[property(n)]))];
  if(n?.type==='Identifier'&&n.name==='id'&&owner==='renderCount')return [...new Set(items.flatMap(q=>q.kind==='nuts'?[q.item||'forest-nut']:q.bugs||[]))];
  if(n?.type==='Identifier'&&n.name==='id'&&owner==='picture')return pictureIds;
  return null;
 };
 const truth=n=>{
  if(n?.type==='MemberExpression'&&['q','question'].includes(n.object?.name)&&property(n)==='quantity'){const present=new Set(items.map(q=>!!q.quantity));if(present.size===1)return [...present][0];}
  // A zero-only decoration cannot affect a finite pool containing no zero quantities.
  if(owner==='renderCount'&&n?.type==='UnaryExpression'&&n.operator==='!'&&n.argument?.type==='MemberExpression'&&n.argument.object?.name==='items'&&property(n.argument)==='length'){
   const counts=items.map(q=>q.kind==='nuts'?q.count:q.bugs?.length);
   if(counts.length&&counts.every(n=>Number.isInteger(n)&&n>0))return false;
  }
  if(n?.type==='BinaryExpression'&&['===','!==','==','!='].includes(n.operator)){
   const a=values(n.left),b=values(n.right);if(!a?.length||!b?.length)return;
   const out=new Set(a.flatMap(x=>b.map(y=>n.operator.includes('!')?x!==y:x===y)));if(out.size===1)return [...out][0];
  }
  if(n?.type==='LogicalExpression'){const a=truth(n.left);if(n.operator==='&&'&&a===false||n.operator==='||'&&a===true)return a;if(a!==undefined)return truth(n.right);}
 };
 if(['ConditionalExpression','IfStatement'].includes(node.type)){
  const value=truth(node.test);if(value!==undefined)return normal(value?node.consequent:node.alternate,{kinds,special,items,pictureIds},owner)||{type:'ExcludedReviewBranch'};
 }
 const out={};for(const [key,value]of Object.entries(node)){
  if(['start','end','loc','raw'].includes(key))continue;
  if(node.type==='VariableDeclarator'&&node.id.name==='renderers'&&key==='init'){
   if(value.type!=='ObjectExpression')throw Error('Renderer dispatch must remain an explicit object.');
   const properties=value.properties.filter(p=>kinds.includes(p.key.name||p.key.value));
   if(properties.length!==kinds.length)throw Error('A puzzle kind has no declared renderer.');
   out[key]=normal({...value,properties},{kinds,special,items,pictureIds},owner);
  }else out[key]=normal(value,{kinds,special,items,pictureIds},owner);
 }return out;
}
function closure(module,roots,options={}){
 const needed=new Map(),queue=roots.map(node=>normal(node,options));
 for(let at=0;at<queue.length;at++)walk(queue[at],(node,parent,key)=>{
  if(node.type!=='Identifier'||key==='id'||key==='params'||parent?.type==='MemberExpression'&&key==='property'&&!parent.computed||parent?.type==='Property'&&key==='key'&&!parent.computed)return;
  if(!needed.has(node.name)&&module.bindings.has(node.name)){const value=normal(module.bindings.get(node.name),options);needed.set(node.name,value);queue.push(value);}
 });
 return {roots:queue.slice(0,roots.length),bindings:[...needed].sort(([a],[b])=>a.localeCompare(b))};
}
function capture(env,file,statement){env.execute(file,source=>{const end=source.lastIndexOf('})();');if(end<0)throw Error('Cannot inspect '+file);return source.slice(0,end)+statement+'\n'+source.slice(end);});}
function strings(value,out=new Set()){if(typeof value==='string')out.add(value);else if(value&&typeof value==='object')for(const v of Object.values(value))strings(v,out);return out;}
function cssFor(source,classes,game){
 const possible=selector=>{
  for(const node of selector.nodes||[]){
   if(node.type==='class'&&!classes.has(node.value)&&!node.value.startsWith('wb-')&&!node.value.startsWith('is-'))return false;
   if(node.type==='attribute'&&node.operator==='='&&node.attribute==='data-game'&&node.value!==game.id)return false;
   if(node.type==='attribute'&&node.operator==='='&&node.attribute==='data-host'&&node.value!==game.host)return false;
   if(node.type==='pseudo'&&[':is',':where',':has'].includes(node.value)&&!node.nodes.some(possible))return false;
  }return true;
 };
 const selected=selector=>selectors().astSync(selector).nodes.some(possible),animations=new Set(),ast=typeof source==='string'?postcss.parse(source):source;
 const filter=node=>{
  if(node.type==='comment')return null;
  if(node.type==='decl'){if(/animation/.test(node.prop))for(const name of node.value.match(/[\w-]+/g)||[])animations.add(name);return [node.prop,node.value,node.important||false];}
  if(node.type==='rule'&&!selected(node.selector))return null;
  if(node.type==='atrule'&&/keyframes/.test(node.name))return null;
  if(node.type==='atrule'&&node.name==='font-face'&&!node.toString().includes('Andika'))return null;
  const children=node.nodes?.map(filter).filter(Boolean);if(children&&!children.length)return null;
  return [node.type,node.selector||node.name||'',node.params||'',children||[]];
 };
 const result=ast.nodes.map(filter).filter(Boolean);
 ast.walkAtRules(/keyframes/,node=>{if(animations.has(node.params))result.push(['keyframes',node.params,node.nodes.map(n=>[n.selector,n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value,d.important||false])])]);});
 return result;
}
function currentReader(){return {read:file=>fs.readFileSync(path.join(root,file)),css:()=>fs.readdirSync(path.join(root,'css')).filter(n=>n.endsWith('.css')).sort().map(n=>'css/'+n)};}
function snapshotReader(ref){
 const cache=new Map(),read=file=>{if(!cache.has(file)){const r=spawnSync('git',['show',ref+':'+file],{cwd:root,maxBuffer:40*1024*1024});if(r.status!==0)throw Error('Missing review baseline '+ref+' ('+file+'). Fetch repository history.');cache.set(file,r.stdout);}return cache.get(file);};
 const r=spawnSync('git',['ls-tree','-r','--name-only',ref,'css'],{cwd:root,encoding:'utf8'});if(r.status!==0)throw Error('Cannot read baseline '+ref);
 return {read,css:()=>r.stdout.trim().split('\n').filter(n=>n.endsWith('.css')).sort()};
}
function build(reader=currentReader(),{includeResources=false}={}){
 const {read}=reader,env=environment({read,review:false}),{FK,ctx}=env,C=FK.puzzleCatalogue;
 FK.STICKERS=[];FK.screen=()=>{};FK.on=()=>()=>{};FK.h=(tag,attrs,...children)=>({tag,attrs,children,classList:{add(){}}});
 ctx.MutationObserver=class{observe(){}};ctx.document={body:{}};
 capture(env,'js/ui/waldatelier.js','FK.__resolvePicture=resolve;FK.__visualData={tokens,aliases,cast,symbols};');
 capture(env,'js/screens/puzzle.js','FK.__pictureData={aliases,labels};');env.execute('js/friends/interface.js');
 FK.clamp=(n,a,b)=>Math.max(a,Math.min(b,n));capture(env,'js/screens/trace.js','FK.__reviewTraceFrame=g=>{woodlandSession={};learningStage=3;return frameOf(FK.glyphs.sets.find(set=>set.items.includes(g)).id);};');
 const puzzle=moduleOf(read('js/screens/puzzle.js').toString()),rounds=moduleOf(read('js/friends/puzzle-rounds.js').toString()),catalogue=moduleOf(read('js/friends/puzzle-catalogue.js').toString()),visual=moduleOf(read('js/ui/waldatelier.js').toString());
 const screen=puzzle.body.find(n=>n.type==='ExpressionStatement'&&n.expression.callee?.object?.name==='FK'&&property(n.expression.callee)==='screen');
 const exportUI=puzzle.body.find(n=>n.type==='ExpressionStatement'&&n.expression.type==='AssignmentExpression'&&property(n.expression.left)==='puzzleUI').expression.right;
 const css=reader.css().map(file=>[file,postcss.parse(read(file).toString())]),states=['friends-interface','screen','topbar','title','btn-back','forest-portrait','ff-map-friend','ff-character-portrait','wa-illustration','wa-symbol','ic','sr-only','scroll','done','current','marked','filled','gap','active'];
 const portraitModule=moduleOf(read('js/friends/interface.js').toString()),libraryModule=moduleOf(read('js/friends/library.js').toString()),util=moduleOf(read('js/core/util.js').toString());
 const coreHelper=name=>hash(normal(util.body.find(n=>n.type==='ExpressionStatement'&&n.expression.type==='AssignmentExpression'&&n.expression.left.object?.name==='FK'&&property(n.expression.left)===name)));
 const effects=puzzle.body.filter(n=>!['FunctionDeclaration','VariableDeclaration'].includes(n.type)&&!(n.type==='ExpressionStatement'&&(n.expression.type==='Literal'||n===screen||n.expression.type==='AssignmentExpression'&&property(n.expression.left)==='puzzleUI'||n.expression.type==='CallExpression'&&n.expression.callee?.object?.name==='Object'&&property(n.expression.callee)==='assign'&&n.expression.arguments[0]?.name==='labels')));
 const all={},atlases=new Map(),picturesCache=new Map(),codeCache=new Map(),cssCache=new Map();
 const atlas=(key,columns,rows)=>{if(!atlases.has(key))atlases.set(key,{key,columns,rows,bytes:read(key).toString('base64')});};
 function pictureResource(id){
  if(picturesCache.has(id))return picturesCache.get(id);
  const resolved=FK.__resolvePicture(FK.__pictureData.aliases[id]||id),result=[];
  if(resolved)for(const subject of new Set([resolved,FK.puzzles.pictures[resolved]].filter(Boolean))){const rec=FK.visual.subjects[subject];if(!rec)continue;const key=FK.visual.source(rec.sheet);atlas(key,rec.columns,rec.rows);result.push({subject,...rec,key});}
  picturesCache.set(id,result);return result;
 }
 // Editorial titles, competence summaries, references and list labels do not change a task.
 const contract=p=>({id:p.id,host:p.host,screen:p.screen,instruction:p.instruction,difficulty:p.difficulty});
 const task=it=>({id:it.id,question:it.question});
 const ui=exportUI.properties.filter(p=>['picture','context','progress','completion'].includes(p.key.name||p.key.value));
 const tokens=[...Object.keys(FK.__visualData.tokens),...Object.keys(FK.__visualData.symbols),...Object.keys(FK.__visualData.aliases)];
 const pictureCases=new Set();walk(puzzle.bindings.get('picture'),node=>{if(node.type==='BinaryExpression')for(const side of ['left','right'])if(node[side]?.type==='Literal'&&typeof node[side].value==='string')pictureCases.add(node[side].value);});
 const rendering=hash(closure(visual,['art','resolve','lookup','source','decorateText','decorate','glyph'].map(n=>visual.bindings.get(n)),{special:{subjects:null,grid:null,sheets:null,tokens:null,aliases:null,cast:null,symbols:null}}));
 const controls=hash(closure(rounds,['rng','mix','current'].map(n=>rounds.bindings.get(n)),{special:{question:null}}));
 const selection=hash(closure(catalogue,['select','prepare','matchesSession'].map(n=>catalogue.bindings.get(n)),{special:{pools:null,meta:null}}));
 const shared=[hash(read('js/ui/gestures.js')),hash(read('js/ui/waldatelier-icons.js')),hash(read('js/ui/waldbuch.js')),hash(read('assets/forest-friends/puzzle-clearing.webp')),hash(read('fonts/andika-400.woff2')),hash(read('fonts/andika-700.woff2'))];
 const traceBody=moduleOf(read('js/screens/trace.js').toString()).body,dom=coreHelper('h'),textHelper=coreHelper('text');
 function scope(game,pool){
  const items=pool.map(it=>it.question),kinds=[...new Set(items.map(q=>q.kind))],refs=new Set(['forest-leaf','forest-flower']),portraits=new Set([game.host]);
  for(const q of items){
   for(const value of strings(q)){if(value.startsWith('scene:'))value.slice(6).split('+').forEach(x=>refs.add(x));else refs.add(value);}
   if(q.kind==='rhyme')for(const word of [q.text,...q.choices])refs.add(FK.puzzleRounds.wordArt[word]);
   if(q.kind==='colours')for(const [colour]of q.choices)refs.add('puzzle-flower-'+colour);
   if(q.kind==='trace')refs.add(FK.glyphs.data[q.glyph]?.emoji);
   if(q.kind==='nuts'&&q.count===0||q.kind==='trace'&&q.quantity?.count===0)refs.add('empty-basket');
  }
  const selectData=table=>Object.fromEntries([...refs].filter(id=>Object.hasOwn(table,id)).sort().map(id=>[id,table[id]]));
  const compile=()=>{
   // Cache only the finite inputs understood by normal(); question words and art tables are hashed separately.
   const unique=values=>[...new Set(values)].sort();
   const key=hash({trace:kinds.includes('trace'),quantity:unique(items.map(q=>!!q.quantity)),kinds:unique(kinds),items:unique(items.map(q=>q.item)),renderIds:unique(items.flatMap(q=>q.kind==='nuts'?[q.item||'forest-nut']:q.bugs||[])),positive:items.every(q=>Number.isInteger(q.kind==='nuts'?q.count:q.bugs?.length)&&(q.kind==='nuts'?q.count:q.bugs.length)>0),pictureCases:[...pictureCases].map(id=>refs.has(id))});
   if(!codeCache.has(key)){
    const options={kinds:kinds.includes('trace')?[]:kinds,items,pictureIds:[...refs],special:{aliases:null,labels:null}};
    const sharedCode=closure(puzzle,kinds.includes('trace')?[...ui,...effects]:[screen,...ui,...effects],options),code=kinds.includes('trace')?{shared:sharedCode,trace:normal(traceBody,{items})}:sharedCode,literals=[];
    let readsText=false;walk(code,node=>{if(node.type==='Literal'&&typeof node.value==='string')literals.push(node.value);if(node.type==='MemberExpression'&&node.object?.name==='FK'&&property(node)==='text')readsText=true;});
    const staticRefs=new Set();walk(code,node=>{if(node.type==='CallExpression'&&(node.callee?.name==='picture'||node.callee?.name==='objects'||property(node.callee)==='art'))strings(node.arguments?.[0],staticRefs);});
    codeCache.set(key,{digest:hash(code),literals,staticRefs:[...staticRefs],readsText});
   }return codeCache.get(key);
  };
  let code=compile();for(const value of code.staticRefs)refs.add(value);
  for(const value of [...refs,...code.literals].filter(x=>typeof x==='string'))for(const token of tokens)if(value.includes(token))refs.add(token);
  code=compile();
  for(const value of code.literals)if(value==='mailman'||ctx.window.FriendsContent.hosts[value])portraits.add(value);
  const pictures=[...refs].filter(x=>typeof x==='string').sort().flatMap(pictureResource),ids=[],portraitIndices={};
  for(const id of portraits){const portrait=FK.friendsArt.portrait(id),[x,y]=portrait.attrs.style.backgroundPosition.split(' ').map(parseFloat),index=Math.round(y*3/100)*4+Math.round(x*3/100);ids.push(index);portraitIndices[id]=index;}
  atlas('assets/forest-friends/character-portraits.webp',4,4);
  const classes=new Set([...states,game.screen==='trace'?'screen-trace':'screen-puzzle']);for(const value of code.literals)for(const name of value.match(/[a-z][a-z0-9]*(?:-[a-z0-9]+)*/g)||[])classes.add(name);
  const cssKey=game.id+':'+[...classes].sort().join(',');if(!cssCache.has(cssKey))cssCache.set(cssKey,css.map(([file,source])=>[file,cssFor(source,classes,game)]).filter(([,rules])=>rules.length));
  const selectedCSS=cssCache.get(cssKey);
  let progress='0% 0%';const progressCell=node=>{if(!Array.isArray(node))return;if(node[0]==='--wb-item')progress=node[1];else node.forEach(progressCell);};progressCell(selectedCSS);
  const [px,py]=progress.split(' ').map(parseFloat),index=Math.round(py*3/100)*4+Math.round(px*3/100),key='assets/waldatelier/forest-objects.webp';atlas(key,4,4);pictures.push({key,index,role:'progress'});
  const extra={dom};if(code.readsText)extra.text=textHelper;if(kinds.includes('robot'))extra.routes=hash(read('js/learn/routes.js'));if(kinds.includes('trace'))extra.glyphs=items.filter(q=>q.kind==='trace').map(q=>[q.glyph,FK.glyphs.data[q.glyph],FK.__reviewTraceFrame(q.glyph)]);
  if(kinds.includes('fireflies')){
   const legacyFirefly=moduleOf(read('js/friends/puzzles.js').toString()).bindings.get('firefly');
   if(legacyFirefly)extra.firefly=hash(normal(legacyFirefly));
  }
  const portraitCode={art:hash(closure(portraitModule,[portraitModule.bindings.get('portrait')],{special:{ids:portraitIndices}})),wrapper:hash(closure(libraryModule,[libraryModule.bindings.get('portrait')]))};
  return {definition:hash({puzzle:contract(C.puzzle(game.id)),items:pool.map(task)}),structure:hash({code:code.digest,tables:{aliases:selectData(FK.__pictureData.aliases),labels:selectData(FK.__pictureData.labels),...Object.fromEntries(Object.entries(FK.__visualData).map(([name,table])=>[name,selectData(table)]))},controls,selection,rendering,portraitCode,css:hash(selectedCSS),extra,wordArt:items.filter(q=>q.kind==='rhyme').map(q=>[q.text,...q.choices].map(w=>[w,FK.puzzleRounds.wordArt[w]])),shared}),pictures,portraitCells:ids.sort((a,b)=>a-b)};
 }
 const games=FK.friendsLibrary.catalogue();for(const game of games){const pool=C.iterations(game.id);all[game.id]=scope(game,pool);for(const it of pool)all[it.id]=scope(game,[it]);}
 const decoded=spawnSync(process.execPath,[path.join(__dirname,'puzzle-pixels.cjs')],{input:JSON.stringify([...atlases.values()]),encoding:'utf8',maxBuffer:8*1024*1024});
 if(decoded.status!==0)throw Error('Cannot fingerprint picture cells: '+(decoded.stderr||decoded.error));const pixels=JSON.parse(decoded.stdout),puzzles={},iterations={};
 for(const [id,data]of Object.entries(all)){
  const {definition,structure,pictures,portraitCells}=data,value={definition,presentation:hash({structure,pictures:pictures.map(({key,index,...rec})=>({...rec,pixels:pixels[key][index]})),portraits:portraitCells.map(i=>pixels['assets/forest-friends/character-portraits.webp'][i])})};
  (id.includes('/')?iterations:puzzles)[id]=value;
 }
 const result={schema:SCHEMA,puzzles,iterations};
 if(includeResources)result.resources=Object.fromEntries(games.map(game=>[game.id,[...new Set(all[game.id].pictures.flatMap(p=>p.subject?[p.subject]:Object.entries(FK.visual.subjects).filter(([,rec])=>FK.visual.source(rec.sheet)===p.key&&rec.index===p.index).map(([subject])=>subject)))].sort()]));
 return result;
}
const generatorFingerprint=()=>hash(fs.readFileSync(__filename));
module.exports={SCHEMA,build,currentReader,snapshotReader,generatorFingerprint};
if(require.main===module){
 const file=path.join(__dirname,'puzzle-review-baselines.json'),refs=process.argv.slice(2);if(!refs.length)throw Error('Pass the historical release commit IDs to record.');
 const restorations=JSON.parse(fs.readFileSync(file)).restorations||[];
 const restored=new Map();
 for(const rule of restorations){
  const bytes=snapshotReader(rule.commit).read(rule.path);if(hash(bytes)!==rule.toSha256)throw Error('Restored artwork does not match its recorded original: '+rule.path);
  restored.set(rule.path,bytes);
 }
 const releases=refs.map(ref=>{
  const source=snapshotReader(ref),env=environment({read:source.read,review:false});env.execute('js/friends/puzzle-implementation.js');
  const used=restorations.filter(rule=>hash(source.read(rule.path))===rule.fromSha256);
  // A user-requested, exact artwork rollback can retain its earlier decisions. No other source is substituted.
  for(const rule of used){
   const images=[{key:'before',columns:4,rows:4,bytes:source.read(rule.path).toString('base64')},{key:'restored',columns:4,rows:4,bytes:restored.get(rule.path).toString('base64')}];
   const checked=spawnSync(process.execPath,[path.join(__dirname,'puzzle-pixels.cjs')],{input:JSON.stringify(images),encoding:'utf8',maxBuffer:1024*1024});
   if(checked.status!==0)throw Error('Cannot verify artwork restoration cells.');const pixels=JSON.parse(checked.stdout);
   if(pixels.before.length!==16||pixels.before.some((cell,index)=>!rule.cells.includes(index)&&cell!==pixels.restored[index]))throw Error('Artwork restoration changes an unapproved cell: '+rule.path);
  }
  const reader={...source,read:name=>used.some(rule=>rule.path===name)?restored.get(name):source.read(name)};
  const built=build(reader),C=env.FK.puzzleCatalogue;
  return {commit:ref,...(used.length?{restoredInputs:used.map(rule=>rule.path)}:{}),puzzles:Object.fromEntries(Object.entries(built.puzzles).map(([id,value])=>[id,{...value,revision:C.puzzleRevision(id)}])),iterations:Object.fromEntries(Object.entries(built.iterations).map(([key,value])=>{const id=key.split('/')[0],item=C.iterations(id).find(it=>it.id===key);return [key,{...value,revision:C.iterationRevision(id,item)}];}))};
 });
 fs.writeFileSync(file,JSON.stringify({version:3,generatorSha256:generatorFingerprint(),restorations,releases},null,2)+'\n');console.log('Recorded verified review baselines for '+refs.length+' releases.');
}
