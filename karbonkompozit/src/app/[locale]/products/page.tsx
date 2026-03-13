import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { getFallbackProducts } from '@/lib/content-fallbacks';
import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';

async function fetchProducts(locale: string, categorySlug?: string) {
  const params = new URLSearchParams({
    item_type: 'kompozit',
    is_active: '1',
    locale,
    limit: '50',
  });
  if (categorySlug) params.set('category_slug', categorySlug);
  try {
    const res = await fetch(`${API_BASE_URL}/products?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchCategories(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories?module_key=kompozit&is_active=1&locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'products' });
  return buildPageMetadata({
    locale,
    pathname: '/products',
    title: locale.startsWith('en')
      ? `${t('title')} - Carbon Fiber, FRP and Fiberglass Parts`
      : `${t('title')} - Karbon Fiber, CTP ve Cam Elyaf Parcalar`,
    description: t('description'),
    noIndex: Boolean(category),
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale });

  const [products, categories] = await Promise.all([
    fetchProducts(locale, category),
    fetchCategories(locale),
  ]);
  const fallbackProducts = getFallbackProducts(locale);
  const visibleProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <div className="section-py">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: t('products.title'),
              description: t('products.description'),
              url: localizedUrl(locale, '/products'),
              mainEntity: jsonld.itemList(
                visibleProducts.slice(0, 12).map((item: any) => ({
                  name: item.title,
                  url: item.slug ? localizedUrl(locale, `/products/${item.slug}`) : localizedUrl(locale, '/offer'),
                })),
              ),
            }),
          ])}
        />
        <SectionHeader
          title={t('products.title')}
          description={t('products.description')}
        />

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href={localizedPath(locale, '/products')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !category
                  ? 'chip-brand'
                  : 'chip-muted hover:bg-[var(--color-border-strong)]'
              }`}
            >
              {t('products.allCategories')}
            </Link>
            {categories.map((c: any) => (
              <Link
                key={c.id}
                href={`${localizedPath(locale, '/products')}?category=${encodeURIComponent(c.slug)}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c.slug
                    ? 'chip-brand'
                    : 'chip-muted hover:bg-[var(--color-border-strong)]'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product grid */}
        {products.length === 0 ? (
          <>
            <SeoIssueBeacon
              type="soft-404"
              pathname={localizedPath(locale, '/products')}
              reason={category ? 'category-filter-empty' : 'products-list-empty'}
            />
            <p className="mt-12 text-center text-[var(--color-text-secondary)]">
              {t('products.noProducts')}
            </p>
            <p className="mt-3 text-center text-sm text-[var(--color-text-muted)]">
              {locale === 'en'
                ? 'Sample product titles are shown below until the live product feed becomes available.'
                : 'Canli urun akisi gelene kadar asagida ornek urun basliklari gosterilmektedir.'}
            </p>
          </>
        ) : (
          null
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((p: any) => (
            <ListingCard
              key={p.id ?? p.title}
              href={p.slug ? localizedPath(locale, `/products/${p.slug}`) : `${localizedPath(locale, '/offer')}?product=${encodeURIComponent(p.title)}`}
              title={p.title}
              description={p.description}
              imageSrc={p.image_url}
              imageAlt={buildMediaAlt({
                locale,
                kind: 'product',
                title: p.title,
                alt: p.alt,
                caption: p.caption,
                description: p.description,
              })}
              imageSizes="(max-width: 768px) 50vw, 25vw"
              imageAspectClassName="aspect-[4/3]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
