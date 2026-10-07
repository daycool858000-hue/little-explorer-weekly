import {chromium} from "playwright";
import assert from "node:assert/strict";
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from "node:fs";
import {createServer} from "node:http";
import {resolve,extname,sep} from "node:path";
import {pathToFileURL} from "node:url";
const root=resolve("docs");
const server=createServer((req,res)=>{
 const url=new URL(req.url,"http://localhost");
 const path=decodeURIComponent(url.pathname).replace(/^\/little-explorer-weekly/,"");
 const full=resolve(root,"."+ (path.endsWith("/")?path+"index.html":path));
 if(!full.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader("Content-Type",({".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"})[extname(full)]||"application/octet-stream");res.end(readFileSync(full));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(4175,"127.0.0.1",r));
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{}),args:["--no-sandbox"]});
const errors=[],bad=[],external=[],results=[];
const context=await browser.newContext();
const page=await context.newPage();
page.on("pageerror",e=>errors.push(e.message));
page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
page.on("response",r=>{if(r.status()>=400)bad.push(r.url());});
page.on("request",r=>{if(!r.url().startsWith("http://127.0.0.1:4175"))external.push(r.url());});
const base="http://127.0.0.1:4175/little-explorer-weekly/";
const issues=readdirSync("src/content").filter(n=>n.endsWith(".json")).map(n=>JSON.parse(readFileSync("src/content/"+n,"utf8")));
mkdirSync("test-results",{recursive:true});
async function check(label){
 await page.locator("main").waitFor();
 await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
 await page.evaluate(async () => { await Promise.all([...document.images].map(async i => { i.loading = "eager"; try { await i.decode(); } catch { /* asserted below */ } })); });
 const state=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),small:[...document.querySelectorAll("button,select,input,summary")].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height<44).map(e=>e.textContent?.trim())}));
 assert.ok(state.scroll<=state.width,label+" overflow "+JSON.stringify(state));
 assert.deepEqual(state.images,[],label+" broken images");
 assert.deepEqual(state.small,[],label+" small touch targets");
}
try{
 for(const [width,height]of [[375,812],[390,844],[768,1024],[1024,768],[1440,1000]]){
  await page.setViewportSize({width,height});
  await page.goto(base);await check(width+" home");
  assert.equal(await page.locator(".issue-card").count(),issues.length);
  await page.screenshot({path:"test-results/home-"+width+".png",fullPage:true});
  for(const issue of issues){
   await page.goto(base+"#issue/"+issue.id); await check(width+" "+issue.id);
   await page.locator(".book").first().waitFor();assert.equal(await page.locator(".book").count(),issue.articles.length);
   for(const a of issue.articles){
    for(let n=0;n<a.pages.length;n++){
     await page.goto(base+"#read/"+a.id+"/"+n);
     await check(width+" "+a.id+"/"+n);
    }
    await page.locator(".options button").nth(a.answer).click();
    assert.match(await page.locator(".answer").innerText(),/答對了/);
    await page.locator(".thinking summary").click();
    assert.ok(await page.locator(".thinking details").getAttribute("open")!==null);
    await page.locator(".complete").click();
   }
  }
  results.push({width,height,pages:1+issues.length+issues.flatMap(i=>i.articles).reduce((n,a)=>n+a.pages.length,0),status:"passed"});
  await page.goto(base+"#read/water/0");await page.selectOption("#font-size","28");await check(width+" largest-font");
  await page.screenshot({path:"test-results/reader-"+width+".png",fullPage:true});
  await page.goto(base+"#issue/week-3");await check(width+" issue screenshot");
  await page.screenshot({path:"test-results/issue-"+width+".png",fullPage:true});
  await page.goto(base+"#read/binary/2");await check(width+" quiz screenshot");
  await page.screenshot({path:"test-results/quiz-"+width+".png",fullPage:true});
 }
 await page.goto(base+"#read/ants/2");
 await page.locator(".bookmark").click();
 await page.reload();
 assert.equal(await page.locator(".bookmark").getAttribute("aria-pressed"),"true");
 assert.match(await page.locator(".reading-body").innerText(),/如果路上多了一片落葉/);
 await page.getByRole("button",{name:"← 回到本週目錄",exact:true}).click();
 await page.locator(".book").first().waitFor();assert.equal(await page.locator(".book").count(),4);
 await page.getByRole("button",{name:"下一期 →",exact:true}).click();
 assert.match(page.url(),/week-2/);
 await page.goBack();assert.match(page.url(),/week-1/);
 await page.goto(base+"#read/water/999");await check("clamped route");assert.match(await page.locator(".reading-body").innerText(),/旅行沒有終點/);
 await page.goto(base+"#read/missing/0");await page.locator(".issue-card").first().waitFor();assert.equal(await page.locator(".issue-card").count(),issues.length);
 await page.goto(base+"#issue/week-1");await page.fill("#search","不存在的主題");assert.equal(await page.locator(".book").count(),0);
 await page.getByRole("button",{name:"看看全部讀物 →"}).click();await page.locator(".book").first().waitFor();assert.equal(await page.locator(".book").count(),4);
 const denied=await browser.newContext();await denied.addInitScript(()=>{Object.defineProperty(window,"localStorage",{get(){throw Error("unavailable");}});});
 const p=await denied.newPage();await p.goto(base+"#read/water/0");await p.locator(".storage-notice").waitFor();assert.ok(await p.locator(".reading-body").isVisible());await denied.close();
 const offlineContext=await browser.newContext({offline:true});
 const offline=await offlineContext.newPage();
 const offlineErrors=[];
 offline.on("pageerror",e=>offlineErrors.push(e.message));
 await offline.goto(pathToFileURL(resolve("preview/standalone.html")).href);
 await offline.locator(".issue-card").first().waitFor();
 assert.equal(await offline.locator(".issue-card").count(),issues.length);
 await offline.locator(".latest-issue").click();await offline.locator(".book").first().waitFor();
 await offline.locator(".book-open").first().click();await offline.locator(".reading-body").waitFor();
 await offline.evaluate(async()=>Promise.all([...document.images].map(i=>i.decode())));
 assert.ok(await offline.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)));
 assert.deepEqual(offlineErrors,[]);await offlineContext.close();
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);assert.deepEqual(external,[]);
 writeFileSync("test-results/report.json",JSON.stringify({results,errors,brokenRequests:bad,externalRequests:external,checks:["all 16 articles / 48 pages","four issue menus","correct answers","thinking reveals","completion stamps","bookmark + resume after reload","previous/next issue + browser back","invalid route + page clamp","search empty + reset","storage unavailable","largest font"]},null,2));
 console.log(JSON.stringify({results,errors,brokenRequests:bad,externalRequests:external},null,2));
}finally{await browser.close();server.close();}

