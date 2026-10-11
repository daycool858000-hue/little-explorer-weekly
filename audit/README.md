# 第四階段公開後稽核｜2026-10-11

基準：main `72a8a5b308b0d6058bc40cc0f6a93c3009398fc4`。工作分支 `audit/phase4-final-2026-10-11`；回復點 `backup/pre-final-audit-2026-10-11`。本目錄供管理者審閱，沒有放進 public／docs。公開 repository 仍能讀到這些非敏感摘要；私人證據另存 `.local-review/`，不提交。

## 文件索引

- [逐項權利清冊 JSON](RIGHTS_INVENTORY.json)／[Excel 可開啟 CSV](RIGHTS_INVENTORY.csv)：教材、題目、素材、程式、字型及服務。每項包含用途、證據種類、允許範圍、限制、日期、風險與下一步。
- [套件逐項授權清單](PACKAGE_LICENSES.json)：package-lock 全部直接／間接／選用平台套件，不只兩個 runtime dependencies。
- [逐篇內容檢查](CONTENT_REVIEW.json)／[內容校對說明](CONTENT_REVIEW.md)。
- [商標紀錄](../BRAND_REVIEW.md)、[安全報告](SECURITY.md)／[可重跑掃描結果](SECURITY_SCAN.json)。
- [最終驗收](FINAL_ACCEPTANCE.md)、[必要更正雜湊](APPROVED_CORRECTIONS.json)。

## 如何解讀

A：查核範圍內有足夠依據，不是絕對法律保證。B：待補證據，不能寫成已授權。C：存在具體疑慮，要處理。D：明確重大風險，應最小必要暫停公開。已修正的 C 不從歷史紀錄消失；在 FINAL_ACCEPTANCE 列出前後狀態。

教材清冊一篇包含其正文、詞語、題目、答案與說明；挑戰版一單元包含六步及所有雙語、提示與解法。24 題回顧逐題列出。原始 16 篇與重製 16 篇分列，不合併權利判斷。圖片按來源檔逐檔，docs 的相同副本不重複計數；程式連同未打包的歷史版保守納入。CSS／TSX 內嵌背景、圖示屬對應程式檔項目。

科普來源網址支持知識，不是授權本站複製其文字。Git 提交證明檔案存在的版本，不證明創作人或排他權利。AI 生成紀錄也不是法律授權證明。

## AI 與自有內容

已知 AI 協作來源不代表完整原創證明。現有稿件／SVG／程式缺少逐件當時的帳號方案、輸入素材、模型與服務條款存證；均保留 B。2026-10-11 閱讀 [OpenAI 使用條款](https://openai.com/policies/terms-of-use/)：條款中的產出權利安排受法律限制，產出可能不唯一，亦不替第三方內容清權。不能用現在的條款倒推所有歷史作品適用情況。

沒有發現程式資料中宣稱教育部／教師認證的肯定宣告；審閱文件明示未經機構審定。關鍵字與重複掃描不是全文外部原創性比對；目前沒有可靠逐篇外部查重證據。應先由管理者補原始產製紀錄，再對特殊情節／圖像作權利審閱。未發現可確認的 D，不能因此宣稱不存在未知風險。

## 第三方圖片與字型

5 張官方照片逐項保留署名、來源與條款：NASA 月球、NASA／NOAA 地球、NASA／USGS 臺灣影像、USDA 麵包、NOAA 珊瑚。2026-10-11 重新讀取官方來源與 [NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/)、[USDA](https://www.ars.usda.gov/oc/images/copyright/)、[NOAA](https://oceanservice.noaa.gov/about/faq.html)使用規則；目前教育資訊展示、不暗示背書，非官方 logo 商品化。NASA 的第三方權利例外、NOAA 不冒稱修改素材為官方、USDA 署名仍要保留。未對照片聲稱本站排他著作權。

字型僅 CSS 引用裝置已安裝的 Arial／Noto Sans TC／PingFang TC／Microsoft JhengHei／sans-serif，無字型檔或外部字型請求。這不授權未來把字型檔下載再散布。

## 套件義務

React、React DOM、scheduler 實際 LICENSE 已保留在 `public/THIRD-PARTY-NOTICES.txt`，正式 build 複製至網站。MIT 要保留著作權及許可文字；BSD 要保留其聲明／條件／免責；Apache-2.0 要保留授權及適用 NOTICE／修改告知。其他套件以逐項原 LICENSE 為準。本案不將 node_modules 打包進 ZIP 或網站；選用平台尚未安裝、缺少實際授權檔者保留 B，不假稱全部授權全文已核對。

根目錄未新增正式 LICENSE。公開 repository 不代表教材任意改作販售。分享連結與授予重出版權是不同事項；自有程式與教材要分開決定授權，待管理者確認，沿用 CONTENT_RIGHTS.md 草案。

## 維護

新增／替換教材素材時補原始證據與來源，執行 `node scripts/final-audit.mjs`，人工核對風險，不以自動掃描代替法律判断。此腳本在原開發環境會另外核對私人第五期雜湊；ZIP 還原不含私人草稿，不需執行這項私人核對。npm audit 需網路；原始碼備份不含瀏覽器收藏或供應商聲音資源。
