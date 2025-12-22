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
import { buildCanonical, asObj } from '@/seo/pageSeo';

// runtime base url helpers (logo preload vs için kalsın)
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

// sadece preload vb için
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
  // absoluteUrl util’in relative’i base ile birleştirdiğini varsayıyoruz
  return absoluteUrl(v);
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

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  // 1) SEO kaydı (DB) — seo -> site_seo fallback
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // 2) Varsayılan meta alanları (DB’den)
  const seoTitleDefault = String(seo?.title_default ?? '').trim();
  const seoDescription = String(seo?.description ?? '').trim();
  const seoSiteName = String(seo?.site_name ?? '').trim();

  const og = asObj(seo?.open_graph) || {};

  const ogImage1 =
    typeof ogImage === 'string' && ogImage.trim()
      ? ogImage.trim()
      : typeof og?.image === 'string' && String(og.image).trim()
      ? String(og.image).trim()
      : Array.isArray((og as any)?.images) && (og as any).images[0]
      ? String((og as any).images[0]).trim()
      : '';

  const tw = asObj(seo?.twitter) || {};
  const twitterCard = String(tw?.card ?? '').trim() || 'summary_large_image';
  const twitterSite = typeof tw?.site === 'string' ? String(tw.site).trim() : '';
  const twitterCreator = typeof tw?.creator === 'string' ? String(tw.creator).trim() : '';

  // 3) Sayfa override > DB fallback
  const finalTitle = (title && title.trim()) || seoTitleDefault || 'Ensotek';
  const finalDescription = (description && description.trim()) || seoDescription || '';
  const finalKeywords = (keywords && keywords.trim()) || String(seo?.keywords ?? '').trim() || '';

  // ✅ 4) Canonical (locale-aware, page standard ile aynı)
  const canonical = useMemo(() => {
    return buildCanonical({
      asPath: router.asPath || '/',
      locale,
      fallbackPathname: '/',
      localizePath,
    });
  }, [router.asPath, locale]);

  // 5) Brand + logo (Header için)
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({ key: 'contact_info', locale });
  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({
    key: 'company_brand',
    locale,
  });

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

  // 6) Head tag’lerini seo/meta.ts ile üret
  const headMetaSpecs = useMemo(() => {
    const meta: MetaInput = {
      title: finalTitle,
      description: finalDescription,
      canonical, // ✅ og:url canonical’dan türeyecek (meta.ts)
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
    finalDescription,
    canonical,
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
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>{finalTitle}</title>

        {finalKeywords ? <meta name="keywords" content={finalKeywords} /> : null}

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
      </Head>

      <div className="my-app">
        <Header brand={effectiveBrand} logoSrc={headerLogoSrc} />
        <main>{children}</main>
        <Footer />
        <ScrollProgress />
      </div>
    </Fragment>
  );
}
