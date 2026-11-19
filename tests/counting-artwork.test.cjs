'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const sharp=require('../tools/node_modules/sharp');
const root=path.resolve(__dirname,'..');
// Separate, opaque paintings are countable units. Tiny isolated pencil flecks
// are not objects; the groups deliberately use generous transparent gaps.
function objectAreas(data,width,height){
 const seen=new Uint8Array(width*height),queue=new Int32Array(width*height),areas=[];
 for(let start=0;start<width*height;start++){
  if(seen[start]||data[start*4+3]<128)continue;
  let read=0,write=1,area=0;queue[0]=start;seen[start]=1;
  while(read<write){
   const at=queue[read++],x=at%width,y=Math.floor(at/width);area++;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const nx=x+dx,ny=y+dy;if(nx<0||nx>=width||ny<0||ny>=height)continue;
    const next=ny*width+nx;
    if(!seen[next]&&data[next*4+3]>=128){seen[next]=1;queue[write++]=next;}
   }
  }
  if(area>=100)areas.push(area);
 }
 return areas;
}
test('counting illustrations contain the exact declared number of separate objects',async()=>{
 const library=JSON.parse(fs.readFileSync(path.join(root,'assets/waldatelier/library.json')));
 const plan=JSON.parse(fs.readFileSync(path.join(root,'design/illustrations/expansion-three-2026-11-19.json')));
 const group=plan.sheets.find(s=>s.id==='expansion-counting-groups');
 for(const subject of group.subjects){
  const image=library.images.find(x=>x.id===subject.id);assert.ok(image,subject.id+' is registered');
  const sheet=library.sheets.find(s=>s.id===image.sheet),r=image.sourceRect;
  const data=await sharp(path.join(root,'assets/waldatelier',sheet.file)).extract({left:r.x,top:r.y,width:r.width,height:r.height}).ensureAlpha().raw().toBuffer();
  const areas=objectAreas(data,r.width,r.height);
  assert.equal(areas.length,subject.quantity,subject.id+' has the specified quantity; component areas: '+areas.join(', '));
 }
});
