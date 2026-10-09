import {readFileSync, readdirSync, existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const text = v => typeof v === 'string' && v.trim().length > 0;
export const loadIssues = dir => readdirSync(dir).filter(n => /^week-\d+\.json$/.test(n)).map(n => JSON.parse(readFileSync(dir+'/'+n,'utf8')));
export function validateIssues(issues, edition, imageExists = n => existsSync('public/assets/'+n+'.svg'), {draft=false}={}) {
 const ids=new Set(), numbers=new Set(), entries=new Set();
 const unique=(set,id)=>{assert.match(id,/^[a-z][a-z0-9-]*$/);assert.ok(!set.has(id),'重複 ID：'+id);set.add(id);};
 for(const i of issues){
  unique(ids,i.id);assert.ok(Number.isInteger(i.number)&&i.number>0);assert.ok(!numbers.has(i.number),'重複期數');numbers.add(i.number);assert.ok(text(i.title)&&text(i.description));
  const legacy=[1,2,3,4].includes(i.number)&&i.id==='week-'+i.number;
  if(!legacy||i.status!==undefined){
   assert.equal(i.status,draft?'draft':'published','正式教材不可含草稿');
   if(!draft){assert.match(i.publishedAt||'',/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(i.publishedAt).toISOString().slice(0,10),i.publishedAt);assert.ok(i.publishedAt<=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Taipei'}),'未來日期不可提前發布');assert.ok(text(i.reviewedBy)&&text(i.sourceRecord),'缺審閱與來源紀錄');}
  }
  if(edition==='magazine'){
   assert.ok(imageExists(i.cover),'封面不存在');assert.ok(i.articles?.length>=4);
   for(const a of i.articles){unique(entries,a.id);for(const k of ['title','subtitle','category','level','image','question','explanation','thinking','hint','task'])assert.ok(text(a[k]),a.id+' 缺 '+k);assert.ok(Number.isFinite(a.minutes)&&a.minutes>0);assert.ok(imageExists(a.image),'圖片不存在：'+a.image);assert.equal(a.pages.length,3);for(const p of a.pages)assert.ok(text(p.title)&&p.text.length&&p.text.every(text));assert.equal(a.word.length,2);assert.ok(a.word.every(text));assert.ok(a.options.length>=2&&a.options.every(text));assert.equal(new Set(a.options).size,a.options.length);assert.ok(Number.isInteger(a.answer)&&a.answer>=0&&a.answer<a.options.length,'答案超出選項');}
  }else{
   assert.deepEqual(i.units.map(u=>u.category),['數學挑戰','英文探索','閱讀推理','綜合挑戰']);
   for(const u of i.units){unique(entries,u.id);assert.ok(text(u.title)&&text(u.description));assert.ok(u.skills?.length&&u.takeaways?.length);assert.ok(u.steps.length>=5&&u.steps.length<=8);const steps=new Set();
    for(const s of u.steps){unique(steps,s.id);assert.ok(['read','choice','number','select','order','estimate','reflect'].includes(s.kind));for(const k of ['title','prompt','explanation'])assert.ok(text(s[k]),u.id+'/'+s.id+' 缺 '+k);assert.ok(Array.isArray(s.hints));if(s.kind!=='read')assert.equal(s.hints.length,2);if(s.kind==='number')assert.ok(Number.isFinite(s.answer));
     if(['choice','select','order','estimate','reflect'].includes(s.kind)){assert.ok(s.options?.length>=2&&s.options.every(text));if(s.kind==='reflect')assert.equal(s.replies?.length,s.options.length);else{const answers=Array.isArray(s.answer)?s.answer:[s.answer];assert.ok(answers.length&&answers.every(n=>Number.isInteger(n)&&n>=0&&n<s.options.length));}}
     const v=s.visual||u.visual;if(v)assert.ok(v.title&&v.headers.length&&v.rows.every(r=>r.length===v.headers.length&&r.every(text)));
    }
    if(u.category==='英文探索'){assert.ok(u.translations&&Object.keys(u.translations).length);for(const pairs of Object.values(u.translations)){assert.ok(Array.isArray(pairs)&&pairs.length);for(const p of pairs)assert.ok(text(p.en)&&text(p.zh),'翻譯需英文及繁體中文');}}
   }
  }
 }
 return {issues:issues.length,entries:entries.size};
}
export function validateProject(){return {magazine:validateIssues(loadIssues('src/content'),'magazine'),challenge:validateIssues(loadIssues('src/content/challenge'),'challenge')};}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(validateProject()));
