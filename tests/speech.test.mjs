import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createSpeech,chooseVoice} from '../src/speech/engine.ts';
import {textSegments} from '../src/speech/content.ts';
import {dataSegments} from '../src/speech/challenge.ts';
const before=JSON.parse(readFileSync('tests/fixtures/challenge-before-speech.json','utf8'));
const issues=readdirSync('src/content/challenge').filter(n=>/^week-\d+\.json$/.test(n)).sort().map(n=>JSON.parse(readFileSync('src/content/challenge/'+n,'utf8')));
const clone=x=>JSON.parse(JSON.stringify(x));
test('all original challenge fields are unchanged; only translation data is added',()=>{
 const stripped=clone(issues.filter(i=>before.some(b=>b.id===i.id)).sort((a,b)=>a.number-b.number));stripped.forEach(i=>i.units.forEach(u=>delete u.translations));assert.deepEqual(stripped,before);
});
test('four English units have complete sentence-aligned translations without answer fields',()=>{
 let count=0;
 for(const issue of issues){const u=issue.units[1],tr=u.translations;assert.ok(tr);
  const v=u.visual;const fields=[u.title,v.title,...v.headers,...v.rows.flat(),v.note,...u.steps.flatMap(s=>[s.title,s.text,s.prompt,...s.options||[]])].filter(Boolean);
  for(const value of fields){if(/[A-Za-z]/.test(value)){assert.ok(tr[value],'missing translation: '+value);}}
  for(const [source,pairs]of Object.entries(tr)){
   assert.ok(pairs.length);for(const p of pairs){assert.deepEqual(Object.keys(p),['en','zh']);assert.ok(p.en&&p.zh);assert.match(p.zh,/[\u3400-\u9fff]/);assert.doesNotMatch(p.zh,/[这为时个学数图书车门问听说让从会与来没样单总对关开动计们够读择该种]|答案在|看第二段|注意某個時間/);count++;}
   if(!/[\u3400-\u9fff]/.test(source))assert.equal(pairs.map(p=>p.en).join(' ').replace(/\s+/g,' ').trim(),source.replace(/\s+/g,' ').trim(),'English original: '+source);
   const segments=textSegments(source,'x',tr);assert.equal(segments.length,pairs.length*2);segments.forEach((s,i)=>assert.equal(s.lang,i%2?'zh-TW':'en-US'));
   assert.ok(textSegments(source,'x',tr,'english').every(s=>s.lang==='en-US'));
  }
  for(let n=0;n<u.steps.length;n++){
   const s=u.steps[n];const question=textSegments(s.prompt,'q',tr);assert.deepEqual(question.map(x=>x.text),tr[s.prompt]?.flatMap(p=>[p.en,p.zh])||[s.prompt]);assert.ok(question.every(x=>x.id.startsWith('q')));
   const data=dataSegments(u,n,'bilingual');assert.ok(data.length);assert.ok(!data.some(x=>x.text===s.explanation));
   for(const option of s.options||[]){const segments=textSegments(option,'option',tr);assert.deepEqual(segments.map(s=>s.text),tr[option]?.flatMap(p=>[p.en,p.zh])||[option]);}
  }
 }
 assert.ok(count>=146);
});
function fake(t){
 t.mock.timers.enable({apis:['setTimeout']});const calls=[],events={};let voices=[];
 const synth={getVoices:()=>voices,addEventListener:(n,f)=>events[n]=f,removeEventListener:n=>delete events[n],cancel:()=>calls.push('cancel'),speak:u=>{calls.push(u);u.onstart?.();},pause:()=>calls.push('pause'),resume:()=>calls.push('resume')};
 const engine=createSpeech({synth,make:text=>({text})});t.after(()=>engine.dispose());
 return {engine,calls,events,setVoices:v=>voices=v,spoken:()=>calls.filter(c=>typeof c==='object')};
}
test('voices load late; language selection never borrows the opposite-language voice',t=>{
 const f=fake(t);const zh={lang:'zh-TW',localService:true,name:'Taiwan'},en={lang:'en-US',localService:true,name:'English'},cn={lang:'zh-CN',name:'Chinese'};
 f.setVoices([cn,en,zh]);f.events.voiceschanged();
 f.engine.play([{text:'Hello.',lang:'en-US',id:'en'},{text:'你好。',lang:'zh-TW',id:'zh'}]);
 assert.equal(f.spoken()[0].voice,en);assert.equal(f.engine.getSnapshot().active,'en');f.spoken()[0].onend();t.mock.timers.tick(399);assert.equal(f.spoken().length,1);t.mock.timers.tick(1);assert.equal(f.spoken()[1].voice,zh);assert.equal(f.engine.getSnapshot().active,'zh');
 assert.equal(chooseVoice([zh],'en-US'),undefined);assert.equal(chooseVoice([{lang:'en-GB',name:'UK'}],'en-US').name,'UK');
});
test('pause, resume, replay, speed and cancellation discard stale callbacks',t=>{
 const f=fake(t);assert.equal(f.spoken().length,0);
 f.engine.play([{text:'one',lang:'en-US'},{text:'two',lang:'en-US'}]);const first=f.spoken()[0];
 f.engine.pause();assert.equal(f.engine.getSnapshot().status,'paused');f.engine.resume();first.onresume();assert.ok(f.calls.includes('pause'));assert.equal(f.engine.getSnapshot().status,'playing');
 f.engine.setRate(.8);first.onend();t.mock.timers.tick(1000);assert.equal(f.spoken().length,1);f.engine.replay();assert.equal(f.spoken()[1].rate,.8);
 const stale=f.spoken()[1];f.engine.cancel();stale.onend();t.mock.timers.tick(1000);assert.equal(f.spoken().length,2);assert.equal(f.engine.getSnapshot().canReplay,false);
});
test('pause between sentences and engines that end on pause can resume safely',t=>{
 const f=fake(t);const input=[{text:'first',lang:'en-US'},{text:'second',lang:'zh-TW'}];
 f.engine.play(input);f.spoken()[0].onend();f.engine.pause();t.mock.timers.tick(1000);assert.equal(f.spoken().length,1);f.engine.resume();assert.equal(f.spoken()[1].text,'second');
 f.engine.pause();f.spoken()[1].onend();f.engine.resume();assert.equal(f.spoken()[2].text,'second');
});
test('missing API, throwing API, error event and no-start timeout fall back without throwing',t=>{
 const absent=createSpeech(null);assert.doesNotThrow(()=>absent.play([{text:'hi',lang:'en-US'}]));assert.equal(absent.getSnapshot().status,'error');absent.dispose();
 const f=fake(t);f.engine.play([{text:'hi',lang:'en-US'}]);f.spoken()[0].onerror({error:'voice-unavailable'});assert.equal(f.engine.getSnapshot().status,'error');
 const bad=createSpeech({synth:{getVoices(){throw Error();},cancel(){throw Error();},speak(){throw Error();}},make:text=>({text})});assert.doesNotThrow(()=>bad.play([{text:'hi',lang:'en-US'}]));assert.equal(bad.getSnapshot().status,'error');bad.dispose();
 const stuck=createSpeech({synth:{getVoices:()=>[],cancel(){},speak(){}},make:text=>({text})});stuck.play([{text:'hi',lang:'en-US'}]);t.mock.timers.tick(8000);assert.equal(stuck.getSnapshot().status,'error');stuck.dispose();
});

