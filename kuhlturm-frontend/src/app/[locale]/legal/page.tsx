import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getCustomPages } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { apiFetchWithLocale } from '@/lib/api';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Rechtliches',
    description: 'Datenschutzerklärung, Impressum, Nutzungsbedingungen und weitere rechtliche Informationen.',
  };
}

export default async function LegalIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('legal');
  const tCommon = await getTranslations('common');

  const pages: CustomPage[] = await apiFetchWithLocale<CustomPage[]>('/custom_pages', locale, {
    params: {
      module_key: 'legal',
      is_published: 1,
      sort: 'display_order',
      order: 'asc',
      limit: 50,
    }
  }).then(d => d ?? []);

  return (
    <main>
      <PageBanner
        locale={locale}
        homeLabel={tCommon('home')}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pages.length === 0 ? (
            <p className="text-slate-400 text-lg text-center py-16">{t('noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${locale}/legal/${page.slug}`}
                  className="group flex flex-col gap-4 bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                    <FileText size={20} />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-lg leading-snug">
                      {page.title}
                    </h2>
                    {page.summary && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {page.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                    <span>{t('readMore')}</span>
                    <ArrowRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
