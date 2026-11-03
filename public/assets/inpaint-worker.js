'use strict';
importScripts('/assets/inpaint-core.js');
self.onmessage=({data})=>{try{const result=self.studioInpaint(new Uint8ClampedArray(data.image),new Uint8Array(data.mask),data.width,data.height,progress=>self.postMessage({progress}));self.postMessage({result:result.buffer},[result.buffer]);}catch(error){self.postMessage({error:error.message||'Unable to fill the selection.'});}};
