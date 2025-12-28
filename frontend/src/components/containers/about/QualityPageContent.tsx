// =============================================================
// FILE: src/components/containers/about/QualityPageContent.tsx
// Ensotek – Quality Page Content (FINAL)
// - No inline styles / No styled-jsx
// - Hero image + title overlay (existing classes)
// - Certificates gallery (lightbox)
// - Sidebar: Metrics + InfoContactCard (site_settings.contact_info)
// =============================================================

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

import { toCdnSrc } from '@/shared/media';

import ImageLightboxModal from '@/components/common/public/ImageLightboxModal';
import InfoContactCard from '@/components/common/public/InfoContactCard';

type Props = {
  pageData: CustomPageDto | null;
  isLoading?: boolean;
};

const stripTrailingSlash = (s: string) =>
  String(s || '')
    .trim()
    .replace(/\/+$/, '');

const normalizeUrl = (u: string) => stripTrailingSlash(String(u || '').trim());
const uniq = (arr: string[]) => Array.from(new Set(arr));

function normalizeStringArray(input: unknown): string[] {
  if (!input) return [];

  if (Array.isArray(input)) return input.map((x) => String(x ?? '').trim()).filter(Boolean);

  if (typeof input === 'string') {
    const s = input.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((x) => String(x ?? '').trim()).filter(Boolean);
      if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).images)) {
        return (parsed as any).images.map((x: any) => String(x ?? '').trim()).filter(Boolean);
      }
      return [];
    } catch {
      if (s.includes(',')) {
        return s
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);
      }
      return [];
    }
  }

  if (typeof input === 'object') {
    const anyObj = input as any;
    if (Array.isArray(anyObj.images))
      return anyObj.images.map((x: any) => String(x ?? '').trim()).filter(Boolean);
    if (typeof anyObj.images === 'string') return normalizeStringArray(anyObj.images);
  }

  return [];
}

type MetricItem = {
  key: string;
  title: string;
  desc: string;
  value: string;
};

