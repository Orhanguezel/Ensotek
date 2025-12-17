// src/components/i18n/LanguageSwitcher.tsx
"use client";

import React from "react";
import { useRouter } from "next/router";
import type { SupportedLocale } from "@/types/common";

import { useActiveLocales } from "@/i18n/activeLocales";
import { switchLocale } from "@/i18n/switchLocale";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales, isLoading } = useActiveLocales();

  if (isLoading) return null;

  return (
    <nav aria-label="Language switcher">
      <ul className="list-inline m-0">
        {locales.map((l) => (
          <li key={l} className="list-inline-item">
            <button
              type="button"
              onClick={() => switchLocale(router, l as SupportedLocale)}
              style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
              aria-current={router.locale === l ? "true" : undefined}
            >
              {String(l).toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

