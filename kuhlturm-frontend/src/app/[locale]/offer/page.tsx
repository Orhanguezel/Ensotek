import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CheckCircle2, Clock, Shield } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { OfferForm } from '@/components/sections/OfferForm';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    type?: string;
    // spare part
    partId?: string;
    partTitle?: string;
    partCode?: string;
    // product
    productId?: string;
    productTitle?: string;
    // service
    serviceId?: string;
    serviceName?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Angebot anfordern — Ensotek Kühlturm',
    description:
      'Fordern Sie ein kostenloses und unverbindliches Angebot für Kühltürme, Wartung oder Engineering-Leistungen an.',
  };
}

export default async function OfferPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type, partId, partTitle, partCode, productId, productTitle, serviceId, serviceName } = await searchParams;
  setRequestLocale(locale);

  const initialTab =
    type === 'sparepart' ? 'sparepart' :
    type === 'product' ? 'product' :
    type === 'service' ? 'service' :
    undefined;

  const t = await getTranslations('offer');

  const benefits = [
    { icon: CheckCircle2, text: t('benefit1') },
    { icon: Clock, text: t('benefit2') },
    { icon: Shield, text: t('benefit3') },
  ];

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Content */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-16">

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                {t('formTitle')}
              </h2>
              <p className="text-slate-500 text-sm mb-8">{t('formSubtitle')}</p>
              <OfferForm
                locale={locale}
                initialTab={initialTab}
                initialPartId={partId}
                initialPartTitle={partTitle}
                initialPartCode={partCode}
                initialProductId={productId}
                initialProductTitle={productTitle}
                initialServiceId={serviceId}
                initialServiceName={serviceName}
                labels={{
                  // Tabs
                  tabService: t('tabService'),
                  tabProduct: t('tabProduct'),
                  tabSparepart: t('tabSparepart'),
                  // Common contact
                  nameLabel: t('nameLabel'),
                  companyLabel: t('companyLabel'),
                  emailLabel: t('emailLabel'),
                  phoneLabel: t('phoneLabel'),
                  placeholderName: t('placeholderName'),
                  placeholderCompany: t('placeholderCompany'),
                  placeholderEmail: t('placeholderEmail'),
                  placeholderPhone: t('placeholderPhone'),
                  // Service tab
                  serviceLabel: t('serviceLabel'),
                  selectService: t('selectService'),
                  serviceDescLabel: t('serviceDescLabel'),
                  serviceDescPlaceholder: t('serviceDescPlaceholder'),
                  // Product tab
                  productLabel: t('productLabel'),
                  selectProduct: t('selectProduct'),
                  towerProcessLabel: t('towerProcessLabel'),
                  towerProcessPlaceholder: t('towerProcessPlaceholder'),
                  towerCityLabel: t('towerCityLabel'),
                  towerCityPlaceholder: t('towerCityPlaceholder'),
                  waterFlowLabel: t('waterFlowLabel'),
                  waterFlowPlaceholder: t('waterFlowPlaceholder'),
                  inletTempLabel: t('inletTempLabel'),
                  inletTempPlaceholder: t('inletTempPlaceholder'),
                  outletTempLabel: t('outletTempLabel'),
                  outletTempPlaceholder: t('outletTempPlaceholder'),
                  wetBulbTempLabel: t('wetBulbTempLabel'),
                  wetBulbTempPlaceholder: t('wetBulbTempPlaceholder'),
                  capacityLabel: t('capacityLabel'),
                  capacityPlaceholder: t('capacityPlaceholder'),
                  notesLabel: t('notesLabel'),
                  notesPlaceholder: t('notesPlaceholder'),
                  // Spare parts tab
                  sparepartDescLabel: t('sparepartDescLabel'),
                  sparepartDescPlaceholder: t('sparepartDescPlaceholder'),
                  partNumberLabel: t('partNumberLabel'),
                  partNumberPlaceholder: t('partNumberPlaceholder'),
                  quantityLabel: t('quantityLabel'),
                  quantityPlaceholder: t('quantityPlaceholder'),
                  sparepartNotesLabel: t('sparepartNotesLabel'),
                  sparepartNotesPlaceholder: t('sparepartNotesPlaceholder'),
                  // Consents & submit
                  consentTerms: t('consentTerms'),
                  consentMarketing: t('consentMarketing'),
                  submitLabel: t('submitLabel'),
                  submittingLabel: t('submittingLabel'),
                  successTitle: t('successTitle'),
                  successDetail: t('successDetail'),
                  errorMessage: t('errorMessage'),
                }}
              />
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 space-y-8">
                {/* Benefits */}
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-5">
                    {t('whyTitle')}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {benefits.map(({ icon: Icon, text }, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Icon size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span className="text-slate-700 text-sm">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick contact */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                  <p className="text-sm font-semibold text-slate-700 mb-1">{t('quickContactTitle')}</p>
                  <p className="text-xs text-slate-500 mb-4">{t('quickContactSubtitle')}</p>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    → {t('quickContactLink')}
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
