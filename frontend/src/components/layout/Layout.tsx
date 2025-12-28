// src/components/layout/Layout.tsx
'use client';

import React, { Fragment, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { StaticImageData } from 'next/image';

import Header from './header/Header';
import Footer from './footer/Footer';
import ScrollProgress from './ScrollProgress';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

import { asObj, buildCanonical } from '@/seo/pageSeo';
import { siteUrlBase, absoluteUrl } from '@/features/seo/utils';

import { buildMeta, filterClientHeadSpecs, type MetaInput } from '@/seo/meta';

// ✅ i18n PATTERN
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { FALLBACK_LOCALE } from '@/i18n/config';

// ✅ JSON-LD
import JsonLd from '@/seo/JsonLd';
import { graph, org, website, sameAsFromSocials } from '@/seo/jsonld';

type SimpleBrand = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: Record<string, string>;
};

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;

  brand?: SimpleBrand;
  logoSrc?: StaticImageData | string;
  noindex?: boolean;
  ogImage?: string;
};

function absUrlForPreload(pathOrUrl: string): string {
  const base = siteUrlBase();
  const v = String(pathOrUrl || '').trim();
  if (!v) return base;
  if (/^https?:\/\//i.test(v)) return v;
  return `${base}${v.startsWith('/') ? v : `/${v}`}`;
}

function toAbsoluteMaybe(u: string): string {
  const v = String(u || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return absoluteUrl(v);
}

function cleanString(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function cleanSocials(input: Record<string, any> | null | undefined): Record<string, string> {
  const obj = input && typeof input === 'object' ? input : {};
  const out: Record<string, string> = {};

  for (const k of Object.keys(obj)) {
    const v = cleanString((obj as any)[k]);
    if (!v) continue;
    out[k] = v;
  }

  return out;
}

/**
 * ✅ Tek fallback kuralı:
 * - Locale boşsa FALLBACK_LOCALE kullan
 * - Locale normalize etmiyoruz (DB already returns correct short codes)
 */
function getSafeLocale(lc: unknown): string {
  const v = cleanString(lc);
  const fb = cleanString(FALLBACK_LOCALE) || 'de';
  return v || fb;
}

class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: any) {
    // eslint-disable-next-line no-console
    console.error('[LayoutErrorBoundary] child render error:', err);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="container" style={{ padding: 24 }}>
            <h1 style={{ marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ margin: 0 }}>
              The page content failed to render. Please refresh or try again later.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default function Layout({
  children,
  title,
  description,
  brand,
  logoSrc,
  noindex,
  ogImage,
}: LayoutProps) {
  const router = useRouter();
  const isClient = typeof window !== 'undefined';
  const isProd = process.env.NODE_ENV === 'production';

  // ✅ Locale: DB-driven (scalable to 30+)
  const locale = getSafeLocale(useLocaleShort());

  /**
   * ✅ Layout için tek ortak UI section:
   * - ui_common altında 500, try again vb. her şeyi topla.
   * - 30 dilde ölçeklenir; locale bazlı DB fallback zaten senin sistemde var.
   */
  const { ui: uiCommon } = useUiSection('ui_common', locale as any);
  const t = useCallback((key: string, fb: string) => uiCommon(key, fb), [uiCommon]);

  // ✅ SEO settings: DB-driven
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery(
    { key: 'seo', locale },
    { skip: !isClient },
  );
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery(
    { key: 'site_seo', locale },
    { skip: !isClient },
  );

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  const seoTitleDefault = cleanString(seo?.title_default);
  const seoDescription = cleanString(seo?.description);
  const seoSiteName = cleanString(seo?.site_name);

  const og = asObj(seo?.open_graph) ;
  const ogImage1 = useMemo(() => {
    const direct = cleanString(ogImage);
    if (direct) return direct;

    const single = cleanString((og as any)?.image);
    if (single) return single;

    const arr = Array.isArray((og as any)?.images) ? (og as any).images : [];
    const first = arr?.[0] ? cleanString(arr[0]) : '';
    return first;
  }, [ogImage, og]);

  const tw = asObj(seo?.twitter) || {};
  const twitterCard = cleanString((tw as any)?.card) || 'summary_large_image';
  const twitterSite = cleanString((tw as any)?.site);
  const twitterCreator = cleanString((tw as any)?.creator);

  const finalTitle = cleanString(title) || seoTitleDefault || t('meta_default_title', 'Ensotek');

  // ✅ Description: prop > seo.description > ui_common.meta_default_description > generic fallback
  const uiDefaultDesc = t(
    'meta_default_description',
    'Industrial solutions, products and services. Contact us for tailored support and consultation.',
  );
  const safeDescription = cleanString(description) || seoDescription || cleanString(uiDefaultDesc);

  // ✅ og:url (client absolute)
  const ogUrlAbs = useMemo(() => {
    const raw = String(router.asPath || '/');
    const [noHash] = raw.split('#');
    const [noQuery] = noHash.split('?');
    const path = noQuery || '/';
    return absoluteUrl(path);
  }, [router.asPath]);

  // ✅ Brand/Contact Settings
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery(
    { key: 'contact_info', locale },
    { skip: !isClient },
  );
  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery(
    { key: 'company_brand', locale },
    { skip: !isClient },
  );

  // ✅ Socials setting
  const { data: socialsSetting } = useGetSiteSettingByKeyQuery(
    { key: 'socials', locale },
    { skip: !isClient },
  );

  const { normalizedBrand, logoHrefFromSettings } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;
    const socialsVal = (socialsSetting?.value ?? {}) as any;

    const name = cleanString(brandVal.name) || cleanString(contact.companyName) || 'Ensotek';
    const website = cleanString(brandVal.website) || cleanString(contact.website) || siteUrlBase();

    const phones = Array.isArray(contact.phones) ? contact.phones : [];
    const phoneVal =
      cleanString(brandVal.phone) ||
      cleanString(phones?.[0]) ||
      cleanString(contact.whatsappNumber) ||
      '';

    const emailVal = cleanString(brandVal.email) || cleanString(contact.email) || '';

    // ✅ Merge socials: site_settings.socials (primary) + company_brand.socials (secondary)
    const merged = {
      ...cleanSocials(asObj(socialsVal) as any),
      ...cleanSocials(asObj(brandVal.socials) as any),
    };

    const logoObj = (brandVal.logo ||
      (Array.isArray(brandVal.images) ? brandVal.images[0] : null) ||
      {}) as { url?: string };

    const logoHref =
      cleanString(logoObj.url) ||
      'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

    return {
      normalizedBrand: {
        name,
        website,
        phone: phoneVal,
        email: emailVal,
        socials: merged,
      } as SimpleBrand,
      logoHrefFromSettings: logoHref,
    };
  }, [contactInfoSetting?.value, companyBrandSetting?.value, socialsSetting?.value]);

  // ✅ prop override (highest priority)
  const effectiveBrand: SimpleBrand = useMemo(() => {
    if (!brand) return normalizedBrand;

    const mergedSocials = {
      ...(normalizedBrand.socials || {}),
      ...cleanSocials(brand.socials || {}),
    };

    return {
      ...normalizedBrand,
      ...brand,
      socials: mergedSocials,
    };
  }, [brand, normalizedBrand]);

  const headerLogoSrc: StaticImageData | string | undefined =
    logoSrc || logoHrefFromSettings || undefined;

  const preloadLogoHref = typeof headerLogoSrc === 'string' ? headerLogoSrc : logoHrefFromSettings;

  // ✅ Head Meta specs
  const headMetaSpecs = useMemo(() => {
    const meta: MetaInput = {
      title: finalTitle,
      description: safeDescription,
      url: ogUrlAbs, // client filter will remove og:url if needed
      image: ogImage1 ? toAbsoluteMaybe(ogImage1) : undefined,
      siteName: seoSiteName || effectiveBrand.name || 'Ensotek',
      noindex: !!noindex,
      twitterCard,
      twitterSite: twitterSite || undefined,
      twitterCreator: twitterCreator || undefined,
    };

    return filterClientHeadSpecs(buildMeta(meta));
  }, [
    finalTitle,
    safeDescription,
    ogUrlAbs,
    ogImage1,
    seoSiteName,
    effectiveBrand.name,
    noindex,
    twitterCard,
    twitterSite,
    twitterCreator,
  ]);

  // ✅ JSON-LD graph: Organization.sameAs for Social Media Presence
  const jsonLdData = useMemo(() => {
    const base = siteUrlBase();
    const orgId = `${base}#org`;
    const websiteId = `${base}#website`;

    const sameAs = sameAsFromSocials(effectiveBrand.socials || null);

    return graph([
      org({
        id: orgId,
        name: effectiveBrand.name || 'Ensotek',
        url: cleanString(effectiveBrand.website) || base,
        logo: logoHrefFromSettings || undefined,
        sameAs,
      }),
      website({
        id: websiteId,
        name: effectiveBrand.name || 'Ensotek',
        url: base,
        publisherId: orgId,
      }),
    ]);
  }, [effectiveBrand.name, effectiveBrand.website, effectiveBrand.socials, logoHrefFromSettings]);

  // ✅ Error fallback UI (ui_common)
  const errorFallback = useMemo(() => {
    const titleText = t('ui_500_title', 'Something Went Wrong');
    const subtitleText = t(
      'ui_500_subtitle',
      'An unexpected error occurred. Please try again later.',
    );
    const tryAgainText = t('ui_500_try_again', 'Try Again');

    return (
      <div className="container" style={{ padding: 24 }}>
        <h1 style={{ marginBottom: 8 }}>{titleText}</h1>
        <p style={{ margin: 0, marginBottom: 16 }}>{subtitleText}</p>
        <button
          type="button"
          className="solid__btn d-inline-flex align-items-center"
          onClick={() => window.location.reload()}
        >
          {tryAgainText}
        </button>
      </div>
    );
  }, [t]);

  // ✅ Debug canonical (dev only)
  const debugCanonicalAbs = useMemo(() => {
    if (isProd) return '';

    const lcHint =
      typeof router.query?.__lc === 'string'
        ? router.query.__lc
        : Array.isArray(router.query?.__lc)
        ? router.query.__lc[0]
        : '';

    return buildCanonical({
      asPath: router.asPath,
      locale,
      fallbackPathname: '/',
      lcHint,
    });
  }, [isProd, router.asPath, router.query?.__lc, locale]);

  return (
    <Fragment>
      <Head>
        <meta name="app:layout" content="public" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
        <title>{finalTitle}</title>

        {/* ✅ Canonical + og:url + hreflang SSR tek kaynak: _document */}

        {headMetaSpecs.map((spec, idx) => {
          if (spec.kind === 'link') {
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          }
          if (spec.kind === 'meta-name') {
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          }
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}

        {/* ✅ Social Media Presence => Organization.sameAs */}
        <JsonLd id="global" data={jsonLdData} />

        {preloadLogoHref ? (
          <link rel="preload" as="image" href={absUrlForPreload(preloadLogoHref)} />
        ) : null}

        {!isProd && debugCanonicalAbs ? (
          <meta name="debug:canonicalAbs" content={debugCanonicalAbs} />
        ) : null}
      </Head>

      <div className="my-app">
        <Header brand={effectiveBrand} logoSrc={headerLogoSrc} />
        <main>
          <LayoutErrorBoundary fallback={errorFallback}>{children}</LayoutErrorBoundary>
        </main>
        <Footer />
        <ScrollProgress />
      </div>
    </Fragment>
  );
}
