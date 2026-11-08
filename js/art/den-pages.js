/* Illustrated free-colouring pages for the fox's table. Original page IDs remain available for saved pictures. */
(function(){
  'use strict';
  const FK=window.FK,sheet=new Image();
  const ready=new Promise(resolve=>{sheet.onload=()=>resolve(true);sheet.onerror=()=>resolve(false);});
  sheet.src='assets/forest-friends/colouring-friends.webp';
  const entries=[['fuchs','Fuchs im Malatelier'],['eichhoernchen','Eichhörnchens Nüsse'],['waldkauz','Waldkauz liest'],['biber','Biber am Bach'],['maus','Maus beim Picknick'],['blaumeise','Blaumeise am Nest']];
  FK.art.CATS.push({id:'waldfreunde',name:'Waldfreunde',icon:'🦊'});
  FK.art.denPages=entries.map(([id,name],index)=>{
    const page={id:'bilderbrief-'+id,name,cat:'waldfreunde',ready,draw(g){
      if(!sheet.complete||!sheet.naturalWidth)return;
      const w=sheet.naturalWidth/3,h=sheet.naturalHeight/2;
      g.ctx.drawImage(sheet,(index%3)*w,Math.floor(index/3)*h,w,h,20,20,960,960);
    }};
    FK.art.add(page);return page;
  });
  FK.art.denReady=ready;
})();
