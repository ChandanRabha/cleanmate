"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "hi" | "as";

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("cleanmate-language");
    if (saved === "en" || saved === "hi" || saved === "as") {
      const restore = window.setTimeout(() => setLanguage(saved), 0);
      return () => window.clearTimeout(restore);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "as" ? "as" : language;
    window.localStorage.setItem("cleanmate-language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
