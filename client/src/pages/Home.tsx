import { useState, useMemo, Fragment } from "react";
import { Link, useParams, useLocation } from "wouter";
import { getRegion, regionKeys, type RegionKey, type Company } from "@/lib/regions";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Server,
  Building2,
  Target,
  X,
  ExternalLink,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";

type SortField = "rank" | "difficulty" | "company";
type SortDir = "asc" | "desc";

/* ─── Region label map ─── */
const regionLabels: Record<RegionKey, { label: string; short: string; flag: string }> = {
  na: { label: "北美", short: "NA", flag: "🇺🇸" },
  apac: { label: "亞太", short: "APAC", flag: "🌏" },
  emea: { label: "歐洲中東非洲", short: "EMEA", flag: "🇪🇺" },
  china: { label: "中國大陸", short: "China", flag: "🇨🇳" },
};

/* ─── Difficulty helpers ─── */
function getDifficultyColor(score: number) {
  if (score <= 4) return { bg: "bg-emerald-500", text: "text-emerald-700", label: "較易" };
  if (score <= 7) return { bg: "bg-amber-500", text: "text-amber-700", label: "中等" };
  return { bg: "bg-red-500", text: "text-red-700", label: "困難" };
}

function DifficultyBar({ score }: { score: number }) {
  const { bg } = getDifficultyColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted overflow-hidden">
        <div className={`h-full ${bg}`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums w-5 text-right">{score}</span>
    </div>
  );
}

/* ─── Expanded Row ─── */
function ExpandedRow({ company, regionKey }: { company: Company; regionKey: string }) {
  const basePath = regionKey === "na" ? "" : `/region/${regionKey}`;
  return (
    <tr>
      <td colSpan={7} className="p-0">
        <div className="bg-muted/30 border-t border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
            <div className="bg-white p-5 space-y-4">
              <InfoBlock label="伺服器機型及平台架構" value={company.platform} />
              <InfoBlock label="伺服器應用" value={company.application} />
              <InfoBlock label="目前供應商" value={company.currentSuppliers} />
            </div>
            <div className="bg-white p-5 space-y-4">
              <InfoBlock label="ODM/OEM" value={company.odmOem} />
              <InfoBlock label="ASUS 對應型號" value={company.asusModel} />
              <InfoBlock label="直供/SI/DIST" value={company.channel} />
            </div>
            <div className="bg-white p-5 space-y-4">
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-600 mb-1.5">困難點及如何克服</div>
                <p className="text-xs leading-relaxed text-foreground/80">{company.challenges}</p>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-1.5">切入點及如何執行</div>
                <p className="text-xs leading-relaxed text-foreground/80">{company.entryPoint}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-2.5 bg-white border-t border-border flex justify-end">
            <Link href={`${basePath}/company/${company.rank}`}>
              <span className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                查看完整詳情 <ExternalLink className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </td>
    </tr>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">{label}</div>
      <p className="text-xs leading-relaxed">{value}</p>
    </div>
  );
}

/* ─── Filter Tags ─── */
const difficultyFilters = [
  { label: "全部", value: "all" },
  { label: "較易 (1-4)", value: "easy" },
  { label: "中等 (5-7)", value: "medium" },
  { label: "困難 (8-10)", value: "hard" },
];

const channelFilters = [
  { label: "全部", value: "all" },
  { label: "直供", value: "direct" },
  { label: "SI/DIST", value: "si_dist" },
  { label: "混合", value: "mixed" },
];

