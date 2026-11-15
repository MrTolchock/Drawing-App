/* Review fingerprints follow the code, CSS and picture cells actually used by each puzzle. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const acorn=require('acorn'),postcss=require('postcss'),selectors=require('postcss-selector-parser'),{environment}=require('./puzzle-environment.cjs');
const root=path.resolve(__dirname,'..'),SCHEMA=crypto.createHash('sha256').update('waldpost-per-puzzle-review-v1').digest('hex');
const hash=value=>crypto.createHash('sha256').update(typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value)).digest('hex');
const walk=(node,visit,parent,key)=>{if(!node||typeof node!=='object')return;visit(node,parent,key);for(const [k,v]of Object.entries(node))if(v&&typeof v==='object')Array.isArray(v)?v.forEach(n=>walk(n,visit,node,k)):walk(v,visit,node,k);};
function moduleOf(source){
 const ast=acorn.parse(source,{ecmaVersion:'latest'}),body=ast.body.find(n=>n.type==='ExpressionStatement'&&n.expression.type==='CallExpression')?.expression.callee.body?.body;
 if(!body)throw Error('Expected a reviewed IIFE module.');
 const bindings=new Map();for(const node of body){if(node.type==='FunctionDeclaration')bindings.set(node.id.name,node);if(node.type==='VariableDeclaration')for(const d of node.declarations)if(d.id.type==='Identifier')bindings.set(d.id.name,d);}
 return {body,bindings};
}
const property=node=>node?.computed?node.property?.value:node?.property?.name;
function normal(node,{kinds=[],special={},items=[]}={},owner=''){
 if(!node||typeof node!=='object')return node;
 if(Array.isArray(node))return node.map(x=>normal(x,{kinds,special,items},owner));
 if(['VariableDeclarator','FunctionDeclaration'].includes(node.type)&&Object.hasOwn(special,node.id.name))return {type:'SelectedData',name:node.id.name,value:special[node.id.name]};
 if(node.type==='FunctionDeclaration')owner=node.id.name;
 const values=n=>{
  if(n?.type==='Literal')return [n.value];
  if(n?.type==='MemberExpression'&&['q','question'].includes(n.object?.name)&&['kind','item'].includes(property(n)))return [...new Set(items.map(q=>q[property(n)]))];
  if(n?.type==='Identifier'&&n.name==='id'&&owner==='renderCount')return [...new Set(items.flatMap(q=>q.kind==='nuts'?[q.item||'forest-nut']:q.bugs||[]))];
  return null;
 };
 const truth=n=>{
  if(n?.type==='BinaryExpression'&&['===','!==','==','!='].includes(n.operator)){
   const a=values(n.left),b=values(n.right);if(!a?.length||!b?.length)return;
   const out=new Set(a.flatMap(x=>b.map(y=>n.operator.includes('!')?x!==y:x===y)));if(out.size===1)return [...out][0];
  }
  if(n?.type==='LogicalExpression'){const a=truth(n.left);if(n.operator==='&&'&&a===false||n.operator==='||'&&a===true)return a;if(a!==undefined)return truth(n.right);}
 };
 if(['ConditionalExpression','IfStatement'].includes(node.type)){
  const value=truth(node.test);if(value!==undefined)return normal(value?node.consequent:node.alternate,{kinds,special,items},owner)||{type:'EmptyStatement'};
 }
 const out={};for(const [key,value]of Object.entries(node)){
  if(['start','end','loc','raw'].includes(key))continue;
  if(node.type==='VariableDeclarator'&&node.id.name==='renderers'&&key==='init'){
   if(value.type!=='ObjectExpression')throw Error('Renderer dispatch must remain an explicit object.');
   const properties=value.properties.filter(p=>kinds.includes(p.key.name||p.key.value));
   if(properties.length!==kinds.length)throw Error('A puzzle kind has no declared renderer.');
   out[key]=normal({...value,properties},{kinds,special,items},owner);
  }else out[key]=normal(value,{kinds,special,items},owner);
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
 const selected=selector=>selectors().astSync(selector).nodes.some(possible),animations=new Set(),ast=postcss.parse(source);
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
function build(reader=currentReader()){
 const {read}=reader,env=environment({read,review:false}),{FK,ctx}=env,C=FK.puzzleCatalogue;
 FK.STICKERS=[];FK.screen=()=>{};FK.on=()=>()=>{};FK.h=(tag,attrs,...children)=>({tag,attrs,children,classList:{add(){}}});
 ctx.MutationObserver=class{observe(){}};ctx.document={body:{}};
 capture(env,'js/ui/waldatelier.js','FK.__resolvePicture=resolve;FK.__visualData={tokens,aliases,cast,symbols};');
 capture(env,'js/screens/puzzle.js','FK.__pictureData={aliases,labels};');env.execute('js/friends/interface.js');
 const puzzle=moduleOf(read('js/screens/puzzle.js').toString()),rounds=moduleOf(read('js/friends/puzzle-rounds.js').toString()),catalogue=moduleOf(read('js/friends/puzzle-catalogue.js').toString()),visual=moduleOf(read('js/ui/waldatelier.js').toString());
 const screen=puzzle.body.find(n=>n.type==='ExpressionStatement'&&n.expression.callee?.object?.name==='FK'&&property(n.expression.callee)==='screen');
 const exportUI=puzzle.body.find(n=>n.type==='ExpressionStatement'&&n.expression.type==='AssignmentExpression'&&property(n.expression.left)==='puzzleUI').expression.right;
 const css=reader.css().map(file=>[file,read(file).toString()]),states=['friends-interface','screen','topbar','title','btn-back','forest-portrait','ff-map-friend','ff-character-portrait','wa-illustration','wa-symbol','ic','sr-only','scroll','done','current','marked','filled','gap','active'];
 const portraitModule=moduleOf(read('js/friends/interface.js').toString()),libraryModule=moduleOf(read('js/friends/library.js').toString());
 const effects=puzzle.body.filter(n=>!['FunctionDeclaration','VariableDeclaration'].includes(n.type)&&!(n.type==='ExpressionStatement'&&(n.expression.type==='Literal'||n===screen||n.expression.type==='AssignmentExpression'&&property(n.expression.left)==='puzzleUI'||n.expression.type==='CallExpression'&&n.expression.callee?.object?.name==='Object'&&property(n.expression.callee)==='assign'&&n.expression.arguments[0]?.name==='labels')));
 const all={},atlases=new Map();
 function pictureResource(id){
  const resolved=FK.__resolvePicture(FK.__pictureData.aliases[id]||id);if(!resolved)return null;
  const candidates=new Set([resolved,FK.puzzles.pictures[resolved]].filter(Boolean)),result=[];
  for(const subject of candidates){const rec=FK.visual.subjects[subject];if(!rec)continue;const key=FK.visual.source(rec.sheet);atlases.set(key,{key,columns:rec.columns,rows:rec.rows,bytes:read(key).toString('base64')});result.push({subject,...rec,key});}
  return result;
 }
 for(const game of FK.friendsLibrary.catalogue()){
  const items=C.iterations(game.id).map(i=>i.question),kinds=[...new Set(items.map(q=>q.kind))],refs=new Set(['forest-leaf','forest-flower']),portraits=new Set([game.host]);
  for(const q of items){
   for(const value of strings(q)){if(value.startsWith('scene:'))value.slice(6).split('+').forEach(x=>refs.add(x));else refs.add(value);}
   if(q.kind==='rhyme')for(const word of [q.text,...q.choices])refs.add(FK.puzzleRounds.wordArt[word]);
   if(q.kind==='colours')for(const [colour]of q.choices)refs.add('puzzle-flower-'+colour);
   if(q.kind==='trace')refs.add(FK.glyphs.data[q.glyph]?.emoji);
  }
  // Keep data tables out of code hashes: only the labels/aliases and image cells used by this puzzle count.
  const selectData=table=>Object.fromEntries([...refs].filter(id=>Object.hasOwn(table,id)).sort().map(id=>[id,table[id]]));
  const ui=exportUI.properties.filter(p=>['picture','context','progress','completion'].includes(p.key.name||p.key.value));
  const codeFor=()=>kinds.includes('trace')?{shared:closure(puzzle,[...ui,...effects],{kinds:[],items,special:{aliases:selectData(FK.__pictureData.aliases),labels:selectData(FK.__pictureData.labels)}}),trace:normal(moduleOf(read('js/screens/trace.js').toString()).body)}:closure(puzzle,[screen,...ui,...effects],{kinds,items,special:{aliases:selectData(FK.__pictureData.aliases),labels:selectData(FK.__pictureData.labels)}});
  let code=codeFor();
  const literals=[];walk(code,node=>{if(node.type==='Literal'&&typeof node.value==='string')literals.push(node.value);});
  walk(code,node=>{
   if(node.type==='CallExpression'&&(node.callee?.name==='picture'||node.callee?.name==='objects'||['art'].includes(property(node.callee))))strings(node.arguments?.[0]).forEach(value=>refs.add(value));
  });
  for(const text of [...refs,...literals].filter(x=>typeof x==='string'))for(const token of [...Object.keys(FK.__visualData.tokens),...Object.keys(FK.__visualData.symbols),...Object.keys(FK.__visualData.aliases)])if(text.includes(token))refs.add(token);
  code=codeFor();
  for(const value of literals)if(FK.friendsContent?.hosts?.[value]||ctx.window.FriendsContent.hosts[value])portraits.add(value);
  const pictures=[...refs].filter(x=>typeof x==='string').sort().flatMap(id=>pictureResource(id)||[]);
  const ids=[],portraitIndices={};for(const id of portraits){const portrait=FK.friendsArt.portrait(id),[x,y]=portrait.attrs.style.backgroundPosition.split(' ').map(parseFloat),index=Math.round(y*3/100)*4+Math.round(x*3/100);ids.push(index);portraitIndices[id]=index;}
  const portraitKey='assets/forest-friends/character-portraits.webp';atlases.set(portraitKey,{key:portraitKey,columns:4,rows:4,bytes:read(portraitKey).toString('base64')});
  const classes=new Set([...states,game.screen==='trace'?'screen-trace':'screen-puzzle']);for(const value of literals)for(const name of value.match(/[a-z][a-z0-9]*(?:-[a-z0-9]+)*/g)||[])classes.add(name);
  const selectedCSS=css.map(([file,text])=>[file,cssFor(text,classes,game)]).filter(([,rules])=>rules.length);
  // Progress/celebration also select an atlas cell through the host CSS variable.
  let progress='0% 0%';walk(selectedCSS,node=>{if(Array.isArray(node)&&node[0]==='--wb-item')progress=node[1];});
  const [px,py]=progress.split(' ').map(parseFloat),progressIndex=Math.round(py*3/100)*4+Math.round(px*3/100),progressKey='assets/waldatelier/forest-objects.webp';
  atlases.set(progressKey,{key:progressKey,columns:4,rows:4,bytes:read(progressKey).toString('base64')});pictures.push({key:progressKey,index:progressIndex,role:'progress'});
  const extra={};if(kinds.includes('robot'))extra.routes=hash(read('js/learn/routes.js'));if(kinds.includes('trace'))extra.glyphs=hash(read('js/learn/glyphs.js'));if(kinds.includes('fireflies'))extra.firefly=normal(moduleOf(read('js/friends/puzzles.js').toString()).bindings.get('firefly'));
  const rendering=closure(visual,['art','resolve','lookup','source','decorateText','decorate','glyph'].map(n=>visual.bindings.get(n)),{special:{subjects:null,grid:null,sheets:null,...Object.fromEntries(Object.entries(FK.__visualData).map(([name,table])=>[name,selectData(table)]))}});
  const controls=closure(rounds,['rng','mix','current'].map(n=>rounds.bindings.get(n)),{special:{question:null}}),selection=closure(catalogue,['select','prepare','matchesSession'].map(n=>catalogue.bindings.get(n)),{special:{pools:null,meta:null}});
  const portraitCode={art:closure(portraitModule,[portraitModule.bindings.get('portrait')],{special:{ids:portraitIndices}}),wrapper:closure(libraryModule,[libraryModule.bindings.get('portrait')])};
  all[game.id]={definition:hash({puzzle:C.puzzle(game.id),items:C.iterations(game.id)}),code,controls,selection,rendering,portraitCode,css:selectedCSS,extra,pictures,portraitCells:ids.sort((a,b)=>a-b),wordArt:items.filter(q=>q.kind==='rhyme').map(q=>[q.text,...q.choices].map(w=>[w,FK.puzzleRounds.wordArt[w]])),shared:[hash(read('js/ui/gestures.js')),hash(read('js/ui/waldatelier-icons.js')),hash(read('js/ui/waldbuch.js')),hash(read('assets/forest-friends/puzzle-clearing.webp')),hash(read('fonts/andika-400.woff2')),hash(read('fonts/andika-700.woff2'))]};
 }
 const decoded=spawnSync(process.execPath,[path.join(__dirname,'puzzle-pixels.cjs')],{input:JSON.stringify([...atlases.values()]),encoding:'utf8',maxBuffer:8*1024*1024});
 if(decoded.status!==0)throw Error('Cannot fingerprint picture cells: '+(decoded.stderr||decoded.error));const pixels=JSON.parse(decoded.stdout),puzzles={};
 for(const [id,data]of Object.entries(all)){
  const {definition,pictures,portraitCells,...rest}=data;
  puzzles[id]={definition,presentation:hash({...rest,pictures:pictures.map(({key,index,...rec})=>({...rec,pixels:pixels[key][index]})),portraits:portraitCells.map(i=>pixels['assets/forest-friends/character-portraits.webp'][i])})};
 }
 return {schema:SCHEMA,puzzles};
}
module.exports={SCHEMA,build,currentReader,snapshotReader};
if(require.main===module){
 const file=path.join(__dirname,'puzzle-review-baselines.json'),refs=process.argv.slice(2);if(!refs.length)throw Error('Pass the historical release commit IDs to record.');
 const releases=refs.map(ref=>{const reader=snapshotReader(ref),implementation=reader.read('js/friends/puzzle-implementation.js').toString().match(/puzzleImplementation\s*=\s*'([^']+)'/)[1];return {commit:ref,implementation,puzzles:build(reader).puzzles};});
 fs.writeFileSync(file,JSON.stringify({version:1,releases},null,2)+'\n');console.log('Recorded verified review baselines for '+refs.length+' releases.');
}
