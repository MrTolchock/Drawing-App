const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const load=file=>import(pathToFileURL(path.join(__dirname,'..',file)).href);
let world;
async function swampWorld(){return world||=(await load('js/friends/world/big/index.js')).createBigWorld();}
function inspectRoute(W,start,end){
 const route=W.plan(...start,...end);assert.ok(route,'a route exists');assert.deepEqual(route.at(-1),end);
 let previous=start,bogSamples=0;
 for(const next of route){
  const count=Math.max(1,Math.ceil(Math.hypot(next[0]-previous[0],next[1]-previous[1])/.1));
  for(let i=1;i<=count;i++){
   const x=previous[0]+(next[0]-previous[0])*i/count,z=previous[1]+(next[1]-previous[1])*i/count;
   assert.ok(W.walkable(x,z),'route stays on walkable ground at '+[x,z]);
   if(W.terrain.swampMask(x,z)>.3){assert.equal(W.terrain.onCrossing(x,z)?.c.kind,'planks','the bog route stays on the wooden Steg');bogSamples++;}
  }
  previous=next;
 }
 assert.ok(bogSamples>100,'the route crosses the bog');return route;
}
test('the soft bog is blocked even on dry hummocks, while the boardwalk stays continuous',async()=>{
 const W=await swampWorld(),T=W.terrain;
 for(const [x,z] of [[-35,85],[-29.5,83.5],[-31.5,68.5]]){
  assert.ok(T.swampMask(x,z)>.3);assert.ok(!T.wet(x,z),'this was previously walkable dry-looking bog');assert.equal(W.walkable(x,z),false);
 }
 let checked=0;
 for(let x=-50;x<=15;x++)for(let z=55;z<=106;z++)if(T.swampMask(x,z)>.3&&!T.onCrossing(x,z)){assert.equal(W.walkable(x,z),false);checked++;}
 assert.ok(checked>1500,'check the whole bog, not just three examples');
 const planks=T.crossings.filter(c=>c.kind==='planks');assert.equal(planks.length,5);
 const entrance=planks[0].a;assert.ok(T.swampMask(...entrance)<.1,'the deck starts on firm ground');
 for(const c of planks)for(let i=0;i<=100;i++){const x=c.a[0]+(c.b[0]-c.a[0])*i/100,z=c.a[1]+(c.b[1]-c.a[1])*i/100;assert.equal(W.walkable(x,z),true,'every board and shared joint remains reachable');}
});
test('all named destinations can reach Frosch and return using the Steg, without bog shortcuts',async()=>{
 const W=await swampWorld(),frog=W.places.frog,end=[frog.x,frog.z];
 for(const [id,p]of Object.entries(W.places))if(id!=='frog'){
  const route=inspectRoute(W,[p.x,p.z],end);
  for(const c of W.terrain.crossings.filter(c=>c.kind==='planks').slice(0,-1))assert.ok(route.some(([x,z])=>Math.hypot(x-c.b[0],z-c.b[1])<1e-6),id+' visits every Steg corner');
  inspectRoute(W,end,[p.x,p.z]);
 }
});
test('a route starting and ending inside one narrow plank remains on that plank',async()=>{
 const W=await swampWorld(),c=W.terrain.crossings.find(c=>c.kind==='planks'),at=t=>[c.a[0]+(c.b[0]-c.a[0])*t,c.a[1]+(c.b[1]-c.a[1])*t];
 assert.deepEqual(W.plan(...at(.35),...at(.65)).at(-1),at(.65));
});
test('allowing connected deck diagonals does not allow ordinary blocked corners to be cut',async()=>{
 const {createNav}=await load('js/friends/world/big/nav.js');
 const nav=createNav({extent:{x0:0,x1:4,z0:0,z1:4},crossings:[],walkable:(x,z)=>Math.floor(x)===1&&Math.floor(z)===1||Math.floor(x)===2&&Math.floor(z)===2});
 assert.equal(nav.plan(1.5,1.5,2.5,2.5),null);
});
