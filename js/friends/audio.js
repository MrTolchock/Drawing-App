/* Quiet procedural woodland bed, only after a user gesture; no remote audio requests. */
export function createAudio(settings){
  let ctx,bus,music,ambience,timer,notes=0,speaking=false;
  function update(){if(!ctx)return;const s=settings(),silent=document.hidden;music.gain.setTargetAtTime(s.music&&!silent?(speaking?.008:.025):0,ctx.currentTime,.25);ambience.gain.setTargetAtTime(s.ambience&&!silent?(speaking?.01:.035):0,ctx.currentTime,.25);}
  function tone(frequency,duration,gain,target,type='sine'){
    if(!ctx||document.hidden)return;const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;o.type=type;o.frequency.value=frequency;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(target);o.start();o.stop(t+duration);
  }
  function unlock(){
    if(ctx){if(ctx.state==='suspended')ctx.resume().catch(()=>{});return;}
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    try{ctx=new Audio();bus=ctx.createGain();bus.gain.value=.6;bus.connect(ctx.destination);music=ctx.createGain();ambience=ctx.createGain();music.connect(bus);ambience.connect(bus);
      const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),data=buffer.getChannelData(0);let smooth=0;for(let i=0;i<data.length;i++){smooth=(smooth+(Math.random()*2-1)*.02)/1.02;data[i]=smooth*3;}
      const wind=ctx.createBufferSource(),filter=ctx.createBiquadFilter();wind.buffer=buffer;wind.loop=true;filter.type='lowpass';filter.frequency.value=650;wind.connect(filter);filter.connect(ambience);wind.start();
      timer=setInterval(()=>{update();if(document.hidden)return;const scale=[261.63,329.63,392,440,392,329.63,293.66,329.63];tone(scale[notes++%scale.length],3,.22,music);if(notes%3===0){tone(1550, .22,.15,ambience);setTimeout(()=>tone(1900,.28,.10,ambience),230);}},1900);update();
    }catch{ctx=null;}
  }
  function say(text){if(!settings().speech||document.hidden)return;if(window.speechSynthesis&&window.SpeechSynthesisUtterance){
      const utterance=new SpeechSynthesisUtterance(text),voices=speechSynthesis.getVoices();
      utterance.voice=voices.find(v=>/^de[-_]CH$/i.test(v.lang))||voices.find(v=>/^de/i.test(v.lang))||null;
      utterance.lang=utterance.voice?.lang||'de-CH';utterance.rate=.85;utterance.pitch=1.05;
      speechSynthesis.cancel();speechSynthesis.speak(utterance);
    }speaking=true;update();setTimeout(()=>{speaking=false;update();},Math.max(1500,text.length*80));}
  document.addEventListener('visibilitychange',()=>{update();if(document.hidden)window.FK.forestVoice.cancel();});
  return {unlock,update,say,dispose(){clearInterval(timer);ctx?.close();}};
}
