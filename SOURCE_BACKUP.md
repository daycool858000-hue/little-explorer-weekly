# 原始碼備份與回復

穩定語音版本：ec3f8792875eaeabc0a78a6f3889212d587c6cdf。備份分支 backup/stable-speech-2026-10-09 保持不變。

已使用 git archive 產生獨立 ZIP：little-explorer-stable-speech-ec3f879.zip，交付於本機 outputs/。SHA-256：CFB24C4F8E1B205D5EEC9C54DC96DC1847F16920A44569FBBDD65E3F1935A31E。只打包該 commit 的已追蹤網站檔案，不包含 .git、node_modules、私人憑證、未追蹤檔案或第五期草稿。另可從 [GitHub 備份分支](https://github.com/daycool858000-hue/little-explorer-weekly/tree/backup/stable-speech-2026-10-09) 的 Code → Download ZIP 下載同版本來源；GitHub 自製 ZIP 的雜湊不一定與本機 ZIP 相同。

要在自己的電腦保存：把 ZIP 複製到另外一個安全資料夾或外接硬碟。需要查看時解壓縮；已含 docs 建置成品。要繼續開發，安裝 Node.js 後在解壓縮資料夾執行 npm ci、npm run build。下載相依套件需要網路。

要回復正式網站：先保留當時 main，建立修復分支，比較備份檔案；優先只回復故障程式，保留之後新增的教材和 ID。提交新的回復 commit，執行完整測試後依授權合併 main，沿用既有 Actions。不要刪 Git 歷史、強制推送或覆寫備份分支。ZIP 是原始碼快照，不含 Git 提交歷史；完整歷史仍在 repository。

**GitHub／ZIP 備份不包含讀者裝置的收藏、閱讀進度及語音偏好。** 不會回復被清除的瀏覽器資料，也不提供跨裝置同步。第五期審閱素材另放本機，不應上傳到公開備份。

第三階段另有 `question-planet-phase3-source-9fef643.zip`：本機提交 9fef643，與公開技術版 95d2c6a 的檔案樹相同（f75ad391332e42d9f504dbe43a8b84b27a9da4a7）。SHA-256：758798BEDFC3D332114DA944B5329EFE71613FDDDAC1FC76171F0F4D2647FCB5。最後文件整理完成後另提供日期命名的完整原始碼包，回復方式相同。
