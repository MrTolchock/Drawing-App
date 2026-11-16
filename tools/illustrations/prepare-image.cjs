#!/usr/bin/env node
/* Convert an image-generator output to a profiled runtime image without stretching its composition. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const usage='Usage: node tools/illustrations/prepare-image.cjs <manifest.json> [--output <image.webp>] [--icc-profile <sRGB.icc>]';
try{
 const args=process.argv.slice(2);if(args[0]==='--help'){console.log(usage);process.exit(0);}if(!args.length)throw Error(usage);
 const manifest=path.resolve(args.shift()),base=path.dirname(manifest),m=JSON.parse(fs.readFileSync(manifest)),options={};
 while(args.length){const flag=args.shift();if(!['--output','--icc-profile'].includes(flag)||!args.length||args[0].startsWith('--'))throw Error(usage);options[flag]=args.shift();}
 if(m.format!=='waldpost-illustration-image'||m.version!==1||!Number.isInteger(m.width)||m.width<1||!Number.isInteger(m.height)||m.height<1||!['contain','cover'].includes(m.fit)||typeof m.transparent!=='boolean'||!Number.isInteger(m.quality)||m.quality<1||m.quality>100)throw Error('Invalid image manifest.');
 const source=path.resolve(base,m.source),output=options['--output']?path.resolve(options['--output']):path.resolve(base,m.output);
 if(source===output)throw Error('Output must not overwrite the editable source.');
 const profile=options['--icc-profile']||process.env.WALDPOST_SRGB_PROFILE||['/usr/share/color/icc/sRGB.icc','/usr/share/color/icc/colord/sRGB.icc','/System/Library/ColorSync/Profiles/sRGB Profile.icc'].find(f=>fs.existsSync(f));
 if(!profile||!fs.existsSync(profile))throw Error('Pass an sRGB ICC profile with --icc-profile or WALDPOST_SRGB_PROFILE.');
 const run=argv=>{const result=spawnSync(process.env.WALDPOST_MAGICK||'magick',argv,{encoding:'utf8',maxBuffer:8*1024*1024});if(result.error||result.status!==0)throw Error(result.error?.message||result.stderr||'ImageMagick failed.');return result.stdout.trim();};
 if(m.transparent&&run(['identify','-format','%[opaque]',source]).toLowerCase()==='true')throw Error('The source is opaque; use the image generator to repair transparency.');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 run([source,'-profile',profile,'-resize',m.width+'x'+m.height+(m.fit==='cover'?'^':''),'-gravity','center','-background',m.transparent?'none':'#fffaf0','-extent',m.width+'x'+m.height,...(m.transparent?[]:['-alpha','remove','-alpha','off']),'-quality',String(m.quality),'-define','webp:exact=true',output]);
 console.log('Prepared '+m.width+' × '+m.height+': '+output);
}catch(error){console.error(error.message);process.exitCode=1;}
