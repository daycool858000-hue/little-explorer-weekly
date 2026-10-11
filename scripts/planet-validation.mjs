import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL}from'node:url';
const load=p=>fs.readdirSync(p).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(fs.readFileSync(p+'/'+n,'utf8')));
export function validatePlanet(){const issues=load('src/planet/content'),stories=load('src/planet/stories'),junior=load('src/planet/junior'),ids=new Set();
for(const b of [...issues,...stories,...junior]){assert.equal(b.status,'published','公開來源不得含私人／未核准草稿');assert.ok(b.releaseAuthorizedBy,'缺發布授權紀錄');}
for(const b of [...issues.flatMap(i=>i.articles),...stories,...junior]){assert.match(b.id,/^[a-z][a-z0-9-]*$/);assert.ok(!ids.has(b.id),'重複 ID');ids.add(b.id);assert.ok(b.title);assert.doesNotMatch(JSON.stringify(b),/placeholder|請填寫|TODO/);}
for(const b of [...stories,...junior]){assert.ok(b.paragraphs.length>=7&&b.paragraphs.every(p=>p.trim()));assert.ok(b.question&&b.grade&&b.provenance&&b.imageAlt);assert.ok(fs.existsSync('public/'+b.image),'缺圖片 '+b.image);assert.ok(b.sources.every(s=>/^https:\/\//.test(s.url)&&/^\d{4}-\d{2}-\d{2}$/.test(s.checkedAt)));}
for(const b of junior){assert.equal(b.phoneticReview.uncertain.length,0,'有未解決注音');for(const t of [b.title,...b.paragraphs,b.word,b.definition,b.question,...b.options,b.explanation,b.activity]){assert.ok(b.annotated[t],'缺注音 '+t);assert.equal(b.annotated[t].length,[...t].filter(c=>/\p{Script=Han}/u.test(c)).length);for(const z of b.annotated[t])assert.match(z,/^˙?[ㄅ-ㄩ]+[ˊˇˋ]?$/u);}assert.ok(b.options[b.answer]);}
for(const i of issues){assert.equal(i.articles.length,4);for(const a of i.articles){assert.equal(a.pages.length,3);assert.ok(a.options[a.answer]);assert.ok(a.sources);}}
assert.ok(stories.length>=16&&junior.length>=4);return{remade:issues.flatMap(i=>i.articles).length,stories:stories.length,junior:junior.length,uniqueIds:ids.size};}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(validatePlanet()));
