export type DatedIssue = {id:string; number:number; publishedAt?:string; status?:string};
export function publicationMonth(issue:DatedIssue){
 const date=issue.publishedAt;
 if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date))return '';
 const parsed=new Date(date+'T00:00:00Z');
 return Number.isNaN(parsed.getTime())||parsed.toISOString().slice(0,10)!==date?'':date.slice(0,7);
}
export function inPeriod(issue:DatedIssue,year:string,month:string){const value=publicationMonth(issue);return (!year||(year==='early'?!value:value.startsWith(year+'-')))&&(!month||value.slice(5)===month)}
export function nextRandom<T extends {id:string}>(items:T[],recent:string[],random=Math.random){
 if(!items.length)return undefined;
 const fresh=items.filter(x=>!recent.includes(x.id));
 const pool=fresh.length?fresh:items.filter(x=>x.id!==recent.at(-1));
 const candidates=pool.length?pool:items;
 return candidates[Math.min(candidates.length-1,Math.max(0,Math.floor(random()*candidates.length)))];
}
