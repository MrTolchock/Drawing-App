const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'), vm=require('node:vm');
const FK={h:(tag,attrs,...children)=>({tag,attrs,children}),settings:{get:()=>undefined},forestState:{get:()=>({contributions:{}})}};
const context={window:{FK},document:{addEventListener(){}}};
for(const file of ['js/learn/learning.js','js/learn/adventures.js','js/forest/story.js','js/ui/heart-tree.js','js/ui/play.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context,{filename:file});
test('the tree grows only for the nine authored story repairs, including old completed saves',()=>{
  const state={contributions:{'unknown-optional-project':true},practices:{foo:{finished:true}}};
  assert.equal(FK.heartTree.count(state),0);
  let expected=0;
  for(const id of Object.keys(FK.forestStory.quests)){state.contributions[id]=true;assert.equal(FK.heartTree.count(state),++expected);}
  assert.equal(expected,9);
  assert.equal(FK.heartTree.count({endingSeen:true,contributions:{}}),9);
  assert.equal(FK.heartTree.picture(0).attrs['data-growth'],0);
  assert.equal(FK.heartTree.picture(9).attrs['data-growth'],9);
});
test('counting begins with visible objects and explicitly includes an empty garden',()=>{
  for(const stage of [1,2,3])for(const edge of [0,0.999999]) {
    assert.ok(FK.learning.question('count',stage,0,()=>edge).count>0);
    assert.equal(FK.learning.question('count',stage,4,()=>edge).count,0);
  }
});
test('merged snack problems teach arithmetic, swap and adjacent relations inside each stage range',()=>{
  for(const stage of [1,2,3])for(const edge of [0,0.999999])for(let round=0;round<5;round++) {
    const q=FK.learning.question('add',stage,round,()=>edge);
    assert.equal(q.answer,q.subtract?q.a-q.b:q.a+q.b);
    assert.ok(q.answer<=[5,10,20][stage-1]);
    assert.ok(q.b>0,'snack rounds always move at least one apple');
    if(q.known) {
      assert.equal(q.known.answer,q.known.a+q.known.b);
      if(q.known.rule==='swap'){assert.equal(q.known.a,q.b);assert.equal(q.known.b,q.a);assert.equal(q.answer,q.known.answer);}
      else {assert.equal(q.a,q.known.a);assert.equal(q.b,q.known.b+1);assert.equal(q.answer,q.known.answer+1);}
    }
  }
});
test('all rhyme choices have a literal matching picture, including original drawings',()=>{
  for(const stage of [1,2,3])for(let round=0;round<5;round++) {
    const q=FK.adventures.question('rhyme',stage,round);
    for(const word of [q.word,...q.choices]) {
      if(FK.adventures.rhymePictures[word])continue;
      const drawing=FK.play.wordDrawing(word);
      assert.equal(drawing.attrs['aria-label'],word);
      assert.match(drawing.attrs.html,/<path /,'missing literal picture for '+word);
    }
    assert.ok(![q.word,...q.choices].includes('wissen'));
  }
});
test('every nature question includes a picture cue independent of the question text',()=>{
  for(const stage of [1,2,3])for(let round=0;round<5;round++)assert.ok(FK.learning.question('nature',stage,round).cue);
});
test('creative missions are removed from runtime, offline assets and drawing entry points',()=>{
  for(const file of ['index.html','sw.js','js/screens/free.js','js/screens/forest-book.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/FK\.missions|js\/(?:learn|screens)\/missions\.js|Kreativmission/);
});
