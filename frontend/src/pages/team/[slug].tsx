// =============================================================
// FILE: src/pages/team/[slug].tsx
// Ensotek – Team Member Detail Page + SEO (NEWS/PRODUCT pattern)
//   - Route: /team/[slug]
//   - i18n: useLocaleShort() + site_settings.ui_team
//   - Data: custom_pages/by-slug (module_key="team")
//   - SEO: seo -> site_seo fallback + page.meta_* override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import TeamDetail from '@/components/containers/team/TeamDetail';
import ServiceCtaTwo from '@/components/containers/cta/CatalogCta';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import {
  useGetSiteSettingByKeyQuery,
  useGetCustomPageBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q)) return String(q[0] ?? '');
  return '';
}

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const TeamDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_team', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug).trim(), [router.query.slug]);
  const isSlugReady = !!slug;

  // Banner fallbacks (UI)
  const listTitleFallback = ui('ui_team_page_title', 'Team');
  const detailTitleFallback = ui('ui_team_detail_page_title', 'Team Member');

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // Team member data
  const { data: page, isLoading: isPageLoading } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  // Banner title: page.title -> detail fallback -> list fallback
  const bannerTitle = useMemo(() => {
    return (
      safeStr(page?.title) || safeStr(detailTitleFallback) || safeStr(listTitleFallback) || 'Team'
    );
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // --- SEO fields ---
  const pageTitleRaw = useMemo(() => {
    const fallback =
      safeStr(page?.title) ||
      safeStr(detailTitleFallback) ||
      safeStr(listTitleFallback) ||
      'Team Member';

    if (!isSlugReady) return fallback;

    return safeStr(page?.meta_title) || safeStr(page?.title) || fallback;
  }, [isSlugReady, page?.meta_title, page?.title, detailTitleFallback, listTitleFallback]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = safeStr((seo as any)?.description) || '';

    if (!isSlugReady) return globalDesc;

    return (
      safeStr(page?.meta_description) ||
      safeStr(page?.summary) ||
      safeStr(excerpt((page as any)?.content_html ?? '', 160)) ||
      globalDesc ||
      ''
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSlugReady, page?.meta_description, page?.summary, page?.content_html, seo]);

  const seoSiteName = useMemo(() => safeStr((seo as any)?.site_name) || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => safeStr((seo as any)?.title_template) || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(t);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = safeStr((page as any)?.featured_image);
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [page, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof (robots as any).noindex === 'boolean' ? (robots as any).noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,

      twitterCard: safeStr((tw as any).card) || 'summary_large_image',
      twitterSite: typeof (tw as any).site === 'string' ? (tw as any).site.trim() : undefined,
      twitterCreator:
        typeof (tw as any).creator === 'string' ? (tw as any).creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

  const isLoadingState = !isSlugReady || (isPageLoading && !page);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {headSpecs.map((spec, idx) => {
          if (spec.kind === 'link') {
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          }
          if (spec.kind === 'meta-name') {
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          }
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}
      </Head>

      <Banner
        title={
          isLoadingState ? safeStr(detailTitleFallback) || safeStr(listTitleFallback) : bannerTitle
        }
      />

      {isLoadingState ? (
        <section className="team__area pt-120 pb-120">
          <div className="container">
            <div className="accordion-item" aria-hidden>
              <div className="accordion-body">
                <div className="skeleton-line" style={{ height: 32, marginBottom: 16 }} />
                <div
                  className="skeleton-line"
                  style={{ height: 20, width: '60%', marginBottom: 24 }}
                />
                <div className="skeleton-line" style={{ height: 16, marginBottom: 8 }} />
                <div
                  className="skeleton-line"
                  style={{ height: 16, width: '90%', marginBottom: 8 }}
                />
                <div className="skeleton-line" style={{ height: 16, width: '80%' }} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <TeamDetail slug={slug} />
      )}

      <ServiceCtaTwo />
    </>
  );
};

export default TeamDetailPage;
