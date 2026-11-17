// Renders the neighbour portraits and writes assets/forest-friends/neighbours.webp (see README.md).
// Each character is rendered at 1536 px (portraits.html), then painted over in 2D so it reads like the
// painted friends in postcard-friends.webp: a warm shade towards the silhouette, brushed fur strokes that
// grow outwards and down from the body, a fluffy fringe on the outline, and the glossy eyes and nose and
// the drawn lines (brows, smile, beak) kept crisp on top. Finally it is cropped to the character and scaled into its 512 px cell with the same
// framing as the painted friends (about 92 % of the cell height, centred, standing near the bottom edge).
// FARBTUPF_PORTRAITS_OUT writes the sheet somewhere else for a look.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const path=require('path'),fs=require('fs');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000', ORDER=['hedgehog','fish','deer','kingfisher','frog','badger'];
const OUT=process.env.FARBTUPF_PORTRAITS_OUT||path.join(__dirname,'../../assets/forest-friends/neighbours.webp');
// Largest width and height a character may take in its cell, and where its lowest pixel sits.
const FIT={w:448,h:472,bottom:500};
// Brushwork per character, in 1536 px render pixels: stroke length and width, colour variation, opacity,
// fringe length on the outline, warm edge shade. Fish and frog are smooth felt: short, faint strokes.
const BRUSH={
  hedgehog:{len:24,width:3.6,vary:.15,alpha:.5,fringe:10,shade:.24},
  deer:{len:24,width:3.6,vary:.12,alpha:.45,fringe:11,shade:.24},
  kingfisher:{len:16,width:4,vary:.1,alpha:.4,fringe:6,shade:.22},
  badger:{len:24,width:3.6,vary:.12,alpha:.45,fringe:10,shade:.22},
  frog:{len:14,width:4,vary:.06,alpha:.28,fringe:4,shade:.2},
  fish:{len:12,width:4,vary:.05,alpha:.2,fringe:2.5,shade:.18},
};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1536,height:1536}});const cells=[];
  for(const id of ORDER){await p.goto(BASE+'/tools/portraits/portraits.html?id='+id);await p.waitForFunction(()=>window.ready,null,{timeout:90000});
    cells.push({id,brush:BRUSH[id],...await p.evaluate(()=>({colour:window.colour,mask:window.mask}))});}
  await p.setContent('<canvas id="s" width="1536" height="1024"></canvas>');
  const webp=await p.evaluate(async([cells,FIT])=>{
    const load=async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);return {c,g,d:g.getImageData(0,0,c.width,c.height)};};
    // Separable box blur, three passes (close to a Gaussian), on a float channel.
    const blur=(src,W,H,r)=>{let a=Float32Array.from(src),t=new Float32Array(W*H);
      for(let pass=0;pass<3;pass++){
        for(let y=0;y<H;y++){let s=0;for(let x=-r;x<=r;x++)s+=a[y*W+Math.min(W-1,Math.max(0,x))];for(let x=0;x<W;x++){t[y*W+x]=s/(2*r+1);s+=a[y*W+Math.min(W-1,x+r+1)]-a[y*W+Math.max(0,x-r)];}}
        for(let x=0;x<W;x++){let s=0;for(let y=-r;y<=r;y++)s+=t[Math.min(H-1,Math.max(0,y))*W+x];for(let y=0;y<H;y++){a[y*W+x]=s/(2*r+1);s+=t[Math.min(H-1,y+r+1)*W+x]-t[Math.max(0,y-r)*W+x];}}}
      return a;};
    let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    function paint({colour,mask,brush:B},C0,M0){
      const W=C0.c.width,H=C0.c.height,C=C0.d.data,M=M0.d.data,n=W*H;
      const alpha=new Float32Array(n),gloss=new Float32Array(n),lum=new Float32Array(n);for(let i=0;i<n;i++){alpha[i]=C[i*4+3]/255;gloss[i]=M[i*4+3]>0?M[i*4]/255:0;lum[i]=(.3*C[i*4]+.59*C[i*4+1]+.11*C[i*4+2])/255*alpha[i];}
      // Drawn lines (brows, the smile, a beak, the gaps between spines) are much darker than the fur round them: keep them crisp too.
      {const bl=blur(lum,W,H,22),ba=blur(alpha,W,H,22);for(let i=0;i<n;i++){if(alpha[i]<.5)continue;const d=Math.min(1,Math.max(0,(bl[i]/Math.max(.05,ba[i])-lum[i]-.1)*7));if(d>gloss[i])gloss[i]=d;}}
      const wide=blur(alpha,W,H,40),edge=blur(alpha,W,H,3),shadeA=blur(alpha,W,H,12),nearGloss=blur(gloss,W,H,5);
      const out=document.createElement('canvas');out.width=W;out.height=H;const g=out.getContext('2d');
      // Underpainting: the render with a warm shade towards the outline, as the painted friends have.
      const under=new ImageData(W,H),U=under.data;
      for(let i=0;i<n;i++){const k=1-B.shade*Math.max(0,1-shadeA[i])*2,r=C[i*4],gr=C[i*4+1],bl=C[i*4+2],l=.3*r+.59*gr+.11*bl,sat=1.14;
        U[i*4]=(l+(r-l)*sat)*k;U[i*4+1]=(l+(gr-l)*sat)*k*.97;U[i*4+2]=(l+(bl-l)*sat)*k*.92;U[i*4+3]=C[i*4+3];}
      g.putImageData(under,0,0);
      const at=(x,y)=>{x=Math.min(W-1,Math.max(0,x|0));y=Math.min(H-1,Math.max(0,y|0));return y*W+x;};
      const grad=(f,x,y,s)=>[f[at(x+s,y)]-f[at(x-s,y)],f[at(x,y+s)]-f[at(x,y-s)]];
      const tone=(i,v)=>{const k=1+v;return `rgb(${Math.min(255,U[i*4]*k)|0},${Math.min(255,U[i*4+1]*k)|0},${Math.min(255,U[i*4+2]*k)|0})`;};
      g.lineCap='round';
      // Fur strokes: outwards from the body (wide blur gradient), a little downwards, with jitter.
      let area=0;for(let i=0;i<n;i++)if(alpha[i]>.98)area++;
      const strokes=Math.round(area/14);
      for(let s=0;s<strokes;s++){
        const x=rnd()*W,y=rnd()*H,i=at(x,y);if(alpha[i]<.98||nearGloss[i]>.02)continue;
        let [gx,gy]=grad(wide,x,y,6);gx=-gx;gy=-gy;const l=Math.hypot(gx,gy)||1;gx/=l;gy/=l;
        const a=Math.atan2(gy+.55,gx)+(rnd()-.5)*.5,dx=Math.cos(a),dy=Math.sin(a),L=B.len*(.6+rnd()*.8);
        g.globalAlpha=B.alpha*(.6+rnd()*.4);g.strokeStyle=tone(i,(rnd()-.5)*2*B.vary+(rnd()<.18?B.vary*1.2:0));g.lineWidth=B.width*(.6+rnd()*.6);
        g.beginPath();g.moveTo(x-dx*L*.35,y-dy*L*.35);g.lineTo(x+dx*L*.65,y+dy*L*.65);g.stroke();
      }
      // Fluffy outline: tapered tufts from just inside the silhouette, pointing outwards.
      for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;
        if(alpha[i]<.5||edge[i]>.8||nearGloss[i]>.02||rnd()>.4)continue;
        let [gx,gy]=grad(edge,x,y,2);gx=-gx;gy=-gy;const l=Math.hypot(gx,gy);if(l<1e-3)continue;gx/=l;gy/=l;
        const a=Math.atan2(gy+.25,gx)+(rnd()-.5)*.7,dx=Math.cos(a),dy=Math.sin(a),L=B.fringe*(.4+rnd()*.9),j=at(x-gx*6,y-gy*6);
        g.strokeStyle=tone(j,(rnd()-.5)*B.vary);
        for(let k=0;k<3;k++){g.globalAlpha=.7-k*.22;g.lineWidth=B.width*(1-k*.3);g.beginPath();g.moveTo(x+dx*L*k/3-dx*3,y+dy*L*k/3-dy*3);g.lineTo(x+dx*L*(k+1)/3,y+dy*L*(k+1)/3);g.stroke();}
      }
      // Eyes, nose, beak and mouth stay crisp on top.
      const top=new ImageData(W,H),T=top.data;for(let i=0;i<n;i++){T[i*4]=C[i*4];T[i*4+1]=C[i*4+1];T[i*4+2]=C[i*4+2];T[i*4+3]=C[i*4+3]*gloss[i];}
      const tc=document.createElement('canvas');tc.width=W;tc.height=H;tc.getContext('2d').putImageData(top,0,0);g.globalAlpha=1;g.drawImage(tc,0,0);
      return out;
    }
    const s=document.getElementById('s'),g=s.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
    for(let i=0;i<cells.length;i++){
      const c=paint(cells[i],await load(cells[i].colour),await load(cells[i].mask)),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let x0=c.width,y0=c.height,x1=-1,y1=-1;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
      if(x1<0)throw new Error('empty portrait '+cells[i].id);
      const w=x1-x0+1,h=y1-y0+1,k=Math.min(FIT.w/w,FIT.h/h),dw=w*k,dh=h*k;
      // Halve in steps for a clean, detailed downscale.
      let src=c,sx=x0,sy=y0,sw=w,sh=h;
      while(sw/2>dw){const t=document.createElement('canvas');t.width=Math.ceil(sw/2);t.height=Math.ceil(sh/2);const tg=t.getContext('2d');tg.imageSmoothingQuality='high';tg.drawImage(src,sx,sy,sw,sh,0,0,t.width,t.height);src=t;sx=0;sy=0;sw=t.width;sh=t.height;}
      g.drawImage(src,sx,sy,sw,sh,(i%3)*512+(512-dw)/2,Math.floor(i/3)*512+FIT.bottom-dh,dw,dh);
    }
    return s.toDataURL('image/webp',.88);},[cells,FIT]);
  fs.writeFileSync(OUT,Buffer.from(webp.split(',')[1],'base64'));
  console.log('written',OUT);await b.close();})();
