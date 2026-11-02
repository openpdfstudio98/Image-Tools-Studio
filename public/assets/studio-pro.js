/* Browser-local compression, batch queue, ZIP export and comparison. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const encode=(canvas,type,quality)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>{if(!blob)return reject(Error('Image encoding failed.'));if(blob.type!==type)return reject(Error('This browser does not support the chosen output format.'));resolve(blob);},type,quality));
window.studioEncode=async(canvas,type,quality,target)=>{
 if(target===null||target===undefined)return {blob:await encode(canvas,type,quality),met:true};
 if(!Number.isFinite(target)||target<1||target>35000)throw Error('Target size must be between 1 and 35,000 KB.');
 if(type==='image/png')throw Error('Target KB requires JPG or WebP. PNG does not support quality compression.');
 const limit=Math.floor(target*1024);let best=await encode(canvas,type,1);
 if(best.size<=limit)return {blob:best,met:true};
 let smallest=await encode(canvas,type,.01);if(smallest.size>limit)return {blob:smallest,met:false};
 best=smallest;let lo=.01,hi=1;
 for(let i=0;i<8;i++){const q=(lo+hi)/2,b=await encode(canvas,type,q);if(b.size<=limit){best=b;lo=q;}else hi=q;}
 return {blob:best,met:true};
};
function save(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
const ext=type=>type==='image/jpeg'?'jpg':type==='image/webp'?'webp':'png';
const basename=name=>(name.replace(/\.[^.]*$/,'').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').slice(0,100)||'image');
function decode(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);if(img.naturalWidth*img.naturalHeight>44000000||img.naturalWidth>12000||img.naturalHeight>12000)return reject(Error('Image exceeds 44 MP or 12,000 px per side.'));resolve(img);};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Unable to decode this image.'));};img.src=url;});}
// ZIP store method: image payloads are already compressed. UTF-8 names and CRC32.
const studio=$('studio');if(!studio)return;
let compareUrls=[];
const comparison=document.createElement('section');comparison.className='comparison hidden';comparison.innerHTML='<h3>Before &amp; after</h3><p class="small">Full images fitted to view. Download preserves the processed resolution.</p><div class="compare-grid"><figure><figcaption>Original</figcaption><img alt="Original image"></figure><figure><figcaption>Processed</figcaption><img alt="Processed image"></figure></div>';studio.after(comparison);
function clearComparison(){compareUrls.forEach(URL.revokeObjectURL);compareUrls=[];comparison.classList.add('hidden');comparison.querySelectorAll('img').forEach(i=>i.removeAttribute('src'));}
document.addEventListener('studio:invalidate',clearComparison);
document.addEventListener('studio:result',e=>{clearComparison();compareUrls=[URL.createObjectURL(e.detail.original),URL.createObjectURL(e.detail.blob)];comparison.querySelectorAll('img').forEach((img,i)=>img.src=compareUrls[i]);comparison.classList.remove('hidden');});
if(!location.pathname.includes('compress-image'))return;
const controls=document.createElement('div');controls.innerHTML='<div class="control"><label for="compressionMode">Compression mode</label><select id="compressionMode"><option value="quality">Choose quality</option><option value="target">Target file size</option></select></div><div id="targetControls" class="hidden"><div class="presets" aria-label="Target size presets"><button type="button" class="chip" data-kb="100">100 KB</button><button type="button" class="chip" data-kb="200">200 KB</button><button type="button" class="chip" data-kb="500">500 KB</button></div><div class="control"><label for="targetKB">Maximum size (KB)</label><input id="targetKB" type="number" min="1" max="35000" value="200"></div><p class="small">JPG / WebP only. Keeps image dimensions. If the target cannot be reached, the smallest attempt is offered with a warning.</p></div>';$('settings').append(controls);
$('compressionMode').onchange=()=>{const target=$('compressionMode').value==='target';$('targetControls').classList.toggle('hidden',!target);$('quality').disabled=target;};
controls.querySelectorAll('[data-kb]').forEach(b=>b.onclick=()=>{$('targetKB').value=b.dataset.kb;$('targetKB').dispatchEvent(new Event('input',{bubbles:true}));});
const batch=document.createElement('section');batch.className='batch panel';batch.innerHTML='<div class="batch-heading"><div><span class="eyebrow">SAVE TIME</span><h2>Compress a batch</h2></div><span class="chip">Up to 20 images</span></div><p class="sub">Use the compression settings above for every image. Processed one at a time on your device. Maximum 100 MB combined.</p><label class="batch-upload" for="batchFiles">Choose multiple images</label><input id="batchFiles" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif"><p class="small" id="batchSelection">No images selected</p><div class="btnrow"><button class="btn" id="batchStart" disabled>Compress batch</button><button class="btn secondary" id="batchCancel" disabled>Cancel</button><a class="btn secondary" id="batchZip" role="button" aria-disabled="true" download="image-tools-studio-batch.zip">Download ZIP</a></div><p id="batchStatus" class="status" role="status"></p><ol id="batchResults" class="batch-results"></ol>';comparison.after(batch);
let selected=[],outputs=[],running=false,cancelled=false,cachedZip=null,zipUrl=null;
function reset(){outputs=[];cachedZip=null;if(zipUrl)URL.revokeObjectURL(zipUrl);zipUrl=null;$('batchZip').removeAttribute('href');$('batchZip').setAttribute('aria-disabled','true');$('batchResults').replaceChildren();$('batchZip').disabled=true;}
$('batchFiles').onchange=()=>{reset();selected=Array.from($('batchFiles').files);let error='';if(selected.length>20)error='Select at most 20 images.';else if(selected.reduce((n,f)=>n+f.size,0)>100*1024*1024)error='Combined input size must be below 100 MB.';if(error)selected=[];$('batchSelection').textContent=error||`${selected.length} image(s) selected`;$('batchStart').disabled=!selected.length;$('batchStatus').textContent='';};
$('settings').addEventListener('input',()=>{if(!running){reset();$('batchStatus').textContent=selected.length?'Settings changed. Run the batch again.':'';}});$('settings').addEventListener('change',()=>{if(!running)reset();});
$('batchCancel').onclick=()=>{cancelled=true;$('batchCancel').disabled=true;$('batchStatus').textContent='Cancelling after the current image…';};
$('batchStart').onclick=async()=>{if(running||!selected.length)return;reset();const type=$('format').value,target=$('compressionMode').value==='target'?Number($('targetKB').value):null,quality=Number($('quality').value)/100;
 if(target!==null&&(!Number.isFinite(target)||target<1||target>35000||type==='image/png')){$('batchStatus').textContent='Choose JPG or WebP and a target between 1 and 35,000 KB.';return;}
 if(target===null&&(!Number.isFinite(quality)||quality<.01||quality>1)){$('batchStatus').textContent='Quality must be between 1 and 100.';return;}
 running=true;cancelled=false;$('batchStart').disabled=true;$('batchFiles').disabled=true;$('batchCancel').disabled=false;const locked=[...$('settings').querySelectorAll('input,select,button')].map(el=>[el,el.disabled]);locked.forEach(([el])=>el.disabled=true);
 let failed=0,total=0;
 try{for(let i=0;i<selected.length;i++){if(cancelled)break;const f=selected[i],row=document.createElement('li');$('batchResults').append(row);row.textContent=`${f.name} — Processing…`;$('batchStatus').textContent=`Processing ${i+1} of ${selected.length}…`;await new Promise(r=>setTimeout(r,0));
 try{if(!['image/jpeg','image/png','image/webp','image/avif'].includes(f.type)||f.size>35*1024*1024)throw Error('Use JPG, PNG, WebP or AVIF up to 35 MB.');const img=await decode(f),canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;let result;try{const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable.');if(type==='image/jpeg'){ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.drawImage(img,0,0);result=await window.studioEncode(canvas,type,quality,target);}finally{canvas.width=canvas.height=0;img.src='';}
 if(cancelled){row.textContent=`${f.name} — Cancelled`;break;}if(total+result.blob.size>150*1024*1024)throw Error('Batch output memory limit reached. Use fewer images.');total+=result.blob.size;const out={name:`${i+1}-${basename(f.name)}-compressed.${ext(type)}`,blob:result.blob};outputs.push(out);row.textContent=`${f.name} → ${(out.blob.size/1024).toFixed(1)} KB${target!==null?(result.met?' · Target met':' · Target NOT reached'):''}${out.blob.size>=f.size?' · Larger than original':''} `;const btn=document.createElement('button');btn.className='chip';btn.textContent='Download';btn.onclick=()=>save(out.blob,out.name);row.append(btn);
 }catch(error){failed++;row.textContent=`${f.name} — ${error.message}`;}}
 }finally{document.dispatchEvent(new CustomEvent('studio:batch',{detail:{ready:outputs.length,failed}}));if(outputs.length){$('batchStatus').textContent='Preparing ZIP…';try{cachedZip=await window.buildStudioZip(outputs);}catch(error){cachedZip=null;}}running=false;locked.forEach(([el,disabled])=>el.disabled=disabled);$('batchFiles').disabled=false;$('batchStart').disabled=false;$('batchCancel').disabled=true;$('batchZip').setAttribute('aria-disabled',String(!cachedZip));if(cachedZip){zipUrl=URL.createObjectURL(cachedZip);$('batchZip').href=zipUrl;}$('batchStatus').textContent=`${cancelled?'Cancelled. ':''}${outputs.length} ready, ${failed} failed. ZIP contains completed images only.`;}
};
$('batchZip').onclick=e=>{if(!cachedZip)e.preventDefault();};
})();
