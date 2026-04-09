import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Download,
  FileText,
  Eye,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  ChevronLeft,
  Printer,
} from 'lucide-react';
import {
  getLibraryItems,
  getLibraryItemBySlug,
  getLibraryImages,
  getLibraryFiles,
} from '@ensotek/core/services';
import type { LibraryItem, LibraryImage, LibraryFile } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';
import { PrintButton } from '@/components/ui/PrintButton';
import { SocialShareCard } from '@/components/sections/SocialShareCard';
import { PdfPreview } from '@/components/sections/PdfPreview';
import { CoolingTowerAnimation } from '@/components/sections/CoolingTowerAnimation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getLibraryItemBySlug(API_BASE_URL, slug, locale).catch(() => null);
  if (!item) return { title: 'Wissensdatenbank' };
  return {
    title: `${item.name} | Wissensdatenbank | Ensotek`,
    description: (item as any).meta_description ?? (item as any).summary ?? undefined,
    keywords: (item as any).meta_keywords ?? undefined,
  };
}

export default async function LibraryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('library');
  const tCommon = await getTranslations('common');

  // Fetch current item
  const item = await getLibraryItemBySlug(API_BASE_URL, slug, locale).catch(() => null);

  if (!item) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <BookOpen size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Inhalt nicht gefunden</h1>
          <p className="text-slate-500 mb-8">{t('noResults')}</p>
          <Link
            href={`/${locale}/library`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <ChevronLeft size={18} />
            {t('backToLibrary')}
          </Link>
        </div>
      </main>
    );
  }

  // Fetch other library data for sidebar and detail assets in parallel
  const [images, files, allItems] = await Promise.all([
    getLibraryImages(API_BASE_URL, item.id, locale).catch((): LibraryImage[] => []),
    getLibraryFiles(API_BASE_URL, item.id).catch((): LibraryFile[] => []),
    getLibraryItems(API_BASE_URL, { locale, limit: 100, is_active: 1 }).catch((): LibraryItem[] => []),
  ]);

  const updatedAt = new Date(item.updated_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const sidebarItems = allItems.filter(i => i.id !== item.id).slice(0, 15);

  // Find first PDF file for inline preview
  const pdfFile = files.find((f) => {
    const url = (f.file_url ?? f.file_public_url ?? '').toLowerCase();
    const mime = ((f as any).mime_type ?? '').toLowerCase();
    return mime.includes('pdf') || /\.pdf(\?|#|$)/.test(url);
  });

  return (
    <main className="bg-white min-h-screen">
      {/* Article Header / Breadcrumbs */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-0 whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">Startseite</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href={`/${locale}/library`} className="hover:text-blue-600 transition-colors">{t('title')}</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-slate-900 font-medium truncate">{item.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* SIDEBAR (Desktop Left) - Mobile Bottom */}
          <aside className="lg:w-80 shrink-0 order-2 lg:order-1">
            <div className="sticky top-28 space-y-10">
              
              {/* Share Card */}
              <SocialShareCard 
                path={`/${locale}/library/${slug}`}
                title={item.name ?? ''}
                labels={{
                  title: tCommon('shareTitle'),
                  copyLink: tCommon('copyLink'),
                  copied: tCommon('copied')
                }}
              />

              {/* Other Articles List */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
                <h3 className="font-display font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-600" />
                  Weitere Artikel
                </h3>
                <nav className="space-y-1">
                  {sidebarItems.map((sItem) => (
                    <Link
                      key={sItem.id}
                      href={`/${locale}/library/${sItem.slug}`}
                      className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${
                        sItem.slug === slug 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${sItem.slug === slug ? 'bg-white' : 'bg-slate-300 group-hover:bg-blue-600'}`} />
                      <span className="text-sm font-semibold leading-snug line-clamp-2">{sItem.name}</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-slate-200">
                   <Link href={`/${locale}/library`} className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      <ChevronLeft size={16} />
                      Alle Beiträge ansehen
                   </Link>
                </div>
              </div>

              {/* Downloads Sidebar */}
              {files.length > 0 && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 md:p-8">
                  <h3 className="font-display font-bold text-blue-900 mb-6 text-lg flex items-center gap-2">
                    <Download size={20} className="text-blue-600" />
                    Dokumente
                  </h3>
                  <div className="space-y-4">
                    {files.map((file) => (
                      <a
                        key={file.id}
                        href={resolveMediaUrl(file.file_url ?? file.file_public_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group bg-white p-3 rounded-xl border border-blue-100/50 hover:border-blue-300 hover:shadow-md transition-all shadow-sm"
                        download
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{formatBytes(file.size_bytes ?? 0)} • PDF</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN ARTICLE CONTENT */}
          <article className="flex-1 min-w-0 order-1 lg:order-2">
            {/* Category & Badge */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
               <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest">
                  {item.type || 'Dokumentation'}
               </span>
               <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Calendar size={14} />
                  <span>{updatedAt}</span>
               </div>
               <div className="h-4 w-px bg-slate-200 hidden sm:block" />
               <div className="flex items-center gap-4 text-slate-400">
                  <PrintButton />
               </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 leading-[1.15] mb-8">
              {item.name}
            </h1>

            {/* Premium Animation Override (Only for Principle related items) */}
            {(slug.includes('prensib') || slug.includes('principle') || slug.includes('prinzip')) && (
              <div className="mb-12">
                 <CoolingTowerAnimation locale={locale} />
              </div>
            )}

            {/* Featured Image */}
            {(item.featured_image || item.image_url) && (
              <div className="relative mb-12 rounded-[2rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200 aspect-video max-h-150">
                <Image
                  src={resolveMediaUrl((item.featured_image ?? item.image_url)!)}
                  alt={item.image_alt ?? item.name ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1024px"
                  priority
                />
              </div>
            )}

            {/* PDF Preview */}
            {pdfFile && (
              <PdfPreview
                src={resolveMediaUrl(pdfFile.file_url ?? pdfFile.file_public_url)}
                title={item.name ?? 'PDF'}
                height={700}
              />
            )}

            {/* Rich Text Content */}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:text-slate-600 prose-img:rounded-3xl prose-img:max-w-[60%] prose-img:h-auto prose-strong:text-slate-900">
              {item.description ? (
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                   <p className="text-slate-400 italic">Für diesen Artikel stehen derzeit nur die Basisinformationen zur Verfügung.</p>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="font-display text-2xl font-bold text-slate-900">{t('gallery')}</h2>
                   <div className="h-px flex-1 bg-slate-100 ml-6" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] aspect-square bg-slate-100 ring-1 ring-slate-200 ring-inset"
                    >
                      {img.image_url ? (
                        <Image
                          src={resolveMediaUrl(img.image_url)}
                          alt={img.alt ?? img.title ?? ''}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="text-slate-300" size={32} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white text-xs font-medium truncate">{img.title || 'Bild vergrößern'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
