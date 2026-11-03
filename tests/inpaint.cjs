const assert=require('node:assert/strict'),fill=require('../public/assets/inpaint-core');
const w=160,h=100,n=w*h,truth=new Uint8ClampedArray(n*4),mask=new Uint8Array(n);
for(let y=0;y<h;y++)for(let x=0;x<w;x++){let i=y*w+x;truth.set([40+x,60+y,100,255],i*4);if(x>=65&&x<85&&y>=40&&y<50)mask[i]=1;}
const marked=new Uint8ClampedArray(truth);for(let i=0;i<n;i++)if(mask[i])marked.set([255,255,255,255],i*4);
const result=fill(marked,mask,w,h);let total=0,count=0;for(let i=0;i<n;i++)for(let c=0;c<4;c++){if(mask[i]&&c<3){total+=Math.abs(result[i*4+c]-truth[i*4+c]);count++;}else assert.equal(result[i*4+c],truth[i*4+c]);}
assert(total/count<2,'Gradient fill should approximate the hidden linear gradient');assert.deepEqual(marked.slice(0,4),truth.slice(0,4));
assert.throws(()=>fill(marked,new Uint8Array(n),w,h));assert.throws(()=>fill(marked,new Uint8Array(n).fill(1),w,h));assert.throws(()=>fill(marked,mask,w-1,h));
// An edge mask with one missing directional boundary still fills and preserves outside pixels.
const edge=new Uint8Array(n);for(let y=10;y<15;y++)for(let x=0;x<6;x++)edge[y*w+x]=1;const e=fill(truth,edge,w,h);for(let i=0;i<n;i++)if(!edge[i])assert.deepEqual(e.slice(i*4,i*4+4),truth.slice(i*4,i*4+4));
// Texture test verifies locality/integrity; reconstruction is intentionally not claimed.
const texture=new Uint8ClampedArray(truth);for(let i=0;i<n;i++){const v=((i%w>>3)+(Math.floor(i/w)>>3))%2?220:30;texture.set([v,v,v,255],i*4);}const t=fill(texture,mask,w,h);for(let i=0;i<n;i++)if(!mask[i])assert.deepEqual(t.slice(i*4,i*4+4),texture.slice(i*4,i*4+4));
console.log('PASS: gradient mean absolute RGB error '+(total/count).toFixed(3)+'; outside pixels/alpha unchanged; edge fill, texture locality and invalid masks checked');
