import 'server-only';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';

import { getLocaleSettings } from '@/i18n/locale-settings';
import { fetchSetting, fetchMenuItems, fetchFooterSections } from '@/i18n/server';
import { getTranslations } from 'next-intl/server';
import { siteUrlBase, asStr, asObj } from '@/seo';
import { ensureFooterSections, ensureMenuItems } from '@/lib/navigation-fallback';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientShell } from '@/components/layout/ClientShell';
import { THEME_INTENT, THEME_TEMPLATE } from '@/theme/templates';
import { ThemeBootScript } from '@/scripts/theme-boot';

function readSettingValue(input: unknown): Record<string, unknown> {
  const raw = (input as { value?: unknown } | null)?.value;
  return asObj(raw);
}

function pickFirstString(...values: unknown[]): string {
  for (const value of values) {
    const normalized = asStr(value).trim();
    if (normalized) return normalized;
  }

  return '';
}

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
});

export async function generateStaticParams() {
  const { activeLocales } = await getLocaleSettings();
  return activeLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = siteUrlBase();

  const [seo, siteLogo, legacyLogo, siteOgDefaultImage] = await Promise.all([
    fetchSetting('seo', locale),
    fetchSetting('site_logo', locale),
    fetchSetting('logo', locale),
    fetchSetting('site_og_default_image', locale),
  ]);

  const val = readSettingValue(seo);
  const logoValue = { ...readSettingValue(legacyLogo), ...readSettingValue(siteLogo) };
  const ogValue = readSettingValue(siteOgDefaultImage);

  const title = asStr(val.site_title) || 'MOE Kompozit | Karbon Fiber & CTP Kompozit';
  const description =
    asStr(val.site_description) ||
    'Karbon fiber, CTP ve cam elyaf kompozit üretiminde endüstriyel çözümler.';
  const faviconUrl = pickFirstString(
    logoValue.favicon_url,
    logoValue.favicon,
    logoValue.icon_url,
  );
  const appleTouchIconUrl = pickFirstString(
    logoValue.apple_touch_icon_url,
    logoValue.apple_touch_icon,
  );
  const ogImage = pickFirstString(
    val.og_image,
    ogValue.url,
    ogValue.image_url,
  );

  return {
    title: { default: title, template: `%s | MOE Kompozit` },
    description,
    metadataBase: new URL(siteUrl),
    icons: {
      ...(faviconUrl
        ? {
            icon: [
              { url: faviconUrl, sizes: '16x16' },
              { url: faviconUrl, sizes: '32x32' },
            ],
          }
        : {}),
      ...(appleTouchIconUrl ? { apple: appleTouchIconUrl } : {}),
    },
    openGraph: {
      siteName: 'MOE Kompozit',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const navT = await getTranslations({ locale, namespace: 'nav' });
  const footerT = await getTranslations({ locale, namespace: 'footer' });

  const [menuItems, footerSections, siteLogoSetting, legacyLogoSetting] = await Promise.all([
    fetchMenuItems(locale),
    fetchFooterSections(locale),
    fetchSetting('site_logo', locale),
    fetchSetting('logo', locale),
  ]);

  const logoValue = { ...readSettingValue(legacyLogoSetting), ...readSettingValue(siteLogoSetting) };
  const logoUrl = pickFirstString(logoValue.logo_url, logoValue.url, logoValue.logo_dark_url);
  const stableMenuItems = ensureMenuItems(menuItems, locale, navT);
  const stableFooterSections = ensureFooterSections(footerSections, locale, navT, footerT);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${syne.variable}`}
      data-theme-template={THEME_TEMPLATE}
      data-theme-intent={THEME_INTENT}
      data-theme-mode="light"
      data-theme-preset="default"
      suppressHydrationWarning
    >
      <head>
        <ThemeBootScript />
      </head>
      <body
        className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased"
        data-theme-mode="light"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header menuItems={stableMenuItems} logoUrl={logoUrl} locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer sections={stableFooterSections} locale={locale} />
          <ClientShell />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
