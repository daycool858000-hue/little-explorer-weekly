import fs from 'node:fs';
const books=['content','stories','junior'].flatMap(k=>fs.readdirSync('src/planet/'+k).filter(n=>n.endsWith('.json')).flatMap(n=>{const b=JSON.parse(fs.readFileSync('src/planet/'+k+'/'+n));return b.articles||[b]}));
const urls=[...new Set(books.flatMap(b=>(b.sources||[]).map(s=>s.url)))],results=[];
for(let n=0;n<urls.length;n+=4)await Promise.all(urls.slice(n,n+4).map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});results.push({url,status:r.status,finalUrl:r.url,checkedAt:new Date().toISOString(),note:r.ok?'可存取；不等於法律審查':'自動存取未成功，需與人工查核區分'});await r.body?.cancel()}catch(e){results.push({url,status:'unverified',note:e.message})}}));
fs.writeFileSync('sources/phase4-link-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results.map(x=>({url:x.url,status:x.status})),null,2));
