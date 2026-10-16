export function balancedDeck<T extends {id:string;grade:string}>(entries:T[], random= Math.random, limit=12):T[]{
 const shuffle=(a:T[])=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const unique=[...new Map(entries.map(e=>[e.id,e])).values()];
 const groups=['1-2','3-4','5-6','story'].map(g=>shuffle(unique.filter(e=>e.grade===g)));
 const result:T[]=[];
 while(result.length<limit&&groups.some(g=>g.length)){for(const e of shuffle(groups.map(g=>g.shift()).filter((e):e is T=>!!e))){if(result.length<limit)result.push(e)}}
 return result;
}
