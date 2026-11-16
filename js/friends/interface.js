/* Puzzle/map identities use the world models; invitation senders have a separate painted atlas. */
(function(){
'use strict';
const FK=window.FK;
const ids=['fox','squirrel','bird','owl','beaver','mouse','mailman','hedgehog','fish','deer','kingfisher','frog','badger','fox-sleep'];
function icon(name){const node=FK.icons.element(name);node.classList.add('ff-ui-art');return node;}
function portrait(id){
 const index=ids.indexOf(id);if(index<0)throw new Error('Unknown character portrait: '+id);
 return FK.h('span',{class:'ff-map-friend ff-character-portrait','aria-hidden':'true','data-art-role':'character','data-character':id,style:{backgroundPosition:((index%4)*100/3)+'% '+(Math.floor(index/4)*100/3)+'%'}});
}
// Invitation letters use a painted translation of the cast; puzzle/map identities keep the model atlas.
const letterIds=['fox','squirrel','bird','owl','beaver','mouse','mailman','hedgehog','fish','deer','kingfisher','frog','badger','ibex'];
function letterPortrait(id){
 const index=letterIds.indexOf(id);if(index<0)throw new Error('Unknown painted letter friend: '+id);
 return FK.h('span',{class:'ff-map-friend ff-letter-painted-portrait','aria-hidden':'true','data-art-role':'letter-character','data-character':id,style:{backgroundPosition:((index%4)*100/3)+'% '+(Math.floor(index/4)*100/3)+'%'}});
}
FK.friendsArt={icon,portrait,letterPortrait};
FK.on('screen',()=>document.documentElement.classList.toggle('friends-interface',!!FK.friendsLibrary?.active));
})();
