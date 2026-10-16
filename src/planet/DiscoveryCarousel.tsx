import {useEffect,useRef,useState} from 'react';
import type {Entry} from './Explore';
import {EntryCard} from './Explore';
import {balancedDeck} from './exploration-deck';
let sessionDeck:Entry[]|undefined;
export default function DiscoveryCarousel({entries}:{entries:Entry[]}){
 const [deck]=useState(()=>sessionDeck??(sessionDeck=balancedDeck(entries)));
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false);
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [visible,setVisible]=useState(()=>!document.hidden);
 const touch=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const motion=()=>setReduced(media.matches),visibility=()=>setVisible(!document.hidden);media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);return()=>{media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility)}},[]);
 const running=!paused&&!reduced&&visible&&!hover&&deck.length>1;
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>setIndex(i=>(i+1)%deck.length),6000);return()=>clearInterval(timer)},[running,deck.length]);
 const move=(offset:number)=>{setPaused(true);setIndex(i=>(i+offset+deck.length)%deck.length)};
 if(!deck.length)return null;
 return <section className="discovery-carousel" aria-roledescription="輪播" aria-label="隨機探索讀物" data-running={running} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setPaused(true)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}}}>
 <header><div><small>下一個好奇，從這裡開始</small><h2>隨機探索讀物</h2></div><a href="#catalog">查看全部讀物 →</a></header>
 <div className="discovery-slide" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};setPaused(true)}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){e.preventDefault();move(dx<0?1:-1)}}}>
 <EntryCard entry={deck[index]}/></div>
 <div className="discovery-controls"><button aria-label="上一篇探索讀物" onClick={()=>move(-1)}>← 上一篇</button><span aria-live={paused?'polite':'off'} aria-atomic="true">{index+1} / {deck.length}</span><button aria-label="下一篇探索讀物" onClick={()=>move(1)}>下一篇 →</button><button disabled={reduced} onClick={()=>setPaused(!paused)}>{reduced?'減少動態：手動切換':paused?'繼續輪播':'暫停輪播'}</button></div>
 <p className="carousel-note">每次重新開啟換一組；滑動或操作後暫停。閱讀文章時不輪播。</p>
 </section>;
}
