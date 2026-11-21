import { useState, useCallback, useEffect, type ReactNode } from "react";
import type { Lang } from "./translations";
import { LanguageContext } from "./language-context";

const STORAGE_KEY = "portfolio-lang";


function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "fa") {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted environments.
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors.
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "en" ? "fa" : "en";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage write errors.
      }
      return next;
    });
  }, []);

  const t = useCallback(
    <T,>(obj: { en: T; fa: T }): T => obj[lang],
    [lang]
  );

  const isRtl = lang === "fa";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [isRtl, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}
