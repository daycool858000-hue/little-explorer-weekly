import drafts from 'virtual:phase5-readings';
export type Reading={id:string;title:string;theme:string;grade:string;paragraphs:string[];status:string;order?:number;summary?:string;image?:string;imageAlt?:string;word?:string|string[];definition?:string;words?:{term:string;definition:string}[];annotated?:Record<string,string[]>;question?:string;options?:string[];answer?:number;explanation?:string;activity?:string;thinkingHint?:string;fictionNote?:string;sections?:{title:string;paragraphs:string[]}[];questions?:{prompt:string;answer:string;kind:string}[];sources:{title:string;url:string;checkedAt:string}[]};
const load=(files:Record<string,{default:Reading}>)=>Object.values(files).map(x=>x.default).filter(x=>x.status==='published');
export const stories=load(import.meta.glob<{default:Reading}>('./stories/*.json',{eager:true})).sort((a,b)=>(a.order||0)-(b.order||0));
export const juniors=[...load(import.meta.glob<{default:Reading}>('./junior/*.json',{eager:true})),...drafts.junior];
export const advanced=[...load(import.meta.glob<{default:Reading}>('./advanced/*.json',{eager:true})),...drafts.advanced];
export const newReadings=[...stories.map(s=>({...s,href:'#stories/'+s.id})),...juniors.map(s=>({...s,href:'#junior/'+s.id})),...advanced.map(s=>({...s,href:'#advanced/'+s.id}))].map(s=>({...s,text:[s.summary||'',...s.paragraphs].join(' ')}));
export const privateReview=drafts.privateReview;
