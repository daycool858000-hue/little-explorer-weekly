# 素材來源與授權稽核紀錄

查核日：2026-10-09（台灣時間）。基準：`ec3f8792875eaeabc0a78a6f3889212d587c6cdf`。稽核分支：`docs/phase-2-rights-plan-2026-10-09`。

## 範圍、方法與結論界線

檢查 GitHub 最新 main／成功部署、Git 追蹤清單、八份教材 JSON 的全文（含題目、選項、答案、提示、解說、開放回應及四份英文翻譯）、18 份 SVG 原始碼、CSS／字型／圖示、語音程式、package-lock.json 與本機可取得的授權文件，並查看既有報告與首見 commit。來源參考連結與命名做有限公開網路查詢。沒有取得原始創作錄影、全部 AI 提示歷史、作者契約、付費素材收據或全網比對資料庫。

- **已確認**：檔案／程式／授權文字可直接核對的事實；不等於所有權已確認。
- **有疑慮**：存在具體缺口或相似線索，需處理；不等於已判定侵權。
- **待人工確認**：缺少產製、權利歸屬、契約或正式查詢佐證，不能代填「原創」「已授權」。
- 風險高／中／低是補件優先度，不是法院結論或侵權機率。程式碼檢查不是完整法律審查；免費教育用途不自動免除權利要求。

## 重要發現

| 狀態 | 發現 | 優先度與處理 |
| --- | --- | --- |
| 已確認 | 4 期／16 篇／48 頁，挑戰 4 期／16 單元／96 步；沒有額外隱藏故事、外部文章抓取或音檔 | 低；下列逐項清單涵蓋所有正文與教材 |
| 有疑慮 | 沒有每篇／每圖的作者、AI 工具、輸入參考或授權佐證；介面與 CONTENT-SOURCES.md 的「原創」是專案聲明，不是獨立證據 | 中；逐件補來源鏈與人類投入，不能證明百分之百原創 |
| 有疑慮 | 部署 bundle 含 React／React DOM／scheduler 版權標頭，卻未附其 MIT 完整許可文字，標頭提到的根目錄 LICENSE 不存在於部署內容 | 高；下一個經管理者同意的維護工作，附完整第三方告知到部署包。本次未動正式網站 |
| 已確認 | 根目錄無專案 LICENSE；不可因此把第三方開源程式視為本站專有 | 中；自有程式與教材分開選授權，見 CONTENT_RIGHTS.md |
| 待人工確認 | 名稱與 Logo 的商標近似及創作來源 | 中；本次非正式清權，詳命名節 |
| 已確認／待人工確認 | 使用 Web Speech API，無外部 TTS 套件／key／音檔；個別裝置的 voice 條款及遠端處理尚未查核 | 中；不宣稱任一聲音都可下載、錄製再發布或離線使用 |

## 製作來源紀錄的可信度

Git 首次匯入原版與 SVG 為 `1fde2e1`（Publish existing four-issue Little Explorer Weekly static project）。`完成報告.md` 記錄保留舊平台六篇文章與八張圖，另擴充內容；但沒有逐檔對照的產製來源、原始服務版本或授權快照。不能把匯入 commit 當創作日期，也不能只因目前脫離 Higgsfield 就認定歷史素材權利已處理。

挑戰主要教材出現在 `76c12ec`，英文翻譯在 `3ea310f`；對話脈絡顯示 AI 協助建立專案，但 repo 未記每個文字／SVG 的工具、提示及人類修改比例。因此逐件 AI 欄標示待確認；不武斷填全部純人工作品，也不武斷填每張圖都由某服務生成。自行編寫與第三方程式的區別是檔案用途分類，不是已確認著作權歸屬。

下表中的「未辨識明確引用」只表示內容未直接標示第三方著作摘錄／教材頁碼／受保護知名角色；不是抄襲檢測認證。常見科學事實、簡短英文句型與算式，需與具體文字表達、編排及插圖分別看待。

## 逐篇原版教材

每列範圍包含三頁正文、詞語、知識題／答案／解說、思考題／提示及生活任務。共同授權依據：未取得逐件權利證明；共同待確認：作者、人類創作投入、參考資料、是否翻譯／改編、AI 工具及當時條款。科學參考來源是查核線索，不等於取得來源文章或圖片的再利用授權。

