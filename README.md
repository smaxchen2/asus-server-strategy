# ASUS 全球伺服器市場拓展策略儀表板

> **專案目標**：這是一個「ASUS 全球伺服器市場拓展策略」的內部儀表板（Dashboard），主要用來展示全球 400 家頂尖企業的伺服器採購策略、難易度分析，以及各項產業的數據總覽，協助 ASUS 伺服器業務團隊快速查找客戶資訊與切入策略。

本文件為 **AI 專屬交接文件與開發指南**，確保任何接手的 AI 助手或開發者都能快速掌握專案的核心邏輯與開發規範。

---

## 1. 技術架構總覽

本專案採用 **純前端靜態架構 (web-static)**，沒有後端 API，也沒有真實的外部資料庫。

| 層次 | 技術 | 說明 |
|------|------|------|
| **前端框架** | React 19 + TypeScript + Vite 7 | SPA 架構，核心程式碼位於 `client/src/` |
| **路由** | Wouter 3.x | 純前端輕量路由，處理區域切換與詳細頁面 |
| **樣式** | TailwindCSS v4 + shadcn/ui | 基於 CSS 變數的語義化設計 |
| **部署** | Vercel | 透過 `vercel.json` 設定，使用 `build:client` 僅打包前端 |
| **資料** | 靜態 JSON | 4 個地區各一份，打包進前端 bundle |

### 部署注意事項
專案中雖然有 `server/` 目錄，但僅為相容性佔位，不參與實際運作。
在 Vercel 部署時，**絕對必須使用 `build:client` 指令**（僅執行 `vite build`）。如果執行預設的 `build` 指令，會錯誤地打包 server 端程式碼導致部署失敗。

---

## 2. 資料存放邏輯與結構

所有關於企業名單、難易度、採購量的資料，都是以靜態檔案寫死在程式碼裡的。
資料存放在 `client/src/data/` 目錄下，分為四個區域，共 405 筆資料：

| 檔案名稱 | 地區 | 筆數 | 總採購量 |
|----------|------|------|----------|
| `companies.json` | 北美 (NA) | 100 筆 | ~6.5M 台/年 |
| `apac_companies.json` | 亞太 (APAC) | 105 筆 | ~4.2M 台/年 |
| `emea_companies.json` | 歐洲中東非洲 (EMEA) | 100 筆 | ~2.8M 台/年 |
| `china_companies.json` | 中國大陸 (China) | 100 筆 | ~5.0M 台/年 |

### 資料更新流程
未來新增或修改資料時，**請直接更新對應的靜態 JSON 檔案**。
若新增了資料欄位，必須同步更新以下四個地方：
1. `client/src/lib/regions.ts` 中的 `Company` 型別定義
2. `client/src/data/*.json` 中的資料內容
3. `client/src/pages/Home.tsx` 中的搜尋過濾邏輯與 CSV/Excel 匯出函式
4. `client/src/pages/CompanyDetail.tsx` 中的 UI 呈現

---

## 3. UI/UX 設計規範

本專案採用 **Swiss Data Visualization（瑞士國際主義數據視覺化）** 設計哲學。

### 核心設計原則
- **深色科技感與極簡風格**：維持現有的黑白為主、無圓角、無漸層的純粹資訊呈現。
- **嚴格的網格系統**：所有元素基於 8px 基準網格對齊。
- **色彩為功能服務**：色彩僅用於傳達數據意義。例如難易度使用：翡翠綠（較易 1-4）、琥珀色（中等 5-7）、珊瑚紅（困難 8-10）。
- **字體系統**：標題使用 `DM Sans`，內文與數據使用 `Inter`，數字必須使用 tabular figures 確保對齊。

### 開發限制
- **不可修改 UI 元件底層**：`client/src/components/ui/` 目錄為 shadcn/ui 自動產生，如需客製化，應在使用處覆寫 props 或 className。
- **色彩必須使用 CSS 變數**：禁止硬編碼色彩值（如 `#FF0000`），必須使用 Tailwind 的語義化類別（如 `bg-primary`, `text-foreground`），且 Tailwind v4 的 `@theme inline` 區塊必須使用 **OKLCH 色彩格式**。

---

## 4. 策略內容與欄位規範

每筆企業資料包含 21 個欄位，其中策略相關欄位有嚴格的格式要求：

### Archetype 企業分類
每家企業被分類為以下 9 種 archetype 之一（或通用的 `enterprise_general`），策略內容必須依 archetype 差異化：
`hyperscaler`（超大規模雲端）、`neocloud`（AI 新創）、`financial`（金融）、`healthcare`（醫療）、`defense`（國防）、`telecom`（電信）、`automotive`（汽車）、`retail`（零售）、`energy`（能源）。

### 結構化標題格式
- **`challenges` (困難點)** 必須包含：`【{archetype前綴}】【技術門檻】...【供應鏈壁壘】...【商務挑戰】...【產業特性】...`
- **`entryPoint` (切入點)** 必須包含：`【{archetype前綴}】【短期（6-12個月）】...【中期（1-2年）】...【長期（2-3年）】...【關鍵行動】...`

### 決策者溝通策略差異
- **技術決策者 (`techDecisionMaker`)**：聚焦效能基準、GPU 密度、散熱效率、NVIDIA 認證、POC 測試。
- **採購決策者 (`procurementDecisionMaker`)**：聚焦 TCO 分析、供應鏈多元化價值、付款彈性、交期承諾。

---

## 5. 內部工具與特殊路由

### 資料連線狀態頁面
專案內建一個供內部確認資料狀態的頁面，路徑為 `/internal/data-status`。
該頁面會透過 GitHub Raw Content API 即時讀取 `smaxchen2/asus-server-strategy` 的 `main` 分支 JSON 檔案，以確認部署的資料是否與 GitHub 上最新版本一致。

---

## 6. 開發與部署指令

```bash
# 安裝依賴
pnpm install

# 啟動本地開發伺服器
pnpm dev

# 建置前端 (Vercel 部署專用)
pnpm run build:client

# TypeScript 型別檢查
pnpm run check
```

每次修改完成後，請確保 `pnpm run build:client` 能夠正常通過，再將修改 Push 到 `main` 分支，Vercel 將會自動觸發部署。

---
*本文件由 AI 助手建立與維護，請在開啟新對話時優先讀取本文件以恢復專案記憶。*
