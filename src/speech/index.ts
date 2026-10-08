import { useSyncExternalStore } from 'react';
import { createSpeech } from './engine';
import {readPreferences,type Preferences} from './preferences';
function platform() {
  try { return typeof window.speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined' ? {synth: window.speechSynthesis, make: (text: string) => new SpeechSynthesisUtterance(text)} : null; } catch { return null; }
}
export const speech = createSpeech(platform());
export const useSpeech = () => useSyncExternalStore(speech.subscribe,speech.getSnapshot);
const KEY = 'explorer-speech-v1';
let preferences: Preferences = readPreferences(null);
try { preferences=readPreferences(JSON.parse(localStorage.getItem(KEY)||'null')); } catch { /* isolated from reading progress */ }
speech.setRate(preferences.rate);
speech.setVoices(preferences.zhVoice,preferences.enVoice);
const listeners = new Set<()=>void>();
export function setSpeechPreferences(next: Partial<Preferences>) {
  if(next.mode && next.mode!==preferences.mode) speech.cancel();
  if(next.rate!==undefined) speech.setRate(next.rate);
  preferences=readPreferences({...preferences,...next});
  speech.setVoices(preferences.zhVoice,preferences.enVoice);
  try { localStorage.setItem(KEY,JSON.stringify(preferences)); } catch { /* works for this visit */ }
  listeners.forEach(fn=>fn());
}
export const useSpeechPreferences = () => useSyncExternalStore((fn)=>{listeners.add(fn);return ()=>{listeners.delete(fn);};},()=>preferences);
export const getSpeechPreferences = () => preferences;
