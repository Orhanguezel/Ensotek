import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import {
  ChevronRight,
  Download,
  FileText,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getLibraryItems,
  getLibraryItemBySlug,
  getLibraryImages,
  getLibraryFiles,
} from '@ensotek/core/services';
import type { LibraryItem, LibraryImage, LibraryFile } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const items = await getLibraryItems(API_BASE_URL, {
    is_active: 1,
    limit: 500,
  }).catch(() => []);
  return items.map((item) => ({ slug: item.slug ?? '' })).filter((p) => p.slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getLibraryItemBySlug(API_BASE_URL, slug, locale).catch(() => null);
  if (!item) return { title: 'Wissensdatenbank' };
  return {
    title: item.meta_title ?? item.name ?? 'Wissensdatenbank',
    description: item.meta_description ?? undefined,
    keywords: item.meta_keywords ?? undefined,
  };
}

export default async function LibraryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('library');

  const item = await getLibraryItemBySlug(API_BASE_URL, slug, locale).catch(() => null);

  if (!item) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-6">{t('noResults')}</p>
            <Link
              href={`/${locale}/library`}
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              {t('backToLibrary')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Fetch images and files in parallel
  const [images, files] = await Promise.all([
    getLibraryImages(API_BASE_URL, item.id, locale).catch((): LibraryImage[] => []),
    getLibraryFiles(API_BASE_URL, item.id).catch((): LibraryFile[] => []),
  ]);

  const updatedAt = new Date(item.updated_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Related items (same type, excluding current)
  const related = await getLibraryItems(API_BASE_URL, {
    locale,
    type: item.type !== 'other' ? item.type : undefined,
    sort: 'display_order',
    order: 'asc',
    is_active: 1,
    limit: 4,
  })
    .then((all) => all.filter((r) => r.id !== item.id).slice(0, 3))
    .catch((): LibraryItem[] => []);

  return (
    <main>
      {/* Banner */}
      <div className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/library`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white line-clamp-1">{item.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            {item.type && item.type !== 'other' && (
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-900/40 px-2.5 py-1 rounded-full">
                {item.type}
              </span>
            )}
            <span className="text-xs text-slate-500">{t('lastUpdated')}: {updatedAt}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            {item.name}
          </h1>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            {item.views > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {item.views} {t('views')}
              </span>
            )}
            {files.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Download size={14} />
                {files.length} {t('filesAvailable')}
              </span>
            )}
            {images.length > 0 && (
              <span className="flex items-center gap-1.5">
                <ImageIcon size={14} />
                {images.length} {t('imagesAvailable')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Featured image */}
      {(item.featured_image || item.image_url) && (
        <div className="bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <img
              src={(item.featured_image ?? item.image_url)!}
              alt={item.image_alt ?? item.name ?? ''}
              className="w-full max-h-[480px] object-cover rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Content */}
            <div className="flex-1 min-w-0">
              {item.description ? (
                <div
                  className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-a:text-blue-600 prose-h2:text-2xl prose-h3:text-xl"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              ) : (
                <p className="text-slate-400">{t('noContent')}</p>
              )}

              {/* Image gallery */}
              {images.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-blue-500" />
                    {t('gallery')}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img) => (
                      <div key={img.id} className="overflow-hidden rounded-xl aspect-4/3 bg-slate-100">
                        {img.image_url ? (
                          <img
                            src={img.image_url}
                            alt={img.alt ?? img.title ?? ''}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="text-slate-300" size={32} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">

              {/* Downloads */}
              {files.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                  <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Download size={16} className="text-blue-500" />
                    {t('downloads')}
                  </h3>
                  <ul className="space-y-2.5">
                    {files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={file.file_url ?? file.file_public_url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 group"
                          download
                        >
                          <div className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                            <FileText size={15} className="text-blue-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                              {file.name}
                            </p>
                            {file.size_bytes && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {formatBytes(file.size_bytes)}
                              </p>
                            )}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Back link */}
              <Link
                href={`/${locale}/library`}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ChevronRight size={14} className="rotate-180" />
                {t('backToLibrary')}
              </Link>
            </aside>

          </div>
        </div>
      </div>

      {/* Related items */}
      {related.length > 0 && (
        <section className="py-12 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">{t('related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/${locale}/library/${r.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    {r.featured_image || r.image_url ? (
                      <img
                        src={(r.featured_image ?? r.image_url)!}
                        alt={r.image_alt ?? r.name ?? ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-slate-100">
                        <FileText className="text-blue-200" size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-2">
                      {r.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
