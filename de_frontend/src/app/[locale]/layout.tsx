import React from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AVAILABLE_LOCALES, getLocaleMessages } from "../../i18n/locales";
import { getRuntimeLocaleSettings } from "../../i18n/locale-settings";
import { fetchSetting } from "../../i18n/server";
import JsonLd from '@/seo/JsonLd';
import { graph, org, website } from '@/seo/jsonld';

import { WhatsAppFloating } from '@/components/widgets/WhatsAppFloating';
import { AosProvider } from '@/providers/AosProvider';
import { AppProviders } from '@/providers/AppProviders';
import { FontAwesomeLoader } from '@/components/FontAwesomeLoader';
import StackableWidgetsLoader from '@/components/StackableWidgetsLoader';

// Global Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/index-four.scss";
import "@/styles/main.scss";

/* ------------------------------------------------------------------ */
/*  Dynamic metadata — fetched from site_settings at request time      */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const [seoRow, faviconRow] = await Promise.all([
    fetchSetting('seo', locale, { revalidate: 300 }),
    fetchSetting('site_favicon', locale, { revalidate: 300 }),
  ]);

  const seo = seoRow?.value as Record<string, any> | null;
  const faviconUrl =
    (faviconRow?.value as Record<string, any> | null)?.url ?? '/favicon.ico';

  const title: string = seo?.title_default ?? 'Ensotek';
  const description: string = seo?.description ?? '';
  const siteName: string = seo?.site_name ?? 'Ensotek';
  const titleTemplate: string = seo?.title_template ?? '%s – Ensotek';

  const ogImages: string[] = Array.isArray(seo?.open_graph?.images)
    ? seo.open_graph.images.filter(
        (u: unknown): u is string => typeof u === 'string',
      )
    : [];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://ensotek.de';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: titleTemplate,
    },
    description,
    authors: [{ name: siteName }],
    publisher: siteName,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        AVAILABLE_LOCALES.map((l) => [l, `${siteUrl}/${l}`]),
      ),
    },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName,
      title,
      description,
      images: ogImages,
      locale,
    },
    ...(seo?.facebook?.app_id
      ? { other: { 'fb:app_id': String(seo.facebook.app_id) } }
      : {}),
    twitter: {
      card: (seo?.twitter?.card as any) ?? 'summary_large_image',
      site: seo?.twitter?.site ?? undefined,
      creator: seo?.twitter?.creator ?? undefined,
      title,
      description,
      images: ogImages,
    },
    robots:
      seo?.robots != null
        ? {
            index: seo.robots.index !== false,
            follow: seo.robots.follow !== false,
          }
        : { index: true, follow: true },
    icons: {
      icon: faviconUrl,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Static params for build-time generation                            */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return AVAILABLE_LOCALES.map((locale) => ({ locale }));
}

/* ------------------------------------------------------------------ */
/*  Viewport — viewport-fit=cover for iPhone Dynamic Island support    */
/* ------------------------------------------------------------------ */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/* ------------------------------------------------------------------ */
/*  Layout                                                              */
/* ------------------------------------------------------------------ */

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { activeLocales } = await getRuntimeLocaleSettings();
  if (!activeLocales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = getLocaleMessages(locale);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://ensotek.de';

  const [seoRow, socialsRow, logoRow, contactRow] = await Promise.all([
    fetchSetting('seo', locale, { revalidate: 300 }),
    fetchSetting('socials', locale, { revalidate: 3600 }),
    fetchSetting('site_logo', locale, { revalidate: 3600 }),
    fetchSetting('contact_info', locale, { revalidate: 3600 }),
  ]);

  const seo = seoRow?.value as Record<string, any> | null;
  const socials = socialsRow?.value as Record<string, unknown> | null;
  const logoUrl = (logoRow?.value as Record<string, any> | null)?.url;
  const contactInfo = contactRow?.value as Record<string, any> | null;
  const siteName: string = seo?.site_name ?? 'Ensotek';

  const sameAs: string[] = [];
  if (socials) {
    for (const v of Object.values(socials)) {
      if (typeof v === 'string' && /^https?:\/\//i.test(v.trim())) sameAs.push(v.trim());
    }
  }

  const jsonLdData = graph([
    org({
      id: `${siteUrl}/#org`,
      name: siteName,
      url: siteUrl,
      logo: typeof logoUrl === 'string' ? logoUrl : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
    }),
    website({
      id: `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      publisherId: `${siteUrl}/#org`,
    }),
  ]);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://cdn.ensotek.de" />
        <JsonLd data={jsonLdData} id="org-website" />
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
           <AppProviders>
              <AosProvider>
                <FontAwesomeLoader />
                {children}
                <WhatsAppFloating number={contactInfo?.whatsapp || contactInfo?.phone_2} />
                <StackableWidgetsLoader />
              </AosProvider>
           </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
