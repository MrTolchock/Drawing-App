/* Character identity is rendered from the same models used in the world. */
(function(){
'use strict';
const FK=window.FK;
const ids=['fox','squirrel','bird','owl','beaver','mouse','mailman','hedgehog','fish','deer','kingfisher','frog','badger','fox-sleep'];
function icon(name){const node=FK.icons.element(name);node.classList.add('ff-ui-art');return node;}
function portrait(id){
 const index=ids.indexOf(id);if(index<0)throw new Error('Unknown character portrait: '+id);
 return FK.h('span',{class:'ff-map-friend ff-character-portrait','aria-hidden':'true','data-art-role':'character','data-character':id,style:{backgroundPosition:((index%4)*100/3)+'% '+(Math.floor(index/4)*100/3)+'%'}});
}
FK.friendsArt={icon,portrait};
FK.on('screen',()=>document.documentElement.classList.toggle('friends-interface',!!FK.friendsLibrary?.active));
})();
