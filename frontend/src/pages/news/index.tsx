// =============================================================
// FILE: src/pages/news/index.tsx
// Ensotek – News Page (full list) + SEO
//   - Route: /news
//   - Data: custom_pages (module_key="news") => meta override
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";

import Banner from "@/components/layout/banner/Breadcrum";
import NewsPageContent from "@/components/containers/news/NewsPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

// SEO
import { buildMeta } from "@/seo/meta";
import {
  asObj,
  absUrl,
  pickFirstImageFromSeo,
} from "@/seo/pageSeo";

// data
import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery
} from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const NewsPage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_news", locale);

  // Banner title (UI)
  const bannerTitle = ui(
    "ui_news_page_title",
    locale === "tr" ? "Haberler" : "News",
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

  // News list (meta override için ilk published kayıt)
  const { data: newsData } = useListCustomPagesPublicQuery({
    module_key: "news",
    locale,
    limit: 10,
    sort: "created_at",
    orderDir: "asc",
  });

  const published = useMemo(() => {
    const items: CustomPageDto[] = (newsData?.items ?? []) as any;
    return items.filter((p) => p.is_published);
  }, [newsData]);

  const primary = published[0];

  // --- SEO: Title/Description ---
  const titleFallback = ui(
    "ui_news_page_title",
    locale === "tr" ? "Haberler" : "News",
  );

  const pageTitleRaw =
    (primary?.meta_title ?? "").trim() ||
    (primary?.title ?? "").trim() ||
    String(titleFallback).trim();

  const pageDescRaw =
    (primary?.meta_description ?? "").trim() ||
    (primary?.summary ?? "").trim() ||
    excerpt(primary?.content_html ?? "", 160).trim() ||
    String(seo?.description ?? "").trim() ||
    "";

  const seoSiteName = String(seo?.site_name ?? "").trim() || "Ensotek";
  const titleTemplate = String(seo?.title_template ?? "").trim() || "%s | Ensotek";

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = (primary?.featured_image ?? "").trim();
    const pageImg = pageImgRaw
      ? (toCdnSrc(pageImgRaw, 1200, 630, "fill") || pageImgRaw)
      : "";

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";

    return (pageImg && absUrl(pageImg)) || fallback || absUrl("/favicon.ico");
  }, [primary?.featured_image, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
    const noindex = typeof robots.noindex === "boolean" ? robots.noindex : false;

    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,

      twitterCard: (String(tw.card ?? "").trim() || "summary_large_image"),
      twitterSite: typeof tw.site === "string" ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === "string" ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {headSpecs.map((spec, idx) => {
          if (spec.kind === "link") {
            return (
              <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />
            );
          }
          if (spec.kind === "meta-name") {
            return (
              <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />
            );
          }
          return (
            <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />
          );
        })}
      </Head>

      <Banner title={bannerTitle} />
      <NewsPageContent />
      <Feedback />
    </>
  );
};

export default NewsPage;
