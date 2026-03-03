import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { getCustomPages, getCustomPageBySlug, parseCustomPageContent } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getCustomPages(API_BASE_URL, {
    module_key: 'legal',
    is_published: true,
    limit: 200,
  }).catch(() => []);
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getCustomPageBySlug(API_BASE_URL, slug, locale).catch(() => null);
  if (!page) return { title: 'Rechtliches' };
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_description ?? page.summary ?? undefined,
  };
}

export default async function LegalDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('legal');

  // Fetch current page and all legal pages in parallel
  const [page, allPages] = await Promise.all([
    getCustomPageBySlug(API_BASE_URL, slug, locale).catch(() => null),
    getCustomPages(API_BASE_URL, {
      module_key: 'legal',
      language: locale,
      is_published: true,
      sort: 'display_order',
      order: 'asc',
      limit: 50,
    }).catch((): CustomPage[] => []),
  ]);

  if (!page) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-6">{t('noResults')}</p>
            <Link
              href={`/${locale}/legal`}
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              {t('backToLegal')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const htmlContent = parseCustomPageContent(page.content);

  const updatedAt = new Date(page.updated_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main>
      {/* Banner */}
      <div className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/legal`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white line-clamp-1">{page.title}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            {page.title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {t('lastUpdated')}: {updatedAt}
          </p>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar — legal page navigation */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-3">
                  {t('title')}
                </p>
                <nav className="flex flex-col gap-0.5">
                  {allPages.map((p) => {
                    const isActive = p.slug === slug;
                    return (
                      <Link
                        key={p.id}
                        href={`/${locale}/legal/${p.slug}`}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <FileText
                          size={15}
                          className={isActive ? 'text-blue-500' : 'text-slate-400'}
                        />
                        <span className="leading-tight">{p.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {htmlContent ? (
                <div
                  className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-a:text-blue-600 prose-h2:text-2xl prose-h3:text-xl"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <p className="text-slate-400">{t('noContent')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
