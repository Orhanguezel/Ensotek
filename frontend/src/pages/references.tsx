// =============================================================
// FILE: src/pages/references.tsx
// Ensotek – References Page (full list) + SEO
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import ReferencesPageContent from "@/components/containers/references/ReferencesPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import {
  asObj,
  absUrl,
  pickFirstImageFromSeo,
  buildCanonical,
} from "@/seo/pageSeo";

// data (global SEO settings)
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";

const REFERENCES_PATH = "/references";

const ReferencesPage = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_references", locale);

  // Banner/UI title
  const bannerTitle = ui(
    "ui_references_page_title",
    locale === "tr" ? "Referanslarımız" : "References",
  );

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({
    key: "seo",
    locale,
  });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({
    key: "site_seo",
    locale,
  });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // --- SEO: Title/Description ---
  // References sayfasında (şimdilik) custom_pages meta_title/meta_description kaynağı yok.
  // Bu yüzden: UI title -> SEO template ile birleştir, description'ı global SEO'dan al.
  const pageTitleRaw = String(bannerTitle || "").trim() || "References";

  const pageDescRaw = useMemo(() => {
    // öncelik: UI’da varsa özel description key’i (opsiyonel)
    const uiDesc = String(ui("ui_references_page_description", "") || "").trim();
    if (uiDesc) return uiDesc;

    // sonra global seo.description
    const globalDesc = String(seo?.description ?? "").trim();
    if (globalDesc) return globalDesc;

    // en son çare
    return "";
  }, [ui, seo?.description]);

  const canonical = useMemo(() => {
    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname: REFERENCES_PATH,
      localizePath,
    });
  }, [router.asPath, locale]);

  const seoSiteName = String(seo?.site_name ?? "").trim() || "Ensotek";
  const titleTemplate = String(seo?.title_template ?? "").trim() || "%s | Ensotek";

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    // references sayfası için primary image kaynağı yoksa global seo OG image’a düş
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

      twitterCard: (String(tw.card ?? "").trim() || "summary_large_image"),
      twitterSite: typeof tw.site === "string" ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === "string" ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, canonical, ogImage, seoSiteName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {headSpecs.map((spec, idx) => {
          if (spec.kind === "link") {
            return (
              <link
                key={`l:${spec.rel}:${idx}`}
                rel={spec.rel}
                href={spec.href}
              />
            );
          }
          if (spec.kind === "meta-name") {
            return (
              <meta
                key={`n:${spec.key}:${idx}`}
                name={spec.key}
                content={spec.value}
              />
            );
          }
          return (
            <meta
              key={`p:${spec.key}:${idx}`}
              property={spec.key}
              content={spec.value}
            />
          );
        })}
      </Head>

      <Banner title={bannerTitle} />
      <ReferencesPageContent />
      <Feedback />
    </>
  );
};

export default ReferencesPage;
