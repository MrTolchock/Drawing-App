/* Development worker: decode each used atlas once and fingerprint its individual RGBA cells. */
'use strict';
const sharp=require('sharp'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
(async()=>{
 const images=JSON.parse(fs.readFileSync(0,'utf8')),result={},cache=path.join(os.tmpdir(),'waldpost-review-pixels-v1');fs.mkdirSync(cache,{recursive:true});
 for(const image of images){
  const bytes=Buffer.from(image.bytes,'base64'),key=hash(Buffer.concat([Buffer.from(image.columns+'x'+image.rows+':'),bytes])),file=path.join(cache,key+'.json');
  try{const found=JSON.parse(fs.readFileSync(file));if(found.length===image.columns*image.rows&&found.every(x=>/^[a-f0-9]{64}$/.test(x))){result[image.key]=found;continue;}}catch{}
  const {data,info}=await sharp(bytes).toColourspace('srgb').ensureAlpha().raw().toBuffer({resolveWithObject:true}),cells=[];
  for(let i=0;i<image.columns*image.rows;i++){
   const x=i%image.columns*info.width/image.columns,y=Math.floor(i/image.columns)*info.height/image.rows,w=info.width/image.columns,h=info.height/image.rows;
   const left=Math.floor(x),top=Math.floor(y),right=Math.ceil(x+w),bottom=Math.ceil(y+h),pixels=Buffer.alloc((right-left)*(bottom-top)*4);
   let dest=0;for(let row=top;row<bottom;row++)for(let col=left;col<right;col++){
    const from=(row*info.width+col)*4,alpha=data[from+3];
    // RGB in a fully transparent pixel is invisible and can change during a lossless re-encode.
    if(alpha){pixels[dest]=data[from];pixels[dest+1]=data[from+1];pixels[dest+2]=data[from+2];pixels[dest+3]=alpha;}dest+=4;
   }
   cells.push(hash(Buffer.concat([Buffer.from(JSON.stringify([x-left,y-top,w,h])+':'),pixels])));
  }
  result[image.key]=cells;fs.writeFileSync(file,JSON.stringify(cells));
 }
 process.stdout.write(JSON.stringify(result));
})().catch(error=>{console.error(error);process.exitCode=1;});
