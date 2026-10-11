import test from 'node:test';import assert from 'node:assert/strict';import {createSpeech} from '../src/speech/engine.ts';
test('known missing language stops instead of allowing wrong-language default voice',()=>{
 for(const [available,requested,label] of [['en-US','zh-TW','中文'],['zh-TW','en-US','英文']]){
  const calls=[];const engine=createSpeech({synth:{getVoices:()=>[{lang:available,name:'Only available voice'}],cancel(){},speak(u){calls.push(u)},addEventListener(){},removeEventListener(){}},make:text=>({text})});
  engine.play([{text:'200 mL',lang:requested}]);assert.equal(calls.length,0);assert.equal(engine.getSnapshot().status,'error');assert.ok(engine.getSnapshot().message.includes(label));assert.equal(engine.getSnapshot().canReplay,true);engine.dispose();
 }
});
