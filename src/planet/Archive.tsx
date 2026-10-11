import {useState} from 'react';
import {archiveIssues,archiveArticles,archiveRead} from './archive-library';
import {inPeriod,nextRandom,publicationMonth} from './archive-model';
import {challengeIssues} from '../challenge/library';
import {matches,type Publication} from '../catalog';
import '../archive.css';
let fallbackRecent:string[]=[];
export default function Archive({hash}:{hash:string}){
 const [edition,setEdition]=useState('magazine'),[query,setQuery]=useState(''),[issueId,setIssue]=useState(hash.startsWith('#archive/issue/')?hash.split('/')[2]:''),[year,setYear]=useState(''),[month,setMonth]=useState('');
 const publications:Publication[]=edition==='magazine'?archiveIssues:challengeIssues;
 const entries=edition==='magazine'?archiveIssues.flatMap(i=>i.articles.map(a=>({id:a.id,issue:i,title:a.title,category:a.category,description:a.subtitle,href:archiveRead(a.id),text:[a.title,a.subtitle,a.category,...a.pages.flatMap(p=>[p.title,...p.text])]}))):challengeIssues.flatMap(i=>i.units.map(u=>({id:u.id,issue:i,title:u.title,category:u.category,description:u.description,href:'#challenge/'+i.id+'/'+u.id+'/1',text:[u.title,u.description,u.category,...u.steps.flatMap(s=>[s.title,...(s.text||[]),s.prompt||''])]})));
 let resume:{id:string;page:number}|undefined;try{const m=JSON.parse(localStorage.getItem('explorer-magazine-v1')||'{}');if(archiveArticles.some(a=>a.id===m.lastArchive))resume={id:m.lastArchive,page:Math.max(0,Math.min(2,Number(m.archivePages?.[m.lastArchive])||0))}}catch{/* 略過無效進度 */}
 const dates=publications.map(publicationMonth).filter(Boolean),years=[...new Set(dates.map(d=>d.slice(0,4)))].sort().reverse();
 const months=[...new Set(dates.filter(d=>!year||d.startsWith(year+'-')).map(d=>d.slice(5)))].sort();
 const shownIssues=publications.filter(i=>(!issueId||i.id===issueId)&&inPeriod(i,year,month));
 const shown=entries.filter(e=>shownIssues.some(i=>i.id===e.issue.id)&&matches(query,e.text));
 const issueHref=(id:string)=>(edition==='magazine'?'#archive/issue/':'#challenge/')+id;
 function reset(){setIssue('');setQuery('');setYear('');setMonth('')}
 function explore(){let recent:string[]=fallbackRecent;try{const v=JSON.parse(sessionStorage.getItem('planet-archive-random')||'[]');if(Array.isArray(v))recent=v.filter(x=>typeof x==='string')}catch{/* 不影響閱讀 */}const a=nextRandom(archiveArticles,recent);if(a){fallbackRecent=[...recent,a.id].slice(-Math.max(1,archiveArticles.length-1));try{sessionStorage.setItem('planet-archive-random',JSON.stringify(fallbackRecent))}catch{/* 無儲存權限仍可抽選 */}location.hash=archiveRead(a.id)}}
 return <div className="archive"><header><a className="archive-brand" href="#">問號星球<small>Question Planet</small></a><a href="#catalog">探索讀物</a><a href="#">回網站首頁</a></header><main>
 <p className="archive-kicker">出版與典藏</p><h1>歷期期刊圖書館</h1><p>保留最初發行的四期、16 篇原始讀物。新版知識文章在「探索讀物」。</p>
 {resume&&<p><a href={archiveRead(resume.id,resume.page)}>接著讀原始版：{archiveArticles.find(a=>a.id===resume.id)?.title} →</a></p>}<div className="archive-actions"><button onClick={explore}>隨機探索</button><a href="#library/review">知識回顧 →</a></div>
 <div className="archive-editions">{[['magazine','原始期刊讀物'],['challenge','五六年級挑戰版']].map(([id,label])=><button key={id} aria-pressed={edition===id} onClick={()=>{setEdition(id);reset()}}>{label}</button>)}</div>
 {publications.at(-1)&&<a className="archive-latest" href={issueHref(publications.at(-1)!.id)}>最近收錄 · 第 {publications.at(-1)!.number} 期：{publications.at(-1)!.title} →</a>}
 <section className="archive-filters" aria-label="查找期刊"><label>搜尋歷期內容<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>期數<select aria-label="期數" value={issueId} onChange={e=>setIssue(e.target.value)}><option value="">全部期數</option>{publications.map(i=><option key={i.id} value={i.id}>第 {i.number} 期 · {i.title}</option>)}</select></label><label>年份<select aria-label="年份" value={year} onChange={e=>{setYear(e.target.value);setMonth('')}}><option value="">全部年份</option>{years.map(y=><option key={y} value={y}>{y} 年</option>)}{publications.some(i=>!publicationMonth(i))&&<option value="early">早期刊物</option>}</select></label><label>月份<select aria-label="月份" value={month} disabled={year==='early'||!months.length} onChange={e=>setMonth(e.target.value)}><option value="">{year==='early'||!months.length?'發行月份未確認':'全部月份'}</option>{months.map(m=><option key={m} value={m}>{Number(m)} 月</option>)}</select></label></section>
 {!dates.length&&<p className="archive-date-note">早期刊物／原始第 1–4 期：缺少可驗證的正式發行日期，暫不歸入特定年月。</p>}
 <nav className="archive-issues" aria-label="歷期期刊目錄">{shownIssues.map(i=><a key={i.id} href={issueHref(i.id)}><strong>第 {i.number} 期 · {i.title}</strong><small>{publicationMonth(i)?i.publishedAt:'早期刊物 · 發行日期待確認'}</small></a>)}</nav>
 <h2>期刊內容</h2><p role="status">{shown.length} {edition==='magazine'?'篇原始讀物':'個挑戰單元'}</p><div className="archive-results">{shown.map(e=><a className="archive-result" key={e.id} href={e.href}><span>{e.category} · 第 {e.issue.number} 期</span><h3>{e.title}</h3><p>{e.description}</p><small>{edition==='magazine'?'原始版 · 三至六年級自由閱讀':'五六年級挑戰'} →</small></a>)}</div>{!shown.length&&<section><p>沒有符合的期刊內容，試試放寬條件。</p><button onClick={reset}>清除篩選</button></section>}
 </main><footer><a href="#">回網站首頁</a><a href="./THIRD-PARTY-NOTICES.txt">第三方授權</a></footer></div>
}
