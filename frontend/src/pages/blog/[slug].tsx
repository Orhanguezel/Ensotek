// =============================================================
// FILE: src/pages/blog/[slug].tsx
// Ensotek – Blog Detail Page (by slug) + SEO
//   - Route: /blog/[slug]
//   - Data: custom_pages/by-slug (module_key="blog")
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import BlogDetailsArea from "@/components/containers/blog/BlogDetailsArea";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import { asObj, absUrl, pickFirstImageFromSeo, buildCanonical } from "@/seo/pageSeo";

// data
import { useGetSiteSettingByKeyQuery, useGetCustomPageBySlugPublicQuery } from "@/integrations/rtk/hooks";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const BLOG_PATH = "/blog";

const BlogDetailPage: React.FC = () => {
  const router = useRouter();

  const resolved = useResolvedLocale();
  const localeShort = (resolved || "tr").split("-")[0]; // ✅ kritik
  const { ui } = useUiSection("ui_blog", localeShort);

  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0]
        : "";

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({
    key: "seo",
    locale: localeShort,
  });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({
    key: "site_seo",
    locale: localeShort,
  });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // Blog item by slug
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale: localeShort }, // ✅ kritik
    { skip: !slug },
  );

  const listTitleFallback = ui("ui_blog_page_title", "Blog");
  const detailTitleFallback = ui(
    "ui_blog_detail_page_title",
    localeShort === "tr" ? "Blog Detayı" : "Blog Detail",
  );

  const bannerTitle =
    (page?.title || "").trim() || detailTitleFallback || listTitleFallback;

  const pageTitleRaw =
    (page?.meta_title ?? "").trim() ||
    (page?.title ?? "").trim() ||
    String(bannerTitle || "Blog").trim();

  const pageDescRaw =
    (page?.meta_description ?? "").trim() ||
    (page?.summary ?? "").trim() ||
    excerpt(page?.content_html ?? "", 160).trim() ||
    String(seo?.description ?? "").trim() ||
    "";

  const canonical = useMemo(() => {
    const fallbackPathname = slug ? `${BLOG_PATH}/${slug}` : BLOG_PATH;
    return buildCanonical({
      asPath: router.asPath,
      locale: localeShort, // ✅
      fallbackPathname,
      localizePath,
    });
  }, [router.asPath, localeShort, slug]);

  const seoSiteName = String(seo?.site_name ?? "").trim() || "Ensotek";
  const titleTemplate = String(seo?.title_template ?? "").trim() || "%s | Ensotek";

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = (page?.featured_image ?? "").trim();
    const pageImg = pageImgRaw ? (toCdnSrc(pageImgRaw, 1200, 630, "fill") || pageImgRaw) : "";

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";

    return (pageImg && absUrl(pageImg)) || fallback || absUrl("/favicon.ico");
  }, [page?.featured_image, seo]);

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
      <BlogDetailsArea />
      <Feedback />
    </>
  );
};

export default BlogDetailPage;
