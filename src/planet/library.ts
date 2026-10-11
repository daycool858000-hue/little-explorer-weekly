import type template from './content/week-1.json';
const files=import.meta.glob<{default:typeof template}>('./content/week-*.json',{eager:true});
export const issues=Object.values(files).map(f=>f.default).filter(i=>i.status==="published").sort((a,b)=>a.number-b.number);
export const articles=issues.flatMap(i=>i.articles);
export const topics=[
 {name:'自然與科學',id:'moon',line:'從月亮到麵包，找出藏起來的原因。'},
 {name:'歷史與人物',id:'printing',line:'看見人們留下的工具與想法。'},
 {name:'地理與世界',id:'maps',line:'一張地圖，帶你換個位置看世界。'},
 {name:'科技探索',id:'binary',line:'拆開一個想法，看它怎麼運作。'},
 {name:'心理與生活',id:'feelings',line:'生活裡，有些問題不只一個答案。'},
 {name:'故事與想像',id:'fox',line:'跟著角色，看見另一種選擇。'}
].map(t=>({...t,ids:articles.filter(a=>a.primaryTopic===t.name).map(a=>a.id)}));

