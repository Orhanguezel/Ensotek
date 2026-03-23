import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, BookOpen, ArrowRight, Download, Eye, Search, FileText, Video, HelpCircle } from 'lucide-react';
import { getLibraryItems } from '@ensotek/core/services';
import type { LibraryItem } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Wissensdatenbank (Knowledge Base) | Ensotek',
    description: 'Technische Artikel, Anleitationsvideos, Fachinformationen und Whitepapers rund um Kühlturmtechnik.',
  };
}

export default async function LibraryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q, type } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('library');

  // Fetch items based on potential search/filter
  const items: LibraryItem[] = await getLibraryItems(API_BASE_URL, {
    locale,
    sort: 'display_order',
    order: 'asc',
    is_active: 1,
    limit: 100,
    q: q || undefined,
    type: type || undefined,
  }).catch(() => []);

  const featured = items.filter((p) => p.featured === 1 && !q);
  const rest = items.filter((p) => (p.featured !== 1 || q));

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 whitespace-nowrap overflow-x-auto">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-white shrink-0">{t('title')}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Wie können wir Ihnen <span className="text-blue-500">helfen?</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl mb-10 leading-relaxed">
              Finden Sie technische Dokumentationen, Expertenwissen und Anleitungen in unserer Wissensdatenbank.
            </p>

            {/* Simple Search Form (Native submit) */}
            <form action={`/${locale}/library`} className="relative max-w-2xl group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={t('searchPlaceholder')}
                className="w-full h-16 pl-14 pr-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-900/20"
              >
                Suchen
              </button>
            </form>

            {/* Quick Badges */}
            <div className="mt-8 flex flex-wrap gap-2 text-sm text-slate-500">
              <span className="py-1 px-1.5 uppercase font-bold text-[10px] tracking-widest text-slate-600">Häufige Themen:</span>
              <Link href={`/${locale}/library?q=Kühlturm`} className="hover:text-blue-400 border-b border-transparent hover:border-blue-400/30 transition-all font-medium">Kühlturm</Link>
              <span className="text-slate-700 font-medium">•</span>
              <Link href={`/${locale}/library?q=Kühlung`} className="hover:text-blue-400 border-b border-transparent hover:border-blue-400/30 transition-all font-medium">Kühlung</Link>
              <span className="text-slate-700 font-medium">•</span>
              <Link href={`/${locale}/library?q=Ersatzteile`} className="hover:text-blue-400 border-b border-transparent hover:border-blue-400/30 transition-all font-medium">Ersatzteile</Link>
              <span className="text-slate-700 font-medium">•</span>
              <Link href={`/${locale}/library?q=Wartung`} className="hover:text-blue-400 border-b border-transparent hover:border-blue-400/30 transition-all font-medium">Wartung</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      {!q && !type && featured.length > 0 && (
        <section className="py-16 md:py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-slate-900">{t('featured')}</h2>
                <div className="h-1.5 w-12 bg-blue-600 mt-2 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((item) => (
                <LibraryFeaturedCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles / Search Results */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">
                {q ? `Ergebnisse für "${q}"` : t('allItems')}
              </h2>
              <p className="text-slate-500 mt-1">{items.length} {t('allItems').toLowerCase()}</p>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${locale}/library`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!type ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {t('allCategories')}
              </Link>
              {['article', 'video', 'pdf', 'guide'].map((tVal) => (
                <Link
                  key={tVal}
                  href={`/${locale}/library?type=${tVal}${q ? `&q=${q}` : ''}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${type === tVal ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {tVal}s
                </Link>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-xs border border-slate-200">
              <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('noResults')}</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Versuchen Sie es mit allgemeineren Begriffen oder setzen Sie die Filter zurück.
              </p>
              <Link
                href={`/${locale}/library`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors font-semibold"
              >
                Zurück zur Übersicht
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((item) => (
                <LibraryCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-2xl mb-8">
            <HelpCircle size={32} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Brauchen Sie persönliche Unterstützung?</h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl">
            Sollten Sie in unserer Wissensdatenbank nicht fündig werden, steht Ihnen unser Expertenteam gerne für technische Anfragen zur Verfügung.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-xl shadow-blue-500/20"
          >
            Technischen Support kontaktieren
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ── Featured Card ───────────────────────────────────────────────────── */

function LibraryFeaturedCard({ item, locale }: { item: LibraryItem, locale: string }) {
  return (
    <Link
      href={`/${locale}/library/${item.slug}`}
      className="group relative h-[450px] flex flex-col justify-end bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-500/10"
    >
      <div className="absolute inset-0 z-0">
        {(item.featured_image || item.image_url) ? (
          <img
            src={(item.featured_image ?? item.image_url)!}
            alt={item.image_alt ?? item.name ?? ''}
            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-900 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] uppercase font-bold tracking-widest">
            {item.type || 'Dokument'}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-xs text-slate-400 font-medium">{item.views} Aufrufe</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-4 leading-tight group-hover:text-blue-300 transition-colors">
          {item.name}
        </h3>
        <p className="text-slate-300 line-clamp-2 text-lg mb-8 leading-relaxed max-w-lg">
          {(item as any).summary || 'Erfahren Sie mehr über herstellerunabhängige Lösungen und technische Innovationen in unserer Datenbank.'}
        </p>
        <div className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold transition-all border border-white/20">
          Beitrag lesen
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

/* ── Regular Card ───────────────────────────────────────────────────── */

function LibraryCard({
  item,
  locale
}: {
  item: LibraryItem;
  locale: string;
}) {
  const Icon = item.type === 'video' ? Video : item.type === 'pdf' ? Download : FileText;

  return (
    <Link
      href={`/${locale}/library/${item.slug}`}
      className="group flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 h-full overflow-hidden"
    >
      <div className="aspect-16/10 relative overflow-hidden bg-slate-100 shrink-0">
        {(item.featured_image || item.image_url) ? (
          <img
            src={(item.featured_image ?? item.image_url)!}
            alt={item.image_alt ?? item.name ?? ''}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200">
            <BookOpen className="text-slate-300" size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-xs flex items-center gap-1.5 border border-slate-100">
            <Icon size={14} className="text-blue-600" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">{item.type || 'Inhalt'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
           <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
           <span className="w-1 h-1 rounded-full bg-slate-200" />
           <span>{new Date(item.created_at).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-4 line-clamp-2 leading-tight">
          {item.name}
        </h3>

        {(item as any).summary && (
          <p className="text-slate-500 line-clamp-2 text-sm md:text-base mb-6 leading-relaxed">
            {(item as any).summary}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:text-blue-500">
          <span>Weiterlesen</span>
          <div className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
             <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
