import {createWorld,places,exitPoints,collectibles} from './world.js';
import {picture,shapeNames,shapeScene} from './art.js';
import {createAudio} from './audio.js';
const FK=window.FK,h=FK.h,C=window.FriendsContent;
let root,canvas,world,state,audio,overlay,hotspots,nav,statusBar,nearButton,caption,leaves,fader,doorScene,denEnvelope;
let area='den',panel=null,host=null,example=false,feedbackTimer=null,activeMs=0,lastTick=performance.now(),pendingDrawing=null,returnArea='den';
const actionPictures={outside:'door',drawing:'pencils',sleep:'bed',games:'book'};
const actionNames={outside:'Nach draussen',drawing:'Zeichnen und ausmalen',sleep:'Schlafen',games:'Waldspiele'};
const envelopeSVG='<svg viewBox="0 0 120 85" aria-hidden="true"><rect x="3" y="5" width="114" height="75" rx="7" fill="#fff6dc" stroke="#967044" stroke-width="3"/><path d="m5 76 40-33m70 33L75 43M5 9l55 43 55-43" fill="none" stroke="#b59466" stroke-width="3"/><circle cx="60" cy="53" r="9" fill="#a9bb85"/><path d="m56 53 3 3 5-7" fill="none" stroke="#547043" stroke-width="2"/></svg>';
const doorSVG=`<svg viewBox="0 0 1448 1086" preserveAspectRatio="none"><defs><linearGradient id="door-wood" x2="1" y2=".2"><stop stop-color="#81512d"/><stop offset=".4" stop-color="#b88046"/><stop offset=".8" stop-color="#a66d39"/><stop offset="1" stop-color="#684123"/></linearGradient><filter id="door-paper"><feTurbulence type="fractalNoise" baseFrequency=".17" numOctaves="3" seed="12"/><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="soft-light"/></filter><clipPath id="door-clip"><path d="M1078 440C1037 338 1071 205 1146 149 1240 80 1362 91 1403 194 1430 263 1400 386 1359 473Z"/></clipPath></defs><g clip-path="url(#door-clip)"><path d="M1040 95h410v410h-410z" fill="url(#door-wood)"/><g fill="none" stroke="#694124" stroke-width="4" opacity=".6"><path d="M1110 95v420m54-420v420m54-420v420m54-420v420m54-420v420m54-420v420"/><path d="M1098 225q24 32 3 72m77-142q-19 48 1 93m93 81q-18 51 2 88m48-260q24 31 3 68m-170 58q-20 42 4 64"/></g><path d="M1077 421 1412 442M1078 210l324 21" stroke="#d8a05e" stroke-width="15" opacity=".35"/><path d="M1076 414 1402 436M1075 204l329 21" stroke="#6f472b" stroke-width="8"/><g fill="#5d513f" stroke="#c0a06d" stroke-width="2"><path d="M1090 226h45l14 8-14 9h-45zm1 154h45l14 8-14 9h-45z"/><circle cx="1350" cy="330" r="13" fill="#d6aa59"/></g><rect x="1184" y="298" width="119" height="33" rx="8" fill="#583c27" stroke="#d8ad60" stroke-width="5"/><path class="ff-mail-lid" d="M1183 297h120v28h-120z" fill="#c39b51" stroke="#e2bf7a" stroke-width="3"/></g><path d="M1078 440C1037 338 1071 205 1146 149 1240 80 1362 91 1403 194 1430 263 1400 386 1359 473Z" fill="none" stroke="#734a2c" stroke-width="7"/></svg>`;
function syncMail(){
  if(!world||!state||!doorScene)return;
  const m=state.mail();root.dataset.mail=m.phase;
  doorScene.hidden=area!=='den';denEnvelope.hidden=area!=='den'||m.phase!=='den-letter'||!!panel;
  world.mailTarget(area==='forest'?(m.phase==='to-friend'?m.host:m.phase==='to-mailman'?'mailman':null):null);
  positionDoor();
}
function positionDoor(){
  if(!doorScene||area!=='den')return;
  const sizes=canvas.style.backgroundSize.split(' ').map(parseFloat),pos=canvas.style.backgroundPosition.split(' ').map(parseFloat);
  if(!sizes[0]||!sizes[1])return;
  Object.assign(doorScene.style,{width:sizes[0]+'px',height:sizes[1]+'px',left:(pos[0]||0)+'px',top:(pos[1]||0)+'px'});
  const ew=Math.max(65,sizes[0]*.075),eh=Math.max(48,ew*85/120);
  Object.assign(denEnvelope.style,{left:((pos[0]||0)+sizes[0]*(1243.5/1448)-ew/2)+'px',top:((pos[1]||0)+sizes[1]*.435)+'px',width:ew+'px',height:eh+'px'});
  denEnvelope.style.setProperty('--ff-mail-start-y',(sizes[1]*(314.5/1086-.435)-eh/2)+'px');
}
function showLetter(fromMailman){
  const before=state.mail();
  if(before.phase==='to-mailman'&&!fromMailman){say('Der Briefträger hat deinen nächsten Brief. Folge dem Pfeil zu ihm.');return;}
  if(before.phase!=='to-friend'&&!state.openLetter()){saveStatus();return;}
  open('letter');syncMail();
  const id=state.mail().host,card=shell('letter');card.classList.add('ff-letter-card');
  const letter=h('div',{class:'ff-letter-paper','aria-label':'Ein Bilderbrief von '+C.hosts[id].name},
    h('div',{class:'ff-letter-stamp'},art('leaf')),art(id,'ff-letter-friend'),
    h('div',{class:'ff-letter-scribbles','aria-hidden':'true',html:'<svg viewBox="0 0 320 100"><path d="M15 18q8-16 18 0t18-2 19 0 22-1m16 0q12-12 24-1t24 0 20-1 25 0 23-2M15 44q10-15 18-1t18 0 24-1 21 0m15 0q14-14 24 0t26-1 22 0 22 0M15 70q9-12 18 0t22 0 22 0m16 0q12-14 24-1t21 0 23-1 25 0 22 0" fill="none" stroke="#877257" stroke-width="3" stroke-linecap="round"/></svg>'}));
  card.append(letter,button('Zum Freund gehen','door',()=>go('forest'),'ff-letter-go'));
  say('Ein Brief von '+C.hosts[id].name+'! Schau auf das Bild. Draussen zeigt dir der Pfeil den Weg.');
}
// Painted pictures where the reviewed art exists: friends from the forest painting and character sheet,
// nouns from the original Waldatelier sheets. Action poses, nuts, shapes and controls stay drawn.
const paintedFriends={fox:'fox-front',squirrel:'squirrel',bird:'bird',owl:'owl',mouse:'mouse'};
const paintedWords={tree:'tree',book:'book',mouse:'mouse',bird:'bird',owl:'owl',fox:'fox',apple:'apple',leaf:'leaf',feathers:'feather',berries:'blueberries',pencils:'pencil',bed:'bed',bag:'picnic',beaver:'beaver',hat:'hat',rose:'rose',nose:'nose',fish:'fish',ball:'ball',boat:'boat',cow:'cow',hare:'rabbit',tin:'tin',bus:'bus',star:'star',whale:'whale'};
function art(name,cls=''){
  if(name==='letter')return h('span',{class:'ff-picture',html:envelopeSVG});
  if(name==='mailman')return h('span',{class:'ff-picture ff-mailman-picture'},FK.visual.art('rabbit'),h('i',{html:envelopeSVG}));
  if(name==='gear')return h('span',{class:'ff-picture '+cls,html:FK.icon('gear')});
  if(name==='nut'||name==='nuts'){const s=h('span',{class:'ff-picture ff-painted-picture '+cls});s.append(FK.woodland.art('nut'));return s;}
  const oldWord={table:'Tisch',leg:'Bein',stone:'Stein'}[name];
  if(oldWord)return h('span',{class:'ff-picture '+cls},FK.play.wordDrawing(oldWord));
  if(paintedFriends[name]&&(!['mouse','bird'].includes(name)||cls.includes('portrait')||cls.includes('letter-friend')))return h('span',{class:'ff-picture ff-painted-picture '+cls},h('img',{src:'assets/forest-friends/'+paintedFriends[name]+'.webp',alt:'',draggable:'false'}));
  if(paintedWords[name]&&FK.visual?.has(paintedWords[name])){const s=h('span',{class:'ff-picture ff-painted-picture '+cls});s.append(FK.visual.art(paintedWords[name]));return s;}
  return h('span',{class:'ff-picture '+cls,html:picture(name)});
}
function button(name,pic,fn,cls=''){return h('button',{type:'button',class:'ff-button '+cls,'aria-label':name,title:name,onclick:()=>{audio?.unlock();fn();}},art(pic));}
function say(text){caption.textContent=text;audio.say(text);}
function saveStatus(){if(!statusBar||!state)return;statusBar.hidden=!state.error&&!pendingDrawing;statusBar.replaceChildren(h('span',{text:state.error||'Dein Bild konnte noch nicht gespeichert werden.'}),button('Erneut speichern','undo',()=>{if(pendingDrawing){const p=pendingDrawing;if(state.draw(p.page,p.strokes))pendingDrawing=null;}else state.retrySave();saveStatus();}),button('Spielstand sichern','bag',()=>download('waldfreunde-spielstand.json',state.exportSave())));}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=h('a',{href:url,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function tick(){const now=performance.now();if(panel==='puzzle'&&!example&&!document.hidden&&state.round(host)?.feedback!=='correct')activeMs+=Math.min(500,now-lastTick);lastTick=now;}
setInterval(tick,100);
function close(){
  tick();if(panel==='puzzle'&&host){state.record('task_leave',{host,activeMilliseconds:activeMs});if(activeMs)state.duration(host,activeMs);activeMs=0;}
  clearTimeout(feedbackTimer);feedbackTimer=null;panel=null;example=false;overlay.hidden=true;overlay.replaceChildren();world.pause(false);nav.hidden=false;renderHotspots();renderLeaves();syncMail();
}
const goldLeaf='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 31C6 15 17 6 34 6c0 17-8 28-24 28z" fill="#f2c23c" stroke="#a8700e" stroke-width="2.5"/><path d="M8 33 27 14" stroke="#a8700e" stroke-width="2" fill="none"/></svg>';
function renderLeaves(bump=false){if(!leaves)return;const total=collectibles.length,n=Object.keys(state.get().collected||{}).length;leaves.hidden=!total||area!=='forest'||!!panel;leaves.innerHTML=goldLeaf+'<b>'+n+'</b><span>/'+total+'</span>';leaves.setAttribute('aria-label',n+' von '+total+' goldenen Blättern gefunden');leaves.classList.toggle('complete',!!total&&n===total);if(bump){leaves.classList.remove('bump');void leaves.offsetWidth;leaves.classList.add('bump');}}
function found(id){if(!state.collect(id)){saveStatus();return;}audio.sparkle();renderLeaves(true);const n=Object.keys(state.get().collected||{}).length;if(n===collectibles.length)say('Hurra! Du hast alle goldenen Blätter gefunden!');else if(n===1)say('Ein goldenes Blatt! Findest du alle '+collectibles.length+'?');}
function open(kind){clearTimeout(feedbackTimer);panel=kind;world.pause(true);nav.hidden=true;if(leaves)leaves.hidden=true;hotspots.replaceChildren();nearButton.hidden=true;overlay.hidden=false;overlay.replaceChildren();}
function shell(titlePic,back=close){const card=h('div',{class:'ff-card'});card.append(h('div',{class:'ff-card-top'},button('Zurück','back',back),art(titlePic,'ff-card-portrait')));overlay.append(card);requestAnimationFrame(()=>card.querySelector('button')?.focus());return card;}
function go(next,restore=false){
  close();if(!restore&&next==='forest'&&area==='den')state.position(exitPoints.den.x,exitPoints.den.z);
  area=next;root.dataset.area=next;if(fader){fader.classList.remove('on');void fader.offsetWidth;fader.classList.add('on');}
  world.setArea(next);state.record('area_transition',{area:next});renderNav();renderHotspots();renderLeaves();syncMail();
  say(next==='den'?'Dein Zuhause. Schau, ob ein Brief für dich da ist.':state.mail().phase==='to-mailman'?'Der Briefträger ist ganz in deiner Nähe. Folge dem Pfeil.':'Folge dem Pfeil zum Freund auf deinem Brief. Tippe auf den Boden, um zu gehen.');
}
function renderNav(){nav.replaceChildren();if(state.development)nav.append(h('strong',{class:'ff-dev',text:'ENTWICKLUNG'}));
  nav.append(button('Bildkarte','map',map),button('Dein Brief','letter',()=>showLetter(false)),button('Anleitung wiederholen','speaker',()=>{state.record('instruction_replay',{area});audio.say(caption.textContent);}),button('Waldspiele','book',()=>games()),button('Einstellungen für Erwachsene','gear',()=>FK.ui.parentGate(settings)));
}
function renderHotspots(){if(panel)return;hotspots.replaceChildren();const ids=area==='forest'?Object.keys(places):['outside','drawing','sleep','games'];for(const id of ids){const p=places[id];if(id==='mailman'&&state.mail().phase!=='to-mailman')continue;const b=button(area==='forest'?p.name:actionNames[id],area==='forest'?p.picture:actionPictures[id],()=>act(id),'ff-hotspot');b.dataset.place=id;hotspots.append(b);}}
function act(id){if(panel)return;if(area==='forest'){
  const destination=places[id];if(!destination)return;
  const p=world.position;if(Math.hypot(p.x-destination.x,p.z-destination.z)>3.2){world.route(id);say('Folge Fuchs zu '+(C.hosts[id]?.name||(id==='home'?'deinem Zuhause':'dem Briefträger'))+'.');return;}
  if(id==='home')go('den');else if(id==='mailman'){if(state.mail().phase==='to-mailman')showLetter(true);else say('Der Briefträger bringt dir nach deinem Besuch einen neuen Brief.');}else if(state.mail().phase==='den-letter')showLetter(false);else meet(id);
}else if(id==='outside'){if(state.mail().phase==='den-letter')showLetter(false);else go('forest');}else if(id==='games')games();else if(id==='drawing')games('atelier');else if(id==='sleep')sequence('sleep');}
// The original Waldspiele and story puzzles open in their own book and return here.
function games(resident){if(panel)close();state.record('games_open',{resident:resident||'all'});world.pause(true);FK.go('forest-book',{from:'friends',...(resident?{resident}:{})});}
function map(){if(state.mail().phase==='den-letter'){showLetter(false);return;}open('map');const card=shell('map');const board=h('div',{class:'ff-map'});for(const[id,p]of Object.entries(places)){const b=button(p.name,p.picture,()=>{if(area!=='forest')go('forest');else close();world.route(id);say('Fuchs geht zu '+(C.hosts[id]?.name||(id==='home'?'deinem Zuhause':'dem Briefträger'))+'.');});if(p.pu!==undefined){b.style.left=(FK.clamp(p.pu,.14,.86)*100)+'%';b.style.top=(FK.clamp(p.pv,.16,.84)*100)+'%';}else{b.style.left=(50+p.x*2.8)+'%';b.style.top=(48+p.z*2.1)+'%';}board.append(b);}card.append(board);say('Wähle ein Bild. Fuchs zeigt dir den Weg.');}
function meet(id){
  if(panel)close();
  const library=FK.friendsLibrary;
  if(state.get().rounds[id]){FK.friendsStartRound(id);return;}
  const pool=[{id:'friends-'+id,host:id},...library.catalogue().filter(g=>g.host===id)];
  const key='friends.next.'+id,index=Number(FK.settings.get(key))||0;
  const selected=pool[index%pool.length];FK.settings.set(key,(index+1)%pool.length);
  if(selected.id.startsWith('friends-'))FK.friendsStartRound(id);
  else{
    world.pause(true);const params={game:selected.id,stage:1};
    if(selected.screen==='read')params.game='wort';
    if(selected.screen==='trace')params.glyph='I';
    if(selected.screen==='dots')params.id=FK.dots.find(d=>d.level===1).id;
    FK.go(selected.screen,params);
  }
}
function taskScene(t,filled=false){
  const scene=h('div',{class:'ff-task-scene'});
  if(t.kind==='count'){scene.classList.add('ff-count');for(let i=0;i<t.count;i++)scene.append(art('nut'));if(!t.count)scene.append(h('div',{class:'ff-empty-basket',html:'<svg viewBox="0 0 240 150" aria-label="Leerer Korb" role="img"><path d="M32 45 Q120 2 208 45 L187 129 Q120 149 53 129 Z" fill="#dfbf87" stroke="#866541" stroke-width="5"/><ellipse cx="120" cy="45" rx="88" ry="27" fill="#f8eed6" stroke="#866541" stroke-width="5"/></svg>'}));}
  else if(t.kind==='shape')scene.innerHTML=shapeScene(t,filled);
  else{scene.append(h('div',{class:'ff-target',text:t.target}));if(t.kind==='rhyme')scene.append(art(t.targetPicture));}
  return scene;
}
function choice(t,value,isExample=false){const isWord=t.kind==='rhyme';const pic=t.kind==='count'?null:isWord?C.words[value]:value;const b=button(t.kind==='count'?value:isWord?value:t.kind==='shape'?shapeNames[value]:'Bild '+(t.choices.indexOf(value)+1),pic||'check',()=>isExample?exampleChoice(b,t,value):answer(value),'ff-answer');b.dataset.answer=value;
  if(t.kind==='count')b.replaceChildren(h('span',{class:'ff-numeral',text:value}));
  if(isWord)b.append(h('span',{class:'ff-word',text:value}));
  return b;
}
function puzzle(){
  const r=state.get().rounds[host];if(!r)return meet(host);if(r.index===5)return reward();
  open('puzzle');example=false;const t=r.tasks[r.index],card=shell(host,close);card.classList.add('ff-illustrated-round');card.dataset.kind=t.kind;card.append(h('h2',{class:'ff-round-title',text:{count:'Nüsse zählen',word:'Wörter und Bilder',rhyme:'Reimpaare lesen',sentence:'Lies und zeig',shape:'Welche Form fehlt?'}[t.kind]}));
  const tools=h('div',{class:'ff-task-tools'},button('Anleitung hören','speaker',()=>{state.help(host,'instruction');say(C.hosts[host].instruction);}),button('Beispiel ansehen','demo',showExample),button('Tipp','help',hint));
  if(state.development)tools.append(button('Aufgabe überspringen (Entwicklung)','skip',()=>answer(t.answer,true)));
  const progress=h('div',{class:'ff-progress','aria-label':r.index+' von 5 Aufgaben gelöst'},Array.from({length:5},(_,i)=>h('span',{class:i<r.index?'done':''},i<r.index?art('check'):'')));
  card.append(progress,tools,taskScene(t,r.feedback==='correct'));
  const choices=h('div',{class:'ff-choices'},t.choices.map(value=>choice(t,value)));card.append(choices,h('div',{class:'ff-feedback','aria-live':'polite'}));
  if(t.kind==='rhyme'){const row=h('div',{class:'ff-word-audio'});for(const word of [t.target,...t.choices])row.append(h('div',{},h('span',{text:word}),button(word+' anhören (Hilfe)','speaker',()=>{state.help(host,'word_audio:'+word);say(word);})));card.append(row);}
  if(r.feedback)showFeedback(r.feedback==='correct',r.selection);
  else say(C.hosts[host].instruction);
}
function answer(value,skip=false){if(example)return;tick();if(!state.answer(host,value,activeMs,skip)){saveStatus();return;}activeMs=0;const r=state.get().rounds[host];if(r.index===5){reward();return;}showFeedback(r.feedback==='correct',value);}
function showFeedback(correct,value){
  const r=state.get().rounds[host],t=r.tasks[r.index];for(const b of overlay.querySelectorAll('.ff-answer')){b.classList.toggle('chosen',b.dataset.answer===String(value));b.classList.toggle('ff-retry',!correct&&b.dataset.answer===String(value));b.disabled=correct;}
  const feedback=overlay.querySelector('.ff-feedback');feedback.replaceChildren(art(correct?'check':'undo'));feedback.dataset.correct=String(correct);
  say(correct?(t.kind==='shape'?('Das '+shapeNames[t.answer]+' passt.'):'Das passt. Danke!'):'Schau noch einmal. Du kannst es ändern.');
  if(correct){const scene=overlay.querySelector('.ff-task-scene');if(t.kind==='shape')scene.innerHTML=shapeScene(t,true);scheduleAdvance();}
}
function scheduleAdvance(){clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>{if(document.hidden||panel!=='puzzle'||example)return scheduleAdvance();if(state.advance(host)){activeMs=0;puzzle();}},1400);}
function hint(){const r=state.get().rounds[host],t=r.tasks[r.index];if(!state.help(host,'hint'))return;
  if(t.kind==='count'){overlay.querySelector('.ff-task-scene').classList.add('ff-frames');say('Zähle jede Nuss einmal. In jeder vollen Reihe liegen fünf Nüsse.');}
  else if(t.kind==='shape'){overlay.querySelector('.ff-task-scene').classList.add('ff-trace');say('Schau auf den Rand der Lücke. Welche Form hat den gleichen Rand?');}
  else{overlay.querySelector('.ff-target').classList.add('ff-letter-help');say('Nimm dir Zeit. Schau jeden Buchstaben an. Du kannst dir das Beispiel ansehen.');}
}
function showExample(){
  const r=state.get().rounds[host];if(!r||r.index===5)return;tick();example=true;state.help(host,'example');clearTimeout(feedbackTimer);const t=C.examples[host];overlay.replaceChildren();const card=shell('demo',()=>{state.seenExample(host);example=false;puzzle();});
  card.append(h('div',{class:'ff-example-banner',html:picture('demo')}),taskScene(t),h('div',{class:'ff-choices'},t.choices.map(v=>choice(t,v,true))),button('Beispiel wiederholen','speaker',()=>say(t.explanation)));
  say(t.explanation+' Mit dem Pfeil geht es zur Aufgabe.');const correct=card.querySelector(`[data-answer="${t.answer}"]`);correct.classList.add('ff-demonstrated');
}
function exampleChoice(b,t,value){b.classList.toggle('ff-retry',value!==t.answer);if(value===t.answer){b.classList.add('chosen');say(t.explanation);}else say('Schau noch einmal auf das Beispiel.');}
function reward(){
  const completedHost=host;
  if(!state.acknowledge(completedHost)){saveStatus();open('completion');const card=shell(completedHost);card.append(button('Weiter zum Briefträger','letter',reward));return;}
  FK.friendsPuzzleCompleted(completedHost);
}
function sequence(item){
  returnArea=area;
  close();open('animation');root.dataset.area='den';world.setArea('den');world.sequence(item);overlay.classList.add('ff-animation-overlay');overlay.append(button('Animation überspringen','skip',()=>endSequence(true),'ff-skip'));
  say('Gute Nacht, kleiner Fuchs.');
}
function endSequence(skipped=false){world.skip();overlay.classList.remove('ff-animation-overlay');if(state.get().animation&&!state.finishAnimation(skipped)){saveStatus();return;}go(returnArea);}
const basic=['#4b3b2d','#c87550','#e2b65d','#73955b','#6d9faf'];
function drawing(){
  open('drawing');const s=state.get(),card=shell('pencils');card.classList.add('ff-drawing-card');
  const tools=h('div',{class:'ff-drawing-tools'});for(const page of ['free',...(s.unlocks.leaf?['leaf']:[])]){const b=button(page==='free'?'Freies Blatt':'Blatt ausmalen',page==='free'?'pencils':'leaf',()=>{if(pendingDrawing&&!state.draw(pendingDrawing.page,pendingDrawing.strokes)){saveStatus();return;}pendingDrawing=null;if(state.selectPage(page))drawing();});b.classList.toggle('chosen',page===s.selectedPage);tools.append(b);}
  let strokes=pendingDrawing?.page===s.selectedPage?pendingDrawing.strokes:s.drawings[s.selectedPage],colour=basic[0],current=null;
  const cv=h('canvas',{class:'ff-paper',width:800,height:600,'aria-label':'Zeichenpapier. Mit Finger, Stift oder Maus malen.'});
  const ctx=cv.getContext('2d');
  function repaint(){ctx.fillStyle='#fffaf0';ctx.fillRect(0,0,800,600);if(s.selectedPage==='leaf'){ctx.strokeStyle='#7d7858';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(210,500);ctx.bezierCurveTo(100,200,380,50,600,70);ctx.bezierCurveTo(740,370,410,530,210,500);ctx.stroke();ctx.beginPath();ctx.moveTo(190,535);ctx.lineTo(580,90);ctx.moveTo(310,400);ctx.lineTo(290,250);ctx.moveTo(400,300);ctx.lineTo(565,290);ctx.stroke();}for(const stroke of [...strokes,...(current?[current]:[])]){ctx.strokeStyle=stroke.colour;ctx.lineWidth=7;ctx.lineCap=ctx.lineJoin='round';ctx.beginPath();stroke.points.forEach(([x,y],i)=>i?ctx.lineTo(x*800,y*600):ctx.moveTo(x*800,y*600));if(stroke.points.length===1)ctx.lineTo(stroke.points[0][0]*800+.1,stroke.points[0][1]*600);ctx.stroke();}}
  const colours=[...basic,...(s.unlocks.pencils?['#a07eaf','#d79cb1','#e9d8b0','#3a6265']:[])];
  const palette=h('div',{class:'ff-palette','aria-label':'Stiftfarben'});for(const c of colours){const b=h('button',{type:'button','aria-label':'Stiftfarbe '+c,'aria-pressed':String(c===colour),style:{backgroundColor:c},onclick:()=>{colour=c;for(const el of palette.children)el.setAttribute('aria-pressed',String(el===b));}});palette.append(b);}
  const point=e=>{const r=cv.getBoundingClientRect();return [FK.clamp((e.clientX-r.left)/r.width,0,1),FK.clamp((e.clientY-r.top)/r.height,0,1)];};
  cv.onpointerdown=e=>{if(current||strokes.length>=2000)return;cv.setPointerCapture(e.pointerId);current={colour,points:[point(e)]};repaint();};
  cv.onpointermove=e=>{if(!current)return;if(current.points.length<4000)current.points.push(point(e));repaint();};
  const finish=()=>{if(!current)return;strokes=[...strokes,current];current=null;pendingDrawing={page:s.selectedPage,strokes};if(state.draw(s.selectedPage,strokes))pendingDrawing=null;saveStatus();repaint();};cv.onpointerup=finish;cv.onpointercancel=finish;
  tools.append(button('Letzten Strich zurücknehmen','undo',()=>{strokes=strokes.slice(0,-1);pendingDrawing={page:s.selectedPage,strokes};if(state.draw(s.selectedPage,strokes))pendingDrawing=null;repaint();}));
  card.append(tools,cv,palette);repaint();say('Wähle einen Stift und male auf das Papier. Dein Bild bleibt auf diesem Blatt.');
}
function settings(){open('settings');const card=shell('gear');card.classList.add('ff-adult');card.append(h('h1',{text:'Für Erwachsene'}),h('p',{text:'Spielstand und anonyme Spielereignisse bleiben auf diesem Gerät. Keine automatische Übertragung an KI. Das Protokoll enthält Aufgaben, Antworten, Hilfen, aktive Spielzeit und Waldpositionen, keine Bilder oder Namen. Aufbewahrung: höchstens 7 Tage und 10 000 Ereignisse.'}));
  for(const[name,label]of [['music','Musik'],['ambience','Waldgeräusche'],['speech','Sprache']]){const input=h('input',{type:'checkbox',checked:state.get().settings[name],onchange:e=>{if(!state.setting(name,e.target.checked))e.target.checked=state.get().settings[name];audio.update();}});card.append(h('label',{},input,label));}
  for(const[label,fn]of [['Protokoll exportieren',()=>download('waldfreunde-protokoll.json',state.exportLog())],['Nur Protokoll löschen',()=>{state.clearLog();say('Das Protokoll wurde gelöscht. Dein Spielstand bleibt erhalten.');}],['Spielstand sichern',()=>download('waldfreunde-spielstand.json',state.exportSave())]])card.append(h('button',{type:'button',text:label,onclick:fn}));
  card.append(h('p',{text:'Frühere Herzbaum-Fortschritte, Sterne und Bilder wurden nicht verändert. Sie bleiben im bisherigen Spiel zugänglich.'}),h('a',{href:'?screen=forest',text:'Bisherigen Herzbaum öffnen'}),h('a',{href:'?screen=hub',text:'Bisherige Bilder und Waldspiele öffnen'}),h('a',{href:'?dev=1',text:'Getrennte Entwicklungsversion öffnen'}));
}
FK.screen('friends',{
  build(el){root=el;root.classList.add('ff-game');root.dataset.area=area;canvas=h('canvas',{class:'ff-world','aria-label':'Dreidimensionale Waldwelt'});hotspots=h('div',{class:'ff-hotspots'});nav=h('nav',{class:'ff-nav','aria-label':'Waldmenü'});overlay=h('div',{class:'ff-overlay',hidden:true,role:'dialog','aria-label':'Waldaktivität','aria-modal':'true'});statusBar=h('div',{class:'ff-save-status',role:'alert',hidden:true});caption=h('div',{class:'ff-caption','aria-live':'polite'});nearButton=button('Mit Freund sprechen','check',()=>act(world.near),'ff-near');nearButton.hidden=true;
    doorScene=h('div',{class:'ff-den-door',html:doorSVG,'aria-hidden':'true'});
    denEnvelope=button('Brief öffnen','letter',()=>showLetter(false),'ff-den-envelope');
    leaves=h('div',{class:'ff-leaves',role:'status',hidden:true});fader=h('div',{class:'ff-fader','aria-hidden':'true'});
    root.append(canvas,doorScene,denEnvelope,hotspots,nav,nearButton,caption,leaves,fader,overlay,statusBar);
    let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('storage blocked');},setItem(){throw new Error('storage blocked');},removeItem(){}};}
    state=window.FriendsState.create({storage,content:C,development:new URLSearchParams(location.search).get('dev')==='1',onStatus:()=>queueMicrotask(saveStatus)});
    FK.friends=state;
    audio=createAudio(()=>state.audioSettings());
    world=createWorld(canvas,{position:()=>state.get().world,onPosition:(x,z)=>state.position(x,z),onMove:e=>state.record(e.event,e),onNear:()=>{},onAction:act,onAnimationEnd:()=>endSequence(false),onCollect:found,collected:()=>state.get().collected||{},onProject:items=>{positionDoor();for(const p of items){const b=hotspots.querySelector(`[data-place="${p.id}"]`);if(b){b.hidden=!p.visible;b.style.left=p.x+'px';b.style.top=p.y+'px';}}}});
    FK.friendsView=()=>world.diagnostics;renderNav();renderHotspots();renderLeaves();saveStatus();
    const interrupted=state.get().animation;if(interrupted)state.finishAnimation(true);
    if(state.mail().phase==='to-mailman'){go('forest',true);world.summonMailman();}
    else say(state.mail().phase==='den-letter'?'Oh, ein Brief! Er kommt durch die Briefklappe. Tippe auf den Umschlag.':'Dein Brief wartet auf dich. Er zeigt dir, wen du besuchen kannst.');
    syncMail();
    document.addEventListener('visibilitychange',()=>{tick();if(document.hidden){if(panel==='puzzle'&&activeMs){state.duration(host,activeMs);activeMs=0;}state.record('pause',{reason:'hidden'});}else state.record('resume',{reason:'visible'});});
    window.addEventListener('pagehide',()=>{tick();if(panel==='puzzle'&&activeMs){state.duration(host,activeMs);activeMs=0;}state.record('session_end');});
    root.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel){e.preventDefault();e.stopPropagation();if(panel==='animation')endSequence(true);else close();}if(e.key==='Tab'&&panel){const list=[...overlay.querySelectorAll('button:not(:disabled),a,input')].filter(el=>!el.hidden);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){last?.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first?.focus();e.preventDefault();}}});
    if(state.development){const dock=h('div',{class:'ff-dev-dock'},Object.entries(C.hosts).map(([id,data])=>button(data.name+' direkt öffnen',id,()=>meet(id))));root.append(dock);}
  },
  enter(){world?.pause(!!panel);renderHotspots();syncMail();},leave(){world?.pause(true);audio?.dispose();if(state)audio=createAudio(()=>state.audioSettings());}
});
// Shared book callbacks return to the paused world before opening a round/saved sheet.
FK.friendsPuzzleCompleted=id=>{
  const matching=state.mail().host===id;
  if(matching&&state.mail().phase==='to-friend'&&!state.completeMail(id)){saveStatus();return;}
  if(FK.current()!=='friends')FK.go('friends');
  go(state.mail().phase==='den-letter'?'den':'forest');
  if(matching&&state.mail().phase==='to-mailman'){world.summonMailman();syncMail();say('Danke fürs Helfen! Der Briefträger wartet mit einem neuen Brief auf dich. Folge dem Pfeil.');}
};
FK.friendsStartRound=id=>{FK.go('friends');host=id;if(state.start(id)){activeMs=0;puzzle();if(!state.get().seenExamples[id])showExample();}};
FK.friendsSavedSheets=()=>{FK.go('friends');drawing();};
FK.go('friends');
