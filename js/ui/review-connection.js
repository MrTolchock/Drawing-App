/* Adult-only GitHub connection and honest saved/pending/conflict feedback. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h;
  function statusLine(){
    const line=h('p',{class:'review-save-state',role:'status','aria-live':'polite'}),repo=FK.reviewRepository;
    if(!repo){line.textContent='Auf diesem Gerät gespeichert.';return line;}
    const draw=()=>{const state=repo.state;line.textContent=state.message+(state.pending?' · '+state.pending+' Änderung(en) warten auf GitHub.':'');line.dataset.sync=state.phase;};
    const off=FK.on('review-repository-change',()=>{if(!line.isConnected){off?.();return;}draw();});draw();return line;
  }
  function panel(){
    const repo=FK.reviewRepository;if(!repo)return h('p',{text:'Entwicklungsprüfung: Daten bleiben auf diesem Gerät.'});
    const root=h('section',{class:'review-connection setting-card'}),status=h('p',{role:'status','aria-live':'polite'});
    const input=h('input',{type:'password',autocomplete:'off','aria-label':'GitHub-Zugriffstoken',placeholder:'GitHub-Zugriffstoken',spellcheck:'false',maxlength:500});
    const connect=FK.ui.btn({label:'Mit GitHub verbinden',onClick:async()=>{const value=input.value;input.value='';connect.disabled=true;try{await repo.connect(value);}finally{connect.disabled=false;}}});
    const disconnect=FK.ui.btn({label:'GitHub trennen',onClick:()=>repo.disconnect()});
    const sync=FK.ui.btn({label:'Jetzt synchronisieren',onClick:()=>repo.refresh()});
    const setup=h('details',{},h('summary',{text:'GitHub zum Speichern verbinden'}),h('p',{text:'Nur zum Bearbeiten nötig. Zugriffstoken für MrTolchock/Drawing-App mit «Contents: Read and write» erstellen. Der Token bleibt in dieser Browsersitzung und wird nie mit Prüfungen exportiert.'}),
      h('a',{href:'https://github.com/settings/personal-access-tokens/new',target:'_blank',rel:'noopener noreferrer',text:'GitHub-Zugriffstoken erstellen'}),h('label',{},'GitHub-Zugriffstoken',input),connect);
    const conflicts=h('div',{class:'review-conflicts'});
    root.append(h('h3',{text:'Prüfung auf GitHub'}),h('p',{text:'Freigaben und Verbesserungen stehen in deinem öffentlichen GitHub-Repository. Andere Browser und neue Installationen laden sie automatisch. Offline bleibt die letzte Sicherung verfügbar. Spielstände und Zeichnungen bleiben auf dem Gerät.'}),status,
      h('div',{class:'review-actions'},sync,disconnect,h('a',{href:repo.url,target:'_blank',rel:'noopener noreferrer',text:'Gespeicherte Prüfung auf GitHub'})),setup,conflicts);
    function draw(){
      const state=repo.state;status.textContent=state.message+(state.pending?' · '+state.pending+' Änderung(en) noch nicht auf GitHub.':'');
      root.dataset.sync=state.phase;disconnect.hidden=!state.connected;setup.hidden=state.connected;sync.disabled=state.phase==='loading';
      conflicts.replaceChildren();
      for(const [id,conflict]of Object.entries(state.conflicts)){
        const names={approved:'Freigegeben',improve:'Verbessern',pending:'Offen'};
        conflicts.append(h('section',{},h('b',{text:conflict.local.key}),h('p',{text:'GitHub: '+(names[conflict.remote?.status]||'Noch keine Entscheidung')+' · Hier: '+names[conflict.local.status]}),
          FK.ui.btn({label:'GitHub behalten',onClick:()=>repo.resolve(id,'remote')}),FK.ui.btn({label:'Meine Änderung speichern',onClick:()=>repo.resolve(id,'local')})));
      }
    }
    const off=FK.on('review-repository-change',()=>{if(!root.isConnected){off?.();return;}draw();});draw();return root;
  }
  FK.reviewConnection={panel,statusLine};
})();
