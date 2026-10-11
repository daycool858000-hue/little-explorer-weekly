import {chromium,webkit,devices} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs';
const base=process.env.BASE_URL;if(!base)throw Error('Use tests/run-reading-browser.mjs');
const out='test-results/final-audit';fs.mkdirSync(out,{recursive:true});const results=[];
for(const [name,engine,device]of [['iphone-webkit',webkit,'iPhone 13'],['android-chromium',chromium,'Pixel 5'],['ipad-webkit',webkit,'iPad (gen 7)']]){
 const browser=await engine.launch();const context=await browser.newContext({...devices[device],reducedMotion:'reduce'});const p=await context.newPage(),errors=[],outside=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))outside.push(r.url())});
 for(const landscape of [false,true]){const v=devices[device].viewport;await p.setViewportSize(landscape?{width:v.height,height:v.width}:v);for(const route of ['','#catalog','#library','#library/life','#stories','#junior','#read/moon/0','#archive/read/water/0','#junior/junior-cold-cup','#stories/story-tide-letter','#challenge','#about']){
 await p.goto(base+route);await p.locator('main').waitFor();await p.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>{i.loading="eager";return i.decode().catch(()=>{})})));
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),name+route+' overflow');
 assert.equal(await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.getAttribute('alt')&&i.getAttribute('alt')!=='').length),0);
 assert.equal(await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&i.naturalWidth===0).length),0);
 if(route==='#about')assert.ok((await p.locator('main').innerText()).includes('GitHub 會為安全用途記錄訪客 IP'));
 if(!landscape&&['','#junior/junior-cold-cup','#read/moon/0'].includes(route))await p.screenshot({path:out+'/'+name+'-'+(route.replaceAll(/[^a-z0-9]/g,'')||'home')+'.png',fullPage:true});
 }
 results.push({name,orientation:landscape?'橫向':'直向',routes:12,layout:'passed',errors:[...errors],externalRequests:[...new Set(outside)]});}
 assert.deepEqual(errors,[]);assert.deepEqual(outside,[]);await context.close();await browser.close();console.log(name+' passed');
}
fs.writeFileSync(out+'/devices.json',JSON.stringify({checkedAt:new Date().toISOString(),simulation:true,physicalDevice:false,speechAudio:'不以此模擬推定真機聲音品質；utterance 與控制另有既有完整測試',results},null,2)+'\n');
