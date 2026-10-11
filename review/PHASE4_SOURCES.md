# 第四階段內容與素材紀錄

日期：2026-10-10。自有内容正式授權未選定；不因免費、教育用途或 AI 協助就宣稱完整排他著作權。

- 16 篇三四年級重製稿：`src/planet/content/`；原始 16 篇仍在 `src/content/`，ID 沒有改名。正文、問題、答案及來源沿用本次已獲初步認可的版本。
- 16 篇新故事：`src/planet/stories/`。本次 AI 協助新編，沒有引用知名角色或真實兒童私人經歷。印刷房及照片故事為歷史／資料辨識情境創作，不是某個歷史人物的實錄；沒有捏造真實人物引言。每篇的 `fictionNote` 區分情節與背景知識。
- 4 篇低年級讀物：`src/planet/junior/`。生活情境新編，注音採逐句顯式資料；見 ZHUYIN_REVIEW.md。
- 20 張新情境圖：`public/story-scenes/`；產製程式 `scripts/phase4-scenes.mjs`，雜湊及 AI 記錄 `sources/phase4-scenes.json`。屬敘事情境示意，不能當作精密科學構造圖或真實歷史照片。
- 原有重製稿圖片：`src/planet/media-records.json`，每張記錄實際來源、授權、替代文字與雜湊。水循環、螞蟻溝通、種子、印刷、二進位等以原理圖解呈現；狐狸文學故事與心理情境保留插畫。月球、台灣、珊瑚與麵包採來源可追溯照片，不要求每篇一律換成照片。
- 台灣衛星影像正式副本縮至最長邊 1200px，約 233KB；私人原始檔保留。沒有增加或刪除地理細節。
- 首頁地球：`public/earth-nasa.jpg`，約 245KB；NASA／NOAA PIA18033 多軌道合成影像。來源及 NASA 使用條件見 `sources/earth-nasa.json`。圖說明確區分合成影像與單張曝光，不暗示 NASA 合作或背書。
- 語音：原有 `src/speech/` Web Speech API；沒有新增預錄音檔、聲音下載資源或付費 TTS。瀏覽器／作業系統可能使用供應商遠端語音，不能保證所有裝置離線。
- 第三方程式告知沿用 `public/THIRD-PARTY-NOTICES.txt` 隨建置發布；沒有替全站文章套用 MIT。

## 新內容事實核對

| 主題 | 來源 | 核對要點 |
| --- | --- | --- |
| 蝙蝠 | [美國國家公園管理局](https://www.nps.gov/subjects/bats/echolocation.htm) | 回聲定位不是用眼睛看聲音；人耳不一定能聽見相關聲音，不觸摸野生動物 |
| 月相 | [NASA](https://science.nasa.gov/moon/moon-phases/) | 月亮反射日光，可見亮面變化；雲遮擋不等於月球消失 |
| 珊瑚白化 | [NOAA](https://oceanservice.noaa.gov/facts/coral_bleach.html) | 變白不必然已死亡；有恢復可能，不能只看顏色斷言原因 |
| 冷杯水滴 | [USGS](https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle) | 空氣水蒸氣在冷表面凝結；不把杯外水滴全當成漏水 |

以上查核日期為 2026-10-10。其他故事涉及的機器人、訊號與島嶼為假設情境，頁面明示不是實際設備承諾、歷史資料或緊急救援操作指引。

## 仍待人工確認

正式商標檢索與自有素材法律權利判定尚未完成，沿用 BRAND_REVIEW.md／CONTENT_RIGHTS.md。AI 產製紀錄可追溯不等於法律保證。舊素材來源不完整者仍按既有 ASSET_AUDIT.md 標示待查證，不編造早期創作證據。未發現本次新增素材有明確授權衝突；這不等於完整法律審查。
