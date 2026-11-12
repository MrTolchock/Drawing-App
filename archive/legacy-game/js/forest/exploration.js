/* Pictured orientation, a held touch stick and a small, persistent nature journal. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h,art=FK.forestArt,model=FK.forestState,KEY='farbtupf.exploration.v1';
  const pictures={
    hill:'<path d="m4 35 13-22 8 11 7-17 13 28z" fill="#849f66"/><path d="m26 17 6-10 6 10-6-3z" fill="#eee5bd"/><path d="M8 39h33" stroke="#afbe7c" stroke-width="3"/>',
    butterfly:'<path d="M24 25C1 1 1 40 21 33 4 49 31 47 24 25M24 25C47 1 47 40 27 33 44 49 17 47 24 25" fill="#d9af6b" stroke="#aa8552" stroke-width="1.3"/><path d="M24 19v17m-1-14-5-7m7 7 5-7" stroke="#615b3d" stroke-width="2"/>',
    mushroom:'<path d="m20 24-2 17h13l-3-17" fill="#e6d7b0"/><path d="M5 27C5 2 43 2 43 27z" fill="#a3c4a0" stroke="#749170" stroke-width="2"/><circle cx="15" cy="19" r="3" fill="#e9f0c7"/><circle cx="28" cy="14" r="3" fill="#e9f0c7"/><circle cx="35" cy="22" r="2" fill="#e9f0c7"/>',
    waterfall:'<path d="M4 38 8 10h30l6 28z" fill="#9b9d87"/><path d="M16 10h15v14l6 16H10l6-16z" fill="#a9d2d0"/><path d="M21 13v20m5-20v15" stroke="#f5f3d9" stroke-width="2"/><ellipse cx="24" cy="40" rx="20" ry="4" fill="#c4e1d7"/>',
    fish:'<path d="M3 35q10-5 21 0t21 0" fill="none" stroke="#8ab9be" stroke-width="3"/><path d="M8 22q12-16 26 0-14 16-26 0m25 0 12-8v16z" fill="#d9b366"/><circle cx="15" cy="20" r="2" fill="#474e3b"/><circle cx="8" cy="10" r="3" fill="none" stroke="#8ab9be"/>',
    cloud:'<path d="M9 34C-4 29 2 14 14 17 15 0 38 2 37 17 51 16 50 35 38 35z" fill="#f6edcf" stroke="#a9bda7" stroke-width="2"/><path d="M5 43h22m8-3h11" stroke="#a9bda7" stroke-width="2" stroke-linecap="round"/>',
    map:'<path d="m3 9 13-5 16 6 13-5v34l-13 5-16-6-13 5z" fill="#e4dfb8" stroke="#839768" stroke-width="2"/><path d="M16 4v34m16-28v34" stroke="#b3bd90" stroke-width="2"/><path d="M9 29q20-25 28-8" fill="none" stroke="#b58a54" stroke-width="2" stroke-dasharray="3 3"/><circle cx="36" cy="20" r="4" fill="#c89758"/>',
    turn:'<path d="M11 18a15 15 0 1 1-1 15M11 18H3m8 0V9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  function picture(id){return h('span',{class:'forest-nature-picture','aria-hidden':'true',html:'<svg viewBox="0 0 48 48">'+(pictures[id]||pictures.hill)+'</svg>'});}
  function saved(){try{const list=JSON.parse(localStorage.getItem(KEY));return Array.isArray(list)?list.filter(id=>typeof id==='string'):[];}catch(_){return [];}}
  function create({root,ui,blocked,getRuntime}){
    let map=null,card=null,pointer=null,tracked='',nearby='',found=new Set(saved());
    const action=(name,content,click,cls='')=>h('button',{type:'button',class:'forest-button '+cls,'aria-label':name,onclick:click},...(Array.isArray(content)?content:[content]));
    const stick=h('div',{class:'forest-stick',role:'group','aria-label':'Fuchs steuern. Halte eine Richtung gedrückt.'});
    const knob=h('span',{class:'forest-stick-knob','aria-hidden':'true'},art.icon('paw'));
    function release(){pointer=null;getRuntime()?.steer(0,0);knob.style.transform='translate(0,0)';stick.classList.remove('is-held');}
    for(const [id,label,x,z] of [['up','oben',0,-1],['down','unten',0,1],['left','links',-1,0],['right','rechts',1,0]]){
      const b=action('Fuchs nach '+label+' bewegen',h('span',{'aria-hidden':'true',text:'▲'}),()=>{},'forest-stick-direction forest-stick-'+id);
      b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!blocked()){e.preventDefault();e.stopPropagation();getRuntime()?.steer(x,z);knob.style.transform=`translate(${x*22}px,${z*22}px)`;}});
      b.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();release();}});b.addEventListener('blur',release);stick.append(b);
    }
    stick.append(knob);
    function drag(e){if(pointer!==e.pointerId)return;const r=stick.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/(r.width*.32),z=(e.clientY-r.top-r.height/2)/(r.height*.32),length=Math.max(1,Math.hypot(x,z));getRuntime()?.steer(x/length,z/length);knob.style.transform=`translate(${x/length*24}px,${z/length*24}px)`;}
    stick.addEventListener('pointerdown',e=>{if(!e.isPrimary||blocked())return;e.preventDefault();pointer=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('is-held');drag(e);});
    stick.addEventListener('pointermove',drag);stick.addEventListener('pointerup',release);stick.addEventListener('pointercancel',release);stick.addEventListener('lostpointercapture',release);window.addEventListener('blur',release);
    const finder=action('Dem Freund folgen',[],()=>{if(blocked())return;const r=getRuntime();if(r.places.some(p=>p.id===tracked))r.walkToPlace(tracked);else if(tracked==='home')r.walkTo(model.nodes.home,'home');else r.walkToResident(tracked);},'forest-wayfinder');
    const nearbyButton=action('Hier umschauen',[],()=>showPlace(nearby),'forest-nearby');nearbyButton.hidden=true;
    const look=h('div',{class:'forest-look'},action('Blick nach links drehen',picture('turn'),()=>getRuntime()?.orbit(-Math.PI/4),'forest-look-left'),action('Blick nach rechts drehen',picture('turn'),()=>getRuntime()?.orbit(Math.PI/4)));
    ui.append(stick,finder,nearbyButton,look);
    function closeMap(){if(!map)return;map.remove();map=null;root.classList.remove('has-map');getRuntime()?.pauseView(false);getRuntime()?.input(true);mapButton.focus({preventScroll:true});}
    function go(id){closeMap();getRuntime().track(id);if(getRuntime().places.some(p=>p.id===id))getRuntime().walkToPlace(id);else if(id==='home')getRuntime().walkTo(model.nodes.home,'home');else getRuntime().walkToResident(id);}
    function showMap(){
      if(blocked())return;closeCard();release();getRuntime().input(false);getRuntime().pauseView(true);root.classList.add('has-map');
      const r=getRuntime(),state=model.get(),bounds={x:-39,z:-28,w:78,d:72};
      const coords=p=>({x:(p.x-bounds.x)/bounds.w*100,z:(p.z-bounds.z)/bounds.d*100});
      const river=[];for(let z=-28;z<=44;z+=2){const p=coords({x:model.riverX(z),z});river.push(p.x+','+p.z);}
      const trails=model.edges.filter(e=>!e[2]||(e[2]==='bridge'?state.bridgeRepaired:e[2]==='world'?state.greetingSeen:state.contributions[e[2]])).map(([a,b])=>{a=coords(model.nodes[a]);b=coords(model.nodes[b]);return `<path d="M${a.x} ${a.z}L${b.x} ${b.z}"/>`;}).join('');
      const field=h('div',{class:'forest-map-field'},h('div',{class:'forest-map-paper','aria-hidden':'true',html:'<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" rx="8" fill="#dae0b1"/><g fill="#aabd87" opacity=".5"><ellipse cx="14" cy="29" rx="12" ry="17"/><ellipse cx="87" cy="84" rx="11" ry="13"/><ellipse cx="88" cy="16" rx="12" ry="10"/></g><polyline points="'+river.join(' ')+'" fill="none" stroke="#98bdb9" stroke-width="5"/><g fill="none" stroke="#f6ebc1" stroke-width="2.4" stroke-linecap="round">'+trails+'</g></svg>'}));
      function pin(id,p,content,label,cls=''){const xy=coords(p),b=action(label,content,()=>go(id),'forest-map-pin '+cls);b.style.left=xy.x+'%';b.style.top=xy.z+'%';field.append(b);}
      for(const [id,p] of Object.entries(model.residents))if(model.residentAvailable(id))pin(id,p,art.character(id),FK.forestStory.names[id]+' auf der Karte besuchen','forest-map-friend');
      pin('home',{x:-8,z:5},FK.heartTree.picture(),'Herzbaum auf der Karte besuchen','forest-map-heart');
      for(const p of r.places)pin(p.id,p,[picture(p.picture),found.has(p.id)?art.icon('check'):null],p.name+' entdecken','forest-map-place'+(found.has(p.id)?' is-found':''));
      const fox=coords(r.position),you=h('span',{class:'forest-map-you','aria-label':'Hier bist du'},art.character('fox'));you.style.left=fox.x+'%';you.style.top=fox.z+'%';field.append(you);
      const close=action('Karte schliessen',h('span',{'aria-hidden':'true',text:'×'}),closeMap,'forest-map-close');
      map=h('section',{class:'forest-map',role:'dialog','aria-modal':'true','aria-label':'Deine Waldkarte'},h('header',{},picture('map'),h('h2',{text:'Dein Wald'}),close),field,h('p',{class:'forest-map-caption',text:'Tippe auf einen Freund oder einen Ort. Die Pfoten zeigen dir den Weg.'}));
      map.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeMap();}if(e.key==='Tab'){const buttons=[...map.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&i===buttons.length-1){e.preventDefault();buttons[0].focus();}}});
      ui.append(map);close.focus({preventScroll:true});
    }
    const mapButton=action('Waldkarte öffnen',picture('map'),showMap,'forest-round forest-map-open');
    mapButton.disabled=!getRuntime();
    function closeCard(){card?.remove();card=null;FK.forestVoice.cancel();}
    function showPlace(id){
      if(blocked())return;const place=getRuntime().places.find(p=>p.id===id);if(!place)return;
      closeCard();release();getRuntime().react(id);found.add(id);try{localStorage.setItem(KEY,JSON.stringify([...found]));}catch(_){}
      FK.forestVoice.say(place.text);card=h('aside',{class:'forest-nature-card','aria-label':place.name,'aria-description':place.text},picture(place.picture),h('div',{},h('b',{text:place.name}),h('p',{text:place.caption})),action('Ort nochmals hören',art.icon('speaker'),()=>FK.forestVoice.say(place.text),'forest-nature-listen'),action('Weiter erkunden',h('span',{'aria-hidden':'true',text:'×'}),closeCard,'forest-nature-close'));ui.append(card);
    }
    function update(points){
      mapButton.disabled=blocked();
      const hidden=blocked()||!!map;stick.hidden=hidden;finder.hidden=hidden;look.hidden=hidden;
      if(hidden){if(pointer!==null)release();nearbyButton.hidden=true;return;}
      const guide=points.guide;if(guide){
        if(tracked!==guide.id){tracked=guide.id;const place=getRuntime().places.find(p=>p.id===tracked);finder.replaceChildren(place?picture(place.picture):tracked==='home'?FK.heartTree.picture():art.character(tracked),h('span',{class:'forest-wayfinder-arrow'},art.icon('arrow')));finder.setAttribute('aria-label',place?'Weg zu '+place.name:tracked==='home'?'Weg zum Herzbaum':'Weg zu '+FK.forestStory.names[tracked]);}
        const fox=points.fox,arrow=finder.querySelector('.forest-wayfinder-arrow');if(arrow)arrow.style.transform='rotate('+Math.atan2(guide.y-fox.y,guide.x-fox.x)+'rad)';finder.classList.toggle('is-near',guide.distance<4);
      }
      nearby=points.nearby||'';nearbyButton.hidden=!nearby||!!card;
      if(nearby){const place=getRuntime().places.find(p=>p.id===nearby);if(nearbyButton.dataset.place!==nearby){nearbyButton.dataset.place=nearby;nearbyButton.replaceChildren(picture(place.picture),art.icon('eye'));nearbyButton.setAttribute('aria-label',place.name+' anschauen');}}
    }
    return {mapButton,update,showPlace,close(){if(map){closeMap();return true;}if(card){closeCard();return true;}return false;},hud(target,hidden){mapButton.disabled=hidden||!getRuntime();if(hidden){closeCard();release();}if(target.resident)getRuntime()?.track(target.resident);},leave(){closeMap();closeCard();release();}};
  }
  FK.forestExploration={create,picture};
})();
