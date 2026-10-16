import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{createHash}from'node:crypto';
const read=p=>fs.readFileSync(p,'utf8');
test('round2 only changes the designated cover in Art, retaining detail SVG and historical image files',()=>{
 const old=read('tests/fixtures/phase6-round2/Art.tsx.txt');
 const now=read('src/planet/Art.tsx').replace("import feelingsCover from './media/feelings-cover.png';\n",'').replace(/ if\(id==='feelings'&&!detail\)return .*?;\n/,'');
 assert.equal(now,old);
 const r=JSON.parse(read('audit/phase6/FEELINGS_COVER.json'));
 assert.equal(createHash('sha256').update(fs.readFileSync(r.file)).digest('hex'),r.sha256);assert.equal(r.risk,'B');
 const base=JSON.parse(read('tests/fixtures/phase6-protected.json'));
 const source=read('public/IMAGE_SOURCES.html').replace(read('tests/fixtures/phase6-round2/notice.txt'),'');
 assert.equal(createHash('sha256').update(source).digest('hex'),base['public/IMAGE_SOURCES.html']);
});
test('archive keeps identical random exploration and search matcher while edition controls are removed',()=>{
 const old=read('tests/fixtures/phase6-round2/Archive.tsx.txt'),now=read('src/planet/Archive.tsx');
 const random=s=>s.slice(s.indexOf(' function explore()'),s.indexOf('\n return <div'));
 assert.equal(random(now),random(old));assert.ok(now.includes('matches(query,e.text)'));
 assert.ok(!now.includes('challengeIssues'));assert.ok(!now.includes('<select'));
 assert.ok(now.includes('a.pages.flatMap(p=>[p.title,...p.text])'));
});
test('life uses manual image shelf without form filters; homepage random carousel core stays unchanged',()=>{
 const life=read('src/planet/Explore.tsx').split('export function LifeArea')[1].split('export function ExploreHome')[0];
 assert.ok(!/<input|<select|life-filters|setQuery/.test(life));assert.ok(life.includes('CardShelf'));
 assert.ok(!read('src/planet/CardShelf.tsx').includes('setInterval'));
 // 既有來源全檔位元保護由phase6-protected持續驗證；首頁核心是本輪前的版本。
 assert.ok(read('src/planet/DiscoveryCarousel.tsx').includes('6000'));
 for(const[p,h]of Object.entries(JSON.parse(read('tests/fixtures/phase6-round2/carousel-hashes.json'))))assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h,p);
});
