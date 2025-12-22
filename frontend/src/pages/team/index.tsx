// =============================================================
// FILE: src/pages/team/index.tsx
// Ensotek – Team Page (full list) + SEO
//   - Route: /team
//   - Data: custom_pages (module_key="team") => meta override
// =============================================================

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import TeamPageContent from "@/components/containers/team/TeamPageContent";
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
import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery
} from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// helpers
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const TEAM_PATH = "/team";

const TeamPage: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_team", locale);

  // UI title (banner)
  const bannerTitle = ui(
    "ui_team_page_title",
    locale === "tr" ? "Ekibimiz" : "Our Team",
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

  // Team pages (meta override için ilk published kayıt)
  const { data: teamData } = useListCustomPagesPublicQuery({
    module_key: "team",
    locale,
    limit: 10,
    sort: "created_at",
    orderDir: "asc",
  });

  const published = useMemo(() => {
    const items: CustomPageDto[] = (teamData?.items ?? []) as any;
    return items.filter((p) => p.is_published);
  }, [teamData]);

  const primary = published[0];

  // --- SEO: Title/Description ---
  const titleFallback = ui("ui_team_page_title", "Team");

  const pageTitleRaw =
    (primary?.meta_title ?? "").trim() ||
    (primary?.title ?? "").trim() ||
    String(titleFallback).trim();

  // Google snippet: ~155-160
  const pageDescRaw =
    (primary?.meta_description ?? "").trim() ||
    (primary?.summary ?? "").trim() ||
    excerpt(primary?.content_html ?? "", 160).trim() ||
    String(seo?.description ?? "").trim() ||
    "";

  const canonical = useMemo(() => {
    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname: TEAM_PATH,
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
      <TeamPageContent />
      <ServiceCtaTwo />
    </>
  );
};

export default TeamPage;
