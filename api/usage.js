'use strict';
const tools=new Set(['home','about','contact','privacy','terms','compress-image','resize-image','crop-image','jpg-to-png','png-to-jpg','webp-to-jpg','jpg-to-webp','rotate-image','flip-image','grayscale-image','brightness-image','image-color-picker','remove-watermark']);
const events=new Set(['page_view','process_success','process_failure','batch_success','batch_failure','download_requested','zip_requested']);
// Best-effort per-instance cap; events are approximate operational signals, not billing data.
let bucket=0,minute=0;
module.exports=(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
 const origin=req.headers.origin;try{if(!origin||new URL(origin).host!==req.headers.host)return res.status(403).end();}catch{return res.status(403).end();}
 if(!(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).end();
 if(Number(req.headers['content-length']||0)>256)return res.status(413).end();
 let data=req.body;try{if(typeof data==='string')data=JSON.parse(data);}catch{return res.status(400).end();}
 if(!data||Array.isArray(data)||typeof data!=='object'||Object.keys(data).sort().join(',')!=='count,event,tool'||!events.has(data.event)||!tools.has(data.tool)||!Number.isInteger(data.count)||data.count<0||data.count>20)return res.status(400).end();
 const now=Math.floor(Date.now()/60000);if(now!==minute){minute=now;bucket=0;}if(++bucket>600)return res.status(429).end();
 console.log(JSON.stringify({type:'studio_usage',event:data.event,tool:data.tool,count:data.count}));
 return res.status(204).end();
};
