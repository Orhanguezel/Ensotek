// =============================================================
// FILE: src/pages/product/[slug].tsx
// Ensotek – Product Detail Page (by slug) + SEO (HOOK-SAFE)
//   - Route: /product/[slug] (locale segmenti sende /tr/... olabilir)
//   - Data: products/by-slug
//   - SEO: site_settings seo|site_seo fallback + product.meta_* override
// =============================================================

"use client";

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductDetail from "@/components/containers/product/ProductDetail";
import ProductMore from "@/components/containers/product/ProductMore";
import Feedback from "@/components/containers/feedback/Feedback";
import ServiceCta from "@/components/containers/cta/ServiceCta";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import { asObj, absUrl, pickFirstImageFromSeo, buildCanonical } from "@/seo/pageSeo";

// data
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";
import { useGetProductBySlugQuery } from "@/integrations/rtk/hooks";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const PRODUCT_PATH = "/product";

const toLocaleShort = (l: any) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const ProductDetailPage: React.FC = () => {
  const router = useRouter();

  // API/DB için kısa locale
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_products", locale);

  // slug normalize
  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0] ?? ""
        : "";

  const isSlugReady = Boolean(slug);

  // UI fallbacks
  const listTitleFallback = ui("ui_products_page_title", locale === "tr" ? "Ürünler" : "Products");
  const detailTitleFallback = ui("ui_products_detail_page_title", locale === "tr" ? "Ürün Detayı" : "Product");

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: "seo", locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: "site_seo", locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // Product data (meta override)
  const { data: product } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  // Banner title (ürün geldiyse ürün title, değilse fallback)
  const bannerTitle = useMemo(() => {
    const t = (product?.title ?? "").trim();
    return t || detailTitleFallback || listTitleFallback;
  }, [product?.title, detailTitleFallback, listTitleFallback]);

  // Canonical: slug yoksa /product; varsa /product/[slug]
  const canonical = useMemo(() => {
    const fallbackPathname = isSlugReady ? `${PRODUCT_PATH}/${slug}` : PRODUCT_PATH;

    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname,
      localizePath,
    });
  }, [router.asPath, locale, isSlugReady, slug]);

  const seoSiteName = useMemo(
    () => String(seo?.site_name ?? "").trim() || "Ensotek",
    [seo],
  );

  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? "").trim() || "%s | Ensotek",
    [seo],
  );

  // --- SEO fields (ProductDto ile uyumlu) ---
  const pageTitleRaw = useMemo(() => {
    if (!isSlugReady) return String(listTitleFallback).trim();

    const metaTitle = (product?.meta_title ?? "").trim();
    const title = (product?.title ?? "").trim();

    return metaTitle || title || String(bannerTitle).trim();
  }, [isSlugReady, listTitleFallback, product?.meta_title, product?.title, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    if (!isSlugReady) return String(seo?.description ?? "").trim() || "";

    const metaDesc = (product?.meta_description ?? "").trim();
    const desc = (product?.description ?? "").trim();

    return (
      metaDesc ||
      excerpt(desc, 160).trim() ||
      String(seo?.description ?? "").trim() ||
      ""
    );
  }, [isSlugReady, product?.meta_description, product?.description, seo]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";

    if (!isSlugReady) return fallback || absUrl("/favicon.ico");

    // ProductDto: image_url ve images
    const rawImg =
      (product?.image_url ?? "") ||
      (Array.isArray(product?.images) && product.images.length ? product.images[0] : "");

    const imgRaw = String(rawImg || "").trim();
    const img = imgRaw ? (toCdnSrc(imgRaw, 1200, 630, "fill") || imgRaw) : "";

    return (img && absUrl(img)) || fallback || absUrl("/favicon.ico");
  }, [isSlugReady, product?.image_url, product?.images, seo]);

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
          if (spec.kind === "link") {
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          }
          if (spec.kind === "meta-name") {
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          }
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
          <ServiceCta />
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
