import { useParams, Link } from "wouter";
import { getRegion, type RegionKey } from "@/lib/regions";
import { ArrowLeft, Building2, MapPin, Server, Cpu, Layers, Truck, Target, AlertTriangle, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";

function DifficultyBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s <= 4) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (s <= 7) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-red-100 text-red-800 border-red-300";
  };
  const getLabel = (s: number) => {
    if (s <= 4) return "較易";
    if (s <= 7) return "中等";
    return "困難";
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold border ${getColor(score)}`}>
      {score}/10 · {getLabel(score)}
    </span>
  );
}

export default function CompanyDetail() {
  const params = useParams<{ rank: string; region?: string }>();
  const regionKey = (params.region || "na") as RegionKey;
  const regionConfig = getRegion(regionKey);
  const rank = parseInt(params.rank || "1");
  const company = regionConfig.companies.find((c) => c.rank === rank);

  const basePath = regionKey === "na" ? "" : `/region/${regionKey}`;
  const listPath = regionKey === "na" ? "/" : `/region/${regionKey}`;

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">找不到該企業</h1>
          <Link href={listPath} className="text-primary hover:underline">返回總表</Link>
        </div>
      </div>
    );
  }

  const sections = [
    { icon: MapPin, title: "區域/國家", content: company.region },
    { icon: Server, title: "伺服器年採購量", content: company.volume },
    { icon: Cpu, title: "伺服器機型及平台架構", content: company.platform },
    { icon: Layers, title: "伺服器應用", content: company.application },
    { icon: Truck, title: "目前供應商", content: company.currentSuppliers },
    { icon: Building2, title: "ODM/OEM", content: company.odmOem },
    { icon: Target, title: "ASUS 對應型號", content: company.asusModel },
    { icon: ChevronRight, title: "直供/SI/DIST", content: company.channel },
  ];

  const prevCompany = regionConfig.companies.find((c) => c.rank === rank - 1);
  const nextCompany = regionConfig.companies.find((c) => c.rank === rank + 1);

  const regionLabel: Record<string, string> = {
    na: "北美",
    apac: "亞太",
    emea: "EMEA",
    china: "中國大陸",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="container py-3 flex items-center gap-4">
          <Link href={listPath}>
            <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              返回{regionLabel[regionKey]}總表
            </span>
          </Link>
          <div className="w-px h-5 bg-border" />
          <span className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">
            {regionLabel[regionKey]} · Company #{company.rank}
          </span>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        {/* Title Section */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {company.company}
            </h1>
            <DifficultyBadge score={company.difficulty} />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{company.region}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>排名 #{company.rank}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-xs">10 最難 · 1 最簡單</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mb-10">
          {sections.map((section, i) => (
            <div key={i} className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">{section.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Strategy Sections */}
        <div className="space-y-8">
          <div className="border-l-2 border-red-400 pl-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>困難點及如何克服</h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{company.challenges}</p>
          </div>

          <div className="border-l-2 border-emerald-400 pl-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>切入點及如何執行</h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{company.entryPoint}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-border flex justify-between">
          {prevCompany ? (
            <Link href={`${basePath}/company/${rank - 1}`}>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
                #{rank - 1} {truncate(prevCompany.company, 20)}
              </span>
            </Link>
          ) : <div />}
          {nextCompany ? (
            <Link href={`${basePath}/company/${rank + 1}`}>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                #{rank + 1} {truncate(nextCompany.company, 20)}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}
