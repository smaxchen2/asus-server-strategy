import { useState, useMemo, Fragment } from "react";
import { Link, useParams, useLocation } from "wouter";
import { getRegion, regionKeys, type RegionKey, type Company } from "@/lib/regions";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Translations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  User,
  Link as LinkIcon,
  Download,
  Tag,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import StructuredText, { StructuredCommStrategy } from "@/components/StructuredText";

/* ─── CSV Export ─── */
function exportToCSV(companies: Company[], regionLabel: string, t: Translations) {
  const BOM = "\uFEFF";
  const headers = [
    t.exportRank, t.exportCompanyName, t.exportIndustry, t.exportRegion, t.exportVolume,
    t.exportPlatform, t.exportApplication, t.exportSuppliers, t.exportOdmOem, t.exportAsusModel,
    t.exportChannel, t.exportDifficulty, t.exportChallenges, t.exportEntryPoint,
    t.exportTechDM, t.exportTechDMTitle, t.exportTechDMLinkedin, t.exportTechCommStrategy,
    t.exportProcDM, t.exportProcDMTitle, t.exportProcDMLinkedin, t.exportProcCommStrategy,
    t.exportSIDIST, t.exportActualSI, t.exportArchetype, t.exportVolumeSource,
  ];

  const escapeCSV = (val: string) => {
    if (!val) return "";
    const s = String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const rows = companies.map((c) => {
    const siDistStr = (c.siDist || []).map(s => {
      const actual = s.isActual ? " ★" : "";
      return `[${s.type}${actual}] ${s.name}${s.website ? " (" + s.website + ")" : ""}`;
    }).join("; ");
    return [
      String(c.rank), c.company || "", c.industry || "", c.region || "", c.volume || "",
      c.platform || "", c.application || "", c.currentSuppliers || "", c.odmOem || "",
      c.asusModel || "", c.channel || "", String(c.difficulty), c.challenges || "", c.entryPoint || "",
      c.techDecisionMaker?.name || c.keyPerson?.name || "",
      c.techDecisionMaker?.title || c.keyPerson?.title || "",
      c.techDecisionMaker?.linkedin || c.keyPerson?.linkedin || "",
      c.techDecisionMaker?.commStrategy || "",
      c.procurementDecisionMaker?.name || "", c.procurementDecisionMaker?.title || "",
      c.procurementDecisionMaker?.linkedin || "", c.procurementDecisionMaker?.commStrategy || "",
      siDistStr, c.actualSiPartners || "", c.archetype || "", c.volumeSource || ""
    ].map(v => escapeCSV(v));
  });

  const csvContent = BOM + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  a.download = `ASUS_Server_Strategy_${regionLabel}_${timestamp}.csv`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

/* ─── Excel Export ─── */
function exportToExcel(companies: Company[], regionLabel: string, t: Translations) {
  const headers = [
    t.exportRank, t.exportCompanyName, t.exportIndustry, t.exportRegion, t.exportVolume,
    t.exportPlatform, t.exportApplication, t.exportSuppliers, t.exportOdmOem, t.exportAsusModel,
    t.exportChannel, t.exportDifficulty, t.exportChallenges, t.exportEntryPoint,
    t.exportTechDM, t.exportTechDMTitle, t.exportTechDMLinkedin, t.exportTechCommStrategy,
    t.exportProcDM, t.exportProcDMTitle, t.exportProcDMLinkedin, t.exportProcCommStrategy,
    t.exportSIDIST, t.exportActualSI, t.exportArchetype, t.exportVolumeSource,
  ];

  const rows = companies.map((c) => {
    const siDistStr = (c.siDist || []).map(s => {
      const actual = s.isActual ? " ★" : "";
      return `[${s.type}${actual}] ${s.name}${s.website ? " (" + s.website + ")" : ""}`;
    }).join("; ");
    return [
      c.rank, c.company || "", c.industry || "", c.region || "", c.volume || "",
      c.platform || "", c.application || "", c.currentSuppliers || "", c.odmOem || "",
      c.asusModel || "", c.channel || "", c.difficulty, c.challenges || "", c.entryPoint || "",
      c.techDecisionMaker?.name || c.keyPerson?.name || "",
      c.techDecisionMaker?.title || c.keyPerson?.title || "",
      c.techDecisionMaker?.linkedin || c.keyPerson?.linkedin || "",
      c.techDecisionMaker?.commStrategy || "",
      c.procurementDecisionMaker?.name || "", c.procurementDecisionMaker?.title || "",
      c.procurementDecisionMaker?.linkedin || "", c.procurementDecisionMaker?.commStrategy || "",
      siDistStr, c.actualSiPartners || "", c.archetype || "", c.volumeSource || ""
    ];
  });

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = [
    { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 35 }, { wch: 40 }, { wch: 35 },
    { wch: 40 }, { wch: 15 }, { wch: 40 }, { wch: 30 }, { wch: 10 }, { wch: 60 }, { wch: 60 },
    { wch: 25 }, { wch: 40 }, { wch: 40 }, { wch: 50 }, { wch: 25 }, { wch: 40 }, { wch: 40 },
    { wch: 50 }, { wch: 50 }, { wch: 50 }, { wch: 15 }, { wch: 50 },
  ];
  ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: headers.length - 1 } }) };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, regionLabel);
  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `ASUS_Server_Strategy_${regionLabel}_${timestamp}.xlsx`);
}

