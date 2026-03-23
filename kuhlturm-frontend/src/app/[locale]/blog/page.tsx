import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, Calendar, Tag } from 'lucide-react';
import { getCustomPages } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { apiFetchWithLocale } from '@/lib/api';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Technische Artikel, Brancheninformationen und Wissenswertes rund um Kühltürme.',
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('blog');

  const posts: CustomPage[] = await apiFetchWithLocale<CustomPage[]>('/custom_pages', locale, {
    params: {
      module_key: 'blog',
      is_published: 1,
      sort: 'created_at',
      order: 'desc',
      limit: 50,
    }
  }).then(d => d ?? []);

  const featured = posts.filter((p) => p.featured === 1);
  const rest = posts.filter((p) => p.featured !== 1);

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

      {posts.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Featured posts — wider cards */}
            {featured.length > 0 && (
              <div className="mb-12">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((post) => (
                    <BlogCard key={post.id} post={post} locale={locale} large />
                  ))}
                </div>
              </div>
            )}

            {/* All posts */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    {t('allPosts')}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <BlogCard key={post.id} post={post} locale={locale} />
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

/* ── Blog card ───────────────────────────────────────────────────── */

function BlogCard({
  post,
  locale,
  large = false,
}: {
  post: CustomPage;
  locale: string;
  large?: boolean;
}) {
  const date = new Date(post.created_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className={`overflow-hidden bg-slate-100 ${large ? 'aspect-video' : 'aspect-4/3'}`}>
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.featured_image_alt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <span className="text-slate-300 text-6xl font-display font-bold">B</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
          {post.category_name && (
            <span className="uppercase font-semibold tracking-wide text-blue-600">
              {post.category_name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {date}
          </span>
        </div>

        <h2 className={`font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug ${large ? 'text-xl' : 'text-base'}`}>
          {post.title}
        </h2>

        {post.summary && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {post.summary}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 group-hover:underline">
            Weiterlesen →
          </span>
          {post.tags && (
            <span className="flex items-center gap-1 text-slate-300">
              <Tag size={11} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
