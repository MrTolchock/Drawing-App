/* Real free walking, held touch input, discoverable 3D places, wind and offline saves. */
const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const {seedSeenStoryScenes}=require('./cinema-support.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const errors=[],external=[],shots=process.env.FARBTUPF_SHOTS||'/tmp/farbtupf-world';fs.mkdirSync(shots,{recursive:true});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(seedSeenStoryScenes);
    await context.addInitScript(()=>{
      if(localStorage.getItem('world-browser-seeded'))return;
      localStorage.setItem('farbtupf.forest.v1',JSON.stringify({version:1,welcomed:true,position:{x:-8,z:8}}));
      localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false,'learning.stage':3}));
      localStorage.setItem('farbklecks.progress.v1',JSON.stringify({stars:7,done:{'learn:pattern:1':1}}));
      localStorage.setItem('world-browser-seeded','yes');
    });
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});page.on('request',r=>{if(!r.url().startsWith(BASE)&&!r.url().startsWith('data:'))external.push(r.url());});
    async function ready(){await page.waitForFunction(()=>!!window.FK?.forestScene&&FK.current()==='forest',null,{timeout:120000});await page.evaluate(()=>{const r=FK.forestScene;r.renderer.setPixelRatio(.5);r.renderer.shadowMap.enabled=false;r.renderer.render(r.scene,r.camera);});}
    const position=()=>page.evaluate(()=>FK.forestScene.position);
    const shot=name=>page.screenshot({path:shots+'/'+name+'.png'});
    async function frames(count=3){await page.evaluate(n=>new Promise(resolve=>{function tick(){if(--n<=0)resolve();else requestAnimationFrame(tick);}requestAnimationFrame(tick);}),count);}
    async function controlsFit(){
      const boxes=await page.locator('.forest-header nav button,.forest-stick,.forest-goal').evaluateAll(list=>list.map(e=>{const r=e.getBoundingClientRect();return{name:e.getAttribute('aria-label'),header:!!e.closest('.forest-header'),x:r.x,y:r.y,w:r.width,h:r.height};}));
      for(const r of boxes){assert.ok(r.w>=44&&r.h>=44,JSON.stringify(r));assert.ok(r.x>=0&&r.y>=0&&r.x+r.w<=page.viewportSize().width+1&&r.y+r.h<=page.viewportSize().height+1,JSON.stringify(r));}
      const headers=boxes.filter(r=>r.header);for(let i=0;i<headers.length;i++)for(let j=i+1;j<headers.length;j++){const a=headers[i],b=headers[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'header controls overlap');}
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    await page.goto(BASE+'/?screen=forest');await ready();await frames();
    await page.evaluate(async()=>FK.store.put('exploration-kept-drawing',{kept:8}));
    const world=await page.evaluate(()=>{
      const r=FK.forestScene,fox=r.scene.getObjectByName('fox');let meshes=0,sprites=0;fox.traverse(o=>{if(o.isMesh)meshes++;if(o.isSprite)sprites++;});
      const vertices=r.scene.getObjectByName('woodland-terrain').geometry.attributes.position;let highest=-Infinity;for(let i=0;i<vertices.count;i++)highest=Math.max(highest,vertices.getY(i));
      return {perspective:r.camera.isPerspectiveCamera,meshes,sprites,highest,trees:r.scene.getObjectsByProperty('name','volumetric-canopy').length,places:r.places.length,blockedPlaces:r.places.filter(p=>!r.navigation.walkable(p)).map(p=>p.id)};
    });
    assert.ok(world.perspective&&world.meshes>20&&world.highest>5&&world.trees>=25);assert.equal(world.sprites,0);assert.equal(world.places,6);assert.deepEqual(world.blockedPlaces,[]);await controlsFit();await shot('05-free-world-phone');
    // Physical arrow keys can cross the clearing, rather than snapping to a route.
    const first=await position();await page.keyboard.down('ArrowRight');await page.waitForFunction(p=>Math.hypot(FK.forestScene.position.x-p.x,FK.forestScene.position.z-p.z)>2,first,{timeout:30000});await page.keyboard.up('ArrowRight');await frames();
    assert.ok(await page.evaluate(()=>FK.forestState.distance(FK.forestScene.position,FK.forestState.snap(FK.forestScene.position))>.6));
    assert.ok(await page.evaluate(()=>FK.forestScene.navigation.walkable(FK.forestScene.position)));
    // An actual held touch steers continuously; touch cancellation releases it.
    const cdp=await context.newCDPSession(page),box=await page.locator('.forest-stick').boundingBox(),beforeTouch=await position();
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.18,y:box.y+box.height*.5,id:1}]});
    await page.waitForFunction(p=>Math.hypot(FK.forestScene.position.x-p.x,FK.forestScene.position.z-p.z)>1.5,beforeTouch,{timeout:30000});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await frames();const released=await position();await frames(8);assert.deepEqual(await position(),released);
    assert.ok(!await page.locator('.forest-stick').evaluate(e=>e.classList.contains('is-held')));
    console.log('PASS: solid 3D world, closer portrait camera, off-path keyboard walking, held touch steering and cancellation.');
    // The safe route goes through the old ford until the authored bridge is repaired.
    const safe=await page.evaluate(()=>{const r=FK.forestScene,m=FK.forestState,path=r.navigation.route(m.nodes.beaver,m.nodes.hare);return{ford:path.some(p=>Math.abs(p.z-12)<1.2),gap:r.navigation.walkable({x:.6,z:-7}),allSafe:path.every((p,i)=>r.navigation.clearLine(i?path[i-1]:m.nodes.beaver,p))};});
    assert.ok(safe.ford&&safe.allSafe);assert.equal(safe.gap,false);
    await page.getByRole('button',{name:'Waldkarte öffnen',exact:true}).tap();await page.locator('.forest-map').waitFor();
    assert.equal(await page.locator('.forest-map-place').count(),6);assert.equal(await page.locator('.forest-map-friend').count(),2);await shot('06-picture-map-phone');
    const frame=await page.evaluate(()=>FK.forestScene.renderer.info.render.frame);await frames(10);assert.ok((await page.evaluate(()=>FK.forestScene.renderer.info.render.frame))-frame<=1,'a covered map does not keep drawing the world');
    await page.keyboard.press('Escape');await page.locator('.forest-map').waitFor({state:'detached'});
    // Walk to every discovery through the real, obstacle-filled scene.
    const places=await page.evaluate(()=>FK.forestScene.places);
    for(const place of places){
      await page.getByRole('button',{name:'Waldkarte öffnen',exact:true}).tap();await page.getByRole('button',{name:place.name+' entdecken',exact:true}).tap();
      await page.waitForFunction(p=>Math.hypot(FK.forestScene.position.x-p.x,FK.forestScene.position.z-p.z)<.6,place,{timeout:120000});
      await page.locator('.forest-nature-card').waitFor();await frames();
      assert.equal(await page.locator('.forest-nature-card b').textContent(),place.name);
      assert.equal(await page.evaluate(()=>FK.heartTree.count()),0);assert.equal(await page.evaluate(()=>FK.progress.stars()),7);
      if(place.id==='lookout')assert.ok(await page.evaluate(()=>FK.forestScene.scene.getObjectByName('fox').position.y)>4.5);
      await shot('discovery-'+place.id);await page.getByRole('button',{name:'Weiter erkunden',exact:true}).tap();
      const reached=await position();await page.locator('.forest-wayfinder').tap();await page.locator('.forest-nature-card').waitFor();
      assert.equal(await page.locator('.forest-nature-card b').textContent(),place.name);assert.deepEqual(await position(),reached);
      await page.getByRole('button',{name:'Weiter erkunden',exact:true}).tap();
      console.log('PASS: safely walked to '+place.name+'; discovery preserves story growth and stars.');
    }
    // Real canopy and Heart Tree geometry moves with wind, then stops for reduced motion.
    const sample=()=>page.evaluate(()=>{const s=FK.forestScene.scene,canopy=s.getObjectsByProperty('name','volumetric-canopy')[0],trunk=s.getObjectByName('heart-tree').children.find(o=>o.geometry?.type==='TubeGeometry');return{canopy:canopy.parent.parent.rotation.z,trunk:trunk.rotation.z};});
    await page.evaluate(()=>{FK.reduced=false;});await frames(4);const windA=await sample();await frames(15);const windB=await sample();assert.ok(Math.abs(windB.canopy-windA.canopy)>1e-5&&Math.abs(windB.trunk-windA.trunk)>1e-5);
    await page.evaluate(()=>{FK.reduced=true;});await frames(5);const still=await sample();await frames(5);assert.deepEqual(await sample(),still);
    const oldCamera=await page.evaluate(()=>FK.forestScene.camera.position.toArray());await page.getByRole('button',{name:'Blick nach rechts drehen',exact:true}).tap();await frames(15);const newCamera=await page.evaluate(()=>FK.forestScene.camera.position.toArray());assert.ok(Math.hypot(newCamera[0]-oldCamera[0],newCamera[2]-oldCamera[2])>1);
    console.log('PASS: actual wind in tree geometry, reduced motion and rotatable RPG camera.');
    for(const [width,height]of [[320,568],[390,844],[844,390],[820,1180]]){
      await page.setViewportSize({width,height});await frames(8);await controlsFit();
      await page.getByRole('button',{name:'Waldkarte öffnen',exact:true}).tap();const r=await page.locator('.forest-map').boundingBox();assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=width+1&&r.y+r.height<=height+1);
      await page.getByRole('button',{name:'Karte schliessen',exact:true}).tap();await shot('layout-'+width+'x'+height);
    }
    // Preserve the exact new off-rail position and all discoveries after offline reload.
    await page.evaluate(()=>FK.forestScene.stop());const savedPosition=await position();const originalState=await page.evaluate(()=>FK.forestState.get());
    await page.waitForFunction(async()=>{if(!navigator.serviceWorker.controller)return false;const cache=await caches.open('farbtupf-v7.3.0-forest-friends-painted');return !!await cache.match('./js/forest/woodland.js');},null,{timeout:60000});
    await context.setOffline(true);await page.reload();await ready();await frames();assert.deepEqual(await position(),savedPosition);
    assert.deepEqual(await page.evaluate(()=>FK.forestState.get().contributions),originalState.contributions);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('farbtupf.exploration.v1')).length),6);
    assert.deepEqual(await page.evaluate(()=>FK.store.get('exploration-kept-drawing')),{kept:8});assert.equal(await page.evaluate(()=>FK.settings.get('learning.stage')),3);
    await page.getByRole('button',{name:'Waldkarte öffnen',exact:true}).tap();assert.equal(await page.locator('.forest-map-place.is-found').count(),6);await page.getByRole('button',{name:'Biber auf der Karte besuchen',exact:true}).tap();
    await page.locator('.forest-dialog-beaver').waitFor({timeout:120000});assert.equal(await page.evaluate(()=>FK.forestState.get().bridgeRepaired),false);
    assert.equal(await page.locator('.forest-stick').isVisible(),false);assert.equal(await page.locator('.forest-wayfinder').isVisible(),false);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    console.log('PASS: four touch layouts, picture navigation to Beaver, exact offline free position, discoveries, drawings and earlier progress.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
