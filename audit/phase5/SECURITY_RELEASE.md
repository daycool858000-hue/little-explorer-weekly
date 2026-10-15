# 第五階段發布前安全查核（2026-10-15）

- 正式基準：b67ebfde1fa4ef3b5c603f59e580335cc8d125b0；審閱基準：3fcb6be（images6）。
- GitHub 公開 main 回應 protected=false；rulesets 回應空陣列。
- 目前 GitHub connector 可以進行一般程式提交，但分支保護 API 回應 403 Resource not accessible by integration，未提供管理規則寫入能力；未擅自降低、繞過或移除保護。
- 尚未設定禁止強制推送／刪除。管理者可到 repository → Settings → Rules → Rulesets → New branch ruleset，指定 main，啟用 Restrict deletions 與 Block force pushes。本次發布使用正常分支及 PR，不使用 force。
- 無法列出完整協作者及所有 GitHub Apps／OAuth Apps 權限，也不能可靠讀取帳號 2FA。這三項需管理者自行確認，不宣稱查核完成。
- 協作者：repository Settings → Collaborators；帳號工具授權：個人 Settings → Applications；雙重驗證：個人 Settings → Password and authentication。
- 不撤銷任何既有工具權限，不要求關閉 2FA。
- 本輪不改 localStorage 格式；收藏、閱讀位置、語音選擇仍保留在各讀者瀏覽器。Web Speech 可能由裝置供應商處理遠端合成，不宣稱必然離線。
- 原第五期只有兩篇經全文比對後以獨立作品採用；其餘正文、原四張私人圖片、審閱包及證據檔不在公開來源／建置。
- 既有第四階段 425 筆清冊及 A171／B253／C1／D0 原狀保留，不因本輪發布改為已確認。

本文件記錄已完成與不能讀取的範圍；不是 GitHub 帳號安全的全面認證。

