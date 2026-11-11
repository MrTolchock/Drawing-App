// Paints the picture map with tools/map/map.html and writes assets/forest-friends/world-map.webp.
// Serve the repository root first (python3 -m http.server 8000), then: node tools/map/render.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const BASE=process.env.FARBTUPF_BASE_URL||'http://127.0.0.1:8000';
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});const p=await b.newPage();p.on('pageerror',e=>console.error(e.message));
  await p.goto(BASE+'/tools/map/map.html');await p.waitForFunction(()=>window.mapReady,null,{timeout:600000});
  const webp=await p.evaluate(()=>document.getElementById('c').toDataURL('image/webp',.85));
  require('fs').writeFileSync(require('path').join(__dirname,'../../assets/forest-friends/world-map.webp'),Buffer.from(webp.split(',')[1],'base64'));
  console.log('world-map.webp written');await b.close();})();
