// src/features/seo/SeoSnapshotCookie.tsx
"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/types/common";

type Props = {
  /** İstersen override edebilirsin; boşsa ENV → "guezelwebdesign" */
  tenant?: string;
  /** İstersen override edebilirsin; boşsa pathname’den türetilir */
  pageKey?: string;
  /** Zorunlu: sayfanın aktif dili (layout/page’ten gönder) */
  locale: SupportedLocale;
};

export default function SeoSnapshotCookie({ tenant, pageKey, locale }: Props) {
  const pathname = usePathname() || "/";

  // tenant: prop → ENV → default
  const tenantKey = tenant || process.env.NEXT_PUBLIC_TENANT || "guezelwebdesign";

  // pageKey: prop → pathname’den türet
  const derivedKey = useMemo(() => {
    // "/tr" veya "/tr/" → "home"
    if (/^\/[a-z]{2}\/?$/.test(pathname)) return "home";
    // "/tr/about/team" → "about_team"
    const cleaned = pathname.replace(/^\/[a-z]{2}\//, "").replace(/^\/+|\/+$/g, "");
    return cleaned ? cleaned.replace(/[^a-z0-9]+/gi, "_").toLowerCase() : "home";
  }, [pathname]);

  const finalPageKey = pageKey || derivedKey;

  // cookie adı
  const cookieName = useMemo(
    () => `seo_snap_${tenantKey}_${finalPageKey}_${locale}`,
    [tenantKey, finalPageKey, locale]
  );

  useEffect(() => {
    try {
      const title = document.title || "";
      const ogTitle =
        document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
      const ogDesc =
        document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
      const desc =
        document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
      const ogSiteName =
        document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") || "";

      const payload = encodeURIComponent(
        JSON.stringify({ title, ogTitle, ogDesc, desc, canonical, ogSiteName, locale, pathname })
      );

      // Session cookie (test sadece varlığını kontrol ediyor)
      document.cookie = `${cookieName}=${payload}; path=/; SameSite=Lax`;
    } catch {
      // sessiz düş
    }
  }, [cookieName, locale, pathname]);

  return null;
}
