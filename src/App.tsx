import { useEffect, useRef, useState } from "react";
import { articles, issues } from "./library";

const asset = (name: string) => (window as Window & { explorerAssets?: Record<string, string> }).explorerAssets?.[name] ?? "assets/" + name + ".svg";
type Memory = {
  saved: string[];
  done: string[];
  last: string;
  size: number;
  warm: boolean;
  pages: Record<string, number>;
};
const initial: Memory = { saved: [], done: [], last: "", size: 22, warm: false, pages: {} };
const topics = ["全部讀物", ...new Set(articles.map(a => a.category))];
export default function Magazine() {
  const [issueId, setIssueId] = useState("");
  const [memory, setMemory] = useState<Memory>(initial);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState(0);
  const [topic, setTopic] = useState("全部讀物");
  const [shelf, setShelf] = useState(false);
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [help, setHelp] = useState(false);
  const readingHeading = useRef<HTMLHeadingElement>(null);
  const article = articles.find((a) => a.id === selected);
  const issue = issues.find(i => i.id === issueId);
  const articleIssue = issues.find(i => i.articles.some(a => a.id === selected));
  const currentIssue = articleIssue || issue;
  const issueArticles = currentIssue?.articles || articles;
  function goIssue(id: string) { setQuery(""); setTopic("全部讀物"); setShelf(false); location.hash = "issue/" + id; }
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("explorer-magazine-v1") || "null");
      if (raw && typeof raw === "object") {
        const ids = (v: unknown) =>
          Array.isArray(v)
            ? v.filter(
                (s): s is string => typeof s === "string" && articles.some((a) => a.id === s),
              )
            : [];
        const pages: Record<string, number> = {};
        for (const a of articles) {
          const v = raw.pages?.[a.id];
          if (Number.isInteger(v) && v >= 0 && v < a.pages.length) pages[a.id] = v;
        }
        setMemory({
          saved: ids(raw.saved),
          done: ids(raw.done),
          last: articles.some((a) => a.id === raw.last) ? raw.last : "",
          size: [20, 22, 25, 28].includes(raw.size) ? raw.size : 22,
          warm: raw.warm === true,
          pages,
        });
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
    function readHash() {
      const parts = location.hash.split("/");
      setIssueId(parts[0] === "#issue" && issues.some(i => i.id === parts[1]) ? parts[1] : "");
      const a = parts[0] === "#read" && articles.find((a) => a.id === parts[1]);
      if (a && /^\d+$/.test(parts[2] || "")) {
        const n = Math.max(0, Math.min(Number(parts[2]), a.pages.length - 1));
        setSelected(a.id);
        setPage(n);
        setMemory((prev) => ({ ...prev, last: a.id, pages: { ...prev.pages, [a.id]: n } }));
      } else {
        setSelected("");
        setPage(0);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("explorer-magazine-v1", JSON.stringify(memory));
      } catch {
        setStorageError(true);
      }
    }
  }, [memory, ready]);
  useEffect(() => {
    if (selected) readingHeading.current?.focus({ preventScroll: true });
  }, [selected, page]);
  function open(id: string, n?: number) {
    location.hash = "read/" + id + "/" + (n ?? memory.pages[id] ?? 0);
  }
  function home(saved = false) {
    setShelf(saved);
    setQuery("");
    setTopic("全部讀物");
    location.hash = "";
    setSelected("");
    setIssueId("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function bookmark(id: string) {
    setMemory((prev) => ({
      ...prev,
      saved: prev.saved.includes(id) ? prev.saved.filter((x) => x !== id) : [...prev.saved, id],
    }));
  }
  function finish(id: string) {
    setMemory((prev) => ({
      ...prev,
      done: prev.done.includes(id) ? prev.done : [...prev.done, id],
    }));
  }
  const list = issueArticles.filter(
    (a) =>
      (!shelf || memory.saved.includes(a.id)) &&
      (topic === "全部讀物" || a.category === topic) &&
      (a.title + a.subtitle + a.category).includes(query.trim()),
  );
  const last = articles.find((a) => a.id === memory.last);
  return (
    <div className={memory.warm ? "magazine warm" : "magazine"}>
      <button className="skip" onClick={() => document.querySelector<HTMLElement>("main")?.focus()}>跳到內容</button>
      <header className="header">
        <button className="brand" onClick={() => home()} aria-label="小小探索家首頁">
          <img src={asset("logo")} alt="" width="42" height="42" />
          <span>
            小小探索家週刊<small>Little Explorer Weekly</small>
          </span>
        </button>
        <nav aria-label="主選單">
          <button onClick={() => home()}>首頁</button>
          {currentIssue && <button onClick={() => goIssue(currentIssue.id)}>本週目錄</button>}
          <button className="help-toggle" onClick={() => setHelp(!help)} aria-expanded={help}>閱讀說明</button>
        </nav>
      </header>
      {help && (
        <aside className="help">
          <strong>把閱讀帶在身邊</strong>
          <p>
            點選文章開始閱讀；使用「上一頁／下一頁」慢慢讀。按下收藏可放進書架，讀完後收集發現章。進度只保存在目前的瀏覽器，清除瀏覽資料會重設。
          </p>
          <p>
            平板上可從瀏覽器選單選擇「加入主畫面」。本版需要網路開啟，{issues.length} 期共 {articles.length} 篇讀物都可以直接閱讀。收藏與進度只留在這個瀏覽器，不會傳送出去。
          </p>
          <button onClick={() => setHelp(false)}>知道了</button>
        </aside>
      )}
      {storageError && (
        <p className="storage-notice" role="status">
          這個瀏覽器無法儲存進度，你仍然可以正常閱讀。
        </p>
      )}
      {article ? (
        <main tabIndex={-1} id="main" className="reader">
          <div className="reader-tools">
            <button className="back-link" onClick={() => goIssue(articleIssue!.id)}>
              ← 回到本週目錄
            </button>
            <div className="reading-settings">
              <label htmlFor="font-size">字體</label>
              <select
                id="font-size"
                value={memory.size}
                onChange={(e) => setMemory({ ...memory, size: Number(e.target.value) })}
              >
                <option value={20}>標準</option>
                <option value={22}>大</option>
                <option value={25}>更大</option>
                <option value={28}>特大</option>
              </select>
              <button
                className="paper-toggle"
                aria-pressed={memory.warm}
                onClick={() => setMemory({ ...memory, warm: !memory.warm })}
              >
                {memory.warm ? "白紙" : "暖紙"}
              </button>
            </div>
          </div>
          <div className="article-top">
            <span>
              {article.category} · {article.level} · 約 {article.minutes} 分鐘
            </span>
            <button
              className="bookmark"
              aria-pressed={memory.saved.includes(article.id)}
              onClick={() => bookmark(article.id)}
            >
              {memory.saved.includes(article.id) ? "★ 已收藏" : "☆ 收藏"}
            </button>
          </div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.subtitle}</p>
          <img
            className="reader-art"
            src={asset(article.image)}
            alt={article.title + "主題插畫"}
            width="1200"
            height="720"
          />
          <div
            className="page-progress"
            aria-label={"第 " + (page + 1) + " 頁，共 " + article.pages.length + " 頁"}
          >
            {article.pages.map((_, i) => (
              <button
                key={i}
                className={i === page ? "current" : ""}
                aria-label={"第 " + (i + 1) + " 頁"}
                aria-current={i === page ? "page" : undefined}
                onClick={() => open(article.id, i)}
              >
                <span />第 {i + 1} 頁
              </button>
            ))}
          </div>
          <article className="reading-body" style={{ fontSize: memory.size }}>
            <h2 tabIndex={-1} ref={readingHeading}>
              {article.pages[page].title}
            </h2>
            {article.pages[page].text.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
          <details className="word-box">
            <summary>認識一個詞：{article.word[0]}</summary>
            <p>{article.word[1]}</p>
          </details>
          {page === article.pages.length - 1 && (
            <section className="quiz" aria-labelledby="quiz-title">
              <span className="section-kicker">猜猜看 · 可以再試一次</span>
              <h2 id="quiz-title">{article.question}</h2>
              <div className="options">
                {article.options.map((option, i) => (
                  <button
                    key={option}
                    aria-pressed={answers[article.id] === i}
                    className={answers[article.id] === i ? "chosen" : ""}
                    onClick={() => setAnswers({ ...answers, [article.id]: i })}
                  >
                    <span>{String.fromCharCode(65 + i)}</span>
                    {option}
                  </button>
                ))}
              </div>
              {answers[article.id] !== undefined && (
                <p className="answer" role="status">
                  {answers[article.id] === article.answer ? "答對了！" : "再想一想。"}
                  {article.explanation}
                </p>
              )}
              <div className="thinking">
                <span className="section-kicker">換個角度想 · 沒有唯一答案</span>
                <h3>{article.thinking}</h3>
                <p>先想一想，也可以說給身邊的人聽。</p>
                <details key={article.id}><summary>看看另一個想法</summary><p>{article.hint}</p></details>
              </div>
              <p className="mission">
                <strong>今天的小任務</strong>
                {article.task}
              </p>
              <button className="complete" onClick={() => finish(article.id)}>
                {memory.done.includes(article.id) ? "✓ 已收下這枚發現章" : "我讀完了，收下發現章"}
              </button>
              {memory.done.includes(article.id) && (
                <p role="status">又多了一個新發現！你已完成 {memory.done.length} 篇。</p>
              )}
            </section>
          )}
          <div className="page-turner">
            <button
              className="previous"
              disabled={page === 0}
              onClick={() => open(article.id, page - 1)}
            >
              ← 上一頁
            </button>
            <span>
              {page + 1} / {article.pages.length}
            </span>
            {page < article.pages.length - 1 ? (
              <button className="next" onClick={() => open(article.id, page + 1)}>
                下一頁 →
              </button>
            ) : (
              <button
                className="next"
                onClick={() => {
                  const next = issueArticles[issueArticles.findIndex(a => a.id === article.id) + 1];
                  if (next) open(next.id, 0); else goIssue(articleIssue!.id);
                }}
              >
                {issueArticles.at(-1)?.id === article.id ? "回到本週目錄 →" : "讀下一篇 →"}
              </button>
            )}
          </div>
          <p className="editor-note">
            小小探索家原創編寫 · 四週探索特輯 ·{" "}
            {["故事劇場", "生活練習"].includes(article.category)
              ? "原創故事，人物與情節為虛構。"
              : "以日常觀察認識基礎科學。"}
          </p>
        </main>
      ) : (
        <main tabIndex={-1} id="main" className="home">
          {!issue && !shelf && (
            <>
              <div className="issue-line">
                <span>共 {issues.length} 期 · {articles.length} 篇讀物</span>
                <span>適合國小三～六年級</span>
              </div>
              <section className="hero">
                <img
                  src={asset("hero")}
                  alt="森林裡，狐狸捧著書坐在蜿蜒的小河旁"
                  width="1200"
                  height="720"
                  fetchPriority="high"
                />
                <div className="hero-paper">
                  <div>
                    <span className="section-kicker">每天一點新發現</span>
                    <h1>
                      把世界，
                      <br />
                      讀成一場探險。
                    </h1>
                    <p>每週一起發現幾件原來不知道的事。挑一期，從你最好奇的那一頁開始。</p>
                  </div>
                  <button className="reading-ticket" onClick={() => open(last?.id || "water")}>
                    <span>{last ? "接著上次讀" : "打開第一篇"}</span>
                    <b>↗</b>
                    <small>{last ? last.title : "一滴水的奇妙旅行"}</small>
                  </button>
                </div>
              </section>
              <div className="welcome-note">
                <span>嗨，小小探索家！</span>
                <p>挑一篇你喜歡的，找個舒服的位置，出發吧。</p>
                <span className="reading-count">{issues.length} 期都能讀</span>
              </div>
            </>
          )}
          {!issue && !shelf ? <section className="issue-library" aria-labelledby="issue-title">
            <div className="library-heading"><div><span className="section-kicker">你的每週探索任務</span><h2 id="issue-title">這個月，想先翻哪一期？</h2></div></div>
            <button className="latest-issue" onClick={() => goIssue(issues[issues.length - 1].id)}>本週最新一期 · 第 {issues[issues.length - 1].number} 週：{issues[issues.length - 1].title} →</button>
            <div className="issue-grid">{issues.map((i) => <button key={i.id} className="issue-card" onClick={() => goIssue(i.id)}>
              <img src={asset(i.cover)} alt="" width="1200" height="720" />
              <div><span className="section-kicker">第 {i.number} 週 {i.number === issues.length && "· 本週最新一期"}</span><h3>{i.title}</h3><p>{i.description}</p><strong>{i.articles.length} 篇探索 · 打開週刊 ↗</strong></div>
            </button>)}</div>
          </section> : <>
          {issue && <div className="issue-intro"><span className="section-kicker">第 {issue.number} 週</span><h1>{issue.title}</h1><p>{issue.description}</p><div className="issue-navigation">
          <button disabled={issue.number === 1} onClick={() => goIssue(issues[issue.number - 2].id)}>← 上一期</button>
          <button onClick={() => home()}>首頁</button>
          <button disabled={issue.number === issues.length} onClick={() => goIssue(issues[issue.number].id)}>下一期 →</button></div></div>}
          <section className="library" aria-labelledby="library-title">
            <div className="library-heading">
              <div>
                {shelf && <p className="section-kicker">留住喜歡的故事</p>}
                {shelf ? (
                  <h1 id="library-title">我的收藏書架</h1>
                ) : (
                  <h2 id="library-title">本週目錄</h2>
                )}
                {shelf && <p>收藏的文章，都在這裡等你。</p>}
              </div>
              <div className="search-box">
                <label htmlFor="search">找一篇讀物</label>
                <input
                  id="search"
                  type="search"
                  placeholder="搜尋月亮、森林、心情…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="shelf-filter" aria-pressed={shelf} onClick={() => setShelf(!shelf)}>{shelf ? "顯示本週全部" : "只看本週收藏"}</button>
            <div className="topic-tabs" aria-label="文章分類">
              {topics.filter(t => t === "全部讀物" || issueArticles.some(a => a.category === t)).map((t) => (
                <button
                  key={t}
                  className={topic === t ? "active" : ""}
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="result-count" aria-live="polite">
              {list.length} 篇讀物{query && " ·「" + query + "」的搜尋結果"}
            </p>
            <div className="book-grid">
              {list.map((a) => (
                <article className="book" key={a.id}>
                  <button
                    className="book-open"
                    onClick={() => open(a.id)}
                    aria-label={"閱讀" + a.title}
                  >
                    <div className="book-image">
                      <img
                        src={asset(a.image)}
                        alt={a.title + "插畫"}
                        width="1200"
                        height="720"
                        loading="lazy"
                      />
                      <span className="book-number">
                        {String(issueArticles.findIndex((x) => x.id === a.id) + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="book-copy">
                      <div className="book-meta">
                        <span>{a.category}</span>
                        <span>
                          {a.level} · {a.minutes} 分鐘
                        </span>
                      </div>
                      <h3>
                        {a.title}
                        <span aria-hidden="true">↗</span>
                      </h3>
                      <p>{a.subtitle}</p>
                    </div>
                  </button>
                  <div className="book-bottom">
                    <span>
                      {memory.done.includes(a.id)
                        ? "✓ 已讀完"
                        : memory.last === a.id
                          ? "正在閱讀 · 第 " + ((memory.pages[a.id] || 0) + 1) + " 頁"
                          : "準備好，發現新世界"}
                    </span>
                    <button
                      aria-label={(memory.saved.includes(a.id) ? "取消收藏" : "收藏") + a.title}
                      aria-pressed={memory.saved.includes(a.id)}
                      onClick={() => bookmark(a.id)}
                    >
                      {memory.saved.includes(a.id) ? "★ 已收藏" : "☆ 收藏"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {list.length === 0 && (
              <div className="empty">
                <img src={asset("logo")} alt="" width="70" height="70" />
                <h2>{shelf && !query ? "書架正在等你的第一篇收藏" : "還沒找到這篇讀物"}</h2>
                <p>
                  {shelf && !query
                    ? "閱讀時按下「☆ 收藏」，下次就能很快找到它。"
                    : "換個關鍵字，或看看本期全部讀物。"}
                </p>
                <button onClick={() => { setShelf(false); setQuery(""); setTopic("全部讀物"); }}>看看全部讀物 →</button>
              </div>
            )}
          </section>
          <section className="passport">
            <div className="passport-intro">
              <span className="section-kicker">我的探索足跡</span>
              <h2>
                每一篇，
                <br />
                都是新發現。
              </h2>
              <p>
                已完成 <strong>{issueArticles.filter(a => memory.done.includes(a.id)).length}</strong> / {issueArticles.length} 篇<br />
                讀完文章，就能收下一枚發現章。
              </p>
            </div>
            <div className="stamps">
              {issueArticles.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => open(a.id)}
                  className={memory.done.includes(a.id) ? "earned" : ""}
                  aria-label={a.title + "，" + (memory.done.includes(a.id) ? "已完成" : "尚未完成")}
                >
                  <span>{memory.done.includes(a.id) ? "✓" : String(i + 1).padStart(2, "0")}</span>
                  <small>
                    {a.title}
                  </small>
                </button>
              ))}
            </div>
          </section></>}
        </main>
      )}
      <footer>
        <div>
          <img src={asset("logo")} alt="" width="30" height="30" />
          <strong>小小探索家</strong>
          <span>世界很大，好奇心慢慢長大。</span>
        </div>
        <p>繁體中文原創讀物 · 無需註冊 · 閱讀紀錄保存在此裝置</p>
      </footer>
    </div>
  );
}

