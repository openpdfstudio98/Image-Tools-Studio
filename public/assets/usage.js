/* Optional first-party event counts. Never pass file-derived data here. */
(()=>{
'use strict';
const key='its-usage-choice-v1';let choice='decline',sent=0;
const tool=(location.pathname.replace(/^\/+|\/+$/g,'').replace(/\.html$/,''))||'home';
const blocked=()=>navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
try{choice=localStorage.getItem(key)||'unset';}catch{choice='decline';}
function track(event,count=1){if(choice!=='allow'||blocked()||sent>=60)return;sent++;const body=JSON.stringify({event,tool,count:Math.max(0,Math.min(20,Math.floor(count)))});fetch('/api/usage',{method:'POST',headers:{'Content-Type':'application/json'},body,credentials:'omit',keepalive:true}).catch(()=>{});}
const box=document.createElement('section');box.className='privacy-banner';box.setAttribute('aria-label','Usage statistics preference');box.hidden=true;box.innerHTML='<h2>Help improve these tools?</h2><p>Optional statistics count tool use, successes and errors. Your images and filenames are never included. All tools work if you decline. <a href="/privacy">Privacy details</a></p><div class="btnrow"><button type="button" class="btn" data-choice="allow">Allow statistics</button><button type="button" class="btn secondary" data-choice="decline">Decline</button><button type="button" class="text-button" data-close>Close</button></div>';document.body.append(box);
function show(){box.hidden=false;box.querySelector('[data-choice="decline"]').focus();}
let returnFocus=null;
box.querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>{choice=btn.dataset.choice;try{localStorage.setItem(key,choice);}catch{}box.hidden=true;if(returnFocus)returnFocus.focus();if(choice==='allow')track('page_view');});
box.querySelector('[data-close]').onclick=()=>{box.hidden=true;if(returnFocus)returnFocus.focus();};box.addEventListener('keydown',e=>{if(e.key==='Escape'){box.hidden=true;if(returnFocus)returnFocus.focus();}});
document.querySelectorAll('[data-privacy-choices]').forEach(btn=>btn.onclick=()=>{returnFocus=btn;show();});
// The initial notice is non-modal and does not steal focus from the image editor.
if(choice==='unset'&&!blocked())box.hidden=false;
track('page_view');
document.addEventListener('studio:result',()=>track('process_success'));
document.addEventListener('studio:failure',()=>track('process_failure'));
document.addEventListener('studio:batch',e=>{track('batch_success',e.detail.ready);if(e.detail.failed)track('batch_failure',e.detail.failed);});
document.addEventListener('click',e=>{const button=e.target.closest('#download,#batchZip,#batchResults button');if(!button||button.disabled||button.getAttribute('aria-disabled')==='true')return;track(button.id==='batchZip'?'zip_requested':'download_requested');});
})();
