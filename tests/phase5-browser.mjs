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
const root=resolve('.local-review/phase5/build'),base=process.env.BASE_URL||'http://127.0.0.1:4187/little-explorer-weekly/';
const server=process.env.BASE_URL?null:createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/little-explorer-weekly/,'');
 const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});if(server)await new Promise(r=>server.listen(4187,'127.0.0.1',r));
const out='test-results/phase5';mkdirSync(out,{recursive:true});
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
const load=k=>readdirSync('.local-review/phase5/'+k).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync('.local-review/phase5/'+k+'/'+n)));
const junior=load('junior'),advanced=load('advanced');
try{
 for(const width of [375,390,768,1024,1440]){
 const {context,page}=await setup(width);let count=0;
 for(const b of [...junior,...advanced]){
 await route(page,(b.id.startsWith('junior')?'#junior/':'#advanced/')+b.id);
 assert.equal(await page.locator('.book-paragraph').count(),b.paragraphs.length);
 assert.equal(await page.locator('.book-word strong').count(),3);
 assert.equal(await page.evaluate(()=>window.__tts.calls.length),0);
 await layout(page,b.id+' '+width);
 if(b.annotated){assert.ok(await page.locator('ruby').count()>0);await page.getByRole('button',{name:'注音：開',exact:true}).click();assert.equal(await page.locator('ruby').count(),0);await page.getByRole('button',{name:'注音：關',exact:true}).click();await page.locator('.book-options button').nth(1-b.answer).click();assert.match(await page.getByRole('status').innerText(),/再回到/);await page.locator('.book-options button').nth(b.answer).click();}
 else {assert.equal(await page.locator('.section-index a').count(),4);assert.equal(await page.locator('.book-thinking details').count(),3);await page.locator('.book-thinking summary').first().click();}
 if(width===390)await read(page,'聽這一篇',[...plainSegments(b.title,'book-title'),...b.paragraphs.flatMap((p,i)=>plainSegments(p,'book-p-'+i))]);
 await page.locator('#book-p-5').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 await page.getByRole('button',{name:'收藏這篇',exact:true}).click();
 await page.reload();await page.locator('main').waitFor();assert.equal(await page.getByRole('button',{name:'已收藏 ✓',exact:true}).count(),1);
 await page.getByRole('button',{name:'回到上次記錄的位置',exact:true}).click();assert.ok(await page.evaluate(()=>scrollY>100));
 count++;
 }
 await route(page,'#grades/5-6');assert.equal(await page.locator('.book-card').count(),16);await page.screenshot({path:out+'/advanced-'+width+'.png',fullPage:true});
 await route(page,'#junior');assert.equal(await page.locator('.book-card').count(),16);
 await route(page,'#library/life');await layout(page,'life '+width);
 await route(page,'#advanced/advanced-earthquake');await page.screenshot({path:out+'/reader-'+width+'.png',fullPage:true});
 await page.getByRole('button',{name:'聽這一篇',exact:true}).click();await page.getByRole('button',{name:'暫停朗讀',exact:true}).click();await page.getByRole('button',{name:'繼續朗讀',exact:true}).click();assert.ok(await page.evaluate(()=>window.__tts.pauseCount>0&&window.__tts.resumeCount>0));const before=await page.evaluate(()=>window.__tts.cancelCount);await page.getByRole('link',{name:'五六年級閱讀',exact:true}).click();await page.waitForFunction(n=>window.__tts.cancelCount>n,before);
 results.push({width,newReadings:count,speech:width===390?'28篇全文逐段文字/語言比對':'播放控制',layout:'passed'});await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);writeFileSync(out+'/report.json',JSON.stringify({results,errors,broken,physicalDevices:false},null,2));console.log(JSON.stringify(results));
}finally{await browser.close();server?.close();}

