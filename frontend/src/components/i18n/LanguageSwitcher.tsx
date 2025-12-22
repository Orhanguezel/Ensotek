// =============================================================
// FILE: src/components/i18n/LanguageSwitcher.tsx
// =============================================================
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { useActiveLocales } from "@/i18n/activeLocales";
import { switchLocale } from "@/i18n/switchLocale";

function normShortLocale(x: unknown): string {
  return String(x || "")
    .trim()
    .toLowerCase()
    .replace("_", "-")
    .split("-")[0]
    .trim();
}

function readLocaleFromPath(asPath?: string): string {
  const p = String(asPath || "/").trim();
  const seg = p.replace(/^\/+/, "").split("/")[0] || "";
  return normShortLocale(seg);
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales, isLoading } = useActiveLocales();

  const current = useMemo(() => {
    return readLocaleFromPath(router.asPath);
  }, [router.asPath]);

  if (isLoading) return null;
  if (!locales?.length) return null;

  return (
    <nav aria-label="Language switcher">
      <ul className="list-inline m-0">
        {locales.map((l) => {
          const code = normShortLocale(l);
          const isCurrent = !!code && code === current;

          return (
            <li key={code || String(l)} className="list-inline-item">
              <button
                type="button"
                onClick={() => switchLocale(router, code)}
                className="bg-transparent border-0 p-0 cursor-pointer"
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Switch language to ${code.toUpperCase()}`}
              >
                {code.toUpperCase()}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
