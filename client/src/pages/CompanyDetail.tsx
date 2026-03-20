import { useParams, Link } from "wouter";
import { getRegion, type RegionKey } from "@/lib/regions";
import {
  ArrowLeft, Building2, MapPin, Server, Cpu, Layers, Truck, Target,
  AlertTriangle, Lightbulb, ChevronRight, ChevronLeft, ExternalLink,
  User, Link as LinkIcon,
} from "lucide-react";
import StructuredText from "@/components/StructuredText";

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

  const kp = company.keyPerson;
  const siDist = company.siDist;
  const volSrc = company.volumeSource;

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

        {/* Key Person + SI/DIST + Volume Source */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-10">
          {/* Key Person */}
          <div className="bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">Key Person</h3>
            </div>
            {kp && kp.name ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold">{kp.name}</p>
                <p className="text-xs text-muted-foreground">{kp.title}</p>
                {kp.linkedin && (
                  <a href={kp.linkedin} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-2">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
                {kp.source && !kp.linkedin && (
                  <p className="text-[10px] text-muted-foreground mt-1">來源: {kp.source}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">資訊待更新</p>
            )}
          </div>

          {/* SI/DIST */}
          <div className="bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">SI/DIST 通路夥伴</h3>
            </div>
            {siDist && siDist.length > 0 ? (
              <div className="space-y-2">
                {siDist.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 font-semibold ${
                      s.type === "SI" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>{s.type}</span>
                    {s.website ? (
                      <a href={s.website} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1">
                        {s.name} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-sm">{s.name}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">直供或資訊待更新</p>
            )}
          </div>

          {/* Volume Source */}
          <div className="bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">採購量數據來源</h3>
            </div>
            {volSrc ? (
              <a href={volSrc} target="_blank" rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-start gap-1.5 break-all">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {volSrc.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <p className="text-xs text-muted-foreground italic">基於產業分析估算</p>
            )}
          </div>
        </div>

        {/* Strategy Sections */}
        <div className="space-y-8">
          <div className="border-l-2 border-red-400 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>困難點及如何克服</h2>
            </div>
            <StructuredText text={company.challenges} variant="full" titleColor="text-red-700" />
          </div>

          <div className="border-l-2 border-emerald-400 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>切入點及如何執行</h2>
            </div>
            <StructuredText text={company.entryPoint} variant="full" titleColor="text-emerald-700" />
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
