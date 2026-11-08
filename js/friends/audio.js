/* Offline woodland ambience: wind, rustling foliage, flowing water and varied bird phrases.
   Audio starts only after a gesture. There is no automatic speech or remote audio request. */
export function createAudio(settings){
  let ctx,music,ambience,analyser,timer,area='den',speaking=false,notes=0,nextBird=0,birdCalls=0;
  const sources=[];
  function gain(node,value){node.gain.cancelScheduledValues(ctx.currentTime);if(document.hidden)node.gain.setValueAtTime(0,ctx.currentTime);else node.gain.setTargetAtTime(value,ctx.currentTime,.3);}
  function update(){if(!ctx||ctx.state==='closed')return;const s=settings(),audible=!document.hidden;gain(music,s.music&&audible?(speaking?.014:.035):0);gain(ambience,s.ambience&&audible?(area==='forest'?.72:.25)*(speaking?.3:1):0);}
  function noise(colour){
    const n=ctx.sampleRate*6,buffer=ctx.createBuffer(2,n,ctx.sampleRate);
    for(let channel=0;channel<2;channel++){const data=buffer.getChannelData(channel);let brown=0;
      for(let i=0;i<n;i++){const white=Math.random()*2-1;brown=(brown+white*.025)/1.025;data[i]=colour==='brown'?brown*3:white*.35;}
      const fade=Math.floor(ctx.sampleRate*.04);for(let i=0;i<fade;i++)data[i]=data[n-fade+i]*(1-i/fade)+data[i]*(i/fade);
    }return buffer;
  }
  function bed(buffer,{frequency,type='lowpass',volume,rate=1,drift=0}){
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),level=ctx.createGain();source.buffer=buffer;source.loop=true;source.playbackRate.value=rate;filter.type=type;filter.frequency.value=frequency;filter.Q.value=.45;level.gain.value=volume;
    source.connect(filter);filter.connect(level);level.connect(ambience);source.start();sources.push(source);
    if(drift){const lfo=ctx.createOscillator(),depth=ctx.createGain();lfo.frequency.value=drift;depth.gain.value=volume*.35;lfo.connect(depth);depth.connect(level.gain);lfo.start();sources.push(lfo);}
  }
  function note(frequency,start){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(.16,start+.15);g.gain.exponentialRampToValueAtTime(.0001,start+3.4);o.connect(g);g.connect(music);o.start(start);o.stop(start+3.5);o.onended=()=>{o.disconnect();g.disconnect();};}
  function birds(){
    if(!ctx||document.hidden||!settings().ambience)return;
    const pan=ctx.createStereoPanner?.(),target=pan||ambience;if(pan){pan.pan.value=Math.random()*1.5-.75;pan.connect(ambience);}
    const base=2100+Math.random()*1250,count=3+Math.floor(Math.random()*4),start=ctx.currentTime+.05;
    for(let i=0;i<count;i++){
      const t=start+i*(.16+Math.random()*.08),duration=.09+Math.random()*.13,o=ctx.createOscillator(),g=ctx.createGain();
      const curve=Float32Array.from({length:24},(_,j)=>base*(1+Math.sin(j/23*Math.PI)*.25)+Math.sin(j*1.4)*55-(i%2)*280);
      o.frequency.setValueCurveAtTime(curve,t,duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.025,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(target);o.start(t);o.stop(t+duration+.01);
      o.onended=()=>{o.disconnect();g.disconnect();};
    }
    if(pan)setTimeout(()=>pan.disconnect(),2300);birdCalls++;
  }
  function tick(){
    update();if(!ctx||document.hidden||ctx.state!=='running')return;
    if(settings().ambience&&ctx.currentTime>=nextBird){birds();nextBird=ctx.currentTime+3+Math.random()*5;}
    if(settings().music&&notes++%3===0){const scale=[261.63,329.63,392,440,392,329.63,293.66,329.63];note(scale[Math.floor(notes/3)%scale.length],ctx.currentTime);}
  }
  function unlock(){
    if(ctx){if(ctx.state==='suspended')ctx.resume().catch(()=>{});return;}
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio||document.hidden)return;
    try{
      ctx=new Audio();const master=ctx.createGain();master.gain.value=.55;analyser=ctx.createAnalyser();analyser.fftSize=1024;master.connect(analyser);analyser.connect(ctx.destination);
      music=ctx.createGain();ambience=ctx.createGain();music.gain.value=ambience.gain.value=0;music.connect(master);ambience.connect(master);
      const brown=noise('brown'),white=noise('white');
      bed(brown,{frequency:620,volume:.5,drift:.12});
      bed(white,{frequency:2300,type:'bandpass',volume:.045,drift:.31});
      bed(white,{frequency:950,type:'bandpass',volume:.06,rate:.83,drift:.17});
      bed(brown,{frequency:180,type:'highpass',volume:.12,rate:.71});
      nextBird=ctx.currentTime+.5;timer=setInterval(tick,650);update();ctx.resume().catch(()=>{});
    }catch{ctx?.close().catch(()=>{});ctx=null;}
  }
  const key=e=>{if(e.key==='Enter'||e.key===' ')unlock();};
  const visibility=()=>{update();if(document.hidden)window.FK.forestVoice.cancel();};
  document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
  const offSettings=window.FK.on('friends-audio',()=>{unlock();update();}),offSpeech=window.FK.on('speech',event=>{speaking=event.active;update();});
  return {unlock,update,setArea(value){area=value;update();},get diagnostics(){const data=new Float32Array(analyser?.fftSize||0);analyser?.getFloatTimeDomainData(data);return {state:ctx?.state||'locked',area,layers:ctx?4:0,birdCalls,ambience:settings().ambience,music:settings().music,rms:data.length?Math.sqrt(data.reduce((n,v)=>n+v*v,0)/data.length):0};},
    dispose(){clearInterval(timer);offSettings();offSpeech();document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);sources.forEach(s=>s.stop());ctx?.close();}
  };
}
