import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  GitBranch,
  Globe,
  AlertTriangle,
  ExternalLink,
  Server,
} from "lucide-react";

const GITHUB_OWNER = "smaxchen2";
const GITHUB_REPO = "asus-server-strategy";
const BRANCH = "main";

const DATA_FILES = [
  {
    key: "na",
    label: "北美 (NA)",
    flag: "🇺🇸",
    path: "client/src/data/companies.json",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50",
  },
  {
    key: "apac",
    label: "亞太 (APAC)",
    flag: "🌏",
    path: "client/src/data/apac_companies.json",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgLight: "bg-emerald-50",
  },
  {
    key: "emea",
    label: "EMEA",
    flag: "🇪🇺",
    path: "client/src/data/emea_companies.json",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
  },
  {
    key: "china",
    label: "中國大陸",
    flag: "🇨🇳",
    path: "client/src/data/china_companies.json",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
  },
];

type FileStatus = "idle" | "loading" | "success" | "error";

interface RegionData {
  key: string;
  status: FileStatus;
  companyCount: number;
  lastCommitDate: string;
  lastCommitMessage: string;
  lastCommitSha: string;
  firstCompany: string;
  lastCompany: string;
  fileSizeKb: number;
  error?: string;
}

interface RepoInfo {
  status: FileStatus;
  lastCommitDate: string;
  lastCommitMessage: string;
  lastCommitSha: string;
  totalCommits?: number;
  error?: string;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Taipei",
  }) + " (GMT+8)";
}

function StatusIcon({ status }: { status: FileStatus }) {
  if (status === "loading") return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
  if (status === "success") return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  if (status === "error") return <XCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-muted-foreground" />;
}

