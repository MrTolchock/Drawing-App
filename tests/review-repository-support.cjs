const {empty,validate}=require('../js/friends/review-repository.js');
const clone=v=>JSON.parse(JSON.stringify(v));
function remoteServer(initial=empty()){
 let ledger=clone(initial),revision=1;const blobs=new Map([['sha-1',clone(initial)]]);
 const server={writes:[],requests:[],offline:false,failWrite:false,beforePut:null,loseResponse:false,omitContent:false,user:'MrTolchock',get ledger(){return clone(ledger);},set ledger(value){ledger=clone(value);revision++;blobs.set('sha-'+revision,clone(ledger));}};
 server.fetch=async(url,options={})=>{
  server.requests.push({url,method:options.method||'GET',headers:options.headers||{},body:options.body});
  if(server.offline)throw new TypeError('offline');
  const response=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  if(url.startsWith('https://raw.githubusercontent.com/MrTolchock/Drawing-App/puzzle-review-data/reviews.json'))return response(ledger);
  if(server.denyAuth||options.headers?.Authorization!=='Bearer test-review-token')return response({message:'Bad credentials'},401);
  if(url==='https://api.github.com/user')return response({login:server.user});
  if(url==='https://api.github.com/repos/MrTolchock/Drawing-App')return response({permissions:{push:true}});
  if(url.startsWith('https://api.github.com/repos/MrTolchock/Drawing-App/git/blobs/'))return response({content:Buffer.from(JSON.stringify(blobs.get(url.split('/').at(-1)))).toString('base64')});
  if(url.startsWith('https://api.github.com/repos/MrTolchock/Drawing-App/contents/reviews.json')){
   if(options.method!=='PUT')return response({sha:'sha-'+revision,content:server.omitContent?'':Buffer.from(JSON.stringify(ledger)).toString('base64')});
   if(server.beforePut){const callback=server.beforePut;server.beforePut=null;await callback(server);}
   if(server.rateLimit)return response({message:'You have exceeded a secondary rate limit'},403);
   if(server.failWrite)return response({message:'Unavailable'},503);
   const payload=JSON.parse(options.body);if(payload.branch!=='puzzle-review-data')throw Error('Attempted to write game code');
   if(payload.sha!=='sha-'+revision)return response({message:'Conflict'},409);
   ledger=validate(JSON.parse(Buffer.from(payload.content,'base64').toString('utf8')));revision++;blobs.set('sha-'+revision,clone(ledger));server.writes.push(clone(payload));
   if(server.loseResponse){server.loseResponse=false;throw Error('response lost');}
   return response({content:{sha:'sha-'+revision}});
  }
  throw Error('Unexpected remote URL: '+url);
 };
 return server;
}
async function installRemote(context,server=remoteServer()){
 let offline=false;const setOffline=context.setOffline.bind(context);context.setOffline=async value=>{offline=value;await setOffline(value);};
 const handle=async route=>{
  const request=route.request(),headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type,X-GitHub-Api-Version,Accept','Access-Control-Allow-Methods':'GET,PUT,OPTIONS'};
  if(offline||server.offline){await route.abort('internetdisconnected');return;}
  if(request.method()==='OPTIONS'){await route.fulfill({status:204,headers});return;}
  const response=await server.fetch(request.url(),{method:request.method(),body:request.postData(),headers:Object.fromEntries(Object.entries(request.headers()).map(([k,v])=>[k==='authorization'?'Authorization':k,v]))});
  await route.fulfill({status:response.status,contentType:'application/json',body:await response.text(),headers});
 };
 await context.route('https://raw.githubusercontent.com/MrTolchock/Drawing-App/puzzle-review-data/**',handle);
 await context.route('https://api.github.com/**',handle);return server;
}
async function seedFromPage(page,server,ids){
 const exported=await page.evaluate(ids=>{
  for(const id of ids){for(const it of FK.puzzleCatalogue.iterations(id)){FK.puzzleReview.seen(id,it.id);FK.puzzleReview.decide(id,it.id,'approved');}FK.puzzleReview.decide(id,null,'approved');}
  return FK.puzzleReview.exportData();
 },ids);
 const ledger=server.ledger;
 for(const decision of Object.values(exported.decisions))ledger.entries[decision.key+'@'+decision.revision]={...decision,seen:decision.key.startsWith('puzzle:')||exported.seen[decision.key]===decision.revision};
 server.ledger=ledger;await page.evaluate(()=>FK.reviewRepository.refresh());
}
module.exports={remoteServer,installRemote,seedFromPage};
