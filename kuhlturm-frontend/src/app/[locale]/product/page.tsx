import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProducts, getCategories } from '@ensotek/core/services';
import type { Product, Category } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Produkte',
    description: 'Hochwertige Kühltürme und Komponenten für Industrie und Gewerbe.',
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('products');
  const tCommon = await getTranslations('common');

  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProducts(API_BASE_URL, {
      language: locale,
      is_active: true,
      item_type: 'product',
      ...(categorySlug ? { category_slug: categorySlug } : {}),
      limit: 60,
    }),
    getCategories(API_BASE_URL, {
      language: locale,
      module_key: 'product',
      is_active: true,
    }),
  ]);

  const products: Product[] =
    productsResult.status === 'fulfilled'
      ? Array.isArray(productsResult.value)
        ? productsResult.value
        : productsResult.value.data
      : [];

  const categories: Category[] =
    categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];

  return (
    <main>
      {/* Page banner */}
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
          <p className="mt-3 text-slate-300 text-lg max-w-2xl">
            Hochwertige Kühltürme und Komponenten für Industrie und Gewerbe
          </p>
        </div>
      </div>

      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <Link
                href={`/${locale}/product`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !categorySlug
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Alle
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/product?category=${cat.slug}`}
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

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <p className="text-lg">{t('noResults')}</p>
              {categorySlug && (
                <Link
                  href={`/${locale}/product`}
                  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                  Alle Produkte anzeigen
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/product/${product.slug}`}
                  className="group block border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <div className="aspect-4/3 overflow-hidden bg-slate-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.alt ?? product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <span className="text-slate-300 text-5xl font-display font-bold">K</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.title}
                    </h2>
                    {product.description && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    {product.product_code && (
                      <p className="mt-2 text-xs text-slate-400 font-mono">{product.product_code}</p>
                    )}
                    <span className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 group-hover:gap-1 transition-all">
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
