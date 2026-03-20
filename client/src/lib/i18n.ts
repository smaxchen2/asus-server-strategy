export type Lang = "zh" | "en";

export interface Translations {
  /* ─── Header ─── */
  siteTitle: string;
  siteSubtitle: string;
  regions: string;
  companies: string;

  /* ─── Region labels ─── */
  regionNA: string;
  regionAPAC: string;
  regionEMEA: string;
  regionChina: string;
  regionNAShort: string;
  regionAPACShort: string;
  regionEMEAShort: string;
  regionChinaShort: string;

  /* ─── Hero / Dashboard ─── */
  marketIntelligence: string;
  strategyOverviewSuffix: string;
  regionDescriptionSuffix: string;
  regionDescriptionDetails: string;
  kpiCompanies: string;
  kpiTopPrefix: string;
  kpiUnitsPerYear: string;
  kpiAnnualVolume: string;
  kpiNeoCloud: string;
  kpiAICloud: string;
  kpiHighDifficulty: string;
  kpiScore810: string;

  /* ─── Difficulty Distribution ─── */
  difficultyDistribution: string;
  difficultyAvg: string;
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;

  /* ─── Filters ─── */
  searchPlaceholder: string;
  filterDifficulty: string;
  filterChannel: string;
  filterIndustry: string;
  filterAll: string;
  filterEasy: string;
  filterMedium: string;
  filterHard: string;
  filterDirect: string;
  filterSIDIST: string;
  filterMixed: string;
  clearAllFilters: string;

  /* ─── Industry Categories ─── */
  industryAll: string;
  industryNeoCloud: string;
  industryTech: string;
  industryFinance: string;
  industryHealthcare: string;
  industryDefense: string;
  industryTelecom: string;
  industryEnergy: string;
  industryAutomotive: string;
  industryRetail: string;
  industryMedia: string;
  industryLogistics: string;
  industryIndustrial: string;
  industryOther: string;

  /* ─── Results / Table ─── */
  showing: string;
  of: string;
  companiesSuffix: string;
  exportExcel: string;
  exportCSV: string;
  clickToExpand: string;
  noResults: string;

  /* ─── Table Headers ─── */
  thRank: string;
  thCompanyName: string;
  thIndustry: string;
  thAnnualVolume: string;
  thChannel: string;
  thDifficulty: string;

  /* ─── Expanded Row ─── */
  industryCategory: string;
  serverPlatform: string;
  serverApplication: string;
  currentSuppliers: string;
  odmOem: string;
  asusModel: string;
  challengesTitle: string;
  entryPointTitle: string;
  channelLabel: string;
  siDistChannel: string;
  volumeSource: string;
  techDecisionMaker: string;
  procurementDecisionMaker: string;
  commStrategy: string;
  pendingVerification: string;
  viewFullDetails: string;
  actualPartner: string;

  /* ─── Company Detail Page ─── */
  backToList: string;
  companyPrefix: string;
  difficultyScale: string;
  regionCountry: string;
  annualServerVolume: string;
  serverPlatformArch: string;
  serverApp: string;
  currentSuppliersLabel: string;
  odmOemLabel: string;
  asusModelLabel: string;
  directSIDIST: string;
  keyPerson: string;
  siDistPartners: string;
  volumeSourceLabel: string;
  directOrPending: string;
  basedOnEstimate: string;
  linkedinProfile: string;
  sourceLabel: string;
  infoTBD: string;

  /* ─── Difficulty Modal ─── */
  diffModalTitle: string;
  diffModalSubtitle: string;
  diffModalFormula: string;
  diffModalFormulaDesc: string;
  diffModalD1: string;
  diffModalD1Desc: string;
  diffModalD2: string;
  diffModalD2Desc: string;
  diffModalD3: string;
  diffModalD3Desc: string;
  diffModalD4: string;
  diffModalD4Desc: string;
  diffModalD5: string;
  diffModalD5Desc: string;
  diffModalD6: string;
  diffModalD6Desc: string;
  diffModalWeight: string;
  diffModalScore: string;
  diffModalWeighted: string;
  diffModalFinalScore: string;
  diffModalAnalysis: string;
  diffModalClose: string;
  diffModalViewDetail: string;

