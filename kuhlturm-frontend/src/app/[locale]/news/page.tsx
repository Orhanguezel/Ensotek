import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getCustomPages } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { apiFetchWithLocale } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nachrichten',
    description: 'Aktuelle Neuigkeiten, Ankündigungen und Unternehmensnachrichten von Kühlturm.',
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');

  const articles: CustomPage[] = await apiFetchWithLocale<CustomPage[]>('/custom_pages', locale, {
    params: {
      module_key: 'news',
      is_published: 1,
      sort: 'created_at',
      order: 'desc',
      limit: 50,
    }
  }).then(d => d ?? []);

  const featured = articles.filter((a) => a.featured === 1);
  const rest = articles.filter((a) => a.featured !== 1);

  return (
    <main>
      <PageBanner
        locale={locale}
        homeLabel={tCommon('home')}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {articles.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Featured articles */}
            {featured.length > 0 && (
              <div className="mb-12">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((article) => (
                    <ArticleCard key={article.id} article={article} locale={locale} tCommon={tCommon} large />
                  ))}
                </div>
              </div>
            )}

            {/* All articles */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('allNews')}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} locale={locale} tCommon={tCommon} />
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

/* ── Article card ────────────────────────────────────────────────── */

function ArticleCard({
  article,
  locale,
  tCommon,
  large = false,
}: {
  article: CustomPage;
  locale: string;
  tCommon: any;
  large?: boolean;
}) {
  const date = new Date(article.created_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link
      href={`/${locale}/news/${article.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className={`overflow-hidden bg-slate-100 relative ${large ? 'aspect-video' : 'aspect-4/3'}`}>
        {article.featured_image ? (
          <Image
            src={resolveMediaUrl(article.featured_image)}
            alt={article.featured_image_alt ?? article.title}
            fill
            sizes={large ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <span className="text-slate-300 text-6xl font-display font-bold">N</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category + date */}
        <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
          {article.category_name && (
            <span className="uppercase font-semibold tracking-wide text-blue-600">
              {article.category_name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {date}
          </span>
        </div>

        <h2 className={`font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug ${large ? 'text-xl' : 'text-base'}`}>
          {article.title}
        </h2>

        {article.summary && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 group-hover:underline">
            {tCommon('readMore')} →
          </span>
          {article.tags && (
            <span className="flex items-center gap-1 text-slate-300">
              <Tag size={11} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
