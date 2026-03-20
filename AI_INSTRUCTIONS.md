# AI_INSTRUCTIONS.md — ASUS 全球伺服器策略儀表板 專案交接文件

> **用途**：本文件供接手的 AI 助手或開發者閱讀，完整說明本專案的技術架構、UI/UX 設計哲學、資料存放邏輯、以及開發規範與注意事項。請在進行任何修改前通讀本文件。

---

## 1. 專案概述

本專案是一個 **ASUS 全球伺服器市場策略分析平台**，為 ASUS 伺服器業務團隊提供可搜尋、可篩選、可匯出的企業情報儀表板。涵蓋全球 **400 家企業**（4 個區域各 100 家），包含採購量、供應商、難易度、策略分析、決策者聯絡資訊等 21 個欄位。

### 核心功能

| 功能 | 說明 |
|------|------|
| 區域切換 | NA（北美）、APAC（亞太）、EMEA（歐洲中東非洲）、China（中國大陸） |
| 搜尋 | 即時全文搜尋，涵蓋企業名稱、產業、供應商、ASUS 型號、決策者等 |
| 產業篩選 | 12 種產業標籤（NeoCloud/AI、科技、金融、醫療、國防、電信、能源、汽車、零售、媒體、物流、工業） |
| 排序 | 支援排名、難易度、企業名稱、年採購量排序 |
| 展開詳情 | Accordion 式展開，顯示完整 4 欄詳細資訊 |
| CSV 匯出 | 26 欄完整資料，UTF-8 BOM 編碼 |
| Excel 匯出 | .xlsx 格式，含自動篩選、欄寬設定 |
| 企業詳情頁 | 獨立路由頁面，顯示單一企業完整資訊 |

---

## 2. 技術架構

### 技術堆疊

| 層級 | 技術 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| 建置工具 | Vite | 7.x |
| CSS 框架 | Tailwind CSS | 4.x |
| UI 元件庫 | shadcn/ui（Radix UI 底層） | 最新 |
| 路由 | Wouter | 3.x |
| 動畫 | Framer Motion | 12.x |
| Excel 匯出 | SheetJS (xlsx) | 0.18.x |
| 語言 | TypeScript | 5.6 |
| 套件管理 | pnpm | 10.x |

### 專案為純前端靜態應用

本專案是 **web-static**（純前端）架構，**沒有後端 API、沒有資料庫**。所有資料以靜態 JSON 檔案形式打包進前端 bundle。`server/` 目錄僅為相容性佔位，不參與實際運作。

### 部署架構

本專案同時支援兩種部署方式：

1. **Manus 託管**：透過 Manus 平台自動部署，網址為 `asustop100-kfsrvs8a.manus.space`
2. **Vercel 部署**：透過 `vercel.json` 設定，使用 `build:client` 指令僅打包前端

```
vercel.json 關鍵設定：
- buildCommand: "pnpm run build:client"  ← 只打包前端，不打包 server
- outputDirectory: "dist/public"
- rewrites: 所有路徑重寫至 /index.html（SPA 路由）
```

> **重要**：`package.json` 中的 `build` 指令會同時打包前後端（含 esbuild server），但 Vercel 部署時必須使用 `build:client`（僅 vite build），否則 Vercel 會錯誤地將 server/index.ts 當作入口。

---

## 3. 檔案結構

```
asus-server-strategy/
├── AI_INSTRUCTIONS.md          ← 本交接文件
├── vercel.json                 ← Vercel 部署設定
├── vite.config.ts              ← Vite 建置設定（含路徑別名）
├── package.json                ← 依賴與腳本
├── tsconfig.json               ← TypeScript 設定
├── ideas.md                    ← 設計構想紀錄
├── client/
│   ├── index.html              ← HTML 入口（含 Google Fonts 載入）
│   └── src/
│       ├── main.tsx            ← React 入口點
│       ├── App.tsx             ← 路由定義（Wouter）
│       ├── index.css           ← 全域樣式、設計 tokens、色彩變數
│       ├── data/               ← ★ 靜態 JSON 資料（核心資料來源）
│       │   ├── companies.json       ← NA 北美 100 家
│       │   ├── apac_companies.json  ← APAC 亞太 100 家
│       │   ├── emea_companies.json  ← EMEA 歐洲中東非洲 100 家
│       │   └── china_companies.json ← China 中國大陸 100 家
│       ├── lib/
│       │   ├── regions.ts      ← ★ Company 型別定義 + 區域設定
│       │   └── utils.ts        ← 工具函式（cn 等）
│       ├── pages/
│       │   ├── Home.tsx        ← ★ 主頁面（表格、篩選、排序、匯出）
│       │   ├── CompanyDetail.tsx ← 企業詳情頁
│       │   └── NotFound.tsx    ← 404 頁面
│       ├── components/
│       │   └── ui/             ← shadcn/ui 元件（勿手動修改）
│       ├── contexts/
│       │   └── ThemeContext.tsx ← 主題切換（目前固定 light）
│       └── hooks/              ← 自訂 hooks
├── server/                     ← 佔位用，Vercel 部署時不使用
└── shared/                     ← 佔位用
```

