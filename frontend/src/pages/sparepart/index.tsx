// =============================================================
// FILE: src/pages/sparepart/index.tsx
// Ensotek – Spareparts Page (list) + SEO (HOOK-SAFE)
//   - Route: /sparepart
//   - Content: ProductPageContent (products modülü reuse)
// =============================================================

"use client";

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductPageContent from "@/components/containers/product/ProductPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import { asObj, absUrl, pickFirstImageFromSeo, buildCanonical } from "@/seo/pageSeo";

// data
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";

const SPAREPART_PATH = "/sparepart";

const SparepartPage: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_spareparts", locale);

  // Banner/UI title
  const bannerTitle = ui(
    "ui_spareparts_page_title",
    locale === "tr" ? "Yedek Parçalar" : "Spare Parts",
  );

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: "seo", locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: "site_seo", locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // Canonical (list page)
  const canonical = useMemo(() => {
    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname: SPAREPART_PATH,
      localizePath,
    });
  }, [router.asPath, locale]);

  const seoSiteName = useMemo(
    () => String(seo?.site_name ?? "").trim() || "Ensotek",
    [seo],
  );

  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? "").trim() || "%s | Ensotek",
    [seo],
  );

  // Title/Description for list page
  const pageTitleRaw = useMemo(() => String(bannerTitle).trim(), [bannerTitle]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const pageDescRaw = useMemo(() => {
    // İstersen ui_spareparts’dan ayrıca description key’i ekleyebilirsin.
    return String(seo?.description ?? "").trim() || "";
  }, [seo]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";
    return fallback || absUrl("/favicon.ico");
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
    const noindex = typeof robots.noindex === "boolean" ? robots.noindex : false;

    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      canonical,
      url: canonical,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: String(tw.card ?? "").trim() || "summary_large_image",
      twitterSite: typeof tw.site === "string" ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === "string" ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, canonical, ogImage, seoSiteName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {headSpecs.map((spec, idx) => {
          if (spec.kind === "link") return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          if (spec.kind === "meta-name") return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}
      </Head>

      <Banner title={bannerTitle} />
      <ProductPageContent />
      <Feedback />
    </>
  );
};

export default SparepartPage;
