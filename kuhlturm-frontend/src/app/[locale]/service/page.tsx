import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getServices } from '@ensotek/core/services';
import type { Service } from '@ensotek/core/types';
import { getServicesWithLocale } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dienstleistungen',
    description:
      'Professionelle Dienstleistungen rund um Kühltürme — Planung, Montage, Wartung und Service.',
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const tCommon = await getTranslations('common');

  const services: Service[] = await getServicesWithLocale(locale, {
    is_active: 1,
  }).then(d => d ?? []);

  return (
    <main>
      {/* Page banner */}
      <div className="bg-slate-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {tCommon('home')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{t('title')}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-slate-300 text-lg max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      {/* Services list */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <p className="text-lg">{tCommon('error')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/${locale}/service/${service.slug}`}
                  className="group flex flex-col md:flex-row gap-0 border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  {/* Image */}
                  <div className="md:w-56 shrink-0 aspect-4/3 md:aspect-auto overflow-hidden bg-slate-100 relative">
                    {service.image_url ? (
                      <Image
                        src={resolveMediaUrl(service.image_url)}
                        alt={service.image_alt ?? service.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 224px"
                        priority={index < 4}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <span className="text-slate-300 text-5xl font-display font-bold">K</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                        {service.name}
                      </h2>
                      {service.description && (
                        <p className="text-sm text-slate-500 line-clamp-3">
                          {service.description.replace(/<[^>]*>/g, '')}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                      {tCommon('readMore')}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-(--section-py) bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-slate-500 text-lg mb-8">{t('ctaSubtitle')}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {tCommon('contactUs')}
          </Link>
        </div>
      </section>
    </main>
  );
}
