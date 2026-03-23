import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { ProductsCarousel } from '@/components/sections/ProductsCarousel';
import { ReferencesCarousel } from '@/components/sections/ReferencesCarousel';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { LibrarySection } from '@/components/sections/LibrarySection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { getProducts, getServices, getReferences, getReviews, getLibraryItems } from '@ensotek/core/services';
import type { Product, Service, Reference, Review } from '@ensotek/core/types';
import type { LibraryItem } from '@ensotek/core/types';
import { apiFetchWithLocale } from '@/lib/api';
import { fetchSetting } from '@/i18n/server';

export const metadata: Metadata = {
  title: 'Kühlturm — Professionelle Kühllösungen',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tHero, tProducts, tServices, tRefs, tTestimonials, tLibrary, tNewsletter, tCommon] = await Promise.all([
    getTranslations('home.hero'),
    getTranslations('home.products'),
    getTranslations('home.services'),
    getTranslations('home.references'),
    getTranslations('home.testimonials'),
    getTranslations('home.library'),
    getTranslations('home.newsletter'),
    getTranslations('common'),
  ]);

  const [[productsResult, servicesResult, refsResult, reviewsResult, libraryResult], contactInfoRaw] = await Promise.all([
    Promise.allSettled([
      apiFetchWithLocale<Product[]>('/products', locale, { params: { is_featured: true, limit: 9 } }),
      apiFetchWithLocale<Service[]>('/services', locale, { params: { featured: true } }),
      apiFetchWithLocale<Reference[]>('/references', locale, { params: { is_featured: true, limit: 8 } }),
      apiFetchWithLocale<Review[]>('/reviews', locale, { params: { is_active: true, is_approved: true, limit: 9 } }),
      apiFetchWithLocale<LibraryItem[]>('/library', locale, { params: { featured: true, is_active: true, limit: 6 } }),
    ]),
    fetchSetting('contact_info', locale),
  ]);

  const featuredProducts: Product[] =
    productsResult.status === 'fulfilled' && productsResult.value
      ? (Array.isArray(productsResult.value)
          ? productsResult.value
          : (productsResult.value as any).data ?? []
        ).slice(0, 9)
      : [];

  const featuredServices: Service[] =
    servicesResult.status === 'fulfilled'
      ? (servicesResult.value as Service[]).slice(0, 4)
      : [];

  const featuredRefs: Reference[] =
    refsResult.status === 'fulfilled'
      ? (refsResult.value as Reference[]).slice(0, 8)
      : [];

  const featuredReviews: Review[] =
    reviewsResult.status === 'fulfilled' && reviewsResult.value
      ? (Array.isArray(reviewsResult.value)
          ? reviewsResult.value
          : (reviewsResult.value as any).data ?? []
        ).slice(0, 9)
      : [];

  const featuredLibrary: LibraryItem[] =
    libraryResult.status === 'fulfilled'
      ? (libraryResult.value as LibraryItem[]).slice(0, 6)
      : [];

  const contactInfo = contactInfoRaw?.value as { phones?: string[] } | null ?? null;
  const phone = contactInfo?.phones?.[0] ?? null;

  return (
    <main>
      {/* Hero Slider */}
      <HeroSlider
        locale={locale}
        title={tHero('title')}
        subtitle={tHero('subtitle')}
        ctaLabel={tHero('cta')}
        ctaSecondaryLabel={tHero('ctaSecondary')}
      />

      {/* Products Carousel */}
      <ProductsCarousel
        products={featuredProducts}
        locale={locale}
        title={tProducts('title')}
        subtitle={tProducts('subtitle')}
        viewAllLabel={tCommon('viewAll')}
      />

      {/* Services — grid (2 cols, list-style) */}
      {featuredServices.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
                {tServices('title')}
              </h2>
              <p className="mt-2 text-slate-500">{tServices('subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/${locale}/service/${service.slug}`}
                  className="group flex gap-4 p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-1 shrink-0"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* References Carousel */}
      <ReferencesCarousel
        references={featuredRefs}
        locale={locale}
        title={tRefs('title')}
        subtitle={tRefs('subtitle')}
        viewAllLabel={tCommon('viewAll')}
      />

      {/* Library — featured knowledge base items */}
      <LibrarySection
        items={featuredLibrary}
        locale={locale}
        title={tLibrary('title')}
        subtitle={tLibrary('subtitle')}
        viewAllLabel={tCommon('viewAll')}
      />

      {/* Testimonials Carousel + Review form */}
      <TestimonialsSection
        reviews={featuredReviews}
        title={tTestimonials('title')}
        subtitle={tTestimonials('subtitle')}
        labels={{
          writeReview: tTestimonials('writeReview'),
          modalTitle: tTestimonials('modalTitle'),
          nameLabel: tTestimonials('nameLabel'),
          emailLabel: tTestimonials('emailLabel'),
          ratingLabel: tTestimonials('ratingLabel'),
          reviewTitle: tTestimonials('reviewTitle'),
          commentLabel: tTestimonials('commentLabel'),
          submitLabel: tTestimonials('submitLabel'),
          submittingLabel: tTestimonials('submittingLabel'),
          successMessage: tTestimonials('successMessage'),
          successDetail: tTestimonials('successDetail'),
          cancelLabel: tTestimonials('cancelLabel'),
          closeLabel: tTestimonials('closeLabel'),
          placeholderName: tTestimonials('placeholderName'),
          placeholderEmail: tTestimonials('placeholderEmail'),
          placeholderTitle: tTestimonials('placeholderTitle'),
          placeholderComment: tTestimonials('placeholderComment'),
        }}
      />

      {/* Offer CTA */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="inline-block text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                {tCommon('freeOfObligation')}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {tCommon('offerCtaTitle')}
              </h2>
              <p className="text-slate-300 max-w-lg">{tCommon('offerCtaSubtitle')}</p>
            </div>
            <Link
              href={`/${locale}/offer`}
              className="inline-flex items-center gap-2 shrink-0 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              {tCommon('requestOffer')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection
        locale={locale}
        title={tNewsletter('title')}
        subtitle={tNewsletter('subtitle')}
        placeholder={tNewsletter('placeholder')}
        submitLabel={tNewsletter('submitLabel')}
        submittingLabel={tNewsletter('submittingLabel')}
        successMessage={tNewsletter('successMessage')}
        errorMessage={tNewsletter('errorMessage')}
        privacyNote={tNewsletter('privacyNote')}
      />

      {/* Contact CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Haben Sie Fragen?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Unser Team berät Sie gerne persönlich zu unseren Produkten und Dienstleistungen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              <Mail size={16} />
              {tCommon('contactUs')}
            </Link>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
              >
                <Phone size={16} />
                {phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
