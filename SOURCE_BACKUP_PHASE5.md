# 第五階段備份與回復

正式原始碼 ZIP 與私人歸檔分開保存於 outputs/phase5-release-2026-10-15/。私人歸檔不得上傳 GitHub／Pages；內含歷次審閱、未採用原稿、生成證據與原始輸出。正式包包含核准來源、素材、鎖定檔、測試、部署設定及docs成品，不含憑證與node_modules。

還原：把正式ZIP解壓到新的空資料夾，安裝Node.js 22或24，依序執行 npm ci、npm run lint、npm test、npm run build。依賴下載需要網路；瀏覽器測試另安裝Playwright Chromium。不得覆蓋原工作目錄。

回復網站：保留當時main，建立修復分支，以第四階段b67ebfd或所需備份比對，只回復有問題檔案；保留後續文章ID與讀者格式。建立新commit、測試、PR合併後由既有Actions發布。不得force push或刪歷史。第五階段新增文章不要為回復介面問題而一併刪除。

Git／ZIP不包含孩子瀏覽器的收藏、閱讀進度與偏好；不能救回已清除的瀏覽器資料。即時Web Speech不是預錄音檔，沒有可打包的真人音訊，離線能力依裝置。

實際檔名、SHA-256、還原命令與結果將記錄在同資料夾MANIFEST.json與RESTORE.md；需完成還原後才能宣稱成功。

