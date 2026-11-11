// Renders the neighbour portraits and writes assets/forest-friends/neighbours.webp (see README.md).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000', ORDER=['hedgehog','fish','deer','kingfisher','frog'];
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:512,height:512}});const cells=[];
  for(const id of ORDER){await p.goto(BASE+'/tools/portraits/portraits.html?id='+id);await p.waitForFunction(()=>window.ready,null,{timeout:60000});cells.push(await p.evaluate(()=>document.getElementById('c').toDataURL('image/png')));}
  await p.setContent('<canvas id="s" width="1536" height="1024"></canvas>');
  const webp=await p.evaluate(async cells=>{const s=document.getElementById('s'),g=s.getContext('2d');for(let i=0;i<cells.length;i++){const im=new Image();im.src=cells[i];await im.decode();g.drawImage(im,(i%3)*512,Math.floor(i/3)*512);}return s.toDataURL('image/webp',.86);},cells);
  require('fs').writeFileSync(require('path').join(__dirname,'../../assets/forest-friends/neighbours.webp'),Buffer.from(webp.split(',')[1],'base64'));
  console.log('neighbours.webp written');await b.close();})();
