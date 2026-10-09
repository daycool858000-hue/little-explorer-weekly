import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {resolve,sep,extname} from 'node:path';
import {normalizeSpeech} from '../src/speech/normalize.ts';
const review=process.argv.includes('--review');
const root=resolve(review?'.local-review/build':'docs');
const base=process.env.BASE_URL||'http://127.0.0.1:4191/little-explorer-weekly/';
const server=process.env.BASE_URL?null:createServer((req,res)=>{
 const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/little-explorer-weekly/,'');const file=resolve(root,'.'+(p.endsWith('/')?p+'index.html':p));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.txt':'text/plain'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});if(server)await new Promise(r=>server.listen(4191,'127.0.0.1',r));
const originals=readdirSync('src/content').filter(n=>/^week-\d+\.json$/.test(n)).map(n=>JSON.parse(readFileSync('src/content/'+n,'utf8')));
const challenges=readdirSync('src/content/challenge').filter(n=>/^week-\d+\.json$/.test(n)).map(n=>JSON.parse(readFileSync('src/content/challenge/'+n,'utf8')));
const draft=review?JSON.parse(readFileSync('.local-review/week-5.json','utf8')):null;
const browser=await chromium.launch({headless:true});const errors=[],broken=[],external=[],results=[];const out='test-results/archive'+(review?'-review':process.env.BASE_URL?'-public':'');mkdirSync(out,{recursive:true});
try{
 for(const width of [375,390,768,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:width===1024?768:1000}});
  await context.addInitScript(()=>{
   const state={calls:[],current:null,cancels:0};window.__audio=state;
   Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text;}}});
   Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'zh-TW',name:'Taiwan'},{lang:'en-US',name:'English'}],addEventListener(){},removeEventListener(){},cancel(){state.cancels++;state.current=null;},pause(){},resume(){},speak(u){state.current=u;state.calls.push({text:u.text,lang:u.lang});u.onstart?.();setTimeout(()=>{if(state.current===u){state.current=null;u.onend?.();}},3);}}});
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)broken.push(r.url());});page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))external.push(r.url());});
  const check=async()=>{await page.locator('main').waitFor();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);for(const img of await page.locator('img').all()){await img.evaluate(async i=>{try{await i.decode();}catch{}});assert.ok(await img.evaluate(i=>i.naturalWidth>0));}};
  await page.goto(base);await page.evaluate(()=>localStorage.setItem('explorer-magazine-v1',JSON.stringify({saved:['water'],done:['water'],last:'water',size:25,warm:true,pages:{water:1}})));
  await page.goto(base+'#library');await check();assert.equal(await page.locator('.archive-result').count(),originals.flatMap(i=>i.articles).length+(draft?4:0));
  await page.getByLabel('搜尋歷期內容').fill('水蒸氣');assert.ok(await page.locator('.archive-result').count()>0);await page.locator('.archive-result').first().click();await check();assert.ok(page.url().includes('#read/'));await page.goto(base+'#library');
  await page.getByLabel('期數',{exact:true}).selectOption('week-3');assert.equal(await page.locator('.archive-result').count(),4);
  await page.getByLabel('搜尋歷期內容').fill('不存在的文字ZZZ');assert.equal(await page.locator('.archive-result').count(),0);await page.getByRole('button',{name:'清除篩選'}).click();
  await page.getByRole('button',{name:'五六年級挑戰版',exact:true}).click();assert.equal(await page.locator('.archive-result').count(),challenges.flatMap(i=>i.units).length);await page.getByLabel('搜尋歷期內容').fill('menu');assert.ok(await page.locator('.archive-result').count()>0);await page.locator('.archive-result').first().click();await check();assert.ok(page.url().includes('#challenge/'));
  await page.goto(base+'#library/life');await check();assert.equal(await page.locator('.archive-result').count(),draft?4:0);await page.screenshot({path:out+'/life-'+width+'.png'});
  await page.goto(base+'#library');await page.getByLabel('出版年月').selectOption('unknown');assert.equal(await page.locator('.archive-result').count(),originals.flatMap(i=>i.articles).length+(draft?4:0));
  await page.screenshot({path:out+'/library-'+width+'.png'});
  const memory=await page.evaluate(()=>JSON.parse(localStorage.getItem('explorer-magazine-v1')));assert.deepEqual(memory.saved,['water']);assert.deepEqual(memory.done,['water']);assert.equal(memory.size,25);assert.equal(memory.warm,true);
  if(draft)for(const a of draft.articles)for(let n=0;n<3;n++){
   await page.goto(base+'#read/'+a.id+'/'+n);await check();await page.evaluate(()=>window.__audio.calls=[]);await page.getByRole('button',{name:'聽這一頁',exact:true}).click();
   await page.waitForFunction(()=>window.__audio.calls.length>0&&!document.querySelector('[aria-label="暫停朗讀"]')&&!window.__audio.current);
   assert.deepEqual(await page.evaluate(()=>window.__audio.calls),[a.title,a.pages[n].title,...a.pages[n].text].map(text=>({text:normalizeSpeech(text,'zh-TW'),lang:'zh-TW'})));
   if(n===2){await page.locator('.options button').nth(a.answer).click();assert.match(await page.locator('.answer').innerText(),/答對了/);}
  }
  assert.ok((await page.request.get(base+'THIRD-PARTY-NOTICES.txt')).ok());results.push({width,status:'passed',draftPages:draft?12:0});await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);assert.deepEqual(external,[]);
 const report={results,errors,broken,external};writeFileSync(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server?.close();}
