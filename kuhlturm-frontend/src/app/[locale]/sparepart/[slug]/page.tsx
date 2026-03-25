import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Hash, Tag, ArrowLeft, Package } from 'lucide-react';
import { getProductBySlug, getProducts, getSiteSetting } from '@ensotek/core/services';
import type { Product } from '@ensotek/core/types';
import { getProductBySlugWithLocale, getProductsWithLocale } from '@/lib/api';
import { fetchSetting } from '@/i18n/server';
import { resolveMediaUrl } from '@/lib/media';
import { SparePartOfferButton } from '@/components/sections/SparePartOfferButton';
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
    const part = (raw as unknown as { data?: Product })?.data ?? raw;
    return {
      title: part.meta_title || part.title,
      description: part.meta_description || part.description || undefined,
    };
  } catch {
    return { title: 'Ersatzteil' };
  }
}

export default async function SparePartDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tCommon, tReviews] = await Promise.all([
    getTranslations('spareParts'),
    getTranslations('common'),
    getTranslations('reviews'),
  ]);

  let part: Product;
  try {
    const raw = await getProductBySlugWithLocale(slug, locale);
    part = (raw as unknown as { data?: Product })?.data ?? raw;
    if (!part) notFound();
  } catch {
    notFound();
  }

  // Guard: must be a spare part
  if (part.item_type !== 'sparepart') notFound();

  // Related spare parts (same category, excluding current)
  const relatedRaw = await getProductsWithLocale(locale, {
    is_active: 1,
    item_type: 'sparepart',
    ...(part.category_id ? { category_id: part.category_id } : {}),
    limit: 5,
  });

  const relatedAll: Product[] = (relatedRaw as any) ?? [];

  const relatedParts = relatedAll.filter((p) => p.id !== part.id).slice(0, 4);

  const hasSpecs = part.specifications && Object.keys(part.specifications).length > 0;
  const hasTags = part.tags && part.tags.length > 0;

  // Contact info
  const contactInfoRaw = await fetchSetting('contact_info', locale, { revalidate: 3600 });
  const contactInfo: any = contactInfoRaw?.value || {};
  const whatsappPhone = contactInfo.whatsappNumber || contactInfo.phones?.[0] || '';
  const waMessage = `Guten Tag! Ich benötige ein Ersatzteil: ${part.title}${part.product_code ? ` (Art.-Nr.: ${part.product_code})` : ''}. Bitte um Angebot.`;

  const galleryImages: string[] = [];
  if (part.image_url) galleryImages.push(part.image_url);
  if (Array.isArray(part.images)) {
    for (const img of part.images) {
      if (img && !galleryImages.includes(img)) galleryImages.push(img);
    }
  }

  return (
    <main>
      {/* Breadcrumb banner */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href={`/${locale}/sparepart`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-white truncate max-w-xs">{part.title}</span>
          </nav>
        </div>
      </div>

      {/* Detail */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">

            {/* Image */}
            <div className="sticky top-8">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-50">
                {galleryImages.length > 0 ? (
                  <Image
                    src={resolveMediaUrl(galleryImages[0])}
                    alt={part.alt ?? part.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={80} className="text-slate-200" />
                  </div>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      <Image
                        src={resolveMediaUrl(img)}
                        alt={`${part.title} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {/* Type badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wide mb-3">
                Ersatzteil
              </span>

              {part.category && (
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                  {part.category.name}
                </p>
              )}

              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {part.title}
              </h1>

              {part.product_code && (
                <p className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-600 font-mono">
                  <Hash size={13} />
                  {t('partCode')}: {part.product_code}
                </p>
              )}

              {part.description && (
                <div
                  className="mt-6 text-slate-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: part.description }}
                />
              )}

              {/* Tags */}
              {hasTags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {part.tags!.map((tag) => (
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
                <SparePartOfferButton
                  locale={locale}
                  partId={part.id}
                  partTitle={part.title}
                  partCode={part.product_code ?? undefined}
                  label={t('requestOffer')}
                />
                {whatsappPhone && (
                  <WhatsAppButton
                    phone={whatsappPhone}
                    message={waMessage}
                    label={tCommon('whatsappAsk')}
                  />
                )}
                <Link
                  href={`/${locale}/sparepart`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t('backToParts')}
                </Link>
              </div>
            </div>
          </div>

          {/* Specs table */}
          {hasSpecs && (
            <div className="mt-16 pt-16 border-t border-slate-100">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                {t('specs')}
              </h2>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(part.specifications!).map(([key, value], i) => (
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
              path={`/${locale}/sparepart/${part.slug}`}
              title={part.title}
              labels={{
                title: tCommon('shareTitle'),
                copyLink: tCommon('copyLink'),
                copied: tCommon('copied'),
              }}
            />
          </div>
        </div>
      </section>

      {/* Related parts */}
      {relatedParts.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              {t('relatedParts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedParts.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/sparepart/${p.slug}`}
                  className="group block border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
                    {p.image_url ? (
                      <Image
                        src={resolveMediaUrl(p.image_url)}
                        alt={p.alt ?? p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-slate-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                      {p.title}
                    </h3>
                    {p.product_code && (
                      <p className="mt-1 text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Hash size={10} />
                        {p.product_code}
                      </p>
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
        targetId={part.id}
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

      {/* CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 text-lg mb-8">{t('ctaSubtitle')}</p>
          <Link
            href={`/${locale}/offer`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Package size={18} />
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
