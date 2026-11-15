/* Painted pictures for the world's own buttons (forest and den): the letter, the picture map, the adults' settings,
   the den tree (home) and the door. Same 48-unit grid and sepia outline as the utility icons, but filled in the
   world's warm palette so they sit with the painted den and the plush cast. The puzzle pages keep the plain utility
   family (js/ui/waldatelier-icons.js). */
(function(){
  'use strict';
  const FK=window.FK,ink='#6a4a2e';
  const pics={
    // an envelope with a red wax seal and a little green stamp
    letter:`<path d="M5 13.5q0-3 3-3h32q3 0 3 3v21q0 3-3 3H8q-3 0-3-3Z" fill="#fbf1d9"/><path d="M6 13l18 13.5L42 13" fill="#f0dfb8"/><path d="M6 36l13-11m23 11L29 25" fill="none" stroke-width="1.6" opacity=".55"/>
      <rect x="33" y="14.5" width="6.5" height="7" rx="1" fill="#a9c47a" stroke-width="1.2"/><circle cx="24" cy="26" r="5.2" fill="#c4473a"/><path d="M21.6 24.6q2.4-2 4.8 0" fill="none" stroke="#f3b2a5" stroke-width="1.2"/>`,
    // a folded parchment map: wood, river, a red dotted path and the cross where to go
    map:`<path d="M5 10l12.5-4 13 4L43 6v32l-12.5 4-13-4L5 42Z" fill="#f3e2b6"/><path d="M17.5 6v32m13-28v32" fill="none" stroke-width="1.4" opacity=".5"/><path d="M17.5 6l13 4v32l-13-4Z" fill="#ead39c" stroke="none"/>
      <path d="M8 16q4-3 7 0t-1 6q-4 2-6-1Z" fill="#8fae5a" stroke-width="1.2"/><path d="M32 30q4-3 8-1t0 6q-5 2-7-1Z" fill="#8fae5a" stroke-width="1.2"/><path d="M22 7q-3 9 2 16t1 18" fill="none" stroke="#6aa2c8" stroke-width="2.6"/>
      <path d="M10 33q6-2 9-8t10-8 9-4" fill="none" stroke="#c4473a" stroke-width="1.8" stroke-dasharray="2.2 2.6"/><path d="M35 9.5l4 4m0-4l-4 4" stroke="#c4473a" stroke-width="2"/>`,
    // the adults' settings: a wooden cog with a cream hub
    gear:`<path d="M21 4.5h6l1 5.2 3.8 1.6 4.4-3 4.2 4.2-3 4.4 1.6 3.8 5.2 1v6l-5.2 1-1.6 3.8 3 4.4-4.2 4.2-4.4-3-3.8 1.6-1 5.2h-6l-1-5.2-3.8-1.6-4.4 3-4.2-4.2 3-4.4-1.6-3.8-5.2-1v-6l5.2-1 1.6-3.8-3-4.4 4.2-4.2 4.4 3 3.8-1.6Z" fill="#c98d3e"/>
      <circle cx="24" cy="24" r="10.5" fill="#b07a3a" stroke-width="1.4"/><path d="M15.5 20q3-6 9-6.5" fill="none" stroke="#e9b973" stroke-width="2"/><circle cx="24" cy="24" r="5" fill="#fbf1d9"/>`,
    // Fuchs' home: the big den tree with its round window and arched door
    den:`<path d="M9 22q-3-11 8-14 4-6 12-3 9-1 11 7 6 5 1 11Z" fill="#7f9a48"/><path d="M14 13q4-4 9-2m6 0q5-1 7 3" fill="none" stroke="#a9c47a" stroke-width="2"/>
      <path d="M15 43q3-4 3-10V21q6 2 12 0v12q0 6 3 10Z" fill="#a8703f"/><path d="M11 43q4 0 7-3m19 3q-4 0-7-3" fill="none" stroke-width="2"/>
      <path d="M20.5 43v-7q3.5-5 7 0v7Z" fill="#5a3a22"/><circle cx="28.5" cy="27" r="2.6" fill="#ffd37a" stroke-width="1.4"/><path d="M21 24q1 6 0 9" fill="none" stroke="#8a5530" stroke-width="1.3"/>`,
    // a wooden door in an arch, half open to the wood
    door:`<path d="M10 43V20q0-12 14-12t14 12v23Z" fill="#a8703f"/><path d="M14 43V21q0-9 10-9t10 9v22Z" fill="#cfe2a8"/><path d="M14 43V21q0-9 10-9v35Z" fill="#7b4c2b"/><path d="M17 20v20m4-24v26" fill="none" stroke="#5a3a22" stroke-width="1.4"/><circle cx="21.5" cy="30" r="1.4" fill="#e8b968" stroke-width="1"/><path d="M26 43q5-6 4-13m4 13q-1-5 2-8" fill="none" stroke="#7f9a48" stroke-width="2"/>`,
  };
  function element(name){
    const svg=`<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${pics[name]}</g></svg>`;
    return FK.h('span',{class:'ff-hud-art','data-hud':name,'data-art-role':'world','aria-hidden':'true',html:svg});
  }
  FK.hudArt={has:name=>!!pics[name],element};
})();
