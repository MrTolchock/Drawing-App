'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {sourceRectangles}=require('../tools/illustrations/pack-atlas.cjs');
const manifest=()=>({columns:2,rows:2,subjects:[{id:'plant'},{id:'handle'},{id:'bird'}]});
test('source crops preserve artwork crossing a grid line while leaving other source cells unchanged',()=>{
 const m=manifest(),original=sourceRectangles(m,200,200);
 m.sourceRects={plant:{x:0,y:0,width:100,height:115},bird:{x:0,y:116,width:100,height:84}};
 const crops=sourceRectangles(m,200,200);
 assert.ok(original[0].y+original[0].height<=108,'uniform cell would clip the stem at y=108');
 assert.ok(crops[0].y+crops[0].height>108,'explicit crop includes the complete stem');
 assert.ok(crops[2].y>108,'next crop excludes the previous plant');
 assert.deepEqual(crops[1],original[1],'unadjusted cell preserves the original crop');
 assert.deepEqual(sourceRectangles(manifest(),201,201),[{x:0,y:0,width:100,height:100},{x:100,y:0,width:101,height:100},{x:0,y:100,width:100,height:101}]);
});
test('source crops reject unknown IDs, invalid coordinates and crops beyond real image pixels',()=>{
 for(const rect of [{x:-1,y:0,width:10,height:10},{x:0.5,y:0,width:10,height:10},{x:0,y:0,width:0,height:10},{x:190,y:0,width:11,height:10},{x:0,y:190,width:10,height:11},null]){
  assert.throws(()=>sourceRectangles({...manifest(),sourceRects:{plant:rect}},200,200),/Source crop must fit/);
 }
 assert.throws(()=>sourceRectangles({...manifest(),sourceRects:{unknown:{x:0,y:0,width:10,height:10}}},200,200),/Unknown source crop subject/);
 assert.throws(()=>sourceRectangles({...manifest(),sourceRects:[]},200,200),/sourceRects must map/);
 assert.throws(()=>sourceRectangles({...manifest(),sourceRects:{bird:{x:0,y:190,width:10,height:11}}},200,150,200),/Source crop must fit/);
});
