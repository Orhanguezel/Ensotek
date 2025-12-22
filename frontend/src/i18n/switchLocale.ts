// =============================================================
// FILE: src/i18n/switchLocale.ts
// Ensotek – Locale switcher (URL-prefix based) (DYNAMIC)
//  - No hardcoded locales
//  - activeLocales is OPTIONAL; pass it when you have it to strip correctly
// =============================================================

"use client";

import type { NextRouter } from "next/router";
import { localizePath, type RuntimeLocale } from "@/i18n/url";

function safeAsPath(asPath?: string) {
  const v = String(asPath || "/").trim();
  return v.startsWith("/") ? v : `/${v}`;
}

export async function switchLocale(
  router: NextRouter,
  next: RuntimeLocale,
  activeLocales?: string[],
) {
  const asPath = safeAsPath(router.asPath);
  const target = localizePath(next, asPath, activeLocales);

  if (target === asPath) return;

  await router.push(target, target, { scroll: false });
}
