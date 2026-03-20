import { useEffect, useRef } from "react";
import { X, BarChart3, Calculator, FileText, Info } from "lucide-react";
import type { Translations } from "@/lib/i18n";

type DifficultyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  difficulty: number;
  difficultyReason?: string;
  t: Translations;
};

/* Parse "D1(供應商鎖定)=9, D2(採購決策複雜度)=8, ..." into structured scores */
function parseDimensionScores(reason: string): Record<string, number> {
  const scores: Record<string, number> = {};
  const pattern = /D(\d)\([^)]*\)=(\d+)/g;
  let match;
  while ((match = pattern.exec(reason)) !== null) {
    scores[`D${match[1]}`] = parseInt(match[2], 10);
  }
  return scores;
}

/* Extract the narrative analysis text (after the D1-D6 scores line) */
function extractAnalysisText(reason: string): string {
  // Remove the D1...D6 score line
  const cleaned = reason.replace(/D1\([^)]*\)=\d+.*?D6\([^)]*\)=\d+[.,;]?\s*/g, "").trim();
  return cleaned;
}

/* Split analysis text into structured paragraphs */
function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];
  // Split by 【】 markers or by sentences ending with period
  const sections = text.split(/(?=【)/g).filter(s => s.trim());
  if (sections.length > 1) return sections;
  // Fallback: split by period followed by space for long text
  const sentences = text.split(/(?<=\.\s)|(?<=。)/g).filter(s => s.trim());
  if (sentences.length > 3) {
    // Group every 2-3 sentences into a paragraph
    const paragraphs: string[] = [];
    let current = "";
    for (let i = 0; i < sentences.length; i++) {
      current += sentences[i];
      if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
        paragraphs.push(current.trim());
        current = "";
      }
    }
    return paragraphs.filter(p => p.length > 0);
  }
  return [text];
}

const WEIGHTS: Record<string, number> = {
  D1: 0.25, D2: 0.20, D3: 0.20, D4: 0.15, D5: 0.10, D6: 0.10,
};

