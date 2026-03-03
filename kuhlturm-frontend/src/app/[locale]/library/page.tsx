import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, BookOpen, ArrowRight, Download, Eye } from 'lucide-react';
import { getLibraryItems } from '@ensotek/core/services';
import type { LibraryItem } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Wissensdatenbank',
    description: 'Technische Artikel, Anleitungen und Fachinformationen rund um Kühltürme und Kühltechnik.',
  };
}

export default async function LibraryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('library');

  const items: LibraryItem[] = await getLibraryItems(API_BASE_URL, {
    locale,
    sort: 'display_order',
    order: 'asc',
    is_active: 1,
    limit: 100,
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

            {/* Featured items */}
            {featured.length > 0 && (
              <div className="mb-12">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((item) => (
                    <LibraryCard key={item.id} item={item} locale={locale} large readMoreLabel={t('readMore')} />
                  ))}
                </div>
              </div>
            )}

            {/* All items */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('allItems')}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item) => (
                    <LibraryCard key={item.id} item={item} locale={locale} readMoreLabel={t('readMore')} />
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

/* ── Library card ───────────────────────────────────────────────────── */

function LibraryCard({
  item,
  locale,
  large = false,
  readMoreLabel,
}: {
  item: LibraryItem;
  locale: string;
  large?: boolean;
  readMoreLabel: string;
}) {
  const typeLabel = item.type && item.type !== 'other' ? item.type : null;

  return (
    <Link
      href={`/${locale}/library/${item.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className={`overflow-hidden bg-slate-100 ${large ? 'aspect-video' : 'aspect-4/3'}`}>
        {item.featured_image || item.image_url ? (
          <img
            src={(item.featured_image ?? item.image_url)!}
            alt={item.image_alt ?? item.name ?? ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-slate-100">
            <BookOpen className="text-blue-200" size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {typeLabel && (
          <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {typeLabel}
          </span>
        )}

        <h2 className={`font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug ${large ? 'text-xl' : 'text-base'}`}>
          {item.name}
        </h2>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          {item.download_count > 0 && (
            <span className="flex items-center gap-1">
              <Download size={11} />
              {item.download_count}
            </span>
          )}
          {item.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {item.views}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
          <span>{readMoreLabel}</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}