/* ─── Difficulty Distribution Mini Chart ─── */
function DifficultyDistribution({ companies }: { companies: Company[] }) {
  const distribution: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) distribution[i] = 0;
  companies.forEach((c) => { distribution[c.difficulty] = (distribution[c.difficulty] || 0) + 1; });
  const maxCount = Math.max(...Object.values(distribution));

  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => {
        const count = distribution[score] || 0;
        const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const { bg } = getDifficultyColor(score);
        return (
          <div key={score} className="flex flex-col items-center gap-0.5 flex-1">
            <div className="w-full relative" style={{ height: "32px" }}>
              <div
                className={`absolute bottom-0 w-full ${bg} opacity-80 transition-all`}
                style={{ height: `${height}%`, minHeight: count > 0 ? "2px" : "0" }}
                title={`難易度 ${score}: ${count} 家`}
              />
            </div>
            <span className="text-[8px] text-muted-foreground tabular-nums">{score}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */
export default function Home() {
  const params = useParams<{ region?: string }>();
  const [, navigate] = useLocation();
  const currentRegionKey = (params.region || "na") as RegionKey;
  const regionConfig = getRegion(currentRegionKey);
  const companies = regionConfig.companies;

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = [...companies];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.company.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.application.toLowerCase().includes(q) ||
          c.currentSuppliers.toLowerCase().includes(q) ||
          c.asusModel.toLowerCase().includes(q) ||
          c.platform.toLowerCase().includes(q) ||
          c.challenges.toLowerCase().includes(q) ||
          c.entryPoint.toLowerCase().includes(q)
      );
    }

    if (diffFilter === "easy") result = result.filter((c) => c.difficulty <= 4);
    else if (diffFilter === "medium") result = result.filter((c) => c.difficulty >= 5 && c.difficulty <= 7);
    else if (diffFilter === "hard") result = result.filter((c) => c.difficulty >= 8);

    if (channelFilter === "direct") result = result.filter((c) => c.channel.startsWith("直供") && !c.channel.includes("SI") && !c.channel.includes("DIST"));
    else if (channelFilter === "si_dist") result = result.filter((c) => c.channel.includes("SI") || c.channel.includes("DIST"));
    else if (channelFilter === "mixed") result = result.filter((c) => c.channel.includes("直供") && (c.channel.includes("SI") || c.channel.includes("DIST")));

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "rank") cmp = a.rank - b.rank;
      else if (sortField === "difficulty") cmp = a.difficulty - b.difficulty;
      else if (sortField === "company") cmp = a.company.localeCompare(b.company);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [companies, search, diffFilter, channelFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleRegionChange = (key: RegionKey) => {
    setSearch("");
    setDiffFilter("all");
    setChannelFilter("all");
    setSortField("rank");
    setSortDir("asc");
    setExpandedRow(null);
    if (key === "na") {
      navigate("/");
    } else {
      navigate(`/region/${key}`);
    }
  };

  // Stats
  const avgDifficulty = (companies.reduce((sum, c) => sum + c.difficulty, 0) / companies.length).toFixed(1);
  const easyCount = companies.filter((c) => c.difficulty <= 4).length;
  const mediumCount = companies.filter((c) => c.difficulty >= 5 && c.difficulty <= 7).length;
  const hardCount = companies.filter((c) => c.difficulty >= 8).length;

  const hasActiveFilters = search || diffFilter !== "all" || channelFilter !== "all";

  const rl = regionLabels[currentRegionKey];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-20">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Server className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  ASUS Global Server Strategy
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-wide">全球伺服器市場拓展策略</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground tracking-wider uppercase">
              <Globe className="w-3 h-3" />
              <span className="ml-1">4 Regions</span>
              <span className="mx-1.5 w-px h-3 bg-border" />
              <span>250 Companies</span>
            </div>
          </div>
        </div>

        {/* Region Tabs */}
        <div className="border-t border-border bg-white">
          <div className="container">
            <div className="flex">
              {regionKeys.map((key) => {
                const r = regionLabels[key];
                const isActive = key === currentRegionKey;
                const regionData = getRegion(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleRegionChange(key)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="hidden sm:inline">{r.flag}</span>
                    <span className="hidden md:inline">{r.label}</span>
                    <span className="md:hidden">{r.short}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 font-semibold tabular-nums ${
                      isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                    }`}>
                      {regionData.companies.length}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Dashboard Strip */}
      <section className="bg-foreground text-background">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-background/50 mb-2">
                {rl.flag} {rl.short} Market Intelligence
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {rl.label}伺服器採購商<br className="hidden md:block" />策略分析總覽
              </h2>
              <p className="text-sm text-background/60 leading-relaxed max-w-xl">
                {regionConfig.description}，包含年採購量、伺服器架構、現有供應商、
                ASUS 對應產品線、通路策略、困難點與切入策略。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <DarkKPI icon={Building2} value={String(companies.length)} label="企業" sub={`${rl.label} Top ${companies.length}`} />
              <DarkKPI icon={TrendingUp} value={regionConfig.totalVolume} label="台/年" sub="年度總採購量" />
              <DarkKPI icon={Zap} value={String(easyCount)} label="較易切入" sub="1-4 分" accent="emerald" />
              <DarkKPI icon={Target} value={String(hardCount)} label="高難度" sub="8-10 分" accent="red" />
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Distribution */}
      <section className="border-b border-border bg-white">
        <div className="container py-4">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">難易度分佈</p>
              <p className="text-[10px] text-muted-foreground">平均 {avgDifficulty} / 10</p>
            </div>
            <div className="flex-1 max-w-xs">
              <DifficultyDistribution companies={companies} />
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500" /> 較易 ({easyCount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500" /> 中等 ({mediumCount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500" /> 困難 ({hardCount})</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container py-6">
        {/* Search + Filters */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜尋企業名稱、區域、應用、供應商、ASUS 型號、困難點、切入策略..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <FilterGroup label="難易度" options={difficultyFilters} value={diffFilter} onChange={setDiffFilter} />
            <div className="w-px h-5 bg-border hidden sm:block" />
            <FilterGroup label="通路" options={channelFilters} value={channelFilter} onChange={setChannelFilter} />
            {hasActiveFilters && (
              <>
                <div className="w-px h-5 bg-border" />
                <button
                  onClick={() => { setSearch(""); setDiffFilter("all"); setChannelFilter("all"); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  清除篩選
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">
            顯示 <strong className="text-foreground">{filtered.length}</strong> / {companies.length} 家企業
          </span>
          <span className="text-[10px] text-muted-foreground">點擊列展開詳細資訊</span>
        </div>

        {/* Data Table */}
        <div className="border border-border bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <SortableHeader label="#" field="rank" current={sortField} dir={sortDir} onClick={toggleSort} width="w-12" />
                <SortableHeader label="企業名稱" field="company" current={sortField} dir={sortDir} onClick={toggleSort} width="min-w-[200px]" />
                <th className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3">區域</th>
                <th className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3 min-w-[140px]">年採購量</th>
                <th className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3">ODM/OEM</th>
                <SortableHeader label="難易度" field="difficulty" current={sortField} dir={sortDir} onClick={toggleSort} width="w-28" />
                <th className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <Fragment key={company.rank}>
                  <tr
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${expandedRow === company.rank ? "bg-muted/30" : ""}`}
                    onClick={() => setExpandedRow(expandedRow === company.rank ? null : company.rank)}
                  >
                    <td className="px-3 py-3 text-xs text-muted-foreground tabular-nums">{company.rank}</td>
                    <td className="px-3 py-3">
                      <span className="font-semibold text-foreground text-sm">{company.company}</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{company.region}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{truncate(company.volume, 40)}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{company.odmOem}</td>
                    <td className="px-3 py-3"><DifficultyBar score={company.difficulty} /></td>
                    <td className="px-3 py-3">
                      {expandedRow === company.rank ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                  </tr>
                  {expandedRow === company.rank && <ExpandedRow company={company} regionKey={currentRegionKey} />}
                </Fragment>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-sm">
              找不到符合條件的企業
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">ASUS Server Business Development</span>
              <span className="mx-2">·</span>
              <span>全球市場策略報告 2026 Q1</span>
            </div>
            <div>
              資料來源：IDC Server Tracker, Gartner, TrendForce, 各企業年報
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function DarkKPI({ icon: Icon, value, label, sub, accent }: { icon: any; value: string; label: string; sub: string; accent?: string }) {
  const accentMap: Record<string, string> = {
    amber: "text-amber-400",
    red: "text-red-400",
    emerald: "text-emerald-400",
  };
  const valueColor = accent ? accentMap[accent] || "text-white" : "text-white";
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 text-white/30 mx-auto mb-1.5" />
      <div className={`text-2xl font-black tabular-nums ${valueColor}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </div>
      <div className="text-[10px] text-white/70 font-medium">{label}</div>
      <div className="text-[9px] text-white/40 mt-0.5">{sub}</div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}:</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1 text-xs font-medium transition-all ${
              value === opt.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  current,
  dir,
  onClick,
  width,
}: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onClick: (f: SortField) => void;
  width?: string;
}) {
  const isActive = current === field;
  return (
    <th
      className={`text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3 cursor-pointer hover:text-foreground transition-colors select-none ${width || ""}`}
      onClick={() => onClick(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive ? (
          dir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}
