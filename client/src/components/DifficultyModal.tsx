import { useEffect, useRef } from "react";
import { X, BarChart3, Calculator, FileText } from "lucide-react";
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

const WEIGHTS: Record<string, number> = {
  D1: 0.25,
  D2: 0.20,
  D3: 0.20,
  D4: 0.15,
  D5: 0.10,
  D6: 0.10,
};

const DIMENSION_COLORS: Record<string, string> = {
  D1: "bg-red-500",
  D2: "bg-amber-500",
  D3: "bg-blue-500",
  D4: "bg-emerald-500",
  D5: "bg-purple-500",
  D6: "bg-slate-500",
};

const DIMENSION_BG: Record<string, string> = {
  D1: "bg-red-50 border-red-200",
  D2: "bg-amber-50 border-amber-200",
  D3: "bg-blue-50 border-blue-200",
  D4: "bg-emerald-50 border-emerald-200",
  D5: "bg-purple-50 border-purple-200",
  D6: "bg-slate-50 border-slate-200",
};

const DIMENSION_TEXT: Record<string, string> = {
  D1: "text-red-700",
  D2: "text-amber-700",
  D3: "text-blue-700",
  D4: "text-emerald-700",
  D5: "text-purple-700",
  D6: "text-slate-700",
};

function getScoreLabel(score: number): { label: string; color: string } {
  if (score <= 3) return { label: "LOW", color: "text-emerald-600 bg-emerald-50" };
  if (score <= 5) return { label: "MED", color: "text-amber-600 bg-amber-50" };
  if (score <= 7) return { label: "HIGH", color: "text-orange-600 bg-orange-50" };
  return { label: "CRITICAL", color: "text-red-600 bg-red-50" };
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

  const dimensions = [
    { key: "D1", name: t.diffModalD1, desc: t.diffModalD1Desc },
    { key: "D2", name: t.diffModalD2, desc: t.diffModalD2Desc },
    { key: "D3", name: t.diffModalD3, desc: t.diffModalD3Desc },
    { key: "D4", name: t.diffModalD4, desc: t.diffModalD4Desc },
    { key: "D5", name: t.diffModalD5, desc: t.diffModalD5Desc },
    { key: "D6", name: t.diffModalD6, desc: t.diffModalD6Desc },
  ];

  /* Compute weighted total */
  let computedTotal = 0;
  if (hasDimensionScores) {
    for (const d of dimensions) {
      computedTotal += (scores[d.key] || 0) * WEIGHTS[d.key];
    }
  }

  /* Difficulty badge color */
  const badgeColor =
    difficulty <= 3 ? "bg-emerald-500" :
    difficulty <= 5 ? "bg-amber-500" :
    difficulty <= 7 ? "bg-orange-500" :
    "bg-red-500";

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
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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

        {/* Company + Score Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground/80 tracking-wide uppercase mb-1">{companyName}</p>
              <p className="text-xs text-muted-foreground">{t.diffModalFinalScore}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`${badgeColor} text-white px-4 py-2 text-2xl font-black`}>
                {difficulty}
              </div>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          </div>
        </div>

        {/* Formula Section */}
        <div className="px-6 py-4 border-b border-border bg-slate-50/50">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-[0.12em] uppercase text-foreground/80">{t.diffModalFormula}</span>
          </div>
          <code className="block text-[11px] bg-white border border-border px-3 py-2 font-mono text-foreground/70 leading-relaxed">
            {t.diffModalFormulaDesc}
          </code>
        </div>

        {/* Dimension Scores */}
        {hasDimensionScores && (
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-[0.12em] uppercase text-foreground/80">
                {t.diffModalScore}
              </span>
            </div>

            {/* Score Table */}
            <div className="border border-border overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-slate-100 text-[10px] font-bold tracking-wider uppercase text-foreground/60 border-b border-border">
                <div className="col-span-5 px-3 py-2">{t.diffModalAnalysis}</div>
                <div className="col-span-2 px-3 py-2 text-center">{t.diffModalWeight}</div>
                <div className="col-span-3 px-3 py-2 text-center">{t.diffModalScore}</div>
                <div className="col-span-2 px-3 py-2 text-center">{t.diffModalWeighted}</div>
              </div>

              {/* Dimension Rows */}
              {dimensions.map((d) => {
                const score = scores[d.key] || 0;
                const weight = WEIGHTS[d.key];
                const weighted = score * weight;
                const { label, color } = getScoreLabel(score);

                return (
                  <div
                    key={d.key}
                    className={`grid grid-cols-12 border-b border-border last:border-b-0 ${DIMENSION_BG[d.key]} items-center`}
                  >
                    {/* Dimension Name + Description */}
                    <div className="col-span-5 px-3 py-3">
                      <div className={`text-xs font-bold ${DIMENSION_TEXT[d.key]}`}>{d.name}</div>
                      <div className="text-[10px] text-foreground/50 mt-0.5">{d.desc}</div>
                    </div>

                    {/* Weight */}
                    <div className="col-span-2 px-3 py-3 text-center">
                      <span className="text-xs font-mono text-foreground/60">{(weight * 100).toFixed(0)}%</span>
                    </div>

                    {/* Score Bar */}
                    <div className="col-span-3 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/80 overflow-hidden">
                          <div
                            className={`h-full ${DIMENSION_COLORS[d.key]} transition-all duration-500`}
                            style={{ width: `${score * 10}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-5 text-right">{score}</span>
                      </div>
                      <div className="mt-1 flex justify-end">
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold ${color}`}>{label}</span>
                      </div>
                    </div>

                    {/* Weighted Score */}
                    <div className="col-span-2 px-3 py-3 text-center">
                      <span className="text-sm font-bold">{weighted.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}

              {/* Total Row */}
              <div className="grid grid-cols-12 bg-slate-800 text-white items-center">
                <div className="col-span-5 px-3 py-3">
                  <span className="text-xs font-bold tracking-wider uppercase">{t.diffModalFinalScore}</span>
                </div>
                <div className="col-span-2 px-3 py-3 text-center">
                  <span className="text-xs font-mono">100%</span>
                </div>
                <div className="col-span-3 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/20 overflow-hidden">
                      <div
                        className={`h-full ${badgeColor} transition-all duration-500`}
                        style={{ width: `${computedTotal * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 px-3 py-3 text-center">
                  <span className="text-xl font-black">{computedTotal.toFixed(1)}</span>
                  <span className="text-xs ml-1 opacity-70">→ {difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Text */}
        {difficultyReason && (
          <div className="px-6 py-5 border-t border-border bg-slate-50/30">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-[0.12em] uppercase text-foreground/80">{t.diffModalAnalysis}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/65">{difficultyReason}</p>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            {t.diffModalClose}
          </button>
        </div>
      </div>
    </div>
  );
}