type SortField = "rank" | "difficulty" | "company" | "volume";
type SortDir = "asc" | "desc";

/* ─── Region label helpers ─── */
function getRegionLabels(t: Translations): Record<RegionKey, { label: string; short: string; flag: string }> {
  return {
    na: { label: t.regionNA, short: t.regionNAShort, flag: "🇺🇸" },
    apac: { label: t.regionAPAC, short: t.regionAPACShort, flag: "🌏" },
    emea: { label: t.regionEMEA, short: t.regionEMEAShort, flag: "🇪🇺" },
    china: { label: t.regionChina, short: t.regionChinaShort, flag: "🇨🇳" },
  };
}

function getIndustryCategories(t: Translations) {
  return [
    { label: t.industryAll, value: "all" },
    { label: t.industryNeoCloud, value: "NeoCloud/AI" },
    { label: t.industryTech, value: "科技" },
    { label: t.industryFinance, value: "金融" },
    { label: t.industryHealthcare, value: "醫療" },
    { label: t.industryDefense, value: "國防" },
    { label: t.industryTelecom, value: "電信" },
    { label: t.industryEnergy, value: "能源" },
    { label: t.industryAutomotive, value: "汽車" },
    { label: t.industryRetail, value: "零售" },
    { label: t.industryMedia, value: "媒體" },
    { label: t.industryLogistics, value: "物流" },
    { label: t.industryIndustrial, value: "工業" },
    { label: t.industryOther, value: "其他" },
  ];
}

function getDifficultyFilters(t: Translations) {
  return [
    { label: t.filterAll, value: "all" },
    { label: t.filterEasy, value: "easy" },
    { label: t.filterMedium, value: "medium" },
    { label: t.filterHard, value: "hard" },
  ];
}

function getChannelFilters(t: Translations) {
  return [
    { label: t.filterAll, value: "all" },
    { label: t.filterDirect, value: "direct" },
    { label: t.filterSIDIST, value: "si_dist" },
    { label: t.filterMixed, value: "mixed" },
  ];
}

/* ─── Difficulty helpers ─── */
function getDifficultyColor(score: number, t: Translations) {
  if (score <= 4) return { bg: "bg-emerald-500", text: "text-emerald-700", label: t.difficultyEasy };
  if (score <= 7) return { bg: "bg-amber-500", text: "text-amber-700", label: t.difficultyMedium };
  return { bg: "bg-red-500", text: "text-red-700", label: t.difficultyHard };
}

function DifficultyBar({ score }: { score: number }) {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const { bg } = getDifficultyColor(score, t);
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted overflow-hidden">
        <div className={`h-full ${bg}`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums w-5 text-right">{score}</span>
    </div>
  );
}

