const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {compile}=require('../tools/map/layout.cjs'),spec=JSON.parse(fs.readFileSync('design/artwork/world-map-layout.json'));
const api=()=>import(pathToFileURL(path.resolve('js/friends/map-layout.js')).href);
test('the painted map matches its approved landmark calibration without folds or stale generated code',async()=>{
 assert.equal(compile(),fs.readFileSync('js/friends/map-layout.js','utf8'));const {mapPoint}=await api();
 for(const [name,x,z,u,v]of spec.anchors){const p=mapPoint(x,z);assert.ok(Math.abs(p[0]*1536-u)<1e-6&&Math.abs(p[1]*1024-v)<1e-6,name+' is on the painted landmark');}
 assert.deepEqual(mapPoint(61.6,-50.2).map((v,i)=>Math.round(v*spec.canvas[i])),[1043,300],'upper pool location');
 for(let x=-168;x<=168;x+=8)for(let z=-112;z<=112;z+=8)assert.ok(mapPoint(x,z).every(v=>Number.isFinite(v)&&v>=-1e-8&&v<=1+1e-8),'complete map coverage');
 for(const triangle of spec.triangles)for(let i=0;i<3;i++){const a=spec.anchors[triangle[i]],b=spec.anchors[triangle[(i+1)%3]],p=mapPoint((a[1]+b[1])/2,(a[2]+b[2])/2);assert.ok(Math.abs(p[0]*1536-(a[3]+b[3])/2)<1e-6&&Math.abs(p[1]*1024-(a[4]+b[4])/2)<1e-6,'continuous triangle edges');}
});
test('all thirteen named destinations have separate 64 px targets at the minimum phone map width',async()=>{
 const {mapPin,extraMapPlaces}=await api(),pins=Object.keys(spec.pins).map(id=>({id,...mapPin(id)}));assert.equal(pins.length,13);assert.equal(mapPin('ibex').label,'Steinbock');assert.deepEqual(extraMapPlaces,{});
 for(let i=0;i<pins.length;i++)for(let j=0;j<i;j++)assert.ok(Math.max(Math.abs(pins[i].x-pins[j].x)*880,Math.abs(pins[i].y-pins[j].y)*(880*2/3))>=72,pins[i].id+' and '+pins[j].id+' do not share a hit area');
 assert.throws(()=>mapPin('missing'),/Unknown map pin/);
});
