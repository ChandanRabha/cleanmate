"use client";

import { Languages } from "lucide-react";
import { useLanguage, type Language } from "./language-context";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <label className="language-switcher"><Languages size={16}/><span className="sr-only">Language</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Language"><option value="en">English</option><option value="hi">हिंदी</option><option value="as">অসমীয়া</option></select></label>;
}
