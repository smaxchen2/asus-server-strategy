import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold border border-border bg-white hover:bg-muted transition-colors tracking-wide"
      title={lang === "zh" ? "Switch to English" : "切換至繁體中文"}
    >
      <Languages className="w-3.5 h-3.5" />
      <span className={lang === "zh" ? "opacity-40" : ""}>{t.langEn}</span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "en" ? "opacity-40" : ""}>{t.langZh}</span>
    </button>
  );
}
