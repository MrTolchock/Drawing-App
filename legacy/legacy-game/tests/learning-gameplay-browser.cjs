const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
/* Real touch: a garden census, reversible snack transfers, and picture drops. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  try {
    const context = await browser.newContext({ viewport:{width:390,height:844}, hasTouch:true, reducedMotion:'reduce' });
    await context.addInitScript(() => localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false})));
    const page = await context.newPage(), errors = [];
    page.on('pageerror',error => errors.push(error.message));
    await page.goto(BASE_URL + '/?screen=hub');
    await page.evaluate(() => {
      FK.forestVoice.say = () => {};
      const make = FK.learning.question;
      FK.learning.question = (...args) => window.testQuestion = make(...args);
      const attempt = FK.play.attempt;
      window.testAttempts = [];
      FK.play.attempt = ok => { window.testAttempts.push(ok); attempt?.(ok); };
    });
    const root = page.locator('.screen-learn');
    const choice = value => root.locator('.learn-answer[data-answer='+JSON.stringify(String(value))+']');
    const next = root.locator(':scope > .learn-body > .learn-next');
    async function drag(from,to,finish=true) {
      await from.scrollIntoViewIfNeeded();
      const a=await from.boundingBox(),b=await to.boundingBox(),session=await context.newCDPSession(page);
      const x=a.x+a.width/2,y=a.y+a.height/2,tx=b.x+b.width/2,ty=b.y+b.height/2;
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
      for(let i=1;i<=12;i++) await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(tx-x)*i/12,y:y+(ty-y)*i/12,id:1}]});
      if(finish) await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      return session;
    }
    async function prepare(game,stage) {
      await page.evaluate(({game,stage}) => { FK.settings.set('learning.stage',stage); FK.go('learn',{game}); },{game,stage});
      await page.waitForFunction(() => !document.querySelector('.screen-learn.in'));
    }
    async function completeManipulation(game,q,exerciseUndo=false) {
      if(game==='count' && q.count) {
        const bugs=root.locator('.learn-bug');
        assert.equal(await choice(q.answer).isDisabled(),true,'counting precedes the number answer');
        if(exerciseUndo) {
          await bugs.first().tap();
          assert.equal(await bugs.first().locator('.learn-count-mark').innerText(),'1');
          if(q.count>1) {
            await bugs.nth(1).tap();await bugs.first().tap();
            assert.equal(await bugs.nth(1).locator('.learn-count-mark').innerText(),'1','undo renumbers the remaining census marks');
          } else await bugs.first().tap();
        }
        for(const bug of await bugs.all()) if(await bug.getAttribute('aria-pressed')==='false') await bug.tap();
      }
      if(game==='add') {
        assert.equal(await choice(q.answer).isDisabled(),true,'the snack must be assembled before its result is chosen');
        const source=root.locator('.play-snack-bowl').nth(q.subtract?0:1),destination=root.locator('.play-snack-bowl').nth(q.subtract?1:0);
        if(exerciseUndo) {
          const apple=source.locator('button.play-snack-apple').first(),label=await apple.getAttribute('aria-label');
          const session=await drag(apple,destination);await session.detach();
          assert.equal(await root.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'true');
          await root.getByRole('button',{name:label,exact:true}).tap();
          assert.equal(await root.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'false','a fresh tap immediately after a drop undoes it');
          assert.equal(await choice(q.answer).isDisabled(),true);
        }
        for(let i=0;i<q.b;i++) await source.locator('button.play-snack-apple[aria-pressed=false]').first().tap();
        assert.equal(await root.locator('.play-snack-apple[aria-pressed=true]').count(),q.b);
      }
      assert.equal(await choice(q.answer).isEnabled(),true);
    }
    const treeBefore=await page.evaluate(() => FK.heartTree.count());
    let tasks=0;
    for(let stage=1;stage<=3;stage++) for(const game of ['count','add','pattern','nature']) {
      if(process.env.LEARNING_GAMES&&!process.env.LEARNING_GAMES.split(',').includes(game))continue;
      await prepare(game,stage);
      for(let round=0;round<5;round++) {
        const q=await page.evaluate(() => window.testQuestion),before=await page.evaluate(() => testAttempts.length);
        assert.equal(await next.isVisible(),false,'the child chooses when to continue');
        await completeManipulation(game,q,round===0 || (game==='add'&&round===1));
        const target=game==='pattern'?root.locator('.learn-pattern-gap'):game==='nature'?root.locator('.learn-nature-target'):null;
        if(round===0) {
          const wrong=q.choices.find(value => value!==q.answer);
          if(target) {const session=await drag(choice(wrong),target);await session.detach();}
          else await choice(wrong).tap();
          assert.equal(await next.isVisible(),false,'a wrong answer leaves the task editable');
          assert.deepEqual(await page.evaluate(n => testAttempts.slice(n),before),[false],'one wrong drop records one retry, without a synthetic extra click');
        }
        if(target && round===0) {const session=await drag(choice(q.answer),target);await session.detach();}
        else await choice(q.answer).tap();
        assert.equal(await next.isVisible(),true);
        assert.equal(await root.locator('.learn-answer.correct').count(),1);
        assert.deepEqual(await page.evaluate(n => testAttempts.slice(n),before),round===0?[false,true]:[true]);
        if(target) assert.equal(await target.locator('.play-picture').count(),1,'the missing picture is visibly filled');
        assert.equal(await page.locator('.learn-drag-ghost').count(),0);
        await next.tap();tasks++;
      }
      assert.equal(await root.locator('.play-finish').count(),1);
      console.log('PASS',game,'stage',stage);
    }
    if(!process.env.LEARNING_GAMES)assert.equal(tasks,60);
    assert.equal(await page.evaluate(() => FK.heartTree.count()),treeBefore,'practice does not consume authored story growth');
    const stars=await page.evaluate(() => FK.progress.stars()),countWasDone=await page.evaluate(()=>FK.progress.isDone('learn','count:1'));
    await prepare('count',1);
    for(let round=0;round<5;round++) {const q=await page.evaluate(() => testQuestion);await completeManipulation('count',q);await choice(q.answer).tap();await next.tap();}
    assert.equal(await page.evaluate(() => FK.progress.stars()),stars+(countWasDone?0:1),'replaying a completed stage earns no duplicate star');
    for(const game of ['count','add','pattern','nature']) {
      await prepare(game,3);
      for(const size of [{width:320,height:568},{width:844,height:390},{width:820,height:1180}]) {
        await page.setViewportSize(size);
        assert.equal(await root.locator('.learn-body').evaluate(el => el.scrollWidth>el.clientWidth+1),false,game+' fits '+size.width+'px');
      }
      await page.setViewportSize({width:390,height:844});
    }
    // Leaving during a touch gesture must not leave an orphaned picture over the app.
    await prepare('pattern',1);
    const session=await drag(root.locator('.learn-answer').first(),root.locator('.learn-pattern-gap'),false);
    assert.equal(await page.locator('.learn-drag-ghost').count(),1);
    await page.evaluate(() => FK.go('forest-book'));
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
    assert.equal(await page.locator('.learn-drag-ghost').count(),0);
    assert.deepEqual(errors,[]);
    console.log('PASS: '+tasks+' hands-on tasks, actual touch drops, undo, retry, click suppression, replay-safe rewards and responsive scenes.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
