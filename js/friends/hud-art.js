/* One drawn family for world navigation. Source artwork, exact prompts and packing: design/artwork/. */
(function(){
  'use strict';
  const FK=window.FK,ids=['gear','map','letter','den','door','back'];
  function element(name){
    const index=ids.indexOf(name);if(index<0)throw Error('Unknown world picture: '+name);
    return FK.h('span',{class:'ff-hud-art','data-hud':name,'data-art-role':'world','aria-hidden':'true',style:{backgroundImage:'url("assets/interface/navigation.webp")',backgroundSize:'300% 200%',backgroundPosition:(index%3*50)+'% '+(Math.floor(index/3)*100)+'%'}});
  }
  FK.hudArt={has:name=>ids.includes(name),element};
})();
