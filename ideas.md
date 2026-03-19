# ASUS NA Top 100 Server Strategy — 網站設計構想

## 目標
將北美 Top 100 伺服器採購策略報告轉化為一個可搜尋、可篩選的內部資源網站，方便 ASUS 伺服器業務團隊快速查找客戶資訊。

---

<response>
<text>
## Idea 1: Command Center — 軍事指揮中心風格

**Design Movement**: 受太空任務控制中心和軍事指揮室啟發的資訊密集型介面。

**Core Principles**:
- 資訊密度優先：在單一視窗中呈現最大量的可操作資訊
- 狀態驅動色彩：顏色僅用於傳達資料狀態（難易度、通路類型）
- 等寬字體 + 網格對齊：所有數據嚴格對齊，營造精密感
- 零裝飾：無圓角、無陰影、無漸層，純粹的資訊呈現

**Color Philosophy**: 深黑底 (#0A0A0F) 搭配冷藍高亮 (#00D4FF)，紅色警示 (#FF3366) 表示高難度，綠色 (#00FF88) 表示低難度。模擬雷達螢幕的冷峻感。

**Layout Paradigm**: 全螢幕儀表板，左側為篩選面板（永久展開），中央為主資料表格（佔 70% 寬度），右側為選中企業的詳細資訊卡。

**Signature Elements**:
- 掃描線動畫效果覆蓋在背景上
- 數據以等寬字體呈現，模擬終端機輸出
- 難易度以 LED 燈條式色帶呈現

**Interaction Philosophy**: 鍵盤優先，支援快捷鍵導航。點擊行展開詳細資訊，側邊面板滑入。

**Animation**: 資料載入時模擬逐行掃描效果，篩選切換時表格行以交錯淡入呈現。

**Typography System**: JetBrains Mono 用於數據，Space Grotesk 用於標題和標籤。
</text>
<probability>0.05</probability>
</response>

<response>
<text>
## Idea 2: Swiss Data Visualization — 瑞士國際主義數據視覺化

**Design Movement**: 受 Josef Müller-Brockmann 和 Massimo Vignelli 的瑞士國際主義設計啟發，結合現代數據視覺化。

**Core Principles**:
- 嚴格的網格系統：所有元素基於 8px 基準網格對齊
- 黑白為主，色彩為功能：僅在傳達數據意義時使用色彩
- 大量留白：讓數據呼吸，避免視覺疲勞
- 層次分明的排版：透過字重和大小建立清晰的資訊層級

**Color Philosophy**: 純白底 (#FFFFFF) 搭配純黑文字 (#111111)，ASUS 品牌藍 (#0055FF) 作為唯一強調色，難易度以灰階漸變呈現（深灰=困難，淺灰=容易），紅色 (#E53935) 僅用於警示。

**Layout Paradigm**: 上方為搜尋列和篩選標籤列（水平排列），下方為全寬資料表格。點擊行後，整行展開為內嵌的詳細資訊區塊（accordion 風格），而非彈出視窗。

**Signature Elements**:
- 粗細對比強烈的排版（900 weight 標題 vs 300 weight 內文）
- 表格行左側的彩色難易度指示條
- 頂部的統計摘要區塊，以大號數字呈現關鍵指標

**Interaction Philosophy**: 直覺式操作，搜尋即時篩選，標籤切換無延遲。展開/收合以平滑動畫過渡。

**Animation**: 極簡動畫，僅在狀態變化時使用 200ms ease-out 過渡。表格行展開時以高度動畫呈現。

**Typography System**: DM Sans 用於標題（粗體），Inter 用於內文和數據。數字使用 tabular figures 確保對齊。
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea 3: Executive Intelligence Dashboard — 高階主管情報儀表板

**Design Movement**: 受 Bloomberg Terminal 和高端金融分析平台啟發，但以更人性化的方式呈現。

**Core Principles**:
- 摘要優先：先呈現高層次洞察，再深入細節
- 卡片式資訊架構：每家企業是一張可展開的情報卡
- 多維度篩選：支援複合條件篩選和即時統計更新
- 行動導向：每個資訊點都連結到具體的行動建議

**Color Philosophy**: 暖灰底 (#F8F7F4) 搭配深炭黑文字 (#1A1A2E)，ASUS 藍 (#0066CC) 為主色，琥珀色 (#F59E0B) 為次色（用於中等難度），翡翠綠 (#10B981) 表示機會，珊瑚紅 (#EF4444) 表示高風險。

**Layout Paradigm**: 頂部為全寬搜尋和快速統計儀表板（4 個 KPI 卡片），中間為可切換的視圖模式（表格視圖 / 卡片視圖 / 地圖視圖），底部為選中企業的深度分析面板。

**Signature Elements**:
- 頂部 KPI 儀表板以大號數字和微型圖表呈現
- 難易度以漸變色條搭配數字呈現
- 企業卡片帶有行業圖標和關鍵指標預覽

**Interaction Philosophy**: 漸進式揭露，從摘要到細節逐層深入。支援拖拽排序和自定義欄位顯示。

**Animation**: 視圖切換時使用 framer-motion 的 layout animation，卡片展開時使用 spring 動畫。數字變化時使用計數器動畫。

**Typography System**: Plus Jakarta Sans 用於標題，Work Sans 用於內文，Tabular Lining 數字確保數據對齊。
</text>
<probability>0.07</probability>
</response>

---

## 選擇

我選擇 **Idea 2: Swiss Data Visualization — 瑞士國際主義數據視覺化**。

理由：
1. 這是一個資料密集型的內部工具，瑞士國際主義的嚴格網格和清晰層次最適合呈現 100 家企業的 13 個欄位
2. 黑白為主的配色方案不會分散注意力，讓數據本身成為焦點
3. Accordion 展開方式比彈出視窗更適合逐一瀏覽企業詳情
4. 簡潔的設計風格與 ASUS 的品牌形象一致
