/* One drawn family for world navigation. Source artwork, exact prompts and packing: design/artwork/. */
(function(){
  'use strict';
  const FK=window.FK,ids=['gear','map','letter','den','door','back'],symbols=ids.slice(0,3);
  function element(name){
    const index=ids.indexOf(name);if(index<0)throw Error('Unknown world picture: '+name);
    const simple=symbols.includes(name),columns=simple?2:3,back=name==='back';
    return FK.h('span',{class:'ff-hud-art','data-hud':name,'data-art-role':'world','aria-hidden':'true',style:{backgroundImage:'url("assets/interface/'+(back?'navigation-back':simple?'navigation-symbols':'navigation')+'.webp")',backgroundSize:back?'100% 100%':columns*100+'% 200%',backgroundPosition:back?'center':(index%columns*100/(columns-1))+'% '+(Math.floor(index/columns)*100)+'%'}});
  }
  function decorateBack(button){
    button.classList.add('ff-navigation-back');
    // Retain the hidden legacy SVG handle used by the old handwriting overview.
    if(!button.querySelector('[data-hud="back"]'))button.append(element('back'));
    return button;
  }
  FK.hudArt={has:name=>ids.includes(name),element,decorateBack};
})();
