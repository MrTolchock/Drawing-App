/* The same finite catalogue in a disposable VM, also used to inspect historical releases. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function environment({read=file=>fs.readFileSync(path.join(root,file)),saved,fields={},review=true}={}){
 const memory=new Map(saved||[]),settings=new Map(),FK={...fields,shuffle:xs=>xs.slice().reverse(),settings:{get:k=>settings.get(k),set:(k,v)=>settings.set(k,v)}};
 const ctx=vm.createContext({window:{FK},URLSearchParams,location:{search:''},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},console});
 const execute=(file,transform=s=>s)=>vm.runInContext(transform(read(file).toString()),ctx,{filename:file});
 for(const file of ['js/friends/content.js','js/learn/glyphs.js','js/learn/routes.js','js/friends/puzzles.js','js/friends/library.js','js/friends/puzzle-rounds.js','js/friends/puzzle-catalogue.js'])execute(file);
 if(review)for(const file of ['js/friends/review-repository.js','js/ui/review-connection.js','js/friends/puzzle-review.js'])execute(file);
 return {FK,memory,ctx,execute};
}
module.exports={environment};
