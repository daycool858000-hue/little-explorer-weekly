import type {Unit,Visual} from '../challenge/types.ts';
import type {Segment} from './engine.ts';
import {textSegments} from './content.ts';
// Speech-only templates: every fact is interpolated from the displayed table.
// No solution, inference, recalculated total, or hidden answer is included.
export function tableSegments(unit:Unit,visual:Visual,mode:'bilingual'|'english'):Segment[]{
 const result:Segment[]=[];
 const say=(text:string,id:string)=>textSegments(text,id,unit.translations,mode);
 const target=(i:number,language?:'en'|'zh')=>visual.rows[i].flatMap((cell,j)=>{
  const pairs=unit.translations?.[cell];return language&&pairs?pairs.map((_,k)=>`visual-row-${i}-${j}-${k}-${language}`):[`visual-row-${i}-${j}`];
 }).join('|');
 const zh=(text:string,i:number)=>result.push({text,lang:'zh-TW',id:target(i)});
 const pair=(en:string,zhText:string,i:number)=>{result.push({text:en,lang:'en-US',id:target(i,'en')});if(mode==='bilingual')result.push({text:zhText,lang:'zh-TW',id:target(i,'zh')});};
 result.push(...say(visual.title,'visual-title'));
 visual.rows.forEach((r,i)=>{
  switch(unit.id){
   case 'market-math': zh([`這次有${r[1]}。`,`果汁${r[1]}。`,`優惠是${r[1]}。`,`預算是${r[1]}。`][i]||`${r[0]}是${r[1]}。`,i);break;
   case 'menu-english': {
    const item=unit.translations?.[r[0]]?.[0]?.zh||r[0];
    const name:Record<string,string>={Sandwich:'A sandwich',Tea:'A cup of tea',Milk:'A cup of milk',Apple:'An apple'};
    pair(`${name[r[0]]||r[0]} costs ${r[1]}.`,`${item}的價格是${r[1]}。`,i);break;
   }
   case 'notice-reading': zh([`活動時間是${r[1]}。`,`地點在${r[1]}。`,`參加對象為${r[1]}。`,`報名在${r[1]}。`,`${r[1]}。`,`請攜帶${r[1]}。`][i]||`${r[0]}：${r[1]}。`,i);break;
   case 'budget-mix': zh(`方案${r[0]}，${r[1]}。`,i);break;
   case 'walk-math': zh([`${r[1]}。`,`步行速率是${r[1]}。`,`${r[1]}出發。`,`途中${r[1]}。`,`${r[1]}集合。`][i]||`${r[0]}是${r[1]}。`,i);break;
   case 'bus-english': pair(`Bus ${r[0]} leaves school at ${r[1]} and arrives at the stop at ${r[2]}.`,`${r[0]}班公車${r[1]}從學校出發，${r[2]}到站。`,i);break;
   case 'transfer-reading': zh(i===1?`${r[1]}。`:i===4?`${r[1]}。`:`${r[0]}${r[1]}。`,i);break;
   case 'route-mix': zh(`路線${r[0]}長${r[1]}，預估等候${r[2]}，有遮雨的路段${r[3]==='很少'?'很少':'占'+r[3]}。`,i);break;
   case 'chart-math': zh(`${r[0]==='步行'?'步行':r[0]==='自行車'?'騎自行車':r[0]==='公車'?'搭公車':r[0]}的人有${r[1]}人。`,i);break;
   case 'message-english': {
    // Keep each sentence paired; the publication timestamp is essential evidence.
    const date=r[0].split(' · ').slice(1).join(' · ');
    const translated=unit.translations?.[r[0]]?.[0]?.zh||r[0];
    pair(`${i===0?'The earlier message':'The update'} was posted on ${date}.`,translated.replace('・','在')+'發出。',i);
    result.push(...say(r[1],`visual-row-${i}-1`));break;
   }
   case 'evidence-reading': zh(`第${r[0]}項記錄，${r[1]}。`,i);break;
   case 'experiment-mix': zh(visual.headers.length===4?`折法${r[0]}，兩次飛行距離分別是${r[1]}，由${r[2]}投擲，出手高度是${r[3]}。`:`折法${r[0]}，三次飛行距離分別是${r[1]}。`,i);break;
   case 'area-math': zh([`地面是${r[1]}。`,`地墊${r[1]}。`,`鋪設時${r[1]}。`,`${r[1]}。`,`預算是${r[1]}。`][i]||`${r[0]}是${r[1]}。`,i);break;
   case 'team-english': {
    const task=r[1].replace(/\.$/,'');
    const action=task.startsWith('Bring ')?'will bring '+task.slice(6):task.startsWith('Make ')?'will make '+task.slice(5):task.startsWith('Count ')?'will count '+task.slice(6):'has this task: '+task;
    const person=unit.translations?.[r[0]]?.[0]?.zh||r[0],taskZh=unit.translations?.[r[1]]?.[0]?.zh||r[1];
    pair(`${r[0]} ${action}.`,`${person}負責${taskZh}`,i);break;
   }
   case 'plans-reading': break; // This table compares columns: narrate each plan as a whole below.
   case 'solutions-mix': zh(`方案${r[0]}，單程步行${r[1]}，活動時間${r[2]}，材料費${r[3]}，${r[4]}。`,i);break;
   default: {
    // Future tables retain every cell and its relationship, even without a custom template.
    const translated=(text:string,language:'en'|'zh')=>unit.translations?.[text]?.map(p=>p[language]).join(' ')||text;
    const zhText=`${translated(r[0],'zh')}，`+r.slice(1).map((cell,j)=>`${translated(visual.headers[j+1],'zh')}是${translated(cell,'zh')}`).join('，')+'。';
    if(unit.category==='英文探索')pair(`For ${translated(r[0],'en')}, `+r.slice(1).map((cell,j)=>`${translated(visual.headers[j+1],'en')}: ${translated(cell,'en')}`).join('; ')+'.',zhText,i);
    else zh(zhText,i);break;
   }
  }
 });
 if(unit.id==='plans-reading')for(let j=1;j<visual.headers.length;j++){
  const r=visual.rows;
  result.push({text:`方案${visual.headers[j]}，活動是${r[0][j]}，總時間${r[1][j]}，材料費${r[2][j]}。支持者${r[3][j]}。`,lang:'zh-TW',id:r.map((_,i)=>`visual-row-${i}-${j}`).join('|')});
 }
 if(visual.note)result.push(...say(visual.note,'visual-note'));
 return result;
}
