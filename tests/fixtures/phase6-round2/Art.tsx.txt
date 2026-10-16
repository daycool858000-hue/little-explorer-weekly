import moon from './moon-galileo.jpg';
import records from './media-records.json';
const files=import.meta.glob<string>('./media/*',{query:'?url',import:'default',eager:true});
export const visualRecords=records;
export function Art({id,detail=false}:{id:string;detail?:boolean}){
 const r=records.find(r=>r.id===id);
 const key=detail&&files['./media/'+id+'-detail.svg']?id+'-detail.svg':r?.file||id+'.svg';
 const src=key==='moon-galileo.jpg'?moon:files['./media/'+key];
 if(id==='moon'&&!detail)return <div className="moon-art"><img src={src} alt={r?.alt}/><span className="moon-label">月球表面，放大看。</span></div>;
 return <img src={src} alt={detail?r?.detailAlt||r?.alt:r?.alt} loading="lazy"/>;
}
