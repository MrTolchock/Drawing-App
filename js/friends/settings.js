/* All settings entry points share this screen, including parent-controlled letter sessions. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h;
  let body,fallback,updateStatus,updateButton;
  function showUpdate(){
    if(!updateStatus)return;
    const s=FK.updates?.get()||{status:'idle',message:''};
    updateStatus.textContent=s.message;
    updateButton.disabled=['checking','downloading','reloading'].includes(s.status);
  }
  function state(){
    if(FK.friends)return FK.friends;if(fallback)return fallback;
    let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('storage blocked');},setItem(){throw new Error('storage blocked');},removeItem(){}};}
    return fallback=window.FriendsState.create({storage,content:window.FriendsContent});
  }
  function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));h('a',{href:url,download:name}).click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function toggle(label,checked,onChange){const input=h('input',{type:'checkbox','aria-label':label});input.checked=checked;input.addEventListener('change',()=>onChange(input));return h('label',{class:'ff-setting-toggle'},h('span',{text:label}),input);}
  FK.screen('settings',{
    build(root){root.classList.add('ff-settings-screen');body=h('div',{class:'ff-settings-body'});root.append(FK.ui.topbar({title:'Einstellungen',stars:false}),h('div',{class:'scroll'},body));FK.on('updates',showUpdate);},
    enter(){
      const s=state();body.replaceChildren();
      const sounds=h('section',{class:'setting-card'},h('div',{class:'setting-head'},h('b',{text:'Klänge im Wald'}),h('small',{text:'Vögel, Blätter und Bach begleiten das Spiel.'})));
      for(const [name,label]of [['ambience','Waldgeräusche']])sounds.append(toggle(label,s.get().settings[name],input=>{if(!s.setting(name,input.checked))input.checked=s.get().settings[name];FK.emit('friends-audio');}));
      sounds.append(toggle('Spielklänge',FK.settings.get('sound')!==false,input=>FK.settings.set('sound',input.checked)),h('p',{class:'ff-setting-note',text:'Es wird nichts automatisch vorgelesen. In jedem Rätsel erklärt der Lautsprecher das Spiel, wenn du ihn antippst.'}));
      const font=h('section',{class:'setting-card'},h('div',{class:'setting-head'},h('b',{text:'Schrift zum Lesen'})));
      const choices=h('div',{class:'ff-font-choices'});
      for(const [value,label]of [['gross','GROSSBUCHSTABEN'],['normal','Gross und klein']]){const b=FK.ui.btn({label,onClick:()=>{FK.settings.set('schrift',value);for(const c of choices.children)c.setAttribute('aria-pressed',String(c===b));}});b.setAttribute('aria-pressed',String((FK.settings.get('schrift')||'gross')===value));choices.append(b);}
      font.append(choices);
      const count=h('input',{type:'number',min:1,max:50,step:1,value:s.get().settings.letterLimit,'aria-label':'Anzahl Briefe',inputmode:'numeric'});
      const sessionStatus=h('p',{class:'ff-letter-session-status',role:'status','aria-live':'polite'});
      const showSession=()=>{const m=s.mail();sessionStatus.textContent=s.error||('Diese Reise: '+m.session.completed+' von '+m.session.limit+' Briefen'+(m.phase==='finished'?' · beendet.':'.'));};
      count.addEventListener('change',()=>{const value=Number(count.value);if(!s.setLetterLimit(value)){count.setCustomValidity('Bitte eine ganze Zahl von 1 bis 50 wählen.');sessionStatus.textContent=s.error||'Bitte eine ganze Zahl von 1 bis 50 wählen.';}else{count.setCustomValidity('');showSession();}});
      const begin=FK.ui.btn({label:'Neue Briefreise starten',onClick:async()=>{const value=Number(count.value);if(!Number.isInteger(value)||value<1||value>50){count.reportValidity();return;}if(!FK.friendsStartSession)await import('./game.js');if(!FK.friendsStartSession(value))showSession();}});
      const letters=h('section',{class:'setting-card ff-letter-settings'},h('div',{class:'setting-head'},h('b',{text:'Briefe pro Spielrunde'}),h('small',{text:'Ein Brief ist ein Puzzle mit fünf Aufgaben. Danach geht Fuchs in seinen Bau schlafen.'})),h('label',{},'Anzahl Briefe (1–50)',count),h('p',{text:'Die Auswahl gilt für die nächste Briefreise. Eine begonnene Reise behält ihr Limit. Eine neue Reise beginnt immer im Bau; nach dem Schlafen können nur Erwachsene neu starten.'}),sessionStatus,begin);showSession();
      const records=h('details',{class:'setting-card ff-data-settings'},h('summary',{text:'Spielstand und Protokoll'}),h('p',{text:'Alles bleibt auf diesem Gerät. Das anonyme Protokoll enthält Aufgaben, Antworten und Spielzeit, keine Namen oder Bilder. Höchstens 7 Tage und 10 000 Ereignisse.'}));
      for(const [label,fn]of [['Protokoll exportieren',()=>download('waldfreunde-protokoll.json',s.exportLog())],['Nur Protokoll löschen',()=>{s.clearLog();FK.ui.toast('Protokoll gelöscht. Dein Spielstand bleibt erhalten.');}],['Spielstand sichern',()=>download('waldfreunde-spielstand.json',s.exportSave())]])records.append(FK.ui.btn({label,onClick:fn}));
      if(s.error)records.append(h('p',{role:'alert',text:s.error}));
      updateButton=FK.ui.btn({label:'Nach Updates suchen',onClick:()=>FK.updates.check()});
      updateStatus=h('p',{class:'ff-update-status',role:'status','aria-live':'polite'});
      const updates=h('section',{class:'setting-card ff-update-settings'},h('div',{class:'setting-head'},h('b',{text:'App-Version'})),h('p',{class:'ff-settings-version',text:'Farbtupf '+FK.VERSION}),updateButton,updateStatus);
      const review=h('section',{class:'setting-card ff-puzzle-review-settings'},h('b',{text:'Puzzle-Galerie und Prüfung'}),h('p',{text:'Alle Puzzles ansehen. Jede Aufgabe vor dem Spielen prüfen und freigeben. Kinder puzzeln nur beim Freund auf ihrem Brief.'}),FK.ui.btn({label:'Puzzle-Galerie öffnen',onClick:()=>FK.puzzleReview.open()}));
      body.append(letters,sounds,font,review,records,updates);showUpdate();
    },
    leave(){}
  });
})();
