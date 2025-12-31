// =============================================================
// FILE: src/components/containers/about/AboutPageContent.tsx
// Ensotek – About Page Content (SINGLE PAGE) (I18N + SAFE) [FINAL]
// - NO inline styles / NO styled-jsx
// - H1 forbidden: CMS html <h1> -> <h2>
// - Modern lists (SCSS: ens-about__list* helpers) + span override safe
// - ✅ FIX: ui() missing-key returns key itself => treat as empty/fallback
// - ✅ FIX: Lists now use flat keys (ui_about_what_item_1..N / ui_about_why_item_1..N)
// - ✅ Backward compat: if ui_about_*_items (JSON array) exists, use it
// - ✅ Pattern: t(key, fb) wrapper
// =============================================================

'use client';

import React, { useMemo, useCallback } from 'react';
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

function toSafeInt(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.floor(v));
  if (typeof v === 'string') {
    const n = parseInt(v.trim(), 10);
    if (Number.isFinite(n)) return Math.max(0, n);
  }
  return fallback;
}

const AboutPageContent: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_about', locale as any);

  // base wrapper
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

  // Header strings (rely on ui_about; no TR hardcode)
  const headerSubtitlePrefix = useMemo(
    () => String(readUi('ui_about_subprefix', 'Ensotek') || '').trim() || 'Ensotek',
    [readUi],
  );

  const headerSubtitleLabel = useMemo(() => {
    const v = String(readUi('ui_about_sublabel', '') || '').trim();
    return v; // empty allowed
  }, [readUi]);

  const headerTitle = useMemo(() => {
    const v = String(readUi('ui_about_page_title', '') || '').trim();
    return v || 'Ensotek';
  }, [readUi]);

  const headerLead = useMemo(() => String(readUi('ui_about_page_lead', '') || '').trim(), [readUi]);

  // Main content title
  const title = useMemo(() => {
    const tt = String(page?.title ?? '').trim();
    if (tt) return tt;

    const fb = String(readUi('ui_about_fallback_title', '') || '').trim();
    return fb || 'Ensotek';
  }, [page?.title, readUi]);

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

  // Info block titles
  const whatTitle = useMemo(() => {
    const v = String(readUi('ui_about_what_title', '') || '').trim();
    return v || 'Ensotek';
  }, [readUi]);

  const whyTitle = useMemo(() => {
    const v = String(readUi('ui_about_why_title', '') || '').trim();
    return v || 'Ensotek';
  }, [readUi]);

  const goalTitle = useMemo(() => {
    const v = String(readUi('ui_about_goal_title', '') || '').trim();
    return v || 'Ensotek';
  }, [readUi]);

  // ✅ List reader (NEW flat keys) + backward compat (legacy JSON array)
  const readList = useCallback(
    (opts: { legacyArrayKey: string; countKey: string; itemPrefix: string }) => {
      // 1) Try legacy JSON array (if exists)
      const legacy = readUi(opts.legacyArrayKey, '');
      const legacyArr = normalizeStringArray(legacy);
      if (legacyArr.length) return legacyArr;

      // 2) Flat keys
      const countRaw = readUi(opts.countKey, '0');
      const n = toSafeInt(countRaw, 0);

      const out: string[] = [];
      const max = Math.min(Math.max(n, 0), 20); // safety cap
      for (let i = 1; i <= max; i++) {
        const k = `${opts.itemPrefix}${i}`;
        const v = String(readUi(k, '') || '').trim();
        if (v) out.push(v);
      }

      // 3) If count not set but items exist, try scanning first 10
      if (!out.length && max === 0) {
        for (let i = 1; i <= 10; i++) {
          const k = `${opts.itemPrefix}${i}`;
          const v = String(readUi(k, '') || '').trim();
          if (v) out.push(v);
        }
      }

      return out;
    },
    [readUi],
  );

  const whatItems = useMemo(
    () =>
      readList({
        legacyArrayKey: 'ui_about_what_items',
        countKey: 'ui_about_what_item_count',
        itemPrefix: 'ui_about_what_item_',
      }),
    [readList],
  );

  const whyItems = useMemo(
    () =>
      readList({
        legacyArrayKey: 'ui_about_why_items',
        countKey: 'ui_about_why_item_count',
        itemPrefix: 'ui_about_why_item_',
      }),
    [readList],
  );

  const goalText = useMemo(() => String(readUi('ui_about_goal_text', '') || '').trim(), [readUi]);

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
                <span>{headerSubtitlePrefix}</span>
                {headerSubtitleLabel ? ` ${headerSubtitleLabel}` : null}
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
                {readUi('ui_about_empty', 'Content not found.')}
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
                          {readUi('ui_about_empty_text', 'Content will be published here.')}
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
                      {whatItems.map((tt, i) => (
                        <li className="ens-about__listItem" key={i}>
                          <i className="ens-about__dot" aria-hidden />
                          <div className="ens-about__listText">{tt}</div>
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
                      {whyItems.map((tt, i) => (
                        <li className="ens-about__listItem" key={i}>
                          <i className="ens-about__dot" aria-hidden />
                          <div className="ens-about__listText">{tt}</div>
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
