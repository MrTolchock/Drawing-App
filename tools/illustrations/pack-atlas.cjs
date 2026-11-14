#!/usr/bin/env node
/* Prepare generator-produced illustration grids; no image-service credentials or API calls. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const usage='Usage: node tools/illustrations/pack-atlas.cjs <manifest.json> [--output <atlas.webp>] [--icc-profile <sRGB.icc>]';
function main(){
 const args=process.argv.slice(2);
 if(args[0]==='--help'){console.log(usage);return;}
 if(!args.length)throw Error(usage);
 const manifestPath=path.resolve(args.shift()),base=path.dirname(manifestPath),options={};
 while(args.length){const flag=args.shift();if(!['--output','--icc-profile'].includes(flag)||!args.length||args[0].startsWith('--'))throw Error(usage);options[flag]=args.shift();}
 const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 const positive=n=>Number.isInteger(n)&&n>0;
 if(m.format!=='waldpost-illustration-atlas'||m.version!==1)throw Error('Unknown illustration manifest format/version.');
 if(!positive(m.columns)||!positive(m.rows)||m.columns>16||m.rows>16)throw Error('Grid dimensions must be integers from 1 to 16.');
 if(!positive(m.cellPixels)||!positive(m.subjectPixels)||m.subjectPixels>m.cellPixels)throw Error('Subject size must fit inside the cell size.');
 if(!Number.isFinite(m.alphaThresholdPercent)||m.alphaThresholdPercent<0||m.alphaThresholdPercent>=100)throw Error('Alpha threshold must be between 0 and 100 (exclusive of 100).');
 if(!Array.isArray(m.subjects)||!m.subjects.length||m.subjects.length>m.columns*m.rows||m.subjects.some(s=>!s||!/^[a-z0-9][a-z0-9-]*$/.test(s.id)||typeof s.label!=='string'||!s.label.trim())||new Set(m.subjects.map(s=>s.id)).size!==m.subjects.length)throw Error('List unique named subjects in row-major order; unused trailing cells are left empty.');
 if(typeof m.source!=='string'||typeof m.output!=='string')throw Error('Source and output paths are required.');
 const source=path.resolve(base,m.source),output=options['--output']?path.resolve(options['--output']):path.resolve(base,m.output);
 if(source===output)throw Error('Output must not overwrite the editable source image.');
 const profile=options['--icc-profile']||process.env.WALDPOST_SRGB_PROFILE||[
  '/usr/share/color/icc/sRGB.icc','/usr/share/color/icc/colord/sRGB.icc','/System/Library/ColorSync/Profiles/sRGB Profile.icc'
 ].find(p=>fs.existsSync(p));
 if(!profile||!fs.existsSync(profile))throw Error('An sRGB ICC profile is required. Pass --icc-profile or set WALDPOST_SRGB_PROFILE.');
 const magick=process.env.WALDPOST_MAGICK||'magick';
 function run(argv){
  const r=spawnSync(magick,argv,{encoding:'utf8',maxBuffer:8*1024*1024});
  if(r.error){
   if(r.error.code==='ENOENT')throw Error('ImageMagick 7 (magick) is required: '+r.error.message);
   throw Error('Cannot launch ImageMagick ('+r.error.code+'): '+r.error.message+'. Check process execution permissions in this environment.');
  }
  if(r.status!==0)throw Error((r.stderr||'ImageMagick failed.').trim());
  return r.stdout.trim();
 }
 const [width,height]=run(['identify','-format','%w %h',source]).split(/\s+/).map(Number);
 if(!positive(width)||!positive(height)||width<m.columns||height<m.rows||Math.abs(width/m.columns-height/m.rows)>1)throw Error('The source must contain equal square cells with the declared grid dimensions.');
 if(run(['identify','-format','%[opaque]',source]).toLowerCase()==='true')throw Error('The source is opaque; generate a genuinely transparent image before packing.');
 const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'waldpost-illustrations-'));
 try{
  const tiles=[];
  for(let i=0;i<m.columns*m.rows;i++){
   const tile=path.join(temporary,String(i).padStart(3,'0')+'.png');tiles.push(tile);
   if(i>=m.subjects.length){run(['-size',m.cellPixels+'x'+m.cellPixels,'xc:none',tile]);continue;}
   const col=i%m.columns,row=Math.floor(i/m.columns),x=Math.floor(col*width/m.columns),y=Math.floor(row*height/m.rows);
   const w=Math.floor((col+1)*width/m.columns)-x,h=Math.floor((row+1)*height/m.rows)-y,cell=path.join(temporary,'source.png');
   run([source,'-crop',w+'x'+h+'+'+x+'+'+y,'+repage',cell]);
   const bounds=run([cell,'-alpha','extract','-threshold',m.alphaThresholdPercent+'%','-format','%@','info:']);
   if(!/^[1-9]\d*x[1-9]\d*\+\d+\+\d+$/.test(bounds))throw Error('Empty subject cell: '+m.subjects[i].id);
   // Threshold only the temporary bounds mask. Preserve the original RGBA artwork when cropping/resizing.
   run([cell,'-crop',bounds,'+repage','-resize',m.subjectPixels+'x'+m.subjectPixels,'-gravity','center','-background','none','-extent',m.cellPixels+'x'+m.cellPixels,tile]);
  }
  const assembled=path.join(temporary,'assembled.webp'),finished=path.join(temporary,'finished.webp');
  run(['montage',...tiles,'-tile',m.columns+'x'+m.rows,'-geometry',m.cellPixels+'x'+m.cellPixels+'+0+0','-background','none','-profile',profile,'-define','webp:lossless=true','-define','webp:exact=true',assembled]);
  // A separate final export reliably embeds the profile and produces extended VP8X WebP.
  run([assembled,'-profile',profile,'-define','webp:lossless=true','-define','webp:exact=true',finished]);
  if(fs.readFileSync(finished).toString('ascii',12,16)!=='VP8X')throw Error('The final WebP is missing its extended/profile header. Check the ImageMagick colour-profile support.');
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.copyFileSync(finished,output);
  console.log('Packed '+m.subjects.length+' subjects into '+(m.columns*m.cellPixels)+' × '+(m.rows*m.cellPixels)+': '+output);
 }finally{fs.rmSync(temporary,{recursive:true,force:true});}
}
try{main();}catch(error){console.error(error.message);process.exitCode=1;}
