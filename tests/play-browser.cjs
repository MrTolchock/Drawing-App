/* Real touch rounds, pictured tasks, spoken word identity and editable sequences. */
const { chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
function route(q) {
  const queue=[[q.start,[]]], seen=new Set([q.start]);
  for(const [p,steps] of queue) {
    if(p===q.goal)return steps;
    for(const [label,dx,dy] of [['Nach oben',0,-1],['Nach links',-1,0],['Nach unten',0,1],['Nach rechts',1,0]]) {
      const x=p%q.size+dx,y=Math.floor(p/q.size)+dy,n=y*q.size+x;
      if(x<0||x>=q.size||y<0||y>=q.size||q.obstacles.includes(n)||seen.has(n))continue;
      seen.add(n);queue.push([n,steps.concat(label)]);
    }
  }
  throw Error('Unreachable route');
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false})));
    const page=await context.newPage(), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8000/?screen=hub');
    await page.evaluate(()=>{
      window.spoken=[];FK.forestVoice.say=text=>window.spoken.push(text);
      for(const api of [FK.learning,FK.adventures,FK.expeditions]) {
        const make=api.question;api.question=(...args)=>{const q=make(...args);window.testQuestion=q;return q;};
      }
    });
    assert.equal(await page.evaluate(()=>FK.current()),'forest-book');
    assert.equal(await page.locator('[data-game="add"]').count(),1);
    assert.equal(await page.locator('[data-game="tricks"]').count(),0);
    assert.equal(await page.getByRole('button',{name:/Kreativmission/}).count(),0);
    assert.equal(await page.evaluate(()=>FK.screenExists('missions')),false);
    // A normal tap opens the parent gate; the right answer opens functioning settings.
    await page.getByRole('button',{name:'Einstellungen für Eltern',exact:true}).tap();
    const task=await page.locator('.gate-task').innerText(), [a,b]=task.match(/\d+/g).map(Number);
    await page.locator('.gate').getByRole('button',{name:String(a*b),exact:true}).tap();
    assert.equal(await page.evaluate(()=>FK.current()),'parents');
    await page.locator('label[for="set-sound"]').tap();assert.equal(await page.evaluate(()=>FK.settings.get('sound')),true);
    await page.locator('label[for="set-sound"]').tap();await page.locator('.screen-parents .btn-back').tap();
    assert.equal(await page.evaluate(()=>FK.current()),'forest-book');
    const cdp=await context.newCDPSession(page);
    async function drag(from,to) {
      const a=await from.boundingBox(),b=await to.boundingBox();
      const start={x:a.x+a.width/2,y:a.y+a.height/2},end={x:b.x+b.width/2,y:b.y+b.height/2};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
      for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(end.x-start.x)*i/8,y:start.y+(end.y-start.y)*i/8}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }
    let tasks=0;
    for(const stage of [1,2,3]) for(const [screen,games] of [['learn',['count','add','pattern','nature']],['adventure',['rocket','picnic','double','shapes','rhyme','syllable','robot','sequence']],['expedition',['neighbours','compare','mirror','vowels','survey']]]) for(const game of games) {
      if(process.env.PLAY_GAMES&&!process.env.PLAY_GAMES.split(',').includes(game))continue;
      await page.evaluate(({screen,game,stage})=>{FK.settings.set('learning.stage',stage);FK.go(screen,{game});},{screen,game,stage});
      const root=page.locator('.screen-'+screen);
      for(let round=0;round<5;round++) {
        const q=await page.evaluate(()=>window.testQuestion);
        assert.equal(await root.locator('.play-context').count(),1,game);
        if(game==='count') {
          assert.equal(await root.locator('.learn-bug').count(),q.answer);
          assert.ok(round!==0||q.count>0,'first garden contains visible bugs');
          if(q.count){const bug=root.locator('.learn-bug').first();await bug.tap();await bug.tap();assert.equal(await bug.getAttribute('aria-pressed'),'false');}
        }
        if(game==='add' && q.b>0) {
          const label=await root.locator('button.play-snack-apple').first().getAttribute('aria-label');
          const apple=root.getByRole('button',{name:label,exact:true});
          await apple.tap();assert.equal(await apple.getAttribute('aria-pressed'),'true');
          await apple.tap();assert.equal(await apple.getAttribute('aria-pressed'),'false');
        }
        if(game==='nature') { assert.ok(q.cue);assert.equal(await root.locator('.play-nature-cue').count(),1);assert.equal(await root.locator('.learn-answer .play-picture').count(),3); }
        if(q.mode==='fill') {
          await root.locator('.adventure-work > .learn-next').tap();assert.equal(await root.locator('.adventure-next').isVisible(),false);
          const seats=root.locator('.learn-bug');for(let i=0;i<await seats.count();i++)await seats.nth(i).tap();
          await root.locator('.adventure-work > .learn-next').tap();assert.ok(await root.locator('.launching').count());
        } else if(q.mode==='share') {
          for(let i=0;i<q.total;i++)await root.locator('.adventure-plate').nth(i%2).tap();
          assert.equal(await root.locator('.adventure-berries .play-picture').count(),q.total);
          await root.locator('.adventure-work > .learn-next').tap();
        } else if(q.mode==='clap') {
          for(let i=0;i<q.answer;i++)await root.locator('.adventure-drum').tap();
          await root.locator('.adventure-work > .learn-next').tap();
        } else if(q.mode==='route') {
          for(const label of route(q))await root.getByRole('button',{name:label,exact:true}).tap();
        } else if(q.mode==='order') {
          const cards=root.locator('.play-order-card');
          if(round===0) {
            await page.waitForFunction(()=>!document.querySelector('.screen-adventure.in'));
            const before=await cards.evaluateAll(bs=>bs.map(b=>b.dataset.value));
            await drag(cards.first(),cards.nth(1));
            await page.waitForFunction(first=>document.querySelector('.play-order-card')?.dataset.value===first,before[1]);
            const after=await cards.evaluateAll(bs=>bs.map(b=>b.dataset.value));
            assert.equal(after[0],before[1],'touch drag swaps the cards');assert.equal(after[1],before[0]);
            assert.equal(await page.locator('.play-drag-ghost').count(),0);
          }
          for(let i=0;i<q.ordered.length;i++) {
            const values=await cards.evaluateAll(bs=>bs.map(b=>b.dataset.value)),from=values.indexOf(q.ordered[i]);
            if(from!==i){await cards.nth(from).tap();await cards.nth(i).tap();}
          }
          assert.deepEqual(await cards.evaluateAll(bs=>bs.map(b=>b.dataset.value)),q.ordered);
          await root.locator('.adventure-work > .learn-next').tap();
        } else if(game==='neighbours') {
          for(const n of q.answer)await root.getByRole('button',{name:String(n),exact:true}).tap();
          await root.getByRole('button',{name:'Nachbarn prüfen',exact:true}).tap();
        } else if(game==='mirror') {
          for(const i of q.answer)await root.locator('button.exp-mosaic-cell').nth(i).tap();
          await root.getByRole('button',{name:'Spiegelbild prüfen',exact:true}).tap();
        } else {
          if(game==='rhyme') {
            const before=await page.evaluate(()=>spoken.length);
            await root.getByRole('button',{name:'Wort '+q.answer+' hören',exact:true}).tap();
            assert.equal(await page.evaluate(()=>spoken.at(-1)),q.answer);assert.ok(await page.evaluate(()=>spoken.length)>before);
            assert.equal(await root.locator('.play-word-choice').count(),3);
          }
          if(round===0&&q.choices) {
            const wrong=q.choices.find(v=>v!==q.answer);
            if(game==='compare') await root.getByRole('button',{name:wrong===0?'= Gleich viele':wrong<0?'← Links mehr':'Rechts mehr →',exact:true}).tap();
            else if(game==='vowels') await root.getByRole('button',{name:String(wrong).toUpperCase(),exact:true}).tap();
            else await root.locator('.learn-answer[data-answer='+JSON.stringify(String(wrong))+']').tap();
            assert.equal(await root.locator(':scope > .learn-body > .learn-next').isVisible(),false,'wrong answer stays editable');
          }
          if(game==='compare')await root.getByRole('button',{name:q.answer===0?'= Gleich viele':q.answer<0?'← Links mehr':'Rechts mehr →',exact:true}).tap();
          else if(game==='vowels')await root.getByRole('button',{name:String(q.answer).toUpperCase(),exact:true}).tap();
          else await root.locator('.learn-answer[data-answer='+JSON.stringify(String(q.answer))+']').tap();
        }
        await root.locator(':scope > .learn-body > .learn-next').waitFor({state:'visible',timeout:5000});
        await root.locator(':scope > .learn-body > .learn-next').tap();tasks++;
      }
      assert.equal(await root.locator('.play-finish').count(),1,game);
      console.log('PASS',game,'stage',stage);
    }
    if(!process.env.PLAY_GAMES)assert.equal(tasks,255);
    if(process.env.PLAY_GAMES){console.log('PASS: '+tasks+' filtered touch tasks');return;}
    // Replay earns no extra star, and practice cannot grow the story tree.
    const stars=await page.evaluate(()=>FK.progress.stars()),growth=await page.evaluate(()=>FK.heartTree.count());
    await page.evaluate(()=>FK.go('learn',{game:'count'}));
    for(let i=0;i<5;i++){const answer=await page.evaluate(()=>String(testQuestion.answer));await page.locator('.screen-learn .learn-answer[data-answer='+JSON.stringify(answer)+']').tap();await page.locator('.screen-learn .learn-next').tap();}
    assert.equal(await page.evaluate(()=>FK.progress.stars()),stars);assert.equal(await page.evaluate(()=>FK.heartTree.count()),growth);
    // Dots: a child must find the next number; a requested hint is temporary.
    await page.evaluate(()=>FK.go('dots',{level:1}));await page.locator('.pp-tile').first().tap();
    assert.equal(await page.locator('.pp-next').innerText(),'1');
    const firstDot=await page.evaluate(()=>{
      const paper=document.querySelector('.pp-paper'),r=paper.getBoundingClientRect(),f=FK.art.fitOf(paper.clientWidth,paper.clientHeight),d=FK.dots.find(d=>d.level===1);
      return {x:r.left+paper.clientLeft+f.ox+d.points[0][0]*f.s,y:r.top+paper.clientTop+f.oy+d.points[0][1]*f.s};
    });
    await page.touchscreen.tap(firstDot.x,firstDot.y);
    assert.equal(await page.locator('.pp-next').innerText(),'?','next number is not supplied after the start');
    await page.getByRole('button',{name:'Nächsten Punkt zeigen',exact:true}).tap();assert.equal(await page.locator('.pp-next').innerText(),'2');
    await page.evaluate(()=>FK.go('expedition',{game:'tricks'}));assert.equal(await page.evaluate(()=>FK.current()),'learn');
    assert.equal(await page.locator('.screen-learn .title').innerText(),'Znüni-Rechenfreunde');
    fs.mkdirSync('/tmp/farbtupf-play',{recursive:true});
    for(const [screen,game] of [['learn','count'],['learn','add'],['learn','nature'],['adventure','rhyme'],['adventure','rocket'],['adventure','picnic'],['adventure','shapes'],['adventure','sequence'],['expedition','survey'],['expedition','mirror']]) {
      await page.evaluate(({screen,game})=>{FK.settings.set('learning.stage',2);FK.go(screen,{game});},{screen,game});
      await page.screenshot({path:'/tmp/farbtupf-play/'+game+'.png',animations:'disabled'});
      assert.equal(await page.locator('.screen-'+screen+' .learn-body').evaluate(el=>el.scrollWidth>el.clientWidth+1),false,game+' phone overflow');
    }
    await page.evaluate(()=>FK.go('forest-book'));
    for(const size of [{width:320,height:568},{width:844,height:390},{width:820,height:1180}]) {
      await page.setViewportSize(size);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.locator('.forest-book-games').first().evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
    }
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await context.setOffline(true);await page.reload();
    assert.equal(await page.evaluate(()=>FK.current()),'forest-book');assert.equal(await page.evaluate(()=>FK.progress.stars()),stars);
    assert.deepEqual(errors,[]);
    console.log('PASS: 255 tasks, actual touch drag, picture and spoken rhyme identity, settings tap/gate, one library, merged arithmetic, replay-safe rewards, no practice tree growth, responsive and offline.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
