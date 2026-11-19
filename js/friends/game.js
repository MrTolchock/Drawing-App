import {createWorld,places,exitPoints} from './world.js';
import {createAudio} from './audio.js';
import {mapPoint,mapPin,extraMapPlaces} from './map-layout.js';
const FK=window.FK,h=FK.h,C=window.FriendsContent;
let root,canvas,world,state,audio,overlay,hotspots,nav,statusBar,nearButton,caption,fader,doorScene,denEnvelope,framing=false,backdropTap=null;
let area='den',panel=null,host=null,example=false,feedbackTimer=null,activeMs=0,lastTick=performance.now(),returnArea='den',finalSleep=false;
const actionPictures={outside:'door'};
const actionNames={outside:'Nach draussen'};
const doorSVG=`<svg viewBox="0 0 1448 1086" preserveAspectRatio="none"><defs><linearGradient id="letter-flap" x2="0" y2="1"><stop stop-color="#cc9743"/><stop offset=".5" stop-color="#e5bd70"/><stop offset="1" stop-color="#ae7633"/></linearGradient></defs><rect class="ff-mail-opening" x="1180" y="280" width="106" height="34" rx="3" fill="#49331f"/><rect class="ff-mail-lid" x="1180" y="280" width="106" height="34" rx="3" fill="url(#letter-flap)" stroke="#d7af64" stroke-width="2"/></svg>`;
function syncMail(){
  if(!world||!state||!doorScene)return;
  const m=state.mail();root.dataset.mail=m.phase;
  const arriving=denEnvelope.hidden;doorScene.hidden=area!=='den';denEnvelope.hidden=area!=='den'||m.phase!=='den-letter'||!!panel;
  if(arriving&&!denEnvelope.hidden)audio?.cue({type:'letterbox',pan:.55});   // the letter comes through the flap (timed to its animation)
  world.mailTarget(area==='forest'?(m.phase==='to-friend'?m.host:m.phase==='to-mailman'?'mailman':['return-home','den-letter'].includes(m.phase)?'home':null):null);
  // The day follows the journey: morning for the first letter, golden afternoon in the middle, dusk on the way home.
  // Time passes while a puzzle is solved, so the new hour is there at once when the forest shows again (no crawling shadows).
  const j=m.session||{limit:1,completed:0};world.timeOfDay?.(['return-home','sleeping','finished'].includes(m.phase)?1:j.limit>1?Math.min(1,j.completed/(j.limit-1))*.55:0,true);
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
  const letter=h('button',{type:'button',class:'ff-letter-paper','data-host':id,'aria-label':'Zum Freund gehen','aria-description':'Ein Brief von '+C.hosts[id].name,onclick:()=>go('forest')},letterPortrait(id));
  const article = ['bird','mouse'].includes(id) ? 'die' : ['squirrel','deer'].includes(id) ? 'das' : 'der';
  const greeting = 'Hallo! Ich bin '+article+' '+C.hosts[id].name+'. Ich habe ein Rätsel für dich. Der Pfeil zeigt dir den Weg zu mir.';
  const listen = h('button',{type:'button',class:'play-listen','aria-label':'Brief vorlesen','aria-pressed':'false'},FK.icons.element('speaker'));
  listen.addEventListener('click',()=>FK.forestVoice.explain(greeting,state=>{
    listen.setAttribute('aria-pressed',String(state==='playing'||state==='loading'));
  }));
  overlay.append(h('div',{class:'ff-letter-with-voice'},letter,listen));
  requestAnimationFrame(()=>letter.focus());
}
function letterPortrait(id){
 const pic=FK.friendsArt.letterPortrait(id);pic.classList.add('ff-letter-friend');pic.removeAttribute('aria-hidden');pic.setAttribute('role','img');pic.setAttribute('aria-label',C.hosts[id].name);pic.dataset.friend=id;return pic;
}
// Character identity, utility controls and drawn subjects have separate sources.
function art(name,cls=''){
 const id=name.startsWith('friend-')?name.slice(7):name;
 if(C.hosts[id]||['fox','mailman','ibex'].includes(id))return h('span',{class:'ff-picture '+cls},FK.friendsArt.portrait(id));
 if(FK.hudArt?.has(name))return h('span',{class:'ff-picture ff-hud-picture '+cls},FK.hudArt.element(name));   // the world's own painted buttons
 const control={pencils:'pencil',gallery:'gallery',door:'home',bag:'book',skip:'next'}[name]||name;
 if(FK.icons.has(control))return h('span',{class:'ff-picture '+cls},FK.icons.element(control));
 return h('span',{class:'ff-picture ff-painted-picture '+cls},FK.visual.art(name));
}
function button(name,pic,fn,cls=''){const b=h('button',{type:'button',class:'ff-button '+cls,'aria-label':name,title:name,onclick:()=>{audio?.unlock();fn();}},art(pic));return pic==='back'?FK.hudArt.decorateBack(b):b;}
function say(text){caption.textContent=text;caption.hidden=panel!=='puzzle';}
function saveStatus(){if(!statusBar||!state)return;statusBar.hidden=!state.error;statusBar.replaceChildren(...(state.error?[h('span',{text:state.error}),button('Erneut versuchen','undo',()=>{state.retrySave();saveStatus();})]:[]));}
function tick(){const now=performance.now();if(panel==='puzzle'&&!example&&!document.hidden&&state.round(host)?.feedback!=='correct')activeMs+=Math.min(500,now-lastTick);lastTick=now;}
setInterval(tick,100);
function close({restoreFocus=true}={}){
  const returnLabel=restoreFocus?(panel==='map'?'Bildkarte':panel==='letter'?'Dein Brief':null):null;backdropTap=null;
  overlay.classList.remove('ff-postcard-overlay','ff-session-end-overlay');
  FK.forestVoice.cancel();
  tick();if(panel==='puzzle'&&host){state.record('task_leave',{host,activeMilliseconds:activeMs});if(activeMs)state.duration(host,activeMs);activeMs=0;}
  clearTimeout(feedbackTimer);feedbackTimer=null;panel=null;example=false;overlay.hidden=true;overlay.replaceChildren();world.pause(false);nav.hidden=false;renderHotspots();caption.hidden=true;syncMail();
  if(returnLabel)requestAnimationFrame(()=>{if(!panel&&!nav.hidden&&FK.current()==='friends')nav.querySelector('[aria-label="'+returnLabel+'"]')?.focus({preventScroll:true});});
}
function open(kind){clearTimeout(feedbackTimer);backdropTap=null;panel=kind;world.pause(true);nav.hidden=true;hotspots.replaceChildren();nearButton.hidden=true;overlay.hidden=false;overlay.setAttribute('aria-label',kind==='map'?'Bildkarte des Waldes':'Waldaktivität');overlay.replaceChildren();}
function go(next,restore=false){
  if(next!=='den'&&['sleeping','finished'].includes(state.mail().phase))return;
  close({restoreFocus:false});if(!restore&&next==='forest'&&area==='den')state.position(exitPoints.den.x,exitPoints.den.z);
  const from=area;area=next;root.dataset.area=next;if(fader){fader.classList.remove('on');void fader.offsetWidth;fader.classList.add('on');}
  world.setArea(next);audio.setArea(next);if(!restore&&from!==next)audio.cue({type:'door',pan:.5});state.record('area_transition',{area:next});renderNav();renderHotspots();caption.hidden=true;syncMail();
  if(next==='den'&&state.mail().phase==='return-home'){if(state.beginSleep())sequence('sleep',true);else saveStatus();return;}
  if(next==='den'&&state.mail().phase==='sleeping'){sequence('sleep',true);return;}
  if(state.mail().phase==='finished'){showSessionEnd();return;}
  say(next==='den'?'Dein Zuhause. Schau, ob ein Brief für dich da ist.':state.mail().phase==='to-mailman'?'Der Briefträger ist ganz in deiner Nähe. Folge dem Pfeil.':'Folge dem Pfeil zum Freund auf deinem Brief. Tippe auf den Boden, um zu gehen.');
}
function renderNav(){nav.replaceChildren();if(state.development||FK.playLog.development())nav.append(h('strong',{class:'ff-dev',text:'ENTWICKLUNG'}));
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
function act(id){if(panel||['sleeping','finished'].includes(state.mail().phase))return;state.record('place_tapped',{placeId:id,area,matchesLetter:state.canPuzzle(id),distance:area==='forest'&&places[id]?Math.round(Math.hypot(world.position.x-places[id].x,world.position.z-places[id].z)*10)/10:null});if(area==='forest'){
  const destination=places[id];if(!destination)return;
  const p=world.position;if(Math.hypot(p.x-destination.x,p.z-destination.z)>3.2){world.route(id);say('Folge Fuchs zu '+(C.hosts[id]?.name||(id==='home'?'deinem Zuhause':'dem Briefträger'))+'.');return;}
  if(id==='home')go('den');else if(id==='mailman'){if(state.mail().phase==='to-mailman')showLetter(true);}else meet(id);
}else if(id==='outside'){if(state.mail().phase==='den-letter')showLetter(false);else go('forest');}}
// Picture-only touch targets sit on the calibrated painting; routes still use the actual world destinations.
function map(){
  if(state.mail().phase==='den-letter'){showLetter(false);return;}
  state.record('map_opened',{area});open('map');const card=h('section',{class:'ff-card ff-map-card'});overlay.append(card);
  const board=h('div',{class:'ff-map ff-map-storybook','aria-label':'Bildkarte des Waldes'}),mail=state.mail();
  const links=document.createElementNS('http://www.w3.org/2000/svg','svg');links.setAttribute('viewBox','0 0 1536 1024');links.setAttribute('aria-hidden','true');links.classList.add('ff-map-links');board.append(links);
  for(const [id,p]of Object.entries({...places,...extraMapPlaces})){
    if(id==='mailman')continue;
    const b=button(p.name,p.picture,()=>{if(area!=='forest')go('forest');else close();world.route(id);});
    const pin=mapPin(id),[ax,ay]=mapPoint(p.x,p.z);
    b.removeAttribute('title'); // Picture-only pins; keep the accessible destination name.
    b.replaceChildren(id==='home'?FK.hudArt.element('den'):FK.friendsArt.portrait(id));b.dataset.place=id;if(id==='home')b.classList.add('ff-map-home');
    const line=document.createElementNS(links.namespaceURI,'line');for(const [key,value]of Object.entries({x1:ax*1536,y1:ay*1024,x2:pin.x*1536,y2:pin.y*1024}))line.setAttribute(key,String(value));links.append(line);
    const invited=mail.phase==='to-friend'&&mail.host===id||mail.phase==='return-home'&&id==='home';b.classList.toggle('ff-map-invited',invited);if(invited)b.append(h('span',{class:'ff-map-invitation'},FK.hudArt.element('letter')));
    b.style.left=(pin.x*100)+'%';b.style.top=(pin.y*100)+'%';board.append(b);
  }
  // Where Fuchs is now: his portrait on a pin with a soft pulse on the spot (in the den: at home).
  const here=area==='forest'?world.position:places.home,[hx,hy]=mapPoint(here.x,here.z);
  const me=h('div',{class:'ff-map-here',role:'img','aria-label':'Hier ist Fuchs'},h('span',{class:'ff-map-here-pulse'}),h('span',{class:'ff-map-here-pin'},FK.friendsArt.portrait('fox')));
  me.style.left=(hx*100)+'%';me.style.top=(hy*100)+'%';board.append(me);
  me.style.setProperty('--ff-here-x',hx>.9?'-56px':'12px');me.style.setProperty('--ff-here-y',hy>.88?'-58px':'14px');
  // Keep picture-only 64 px pins separated on phones; the map pans sideways, centred on Fuchs.
  const scroller=h('div',{class:'ff-map-scroll'},board);card.append(scroller);scroller.scrollLeft=Math.max(0,Math.min(scroller.scrollWidth-scroller.clientWidth,hx*scroller.scrollWidth-scroller.clientWidth/2));board.querySelector('button')?.focus({preventScroll:true});
  if(mail.phase==='to-mailman'){
    const b=button('Zum Briefträger','mailman',()=>{if(area!=='forest')go('forest');else close();world.route('mailman');},'ff-map-courier');
    b.removeAttribute('title');b.replaceChildren(FK.friendsArt.portrait('mailman'));b.dataset.place='mailman';card.append(b);
  }
}
function meet(id){
  if(!state.canPuzzle(id)){const m=state.mail(),toward=m.phase==='to-friend'?m.host:m.phase==='to-mailman'?'mailman':m.phase==='return-home'?'home':null,name=C.hosts[id]?.name||(extraMapPlaces[id]?mapPin(id).label:'');
    state.record('friend_unavailable',{host:id,reason:m.phase==='to-friend'?'wrong_letter':m.phase==='return-home'?'return_home':'needs_letter'});
    // A visit still shows something: the friend does a little trick and points the way.
    world.visit?.(id,toward);
    FK.ui.toast(m.phase==='return-home'?name+' winkt. Fuchs geht nach Hause schlafen.':m.phase==='to-friend'?name+' zeigt dir den Weg zu '+(C.hosts[m.host]?.name||'deinem Freund')+'.':m.phase==='to-mailman'?name+' zeigt dir den Weg zum Briefträger.':'Dein Brief zeigt dir deinen Freund.');return;}
  const game=FK.friendsLibrary.pick(id);if(!game){state.record('friend_unavailable',{host:id,reason:'not_reviewed'});FK.ui.toast('Dieses Puzzle wartet noch auf die Freigabe von Erwachsenen.');return;}
  // a short close shot of the two friends, then the puzzle opens
  if(framing)return;const wait=world.frame?.(id)||0;framing=true;
  setTimeout(()=>{framing=false;if(!state.canPuzzle(id)||panel==='puzzle')return;state.record('friend_visited',{host:id,puzzleId:game.id});if(panel)close();world.pause(true);FK.friendsLibrary.visit(game);},wait*1000);
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
    overlay.addEventListener('pointerdown',e=>{backdropTap=e.isPrimary&&e.button===0&&e.target===overlay&&['map','letter'].includes(panel)?{id:e.pointerId,x:e.clientX,y:e.clientY,panel}:null;});
    overlay.addEventListener('pointermove',e=>{if(backdropTap&&Math.hypot(e.clientX-backdropTap.x,e.clientY-backdropTap.y)>8)backdropTap=null;});
    overlay.addEventListener('pointercancel',()=>{backdropTap=null;});
    overlay.addEventListener('pointerup',e=>{const tap=backdropTap;backdropTap=null;if(tap&&tap.id===e.pointerId&&tap.panel===panel&&e.target===overlay&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=8){e.preventDefault();e.stopPropagation();close();}});
    doorScene=h('div',{class:'ff-den-door',html:doorSVG,'aria-hidden':'true'});
    denEnvelope=button('Brief öffnen','letter',()=>showLetter(false),'ff-den-envelope');
    fader=h('div',{class:'ff-fader','aria-hidden':'true'});
    root.append(canvas,doorScene,denEnvelope,hotspots,nav,nearButton,caption,fader,overlay,statusBar);
    let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('storage blocked');},setItem(){throw new Error('storage blocked');},removeItem(){}};}
    state=window.FriendsState.create({storage,content:C,puzzleHosts:()=>FK.friendsLibrary.catalogue().map(g=>g.host),eligible:host=>!FK.puzzleReview||FK.friendsLibrary.catalogue().some(g=>g.host===host&&FK.puzzleReview.ready(g.id)),development:new URLSearchParams(location.search).get('dev')==='1',onStatus:()=>queueMicrotask(saveStatus),appVersion:()=>FK.VERSION,logContext:()=>({screen:FK.current(),viewport:{width:innerWidth,height:innerHeight},textCase:FK.text.mode()})});
    FK.friends=state;
    FK.on('settings',event=>{if(event.key==='developerMode')renderNav();});
    audio=createAudio(()=>state.audioSettings(),()=>world?.soundscape);FK.friendsAudio=audio;
    world=createWorld(canvas,{position:()=>state.get().world,onPosition:(x,z,region)=>state.position(x,z,region),onMove:e=>state.record(e.event,e),onNear:()=>{},onAction:act,onAnimationEnd:()=>endSequence(false),onProject:items=>{positionDoor();for(const p of items){const b=hotspots.querySelector(`[data-place="${p.id}"]`);if(b){b.hidden=!p.visible;b.style.left=p.x+'px';b.style.top=p.y+'px';}}}});
    FK.friendsView=()=>({...world.diagnostics,soundscape:world.soundscape});renderNav();renderHotspots();saveStatus();
    const interrupted=state.get().animation;if(interrupted)state.finishAnimation(true);
    if(['return-home','sleeping','finished'].includes(state.mail().phase)){go('den',true);}
    else say(state.mail().phase==='den-letter'?'Oh, ein Brief! Er kommt durch die Briefklappe. Tippe auf den Umschlag.':'Dein Brief wartet auf dich. Er zeigt dir, wen du besuchen kannst.');
    syncMail();
    document.addEventListener('visibilitychange',()=>{tick();if(document.hidden){if(panel==='puzzle'&&activeMs){state.duration(host,activeMs);activeMs=0;}state.record('pause',{reason:'hidden'});state.flushLog();}else state.record('resume',{reason:'visible'});});
    window.addEventListener('pagehide',()=>{tick();if(panel==='puzzle'&&activeMs){state.duration(host,activeMs);activeMs=0;}state.record('session_end');state.flushLog();});
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
  if(matching&&state.mail().phase==='to-mailman'){world.summonMailman();syncMail();state.record('courier_waiting',{distance:Math.round(Math.hypot(world.position.x-world.mailman.x,world.position.z-world.mailman.z)*10)/10});say('Danke fürs Helfen! Der Briefträger wartet mit einem neuen Brief auf dich. Folge dem Pfeil.');}
};
FK.friendsStartRound=id=>{if(area==='forest')act(id);};
FK.friendsStartSession=limit=>{
  if(!state.startLetterSession(limit)){saveStatus();return false;}
  finalSleep=false;world.skip();if(FK.current()!=='friends')FK.go('friends');go('den',true);return true;
};
FK.go('friends');