  /* ─── DataStatus Page ─── */
  backToDashboard: string;
  dataConnectionStatus: string;
  dataStatusSubtitle: string;
  refreshCheck: string;
  allSourcesOk: string;
  someSourcesFailed: string;
  loadingFromGithub: string;
  lastCheckedAt: string;
  githubRepoInfo: string;
  latestCommit: string;
  commitTime: string;
  commitMessage: string;
  dataFiles: string;
  jsonFiles: string;
  totalCompanies: string;
  companyRecords: string;
  coveredRegions: string;
  regionsList: string;
  dataStatus: string;
  upToDate: string;
  syncedWithGithub: string;
  regionDataStatus: string;
  records: string;
  lastUpdate: string;
  firstRecord: string;
  lastRecord: string;
  latestCommitMsg: string;
  readingFromGithub: string;
  dataSourceNote: string;
  dataSourceDesc: string;
  githubApiNote: string;

  /* ─── Footer ─── */
  footerTitle: string;
  footerReport: string;
  footerSources: string;

  /* ─── Export Headers ─── */
  exportRank: string;
  exportCompanyName: string;
  exportIndustry: string;
  exportRegion: string;
  exportVolume: string;
  exportPlatform: string;
  exportApplication: string;
  exportSuppliers: string;
  exportOdmOem: string;
  exportAsusModel: string;
  exportChannel: string;
  exportDifficulty: string;
  exportChallenges: string;
  exportEntryPoint: string;
  exportTechDM: string;
  exportTechDMTitle: string;
  exportTechDMLinkedin: string;
  exportTechCommStrategy: string;
  exportProcDM: string;
  exportProcDMTitle: string;
  exportProcDMLinkedin: string;
  exportProcCommStrategy: string;
  exportSIDIST: string;
  exportActualSI: string;
  exportArchetype: string;
  exportVolumeSource: string;

  /* ─── Status labels ─── */
  statusIdle: string;
  statusLoading: string;
  statusSuccess: string;
  statusError: string;

  /* ─── Language switcher ─── */
  langZh: string;
  langEn: string;
}

