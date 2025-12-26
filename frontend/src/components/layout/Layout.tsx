// src/components/layout/Layout.tsx
'use client';

import React, { Fragment, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { StaticImageData } from 'next/image';

import Header from './header/Header';
import Footer from './footer/Footer';
import ScrollProgress from './ScrollProgress';

import { useResolvedLocale } from '@/i18n/locale';
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

import { asObj, buildCanonical } from '@/seo/pageSeo';

import { siteUrlBase, absoluteUrl } from '@/features/seo/utils';

import { buildMeta, filterClientHeadSpecs, type MetaInput } from '@/seo/meta';
import { useUiSection } from '@/i18n/uiDb';

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

  // ✅ keywords intentionally removed from head (Google ignores; keep DB-side only if you want)
  // keywords?: string;

  brand?: SimpleBrand;
  logoSrc?: StaticImageData | string;
  noindex?: boolean;
  ogImage?: string;
};

const toLocaleShort = (l: any) => {
  const v = String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  return v.split('-')[0] || 'de';
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

function defaultDescriptionForLocale(locale: string): string {
  if (locale === 'de') {
    return 'Ensotek ürünleri, hizmetleri ve endüstriyel çözümleri. Teklif ve danışmanlık için iletişime geçin.';
  }
  return 'Ensotek products, services and industrial solutions. Contact us for tailored support and consultation.';
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

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  // ✅ UI errors (for 500 fallback etc.)
  const { ui: uiErrors } = useUiSection('ui_errors', locale);

  // ✅ SEO settings: DB-driven (admin panel)
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

  const seoTitleDefault = String(seo?.title_default ?? '').trim();
  const seoDescription = String(seo?.description ?? '').trim();
  const seoSiteName = String(seo?.site_name ?? '').trim();

  const og = asObj(seo?.open_graph) || {};
  const ogImage1 =
    typeof ogImage === 'string' && ogImage.trim()
      ? ogImage.trim()
      : typeof (og as any)?.image === 'string' && String((og as any).image).trim()
      ? String((og as any).image).trim()
      : Array.isArray((og as any)?.images) && (og as any).images[0]
      ? String((og as any).images[0]).trim()
      : '';

  const tw = asObj(seo?.twitter) || {};
  const twitterCard = String((tw as any)?.card ?? '').trim() || 'summary_large_image';
  const twitterSite = typeof (tw as any)?.site === 'string' ? String((tw as any).site).trim() : '';
  const twitterCreator =
    typeof (tw as any)?.creator === 'string' ? String((tw as any).creator).trim() : '';

  const finalTitle = (title && title.trim()) || seoTitleDefault || 'Ensotek';
  const finalDescriptionRaw = (description && description.trim()) || seoDescription || '';
  const safeDescription = finalDescriptionRaw || defaultDescriptionForLocale(locale);

  // og:url için absolute path (client). SSR’de _document og:url basıyor; buildMeta bunu zaten filter’layacak.
  const ogUrlAbs = useMemo(() => {
    const raw = String(router.asPath || '/');
    const [noHash] = raw.split('#');
    const [noQuery] = noHash.split('?');
    const path = noQuery || '/';
    return absoluteUrl(path);
  }, [router.asPath]);

  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery(
    { key: 'contact_info', locale },
    { skip: !isClient },
  );
  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery(
    { key: 'company_brand', locale },
    { skip: !isClient },
  );

  const { normalizedBrand, logoHrefFromSettings } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;

    const name = (brandVal.name as string) || (contact.companyName as string) || 'Ensotek';
    const website = (brandVal.website as string) || (contact.website as string) || siteUrlBase();

    const phones = Array.isArray(contact.phones) ? contact.phones : [];
    const phoneVal =
      (brandVal.phone as string | undefined) ||
      (phones[0] as string | undefined) ||
      (contact.whatsappNumber as string | undefined) ||
      '';

    const emailVal =
      (brandVal.email as string | undefined) || (contact.email as string | undefined) || '';

    const socials: Record<string, string> = { ...(brandVal.socials as any) };

    const logoObj = (brandVal.logo ||
      (Array.isArray(brandVal.images) ? brandVal.images[0] : null) ||
      {}) as { url?: string };

    const logoHref =
      (logoObj.url && String(logoObj.url).trim()) ||
      'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

    return {
      normalizedBrand: {
        name: String(name || '').trim() || 'Ensotek',
        website: String(website || '').trim(),
        phone: String(phoneVal || '').trim(),
        email: String(emailVal || '').trim(),
        socials,
      } as SimpleBrand,
      logoHrefFromSettings: String(logoHref || '').trim(),
    };
  }, [contactInfoSetting?.value, companyBrandSetting?.value]);

  const effectiveBrand: SimpleBrand = brand ?? normalizedBrand;

  const headerLogoSrc: StaticImageData | string | undefined =
    logoSrc || logoHrefFromSettings || undefined;
  const preloadLogoHref = typeof headerLogoSrc === 'string' ? headerLogoSrc : logoHrefFromSettings;

  // ✅ Meta builder (client). Canonical + og:url SSR’den geliyor, burada filtreleniyor.
  const headMetaSpecs = useMemo(() => {
    const meta: MetaInput = {
      title: finalTitle,
      description: safeDescription,
      url: ogUrlAbs, // filterClientHeadSpecs og:url’yi kaldırır
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

  // ✅ i18n error fallback (500-like)
  const errorFallback = useMemo(() => {
    const titleText = uiErrors(
      'ui_500_title',
      locale === 'de'
        ? 'Bir Hata Oluştu'
        : locale === 'de'
        ? 'Ein Fehler ist aufgetreten'
        : 'Something Went Wrong',
    );

    const subtitleText = uiErrors(
      'ui_500_subtitle',
      locale === 'de'
        ? 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        : locale === 'de'
        ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
        : 'An unexpected error occurred. Please try again later.',
    );

    const tryAgainText = uiErrors(
      'ui_500_try_again',
      locale === 'de' ? 'Tekrar Dene' : locale === 'de' ? 'Erneut versuchen' : 'Try Again',
    );

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
  }, [uiErrors, locale]);

  // ✅ Debug canonical: prod’da basma (canonical SSR tek kaynak)
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
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>{finalTitle}</title>

        {/* ✅ Canonical + og:url + hreflang SSR tek kaynak: _document */}

        {headMetaSpecs.map((spec, idx) => {
          if (spec.kind === 'link')
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          if (spec.kind === 'meta-name')
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}

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