> 標記 ★ 的檔案為核心檔案，修改時需特別注意。

---

## 4. 資料存放邏輯

### 資料格式

所有企業資料以 **靜態 JSON 檔案** 存放在 `client/src/data/` 目錄下，Vite 在建置時會將其打包進 JavaScript bundle。每個 JSON 檔案結構如下：

```json
{
  "region": "北美 (NA)",
  "companies": [
    { "rank": 1, "company": "...", ... },
    { "rank": 2, "company": "...", ... }
  ]
}
```

### Company 物件完整欄位定義（21 個欄位）

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `rank` | number | ✅ | 排名（依年採購量由大到小） |
| `company` | string | ✅ | 企業名稱 |
| `region` | string | ✅ | 國家/地區 |
| `volume` | string | ✅ | 年採購量（含估計值說明） |
| `platform` | string | ✅ | 伺服器機型及平台架構 |
| `application` | string | ✅ | 伺服器應用場景 |
| `currentSuppliers` | string | ✅ | 目前供應商（需經查證） |
| `odmOem` | string | ✅ | ODM 或 OEM 模式 |
| `asusModel` | string | ✅ | ASUS 對應伺服器型號 |
| `channel` | string | ✅ | 通路（直供/SI/DIST） |
| `difficulty` | number | ✅ | 難易度 1-10（10=最難） |
| `challenges` | string | ✅ | 困難點及如何克服（含 archetype 前綴 + 【】結構化標題） |
| `entryPoint` | string | ✅ | 切入點及如何執行（含 archetype 前綴 + 【】結構化標題） |
| `industry` | string | 選填 | 產業分類標籤 |
| `archetype` | string | 選填 | 企業分類（hyperscaler/neocloud/financial/healthcare/defense/telecom/automotive/retail/energy/enterprise_general） |
| `keyPerson` | KeyPerson | 選填 | 舊版聯絡人（保留向下相容） |
| `techDecisionMaker` | DecisionMaker | 選填 | 技術決策者（CTO/Architect 等） |
| `procurementDecisionMaker` | DecisionMaker | 選填 | 採購決策者（VP Procurement 等） |
| `siDist` | SiDistEntry[] | 選填 | SI/DIST 通路明細（含 isActual 標記） |
| `actualSiPartners` | string | 選填 | 實際合作 SI 摘要文字 |
| `volumeSource` | string | 選填 | 採購量數據來源 URL |

### 子型別定義

```typescript
type DecisionMaker = {
  name: string;        // 姓名
  title: string;       // 職稱
  linkedin: string;    // LinkedIn URL
  commStrategy: string; // 溝通策略建議
};

type SiDistEntry = {
  name: string;        // SI/DIST 名稱
  website: string;     // 網址
  type: string;        // "SI" 或 "DIST"
  isActual?: boolean;  // true = 已確認為該企業的實際合作夥伴
};
```

### 資料排序規則

所有 JSON 檔案中的企業已依 **年採購量由大到小** 排列。`rank` 欄位對應此排序。前端預設也以 rank 排序顯示。

### 資料更新流程

由於資料是靜態 JSON，更新流程為：

1. 修改 `client/src/data/*.json` 檔案
2. 重新建置（`pnpm run build:client`）
3. 重新部署

> **注意**：JSON 檔案總計約 1.4 MB，打包後約 430 KB（gzip）。如果企業數量大幅增加，應考慮改為後端 API + 資料庫架構。

---

## 5. UI/UX 設計風格

### 設計哲學：Swiss Data Visualization（瑞士國際主義數據視覺化）

本專案採用受 Josef Müller-Brockmann 瑞士國際主義設計啟發的風格，核心原則為：

1. **嚴格的網格系統**：所有元素基於 8px 基準網格對齊
2. **黑白為主，色彩為功能**：僅在傳達數據意義時使用色彩（難易度、產業標籤）
3. **大量留白**：讓數據呼吸，避免視覺疲勞
4. **層次分明的排版**：透過字重和大小建立清晰的資訊層級

### 色彩系統

