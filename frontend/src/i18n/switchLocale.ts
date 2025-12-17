// src/i18n/switchLocale.ts
"use client";

import type { NextRouter } from "next/router";
import type { SupportedLocale } from "@/types/common";
import { localizePath } from "@/i18n/url";

export async function switchLocale(router: NextRouter, next: SupportedLocale) {
    const asPath = router.asPath || "/";

    // Next i18n aktifse router.locale dolu olur ve locale push çalışır
    // (Not: router.locale her zaman dolu olmayabilir; next.config.js i18n yoksa genelde undefined)
    const hasNextI18n = typeof router.locale === "string";

    if (hasNextI18n) {
        // asPath’i koruyup sadece locale değiştir
        await router.push(asPath, asPath, { locale: next });
        return;
    }

    // i18n config yoksa path-prefix mantığına düş
    await router.push(localizePath(next, asPath));
}
