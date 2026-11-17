const BASE_URL = process.env.FARBTUPF_BASE_URL || 'http://127.0.0.1:8000';
/* Returning from a game must not also activate a card under the same finger.
   Guided rounds are played through; free-round finishes isolate navigation. */
const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const assert=require('node:assert/strict');
function route(q,start){
  const queue=[[start,[]]],seen=new Set([start]);
  for(const [p,path]of queue){
    if(p===q.goal)return path;
    for(const [name,dx,dy]of [['Nach oben',0,-1],['Nach links',-1,0],['Nach unten',0,1],['Nach rechts',1,0]]){
      const x=p%q.size+dx,y=Math.floor(p/q.size)+dy,n=y*q.size+x;
      if(x<0||x>=q.size||y<0||y>=q.size||q.obstacles.includes(n)||seen.has(n))continue;
      seen.add(n);queue.push([n,path.concat(name)]);
    }
  }
  throw Error('Unreachable route');
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    const context=await browser.newContext({viewport:{width:820,height:1180},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>{
      localStorage.setItem('farbklecks.settings.v2',JSON.stringify({sound:false}));
      localStorage.setItem('farbtupf.forest.v1',JSON.stringify({version:1,welcomed:true,bridgeRepaired:true,greetingSeen:true,payoffSeen:true,
        contributions:{'bridge-neighbours-v1':true},familyGuidanceSeen:{pattern:true,treasure:true,robot:true}}));
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(BASE_URL+'/?screen=hub');
    await page.evaluate(()=>{window.navigationSpoken=[];FK.forestVoice.say=text=>navigationSpoken.push(text);});
    await page.getByRole('button',{name:'Mit Biber spielen',exact:true}).tap();
    const contribution=await page.evaluate(()=>FK.forestState.get().contributions);
    const currentRoot=async()=>page.locator('.screen-'+await page.evaluate(()=>FK.current()));
    const session=game=>page.evaluate(game=>FK.forestState.getActivity('beaver-'+game+'-practice-v1'),game);
    async function inBook(){
      // Allow the browser's delayed compatibility click and transition to finish.
      await page.waitForTimeout(450);
      assert.equal(await page.evaluate(()=>FK.current()),'forest-book','one return tap stays in the book');
      const before=await page.evaluate(()=>navigationSpoken.length);
      await page.getByRole('button',{name:'Spielebuch erklären',exact:true}).tap();
      assert.equal(await page.evaluate(()=>navigationSpoken.length),before+1,'a fresh touch immediately after returning still works');
    }
    let tasks=0;
    for(const [game,title]of [['pattern','Muster entdecken'],['treasure','Waldschätze merken'],['robot','Wege finden']]){
      await page.getByRole('button',{name:title+' spielen',exact:true}).tap();
      for(let i=0;i<5;i++){
        const a=await session(game),root=await currentRoot();
        if(game==='pattern')await root.locator('.learn-answer[data-answer='+JSON.stringify(a.question.answer)+']').tap();
        else if(game==='treasure'){
          await root.locator('.exp-hide').tap();
          await root.getByRole('button',{name:a.question.answer,exact:true}).tap();
        }else for(const step of route(a.question,a.position))await root.getByRole('button',{name:step,exact:true}).tap();
        await root.locator('.learn-next').tap();tasks++;
      }
      const finished=await session(game);
      await (await currentRoot()).locator('.forest-scene-return').tap();
      await inBook();
      assert.deepEqual(await session(game),finished,'returning never starts another practice round');
    }
    for(const [screen,game]of [['learn','count'],['adventure','rocket'],['expedition','compare']]){
      await page.locator('.forest-book-games [data-game="'+game+'"]').tap();
      await page.evaluate(({screen,game})=>FK.play.finish(document.querySelector('.screen-'+screen+' .learn-body'),screen,game,1,()=>{}),{screen,game});
      await (await currentRoot()).getByRole('button',{name:'Waldspiele',exact:true}).tap();
      await inBook();
    }
    assert.deepEqual(await page.evaluate(()=>FK.forestState.get().contributions),contribution);
    assert.deepEqual(errors,[]);
    console.log('PASS: 15 actual guided-practice tasks, all three free-game return paths, delayed touch-click suppression, fresh book taps and unchanged story contributions.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
