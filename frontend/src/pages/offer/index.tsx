// =============================================================
// FILE: src/pages/offer/index.tsx
// Ensotek – Offer Page (Public) + SEO (HOOK-SAFE)
//   - Route: /offer
//   - SEO: site_settings seo|site_seo fallback + ui_offer overrides
// =============================================================

"use client";

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import OfferPageContainer from "@/components/containers/offer/OfferPage";
import ContactMap from "@/components/containers/contact/ContactMap";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import { asObj, absUrl, pickFirstImageFromSeo, buildCanonical } from "@/seo/pageSeo";

// data
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";

const OFFER_PATH = "/offer";

const toLocaleShort = (l: any) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const OfferPage: React.FC = () => {
  const router = useRouter();

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_offer", locale);

  // Banner/UI title
  const bannerTitle = ui(
    "ui_offer_page_title",
    locale === "tr" ? "Teklif Talep Formu" : "Request an Offer",
  );

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: "seo", locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: "site_seo", locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // --- SEO fields (page-level) ---
  const pageTitleRaw = useMemo(() => {
    // İstersen ui_offer içine meta override key’leri koyabilirsin:
    // ui_offer_meta_title / ui_offer_meta_description
    return String(ui("ui_offer_meta_title", String(bannerTitle))).trim();
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const descFromUi = String(ui("ui_offer_meta_description", "")).trim();
    return descFromUi || String(seo?.description ?? "").trim() || "";
  }, [ui, seo]);

  const canonical = useMemo(() => {
    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname: OFFER_PATH,
      localizePath,
    });
  }, [router.asPath, locale]);

  const seoSiteName = useMemo(() => String(seo?.site_name ?? "").trim() || "Ensotek", [seo]);
  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? "").trim() || "%s | Ensotek",
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

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
      <OfferPageContainer locale={locale} />
      <ContactMap />
    </>
  );
};

export default OfferPage;
