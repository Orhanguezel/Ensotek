import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Tag, Hash, ArrowLeft } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getProductBySlug, getProducts, getSiteSetting } from '@ensotek/core/services';
import type { Product } from '@ensotek/core/types';
import { getProductBySlugWithLocale, getProductsWithLocale } from '@/lib/api';
import { fetchSetting } from '@/i18n/server';
import { resolveMediaUrl } from '@/lib/media';
import { ProductGallery } from '@/components/sections/ProductGallery';
import { ProductOfferButton } from '@/components/sections/ProductOfferButton';
import { WhatsAppButton } from '@/components/sections/WhatsAppButton';
import { ContactInfoCard, type ContactInfo } from '@/components/sections/ContactInfoCard';
import { SocialShareCard } from '@/components/sections/SocialShareCard';
import { ReviewsSection } from '@/components/sections/ReviewsSection';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const raw = await getProductBySlugWithLocale(slug, locale);
    const product = (raw as unknown as { data?: Product })?.data ?? raw;
    return {
      title: product.meta_title || product.title,
      description: product.meta_description || product.description || undefined,
    };
  } catch {
    return { title: 'Produkt' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [tProducts, tCommon, tReviews] = await Promise.all([
    getTranslations('products'),
    getTranslations('common'),
    getTranslations('reviews'),
  ]);

  let product: Product;
  try {
    const raw = await getProductBySlugWithLocale(slug, locale);
    product = (raw as unknown as { data?: Product })?.data ?? raw;
    if (!product) notFound();
  } catch {
    notFound();
  }

  // Related products (same category, excluding current)
  const relatedRaw = await getProductsWithLocale(locale, {
    is_active: 1,
    item_type: 'product',
    ...(product.category_id ? { category_id: product.category_id } : {}),
    limit: 5,
  });

  const relatedAll: Product[] = (relatedRaw as any) ?? [];

  const relatedProducts = relatedAll.filter((p) => p.id !== product.id).slice(0, 3);

  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
  const hasTags = product.tags && product.tags.length > 0;

  // Contact info (for WhatsApp + ContactInfoCard)
  const contactInfoRaw = await fetchSetting('contact_info', locale, { revalidate: 3600 });
  const contactInfo: any = contactInfoRaw?.value || {};
  const whatsappPhone = contactInfo.whatsappNumber || contactInfo.phones?.[0] || '';
  const waMessage = `Guten Tag! Ich interessiere mich für das Produkt: ${product.title}. Könnten Sie mir bitte mehr Informationen geben?`;

  // Build gallery
  const galleryImages: string[] = [];
  if (product.image_url) galleryImages.push(product.image_url);
  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      if (img && !galleryImages.includes(img)) galleryImages.push(img);
    }
  }

  return (
    <main>
      <PageBanner
        locale={locale}
        variant="compact"
        breadcrumbs={[
          { label: tProducts('title'), href: `/${locale}/product` },
          { label: product.title },
        ]}
      />

      {/* Product detail */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
            {/* Image gallery */}
            <div className="sticky top-8">
              {galleryImages.length > 0 ? (
                <ProductGallery images={galleryImages} alt={product.alt ?? product.title} />
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-50">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-200 text-9xl font-display font-bold">K</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              {product.category && (
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                  {product.category.name}
                </p>
              )}

              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>

              {product.product_code && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400 font-mono">
                  <Hash size={13} />
                  {product.product_code}
                </p>
              )}

              {product.description && (
                <div
                  className="mt-6 text-slate-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Tags */}
              {hasTags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags!.map((tag) => (
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

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                <ProductOfferButton
                  locale={locale}
                  productId={product.id}
                  productTitle={product.title}
                  label={tProducts('requestOffer')}
                />
                {whatsappPhone && (
                  <WhatsAppButton
                    phone={whatsappPhone}
                    message={waMessage}
                    label={tCommon('whatsappAsk')}
                  />
                )}
                <Link
                  href={`/${locale}/product`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  {tCommon('viewAll')}
                </Link>
              </div>
            </div>
          </div>

          {/* Specifications table */}
          {hasSpecs && (
            <div className="mt-16 pt-16 border-t border-slate-100">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                {tProducts('specs')}
              </h2>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications!).map(([key, value], i) => (
                      <tr
                        key={key}
                        className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                      >
                        <td className="px-6 py-4 font-medium text-slate-700 w-2/5">{key}</td>
                        <td className="px-6 py-4 text-slate-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info & Social cards */}
      <section className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            <ContactInfoCard
              info={contactInfo}
              labels={{
                title: tCommon('contactCardTitle'),
                callUs: tCommon('callUs'),
                emailUs: tCommon('emailUs'),
                address: tCommon('addressLabel'),
                whatsapp: tCommon('whatsappContact'),
              }}
            />
            <SocialShareCard
              path={`/${locale}/product/${product.slug}`}
              title={product.title}
              labels={{
                title: tCommon('shareTitle'),
                copyLink: tCommon('copyLink'),
                copied: tCommon('copied'),
              }}
            />
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              {tProducts('relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/product/${p.slug}`}
                  className="group block border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {p.image_url ? (
                      <Image
                        src={resolveMediaUrl(p.image_url)}
                        alt={p.alt ?? p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-300 text-4xl font-display font-bold">K</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsSection
        targetType="product"
        targetId={product.id}
        locale={locale}
        labels={{
          title: tReviews('title'),
          noReviews: tReviews('noReviews'),
          beFirst: tReviews('beFirst'),
          avgRating: tReviews('avgRating'),
          totalReviews: tReviews('totalReviews'),
          helpful: tReviews('helpful'),
          adminReply: tReviews('adminReply'),
          formTitle: tReviews('formTitle'),
          nameLabel: tReviews('nameLabel'),
          emailLabel: tReviews('emailLabel'),
          ratingLabel: tReviews('ratingLabel'),
          titleLabel: tReviews('titleLabel'),
          commentLabel: tReviews('commentLabel'),
          submitLabel: tReviews('submitLabel'),
          submittingLabel: tReviews('submittingLabel'),
          successTitle: tReviews('successTitle'),
          successDetail: tReviews('successDetail'),
          errorMessage: tReviews('errorMessage'),
          namePlaceholder: tReviews('namePlaceholder'),
          emailPlaceholder: tReviews('emailPlaceholder'),
          titlePlaceholder: tReviews('titlePlaceholder'),
          commentPlaceholder: tReviews('commentPlaceholder'),
        }}
      />

      {/* Offer CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            {tProducts('ctaTitle')}
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            {tProducts('ctaSubtitle')}
          </p>
          <ProductOfferButton
            locale={locale}
            productId={product.id}
            productTitle={product.title}
            label={tProducts('requestOffer')}
          />
        </div>
      </section>
    </main>
  );
}
