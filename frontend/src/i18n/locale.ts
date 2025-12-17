// src/i18n/locale.ts
"use client";

import { useRouter } from "next/router";
import type { SupportedLocale } from "@/types/common";
import { normalizeLocale } from "./config";

export function useResolvedLocale(explicitLocale?: SupportedLocale | string | null): SupportedLocale {
  const { locale: routerLocale } = useRouter();

  const cand =
    (typeof explicitLocale === "string" && explicitLocale) ||
    routerLocale ||
    undefined;

  return normalizeLocale(cand);
}

