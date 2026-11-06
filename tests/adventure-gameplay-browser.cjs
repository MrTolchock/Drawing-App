const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
/* Real touch play: quantities can be wrong, pieces move, and every retry works. */
const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict');

(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false})));
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(BASE_URL + '/?screen=hub');
    await page.evaluate(()=>{
      FK.forestVoice.say=()=>{};
      const make=FK.adventures.question;
      FK.adventures.question=(...args)=>{const q=make(...args);window.adventureQuestion=q;return q;};
    });
    const cdp=await context.newCDPSession(page);
    async function drag(from,to){
      await from.scrollIntoViewIfNeeded();
      const a=await from.boundingBox(),start={x:a.x+a.width/2,y:a.y+a.height/2};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
      let current={x:start.x+10,y:start.y};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[current]});
      for(let guard=0;guard<70;guard++){
        const target=await to.boundingBox(),area=await page.locator('.screen-adventure .learn-body').boundingBox(),y=target.y+target.height/2;
        if(y>area.y+90&&y<area.y+area.height-90)break;
        current={x:Math.max(area.x+15,Math.min(area.x+area.width-15,target.x+target.width/2)),y:y<area.y+10?area.y+8:area.y+area.height-8};
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[current]});await page.waitForTimeout(100);
      }
      const b=await to.boundingBox(),end={x:b.x+b.width/2,y:b.y+b.height/2};
      for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:current.x+(end.x-current.x)*i/8,y:current.y+(end.y-current.y)*i/8}]});
      // Edge scrolling moves the destination. Follow its final visible position
      // before releasing, as a finger does on the screen.
      const settled=await to.boundingBox();
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:settled.x+settled.width/2,y:settled.y+settled.height/2}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      assert.equal(await page.locator('.adventure-drag-ghost').count(),0,'drag ghost always cleared');
    }
    const root=page.locator('.screen-adventure');
    let tasks=0,drags=0;
    for(const stage of [1,2,3])for(const game of ['rocket','picnic','double','shapes']){
      if(process.env.GAMEPLAY_GAMES&&!process.env.GAMEPLAY_GAMES.split(',').includes(game))continue;
      // p.stage must work even when the saved stage differs.
      await page.evaluate(({game,stage})=>{FK.settings.set('learning.stage',stage===3?1:3);FK.go('adventure',{game,stage});},{game,stage});
      await page.waitForFunction(()=>!document.querySelector('.screen-adventure.in'));
      for(let round=0;round<5;round++){
        const q=await page.evaluate(()=>window.adventureQuestion);
        const next=root.locator('.adventure-next'),verify=root.locator('.adventure-work > .learn-next');
        assert.equal(q.kind,game);
        if(game==='rocket'){
          assert.equal(await root.locator('.adventure-seats').count(),0,'no answer-revealing empty seats');
          await verify.tap();assert.equal(await next.isVisible(),false,'an empty load cannot launch');
          if(round===0){
            await drag(root.locator('.rocket-load[data-amount="1"]'),root.locator('.rocket-hold'));drags++;
            assert.equal(await root.locator('.rocket-star').count(),1,'drag loads exactly one star');
            await root.locator('.rocket-star').tap();assert.equal(await root.locator('.rocket-star').count(),0,'individual star can be removed');
          }
          for(let i=0;i<=q.answer;i++)await root.locator('.rocket-load[data-amount="1"]').tap();
          await verify.tap();assert.equal(await next.isVisible(),false,'overloading is possible and recoverable');
          await root.locator('.rocket-unload').tap();
          assert.equal(await root.locator('.rocket-star').count(),q.answer);
          await verify.tap();assert.equal(await root.locator('.play-rocket.launching').count(),1);
        }else if(game==='picnic'){
          assert.equal(q.recipients.length,stage+1);
          await verify.tap();assert.equal(await next.isVisible(),false,'basket must be shared');
          if(round===0){
            const berry=root.locator('.picnic-berry[data-berry="0"]');
            await drag(berry,root.locator('.adventure-plate').first());drags++;
            assert.equal(await root.locator('.adventure-plate').first().locator('.picnic-berry').count(),1);
            await drag(berry,root.locator('.adventure-plate').nth(1));drags++;
            assert.equal(await root.locator('.adventure-plate').nth(1).locator('.picnic-berry').count(),1,'berry moves between plates');
            await root.locator('.picnic-undo').tap();
            assert.equal(await root.locator('.adventure-plate').first().locator('.picnic-berry').count(),1,'undo restores previous plate');
            await drag(berry,root.locator('.picnic-basket-heading'));drags++;
            assert.equal(await root.locator('.picnic-basket-tokens .picnic-berry').count(),q.total,'drag returns berry to basket');
          }
          for(let i=0;i<q.total;i++)await root.locator('.picnic-give').first().tap();
          await verify.tap();assert.equal(await next.isVisible(),false,'empty basket alone is insufficient');
          for(let i=0;i<q.total;i++)if(i%q.recipients.length){
            await root.locator('.picnic-berry[data-berry="'+i+'"]').tap();
            await root.locator('.picnic-give').nth(i%q.recipients.length).tap();
          }
          for(let i=0;i<q.recipients.length;i++)assert.equal(await root.locator('.adventure-plate').nth(i).locator('.picnic-berry').count(),q.answer);
          assert.equal(await root.locator('.adventure-berries .play-picture').count(),q.total,'physical berries conserved');
          await verify.tap();
        }else if(game==='double'){
          assert.equal(await root.locator('.mirror-number-task').isVisible(),false);
          await root.locator('.mirror-check').tap();assert.equal(await next.isVisible(),false);
          for(let i=0;i<=q.n;i++)await root.locator('.mirror-add').tap();
          await root.locator('.mirror-check').tap();assert.equal(await root.locator('.mirror-number-task').isVisible(),false,'unequal groups cannot pass');
          await root.locator('.mirror-remove').tap();await root.locator('.mirror-check').tap();
          assert.equal(await root.locator('.mirror-number-task').isVisible(),true);
          const wrong=q.choices.find(n=>n!==q.answer);
          await root.locator('.learn-answer[data-answer="'+wrong+'"]').tap();assert.equal(await next.isVisible(),false);
          await root.locator('.learn-answer[data-answer="'+q.answer+'"]').tap();
        }else if(game==='shapes'){
          const rotations={...q.rotations},periods={circle:1,triangle:360,square:90,rectangle:180};
          assert.equal(q.targets.length,stage+1);
          if(round===0){
            const target=q.targets[0],wrong=q.choices.find(id=>id!==target.shape);
            await drag(root.locator('.shape-piece[data-shape="'+wrong+'"]'),root.locator('[data-target="'+target.key+'"]'));drags++;
            assert.equal(await root.locator('.shape-build-hole[data-target].shape-placed').count(),0,'wrong piece stays available');
          }
          for(let i=0;i<q.targets.length;i++){
            const target=q.targets[i],piece=root.locator('.shape-piece[data-shape="'+target.shape+'"]'),slot=root.locator('[data-target="'+target.key+'"]');
            // A failed drag can leave its piece selected. Select deterministically.
            if(await piece.getAttribute('aria-pressed')!=='true')await piece.tap();
            let turns=0;
            while((rotations[target.shape]-target.rotation)%periods[target.shape]!==0){
              assert.ok(stage===3&&turns++<4,'all targets reachable by quarter turns');
              await root.locator('.shape-rotate').tap();rotations[target.shape]=(rotations[target.shape]+90)%360;
            }
            if(round===0&&i===0){await drag(piece,slot);drags++;}else await slot.tap();
            assert.equal(await slot.getAttribute('disabled'),'','fitted piece stays in the house');
          }
          assert.equal(await root.locator('.shape-house-complete').count(),1);
        }
        assert.equal(await next.isVisible(),true,game+' stage '+stage+' round '+round+' solved');
        assert.equal(await root.locator('.adventure-work button:not(:disabled)').count(),0,'solved task cannot change');
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),game+' fits phone');
        tasks++;await next.tap();
      }
      assert.equal(await root.locator('.play-finish').count(),1,game+' reaches finish');
    }
    // The toys retain their touch targets and fit a narrow portrait iPhone.
    await page.setViewportSize({width:320,height:780});
    for(const game of ['rocket','picnic','double','shapes']){
      await page.evaluate(game=>FK.go('adventure',{game,stage:3}),game);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),game+' fits 320px');
    }
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({tasks,drags,stages:3,widths:[390,320],errors}));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
