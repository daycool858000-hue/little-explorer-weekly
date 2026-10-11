# 第四階段收尾驗證報告

更新：2026-10-11。最新管理者指令已將 16 篇故事、4 篇低年級讀物與正式發布納入第四階段。第五期心理與生活仍不得公開。部署實際結果記錄於本文件最後，不把本機完成當成已上線。

## 完成／未完成對照

| 項目 | 實際狀態 |
| --- | --- |
| 深色首頁、六主題與分齡導覽 | 已開發並測試；海軍藍、地球合成影像、雜誌卡片；正文淺色 |
| 三四年級 16 篇重製 | 已整合初步認可的完整正文、題目、圖片及來源；保留原 ID、三頁路由與原始 JSON |
| 故事館 16 篇 | 完整短篇、詞語／背景、開放思考、情境圖、整篇朗讀、收藏與接續閱讀已完成 |
| 一二年級第一期 4 篇 | 正式入口、短篇、全文顯式注音、開關、朗讀、理解題及生活活動已完成 |
| 挑戰版 16 單元／96 步 | 教材、答案、雙語及邏輯保留；五尺寸逐步完成測試通過 |
| 共用語音 | 沿用第三階段系統；文字、語言、語速、雙語順序、控制及切頁取消均已測試 |
| 收藏、進度、搜尋、歷期、字級與暖紙 | 舊儲存鍵與路由保留，新讀物新增獨立段落進度鍵；回歸通過 |
| 私人第五期 | 10 檔雜湊與基準一致，Git 未追蹤，正式成品不含其正文或圖片 |
| 圖像與來源管理 | 已更新，無新增付費服務；台灣衛星圖壓縮至約 233KB，私人原檔保留 |
| 候選 ZIP 乾淨還原 | 重新安裝、Lint、32 項單元、build、五尺寸閱讀回歸通過；另新增 2 項發布安全測試 |
| 正式部署 | 見下方實際部署紀錄 |
| 多章節、分支故事、角色配音、逐句跟讀 | 尚未開發，不冒充本次已完成，也不擅自展開後續工作 |

## 全文與檔案

- [16 篇故事全文、主題、問題及來源](review/stories.html)，[純文字版](review/stories.md)。
- [四篇低年級全文與注音](review/junior.html)，[純文字版](review/junior.md)。
- [注音校對語境與方法](review/ZHUYIN_REVIEW.md)：逐句顯式標音，未宣稱教育部審定或教師簽核。
- [原 16 篇重製全文、題目與來源](review/remade-16.md)、[編輯規劃](review/editorial-plan.json)。
- [來源及權利紀錄](review/PHASE4_SOURCES.md)。圖片逐項資料：src/planet/media-records.json、sources/phase4-scenes.json、sources/earth-nasa.json。

主要程式：src/planet/Design.tsx、ReadingLibrary.tsx、planet.css、library.ts。資料位於 src/planet/content、stories、junior。新圖片在 public/story-scenes。較早的第四階段語音修正會在已知缺少指定語言聲音時提示，避免用另一語言冒充；本次沒有另造語音引擎或更改挑戰答案。

## 測試結果與限制

375、390、768、1024、1440px：原版每尺寸 48 頁／16 題、挑戰每尺寸 96 步、新讀物每尺寸 20 篇；檢查圖片、溢出、收藏、進度、重整、搜尋及注音。結果 JSON 見 review/verification。

語音採確定性瀏覽器模擬，比對實際送入引擎的文字與語言。375px 包含原版 48 頁及挑戰 96 步，其他尺寸各 3 頁／60 步；20 篇新讀物完整正文與問題另測，注音不進語音內容。暫停、繼續、重播、語速、偏好、雙語、無語音／失敗回退皆通過。沒有 console error、破圖或非預期外部資源請求。

**實體 iPhone／Android 語音尚待驗證**，包含音色、長時間播放、背景及鎖屏。沒有真人音檔，不保證所有裝置離線語音。主 JS 約 178KB gzip；Vite 未壓縮 chunk 超過 500KB 提示仍保留。npm 安裝回報 0 vulnerabilities，但現有 ESLint 有版本支援提示；未任意升級工具鏈。

32 個外部參考連結中，22 回應 200，10 回應 403，沒有回報 404。403 表示來源站拒絕自動存取，不能宣稱全部來源網頁均可用；記錄見 sources/phase4-link-results.json。教材及圖片本機提供，不依賴外部參考頁載入。

正式商標、自有內容授權、部分舊素材創作證據仍待人工確認。AI 產製紀錄不等於完整法律審查或百分之百排他權利。沒有增加 API 費用、會員、資料庫、廣告或追蹤。

## 備份及回復

工作分支：feature/phase4-complete-2026-10-10。發布前正式回復點：cd5c345abc74a4f28e5ee2cdae206ace6ca99dd7，backup/pre-phase4-release-2026-10-10。開發 checkpoint：0cd5073、3e9aae0。

候選 ZIP：question-planet-phase4-release-candidate-2026-10-10.zip，SHA-256 `49e523c239dc22863b487b196c1cde7ffecb7126144929e5aa1810eea1ca0860`。已解壓至獨立 phase4-release-restore-2026-10-10，重新 npm ci、Lint、test、build、test:browser 通過。最終 ZIP 與雜湊另列於發布紀錄。

下載後另存外接硬碟。解壓到空資料夾，以 Node.js 22／24 執行 npm ci、npm run build、npm run preview。回復正式站採新修復分支及新提交，不 force push；細節見 SOURCE_BACKUP.md。

ZIP 不含私人第五期、憑證、node_modules、Git 歷史或孩子瀏覽器資料。沒有預錄音檔可打包。第五期私人備份與原始檔均保留；收藏、進度與偏好仍只在各自瀏覽器。

