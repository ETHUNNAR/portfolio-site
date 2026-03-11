"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="fixed top-6 right-6 z-50 hero-fade-in"
      role="group"
      aria-label="Language selection"
    >
      <div className="flex items-center gap-2 glass rounded-full p-1">
        <button
          onClick={() => setLanguage("en")}
          aria-label="Switch to English"
          aria-pressed={language === "en"}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            language === "en"
              ? "bg-accent text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("da")}
          aria-label="Skift til dansk"
          aria-pressed={language === "da"}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            language === "da"
              ? "bg-accent text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          DA
        </button>
      </div>
    </div>
  );
}