/* ─── Expanded Row with all fields ─── */
function ExpandedRow({ company, regionKey }: { company: Company; regionKey: string }) {
  const { t } = useLanguage();
  const basePath = regionKey === "na" ? "" : `/region/${regionKey}`;
  const kp = company.keyPerson;
  const techDM = company.techDecisionMaker;
  const procDM = company.procurementDecisionMaker;
  const siDist = company.siDist;
  const volSrc = company.volumeSource;
  const archetype = company.archetype;

  return (
    <tr>
      <td colSpan={8} className="p-0">
        <div className="bg-muted/30 border-t border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-border">
            {/* Column 1: Basic Info */}
            <div className="bg-white p-5 space-y-3">
              {company.industry && (
                <div>
                  <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">{t.industryCategory}</div>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-medium">
                    <Tag className="w-3 h-3" />{company.industry}
                  </span>
                </div>
              )}
              <InfoBlock label={t.serverPlatform} value={company.platform} />
              <InfoBlock label={t.serverApplication} value={company.application} />
              <InfoBlock label={t.currentSuppliers} value={company.currentSuppliers} />
              <InfoBlock label={t.odmOem} value={company.odmOem} />
              <InfoBlock label={t.asusModel} value={company.asusModel} />
            </div>

            {/* Column 2: Strategy */}
            <div className="bg-white p-5 space-y-4">
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-600 mb-2">{t.challengesTitle}</div>
                <StructuredText text={company.challenges} variant="compact" titleColor="text-red-700" />
              </div>
              <div className="border-t border-border/50 pt-4">
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-600 mb-2">{t.entryPointTitle}</div>
                <StructuredText text={company.entryPoint} variant="compact" titleColor="text-emerald-700" />
              </div>
            </div>

            {/* Column 3: SI/DIST + Volume Source */}
            <div className="bg-white p-5 space-y-3">
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
                  {t.channelLabel}
                </div>
                <p className="text-xs font-medium mb-2">{company.channel}</p>
                {siDist && siDist.length > 0 && (
                  <div className="space-y-1.5">
                    {siDist.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 font-semibold ${
                          s.type === "SI" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>{s.type}</span>
                        {s.isActual && (
                          <span className="text-[9px] px-1 py-0.5 bg-green-100 text-green-700 font-bold">{t.actualPartner}</span>
                        )}
                        {s.website ? (
                          <a href={s.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-0.5">
                            {s.name} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs">{s.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {volSrc && (
                <div>
                  <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
                    {t.volumeSource}
                  </div>
                  <a href={volSrc} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 break-all">
                    <LinkIcon className="w-3 h-3 flex-shrink-0" />
                    {truncate(volSrc.replace(/^https?:\/\//, ""), 50)}
                  </a>
                </div>
              )}
            </div>

            {/* Column 4: Decision Makers */}
            <div className="bg-white p-5 space-y-4">
              {/* Archetype Badge */}
              {archetype && (
                <div className="mb-1">
                  <span className={`text-[9px] px-2 py-0.5 font-bold tracking-wider uppercase ${
                    archetype === 'hyperscaler' ? 'bg-violet-100 text-violet-700' :
                    archetype === 'neocloud' ? 'bg-orange-100 text-orange-700' :
                    archetype === 'financial' ? 'bg-emerald-100 text-emerald-700' :
                    archetype === 'healthcare' ? 'bg-pink-100 text-pink-700' :
                    archetype === 'defense' ? 'bg-slate-200 text-slate-700' :
                    archetype === 'telecom' ? 'bg-cyan-100 text-cyan-700' :
                    archetype === 'automotive' ? 'bg-amber-100 text-amber-700' :
                    archetype === 'retail' ? 'bg-lime-100 text-lime-700' :
                    archetype === 'energy' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{archetype}</span>
                </div>
              )}

              {/* Technical Decision Maker */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600 mb-1.5">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {t.techDecisionMaker}</span>
                </div>
                {techDM && techDM.name ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{techDM.name}</p>
                    <p className="text-xs text-muted-foreground">{techDM.title}</p>
                    {techDM.linkedin && (
                      <a href={techDM.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {techDM.commStrategy && (
                      <div className="mt-1.5 p-2 bg-blue-50 border-l-2 border-blue-400">
                        <p className="text-[10px] font-semibold text-blue-700 mb-1">{t.commStrategy}</p>
                        <div className="text-[10px] text-blue-800">
                          <StructuredCommStrategy text={techDM.commStrategy} variant="compact" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">{t.pendingVerification}</p>
                )}
              </div>

              {/* Procurement Decision Maker */}
              <div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-600 mb-1.5">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {t.procurementDecisionMaker}</span>
                </div>
                {procDM && procDM.name ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{procDM.name}</p>
                    <p className="text-xs text-muted-foreground">{procDM.title}</p>
                    {procDM.linkedin && (
                      <a href={procDM.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {procDM.commStrategy && (
                      <div className="mt-1.5 p-2 bg-amber-50 border-l-2 border-amber-400">
                        <p className="text-[10px] font-semibold text-amber-700 mb-1">{t.commStrategy}</p>
                        <div className="text-[10px] text-amber-800">
                          <StructuredCommStrategy text={procDM.commStrategy} variant="compact" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">{t.pendingVerification}</p>
                )}
              </div>
            </div>
          </div>
          <div className="px-5 py-2.5 bg-white border-t border-border flex justify-end">
            <Link href={`${basePath}/company/${company.rank}`}>
              <span className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                {t.viewFullDetails} <ExternalLink className="w-3 h-3" />
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
        const bg = score <= 4 ? "bg-emerald-500" : score <= 7 ? "bg-amber-500" : "bg-red-500";
        return (
          <div key={score} className="flex flex-col items-center gap-0.5 flex-1">
            <div className="w-full relative" style={{ height: "32px" }}>
              <div
                className={`absolute bottom-0 w-full ${bg} opacity-80 transition-all`}
                style={{ height: `${height}%`, minHeight: count > 0 ? "2px" : "0" }}
                title={`${score}: ${count}`}
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
  const { t } = useLanguage();
  const params = useParams<{ region?: string }>();
  const [, navigate] = useLocation();
  const currentRegionKey = (params.region || "na") as RegionKey;
  const regionConfig = getRegion(currentRegionKey);
  const companies = regionConfig.companies;

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const regionLabels = getRegionLabels(t);
  const INDUSTRY_CATEGORIES = getIndustryCategories(t);
  const difficultyFilters = getDifficultyFilters(t);
  const channelFilters = getChannelFilters(t);

  /* Compute available industries for current region */
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => { if (c.industry) set.add(c.industry); });
    return Array.from(set).sort();
  }, [companies]);

  /* Count NeoCloud companies */
  const neocloudCount = useMemo(() => {
    return companies.filter(c => (c.industry || "").includes("NeoCloud")).length;
  }, [companies]);

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
          c.entryPoint.toLowerCase().includes(q) ||
          (c.industry || "").toLowerCase().includes(q) ||
          (c.techDecisionMaker?.name || c.keyPerson?.name || "").toLowerCase().includes(q) ||
          (c.procurementDecisionMaker?.name || "").toLowerCase().includes(q) ||
          (c.archetype || "").toLowerCase().includes(q) ||
          (c.siDist || []).some((s) => s.name.toLowerCase().includes(q))
      );
    }

    if (diffFilter === "easy") result = result.filter((c) => c.difficulty <= 4);
    else if (diffFilter === "medium") result = result.filter((c) => c.difficulty >= 5 && c.difficulty <= 7);
    else if (diffFilter === "hard") result = result.filter((c) => c.difficulty >= 8);

    if (channelFilter === "direct") result = result.filter((c) => c.channel.startsWith("直供") && !c.channel.includes("SI") && !c.channel.includes("DIST"));
    else if (channelFilter === "si_dist") result = result.filter((c) => c.channel.includes("SI") || c.channel.includes("DIST"));
    else if (channelFilter === "mixed") result = result.filter((c) => c.channel.includes("直供") && (c.channel.includes("SI") || c.channel.includes("DIST")));

    if (industryFilter !== "all") {
      if (industryFilter === "其他") {
        const mainCategories = INDUSTRY_CATEGORIES.filter(c => c.value !== "all" && c.value !== "其他").map(c => c.value);
        result = result.filter(c => {
          const ind = c.industry || "";
          return !mainCategories.some(cat => ind.includes(cat));
        });
      } else {
        result = result.filter(c => (c.industry || "").includes(industryFilter));
      }
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "rank" || sortField === "volume") cmp = a.rank - b.rank;
      else if (sortField === "difficulty") cmp = a.difficulty - b.difficulty;
      else if (sortField === "company") cmp = a.company.localeCompare(b.company);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [companies, search, diffFilter, channelFilter, industryFilter, sortField, sortDir, INDUSTRY_CATEGORIES]);

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
    setIndustryFilter("all");
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

  const hasActiveFilters = search || diffFilter !== "all" || channelFilter !== "all" || industryFilter !== "all";

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
                  {t.siteTitle}
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-wide">{t.siteSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground tracking-wider uppercase">
                <Globe className="w-3 h-3" />
                <span className="ml-1">{t.regions}</span>
                <span className="mx-1.5 w-px h-3 bg-border" />
                <span>{t.companies}</span>
              </div>
              <LanguageSwitcher />
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
                {rl.flag} {rl.short} {t.marketIntelligence}
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {rl.label} {t.strategyOverviewSuffix}
              </h2>
              <p className="text-sm text-background/60 leading-relaxed max-w-xl">
                {rl.label} Top {companies.length} {t.regionDescriptionSuffix}{t.regionDescriptionDetails}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <DarkKPI icon={Building2} value={String(companies.length)} label={t.kpiCompanies} sub={`${rl.label} ${t.kpiTopPrefix} ${companies.length}`} />
              <DarkKPI icon={TrendingUp} value={regionConfig.totalVolume} label={t.kpiUnitsPerYear} sub={t.kpiAnnualVolume} />
              <DarkKPI icon={Zap} value={String(neocloudCount)} label={t.kpiNeoCloud} sub={t.kpiAICloud} accent="amber" />
              <DarkKPI icon={Target} value={String(hardCount)} label={t.kpiHighDifficulty} sub={t.kpiScore810} accent="red" />
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Distribution */}
      <section className="border-b border-border bg-white">
        <div className="container py-4">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">{t.difficultyDistribution}</p>
              <p className="text-[10px] text-muted-foreground">{t.difficultyAvg} {avgDifficulty} / 10</p>
            </div>
            <div className="flex-1 max-w-xs">
              <DifficultyDistribution companies={companies} />
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500" /> {t.difficultyEasy} ({easyCount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500" /> {t.difficultyMedium} ({mediumCount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500" /> {t.difficultyHard} ({hardCount})</span>
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
              placeholder={t.searchPlaceholder}
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
            <FilterGroup label={t.filterDifficulty} options={difficultyFilters} value={diffFilter} onChange={setDiffFilter} />
            <div className="w-px h-5 bg-border hidden sm:block" />
            <FilterGroup label={t.filterChannel} options={channelFilters} value={channelFilter} onChange={setChannelFilter} />
          </div>

          {/* Industry Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Tag className="w-3 h-3" /> {t.filterIndustry}:
            </span>
            <div className="flex flex-wrap gap-1">
              {INDUSTRY_CATEGORIES.map((cat) => {
                const count = cat.value === "all"
                  ? companies.length
                  : cat.value === "其他"
                    ? companies.filter(c => {
                        const ind = c.industry || "";
                        const mainCats = INDUSTRY_CATEGORIES.filter(x => x.value !== "all" && x.value !== "其他").map(x => x.value);
                        return !mainCats.some(mc => ind.includes(mc));
                      }).length
                    : companies.filter(c => (c.industry || "").includes(cat.value)).length;
                if (count === 0 && cat.value !== "all") return null;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setIndustryFilter(cat.value)}
                    className={`px-2 py-1 text-[11px] font-medium transition-all ${
                      industryFilter === cat.value
                        ? "bg-indigo-600 text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                    <span className="ml-1 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearch(""); setDiffFilter("all"); setChannelFilter("all"); setIndustryFilter("all"); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
              >
                {t.clearAllFilters}
              </button>
            )}
          </div>
        </div>

        {/* Results Count + Export */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">
            {t.showing} <strong className="text-foreground">{filtered.length}</strong> {t.of} {companies.length} {t.companiesSuffix}
            {industryFilter !== "all" && (
              <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-medium">
                {industryFilter}
              </span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToExcel(filtered, `${rl.short}_${filtered.length}companies`, t)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {t.exportExcel} ({filtered.length})
            </button>
            <button
              onClick={() => exportToCSV(filtered, `${rl.short}_${filtered.length}companies`, t)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {t.exportCSV} ({filtered.length})
            </button>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">{t.clickToExpand}</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-border bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <SortableHeader label={t.thRank} field="rank" current={sortField} dir={sortDir} onClick={toggleSort} width="w-12" />
                <SortableHeader label={t.thCompanyName} field="company" current={sortField} dir={sortDir} onClick={toggleSort} width="min-w-[200px]" />
                <th className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3">{t.thIndustry}</th>
                <SortableHeader label={t.thAnnualVolume} field="volume" current={sortField} dir={sortDir} onClick={toggleSort} width="min-w-[140px]" />
                <th className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground px-3 py-3">{t.thChannel}</th>
                <SortableHeader label={t.thDifficulty} field="difficulty" current={sortField} dir={sortDir} onClick={toggleSort} width="w-28" />
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
                    <td className="px-3 py-3">
                      {company.industry && (
                        <span className={`text-[10px] px-1.5 py-0.5 font-medium whitespace-nowrap ${
                          (company.industry || "").includes("NeoCloud")
                            ? "bg-amber-100 text-amber-800"
                            : (company.industry || "").includes("金融")
                              ? "bg-blue-50 text-blue-700"
                              : (company.industry || "").includes("醫療")
                                ? "bg-green-50 text-green-700"
                                : (company.industry || "").includes("國防")
                                  ? "bg-slate-100 text-slate-700"
                                  : (company.industry || "").includes("能源")
                                    ? "bg-yellow-50 text-yellow-700"
                                    : (company.industry || "").includes("電信")
                                      ? "bg-cyan-50 text-cyan-700"
                                      : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {company.industry}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{truncate(company.volume, 40)}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{truncate(company.channel, 20)}</td>
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
              {t.noResults}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{t.footerTitle}</span>
              <span className="mx-2">·</span>
              <span>{t.footerReport}</span>
            </div>
            <div>
              {t.footerSources}
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

function truncate(text: string | undefined | null, maxLen: number) {
  if (!text) return "—";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}
