const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('js/forest/navigation.js','utf8');
const navigation=import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
function boot(storage=new Map()){
  const FK={},context={window:{FK},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};
  for(const file of ['js/learn/learning.js','js/learn/expeditions.js','js/learn/adventures.js','js/learn/routes.js','js/forest/story.js','js/forest/model.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
  return {model:FK.forestState,storage,FK};
}
function repaired(greeted=false,stories=false){const b=boot(),state=b.model.get();state.bridgeRepaired=true;state.greetingSeen=greeted;state.contributions[b.model.QUEST]=true;if(stories)state.contributions[b.model.STORIES]=true;b.storage.set(b.model.KEY,JSON.stringify(state));return boot(b.storage);}
function length(from,path){let total=0;for(const p of path){total+=Math.hypot(p.x-from.x,p.z-from.z);from=p;}return total;}
test('free steering leaves the old rails and never teleports onto one',async()=>{
  const {createNavigation}=await navigation,{model}=boot(),nav=createNavigation(model);
  const p=nav.move(model.nodes.home,1.25,-.7);
  assert.ok(Math.abs(p.x+6.75)<1e-10&&Math.abs(p.z-7.3)<1e-10);
  assert.ok(model.distance(p,model.snap(p))>.2);
  assert.ok(model.distance(p,model.nodes.home)<1.5);
});
test('a low frame rate cannot tunnel through trunks, river water or the world edge',async()=>{
  const {createNavigation,WORLD}=await navigation,{model}=boot(),nav=createNavigation(model,[{x:-12,z:0,radius:1}]);
  const trunk=nav.move({x:-15,z:0},8,0);assert.ok(trunk.x<-13.3);assert.ok(nav.walkable(trunk));
  const river=nav.move({x:-6,z:-7},12,0);assert.ok(river.x<model.riverX(-7)-model.riverHalfWidth(-7));
  const edge=nav.move({x:-30,z:5},-100,0);assert.ok(edge.x>WORLD.minX);assert.ok(nav.walkable(edge));
});
test('tapping water stays on the same bank; every detour segment remains safe',async()=>{
  const {createNavigation}=await navigation,{model}=boot(),nav=createNavigation(model,[{x:-10,z:-5,radius:1}]);
  const water={x:model.riverX(-7),z:-7};
  for(const from of [model.nodes.beaver,model.nodes.hare]){
    const path=nav.route(from,water);assert.ok(path.length);assert.equal(Math.sign(path.at(-1).x-model.riverX(path.at(-1).z)),Math.sign(from.x-model.riverX(from.z)));
    let previous=from;for(const p of path){assert.ok(nav.clearLine(previous,p));previous=p;}
  }
  assert.deepEqual(nav.route({x:NaN,z:2},water),[]);
});
test('the broken bridge requires a real ford detour and its repair opens the span',async()=>{
  const {createNavigation}=await navigation,before=boot().model,after=repaired().model;
  const a=createNavigation(before),b=createNavigation(after),start=before.nodes.beaver,end=before.nodes.hare;
  const old=a.route(start,end),short=b.route(start,end);assert.ok(old.length&&short.length);
  assert.ok(old.some(p=>Math.abs(p.z-12)<1.2));assert.ok(length(start,short)<length(start,old)/2);
  assert.ok(!a.walkable({x:.6,z:-7}));assert.ok(b.walkable({x:.6,z:-7}));
});
test('all six discoveries and five friends have safe free routes from the Heart Tree',async()=>{
  const {createNavigation,PLACES}=await navigation,{model}=repaired(true),nav=createNavigation(model,[{x:-8,z:2.2,radius:1.05},{x:14,z:17,radius:.6}]);
  for(const target of [...PLACES,...Object.keys(model.residents).map(id=>model.nodes[id])]){
    const path=nav.route(model.nodes.home,target);assert.ok(path.length,target.id||JSON.stringify(target));assert.ok(model.distance(path.at(-1),target)<.001);
    let previous=model.nodes.home;for(const p of path){assert.ok(nav.clearLine(previous,p),target.id);previous=p;}
  }
});
test('the later story bridge and north crossing respect the existing chapter gates',async()=>{
  const {createNavigation}=await navigation,a=createNavigation(boot().model),b=createNavigation(repaired(true).model),c=createNavigation(repaired(true,true).model);
  assert.equal(a.walkable({x:0,z:29}),false);assert.equal(b.walkable({x:0,z:29}),true);
  const middle={x:0,z:24.26923076923077};assert.equal(b.walkable(middle),false);assert.equal(c.walkable(middle),true);
});
test('hills have genuine elevation and exact off-path coordinates survive saving and reloading',async()=>{
  const {terrainHeight}=await navigation,{model,storage}=boot();assert.ok(terrainHeight(-29,-8)>4);assert.ok(terrainHeight(29,32)>5);assert.equal(terrainHeight(-8,8),0);
  const position={x:29.125,z:41.325};model.position(position);const loaded=boot(storage).model.get();assert.equal(loaded.position.x,position.x);assert.equal(loaded.position.z,position.z);
  assert.equal(loaded.bridgeRepaired,false);assert.deepEqual(JSON.parse(JSON.stringify(loaded.contributions)),{});
});
test('the complete richer world ships in the offline cache',()=>{
  const sw=fs.readFileSync('sw.js','utf8');for(const file of ['js/forest/navigation.js','js/forest/woodland.js','js/forest/exploration.js','css/forest-exploration.css'])assert.ok(sw.includes("'./"+file+"'"),file);
});
