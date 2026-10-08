import type { Segment } from './engine.ts';
export type Pair = {en: string; zh: string};
export type Translations = Record<string, Pair[]>;
// Context determines language, not a single unit letter embedded in Chinese.
export function plainSegments(text: string, id: string, numericLanguage:'zh-TW'|'en-US'='zh-TW'): Segment[] {
  if(!text.trim())return [];
  const lang=/[\u3400-\u9fff]/.test(text)?'zh-TW':/[A-Za-z]/.test(text)?'en-US':numericLanguage;
  return [{text:text.trim(),lang,id}];
}
export function textSegments(text: string, id: string, translations?: Translations, mode: 'bilingual' | 'english' = 'bilingual'): Segment[] {
  const pairs=translations?.[text];
  if (!pairs) return plainSegments(text,id,mode==='english'?'en-US':'zh-TW').filter(s=>mode!=='english'||s.lang==='en-US');
  return pairs.flatMap((p,i)=>[ {text:p.en,lang:'en-US' as const,id:id+'-'+i+'-en'}, ...(mode==='bilingual'?[{text:p.zh,lang:'zh-TW' as const,id:id+'-'+i+'-zh'}]:[]) ]);
}
