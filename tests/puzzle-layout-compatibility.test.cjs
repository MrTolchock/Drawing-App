/* Preserve decisions only across the exact requested UI migration, never changed tasks/art. */
const test=require('node:test'),assert=require('node:assert/strict');
const proof=require('../tools/puzzle-layout-compatibility.json'),baselines=require('../tools/puzzle-review-baselines.json');
const {sameReviewPresentation}=require('../tools/puzzle-layout-compatibility.cjs'),{setup}=require('../tools/puzzle-catalogue.cjs');
test('all prior puzzle/iteration revisions survive the requested layout migration',()=>{
 const baseline=baselines.releases.find(r=>r.commit===proof.baselineCommit),C=setup().FK.puzzleCatalogue;
 for(const [id,p]of Object.entries(baseline.puzzles)){
  assert.ok(C.acceptsRevision(id,null,p.revision),id);
  for(const it of C.iterations(id)){
   const old=baseline.iterations[it.id];assert.ok(old,it.id);assert.ok(C.acceptsRevision(id,it.id,old.revision),it.id);
  }
 }
});
test('the layout bridge rejects subsequent changes and unrelated keys',()=>{
 for(const kind of ['puzzles','iterations'])for(const [key,p]of Object.entries(proof[kind])){
  const before={definition:p.definition,reviewPresentation:p.before},after={definition:p.definition,reviewPresentation:p.after};
  assert.ok(sameReviewPresentation(kind,key,before,after));
  assert.equal(sameReviewPresentation(kind,key,before,{...after,definition:'changed task'}),false);
  assert.equal(sameReviewPresentation(kind,key,before,{...after,reviewPresentation:'changed picture/rule/layout'}),false);
  assert.equal(sameReviewPresentation(kind,key,{...before,reviewPresentation:'unrelated old version'},after),false);
 }
});
