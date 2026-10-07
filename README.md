# 小小探索家週刊 Little Explorer Weekly

給國小三～六年級的靜態閱讀網站。四期、16 篇、48 個閱讀頁面。無登入、無資料庫、無 AI API、無付費服務。程式與所有插圖都包含在專案內。

## 先看成品

用 Chrome 或 Edge 開啟 `preview/standalone.html`，即可在電腦直接預覽，不需要啟動伺服器。這是包含程式與圖片的單檔副本，不是公開網址。手機、平板請以部署後的 HTTPS 網址閱讀。

`docs/` 是正式網站的完整靜態檔案。不要直接雙擊 `docs/index.html`；它應由網站伺服器提供。預覽單檔與正式網站使用同一份 React 程式和內容。

## 本機操作

安裝 Node.js 22.13 或更新的 LTS 版本後，在本資料夾執行：

```sh
npm ci
npm run dev
```

完成修改後：

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

build 更新 `docs/` 及 `preview/standalone.html`。瀏覽器測試結果位於 `test-results/report.json`，測試截圖也放在該資料夾。無需安裝資料庫或設定 API key。

## 如何增加第 5 週

1. 複製 `src/content/week-4.json`，改名 `week-5.json`。
2. 將最上方 `id` 改為 `week-5`、`number` 改為 `5`，填寫本期標題和介紹。
3. 把 `articles` 裡的文章換成新文章。每篇 `id` 都要使用沒用過的英文名稱；保留每篇三頁、每頁短段落的格式。每期至少四篇。
4. `image` 與 `cover` 填插圖檔名，不包含 `.svg`。把圖片放到 `public/assets/`。也可以先選用現有圖片。
5. 填寫選擇題 `question`、選項 `options`、答案 `answer`。第一個選項用 `0`，第二個用 `1`，第三個用 `2`。`thinking` 是開放思考題，`hint` 是另一種想法，`task` 是生活小任務。
6. 執行 lint、test、build，檢查預覽，再發布。首頁會自動加入新一期，期數最高的會標為最新，不必修改 UI。

這裡的「每週」是內容編排，不會自動產生或定時上架文章。所有更新由大人人工完成。

## GitHub Pages：最少步驟發布

1. 在自己的 GitHub 建立新的 **Public** repository，名稱使用 `little-explorer-weekly`。只有管理網站的大人需要 GitHub 帳號，孩子不需要。
2. 將 `docs/` **裡面的檔案與 assets 資料夾**上傳到 repository 的根目錄。根目錄必須直接看到 `index.html`，不要只上傳 ZIP。
3. 開啟 repository 的 **Settings → Pages**。
4. Source 選 **Deploy from a branch**，分支選 `main`、資料夾選 `/(root)`，按 Save。
5. 等 Pages 顯示發布成功，再開它提供的網址。以無痕視窗測試首頁、四期目錄和一道題目，確認沒有登入畫面。

之後修改文章，先重新 build，再用新的 `docs/` 內容更新 repository。

## 希望之後更新自動發布

也可以把整個原始碼專案放進新的 repository，排除 `node_modules/`、`test-results/` 和 `preview/`。保留 `package-lock.json` 和 `.github/workflows/pages.yml`。在 Settings → Pages 把 Source 選為 **GitHub Actions**。此後每次更新 main 分支，工作流程會先 lint、test、build，再發布 docs。首次設定 Pages 前，工作流程可能失敗；完成設定後到 Actions 重新執行即可。

兩種發布方式擇一使用。免費公開 repository 的 Pages 不需要購買主機或網域；不要為這個專案新增付費服務。

GitHub 官方說明：[Pages 是什麼](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[設定發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 閱讀資料與離線

收藏、字級、閱讀頁數及發現章只存在這個瀏覽器的 localStorage，不會傳送給任何人，也不會在不同裝置同步。無法儲存時仍可閱讀。從舊網站換到新網址，瀏覽器不會自動搬移舊站紀錄。

保留簡單 manifest 與 SVG 圖示；正式網站需要網路，不包含 service worker，也不保證每種裝置都出現安裝提示。Safari / Chrome 直接開啟網址才是主要使用方式。
