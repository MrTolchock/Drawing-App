/* One picture and voice language for the woodland and its games. */
(function () {
  'use strict';
  const FK = window.FK, h = FK.h;
  const friends = { count:'beaver', add:'beaver', rocket:'beaver', neighbours:'beaver', compare:'beaver', tricks:'beaver',
    rhyme:'hare', syllable:'hare', vowels:'hare', read:'hare', nature:'hedgehog', treasure:'hedgehog', picnic:'hedgehog',
    pattern:'owl', sequence:'owl', robot:'owl', double:'kingfisher', mirror:'kingfisher', shapes:'kingfisher', dots:'kingfisher', trace:'owl', survey:'owl' };
  const names = { '🐦':'Vogel','🐟':'Fisch','🐈':'Katze','🐌':'Schnecke','🐕':'Hund','🐝':'Biene','🦔':'Igel' };
  function speak(text) { return FK.forestVoice.say(text); }
  function listen(text, label = 'Aufgabe nochmals hören') {
    return h('button', { type:'button', class:'play-listen', 'aria-label':label, onclick:() => FK.forestVoice.explain(typeof text === 'function' ? text() : text) }, FK.forestArt.icon('speaker'));
  }
  // One shared button gesture for the whole app, including the world, books,
  // settings and popovers. Suppress only the compatibility click of that gesture.
  const presses=new Map(), consumed=new Set();
  let compatibility=null,lastDown=null;
  const buttonAt=target=>target?.closest?.('button');
  function suppressCompatibility(event){compatibility={id:event.pointerId,type:event.pointerType,x:event.clientX,y:event.clientY};}
  document.addEventListener('pointerdown',event=>{
    compatibility=null;consumed.delete(event.pointerId);lastDown=event;
    if(event.pointerType!=='touch')return;
    if(!event.isPrimary){presses.forEach(p=>p.moved=true);return;}
    presses.set(event.pointerId,{button:buttonAt(event.target),x:event.clientX,y:event.clientY,moved:false});
  },true);
  document.addEventListener('pointermove',event=>{
    const press=presses.get(event.pointerId);
    if(press&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>14)press.moved=true;
  },true);
  document.addEventListener('pointercancel',event=>{presses.delete(event.pointerId);consumed.delete(event.pointerId);},true);
  document.addEventListener('pointerup',event=>{
    const press=presses.get(event.pointerId);presses.delete(event.pointerId);
    if(consumed.delete(event.pointerId)||event.fkPlayHandled){suppressCompatibility(event);return;}
    if(event.pointerType!=='touch'||!event.isPrimary||!press?.button)return;
    const button=press.button;
    // Hit-test the stable button, rather than a picture/text node that an atlas
    // or a counter may replace between down and up. Scrolling is never a tap.
    if(press.moved||!button.isConnected||button.disabled||buttonAt(document.elementFromPoint(event.clientX,event.clientY))!==button){
      suppressCompatibility(event);return;
    }
    suppressCompatibility(event);
    button.click(); // detail=0: keyboard and programmatic activation stay native.
  });
  document.addEventListener('click',event=>{
    if(!compatibility||event.detail===0)return;
    // A busy render can delay this click. Match its gesture regardless of time;
    // the next pointerdown clears the record, so fresh input is never blocked.
    const samePointer=event.pointerId===compatibility.id;
    const convertedTouch=compatibility.type==='touch'&&(event.pointerType==='touch'||event.sourceCapabilities?.firesTouchEvents||!event.pointerType);
    const legacyMouse=!event.pointerType&&compatibility.type==='mouse';
    if((samePointer||convertedTouch||legacyMouse)&&Math.hypot(event.clientX-compatibility.x,event.clientY-compatibility.y)<26){
      compatibility=null;event.preventDefault();event.stopImmediatePropagation();
    }
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){presses.clear();consumed.clear();compatibility=null;lastDown=null;}});
  function consumeGesture(event=lastDown){if(event)consumed.add(event.pointerId);}
  // Kept for existing activities; the document delegate already includes them.
  function bindTouch(root){return root;}
  function picture(value, label = '') {
    const symbols = String(value).match(/\p{Extended_Pictographic}[\uFE0F]*(?:\u200D\p{Extended_Pictographic}[\uFE0F]*)*/gu) || [];
    return h('span', { class:'play-picture', role: label ? 'img' : null, 'aria-label':label || null },
      symbols.map(token => h('span', { class:'play-token', text:token })));
  }
  // Menu art can show a group of berries; scored counters stay exactly one berry.
  function gamePicture(game) {
    return FK.visual.art(game.picture||{compare:'berry-cluster',neighbours:'neighbour-houses',mirror:'hand-mirror',double:FK.friendsLibrary?.active?'forest-nut':'magic-wand'}[game.id] || game.emoji);
  }
  let session=null;
  function begin(game,stage){session={game,stage,round:0,missed:new Set(),helped:new Set(),answered:new Set()};}
  function context(game, prompt, round, stage=FK.learning.stage()) {
    const friend = FK.friendsLibrary?.active ? FK.friendsLibrary.hosts[game] : friends[game] || 'owl';
    if(!session||session.game!==game||session.stage!==stage||round===0&&session.round!==0)session={game,stage,round,missed:new Set(),helped:new Set(),answered:new Set()};
    if(round===0&&session?.answered.size===5)session={game,stage,round,missed:new Set(),helped:new Set(),answered:new Set()};
    session.round=round;
    const tour=FK.journey.get().tour,current=FK.journey.step();
    const onTour=current?.game===game&&current.stage===stage;
    return h('div', { class:'play-context' }, (FK.friendsLibrary?.active?FK.friendsLibrary.portrait(friend):FK.forestArt.character(friend)),
      h('span', { text:FK.friendsLibrary?.active?window.FriendsContent.hosts[friend].name+' spielt mit dir':onTour?'Entdeckertour · Halt '+(tour.index+1)+' von 3':FK.forestStory.names[friend] + ' spielt mit dir' }), listen(prompt,FK.friendsLibrary?.active?'Spiel erklären':'Aufgabe nochmals hören'),
      h('span', { class:'play-round', text:(round + 1) + ' / 5' }));
  }
  function attempt(ok){if(!session||session.answered.has(session.round))return;if(ok)session.answered.add(session.round);else session.missed.add(session.round);}
  function hint(){if(session&&!session.answered.has(session.round))session.helped.add(session.round);}
  function summary(game,stage){
    if(!session||session.game!==game||session.stage!==stage)return {independent:0};
    return {independent:[...session.answered].filter(i=>!session.missed.has(i)&&!session.helped.has(i)).length};
  }
  function tourPictures(tour=FK.journey.get().tour){
    if(!tour)return null;
    return h('div',{class:'journey-stops','aria-label':tour.index+' von 3 Halten geschafft'},tour.steps.map((step,i)=>{
      const item=FK.journey.catalogue().find(c=>c.screen===step.screen&&c.game===step.game);
      return h('div',{class:'journey-stop'+(i<tour.index?' done':i===tour.index?' current':''),'aria-label':item.title+(i<tour.index?' geschafft':'')},FK.forestArt.character(item.friend),h('span',{text:i<tour.index?'✓':i+1}),h('small',{text:item.title}));
    }));
  }
  function taskFeedback(body, text, ok) {
    speak(text);
    if (!ok) { FK.sound.undo(); return; }
    FK.sound.right();
    const chosen = body.querySelector('.correct') || body.querySelector('.learn-prompt');
    if (chosen) { FK.ui.bounce(chosen); const r = chosen.getBoundingClientRect(); FK.fx.twinkle(r.x + r.width/2, r.y + r.height/2, '#d4ae59'); FK.waldbuch?.celebrate(chosen); }
  }
  function finish(body, group, game, stage, replay) {
    if(FK.friendsLibrary?.active){
      FK.progress.finish(group,game+':1',0);
      FK.friendsPuzzleCompleted(FK.friendsLibrary.hosts[game]);
      return;
    }
    const earned = FK.progress.finish(group, game + ':' + stage, 1), friend = friends[game] || 'owl';
    const result=FK.journey.complete(group,game,stage,summary(game,stage));
    const recommendation=result.next||FK.journey.recommendation(group,game,stage,summary(game,stage));
    const onward=h('button',{type:'button',class:'learn-button learn-next play-continue','aria-label':result.next?'Entdeckertour fortsetzen':recommendation.kind==='level'?'Nächste Stufe probieren':'Nächstes Waldspiel',onclick:()=>FK.journey.launch(recommendation)},
      FK.forestArt.character(recommendation.friend),h('span',{},h('b',{text:result.next?'Nächster Halt':recommendation.kind==='level'?'Neue Herausforderung':'Weiter entdecken'}),h('small',{text:recommendation.title+' · Stufe '+recommendation.stage})),FK.forestArt.icon('arrow'));
    body.replaceChildren(h('section', { class:'learn-finish play-finish' }, FK.forestArt.character(friend),
      FK.woodland.progress(5), h('h2', { text:result.finished?'Entdeckertour geschafft!':'Fünf Aufgaben geschafft!' }),
      h('p', { text:result.finished?'Drei Abenteuer geschafft. So viel hast du entdeckt!':earned ? 'Ein Stern für dein Waldalbum!' : 'Wie schön, dass wir wieder zusammen spielen!' }),
      result.advanced?tourPictures():null,onward,
      h('div', { class:'play-finish-actions' },
        h('button', { type:'button', class:'learn-button', onclick:replay }, FK.forestArt.icon('undo'), h('span', {text:'Nochmals'})),
        h('button', { type:'button', class:'learn-button', onclick:() => FK.go('forest-book') }, FK.forestArt.icon('book'), h('span', {text:'Waldspiele'})),
        h('button', { type:'button', class:'learn-button', onclick:() => FK.go('forest') }, FK.forestArt.character('fox'), h('span', {text:'Zum Wald'})))));
    speak(result.finished?'Juhui! Deine Entdeckertour ist geschafft! Deine Waldfreunde freuen sich über deine Hilfe.':'Juhui! Danke fürs Mitspielen! '+(result.next?'Am nächsten Halt wartet ein neues Abenteuer.':earned?'Du bekommst einen Stern für dein Waldalbum.':'Komm bald wieder!'));
    FK.ui.celebrate({ stars:earned, from:body, text:result.finished?'Eine ganze Tour geschafft!':'Gemeinsam geschafft!' });
  }
  function steps(items) {
    return h('div', { class:'play-steps', 'aria-label':'So geht das Spiel' }, items.map(([visual, label], i) =>
      h('span', { class:'play-step' }, h('b', {text:i+1}), typeof visual === 'string' ? visual === '✓' || visual === '⚖️' ? FK.forestArt.icon('check') : visual === '🖐️' ? FK.forestArt.icon('hand') : picture(visual) : visual, h('small', {text:label}))));
  }
  function natureCue(cue) {
    const drawings = {
      feather:'<path d="M25 92 72 12M34 75l-8-13 9-2-6-13 10-1-2-12 11-1 2-10 12-2 10-9 2 20-8 15-8 2-1 12-9-1-4 12z"/><path d="m34 75 38-63M38 64l17-8m-12-4 17-8m-8-8 12-7" fill="none"/>',
      shell:'<path d="M78 81H24C0 34 36 5 65 25c27 19 11 54-12 44-18-8-9-29 4-25 10 4 6 16-2 13"/>',
      fin:'<path d="M16 66q32-8 43-46 20 11 22 46zM36 61 59 25m-8 36 10-32m4 33-1-29"/>',
      legs:'<ellipse cx="50" cy="48" rx="16" ry="26"/><path d="m34 30-18-8m18 23-20 1m20 16-18 15m50-47 18-8M66 45l20 1M66 62l18 15"/>',
      spines:'<path d="m10 74 10-22 7 9 3-27 12 13 8-30 10 29 14-16 2 28 14-5 3 21z"/>',
      milk:'<path d="M37 13h26v16l9 12v44H28V41l9-12zM30 48h40M36 64h28M39 75h22"/>'
    };
    const label = {feather:'Eine Feder',shell:'Ein Schneckenhaus',fin:'Eine Flosse',legs:'Sechs Beine',spines:'Stacheln',milk:'Milch für die Jungen'}[cue] || '';
    return h('div', {class:'play-nature-cue'}, drawings[cue] ? h('span',{class:'play-cue-drawing',role:'img','aria-label':label,html:'<svg viewBox="0 0 100 100" fill="#e4d6aa" stroke="#755e3e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+drawings[cue]+'</svg>'}) : picture(cue), h('span',{class:'play-cue-arrow',text:'→'}), h('b',{class:'play-question',text:'?'}));
  }
  function wordDrawing(word) {
    const drawings = {
      Tisch:'<path d="M10 38h80v13H10zM20 51v35m60-35v35M32 51v22m36-22v22"/>',
      Bein:'<path d="m41 11-5 39-7 34h36q8-10-18-12l14-59z"/>',
      Stein:'<path d="m12 73 8-34 35-17 28 24 6 29-33 9z"/><path d="m20 39 30 19 33-12M50 58l6 26"/>',
      Brot:'<path d="M10 66q-5-31 27-33h28q30 1 27 34v13H10z"/><path d="m30 42-6 16m27-19-6 16m29-12-6 16M11 67h80"/>',
      Boot:'<path d="m10 64 17 22h50l15-22zM48 62V11L19 53h29m7-38 28 39H55"/>',
      Berg:'<path d="M5 87 42 15l24 43 11-18 20 47zM27 45l15-30 16 29-13-5-9 10z"/>',
      Tor:'<path d="M10 88V15h80v73M21 88V27h58v61M21 43h58M21 60h58m-40-32v59m20-59v59"/>',
      Tee:'<path d="M18 37h54v31q-2 18-25 18T18 68zM73 43h9q18 15-10 22M31 27q-10-10 0-18m20 18q-10-10 0-18"/>',
      Zahn:'<path d="M23 16q14-8 27 1 17-9 29 0 15 16-1 44-4 32-17 27l-11-27-11 27q-14 4-17-29-16-28 1-43z"/>',
      Zelt:'<path d="M8 83 49 17l43 66zM49 17v66m0-36 24 36H30z"/>',
      Decke:'<path d="m13 21 71-4 5 65-74 4zM15 40l71-4m-70 22 71-4M34 21l3 63m21-65 3 63"/>',
      Kanne:'<path d="M25 36q-7 0-18-17l20 8m1 8q28-15 42 6v34q-23 19-43 0zM71 42q32-16 18 21l-18 5M31 32h31M39 23h16"/>',
      Tonne:'<path d="M21 28h58l-6 58H27zM16 23h68M37 19h27M39 42v29m22-29v29"/>',
      Socke:'<path d="M44 13h34v44q5 20-15 24L22 91Q7 88 12 72l31-21zM44 26h34M27 63l13 19M61 69q1-13 16-15"/>',
      Licht:'<path d="M34 68C-7 22 83-8 78 39q-2 16-14 29zM35 77h28m-24 9h20M51 3v8M9 28l11 6m68-20-9 8"/>',
    };
    return h('span',{class:'play-cue-drawing',role:'img','aria-label':word,html:'<svg viewBox="0 0 100 100" fill="#e2cf9e" stroke="#755e3e" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">'+(drawings[word]||'')+'</svg>'});
  }
  function sequencePicture(value) {
    const scenes = {
      '😋 Banane essen':'🍌', '💧 Obst waschen':'🍎 💧', '🥣 Stücke in die Schüssel geben':'🍎 🥣', '😋 Obstsalat essen':'🥣 🥄',
      '🫘 Bohne in feuchte Erde legen':'🫘 💧', '🌿 Junge Pflanze wächst weiter':'🪴', '💧 Regen füllt den Eimer':'🪣 🌧️',
      '🟢 Kleiner unreifer Apfel':'🍏', '🧺 Apfel ernten':'🧺 🍎', '🎩 Hut aufsetzen':'⛄ 🎩', '⚽ Schneekugeln rollen':'❄️ ⚽',
      '☀️ Pfütze trocknet langsam':'💧 ☀️', '✏️ Brief schreiben':'✏️ ✉️', '✏️ Bild zeichnen':'✏️ 🖼️', '✉️ Einladung verschicken':'✉️ 📮',
      '🎉 Gemeinsam feiern':'🦊 🐇', '💧 Pfütze entsteht':'🌧️ 💧', '🪣 Leeren Eimer hinstellen':'🪣', '🚶 Hinausgehen':'🦊 🌳'
    };
    const snow=value.includes('Schneekugeln')||value.includes('Kugeln aufeinanderstellen')||value.includes('Hut aufsetzen');
    if(snow) {
      const rolling=value.includes('Schneekugeln'),hat=value.includes('Hut aufsetzen');
      return h('span',{class:'play-cue-drawing',role:'img','aria-label':value.replace(/^\S+\s*/,''),html:'<svg viewBox="0 0 100 100" stroke="#91a5ac" stroke-width="2.5"><path d="M4 91h92"/>'+ (rolling?'<g fill="#f8fcff"><circle cx="25" cy="74" r="17"/><circle cx="58" cy="78" r="13"/><circle cx="83" cy="82" r="9"/></g><path d="M10 47q20-16 32 0m-9-13 10 14-15 4" fill="none"/>':'<g fill="#f8fcff"><circle cx="50" cy="76" r="20"/><circle cx="50" cy="51" r="15"/><circle cx="50" cy="31" r="11"/></g><path d="m34 52-16-9m48 9 16-9" stroke="#987a53"/><g fill="#4e5655" stroke="none"><circle cx="46" cy="30" r="1.5"/><circle cx="54" cy="30" r="1.5"/><circle cx="50" cy="48" r="2"/><circle cx="50" cy="56" r="2"/></g>'+ (hat?'<path d="M34 22h32M41 21V7h18v14" stroke="#665f54" stroke-width="5"/>':''))+'</svg>'});
    }
    if(value==='🟢 Kleiner unreifer Apfel')return h('span',{class:'play-cue-drawing',role:'img','aria-label':'Kleiner grüner Apfel',html:'<svg viewBox="0 0 100 100"><path d="M50 38q-12-11-22 0-12 15 1 37 8 12 21 4 13 8 21-4 13-22 1-37-10-11-22 0" fill="#9eb864" stroke="#7a9454" stroke-width="3"/><path d="M50 37q-2-16 6-22" fill="none" stroke="#896d47" stroke-width="4"/><path d="M56 22q15-15 23-4-9 14-23 4" fill="#81a25b"/></svg>'});
    // The drawings distinguish peeling from eating, rather than substituting a smiley face.
    if(value==='🍌 Banane schälen' || value==='😋 Banane essen') {
      const eaten=value.startsWith('😋');
      return h('span',{class:'play-cue-drawing',role:'img','aria-label':eaten?'Banane mit Biss':'Geschälte Banane',html:'<svg viewBox="0 0 100 100" stroke="#82653e" stroke-width="3" stroke-linejoin="round"><path d="M50 18q-8 37-25 56 21 6 36-34l-4-22z" fill="#fff2c8"/><path d="M48 43Q19 30 10 42q13 9 24 18M58 40q30-4 29 19-12-7-25-5M45 53q3 26 22 32-1-16-10-31" fill="#edcf73"/>'+(eaten?'<circle cx="52" cy="19" r="12" fill="#fffbed" stroke="none"/>':'')+'</svg>'});
    }
    return picture(scenes[value] || value, value.replace(/^\S+\s*/,''));
  }
  FK.play = { friends, names, natureCue, wordDrawing, sequencePicture, speak, listen, picture, gamePicture, bindTouch, consumeGesture, context, begin, attempt, hint, tourPictures, feedback:taskFeedback, finish, steps };
})();
