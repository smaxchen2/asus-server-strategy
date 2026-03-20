import { Fragment } from "react";

/**
 * StructuredText — 將含有【】標記的長文字智能分段顯示
 *
 * 規則：
 * 1. 以「【...】」作為分段標題，自動拆分為獨立段落
 * 2. 段落內的數字編號（如 "1. "、"2. "）自動換行為條列
 * 3. 第一個【】標記（archetype 前綴）不顯示為標題
 * 4. 支援 variant: "compact"（Home 列表用）和 "full"（Detail 頁用）
 */

type Variant = "compact" | "full";

interface Props {
  text: string;
  variant?: Variant;
  /** 標題顏色 class，例如 "text-red-600" */
  titleColor?: string;
}

interface Section {
  title: string;
  body: string;
}

/** 已知的 archetype 前綴標籤 */
const ARCHETYPE_PREFIXES = new Set([
  // Chinese
  "超大規模雲端戰術",
  "neocloud",
  "企業 IT 戰術",
  "金融業戰術",
  "醫療業戰術",
  "國防業戰術",
  "電信業戰術",
  "汽車/製造業戰術",
  "零售業戰術",
  "能源業戰術",
  // English
  "Hyperscale Cloud Strategy",
  "NeoCloud Strategy",
  "NeoCloud/AI Strategy",
  "Enterprise IT Strategy",
  "Enterprise IT Tactics",
  "Financial Industry Strategy",
  "Financial Industry Tactics",
  "Healthcare Industry Strategy",
  "Healthcare Industry Tactics",
  "Defense Industry Strategy",
  "Defense Industry Tactics",
  "Telecom Industry Strategy",
  "Telecom Industry Tactics",
  "Automotive/Manufacturing Strategy",
  "Automotive/Manufacturing Tactics",
  "Retail Industry Strategy",
  "Retail Industry Tactics",
  "Energy Industry Strategy",
  "Energy Industry Tactics",
]);

function parseSections(text: string): Section[] {
  if (!text) return [];

  // Split by 【...】 markers
  const parts = text.split(/【([^】]+)】/);
  const sections: Section[] = [];

  // parts[0] = text before first 【】 (usually empty)
  // parts[1] = first tag content, parts[2] = text after first tag
  // parts[3] = second tag content, parts[4] = text after second tag, etc.

  let i = 0;

  // If there's text before the first marker, treat it as a standalone section
  if (parts[0] && parts[0].trim()) {
    sections.push({ title: "", body: parts[0].trim() });
  }
  i = 1;

  while (i < parts.length) {
    const tag = parts[i] || "";
    const body = (parts[i + 1] || "").trim();
    i += 2;

    // Skip archetype prefix tags (they're just labels, not section titles)
    if (ARCHETYPE_PREFIXES.has(tag)) {
      // If there's body text directly after archetype tag (before next tag), add it
      if (body && !body.startsWith("")) {
        // Only add if it's actual content, not just leading into next section
        // Usually archetype prefix is followed immediately by another 【】
        // so body would be empty or whitespace
        if (body.length > 0) {
          sections.push({ title: "", body });
        }
      }
      continue;
    }

    sections.push({ title: tag, body });
  }

  return sections;
}

/** Split numbered items like "1. xxx 2. xxx" into separate lines */
function splitNumberedItems(text: string): string[] {
  if (!text) return [];

  // Match patterns like "1. ", "2. ", etc. that appear mid-text (not at start)
  // Split before each number pattern
  const items = text.split(/(?=\d+\.\s)/).filter((s) => s.trim());

  if (items.length <= 1) {
    // No numbered items found, return as single block
    return [text];
  }

  return items.map((item) => item.trim());
}

export default function StructuredText({
  text,
  variant = "compact",
  titleColor = "text-foreground",
}: Props) {
  const sections = parseSections(text);

  if (sections.length === 0) {
    return <p className="text-xs leading-relaxed text-foreground/80">{text}</p>;
  }

  // If only one section with no title, just render the body with numbered items
  if (sections.length === 1 && !sections[0].title) {
    const items = splitNumberedItems(sections[0].body);
    if (items.length <= 1) {
      return (
        <p className="text-xs leading-relaxed text-foreground/80">
          {sections[0].body}
        </p>
      );
    }
    return (
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <p key={idx} className="text-xs leading-relaxed text-foreground/80">
            {item}
          </p>
        ))}
      </div>
    );
  }

  const isCompact = variant === "compact";
  const sectionGap = isCompact ? "space-y-3" : "space-y-4";
  const titleSize = isCompact
    ? "text-[10px] font-bold tracking-wide"
    : "text-xs font-bold tracking-wide";
  const bodySize = isCompact
    ? "text-xs leading-relaxed"
    : "text-sm leading-relaxed";

  return (
    <div className={sectionGap}>
      {sections.map((section, sIdx) => {
        const items = splitNumberedItems(section.body);
        const hasNumberedItems = items.length > 1;

        return (
          <div key={sIdx}>
            {section.title && (
              <div
                className={`${titleSize} ${titleColor} mb-1.5 flex items-center gap-1`}
              >
                <span className="opacity-40">&#9654;</span>
                {section.title}
              </div>
            )}
            {hasNumberedItems ? (
              <div className="space-y-1.5 pl-2">
                {items.map((item, iIdx) => (
                  <p
                    key={iIdx}
                    className={`${bodySize} text-foreground/80`}
                  >
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className={`${bodySize} text-foreground/80`}>
                {section.body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * StructuredCommStrategy — 溝通策略的分段顯示
 * 較短的文字，但也可能含有逗號分隔的多個要點
 */
export function StructuredCommStrategy({
  text,
  variant = "compact",
}: {
  text: string;
  variant?: Variant;
}) {
  if (!text) return null;

  // If text is short enough, just render as-is
  if (text.length < 120) {
    const size = variant === "compact" ? "text-[10px]" : "text-xs";
    return <p className={`${size} leading-relaxed`}>{text}</p>;
  }

  // For longer text, try to split by sentence endings or major punctuation
  const sentences = text
    .split(/(?<=[。．.！!？?；;])\s*/)
    .filter((s) => s.trim());

  if (sentences.length <= 1) {
    const size = variant === "compact" ? "text-[10px]" : "text-xs";
    return <p className={`${size} leading-relaxed`}>{text}</p>;
  }

  const size = variant === "compact" ? "text-[10px]" : "text-xs";

  return (
    <div className="space-y-1">
      {sentences.map((sentence, idx) => (
        <p key={idx} className={`${size} leading-relaxed`}>
          {sentence}
        </p>
      ))}
    </div>
  );
}
