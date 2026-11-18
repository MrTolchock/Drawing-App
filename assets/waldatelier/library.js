/* Developer reference: uses the existing atlas cells; it never creates game/review state. */
'use strict';
(async()=>{
 const byId=id=>document.getElementById(id),grid=byId('images'),search=byId('search'),sheetFilter=byId('sheet'),used=byId('used'),more=byId('more'),count=byId('count'),message=byId('message');
 const response=await fetch('library.json',{cache:'no-cache'});if(!response.ok)throw Error('Die Bildübersicht konnte nicht geladen werden.');const data=await response.json();
 const sheets=new Map(data.sheets.map(s=>[s.id,s])),loaded=new Map();let limit=60;
 const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
 const fold=text=>text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 const notice=text=>message.textContent=text;
 const sheetURL=sheet=>sheet.file+'?v='+sheet.sha256.slice(0,16);
 function load(sheet){const url=sheetURL(sheet);if(!loaded.has(url))loaded.set(url,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Der Bildbogen fehlt.'));img.src=url;}));return loaded.get(url);}
 async function png(entry){
  try{const sheet=sheets.get(entry.sheet),img=await load(sheet),r=entry.sourceRect,canvas=document.createElement('canvas');canvas.width=Math.ceil(r.width);canvas.height=Math.ceil(r.height);canvas.getContext('2d').drawImage(img,r.x,r.y,r.width,r.height,0,0,canvas.width,canvas.height);
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('PNG-Export fehlgeschlagen.')),'image/png')),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=entry.id+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice(entry.label+' als transparentes PNG heruntergeladen.');
  }catch(error){notice(error.message);}
 }
 function card(entry){
  const sheet=sheets.get(entry.sheet),article=node('article',undefined,'image-card');article.id=entry.id;article.dataset.image=entry.id;
  const picture=node('span',undefined,'picture');picture.setAttribute('role','img');picture.setAttribute('aria-label',entry.label);picture.style.backgroundImage='url("'+sheetURL(sheet)+'")';picture.style.backgroundSize=sheet.columns*100+'% '+sheet.rows*100+'%';picture.style.backgroundPosition=entry.column*100/Math.max(1,sheet.columns-1)+'% '+entry.row*100/Math.max(1,sheet.rows-1)+'%';
  const preview=node('div',undefined,'preview');preview.append(picture);const body=node('div',undefined,'card-body');body.append(node('h2',entry.label),node('code',entry.id));
  const atlas=node('a','Bildbogen: '+sheet.id,'source');atlas.href=sheetURL(sheet);body.append(atlas);
  if(entry.usedBy.length){const details=node('details');details.append(node('summary','In '+entry.usedBy.length+' Rätseln'));
   for(const id of entry.usedBy){const link=node('a',data.puzzles[id].title);link.href='https://github.com/MrTolchock/Drawing-App/blob/main/docs/puzzles/'+id+'.md';details.append(link);}body.append(details);
  }else body.append(node('span','Zur Wiederverwendung vorhanden','source'));
  const actions=node('div',undefined,'actions'),copy=node('button','ID kopieren'),download=node('button','PNG herunterladen');copy.type=download.type='button';copy.setAttribute('aria-label','ID '+entry.id+' kopieren');download.setAttribute('aria-label',entry.label+' als PNG herunterladen');
  copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(entry.id);notice('Kopiert: '+entry.id);}catch{notice('Bild-ID: '+entry.id);}});download.addEventListener('click',()=>png(entry));actions.append(copy,download);body.append(actions);article.append(preview,body);return article;
 }
 function render(){
  const query=fold(search.value.trim()),found=data.images.filter(i=>(!sheetFilter.value||i.sheet===sheetFilter.value)&&(!used.checked||i.usedBy.length)&&(!query||fold([i.id,i.label,...i.tokens,...i.usedBy.map(id=>data.puzzles[id].title)].join(' ')).includes(query)));
  count.textContent=found.length+' von '+data.images.length+' Bildern · '+data.sheets.length+' Bildbogen · '+Object.keys(data.puzzles).length+' aktive Rätsel';grid.replaceChildren(...found.slice(0,limit).map(card));more.hidden=found.length<=limit;
  if(!found.length)grid.append(node('p','Kein Bild gefunden. Versuche einen kürzeren Namen oder eine Bild-ID.'));
 }
 for(const sheet of data.sheets){const option=node('option',sheet.id);option.value=sheet.id;sheetFilter.append(option);}
 search.value=location.hash.slice(1);search.addEventListener('input',()=>{limit=60;render();});sheetFilter.addEventListener('change',()=>{limit=60;render();});used.addEventListener('change',()=>{limit=60;render();});byId('transparency').addEventListener('change',event=>grid.classList.toggle('checker',event.target.checked));more.addEventListener('click',()=>{limit+=60;render();});window.addEventListener('hashchange',()=>{search.value=location.hash.slice(1);limit=60;render();});render();
})().catch(error=>{document.getElementById('count').textContent=error.message;});
