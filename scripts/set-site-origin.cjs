// Keep canonical links, share metadata and sitemap on a single verified origin.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),configPath=path.join(root,'site.config.json'),config=JSON.parse(fs.readFileSync(configPath));
const next=new URL(process.argv[2]);if(next.protocol!=='https:'||next.origin!==process.argv[2]||next.username||next.password)throw Error('Pass an HTTPS origin with no path, trailing slash, credentials, query or fragment.');
for(const f of fs.readdirSync(path.join(root,'public'))){if(!/\.(html|xml|txt)$/.test(f))continue;const p=path.join(root,'public',f);fs.writeFileSync(p,fs.readFileSync(p,'utf8').split(config.origin).join(next.origin));}
config.origin=next.origin;fs.writeFileSync(configPath,JSON.stringify(config,null,2)+'\n');console.log('Updated site origin. Commit and deploy these changes together.');
