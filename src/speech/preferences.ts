export const RATES=[0.9,1.2,1.5,1.8];
export const ACCEPTED_RATES=[...RATES,0.8,1]; // Preserve an explicitly saved setting from the first release.
export type Preferences={rate:number;chinese:boolean;mode:'bilingual'|'english';zhVoice:string;enVoice:string};
export function readPreferences(raw:unknown):Preferences {
 const value=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
 return {rate:ACCEPTED_RATES.includes(Number(value.rate))&&typeof value.rate==='number'?value.rate:1.2,chinese:value.chinese!==false,mode:value.mode==='english'?'english':'bilingual',zhVoice:typeof value.zhVoice==='string'?value.zhVoice:'',enVoice:typeof value.enVoice==='string'?value.enVoice:''};
}
