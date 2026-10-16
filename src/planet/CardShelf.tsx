import {useRef,useState} from 'react';
import type {ReactNode} from 'react';
/** 手動四卡輪播；不自動播放、不保存資料，不改首頁隨機抽樣。 */
export default function CardShelf({items,label}:{items:ReactNode[];label:string}){
 const [page,setPage]=useState(0),start=useRef<{x:number;y:number}|null>(null);
 const total=Math.max(1,Math.ceil(items.length/4)),current=Math.min(page,total-1);
 const move=(n:number)=>setPage((current+n+total)%total);
 return <section className="card-shelf" aria-label={label} aria-roledescription="手動輪播" onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}}}>
 <div className="shelf-controls"><button aria-label={label+'上一組'} disabled={total===1} onClick={()=>move(-1)}>← 上一組</button><span role="status">{current+1} / {total} 組 · {items.length} 篇</span><button aria-label={label+'下一組'} disabled={total===1} onClick={()=>move(1)}>下一組 →</button></div>
 <div className="shelf-grid" key={current} onTouchStart={e=>{start.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e=>{const a=start.current;start.current=null;if(!a)return;const dx=e.changedTouches[0].clientX-a.x,dy=e.changedTouches[0].clientY-a.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){e.preventDefault();move(dx<0?1:-1)}}}>{items.slice(current*4,current*4+4)}</div>
 {!items.length&&<p>目前沒有符合的讀物。</p>}
 </section>;
}
