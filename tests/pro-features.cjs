const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},document:{getElementById:()=>null},Blob,TextEncoder,Uint8Array,Uint32Array,DataView};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('public/assets/zip.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('public/assets/studio-pro.js','utf8'),ctx);
(async()=>{
 const canvas={toBlob(cb,type,q){cb(new Blob([new Uint8Array(Math.round(500+q*200000))],{type}));}};
 const r=await ctx.window.studioEncode(canvas,'image/webp',.75,100);assert(r.met);assert(r.blob.size<=102400);assert(r.blob.size>100000);
 const impossible=await ctx.window.studioEncode(canvas,'image/webp',.75,1);assert(!impossible.met);
 await assert.rejects(ctx.window.studioEncode(canvas,'image/png',.75,100));
 await assert.rejects(ctx.window.studioEncode(canvas,'image/webp',.75,0));
 await assert.rejects(ctx.window.studioEncode(canvas,'image/webp',.75,NaN));
 const fallback={toBlob(cb){cb(new Blob(['fallback'],{type:'image/png'}));}};await assert.rejects(ctx.window.studioEncode(fallback,'image/webp',.75,null));
 const blob=await ctx.window.buildStudioZip([{name:'1-gambar-日本.png',blob:new Blob(['first'])},{name:'2-gambar.png',blob:new Blob(['second'])}]);fs.writeFileSync('/tmp/studio-test.zip',Buffer.from(await blob.arrayBuffer()));
 console.log('PASS: target bounds, unreachable target, PNG rejection, unsupported encoder, ZIP generation');
})().catch(e=>{console.error(e);process.exitCode=1});
