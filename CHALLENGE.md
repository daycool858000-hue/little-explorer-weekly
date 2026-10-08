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

## 英文雙語內容怎麼填

英文探索的單元多一個 `translations` 欄位。左邊填原本欄位的完整文字，右邊放一組或多組英文／中文句子。例如：

```json
"translations": {
  "Mia has NT$200. She wants two drinks.": [
    { "en": "Mia has NT$200.", "zh": "Mia 有 200 元。" },
    { "en": "She wants two drinks.", "zh": "她想買兩杯飲料。" }
  ],
  "Can you say that again, please?": [
    { "en": "Can you say that again, please?", "zh": "可以再說一次嗎？" }
  ]
}
```

情境、標題、題目、指示、選項、表格標題、欄位、每格資料及備註都可用相同方式填寫。左邊必須和原本內容完全相同；同一段有多句時，請一組一組配對，保留英文原句。不要自動用句點切句，因為 `p.m.` 之類的縮寫也有句點。

原本就是中文的指示，也可用原中文作為左邊的索引，右邊 `en` 放自然英文、`zh` 放原中文。中文只翻譯題意，不加「看哪一列」或答案提示；原本提示仍放在 `hints`。新增第 5 期同樣只要填 JSON，朗讀與雙語畫面會自動套用。

## 朗讀的使用方式

- 原版文章：按「聽這一頁」，只念目前頁面的標題與內容；最後一頁可另外按「聽題目」，不念選項或解答。
- 挑戰版：可以分開聽資料、題目，或按選項旁的喇叭。聽資料會展開前面的情境，資料表也一直可看。按喇叭不會替你選答案。
- 播放後可暫停、繼續、重新播放或停止。切頁、換單元、回首頁都會停止。全站不自動播放。
- 語速有 0.9×（慢速）、1.2×（一般）、1.5×（快速）、1.8×（更快速），新使用者預設 1.2×。已保存的舊 0.8×／1× 設定仍保留，選單會註明「先前設定」，選擇新速度後改存新值。
- 英文預設一句英文、再一句中文。英文轉中文停約 400ms，中文轉英文約 240ms；同語言、同區塊不額外停頓，不同區塊約 100ms。引擎本身的標點停頓與實際語速依裝置而異。可改成「只聽英文」。中文輔助開關只控制畫面，不會偷偷改變朗讀模式。
- 英文與中文各自使用不同語言的 SpeechSynthesisUtterance，優先選 en-US 與 zh-TW。實際聲音與可用語言由裝置提供；沒有指定 voice 時交給瀏覽器依語言選擇。若無法發聲，文字、翻譯、作答、提示與進度仍可使用。
- 偏好獨立保存在 `explorer-speech-v1`，不修改原版或挑戰版的進度。部分手機語音引擎續播不穩定時，會從目前的短句／段落重新接上。

共用程式位於 `src/speech/`，沒有外部 TTS、金鑰、帳號或付費服務。語音介面依照 [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) 與 [SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance) 使用。

## 語音文字與聲音設定

`src/speech/normalize.ts` 只在文字送進語音引擎前轉換數字、貨幣、時間、百分比、分數、運算符號與計量單位，不改畫面與 JSON。例如英文 `NT$200` 讀成 `two hundred New Taiwan dollars`，中文 `1.5 L` 讀成「一點五公升」、`200 mL` 讀成「兩百毫升」。中文句子中的單位維持中文語音；英文教材與翻譯各用自己的語言。

`src/speech/tables.ts` 依既有表格的實際欄位組合敘述，保留價格、時間、數量、備註與方案條件。例如交通方式表讀成「步行的人有二十人」，英文菜單逐項讀名稱與價格。未來新表格有保留全部欄位關係的通用朗讀；如需更自然的情境敘述，可在這個語音專用檔案增加模板，不必改題目或答案。

「聲音設定」可選中文及英文聲音，偏好同樣存於 `explorer-speech-v1`。自動選擇先比對語言，優先 zh-TW／en-US，再參考聲音名稱的 Natural、Enhanced 等提示與瀏覽器預設；這些名稱並不保證品質，也不把「本機聲音」當成比較自然的依據。裝置沒有原先選擇的聲音時會回到合適語言的自動選擇。聲音清單、口音、語速與暫停表現仍受作業系統和瀏覽器限制，需要在實體手機聆聽確認。

`npm run test:speech` 執行可重現的語音瀏覽器模擬；也可以設定 `BASE_URL` 檢查公開網站。模擬會核對 utterance 文字、語言、voice、順序及控制事件，不能代替實體 iPhone／Android 的聲音測試。

