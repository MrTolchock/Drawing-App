/* One illustrated family for navigation, map destinations and settings. */
(function(){
  'use strict';
  const FK=window.FK,h=FK.h;
  const icons={map:[0,0],letter:[1,0],book:[0,1],gear:[1,1]};
  const portraits={squirrel:[0,0],bird:[1,0],owl:[2,0],beaver:[0,1],mouse:[1,1],fox:[2,1]};
  // The big world's neighbours, rendered from their plush models (tools/portraits/).
  const neighbours={hedgehog:[0,0],fish:[1,0],deer:[2,0],kingfisher:[0,1],frog:[1,1],badger:[2,1]};
  function icon(name){const cell=icons[name];return cell?h('span',{class:'ff-ui-art','aria-hidden':'true','data-icon':name,style:{backgroundPosition:(cell[0]*100)+'% '+(cell[1]*100)+'%'}}):null;}
  function portrait(id){
    if(id==='mailman')return h('img',{class:'ff-map-friend',src:'assets/forest-friends/mailman-portrait.webp',alt:'',draggable:'false'});
    if(neighbours[id]){const [x,y]=neighbours[id];return h('span',{class:'ff-map-friend ff-map-friend-sheet ff-neighbour-sheet','aria-hidden':'true',style:{backgroundPosition:(x*50)+'% '+(y*100)+'%'}});}
    const [x,y]=portraits[id]||portraits.fox;
    return h('span',{class:'ff-map-friend ff-map-friend-sheet','aria-hidden':'true',style:{backgroundPosition:(x*50)+'% '+(y*100)+'%'}});
  }
  FK.friendsArt={icon,portrait};
  FK.on('screen',()=>document.documentElement.classList.toggle('friends-interface',!!FK.friendsLibrary?.active));
})();
