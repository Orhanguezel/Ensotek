// =============================================================
// FILE: src/i18n/switchLocale.ts
// Ensotek – Locale switcher (URL-prefix based)
//  - Next built-in i18n YOK
//  - Cookie YOK (tek kaynak: URL prefix /tr /en)
// =============================================================

"use client";

import type { NextRouter } from "next/router";
import type { SupportedLocale } from "@/types/common";
import { localizePath } from "@/i18n/url";

function safeAsPath(asPath?: string) {
  const v = String(asPath || "/").trim();
  return v.startsWith("/") ? v : `/${v}`;
}

export async function switchLocale(router: NextRouter, next: SupportedLocale) {
  const asPath = safeAsPath(router.asPath);

  // URL prefix bazlı hedef üret: /tr/..., /en/...
  const target = localizePath(next, asPath);

  if (target === asPath) return;

  // i18n kapalı → normal push
  await router.push(target, target, { scroll: false });
}
