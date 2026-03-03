import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { getCustomPages } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Lösungen',
    description: 'Maßgeschneiderte Kühllösungen für Industrie und Gewerbe — von der Planung bis zur Umsetzung.',
  };
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('solutions');

  const items: CustomPage[] = await getCustomPages(API_BASE_URL, {
    module_key: 'solutions',
    language: locale,
    is_published: true,
    sort: 'display_order',
    order: 'asc',
    limit: 50,
  }).catch(() => []);

  const featured = items.filter((p) => p.featured === 1);
  const rest = items.filter((p) => p.featured !== 1);

  return (
    <main>
      {/* Banner */}
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
          <p className="mt-3 text-slate-300 text-lg max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Featured items — wider cards */}
            {featured.length > 0 && (
              <div className="mb-12">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((item) => (
                    <SolutionCard key={item.id} item={item} locale={locale} large />
                  ))}
                </div>
              </div>
            )}

            {/* All items */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('allSolutions')}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item) => (
                    <SolutionCard key={item.id} item={item} locale={locale} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      )}
    </main>
  );
}

/* ── Solution card ───────────────────────────────────────────────── */

function SolutionCard({
  item,
  locale,
  large = false,
}: {
  item: CustomPage;
  locale: string;
  large?: boolean;
}) {
  const date = new Date(item.created_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link
      href={`/${locale}/solutions/${item.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className={`overflow-hidden bg-slate-100 ${large ? 'aspect-video' : 'aspect-4/3'}`}>
        {item.featured_image ? (
          <img
            src={item.featured_image}
            alt={item.featured_image_alt ?? item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
            <span className="text-blue-200 text-6xl font-display font-bold">L</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
          {item.category_name && (
            <span className="uppercase font-semibold tracking-wide text-blue-600">
              {item.category_name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {date}
          </span>
        </div>

        <h2 className={`font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug ${large ? 'text-xl' : 'text-base'}`}>
          {item.title}
        </h2>

        {item.summary && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-3 leading-relaxed">
            {item.summary}
          </p>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
          <span>Mehr erfahren</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}
