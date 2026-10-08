import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {emptyProgress,emptyResponse,hasAnswer,isCorrect,numericValue,resolveRoute,sanitizeProgress} from '../src/challenge/model.ts';
const issues=readdirSync('src/content/challenge').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync('src/content/challenge/'+n,'utf8'))).sort((a,b)=>a.number-b.number);
const units=issues.flatMap(i=>i.units);
const baseline=JSON.parse(readFileSync('tests/fixtures/original.json','utf8'));
test('original content, illustrations, styles, and reading implementation are protected',()=>{
 for(const [file,expected]of Object.entries(baseline.files)){
  let bytes=readFileSync(file);
  if(file==='src/App.tsx')bytes=Buffer.from(bytes.toString('utf8')
   .replace(/          \{\/\* challenge-entry:start \*\/\}[\s\S]*?          \{\/\* challenge-entry:end \*\/\}\r?\n/,'')
   .replace(/^\/\/ speech:start\r?\n[\s\S]*?^\/\/ speech:end\r?\n/gm,'')
   .replace(/^ *\{\/\* speech:start \*\/\}\r?\n[\s\S]*?^ *\{\/\* speech:end \*\/\}\r?\n/gm,'')
   .replace(/ data-speech-id=(?:"[^"]*"|\{"article-paragraph-"\+i\})/g,''));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),expected,file);
 }
});
test('four complete issues contain sixteen distinct six-step units and valid visuals',()=>{
 assert.ok(issues.length>=4);const ids=new Set(),questions=new Set();
 assert.deepEqual(issues.map(i=>i.number),issues.map((_,i)=>i+1));
 for(const issue of issues){
  assert.deepEqual(issue.units.map(u=>u.category),['數學挑戰','英文探索','閱讀推理','綜合挑戰']);
  for(const u of issue.units){
   assert.match(u.id,/^[a-z][a-z0-9-]+$/);assert.ok(!ids.has(u.id));ids.add(u.id);assert.ok(u.steps.length>=5&&u.steps.length<=8);assert.equal(u.takeaways.length,3);
   for(const [n,s]of u.steps.entries()){
    assert.equal(s.id,'s'+(n+1));assert.ok(s.title&&s.prompt&&s.explanation);
    if(s.kind!=='read'){assert.ok(!questions.has(s.prompt),'duplicate question '+s.prompt);questions.add(s.prompt);assert.equal(s.hints.length,2);assert.notEqual(s.hints[0],s.explanation);}
    if(s.options){assert.equal(new Set(s.options).size,s.options.length);if(typeof s.answer==='number')assert.ok(s.answer>=0&&s.answer<s.options.length);if(Array.isArray(s.answer))assert.ok(s.answer.every(x=>Number.isInteger(x)&&x>=0&&x<s.options.length));}
    const v=s.visual||u.visual;if(v){assert.ok(v.rows.every(r=>r.length===v.headers.length));}
    const response=emptyResponse();if(s.kind==='number')response.value=String(s.answer);else if(s.options)response.selected=Array.isArray(s.answer)?s.answer:[s.answer??0];assert.ok(hasAnswer(s,response));assert.ok(isCorrect(s,response),u.id+' '+s.id);
   }
  }
 }
 assert.ok(ids.size>=16);
 const text=JSON.stringify(issues);
 assert.doesNotMatch(text,/placeholder|lorem ipsum|ADHD|過動|注意力不足|特殊兒童|排行榜|金幣|寶石/i);
 assert.doesNotMatch(text,/[这为时个学数图书车门问听说让从会与来没样单总对关开动计们够读择该种]/);
});
test('numeric answers independently match the scenario arithmetic',()=>{
 const expected={
  'market-math':{'s2':1.5*1000,'s4':48*2*0.9,'s5':100-48*2*0.9},
  'menu-english':{'s3':85+2*30},'budget-mix':{'s3':8*(20+6)},
  'walk-math':{'s2':0.9*1000,'s3':900/60},'bus-english':{'s3':5},
  'route-mix':{'s2':600/60+4,'s3':840/60+2},
  'chart-math':{'s2':20/40*100,'s3':(10+10)/40*100},
  'experiment-mix':{'s2':(6+4)/2,'s5':Math.abs((4+5+6)/3-(5+5+5)/3)},
  'area-math':{'s2':3*2,'s3':300/50*(200/50),'s4':24+Math.ceil(24*.1)},
  'team-english':{'s3':8+4},'solutions-mix':{'s3':6*2+25}
 };
 let checked=0;
 for(const u of units)for(const s of u.steps)if(s.kind==='number'){assert.ok(Object.hasOwn(expected[u.id]||{},s.id),'missing arithmetic check');assert.ok(Math.abs(expected[u.id][s.id]-s.answer)<1e-9,u.id+s.id);checked++;}
 assert.equal(checked,19);
 assert.equal(27*35,945);assert.equal(1000-945,55);assert.equal(12*2+20,44);assert.equal(8*2+25,41);
});
test('answer rules distinguish missing, partial, unordered and numeric responses',()=>{
 assert.equal(numericValue(' ８６．４ '),86.4);for(const x of ['','abc','Infinity','1e3','8,6'])assert.equal(numericValue(x),null);
 const select=units.find(u=>u.id==='budget-mix').steps[1];assert.equal(isCorrect(select,{...emptyResponse(),selected:[3,1,0]}),true);assert.equal(isCorrect(select,{...emptyResponse(),selected:[0,1]}),false);
 const order=units.find(u=>u.id==='budget-mix').steps[5];assert.equal(isCorrect(order,{...emptyResponse(),selected:[2,0,3,1]}),true);assert.equal(isCorrect(order,{...emptyResponse(),selected:[1,3,0,2]}),false);
});
test('corrupt storage and bad routes recover without corrupting the original edition',()=>{
 for(const value of [null,[],42,'x',{version:2}])assert.deepEqual(sanitizeProgress(value,issues),emptyProgress());
 const bad={version:1,last:{week:'missing',unit:'bad'},units:{'market-math':{step:999,completed:true,responses:{s2:{value:'nonsense',selected:[-1,99],attempts:-4,hints:999,status:'passed'}}}}};
 const clean=sanitizeProgress(bad,issues);assert.equal(clean.last,null);assert.equal(clean.units['market-math'].step,5);assert.equal(clean.units['market-math'].completed,false);assert.equal(clean.units['market-math'].responses.s2.status,'idle');
 assert.equal(resolveRoute('#challenge/week-1/market-math/999',issues,clean).index,5);
 assert.equal(resolveRoute('#challenge/unknown',issues,clean).kind,'missing');
 assert.equal(resolveRoute('#challenge/week-1/missing/1',issues,clean).kind,'missing');
 assert.equal(resolveRoute('#challenge/week-1/market-math/done',issues,clean).kind,'task');
});
