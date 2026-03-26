import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getCustomPages, getCustomPageBySlug, parseCustomPageContent } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { getCustomPageBySlugWithLocale, getCustomPagesWithLocale } from '@/lib/api';
import { fetchSetting } from '@/i18n/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getCustomPageBySlugWithLocale(slug, locale);
  if (!page) return { title: 'Rechtliches' };
  return {
    title: (page as any).meta_title ?? (page as any).title,
    description: (page as any).meta_description ?? (page as any).summary ?? undefined,
  };
}

export default async function LegalDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('legal');
  const tCommon = await getTranslations('common');

  // Fetch current page and all legal pages in parallel
  const [page, allPagesRaw] = await Promise.all([
    getCustomPageBySlugWithLocale(slug, locale),
    getCustomPagesWithLocale(locale, {
      module_key: 'legal',
      is_published: 1,
      sort: 'display_order',
      order: 'asc',
      limit: 50,
    }),
  ]);

  const allPages: CustomPage[] = (allPagesRaw as any[] ?? []);

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
      <PageBanner
        locale={locale}
        homeLabel={tCommon('home')}
        breadcrumbs={[
          { label: t('title'), href: `/${locale}/legal` },
          { label: page.title },
        ]}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
          {page.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {t('lastUpdated')}: {updatedAt}
        </p>
      </PageBanner>

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