| 用途 | 色彩 | OKLCH 值 |
|------|------|----------|
| 主色（ASUS 品牌藍） | 深藍 | `oklch(0.45 0.2 260)` |
| 背景 | 純白 | `oklch(1 0 0)` |
| 前景文字 | 近黑 | `oklch(0.13 0.01 260)` |
| 難易度-易 | 翡翠綠 | `oklch(0.65 0.18 155)` |
| 難易度-中 | 琥珀色 | `oklch(0.7 0.16 85)` |
| 難易度-難 | 珊瑚紅 | `oklch(0.55 0.22 25)` |
| 次要背景 | 極淺灰 | `oklch(0.97 0.002 260)` |
| 邊框 | 淺灰 | `oklch(0.9 0.005 260)` |

> **重要**：Tailwind CSS 4 的 `@theme inline` 區塊必須使用 **OKLCH 色彩格式**，不可使用 HSL。所有色彩變數定義在 `client/src/index.css` 的 `:root` 區塊中。

### 字體系統

| 用途 | 字體 | 載入方式 |
|------|------|----------|
| 標題（h1-h6） | DM Sans | Google Fonts CDN（client/index.html） |
| 內文與數據 | Inter | Google Fonts CDN（client/index.html） |
| 數字 | Inter（tabular figures） | `font-feature-settings: 'tnum' on, 'lnum' on` |

### 主題設定

目前固定為 **light 主題**（`ThemeProvider defaultTheme="light"`）。CSS 變數定義在 `:root` 中，未設定 `.dark` 變體。如需支援深色模式，需在 `index.css` 中新增 `.dark {}` 區塊。

### 關鍵 UI 元件

| 元件 | 位置 | 說明 |
|------|------|------|
| 區域切換標籤 | 頁面頂部 | 4 個區域標籤，URL 路由為 `/region/:region` |
| 搜尋列 | 標籤下方 | 即時篩選，搜尋範圍涵蓋所有文字欄位 |
| 產業篩選器 | 搜尋列下方 | 水平標籤列，支援單選 |
| 資料表格 | 主體區域 | 可排序表頭、Accordion 展開行 |
| 展開詳情 | 表格行展開 | 4 欄 Grid 佈局（基本資訊/策略/通路/決策者） |
| 匯出按鈕 | 表格上方右側 | CSV（藍色）+ Excel（綠色） |
| 統計摘要 | 頁面頂部 | 企業數、平均難易度、難易度分佈 |

### 難易度視覺化

難易度以 **色條 + 數字** 呈現：
- 1-4：翡翠綠（較易）
- 5-7：琥珀色（中等）
- 8-10：珊瑚紅（困難）

---

## 6. 路由結構

| 路徑 | 元件 | 說明 |
|------|------|------|
| `/` | Home | 預設顯示 NA 區域 |
| `/region/:region` | Home | 指定區域（na/apac/emea/china） |
| `/region/:region/company/:rank` | CompanyDetail | 企業詳情頁 |
| `/company/:rank` | CompanyDetail | NA 區域企業詳情（簡短路徑） |
| `/404` | NotFound | 404 頁面 |

路由使用 **Wouter**（輕量級路由庫），不是 React Router。Wouter 的 API 較簡潔，但注意：
- 使用 `useParams()` 取得路由參數
- 使用 `useLocation()` 進行程式化導航
- `Link` 元件不可巢套 `<a>` 標籤

---

## 7. 開發規範與注意事項

### 必須遵守的規則

1. **不要修改 `client/src/components/ui/` 目錄**：這些是 shadcn/ui 自動產生的元件，如需客製化，應在使用處覆寫 props 或 className。

2. **色彩必須使用 CSS 變數**：不要硬編碼色彩值，使用 `bg-primary`、`text-foreground` 等語義化類別，確保全域一致性。

3. **JSON 資料修改後必須驗證**：每個企業必須包含所有必填欄位，`difficulty` 必須在 1-10 之間，`challenges` 和 `entryPoint` 必須包含 `【】` 結構化標題。

4. **匯出功能必須同步更新**：如果新增或修改 Company 欄位，必須同時更新 `exportToCSV()` 和 `exportToExcel()` 函式中的 headers 和 rows 映射。

5. **搜尋篩選必須同步更新**：新增欄位後，需在 Home.tsx 的搜尋過濾邏輯中加入新欄位的搜尋範圍。

6. **圖片不可放在 `client/public/`**：大型靜態資源會導致部署超時。應上傳至 CDN 後使用 URL 引用。

7. **Vercel 部署使用 `build:client`**：絕對不要讓 Vercel 執行預設的 `build` 指令，否則會打包 server 導致部署失敗。

### 型別安全

