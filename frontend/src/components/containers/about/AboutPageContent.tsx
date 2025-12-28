// =============================================================
// FILE: src/components/containers/about/AboutPageContent.tsx
// Ensotek – About Page Content (SINGLE PAGE) (I18N + SAFE)
// - NO inline styles / NO styled-jsx
// - H1 forbidden: CMS html <h1> -> <h2>
// - Modern lists (SCSS: ens-about__list* helpers) + span override safe
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

// Shape / fallback image (local)
import Two from '/public/img/shape/hero-shape-4.png';

// RTK – Custom Pages Public
import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const downgradeH1ToH2 = (rawHtml: string) =>
  String(rawHtml || '')
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');

function safeJson<T>(v: any, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === 'object') return v as T;
  if (typeof v !== 'string') return fallback;

  const s = v.trim();
  if (!s) return fallback;

  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function extractHtmlFromAny(v: unknown): string {
  if (!v) return '';

  if (typeof v === 'object') {
    const html = (v as any)?.html;
    return typeof html === 'string' ? html.trim() : '';
  }

  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return '';

    if (s.startsWith('{') || s.startsWith('[')) {
      const obj = safeJson<any>(s, null);
      const html = obj?.html;
      if (typeof html === 'string' && html.trim()) return html.trim();
    }

    return s;
  }

  return '';
}

function normalizeStringArray(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((x) => String(x ?? '').trim()).filter(Boolean);

  if (typeof input === 'string') {
    const s = input.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((x) => String(x ?? '').trim()).filter(Boolean);
    } catch {
      if (s.includes(','))
        return s
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);
      return [s];
    }
  }

  if (typeof input === 'object') {
    const anyObj = input as any;
    if (Array.isArray(anyObj.items))
      return anyObj.items.map((x: any) => String(x ?? '').trim()).filter(Boolean);
    if (Array.isArray(anyObj.list))
      return anyObj.list.map((x: any) => String(x ?? '').trim()).filter(Boolean);
  }

  return [];
}

function pickFirstPublished(items: any): CustomPageDto | null {
  const arr: CustomPageDto[] = Array.isArray(items) ? (items as any) : [];
  const published = arr.filter((p) => !!p?.is_published);
  return published[0] ?? null;
}

function isRemoteUrl(src: unknown): src is string {
  if (typeof src !== 'string') return false;
  return /^https?:\/\//i.test(src) || /^\/\//.test(src);
}

