import {createWorld,places,exitPoints} from './world.js';
import {createAudio} from './audio.js';
const FK=window.FK,h=FK.h,C=window.FriendsContent;
let root,canvas,world,state,audio,overlay,hotspots,nav,statusBar,nearButton,caption,fader,doorScene,denEnvelope;
let area='den',panel=null,host=null,example=false,feedbackTimer=null,activeMs=0,lastTick=performance.now(),pendingDrawing=null,returnArea='den',finalSleep=false;
const actionPictures={outside:'door'};
const actionNames={outside:'Nach draussen'};
const envelopeSVG='<svg viewBox="0 0 120 85" aria-hidden="true"><rect x="3" y="5" width="114" height="75" rx="7" fill="#fff6dc" stroke="#967044" stroke-width="3"/><path d="m5 76 40-33m70 33L75 43M5 9l55 43 55-43" fill="none" stroke="#b59466" stroke-width="3"/><circle cx="60" cy="53" r="9" fill="#a9bb85"/><path d="m56 53 3 3 5-7" fill="none" stroke="#547043" stroke-width="2"/></svg>';
const doorSVG=`<svg viewBox="0 0 1448 1086" preserveAspectRatio="none"><defs><linearGradient id="letter-flap" x2="0" y2="1"><stop stop-color="#cc9743"/><stop offset=".5" stop-color="#e5bd70"/><stop offset="1" stop-color="#ae7633"/></linearGradient></defs><rect class="ff-mail-opening" x="1180" y="280" width="106" height="34" rx="3" fill="#49331f"/><rect class="ff-mail-lid" x="1180" y="280" width="106" height="34" rx="3" fill="url(#letter-flap)" stroke="#d7af64" stroke-width="2"/></svg>`;
function syncMail(){
  if(!world||!state||!doorScene)return;
  const m=state.mail();root.dataset.mail=m.phase;
  doorScene.hidden=area!=='den';denEnvelope.hidden=area!=='den'||m.phase!=='den-letter'||!!panel;
  world.mailTarget(area==='forest'?(m.phase==='to-friend'?m.host:m.phase==='to-mailman'?'mailman':['return-home','den-letter'].includes(m.phase)?'home':null):null);
  positionDoor();
}
function positionDoor(){
  if(!doorScene||area!=='den')return;
  const sizes=canvas.style.backgroundSize.split(' ').map(parseFloat),pos=canvas.style.backgroundPosition.split(' ').map(parseFloat);
  if(!sizes[0]||!sizes[1])return;
  Object.assign(doorScene.style,{width:sizes[0]+'px',height:sizes[1]+'px',left:(pos[0]||0)+'px',top:(pos[1]||0)+'px'});
  const ew=Math.max(65,sizes[0]*.075),eh=Math.max(48,ew*85/120);
  Object.assign(denEnvelope.style,{left:((pos[0]||0)+sizes[0]*(1233/1448)-ew/2)+'px',top:((pos[1]||0)+sizes[1]*.435)+'px',width:ew+'px',height:eh+'px'});
  denEnvelope.style.setProperty('--ff-mail-start-y',(sizes[1]*(297/1086-.435)-eh/2)+'px');
}
function showLetter(fromMailman){
  const before=state.mail();
  if(!['den-letter','to-friend','to-mailman'].includes(before.phase)){say('Fuchs geht jetzt nach Hause schlafen.');return;}
  if(before.phase==='den-letter'&&area!=='den')return;
  if(before.phase==='to-mailman'&&!fromMailman){say('Der Briefträger hat deinen nächsten Brief. Folge dem Pfeil zu ihm.');return;}
  if(before.phase!=='to-friend'&&!state.openLetter()){saveStatus();return;}
  open('letter');syncMail();
  const id=state.mail().host;
  overlay.classList.add('ff-postcard-overlay');
  const letter=h('button',{type:'button',class:'ff-letter-paper','data-host':id,'aria-label':'Zum Freund gehen',onclick:()=>go('forest')},
    h('div',{class:'ff-letter-stamp'},art('leaf')),letterPortrait(id),
    h('div',{class:'ff-letter-scribbles','aria-hidden':'true',html:'<svg viewBox="0 0 320 100"><path d="M15 18q8-16 18 0t18-2 19 0 22-1m16 0q12-12 24-1t24 0 20-1 25 0 23-2M15 44q10-15 18-1t18 0 24-1 21 0m15 0q14-14 24 0t26-1 22 0 22 0M15 70q9-12 18 0t22 0 22 0m16 0q12-14 24-1t21 0 23-1 25 0 22 0" fill="none" stroke="#877257" stroke-width="3" stroke-linecap="round"/></svg>'}));
  overlay.append(letter);requestAnimationFrame(()=>letter.focus());
  say('Ein Brief von '+C.hosts[id].name+'! Schau auf das Bild. Draussen zeigt dir der Pfeil den Weg.');
}
function letterPortrait(id){
 const pic=FK.friendsArt.portrait(id);pic.classList.add('ff-letter-friend');pic.setAttribute('role','img');pic.setAttribute('aria-label',C.hosts[id].name);pic.dataset.friend=id;return pic;
}
// Character identity, utility controls and drawn subjects have separate sources.
function art(name,cls=''){
 const id=name.startsWith('friend-')?name.slice(7):name;
 if(C.hosts[id]||['fox','mailman'].includes(id))return h('span',{class:'ff-picture '+cls},FK.friendsArt.portrait(id));
 const control={pencils:'pencil',gallery:'gallery',door:'home',bag:'book',skip:'next'}[name]||name;
 if(FK.icons.has(control))return h('span',{class:'ff-picture '+cls},FK.icons.element(control));
 return h('span',{class:'ff-picture ff-painted-picture '+cls},FK.visual.art(name));
}
function button(name,pic,fn,cls=''){return h('button',{type:'button',class:'ff-button '+cls,'aria-label':name,title:name,onclick:()=>{audio?.unlock();fn();}},art(pic));}
function say(text){caption.textContent=text;caption.hidden=panel!=='puzzle';}
function saveStatus(){if(!statusBar||!state)return;statusBar.hidden=!state.error&&!pendingDrawing;statusBar.replaceChildren(h('span',{text:state.error||'Dein Bild konnte noch nicht gespeichert werden.'}),button('Erneut speichern','undo',()=>{if(pendingDrawing){const p=pendingDrawing;if(state.draw(p.page,p.strokes))pendingDrawing=null;}else state.retrySave();saveStatus();}),button('Spielstand sichern','bag',()=>download('waldfreunde-spielstand.json',state.exportSave())));}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=h('a',{href:url,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function tick(){const now=performance.now();if(panel==='puzzle'&&!example&&!document.hidden&&state.round(host)?.feedback!=='correct')activeMs+=Math.min(500,now-lastTick);lastTick=now;}
setInterval(tick,100);
function close(){
  overlay.classList.remove('ff-postcard-overlay','ff-session-end-overlay');
  FK.forestVoice.cancel();
  tick();if(panel==='puzzle'&&host){state.record('task_leave',{host,activeMilliseconds:activeMs});if(activeMs)state.duration(host,activeMs);activeMs=0;}
  clearTimeout(feedbackTimer);feedbackTimer=null;panel=null;example=false;overlay.hidden=true;overlay.replaceChildren();world.pause(false);nav.hidden=false;renderHotspots();caption.hidden=true;syncMail();
}
function open(kind){clearTimeout(feedbackTimer);panel=kind;world.pause(true);nav.hidden=true;hotspots.replaceChildren();nearButton.hidden=true;overlay.hidden=false;overlay.replaceChildren();}
function shell(titlePic,back=close){const card=h('div',{class:'ff-card'});card.append(h('div',{class:'ff-card-top'},button('Zurück','back',back),art(titlePic,'ff-card-portrait')));overlay.append(card);requestAnimationFrame(()=>card.querySelector('button')?.focus());return card;}
function go(next,restore=false){
  if(next!=='den'&&['sleeping','finished'].includes(state.mail().phase))return;
  close();if(!restore&&next==='forest'&&area==='den')state.position(exitPoints.den.x,exitPoints.den.z);
  area=next;root.dataset.area=next;if(fader){fader.classList.remove('on');void fader.offsetWidth;fader.classList.add('on');}
  world.setArea(next);audio.setArea(next);state.record('area_transition',{area:next});renderNav();renderHotspots();caption.hidden=true;syncMail();
  if(next==='den'&&state.mail().phase==='return-home'){if(state.beginSleep())sequence('sleep',true);else saveStatus();return;}
  if(next==='den'&&state.mail().phase==='sleeping'){sequence('sleep',true);return;}
  if(state.mail().phase==='finished'){showSessionEnd();return;}
  say(next==='den'?'Dein Zuhause. Schau, ob ein Brief für dich da ist.':state.mail().phase==='to-mailman'?'Der Briefträger ist ganz in deiner Nähe. Folge dem Pfeil.':'Folge dem Pfeil zum Freund auf deinem Brief. Tippe auf den Boden, um zu gehen.');
}
function renderNav(){nav.replaceChildren();if(state.development)nav.append(h('strong',{class:'ff-dev',text:'ENTWICKLUNG'}));
  if(!['sleeping','finished'].includes(state.mail().phase)){
    nav.append(button('Bildkarte','map',map));
    if(['den-letter','to-friend','to-mailman'].includes(state.mail().phase))nav.append(button('Dein Brief','letter',()=>showLetter(false)));
  }
  nav.append(button('Einstellungen für Erwachsene','gear',()=>FK.ui.parentGate(settings)));
}
function renderHotspots(){if(panel)return;hotspots.replaceChildren();if(['sleeping','finished'].includes(state.mail().phase))return;
  const ids=area==='forest'?Object.keys(places):['outside'];
  for(const id of ids){const p=places[id],m=state.mail();if(id==='mailman'&&m.phase!=='to-mailman')continue;
    const b=button(area==='forest'?p.name:actionNames[id],area==='forest'?p.picture:actionPictures[id],()=>act(id),'ff-hotspot');b.dataset.place=id;
    b.classList.toggle('ff-invited',area==='forest'&&((m.phase==='to-friend'&&m.host===id)||(m.phase==='to-mailman'&&id==='mailman')||(m.phase==='return-home'&&id==='home')));hotspots.append(b);
  }
}
function act(id){if(panel||['sleeping','finished'].includes(state.mail().phase))return;if(area==='forest'){
  const destination=places[id];if(!destination)return;
  const p=world.position;if(Math.hypot(p.x-destination.x,p.z-destination.z)>3.2){world.route(id);say('Folge Fuchs zu '+(C.hosts[id]?.name||(id==='home'?'deinem Zuhause':'dem Briefträger'))+'.');return;}
  if(id==='home')go('den');else if(id==='mailman'){if(state.mail().phase==='to-mailman')showLetter(true);}else meet(id);
}else if(id==='outside'){if(state.mail().phase==='den-letter')showLetter(false);else go('forest');}}
// The picture map is drawn from the world (tools/map/): a place's pin is where it lies on it.
const MAP={x0:-168,x1:168,z0:-112,z1:112};   // as world/big/layout.js MAP
const mapPins=new Proxy({},{get:(_,id)=>{const p=places[id],[x,z]=p.map||[p.x,p.z];return [(x-MAP.x0)/(MAP.x1-MAP.x0),(z-MAP.z0)/(MAP.z1-MAP.z0)];}});
function map(){
  if(state.mail().phase==='den-letter'){showLetter(false);return;}
  open('map');const card=shell('map');card.classList.add('ff-map-card');
  const board=h('div',{class:'ff-map ff-map-storybook','aria-label':'Bildkarte des Waldes'}),mail=state.mail();
  for(const [id,p]of Object.entries(places)){
    if(id==='mailman')continue;
    const b=button(p.name,p.picture,()=>{if(area!=='forest')go('forest');else close();world.route(id);});
    b.replaceChildren(FK.friendsArt.portrait(id==='home'?'fox':id));b.dataset.place=id;
    const invited=mail.phase==='to-friend'&&mail.host===id||mail.phase==='return-home'&&id==='home';b.classList.toggle('ff-map-invited',invited);if(invited)b.append(h('span',{class:'ff-map-invitation'},FK.icons.element('letter')));
    const [x,y]=mapPins[id];b.style.left=(x*100)+'%';b.style.top=(y*100)+'%';board.append(b);
  }
  // On a phone the map is wider than the screen (eleven pins need room) and scrolls sideways, starting at the den.
  const scroller=h('div',{class:'ff-map-scroll'},board);card.append(scroller);requestAnimationFrame(()=>{scroller.scrollLeft=(scroller.scrollWidth-scroller.clientWidth)/2;});
  if(mail.phase==='to-mailman'){
    const b=button('Zum Briefträger','mailman',()=>{if(area!=='forest')go('forest');else close();world.route('mailman');},'ff-map-courier');
    b.replaceChildren(FK.friendsArt.portrait('mailman'),h('span',{text:'Zum Briefträger'}));b.dataset.place='mailman';card.append(b);
  }
}
function meet(id){
  if(!state.canPuzzle(id)){FK.ui.toast(state.mail().phase==='return-home'?'Fuchs geht nach Hause schlafen.':'Dein Brief zeigt dir deinen Freund.');return;}
  const game=FK.friendsLibrary.pick(id);if(!game){FK.ui.toast('Dieses Puzzle wartet noch auf die Freigabe von Erwachsenen.');return;}
  if(panel)close();world.pause(true);FK.friendsLibrary.visit(game);
}
function sequence(item,finish=false){
  finalSleep=finish;returnArea=area;
  close();open('animation');root.dataset.area='den';world.setArea('den');world.sequence(item,{hold:finish});overlay.classList.add('ff-animation-overlay');
  if(!finish)overlay.append(button('Animation überspringen','skip',()=>endSequence(true),'ff-skip'));
  say('Gute Nacht, kleiner Fuchs.');
}
function showSessionEnd(){
  open('session-end');overlay.classList.remove('ff-animation-overlay');overlay.classList.add('ff-session-end-overlay');
  const count=state.mail().session.completed;
  overlay.append(h('section',{class:'ff-card ff-session-end',role:'status'},FK.friendsArt.portrait('fox-sleep'),h('h2',{text:'Gute Nacht, Fuchs!'}),h('p',{text:count+' '+(count===1?'Brief geschafft.':'Briefe geschafft.')+' Deine Briefreise ist zu Ende.'}),button('Einstellungen für Erwachsene','gear',()=>FK.ui.parentGate(settings))));
}
function endSequence(skipped=false){
  if(finalSleep){if(state.mail().phase==='sleeping'&&!state.finishLetterSession()){saveStatus();return;}showSessionEnd();return;}
  world.skip();overlay.classList.remove('ff-animation-overlay');if(state.get().animation&&!state.finishAnimation(skipped)){saveStatus();return;}go(returnArea);
}
function settings(){FK.go('settings');}
FK.screen('friends',{
  build(el){root=el;root.classList.add('ff-game');root.dataset.area=area;canvas=h('canvas',{class:'ff-world','aria-label':'Dreidimensionale Waldwelt'});hotspots=h('div',{class:'ff-hotspots'});nav=h('nav',{class:'ff-nav','aria-label':'Waldmenü'});overlay=h('div',{class:'ff-overlay',hidden:true,role:'dialog','aria-label':'Waldaktivität','aria-modal':'true'});statusBar=h('div',{class:'ff-save-status',role:'alert',hidden:true});caption=h('div',{class:'ff-caption','aria-live':'polite'});nearButton=button('Mit Freund sprechen','check',()=>act(world.near),'ff-near');nearButton.hidden=true;
    doorScene=h('div',{class:'ff-den-door',html:doorSVG,'aria-hidden':'true'});
    denEnvelope=button('Brief öffnen','letter',()=>showLetter(false),'ff-den-envelope');
    fader=h('div',{class:'ff-fader','aria-hidden':'true'});
    root.append(canvas,doorScene,denEnvelope,hotspots,nav,nearButton,caption,fader,overlay,statusBar);
    let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('storage blocked');},setItem(){throw new Error('storage blocked');},removeItem(){}};}
    state=window.FriendsState.create({storage,content:C,development:new URLSearchParams(location.search).get('dev')==='1',onStatus:()=>queueMicrotask(saveStatus)});
    FK.friends=state;
    audio=createAudio(()=>state.audioSettings(),()=>world?.soundscape);FK.friendsAudio=audio;
    world=createWorld(canvas,{position:()=>state.get().world,onPosition:(x,z,region)=>state.position(x,z,region),onMove:e=>state.record(e.event,e),onNear:()=>{},onAction:act,onAnimationEnd:()=>endSequence(false),onProject:items=>{positionDoor();for(const p of items){const b=hotspots.querySelector(`[data-place="${p.id}"]`);if(b){b.hidden=!p.visible;b.style.left=p.x+'px';b.style.top=p.y+'px';}}}});
    FK.friendsView=()=>world.diagnostics;renderNav();renderHotspots();saveStatus();
    const interrupted=state.get().animation;if(interrupted)state.finishAnimation(true);
    if(['return-home','sleeping','finished'].includes(state.mail().phase)){go('den',true);}
    else say(state.mail().phase==='den-letter'?'Oh, ein Brief! Er kommt durch die Briefklappe. Tippe auf den Umschlag.':'Dein Brief wartet auf dich. Er zeigt dir, wen du besuchen kannst.');
    syncMail();
    document.addEventListener('visibilitychange',()=>{tick();if(document.hidden){if(panel==='puzzle'&&activeMs){state.duration(host,activeMs);activeMs=0;}state.record('pause',{reason:'hidden'});}else state.record('resume',{reason:'visible'});});
    window.addEventListener('pagehide',()=>{tick();if(panel==='puzzle'&&activeMs){state.duration(host,activeMs);activeMs=0;}state.record('session_end');});
    root.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel){e.preventDefault();e.stopPropagation();if(panel==='session-end')return;if(panel==='animation')endSequence(true);else close();}if(e.key==='Tab'&&panel){const list=[...overlay.querySelectorAll('button:not(:disabled),a,input')].filter(el=>!el.hidden);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){last?.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first?.focus();e.preventDefault();}}});
    if(state.development){const dock=h('div',{class:'ff-dev-dock'},Object.entries(C.hosts).map(([id,data])=>button(data.name+' direkt öffnen',id,()=>act(id))));root.append(dock);}
  },
  enter(){if(state?.mail().phase==='finished'){if(!finalSleep){world.setArea('den');world.sequence('sleep',{hold:true});finalSleep=true;}showSessionEnd();return;}world?.pause(!!panel);if(state?.mail().phase==='to-mailman')world?.summonMailman();renderHotspots();syncMail();},leave(){world?.pause(true);FK.forestVoice.cancel();}
});
// Shared book callbacks return to the paused world before opening a round/saved sheet.
FK.friendsPuzzleCompleted=id=>{
  const matching=state.mail().host===id;
  if(matching&&state.mail().phase==='to-friend'&&!state.completeMail(id)){saveStatus();return;}
  if(FK.current()!=='friends')FK.go('friends');
  go(state.mail().phase==='den-letter'?'den':'forest');
  if(matching&&state.mail().phase==='return-home'){syncMail();say('Alle Briefe geschafft. Folge dem Pfeil nach Hause zum Schlafen.');}
  if(matching&&state.mail().phase==='to-mailman'){world.summonMailman();syncMail();say('Danke fürs Helfen! Der Briefträger wartet mit einem neuen Brief auf dich. Folge dem Pfeil.');}
};
FK.friendsStartRound=id=>{if(area==='forest')act(id);};
FK.friendsStartSession=limit=>{
  if(!state.startLetterSession(limit)){saveStatus();return false;}
  finalSleep=false;world.skip();if(FK.current()!=='friends')FK.go('friends');go('den',true);return true;
};
FK.go('friends');
