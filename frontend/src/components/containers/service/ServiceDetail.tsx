// =============================================================
// FILE: src/components/containers/service/ServiceDetail.tsx
// Ensotek – Public Service Detail Container (FINAL)
// - Locale: ✅ useLocaleShort() (DB driven)
// - Static texts: ui(...) + single-language fallback (TR)
// - Hero: thumbnail click => changes hero image
// - Hero click => opens modal at selected image
// - Gallery: grid + captions + lightbox
// - Quote CTA: clear button
// - Contact: ContactCtaCard imported
// - No duplicate "service type" in sidebar
// =============================================================

'use client';

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  useGetServiceBySlugPublicQuery,
  useListServiceImagesPublicQuery,
  useGetSiteSettingByKeyQuery,
} from '@/integrations/rtk/hooks';

import type { ServiceImageDto } from '@/integrations/types/services.types';

// ✅ Pattern
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import { normLocaleTag } from '@/i18n/localeUtils';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import  OfferSection  from '@/components/containers/offer/OfferSection';
import InfoContactCard from '@/components/common/public/InfoContactCard';

import ImageLightboxModal, {
  type LightboxImage,
} from '@/components/common/public/ImageLightboxModal';

import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

const FALLBACK_IMG = '/img/project/project-thumb.jpg';

type ServiceDetailProps = { slug: string };

