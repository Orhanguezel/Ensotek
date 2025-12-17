// =============================================================
// FILE: src/pages/team/[slug].tsx
// Ensotek – Team Member Detail Page + SEO
//   - Route: /team/[slug]
//   - Data: custom_pages/by-slug (module_key="team" içerikleri)
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import TeamDetail from "@/components/containers/team/TeamDetail";
import ServiceCtaTwo from "@/components/containers/cta/CatalogCta";

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

const TeamDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_team", locale);

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

  // Team member data
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !slug },
  );

  // Banner title:
  const localeFallback = ui(
    "ui_team_page_title",
    locale === "tr" ? "Ekibimiz" : "Our Team",
  );

  const fallbackTitle = ui(
    "ui_team_detail_page_title",
    locale === "tr" ? "Ekip Üyesi" : "Team Member",
  );

  const bannerTitle = (page?.title || "").trim() || fallbackTitle || localeFallback;

  // --- SEO fields ---
  const titleFallback = bannerTitle || "Team Member";

  const pageTitleRaw =
    (page?.meta_title ?? "").trim() ||
    (page?.title ?? "").trim() ||
    String(titleFallback).trim();

  const pageDescRaw =
    (page?.meta_description ?? "").trim() ||
    (page?.summary ?? "").trim() ||
    excerpt(page?.content_html ?? "", 160).trim() ||
    String(seo?.description ?? "").trim() ||
    "";

  const canonical = useMemo(() => {
    // slug yokken canonical üretme; slug gelince garanti path ver.
    const fallbackPathname = slug ? `${TEAM_PATH}/${slug}` : TEAM_PATH;
    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname,
      localizePath,
    });
  }, [router.asPath, locale, slug]);

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
    const pageImg = pageImgRaw
      ? (toCdnSrc(pageImgRaw, 1200, 630, "fill") || pageImgRaw)
      : "";

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

      twitterCard: (String(tw.card ?? "").trim() || "summary_large_image"),
      twitterSite: typeof tw.site === "string" ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === "string" ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, canonical, ogImage, seoSiteName]);

  // slug henüz yoksa skeleton
  if (!slug) {
    return (
      <>
        <Banner title={fallbackTitle || localeFallback} />
        <section className="team__area pt-120 pb-120">
          <div className="container">
            <div className="accordion-item" aria-hidden>
              <div className="accordion-body">
                <div className="skeleton-line" style={{ height: 32, marginBottom: 16 }} />
                <div className="skeleton-line" style={{ height: 20, width: "60%", marginBottom: 24 }} />
                <div className="skeleton-line" style={{ height: 16, marginBottom: 8 }} />
                <div className="skeleton-line" style={{ height: 16, width: "90%", marginBottom: 8 }} />
                <div className="skeleton-line" style={{ height: 16, width: "80%" }} />
              </div>
            </div>
          </div>
        </section>
        <ServiceCtaTwo />
      </>
    );
  }

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
      <TeamDetail slug={slug} />
      <ServiceCtaTwo />
    </>
  );
};

export default TeamDetailPage;

// local constant at bottom to avoid hoist noise
const TEAM_PATH = "/team";
