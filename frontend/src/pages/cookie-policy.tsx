// =============================================================
// FILE: src/pages/cookie-policy.tsx
// Ensotek – Cookie Policy Page + SEO
//   - Route: /cookie-policy
//   - Data: custom_pages (module_key="cookies") meta override
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// Fixes:
// - correct module_key and UI keys
// - meta sources: UI -> custom_page -> seo fallback
// - render content component
// - content_html/content(JSON) compatibility for excerpt
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import CookiePolicyPageContent from '@/components/containers/legal/CookiePolicyPageContent';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

function safeJson<T>(v: any, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === 'object') return v as T;
  if (typeof v !== 'string') return fallback;
  const s = v.trim();
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function extractHtmlFromAny(page: any): string {
  if (!page) return '';
  const ch = String(page?.content_html ?? '').trim();
  if (ch) return ch;

  const c = page?.content ?? page?.content_json ?? page?.contentJson;
  if (!c) return '';

  if (typeof c === 'object') {
    const html = (c as any)?.html;
    return typeof html === 'string' ? html.trim() : '';
  }

  if (typeof c === 'string') {
    const s = c.trim();
    if (!s) return '';
    if (s.startsWith('{') || s.startsWith('[')) {
      const obj = safeJson<any>(s, null);
      const html = obj?.html;
      if (typeof html === 'string' && html.trim()) return html.trim();
    }
    return s;
  }

  return '';
}

const CookiePolicyPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_cookie_policy', locale as any);

  // -----------------------------
  // UI (Banner Title)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_cookie_policy_page_title';
    const v = String(ui(key, '') || '').trim();
    return isValidUiText(v, key) ? v : 'Cookie Policy';
  }, [ui]);

  // -----------------------------
  // Global SEO settings (seo -> site_seo fallback)
  // -----------------------------
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // -----------------------------
  // Cookies custom page (meta override için: ilk published)
  // -----------------------------
  const { data: cookiesData } = useListCustomPagesPublicQuery({
    module_key: 'cookies',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo<CustomPageDto | null>(() => {
    const items: CustomPageDto[] = ((cookiesData as any)?.items ?? []) as any;
    const published = items.filter((p) => !!p?.is_published);
    return published[0] ?? null;
  }, [cookiesData]);

  // -----------------------------
  // SEO: title/description sources (UI -> custom_page -> seo)
  // -----------------------------
  const pageTitleRaw = useMemo(() => {
    const key = 'ui_cookie_policy_meta_title';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = String((primary as any)?.meta_title ?? '').trim();
    if (fromPageMeta) return fromPageMeta;

    const fromPageTitle = String((primary as any)?.title ?? '').trim();
    if (fromPageTitle) return fromPageTitle;

    return 'Cookie Policy | Ensotek';
  }, [ui, primary]);

  const pageDescRaw = useMemo(() => {
    const key = 'ui_cookie_policy_meta_description';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = String((primary as any)?.meta_description ?? '').trim();
    if (fromPageMeta) return fromPageMeta;

    const fromSummary = String((primary as any)?.summary ?? '').trim();
    if (fromSummary) return fromSummary;

    const html = extractHtmlFromAny(primary);
    const fromExcerpt = excerpt(html, 160).trim();
    if (fromExcerpt) return fromExcerpt;

    const fromUiDesc = String(ui('ui_cookie_policy_page_description', '') || '').trim();
    if (fromUiDesc && isValidUiText(fromUiDesc, 'ui_cookie_policy_page_description'))
      return fromUiDesc;

    const fromSeo = String((seo as any)?.description ?? '').trim();
    if (fromSeo) return fromSeo;

    return 'Ensotek cookie policy: cookie categories, purposes, and preference management.';
  }, [ui, primary, seo]);

  const seoSiteName = useMemo(
    () => String((seo as any)?.site_name ?? '').trim() || 'Ensotek',
    [seo],
  );

  const titleTemplate = useMemo(
    () => String((seo as any)?.title_template ?? '').trim() || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = String((primary as any)?.featured_image ?? '').trim();
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [primary, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof robots.noindex === 'boolean' ? robots.noindex : false;

    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: String(tw.card ?? '').trim() || 'summary_large_image',
      twitterSite: typeof tw.site === 'string' ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === 'string' ? tw.creator.trim() : undefined,
      // canonical + og:url yok (SSR _document)
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

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

      <Banner title={bannerTitle} />
      <CookiePolicyPageContent />
    </>
  );
};

export default CookiePolicyPage;
