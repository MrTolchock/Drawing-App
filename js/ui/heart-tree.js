/* Nine story repairs, nine branches of life. Practice never changes this count. */
(function () {
  'use strict';
  const FK=window.FK, h=FK.h;
  function count(state=FK.forestState.get()) {
    return state.endingSeen ? 9 : Object.keys(FK.forestStory.quests).filter(id=>state.contributions[id]===true).length;
  }
  const buds=[[28,62],[17,43],[33,31],[46,18],[64,24],[81,39],[72,58],[49,42],[51,65]];
  function picture(n=count()) {
    const leaves=buds.map(([x,y],i)=>i<n?'<g fill="'+['#9ebc73','#7f9e56','#adc986'][i%3]+'"><ellipse cx="'+(x-5)+'" cy="'+y+'" rx="10" ry="6" transform="rotate(25 '+x+' '+y+')"/><ellipse cx="'+(x+5)+'" cy="'+(y-7)+'" rx="6" ry="10"/><ellipse cx="'+(x+8)+'" cy="'+(y+5)+'" rx="9" ry="6"/></g>':'').join('');
    return h('span',{class:'heart-tree-picture',role:'img','aria-label':'Herzbaum: '+n+' von 9 Ästen wieder grün','data-growth':n,
      html:'<svg viewBox="0 0 100 110"><ellipse cx="50" cy="100" rx="39" ry="7" fill="#dce3c2"/><path d="M50 100Q47 74 50 40M49 81 28 62l-9-17M47 67 32 39l1-12M50 55l-6-28 3-13M50 73l23-16 10-20M51 52l15-17-3-15" fill="none" stroke="'+(n?'#92724c':'#9d9481')+'" stroke-width="7" stroke-linecap="round"/>'+leaves+'<path d="M50 81q-10-13-16-1-3 8 16 20 19-12 16-20-6-12-16 1" fill="'+(n?'#e6c26e':'#bbb3a0')+'"/>'+(n===9?'<g fill="#e1b6a5"><circle cx="20" cy="42" r="4"/><circle cx="64" cy="21" r="4"/><circle cx="77" cy="57" r="4"/><circle cx="43" cy="38" r="4"/></g>':'')+'</svg>'});
  }
  FK.heartTree={count,picture};
})();
