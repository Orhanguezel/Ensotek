// =============================================================
// FILE: src/i18n/LangBoot.tsx
// =============================================================
"use client";

import { useMemo } from "react";
import { useRouter } from "next/router";

import HtmlLangSync from "./HtmlLangSync";
import { KNOWN_RTL, DEFAULT_LOCALE as STATIC_DEFAULT } from "./config";
import { normLocaleTag, normalizeLocales } from "@/i18n/localeUtils";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";
import type { SupportedLocale } from "@/types/common";

type AppLocalesValue =
  | SupportedLocale[]
  | string[]
  | { locales?: string[] | SupportedLocale[] }
  | null;

function readLocaleFromPath(asPath?: string): string {
  const p = String(asPath || "/").trim();
  const seg = p.replace(/^\/+/, "").split("/")[0] || "";
  return normLocaleTag(seg);
}

export default function LangBoot() {
  const router = useRouter();

  // ✅ runtime active locales
  const { data: appLocalesRow } = useGetSiteSettingByKeyQuery({ key: "app_locales" });

  // ✅ runtime default locale
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: "default_locale" });

  const activeLocales = useMemo(() => {
    const raw = (appLocalesRow?.value ?? null) as AppLocalesValue;
    return normalizeLocales(raw); // string[]
  }, [appLocalesRow?.value]);

  const runtimeDefault = useMemo(() => {
    const cand = normLocaleTag(defaultLocaleRow?.value);
    const activeSet = new Set(activeLocales.map(normLocaleTag));

    if (cand && activeSet.has(cand)) return cand;
    return normLocaleTag(activeLocales[0]) || normLocaleTag(STATIC_DEFAULT) || "tr";
  }, [defaultLocaleRow?.value, activeLocales]);

  const resolved = useMemo(() => {
    // ✅ önce path prefix
    const fromPath = readLocaleFromPath(router.asPath);
    const activeSet = new Set(activeLocales.map(normLocaleTag));

    const l =
      (fromPath && activeSet.has(fromPath))
        ? fromPath
        : runtimeDefault;

    const dir = KNOWN_RTL.has(l) ? "rtl" : "ltr";
    return { lang: l, dir };
  }, [router.asPath, activeLocales, runtimeDefault]);

  return <HtmlLangSync lang={resolved.lang} dir={resolved.dir as "ltr" | "rtl"} />;
}
