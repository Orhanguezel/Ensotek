// src/i18n/LangBoot.tsx
"use client";

import { useRouter } from "next/router";
import { KNOWN_RTL, normalizeLocale } from "./config";
import HtmlLangSync from "./HtmlLangSync";

export default function LangBoot() {
  const { locale } = useRouter();
  const l = normalizeLocale(locale);
  const dir = KNOWN_RTL.has(l) ? "rtl" : "ltr";

  // Burada artık sadece <html lang / dir> senkronize ediyoruz.
  // API dili her istekte locale parametresiyle gönderiliyor.

  return <HtmlLangSync lang={l} dir={dir as "ltr" | "rtl"} />;
}
