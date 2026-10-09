import { adjacent } from '../catalog';
import { useEffect, useRef, useState } from 'react';
import { challengeIssues } from './library';
import { emptyProgress, emptyResponse, hasAnswer, isCorrect, passed, resolveRoute, sanitizeProgress, STORAGE_KEY } from './model';
import type { Progress, Response, Visual } from './types';
import { SpeakButton, SpeechControls, SpokenText } from '../speech/Controls';
import { useSpeechPreferences } from '../speech';
import { textSegments, type Translations } from '../speech/content';
import { dataSegments } from '../speech/challenge';

function readProgress(): { progress: Progress; error: boolean } {
  try { return {progress: sanitizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'), challengeIssues), error: false}; }
  catch { return {progress: emptyProgress(), error: true}; }
}
function Information({ visual, translations }: { visual: Visual; translations?: Translations }) {
  const show=(text: string,id: string)=><SpokenText text={text} id={id} translations={translations}/>;
  return <figure className="c-information">
    <figcaption>{show(visual.title,'visual-title')}</figcaption>
    {visual.headers.length > 3 ? <div className="c-data-cards">{visual.rows.map((row,i) => <dl key={i}>{row.map((cell,j) => <div key={j}><dt>{show(visual.headers[j],'visual-header-'+j)}</dt><dd>{show(cell,'visual-row-'+i+'-'+j)}</dd></div>)}</dl>)}</div> :
      <table><thead><tr>{visual.headers.map((h,j) => <th scope="col" key={h}>{show(h,'visual-header-'+j)}</th>)}</tr></thead><tbody>{visual.rows.map((row,i) => <tr key={i}>{row.map((cell,j) => j === 0 ? <th scope="row" key={j}>{show(cell,'visual-row-'+i+'-'+j)}</th> : <td key={j}>{show(cell,'visual-row-'+i+'-'+j)}{visual.bars && j === 1 && <meter min={0} max={40} value={Number(cell)} aria-label={row[0] + ' ' + cell + ' 人，共 40 人'} />}</td>)}</tr>)}</tbody></table>}
    {visual.note && <p className="c-data-note">{show(visual.note,'visual-note')}</p>}
  </figure>;
}
const url = (week: string, unit?: string, step?: number | 'done') => '#challenge/' + week + (unit ? '/' + unit : '') + (step !== undefined ? '/' + (typeof step === 'number' ? step + 1 : step) : '');

export default function Challenge({hash}: {hash: string}) {
  const [loaded] = useState(readProgress);
  const audioPrefs = useSpeechPreferences();
  const [progress, setProgress] = useState(loaded.progress);
  const [storageError, setStorageError] = useState(loaded.error);
  const route = resolveRoute(hash, challengeIssues, progress);
  const title = useRef<HTMLHeadingElement>(null);
  const activeWeek = route.kind === 'task' ? route.issue.id : '';
  const activeUnit = route.kind === 'task' ? route.unit.id : '';
  const activeIndex = route.kind === 'task' ? route.index : -1;
  useEffect(() => {
    if (activeIndex < 0) return;
    setProgress(prev => {
      if (prev.last?.week === activeWeek && prev.last.unit === activeUnit && prev.units[activeUnit]?.step === activeIndex) return prev;
      const unit = prev.units[activeUnit] || {step: 0, completed: false, responses: {}};
      return {...prev, last: {week: activeWeek, unit: activeUnit}, units: {...prev.units, [activeUnit]: {...unit, step: activeIndex}}};
    });
  }, [activeWeek, activeUnit, activeIndex]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch { setStorageError(true); }
  }, [progress]);
  useEffect(() => { title.current?.focus({preventScroll: true}); window.scrollTo({top: 0, behavior: 'instant'}); }, [hash]);
  function updateResponse(response: Response) {
    if (route.kind !== 'task') return;
    const {unit, issue, index} = route;
    setProgress(prev => ({...prev, last: {week: issue.id, unit: unit.id}, units: {...prev.units, [unit.id]: {step: index, completed: prev.units[unit.id]?.completed || false, responses: {...prev.units[unit.id]?.responses, [unit.steps[index].id]: response}}}}));
  }
  const lastIssue = challengeIssues.find(i => i.id === progress.last?.week);
  const lastUnit = lastIssue?.units.find(u => u.id === progress.last?.unit);
  const resume = lastIssue && lastUnit ? url(lastIssue.id, lastUnit.id, progress.units[lastUnit.id]?.completed ? 'done' : progress.units[lastUnit.id]?.step || 0) : null;

  function task() {
    if (route.kind !== 'task') return null;
    const {issue, unit, index} = route;
    const step = unit.steps[index], state = progress.units[unit.id]?.responses[step.id] || emptyResponse();
    const ready = passed(state), locked = ready || state.attempts >= 2;
    const visual = step.visual || unit.visual;
    const english = unit.category === '英文探索';
    const mode = english ? audioPrefs.mode : 'bilingual';
    const say = (text: string,id: string) => textSegments(text,id,unit.translations,mode);
    const show = (text: string,id: string) => <SpokenText text={text} id={id} translations={unit.translations}/>;
    function pick(n: number) {
      if (locked) return;
      const selected = step.kind === 'select' ? (state.selected.includes(n) ? state.selected.filter(i => i !== n) : [...state.selected,n]) : step.kind === 'order' ? (state.selected.includes(n) ? state.selected : [...state.selected,n]) : [n];
      updateResponse({...state, selected, status: 'idle'});
    }
    function next() {
      if (index < unit.steps.length - 1) { location.hash = url(issue.id, unit.id, index + 1); return; }
      const responses = progress.units[unit.id]?.responses || {};
      const missing = unit.steps.findIndex(s => !passed(responses[s.id]));
      if (missing >= 0) { location.hash = url(issue.id, unit.id, missing); return; }
      setProgress(prev => ({...prev, units: {...prev.units, [unit.id]: {...prev.units[unit.id], completed: true}}}));
      location.hash = url(issue.id, unit.id, 'done');
    }
    function act() {
      if (ready) { next(); return; }
      if (state.attempts >= 2) { updateResponse({...state, status: 'revealed'}); return; }
      if (!hasAnswer(step,state)) return;
      if (isCorrect(step,state)) updateResponse({...state, status: 'passed'});
      else updateResponse({...state, attempts: Math.min(2,state.attempts+1), status: 'retry', hints: Math.max(1,state.hints)});
    }
    const reply = (step.kind === 'reflect' || step.kind === 'estimate') && state.selected.length ? step.replies?.[state.selected[0]] || step.explanation : step.explanation;
    return <main className="c-task" id="challenge-main">
      <div className="c-task-meta"><a href={url(issue.id)}>← 第 {issue.number} 期目錄</a><span>{unit.category}</span></div>
      <div className="c-progress"><span>第 {index + 1} / {unit.steps.length} 步</span><progress value={index + 1} max={unit.steps.length} aria-label={'第 '+(index+1)+' 步，共 '+unit.steps.length+' 步'} /></div>
      <p className="c-unit-title">{show(unit.title,'unit-title')}</p>
      <h1 ref={title} tabIndex={-1} data-original={step.title}>{show(step.title,'step-title')}</h1>
      <div className="speech-panel" aria-label="任務朗讀輔助"><div className="speech-buttons">
        <SpeakButton label={visual || index > 0 ? '聽資料' : '聽這一段'} segments={dataSegments(unit,index,mode)} beforePlay={()=>{const context=document.querySelector<HTMLDetailsElement>('.c-context');if(context)context.open=true;}} />
        <SpeakButton label="聽題目" segments={say(step.prompt,'step-prompt')} />
      </div><SpeechControls english={english}/></div>
      {step.text && <p className="c-lead">{show(step.text,'step-text')}</p>}
      {index > 0 && <details className="c-context" key={unit.id + step.id}><summary>📋 看資料・回看情境</summary><p>{show(unit.steps[0].text,'context-text')}</p></details>}
      {visual && <Information visual={visual} translations={unit.translations} />}
      <section className="c-question" aria-labelledby="c-question-title">
        <h2 id="c-question-title">{show(step.prompt,'step-prompt')}</h2>
        {step.kind === 'number' && <div className="c-number"><label htmlFor="c-answer">填入數字{step.unit ? '（'+step.unit+'）' : ''}</label><input key={step.id} id="c-answer" inputMode="decimal" autoComplete="off" maxLength={32} disabled={locked} value={state.value} onChange={e => updateResponse({...state, value: e.target.value, status: 'idle'})} /><span>小數請用小數點，例如 12.5。</span></div>}
        {step.options && <fieldset className="c-options"><legend className="c-sr-only">{step.prompt}</legend>{step.options.map((option,i) => <div className="c-option-row" key={i}>{step.kind === 'order' ? <button type="button" className={'c-order '+(state.selected.includes(i) ? 'is-selected' : '')} disabled={locked || state.selected.includes(i)} onClick={() => pick(i)}><span aria-hidden="true">{state.selected.includes(i) ? state.selected.indexOf(i)+1 : '・'}</span>{show(option,'option-'+i)}</button> : <label className={state.selected.includes(i) ? 'is-selected' : ''}><input type={step.kind === 'select' ? 'checkbox' : 'radio'} name={unit.id + step.id} disabled={locked} checked={state.selected.includes(i)} onChange={() => pick(i)} /><span>{show(option,'option-'+i)}</span></label>}<SpeakButton icon label={'朗讀選項 '+(i+1)} segments={say(option,'option-'+i)}/></div>)}</fieldset>}
        {step.kind === 'order' && !locked && <button className="c-text-button" onClick={() => updateResponse({...state, selected: [], status: 'idle'})}>清空順序，重新排</button>}
      </section>
      {step.hints.length > 0 && !ready && <div className="c-hints">
        {state.hints < step.hints.length && <button className="c-text-button" onClick={() => updateResponse({...state, hints: state.hints+1})}>{state.hints ? '再給我一個提示' : '給我一個提示'}</button>}
        <div aria-live="polite">{step.hints.slice(0,state.hints).map((hint,i) => <p key={i}><strong>線索 {i+1}</strong> {hint}</p>)}</div>
      </div>}
      {state.status === 'retry' && <p className="c-feedback" role="status">{state.attempts < 2 ? '再看看這個線索。可以改一個想法，再試一次。' : '我們一起拆開看看。你可以查看解法，再繼續往下。'}</p>}
      {ready && <div className="c-feedback" role="status"><strong>{state.status === 'revealed' ? '原來關鍵在這裡' : step.kind === 'reflect' ? '這個方向有它的理由' : step.kind === 'read' ? '準備好了' : '找到了'}</strong><p>{reply}</p></div>}
      <div className="c-step-actions"><button className="c-primary" onClick={act} disabled={!ready && state.attempts < 2 && !hasAnswer(step,state)}>{ready ? (index === unit.steps.length-1 ? '完成這個單元' : '下一步 →') : state.attempts >= 2 ? '看看解法' : step.kind === 'read' ? '我準備好了' : state.attempts ? '再試一次' : step.kind === 'reflect' ? '看看這個想法' : '確認我的想法'}</button>
        {index > 0 ? <a className="c-previous" href={url(issue.id,unit.id,index-1)}>← 上一步</a> : <span className="c-save-note">一次一步，隨時可以休息。</span>}
      </div>
      <p className="c-save-note">{storageError ? '目前無法儲存，仍可繼續做任務。' : '進度自動保存在這個瀏覽器。'}</p>
    </main>;
  }

  return <div className="challenge">
    <a className="c-skip" href="#challenge-main" onClick={e => {e.preventDefault();title.current?.focus();}}>跳到任務內容</a>
    <header className="c-header"><a className="c-brand" href="#challenge">Explorer Challenge<span>五六年級挑戰版</span></a><nav aria-label="挑戰版導覽"><a href="#challenge">挑戰版首頁</a><a href="#library">歷期圖書館</a><a href="#">網站首頁</a></nav></header>
    {storageError && <p className="c-storage" role="status">瀏覽器無法儲存進度；你仍然可以正常閱讀與作答。</p>}
    {route.kind === 'task' ? task() : route.kind === 'complete' ? <main className="c-complete" id="challenge-main"><p className="c-eyebrow">第 {route.issue.number} 期 · {route.unit.category}</p><h1 ref={title} tabIndex={-1}>把發現帶走</h1><p className="c-lead">你已走完「{route.unit.title}」的 {route.unit.steps.length} 個步驟。</p><h2>這一篇你用到了</h2><ul className="c-skills">{route.unit.skills.map(s=><li key={s}>{s}</li>)}</ul><h2>今天帶走三件事</h2><ol className="c-takeaways">{route.unit.takeaways.map(s=><li key={s}>{s}</li>)}</ol><a className="c-primary" href={url(route.issue.id)}>回本期目錄 →</a><a className="c-previous" href={url(route.issue.id,route.unit.id,0)}>再看看這個單元</a></main> : route.kind === 'issue' ? <main className="c-catalog" id="challenge-main"><p className="c-eyebrow">第 {route.issue.number} 期 · 四個短任務</p><h1 ref={title} tabIndex={-1}>{route.issue.title}</h1><p className="c-lead">{route.issue.description}</p><p className="c-note">挑一個開始。每個單元約 4～6 分鐘，也可以分幾次做。</p><div className="c-unit-grid">{route.issue.units.map((unit,i) => <a className="c-unit-card" key={unit.id} href={url(route.issue.id,unit.id,progress.units[unit.id]?.completed ? 'done' : progress.units[unit.id]?.step || 0)}><span className="c-card-top"><span>{unit.category}</span><span aria-hidden="true">0{i+1}</span></span><h2>{unit.title}</h2><p>{unit.description}</p><span className="c-card-bottom">{progress.units[unit.id]?.completed ? '已完成 · 回看摘要' : progress.units[unit.id] ? '接著第 '+(progress.units[unit.id].step+1)+' / '+unit.steps.length+' 步' : unit.steps.length+' 個步驟 · 開始探索'} <span aria-hidden="true">→</span></span></a>)}</div><nav className="c-issue-nav" aria-label="挑戰版期刊">{challengeIssues.filter(i=>{const n=adjacent(challengeIssues,route.issue.id);return i.id===n.previous?.id||i.id===n.next?.id;}).map(i=><a key={i.id} href={url(i.id)}>{i.number<route.issue.number?'← 上一期':'下一期 →'} · {i.title}</a>)}</nav></main> : route.kind === 'missing' ? <main className="c-complete" id="challenge-main"><h1 ref={title} tabIndex={-1}>這個任務找不到了</h1><p className="c-lead">回到挑戰版首頁，選一個目前開放的任務。</p><a className="c-primary" href="#challenge">回挑戰版首頁</a></main> : <main className="c-catalog" id="challenge-main"><section className="c-intro"><p className="c-eyebrow">給五、六年級的探索任務</p><h1 ref={title} tabIndex={-1}>動動腦，<br />把學到的東西拿來用。</h1><p className="c-lead">看一個情境，找一個線索。<br />不用一次做完，下一小步就在眼前。</p>{resume ? <a className="c-primary" href={resume}>繼續上次的任務 →<small>{lastUnit?.title}</small></a> : <a className="c-primary" href={url(challengeIssues[0].id)}>從第 1 期開始 →</a>}<p className="c-note">每步約 20～60 秒 · 不計時 · 不計分</p></section><section className="c-issues" aria-labelledby="c-issues-title"><div className="c-section-heading"><h2 id="c-issues-title">四種探索，換一個角度想</h2><p>每期都有數學、英文、閱讀與綜合挑戰。</p></div><div className="c-issue-grid">{challengeIssues.map((issue,i)=><a className={'c-issue-card c-cover-'+i%4} href={url(issue.id)} key={issue.id}><span className="c-cover-number" aria-hidden="true">{String(issue.number).padStart(2,'0')}</span><div><span className="c-eyebrow">第 {issue.number} 期 · {issue.units.length} 個單元</span><h3>{issue.title}</h3><p>{issue.description}</p><span className="c-card-bottom">打開本期任務 →</span></div></a>)}</div></section></main>}
    <footer className="c-footer">小小探索家週刊 · 挑戰版<br />練習情境中的價格、時間表與資料為教學設計。無需帳號，紀錄只留在此瀏覽器。</footer>
  </div>;
}
