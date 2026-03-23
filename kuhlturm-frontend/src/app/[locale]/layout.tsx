import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
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
import { FloatingWidgets } from '@/components/widgets/FloatingWidgets';
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

  const [seoRow, faviconRow] = await Promise.all([
    fetchSetting('seo', locale, { revalidate: 300 }),
    fetchSetting('site_favicon', locale, { revalidate: 300 }),
  ]);

  const seo = seoRow?.value as Record<string, any> | null;
  const faviconUrl =
    (faviconRow?.value as Record<string, any> | null)?.url ?? '/favicon.ico';

  const title: string = seo?.title_default ?? 'Kühlturm';
  const description: string =
    seo?.description ?? 'Professionelle Kühltürme und Kühllösungen für Industrie und Gewerbe.';
  const siteName: string = seo?.site_name ?? 'Kühlturm';
  const titleTemplate: string = seo?.title_template ?? '%s | Kühlturm';

  const ogImages: string[] = Array.isArray(seo?.open_graph?.images)
    ? seo.open_graph.images.filter((u: unknown): u is string => typeof u === 'string')
    : [];

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: titleTemplate },
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
      locale: `${locale}_${locale.toUpperCase()}`,
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
    icons: { icon: faviconUrl },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

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
  const [menuItems, footerSections, footerLinks, logoSetting, contactSetting, socialSetting, { activeLocales }] = await Promise.all([
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
    fetchSetting('site_contact', locale, { revalidate: 3600 }),
    fetchSetting('site_social', locale, { revalidate: 3600 }),
    getLocaleSettings(),
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

  const contactInfo = contactSetting?.value as any || {};
  const socials = socialSetting?.value as any || {};

  return (
    <html lang={locale} className={`${inter.variable} ${syne.variable}`}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header menuItems={menuItems} logoSrc={logoSrc} />
          {children}
          <Footer footerSections={footerSections} footerLinks={footerLinks} logoSrc={logoSrc} />
          <FloatingWidgets 
            activeLocales={activeLocales.map(code => ({ code, label: code.toUpperCase() }))}
            contactInfo={contactInfo}
            socials={socials}
          />
          <ScrollToTop />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
