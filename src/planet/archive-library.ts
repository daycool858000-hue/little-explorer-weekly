import type template from '../content/week-1.json';
// Only tracked publication files; deliberately never import virtual private review content.
const files=import.meta.glob<{default:typeof template & {status?:string;publishedAt?:string}}>('../content/week-*.json',{eager:true});
export const archiveIssues=Object.values(files).map(f=>f.default).filter(i=>i.status==='published'||(!i.status&&['week-1','week-2','week-3','week-4'].includes(i.id))).sort((a,b)=>a.number-b.number);
export const archiveArticles=archiveIssues.flatMap(i=>i.articles);
export const archiveRead=(id:string,page=0)=>'#archive/read/'+id+'/'+page;
