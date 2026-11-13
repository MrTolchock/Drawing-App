const {test}=require('node:test'),assert=require('node:assert/strict');
const {createRecorder,createVisit}=require('../js/friends/play-log.js');
function fixture(saved){let time=1000;const map=new Map(saved||[]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const options={storage,key:'log',now:()=>time,metadata:()=>({sessionId:'page-a',appVersion:'9.3.22',development:false}),schedule:()=>0,cancel:()=>{}};
 return {map,storage,options,sequence:0,log:createRecorder(options),time:n=>time=n,advance:n=>time+=n,now:()=>time};}
function visit(f,session={id:'add',round:0,work:{},solved:false,questions:[{kind:'add',answer:2}],iterationIds:['add/1-1']}){return {session,run:createVisit({session,puzzle:{host:'squirrel',revision:'puzzle-r1'},record:f.log.record,definition:id=>({puzzleId:'add',iterationId:id,revision:'task-r1',difficulty:'up to ten',question:{kind:'add',a:1,b:1,answer:2}}),now:f.now,id:()=>String(++f.sequence)})};}
test('precise outcomes, active task times and definitions survive a fresh recorder',()=>{
 const f=fixture(),{run}=visit(f);run.show({kind:'add',choices:[1,2,3]});f.advance(2000);run.pause('background',true);f.advance(10000);run.pause('background',false);f.advance(1000);run.answer(3,false,'retry');f.advance(1000);run.pause('dialog',true);f.advance(5000);run.pause('dialog',false);run.answer(2,true);f.advance(900);run.finish();run.stop();
 const data=f.log.exportData(),attempts=data.events.filter(e=>e.event==='puzzle_attempt');assert.deepEqual(attempts.map(e=>[e.selected,e.correct,e.activeMs]),[[3,false,3000],[2,true,4000]]);
 assert.equal(data.format,'farbtupf-play-log');assert.equal(data.schema,2);assert.equal(data.appVersion,'9.3.22');assert.equal(data.storage.localOnly,true);assert.equal(data.summary.iterations[0].medianActiveMs,4000);assert.equal(data.summary.iterations[0].firstTryRate,0);assert.equal(data.summary.puzzles[0].completedRuns,1);
 assert.equal(Object.keys(data.definitions).length,1);assert.equal(data.definitions['add/1-1@task-r1'].question.answer,2);assert.equal(data.events.some(e=>e.definition),false,'definitions are not repeated in the event stream');
 assert.deepEqual(createRecorder(f.options).exportData().events,data.events);
});
test('resume retains a run, totals partial time and does not mistake leaving for a wrong answer',()=>{
 const f=fixture(),first=visit(f);first.run.show({});f.advance(2000);first.run.stop();assert.equal(f.log.exportData().summary.iterations[0].completedRuns,0);assert.equal(f.log.exportData().summary.iterations[0].firstTryRate,null);
 const next=visit(f,first.session);next.run.show({});f.advance(3000);next.run.answer(2,true);next.run.finish();next.run.stop();const data=f.log.exportData();
 assert.equal(data.summary.puzzles[0].runs,1);assert.equal(data.summary.puzzles[0].visits,2);assert.equal(data.summary.iterations[0].medianActiveMs,5000);assert.equal(data.summary.iterations[0].wrongAnswers,0);assert.equal(data.summary.iterations[0].firstTryRate,1);assert.equal(data.events.filter(e=>e.event==='puzzle_resumed').length,1);
});
test('feedback is excluded and repeated redraws do not restart or duplicate an iteration',()=>{
 const f=fixture(),s={id:'add',round:0,work:{},solved:false,questions:[{},{}],iterationIds:['add/1-1','add/1-2']},{run}=visit(f,s);
 run.show({});f.advance(1000);run.show({});run.answer(2,true);f.advance(900);s.round=1;run.show({});f.advance(1500);run.answer(3,true);run.finish();run.stop();const data=f.log.exportData();
 assert.equal(data.events.filter(e=>e.event==='iteration_presented').length,2);assert.equal(data.events.find(e=>e.event==='puzzle_completed').visitActiveMs,2500);assert.deepEqual(data.summary.iterations.map(i=>i.medianActiveMs),[1000,1500]);
});
test('retention bounds time, event count and storage size and removes unused definitions',()=>{
 const f=fixture();f.log.record('iteration_presented',{taskKey:'old',definition:{question:'old'}});f.advance(8*86400000);f.log.record('new');
 for(let i=0;i<11000;i++)f.log.record('sample',{value:'x'.repeat(80),i});const data=f.log.exportData();assert.ok(data.events.length>0&&data.events.length<=10000);assert.ok(f.map.get('log').length<=750000);assert.equal(data.retention.truncated,true);assert.ok(data.retention.droppedEvents>0);assert.equal(data.definitions.old,undefined);assert.ok(data.events.every(e=>e.timestamp===f.now()));
});
test('failed log storage retains an export and never blocks gameplay state transactions',()=>{
 const f=fixture();f.log.record('session_start');const prior=f.map.get('log');f.storage.setItem=()=>{throw Error('quota');};f.log.record('puzzle_attempt',{correct:false});const data=f.log.exportData();assert.equal(data.storage.persisted,false);assert.match(data.storage.error,/nicht/);assert.equal(data.events.length,2);assert.equal(f.map.get('log'),prior);
 const {create}=require('../js/friends/state.js'),content=require('../js/friends/content.js'),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(k.endsWith('.log'))throw Error('quota');map.set(k,v);},removeItem:k=>map.delete(k)};
 const state=create({storage,content,appVersion:()=> '9.3.22'});assert.ok(state.openLetter());assert.equal(state.blocked,false);assert.ok(state.logStatus.error);assert.equal(state.exportLog().appVersion,'9.3.22');
});
test('legacy log events remain available but cannot inflate new puzzle statistics',()=>{
 const f=fixture([['log',JSON.stringify({events:[null,{event:'puzzle_attempt',timestamp:1000,correct:true}],truncated:false})]]);const data=f.log.exportData();assert.equal(data.events.length,1);assert.equal(data.summary.legacyEvents,1);assert.equal(data.summary.unattributedPuzzleEvents,1);assert.equal(data.summary.puzzles.length,0);
 f.log.record('note');assert.ok(f.log.clear());assert.equal(f.log.exportData().events.length,0);assert.equal(f.log.exportData().summary.iterations.length,0);
});
test('construction/tracing do not produce misleading first-try scores',()=>{
 const f=fixture();f.log.record('iteration_presented',{puzzleId:'trace',puzzleRevision:'p1',runId:'r',visitId:'v',taskKey:'trace/A@a',resumed:false,definition:{iterationId:'trace/A',question:{kind:'trace'}}});
 f.log.record('puzzle_attempt',{puzzleId:'trace',puzzleRevision:'p1',runId:'r',visitId:'v',taskKey:'trace/A@a',correct:true,activeMs:2300});
 assert.equal(f.log.exportData().summary.iterations[0].firstTryRate,null);assert.equal(f.log.exportData().summary.iterations[0].medianActiveMs,2300);
});
