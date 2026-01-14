// =============================================================
// FILE: src/components/containers/about/QualityPageContent.tsx
// Ensotek – Quality Page Content (FINAL / SIMPLIFIED)
// - No inline styles / No styled-jsx
// - Hero image + title overlay (existing classes)
// - Certificates gallery (lightbox)
// - Sidebar: Metrics + InfoContactCard (site_settings.contact_info)
// - ✅ FIX: ui() missing-key returns key itself => treat as empty/fallback
// - ✅ Lists (standards + metrics) are driven by ui_quality seed with flat keys
// - ✅ Backward compat: if old keys exist, they are still respected
// =============================================================

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

import type { CustomPageDto } from '@/integrations/types';

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

function toSafeInt(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.floor(v));
  if (typeof v === 'string') {
    const n = parseInt(v.trim(), 10);
    if (Number.isFinite(n)) return Math.max(0, n);
  }
  return fallback;
}

type MetricItem = {
  key: string;
  title: string;
  desc: string;
  value: string;
};

type StdItem = {
  title: string;
  text: string;
  strong?: string; // optional leading bold label (e.g. ISO 9001)
};

const QualityPageContent: React.FC<Props> = ({ pageData, isLoading = false }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_quality', locale as any);

  const t = useCallback((key: string, fallback: any) => ui(key, fallback), [ui]);

  // ✅ IMPORTANT: if ui() returns the key itself, treat as missing and use fallback
  const readUi = useCallback(
    (key: string, fallback: any) => {
      const v = t(key, fallback);

      if (typeof v === 'string') {
        const s = v.trim();
        if (!s) return fallback;
        if (s === key) return fallback; // missing-key behavior
      }

      return v;
    },
    [t],
  );

  const page = useMemo<CustomPageDto | null>(() => pageData ?? null, [pageData]);

  const pageTitle = useMemo(() => {
    const tt = String(page?.title ?? '').trim();
    const fb = String(readUi('ui_quality_title', '') || '').trim();
    return tt || fb || 'Quality';
  }, [page?.title, readUi]);

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

  // Headings / copy
  const certHeading = useMemo(
    () => String(readUi('ui_quality_certificates_heading', '') || '').trim(),
    [readUi],
  );

  const certDesc = useMemo(
    () => String(readUi('ui_quality_certificates_desc', '') || '').trim(),
    [readUi],
  );

  const metricsTitle = useMemo(
    () => String(readUi('ui_quality_metrics_title', '') || '').trim(),
    [readUi],
  );

  const introTitle = useMemo(
    () => String(readUi('ui_quality_intro_title', '') || '').trim(),
    [readUi],
  );

  const introText = useMemo(
    () => String(readUi('ui_quality_intro_text', '') || '').trim(),
    [readUi],
  );

  const standardsTitle = useMemo(
    () => String(readUi('ui_quality_standards_title', '') || '').trim(),
    [readUi],
  );

  const standardsLead = useMemo(
    () => String(readUi('ui_quality_standards_lead', '') || '').trim(),
    [readUi],
  );

  const commitmentTitle = useMemo(
    () => String(readUi('ui_quality_commitment_title', '') || '').trim(),
    [readUi],
  );

  const commitmentText = useMemo(
    () => String(readUi('ui_quality_commitment_text', '') || '').trim(),
    [readUi],
  );

  const infoTitle = useMemo(
    () => String(readUi('ui_quality_info_title', '') || '').trim(),
    [readUi],
  );

  const infoDesc = useMemo(() => String(readUi('ui_quality_info_desc', '') || '').trim(), [readUi]);

  // ✅ Standards list (NEW: flat items) + backward compat (old iso* keys)
  const standards: StdItem[] = useMemo(() => {
    // 1) Prefer NEW flat list: ui_quality_std_item_count + ui_quality_std_item_{i}_*
    const count = toSafeInt(readUi('ui_quality_std_item_count', '0'), 0);
    const max = Math.min(Math.max(count, 0), 20);
    const out: StdItem[] = [];

    for (let i = 1; i <= max; i++) {
      const strong = String(readUi(`ui_quality_std_item_${i}_strong`, '') || '').trim();
      const title = String(readUi(`ui_quality_std_item_${i}_title`, '') || '').trim();
      const text = String(readUi(`ui_quality_std_item_${i}_text`, '') || '').trim();
      if (title || text || strong) out.push({ strong: strong || undefined, title, text });
    }

    if (out.length) return out;

    // 2) Backward compat: existing keys (your current seed)
    const legacy: StdItem[] = [
      {
        strong: 'ISO 9001',
        title: '',
        text: String(readUi('ui_quality_std_iso9001', '') || '').trim(),
      },
      {
        strong: 'ISO 14001',
        title: '',
        text: String(readUi('ui_quality_std_iso14001', '') || '').trim(),
      },
      {
        strong: 'ISO 45001',
        title: '',
        text: String(readUi('ui_quality_std_iso45001', '') || '').trim(),
      },
      {
        strong: String(readUi('ui_quality_std_compliance_title', '') || '').trim(),
        title: '',
        text: String(readUi('ui_quality_std_compliance_desc', '') || '').trim(),
      },
      {
        strong: String(readUi('ui_quality_std_trace_title', '') || '').trim(),
        title: '',
        text: String(readUi('ui_quality_std_trace_desc', '') || '').trim(),
      },
      {
        strong: String(readUi('ui_quality_std_capa_title', '') || '').trim(),
        title: '',
        text: String(readUi('ui_quality_std_capa_desc', '') || '').trim(),
      },
    ].filter((x) => (x.strong || x.title || x.text).trim?.() !== '');

    return legacy.filter((x) => (x.strong || x.title || x.text).trim?.() !== '');
  }, [readUi]);

  // ✅ Metrics (NEW: flat items) + backward compat (old metric keys)
  const metrics: MetricItem[] = useMemo(() => {
    const count = toSafeInt(readUi('ui_quality_metric_count', '0'), 0);
    const max = Math.min(Math.max(count, 0), 20);

    const out: MetricItem[] = [];
    for (let i = 1; i <= max; i++) {
      const key = `m${i}`;
      const title = String(readUi(`ui_quality_metric_${i}_title`, '') || '').trim();
      const desc = String(readUi(`ui_quality_metric_${i}_desc`, '') || '')
        .trim()
        .replace(/\s+/g, ' ');
      const value = String(readUi(`ui_quality_metric_${i}_value`, '') || '').trim();
      if (title || desc || value) out.push({ key, title, desc, value });
    }
    if (out.length) return out;

    // Backward compat (your current component had hard values)
    const expValue = String(
      readUi('ui_quality_metric_experience_value', readUi('ui_year', '') || '') || '',
    ).trim();

    const legacy: MetricItem[] = [
      {
        key: 'satisfaction',
        title: String(readUi('ui_quality_metric_satisfaction', '') || '').trim(),
        desc: String(readUi('ui_quality_metric_satisfaction_desc', '') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: String(readUi('ui_quality_metric_satisfaction_value', '98%') || '').trim(),
      },
      {
        key: 'ontime',
        title: String(readUi('ui_quality_metric_ontime', '') || '').trim(),
        desc: String(readUi('ui_quality_metric_ontime_desc', '') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: String(readUi('ui_quality_metric_ontime_value', '95%') || '').trim(),
      },
      {
        key: 'control',
        title: String(readUi('ui_quality_metric_control', '') || '').trim(),
        desc: String(readUi('ui_quality_metric_control_desc', '') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: String(readUi('ui_quality_metric_control_value', '100%') || '').trim(),
      },
      {
        key: 'experience',
        title: String(readUi('ui_quality_metric_experience', '') || '').trim(),
        desc: String(readUi('ui_quality_metric_experience_desc', '') || '')
          .trim()
          .replace(/\s+/g, ' '),
        value: expValue || String(readUi('ui_year', '') || '').trim(),
      },
    ].filter((m) => (m.title || m.desc || m.value).trim?.() !== '');

    return legacy;
  }, [readUi]);

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
                {readUi('ui_quality_empty', 'Quality content not found.')}
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
                  {introTitle ? <h2>{introTitle}</h2> : null}
                  {introText ? <p>{introText}</p> : null}

                  {standardsTitle ? <h2>{standardsTitle}</h2> : null}
                  {standardsLead ? <p>{standardsLead}</p> : null}

                  {standards.length ? (
                    <ul>
                      {standards.map((it, idx) => (
                        <li key={`std-${idx}`}>
                          {it.strong ? <strong>{it.strong}</strong> : null}
                          {it.strong ? ': ' : null}
                          {it.title ? <strong>{it.title}</strong> : null}
                          {it.title && it.text ? ': ' : null}
                          {it.text}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {commitmentTitle ? <h2>{commitmentTitle}</h2> : null}
                  {commitmentText ? <p>{commitmentText}</p> : null}
                </div>
              </div>

              <div className="blog__content-wrapper mb-30" id="certs">
                <div className="blog__content">
                  <span>{String(readUi('ui_quality_certificates_kicker', '') || '').trim()}</span>
                  <h3>
                    <a href="#certs">{certHeading || ''}</a>
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
                  {readUi('ui_quality_no_certificates', 'No certificate images found.')}
                </div>
              ) : (
                <div className="row g-3">
                  {certCards.map((img, idx) => (
                    <div className="col-6 col-md-4 col-xl-3" key={`${img.raw}-${idx}`}>
                      <button
                        type="button"
                        className="ens-quality__certBtn"
                        onClick={() => openLightbox(idx)}
                        aria-label={`${readUi('ui_quality_certificate_label', 'Certificate')} ${
                          idx + 1
                        }`}
                        title={`${readUi('ui_quality_certificate_label', 'Certificate')} ${
                          idx + 1
                        }`}
                      >
                        <div className="blog__item-3">
                          <div className="blog__thumb w-img ens-quality__thumb">
                            <Image
                              src={img.thumb}
                              alt={`${readUi('ui_quality_certificate_label', 'Certificate')} ${
                                idx + 1
                              }`}
                              width={900}
                              height={900}
                              loading="lazy"
                              className="img-fluid"
                              unoptimized
                            />
                            <div className="ens-quality__overlay" aria-hidden>
                              <div className="ens-quality__badge">
                                {readUi('ui_quality_certificate_label', 'Certificate')} {idx + 1}
                              </div>
                              <div className="ens-quality__cta">
                                {readUi('ui_quality_certificate_open', 'Open')}
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
                <aside
                  className="ens-quality__metrics"
                  id="metrics"
                  aria-label={metricsTitle || ''}
                >
                  <div className="ens-quality__metricsHead">
                    <span className="ens-quality__metricsHeadIcon" aria-hidden />
                    <h4 className="ens-quality__metricsHeadTitle">{metricsTitle || ''}</h4>
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

                {/* INFO AREA */}
                <div className="ens-quality__ctaWrap">
                  <InfoContactCard
                    locale={String(locale || '')}
                    fallbackLocale="en"
                    title={infoTitle}
                    description={infoDesc}
                    phoneLabel={String(readUi('ui_phone', 'Phone') || 'Phone')}
                    whatsappLabel="WhatsApp"
                    formLabel={String(readUi('ui_contact_form', 'Contact Form') || 'Contact Form')}
                    contactHref="/contact"
                    showEmail
                    showAddress
                    showWebsite={false}
                    showWhatsapp
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
          alt: `${readUi('ui_quality_certificate_label', 'Certificate')} ${i + 1}`,
        }))}
        index={lightboxIndex}
        title={certHeading || ''}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
        showThumbs
      />
    </section>
  );
};

export default QualityPageContent;