| 素材名稱 | 位置 | 已知來源 | 是否 AI | 第三方情形 | 授權依據 | 狀態／風險 | 待確認事項 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 一滴水的奇妙旅行（water） | `src/content/week-1.json` → articles.water | 無逐篇來源紀錄 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 狐狸的慢慢郵局（fox） | `src/content/week-1.json` → articles.fox | 專案標示故事／虛構情境；無逐篇產製證據 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 螞蟻的無形路標（ants） | `src/content/week-1.json` → articles.ants | CONTENT-SOURCES：Smithsonian；本次原頁 404 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 把大世界摺進口袋（maps） | `src/content/week-1.json` → articles.maps | CONTENT-SOURCES：NPS 地圖概念 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 月亮真的會變形嗎？（moon） | `src/content/week-2.json` → articles.moon | CONTENT-SOURCES：NASA；舊網址已轉址 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 圖書館裡的神祕腳印（library） | `src/content/week-2.json` → articles.library | 專案標示故事／虛構情境；無逐篇產製證據 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 麵包裡的洞是誰挖的？（bread） | `src/content/week-2.json` → articles.bread | CONTENT-SOURCES：Exploratorium 酵母實驗 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 影子也有上下班時間？（shadows） | `src/content/week-2.json` → articles.shadows | 無逐篇來源紀錄 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 種子裡住著一座森林（seed） | `src/content/week-3.json` → articles.seed | 無逐篇來源紀錄 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 台灣為什麼有這麼多山？（taiwan） | `src/content/week-3.json` → articles.taiwan | CONTENT-SOURCES：USGS 研究摘要 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 珊瑚是石頭，還是動物？（coral） | `src/content/week-3.json` → articles.coral | CONTENT-SOURCES：NOAA 白化說明 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 一張紙也能當橋？（bridges） | `src/content/week-3.json` → articles.bridges | 無逐篇來源紀錄 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 心裡下雨的那一天（feelings） | `src/content/week-4.json` → articles.feelings | 專案標示故事／虛構情境；無逐篇產製證據 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 一本書怎麼變成一百本？（printing） | `src/content/week-4.json` → articles.printing | 無逐篇來源紀錄 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 只有兩種符號，也能傳訊息？（binary） | `src/content/week-4.json` → articles.binary | 無逐篇來源紀錄 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |
| 一句「你好」，有好多種樣子（culture） | `src/content/week-4.json` → articles.culture | 專案標示故事／虛構情境；無逐篇產製證據 | 待確認（有 AI 協助專案脈絡） | 未辨識明確引用；無法排除未記錄參考 | 未附個別授權／權利鏈 | 待人工確認／中 | 補作者、草稿、AI 與來源比對；不得據標示認定原創 |

## 挑戰版逐單元教材

每列包含 s1～s6 的情境、題目、選項、答案、提示、解法、開放回應、表格與備註；四個英文單元另含全部 translations（合計 148 索引、161 句對）。沒有發現明確課本／試卷出版者署名或引用標記，仍需創作紀錄與必要的來源比對。虛構商店 Sunny Café、人物 Mia／Leo 等不指認真實商家；通用名稱與句型不能證明整篇的專有性。

| 素材名稱 | 位置 | 已知來源 | 是否 AI | 第三方情形 | 授權依據 | 狀態／風險 | 待確認事項 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 一百元的果汁任務（market-math） | `src/content/challenge/week-1.json` → units.market-math | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| Mia 的點餐清單（menu-english） | `src/content/challenge/week-1.json` → units.menu-english | 首見教材 commit 76c12ec；含 3ea310f 雙語補充 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據、翻譯者及英文原稿來源 |
| 公告裡藏著哪些限制？（notice-reading） | `src/content/challenge/week-1.json` → units.notice-reading | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 幫八個人準備文具（budget-mix） | `src/content/challenge/week-1.json` → units.budget-mix | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 九百公尺要走多久？（walk-math） | `src/content/challenge/week-2.json` → units.walk-math | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| Can we get there by 9:40?（bus-english） | `src/content/challenge/week-2.json` → units.bus-english | 首見教材 commit 76c12ec；含 3ea310f 雙語補充 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據、翻譯者及英文原稿來源 |
| 看得到車班，就趕得上嗎？（transfer-reading） | `src/content/challenge/week-2.json` → units.transfer-reading | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 雨天怎麼走才從容？（route-mix） | `src/content/challenge/week-2.json` → units.route-mix | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 一半的人，是哪些人？（chart-math） | `src/content/challenge/week-3.json` → units.chart-math | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| Which message is newer?（message-english） | `src/content/challenge/week-3.json` → units.message-english | 首見教材 commit 76c12ec；含 3ea310f 雙語補充 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據、翻譯者及英文原稿來源 |
| 操場濕了，一定下過雨？（evidence-reading） | `src/content/challenge/week-3.json` → units.evidence-reading | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 紙飛機飛得遠，原因找到了嗎？（experiment-mix） | `src/content/challenge/week-3.json` → units.experiment-mix | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 替閱讀角鋪好地墊（area-math） | `src/content/challenge/week-4.json` → units.area-math | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| Let's work together（team-english） | `src/content/challenge/week-4.json` → units.team-english | 首見教材 commit 76c12ec；含 3ea310f 雙語補充 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據、翻譯者及英文原稿來源 |
| 兩個閱讀方案，都有理由（plans-reading） | `src/content/challenge/week-4.json` → units.plans-reading | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |
| 選一個走得通的服務計畫（solutions-mix） | `src/content/challenge/week-4.json` → units.solutions-mix | 首見教材 commit 76c12ec；教學情境 | 待確認（有 AI 協助專案脈絡） | 未標示第三方試題；表格為練習資料 | 未附個別授權／權利鏈 | 待人工確認／中 | 補編寫與題目來源證據 |