const QualityPageContent: React.FC<Props> = ({ pageData, isLoading = false }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_quality', locale as any);

  const page = useMemo<CustomPageDto | null>(() => pageData ?? null, [pageData]);

  const pageTitle = useMemo(() => {
    const t = String(page?.title ?? '').trim();
    return t || String(ui('ui_quality_title', 'Kalite') || '').trim() || 'Kalite';
  }, [page?.title, ui]);

  const heroImgRaw = useMemo(() => String((page as any)?.featured_image ?? '').trim(), [page]);

  const heroImg = useMemo(() => {
    if (!heroImgRaw) return '';
    return (toCdnSrc(heroImgRaw, 1600, 1000, 'fill') || heroImgRaw).toString();
  }, [heroImgRaw]);

  const heroAlt = useMemo(() => {
    const alt = String((page as any)?.featured_image_alt ?? '').trim();
    return alt || pageTitle || 'quality';
  }, [page, pageTitle]);

  const certificateImages = useMemo(() => {
    const imgs = normalizeStringArray((page as any)?.images);
    const heroNorm = heroImgRaw ? normalizeUrl(heroImgRaw) : '';
    const withoutHero = heroNorm ? imgs.filter((u) => normalizeUrl(u) !== heroNorm) : imgs;
    return uniq(withoutHero);
  }, [page, heroImgRaw]);

  const certCards = useMemo(
    () =>
      certificateImages.map((src) => {
        const thumb = (toCdnSrc(src, 900, 900, 'fill') || src).toString();
        return { raw: src, thumb };
      }),
    [certificateImages],
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const certHeading = useMemo(
    () => String(ui('ui_quality_certificates_heading', 'Sertifikalarımız') || '').trim(),
    [ui],
  );

  const certDesc = useMemo(
    () =>
      String(
        ui('ui_quality_certificates_desc', 'Görselleri büyütmek için üzerine tıklayın.') || '',
      ).trim(),
    [ui],
  );

  const metricsTitle = useMemo(
    () => String(ui('ui_quality_metrics_title', 'Kalite Metrikleri') || '').trim(),
    [ui],
  );

  const metrics: MetricItem[] = useMemo(
    () => [
      {
        key: 'satisfaction',
        title: String(ui('ui_quality_metric_satisfaction', 'Müşteri Memnuniyeti') || '').trim(),
        desc: String(ui('ui_quality_metric_satisfaction_desc', 'Geri bildirim ortalaması') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: '98%',
      },
      {
        key: 'ontime',
        title: String(ui('ui_quality_metric_ontime', 'Zamanında Teslimat') || '').trim(),
        desc: String(ui('ui_quality_metric_ontime_desc', 'Planlanan termin') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: '95%',
      },
      {
        key: 'control',
        title: String(ui('ui_quality_metric_control', 'Kalite Kontrol') || '').trim(),
        desc: String(ui('ui_quality_metric_control_desc', 'Her işte kontrol') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: '100%',
      },
      {
        key: 'experience',
        title: String(ui('ui_quality_metric_experience', 'Deneyim') || '').trim(),
        desc: String(ui('ui_quality_metric_experience_desc', 'Sektör tecrübesi') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: `25+ ${String(ui('ui_year', 'Yıl') || 'Yıl').trim()}`,
      },
    ],
    [ui],
  );

  // Static content (UI controlled)
  const introTitle = useMemo(
    () =>
      String(
        ui('ui_quality_intro_title', 'Kalite Belgelerimiz & Kalite Standartlarımız') || '',
      ).trim(),
    [ui],
  );

  const introText = useMemo(
    () =>
      String(
        ui(
          'ui_quality_intro_text',
          'Ensotek, ürün ve hizmet kalitesini uluslararası standartlar ile doğrular. Sertifikasyonlarımız; güvenilirlik, verimlilik ve sürdürülebilirlik odağımızın somut göstergesidir.',
        ) || '',
      ).trim(),
    [ui],
  );

  const standardsTitle = useMemo(
    () => String(ui('ui_quality_standards_title', 'Standartlarımız') || '').trim(),
    [ui],
  );

  const standardsLead = useMemo(
    () =>
      String(
        ui(
          'ui_quality_standards_lead',
          'Uyguladığımız kalite yönetim yaklaşımı; süreçlerin ölçülebilir yönetimini, risklerin kontrolünü ve sürekli iyileştirmeyi esas alır.',
        ) || '',
      ).trim(),
    [ui],
  );

  const commitmentTitle = useMemo(
    () => String(ui('ui_quality_commitment_title', 'Kalite Taahhüdümüz') || '').trim(),
    [ui],
  );

  const commitmentText = useMemo(
    () =>
      String(
        ui(
          'ui_quality_commitment_text',
          'Ensotek; tasarım, üretim ve saha süreçlerinde standartlara uyum, izlenebilirlik ve sürekli iyileştirme yaklaşımıyla müşterilerine güvenilir çözümler sunmayı taahhüt eder.',
        ) || '',
      ).trim(),
    [ui],
  );

  // Sidebar info texts (UI controlled)
  const infoTitle = useMemo(
    () => String(ui('ui_quality_info_title', 'İletişim Bilgileri') || '').trim(),
    [ui],
  );

  const infoDesc = useMemo(
    () =>
      String(
        ui(
          'ui_quality_info_desc',
          'Kalite belgeleri, proses yaklaşımı ve dokümantasyon hakkında bilgi almak için bize ulaşın.',
        ) || '',
      ).trim(),
    [ui],
  );

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90 ens-quality__page">
      <div className="container">
        {isLoading && (
          <div className="row">
            <div className="col-12">
              <div className="ens-skel ens-skel--md" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w60 mt-10" />
            </div>
          </div>
        )}

        {!isLoading && !page && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning">
                {ui('ui_quality_empty', 'Quality content not found.')}
              </div>
            </div>
          </div>
        )}

        {!!page && !isLoading && (
          <div className="row g-4" data-aos="fade-up" data-aos-delay="200">
            <div className="col-lg-8">
              {heroImg ? (
                <div className="blog__item-3 mb-30 ens-quality__heroBlock">
                  <div className="blog__thumb w-img ens-blog__hero ens-quality__hero">
                    <Image
                      src={heroImg}
                      alt={heroAlt}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      className="img-fluid"
                      unoptimized
                      priority={false}
                    />
                    <div className="ens-blog__heroOverlay" aria-hidden />
                  </div>
                </div>
              ) : null}

              <div className="blog__content-wrapper mb-30" id="quality">
                <div className="postbox__text tp-post-content tp-postbox-details ens-quality__static">
                  <h2>{introTitle}</h2>
                  <p>{introText}</p>

                  <h2>{standardsTitle}</h2>
                  <p>{standardsLead}</p>

                  <ul>
                    <li>
                      <strong>ISO 9001</strong>:{' '}
                      {ui('ui_quality_std_iso9001', 'Kalite Yönetim Sistemi')}
                    </li>
                    <li>
                      <strong>ISO 14001</strong>:{' '}
                      {ui('ui_quality_std_iso14001', 'Çevre Yönetim Sistemi')}
                    </li>
                    <li>
                      <strong>ISO 45001</strong> / OHSAS:{' '}
                      {ui('ui_quality_std_iso45001', 'İş Sağlığı ve Güvenliği yaklaşımı')}
                    </li>
                    <li>
                      <strong>
                        {ui('ui_quality_std_compliance_title', 'Uygunluk & standartlara uyum')}
                      </strong>
                      :{' '}
                      {ui(
                        'ui_quality_std_compliance_desc',
                        'Ürün güvenliği ve dokümantasyon disiplinleri',
                      )}
                    </li>
                    <li>
                      <strong>{ui('ui_quality_std_trace_title', 'İzlenebilirlik')}</strong>:{' '}
                      {ui(
                        'ui_quality_std_trace_desc',
                        'Malzeme/komponent takibi, üretim kayıtları ve kalite kontrol raporları',
                      )}
                    </li>
                    <li>
                      <strong>{ui('ui_quality_std_capa_title', 'Sürekli iyileştirme')}</strong>:{' '}
                      {ui(
                        'ui_quality_std_capa_desc',
                        'Denetimler, DÖF/CAPA ve geri bildirim yönetimi',
                      )}
                    </li>
                  </ul>

                  <h2>{commitmentTitle}</h2>
                  <p>{commitmentText}</p>
                </div>
              </div>

              <div className="blog__content-wrapper mb-30" id="certs">
                <div className="blog__content">
                  <span>{ui('ui_quality_certificates_kicker', 'Belgeler') || 'Belgeler'}</span>
                  <h3>
                    <a href="#certs">{certHeading}</a>
                  </h3>
                </div>

                {certDesc ? (
                  <div className="postbox__text">
                    <p className="mb-0">{certDesc}</p>
                  </div>
                ) : null}
              </div>

              {certCards.length === 0 ? (
                <div className="alert alert-secondary">
                  {ui('ui_quality_no_certificates', 'Sertifika görseli bulunamadı.')}
                </div>
              ) : (
                <div className="row g-3">
                  {certCards.map((img, idx) => (
                    <div className="col-6 col-md-4 col-xl-3" key={`${img.raw}-${idx}`}>
                      <button
                        type="button"
                        className="ens-quality__certBtn"
                        onClick={() => openLightbox(idx)}
                        aria-label={`${ui('ui_quality_certificate_label', 'Sertifika')} ${idx + 1}`}
                        title={`${ui('ui_quality_certificate_label', 'Sertifika')} ${idx + 1}`}
                      >
                        <div className="blog__item-3">
                          <div className="blog__thumb w-img ens-quality__thumb">
                            <Image
                              src={img.thumb}
                              alt={`${ui('ui_quality_certificate_label', 'Sertifika')} ${idx + 1}`}
                              width={900}
                              height={900}
                              loading="lazy"
                              className="img-fluid"
                              unoptimized
                            />
                            <div className="ens-quality__overlay" aria-hidden>
                              <div className="ens-quality__badge">
                                {ui('ui_quality_certificate_label', 'Sertifika')} {idx + 1}
                              </div>
                              <div className="ens-quality__cta">
                                {ui('ui_quality_certificate_open', 'Büyüt')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="ens-quality__sideSticky">
                {/* METRICS */}
                <aside className="ens-quality__metrics" id="metrics" aria-label={metricsTitle}>
                  <div className="ens-quality__metricsHead">
                    <span className="ens-quality__metricsHeadIcon" aria-hidden />
                    <h4 className="ens-quality__metricsHeadTitle">{metricsTitle}</h4>
                  </div>

                  <div className="ens-quality__metricsGrid" role="list">
                    {metrics.map((m) => (
                      <div className="ens-quality__metricCard" role="listitem" key={m.key}>
                        <div className="ens-quality__metricLeft">
                          <div className="ens-quality__metricTitle">{m.title}</div>
                          <div className="ens-quality__metricDesc">{m.desc}</div>
                        </div>
                        <div className="ens-quality__metricValue">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </aside>

                {/* INFO AREA (InfoContactCard style/frame) */}
                <div className="ens-quality__ctaWrap">
                  <InfoContactCard
                    locale={String(locale || '')}
                    fallbackLocale="en"
                    title={infoTitle}
                    description={infoDesc}
                    phoneLabel={String(ui('ui_phone', 'Telefon') || 'Telefon')}
                    whatsappLabel="WhatsApp"
                    formLabel={String(ui('ui_contact_form', 'İletişim Formu') || 'İletişim Formu')}
                    contactHref="/contact"
                    showEmail
                    showAddress
                    showWebsite={false}
                    showWhatsapp
                    showCtas
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ImageLightboxModal
        open={lightboxOpen}
        images={certCards.map((x, i) => ({
          raw: x.raw,
          thumb: x.thumb,
          alt: `${ui('ui_quality_certificate_label', 'Sertifika')} ${i + 1}`,
        }))}
        index={lightboxIndex}
        title={certHeading}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
        showThumbs
      />
    </section>
  );
};

export default QualityPageContent;
