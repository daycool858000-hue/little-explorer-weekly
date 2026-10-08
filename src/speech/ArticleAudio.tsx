import { SpeakButton, SpeechControls } from './Controls';
import { plainSegments } from './content';
export function ArticleAudio({title,page}: {title: string;page: {title: string;text: string[]}}) {
  const segments=[...plainSegments(title,'article-title'),...plainSegments(page.title,'article-page-title'),...page.text.flatMap((p,i)=>plainSegments(p,'article-paragraph-'+i))];
  return <div className="speech-panel" aria-label="這一頁的有聲閱讀"><SpeakButton label="聽這一頁" segments={segments}/><SpeechControls/></div>;
}
export function ArticleQuestionAudio({question}: {question: string}) { return <SpeakButton label="聽題目" segments={plainSegments(question,'article-question')}/>; }
