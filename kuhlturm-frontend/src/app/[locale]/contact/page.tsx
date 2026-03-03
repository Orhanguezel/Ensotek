import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { fetchSetting } from '@/i18n/server';
import { ContactForm } from '@/components/sections/ContactForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Kontakt',
    description: 'Kontaktieren Sie uns — wir freuen uns auf Ihre Anfrage.',
  };
}

interface ContactInfo {
  email?: string;
  phone?: string;
  phone2?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  hours?: string;
  maps_url?: string;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  // Fetch contact info from site_settings (graceful fallback)
  const settingRow = await fetchSetting('contact_info', locale, { revalidate: 600 });
  const info: ContactInfo =
    settingRow?.value && typeof settingRow.value === 'object' && !Array.isArray(settingRow.value)
      ? (settingRow.value as ContactInfo)
      : {};

  const hasInfo = !!(info.email || info.phone || info.address);

  return (
    <main>
      {/* Page banner */}
      <div className="bg-slate-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{t('title')}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-slate-300 text-lg max-w-xl">{t('heroSubtitle')}</p>
        </div>
      </div>

      {/* Main content */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-16">

            {/* Contact form — wider column */}
            <div className="lg:col-span-3">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                {t('formTitle')}
              </h2>
              <p className="text-slate-500 text-sm mb-8">{t('formSubtitle')}</p>
              <ContactForm />
            </div>

            {/* Contact info — narrower column */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                {t('infoTitle')}
              </h2>

              <div className="space-y-5">
                {info.email && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {t('email')}
                      </p>
                      <a
                        href={`mailto:${info.email}`}
                        className="text-slate-800 hover:text-blue-600 transition-colors font-medium text-sm"
                      >
                        {info.email}
                      </a>
                    </div>
                  </div>
                )}

                {info.phone && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {t('phone')}
                      </p>
                      <a
                        href={`tel:${info.phone.replace(/\s/g, '')}`}
                        className="text-slate-800 hover:text-blue-600 transition-colors font-medium text-sm"
                      >
                        {info.phone}
                      </a>
                      {info.phone2 && (
                        <a
                          href={`tel:${info.phone2.replace(/\s/g, '')}`}
                          className="block text-slate-800 hover:text-blue-600 transition-colors font-medium text-sm mt-0.5"
                        >
                          {info.phone2}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {(info.address ?? info.city) && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {t('address')}
                      </p>
                      {info.address && (
                        <p className="text-slate-800 font-medium text-sm">{info.address}</p>
                      )}
                      {(info.zip ?? info.city) && (
                        <p className="text-slate-600 text-sm">
                          {[info.zip, info.city].filter(Boolean).join(' ')}
                          {info.country ? `, ${info.country}` : ''}
                        </p>
                      )}
                      {info.maps_url && (
                        <a
                          href={info.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                        >
                          {t('showOnMap')} →
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {info.hours && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {t('hours')}
                      </p>
                      <p className="text-slate-800 font-medium text-sm whitespace-pre-line">
                        {info.hours}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fallback when no settings yet */}
                {!hasInfo && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    {t('infoFallback')}
                  </div>
                )}
              </div>

              {/* Quick links */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-700 mb-3">{t('quickLinks')}</p>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/${locale}/product`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    → Unsere Produkte
                  </Link>
                  <Link
                    href={`/${locale}/service`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    → Dienstleistungen
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    → Über uns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
