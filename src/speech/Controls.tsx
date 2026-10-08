import { useEffect } from 'react';
import type { Segment } from './engine';
import type { Translations } from './content';
import { speech, useSpeech, useSpeechPreferences, setSpeechPreferences } from './index';
import './speech.css';
export function SpeechLifecycle({route}: {route: string}) {
  const state=useSpeech();
  useEffect(()=>{speech.cancel(); return ()=>speech.cancel();},[route]);
  useEffect(()=>{const stop=()=>speech.cancel();window.addEventListener('hashchange',stop);window.addEventListener('pagehide',stop);return ()=>{window.removeEventListener('hashchange',stop);window.removeEventListener('pagehide',stop);};},[]);
  useEffect(()=>{
    const nodes=[...document.querySelectorAll<HTMLElement>('[data-speech-id]')].filter(n=>n.dataset.speechId===state.active && state.active);
    nodes.forEach(n=>n.classList.add('speech-highlight'));
    return ()=>nodes.forEach(n=>n.classList.remove('speech-highlight'));
  },[state.active,route]);
  return null;
}
export function SpokenText({text,id,translations}: {text: string;id: string;translations?: Translations}) {
  const {chinese}=useSpeechPreferences();
  const pairs=translations?.[text];
  if(!pairs)return <span data-speech-id={id}>{text}</span>;
  return <span className="speech-pairs">{pairs.map((p,i)=><span className="speech-pair" key={i}><span className="speech-en" lang="en-US" data-speech-id={id+'-'+i+'-en'}>{p.en}</span>{chinese&&<span className="speech-zh" lang="zh-TW" data-speech-id={id+'-'+i+'-zh'}>{p.zh}</span>}</span>)}</span>;
}
export function SpeakButton({label,segments,icon=false,beforePlay}: {label: string;segments: Segment[];icon?: boolean;beforePlay?: ()=>void}) {
  const {supported}=useSpeech();
  if(!supported)return null;
  return <button type="button" className={'speech-button'+(icon?' speech-icon':'')} aria-label={label} title={label} onClick={()=>{beforePlay?.();speech.play(segments);}}><span aria-hidden="true">🔊</span>{!icon&&' '+label}</button>;
}
export function SpeechControls({english=false}: {english?: boolean}) {
  const state=useSpeech(), prefs=useSpeechPreferences();
  return <div className="speech-controls">
    {state.supported ? <>
      {(state.status==='playing'||state.status==='paused')&&<button type="button" aria-label={state.status==='paused'?'繼續朗讀':'暫停朗讀'} onClick={()=>state.status==='paused'?speech.resume():speech.pause()}>{state.status==='paused'?'繼續':'暫停'}</button>}
      {state.canReplay&&<button type="button" aria-label="重新播放" onClick={()=>speech.replay()}>重新播放</button>}
      {(state.status==='playing'||state.status==='paused')&&<button type="button" aria-label="停止朗讀" onClick={()=>speech.cancel()}>停止</button>}
      <label>語速 <select aria-label="朗讀語速" value={prefs.rate} onChange={e=>setSpeechPreferences({rate:Number(e.target.value)})}><option value={0.8}>0.8×</option><option value={1}>1×</option><option value={1.2}>1.2×</option></select></label>
    </> : <span className="speech-notice">此裝置暫不支援朗讀。</span>}
    {english&&<div className="speech-language"><button type="button" aria-label="中文輔助" aria-pressed={prefs.chinese} onClick={()=>setSpeechPreferences({chinese:!prefs.chinese})}>中文輔助：{prefs.chinese?'開':'關'}</button>{state.supported&&<label>朗讀 <select aria-label="英文朗讀模式" value={prefs.mode} onChange={e=>setSpeechPreferences({mode:e.target.value as 'english'|'bilingual'})}><option value="bilingual">英文＋中文</option><option value="english">只聽英文</option></select></label>}</div>}
    {state.message&&<p role="status" className="speech-notice">{state.message}</p>}
  </div>;
}
