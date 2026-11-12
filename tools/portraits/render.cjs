// Render every identity with the same model, lighting, crop and cell size.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path');
const ids=['fox','squirrel','bird','owl','beaver','mouse','mailman','hedgehog','fish','deer','kingfisher','frog','badger','fox-sleep'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{const p=await browser.newPage({viewport:{width:1536,height:1536}}),cells=[];
 for(const id of ids){await p.goto((process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000')+'/tools/portraits/portraits.html?id='+id);await p.waitForFunction(()=>window.ready,null,{timeout:90000});cells.push(await p.evaluate(()=>window.colour));}
 const url=await p.evaluate(async cells=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const g=canvas.getContext('2d');g.imageSmoothingQuality='high';
  for(let i=0;i<cells.length;i++){const img=new Image();img.src=cells[i];await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const d=ctx.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>8){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
   if(x0>=x1||y0>=y1)throw Error('Empty portrait '+i);const w=x1-x0+1,h=y1-y0+1,k=Math.min(224/w,236/h);g.drawImage(c,x0,y0,w,h,(i%4)*256+(256-w*k)/2,Math.floor(i/4)*256+250-h*k,w*k,h*k);
  }return canvas.toDataURL('image/webp',.9);},cells);
 const out=process.env.FARBTUPF_PORTRAITS_OUT||path.join(__dirname,'../../assets/forest-friends/character-portraits.webp');fs.writeFileSync(out,Buffer.from(url.split(',')[1],'base64'));console.log('Rendered '+ids.length+' portraits: '+out);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
