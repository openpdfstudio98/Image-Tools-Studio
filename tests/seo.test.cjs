const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const origin='https://imagetoolstudio.vercel.app';

test('sitemap pages exist and use their own canonical URL',()=>{
  const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
  assert.ok(urls.length>0);
  assert.equal(urls.length,new Set(urls).size,'Sitemap has duplicate URLs');
  for(const url of urls){
    assert.ok(url.startsWith(origin+'/'),url);
    const route=new URL(url).pathname;
    const file=path.join(root,route==='/'?'index.html':route.slice(1)+'.html');
    assert.ok(fs.existsSync(file),file);
    const html=fs.readFileSync(file,'utf8');
    const canonical=html.match(/<link rel="canonical" href="([^"]+)">/g)||[];
    assert.equal(canonical.length,1,file);
    assert.ok(html.includes('<link rel="canonical" href="'+url+'">'),file);
    assert.match(html,/<meta name="description" content="[^"]+">/,file);
    assert.doesNotMatch(html,/<meta name="robots" content="[^"]*noindex/i,file);
  }
});
test('robots.txt points to public sitemap',()=>{
 const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
 assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
 assert.match(robots,/Disallow: \/api\//);
});
