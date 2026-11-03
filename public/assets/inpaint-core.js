/* Local harmonic fill. Only masked pixels are modified; no model or network. */
(function(root){'use strict';
function fill(image,mask,w,h,progress=()=>{}){
 const n=w*h;if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||n>4194304||image.length!==n*4||mask.length!==n)throw Error('Invalid image or mask dimensions.');
 const ids=[];for(let i=0;i<n;i++)if(mask[i])ids.push(i);
 if(!ids.length)throw Error('Brush over a small area first.');
 if(ids.length>Math.min(200000,n*.15))throw Error('Selection is too large. Brush a smaller area (up to 15% of the image and 200,000 pixels).');
 const out=new Uint8ClampedArray(image),sum=new Float32Array(n*4),weights=new Float32Array(n);
 function segment(start,step,length,before,after){if(before<0&&after<0)return;const span=length+1,weight=(before>=0&&after>=0?1:.15)/span;
 for(let k=0;k<length;k++){const i=start+step*k,t=(k+1)/span;weights[i]+=weight;for(let c=0;c<4;c++){const a=image[(before>=0?before:after)*4+c],b=image[(after>=0?after:before)*4+c];sum[i*4+c]+=(a*(1-t)+b*t)*weight;}}}
 for(let y=0;y<h;y++){let x=0;while(x<w){if(!mask[y*w+x]){x++;continue;}const start=x;while(x<w&&mask[y*w+x])x++;segment(y*w+start,1,x-start,start>0?y*w+start-1:-1,x<w?y*w+x:-1);}}
 for(let x=0;x<w;x++){let y=0;while(y<h){if(!mask[y*w+x]){y++;continue;}const start=y;while(y<h&&mask[y*w+x])y++;segment(start*w+x,w,y-start,start>0?(start-1)*w+x:-1,y<h?y*w+x:-1);}}
 for(const i of ids){if(!weights[i])throw Error('Leave some unselected background around the area.');for(let c=0;c<4;c++)out[i*4+c]=sum[i*4+c]/weights[i];}
 // Relax within the selected area while holding original boundary pixels fixed.
 for(let pass=0;pass<64;pass++){for(const i of ids){const x=i%w,y=Math.floor(i/w),count=(x>0)+(x<w-1)+(y>0)+(y<h-1);for(let c=0;c<4;c++){let value=0;if(x>0)value+=out[(i-1)*4+c];if(x<w-1)value+=out[(i+1)*4+c];if(y>0)value+=out[(i-w)*4+c];if(y<h-1)value+=out[(i+w)*4+c];sum[i*4+c]=value/count;}}for(const i of ids)for(let c=0;c<4;c++)out[i*4+c]=sum[i*4+c];if(pass%8===0)progress(Math.round((pass+1)/64*100));}
 progress(100);return out;
}
root.studioInpaint=fill;if(typeof module!=='undefined')module.exports=fill;
})(typeof self!=='undefined'?self:globalThis);