const DIMENSION_COLORS: Record<string, { bar: string; bg: string; border: string; text: string; dot: string }> = {
  D1: { bar: "bg-red-500", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
  D2: { bar: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  D3: { bar: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  D4: { bar: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  D5: { bar: "bg-purple-500", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
  D6: { bar: "bg-slate-500", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", dot: "bg-slate-500" },
};

function getScoreLabel(score: number): { label: string; color: string; bgColor: string } {
  if (score <= 3) return { label: "LOW", color: "text-emerald-700", bgColor: "bg-emerald-100" };
  if (score <= 5) return { label: "MED", color: "text-amber-700", bgColor: "bg-amber-100" };
  if (score <= 7) return { label: "HIGH", color: "text-orange-700", bgColor: "bg-orange-100" };
  return { label: "CRITICAL", color: "text-red-700", bgColor: "bg-red-100" };
}

function getDifficultyLevel(score: number): { label: string; color: string } {
  if (score <= 2) return { label: "極易", color: "text-emerald-600" };
  if (score <= 3) return { label: "容易", color: "text-emerald-500" };
  if (score <= 4) return { label: "偏易", color: "text-lime-600" };
  if (score <= 5) return { label: "中等", color: "text-amber-600" };
  if (score <= 6) return { label: "偏難", color: "text-orange-500" };
  if (score <= 7) return { label: "困難", color: "text-orange-600" };
  if (score <= 8) return { label: "極難", color: "text-red-500" };
  return { label: "幾乎不可能", color: "text-red-700" };
}

export default function DifficultyModal({
  isOpen,
  onClose,
  companyName,
  difficulty,
  difficultyReason,
  t,
}: DifficultyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scores = difficultyReason ? parseDimensionScores(difficultyReason) : {};
  const hasDimensionScores = Object.keys(scores).length >= 6;
  const analysisText = difficultyReason ? extractAnalysisText(difficultyReason) : "";
  const analysisParagraphs = splitIntoParagraphs(analysisText);

  const dimensions = [
    { key: "D1", name: t.diffModalD1, desc: t.diffModalD1Desc },
    { key: "D2", name: t.diffModalD2, desc: t.diffModalD2Desc },
    { key: "D3", name: t.diffModalD3, desc: t.diffModalD3Desc },
    { key: "D4", name: t.diffModalD4, desc: t.diffModalD4Desc },
    { key: "D5", name: t.diffModalD5, desc: t.diffModalD5Desc },
    { key: "D6", name: t.diffModalD6, desc: t.diffModalD6Desc },
  ];

  let computedTotal = 0;
  if (hasDimensionScores) {
    for (const d of dimensions) {
      computedTotal += (scores[d.key] || 0) * WEIGHTS[d.key];
    }
  }

  const badgeColor =
    difficulty <= 3 ? "bg-emerald-500" :
    difficulty <= 5 ? "bg-amber-500" :
    difficulty <= 7 ? "bg-orange-500" :
    "bg-red-500";

  const level = getDifficultyLevel(difficulty);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">

        {/* ===== Header ===== */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {t.diffModalTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t.diffModalSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted transition-colors"
            aria-label={t.diffModalClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== Company + Score Banner ===== */}
        <div className="px-6 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-base font-bold text-foreground tracking-wide mb-1">{companyName}</p>
              <p className="text-sm text-muted-foreground">{t.diffModalFinalScore}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <span className={`text-sm font-bold ${level.color}`}>{level.label}</span>
              </div>
              <div className={`${badgeColor} text-white px-5 py-3 text-3xl font-black shadow-lg`}>
                {difficulty}
              </div>
              <span className="text-base text-muted-foreground font-medium">/10</span>
            </div>
          </div>
        </div>

        {/* ===== Formula Section ===== */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-foreground/90">{t.diffModalFormula}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-3">
            <code className="block text-xs font-mono text-foreground/70 leading-loose tracking-wide">
              {t.diffModalFormulaDesc}
            </code>
          </div>
          <div className="mt-3 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t.diffModalFormulaNote || "各維度分數範圍 1-10，加權後四捨五入為最終難易度評分。"}
            </p>
          </div>
        </div>

        {/* ===== Dimension Score Cards ===== */}
        {hasDimensionScores && (
          <div className="px-6 py-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-foreground/90">
                {t.diffModalScore}
              </span>
            </div>

            {/* Score Cards - each dimension as a card */}
            <div className="space-y-3">
              {dimensions.map((d) => {
                const score = scores[d.key] || 0;
                const weight = WEIGHTS[d.key];
                const weighted = score * weight;
                const { label, color, bgColor } = getScoreLabel(score);
                const dc = DIMENSION_COLORS[d.key];

                return (
                  <div
                    key={d.key}
                    className={`${dc.bg} border ${dc.border} px-4 py-4`}
                  >
                    {/* Top row: dimension name + score badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${dc.dot}`} />
                        <span className={`text-sm font-bold ${dc.text}`}>{d.key}</span>
                        <span className="text-sm font-semibold text-foreground/80">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 ${color} ${bgColor}`}>
                          {label}
                        </span>
                        <span className="text-lg font-black text-foreground">{score}</span>
                        <span className="text-xs text-muted-foreground">/10</span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mb-2.5">
                      <div className="h-2.5 bg-white/80 overflow-hidden w-full">
                        <div
                          className={`h-full ${dc.bar} transition-all duration-700 ease-out`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom row: description + weight + weighted score */}
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-foreground/50 flex-1 mr-4">{d.desc}</p>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-[11px] text-foreground/50">
                          {t.diffModalWeight}: {(weight * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs font-bold text-foreground/70">
                          {t.diffModalWeighted}: {weighted.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== Total Summary Bar ===== */}
            <div className="mt-4 bg-slate-800 text-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase opacity-70">{t.diffModalFinalScore}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-32 h-2.5 bg-white/20 overflow-hidden">
                      <div
                        className={`h-full ${badgeColor} transition-all duration-700`}
                        style={{ width: `${computedTotal * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{computedTotal.toFixed(1)}</span>
                    <span className="text-sm opacity-50">→</span>
                    <span className={`text-2xl font-black ${badgeColor} px-2 py-0.5`}>{difficulty}</span>
                  </div>
                  <p className="text-[10px] opacity-50 mt-0.5">{t.diffModalWeight} 100%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Analysis Text (Structured) ===== */}
        {analysisText && (
          <div className="px-6 py-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-foreground/90">{t.diffModalAnalysis}</span>
            </div>

            <div className="space-y-3">
              {analysisParagraphs.map((para, idx) => {
                // Check if paragraph starts with 【】 marker
                const bracketMatch = para.match(/^【([^】]+)】(.*)$/s);
                if (bracketMatch) {
                  const title = bracketMatch[1];
                  const content = bracketMatch[2].trim();
                  return (
                    <div key={idx} className="border-l-3 border-slate-300 pl-4 py-1">
                      <p className="text-xs font-bold text-foreground/80 mb-1.5">{title}</p>
                      <p className="text-[13px] leading-[1.8] text-foreground/60">{content}</p>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-[13px] leading-[1.8] text-foreground/60">
                    {para}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== Footer ===== */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            {t.diffModalClose}
          </button>
        </div>
      </div>
    </div>
  );
}
