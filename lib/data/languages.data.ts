import { LanguageInfo } from "../types/portfolio.types";
import { Translations } from "../translations";

export const getLanguages = (t: Translations): LanguageInfo[] => [
  { lang: t.languagesData[0].lang, level: t.languagesData[0].level, flag: "🇩🇰" },
  { lang: t.languagesData[1].lang, level: t.languagesData[1].level, flag: "🇬🇧" },
  { lang: t.languagesData[2].lang, level: t.languagesData[2].level, flag: "🇻🇳" },
];
