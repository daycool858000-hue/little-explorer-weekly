import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {plainSegments} from '../src/speech/content.ts';
const load=dir=>fs.readdirSync(dir).filter(x=>x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync(dir+'/'+x,'utf8')));
const stories=load('src/planet/stories'),junior=load('src/planet/junior'),issues=load('src/planet/content'),old=load('src/content');
test('new full stories and junior issue have stable unique IDs, complete endings, sources and real images',()=>{
 assert.equal(stories.length,16);assert.equal(junior.length,4);const ids=[...stories,...junior,...issues.flatMap(i=>i.articles)].map(x=>x.id);assert.equal(new Set(ids).size,36);
 for(const b of [...stories,...junior]){assert.ok(b.title&&b.grade&&b.question&&b.word&&b.provenance);assert.ok(fs.existsSync('public/'+b.image));assert.ok(b.imageAlt);assert.doesNotMatch(b.paragraphs.join(''),/TODO|placeholder|待補|这|没有/);assert.ok(b.paragraphs.length>=7);assert.ok(b.paragraphs.every(p=>p.trim().length>0));if(b.id.startsWith("story-"))assert.ok(b.paragraphs.every(p=>p.length>=40));assert.ok(b.paragraphs.join('').length>=(b.id.startsWith('story-')?450:120));for(const p of b.paragraphs){const s=plainSegments(p,'body');assert.ok(s.length);assert.ok(s.every(x=>x.lang==='zh-TW'));}}
});
test('all junior visible learning strings have explicitly aligned complete syllables and context readings',()=>{
 for(const b of junior){for(const s of [b.title,...b.paragraphs,b.word,b.definition,b.question,...b.options,b.explanation,b.activity]){const z=b.annotated[s];assert.ok(z,s);assert.equal(z.length,[...s].filter(c=>/\p{Script=Han}/u.test(c)).length,s);for(const x of z)assert.match(x,/^˙?[ㄅ-ㄩ]+[ˊˇˋ]?$/u);}assert.equal(b.phoneticReview.uncertain.length,0);assert.ok(b.answer>=0&&b.answer<b.options.length);}
 const cup=junior.find(b=>b.id==='junior-cold-cup');assert.ok(cup.annotated['她先把杯子外面擦乾。'].includes('ㄍㄢ'));assert.ok(cup.annotated['爸爸說，空氣中有看不見的水蒸氣。'].includes('ㄅㄨˊ'));
 const choice=junior.find(b=>b.id==='junior-take-turns');assert.ok(choice.annotated['小青把花畫好。小平也找好了長長的積木。'].includes('ㄔㄤˊ'));assert.ok(choice.annotated['小青搖頭。她的畫還差一點。'].includes('ㄔㄚ'));
});
test('remade articles preserve every published ID, three-page route, and full approved body',()=>{
 assert.equal(issues.length,4);for(const i of issues){assert.deepEqual(i.articles.map(a=>a.id),old.find(o=>o.id===i.id).articles.map(a=>a.id));for(const a of i.articles){assert.equal(a.pages.length,3);assert.ok(a.pages.flatMap(p=>p.text).join('').length>=450);assert.ok(a.options[a.answer]);}}
 if(fs.existsSync('.local-review/phase4-approved/content')){for(const i of issues){const prior=JSON.parse(fs.readFileSync('.local-review/phase4-approved/content/'+i.id+'.json','utf8'));for(let n=0;n<i.articles.length;n++)for(const key of ['title','pages','options','answer','question','explanation','sources'])assert.deepEqual(i.articles[n][key],prior.articles[n][key]);}}
});
test('public candidate never imports private week five or paid API dependencies',()=>{
 for(const n of fs.readdirSync('src/planet').filter(n=>/\.tsx?$/.test(n)))assert.doesNotMatch(fs.readFileSync('src/planet/'+n,'utf8'),/\.local-review|higgsfield|api\.openai/);
 const source=fs.readFileSync('src/planet/Design.tsx','utf8');assert.match(source,/explorer-magazine-v1/);assert.match(source,/#challenge/);assert.match(source,/#library\/life/);
});
