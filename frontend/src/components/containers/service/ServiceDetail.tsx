// =============================================================
// FILE: src/components/containers/service/ServiceDetail.tsx
// Public Service Detail Container
// =============================================================

'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';

import {
  useGetServiceBySlugPublicQuery,
  useListServiceImagesPublicQuery,
  useGetSiteSettingByKeyQuery,
} from '@/integrations/rtk/hooks';

import type { ServiceImageDto } from '@/integrations/types/services.types';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import { localizePath } from '@/i18n/url';
import { normLocaleTag } from '@/i18n/localeUtils';

import Link from 'next/link';
import Image from 'next/image';

import { OfferSection } from '@/components/containers/offer/OfferSection';
import { OfferWhatsAppButton } from '@/components/containers/offer/OfferWhatsAppButton';

import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

const FALLBACK_IMG = '/img/project/project-thumb.jpg';

const toLocaleShort = (l: unknown) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

interface ServiceDetailProps {
  slug: string;
}

// Hizmet tip kodlarını, kullanıcıya gösterilecek label’a çevirir
const resolveServiceTypeLabel = (type: string | null | undefined, locale: string): string => {
  const isTr = locale === 'tr';
  const key = (type || '').toString();

  const mapTr: Record<string, string> = {
    maintenance_repair: 'Bakım & Onarım',
    modernization: 'Modernizasyon',
    spare_parts_components: 'Yedek Parça & Bileşenler',
    applications_references: 'Uygulamalar & Referanslar',
    engineering_support: 'Mühendislik Desteği',
    production: 'Üretim',
    other: 'Diğer Hizmetler',
  };

  const mapEn: Record<string, string> = {
    maintenance_repair: 'Maintenance & Repair',
    modernization: 'Modernization',
    spare_parts_components: 'Spare Parts & Components',
    applications_references: 'Applications & References',
    engineering_support: 'Engineering Support',
    production: 'Production',
    other: 'Other Services',
  };

  return isTr ? mapTr[key] || key : mapEn[key] || key;
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ slug }) => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_services', locale);
  const isTr = locale === 'tr';

  // ✅ default_locale DB’den
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(() => {
    const v = normLocaleTag(defaultLocaleRow?.value);
    return v || 'tr';
  }, [defaultLocaleRow?.value]);

  // Teklif formu göster / gizle + scroll
  const [showOfferForm, setShowOfferForm] = useState(false);
  const offerFormRef = useRef<HTMLDivElement | null>(null);

  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceBySlugPublicQuery(
    { slug, locale, default_locale: defaultLocale },
    { skip: !slug },
  );

  const { data: images, isLoading: isImagesLoading } = useListServiceImagesPublicQuery(
    service?.id
      ? { serviceId: service.id, locale, default_locale: defaultLocale }
      : { serviceId: '', locale, default_locale: defaultLocale },
    { skip: !service?.id },
  );

  const mainImageSrc = useMemo(() => {
    const base =
      (
        service?.featured_image_url ||
        service?.image_url ||
        (service as any)?.featured_image ||
        ''
      )?.trim() || '';
    if (!base) return FALLBACK_IMG;
    return toCdnSrc(base, 960, 540, 'fill') || FALLBACK_IMG;
  }, [service]);

  const gallery: ServiceImageDto[] = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.filter((img) => (img as any).is_active);
  }, [images]);

  const title = (service as any)?.name || ui('ui_services_detail_title', 'Service');
  const summary =
    (service as any)?.description ||
    (service as any)?.includes ||
    ui('ui_services_placeholder_summary', 'Service description is coming soon.');

  const shortSummary = excerpt(String(summary), 350);

  const backHref = localizePath(locale, '/service');

  const hasGardeningMeta = Boolean(
    (service as any)?.area ||
      (service as any)?.duration ||
      (service as any)?.maintenance ||
      (service as any)?.season,
  );
  const hasSoilMeta = Boolean(
    (service as any)?.soil_type || (service as any)?.thickness || (service as any)?.equipment,
  );

  const serviceTypeLabel = resolveServiceTypeLabel((service as any)?.type, locale);
  const categoryLabel = String((service as any)?.category_name || '');

  // --- CTA textleri (ui key’leri ile uyumlu) ---
  const moreInfoText = ui(
    'ui_services_cta_more_info',
    isTr
      ? 'Bu hizmet ile ilgili detaylı bilgi ve teknik destek için ekibimizle iletişime geçebilirsiniz.'
      : 'Contact our team for detailed information and technical support about this service.',
  );

  const whatsappText = ui(
    'ui_services_cta_whatsapp',
    isTr ? 'WhatsApp üzerinden yazın' : 'Write on WhatsApp',
  );
  const requestQuoteText = ui(
    'ui_services_cta_request_quote',
    isTr ? 'Bu hizmet için teklif iste' : 'Request a quote',
  );

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+905555555555';

  const whatsappMessage = isTr
    ? `Merhaba, "${title}" hizmeti hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`
    : `Hello, I would like to get more information and a quotation about the "${title}" service.`;

  useEffect(() => {
    if (showOfferForm && offerFormRef.current) {
      offerFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showOfferForm]);

  if (isLoading) {
    return (
      <div className="service__area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <SkeletonStack>
                <SkeletonLine style={{ height: 32 }} />
                <SkeletonLine className="mt-10" style={{ height: 20 }} />
                <SkeletonLine className="mt-10" style={{ height: 20 }} />
                <SkeletonLine className="mt-10" style={{ height: 220 }} />
              </SkeletonStack>
            </div>
            <div className="col-xl-4 col-lg-4 mt-30 mt-lg-0">
              <SkeletonStack>
                <SkeletonLine style={{ height: 140 }} />
                <SkeletonLine className="mt-10" style={{ height: 80 }} />
              </SkeletonStack>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="service__area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="section__title mb-15">
                {ui('ui_services_not_found_title', 'Service not found')}
              </h2>
              <p className="mb-20">
                {ui(
                  'ui_services_not_found_desc',
                  'The service you are looking for could not be found or is no longer available.',
                )}
              </p>
              <Link href={backHref} className="btn btn-primary">
                {ui('ui_services_back_to_list', 'Back to services')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasGallery = gallery.length > 0;

  return (
    <div className="service__area pt-120 pb-90">
      <div className="container">
        <div className="row">
          {/* LEFT */}
          <div className="col-xl-8 col-lg-8">
            <div className="service__details-wrapper mb-40">
              <div className="mb-25">
                <Link href={backHref} className="back-link d-inline-flex">
                  <span className="me-2">←</span>
                  {ui(
                    'ui_services_back_to_list',
                    isTr ? 'Hizmetlere geri dön' : 'Back to services',
                  )}
                </Link>
              </div>

              <div className="service__details-title-wrapper mb-25">
                {serviceTypeLabel ? (
                  <span className="service__details-tag">{serviceTypeLabel}</span>
                ) : null}
                <h1 className="service__details-title">{title}</h1>

                {(service as any)?.price ? (
                  <p className="service__price mt-10">
                    <strong>{ui('ui_services_price_label', 'Price')}:</strong>{' '}
                    {(service as any).price}
                  </p>
                ) : null}
              </div>

              <div className="service__details-thumb mb-30">
                <Image
                  src={mainImageSrc}
                  alt={String((service as any)?.image_alt || title)}
                  width={960}
                  height={540}
                  className="img-fluid w-100"
                />
              </div>

              <div className="service__details-content">
                <p>{shortSummary}</p>

                {(service as any)?.includes ||
                (service as any)?.material ||
                (service as any)?.warranty ? (
                  <div className="service__meta mt-25">
                    <ul>
                      {(service as any)?.includes ? (
                        <li>
                          <span>
                            {ui(
                              'ui_services_includes_label',
                              isTr ? 'Hizmet kapsamı' : 'Service includes',
                            )}
                            :
                          </span>{' '}
                          {(service as any).includes}
                        </li>
                      ) : null}

                      {(service as any)?.material ? (
                        <li>
                          <span>
                            {ui(
                              'ui_services_material_label',
                              isTr ? 'Kullanılan ekipman / malzeme' : 'Equipment / Material',
                            )}
                            :
                          </span>{' '}
                          {(service as any).material}
                        </li>
                      ) : null}

                      {(service as any)?.warranty ? (
                        <li>
                          <span>
                            {ui('ui_services_warranty_label', isTr ? 'Garanti süresi' : 'Warranty')}
                            :
                          </span>{' '}
                          {(service as any).warranty}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}

                {hasGardeningMeta || hasSoilMeta ? (
                  <div className="service__meta-box mt-30">
                    <h4 className="service__meta-title">
                      {ui(
                        'ui_services_specs_title',
                        isTr ? 'Hizmet özellikleri' : 'Service specifications',
                      )}
                    </h4>

                    <div className="row">
                      {hasGardeningMeta ? (
                        <div className="col-sm-6">
                          <ul className="service__spec-list">
                            {(service as any)?.area ? (
                              <li>
                                <span>
                                  {ui('ui_services_area_label', isTr ? 'Uygulama alanı' : 'Area')}:
                                </span>{' '}
                                {(service as any).area}
                              </li>
                            ) : null}
                            {(service as any)?.duration ? (
                              <li>
                                <span>
                                  {ui(
                                    'ui_services_duration_label',
                                    isTr ? 'Tahmini süre' : 'Duration',
                                  )}
                                  :
                                </span>{' '}
                                {(service as any).duration}
                              </li>
                            ) : null}
                            {(service as any)?.maintenance ? (
                              <li>
                                <span>
                                  {ui(
                                    'ui_services_maintenance_label',
                                    isTr ? 'Bakım periyodu' : 'Maintenance',
                                  )}
                                  :
                                </span>{' '}
                                {(service as any).maintenance}
                              </li>
                            ) : null}
                            {(service as any)?.season ? (
                              <li>
                                <span>
                                  {ui(
                                    'ui_services_season_label',
                                    isTr ? 'Önerilen dönem' : 'Season',
                                  )}
                                  :
                                </span>{' '}
                                {(service as any).season}
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      ) : null}

                      {hasSoilMeta ? (
                        <div className="col-sm-6">
                          <ul className="service__spec-list">
                            {(service as any)?.soil_type ? (
                              <li>
                                <span>{ui('ui_services_soil_type_label', 'Soil type')}:</span>{' '}
                                {(service as any).soil_type}
                              </li>
                            ) : null}
                            {(service as any)?.thickness ? (
                              <li>
                                <span>{ui('ui_services_thickness_label', 'Thickness')}:</span>{' '}
                                {(service as any).thickness}
                              </li>
                            ) : null}
                            {(service as any)?.equipment ? (
                              <li>
                                <span>{ui('ui_services_equipment_label', 'Equipment')}:</span>{' '}
                                {(service as any).equipment}
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {hasGallery ? (
                  <div className="service__gallery mt-40">
                    <h4 className="service__gallery-title">
                      {ui(
                        'ui_services_gallery_title',
                        isTr ? 'Hizmet galerisi' : 'Service gallery',
                      )}
                    </h4>

                    <div className="row">
                      {gallery.map((img: any) => {
                        const base = String(img.image_url || '').trim();
                        const src =
                          (base && (toCdnSrc(base, 400, 280, 'fill') || base)) || FALLBACK_IMG;

                        return (
                          <div className="col-md-6 col-lg-4 mb-20" key={String(img.id)}>
                            <div className="service__gallery-item">
                              <Image
                                src={src}
                                alt={String(img.alt || img.title || '')}
                                className="img-fluid w-100"
                                width={400}
                                height={280}
                              />

                              {img.title || img.caption ? (
                                <div className="service__gallery-caption">
                                  {img.title ? <strong>{img.title}</strong> : null}
                                  {img.caption ? <p className="mb-0">{img.caption}</p> : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}

                      {isImagesLoading ? (
                        <div className="col-12 mt-10" aria-hidden>
                          <SkeletonStack>
                            <SkeletonLine style={{ height: 8 }} />
                          </SkeletonStack>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {showOfferForm ? (
                  <div className="service__offer mt-40" ref={offerFormRef}>
                    <OfferSection locale={locale} contextType="service" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-xl-4 col-lg-4">
            <aside className="service__sidebar">
              <div className="service__widget mb-30">
                <h4 className="service__widget-title">
                  {ui(
                    'ui_services_sidebar_info_title',
                    isTr ? 'Hizmet bilgileri' : 'Service information',
                  )}
                </h4>

                <ul>
                  {serviceTypeLabel ? (
                    <li>
                      <span>
                        {ui('ui_services_sidebar_type', isTr ? 'Hizmet tipi' : 'Service type')}:
                      </span>{' '}
                      {serviceTypeLabel}
                    </li>
                  ) : null}

                  {categoryLabel ? (
                    <li>
                      <span>
                        {ui('ui_services_sidebar_category', isTr ? 'Kategori' : 'Category')}:
                      </span>{' '}
                      {categoryLabel}
                    </li>
                  ) : null}
                </ul>
              </div>

              <div className="service__widget service__cta-widget">
                <h4 className="service__widget-title">
                  {ui(
                    'ui_services_sidebar_cta_title',
                    isTr ? 'Detaylı bilgi ister misiniz?' : 'Need more information?',
                  )}
                </h4>

                <p className="mb-3">
                  {ui(
                    'ui_services_sidebar_cta_desc',
                    isTr
                      ? 'Bu hizmet hakkında detaylı bilgi veya özel teklif almak için bizimle iletişime geçin.'
                      : 'Contact us to get a custom offer or detailed information about this service.',
                  )}
                </p>

                <div className="d-grid gap-2">
                  <Link
                    href={localizePath(locale, '/contact')}
                    className="btn btn-primary btn-sm w-100"
                  >
                    {ui('ui_services_sidebar_cta_button', isTr ? 'İletişime geçin' : 'Contact us')}
                  </Link>

                  <OfferWhatsAppButton
                    locale={locale}
                    phone={whatsappPhone}
                    message={whatsappMessage}
                    className="btn btn-outline-success btn-sm w-100"
                  >
                    {whatsappText}
                  </OfferWhatsAppButton>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm w-100"
                    onClick={() => setShowOfferForm(true)}
                  >
                    {requestQuoteText}
                  </button>
                </div>

                <div className="mt-3">
                  <p className="small mb-2">{moreInfoText}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