const zh: Translations = {
  /* Header */
  siteTitle: "ASUS Global Server Strategy",
  siteSubtitle: "全球伺服器市場拓展策略",
  regions: "4 Regions",
  companies: "405 Companies",

  /* Region labels */
  regionNA: "北美",
  regionAPAC: "亞太",
  regionEMEA: "歐洲中東非洲",
  regionChina: "中國大陸",
  regionNAShort: "NA",
  regionAPACShort: "APAC",
  regionEMEAShort: "EMEA",
  regionChinaShort: "China",

  /* Hero */
  marketIntelligence: "Market Intelligence",
  strategyOverviewSuffix: "伺服器採購商策略分析總覽",
  regionDescriptionSuffix: "伺服器採購商",
  regionDescriptionDetails: "，包含年採購量、伺服器架構、現有供應商、ASUS 對應產品線、通路策略、困難點與切入策略。",
  kpiCompanies: "企業",
  kpiTopPrefix: "Top",
  kpiUnitsPerYear: "台/年",
  kpiAnnualVolume: "年度總採購量",
  kpiNeoCloud: "NeoCloud",
  kpiAICloud: "AI 雲端企業",
  kpiHighDifficulty: "高難度",
  kpiScore810: "8-10 分",

  /* Difficulty Distribution */
  difficultyDistribution: "難易度分佈",
  difficultyAvg: "平均",
  difficultyEasy: "較易",
  difficultyMedium: "中等",
  difficultyHard: "困難",

  /* Filters */
  searchPlaceholder: "搜尋企業名稱、產業、區域、應用、供應商、ASUS 型號、SI/DIST、Key Person...",
  filterDifficulty: "難易度",
  filterChannel: "通路",
  filterIndustry: "產業",
  filterAll: "全部",
  filterEasy: "較易 (1-4)",
  filterMedium: "中等 (5-7)",
  filterHard: "困難 (8-10)",
  filterDirect: "直供",
  filterSIDIST: "SI/DIST",
  filterMixed: "混合",
  clearAllFilters: "清除全部篩選",

  /* Industry */
  industryAll: "全部",
  industryNeoCloud: "NeoCloud/AI",
  industryTech: "科技",
  industryFinance: "金融",
  industryHealthcare: "醫療",
  industryDefense: "國防",
  industryTelecom: "電信",
  industryEnergy: "能源",
  industryAutomotive: "汽車/製造",
  industryRetail: "零售",
  industryMedia: "媒體",
  industryLogistics: "物流",
  industryIndustrial: "工業",
  industryOther: "其他",

  /* Results */
  showing: "顯示",
  of: "/",
  companiesSuffix: "家企業",
  exportExcel: "匯出 Excel",
  exportCSV: "匯出 CSV",
  clickToExpand: "點擊列展開詳細資訊",
  noResults: "找不到符合條件的企業",

  /* Table Headers */
  thRank: "#",
  thCompanyName: "企業名稱",
  thIndustry: "產業",
  thAnnualVolume: "年採購量",
  thChannel: "通路",
  thDifficulty: "難易度",

  /* Expanded Row */
  industryCategory: "產業分類",
  serverPlatform: "伺服器機型及平台架構",
  serverApplication: "伺服器應用",
  currentSuppliers: "目前供應商",
  odmOem: "ODM/OEM",
  asusModel: "ASUS 對應型號",
  challengesTitle: "困難點及如何克服",
  entryPointTitle: "切入點及如何執行",
  channelLabel: "直供/SI/DIST 通路",
  siDistChannel: "SI/DIST 通路",
  volumeSource: "採購量數據來源",
  techDecisionMaker: "技術決策者 (CTO / Architect)",
  procurementDecisionMaker: "採購決策者 (VP Procurement)",
  commStrategy: "溝通策略",
  pendingVerification: "待查證",
  viewFullDetails: "查看完整詳情",
  actualPartner: "實際合作",

  /* Company Detail */
  backToList: "返回總表",
  companyPrefix: "Company",
  difficultyScale: "10 最難 · 1 最簡單",
  regionCountry: "區域/國家",
  annualServerVolume: "伺服器年採購量",
  serverPlatformArch: "伺服器機型及平台架構",
  serverApp: "伺服器應用",
  currentSuppliersLabel: "目前供應商",
  odmOemLabel: "ODM/OEM",
  asusModelLabel: "ASUS 對應型號",
  directSIDIST: "直供/SI/DIST",
  keyPerson: "Key Person",
  siDistPartners: "SI/DIST 通路夥伴",
  volumeSourceLabel: "採購量數據來源",
  directOrPending: "直供或資訊待更新",
  basedOnEstimate: "基於產業分析估算",
  linkedinProfile: "LinkedIn Profile",
  sourceLabel: "來源",
  infoTBD: "資訊待更新",

  /* Difficulty Modal */
  diffModalTitle: "難易度評估報告",
  diffModalSubtitle: "六維度加權評分系統",
  diffModalFormula: "計算公式",
  diffModalFormulaDesc: "Final Score = D1×0.25 + D2×0.20 + D3×0.20 + D4×0.15 + D5×0.10 + D6×0.10",
  diffModalD1: "D1 供應商鎖定程度",
  diffModalD1Desc: "現有供應商的綁定深度與排他性",
  diffModalD2: "D2 採購決策複雜度",
  diffModalD2Desc: "決策鏈層級、審批流程的複雜程度",
  diffModalD3: "D3 技術門檻",
  diffModalD3Desc: "客製化需求與技術認證要求",
  diffModalD4: "D4 通路可及性",
  diffModalD4Desc: "ASUS 現有通路能否觸及該客戶",
  diffModalD5: "D5 市場競爭強度",
  diffModalD5Desc: "競爭對手數量與強度",
  diffModalD6: "D6 地緣政治與合規風險",
  diffModalD6Desc: "國安審查、資料主權、貿易限制",
  diffModalWeight: "權重",
  diffModalScore: "分數",
  diffModalWeighted: "加權",
  diffModalFinalScore: "最終分數",
  diffModalAnalysis: "評分分析",
  diffModalClose: "關閉",
  diffModalViewDetail: "點擊查看評分詳情",

  /* DataStatus */
  backToDashboard: "返回儀表板",
  dataConnectionStatus: "資料連線狀態",
  dataStatusSubtitle: "Internal Data Status Check",
  refreshCheck: "重新檢查",
  allSourcesOk: "所有資料來源連線正常，GitHub 資料為最新版本",
  someSourcesFailed: "部分資料來源連線失敗，請檢查網路或 GitHub API 限制",
  loadingFromGithub: "正在從 GitHub 讀取最新資料...",
  lastCheckedAt: "最後檢查時間",
  githubRepoInfo: "GitHub 儲存庫資訊",
  latestCommit: "最新 Commit",
  commitTime: "Commit 時間",
  commitMessage: "Commit 訊息",
  dataFiles: "資料檔案",
  jsonFiles: "個 JSON 檔案",
  totalCompanies: "企業總數",
  companyRecords: "筆企業資料",
  coveredRegions: "涵蓋區域",
  regionsList: "NA / APAC / EMEA / China",
  dataStatus: "資料狀態",
  upToDate: "最新",
  syncedWithGithub: "已與 GitHub 同步",
  regionDataStatus: "各區域資料狀態",
  records: "筆",
  lastUpdate: "最後更新時間",
  firstRecord: "第一筆（排名 #1）",
  lastRecord: "最後一筆",
  latestCommitMsg: "最新 Commit 訊息",
  readingFromGithub: "正在從 GitHub 讀取資料...",
  dataSourceNote: "資料來源說明",
  dataSourceDesc: "本頁面透過 GitHub Raw Content API 及 GitHub REST API 即時讀取儲存庫的最新資料，不使用打包進 bundle 的靜態版本。",
  githubApiNote: "GitHub API 未驗證時每小時限制 60 次請求。若出現 403 錯誤，請稍後再試。",

  /* Footer */
  footerTitle: "ASUS Server Business Development",
  footerReport: "全球市場策略報告 2026 Q1",
  footerSources: "資料來源：IDC Server Tracker, Gartner, TrendForce, 各企業年報",

  /* Export Headers */
  exportRank: "排名",
  exportCompanyName: "企業名稱",
  exportIndustry: "產業分類",
  exportRegion: "區域",
  exportVolume: "年採購量",
  exportPlatform: "伺服器平台架構",
  exportApplication: "伺服器應用",
  exportSuppliers: "目前供應商",
  exportOdmOem: "ODM/OEM",
  exportAsusModel: "ASUS 對應型號",
  exportChannel: "通路",
  exportDifficulty: "難易度 (1-10)",
  exportChallenges: "困難點及如何克服",
  exportEntryPoint: "切入點及如何執行",
  exportTechDM: "技術決策者",
  exportTechDMTitle: "技術決策者職稱",
  exportTechDMLinkedin: "技術決策者 LinkedIn",
  exportTechCommStrategy: "技術溝通策略",
  exportProcDM: "採購決策者",
  exportProcDMTitle: "採購決策者職稱",
  exportProcDMLinkedin: "採購決策者 LinkedIn",
  exportProcCommStrategy: "採購溝通策略",
  exportSIDIST: "SI/DIST 通路明細",
  exportActualSI: "實際合作 SI",
  exportArchetype: "企業分類",
  exportVolumeSource: "採購量數據來源",

  /* Status */
  statusIdle: "待檢查",
  statusLoading: "讀取中...",
  statusSuccess: "連線正常",
  statusError: "連線失敗",

  /* Language */
  langZh: "繁中",
  langEn: "EN",
};

