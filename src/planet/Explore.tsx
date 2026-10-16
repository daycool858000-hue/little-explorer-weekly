import {KnowledgeVisual,visualFor} from './KnowledgeVisual';
import {challengeIssues} from '../challenge/library';
import {archiveArticles} from './archive-library';
import recall from './knowledge-review.json';
import {useEffect,useRef} from 'react';
import DiscoveryCarousel from './DiscoveryCarousel';
import CardShelf from './CardShelf';
import {articles,issues,topics,middleDraftCount} from './library';
import {juniors,advanced,stories,newReadings,privateReview} from './reading-data';
import levels from './reading-levels.json';
import {Art} from './Art';
import {lifeDirections,lifeTags} from './life-topics';
export type Entry={id:string;title:string;summary:string;grade:string;theme:string;href:string;image?:string;imageAlt?:string;art?:string};
export const readingEntries:Entry[]=[...articles.map(a=>({id:a.id,title:a.title,summary:a.subtitle,grade:'3-4',theme:a.primaryTopic,href:'#read/'+a.id+'/0',art:a.image?a.id:undefined})),...newReadings.map(a=>({id:a.id,title:a.title,summary:a.summary||a.paragraphs[0],grade:a.href.startsWith('#stories/')?'story':a.href.startsWith('#junior/')?'1-2':'5-6',theme:a.theme,href:a.href,image:a.image,imageAlt:a.imageAlt}))];
const gradeName=(grade:string)=>grade==='story'?'故事館':grade.replace('-','～')+'年級';
export const gradeLevels=levels.map(l=>{const count=l.id==='1-2'?juniors.length:l.id==='3-4'?articles.length:advanced.length;return {...l,count,status:count?'available':'planned',description:count?`${count} 篇${l.id==='1-2'?'注音讀物':l.id==='3-4'?'知識讀物':'完整進階文章'}${l.id==='3-4'&&middleDraftCount?`（含 ${middleDraftCount} 篇本輪待審閱）`:''}`:'完整文章內容準備中；挑戰版另有獨立入口。'}});
export function EntryCard({entry:e}:{entry:Entry}){return <a className="story-card explore-card" href={e.href} data-reading-id={e.id}>{visualFor(e.id)?<KnowledgeVisual id={e.id}/>:e.art?<div className="story-art"><Art id={e.art}/></div>:e.image?<div className="story-art"><img src={e.image} alt={e.imageAlt} loading="lazy"/></div>:null}<div className="story-copy"><small>{gradeName(e.grade)} · {e.theme}</small><h3>{e.title}</h3><p>{e.summary}</p><b>開始閱讀 →</b></div></a>}
export function LifeArea({hash}:{hash:string}){
 const direction=new URLSearchParams(hash.split('?')[1]||'').get('topic')||'';
 const results=useRef<HTMLHeadingElement>(null),previous=useRef(hash);
 const all=readingEntries.filter(e=>e.theme==='心理與生活'),visible=all.filter(e=>!direction||lifeTags[e.id]?.primary===direction);
 useEffect(()=>{if(previous.current===hash)return;previous.current=hash;const frame=requestAnimationFrame(()=>{const el=results.current;if(!el)return;el.focus({preventScroll:true});const y=el.getBoundingClientRect().top;if(y<20||y>innerHeight-240)el.scrollIntoView({block:'start',behavior:'instant'})});return()=>cancelAnimationFrame(frame)},[hash]);
 const choose=(id:string)=>{location.hash='#life'+(id?'?topic='+id:'')};
 return <section className="life-area phase6-life life-gallery"><header className="life-heading"><div><small>LIFE / FEELINGS / CHOICES</small><h1>心理與生活</h1><p>從一張圖片，挑一個想讀的故事。</p></div><KnowledgeVisual kind="hero"/></header>
 {privateReview&&<p className="review-notice">私人審閱版</p>}
 <div className="life-directions" role="group" aria-label="選擇心理與生活主題">{lifeDirections.filter(d=>all.some(e=>lifeTags[e.id]?.primary===d.id)).map(d=><button aria-pressed={direction===d.id} onClick={()=>choose(d.id)} key={d.id}><KnowledgeVisual kind={d.id}/><span><strong>{d.title}</strong><small>{all.filter(e=>lifeTags[e.id]?.primary===d.id).length} 篇</small></span></button>)}</div>
 <section className="life-results" aria-labelledby="life-results-title"><div className="shelf-heading"><h2 ref={results} tabIndex={-1} id="life-results-title">{lifeDirections.find(d=>d.id===direction)?.title||'讀物輪播 · 看圖選讀'}</h2>{direction&&<button onClick={()=>choose('')}>全部主題</button>}</div><p className="shelf-hint">左右滑動或點箭頭，每組四篇。選好就開始閱讀。</p><CardShelf key={direction} label="心理讀物輪播" items={visible.map(e=><EntryCard entry={e} key={e.id}/>)}/></section></section>;
}
export function ExploreHome(){return <div className="phase6-home"><section className="planet-hero"><div><small>QUESTION PLANET / 隨好奇心出發</small><h1>世界很大。<br/>你的問題，<em>從這裡出發。</em></h1><p>從生活的小發現，到值得多想一步的大問題。</p><a className="home-search" href="#search">搜尋全站讀物 →</a></div><figure><img src="./earth-nasa.jpg" alt="NASA／NOAA 製作的地球衛星合成影像" fetchPriority="high"/><figcaption>NASA／NOAA · 衛星合成影像</figcaption></figure></section>
 <section className="home-grades" aria-label="閱讀入口"><h2>今天，想從哪裡開始？</h2><div className="reading-levels">{gradeLevels.map(l=><a href={l.href} key={l.id}><h3>{l.title}</h3><p>{l.description}</p><b>查看全部 →</b></a>)}<a href="#stories"><h3>故事館</h3><p>{stories.length} 篇完整故事</p><b>走進故事 →</b></a><a href="#life"><h3>心理與生活</h3><p>心情、友誼、界線與責任</p><b>選一個主題 →</b></a><a href="#challenge"><h3>五六年級挑戰版</h3><p>{challengeIssues.reduce((n,i)=>n+i.units.length,0)} 單元 · 一步一步解任務</p><b>與進階閱讀分開 →</b></a></div></section>
 <DiscoveryCarousel entries={readingEntries}/>
 <section className="home-interests"><h2>依興趣選讀</h2><div className="interest-links">{topics.map(t=>{const count=readingEntries.filter(e=>e.theme===t.name).length;return count?<a href={t.id==='feelings'?'#life':'#topic/'+t.id} key={t.id}><strong>{t.name} ↗</strong><small>{count} 篇跨年級作品</small></a>:null})}</div></section>
 <section className="archive-footer"><h2>歷期期刊，保留每一次發現。</h2><p>原始 {issues.length} 期、{archiveArticles.length} 篇舊版讀物，與新版閱讀清楚區分。</p><a href="#library">歷期期刊 →</a><a href="#library/review">{recall.length} 題知識回顧 →</a></section></div>}
