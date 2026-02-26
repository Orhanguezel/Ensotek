import React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AVAILABLE_LOCALES, getLocaleMessages } from "../../i18n/locales";
import { getRuntimeLocaleSettings } from "../../i18n/locale-settings";
import { fetchSetting } from "../../i18n/server";

import { AosProvider } from '@/providers/AosProvider';
import { AppProviders } from '@/providers/AppProviders';
import { StackableWidgets } from '@/features/catalog';

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
    'https://www.ensotek.de';

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

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/app/css/fontawesome-pro.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
           <AppProviders>
              <AosProvider>
                {children}
                <StackableWidgets />
              </AosProvider>
           </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
