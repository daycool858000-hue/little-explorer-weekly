import {useState} from 'react';
import {archiveIssues,archiveArticles,archiveRead} from './archive-library';
import {nextRandom} from './archive-model';
import {matches} from '../catalog';
import CardShelf from './CardShelf';
import '../archive.css';
let fallbackRecent:string[]=[];
export default function Archive({hash}:{hash:string}){
 const [query,setQuery]=useState(''),[searchOpen,setSearchOpen]=useState(false);
 const issueId=hash.startsWith('#archive/issue/')?hash.split('/')[2]:'';
 const entries=archiveIssues.flatMap(i=>i.articles.map(a=>({id:a.id,image:a.image,issue:i,title:a.title,category:a.category,description:a.subtitle,href:archiveRead(a.id),text:[a.title,a.subtitle,a.category,...a.pages.flatMap(p=>[p.title,...p.text])]})));
 const shown=entries.filter(e=>(!issueId||e.issue.id===issueId)&&matches(query,e.text));
 let resume:{id:string;page:number}|undefined;try{const m=JSON.parse(localStorage.getItem('explorer-magazine-v1')||'{}');if(archiveArticles.some(a=>a.id===m.lastArchive))resume={id:m.lastArchive,page:Math.max(0,Math.min(2,Number(m.archivePages?.[m.lastArchive])||0))}}catch{/* 略過無效進度 */}
 const asset=(id:string)=>(window as Window & {explorerAssets?:Record<string,string>}).explorerAssets?.[id]||'./assets/'+id+'.svg';
 function explore(){let recent:string[]=fallbackRecent;try{const v=JSON.parse(sessionStorage.getItem('planet-archive-random')||'[]');if(Array.isArray(v))recent=v.filter(x=>typeof x==='string')}catch{/* 不影響閱讀 */}const a=nextRandom(archiveArticles,recent);if(a){fallbackRecent=[...recent,a.id].slice(-Math.max(1,archiveArticles.length-1));try{sessionStorage.setItem('planet-archive-random',JSON.stringify(fallbackRecent))}catch{/* 無儲存權限仍可抽選 */}location.hash=archiveRead(a.id)}}
 return <div className="archive archive-gallery"><header><a className="archive-brand" href="#">問號星球<small>Question Planet</small></a><a href="#catalog">探索讀物</a><a href="#">回網站首頁</a></header><main>
 <p className="archive-kicker">出版與典藏</p><h1>歷期期刊圖書館</h1><p>原始四期、16 篇讀物。選一期，或隨機翻開一篇。</p>
 {resume&&<p className="archive-resume"><a href={archiveRead(resume.id,resume.page)}>接著讀：{archiveArticles.find(a=>a.id===resume.id)?.title} →</a></p>}
 <div className="archive-actions"><button onClick={explore}>隨機探索</button><a href="#library/review">知識回顧</a><button aria-expanded={searchOpen} aria-controls="archive-search" onClick={()=>setSearchOpen(!searchOpen)}>🔍 搜尋內容</button></div>
 {searchOpen&&<label className="archive-search" id="archive-search">搜尋歷期內容<input autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="輸入文章中的字詞"/><small>搜尋目前選取的期刊；可清空文字或選「全部四期」。</small></label>}
 <nav className="archive-issues" aria-label="歷期期刊目錄">{archiveIssues.map(i=><a aria-current={issueId===i.id?'page':undefined} key={i.id} href={'#archive/issue/'+i.id}><img src={asset(i.cover)} alt={'第'+i.number+'期封面插圖'} loading="lazy"/><span>第 {i.number} 期</span><strong>{i.title}</strong></a>)}</nav>
 <section className="archive-reading"><div className="shelf-heading"><h2>{issueId?'第 '+archiveIssues.find(i=>i.id===issueId)?.number+' 期讀物':'看圖選一篇'}</h2>{issueId&&<a href="#library">全部四期</a>}</div><CardShelf key={issueId+query} label="期刊讀物輪播" items={shown.map(e=><a className="archive-result" key={e.id} href={e.href}><img src={asset(e.image)} alt={e.title+'的原版插圖'} loading="lazy"/><div><span>{e.category} · 第 {e.issue.number} 期</span><h3>{e.title}</h3><small>閱讀原始版 →</small></div></a>)}/></section>
 <p className="archive-date-note">早期刊物的發行日期尚無可靠紀錄，不推測年月。新版讀物與挑戰任務請由各自入口閱讀。</p>
 </main><footer><a href="#">回網站首頁</a><a href="./THIRD-PARTY-NOTICES.txt">第三方授權</a></footer></div>;
}
