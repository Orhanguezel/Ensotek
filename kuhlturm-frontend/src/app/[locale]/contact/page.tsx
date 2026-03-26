import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Factory, MessageCircle } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
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
  company_name?: string;
  email?: string;
  email_2?: string;
  phone?: string;
  phone_2?: string;
  address?: string;
  address_label?: string;
  address_2?: string;
  address_2_label?: string;
  city?: string;
  city_2?: string;
  country?: string;
  country_2?: string;
  working_hours?: string;
  maps_lat?: string;
  maps_lng?: string;
  maps_lat_2?: string;
  maps_lng_2?: string;
}

function buildMapEmbedUrl(lat?: string, lng?: string, address?: string): string {
  if (lat && lng) {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }
  return '';
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

  const map1Url = buildMapEmbedUrl(info.maps_lat, info.maps_lng, info.address);
  const map2Url = buildMapEmbedUrl(info.maps_lat_2, info.maps_lng_2, info.address_2);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('heroSubtitle')}
      />

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
                {/* Email */}
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
                      {info.email_2 && (
                        <a
                          href={`mailto:${info.email_2}`}
                          className="block text-slate-800 hover:text-blue-600 transition-colors font-medium text-sm mt-0.5"
                        >
                          {info.email_2}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Phone & WhatsApp */}
                {info.phone && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {t('phone')} / WhatsApp
                      </p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${info.phone.replace(/\s/g, '')}`}
                          className="text-slate-800 hover:text-blue-600 transition-colors font-medium text-sm"
                        >
                          {info.phone}
                        </a>
                        <a
                          href={`https://wa.me/${info.phone.replace(/[\s\-\(\)]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                      </div>
                      {info.phone_2 && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${info.phone_2.replace(/\s/g, '')}`}
                            className="text-slate-800 hover:text-blue-600 transition-colors font-medium text-sm"
                          >
                            {info.phone_2}
                          </a>
                          <a
                            href={`https://wa.me/${info.phone_2.replace(/[\s\-\(\)]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address 1 */}
                {info.address && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {info.address_label || t('address')}
                      </p>
                      <p className="text-slate-800 font-medium text-sm">{info.address}</p>
                    </div>
                  </div>
                )}

                {/* Address 2 */}
                {info.address_2 && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Factory size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {info.address_2_label || 'Werk'}
                      </p>
                      <p className="text-slate-800 font-medium text-sm">{info.address_2}</p>
                    </div>
                  </div>
                )}

                {/* Working hours */}
                {info.working_hours && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {t('hours')}
                      </p>
                      <p className="text-slate-800 font-medium text-sm whitespace-pre-line">
                        {info.working_hours}
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

      {/* Maps */}
      {(map1Url || map2Url) && (
        <section className="bg-slate-50 py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {map1Url && (
              <div>
                <div className="bg-slate-900 text-white px-5 py-3 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <MapPin size={16} />
                  {info.address_label || 'Office'}
                </div>
                <iframe
                  src={map1Url}
                  title={`${info.address_label || 'Office'} - ${info.company_name || 'Ensotek'}`}
                  className="w-full border-0"
                  style={{ height: 400 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            {map2Url && (
              <div>
                <div className="bg-slate-900 text-white px-5 py-3 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Factory size={16} />
                  {info.address_2_label || 'Werk'}
                </div>
                <iframe
                  src={map2Url}
                  title={`${info.address_2_label || 'Factory'} - ${info.company_name || 'Ensotek'}`}
                  className="w-full border-0"
                  style={{ height: 400 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
