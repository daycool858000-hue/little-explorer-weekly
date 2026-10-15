export const RATES=[0.9,1.1];
export const ACCEPTED_RATES=RATES;
export function migrateRate(value:unknown):number {return typeof value==='number'&&[0.8,0.9,1].includes(value)?0.9:1.1;}
export type Preferences={rate:number;chinese:boolean;mode:'bilingual'|'english';zhVoice:string;enVoice:string};
export function readPreferences(raw:unknown):Preferences {
 const value=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
 return {rate:migrateRate(value.rate),chinese:value.chinese!==false,mode:value.mode==='english'?'english':'bilingual',zhVoice:typeof value.zhVoice==='string'?value.zhVoice:'',enVoice:typeof value.enVoice==='string'?value.enVoice:''};
}
