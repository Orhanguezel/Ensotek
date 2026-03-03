import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Tag } from 'lucide-react';
import { fetchCustomPage, fetchCustomPagesByModuleKey, parseCustomPageContent } from '@/i18n/server';
import { API_BASE_URL } from '@/lib/utils';
import type { CustomPage } from '@/i18n/server';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await fetchCustomPage(slug, locale);
  if (!page) return { title: 'Über uns' };
  return {
    title: page.meta_title || page.title || 'Über uns',
    description:
      page.meta_description ||
      page.summary ||
      page.description?.replace(/<[^>]*>/g, '').slice(0, 160) ||
      undefined,
  };
}

async function fetchCustomPageBySlug(slug: string, locale: string): Promise<CustomPage | null> {
  try {
    const url = `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?language=${encodeURIComponent(locale)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    const page = data?.data ?? data;
    return page?.id ? (page as CustomPage) : null;
  } catch {
    return null;
  }
}

export default async function AboutDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('common');
  const t = await getTranslations('about');

  const page = await fetchCustomPageBySlug(slug, locale);
  if (!page) notFound();

  // Related pages (same module_key, excluding current)
  const related = await fetchCustomPagesByModuleKey(page.module_key, locale);
  const relatedPages = related.filter((p) => p.id !== page.id).slice(0, 3);

  const tags = page.tags
    ? page.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const coverImage = page.featured_image ?? page.image_url;

  return (
    <main>
      {/* Hero with cover image or dark banner */}
      {coverImage ? (
        <div className="relative h-64 md:h-96 overflow-hidden bg-slate-900">
          <img
            src={coverImage}
            alt={page.featured_image_alt ?? page.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
            <nav className="flex items-center gap-2 text-sm text-slate-300 mb-4 flex-wrap">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">
                Startseite
              </Link>
              <ChevronRight size={14} className="shrink-0" />
              <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                {t('title')}
              </Link>
              <ChevronRight size={14} className="shrink-0" />
              <span className="text-white truncate max-w-xs">{page.title}</span>
            </nav>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white">{page.title}</h1>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">
                Startseite
              </Link>
              <ChevronRight size={14} className="shrink-0" />
              <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                {t('title')}
              </Link>
              <ChevronRight size={14} className="shrink-0" />
              <span className="text-white truncate max-w-xs">{page.title}</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-bold">{page.title}</h1>
            {page.summary && (
              <p className="mt-3 text-slate-300 text-lg max-w-2xl">{page.summary}</p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary (if cover image hid it) */}
          {coverImage && page.summary && (
            <p className="text-xl text-slate-500 mb-8 leading-relaxed">{page.summary}</p>
          )}

          {/* Main HTML content */}
          {page.content && (
            <div
              className="prose prose-lg prose-slate max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: parseCustomPageContent(page.content) }}
            />
          )}

          {/* Gallery */}
          {Array.isArray(page.images) && page.images.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
              {page.images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-4/3 bg-slate-100">
                  <img
                    src={img}
                    alt={`${page.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  <Tag size={11} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} />
              {t('backToAbout')}
            </Link>
          </div>
        </div>
      </section>

      {/* Related pages */}
      {relatedPages.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
              {t('relatedPages')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPages.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/about/${p.slug}`}
                  className="group block bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all"
                >
                  {(p.featured_image ?? p.image_url) && (
                    <div className="aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={(p.featured_image ?? p.image_url)!}
                        alt={p.featured_image_alt ?? p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    {p.summary && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.summary}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 text-lg mb-8">{t('ctaSubtitle')}</p>
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
