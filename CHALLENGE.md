# 五六年級挑戰版

公開入口：<https://daycool858000-hue.github.io/little-explorer-weekly/#challenge>

原版四期與 16 篇文章保留；首頁只增加新入口。挑戰版另外提供四期、16 個單元、96 個短步驟，內容不混在原版文章列表。

## 新增第 5 期

1. 複製 `src/content/challenge/week-4.json`，把新檔案命名為 `week-5.json`。
2. 把最上面的 `id` 改成 `week-5`，`number` 改成 `5`，填入新期名與簡介。
3. 換掉四個單元的內容。每個單元的 `id` 要取一個未使用過的英文名稱。
4. 保持數學、英文、閱讀、綜合四個單元的順序。每個單元保留 5～8 步，`id` 依序是 `s1`、`s2`……。
5. 檢查答案、兩層提示與解說後，提交至 GitHub 的 main。既有 Actions 會檢查並發布。

畫面會自動讀到新增檔案，不需要修改首頁或閱讀介面。第一次新增時，可請協助維護的人一起補上新數學題的計算驗證；測試會提醒尚未驗證的數字題。

## 內容欄位

- `visual`：表格標題、欄位名稱與資料列；可放在單元或個別步驟。圖表應幫助解題。
- `kind`：`read` 看情境、`choice` 單選／是非、`number` 數字、`select` 複選、`order` 點選排序、`estimate` 先猜、`reflect` 沒有唯一答案的取捨。
- 單選答案 `answer` 是選項位置，**第一個是 0**。複選與排序用位置陣列；數字題直接填數字。
- `hints`：先給方向，再給更明確的線索；不要第一個提示就寫答案。
- `explanation`：簡短解法。開放題可在 `replies` 為每個選項提供不同回饋。
- `skills`、`takeaways`：完成後的能力摘要與三件重點。

價格、班表、實驗結果都是教學用的虛構情境。

## 進度與使用

不用登入。進度保存在這台裝置、這個瀏覽器的 localStorage（`explorer-challenge-v1`），與原版分開。關閉頁面後回來，可以從挑戰版首頁繼續。換裝置或清除瀏覽器資料後，進度不會同步；瀏覽器禁止儲存時仍可做題，頁面會說明無法保存。

沒有新增付費服務、資料庫、API、後端或執行期第三方連線。沿用 React、Vite、GitHub Actions 與 GitHub Pages。

## 維護檢查

`npm run lint`、`npm test`、`npm run build`、`npm run test:browser`、`npm run test:challenge`。

瀏覽器測試需要 Playwright Chromium（`npx playwright install chromium`）。挑戰版測試可設定 `BASE_URL` 為公開網址，檢查部署版本。

`tests/fixtures/original.json` 保護原版文字、圖片、CSS 與閱讀實作。不要為了讓測試通過而重新產生這份基準。
