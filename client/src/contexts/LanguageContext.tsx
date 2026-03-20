import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Lang, type Translations, getTranslations } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "zh";
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "zh" || stored === "en") return stored;
  } catch {
    // ignore
  }
  return "zh";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("lang", newLang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "zh" ? "en" : "zh");
  }, [lang, setLang]);

  const t = getTranslations(lang);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
