import { useSyncExternalStore } from 'react';
import Magazine from './App';
import Challenge from './challenge/Challenge';
import './challenge/challenge.css';
import { SpeechLifecycle } from './speech/Controls';
function subscribe(callback: () => void) { window.addEventListener('hashchange', callback); return () => window.removeEventListener('hashchange', callback); }
const snapshot = () => window.location.hash;
export default function Root() {
  const hash = useSyncExternalStore(subscribe, snapshot);
  return <><SpeechLifecycle route={hash}/>{hash === '#challenge' || hash.startsWith('#challenge/') ? <Challenge hash={hash} /> : <Magazine />}</>;
}
