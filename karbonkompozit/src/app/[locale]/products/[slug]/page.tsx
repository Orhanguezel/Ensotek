import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { fetchRelatedContent } from '@/lib/related-content';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { buildMediaAlt } from '@/lib/media-seo';

async function fetchProduct(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/by-slug/${encodeURIComponent(slug)}?locale=${locale}&item_type=kompozit`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await fetchProduct(slug, locale);
  if (!product) return {};
  return buildPageMetadata({
    locale,
    pathname: `/products/${slug}`,
    title:
      product.meta_title ||
      (locale.startsWith('en')
        ? `${product.title} - Composite Part Details and Quote`
        : `${product.title} - Kompozit Parca Detayi ve Teklif`),
    description:
      product.meta_description ||
      (locale.startsWith('en')
        ? `Review ${product.title} for composite applications, including technical scope, production fit and project-specific quotation details.`
        : `${product.title} icin teknik kapsam, uretim uygunlugu ve proje bazli teklif detaylarini inceleyin.`),
    ogImage: product.image_url,
    includeLocaleAlternates: false,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const product = await fetchProduct(slug, locale);
  if (!product) notFound();
  const related = await fetchRelatedContent(product, slug, locale);
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.products'), href: localizedPath(locale, '/products') },
    { label: product.title },
  ];

  return (
    <div className="section-py">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.org(organizationJsonLd(locale)),
            jsonld.product({
              name: product.title,
              description: product.description,
              image: product.image_url,
              url: localizedUrl(locale, `/products/${slug}`),
              brand: 'MOE Kompozit',
            }),
            jsonld.breadcrumb(
              breadcrumbs.map((item) => ({
                name: item.label,
                url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : localizedUrl(locale, `/products/${slug}`),
              })),
            ),
          ])}
        />
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-border)]">
            {product.image_url && (
              <OptimizedImage
                src={product.image_url}
                alt={buildMediaAlt({
                  locale,
                  kind: 'product',
                  title: product.title,
                  alt: product.alt,
                  caption: product.caption,
                  description: product.description,
                })}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {product.description && (
              <div
                className="prose prose-theme max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="chip-muted rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <BrandCtaPanel
              title={t('products.requestOffer')}
              description={t('common.offerCtaDescription')}
              action={(
                <Link
                  href={`${localizedPath(locale, '/offer')}?product=${encodeURIComponent(product.title)}`}
                  className="btn-contrast mt-5 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  {t('nav.offer')}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <RelatedLinks
            title={t('common.relatedProducts')}
            hrefBase={localizedPath(locale, '/products')}
            items={related.products}
          />
          <RelatedLinks
            title={t('common.relatedGallery')}
            hrefBase={localizedPath(locale, '/gallery')}
            items={related.galleries}
          />
          <RelatedLinks
            title={t('common.relatedArticles')}
            hrefBase={localizedPath(locale, '/blog')}
            items={related.blogPosts}
          />
        </div>
      </div>
    </div>
  );
}
