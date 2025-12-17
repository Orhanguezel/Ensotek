// =============================================================
// FILE: src/pages/service/[slug].tsx
// Public Service Detail Page (by slug) + SEO (HOOK-SAFE)
//   - Route: /service/[slug]
//   - Data: custom_pages/by-slug (module_key="service")
//   - Canonical: buildCanonical (slug yoksa /service)
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import ServiceDetail from "@/components/containers/service/ServiceDetail";
import ServiceMore from "@/components/containers/service/ServiceMore";
import ServiceCta from "@/components/containers/cta/ServiceCta";

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

// data
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";
import { useGetCustomPageBySlugPublicQuery } from "@/integrations/rtk/hooks";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const SERVICE_PATH = "/service";

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_services", locale);

  // slug normalize
  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0]
        : "";

  // Next/router hydration: query gelene kadar slug boş olabilir
  const isSlugReady = Boolean(slug);

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

  // Page data (meta override)
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  // UI fallbacks
  const listTitleFallback = ui("ui_services_page_title", "Services");
  const detailTitleFallback = ui(
    "ui_services_detail_page_title",
    "Service Detail",
  );

  // Banner title
  const bannerTitle = useMemo(() => {
    return (page?.title || "").trim() || detailTitleFallback || listTitleFallback;
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // Canonical: slug hazır değilse /service; hazırsa /service/[slug]
  const canonical = useMemo(() => {
    const fallbackPathname = isSlugReady
      ? `${SERVICE_PATH}/${slug}`
      : SERVICE_PATH;

    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname,
      localizePath,
    });
  }, [router.asPath, locale, isSlugReady, slug]);

  // SEO core
  const seoSiteName = useMemo(
    () => String(seo?.site_name ?? "").trim() || "Ensotek",
    [seo],
  );

  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? "").trim() || "%s | Ensotek",
    [seo],
  );

  const pageTitleRaw = useMemo(() => {
    // slug yokken list sayfası title’ı gibi davran
    if (!isSlugReady) return String(listTitleFallback).trim();

    return (
      (page?.meta_title ?? "").trim() ||
      (page?.title ?? "").trim() ||
      String(bannerTitle).trim()
    );
  }, [isSlugReady, listTitleFallback, page?.meta_title, page?.title, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    // slug yokken description’ı global seo’dan al
    if (!isSlugReady) return String(seo?.description ?? "").trim() || "";

    return (
      (page?.meta_description ?? "").trim() ||
      (page?.summary ?? "").trim() ||
      excerpt(page?.content_html ?? "", 160).trim() ||
      String(seo?.description ?? "").trim() ||
      ""
    );
  }, [
    isSlugReady,
    page?.meta_description,
    page?.summary,
    page?.content_html,
    seo,
  ]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    // slug yokken site_seo görseli
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";

    if (!isSlugReady) return fallback || absUrl("/favicon.ico");

    const pageImgRaw = (page?.featured_image ?? "").trim();
    const pageImg = pageImgRaw
      ? (toCdnSrc(pageImgRaw, 1200, 630, "fill") || pageImgRaw)
      : "";

    return (pageImg && absUrl(pageImg)) || fallback || absUrl("/favicon.ico");
  }, [isSlugReady, page?.featured_image, seo]);

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
      twitterCreator:
        typeof tw.creator === "string" ? tw.creator.trim() : undefined,
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

      {!isSlugReady ? (
        <div className="service__area pt-120 pb-90">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="skeleton-line" style={{ height: 24 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ServiceDetail slug={slug} />
          <ServiceMore currentSlug={slug} />
          <ServiceCta />
        </>
      )}
    </>
  );
};

export default ServiceDetailPage;
