// =============================================================
// FILE: src/pages/service/[slug].tsx
// Ensotek – Service Detail Page (by slug) + SEO (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /service/[slug]
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - Skeleton: common public Skeleton
//   - slug: readSlug(router.query.slug) + router.isReady
//   - DB meta precedence: meta_title/meta_description + featured_image_url/image_url/featured_image
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import ServiceDetail from '@/components/containers/service/ServiceDetail';
import ServiceMore from '@/components/containers/service/ServiceMore';
import CatalogCta from '@/components/containers/cta/CatalogCta';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import Skeleton from '@/components/common/public/Skeleton';

import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

import {
  useGetSiteSettingByKeyQuery,
  useGetServiceBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

function pickServiceImage(service: any): string {
  return (
    safeStr(service?.featured_image_url) ||
    safeStr(service?.image_url) ||
    safeStr(service?.featured_image) ||
    ''
  );
}

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_services', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // ✅ default_locale DB’den (locale bağımsız) — mevcut davranışı koruyoruz
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(() => {
    const v = safeStr(defaultLocaleRow?.value);
    return v || 'de';
  }, [defaultLocaleRow?.value]);

  // ✅ Service data (single source)
  const { data: service, isFetching } = useGetServiceBySlugPublicQuery(
    { slug, locale, default_locale: defaultLocale },
    { skip: !isSlugReady },
  );

  // UI fallbacks (validated)
  const listTitleFallback = useMemo(() => {
    const key = 'ui_services_page_title';
    const v = safeStr(ui(key, 'Services'));
    return isValidUiText(v, key) ? v : 'Services';
  }, [ui]);

  const detailTitleFallback = useMemo(() => {
    const key = 'ui_services_detail_page_title';
    const v = safeStr(ui(key, 'Service Detail'));
    return isValidUiText(v, key) ? v : 'Service Detail';
  }, [ui]);

  const bannerTitle = useMemo(() => {
    const t = safeStr((service as any)?.name ?? (service as any)?.title);
    if (t) return t;
    return detailTitleFallback || listTitleFallback;
  }, [service, detailTitleFallback, listTitleFallback]);

  // --- SEO override (DB meta first; UI fallback only) ---

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback;

    const mt = safeStr((service as any)?.meta_title);
    if (mt) return mt;

    const t = safeStr((service as any)?.name ?? (service as any)?.title);
    if (t) return t;

    return detailTitleFallback || listTitleFallback;
  }, [isSlugReady, service, detailTitleFallback, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr((service as any)?.meta_description);
    if (md) return md;

    const rawDesc =
      safeStr((service as any)?.description) ||
      safeStr((service as any)?.includes) ||
      safeStr((service as any)?.summary) ||
      '';

    if (rawDesc) {
      const ex = excerpt(rawDesc, 160).trim();
      if (ex) return ex;
    }

    // Optional UI fallback (new key preferred; old supported)
    const keyNew = 'ui_services_detail_meta_description_fallback';
    const keyOld = 'ui_services_detail_meta_description';

    const vNew = safeStr(
      ui(
        keyNew,
        'Explore the service details and contact us for tailored support and consultation.',
      ),
    );
    if (isValidUiText(vNew, keyNew)) return vNew;

    const vOld = safeStr(
      ui(
        keyOld,
        'Explore the service details and contact us for tailored support and consultation.',
      ),
    );
    if (isValidUiText(vOld, keyOld)) return vOld;

    return '';
  }, [isSlugReady, service, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw = pickServiceImage(service as any);
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, service]);

  const showSkeleton = !isSlugReady || isFetching || !service;

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      {showSkeleton ? (
        <Skeleton />
      ) : (
        <>
          <ServiceDetail slug={slug} />
          <ServiceMore currentSlug={slug} />
          <CatalogCta />
        </>
      )}
    </>
  );
};

export default ServiceDetailPage;
