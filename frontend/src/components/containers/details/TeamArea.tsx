'use client';

// =============================================================
// FILE: src/components/containers/details/TeamArea.tsx
// Ensotek – Team Area (Public) (RTK + I18N) [FINAL]
// - Source: custom_pages (public) module_key="team"
// - Locale: ✅ useLocaleShort()
// - default_locale: ✅ site_settings.default_locale (fallback)
// - UI texts: ✅ useUiSection('ui_team', locale) (single-language fallback TR)
// - Styles: ✅ SCSS-driven (keeps existing team__* classes), no inline
// =============================================================

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';

import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';
import { normLocaleTag } from '@/i18n/localeUtils';

import { toCdnSrc } from '@/shared/media';

const HERO_W = 640;
const HERO_H = 640;

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function pickFirstImage(p: CustomPageDto): string {
  const a = safeStr(p.featured_image);
  if (a) return a;

  const b = safeStr(p.image_url);
  if (b) return b;

  const c = Array.isArray(p.images) ? safeStr(p.images[0]) : '';
  if (c) return c;

  return '';
}

function pickRole(p: CustomPageDto): string {
  // Öncelik: summary -> tags[0] gibi basit fallback (istersen kaldır)
  const s = safeStr(p.summary);
  if (s) return s;

  const t = Array.isArray(p.tags) ? safeStr(p.tags[0]) : '';
  return t;
}

function pickRating(p: CustomPageDto): number | null {
  // Varsayım yapmayalım. order_num 0..5 ise rating gibi kullan (opsiyonel).
  const n = Number(p.order_num);
  if (Number.isFinite(n) && n >= 0 && n <= 5) return n;
  return null;
}

const TeamArea: React.FC = () => {
  const locale = useLocaleShort() || 'de';
  const { ui } = useUiSection('ui_team', locale as any);

  // default_locale DB’den (i18n fallback)
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' } as any);
  const defaultLocale = useMemo(
    () => normLocaleTag((defaultLocaleRow as any)?.value) || 'de',
    [(defaultLocaleRow as any)?.value],
  );

  const t = useMemo(
    () => ({
      title: safeStr(ui('ui_team_title', 'Ekibimiz')) || 'Ekibimiz',
      desc:
        safeStr(
          ui('ui_team_desc', 'Uzman ekibimizle projelerinize değer katıyoruz. Ekibimizle tanışın.'),
        ) || 'Uzman ekibimizle projelerinize değer katıyoruz. Ekibimizle tanışın.',
      loading: safeStr(ui('ui_team_loading', 'Yükleniyor...')) || 'Yükleniyor...',
      empty:
        safeStr(ui('ui_team_empty', 'Henüz ekip üyesi eklenmemiş.')) ||
        'Henüz ekip üyesi eklenmemiş.',
      error: safeStr(ui('ui_team_error', 'Veriler alınamadı.')) || 'Veriler alınamadı.',
      ratingAria: safeStr(ui('ui_team_rating_aria', 'Puan')) || 'Puan',
    }),
    [ui],
  );

  // TEAM list (custom_pages public)
  const { data, isLoading, isError } = useListCustomPagesPublicQuery(
    {
      module_key: 'team',
      locale,
      default_locale: defaultLocale,
      is_published: 1,
      limit: 12,
      offset: 0,
      sort: 'display_order',
      orderDir: 'asc',
    } as any,
    { skip: !locale },
  );

  const items = useMemo(() => {
    const rows = (data as any)?.items ?? [];
    const arr = Array.isArray(rows) ? (rows as CustomPageDto[]) : [];

    return arr
      .map((p) => {
        const name = safeStr(p.title);
        const slug = safeStr(p.slug);

        const imgBase = pickFirstImage(p);
        const img = imgBase ? toCdnSrc(imgBase, HERO_W, HERO_H, 'fill') || imgBase : '';

        const role = pickRole(p);
        const rating = pickRating(p);

        return {
          id: safeStr(p.id),
          name,
          slug,
          role,
          img,
          alt: safeStr(p.featured_image_alt) || name || 'team member',
          rating,
        };
      })
      .filter((x) => x.name) // isim yoksa basma
      .slice(0, 9);
  }, [data]);

  const makeTeamHref = (slug: string) => {
    // Route varsayımı: /team/[slug]
    // Eğer sizde farklıysa burayı güncelleyin.
    return localizePath(locale as any, `/team/${encodeURIComponent(slug)}`);
  };

  return (
    <section className="team__area pt-120 pb-90">
      <div className="container">
        {/* İstersen mevcut design’da başlık yoksa kaldırabilirsin */}
        <div className="row" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-45">
              <h2 className="section__title">{t.title}</h2>
              <p>{t.desc}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.loading}</p>
              <div className="ens-skel ens-skel--md mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          </div>
        ) : isError ? (
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.error}</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.empty}</p>
            </div>
          </div>
        ) : (
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            {items.map((m) => (
              <div key={m.id} className="col-xl-4 col-lg-6 col-md-6">
                <div className="team__item mb-30">
                  <div className="team__thumb">
                    {m.img ? (
                      <Image src={m.img} alt={m.alt} width={HERO_W} height={HERO_H} />
                    ) : (
                      // Görsel yoksa boş bırakmak yerine skeleton class’ınız varsa kullanın
                      <div className="ens-skel ens-skel--md" aria-hidden />
                    )}
                  </div>

                  <div className="team__content">
                    <h3>
                      {m.slug ? (
                        <Link href={makeTeamHref(m.slug)} aria-label={m.name}>
                          {m.name}
                        </Link>
                      ) : (
                        <span>{m.name}</span>
                      )}
                    </h3>

                    {m.role ? <p>{m.role}</p> : null}

                    {typeof m.rating === 'number' ? (
                      <div className="team__reating" aria-label={t.ratingAria}>
                        <span>{m.rating}</span>
                        <span>
                          <i className="fa-solid fa-star" aria-hidden="true"></i>
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamArea;
