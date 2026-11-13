/* Installed apps check again on resume; replacing the document waits for a safe screen. */
(function(){
  'use strict';
  const FK=window.FK,sw=navigator.serviceWorker;
  let registration,registrationTask,booted=false,changed=false,reloading=false,checking=false,lastCheck=-Infinity;
  let controller=sw?.controller;
  let state={status:'idle',message:''},installError='';
  function publish(status,message){state={status,message};FK.emit('updates',state);}
  function safe(){
    if(!booted||document.hidden||document.querySelector('.modal'))return false;
    const screen=FK.current();
    if(['settings'].includes(screen))return true;
    return screen==='friends'&&FK.friendsView?.().area==='den'&&!document.querySelector('.screen-friends .ff-overlay:not([hidden])');
  }
  async function apply(){
    if(reloading||!changed||!safe())return;
    reloading=true;
    try{
      await FK.ui.whenSaved();
      if(!safe()){reloading=false;return;}
      publish('reloading','Die neue Version wird geöffnet …');
      location.reload();
    }catch(error){reloading=false;publish('error','Das Bild ist noch nicht gespeichert. Bitte nochmals versuchen.');}
  }
  function waiting(){
    if(!registration?.waiting||!sw.controller||!safe())return;
    publish('downloading','Die neue Version wird vorbereitet …');
    registration.waiting.postMessage('activate');
  }
  function controllerChanged(){
    const next=sw.controller;
    // The first install controls this same build; only a replacement needs a reload.
    if(controller&&next&&next!==controller){changed=true;publish('ready','Update geladen. Es wird im Menü geöffnet.');}
    else if(!controller&&next&&!changed)publish('current','Du hast die aktuelle Version.');
    controller=next;apply();
  }
  const tracked=new WeakSet();
  function track(worker){
    if(!worker||tracked.has(worker))return;
    tracked.add(worker);
    let wasActive=worker.state==='activated';
    const inspect=()=>{
      if(worker.state==='activated')wasActive=true;
      if(worker.state==='installing')publish('downloading','Die neue Version wird geladen …');
      if(worker.state==='installed'){waiting();}
      if(worker.state==='redundant'&&!wasActive&&!changed)publish('error',installError||'Das Update konnte nicht geladen werden. Bitte nochmals versuchen.');
    };
    worker.addEventListener('statechange',inspect);inspect();
  }
  async function register(){
    if(registrationTask)return registrationTask;
    registrationTask=sw.getRegistration().then(existing=>{
      const script=existing?.active?.scriptURL||existing?.waiting?.scriptURL||existing?.installing?.scriptURL;
      const expected=new URL('sw.js',location.href);
      const same=script&&new URL(script).origin===expected.origin&&new URL(script).pathname===expected.pathname;
      // Keep a recovery registration's unique URL instead of installing it twice.
      return sw.register(same?script:expected.href,{updateViaCache:'none'});
    }).then(reg=>{
      registration=reg;
      reg.addEventListener('updatefound',()=>track(reg.installing));
      track(reg.installing);waiting();return reg;
    }).catch(error=>{registrationTask=null;throw error;});
    return registrationTask;
  }
  async function check(manual=false){
    if(!sw){publish('unsupported','Dieser Browser unterstützt keine Offline-Updates.');return;}
    controllerChanged();
    if(changed){waiting();apply();return;}
    if(checking||!manual&&Date.now()-lastCheck<60000)return;
    if(navigator.onLine===false){publish('offline','Du bist offline. Bitte verbinde dich für Updates mit dem Internet.');return;}
    checking=true;lastCheck=Date.now();installError='';publish('checking','Es wird nach Updates gesucht …');
    try{
      const reg=await register();
      await reg.update();track(reg.installing);waiting();
      if(changed)apply();
      else if(!reg.installing&&!reg.waiting)publish('current','Du hast die aktuelle Version.');
    }catch(error){publish('error','Updates sind gerade nicht erreichbar. Bitte nochmals versuchen.');}
    finally{checking=false;}
  }
  FK.updates={get:()=>({...state}),check:()=>check(true),start:async(started=Promise.resolve())=>{
    if(!sw)return;
    sw.addEventListener('controllerchange',controllerChanged);
    sw.addEventListener('message',event=>{
      if(event.data?.type!=='farbtupf-update-error')return;
      installError=event.data.name==='QuotaExceededError'?'Für das Update ist zu wenig Speicher frei. Bitte gib auf dem Gerät Speicher frei und versuche es nochmals.':'Das Update konnte nicht geladen werden. Bitte nochmals versuchen.';
      publish('error',installError);
    });
    FK.on('screen',()=>{waiting();apply();});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
    window.addEventListener('pageshow',()=>check());
    window.addEventListener('online',()=>check(true));
    // Modal dismissal may reveal an idle screen without a route change.
    FK.on('modal-closed',()=>{waiting();apply();});
    await started;booted=true;
    if(document.readyState!=='complete')await new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
    check();
  }};
})();
