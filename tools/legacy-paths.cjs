/* Resolve the original paths recorded in immutable image-generation provenance. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'legacy/manifest.json'),'utf8'));
const moved=new Map([...manifest.records.map(r=>[r.original,r.archived]),...manifest.relocations.map(r=>[r.original,r.current])]);
function historicalPath(file){return moved.get(file)||file;}
module.exports={historicalPath};
