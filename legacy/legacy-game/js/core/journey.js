/* Optional, resumable practice adventures. Story state and star keys are independent. */
(function () {
  'use strict';
  const FK=window.FK, KEY='farbtupf.journey.v1';
  const packs={learn:['count','add','pattern','nature'],adventure:['rocket','picnic','double','shapes','rhyme','syllable','robot','sequence'],expedition:['treasure','neighbours','compare','mirror','vowels','survey']};
  const friends={beaver:['count','add','rocket','neighbours','compare'],hare:['rhyme','syllable','vowels'],hedgehog:['nature','treasure','picnic'],owl:['pattern','robot','sequence','survey'],kingfisher:['shapes','double','mirror']};
  const stageOf=n=>Math.max(1,Math.min(3,Math.floor(Number(n)||1)));
  function catalogue(){return Object.entries(packs).flatMap(([screen,ids])=>ids.map(game=>{
    const source={learn:FK.learning,adventure:FK.adventures,expedition:FK.expeditions}[screen];
    const definition=source.games.find(item=>item.id===game);
    return {screen,game,title:definition.title,emoji:definition.emoji,friend:Object.keys(friends).find(id=>friends[id].includes(game))};
  }));}
  const validStep=s=>s&&Object.hasOwn(packs,s.screen)&&packs[s.screen].includes(s.game)&&Number.isInteger(s.stage)&&s.stage>=1&&s.stage<=3;
  function restore(){
    const empty={version:1,tour:null,completed:0,records:{}};
    try{
      const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version!==1)return empty;
      empty.completed=Math.max(0,Math.min(100000,Math.floor(Number(saved.completed)||0)));
      for(const [key,value]of Object.entries(saved.records||{})){
        if(!/^(learn|adventure|expedition):[a-z]+:[123]$/.test(key)||!value||!Number.isFinite(value.rounds))continue;
        empty.records[key]={rounds:Math.max(0,Math.min(100000,Math.floor(value.rounds))),independent:Math.max(0,Math.min(5,Math.floor(Number(value.independent)||0)))};
      }
      const tour=saved.tour;
      if(tour&&Array.isArray(tour.steps)&&tour.steps.length===3&&tour.steps.every(validStep)&&new Set(tour.steps.map(s=>s.screen+':'+s.game)).size===3&&Number.isInteger(tour.index)&&tour.index>=0&&tour.index<=3){
        empty.tour={steps:tour.steps.map(s=>({screen:s.screen,game:s.game,stage:s.stage})),index:tour.index,resident:Object.hasOwn(friends,tour.resident)?tour.resident:'all'};
      }
      return empty;
    }catch(_){return empty;}
  }
  let state=restore();
  const copy=v=>JSON.parse(JSON.stringify(v));
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}return get();}
  function get(){return copy(state);}
  function step(){const next=state.tour?.steps[state.tour.index];if(!next)return null;return {...catalogue().find(c=>c.screen===next.screen&&c.game===next.game),...copy(next)};}
  function start(options={}){
    // Starting an active tour always resumes it. No unfinished route is overwritten.
    if(step())return step();
    const stage=stageOf(options.stage||FK.learning.stage()),resident=Object.hasOwn(friends,options.resident)?options.resident:'all';
    let pool=catalogue().filter(c=>resident==='all'||c.friend===resident);
    // Prefer unexplored games, then rotate practice rather than repeating the same trio.
    pool=pool.map((item,i)=>({item,i,rounds:state.records[item.screen+':'+item.game+':'+stage]?.rounds||0,done:FK.progress.isDone(item.screen,item.game+':'+stage)?1:0})).sort((a,b)=>a.rounds-b.rounds||a.done-b.done||a.i-b.i);
    if(resident==='all'){
      const selected=[], families=[['count','add','rocket','neighbours','compare'],['rhyme','syllable','vowels'],['pattern','nature','treasure','picnic','double','shapes','robot','sequence','mirror','survey']];
      for(const family of families){const candidate=pool.find(c=>family.includes(c.item.game));if(candidate)selected.push(candidate);}
      pool=selected;
    }
    state.tour={steps:pool.slice(0,3).map(({item})=>({screen:item.screen,game:item.game,stage})),index:0,resident};save();return step();
  }
  function complete(screen,game,stage,summary={}){
    if(!validStep({screen,game,stage}))return {advanced:false,finished:false,next:step()};
    const key=screen+':'+game+':'+stage,previous=state.records[key]||{rounds:0,independent:0};
    const independent=Math.max(0,Math.min(5,Math.floor(Number(summary.independent)||0)));
    state.records[key]={rounds:previous.rounds+1,independent};
    const current=step(),advanced=!!current&&current.screen===screen&&current.game===game&&current.stage===stage;
    if(advanced){state.tour.index++;if(state.tour.index===3)state.completed++;}
    save();return {advanced,finished:advanced&&state.tour.index===3,next:step()};
  }
  function launch(next=step()){
    if(!next||!validStep(next))return false;
    FK.settings.set('learning.stage',next.stage);FK.go(next.screen,{game:next.game,stage:next.stage});return true;
  }
  function recommendation(screen,game,stage,summary={}){
    const pool=catalogue().filter(c=>c.game!==game),friend=catalogue().find(c=>c.screen===screen&&c.game===game)?.friend;
    // A higher level is offered explicitly, never silently applied mid-round.
    if(stage<3&&summary.independent>=4)return {screen,game,stage:stage+1,kind:'level',...catalogue().find(c=>c.screen===screen&&c.game===game)};
    const candidate=pool.filter(c=>c.friend===friend).sort((a,b)=>(state.records[a.screen+':'+a.game+':'+stage]?.rounds||0)-(state.records[b.screen+':'+b.game+':'+stage]?.rounds||0))[0]||pool[0];
    return {...candidate,stage,kind:'game'};
  }
  FK.journey={KEY,catalogue,get,start,step,complete,launch,recommendation,stageOf};
})();
