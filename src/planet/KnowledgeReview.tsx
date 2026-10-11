import {useState} from 'react';
import questions from './knowledge-review.json';
import {archiveArticles} from './archive-library';
import {nextRandom} from './archive-model';
import {SpeakButton,SpeechControls,SpeechLifecycle} from '../speech/Controls';
import {plainSegments} from '../speech/content';
const pool=questions.filter(q=>q.status==='published'&&archiveArticles.some(a=>a.id===q.articleId));
export default function KnowledgeReview(){
 const [recent,setRecent]=useState<string[]>([]),[current,setCurrent]=useState<typeof pool[number]>(),[answer,setAnswer]=useState<number|null>(null);
 function next(){const q=nextRandom(pool,recent);if(!q)return;setRecent(old=>[...old.filter(id=>id!==q.id),q.id].slice(-(pool.length-1)));setCurrent(q);setAnswer(null)}
 return <div className="archive recall-page"><SpeechLifecycle route={'review/'+(current?.id||'start')}/><header><a href="#">問號星球</a><a href="#library">回歷期期刊</a></header><main>
 <p className="archive-kicker">換一個情境，再想一次</p><h1>知識回顧</h1><p>沒有計時與分數。可以重試，也可以隨時回原文找線索。</p>
 {!current?<section className="recall-card"><h2>從 8 篇原始期刊，找回知識的線索</h2><p>24 道預先查核的題目，每次一題。</p><button onClick={next}>開始知識回顧</button></section>:<section className="recall-card" aria-label="回顧題目"><small>{current.concept} · {archiveArticles.find(a=>a.id===current.articleId)?.title}</small><h2 data-speech-id="recall-prompt">{current.prompt}</h2><SpeakButton label="聽題目" segments={plainSegments(current.prompt,'recall-prompt')}/><div className="recall-options">{current.options.map((option,i)=><button key={option} aria-pressed={answer===i} onClick={()=>setAnswer(i)}>{option}</button>)}</div>
 {answer!==null&&<div role="status" className="recall-feedback"><strong>{answer===current.answer?'找到關鍵了。':'再想一步，也可以回原文看看。'}</strong><p>{current.explanation}</p>{answer!==current.answer&&<button onClick={()=>setAnswer(null)}>再試一次</button>}</div>}
 <div className="recall-actions"><a href={current.articleHref}>回原文章找線索 →</a><button onClick={next}>換下一題</button></div><SpeechControls/>
 </section>}
 </main></div>
}
