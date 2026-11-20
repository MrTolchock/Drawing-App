/* One drawn family for world navigation. Source artwork, exact prompts and packing: design/artwork/. */
(function(){
  'use strict';
  const FK=window.FK,ids=['gear','map','letter','den','door','back','close'],symbols=ids.slice(0,3),single={den:'den-marker.webp',door:'exit-symbol.webp',back:'navigation-back.webp',close:'navigation-close.webp'};
  function element(name){
    const index=ids.indexOf(name);if(index<0)throw Error('Unknown world picture: '+name);
    const file=single[name],cell=symbols.indexOf(name);
    return FK.h('span',{class:'ff-hud-art','data-hud':name,'data-art-role':'world','aria-hidden':'true',style:{backgroundImage:'url("assets/interface/'+(file||'navigation-symbols.webp')+'")',backgroundSize:file?'100% 100%':'200% 200%',backgroundPosition:file?'center':(cell%2*100)+'% '+(Math.floor(cell/2)*100)+'%'}});
  }
  function decorateBack(button){
    button.classList.add('ff-navigation-back');
    // Retain the hidden legacy SVG handle used by the old handwriting overview.
    if(!button.querySelector('[data-hud="back"]'))button.append(element('back'));
    return button;
  }
  function decorateClose(button){button.classList.add('ff-navigation-close');if(!button.querySelector('[data-hud="close"]'))button.append(element('close'));return button;}
  FK.hudArt={has:name=>ids.includes(name),element,decorateBack,decorateClose};
})();
