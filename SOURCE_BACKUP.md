# 原始碼備份與回復

## 第四階段開始前確認（2026-10-09）

最新穩定版本 cd5c345abc74a4f28e5ee2cdae206ace6ca99dd7 已另建 `backup/pre-phase4-2026-10-09`，沒有覆寫舊備份。

沿用既有 `question-planet-phase3-source-2026-10-09.zip`，SHA-256：7D24E61D512DA7B3CB01FD099CCC35D23A510EC466244A68003BCC95716C3044。141 個 ZIP 項目與修改前工作樹逐檔核對相符；未含私人草稿、node_modules 或 .git。可從本機 outputs 複製保存，或到備份分支按 Code → Download ZIP 取得同版本（ZIP 雜湊可能不同）。

已解壓到獨立 `outputs/phase4-restore-cd5c345`，以 npm ci 從鎖定檔重新安裝，完成 lint、TypeScript、27 項測試、內容驗證、Vite build、離線 HTML 產生，以及原版、挑戰、語音、歷期目錄瀏覽器回歸。未覆蓋正式網站。原版瀏覽器測試第一次因尚未產生離線 HTML 失敗，補跑既有 scripts/preview.mjs 後完整重跑通過，未刪除測試。

第五期另存 `week5-private-preserved-phase4-2026-10-09.zip`，SHA-256：597DBE4A48BFFE1473173CC49B05631DB135A71B8A0782553AA17F3C29DF194D。10 個私人檔案（JSON、4 SVG、來源、整期審閱與預覽）逐檔比對通過；新 ZIP 正確保存中文檔名。原審閱 ZIP 仍保留不覆寫。私人審閱包不可提交公開分支。

第四階段最終核准版本尚未完成；改版完成後仍須產生新版來源 ZIP 與再次還原驗證。當前私人設計檔依 PHASE4_REPORT.md 保存，不能當成已發布新版。

穩定語音版本：ec3f8792875eaeabc0a78a6f3889212d587c6cdf。備份分支 backup/stable-speech-2026-10-09 保持不變。

已使用 git archive 產生獨立 ZIP：little-explorer-stable-speech-ec3f879.zip，交付於本機 outputs/。SHA-256：CFB24C4F8E1B205D5EEC9C54DC96DC1847F16920A44569FBBDD65E3F1935A31E。只打包該 commit 的已追蹤網站檔案，不包含 .git、node_modules、私人憑證、未追蹤檔案或第五期草稿。另可從 [GitHub 備份分支](https://github.com/daycool858000-hue/little-explorer-weekly/tree/backup/stable-speech-2026-10-09) 的 Code → Download ZIP 下載同版本來源；GitHub 自製 ZIP 的雜湊不一定與本機 ZIP 相同。

要在自己的電腦保存：把 ZIP 複製到另外一個安全資料夾或外接硬碟。需要查看時解壓縮；已含 docs 建置成品。要繼續開發，安裝 Node.js 後在解壓縮資料夾執行 npm ci、npm run build。下載相依套件需要網路。

要回復正式網站：先保留當時 main，建立修復分支，比較備份檔案；優先只回復故障程式，保留之後新增的教材和 ID。提交新的回復 commit，執行完整測試後依授權合併 main，沿用既有 Actions。不要刪 Git 歷史、強制推送或覆寫備份分支。ZIP 是原始碼快照，不含 Git 提交歷史；完整歷史仍在 repository。

**GitHub／ZIP 備份不包含讀者裝置的收藏、閱讀進度及語音偏好。** 不會回復被清除的瀏覽器資料，也不提供跨裝置同步。第五期審閱素材另放本機，不應上傳到公開備份。

第三階段另有 `question-planet-phase3-source-9fef643.zip`：本機提交 9fef643，與公開技術版 95d2c6a 的檔案樹相同（f75ad391332e42d9f504dbe43a8b84b27a9da4a7）。SHA-256：758798BEDFC3D332114DA944B5329EFE71613FDDDAC1FC76171F0F4D2647FCB5。最後文件整理完成後另提供日期命名的完整原始碼包，回復方式相同。
