import { useSyncExternalStore } from 'react';
import { createSpeech } from './engine';
function platform() {
  try { return typeof window.speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined' ? {synth: window.speechSynthesis, make: (text: string) => new SpeechSynthesisUtterance(text)} : null; } catch { return null; }
}
export const speech = createSpeech(platform());
export const useSpeech = () => useSyncExternalStore(speech.subscribe,speech.getSnapshot);
type Preferences = {rate: number; chinese: boolean; mode: 'bilingual' | 'english'};
const KEY = 'explorer-speech-v1';
let preferences: Preferences = {rate: 1, chinese: true, mode: 'bilingual'};
try { const raw=JSON.parse(localStorage.getItem(KEY)||'null'); if(raw) preferences={rate:[0.8,1,1.2].includes(raw.rate)?raw.rate:1,chinese:raw.chinese!==false,mode:raw.mode==='english'?'english':'bilingual'}; } catch { /* isolated from reading progress */ }
speech.setRate(preferences.rate);
const listeners = new Set<()=>void>();
export function setSpeechPreferences(next: Partial<Preferences>) {
  if(next.mode && next.mode!==preferences.mode) speech.cancel();
  if(next.rate!==undefined) speech.setRate(next.rate);
  preferences={...preferences,...next};
  try { localStorage.setItem(KEY,JSON.stringify(preferences)); } catch { /* works for this visit */ }
  listeners.forEach(fn=>fn());
}
export const useSpeechPreferences = () => useSyncExternalStore((fn)=>{listeners.add(fn);return ()=>{listeners.delete(fn);};},()=>preferences);
export const getSpeechPreferences = () => preferences;
