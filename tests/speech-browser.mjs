import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {resolve,extname,sep} from 'node:path';
import {dataSegments} from '../src/speech/challenge.ts';
import {textSegments,plainSegments} from '../src/speech/content.ts';
import {normalizeSpeech} from '../src/speech/normalize.ts';
const issues=[1,2,3,4].map(n=>JSON.parse(readFileSync('src/content/challenge/week-'+n+'.json','utf8')));
const originals=[1,2,3,4].flatMap(n=>JSON.parse(readFileSync('src/content/week-'+n+'.json','utf8')).articles);
const root=resolve('docs'),base=process.env.BASE_URL||'http://127.0.0.1:4187/little-explorer-weekly/';
const server=process.env.BASE_URL?null:createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/little-explorer-weekly/,'');
 const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});if(server)await new Promise(r=>server.listen(4187,'127.0.0.1',r));
const out='test-results/'+(process.env.BASE_URL?'speech-public':'speech');mkdirSync(out,{recursive:true});
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
 await page.waitForFunction(()=>window.__tts.calls.length>0&&!document.querySelector('[aria-label="暫停朗讀"]')&&!window.__tts.current);
 const calls=await page.evaluate(()=>window.__tts.calls);
 assert.deepEqual(calls.map(x=>({text:x.text,lang:x.lang})),expected.map(x=>({text:normalizeSpeech(x.text,x.lang),lang:x.lang})),label);
 assert.ok(calls.every(x=>x.voice===x.lang),label+' matching voices');
 return calls;
}
try{
 for(const width of [375,390,768,1024,1440]){
  const {context,page}=await setup(width);let pages=0,steps=0;
  await route(page,'#read/water/0');assert.equal(await page.evaluate(()=>window.__tts.calls.length),0,'no autoplay');assert.equal(await page.getByLabel('朗讀語速',{exact:true}).inputValue(),'1.2');
  await page.getByRole('button',{name:'聽這一頁',exact:true}).focus();await page.keyboard.press('Enter');await page.locator('.speech-highlight').first().waitFor();
  await page.getByRole('button',{name:'暫停朗讀',exact:true}).click();assert.equal(await page.evaluate(()=>window.__tts.pauseCount),1);
  await page.getByRole('button',{name:'繼續朗讀',exact:true}).click();assert.ok(await page.evaluate(()=>window.__tts.resumeCount>0));
  await page.getByRole('button',{name:'重新播放',exact:true}).click();assert.equal(await page.evaluate(()=>window.__tts.calls.length),2);
  for(const rate of [.9,1.2,1.5,1.8]){await page.getByLabel('朗讀語速',{exact:true}).selectOption(String(rate));await page.getByRole('button',{name:'重新播放',exact:true}).click();assert.equal(await page.evaluate(()=>window.__tts.calls.at(-1).rate),rate);}
  assert.equal(await page.evaluate(()=>window.__tts.calls.at(-1).voiceName),'Taiwan Enhanced');
  await page.locator('.speech-voices summary').click();await layout(page,'expanded voice controls '+width);
  await page.getByLabel('中文聲音',{exact:true}).selectOption('zh-TW|Taiwan Basic');await page.getByRole('button',{name:'重新播放',exact:true}).click();assert.equal(await page.evaluate(()=>window.__tts.calls.at(-1).voiceName),'Taiwan Basic');
  const cancels=await page.evaluate(()=>window.__tts.cancelCount);await page.getByRole('button',{name:'下一頁 →',exact:true}).click();await page.waitForFunction(n=>window.__tts.cancelCount>n,cancels);assert.equal(await page.locator('.speech-highlight').count(),0);
  await page.reload();await page.evaluate(()=>window.__tts.refresh());assert.equal(await page.getByLabel('朗讀語速',{exact:true}).inputValue(),'1.8');await page.locator('.speech-voices summary').click();assert.equal(await page.getByLabel('中文聲音',{exact:true}).inputValue(),'zh-TW|Taiwan Basic');await page.getByLabel('中文聲音',{exact:true}).selectOption('');await page.getByLabel('朗讀語速',{exact:true}).selectOption('1.2');
  for(const a of width===375?originals:[originals[0]])for(const [n,p]of a.pages.entries()){
   await route(page,'#read/'+a.id+'/'+n);assert.equal(await page.evaluate(()=>window.__tts.calls.length),0);
   await read(page,'聽這一頁',[...plainSegments(a.title,'article-title'),...plainSegments(p.title,'article-page-title'),...p.text.flatMap((t,i)=>plainSegments(t,'article-paragraph-'+i))]);
   if(n===a.pages.length-1)await read(page,'聽題目',plainSegments(a.question,'article-question'));
   await layout(page,a.id+'/'+n);pages++;
  }
  await page.screenshot({path:out+'/original-'+width+'.png',fullPage:true});
  for(const issue of issues)for(const unit of issue.units)for(const [index,s]of unit.steps.entries()){
   if(width!==375&&unit.category!=='英文探索'&&![0,3,4].includes(index))continue;
   await route(page,'#challenge/'+issue.id+'/'+unit.id+'/'+(index+1));await page.locator('.c-task').waitFor();assert.equal(await page.evaluate(()=>window.__tts.calls.length),0);
   const saved=await page.evaluate(()=>localStorage.getItem('explorer-challenge-v1'));
   const dataCalls=await read(page,'聽資料',dataSegments(unit,index,'bilingual'));
   if(unit.id==='menu-english')assert.ok(dataCalls.some(c=>c.text==='A sandwich costs eighty-five New Taiwan dollars.'&&c.lang==='en-US'));
   if(unit.id==='chart-math')assert.ok(dataCalls.some(c=>c.text==='步行的人有二十人。'&&c.lang==='zh-TW'));
   const questionCalls=await read(page,'聽題目',textSegments(s.prompt,'step-prompt',unit.translations));
   if(unit.id==='market-math'&&index===1)assert.deepEqual(questionCalls.map(c=>[c.text,c.lang]),[['兩瓶果汁共有 一點五公升,換成多少 毫升?','zh-TW']]);
   assert.ok(!dataCalls.some(c=>/NT\$|\d|\bmL\b|\bkm\b/.test(c.text)),'engine receives normalized facts');
   for(const [i,option]of (s.options||[]).entries())await read(page,'朗讀選項 '+(i+1),textSegments(option,'option-'+i,unit.translations));
   assert.equal(await page.evaluate(()=>localStorage.getItem('explorer-challenge-v1')),saved,'listening does not answer or change progress');
   assert.equal(await page.locator('.c-options input:checked').count(),0,'speaker does not select option');
   await layout(page,unit.id+'/'+s.id+'/'+width);steps++;
   if(unit.id==='message-english'&&index===4)await page.screenshot({path:out+'/english-'+width+'.png',fullPage:true});
  }
  await route(page,'#challenge/week-1/menu-english/1');await page.getByRole('button',{name:'聽資料',exact:true}).click();
  await page.locator('[data-speech-id="step-text-0-en"].speech-highlight').waitFor();await page.evaluate(()=>window.__tts.finish());await page.locator('[data-speech-id="step-text-0-zh"].speech-highlight').waitFor();
  await page.getByRole('button',{name:'停止朗讀',exact:true}).click();await page.getByRole('button',{name:'中文輔助',exact:true}).click();assert.equal(await page.locator('.speech-zh').count(),0);
  await page.getByLabel('英文朗讀模式',{exact:true}).selectOption('english');await read(page,'聽資料',dataSegments(issues[0].units[1],0,'english'));
  await page.reload();assert.equal(await page.getByLabel('英文朗讀模式',{exact:true}).inputValue(),'english');assert.equal(await page.getByRole('button',{name:'中文輔助',exact:true}).getAttribute('aria-pressed'),'false');
  await page.getByRole('button',{name:'中文輔助',exact:true}).click();await page.getByLabel('英文朗讀模式',{exact:true}).selectOption('bilingual');
  for(const [hash,target]of [['#challenge/week-1/menu-english/2','← 上一步'],['#challenge/week-1/menu-english/1','挑戰版首頁'],['#challenge/week-1/menu-english/1','網站首頁'],['#challenge/week-1/menu-english/1','← 第 1 期目錄']]){
   await route(page,hash);await page.getByRole('button',{name:'聽資料',exact:true}).click();const n=await page.evaluate(()=>window.__tts.cancelCount);await page.getByRole('link',{name:target,exact:true}).click();await page.waitForFunction(x=>window.__tts.cancelCount>x,n);assert.equal(await page.evaluate(()=>!!window.__tts.current),false);
  }
  await route(page,'#challenge/week-1/menu-english/1');await page.locator('.c-primary').click();await page.getByRole('button',{name:'聽資料',exact:true}).click();const n=await page.evaluate(()=>window.__tts.cancelCount);await page.locator('.c-primary').click();await page.waitForFunction(x=>window.__tts.cancelCount>x,n);
  results.push({width,originalPages:pages,challengeSteps:steps,status:'passed'});console.log('passed width '+width);await context.close();
 }
 for(const mode of ['absent','throw']){
  const {context,page}=await setup(375,mode);await route(page,'#challenge/week-1/menu-english/4');await page.locator('.speech-zh').first().waitFor();
  if(mode==='throw')await page.getByRole('button',{name:'聽資料',exact:true}).click();await page.getByText(/此裝置暫不支援朗讀/).waitFor();
  await page.getByRole('button',{name:'給我一個提示',exact:true}).click();await page.locator('.c-options label').first().click();await page.locator('.c-primary').click();await page.locator('.c-feedback').waitFor();
  assert.ok(await page.evaluate(()=>!!JSON.parse(localStorage.getItem('explorer-challenge-v1')).units['menu-english'].responses.s4));
  await route(page,'#read/water/0');await page.locator('.reading-body').waitFor();await page.getByRole('button',{name:'下一頁 →',exact:true}).click();await page.locator('.reading-body').waitFor();await context.close();
 }
 const {context,page}=await setup(390);await route(page,'#read/water/0');await page.getByRole('button',{name:'聽這一頁',exact:true}).click();await page.evaluate(()=>window.__tts.error());await page.getByText(/此裝置暫不支援朗讀/).waitFor();await page.getByRole('button',{name:'下一頁 →',exact:true}).click();await context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);
 const report={base,checkedAt:new Date().toISOString(),speech:'Web Speech API simulated with deterministic voices/events; not a physical audio test',results,errors,broken,checks:['no autoplay','per-page reading','question only, no answer','data available and replayable','individual options do not select answers','English/Chinese per sentence and matching voices','highlight switches language','pause/resume/replay/rate','preferences survive reload','route cancellation and stale callbacks','unsupported/throwing/error API does not break reading or answering']};
 writeFileSync(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();if(server)server.close();}
