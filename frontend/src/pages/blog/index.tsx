// =============================================================
// FILE: src/pages/blog/index.tsx
// Ensotek – Blog Page (full list) + SEO (News pattern)
//   - Route: /blog
//   - Data: custom_pages (module_key="blog") => meta override
//   - IMPORTANT: locale source = router.locale (hydration-safe)
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import BlogPageContent from "@/components/containers/blog/BlogPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useUiSection } from "@/i18n/uiDb";

// SEO
import { buildMeta } from "@/seo/meta";
import { asObj, absUrl, pickFirstImageFromSeo } from "@/seo/pageSeo";

// data
import { useGetSiteSettingByKeyQuery, useListCustomPagesPublicQuery } from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

function shortLocale(v: unknown): string {
  return String(v || "tr").trim().toLowerCase().replace("_", "-").split("-")[0] || "tr";
}

const BlogPage: React.FC = () => {
  const router = useRouter();

  // ✅ Hydration-safe: Next i18n kaynağı
  const locale = shortLocale(router.locale || router.defaultLocale || "tr");

  const { ui } = useUiSection("ui_blog", locale);

  const bannerTitle = ui("ui_blog_page_title", locale === "tr" ? "Blog" : "Blog");

  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: "seo", locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: "site_seo", locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  const { data: blogData } = useListCustomPagesPublicQuery({
    module_key: "blog",
    locale,
    limit: 10,
    sort: "created_at",
    orderDir: "asc",
  });

  const published = useMemo(() => {
    const items: CustomPageDto[] = (blogData?.items ?? []) as any;
    return items.filter((p) => !!p?.is_published);
  }, [blogData]);

  const primary = published[0];

  const pageTitleRaw =
    (primary?.meta_title ?? "").trim() ||
    (primary?.title ?? "").trim() ||
    String(bannerTitle).trim();

  const pageDescRaw =
    (primary?.meta_description ?? "").trim() ||
    (primary?.summary ?? "").trim() ||
    excerpt(primary?.content_html ?? "", 160).trim() ||
    String(seo?.description ?? "").trim() ||
    "";

  const seoSiteName = String(seo?.site_name ?? "").trim() || "Ensotek";
  const titleTemplate = String(seo?.title_template ?? "").trim() || "%s | Ensotek";

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes("%s") ? titleTemplate.replace("%s", pageTitleRaw) : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = (primary?.featured_image ?? "").trim();
    const pageImg = pageImgRaw ? (toCdnSrc(pageImgRaw, 1200, 630, "fill") || pageImgRaw) : "";

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";

    return (pageImg && absUrl(pageImg)) || fallback || absUrl("/favicon.ico");
  }, [primary?.featured_image, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
    const noindex = typeof (robots as any).noindex === "boolean" ? (robots as any).noindex : false;

    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: String((tw as any).card ?? "").trim() || "summary_large_image",
      twitterSite: typeof (tw as any).site === "string" ? (tw as any).site.trim() : undefined,
      twitterCreator: typeof (tw as any).creator === "string" ? (tw as any).creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

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
      <BlogPageContent />
      <Feedback />
    </>
  );
};

export default BlogPage;
