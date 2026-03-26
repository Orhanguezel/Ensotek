import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Hash } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getProducts, getCategories } from '@ensotek/core/services';
import type { Product, Category } from '@ensotek/core/types';
import { apiFetchWithLocale } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ersatzteile — Ensotek Kühlturm',
    description: 'Original-Ersatzteile und Komponenten für Kühltürme — schnelle Lieferung und hohe Qualität.',
  };
}

export default async function SparePartsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('spareParts');
  const tCommon = await getTranslations('common');

  const [partsResult, categoriesResult] = await Promise.allSettled([
    apiFetchWithLocale<Product[]>('/products', locale, {
      params: {
        is_active: 1,
        item_type: 'sparepart',
        ...(categorySlug ? { category_slug: categorySlug } : {}),
        limit: 60,
      }
    }),
    apiFetchWithLocale<Category[]>('/categories', locale, {
      params: {
        module_key: 'product',
        is_active: 1,
      }
    }),
  ]);

  const parts: Product[] =
    partsResult.status === 'fulfilled' && partsResult.value
      ? partsResult.value
      : [];

  const categories: Category[] =
    categoriesResult.status === 'fulfilled' && categoriesResult.value ? categoriesResult.value : [];

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <Link
                href={`/${locale}/sparepart`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !categorySlug
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('allCategories')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/sparepart?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    categorySlug === cat.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Grid */}
          {parts.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t('noResults')}</p>
              {categorySlug && (
                <Link
                  href={`/${locale}/sparepart`}
                  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                  {t('allCategories')}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {parts.map((part) => (
                <Link
                  key={part.id}
                  href={`/${locale}/sparepart/${part.slug}`}
                  className="group block border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200 bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
                    {part.image_url ? (
                      <Image
                        src={resolveMediaUrl(part.image_url)}
                        alt={part.alt ?? part.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={40} className="text-slate-200" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {part.title}
                    </h2>
                    {part.product_code && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 font-mono">
                        <Hash size={11} />
                        {part.product_code}
                      </p>
                    )}
                    {part.description && (
                      <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">
                        {part.description}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600">
                      {tCommon('readMore')} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
