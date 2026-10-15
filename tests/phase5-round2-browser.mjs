import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {resolve,extname,sep} from 'node:path';
import {dataSegments} from '../src/speech/challenge.ts';
import {textSegments,plainSegments} from '../src/speech/content.ts';
import {normalizeSpeech} from '../src/speech/normalize.ts';
const issues=readdirSync('src/content/challenge').filter(n=>/^week-\d+\.json$/.test(n)).map(n=>JSON.parse(readFileSync('src/content/challenge/'+n,'utf8')));
const originals=readdirSync('src/planet/content').filter(n=>/^week-\d+\.json$/.test(n)).flatMap(n=>JSON.parse(readFileSync('src/planet/content/'+n,'utf8')).articles);
const root=resolve('.local-review/phase5/build'),base=process.env.BASE_URL||'http://127.0.0.1:4191/little-explorer-weekly/';
const server=process.env.BASE_URL?null:createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/little-explorer-weekly/,'');
 const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});if(server)await new Promise(r=>server.listen(4191,'127.0.0.1',r));
const out='test-results/phase5-round2';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const errors=[],broken=[],results=[];
async function setup(width,mode='mock'){
 const context=await browser.newContext({viewport:{width,height:width===1024?768:1000}});
 await context.addInitScript(({mode})=>{
  if(mode==='absent'){Object.defineProperty(window,'speechSynthesis',{value:undefined});return;}
  const nativeTimeout=window.setTimeout.bind(window);
  // Accelerate only speech gaps. Engine tests verify the real contextual delays.
  window.setTimeout=(fn,ms,...args)=>nativeTimeout(fn,[100,240,400].includes(ms)?1:ms,...args);
  const state={calls:[],cancelCount:0,pauseCount:0,resumeCount:0,auto:false,current:null,voices:[],events:{}};
  const synth={speaking:false,paused:false,pending:false,
   getVoices(){if(mode==='throw')throw Error('unavailable');return state.voices;},
   addEventListener(n,f){state.events[n]=f;},removeEventListener(n){delete state.events[n];},
   cancel(){state.cancelCount++;const old=state.current;state.current=null;this.speaking=false;this.paused=false;nativeTimeout(()=>old?.onerror?.({error:'canceled'}),0);},
   pause(){state.pauseCount++;this.paused=true;},resume(){state.resumeCount++;this.paused=false;state.current?.onresume?.();},
   speak(u){if(mode==='throw')throw Error('unavailable');state.current=u;this.speaking=true;state.calls.push({text:u.text,lang:u.lang,voice:u.voice?.lang||null,voiceName:u.voice?.name||null,rate:u.rate});u.onstart?.();if(state.auto)nativeTimeout(()=>{if(state.current===u&&!this.paused)state.finish();},2);}
  };
  state.finish=()=>{const current=state.current;state.current=null;synth.speaking=false;current?.onend?.();};
  state.error=()=>state.current?.onerror?.({error:'synthesis-failed'});
  state.refresh=()=>{state.voices=[{lang:'en-US',name:'English Basic',localService:true},{lang:'zh-TW',name:'Taiwan Basic',localService:true},{lang:'en-US',name:'English Natural',localService:false},{lang:'zh-TW',name:'Taiwan Enhanced',localService:false}];state.events.voiceschanged?.();};
  window.__tts=state;Object.defineProperty(window,'speechSynthesis',{value:synth});Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text;}}});
 },{mode});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)broken.push(r.url());});
 return {context,page};
}
async function route(page,hash){await page.evaluate(()=>{if(window.__tts){window.__tts.calls=[];window.__tts.auto=false;}});await page.goto(base+hash);await page.locator('main').waitFor();await page.evaluate(()=>window.__tts?.refresh());}
async function layout(page,label){
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' overflow');
 const small=await page.locator('.speech-button,.speech-controls button,.speech-controls select').evaluateAll(els=>els.filter(e=>!e.closest('details:not([open])')&&(e.getBoundingClientRect().height<44||e.getBoundingClientRect().width<44)).map(e=>e.outerHTML));assert.deepEqual(small,[],label+' audio touch size');
}
async function read(page,label,expected){
 await page.evaluate(()=>{window.__tts.calls=[];window.__tts.auto=true;});
 await page.getByRole('button',{name:label,exact:true}).click();
 await page.waitForFunction(n=>window.__tts.calls.length>=n&&!document.querySelector('[aria-label="暫停朗讀"]')&&!window.__tts.current,expected.length);
 const calls=await page.evaluate(()=>window.__tts.calls);
 assert.deepEqual(calls.map(x=>({text:x.text,lang:x.lang})),expected.map(x=>({text:normalizeSpeech(x.text,x.lang),lang:x.lang})),label);
 assert.ok(calls.every(x=>x.voice===x.lang),label+' matching voices');
 return calls;
}
const middle=readdirSync('.local-review/phase5/middle').map(n=>JSON.parse(readFileSync('.local-review/phase5/middle/'+n)));
try{for(const width of [375,390,768,1024,1440]){const {context,page}=await setup(width);await page.goto(base);await page.locator('.home-grades').waitFor();assert.equal(await page.locator('nav[aria-label="主要閱讀目錄"] a').count(),5);await layout(page,'home '+width);await page.screenshot({path:out+'/home-'+width+'.png',fullPage:true});
for(const [href,count,selector] of [['#junior',16,'.book-card'],['#grades/3-4',20,'.catalog>.catalog-grid .story-card'],['#grades/5-6',16,'.book-card']]){await page.locator('.home-grades a[href="'+href+'"]').click();await page.locator(selector).first().waitFor();assert.equal(await page.locator(selector).count(),count);await page.goto(base);await page.locator('.home-grades').waitFor()}
await page.getByRole('navigation',{name:'主要閱讀目錄'}).getByRole('link',{name:'心理與生活',exact:true}).click();await page.locator('.life-area').waitFor();assert.equal(new URL(page.url()).hash,'#life');assert.equal(await page.locator('.life-area .story-card').count(),14);await layout(page,'life '+width);await page.screenshot({path:out+'/life-'+width+'.png',fullPage:true});
for(const [grade,count]of [['1-2',5],['3-4',5],['5-6',4]]){await page.getByLabel('年級',{exact:true}).selectOption(grade);await page.waitForFunction(n=>document.querySelectorAll('.life-area .story-card').length===n,count);assert.equal(await page.locator('.life-area .story-card').count(),count)}await page.getByLabel('年級',{exact:true}).selectOption('');
for(const [topic,count]of [['self',5],['friendship',2],['boundaries',2],['responsibility',5]]){await page.getByLabel('心理與生活主題',{exact:true}).selectOption(topic);await page.waitForFunction(n=>document.querySelectorAll('.life-area .story-card').length===n,count)}
await page.goto(base+'#library/life');await page.waitForFunction(()=>location.hash==='#life');await page.locator('.life-area').waitFor();
await page.getByLabel('年級',{exact:true}).selectOption('3-4');await page.getByLabel('心理與生活主題',{exact:true}).selectOption('self');await page.locator('a[href="#read/life-worry/0"]').click();await page.locator('.reader-body').waitFor();await page.getByRole('button',{name:'收藏文章',exact:true}).click();await page.getByRole('link',{name:'下一頁 →',exact:true}).click();await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('explorer-magazine-v1')).pages['life-worry']),1);await page.locator('.reader-top a').click();await page.locator('.life-area').waitFor();assert.equal(await page.getByLabel('年級',{exact:true}).inputValue(),'3-4');assert.equal(await page.getByLabel('心理與生活主題',{exact:true}).inputValue(),'self');
for(const b of middle)for(let i=0;i<3;i++){await route(page,'#read/'+b.id+'/'+i);await page.locator('.reader-body>h2').waitFor();assert.equal(await page.locator('.reader-body>h2').innerText(),b.pages[i].title);await layout(page,b.id+' '+i);if(width===390)await read(page,'聽這一頁',[...plainSegments(b.title,'article-title'),...plainSegments(b.pages[i].title,'article-page-title'),...b.pages[i].text.flatMap((p,j)=>plainSegments(p,'article-paragraph-'+j))]);if(i===2){await page.locator('.option-row>button:first-child').nth((b.answer+1)%3).click();await page.getByText('再看看文中的線索，你可以再試一次。',{exact:true}).waitFor();await page.locator('.option-row>button:first-child').nth(b.answer).click();await page.getByText(b.explanation,{exact:true}).waitFor()}}
await route(page,'#search');await page.getByRole('searchbox').fill('當擔心');await page.locator('a[href="#read/life-worry/0"]').waitFor();await page.getByRole('searchbox').fill('太空很大');await page.locator('a[href="#advanced/advanced-space-debris"]').waitFor();await page.getByRole('searchbox').fill('影子怎麼');await page.locator('a[href="#junior/junior-shadow"]').waitFor();await page.getByRole('searchbox').fill('不存在測試字串');await page.getByText('沒有符合的讀物，換個關鍵字試試。').waitFor();
await route(page,'#saved');await page.locator('a[href="#read/life-worry/0"]').waitFor();await route(page,'#topic/moon');assert.ok(await page.locator('a[href="#junior/junior-shadow"]').count());assert.ok(await page.locator('a[href="#advanced/advanced-earthquake"]').count());await layout(page,'cross topic');
assert.deepEqual(await page.locator('img').evaluateAll(els=>els.filter(e=>e.complete&&!e.naturalWidth).map(e=>e.src)),[]);results.push({width,gradeCounts:[16,20,16],life:14,lifeFilters:true,aliases:true,middlePages:12,answerRetry:true,returnContext:true,progress:true,search:true});await context.close()}
assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);writeFileSync(out+'/report.json',JSON.stringify({results,errors,broken,physicalDevices:false},null,2));console.log(JSON.stringify(results));}finally{await browser.close();server?.close()}