const AboutPageContent: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_about', locale as any);

  const { data, isLoading, isError } = useListCustomPagesPublicQuery({
    module_key: 'about',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const page = useMemo<CustomPageDto | null>(
    () => pickFirstPublished((data as any)?.items),
    [data],
  );

  // Header strings
  const headerSubtitlePrefix = useMemo(
    () => String(ui('ui_about_subprefix', 'Ensotek') || '').trim() || 'Ensotek',
    [ui],
  );

  const headerSubtitleLabel = useMemo(
    () => String(ui('ui_about_sublabel', 'Hakkımızda') || '').trim() || 'Hakkımızda',
    [ui],
  );

  const headerTitle = useMemo(
    () => String(ui('ui_about_page_title', 'Hakkımızda') || '').trim() || 'Hakkımızda',
    [ui],
  );

  const headerLead = useMemo(
    () =>
      String(
        ui(
          'ui_about_page_lead',
          'Deneyim, üretim gücü ve kalite standartlarımızla projelerinize güvenilir çözümler sunuyoruz.',
        ) || '',
      ).trim(),
    [ui],
  );

  // Main content title
  const title = useMemo(() => {
    const t = String(page?.title ?? '').trim();
    return t || String(ui('ui_about_fallback_title', 'Ensotek') || '').trim() || 'Ensotek';
  }, [page?.title, ui]);

  // CMS html
  const html = useMemo(() => {
    const raw =
      String((page as any)?.content_html ?? '').trim() ||
      extractHtmlFromAny((page as any)?.content) ||
      extractHtmlFromAny((page as any)?.content_json);

    return raw ? downgradeH1ToH2(raw) : '';
  }, [page]);

  // Featured image
  const imgSrc = useMemo(() => {
    const raw = String((page as any)?.featured_image ?? '').trim();
    if (!raw) return Two;

    const cdn = toCdnSrc(raw, 1200, 800, 'fill');
    return (cdn || raw) as any;
  }, [page]);

  const imgAlt = useMemo(() => {
    const alt = String((page as any)?.featured_image_alt ?? '').trim();
    return alt || title || 'about image';
  }, [page, title]);

  // Info blocks
  const whatTitle = useMemo(
    () => String(ui('ui_about_what_title', 'Ne Yapıyoruz?') || '').trim() || 'Ne Yapıyoruz?',
    [ui],
  );
  const whyTitle = useMemo(
    () => String(ui('ui_about_why_title', 'Neden Ensotek?') || '').trim() || 'Neden Ensotek?',
    [ui],
  );
  const goalTitle = useMemo(
    () => String(ui('ui_about_goal_title', 'Hedefimiz') || '').trim() || 'Hedefimiz',
    [ui],
  );

  const whatItems = useMemo(() => {
    const v =
      ui(
        'ui_about_what_items',
        JSON.stringify([
          'Proje analizi ve doğru ürün seçimi',
          'Üretim, sevkiyat ve montaj koordinasyonu',
          'Devreye alma ve performans takibi',
          'Satış sonrası bakım ve teknik destek',
        ]),
      ) ?? '';
    return normalizeStringArray(v);
  }, [ui]);

  const whyItems = useMemo(() => {
    const v =
      ui(
        'ui_about_why_items',
        JSON.stringify([
          '40+ yıllık deneyim ve kurumsal üretim altyapısı',
          'Kalite standartları ve dokümantasyon disiplini',
          'Hızlı geri dönüş ve süreç şeffaflığı',
          'Uzun vadeli iş ortaklığı yaklaşımı',
        ]),
      ) ?? '';
    return normalizeStringArray(v);
  }, [ui]);

  const goalText = useMemo(() => {
    return (
      String(
        ui(
          'ui_about_goal_text',
          'Müşterilerimiz için verimli, sürdürülebilir ve güvenilir soğutma çözümleri sunarken; kaliteyi ölçülebilir hale getirip süreçleri sürekli iyileştirmektir.',
        ) || '',
      ).trim() || ''
    );
  }, [ui]);

  const contentHref = useMemo(() => localizePath(locale as any, '/about#content'), [locale]);

  return (
    <section className="about__area grey-bg z-index-11 p-relative pt-120 pb-60 ens-about">
      <div className="about__shape-2" aria-hidden>
        <Image src={Two} alt="shape" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper mb-40 text-center">
              <span className="section__subtitle-2">
                <span>{headerSubtitlePrefix}</span> {headerSubtitleLabel}
              </span>

              <h2 className="section__title-2">{headerTitle}</h2>

              {headerLead ? <p className="mt-10 mb-0">{headerLead}</p> : null}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="row mb-40">
            <div className="col-12">
              <div className="ens-skel ens-skel--md" aria-hidden />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" aria-hidden />
              <div className="ens-skel ens-skel--md ens-skel--w60 mt-10" aria-hidden />
            </div>
          </div>
        )}

        {/* Empty / Error */}
        {!isLoading && (!page || isError) && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning">
                {ui('ui_about_empty', 'About content not found.')}
              </div>
            </div>
          </div>
        )}

        {!!page && !isLoading && (
          <>
            <div className="row align-items-center mb-40" data-aos="fade-up" data-aos-delay={150}>
              {/* Image LEFT */}
              <div className="col-xl-6 col-lg-6">
                <div className="blog__thumb-wrapper mb-30 mb-lg-0">
                  <div className="blog__thumb w-img">
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      width={1200}
                      height={800}
                      className="img-fluid"
                      unoptimized={isRemoteUrl(imgSrc)}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Content RIGHT */}
              <div className="col-xl-6 col-lg-6">
                <div className="blog__content-wrapper mb-30 mb-lg-0" id="content">
                  <div className="blog__content">
                    <h3>
                      <a href={contentHref}>{title}</a>
                    </h3>

                    {html ? (
                      <div
                        className="postbox__text tp-postbox-details ens-about__html"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    ) : (
                      <div className="postbox__text">
                        <p className="mb-0">
                          {ui(
                            'ui_about_empty_text',
                            "Ensotek'in kurumsal yaklaşımı ve üretim gücü burada yayınlanacaktır.",
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Extra blocks */}
            <div className="row g-4" data-aos="fade-up" data-aos-delay={250}>
              {/* What */}
              <div className="col-lg-4">
                <div className="blog__content-wrapper ens-about__panel">
                  <div className="blog__content">
                    <h3>
                      <a href="#">{whatTitle}</a>
                    </h3>

                    <ul className="ens-about__list" aria-label={whatTitle}>
                      {whatItems.map((t, i) => (
                        <li className="ens-about__listItem" key={i}>
                          <i className="ens-about__dot" aria-hidden />
                          <div className="ens-about__listText">{t}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Why */}
              <div className="col-lg-4">
                <div className="blog__content-wrapper ens-about__panel">
                  <div className="blog__content">
                    <h3>
                      <a href="#">{whyTitle}</a>
                    </h3>

                    <ul className="ens-about__list" aria-label={whyTitle}>
                      {whyItems.map((t, i) => (
                        <li className="ens-about__listItem" key={i}>
                          <i className="ens-about__dot" aria-hidden />
                          <div className="ens-about__listText">{t}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Goal */}
              <div className="col-lg-4">
                <div className="blog__content-wrapper ens-about__panel">
                  <div className="blog__content">
                    <h3>
                      <a href="#">{goalTitle}</a>
                    </h3>
                    <div className="postbox__text">
                      <p className="mb-0">{goalText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AboutPageContent;
