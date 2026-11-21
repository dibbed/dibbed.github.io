import { createContext } from "react";
import type { Lang } from "./translations";

export interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: <T>(obj: { en: T; fa: T }) => T;
  isRtl: boolean;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);
