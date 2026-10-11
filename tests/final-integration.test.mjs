import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {publicationMonth,inPeriod,nextRandom} from '../src/planet/archive-model.ts';
const questions=JSON.parse(fs.readFileSync('src/planet/knowledge-review.json'));
const articles=[1,2,3,4].flatMap(n=>JSON.parse(fs.readFileSync(`src/content/week-${n}.json`)).articles);
test('archive dates use real publication fields only, support same month, gaps and unknown dates',()=>{
 const items=[{id:'a',number:1},{id:'b',number:7,publishedAt:'2026-11-01'},{id:'c',number:10,publishedAt:'2026-11-24'},{id:'d',number:11,publishedAt:'2027-01-01'}];
 assert.deepEqual(items.filter(i=>inPeriod(i,'2026','11')).map(i=>i.id),['b','c']);assert.deepEqual(items.filter(i=>inPeriod(i,'early','')).map(i=>i.id),['a']);
 assert.equal(publicationMonth({id:'x',number:1,publishedAt:'2026-02-30'}),'');assert.equal(publicationMonth({id:'x',number:1,createdAt:'2026-10-11'}),'');
});
test('random exploration excludes recent items, then avoids immediate repeat after pool exhausted',()=>{
 assert.equal(nextRandom([],[]),undefined);const items=[{id:'a'},{id:'b'},{id:'c'}];
 assert.equal(nextRandom(items,['a','b'],()=>0).id,'c');assert.notEqual(nextRandom(items,['a','b','c'],()=>.99).id,'c');
 let recent=[];for(let n=0;n<24;n++){const q=nextRandom(questions,recent,()=>.4);assert.ok(!recent.includes(q.id));recent.push(q.id)}
});
test('24 unique review questions preserve their original article mapping, independent answers and citations',()=>{
 assert.equal(questions.length,24);assert.equal(new Set(questions.map(q=>q.id)).size,24);assert.equal(new Set(questions.map(q=>q.articleId)).size,8);
 const answers={water:[0,1,2],ants:[1,2,0],maps:[2,0,1],moon:[1,2,0],bread:[0,1,2],seed:[1,2,0],coral:[2,0,1],binary:[1,2,0]};
 for(const q of questions){const a=articles.find(a=>a.id===q.articleId);assert.ok(a);assert.equal(q.answer,answers[q.articleId][Number(q.id.split('-').at(-1))-1]);assert.ok(q.options[q.answer]);assert.equal(q.options.length,new Set(q.options).size);assert.notEqual(q.prompt,a.question);assert.ok(q.concept&&q.explanation.length>20);assert.equal(q.articleHref,'#archive/read/'+a.id+'/0');assert.match(q.source.url,/^https:\/\//);assert.equal(q.source.checkedAt,'2026-10-11')}
});
test('all established educational data and voice source files are byte-for-byte preserved',()=>{
 const baseline=JSON.parse(fs.readFileSync('tests/fixtures/phase4-integration-baseline.json'));
 const corrections=JSON.parse(fs.readFileSync('audit/APPROVED_CORRECTIONS.json'));
 for(const [p,sha] of Object.entries(baseline)){if(corrections[p])assert.equal(corrections[p].before,sha,p+' original baseline');assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),corrections[p]?.after||sha,p);}
});
