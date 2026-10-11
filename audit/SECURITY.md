# 隱私與資訊安全稽核

2026-10-11，範圍為最新主分支基準及本次修正候選。自動結果 SECURITY_SCAN.json；不宣稱完成外部滲透或 Git 全歷史憑證鑑識。

- 本站無帳號、表單後端、資料庫、付費 API、廣告與分析 tracker；正式來源程式未見 fetch／XHR／sendBeacon／WebSocket 傳送閱讀紀錄。圖片與程式自同源載入；參考資料是使用者點選的外部連結。
- `explorer-magazine-v1` 保存原始／重製收藏與進度、字級與暖紙；`explorer-challenge-v1` 保存挑戰；`explorer-speech-v1` 語音偏好；`question-planet-readings-v1` 保存故事／低年級進度與注音；sessionStorage `planet-archive-random` 僅本次隨機歷史。未清除或改格式。
- 關於本站已補充 GitHub Pages 為安全用途記錄 IP。依據 [GitHub 官方說明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection)。瀏覽器儲存不等於託管服務完全沒有紀錄。裝置遠端語音可能把朗讀文字送供應商，本站不保證離線。
- 常見 token／私鑰格式與敏感檔名掃描無命中；結果不包含疑似秘密的原值。沒有將帳號憑證打包。此結果不保證能辨識所有任意格式的秘密。
- React 以一般字串渲染，正式 src 掃描未見 dangerouslySetInnerHTML、innerHTML 賦值、eval。外部資料連結固定於教材，非讀者輸入；新開視窗保留 noreferrer。無伺服器可上傳惡意文章。localStorage 仍可由裝置持有人修改，不能當可信身分。
- 私人第五期10檔對既有 SHA 完全一致。正式 docs 逐檔掃描其 ID、標題、全部正文段落無命中；沒有私人 JSON／圖像路徑或 `.local-review` 檔案被 Git 追蹤。不是只隱藏導覽。
- npm audit（2026-10-11）：223 鎖檔套件，0 已知漏洞。漏洞資料庫會更新；這不是永久安全保證。React／DOM／scheduler 完整 MIT 告知隨站發布。
- public 與 docs 未發現字型二進位、預錄音訊、第三方音效／音樂。Web Speech API 的聲音來自装置／瀏覽器，不是網站持有可下載授權的聲音庫。

## 風險與處理

隱私文字未明示 hosting IP：C → 已補正，測試確認。沒有證據顯示本站曾上傳孩子閱讀紀錄。裝置語音服務、iOS／Android 真機與正式商標仍 B；不影響本機閱讀，但不得保證語音全面離線或完全一致。沒有已確認 D 級資訊安全問題。

## 實機快速檢查（尚未執行）

1. iPhone Safari／Android Chrome 打開正式網址，不登入；直橫切換並放大字級。
2. 各讀一篇低年級、原始期刊、重製文章、故事：聽這頁→暫停→繼續→停止→換頁，確認不重疊。
3. 英文挑戰聽資料與單一選項，核對英文→中文；切只英文；測 0.9／1.2／1.5／1.8 與聲音選擇。
4. 收藏、做到一半關頁再開，確認進度；注音切換後重整仍保留。
5. 長篇故事播放時鎖屏／切 App 再回來，記錄是否中斷；不同装置允許不同限制，不保證背景連播。

如發生問題，僅提供裝置／瀏覽器版本及功能步驟，不需要孩子姓名、診斷或私人經驗。
