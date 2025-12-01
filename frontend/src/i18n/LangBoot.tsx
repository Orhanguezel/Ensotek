// src/i18n/LangBoot.tsx
"use client";
import { useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { KNOWN_RTL, normalizeLocale } from "./config";
import HtmlLangSync from "./HtmlLangSync";
import { setApiLang } from "@/lib/api";

export default function LangBoot() {
  const { locale } = useRouter();
  const l = normalizeLocale(locale);
  const dir = KNOWN_RTL.has(l) ? "rtl" : "ltr";

  // Route locale'ı uygulama açılır açılmaz API'ye set et
  useLayoutEffect(() => {
    setApiLang(l);
  }, [l]);

  return <HtmlLangSync lang={l} dir={dir as "ltr" | "rtl"} />;
}
