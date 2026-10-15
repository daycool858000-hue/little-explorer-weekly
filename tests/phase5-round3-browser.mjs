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
const root=resolve('.local-review/phase5/build'),base=process.env.BASE_URL||'http://127.0.0.1:4194/little-explorer-weekly/';
const server=process.env.BASE_URL?null:createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/little-explorer-weekly/,'');
 const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});if(server)await new Promise(r=>server.listen(4194,'127.0.0.1',r));
const out='test-results/phase5-round3';mkdirSync(out,{recursive:true});
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
const juniors=[...readdirSync('src/planet/junior').map(n=>JSON.parse(readFileSync('src/planet/junior/'+n))),...readdirSync('.local-review/phase5/junior').map(n=>JSON.parse(readFileSync('.local-review/phase5/junior/'+n)))];
try{for(const width of [375,390,768,1024,1440]){const {context,page}=await setup(width);await page.goto(base);await page.locator('.home-grades').waitFor();assert.equal(await page.locator('nav[aria-label="主要閱讀目錄"] a').count(),5);assert.equal(await page.locator('.saved-secondary').getAttribute('href'),'#saved');await layout(page,'home');await page.screenshot({path:out+'/home-'+width+'.png',fullPage:true});await page.goto(base+'#life');assert.equal(await page.locator('.life-area .story-card').count(),14);assert.equal(await page.locator('.life-area .story-card .knowledge-visual').count(),14);assert.equal(await page.locator('.life-directions .knowledge-visual').count(),4);await layout(page,'life');await page.screenshot({path:out+'/life-'+width+'.png',fullPage:true});
await route(page,'#grades/5-6');assert.equal(await page.locator('.book-card').count(),16);assert.equal(await page.getByText('找不到這篇讀物，請從目錄選一篇。').count(),0);await page.reload();assert.equal(await page.getByText('找不到這篇讀物，請從目錄選一篇。').count(),0);
for(const b of (width===390?juniors:[juniors[0]])){await route(page,'#junior/'+b.id);await page.locator('.book-reader').waitFor();assert.equal(await page.locator('.book-reader>.knowledge-visual,.book-reader>.book-cover').count(),1,b.id);assert.ok(await page.locator('.book-reader>.knowledge-visual svg[aria-labelledby],.book-reader>.book-cover[alt]').count());await layout(page,b.id)}
for(const id of ['advanced-map-perspectives','advanced-coral-network','advanced-space-debris','advanced-printing-spread']){await route(page,'#advanced/'+id);assert.equal(await page.locator('.book-reader>.knowledge-visual').count(),1,id);await layout(page,id)}
await route(page,'#junior/junior-seed');await page.locator('.seed-explorer').scrollIntoViewIfNeeded();const seed=page.locator('.seed-explorer');assert.ok((await seed.innerText()).includes('1 / 4'));await seed.getByRole('button',{name:'開始觀察'}).click();await seed.getByRole('button',{name:'暫停變化'}).click();await page.waitForTimeout(1900);assert.ok((await seed.innerText()).includes('1 / 4'));await seed.getByRole('checkbox').uncheck();for(let i=0;i<3;i++)await seed.getByRole('button',{name:i===0?'開始觀察':'觀察下一步'}).click();assert.ok((await seed.innerText()).includes('4 / 4'));assert.equal(await seed.locator('.seed-shoot').count(),1);await seed.getByRole('button',{name:'上一步'}).click();assert.ok((await seed.innerText()).includes('3 / 4'));await seed.getByLabel('水淹過種子').check();await seed.getByRole('button',{name:'開始觀察'}).click();await seed.getByRole('button',{name:'觀察下一步'}).click();assert.match(await seed.getByRole('status').innerText(),/不代表所有種子會立刻死亡/);assert.equal(await seed.locator('.seed-shoot').count(),0);await seed.getByRole('button',{name:'重新觀察'}).click();await layout(page,'seed');await seed.screenshot({path:out+'/seed-'+width+'.png'});
assert.equal(await page.getByLabel('朗讀語速',{exact:true}).inputValue(),'1.1');assert.deepEqual(await page.getByLabel('朗讀語速',{exact:true}).locator('option').evaluateAll(xs=>xs.map(x=>x.value)),['0.9','1.1']);for(const rate of ['0.9','1.1']){await page.getByLabel('朗讀語速',{exact:true}).selectOption(rate);await page.getByRole('button',{name:'聽這一篇',exact:true}).click();assert.equal(await page.evaluate(()=>window.__tts.calls.at(-1).rate),Number(rate));await page.getByRole('button',{name:'停止朗讀'}).click()}await page.getByRole('button',{name:'收藏這篇',exact:true}).click();await route(page,'#saved');await page.locator('a[href="#junior/junior-seed"]').waitFor();results.push({width,lifeImages:14,juniorImages:width===390?16:1,advancedImages:4,seed:true,rates:true,route:true,bookmarks:true});await context.close()}
for(const old of [.8,1,1.2,1.5,1.8]){const {context,page}=await setup(390);await context.addInitScript(rate=>{localStorage.setItem('explorer-speech-v1',JSON.stringify({rate,mode:'english',chinese:false,zhVoice:'zh-TW|Taiwan Basic',enVoice:'en-US|English Basic'}));localStorage.setItem('explorer-magazine-v1',JSON.stringify({saved:['water'],pages:{water:1}}))},old);await route(page,'#junior/junior-seed');const expected=old<=1?.9:1.1;assert.equal(await page.getByLabel('朗讀語速').inputValue(),String(expected));assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('explorer-speech-v1'))),{rate:expected,mode:'english',chinese:false,zhVoice:'zh-TW|Taiwan Basic',enVoice:'en-US|English Basic'});assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('explorer-magazine-v1'))),{saved:['water'],pages:{water:1}});await page.getByRole('button',{name:'聽這一篇',exact:true}).click();assert.equal(await page.evaluate(()=>window.__tts.calls.at(-1).rate),expected);await page.reload();assert.equal(await page.getByLabel('朗讀語速').inputValue(),String(expected));await context.close()}
const {context,page}=await setup(390);await page.emulateMedia({reducedMotion:'reduce'});await route(page,'#junior/junior-seed');assert.equal(await page.locator('.seed-explorer input[type=checkbox]').isChecked(),false);await page.locator('.seed-explorer button').filter({hasText:'開始觀察'}).click();assert.match(await page.locator('.seed-explorer').innerText(),/2 \/ 4/);await page.goto(base);await page.getByRole('button',{name:'微動態：關'}).click();assert.equal(await page.locator('.planet-hero img').evaluate(el=>getComputedStyle(el).animationName),'none');await context.close();assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);writeFileSync(out+'/report.json',JSON.stringify({results,migrations:true,reducedMotion:true,errors,broken,physicalDevices:false},null,2));console.log(JSON.stringify(results));}finally{await browser.close();server?.close()}