function StatusBadge({ status }: { status: FileStatus }) {
  const map = {
    idle: "bg-muted text-muted-foreground",
    loading: "bg-blue-100 text-blue-700",
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-red-100 text-red-700",
  };
  const label = { idle: "待檢查", loading: "讀取中...", success: "連線正常", error: "連線失敗" };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 ${map[status]}`}>
      <StatusIcon status={status} />
      {label[status]}
    </span>
  );
}

export default function DataStatus() {
  const [repoInfo, setRepoInfo] = useState<RepoInfo>({ status: "idle", lastCommitDate: "", lastCommitMessage: "", lastCommitSha: "" });
  const [regions, setRegions] = useState<RegionData[]>(
    DATA_FILES.map((f) => ({
      key: f.key,
      status: "idle" as FileStatus,
      companyCount: 0,
      lastCommitDate: "",
      lastCommitMessage: "",
      lastCommitSha: "",
      firstCompany: "",
      lastCompany: "",
      fileSizeKb: 0,
    }))
  );
  const [lastChecked, setLastChecked] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRepoInfo = useCallback(async () => {
    setRepoInfo((prev) => ({ ...prev, status: "loading" }));
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${BRANCH}`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRepoInfo({
        status: "success",
        lastCommitDate: data.commit?.committer?.date || data.commit?.author?.date || "",
        lastCommitMessage: data.commit?.message?.split("\n")[0] || "",
        lastCommitSha: data.sha?.slice(0, 7) || "",
      });
    } catch (e: unknown) {
      setRepoInfo((prev) => ({ ...prev, status: "error", error: String(e) }));
    }
  }, []);

  const fetchRegionData = useCallback(async (fileConfig: typeof DATA_FILES[0], index: number) => {
    setRegions((prev) =>
      prev.map((r, i) => (i === index ? { ...r, status: "loading" } : r))
    );

    try {
      // Fetch file content via GitHub Contents API
      const contentsRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${fileConfig.path}?ref=${BRANCH}`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );
      if (!contentsRes.ok) throw new Error(`Contents API HTTP ${contentsRes.status}`);
      const contentsData = await contentsRes.json();
      const fileSizeKb = Math.round((contentsData.size || 0) / 1024);

      // Fetch raw JSON
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${fileConfig.path}`;
      const rawRes = await fetch(rawUrl);
      if (!rawRes.ok) throw new Error(`Raw HTTP ${rawRes.status}`);
      const json = await rawRes.json();
      const companies = json.companies || [];

      // Fetch last commit for this file
      const commitsRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${fileConfig.path}&sha=${BRANCH}&per_page=1`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );
      let lastCommitDate = "";
      let lastCommitMessage = "";
      let lastCommitSha = "";
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        if (commitsData.length > 0) {
          lastCommitDate = commitsData[0].commit?.committer?.date || commitsData[0].commit?.author?.date || "";
          lastCommitMessage = commitsData[0].commit?.message?.split("\n")[0] || "";
          lastCommitSha = commitsData[0].sha?.slice(0, 7) || "";
        }
      }

      setRegions((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                status: "success",
                companyCount: companies.length,
                lastCommitDate,
                lastCommitMessage,
                lastCommitSha,
                firstCompany: companies[0]?.company || "—",
                lastCompany: companies[companies.length - 1]?.company || "—",
                fileSizeKb,
              }
            : r
        )
      );
    } catch (e: unknown) {
      setRegions((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, status: "error", error: String(e) } : r
        )
      );
    }
  }, []);

  const runAllChecks = useCallback(async () => {
    setIsRefreshing(true);
    setLastChecked("");
    await fetchRepoInfo();
    await Promise.all(DATA_FILES.map((f, i) => fetchRegionData(f, i)));
    setLastChecked(new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }));
    setIsRefreshing(false);
  }, [fetchRepoInfo, fetchRegionData]);

  useEffect(() => {
    runAllChecks();
  }, [runAllChecks]);

  const allSuccess = regions.every((r) => r.status === "success") && repoInfo.status === "success";
  const hasError = regions.some((r) => r.status === "error") || repoInfo.status === "error";
  const totalCompanies = regions.reduce((sum, r) => sum + r.companyCount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-20">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                  返回儀表板
                </span>
              </Link>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary flex items-center justify-center">
                  <Database className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    資料連線狀態
                  </h1>
                  <p className="text-[10px] text-muted-foreground tracking-wide">Internal Data Status Check</p>
                </div>
              </div>
            </div>
            <button
              onClick={runAllChecks}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border bg-white hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              重新檢查
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">

        {/* Overall Status Banner */}
        <div className={`mb-8 p-5 border-l-4 ${allSuccess ? "border-emerald-500 bg-emerald-50" : hasError ? "border-red-500 bg-red-50" : "border-amber-500 bg-amber-50"}`}>
          <div className="flex items-center gap-3">
            {allSuccess ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            ) : hasError ? (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            ) : (
              <RefreshCw className="w-6 h-6 text-amber-600 flex-shrink-0 animate-spin" />
            )}
            <div>
              <p className={`text-sm font-bold ${allSuccess ? "text-emerald-800" : hasError ? "text-red-800" : "text-amber-800"}`}>
                {allSuccess
                  ? "✅ 所有資料來源連線正常，GitHub 資料為最新版本"
                  : hasError
                  ? "❌ 部分資料來源連線失敗，請檢查網路或 GitHub API 限制"
                  : "⏳ 正在從 GitHub 讀取最新資料..."}
              </p>
              {lastChecked && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  最後檢查時間：{lastChecked} (GMT+8)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Repo Info */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">GitHub 儲存庫資訊</h2>
          </div>
          <div className="border border-border bg-white p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{GITHUB_OWNER}/{GITHUB_REPO}</span>
                  <StatusBadge status={repoInfo.status} />
                </div>
                <a
                  href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  github.com/{GITHUB_OWNER}/{GITHUB_REPO}
                </a>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-foreground text-background">
                branch: {BRANCH}
              </span>
            </div>
            {repoInfo.status === "success" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">最新 Commit</p>
                  <p className="text-xs font-mono text-foreground">{repoInfo.lastCommitSha}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">Commit 時間</p>
                  <p className="text-xs text-foreground">{formatDate(repoInfo.lastCommitDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">Commit 訊息</p>
                  <p className="text-xs text-foreground truncate" title={repoInfo.lastCommitMessage}>{repoInfo.lastCommitMessage}</p>
                </div>
              </div>
            )}
            {repoInfo.status === "error" && (
              <div className="flex items-center gap-2 mt-3 text-xs text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                {repoInfo.error}
              </div>
            )}
          </div>
        </section>

        {/* Summary KPIs */}
        {allSuccess && (
          <section className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border">
              {[
                { label: "資料檔案", value: "4", sub: "個 JSON 檔案" },
                { label: "企業總數", value: String(totalCompanies), sub: "筆企業資料" },
                { label: "涵蓋區域", value: "4", sub: "NA / APAC / EMEA / China" },
                { label: "資料狀態", value: "最新", sub: "已與 GitHub 同步" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white p-4 text-center">
                  <p className="text-2xl font-black tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>{kpi.value}</p>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mt-0.5">{kpi.label}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Region Data Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">各區域資料狀態</h2>
          </div>
          <div className="space-y-px border border-border">
            {DATA_FILES.map((fileConfig, index) => {
              const region = regions[index];
              return (
                <div key={fileConfig.key} className="bg-white p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{fileConfig.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{fileConfig.label}</span>
                          <StatusBadge status={region.status} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{fileConfig.path}</p>
                      </div>
                    </div>
                    {region.status === "success" && (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 ${fileConfig.color}`} />
                        <span className="text-lg font-black tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {region.companyCount}
                        </span>
                        <span className="text-xs text-muted-foreground">筆</span>
                      </div>
                    )}
                  </div>

                  {region.status === "success" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">最新 Commit</p>
                        <p className="text-xs font-mono">{region.lastCommitSha || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">最後更新時間</p>
                        <p className="text-xs">{formatDate(region.lastCommitDate)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">第一筆（排名 #1）</p>
                        <p className="text-xs font-medium truncate" title={region.firstCompany}>{region.firstCompany}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">最後一筆</p>
                        <p className="text-xs font-medium truncate" title={region.lastCompany}>{region.lastCompany}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-4">
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">最新 Commit 訊息</p>
                        <p className="text-xs text-foreground/70 truncate" title={region.lastCommitMessage}>{region.lastCommitMessage || "—"}</p>
                      </div>
                    </div>
                  )}

                  {region.status === "loading" && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      正在從 GitHub 讀取資料...
                    </div>
                  )}

                  {region.status === "error" && (
                    <div className="flex items-center gap-2 text-xs text-red-600 pt-3 border-t border-border">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {region.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* GitHub API Note */}
        <section className="mt-8 p-4 bg-muted/30 border border-border">
          <div className="flex items-start gap-2">
            <Server className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold">資料來源說明</p>
              <p>本頁面透過 <strong>GitHub Raw Content API</strong> 及 <strong>GitHub REST API</strong> 即時讀取 <code className="bg-muted px-1 py-0.5 font-mono text-[10px]">smaxchen2/asus-server-strategy</code> 儲存庫的最新資料，不使用打包進 bundle 的靜態版本。</p>
              <p>GitHub API 未驗證時每小時限制 60 次請求。若出現 403 錯誤，請稍後再試。</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