所有 Company 相關型別定義在 `client/src/lib/regions.ts`。修改資料結構時：

1. 先更新 `regions.ts` 中的型別定義
2. 再更新 JSON 資料
3. 最後更新 Home.tsx 和 CompanyDetail.tsx 中的 UI

### 效能注意事項

- JSON 資料打包後約 430 KB（gzip），首次載入時全部載入記憶體
- 搜尋和篩選在前端即時執行，無 API 呼叫延遲
- 如果資料量超過 1000 家企業，建議改為虛擬捲動（react-window）或後端分頁
- Excel 匯出使用 SheetJS 在瀏覽器端生成，大量資料時可能有短暫卡頓

### 已知限制

1. **無後端 API**：所有資料為靜態打包，無法即時更新。更新資料需重新建置部署。
2. **無使用者認證**：任何有網址的人都可以存取。如需權限控制，需升級為 full-stack 架構。
3. **無資料庫**：無法儲存使用者偏好、備註、或追蹤歷史。
4. **單一語言**：UI 為繁體中文，資料內容混合中英文。

---

## 8. 策略內容結構規範

### Archetype 企業分類（9 種 + 1 通用）

每家企業被分類為以下其中一種 archetype，策略內容必須依 archetype 差異化：

| Archetype | 前綴標籤 | 典型企業 |
|-----------|---------|---------|
| hyperscaler | 【超大規模雲端戰術】 | AWS, Microsoft, Google, Meta |
| neocloud | 【NeoCloud/AI 新創戰術】 | CoreWeave, Lambda, xAI, Nebius |
| financial | 【金融業戰術】 | JPMorgan, Goldman Sachs |
| healthcare | 【醫療/製藥業戰術】 | UnitedHealth, Roche |
| defense | 【國防/航太業戰術】 | Lockheed Martin, Palantir |
| telecom | 【電信業戰術】 | AT&T, NTT, Deutsche Telekom |
| automotive | 【汽車/自駕業戰術】 | Tesla, Toyota, Waymo |
| retail | 【零售/電商業戰術】 | Walmart, Target |
| energy | 【能源業戰術】 | ExxonMobil, Shell |
| enterprise_general | 【企業 IT 戰術】 | 通用 fallback |

### Challenges 結構化格式

```
【{archetype前綴}】【技術門檻】...【供應鏈壁壘】...【商務挑戰】...【產業特性】...
```

### EntryPoint 結構化格式

```
【{archetype前綴}】【短期（6-12個月）】...【中期（1-2年）】...【長期（2-3年）】...【關鍵行動】...
```

### Decision Maker 溝通策略差異

- **技術決策者**：聚焦效能基準、GPU 密度、散熱效率、NVIDIA 認證、POC 測試
- **採購決策者**：聚焦 TCO 分析、供應鏈多元化價值、付款彈性、交期承諾

---

## 9. 已確認的 ASUS 既有客戶

以下企業已確認使用 ASUS 伺服器，在資料中 difficulty 分數較低：

| 企業 | 區域 | 產品 | 狀態 |
|------|------|------|------|
| Nebius Group | EMEA | ESC series, GB200 NVL72 | 活躍，主要供應商 |
| Yotta Data Services | APAC/India | ESC N8-E11 (HGX H100) | 活躍，曾有付款延遲（已收回） |
| Sakura Internet | APAC/Japan | GPU servers | 活躍 |
| FPT Corporation | APAC/Vietnam | ESC N8-E11 | 活躍 |

---

## 10. 常用指令

```bash
# 開發
pnpm dev                    # 啟動開發伺服器（localhost:3000）

# 建置
pnpm run build:client       # 僅打包前端（Vercel 用）
pnpm run build              # 打包前端 + 後端（Manus 用）

# 型別檢查
pnpm run check              # TypeScript 型別檢查

# 格式化
pnpm run format             # Prettier 格式化
```

---

## 11. 擴展建議

如果未來需要擴展本專案，以下是建議的優先順序：

1. **後端 API + 資料庫**：將 JSON 資料遷移至 PostgreSQL，支援即時更新和多人協作
2. **使用者認證**：加入登入機制，限制存取權限
3. **互動式儀表板**：加入 Chart.js/D3.js 統計圖表（依產業/區域/難易度）
4. **ASUS 既有客戶標記**：在表格中以視覺標記一眼辨識已合作企業
5. **批量比較功能**：允許勾選多家企業進行並排比較
6. **深色模式**：在 `index.css` 新增 `.dark {}` 色彩變數

---

*本文件由 Manus AI 於 2026 年 3 月 20 日撰寫。如有疑問，請參考 `ideas.md` 了解設計決策歷程。*
