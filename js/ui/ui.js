/* Farbtupf – Bausteine für alle Bildschirme und der Bildschirm-Wechsel (Router).

   Screens:
     FK.screen('name', {
       build(root) { … },          // once, root = <section class="screen" data-screen="name">
       enter(params) { … },        // every time the screen is shown
       leave() { … },              // when another screen is shown (stop timers, free canvases)
     });
     FK.go('name', params)  – show a screen (keeps a history)
     FK.back()              – previous screen (or the games book)
*/
(function () {
  'use strict';
  const FK = window.FK;
  const h = FK.h;

  /* ---------- router ---------- */
  const screens = {};
  const stack = [];
  const pendingSaves = new Set(); // Updates wait for editor snapshots before replacing the document.
  let current = null;

  FK.screen = (name, def) => { screens[name] = { def, root: null }; };

  function rootFor(name) {
    const s = screens[name];
    if (!s.root) {
      s.root = h('section', { class: 'screen screen-' + name, 'data-screen': name, hidden: true });
      document.getElementById('screens').append(s.root);
      if (s.def.build) s.def.build(s.root);
      // Release the screen's temporary compositing layer after navigation. Keeping
      // it around can leave the fixed header rasterised softly on iOS Safari.
      s.root.addEventListener('animationend', (e) => {
        if (e.target === s.root && (e.animationName === 'screen-in' || e.animationName === 'screen-back')) {
          s.root.classList.remove('in', 'in-back');
        }
      });
    }
    return s.root;
  }

  FK.go = (name, params, opts) => {
    opts = opts || {};
    if(['hub','forest-book'].includes(name)){FK.puzzleReview.open();return;}
    if(name==='forest')name='friends';
    if(name==='parents')name='settings';
    if(!screens[name]){name='friends';params={};}
    FK.ui.closeModal();
    const library=FK.friendsLibrary;
    if(library){
      library.active=true;
      if(name==='trace')params={...params,stage:1,lvl:1,level:1,returnTo:params?.returnTo||'friends'};
    }
    const prev = current;
    if (prev && screens[prev.name].def.leave) {
      const saving=screens[prev.name].def.leave();
      if(saving?.then){pendingSaves.add(saving);saving.then(()=>pendingSaves.delete(saving),()=>pendingSaves.delete(saving));}
    }
    if (prev && !opts.replace && !opts.isBack) stack.push(prev);
    // Forest and games book are root entries; discard stale return screens there.
    if (name === 'forest-book' || name === 'forest' || name === 'friends') stack.length = 0;
    while (stack.length && stack[stack.length - 1].name === name) stack.pop();
    const root = rootFor(name);
    // Waldbuch: the friend who set the puzzle colours its page (ribbon, tag, twig items).
    const host = library?.active ? library.hosts[params?.game] || library.hosts[name] : null;
    if (host) root.dataset.host = host; else delete root.dataset.host;
    if (prev && prev.name !== name) {
      const pr = screens[prev.name].root;
      pr.hidden = true;
      pr.classList.remove('in', 'in-back');
    }
    current = { name, params: params || {} };
    root.hidden = false;
    root.classList.remove('in', 'in-back');
    void root.offsetWidth;
    root.classList.add(opts.isBack ? 'in-back' : 'in');
    document.documentElement.dataset.screen = name;
    if (screens[name].def.enter) screens[name].def.enter(params || {});
    FK.emit('screen', current);
  };

  FK.back = () => {
    const prev = stack.pop();
    if (prev) FK.go(prev.name, prev.params, { isBack: true });
    else if(FK.friendsLibrary?.active)FK.go('friends',{}, {isBack:true});
    else FK.go('friends',{}, {isBack:true});
  };
  FK.current = () => (current ? current.name : null);
  FK.screenExists = (name) => !!screens[name];

  /* ---------- components ---------- */

  function btn(o) {
    const b = h('button', {
      type: 'button',
      class: 'btn' + (o.cls ? ' ' + o.cls : ''),
      'aria-label': o.title || o.label || null,
      onclick: o.onClick ? (e) => { FK.sound.tick(); o.onClick(e); } : null,
    });
    if (o.icon) b.insertAdjacentHTML('beforeend', FK.icon(o.icon));
    if (o.emoji) b.append(h('span', { class: 'ic emoji', 'aria-hidden': 'true', text: o.emoji }));
    if (o.label) b.append(h('span', { class: 'lbl', text: o.label }));
    return b;
  }

  // o.onClick makes the counter a button (on the hub it opens the Sammelalbum).
  function starCounter(o) {
    o = o || {};
    const el = h(o.onClick ? 'button' : 'div', { class: 'star-count', 'aria-label': 'Sterne' });
    if (o.onClick) {
      el.type = 'button';
      el.addEventListener('click', () => { FK.sound.tick(); o.onClick(); });
    }
    el.innerHTML = FK.icon('star', 'ic star-ic') + '<b></b>';
    const val = el.querySelector('b');
    const set = () => { val.textContent = String(FK.progress.stars()); };
    set();
    FK.on('stars', set);
    const visibility=()=>{el.hidden=!!FK.friendsLibrary?.active;};
    visibility();
    FK.on('screen',visibility);
    return el;
  }

  // Header with a home/back button, a title and the star counter.
  function settingsButton() {
    const b=btn({ icon:'gear', cls:'btn-round btn-parents', title:'Einstellungen für Erwachsene', onClick:() => parentGate(() => FK.go('settings')) });
    if(FK.friendsArt)b.replaceChildren(FK.friendsArt.icon('gear'));
    return b;
  }

  function topbar(o) {
    const bar = h('header', { class: 'topbar' });
    if (o.back !== false) {
      bar.append(btn({
        icon: o.backIcon || 'back',
        cls: 'btn-round btn-back',
        title: o.backTitle || 'Zurück',
        onClick: o.onBack || (() => FK.back()),
      }));
    }
    const t = h('h1', { class: 'title' });
    if (o.title) t.textContent = o.title;
    bar.append(t);
    if (o.extra) o.extra.forEach((e) => bar.append(e));
    if (o.stars !== false) bar.append(starCounter());
    return bar;
  }

  let praiseTimer = 0;
  function praise(text, big) {
    const p = document.getElementById('praise');
    p.textContent = text;
    p.className = 'praise' + (big ? ' big' : '');
    p.hidden = false;
    p.style.animation = 'none';
    void p.offsetWidth;
    p.style.animation = '';
    clearTimeout(praiseTimer);
    praiseTimer = setTimeout(() => { p.hidden = true; }, 2000);
  }

  const PRAISE = ['Mega schön!', 'Bravo!', 'Super gemacht!', 'Wunderschön!', 'Grossartig!', 'Toll!', 'Juhui!', 'Wow!'];

  /* ---------- «Neuer Sticker!» ---------- */
  // A sticker for the Sammelalbum is earned every STARS_PER_STICKER stars. The 'stars' event comes
  // right before a celebration; the new stickers are announced when that celebration is over.
  let newStickers = [];
  FK.on('stars', (e) => {
    if (!e || !(e.added > 0) || !FK.REWARDS) return;
    const per = FK.STARS_PER_STICKER;
    const max = FK.REWARDS.length;
    const before = Math.min(max, Math.floor((e.total - e.added) / per));
    const after = Math.min(max, Math.floor(e.total / per));
    for (let i = before; i < after; i++) newStickers.push(i);
  });
  // stickers the child already saw in the Sammelalbum (or a reset) are not announced again
  FK.on('settings', (e) => {
    if (!e || e.key !== 'album.seen') return;
    const seen = e.value | 0;
    newStickers = seen ? newStickers.filter((i) => i >= seen) : [];
  });

  function stickerMoment() {
    const list = newStickers.slice(-3);
    newStickers = [];
    if (!list.length) return Promise.resolve();
    const title = FK.text.word(list.length > 1 ? 'Neue Sticker!' : 'Neuer Sticker!');
    const row = h('div', { class: 'ns-row n' + list.length });
    list.forEach((i, k) => {
      const st = h('span', { class: 'ns-sticker' }, h('span', { class: 'emoji', text: FK.REWARDS[i][0] }));
      st.style.setProperty('--k', k);
      st.style.setProperty('--tilt', (k % 2 ? 7 : -6) + 'deg');
      row.append(st);
    });
    const name = list.length === 1 ? h('span', { class: 'ns-name', text: FK.text.word(FK.REWARDS[list[0]][1]) }) : null;
    const album = h('span', { class: 'ns-album', html: FK.icon('album', 'ic') });
    const card = h('div', { class: 'ns-card' }, h('b', { class: 'ns-title', text: title }), row, name, album);
    const wrap = h('div', { class: 'new-sticker', role: 'status', 'aria-label': title }, card);
    document.body.append(wrap);
    FK.sound.rainbow();
    return new Promise((resolve) => {
      setTimeout(() => {
        const r = row.getBoundingClientRect();
        FK.fx.burst(r.left + r.width / 2, r.top + r.height / 2);
      }, 350);
      // after a moment the stickers fly into the album book; whatever comes next (end card) may
      // already appear underneath while they fly
      setTimeout(() => {
        const a = album.getBoundingClientRect();
        row.querySelectorAll('.ns-sticker').forEach((st) => {
          const b = st.getBoundingClientRect();
          st.style.setProperty('--dx', a.left + a.width / 2 - (b.left + b.width / 2) + 'px');
          st.style.setProperty('--dy', a.top + a.height / 2 - (b.top + b.height / 2) + 'px');
          st.classList.add('fly');
        });
        if (name) name.classList.add('fade');
        resolve();
      }, 1300);
      setTimeout(() => {
        FK.sound.twinkle();
        bounce(album);
      }, 1850);
      setTimeout(() => {
        wrap.classList.add('out');
        setTimeout(() => wrap.remove(), 260);
      }, 2350);
    });
  }

  // Sound + confetti + praise bubble + stars flying into the counter (+ new sticker). Resolves when done.
  async function celebrate(o) {
    o = o || {};
    const big = !!o.big;
    if (big) FK.sound.fanfare();
    else FK.sound.tada();
    praise(o.text || FK.pick(PRAISE), big);
    FK.fx.confetti(big ? 220 : 140);
    if (big) FK.fx.fireworks(5);
    await FK.wait(450);
    if (o.stars > 0) {
      FK.sound.star();
      await FK.fx.starFly(o.from || null, o.stars);
    } else {
      await FK.wait(700);
    }
    if (newStickers.length) {
      await FK.wait(120);
      await stickerMoment();
    }
  }

  /* ---------- word with Silbenbögen ---------- */
  // FK.ui.word('Ba-na-ne', { highlight: 'B', arcs: true }) – case follows the parents' setting.
  function word(w, o) {
    o = o || {};
    const parts = w.split('-');
    const el = h('span', { class: 'word' + (o.cls ? ' ' + o.cls : ''), 'aria-label': FK.text.word(parts.join('')) });
    let hlDone = !o.highlight;
    parts.forEach((p, i) => {
      const txt = FK.text.word(p);
      const syl = h('span', { class: 'syl syl-' + (i % 2) });
      if (!hlDone) {
        const idx = txt.toLocaleLowerCase('de-CH').indexOf(o.highlight.toLocaleLowerCase('de-CH'));
        if (idx >= 0) {
          hlDone = true;
          syl.append(txt.slice(0, idx), h('span', { class: 'hl', text: txt.slice(idx, idx + o.highlight.length) }), txt.slice(idx + o.highlight.length));
        } else syl.textContent = txt;
      } else syl.textContent = txt;
      if (o.arcs !== false) syl.insertAdjacentHTML('beforeend', '<svg class="arc" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 4 Q50 26 96 4"/></svg>');
      el.append(syl);
    });
    return el;
  }

  /* ---------- mascot «Tupfi» ---------- */
  function mascot(o) {
    o = o || {};
    const fox=h('div',{class:'mascot wa-mascot'+(o.cls?' '+o.cls:''),'aria-hidden':'true'});
    fox.append(FK.friendsArt.portrait('fox'));return fox;
  }

  /* ---------- modal ---------- */
  let modalEl = null;
  function closeModal() {
    if (!modalEl) return;
    const m = modalEl;
    modalEl = null;
    if (m._onClose) m._onClose();
    m.remove();
    FK.emit('modal-closed');
  }

  // Dismissing an overlay consumes this pointer gesture, never the next tap.
  function eatClick(event) { FK.play?.consumeGesture(event); }

  // FK.ui.modal({ title, read, body: element, actions: [{ label, icon, cls, onClick }], wide, cls, onClose })
  // read: the title is a word the child reads (Andika). A card with a body and actions is laid out
  // side by side on low phone screens (.split), so the buttons never scroll away.
  function modal(o) {
    closeModal();
    const split = o.body && o.actions && o.actions.length;
    const card = h('div', { class: 'modal-card' + (o.wide ? ' wide' : '') + (split ? ' split' : '') + (o.cls ? ' ' + o.cls : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title || '' });
    if (o.title) card.append(h('h2', { class: 'modal-title' + (o.read ? ' read' : ''), text: o.title }));
    if (o.body) card.append(o.body);
    if (o.actions && o.actions.length) {
      const row = h('div', { class: 'modal-actions' });
      o.actions.forEach((a) => row.append(btn({
        icon: a.icon, label: a.label, cls: 'btn-big ' + (a.cls || ''),
        onClick: () => {
          if (a.keepOpen !== true) {
            // onClose is only for a modal dismissed without choosing an action (X, backdrop, Escape)
            if (modalEl === wrap) wrap._onClose = null;
            closeModal();
          }
          if (a.onClick) a.onClick();
        },
      })));
      card.append(row);
    }
    const close = btn({ icon: 'close', cls: 'btn-round modal-x', title: 'Schliessen', onClick: closeModal });
    card.append(close);
    const wrap = h('div', { class: 'modal' }, card);
    wrap.addEventListener('pointerdown', (e) => {
      if (e.target !== wrap) return;
      closeModal();
      eatClick(e);
    });
    wrap._onClose = o.onClose;
    document.body.append(wrap);
    // Touch confirmation works on pointer release, including browsers that omit
    // a compatibility click after the paint canvas has handled a gesture.
    FK.play?.bindTouch(wrap);
    modalEl = wrap;
    requestAnimationFrame(()=>rowFocus());
    function rowFocus(){if(modalEl===wrap)(wrap.querySelector('input,.modal-actions button')||close).focus();}
    FK.sound.open();
    return { close: closeModal, el: card };
  }

  // danger: the safe answer is the big green one, the destructive one is red with a bin.
  // read: the question is for the child (Andika; the caller passes it through FK.text.word).
  function confirm(text, yesLabel, noLabel, o) {
    o = o || {};
    return new Promise((resolve) => {
      const yes = { label: yesLabel || 'Ja', icon: o.danger ? 'trash' : 'check', cls: o.danger ? 'btn-danger' : '', onClick: () => resolve(true) };
      const no = { label: noLabel || 'Nein', icon: o.danger ? 'check' : 'close', cls: o.danger ? 'btn-go' : '', onClick: () => resolve(false) };
      modal({
        title: text,
        read: o.read,
        actions: o.danger ? [no, yes] : [yes, no],
        onClose: () => resolve(false),
      });
    });
  }

  // Adults enter the product themselves, so a wrong answer can be corrected
  // without a hidden lockout or four choices that can be guessed by elimination.
  function parentGate(fn) {
    const x=3+Math.floor(Math.random()*7),y=3+Math.floor(Math.random()*7);
    const task=h('p',{class:'gate-task',id:'parent-gate-task',text:x+' × '+y+' = ?'});
    const answer=h('input',{class:'gate-input',id:'parent-gate-answer',type:'text',inputmode:'numeric',pattern:'[0-9]*',maxlength:3,autocomplete:'off',enterkeyhint:'done','aria-describedby':'parent-gate-task parent-gate-feedback'});
    const feedback=h('p',{class:'gate-feedback',id:'parent-gate-feedback',role:'status','aria-live':'polite'});
    const submit=h('button',{type:'submit',class:'btn btn-go gate-submit'},h('span',{class:'lbl',text:'Öffnen'}));
    let opened=false;
    const form=h('form',{class:'gate-body',novalidate:true,onsubmit:event=>{
      event.preventDefault();if(opened)return;
      if(!/^\d{1,3}$/.test(answer.value.trim())||Number(answer.value)!==x*y){
        answer.setAttribute('aria-invalid','true');feedback.textContent='Das stimmt noch nicht. Bitte nochmals versuchen.';
        FK.sound.nope();answer.focus();answer.select();return;
      }
      opened=true;m.close();fn();
    }},task,h('label',{class:'gate-label',for:'parent-gate-answer',text:'Deine Antwort'}),answer,feedback,submit);
    answer.addEventListener('input',()=>{answer.removeAttribute('aria-invalid');feedback.textContent='';});
    const m=modal({title:'Für Eltern',cls:'gate',body:form});
    answer.focus(); // Synchronous with the opening tap, including iPhone keyboards.
  }

  // Calls fn after the element was held for `ms`. Shows a filling ring.
  function longPress(el, ms, fn) {
    let timer = 0;
    const start = (e) => {
      e.preventDefault();
      el.classList.add('holding');
      el.style.setProperty('--hold', ms + 'ms');
      timer = setTimeout(() => {
        el.classList.remove('holding');
        fn();
      }, ms);
    };
    const stop = () => {
      clearTimeout(timer);
      el.classList.remove('holding');
    };
    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointerleave', stop);
    el.addEventListener('pointercancel', stop);
  }

  // Shakes an element (wrong answer) or bounces it (right answer).
  function shake(el) {
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }
  function bounce(el) {
    if (!el) return;
    el.classList.remove('bounce');
    void el.offsetWidth;
    el.classList.add('bounce');
  }

  let toastTimer = 0;
  // o.read: a short message for the child (reading font, GROSS/normal setting)
  function toast(text, ms, o) {
    const t = document.getElementById('toast');
    const read = !!(o && o.read);
    t.textContent = read ? FK.text.word(text) : text;
    t.classList.toggle('read', read);
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms || 2200);
  }

  async function whenSaved(){while(pendingSaves.size)await Promise.all([...pendingSaves]);}
  FK.ui = { btn, topbar, settingsButton, starCounter, praise, celebrate, word, mascot, modal, closeModal, confirm, parentGate, longPress, shake, bounce, toast, eatClick, PRAISE, whenSaved };
})();