## 圖片與插畫逐檔

`public/assets/` 有 18 個 SVG；`docs/assets/` 同名檔是同一素材的部署副本，不是另外 18 件作品。已核對兩邊一致。所有 SVG 以 path／rect／circle 等內嵌向量構成，未見外連圖像、嵌入點陣圖、script、foreignObject、作者 metadata 或授權標示；幾何形狀不代表必然原創，亦不能排除參考／描摹。沒有其他受追蹤的照片、影片、字型、音檔或語音模型。圖像反向搜尋及逐張人類創作證據未完成。

共同來源：首見 `1fde2e1` 的匯入檔；AI 使用與第三方參考均待確認；授權依據未附。`hero.svg` 與 `fox.svg` 內容相同，是重用，不是兩份不同來源。Logo 同時作 favicon 與 manifest icon。

| 素材名稱 | 位置 | 已知來源 | 是否 AI | 第三方情形 | 授權依據 | 狀態／風險 | 待確認事項 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 螞蟻插圖 | `public/assets/ants.svg`；部署 `docs/assets/ants.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 二進位插圖 | `public/assets/binary.svg`；部署 `docs/assets/binary.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 麵包插圖 | `public/assets/bread.svg`；部署 `docs/assets/bread.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 紙橋插圖 | `public/assets/bridges.svg`；部署 `docs/assets/bridges.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 珊瑚插圖 | `public/assets/coral.svg`；部署 `docs/assets/coral.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 問候插圖 | `public/assets/culture.svg`；部署 `docs/assets/culture.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 心情故事插圖 | `public/assets/feelings.svg`；部署 `docs/assets/feelings.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 狐狸故事插圖 | `public/assets/fox.svg`；部署 `docs/assets/fox.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 首頁森林主圖 | `public/assets/hero.svg`；部署 `docs/assets/hero.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 圖書館故事插圖 | `public/assets/library.svg`；部署 `docs/assets/library.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 書本 Logo／favicon／manifest 圖示 | `public/assets/logo.svg`；部署 `docs/assets/logo.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據；另查圖形商標 |
| 地圖插圖 | `public/assets/maps.svg`；部署 `docs/assets/maps.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 月亮插圖 | `public/assets/moon.svg`；部署 `docs/assets/moon.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 印刷插圖 | `public/assets/printing.svg`；部署 `docs/assets/printing.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 種子插圖 | `public/assets/seed.svg`；部署 `docs/assets/seed.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 影子插圖 | `public/assets/shadows.svg`；部署 `docs/assets/shadows.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 台灣地形示意 | `public/assets/taiwan.svg`；部署 `docs/assets/taiwan.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |
| 水循環插圖 | `public/assets/water.svg`；部署 `docs/assets/water.svg` | 1fde2e1 匯入，作者／工具未記錄 | 待確認 | 未見外連或第三方署名；參考／描摹待確認 | 無逐檔授權 | 待人工確認／中 | 補草稿、產製工具、參考圖與權利依據 |

其他視覺：CSS 背景、漸層與版面在 `src/styles.css`／`src/challenge/challenge.css`／`src/speech/speech.css`，未見遠端背景 URL；Unicode 箭頭、星號、勾號、喇叭與剪貼簿 emoji 由裝置字型繪製，沒有圖示套件／下載 emoji 圖庫。字型 CSS 指定 Noto Sans TC、PingFang TC、Microsoft JhengHei、Outfit 與 sans-serif，但沒有 @font-face、字型檔或遠端字型載入。現況是呼叫裝置可用字型；未來如改為自行託管字型／emoji 圖檔，必須另查原授權及附檔條件，不可直接沿用本次結論。

## 科普參考線索的查核狀態

CONTENT-SOURCES.md 稱文章為重新編寫且非逐字轉載；這是既有聲明。列出的六項本次查核如下，未把任何外部頁面、圖片或整段文字加入本站。

| 主題／來源 | 本次讀取結果 | 權利與編輯待辦 |
| --- | --- | --- |
| 螞蟻：[Smithsonian](https://www.si.edu/spotlight/buginfo/pheromones) | 本次工具回傳 404 | 保留舊紀錄，人工補原快照或新可靠頁；無法重做原頁比對 |
| 地圖：[NPS Park Maps](https://www.nps.gov/subjects/geology/park-maps.htm) | 可讀取，介紹地質／地形圖與用途 | 參考事實，未證明每句文字來源；不能推定頁內每張圖都無權利限制 |
| 月相：[原 NASA 連結](https://moon.nasa.gov/resources/54/phases-of-the-moon/) | 轉到 science.nasa.gov/moon/，非原精確月相頁 | 之後補精確來源與日期；不據此宣稱已比對完整原頁 |
| 麵包：[Exploratorium](https://annex.exploratorium.edu/cooking/bread/activity-yeast.html) | 可讀取，酵母產氣實驗 | 館方教材不因可閱讀就可整篇翻譯轉載；目前只見事實概念參考 |
| 台灣地質：[USGS](https://www.usgs.gov/publications/a-model-termination-ryukyu-subduction-zone-against-taiwan-a-junction-collision) | 可讀取研究摘要頁 | 摘要不是整篇論文，須區分論文出版者與政府入口頁的權利 |
| 珊瑚：[NOAA](https://oceanservice.noaa.gov/facts/coral_bleach.html) | 可讀取白化說明 | 核對知識線索，不是授權本站圖像或文字的證明 |

其餘十篇沒有在該來源表逐篇列參考。故事及虛構情境也需要創作記錄，不因無科學引用就跳過權利查核。本次未進行全網逐句相似度搜索或正式侵權比對。

## 有聲閱讀

已確認 `src/speech/index.ts` 僅建立瀏覽器 SpeechSynthesisUtterance；engine.ts 透過 speechSynthesis 播放，沒有付費 TTS、遠端語音 API 呼叫、第三方聲音下載或錄音輸出。金額／單位與表格的朗讀文字是從現有教材轉換。系統程式屬本專案編寫，權利來源與其他自編程式一樣需保留產製紀錄。

API 本身沒有本站按次計費配置，也未增加費用；但 voice 由裝置供應商提供，可分本機與遠端，不能保證永遠離線或沒有供應商層級網路處理。`localService` 只反映來源，不是音質或授權證明。[MDN 說明](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService)

待人工確認：實際目標 iPhone／Android／電腦列出的 voice、作業系統版本、服務條款與是否使用雲端；特別是未來若要錄製、下載或再發行音檔，須另確認聲音與被朗讀內容兩邊的權利。目前不提供音檔再利用，也不把瀏覽器聲音列為本站自有素材。

## 程式與開源相依套件

自行編寫的主要位置為 `src/`（不含教材分類）、CSS、scripts、tests 與設定檔；未見直接複製第三方大型程式檔的署名，但作者權利與 AI 協作仍待佐證。第三方程式由 package-lock.json 鎖定，部署 bundle 包含 React 等程式，不可一起宣稱「全部自有」。

鎖檔共 **223 個相依項目紀錄**（含不同平台的選用 binary 及巢狀版本，不等於 223 個都會載入孩子裝置）。只有 React、React DOM 與 scheduler 三項標為非 dev；其餘是建置／檢查／測試工具。不能單靠 dev 標記證明某段程式絕對沒進 bundle，例如 Vite modulepreload helper 也在產物中。

本機 173 項有 package.json，165 項根目錄有 LICENSE／NOTICE 類檔名，8 項沒有這類根檔名；其餘 50 項多為其他平台選用項，未安裝，僅核對鎖檔 metadata。缺檔名不等於無授權（可能在 README／源碼標頭或父套件），也不能當作條件已完整核實。

### 直接依賴與主要執行期程式

| 套件 | 鎖定版本 | 授權 | 用途 | 本機依據 |
| --- | --- | --- | --- | --- |
| react | 19.3.0 | MIT | 網站執行期 | node_modules/react/LICENSE |
| react-dom | 19.3.0 | MIT | 網站執行期 | node_modules/react-dom/LICENSE |
| @types/react | 19.3.0 | MIT | 建置／開發／測試 | node_modules/@types/react/LICENSE |
| @types/react-dom | 19.3.0 | MIT | 建置／開發／測試 | node_modules/@types/react-dom/LICENSE |
| @vitejs/plugin-react | 4.7.0 | MIT | 建置／開發／測試 | node_modules/@vitejs/plugin-react/LICENSE |
| vite | 6.4.4 | MIT | 建置／開發／測試 | node_modules/vite/LICENSE.md |
| typescript | 5.7.3 | Apache-2.0 | 建置／開發／測試 | node_modules/typescript/LICENSE.txt |
| eslint | 9.39.5 | MIT | 建置／開發／測試 | node_modules/eslint/LICENSE |
| typescript-eslint | 8.71.1 | MIT | 建置／開發／測試 | node_modules/typescript-eslint/LICENSE |
| eslint-plugin-react-hooks | 5.2.0 | MIT | 建置／開發／測試 | node_modules/eslint-plugin-react-hooks/LICENSE |
| playwright | 1.64.0 | Apache-2.0 | 建置／開發／測試 | node_modules/playwright/LICENSE、NOTICE |
| scheduler | 0.28.0 | MIT | 網站執行期 | node_modules/scheduler/LICENSE |

### 必須保留的條件與具體缺口

| 授權 | 目前涉及／保留要求 | 本次狀態 |
| --- | --- | --- |
| MIT | React、React DOM、scheduler、Vite、ESLint 等；分發軟體副本／重要部分時保留 copyright 與許可文字（包括免責） | 已讀 React 等本機 LICENSE；正式 bundle 有 Meta 標頭，但無完整 MIT grant，docs/ 無 LICENSE／NOTICE，優先補第三方告知 |
| Apache-2.0 | TypeScript、Playwright 與部分 ESLint 依賴；再分發時附授權、保留通知，修改檔案標示變更；若原有 NOTICE，按條件攜帶 | 本機 TypeScript LICENSE.txt／ThirdPartyNoticeText.txt、Playwright LICENSE／NOTICE／ThirdPartyNotices.txt；不可隨開發包散布時刪除 |
| ISC | picocolors、semver 等；保留 copyright 與授權通知 | 鎖檔有 11 項，見下表；實際再分發應核對所帶版本文字 |
| BSD-2／BSD-3 | eslint-scope、espree、source-map-js 等；保留聲明、條件與免責，三條款另禁止未經允許背書 | 6／2 項；建置工具不自動授權本站內容 |
| BlueOak-1.0.0 | 巢狀 minimatch 10.2.6；讓取得副本者收到授權文字或指定連結 | 已讀本機 LICENSE.md，保留其通知方式 |
| Python-2.0 | argparse 2.0.1；包含 PSF 與歷史來源的授權鏈，依檔內條件保留，不只留名稱 | 本機 LICENSE 包含多段歷史條款，重新包裝工具時須完整攜帶 |
| CC-BY-4.0 | caniuse-lite 資料；再散布該資料時處理姓名標示、授權連結及修改說明 | 屬開發資料，不是本站文章採 CC；已讀本機 LICENSE |
| 工具內打包的其他程式 | Vite LICENSE.md 額外列 Apache-2.0、BSD-2、CC0、ISC、MIT；TypeScript／Playwright 的第三方聲明另列元件 | lock license 欄不涵蓋所有內嵌碼；若分發工具或 browser binary，重新逐份查其附帶授權。測試用 Chromium 未放入本站 |

缺少根授權檔名的 8 項：`@esbuild/win32-x64`、`@humanfs/types`、`@rollup/rollup-win32-x64-gnu`、`@rollup/rollup-win32-x64-msvc`、`esrecurse`、`imurmurhash`、`keyv`、`natural-compare`。目前未見它們直接作網站 runtime import；若要重發工具／binary，需從同版本父套件、源碼、README 或官方發行檔補足授權證據。不能因鎖檔寫 MIT／BSD 就宣稱通知合規完成。

GitHub Actions 引用 actions/checkout@v4、setup-node@v4、configure-pages@v5、upload-pages-artifact@v3、deploy-pages@v4；由 GitHub CI 執行，未把 action 原始碼打包進本站，現有 workflow 不改。若未來要複製／散布 action 程式碼，須另外核對其實際版本授權；本次沒有清查 GitHub runner 整個 OS／工具映像。

## 名稱與識別初查

查詢字串：`"Little Explorer Weekly"`、`"小小探索家" 週刊 雜誌`；日期 2026-10-09。一般搜尋出現相同／相近的教育探索用語，例如親子天下網域的 PDF 索引含「小小探索家」專欄及作者／繪者署名，另有 [DAI 的 Little Explorer 課程](https://dai-heidelberg.de/en/language-school/kids-teens/weekly-courses/)。這是名稱並非唯一用語的線索，不是已註冊商標或本網站侵權的證明。

親子天下的 [PDF 來源](https://www.parenting.com.tw/files/md5/ef/83/ef8335c33d21e87a59fb93ef18362a89-10261688.pdf) 本次僅取得搜尋索引，直接讀取失敗；因此沒有檢視整份 PDF，也不把其插圖當作本站相似比對證據。

**正式商標資料庫查詢尚未完成。** 已開啟[智慧財產局商標檢索入口](https://cloud.tipo.gov.tw/S282/S282WV1/)，工具未取得可供查詢的頁面內容，沒有送出正式文字／圖形近似查詢，也沒有取得案件清單。不得寫「沒有相似商標」。

建議管理者或商標專業人員查：小小探索家、小小探索家週刊、Little Explorer、Little Explorers、Little Explorer Weekly、Explorer Challenge，以及書本 Logo 的圖形近似；依實際服務核對線上教育／出版服務，必要時檢視印刷品及下載教材等相關類別與群組、申請中／有效案件、權利範圍及混淆可能，保留日期與結果。不是只查完全相同字串；[TIPO 近似檢索說明](https://www.tipo.gov.tw/tw/trademarks/568-7691.html)。本次不改名、不申請商標、不宣稱清權完成。

## 持續維護與補件模板

新增素材逐件追加：素材 ID／名稱、檔案路徑、用途、內容版本／首次發布 commit、已知作者／來源 URL、取得日期、是否 AI（是／否／待確認）、工具與條款版本、人類修改說明、第三方元素、授權依據／可使用範圍／是否可改作與再分發／署名要求、證據代號、已確認／有疑慮／待人工確認、風險與待辦、審閱者、核准日期。

範本：`待命名 | 待填路徑 | 來源待確認 | AI 待確認 | 第三方待確認 | 尚無授權證據 | 待人工確認／中 | 補創作與授權紀錄 | 未核准`。不以空白或「網路圖片」取代查核，不將私密契約／兒童資料提交公開 repo。

修正只更新權利紀錄；要替換教材、改既有聲明、加正式授權或上架告知，須另開經授權的維護工作。本次所有不確定項目保持未確認，不自行移除教材。

## 鎖定相依套件完整索引

下表逐一取自本次 package-lock.json，license 欄為供應套件 metadata；`授權檔` 欄只說本機根目錄檔名是否存在，不宣稱 223 份文字全部完成法律審核。MIT 184、Apache-2.0 17、ISC 11、BSD-2-Clause 6、BSD-3-Clause 2、BlueOak-1.0.0／Python-2.0／CC-BY-4.0 各 1。升級 lock 後必須重做比對。

| 套件路徑（node_modules/ 下） | 版本 | 鎖檔授權 | 用途 | 本機授權檔 |
| --- | --- | --- | --- | --- |
| @babel/code-frame | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/compat-data | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/core | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/generator | 7.29.8 | MIT | 開發 | LICENSE |
| @babel/helper-compilation-targets | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-globals | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-module-imports | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-module-transforms | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-plugin-utils | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-string-parser | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-validator-identifier | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helper-validator-option | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/helpers | 7.29.10 | MIT | 開發 | LICENSE |
| @babel/parser | 7.29.9 | MIT | 開發 | LICENSE |
| @babel/plugin-transform-react-jsx-self | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/plugin-transform-react-jsx-source | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/template | 7.29.7 | MIT | 開發 | LICENSE |
| @babel/traverse | 7.29.10 | MIT | 開發 | LICENSE |
| @babel/types | 7.29.8 | MIT | 開發 | LICENSE |
| @esbuild/aix-ppc64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/android-arm | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/android-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/android-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/darwin-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/darwin-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/freebsd-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/freebsd-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-arm | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-ia32 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-loong64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-mips64el | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-ppc64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-riscv64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-s390x | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/linux-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/netbsd-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/netbsd-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/openbsd-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/openbsd-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/openharmony-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/sunos-x64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/win32-arm64 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/win32-ia32 | 0.25.12 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @esbuild/win32-x64 | 0.25.12 | MIT | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| @eslint-community/eslint-utils | 4.10.1 | MIT | 開發 | LICENSE |
| @eslint-community/eslint-utils/node_modules/eslint-visitor-keys | 3.4.3 | Apache-2.0 | 開發 | LICENSE |
| @eslint-community/regexpp | 4.12.2 | MIT | 開發 | LICENSE |
| @eslint/config-array | 0.21.2 | Apache-2.0 | 開發 | LICENSE |
| @eslint/config-helpers | 0.4.2 | Apache-2.0 | 開發 | LICENSE |
| @eslint/core | 0.17.0 | Apache-2.0 | 開發 | LICENSE |
| @eslint/eslintrc | 3.3.7 | MIT | 開發 | LICENSE |
| @eslint/js | 9.39.5 | MIT | 開發 | LICENSE |
| @eslint/object-schema | 2.1.7 | Apache-2.0 | 開發 | LICENSE |
| @eslint/plugin-kit | 0.4.1 | Apache-2.0 | 開發 | LICENSE |
| @humanfs/core | 0.19.2 | Apache-2.0 | 開發 | LICENSE |
| @humanfs/node | 0.16.8 | Apache-2.0 | 開發 | LICENSE |
| @humanfs/types | 0.15.0 | Apache-2.0 | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| @humanwhocodes/module-importer | 1.0.1 | Apache-2.0 | 開發 | LICENSE |
| @humanwhocodes/retry | 0.4.3 | Apache-2.0 | 開發 | LICENSE |
| @jridgewell/gen-mapping | 0.3.13 | MIT | 開發 | LICENSE |
| @jridgewell/remapping | 2.3.5 | MIT | 開發 | LICENSE |
| @jridgewell/resolve-uri | 3.1.2 | MIT | 開發 | LICENSE |
| @jridgewell/sourcemap-codec | 1.6.0 | MIT | 開發 | LICENSE |
| @jridgewell/trace-mapping | 0.3.31 | MIT | 開發 | LICENSE |
| @napi-rs/lzma-linux-x64-gnu | 1.5.1 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rolldown/pluginutils | 1.0.0-beta.27 | MIT | 開發 | LICENSE |
| @rollup/rollup-android-arm-eabi | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-android-arm64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-darwin-arm64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-darwin-x64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-freebsd-arm64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-freebsd-x64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-arm-gnueabihf | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-arm-musleabihf | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-arm64-gnu | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-arm64-musl | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-loong64-gnu | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-loong64-musl | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-ppc64-gnu | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-ppc64-musl | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-riscv64-gnu | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-riscv64-musl | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-s390x-gnu | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-x64-gnu | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-linux-x64-musl | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-openbsd-x64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-openharmony-arm64 | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-win32-arm64-msvc | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-win32-ia32-msvc | 4.64.2 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| @rollup/rollup-win32-x64-gnu | 4.64.2 | MIT | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| @rollup/rollup-win32-x64-msvc | 4.64.2 | MIT | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| @types/babel__core | 7.20.5 | MIT | 開發 | LICENSE |
| @types/babel__generator | 7.27.0 | MIT | 開發 | LICENSE |
| @types/babel__template | 7.4.4 | MIT | 開發 | LICENSE |
| @types/babel__traverse | 7.28.0 | MIT | 開發 | LICENSE |
| @types/estree | 1.0.9 | MIT | 開發 | LICENSE |
| @types/json-schema | 7.0.15 | MIT | 開發 | LICENSE |
| @types/react | 19.3.0 | MIT | 開發 | LICENSE |
| @types/react-dom | 19.3.0 | MIT | 開發 | LICENSE |
| @typescript-eslint/eslint-plugin | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/eslint-plugin/node_modules/ignore | 7.0.12 | MIT | 開發 | LICENSE-MIT |
| @typescript-eslint/parser | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/project-service | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/scope-manager | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/tsconfig-utils | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/type-utils | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/types | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/typescript-estree | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/typescript-estree/node_modules/balanced-match | 4.0.4 | MIT | 開發 | LICENSE.md |
| @typescript-eslint/typescript-estree/node_modules/brace-expansion | 5.0.12 | MIT | 開發 | LICENSE |
| @typescript-eslint/typescript-estree/node_modules/minimatch | 10.2.6 | BlueOak-1.0.0 | 開發 | LICENSE.md |
| @typescript-eslint/typescript-estree/node_modules/semver | 7.8.5 | ISC | 開發 | LICENSE |
| @typescript-eslint/utils | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/visitor-keys | 8.71.1 | MIT | 開發 | LICENSE |
| @typescript-eslint/visitor-keys/node_modules/eslint-visitor-keys | 5.0.1 | Apache-2.0 | 開發 | LICENSE |
| @vitejs/plugin-react | 4.7.0 | MIT | 開發 | LICENSE |
| acorn | 8.19.0 | MIT | 開發 | LICENSE |
| acorn-jsx | 5.3.2 | MIT | 開發 | LICENSE |
| ajv | 6.15.0 | MIT | 開發 | LICENSE |
| ansi-styles | 4.3.0 | MIT | 開發 | license |
| argparse | 2.0.1 | Python-2.0 | 開發 | LICENSE |
| balanced-match | 1.0.2 | MIT | 開發 | LICENSE.md |
| baseline-browser-mapping | 2.11.27 | Apache-2.0 | 開發 | LICENSE.txt |
| brace-expansion | 1.1.21 | MIT | 開發 | LICENSE |
| browserslist | 4.29.3 | MIT | 開發 | LICENSE |
| callsites | 3.1.0 | MIT | 開發 | license |
| caniuse-lite | 1.0.30001815 | CC-BY-4.0 | 開發 | LICENSE |
| chalk | 4.1.2 | MIT | 開發 | license |
| color-convert | 2.0.1 | MIT | 開發 | LICENSE |
| color-name | 1.1.4 | MIT | 開發 | LICENSE |
| concat-map | 0.0.1 | MIT | 開發 | LICENSE |
| convert-source-map | 2.0.0 | MIT | 開發 | LICENSE |
| cross-spawn | 7.0.6 | MIT | 開發 | LICENSE |
| csstype | 3.2.3 | MIT | 開發 | LICENSE |
| debug | 4.4.3 | MIT | 開發 | LICENSE |
| deep-is | 0.1.4 | MIT | 開發 | LICENSE |
| electron-to-chromium | 1.5.451 | ISC | 開發 | LICENSE |
| esbuild | 0.25.12 | MIT | 開發 | LICENSE.md |
| escalade | 3.2.0 | MIT | 開發 | license |
| escape-string-regexp | 4.0.0 | MIT | 開發 | license |
| eslint | 9.39.5 | MIT | 開發 | LICENSE |
| eslint-plugin-react-hooks | 5.2.0 | MIT | 開發 | LICENSE |
| eslint-scope | 8.4.0 | BSD-2-Clause | 開發 | LICENSE |
| eslint-visitor-keys | 4.2.1 | Apache-2.0 | 開發 | LICENSE |
| espree | 10.4.0 | BSD-2-Clause | 開發 | LICENSE |
| esquery | 1.7.0 | BSD-3-Clause | 開發 | license.txt |
| esrecurse | 4.3.0 | BSD-2-Clause | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| estraverse | 5.3.0 | BSD-2-Clause | 開發 | LICENSE.BSD |
| esutils | 2.0.3 | BSD-2-Clause | 開發 | LICENSE.BSD |
| fast-deep-equal | 3.1.3 | MIT | 開發 | LICENSE |
| fast-json-stable-stringify | 2.1.0 | MIT | 開發 | LICENSE |
| fast-levenshtein | 2.0.6 | MIT | 開發 | LICENSE.md |
| fdir | 6.5.0 | MIT | 開發 | LICENSE |
| file-entry-cache | 8.0.0 | MIT | 開發 | LICENSE |
| find-up | 5.0.0 | MIT | 開發 | license |
| flat-cache | 4.0.1 | MIT | 開發 | LICENSE |
| flatted | 3.4.4 | ISC | 開發 | LICENSE |
| fsevents | 2.3.3 | MIT | 開發 | 未安裝，僅鎖檔紀錄 |
| gensync | 1.0.0-beta.2 | MIT | 開發 | LICENSE |
| glob-parent | 6.0.2 | ISC | 開發 | LICENSE |
| globals | 14.0.0 | MIT | 開發 | license |
| has-flag | 4.0.0 | MIT | 開發 | license |
| ignore | 5.3.2 | MIT | 開發 | LICENSE-MIT |
| import-fresh | 3.3.1 | MIT | 開發 | license |
| imurmurhash | 0.1.4 | MIT | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| is-extglob | 2.1.1 | MIT | 開發 | LICENSE |
| is-glob | 4.0.3 | MIT | 開發 | LICENSE |
| isexe | 2.0.0 | ISC | 開發 | LICENSE |
| js-tokens | 4.0.0 | MIT | 開發 | LICENSE |
| js-yaml | 4.3.2 | MIT | 開發 | LICENSE |
| jsesc | 3.1.0 | MIT | 開發 | LICENSE-MIT.txt |
| json-buffer | 3.0.1 | MIT | 開發 | LICENSE |
| json-schema-traverse | 0.4.1 | MIT | 開發 | LICENSE |
| json-stable-stringify-without-jsonify | 1.0.1 | MIT | 開發 | LICENSE |
| json5 | 2.2.3 | MIT | 開發 | LICENSE.md |
| keyv | 4.5.4 | MIT | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| levn | 0.4.1 | MIT | 開發 | LICENSE |
| locate-path | 6.0.0 | MIT | 開發 | license |
| lodash.merge | 4.6.2 | MIT | 開發 | LICENSE |
| lru-cache | 5.1.1 | ISC | 開發 | LICENSE |
| minimatch | 3.1.5 | ISC | 開發 | LICENSE |
| ms | 2.1.3 | MIT | 開發 | license.md |
| nanoid | 3.3.20 | MIT | 開發 | LICENSE |
| natural-compare | 1.4.0 | MIT | 開發 | 未見根授權檔；補查 README／源碼／父套件 |
| node-releases | 2.0.57 | MIT | 開發 | LICENSE |
| optionator | 0.9.4 | MIT | 開發 | LICENSE |
| p-limit | 3.1.0 | MIT | 開發 | license |
| p-locate | 5.0.0 | MIT | 開發 | license |
| parent-module | 1.0.1 | MIT | 開發 | license |
| path-exists | 4.0.0 | MIT | 開發 | license |
| path-key | 3.1.1 | MIT | 開發 | license |
| picocolors | 1.1.1 | ISC | 開發 | LICENSE |
| picomatch | 4.0.7 | MIT | 開發 | LICENSE |
| playwright | 1.64.0 | Apache-2.0 | 開發 | LICENSE、NOTICE |
| playwright-core | 1.64.0 | Apache-2.0 | 開發 | LICENSE、NOTICE |
| postcss | 8.5.29 | MIT | 開發 | LICENSE |
| prelude-ls | 1.2.1 | MIT | 開發 | LICENSE |
| punycode | 2.3.1 | MIT | 開發 | LICENSE-MIT.txt |
| react | 19.3.0 | MIT | 執行期 | LICENSE |
| react-dom | 19.3.0 | MIT | 執行期 | LICENSE |
| react-refresh | 0.17.0 | MIT | 開發 | LICENSE |
| resolve-from | 4.0.0 | MIT | 開發 | license |
| rollup | 4.64.2 | MIT | 開發 | LICENSE.md |
| scheduler | 0.28.0 | MIT | 執行期 | LICENSE |
| semver | 6.3.1 | ISC | 開發 | LICENSE |
| shebang-command | 2.0.0 | MIT | 開發 | license |
| shebang-regex | 3.0.0 | MIT | 開發 | license |
| source-map-js | 1.2.2 | BSD-3-Clause | 開發 | LICENSE |
| strip-json-comments | 3.1.1 | MIT | 開發 | license |
| supports-color | 7.2.0 | MIT | 開發 | license |
| tinyglobby | 0.2.17 | MIT | 開發 | LICENSE |
| ts-api-utils | 2.5.0 | MIT | 開發 | LICENSE.md |
| type-check | 0.4.0 | MIT | 開發 | LICENSE |
| typescript | 5.7.3 | Apache-2.0 | 開發 | LICENSE.txt |
| typescript-eslint | 8.71.1 | MIT | 開發 | LICENSE |
| update-browserslist-db | 1.3.4 | MIT | 開發 | LICENSE |
| uri-js | 4.4.1 | BSD-2-Clause | 開發 | LICENSE |
| vite | 6.4.4 | MIT | 開發 | LICENSE.md |
| which | 2.0.2 | ISC | 開發 | LICENSE |
| word-wrap | 1.2.5 | MIT | 開發 | LICENSE |
| yallist | 3.1.1 | ISC | 開發 | LICENSE |
| yocto-queue | 0.1.0 | MIT | 開發 | license |
