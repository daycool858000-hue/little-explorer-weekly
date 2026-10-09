import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {adjacent,matches} from '../src/catalog.ts';
import {validateIssues,validateProject,loadIssues} from '../scripts/content-validation.mjs';
test('sorted stable IDs support gaps without changing legacy routes',()=>{
 const issues=[{id:'issue-8',number:8},{id:'issue-1',number:1},{id:'issue-5',number:5}];
 assert.equal(adjacent(issues,'issue-5').previous.id,'issue-1');assert.equal(adjacent(issues,'issue-5').next.id,'issue-8');assert.equal(adjacent(issues,'issue-8').next,undefined);assert.equal(adjacent(issues,'missing').next,undefined);
 assert.ok(matches('  ＭＥＮＵ  tea ',['Menu','hot tea']));assert.ok(matches('水蒸氣',['一滴水',['液態變成水蒸氣']]));assert.ok(!matches('不存在', '月亮'));
});
test('all current data validate; duplicate IDs, missing images and invalid answers fail',()=>{
 const report=validateProject();assert.ok(report.magazine.issues>=4&&report.magazine.entries>=16);assert.ok(report.challenge.entries>=16);
 const issues=loadIssues('src/content');const clone=()=>structuredClone(issues);
 let bad=clone();bad[1].id=bad[0].id;assert.throws(()=>validateIssues(bad,'magazine'));
 bad=clone();bad[1].articles[0].id=bad[0].articles[0].id;assert.throws(()=>validateIssues(bad,'magazine'));
 bad=clone();bad[0].articles[0].answer=99;assert.throws(()=>validateIssues(bad,'magazine'));
 assert.throws(()=>validateIssues(issues,'magazine',()=>false));
 const challenge=loadIssues('src/content/challenge');delete challenge[0].units[1].translations[challenge[0].units[1].steps[0].text];assert.throws(()=>validateIssues(challenge,'challenge'));
});
test('new draft is previewable but never accepted as published data; dates are not invented',()=>{
 const i=structuredClone(loadIssues('src/content')[0]);i.id='week-8';i.number=8;i.status='draft';i.publishedAt=null;
 assert.throws(()=>validateIssues([i],'magazine'));assert.equal(validateIssues([i],'magazine',()=>true,{draft:true}).entries,4);
 assert.ok(loadIssues('src/content').filter(i=>i.number<=4).every(i=>i.publishedAt===undefined));
 const config=readFileSync('vite.config.ts','utf8');assert.match(config,/reviewing && existsSync\(folder\)/);assert.match(config,/outDir: reviewing \? '.local-review\/build' : 'docs'/);assert.match(readFileSync('.gitignore','utf8'),/\.local-review\//);
});
test('distributed notices contain full upstream notices, without licensing educational content',()=>{
 const notices=readFileSync('public/THIRD-PARTY-NOTICES.txt','utf8');
 for(const name of ['react','react-dom','scheduler'])assert.ok(notices.includes(readFileSync('node_modules/'+name+'/LICENSE','utf8')));
 assert.ok(notices.includes(readFileSync('node_modules/vite/LICENSE.md','utf8').split('# Licenses of bundled dependencies')[0]));assert.match(notices,/不適用本站/);assert.ok(!existsSync('LICENSE'));
});
test('a reviewed non-contiguous future issue extends the catalog without rewriting old data',()=>{
 const old=loadIssues('src/content'),before=JSON.stringify(old),i=structuredClone(old[0]);
 Object.assign(i,{id:'week-8',number:8,status:'published',publishedAt:'2001-01-01',reviewedBy:'測試審閱者',sourceRecord:'sources/week-8.json'});
 i.articles.forEach(a=>a.id='new-'+a.id);
 const record={issueId:i.id,reviewStatus:'approved',reviewedBy:'測試審閱者',items:[...i.articles.map(a=>({id:a.id,path:'src/content/week-8.json'})),...[i.cover,...i.articles.map(a=>a.image)].map(name=>({id:name,path:'public/assets/'+name+'.svg'}))].map(item=>({...item,reviewStatus:'approved',creator:'測試',aiUse:'測試',thirdParty:'測試',licenseBasis:'測試',evidence:'測試',humanChanges:'測試'}))};
 assert.equal(validateIssues([...old,i],'magazine',()=>true,{sourceReader:()=>record}).entries,20);
 assert.equal(JSON.stringify(old),before);assert.equal(adjacent([...old,i],'week-4').next.id,'week-8');
 i.publishedAt='2001-02-31';assert.throws(()=>validateIssues([i],'magazine',()=>true,{sourceReader:()=>record}));
 i.publishedAt='2999-01-01';assert.throws(()=>validateIssues([i],'magazine',()=>true,{sourceReader:()=>record}));
 i.publishedAt='2001-01-01';record.reviewStatus='pending';assert.throws(()=>validateIssues([i],'magazine',()=>true,{sourceReader:()=>record}));
});
test('private review content validates if present and production contains none of its text or images',()=>{
 if(!existsSync('.local-review/week-5.json'))return;
 const draft=JSON.parse(readFileSync('.local-review/week-5.json','utf8'));
 assert.equal(validateIssues([draft],'magazine',n=>existsSync('.local-review/assets/'+n+'.svg'),{draft:true}).entries,4);
 const oldIds=new Set(loadIssues('src/content').flatMap(i=>i.articles.map(a=>a.id)));for(const a of draft.articles)assert.ok(!oldIds.has(a.id));
 if(existsSync('docs/assets')){const bundle=readdirSync('docs/assets').filter(n=>n.endsWith('.js')).map(n=>readFileSync('docs/assets/'+n,'utf8')).join('');for(const a of draft.articles){assert.ok(!bundle.includes(a.title));assert.ok(!existsSync('docs/assets/'+a.image+'.svg'));}}
});
