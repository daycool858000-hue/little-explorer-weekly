import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, readdirSync, existsSync} from "node:fs";
const issues = readdirSync("src/content").filter(n=>n.endsWith(".json")).map(n=>JSON.parse(readFileSync("src/content/"+n,"utf8")));
test("all issues contain complete, unique, accessible reading content",()=>{
 const ids=new Set();
 assert.ok(issues.length>=4);
 for(const issue of issues){
  assert.ok(issue.articles.length>=4);
  assert.ok(existsSync("public/assets/"+issue.cover+".svg"));
  for(const a of issue.articles){
   assert.ok(!ids.has(a.id)); ids.add(a.id);
   assert.ok(existsSync("public/assets/"+a.image+".svg"),a.id+" image");
   assert.equal(a.pages.length,3);
   for(const p of a.pages){assert.ok(p.title);assert.ok(p.text.length>=2);assert.ok(p.text.every(s=>s.length>15));}
   assert.ok(a.answer>=0 && a.answer<a.options.length);
   for(const key of ["title","subtitle","explanation","thinking","hint","task"]) assert.ok(a[key],a.id+" "+key);
  }
 }
 assert.ok(ids.size>=16);
});
test("client has no hosted-platform or remote service dependency",()=>{
 const files=["src/App.tsx","src/styles.css","src/main.tsx","src/library.ts","index.html"];
 for(const file of files) assert.doesNotMatch(readFileSync(file,"utf8"),/higgsfield|https?:\/\/|fetch\(|XMLHttpRequest|api[_-]?key/i,file);
 const manifest=JSON.parse(readFileSync("public/manifest.webmanifest","utf8"));
 assert.equal(manifest.start_url,"./"); assert.equal(manifest.scope,"./");
});

