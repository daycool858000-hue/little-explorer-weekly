import type { Unit } from '../challenge/types.ts';
import { textSegments } from './content.ts';
export function dataSegments(unit: Unit, index: number, mode: 'bilingual' | 'english') {
  const step=unit.steps[index], visual=step.visual||unit.visual;
  const say=(text: string,id: string)=>textSegments(text,id,unit.translations,mode);
  const segments=say(unit.steps[0].text,index===0?'step-text':'context-text');
  if(index>0&&step.text)segments.push(...say(step.text,'step-text'));
  if(visual){
    segments.push(...say(visual.title,'visual-title'));
    visual.headers.forEach((h,j)=>segments.push(...say(h,'visual-header-'+j)));
    visual.rows.forEach((row,i)=>row.forEach((cell,j)=>segments.push(...say(cell,'visual-row-'+i+'-'+j))));
    if(visual.note)segments.push(...say(visual.note,'visual-note'));
  }
  return segments;
}
