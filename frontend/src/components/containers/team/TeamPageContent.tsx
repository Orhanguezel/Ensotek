// =============================================================
// FILE: src/components/containers/team/TeamPageContent.tsx
// Ensotek – Team Page Content (Grouped Carousels by sub_category_id)
//   - Output: 4 sections, each its own Swiper carousel
//   - ✅ Carousel bozulmaz: Swiper DOM + class'lar korunur
//   - ✅ Resim altı: sadece isim (title) -> CSS ile resim DIŞINA alınır
//   - ✅ Hover: kısa görev bilgisi (clamp)
//   - ✅ display_order sort: order param
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import { toCdnSrc } from '@/shared/media';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import FallbackOne from 'public/img/team/01.jpg';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

// title: "İbrahim YAĞAR – Kurucu & Genel Müdür" -> "İbrahim YAĞAR"
function normalizeNameFromTitle(raw: string): string {
  const t = safeStr(raw);
  if (!t) return '';
  // sadece " boşluk + (– veya -) + boşluk " varsa böl (soyad tireli olursa bozulmasın)
  const parts = t.split(/\s[–-]\s/);
  return safeStr(parts[0]) || t;
}

// ---- Seed’deki sub_category_id’ler (TEAM) ----
const SUB_TEAM_MGMT = 'bbbb9101-1111-4111-8111-bbbbbbbb9101';
const SUB_TEAM_ENG = 'bbbb9102-1111-4111-8111-bbbbbbbb9102';
const SUB_TEAM_SERVICE = 'bbbb9103-1111-4111-8111-bbbbbbbb9103';
const SUB_TEAM_FT = 'bbbb9104-1111-4111-8111-bbbbbbbb9104';

const CARD_W = 480;
const CARD_H = 520;
const PAGE_LIMIT = 80;

type GroupKey = 'mgmt' | 'eng' | 'service' | 'ft';

type TeamCardVM = {
  id: string;
  slug: string;
  name: string;
  roleShort: string;
  noteShort?: string;
  imgSrc: any;
};

type TeamGroupVM = {
  key: GroupKey;
  title: string;
  prevClass: string;
  nextClass: string;
  items: TeamCardVM[];
};

function pickRoleShort(row: any, roleFallback: string): string {
  const s1 = safeStr(row?.summary);
  const s2 = safeStr(row?.meta_description);
  const raw = s1 || s2 || safeStr(roleFallback) || '';
  if (!raw) return '';
  const firstSentence = raw.split(/(?<=[.!?])\s+/)[0] ?? raw;
  return safeStr(firstSentence) || raw;
}

function pickNoteShort(row: any, roleShort: string): string {
  const md = safeStr(row?.meta_description);
  if (!md) return '';
  if (md === roleShort) return '';
  return md;
}

function buildCardVm(row: any, untitled: string, roleFallback: string): TeamCardVM | null {
  const slug = safeStr(row?.slug);
  if (!slug) return null;

  const rawTitle = safeStr(row?.title) || untitled;
  const name = normalizeNameFromTitle(rawTitle) || untitled;

  const roleShort = pickRoleShort(row, roleFallback);
  const noteShort = pickNoteShort(row, roleShort);

  const imgRaw = safeStr(row?.featured_image);
  const hero = imgRaw ? toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw : '';
  const imgSrc = (hero as any) || (FallbackOne as any);

  return {
    id: safeStr(row?.id) || slug,
    slug,
    name,
    roleShort,
    noteShort: noteShort || undefined,
    imgSrc,
  };
}

