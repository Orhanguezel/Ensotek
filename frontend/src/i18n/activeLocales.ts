// =============================================================
// FILE: src/i18n/activeLocales.ts
// =============================================================
"use client";

import { useMemo } from "react";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";
import type { SupportedLocale } from "@/types/common";
import { normalizeLocales } from "@/i18n/localeUtils";

type AppLocalesValue =
  | SupportedLocale[]
  | string[]
  | { locales?: string[] | SupportedLocale[] }
  | null;

export function useActiveLocales() {
  const { data, isLoading } = useGetSiteSettingByKeyQuery({ key: "app_locales" });

  const locales = useMemo<SupportedLocale[]>(() => {
    const raw = (data?.value ?? null) as AppLocalesValue;
    const normalized = normalizeLocales(raw) as SupportedLocale[];
    return normalized.length ? normalized : (["tr"] as SupportedLocale[]);
  }, [data?.value]);

  return { locales, isLoading };
}
