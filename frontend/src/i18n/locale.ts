// =============================================================
// FILE: src/i18n/locale.ts
// =============================================================
"use client";

import { useMemo } from "react";
import { useRouter } from "next/router";
import type { SupportedLocale } from "@/types/common";
import { LOCALE_SET, DEFAULT_LOCALE } from "./config";

function toShortLocale(v: unknown): string {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace("_", "-")
    .split("-")[0]
    .trim();
}

function readLocaleFromPath(asPath?: string): string {
  const p = String(asPath || "/").trim();
  const seg = p.replace(/^\/+/, "").split("/")[0] || "";
  return toShortLocale(seg);
}

function readLocaleFromCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  return m ? toShortLocale(decodeURIComponent(m[1])) : "";
}

export function useResolvedLocale(
  explicitLocale?: SupportedLocale | string | null,
): SupportedLocale {
  const router = useRouter();

  return useMemo(() => {
    // 1) URL prefix (/tr/..., /en/...)
    const fromPath = readLocaleFromPath(router.asPath);
    if (fromPath && LOCALE_SET.has(fromPath)) return fromPath as SupportedLocale;

    // 2) cookie
    const fromCookie = readLocaleFromCookie();
    if (fromCookie && LOCALE_SET.has(fromCookie)) return fromCookie as SupportedLocale;

    // 3) explicit param
    const fromExplicit = toShortLocale(explicitLocale);
    if (fromExplicit && LOCALE_SET.has(fromExplicit)) return fromExplicit as SupportedLocale;

    // 4) fallback
    return DEFAULT_LOCALE;
  }, [router.asPath, explicitLocale]);
}
