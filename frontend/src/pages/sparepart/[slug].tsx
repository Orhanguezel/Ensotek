// =============================================================
// FILE: src/pages/sparepart/[slug].tsx
// =============================================================

"use client";

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductDetail from "@/components/containers/product/ProductDetail";
import ProductMore from "@/components/containers/product/ProductMore";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import { asObj, absUrl, pickFirstImageFromSeo, buildCanonical } from "@/seo/pageSeo";

// data
import {
  useGetSiteSettingByKeyQuery,
  useGetProductBySlugQuery
} from "@/integrations/rtk/hooks";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const SPAREPART_PATH = "/sparepart";

const toLocaleShort = (l: any) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const SparepartDetailPage: React.FC = () => {
  const router = useRouter();

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_spareparts", locale);

  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0] ?? ""
        : "";

  const isSlugReady = Boolean(slug);

  const listTitleFallback = ui("ui_spareparts_page_title", "Spare Parts");
  const detailTitleFallback = ui("ui_spareparts_detail_page_title", "Spare Part");

  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: "seo", locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: "site_seo", locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  const { data: product } = useGetProductBySlugQuery({ slug, locale }, { skip: !isSlugReady });

  // ✅ ESLint: dependency olarak product kullan
  const bannerTitle = useMemo(() => {
    const t = String(product?.title ?? "").trim();
    return t || detailTitleFallback || listTitleFallback;
  }, [product, detailTitleFallback, listTitleFallback]);

  const canonical = useMemo(() => {
    const fallbackPathname = isSlugReady ? `${SPAREPART_PATH}/${slug}` : SPAREPART_PATH;

    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname,
      localizePath,
    });
  }, [router.asPath, locale, isSlugReady, slug]);

  const seoSiteName = useMemo(() => String(seo?.site_name ?? "").trim() || "Ensotek", [seo]);
  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? "").trim() || "%s | Ensotek",
    [seo],
  );

  const pageTitleRaw = useMemo(() => {
    if (!isSlugReady) return String(listTitleFallback).trim();

    const metaTitle = String(product?.meta_title ?? "").trim();
    const title = String(product?.title ?? "").trim();

    return metaTitle || title || String(bannerTitle).trim();
  }, [isSlugReady, listTitleFallback, product, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    if (!isSlugReady) return String(seo?.description ?? "").trim() || "";

    const metaDesc = String(product?.meta_description ?? "").trim();
    const desc = String(product?.description ?? "").trim();

    return metaDesc || excerpt(desc, 160).trim() || String(seo?.description ?? "").trim() || "";
  }, [isSlugReady, product, seo]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s") ? titleTemplate.replace("%s", pageTitleRaw) : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";

    if (!isSlugReady) return fallback || absUrl("/favicon.ico");

    const images: unknown[] = Array.isArray(product?.images) ? (product?.images as unknown[]) : [];
    const firstImage = String(images[0] ?? "").trim();

    const rawImg = String(product?.image_url ?? "").trim() || firstImage;
    const img = rawImg ? (toCdnSrc(rawImg, 1200, 630, "fill") || rawImg) : "";

    return (img && absUrl(img)) || fallback || absUrl("/favicon.ico");
  }, [isSlugReady, product, seo]);

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
          <ProductDetail />
          <ProductMore />
          <Feedback />
        </>
      )}
    </>
  );
};

export default SparepartDetailPage;
