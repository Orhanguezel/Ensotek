import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, CheckCircle, Wrench, Shield, Tag } from 'lucide-react';
import { getServiceBySlug, getServices, getSiteSetting } from '@ensotek/core/services';
import type { Service } from '@ensotek/core/types';
import { getServiceBySlugWithLocale, getServicesWithLocale } from '@/lib/api';
import { fetchSetting } from '@/i18n/server';
import { ServiceOfferButton } from '@/components/sections/ServiceOfferButton';
import { WhatsAppButton } from '@/components/sections/WhatsAppButton';
import { ContactInfoCard, type ContactInfo } from '@/components/sections/ContactInfoCard';
import { SocialShareCard } from '@/components/sections/SocialShareCard';
import { ReviewsSection } from '@/components/sections/ReviewsSection';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlugWithLocale(slug, locale);
  if (!service) return { title: 'Dienstleistung' };
  return {
    title: (service as any).meta_title || (service as any).name,
    description: (service as any).meta_description || (service as any).description?.replace(/<[^>]*>/g, '').slice(0, 160) || undefined,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [tServices, tCommon, tReviews] = await Promise.all([
    getTranslations('services'),
    getTranslations('common'),
    getTranslations('reviews'),
  ]);

  const service = await getServiceBySlugWithLocale(slug, locale);
  if (!service) {
    notFound();
  }

  // Related services (excluding current)
  const allServices = await getServicesWithLocale(locale, {
    is_active: 1,
  }).then(d => d ?? []);

  const relatedServices = allServices.filter((s: Service) => s.id !== service.id).slice(0, 3);

  // Parse tags (stored as comma-separated string)
  const tags = service.tags
    ? (service.tags as string)
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  // Contact info
  const contactInfoRaw = await fetchSetting('contact_info', locale, { revalidate: 3600 });
  const contactInfo: any = contactInfoRaw?.value || {};
  const whatsappPhone = contactInfo.whatsappNumber || contactInfo.phones?.[0] || '';
  const waMessage = `Guten Tag! Ich möchte mehr über die Dienstleistung erfahren: ${service.name}. Bitte nehmen Sie Kontakt mit mir auf.`;

  // Build gallery
  const galleryImages: string[] = [];
  if (service.image_url) galleryImages.push(service.image_url);
  if (Array.isArray(service.images)) {
    for (const img of service.images) {
      if (img.image_url && !galleryImages.includes(img.image_url)) {
        galleryImages.push(img.image_url);
      }
    }
  }

  return (
    <main>
      {/* Breadcrumb banner */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {tCommon('home')}
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href={`/${locale}/service`} className="hover:text-white transition-colors">
              {tServices('title')}
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-white truncate max-w-xs">{service.name}</span>
          </nav>
        </div>
      </div>

      {/* Service detail */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
            {/* Image */}
            <div className="sticky top-8">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-50">
                {galleryImages.length > 0 ? (
                  <img
                    src={galleryImages[0]}
                    alt={service.image_alt ?? service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-200 text-9xl font-display font-bold">K</span>
                  </div>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={img}
                        alt={`${service.name} ${i + 2}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service info */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {service.name}
              </h1>

              {service.description && (
                <div
                  className="mt-6 text-slate-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              )}

              {/* Info cards */}
              <div className="mt-8 grid grid-cols-1 gap-3">
                {service.includes && (
                  <div className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <CheckCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        {tServices('includes')}
                      </p>
                      <p className="text-sm text-blue-800">{service.includes}</p>
                    </div>
                  </div>
                )}
                {service.material && (
                  <div className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Wrench size={20} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        {tServices('material')}
                      </p>
                      <p className="text-sm text-slate-700">{service.material}</p>
                    </div>
                  </div>
                )}
                {service.warranty && (
                  <div className="flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                    <Shield size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                        {tServices('warranty')}
                      </p>
                      <p className="text-sm text-green-800">{service.warranty}</p>
                    </div>
                  </div>
                )}
                {service.price && (
                  <div className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-slate-400 font-bold text-sm">€</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        {tServices('price')}
                      </p>
                      <p className="text-sm text-slate-700">{service.price}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
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
                <ServiceOfferButton
                  locale={locale}
                  serviceId={service.id}
                  serviceName={service.name}
                  label={tServices('requestService')}
                />
                {whatsappPhone && (
                  <WhatsAppButton
                    phone={whatsappPhone}
                    message={waMessage}
                    label={tCommon('whatsappAsk')}
                  />
                )}
                <Link
                  href={`/${locale}/service`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  {tCommon('viewAll')}
                </Link>
              </div>
            </div>
          </div>
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
              path={`/${locale}/service/${service.slug}`}
              title={service.name}
              labels={{
                title: tCommon('shareTitle'),
                copyLink: tCommon('copyLink'),
                copied: tCommon('copied'),
              }}
            />
          </div>
        </div>
      </section>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              {tServices('otherServices')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/${locale}/service/${s.slug}`}
                  className="group flex gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  {s.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={s.image_url}
                        alt={s.image_alt ?? s.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {s.description.replace(/<[^>]*>/g, '')}
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
        targetType="service"
        targetId={service.id}
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
            {tServices('ctaTitle')}
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            {tServices('ctaSubtitle')}
          </p>
          <ServiceOfferButton
            locale={locale}
            serviceId={service.id}
            serviceName={service.name}
            label={tServices('requestService')}
          />
        </div>
      </section>
    </main>
  );
}