const safeUiText = (
  ui: (k: string, f?: any) => any,
  key: string,
  fallback: string,
  opts?: { maxLen?: number },
): string => {
  const fb = String(fallback ?? '').trim();
  const raw = ui(key, fb);
  const s = String(raw ?? '').trim();

  if (!s) return fb;
  if (s === key) return fb;
  if (s.startsWith(key)) return fb;
  if (opts?.maxLen && s.length > opts.maxLen) return fb;

  return s;
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ slug }) => {
  // ✅ DB-driven locale
  const locale = useLocaleShort() || 'de';
  const { ui } = useUiSection('ui_services', locale as any);

  // ✅ default_locale DB’den (fallback arama için)
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(
    () => normLocaleTag(defaultLocaleRow?.value) || 'de',
    [defaultLocaleRow?.value],
  );

  const [showOfferForm, setShowOfferForm] = useState(false);
  const offerFormRef = useRef<HTMLDivElement | null>(null);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // ✅ Selected image index (hero uses this)
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const backHref = useMemo(() => localizePath(locale as any, '/service'), [locale]);

  const title = useMemo(() => {
    const t = String((service as any)?.name || '').trim();
    return t || safeUiText(ui as any, 'ui_services_detail_title', 'Hizmet');
  }, [service, ui]);

  const summary = useMemo(() => {
    const raw =
      (service as any)?.description ||
      (service as any)?.includes ||
      safeUiText(
        ui as any,
        'ui_services_placeholder_summary',
        'Hizmet açıklaması yakında eklenecektir.',
      );
    return String(raw || '').trim();
  }, [service, ui]);

  const shortSummary = useMemo(() => excerpt(String(summary), 380), [summary]);

  const categoryLabel = useMemo(
    () => String((service as any)?.category_name || '').trim(),
    [service],
  );

  const gallery: ServiceImageDto[] = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.filter((img) => (img as any).is_active);
  }, [images]);

  const lightboxImages = useMemo<LightboxImage[]>(() => {
    if (!gallery.length) return [];
    return gallery
      .map((img: any) => {
        const rawBase = String(img.image_url || '').trim();
        if (!rawBase) return null;

        const raw = toCdnSrc(rawBase, 1600, 1000, 'fit') || rawBase;
        const thumb = toCdnSrc(rawBase, 560, 380, 'fill') || rawBase;
        const alt = String(img.alt || img.title || title).trim() || title;

        return { raw, thumb, alt };
      })
      .filter(Boolean) as LightboxImage[];
  }, [gallery, title]);

  // ✅ keep selectedIndex valid when gallery changes
  useEffect(() => {
    if (!lightboxImages.length) {
      setSelectedIndex(0);
      return;
    }
    setSelectedIndex((prev) => {
      const max = lightboxImages.length - 1;
      if (prev < 0) return 0;
      if (prev > max) return max;
      return prev;
    });
  }, [lightboxImages.length]);

  // ✅ HERO image (selected thumbnail)
  const heroImage = useMemo(() => {
    // If gallery exists use selected; else fallback to service featured
    if (lightboxImages.length) {
      const idx = Math.max(0, Math.min(selectedIndex, lightboxImages.length - 1));
      return lightboxImages[idx];
    }

    const base =
      (
        (service as any)?.featured_image_url ||
        (service as any)?.image_url ||
        (service as any)?.featured_image ||
        ''
      )?.trim() || '';

    const raw = base ? toCdnSrc(base, 1200, 675, 'fill') || base : FALLBACK_IMG;
    return {
      raw,
      thumb: raw,
      alt: String((service as any)?.image_alt || title).trim() || title,
    } as LightboxImage;
  }, [lightboxImages, selectedIndex, service, title]);

  const heroSrc = useMemo(
    () => String(heroImage?.raw || FALLBACK_IMG).trim() || FALLBACK_IMG,
    [heroImage],
  );
  const heroAlt = useMemo(
    () => String(heroImage?.alt || title).trim() || title,
    [heroImage, title],
  );

  const hasMetaBlock = Boolean(
    (service as any)?.includes || (service as any)?.material || (service as any)?.warranty,
  );

  const hasSpecs =
    Boolean(
      (service as any)?.area ||
        (service as any)?.duration ||
        (service as any)?.maintenance ||
        (service as any)?.season,
    ) ||
    Boolean(
      (service as any)?.soil_type || (service as any)?.thickness || (service as any)?.equipment,
    );

  // ✅ Thumbnail click: change hero only
  const onThumbSelect = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

  // ✅ Hero click: open modal at selected image
  const onHeroOpenLightbox = useCallback(() => {
    if (!lightboxImages.length) return;
    setLightboxOpen(true);
  }, [lightboxImages.length]);

  // ✅ When lightbox index changes (next/prev), also sync hero + thumbs
  const onLightboxIndexChange = useCallback((next: number) => {
    setSelectedIndex(next);
  }, []);

  useEffect(() => {
    if (showOfferForm && offerFormRef.current) {
      offerFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showOfferForm]);

  if (isLoading) {
    return (
      <div className="service__area pt-120 pb-90 ens-service__detail">
        <div className="container">
          <div className="row g-4">
            <div className="col-xl-8 col-lg-8">
              <div className="blog__content-wrapper">
                <SkeletonStack>
                  <SkeletonLine style={{ height: 32 }} />
                  <SkeletonLine className="mt-10" style={{ height: 18 }} />
                  <SkeletonLine className="mt-10" style={{ height: 18 }} />
                  <SkeletonLine className="mt-20" style={{ height: 260 }} />
                </SkeletonStack>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4">
              <div className="blog__content-wrapper">
                <SkeletonStack>
                  <SkeletonLine style={{ height: 160 }} />
                  <SkeletonLine className="mt-10" style={{ height: 90 }} />
                </SkeletonStack>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="service__area pt-120 pb-90 ens-service__detail">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="blog__content-wrapper text-center">
                <h2 className="section__title mb-15">
                  {safeUiText(ui as any, 'ui_services_not_found_title', 'Hizmet bulunamadı')}
                </h2>
                <p className="mb-20">
                  {safeUiText(
                    ui as any,
                    'ui_services_not_found_desc',
                    'Aradığınız hizmet bulunamadı veya yayından kaldırıldı.',
                    { maxLen: 180 },
                  )}
                </p>
                <Link href={backHref} className="tp-btn">
                  {safeUiText(ui as any, 'ui_services_back_to_list', 'Hizmetlere geri dön')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasGallery = gallery.length > 0;

  const quoteBtnText = safeUiText(
    ui as any,
    'ui_services_cta_request_quote',
    'Bu hizmet için teklif iste',
    { maxLen: 70 },
  );

  const moreInfoText = safeUiText(
    ui as any,
    'ui_services_cta_more_info',
    'Bu hizmet ile ilgili detaylı bilgi ve teknik destek için ekibimizle iletişime geçebilirsiniz.',
    { maxLen: 240 },
  );

  const contactTitle = safeUiText(ui as any, 'ui_services_contact_title', 'İletişim', {
    maxLen: 40,
  });
  const contactDesc = safeUiText(
    ui as any,
    'ui_services_contact_desc',
    'Detaylı bilgi ve teknik destek için bize ulaşın.',
    { maxLen: 140 },
  );

  const galleryTitle = safeUiText(ui as any, 'ui_services_gallery_title', 'Hizmet Galerisi');

  const selectedIsActive = (idx: number) => idx === selectedIndex;

  return (
    <div className="service__area pt-120 pb-90 ens-service__detail">
      <div className="container">
        <div className="row g-4">
          {/* LEFT */}
          <div className="col-xl-8 col-lg-8">
            <div className="blog__content-wrapper">
              <div className="ens-service__back mb-25">
                <Link href={backHref} className="ens-service__backLink">
                  <span aria-hidden>←</span>
                  {safeUiText(ui as any, 'ui_services_back_to_list', 'Hizmetlere geri dön')}
                </Link>
              </div>

              <div className="ens-service__head mb-25">
                <div className="ens-service__badges">
                  {categoryLabel ? (
                    <span className="ens-service__tag ens-service__tag--muted">
                      {categoryLabel}
                    </span>
                  ) : null}
                </div>

                <h1 className="ens-service__title">{title}</h1>

                {(service as any)?.price ? (
                  <p className="ens-service__price mt-10">
                    <strong>{safeUiText(ui as any, 'ui_services_price_label', 'Fiyat')}:</strong>{' '}
                    {(service as any).price}
                  </p>
                ) : null}
              </div>

              {/* HERO */}
              <div className="ens-service__hero mb-30">
                {/* ✅ Big image click => open modal */}
                <button
                  type="button"
                  className="ens-service__heroBtn"
                  onClick={onHeroOpenLightbox}
                  aria-label={safeUiText(ui as any, 'ui_services_gallery_open', 'Görseli büyüt')}
                  disabled={!lightboxImages.length}
                  title={
                    !lightboxImages.length
                      ? undefined
                      : safeUiText(ui as any, 'ui_services_gallery_open', 'Görseli büyüt')
                  }
                >
                  <Image
                    src={heroSrc}
                    alt={heroAlt}
                    width={1200}
                    height={675}
                    className="img-fluid w-100"
                    priority
                  />
                </button>

                {/* ✅ Thumbs: click => set hero image (NO modal) */}
                {hasGallery && lightboxImages.length > 1 ? (
                  <div
                    className="ens-service__heroThumbs"
                    aria-label={safeUiText(
                      ui as any,
                      'ui_services_gallery_thumbs',
                      'Galeri küçük resimleri',
                    )}
                  >
                    {lightboxImages.slice(0, 10).map((it, idx) => {
                      const isActive = selectedIsActive(idx);
                      return (
                        <button
                          key={`${it.raw}-${idx}`}
                          type="button"
                          className={`ens-service__heroThumb ${isActive ? 'is-active' : ''}`}
                          onClick={() => onThumbSelect(idx)}
                          aria-label={`${galleryTitle} ${idx + 1}`}
                          title={`${galleryTitle} ${idx + 1}`}
                        >
                          <span className="ens-service__heroThumbImg">
                            <Image
                              src={String(it.thumb || it.raw)}
                              alt={String(it.alt || title)}
                              width={96}
                              height={68}
                              className="img-fluid"
                              loading="lazy"
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="postbox__text tp-postbox-details ens-service__body">
                <p className="postbox__lead">{shortSummary}</p>

                {hasMetaBlock ? (
                  <div className="ens-service__meta mt-25">
                    <ul>
                      {(service as any)?.includes ? (
                        <li>
                          <span>
                            {safeUiText(ui as any, 'ui_services_includes_label', 'Hizmet kapsamı')}:
                          </span>{' '}
                          {(service as any).includes}
                        </li>
                      ) : null}

                      {(service as any)?.material ? (
                        <li>
                          <span>
                            {safeUiText(
                              ui as any,
                              'ui_services_material_label',
                              'Ekipman / malzeme',
                            )}
                            :
                          </span>{' '}
                          {(service as any).material}
                        </li>
                      ) : null}

                      {(service as any)?.warranty ? (
                        <li>
                          <span>
                            {safeUiText(ui as any, 'ui_services_warranty_label', 'Garanti')}:
                          </span>{' '}
                          {(service as any).warranty}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}

                {hasSpecs ? (
                  <div className="ens-service__specs mt-30">
                    <h4 className="ens-service__blockTitle">
                      {safeUiText(ui as any, 'ui_services_specs_title', 'Hizmet özellikleri')}
                    </h4>

                    <div className="row">
                      <div className="col-sm-6">
                        <ul className="ens-service__specList">
                          {(service as any)?.area ? (
                            <li>
                              <span>
                                {safeUiText(ui as any, 'ui_services_area_label', 'Uygulama alanı')}:
                              </span>{' '}
                              {(service as any).area}
                            </li>
                          ) : null}
                          {(service as any)?.duration ? (
                            <li>
                              <span>
                                {safeUiText(
                                  ui as any,
                                  'ui_services_duration_label',
                                  'Tahmini süre',
                                )}
                                :
                              </span>{' '}
                              {(service as any).duration}
                            </li>
                          ) : null}
                          {(service as any)?.maintenance ? (
                            <li>
                              <span>
                                {safeUiText(
                                  ui as any,
                                  'ui_services_maintenance_label',
                                  'Bakım periyodu',
                                )}
                                :
                              </span>{' '}
                              {(service as any).maintenance}
                            </li>
                          ) : null}
                          {(service as any)?.season ? (
                            <li>
                              <span>
                                {safeUiText(
                                  ui as any,
                                  'ui_services_season_label',
                                  'Önerilen dönem',
                                )}
                                :
                              </span>{' '}
                              {(service as any).season}
                            </li>
                          ) : null}
                        </ul>
                      </div>

                      <div className="col-sm-6">
                        <ul className="ens-service__specList">
                          {(service as any)?.soil_type ? (
                            <li>
                              <span>
                                {safeUiText(ui as any, 'ui_services_soil_type_label', 'Soil type')}:
                              </span>{' '}
                              {(service as any).soil_type}
                            </li>
                          ) : null}
                          {(service as any)?.thickness ? (
                            <li>
                              <span>
                                {safeUiText(ui as any, 'ui_services_thickness_label', 'Thickness')}:
                              </span>{' '}
                              {(service as any).thickness}
                            </li>
                          ) : null}
                          {(service as any)?.equipment ? (
                            <li>
                              <span>
                                {safeUiText(ui as any, 'ui_services_equipment_label', 'Equipment')}:
                              </span>{' '}
                              {(service as any).equipment}
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Existing gallery grid stays (click opens modal) */}
                {hasGallery ? (
                  <div className="ens-serviceGallery mt-40">
                    <div className="ens-serviceGallery__head">
                      <h4 className="ens-service__blockTitle mb-0">{galleryTitle}</h4>
                    </div>

                    <div className="ens-serviceGallery__grid">
                      {gallery.map((img: any, idx: number) => {
                        const base = String(img.image_url || '').trim();
                        const thumb =
                          (base && (toCdnSrc(base, 620, 420, 'fill') || base)) || FALLBACK_IMG;

                        const cardTitle = String(img.title || '').trim();
                        const cardCaption = String(img.caption || '').trim();

                        return (
                          <button
                            type="button"
                            key={String(img.id || idx)}
                            className="ens-serviceGallery__card"
                            onClick={() => {
                              setSelectedIndex(idx);
                              setLightboxOpen(true);
                            }}
                            aria-label={`${galleryTitle} ${idx + 1}`}
                          >
                            <span className="ens-serviceGallery__img">
                              <Image
                                src={thumb}
                                alt={String(img.alt || cardTitle || title)}
                                width={620}
                                height={420}
                                className="img-fluid"
                                loading="lazy"
                              />
                            </span>

                            {cardTitle || cardCaption ? (
                              <span className="ens-serviceGallery__cap">
                                {cardTitle ? (
                                  <span className="ens-serviceGallery__capTitle">{cardTitle}</span>
                                ) : null}
                                {cardCaption ? (
                                  <span className="ens-serviceGallery__capText">{cardCaption}</span>
                                ) : null}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {isImagesLoading ? (
                      <div className="mt-10" aria-hidden>
                        <SkeletonStack>
                          <SkeletonLine style={{ height: 8 }} />
                        </SkeletonStack>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {showOfferForm ? (
                  <div className="ens-service__offer mt-40" ref={offerFormRef}>
                    <OfferSection contextType="service" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-xl-4 col-lg-4">
            <aside className="blog__thumb-wrapper">
              <div className="blog__content-wrapper">
                <button
                  type="button"
                  className="ens-service__quoteBtn"
                  onClick={() => setShowOfferForm(true)}
                >
                  <span className="ens-service__quoteBtnIcon" aria-hidden>
                    +
                  </span>
                  <span className="ens-service__quoteBtnText">{quoteBtnText}</span>
                </button>

                <div className="postbox__text mt-15">
                  <p className="mb-0">{moreInfoText}</p>
                </div>
              </div>

              <div className="blog__content-wrapper">
                <InfoContactCard
                  locale={locale}
                  title={contactTitle}
                  description={contactDesc}
                  phoneLabel={safeUiText(ui as any, 'ui_services_contact_phone', 'Telefon')}
                  whatsappLabel={safeUiText(ui as any, 'ui_services_contact_whatsapp', 'WhatsApp')}
                  formLabel={safeUiText(ui as any, 'ui_services_contact_form', 'İletişim Formu')}
                  contactHref={localizePath(locale as any, '/contact')}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ✅ Lightbox: index synced with selectedIndex */}
      <ImageLightboxModal
        open={lightboxOpen}
        images={lightboxImages}
        index={selectedIndex}
        title={galleryTitle}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={onLightboxIndexChange}
        showThumbs
      />
    </div>
  );
};

export default ServiceDetail;
