import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {normalizeSpeech,numberWords} from '../src/speech/normalize.ts';
import {plainSegments,textSegments} from '../src/speech/content.ts';
import {createSpeech,chooseVoice,gapBetween,voiceKey} from '../src/speech/engine.ts';
import {readPreferences} from '../src/speech/preferences.ts';
import {tableSegments} from '../src/speech/tables.ts';
const issues=[1,2,3,4].map(n=>JSON.parse(readFileSync('src/content/challenge/week-'+n+'.json','utf8')));
const examples=[
 ['NT$200','en-US','two hundred New Taiwan dollars'],['NT$85','en-US','eighty-five New Taiwan dollars'],
 ['1.5 L','zh-TW','一點五公升'],['200 mL','zh-TW','兩百毫升'],['1.5 L','en-US','one point five liters'],['200 mL','en-US','two hundred milliliters'],
 ['0.9 km','zh-TW','零點九公里'],['50 cm','zh-TW','五十公分'],['60 m','zh-TW','六十公尺'],['1 m','en-US','one meter'],['20%','zh-TW','百分之二十'],['10%','en-US','ten percent'],
 ['08:10','zh-TW','八點十分'],['9:40','en-US','nine forty'],['10:01','zh-TW','十點一分'],['9:05','en-US','nine oh five'],['2:00 p.m.','en-US','two p.m.'],
 ['NT$1,200','en-US','one thousand two hundred New Taiwan dollars'],['85 元','zh-TW','八十五元'],['US$5','en-US','five US dollars'],['HK$20','zh-TW','二十港幣'],
 ['60 km/h','zh-TW','每小時六十公里'],['60 km/h','en-US','sixty kilometers per hour'],['2 m²','zh-TW','兩平方公尺'],['1 m³','en-US','one cubic meter'],
 ['1/8','zh-TW','八分之一'],['2:3','zh-TW','二比三'],['-1.5','en-US','minus one point five'],['25°C','zh-TW','攝氏二十五度'],
 ['48 × 2 × 0.9 = 86.4 元。','zh-TW','四十八 乘以 二 乘以 零點九 等於 八十六點四元。'],
 ['兩瓶果汁共有 1.5 L，換成多少 mL？','zh-TW','兩瓶果汁共有 一點五公升,換成多少 毫升?'],
 ['Mia has NT$200.','en-US','Mia has two hundred New Taiwan dollars.']
];
test('actual utterances contain the expected money, units, clocks and arithmetic words',()=>{
 const actual=[];const synth={getVoices:()=>[],cancel(){},resume(){},addEventListener(){},removeEventListener(){},speak:u=>actual.push(u)};
 const engine=createSpeech({synth,make:text=>({text})});
 try{for(const [text,lang,expected]of examples){engine.play([{text,lang}]);assert.equal(actual.at(-1).text,expected,text);assert.equal(actual.at(-1).lang,lang);assert.equal(actual.at(-1).rate,1.2);}}finally{engine.dispose();}
});
test('contextual language keeps Chinese units together and never drops numeric-only English',()=>{
 const text='兩瓶果汁共有 1.5 L，換成多少 mL？';assert.deepEqual(plainSegments(text,'x'),[{text,lang:'zh-TW',id:'x'}]);
 assert.equal(textSegments('200','n',undefined,'english')[0].lang,'en-US');assert.equal(normalizeSpeech('1.5 L','en-US'),'one point five liters');
 for(const value of ['1.5 L','200 mL','A','NT$200']){assert.equal(plainSegments(value,'x')[0].lang,'zh-TW');assert.equal(textSegments(value,'x',undefined,'english')[0].lang,'en-US');}
 assert.equal(numberWords('10001','zh-TW'),'一萬零一');assert.equal(numberWords('1000001','en-US'),'one million one');assert.equal(numberWords('0.05','zh-TW'),'零點零五');
});
test('new rates default to 1.2; saved rates and display/language choices are retained',()=>{
 assert.equal(readPreferences(null).rate,1.2);for(const rate of [.9,1.2,1.5,1.8,.8,1])assert.equal(readPreferences({rate}).rate,rate);
 assert.equal(readPreferences({rate:100}).rate,1.2);assert.deepEqual(readPreferences({rate:1.8,chinese:false,mode:'english',zhVoice:'zh-TW|A',enVoice:'en-US|B'}),{rate:1.8,chinese:false,mode:'english',zhVoice:'zh-TW|A',enVoice:'en-US|B'});
});
test('language-aware gaps avoid blanket pauses and remain deliberate at translations',()=>{
 const en={text:'a',lang:'en-US',id:'one'},zh={text:'甲',lang:'zh-TW',id:'two'};
 assert.equal(gapBetween(en,{...en}),0);assert.equal(gapBetween(en,{...en,id:'next'}),100);assert.equal(gapBetween(en,zh),400);assert.equal(gapBetween(zh,en),240);
});
test('voice choice does not equate local service with naturalness and respects explicit choice',()=>{
 const local={name:'Basic',lang:'zh-TW',localService:true,voiceURI:'basic'},natural={name:'Natural Voice',lang:'zh-TW',localService:false,voiceURI:'natural'},wrong={name:'Neural English',lang:'en-US',localService:false,voiceURI:'english'};
 assert.equal(chooseVoice([local,natural,wrong],'zh-TW'),natural);assert.equal(chooseVoice([local,natural],'zh-TW',voiceKey(local)),local);assert.equal(chooseVoice([local,natural,wrong],'zh-TW',voiceKey(wrong)),natural);assert.equal(chooseVoice([wrong],'zh-TW'),undefined);
});
test('all eight learning files remain byte-for-byte unchanged',()=>{
 const files=JSON.parse(readFileSync('tests/fixtures/before-natural-speech.json','utf8'));assert.equal(Object.keys(files).length,8);
 for(const [file,hash]of Object.entries(files))assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
});
test('table narratives keep every numeric fact and note across all seventeen displayed tables',()=>{
 let tables=0;
 for(const issue of issues)for(const unit of issue.units)for(const visual of [unit.visual,...unit.steps.map(s=>s.visual)].filter(Boolean)){
  tables++;const segments=tableSegments(unit,visual,'bilingual');const spoken=segments.map(s=>normalizeSpeech(s.text,s.lang)).join(' ');
  assert.ok(segments.length>1,unit.id);assert.ok(!segments.some(s=>s.id?.startsWith('visual-header-')),'no isolated headers');
  if(visual.note)assert.ok(segments.some(s=>s.id?.startsWith('visual-note')),'note retained');
  const language=unit.category==='英文探索'?'en-US':'zh-TW';
  const clean=s=>s.replace(/[\s，,。.!?;；:：「」“”'’]/g,'').toLowerCase();
  const narrative=clean(segments.filter(s=>s.lang===language).map(s=>normalizeSpeech(s.text,s.lang)).join(' '));
  for(const row of visual.rows)for(const cell of row.slice(1))assert.ok(narrative.includes(clean(normalizeSpeech(cell,language))),unit.id+' missing cell meaning: '+cell);
  for(const row of visual.rows)for(const cell of row){
   const values=cell.match(/NT\$\d+(?:\.\d+)?|\d{1,2}:\d{2}(?:\s*[ap]\.m\.)?|\d+(?:\.\d+)?\s*(?:mL|km|cm|m|L|%|元)|\d+(?:\.\d+)?/g)||[];
   for(const value of values){const lang=unit.category==='英文探索'?'en-US':'zh-TW';assert.ok(spoken.includes(normalizeSpeech(value,lang)),unit.id+' missing '+value+' in '+spoken);}
  }
 }
 assert.equal(tables,17);
});
test('representative semantic narratives say prices, schedules, survey and comparison correctly',()=>{
 const get=id=>issues.flatMap(i=>i.units).find(u=>u.id===id);const spoken=id=>{const u=get(id);return tableSegments(u,u.visual,'bilingual').map(s=>normalizeSpeech(s.text,s.lang));};
 assert.ok(spoken('menu-english').includes('A sandwich costs eighty-five New Taiwan dollars.'));
 assert.ok(spoken('menu-english').includes('三明治的價格是新臺幣八十五元。'));
 assert.ok(spoken('chart-math').includes('步行的人有二十人。'));assert.ok(spoken('chart-math').includes('騎自行車的人有十人。'));assert.ok(spoken('chart-math').includes('搭公車的人有十人。'));
 assert.ok(spoken('bus-english').includes("Bus A leaves school at nine o'clock and arrives at the stop at nine twenty."));
 const experiment=spoken('experiment-mix').join(' ');assert.match(experiment,/小青.*一公尺/);assert.match(experiment,/小柏.*兩公尺/);
 const plans=spoken('plans-reading').map(s=>s.replace(/\s/g,''));assert.ok(plans.some(s=>s.includes('安靜閱讀')&&s.includes('十分鐘')&&s.includes('零元')&&s.includes('小柔')));assert.ok(plans.some(s=>s.includes('同伴分享')&&s.includes('十五分鐘')&&s.includes('三十元')&&s.includes('阿凱')));
 for(const issue of issues){const u=issue.units[1];const only=tableSegments(u,u.visual,'english');assert.ok(only.length);assert.ok(only.every(s=>s.lang==='en-US'));}
});