const en: Translations = {
  /* Header */
  siteTitle: "ASUS Global Server Strategy",
  siteSubtitle: "Global Server Market Expansion Strategy",
  regions: "4 Regions",
  companies: "405 Companies",

  /* Region labels */
  regionNA: "North America",
  regionAPAC: "Asia Pacific",
  regionEMEA: "EMEA",
  regionChina: "China",
  regionNAShort: "NA",
  regionAPACShort: "APAC",
  regionEMEAShort: "EMEA",
  regionChinaShort: "China",

  /* Hero */
  marketIntelligence: "Market Intelligence",
  strategyOverviewSuffix: "Server Procurement Strategy Overview",
  regionDescriptionSuffix: "server procurement companies",
  regionDescriptionDetails: ", including annual volume, server architecture, current suppliers, ASUS product lineup, channel strategy, challenges and entry strategies.",
  kpiCompanies: "Companies",
  kpiTopPrefix: "Top",
  kpiUnitsPerYear: "Units/Year",
  kpiAnnualVolume: "Annual Total Volume",
  kpiNeoCloud: "NeoCloud",
  kpiAICloud: "AI Cloud Companies",
  kpiHighDifficulty: "High Difficulty",
  kpiScore810: "Score 8-10",

  /* Difficulty Distribution */
  difficultyDistribution: "Difficulty Distribution",
  difficultyAvg: "Avg",
  difficultyEasy: "Easy",
  difficultyMedium: "Medium",
  difficultyHard: "Hard",

  /* Filters */
  searchPlaceholder: "Search company, industry, region, application, supplier, ASUS model, SI/DIST, Key Person...",
  filterDifficulty: "Difficulty",
  filterChannel: "Channel",
  filterIndustry: "Industry",
  filterAll: "All",
  filterEasy: "Easy (1-4)",
  filterMedium: "Medium (5-7)",
  filterHard: "Hard (8-10)",
  filterDirect: "Direct",
  filterSIDIST: "SI/DIST",
  filterMixed: "Mixed",
  clearAllFilters: "Clear all filters",

  /* Industry */
  industryAll: "All",
  industryNeoCloud: "NeoCloud/AI",
  industryTech: "Technology",
  industryFinance: "Finance",
  industryHealthcare: "Healthcare",
  industryDefense: "Defense",
  industryTelecom: "Telecom",
  industryEnergy: "Energy",
  industryAutomotive: "Automotive/Mfg",
  industryRetail: "Retail",
  industryMedia: "Media",
  industryLogistics: "Logistics",
  industryIndustrial: "Industrial",
  industryOther: "Other",

  /* Results */
  showing: "Showing",
  of: "/",
  companiesSuffix: "companies",
  exportExcel: "Export Excel",
  exportCSV: "Export CSV",
  clickToExpand: "Click row to expand details",
  noResults: "No companies match the current filters",

  /* Table Headers */
  thRank: "#",
  thCompanyName: "Company",
  thIndustry: "Industry",
  thAnnualVolume: "Annual Volume",
  thChannel: "Channel",
  thDifficulty: "Difficulty",

  /* Expanded Row */
  industryCategory: "Industry Category",
  serverPlatform: "Server Platform & Architecture",
  serverApplication: "Server Application",
  currentSuppliers: "Current Suppliers",
  odmOem: "ODM/OEM",
  asusModel: "ASUS Recommended Model",
  challengesTitle: "Challenges & How to Overcome",
  entryPointTitle: "Entry Point & Execution Plan",
  channelLabel: "Direct/SI/DIST Channel",
  siDistChannel: "SI/DIST Channel",
  volumeSource: "Volume Data Source",
  techDecisionMaker: "Technical Decision Maker (CTO / Architect)",
  procurementDecisionMaker: "Procurement Decision Maker (VP Procurement)",
  commStrategy: "Communication Strategy",
  pendingVerification: "Pending verification",
  viewFullDetails: "View full details",
  actualPartner: "Actual Partner",

  /* Company Detail */
  backToList: "Back to list",
  companyPrefix: "Company",
  difficultyScale: "10 = Hardest · 1 = Easiest",
  regionCountry: "Region / Country",
  annualServerVolume: "Annual Server Volume",
  serverPlatformArch: "Server Platform & Architecture",
  serverApp: "Server Application",
  currentSuppliersLabel: "Current Suppliers",
  odmOemLabel: "ODM/OEM",
  asusModelLabel: "ASUS Recommended Model",
  directSIDIST: "Direct/SI/DIST",
  keyPerson: "Key Person",
  siDistPartners: "SI/DIST Channel Partners",
  volumeSourceLabel: "Volume Data Source",
  directOrPending: "Direct supply or info pending",
  basedOnEstimate: "Based on industry analysis estimate",
  linkedinProfile: "LinkedIn Profile",
  sourceLabel: "Source",
  infoTBD: "Information pending",

  /* Difficulty Modal */
  diffModalTitle: "Difficulty Assessment Report",
  diffModalSubtitle: "Six-Dimension Weighted Scoring System",
  diffModalFormula: "Formula",
  diffModalFormulaDesc: "Final Score = D1×0.25 + D2×0.20 + D3×0.20 + D4×0.15 + D5×0.10 + D6×0.10",
  diffModalD1: "D1 Supplier Lock-in",
  diffModalD1Desc: "Depth and exclusivity of existing supplier binding",
  diffModalD2: "D2 Procurement Complexity",
  diffModalD2Desc: "Decision chain levels and approval process complexity",
  diffModalD3: "D3 Technical Barrier",
  diffModalD3Desc: "Customization needs and technical certification requirements",
  diffModalD4: "D4 Channel Accessibility",
  diffModalD4Desc: "Whether ASUS existing channels can reach this customer",
  diffModalD5: "D5 Market Competition",
  diffModalD5Desc: "Number and intensity of competitors",
  diffModalD6: "D6 Geopolitical & Compliance Risk",
  diffModalD6Desc: "National security review, data sovereignty, trade restrictions",
  diffModalWeight: "Weight",
  diffModalScore: "Score",
  diffModalWeighted: "Weighted",
  diffModalFinalScore: "Final Score",
  diffModalAnalysis: "Scoring Analysis",
  diffModalClose: "Close",
  diffModalViewDetail: "Click to view scoring details",

  /* DataStatus */
  backToDashboard: "Back to Dashboard",
  dataConnectionStatus: "Data Connection Status",
  dataStatusSubtitle: "Internal Data Status Check",
  refreshCheck: "Refresh",
  allSourcesOk: "All data sources connected. GitHub data is up to date.",
  someSourcesFailed: "Some data sources failed. Check network or GitHub API rate limit.",
  loadingFromGithub: "Loading latest data from GitHub...",
  lastCheckedAt: "Last checked",
  githubRepoInfo: "GitHub Repository Info",
  latestCommit: "Latest Commit",
  commitTime: "Commit Time",
  commitMessage: "Commit Message",
  dataFiles: "Data Files",
  jsonFiles: "JSON files",
  totalCompanies: "Total Companies",
  companyRecords: "company records",
  coveredRegions: "Covered Regions",
  regionsList: "NA / APAC / EMEA / China",
  dataStatus: "Data Status",
  upToDate: "Up to date",
  syncedWithGithub: "Synced with GitHub",
  regionDataStatus: "Regional Data Status",
  records: "records",
  lastUpdate: "Last Updated",
  firstRecord: "First Record (#1)",
  lastRecord: "Last Record",
  latestCommitMsg: "Latest Commit Message",
  readingFromGithub: "Reading data from GitHub...",
  dataSourceNote: "Data Source Note",
  dataSourceDesc: "This page reads the latest data from the repository via GitHub Raw Content API and GitHub REST API in real-time, not from the bundled static version.",
  githubApiNote: "GitHub API allows 60 requests/hour without authentication. If you see a 403 error, please try again later.",

  /* Footer */
  footerTitle: "ASUS Server Business Development",
  footerReport: "Global Market Strategy Report 2026 Q1",
  footerSources: "Sources: IDC Server Tracker, Gartner, TrendForce, Company Annual Reports",

  /* Export Headers */
  exportRank: "Rank",
  exportCompanyName: "Company Name",
  exportIndustry: "Industry",
  exportRegion: "Region",
  exportVolume: "Annual Volume",
  exportPlatform: "Server Platform",
  exportApplication: "Server Application",
  exportSuppliers: "Current Suppliers",
  exportOdmOem: "ODM/OEM",
  exportAsusModel: "ASUS Model",
  exportChannel: "Channel",
  exportDifficulty: "Difficulty (1-10)",
  exportChallenges: "Challenges & Solutions",
  exportEntryPoint: "Entry Point & Execution",
  exportTechDM: "Tech Decision Maker",
  exportTechDMTitle: "Tech DM Title",
  exportTechDMLinkedin: "Tech DM LinkedIn",
  exportTechCommStrategy: "Tech Comm Strategy",
  exportProcDM: "Procurement Decision Maker",
  exportProcDMTitle: "Procurement DM Title",
  exportProcDMLinkedin: "Procurement DM LinkedIn",
  exportProcCommStrategy: "Procurement Comm Strategy",
  exportSIDIST: "SI/DIST Details",
  exportActualSI: "Actual SI Partners",
  exportArchetype: "Company Archetype",
  exportVolumeSource: "Volume Source",

  /* Status */
  statusIdle: "Idle",
  statusLoading: "Loading...",
  statusSuccess: "Connected",
  statusError: "Failed",

  /* Language */
  langZh: "繁中",
  langEn: "EN",
};

export const translations: Record<Lang, Translations> = { zh, en };

export function getTranslations(lang: Lang): Translations {
  return translations[lang];
}
