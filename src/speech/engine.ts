export type Segment = { text: string; lang: 'zh-TW' | 'en-US'; id?: string };
export type SpeechState = { supported: boolean; status: 'idle' | 'playing' | 'paused' | 'error'; active: string; message: string; canReplay: boolean; rate: number };
export type SpeechPlatform = { synth: SpeechSynthesis; make: (text: string) => SpeechSynthesisUtterance };
export function chooseVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const normalized = (s: string) => s.toLowerCase().replaceAll('_','-');
  const candidates = voices.filter(v => normalized(v.lang).split('-')[0] === lang.split('-')[0]);
  return candidates.find(v => normalized(v.lang) === normalized(lang) && v.localService)
    || candidates.find(v => normalized(v.lang) === normalized(lang))
    || candidates.find(v => v.localService) || candidates[0];
}
// One application-wide queue. Generation checks discard delayed callbacks after cancel.
export function createSpeech(platform: SpeechPlatform | null, gap = 600) {
  let state: SpeechState = {supported: !!platform, status: 'idle', active: '', message: '', canReplay: false, rate: 1};
  const listeners = new Set<() => void>();
  let voices: SpeechSynthesisVoice[] = [], queue: Segment[] = [], last: Segment[] = [];
  let index = 0, generation = 0, utterance: SpeechSynthesisUtterance | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined, watchdog: ReturnType<typeof setTimeout> | undefined, resumeTimer: ReturnType<typeof setTimeout> | undefined;
  const emit = (next: Partial<SpeechState>) => { state = {...state,...next}; listeners.forEach(fn=>fn()); };
  const clearTimers = () => { clearTimeout(timer); clearTimeout(watchdog); clearTimeout(resumeTimer); timer = watchdog = resumeTimer = undefined; };
  function refreshVoices() { try { voices = platform?.synth.getVoices() || []; } catch { voices = []; } }
  function cancel(forget = true) {
    generation++; clearTimers(); utterance = null; queue = []; index = 0;
    if (forget) last = [];
    try { platform?.synth.cancel(); } catch { /* Reading remains available. */ }
    emit({status: 'idle', active: '', message: '', canReplay: last.length > 0});
  }
  function fail() {
    cancel(false);
    emit({status: 'error', message: '此裝置暫不支援朗讀。你仍可正常閱讀與作答；也可以稍後重新播放。'});
  }
  function speakCurrent(token: number) {
    if (token !== generation || !platform || state.status === 'paused') return;
    const segment = queue[index];
    if (!segment) { utterance = null; emit({status: 'idle', active: ''}); return; }
    refreshVoices();
    try {
      const current = platform.make(segment.text); utterance = current;
      current.lang = segment.lang; current.rate = state.rate;
      const voice = chooseVoice(voices, segment.lang);
      if (voice) current.voice = voice; // Never assign a voice from the other language.
      const valid = () => token === generation && utterance === current;
      current.onstart = () => {
        if (!valid()) return;
        clearTimeout(watchdog);
        emit({active: segment.id || ''});
        watchdog = setTimeout(()=>{if(valid() && state.status !== 'paused') fail();}, Math.max(30000,segment.text.length*1200/state.rate));
      };
      current.onresume = () => { if(valid()) clearTimeout(resumeTimer); };
      current.onend = () => {
        if (!valid()) return;
        clearTimeout(watchdog); clearTimeout(resumeTimer); utterance = null;
        if (state.status === 'paused') return; // Some mobile engines end on pause: resume this chunk.
        index++;
        if (index >= queue.length) { emit({status: 'idle', active: ''}); return; }
        emit({active: ''}); timer = setTimeout(()=>speakCurrent(token),gap);
      };
      current.onerror = event => {
        if (!valid()) return;
        if (state.status === 'paused' && ['interrupted','canceled'].includes(event.error)) { utterance=null; return; }
        fail();
      };
      emit({status: 'playing', active: '', message: '', canReplay: true});
      watchdog = setTimeout(()=>{if(valid() && state.status !== 'paused') fail();},8000);
      platform.synth.speak(current);
    } catch { fail(); }
  }
  function play(segments: Segment[]) {
    cancel();
    if (!platform) { fail(); return; }
    last = segments.filter(s=>s.text.trim()).map(s=>({...s})); queue = [...last];
    if (!queue.length) return;
    // Starts synchronously inside the child's click gesture. No mount/effect autoplay.
    try { platform.synth.resume(); } catch { /* speak still gets a chance */ }
    speakCurrent(generation);
  }
  function pause() {
    if (state.status !== 'playing') return;
    clearTimers(); emit({status: 'paused'});
    try { platform?.synth.pause(); } catch { generation++; utterance=null; try { platform?.synth.cancel(); } catch { /* optional */ } }
  }
  function resume() {
    if (state.status !== 'paused') return;
    emit({status: 'playing'});
    if (!utterance) { speakCurrent(generation); return; }
    try {
      // Engines that do not resume reliably restart only the current sentence, never the whole page.
      const current = utterance;
      resumeTimer = setTimeout(()=>{
        if(state.status !== 'playing' || utterance !== current) return;
        generation++; utterance=null;
        try { platform?.synth.cancel(); } catch { /* optional */ }
        speakCurrent(generation);
      },1800);
      watchdog = setTimeout(()=>{if(state.status==='playing' && utterance===current)fail();},Math.max(30000,current.text.length*1200/state.rate));
      platform?.synth.resume();
    } catch { generation++; utterance=null; try { platform?.synth.cancel(); } catch { /* optional */ } speakCurrent(generation); }
  }
  refreshVoices();
  try { platform?.synth.addEventListener('voiceschanged',refreshVoices); } catch { /* refresh on every play as well */ }
  return {
    subscribe(fn: () => void) { listeners.add(fn); return () => {listeners.delete(fn);}; },
    getSnapshot: () => state, play, pause, resume, cancel,
    replay() { const saved = [...last]; play(saved); },
    setRate(rate: number) { if(![0.8,1,1.2].includes(rate)) return; cancel(false); emit({rate}); },
    dispose() { cancel(); try { platform?.synth.removeEventListener('voiceschanged',refreshVoices); } catch { /* optional */ } listeners.clear(); }
  };
}
