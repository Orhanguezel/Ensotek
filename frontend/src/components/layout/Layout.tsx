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
import { localizePath } from '@/i18n/url';
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

import { buildMeta, type MetaInput } from '@/seo/meta';
import { asObj, absUrl } from '@/seo/pageSeo'; // ✅ absUrl ekle

import { HreflangLinks } from '@/seo/HreflangLinks';
import { siteUrlBase, absoluteUrl } from '@/features/seo/utils';

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
  keywords?: string;
  brand?: SimpleBrand;
  logoSrc?: StaticImageData | string;
  noindex?: boolean;
  ogImage?: string;
};

const toLocaleShort = (l: any) => {
  const v = String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  return v.split('-')[0] || 'tr';
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
  if (locale === 'tr') {
    return 'Ensotek ürünleri, hizmetleri ve endüstriyel çözümleri. Teklif ve danışmanlık için iletişime geçin.';
  }
  return 'Ensotek products, services and industrial solutions. Contact us for tailored support and consultation.';
}

function stripQueryHash(asPath: string): string {
  const s = String(asPath || '/');
  return (s.split('#')[0].split('?')[0] || '/').trim() || '/';
}

/** Head içinde kullanılacak: throw etmez, en kötü null döner */
class HeadSafeBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    // eslint-disable-next-line no-console
    console.error('[HeadSafeBoundary] error:', err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
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
  keywords,
  brand,
  logoSrc,
  noindex,
  ogImage,
}: LayoutProps) {
  const router = useRouter();
  const isClient = typeof window !== 'undefined';

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

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

  const finalKeywords = (keywords && keywords.trim()) || String(seo?.keywords ?? '').trim() || '';

  // ✅ canonical PATH + ABS
  const canonicalPath = useMemo(() => {
    try {
      const raw = stripQueryHash(router.asPath || '/');
      return localizePath(locale, raw);
    } catch {
      return localizePath(locale, '/');
    }
  }, [router.asPath, locale]);

  const canonicalAbs = useMemo(() => absUrl(canonicalPath), [canonicalPath]);

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

  const headMetaSpecs = useMemo(() => {
    const meta: MetaInput = {
      title: finalTitle,
      description: safeDescription,
      canonical: canonicalAbs, // ✅ ABS
      image: ogImage1 ? toAbsoluteMaybe(ogImage1) : undefined,
      siteName: seoSiteName || effectiveBrand.name || 'Ensotek',
      noindex: !!noindex,
      twitterCard,
      twitterSite: twitterSite || undefined,
      twitterCreator: twitterCreator || undefined,
    };

    return buildMeta(meta);
  }, [
    finalTitle,
    safeDescription,
    canonicalAbs,
    ogImage1,
    seoSiteName,
    effectiveBrand.name,
    noindex,
    twitterCard,
    twitterSite,
    twitterCreator,
  ]);

  return (
    <Fragment>
      <Head>
        {/* ✅ MARKER: test bununla Layout render oldu mu anlayacak */}
        <meta name="app:layout" content="public" />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>{finalTitle}</title>

        {/* ✅ GUARANTEE canonical/description */}
        <link rel="canonical" href={canonicalAbs} />
        <meta name="description" content={safeDescription} />

        {finalKeywords ? <meta name="keywords" content={finalKeywords} /> : null}

        {headMetaSpecs.map((spec, idx) => {
          if (spec.kind === 'link')
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          if (spec.kind === 'meta-name')
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}

        <HeadSafeBoundary>
          <HreflangLinks />
        </HeadSafeBoundary>

        {preloadLogoHref ? (
          <link rel="preload" as="image" href={absUrlForPreload(preloadLogoHref)} />
        ) : null}
      </Head>

      <div className="my-app">
        <Header brand={effectiveBrand} logoSrc={headerLogoSrc} />
        <main>
          <LayoutErrorBoundary>{children}</LayoutErrorBoundary>
        </main>
        <Footer />
        <ScrollProgress />
      </div>
    </Fragment>
  );
}
