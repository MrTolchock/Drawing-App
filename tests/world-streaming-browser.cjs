/* The forest while Fuchs walks (real world, shadows on, fixed 60 fps steps): nothing appears, changes its detail or
   disappears at once where the camera sees it through little haze (tiles dissolve), there are no holes, the world's
   edge never shows, and trees on screen have their shadows (the shadow map counts as drawn whenever the forest asks). */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
const base=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await (await browser.newContext({viewport:{width:1080,height:810},serviceWorkers:'block'})).newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(300000);
  await page.goto(base+'/?dev=1');await page.waitForFunction(()=>!!window.FK?.friendsForest&&!!FK.friendsView,null,{timeout:180000});
  await page.getByRole('button',{name:'Brief öffnen',exact:true}).click();await page.getByRole('button',{name:'Zum Freund gehen',exact:true}).click();
  await page.waitForFunction(()=>FK.friendsView().area==='forest');
  await page.getByRole('button',{name:'Bildkarte',exact:true}).click();   // pauses the live loop: the test steps the forest itself
  const s=await page.evaluate(async()=>{
   const {THREE}=await import('./js/scene/materials.js'),{shadowReach}=await import('./js/friends/world/textures.js');
   const F=FK.friendsForest,W=F.world,scene=F.scene,camera=F.camera,r=window.__r,root=scene.getObjectByName('world'),sun=scene.children.find(o=>o.isDirectionalLight&&o.castShadow);
   F.weather(false);F.timeOfDay(.5,true);
   const v=new THREE.Vector3(),frustum=new THREE.Frustum(),m=new THREE.Matrix4(),smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b),cache=new Map();
   const pts=(i,j)=>{const k=i+','+j;if(!cache.has(k)){const out=[];for(let a=0;a<=4;a++)for(let b=0;b<=4;b++){const x=i*16+a*4,z=j*16+b*4,g=W.ground(x,z);out.push([x,g,z],[x,g+7,z]);}cache.set(k,out);}return cache.get(k);};
   const onScreen=(i,j,keep)=>{camera.updateMatrixWorld();m.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(m);const out=[];
    for(const [x,y,z]of pts(i,j)){v.set(x,y,z);if(!frustum.containsPoint(v))continue;const dist=v.distanceTo(camera.position),haze=smooth(scene.fog.near,scene.fog.far,-v.applyMatrix4(camera.matrixWorldInverse).z);if(keep(haze,dist))out.push([x,y,z]);}return out;};
   const clear=(i,j)=>onScreen(i,j,h=>h<.97).length>0,tiles=()=>{const out=new Map();for(const g of root.children){const t=/^tile (-?\d+),(-?\d+) (near|far)$/.exec(g.name);if(t&&g.visible)out.set(g,{k:t[1]+','+t[2],i:+t[1],j:+t[2],ring:t[3],fading:!!g.userData.fading});}return out;};
   const s={steps:0,pops:0,dissolves:0,holeFrames:0,shadowDraws:0,shadowMissing:0,edge:0};
   let prev=tiles(),drawn={tiles:new Set(),box:null};
   const route=[[23.2,-15.5],[51,-46.5],[42.5,-77],[-25,-50],[-8.5,57],[30,14]];F.teleport(2,-2);r.shadowMap.needsUpdate=true;let t=0;
   for(const [x,z]of route){F.walkTo(x,z);let guard=0;while(F.destination&&guard++<60*60){
    F.update(1/60,t+=1/60,{keys:new Set(),stick:{x:0,z:0}});s.steps++;const now=tiles();
    for(const [g,e]of now)if(!prev.has(g)&&clear(e.i,e.j)){if(e.fading)s.dissolves++;else s.pops++;}
    for(const [g,e]of prev)if(!now.has(g)&&!e.fading&&clear(e.i,e.j))s.pops++;
    if(F.budget().holes){const shown=new Set([...now.values()].map(e=>e.k));if(W.tiles().some(([i,j])=>!shown.has(i+','+j)&&Math.hypot((i+.5)*16-F.position.x,(j+.5)*16-F.position.z)<60&&clear(i,j)))s.holeFrames++;}
    if(r.shadowMap.needsUpdate){r.shadowMap.needsUpdate=false;s.shadowDraws++;sun.shadow.updateMatrices(sun);drawn={tiles:new Set([...now.values()].filter(e=>e.ring==='near').map(e=>e.k)),box:sun.shadow.matrix.clone()};}
    // trees on screen, close enough for full shadows, that are missing from the shadow map
    const reach=shadowReach?.value?.y||Infinity;let missing=false;
    for(const e of now.values()){if(e.ring!=='near'||e.fading)continue;const need=onScreen(e.i,e.j,(h,d)=>h<.75&&d<reach-2);if(!need.length)continue;
     if(!drawn.tiles.has(e.k)||need.some(([x,y,z])=>{v.set(x,y,z).applyMatrix4(drawn.box);return v.x<0||v.x>1||v.y<0||v.y>1;})){missing=true;break;}}
    if(missing)s.shadowMissing++;prev=now;}}
   // the end of the world: ground beyond the tiles is never on screen without haze
   for(const [x,z]of [[2,-2],[51,-46.5],[-57,51.5]]){F.teleport(x,z);F.update(1/60,t+=1/60,{keys:new Set(),stick:{x:0,z:0}});const shown=new Set([...tiles().values()].map(e=>e.k));for(const [i,j]of W.tiles())if(!shown.has(i+','+j)&&onScreen(i,j,h=>h<.9).length)s.edge++;}
   s.budget=F.budget();return s;
  });
  console.log(JSON.stringify(s));
  assert.equal(s.pops,0,'no tile appears, changes or disappears at once on screen');
  assert.ok(s.dissolves>10,'tiles dissolve in view');
  assert.equal(s.holeFrames,0,'no holes in the ground');
  assert.equal(s.edge,0,'the end of the world stays in the haze');
  assert.ok(s.shadowMissing/s.steps<.03,'trees on screen have their shadows ('+s.shadowMissing+' of '+s.steps+' frames)');
  assert.ok(s.shadowDraws/(s.steps/60)<2,'the shadow map is redrawn about once a second at most ('+s.shadowDraws+' draws)');
  assert.ok(s.budget.liveTiles<=25&&s.budget.farTiles<=60,JSON.stringify(s.budget));
  assert.deepEqual(errors,[]);console.log('PASS dissolving tiles, no holes or world edge on screen, shadows with the trees, within the tile budget');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
