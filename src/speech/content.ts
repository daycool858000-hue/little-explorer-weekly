import type { Segment } from './engine.ts';
export type Pair = {en: string; zh: string};
export type Translations = Record<string, Pair[]>;
// Non-English units may contain short English labels. Keep their voice separate too.
export function plainSegments(text: string, id: string): Segment[] {
  return (text.match(/[A-Za-z][A-Za-z\d :.$'’“”"?!,;()/%—–-]*|[^A-Za-z]+/g)||[]).filter(s=>s.trim()).map(s=>({text:s.trim(),lang:/[A-Za-z]/.test(s)?'en-US':'zh-TW',id}));
}
export function textSegments(text: string, id: string, translations?: Translations, mode: 'bilingual' | 'english' = 'bilingual'): Segment[] {
  const pairs=translations?.[text];
  if (!pairs) return plainSegments(text,id).filter(s=>mode!=='english'||s.lang==='en-US');
  return pairs.flatMap((p,i)=>[ {text:p.en,lang:'en-US' as const,id:id+'-'+i+'-en'}, ...(mode==='bilingual'?[{text:p.zh,lang:'zh-TW' as const,id:id+'-'+i+'-zh'}]:[]) ]);
}
