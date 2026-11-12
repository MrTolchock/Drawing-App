/* Shared touch gestures and optional rule speech. */
(function(){
'use strict';
const FK=window.FK,h=FK.h;
  function listen(text, label = 'Aufgabe nochmals hören') {
    return h('button', { type:'button', class:'play-listen', 'aria-label':label, onclick:() => FK.forestVoice.explain(typeof text === 'function' ? text() : text) }, FK.icons.element('speaker'));
  }
  // One shared button gesture for the whole app, including the world, books,
  // settings and popovers. Suppress only the compatibility click of that gesture.
  const presses=new Map(), consumed=new Set();
  let compatibility=null,lastDown=null;
  const buttonAt=target=>target?.closest?.('button');
  function suppressCompatibility(event){compatibility={id:event.pointerId,type:event.pointerType,x:event.clientX,y:event.clientY};}
  document.addEventListener('pointerdown',event=>{
    compatibility=null;consumed.delete(event.pointerId);lastDown=event;
    if(event.pointerType!=='touch')return;
    if(!event.isPrimary){presses.forEach(p=>p.moved=true);return;}
    presses.set(event.pointerId,{button:buttonAt(event.target),x:event.clientX,y:event.clientY,moved:false});
  },true);
  document.addEventListener('pointermove',event=>{
    const press=presses.get(event.pointerId);
    if(press&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>14)press.moved=true;
  },true);
  document.addEventListener('pointercancel',event=>{presses.delete(event.pointerId);consumed.delete(event.pointerId);},true);
  document.addEventListener('pointerup',event=>{
    const press=presses.get(event.pointerId);presses.delete(event.pointerId);
    if(consumed.delete(event.pointerId)||event.fkPlayHandled){suppressCompatibility(event);return;}
    if(event.pointerType!=='touch'||!event.isPrimary||!press?.button)return;
    const button=press.button;
    // Hit-test the stable button, rather than a picture/text node that an atlas
    // or a counter may replace between down and up. Scrolling is never a tap.
    if(press.moved||!button.isConnected||button.disabled||buttonAt(document.elementFromPoint(event.clientX,event.clientY))!==button){
      suppressCompatibility(event);return;
    }
    suppressCompatibility(event);
    button.click(); // detail=0: keyboard and programmatic activation stay native.
  });
  document.addEventListener('click',event=>{
    if(!compatibility||event.detail===0)return;
    // A busy render can delay this click. Match its gesture regardless of time;
    // the next pointerdown clears the record, so fresh input is never blocked.
    const samePointer=event.pointerId===compatibility.id;
    const convertedTouch=compatibility.type==='touch'&&(event.pointerType==='touch'||event.sourceCapabilities?.firesTouchEvents||!event.pointerType);
    const legacyMouse=!event.pointerType&&compatibility.type==='mouse';
    if((samePointer||convertedTouch||legacyMouse)&&Math.hypot(event.clientX-compatibility.x,event.clientY-compatibility.y)<26){
      compatibility=null;event.preventDefault();event.stopImmediatePropagation();
    }
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){presses.clear();consumed.clear();compatibility=null;lastDown=null;}});
  function consumeGesture(event=lastDown){if(event)consumed.add(event.pointerId);}
  // Kept for existing activities; the document delegate already includes them.
  function bindTouch(root){return root;}

FK.play={listen,consumeGesture,bindTouch};
})();
