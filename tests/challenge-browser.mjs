import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {resolve,extname,sep} from 'node:path';
const issues=readdirSync('src/content/challenge').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync('src/content/challenge/'+n,'utf8')));
const root=resolve('docs'), live=process.env.BASE_URL;
const server=live?null:createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/little-explorer-weekly/,'');
 const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
if(server)await new Promise(r=>server.listen(4186,'127.0.0.1',r));
const base=live||'http://127.0.0.1:4186/little-explorer-weekly/';
const browser=await chromium.launch({headless:true});
const errors=[],broken=[],external=[],results=[],wrongCoverage=new Set();
const output='test-results/'+(live?'challenge-public':'challenge');mkdirSync(output,{recursive:true});
const original={saved:['water'],done:['seed'],last:'water',size:25,warm:true,pages:{water:1}};
async function watch(context){const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)broken.push(r.url());});p.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin)external.push(r.url());});return p;}
async function layout(page,label){await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' overflow');const small=await page.locator('.c-primary,.c-options label,.c-order,.c-header nav a').evaluateAll(els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent));assert.deepEqual(small,[],label+' small touch targets');assert.equal(await page.locator('main .c-primary').count(),1,label+' primary count');}
async function answer(page,s,wrong=false){
 if(s.kind==='number'){await page.locator('#c-answer').fill(String(wrong?s.answer+1:s.answer));return;}
 if(!s.options)return;
 let picks=Array.isArray(s.answer)?s.answer:[s.answer??0];
 if(wrong)picks=s.kind==='order'?[...picks].reverse():s.kind==='select'?[picks[0]]:[((s.answer??0)+1)%s.options.length];
 for(const n of picks){if(s.kind==='order')await page.locator('.c-order').nth(n).click();else await page.locator('.c-options label').nth(n).click();}
}
try{
 for(const [width,height]of [[375,812],[390,844],[768,1024],[1024,768],[1440,1000]]){
  const context=await browser.newContext({viewport:{width,height}});const page=await watch(context);
  await page.goto(base);await page.locator('.challenge-entry').waitFor();assert.equal(await page.locator('.issue-card').count(),4);
  await page.evaluate(value=>localStorage.setItem('explorer-magazine-v1',JSON.stringify(value)),original);
  await page.locator('.challenge-entry').click();await page.locator('.c-issue-card').first().waitFor();assert.equal(await page.locator('.c-issue-card').count(),4);await layout(page,'home');await page.screenshot({path:output+'/home-'+width+'.png',fullPage:true});
  let steps=0;
  for(const issue of issues){
   await page.goto(base+'#challenge/'+issue.id);await page.locator('.c-unit-card').first().waitFor();assert.equal(await page.locator('.c-unit-card').count(),4);
   for(const unit of issue.units){
    await page.goto(base+'#challenge/'+issue.id+'/'+unit.id+'/1');
    for(const [index,s]of unit.steps.entries()){
     await page.waitForFunction(t=>document.querySelector('main h1')?.textContent===t,s.title);await layout(page,unit.id+'/'+s.id+'/'+width);assert.match(await page.locator('.c-progress').innerText(),new RegExp((index+1)+' / 6'));
     if(index===0&&unit===issues[0].units[0])await page.screenshot({path:output+'/task-'+width+'.png',fullPage:true});
     if(unit.id==='solutions-mix'&&index===0)await page.screenshot({path:output+'/comparison-'+width+'.png',fullPage:true});
     if(index===3){await page.getByRole('link',{name:'← 上一步',exact:true}).click();await page.waitForFunction(t=>document.querySelector('main h1')?.textContent===t,unit.steps[2].title);await page.locator('main .c-primary').click();await page.waitForFunction(t=>document.querySelector('main h1')?.textContent===t,s.title);}
     if(s.hints.length){await page.getByRole('button',{name:'給我一個提示',exact:true}).click();assert.ok((await page.locator('.c-hints').innerText()).includes(s.hints[0]));await page.getByRole('button',{name:'再給我一個提示',exact:true}).click();assert.ok((await page.locator('.c-hints').innerText()).includes(s.hints[1]));}
     const tryWrong=width===375&&!wrongCoverage.has(s.kind)&&['number','choice','select','order'].includes(s.kind);
     await answer(page,s,tryWrong);await page.locator('main .c-primary').click();
     if(tryWrong){wrongCoverage.add(s.kind);assert.match(await page.locator('.c-feedback').innerText(),/再看看這個線索/);await page.locator('main .c-primary').click();assert.match(await page.locator('.c-feedback').innerText(),/查看解法/);await page.getByRole('button',{name:'看看解法',exact:true}).click();assert.match(await page.locator('.c-feedback').innerText(),/原來關鍵在這裡/);}
     else assert.match(await page.locator('.c-feedback').innerText(),/找到了|準備好了|這個方向有它的理由/);
     if(index===2){await page.reload();await page.locator('.c-feedback').waitFor();assert.equal(await page.locator('main h1').innerText(),s.title);await page.getByRole('link',{name:'挑戰版首頁',exact:true}).click();await page.locator('.c-intro .c-primary').click();await page.locator('.c-feedback').waitFor();assert.equal(await page.locator('main h1').innerText(),s.title);}
     await page.locator('main .c-primary').click();steps++;
    }
    await page.locator('.c-complete').waitFor();assert.match(await page.locator('.c-complete').innerText(),/今天帶走三件事/);await page.locator('.c-complete .c-primary').click();await page.locator('.c-unit-card').first().waitFor();
   }
  }
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('explorer-magazine-v1'))),original);
  await page.getByRole('link',{name:'網站首頁',exact:true}).click();await page.locator('.issue-card').first().waitFor();assert.equal(await page.locator('.issue-card').count(),4);
  await page.goto(base+'#read/water/1');await page.locator('#font-size').waitFor();assert.equal(await page.locator('#font-size').inputValue(),'25');assert.ok(await page.locator('.magazine.warm').isVisible());assert.equal(await page.locator('.bookmark').getAttribute('aria-pressed'),'true');
  await page.goto(base+'#challenge/week-9');await page.locator('.c-complete').waitFor();assert.match(await page.locator('main h1').innerText(),/找不到/);
  results.push({width,height,units:16,steps,status:'passed'});await context.close();
 }
 const denied=await browser.newContext();await denied.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}});});const p=await watch(denied);await p.goto(base+'#challenge/week-1/market-math/1');await p.locator('.c-storage').waitFor();await p.locator('main .c-primary').click();await p.locator('.c-feedback').waitFor();await denied.close();
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('explorer-challenge-v1','{broken'));const c=await watch(corrupt);await c.goto(base+'#challenge');await c.locator('.c-issue-card').first().waitFor();await corrupt.close();
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);assert.deepEqual(external,[]);assert.equal(wrongCoverage.size,4);
 const report={base,checkedAt:new Date().toISOString(),results,wrongAnswerTypes:[...wrongCoverage],errors,broken,external,checks:['separate original storage unchanged','all 96 steps complete at each width','both hints','retry twice then solution','back and next','reload and resume','completion and return to contents','original font/warm/bookmark preserved','missing route','storage blocked and corrupt']};writeFileSync(output+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();if(server)server.close();}
