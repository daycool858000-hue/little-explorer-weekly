import {useState} from 'react';
import visuals from 'virtual:review-visuals';
import {lifeTags} from './life-topics';
const protectedIds=new Set(['water','fox','ants','maps','moon','library','bread','shadows','seed','taiwan','coral','bridges','feelings','printing','binary','culture']);
export function visualFor(id:string){
 if(!visuals.enabled||protectedIds.has(id))return undefined;
 if(visuals.entries[id])return id;
 const topic=lifeTags[id]?.primary;
 if(id.startsWith('junior-')||id.startsWith('story-')||id.startsWith('advanced-')||topic)return 'omit';
 return undefined;
}
export function KnowledgeVisual({kind,id,caption=false}:{kind?:string;id?:string;caption?:boolean}){
 const key=kind||(id?visualFor(id):undefined),asset=key?visuals.entries[key]:undefined;
 const [failed,setFailed]=useState(false);
 if(!asset)return null;
 return <figure className={'knowledge-visual realistic-visual visual-'+key}>
 {!failed&&<img src={asset.src} alt={asset.alt} loading="lazy" width={asset.width} height={asset.height} onError={()=>setFailed(true)}/>}
 {caption?<figcaption>{failed?'圖片暫時無法顯示，文章仍可閱讀。 ':''}{asset.caption}<br/><a href={asset.source} target="_blank" rel="noreferrer">{asset.author}</a> · <a href={asset.licenseUrl} target="_blank" rel="noreferrer">{asset.license}</a> · <a href="IMAGE_SOURCES.html">圖片來源與權利說明</a></figcaption>:<figcaption className="visual-credit">{asset.type==='AI生成'?'AI 情境圖，非真實人物照片':asset.author+' · '+asset.license}</figcaption>}
 </figure>;
}
