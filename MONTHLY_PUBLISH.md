# 每月新增期刊：操作流程

目前是 React＋JSON 靜態網站，不需要付費服務、帳號、資料庫或後台。原版與挑戰版分別編號，不必每次一起增加。

## 先準備，再公開

1. 建立內容工作分支，先看 AGENTS.md 與 PROJECT_PLAN.md。不要覆蓋舊檔案。
2. 原版複製 `templates/magazine-issue.json` 到本機 `.local-review/week-新期數.json`；文章欄位可參考 `templates/article.json`。每篇三頁，每期四篇。挑戰版範本是 `templates/challenge-issue.json`，四類單元各 5～8 步。
3. 換成沒有用過的期刊、文章、單元 ID。ID 使用小寫英文與連字號；已公開後永遠保留。期數可以跳號，上下期依排序後的相鄰 ID 導覽。
4. 填好正文、題目、答案、詞語、說明、開放思考。開放題不評定人格，不要求兒童寫出私密經驗。數學答案要另外算一次；安全知識查可靠來源。
5. 原版新圖先放 `.local-review/assets/新檔名.svg`。自行製作或取得明確授權，記錄工具、AI 使用、參考資料與人工修改。不要把憑證、契約或兒童個資放進專案。
6. 複製 `templates/source-record.json`，為每篇教材與每張圖片填一筆。`creator`、`aiUse`、`thirdParty`、`licenseBasis`、`evidence`、`humanChanges` 不能空白；未知就先留待確認，不能當作已取得權利。
7. 英文教材以 `translations` 對齊完整英文句子與自然繁體中文，詳 CHALLENGE.md。不能用翻譯偷偷給答案。中文題目的單位沿用既有語音正規化；新表格要實際聽一次確認不漏資料。
8. 原版執行 `npm run build:review`，開 `.local-review/preview/standalone.html`，一次審閱整期。它包含圖片與既有朗讀功能；瀏覽器語音是否可用仍依裝置而定。挑戰版目前沒有私人草稿匯入器：先在不公開的本機副本測試，不要把未核准教材提交到公開分支。
9. 管理者確認正文、答案、安全知識及權利紀錄後，才將原版 JSON 移到 `src/content/week-新期數.json`，圖片移到 `public/assets/`；挑戰版移到 `src/content/challenge/`。來源紀錄移到 `sources/`。設定 `status: "published"`、真實 `publishedAt: "YYYY-MM-DD"`、審閱者／代號 `reviewedBy`、`sourceRecord` 路徑，來源紀錄整期與每筆設 `reviewStatus: "approved"`。不要預填未來日期，也不要編造舊期刊日期。
10. 執行 `npm run validate:content`、`npm run lint`、`npm test`、`npm run build`，再執行三套既有 browser 測試與 `npm run test:archive`。保留舊內容保護測試，不能改答案基準來讓測試通過。
11. 檢查手機、平板、桌機的閱讀、資料回看、語音、圖片與收藏。只有瀏覽器模擬時，不寫成實機測試。
12. 更新 PROJECT_PLAN.md、CONTENT-SOURCES.md、ASSET_AUDIT.md，提交並依當次授權合併 main。既有 GitHub Actions 會建置並部署；不用改 Pages 設定。開正式網址檢查最新一期、歷期及舊文章。

## 自動與人工各做什麼

- 程式自動載入 `week-*.json`，依各版期數排序，最大期數是最新一期。圖書館與全文搜尋自動納入新文章。挑戰版沒有第五期就不會產生假的第五期入口。
- 舊四期沒有可靠出版日期，顯示「出版日期未記錄」。新期填日期後，自動出現在年月選單。
- 驗證器檢查格式、重複 ID／期數、圖片、選項答案範圍、步驟、翻譯、來源登錄、審閱狀態及日期；build 也會執行。它無法替代對數學、知識正確性、自然翻譯與授權的人工審閱。
- `.local-review/` 已忽略，不可 `git add -f`。正式建置的虛擬模組是空陣列，草稿正文與圖片完全不納入；不是只在畫面上隱藏。
- 新增內容不改三個 localStorage 鍵，不刪舊 ID。Git／原始碼 ZIP 不含孩子裝置上的收藏與進度，也不會跨裝置同步。
- 每月四期就重複以上流程四次，各自保留新 JSON 與來源紀錄；不需要修改網站主元件。
