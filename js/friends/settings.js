/* All settings entry points share this screen, including the optional play timer. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h;
  let body,timerConfig,fallback,updateStatus,updateButton;
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
      const s=state();timerConfig?.dispose();body.replaceChildren();
      const sounds=h('section',{class:'setting-card'},h('div',{class:'setting-head'},h('b',{text:'Klänge im Wald'}),h('small',{text:'Vögel, Blätter und Bach begleiten das Spiel.'})));
      for(const [name,label]of [['ambience','Waldgeräusche'],['music','Musik']])sounds.append(toggle(label,s.get().settings[name],input=>{if(!s.setting(name,input.checked))input.checked=s.get().settings[name];FK.emit('friends-audio');}));
      sounds.append(toggle('Spielklänge',FK.settings.get('sound')!==false,input=>FK.settings.set('sound',input.checked)),h('p',{class:'ff-setting-note',text:'Es wird nichts automatisch vorgelesen. In jedem Rätsel erklärt der Lautsprecher das Spiel, wenn du ihn antippst.'}));
      const font=h('section',{class:'setting-card'},h('div',{class:'setting-head'},h('b',{text:'Schrift zum Lesen'})));
      const choices=h('div',{class:'ff-font-choices'});
      for(const [value,label]of [['gross','GROSSBUCHSTABEN'],['normal','Gross und klein']]){const b=FK.ui.btn({label,onClick:()=>{FK.settings.set('schrift',value);for(const c of choices.children)c.setAttribute('aria-pressed',String(c===b));}});b.setAttribute('aria-pressed',String((FK.settings.get('schrift')||'gross')===value));choices.append(b);}
      font.append(choices);timerConfig=FK.timerUI.settings();
      const records=h('details',{class:'setting-card ff-data-settings'},h('summary',{text:'Spielstand und Protokoll'}),h('p',{text:'Alles bleibt auf diesem Gerät. Das anonyme Protokoll enthält Aufgaben, Antworten und Spielzeit, keine Namen oder Bilder. Höchstens 7 Tage und 10 000 Ereignisse.'}));
      for(const [label,fn]of [['Protokoll exportieren',()=>download('waldfreunde-protokoll.json',s.exportLog())],['Nur Protokoll löschen',()=>{s.clearLog();FK.ui.toast('Protokoll gelöscht. Dein Spielstand bleibt erhalten.');}],['Spielstand sichern',()=>download('waldfreunde-spielstand.json',s.exportSave())]])records.append(FK.ui.btn({label,onClick:fn}));
      if(s.error)records.append(h('p',{role:'alert',text:s.error}));
      updateButton=FK.ui.btn({label:'Nach Updates suchen',onClick:()=>FK.updates.check()});
      updateStatus=h('p',{class:'ff-update-status',role:'status','aria-live':'polite'});
      const updates=h('section',{class:'setting-card ff-update-settings'},h('div',{class:'setting-head'},h('b',{text:'App-Version'})),h('p',{class:'ff-settings-version',text:'Farbtupf '+FK.VERSION}),updateButton,updateStatus);
      body.append(sounds,timerConfig.element,font,records,updates);showUpdate();
    },
    leave(){timerConfig?.dispose();timerConfig=null;}
  });
})();