function renderTeamCarousel(group: TeamGroupVM, locale: string) {
  if (!group.items.length) return null;

  return (
    <section
      className="team__area p-relative z-index-11 pt-60 pb-60 overflow-hidden"
      key={group.key}
    >
      <div className="container">
        {/* Header + navigation (ESKİ HALİ KORUNUR) */}
        <div className="row align-items-center">
          <div className="col-xl-8 col-lg-8">
            <div className="section__title-wrapper mb-40">
              <h2 className="section__title-2">{group.title}</h2>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="team__navigation text-lg-end">
              <button className={group.prevClass} aria-label="Previous" type="button">
                <i className="fa-solid fa-arrow-left-long" />
              </button>
              <button className={group.nextClass} aria-label="Next" type="button">
                <i className="fa-solid fa-arrow-right-long" />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper */}
        <div className="row" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop
              roundLengths
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              navigation={{
                nextEl: `.${group.nextClass}`,
                prevEl: `.${group.prevClass}`,
              }}
              className="team__active"
              breakpoints={{
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
            >
              {group.items.map((t) => {
                const detailHref = localizePath(
                  locale as any,
                  `/team/${encodeURIComponent(t.slug)}`,
                );

                return (
                  <SwiperSlide key={t.id}>
                    <div className="team__item teamItem--nameBelow">
                      {/* Image */}
                      <div className="team__thumb teamThumbHover">
                        <Link href={detailHref} aria-label={t.name}>
                          <Image
                            src={t.imgSrc}
                            alt={t.name || 'team member'}
                            width={CARD_W}
                            height={CARD_H}
                            style={{ width: '100%', height: 'auto' }}
                            loading="lazy"
                          />
                        </Link>

                        {/* Hover overlay */}
                        <div className="teamThumbHover__overlay" aria-hidden>
                          <div className="teamThumbHover__box">
                            {t.roleShort ? (
                              <div className="teamThumbHover__role">{t.roleShort}</div>
                            ) : null}
                            {t.noteShort ? (
                              <div className="teamThumbHover__note">{t.noteShort}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Name below image */}
                      <div className="team__content teamContent--nameOnly">
                        <h3 className="teamNameOnly">
                          <Link href={detailHref}>{t.name}</Link>
                        </h3>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

const TeamPageContent: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_team', locale as any);

  const emptyText = ui('ui_team_empty', 'There are no team members to display at the moment.');
  const untitled = ui('ui_team_untitled', 'Unnamed team member');
  const roleFallback = ui('ui_team_role_fallback', 'Expert engineer');

  const titleMgmt = ui('ui_team_group_mgmt_title', 'Yönetim ve Kurucu Ortaklar');
  const titleEng = ui('ui_team_group_eng_title', 'Mühendislik Ekibi');
  const titleService = ui('ui_team_group_service_title', 'Saha ve Servis Ekibi');
  const titleFt = ui('ui_team_group_ft_title', 'Dış Ticaret');

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: 'team',
    order: 'display_order.asc,created_at.asc',
    limit: PAGE_LIMIT,
    is_published: 1,
    locale,
  });

  const grouped = useMemo(() => {
    const rows: any[] = (data?.items ?? []) as any[];

    const mgmt: TeamCardVM[] = [];
    const eng: TeamCardVM[] = [];
    const service: TeamCardVM[] = [];
    const ft: TeamCardVM[] = [];

    for (const r of rows) {
      const vm = buildCardVm(r, untitled, roleFallback);
      if (!vm) continue;

      const subId = safeStr(r?.sub_category_id);
      if (subId === SUB_TEAM_MGMT) mgmt.push(vm);
      else if (subId === SUB_TEAM_ENG) eng.push(vm);
      else if (subId === SUB_TEAM_SERVICE) service.push(vm);
      else if (subId === SUB_TEAM_FT) ft.push(vm);
      else mgmt.push(vm);
    }

    const makeGroup = (key: GroupKey, title: string, items: TeamCardVM[]): TeamGroupVM => ({
      key,
      title,
      prevClass: `team__button-prev--${key}`,
      nextClass: `team__button-next--${key}`,
      items,
    });

    return [
      makeGroup('mgmt', titleMgmt, mgmt),
      makeGroup('eng', titleEng, eng),
      makeGroup('service', titleService, service),
      makeGroup('ft', titleFt, ft),
    ].filter((g) => g.items.length > 0);
  }, [data?.items, untitled, roleFallback, titleMgmt, titleEng, titleService, titleFt]);

  if (!isLoading && grouped.length === 0) {
    return (
      <section className="team__area p-relative z-index-11 pt-120 pb-120 overflow-hidden">
        <div className="container">
          <p className="text-center mb-0">{emptyText}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {isLoading ? (
        <section
          className="team__area p-relative z-index-11 pt-120 pb-120 overflow-hidden"
          aria-hidden
        >
          <div className="container">
            <div className="skeleton-line" style={{ height: 28, width: '50%', marginBottom: 16 }} />
            <div className="skeleton-line" style={{ height: 16, width: '80%' }} />
          </div>
        </section>
      ) : null}

      {!isLoading && grouped.map((g) => renderTeamCarousel(g, String(locale || 'de')))}
    </>
  );
};

export default TeamPageContent;
