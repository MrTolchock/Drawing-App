const BASE_URL=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
/* Actual films, geometry, gestures, a played bridge quest, saved ending and offline. */
const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  let page;
  const errors=[];
  try{
    const shots=process.env.FARBTUPF_SHOTS||'/tmp/farbtupf-cinema';fs.mkdirSync(shots,{recursive:true});
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>{if(!localStorage.getItem('cinema-initialized')){localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false,'learning.stage':3}));localStorage.setItem('cinema-initialized','yes');}});
    page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    async function ready(){
      await page.waitForFunction(()=>!!window.FK?.forestScene&&FK.current()==='forest',null,{timeout:90000});
      await page.evaluate(()=>{const r=FK.forestScene;r.renderer.setPixelRatio(.65);r.renderer.shadowMap.enabled=false;r.renderer.render(r.scene,r.camera);});
    }
    async function settled(){await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
    async function shot(name){await settled();await page.screenshot({path:shots+'/'+name+'.png'});}
    const state=()=>page.evaluate(()=>FK.forestState.get());
    const film=()=>page.evaluate(()=>({id:document.querySelector('.screen-forest').dataset.storyScene,index:Number(document.querySelector('.screen-forest').dataset.storyBeat),frame:FK.forestScene.cinematic.frame}));
    async function next(){await page.getByRole('button',{name:'Geschichte weiter',exact:true}).tap();await settled();}
    // The first frame puts the actual bare oak in view; narration begins from a gesture.
    await page.goto(BASE_URL+'/?screen=forest');await ready();await settled();
    assert.equal((await film()).id,'opening');
    assert.equal(await page.getByRole('button',{name:'Geschichte starten',exact:true}).count(),1);
    assert.equal(await page.evaluate(()=>FK.forestScene.scene.getObjectByName('heart-tree').userData.displayedGrowth),0);
    assert.equal((await state()).welcomed,false);assert.deepEqual((await state()).contributions,{});
    await page.evaluate(async()=>{await FK.store.put('cinema-kept-drawing',{kept:7});});
    await shot('01-tree-opening-phone');
    await page.getByRole('button',{name:'Geschichte starten',exact:true}).tap();
    for(let i=0;i<4;i++)await next();
    assert.equal(await page.locator('.forest-dialog-welcome').count(),1);
    assert.equal(await page.evaluate(()=>FK.forestCinema.seen('opening')),true);
    await page.getByRole('button',{name:'Mit dem Fuchs losgehen',exact:true}).tap();
    assert.equal((await state()).welcomed,true);assert.equal(await page.evaluate(()=>FK.forestScene.cinematic.active),false);
    await page.locator('.forest-goal').tap();
    await page.waitForFunction(()=>document.querySelector('.screen-forest').dataset.storyScene==='request:bridge-neighbours-v1',null,{timeout:90000});await settled();
    assert.equal((await film()).frame.mood,'sad');assert.equal((await state()).activity,null);
    const geometry=await page.evaluate(()=>{
      const beaver=FK.forestScene.scene.getObjectByName('cinema-beaver');let meshes=0,sprites=0;beaver.traverse(o=>{if(o.isMesh)meshes++;if(o.isSprite)sprites++;});
      return{meshes,sprites,mouth:FK.forestScene.scene.getObjectByName('cinema-beaver-mouth').scale.y,treeVisible:FK.forestScene.scene.getObjectByName('heart-tree').visible};
    });
    assert.ok(geometry.meshes>20);assert.equal(geometry.sprites,0);assert.ok(geometry.mouth<.15);assert.equal(geometry.treeVisible,false,'foreground oak cannot obscure the conversation');
    await shot('02-sad-beaver-phone');
    // Leaving before the final choice must not mark the movie or start a puzzle.
    await page.evaluate(()=>FK.go('forest-book'));assert.equal(await page.evaluate(()=>FK.forestScene.cinematic.active),false);
    assert.equal(await page.evaluate(()=>FK.forestCinema.seen('request:bridge-neighbours-v1')),false);
    await page.reload();await ready();
    await page.locator('.forest-goal').tap();await page.locator('.forest-cinema').waitFor();
    await next();assert.equal((await film()).frame.action,'gap');await shot('03-broken-crossing-phone');
    await next();assert.equal((await film()).frame.speaker,'hare');
    await next();assert.equal(await page.locator('.forest-dialog-beaver').count(),1);
    // The same first-grade puzzle and its exact save survive the new storytelling.
    await page.getByRole('button',{name:'Biber bei der Brücke helfen',exact:true}).tap();
    await page.getByRole('button',{name:'Jetzt selber probieren',exact:true}).tap();
    const original=(await state()).activity;
    await page.getByRole('button',{name:'Zurück zum Biber',exact:true}).tap();await ready();
    await page.reload();await ready();assert.deepEqual((await state()).activity,original);
    await page.locator('.forest-goal').tap();await page.getByRole('button',{name:'Biber weiterhelfen',exact:true}).tap();
    for(let round=0;round<5;round++){
      const a=(await state()).activity;
      await page.locator('.screen-learn .learn-answer[data-answer='+JSON.stringify(a.question.answer)+']').tap();
      await page.locator('.screen-learn .learn-next').tap();
    }
    await page.locator('.forest-scene-return').tap();await ready();await settled();
    assert.equal((await film()).id,'return:bridge-neighbours-v1');
    assert.equal(await page.evaluate(()=>FK.heartTree.count()),1);
    assert.equal(await page.evaluate(()=>FK.forestScene.scene.getObjectByName('heart-tree').userData.displayedGrowth),0,'hold the previous bough until the light arrives');
    await next();assert.equal((await film()).frame.action,'spark');
    await page.evaluate(()=>{FK.reduced=false;});await next();
    const first=await page.evaluate(()=>FK.forestScene.scene.getObjectByName('friendship-heartlight').position.toArray());
    await page.waitForFunction(from=>{const p=FK.forestScene.scene.getObjectByName('friendship-heartlight').position;return Math.hypot(p.x-from[0],p.y-from[1],p.z-from[2])>.1;},first,{timeout:20000});
    const second=await page.evaluate(()=>FK.forestScene.scene.getObjectByName('friendship-heartlight').position.toArray());
    assert.ok(Math.hypot(...first.map((n,i)=>n-second[i]))>.1,'the heartlight actually travels through 3D space');
    await page.evaluate(()=>{FK.reduced=true;});await settled();await shot('04-heartlight-home');
    await next();assert.equal(await page.locator('.forest-dialog-beaver').count(),1);
    const growth=await page.evaluate(()=>{const tree=FK.forestScene.scene.getObjectByName('heart-tree');return{actual:tree.userData.growth,displayed:tree.userData.displayedGrowth,boughs:tree.children.find(c=>c.children.some(o=>o.name==='heart-tree-bough-1')).children.filter(o=>o.visible).length};});
    assert.deepEqual(growth,{actual:1,displayed:1,boughs:1});await shot('05-first-living-branch');
    await page.getByRole('button',{name:'Zu Hase gehen',exact:true}).tap();
    await page.waitForFunction(()=>document.querySelector('.screen-forest').dataset.storyScene==='reunion',null,{timeout:90000});
    await next();assert.equal((await film()).frame.action,'reunion');await next();
    assert.equal((await state()).greetingSeen,true);assert.equal(await page.evaluate(()=>FK.heartTree.count()),1,'a greeting never invents an extra repair');
    await page.getByRole('button',{name:'Im Wald weitergehen',exact:true}).tap();await settled();
    assert.equal(await page.locator('.forest-tree-beacon').isVisible(),true,'the central tree stays findable away from its clearing');
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await ready();
    await context.setOffline(true);await page.reload();await ready();
    assert.equal(await page.evaluate(()=>FK.heartTree.count()),1);assert.equal(await page.evaluate(()=>FK.progress.stars()),1);
    assert.equal(await page.evaluate(()=>FK.settings.get('learning.stage')),3);
    assert.deepEqual(await page.evaluate(()=>FK.store.get('cinema-kept-drawing')),{kept:7});
    await context.close();
    // An earlier interrupted ending resumes its saved beat in the new 3D finale.
    const ending=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await ending.addInitScript(()=>{
      if(localStorage.getItem('cinema-ending-seed'))return;
      const ids=['bridge-neighbours-v1','moss-rest-v1','owl-trail-sign-v1','kingfisher-view-v1','garden-path-v1','waterside-stories-v1','meeting-clearing-v1','shared-seating-v1','forest-invitation-v1'];
      localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false}));
      localStorage.setItem('farbtupf.forest.v1',JSON.stringify({version:1,welcomed:true,bridgeRepaired:true,greetingSeen:true,payoffSeen:true,contributions:Object.fromEntries(ids.map(id=>[id,true])),payoffsSeen:Object.fromEntries(ids.map(id=>[id,true])),chapterSeen:{reconnect:true,gather:true},endingUnlocked:true,endingPage:1}));
      localStorage.setItem('cinema-ending-seed','yes');
    });
    page=await ending.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(BASE_URL+'/?screen=forest');await ready();await settled();
    assert.equal((await film()).id,'ending');assert.equal((await film()).index,1);assert.equal((await state()).endingPage,1);
    await page.reload();await ready();assert.equal((await film()).index,1);
    await next();await next();assert.equal((await film()).frame.action,'bloom');
    for(const size of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:820,height:1180}]){
      await page.setViewportSize(size);await settled();
      const bounds=await page.locator('.forest-cinema-tray').evaluate(n=>({x:n.getBoundingClientRect().x,right:n.getBoundingClientRect().right,bottom:n.getBoundingClientRect().bottom,width:n.clientWidth,scroll:n.scrollWidth}));
      assert.ok(bounds.x>=0&&bounds.right<=size.width+1&&bounds.bottom<=size.height+1&&bounds.scroll<=bounds.width+1,'caption fits '+size.width);
      const heads=await page.evaluate(()=>{
        const runtime=FK.forestScene,r=document.querySelector('.forest-cinema-tray').getBoundingClientRect();
        return['fox','beaver','hare','hedgehog','owl','kingfisher'].map(id=>{const p=runtime.scene.getObjectByName('cinema-'+id+'-head').getWorldPosition(runtime.camera.position.clone()).project(runtime.camera),x=(p.x+1)*innerWidth/2,y=(-p.y+1)*innerHeight/2;return{id,x,y,covered:x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom};});
      });
      assert.ok(heads.every(h=>h.x>0&&h.x<size.width&&h.y>0&&h.y<size.height&&!h.covered),'all six faces remain in view at '+size.width+': '+JSON.stringify(heads));
    }
    await page.setViewportSize({width:390,height:844});await settled();await shot('06-awake-tree-finale');
    const finale=await page.evaluate(()=>({growth:FK.forestScene.scene.getObjectByName('heart-tree').userData.displayedGrowth,actors:FK.forestScene.scene.getObjectByName('forest-story-stage').children.filter(o=>o.userData.kind==='story-actor'&&o.visible).length}));
    assert.deepEqual(finale,{growth:9,actors:6});await next();
    await page.getByRole('button',{name:'Im Wald weiterspielen',exact:true}).tap();assert.equal((await state()).endingSeen,true);
    assert.equal(await page.evaluate(()=>FK.forestScene.cinematic.active),false);assert.equal(await page.locator('.screen-forest').evaluate(n=>n.classList.contains('has-film')),false);
    const completed=await state();
    await page.locator('.play-tree-progress').tap();
    await page.waitForFunction(()=>document.querySelector('.forest-cinema')||document.querySelector('.forest-dialog-home'));
    if(await page.locator('.forest-cinema').count())await page.getByRole('button',{name:'Szene überspringen',exact:true}).tap();
    await page.getByRole('button',{name:'Wie der Wald erwacht',exact:true}).tap();await settled();
    assert.equal((await film()).id,'opening-replay');
    assert.equal(await page.evaluate(()=>FK.forestScene.scene.getObjectByName('heart-tree').userData.displayedGrowth),0);
    assert.equal(await page.evaluate(()=>FK.heartTree.count()),9,'a flashback cannot remove an earned branch');
    await page.getByRole('button',{name:'Szene überspringen',exact:true}).tap();await settled();
    assert.equal(await page.evaluate(()=>FK.forestScene.scene.getObjectByName('heart-tree').userData.displayedGrowth),9);
    assert.deepEqual((await state()).contributions,completed.contributions);assert.equal((await state()).endingSeen,true);
    assert.deepEqual(errors,[]);
    console.log('PASS: real 3D opening and sad-beaver request, child-controlled scenes, bridge puzzle save/resume, actual heartlight travel, one new bough per repair, reunion, tree direction beacon, saved finale, six visible faces at four layouts, safe opening replay and offline 3D.');
  }catch(error){if(page&&!page.isClosed())await page.screenshot({path:'/tmp/farbtupf-cinema-failure.png',timeout:10000}).catch(()=>{});console.error('Page errors:',errors);throw error;}
  finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
