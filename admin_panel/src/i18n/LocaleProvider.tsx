"use client";
import type React from "react";
import { createContext, useContext } from "react";

import { useAdminTranslations } from "./adminUi";
import { useLocaleShort } from "./useLocaleShort";

// Context type: locale and translation function
type LocaleContextType = {
  locale: string;
  t: ReturnType<typeof useAdminTranslations>;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleShort();
  const t = useAdminTranslations(locale);
  return <LocaleContext.Provider value={{ locale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used within LocaleProvider");
  return ctx;
}
