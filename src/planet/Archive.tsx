import { useState } from 'react';
import { issues } from './library';
import { challengeIssues } from '../challenge/library';
import { lifeTopics, matches, type Publication } from '../catalog';
import '../archive.css';

export default function Archive() {
  const [edition, setEdition] = useState('magazine');
  const [query, setQuery] = useState('');
  const [issueId, setIssue] = useState('');
  const [category, setCategory] = useState(location.hash === '#library/life' ? '心理與生活' : '');
  const [month, setMonth] = useState('');
  const publications: Publication[] = edition === 'magazine' ? issues : challengeIssues;
  const entries = edition === 'magazine' ? issues.flatMap(i => i.articles.map(a => ({
    id: a.id, issue: i, title: a.title, category: a.category, description: a.subtitle,
    grade: '三、四年級', href: '#read/' + a.id + '/0',
    text: [a.title, a.subtitle, a.category, a.word, a.pages.flatMap(p => [p.title, ...p.text])],
  }))) : challengeIssues.flatMap(i => i.units.map(u => ({
    id: u.id, issue: i, title: u.title, category: u.category, description: u.description,
    grade: '五～六年級', href: '#challenge/' + i.id + '/' + u.id + '/1',
    text: [u.title, u.description, u.category, ...[u.visual, ...u.steps.map(s => s.visual)].filter(v => !!v).flatMap(v => [v.title, v.headers, v.rows, v.note]), ...u.steps.flatMap(s => [s.title, s.text, s.prompt])],
  })));
  const dates = publications.map(i => i.publishedAt?.slice(0, 7)).filter((v): v is string => !!v);
  const shownIssues = publications.filter(i => (!issueId || i.id === issueId) && (!month || (month === 'unknown' ? !i.publishedAt : i.publishedAt?.startsWith(month))));
  const shown = entries.filter(e => shownIssues.some(i => i.id === e.issue.id) && (!category || e.category === category) && matches(query, e.text));
  const categories = [...new Set(entries.map(e => e.category))];
  const latest = publications.at(-1);
  function reset() { setQuery(''); setIssue(''); setCategory(''); setMonth(''); }
  return <div className="archive">
    <header><a href="#" className="archive-brand">問號星球<small>Question Planet</small></a><a href="#">回網站首頁</a></header>
    <main id="archive-main"><p className="archive-kicker">小小探索家閱讀系列 · 探索挑戰</p><h1>歷期期刊圖書館</h1><p>以前的發現，也在這裡等你。找一期、選主題，或搜尋所有文章。</p>
      <div className="archive-editions" aria-label="選擇閱讀系列">{[['magazine', '三四年級閱讀'], ['challenge', '五六年級挑戰版']].map(([id, label]) => <button key={id} aria-pressed={edition === id} onClick={() => { setEdition(id); reset(); }}>{label}</button>)}</div>
      {latest && <a className="archive-latest" href={(edition === 'magazine' ? '#issue/' : '#challenge/') + latest.id}>最新一期 · 第 {latest.number} 期：{latest.title} →</a>}
      <section className="archive-filters" aria-label="查找期刊及內容">
        <label>搜尋歷期內容<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="輸入文章、內容或主題關鍵字" /></label>
        <label>期數<select aria-label="期數" value={issueId} onChange={e => setIssue(e.target.value)}><option value="">全部期數</option>{publications.map(i => <option key={i.id} value={i.id}>第 {i.number} 期 · {i.title}</option>)}</select></label>
        <label>主題<select aria-label="主題" value={category} onChange={e => setCategory(e.target.value)}><option value="">全部主題</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>出版年月<select aria-label="出版年月" value={month} onChange={e => setMonth(e.target.value)}><option value="">全部年月</option>{[...new Set(dates)].sort().reverse().map(d => <option key={d}>{d}</option>)}<option value="unknown">出版日期未記錄</option></select></label>
      </section>
      {!query && !category && <nav className="archive-issues" aria-label="歷期期刊目錄">{shownIssues.map(i => <a key={i.id} href={(edition === 'magazine' ? '#issue/' : '#challenge/') + i.id}><strong>第 {i.number} 期 · {i.title}</strong><small>{i.publishedAt || '出版日期未記錄'}</small></a>)}</nav>}
      {category === '心理與生活' && <aside className="archive-life"><h2>心理與生活</h2><p>透過故事、對話與不同角色的想法，慢慢認識自己和別人。</p><p>{lifeTopics.join(' · ')}</p><p>不用分享自己的私人經驗，也沒有替個性或心情打分數的測驗。</p></aside>}
      <h2>找到了什麼？</h2><p role="status">{shown.length} {edition === 'magazine' ? '篇讀物' : '個單元'}</p>
      <div className="archive-results">{shown.map(e => <a className="archive-result" key={e.id} href={e.href}><span>{e.category} · 第 {e.issue.number} 期</span><h3>{e.title}</h3><p>{e.description}</p><small>{e.grade} · {edition === 'magazine' ? '小小探索家閱讀系列' : '探索挑戰'} →</small></a>)}</div>
      {!shown.length && <div className="archive-empty"><h2>目前沒有符合的讀物</h2><p>{category === '心理與生活' ? '這個領域的教材正在準備，審閱後才會公開。先看看其他主題吧。' : '試試不同關鍵字，或放寬期數與分類。'}</p><button onClick={reset}>清除篩選</button></div>}
    </main><footer><a href="#">回網站首頁</a><a href="THIRD-PARTY-NOTICES.txt">第三方程式授權告知</a></footer>
  </div>;
}
