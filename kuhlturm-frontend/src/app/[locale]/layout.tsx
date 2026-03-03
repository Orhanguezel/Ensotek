import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Syne } from 'next/font/google';
import { Toaster } from 'sonner';
import { AVAILABLE_LOCALES, getLocaleMessages } from '@/i18n/locales';
import { getLocaleSettings } from '@/i18n/locale-settings';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { getMenuItems, getFooterSections } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';
import { fetchSetting } from '@/i18n/server';
import type { MenuItem, FooterSection } from '@ensotek/core/types';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.kuhlturm.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Kühlturm',
      template: '%s | Kühlturm',
    },
    description: 'Professionelle Kühltürme und Kühllösungen für Industrie und Gewerbe.',
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        AVAILABLE_LOCALES.map((l) => [l, `${siteUrl}/${l}`]),
      ),
    },
    openGraph: {
      type: 'website',
      siteName: 'Kühlturm',
      locale,
    },
    robots: { index: true, follow: true },
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

  if (!AVAILABLE_LOCALES.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = getLocaleMessages(locale);

  // Fetch layout data — graceful fallback if API unavailable
  const [menuItems, footerSections, footerLinks, logoSetting] = await Promise.all([
    getMenuItems(API_BASE_URL, { language: locale, location: 'header' }).catch(
      (): MenuItem[] => [],
    ),
    getFooterSections(API_BASE_URL, { language: locale, is_active: true }).catch(
      (): FooterSection[] => [],
    ),
    getMenuItems(API_BASE_URL, { language: locale, location: 'footer' }).catch(
      (): MenuItem[] => [],
    ),
    fetchSetting('site_logo', locale, { revalidate: 3600 }),
  ]);

  // Extract logo URL from setting value (may be a string URL or { url: string })
  const logoSrc = (() => {
    const v = logoSetting?.value;
    if (!v) return null;
    if (typeof v === 'string') return v || null;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const url = (v as Record<string, unknown>).url ?? (v as Record<string, unknown>).src;
      return typeof url === 'string' ? url || null : null;
    }
    return null;
  })();

  return (
    <html lang={locale} className={`${inter.variable} ${syne.variable}`}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header menuItems={menuItems} logoSrc={logoSrc} />
          {children}
          <Footer footerSections={footerSections} footerLinks={footerLinks} logoSrc={logoSrc} />
          <ScrollToTop />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
