// =============================================================
// FILE: src/components/containers/team/TeamDetail.tsx
// Ensotek – Team Detail Content (DB seed compatible) [FINAL]
// Fixes:
// - ✅ Removes duplicated leading headings AND duplicated role lines from content
// - ✅ Single source for name + role (no double render)
// - ✅ Social/icon blocks normalized via scoped classes (CSS side)
// - ✅ NO inline styles
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useGetCustomPageBySlugPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { toCdnSrc } from '@/shared/media';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import FallbackOne from 'public/img/team/01.jpg';

const HERO_W = 560;
const HERO_H = 640;

export interface TeamDetailProps {
  slug: string;
}

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

function safeJson<T>(v: unknown, fallback: T): T {
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

function contentToHtml(row: any): string {
  const html1 = safeStr(row?.content_html);
  if (html1) return html1;

  const c = row?.content;

  if (c && typeof c === 'object' && safeStr((c as any).html)) return safeStr((c as any).html);

  if (typeof c === 'string') {
    const s = c.trim();
    if (!s) return '';
    if (s.startsWith('{') || s.startsWith('[')) {
      const parsed = safeJson<any>(s, null);
      const html = safeStr(parsed?.html);
      if (html) return html;
    }
    return s;
  }

  return '';
}

/**
 * İçerikte tekrarlanan başlıkları ve role satırlarını temizler.
 * - Leading h1/h2/h3 kaldırılır
 * - İlk paragrafta/strong'da geçen role tekrarını kaldırır (role string match)
 * - İçerikte "Yönetim & Operasyon" gibi kısa role satırı ayrı bir <p> ise onu siler
 */
function normalizeDetailHtml(html: string, name: string, role: string): string {
  let s = safeStr(html);
  if (!s) return '';

  // 1) Leading headings (name repeat)
  s = s
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
    .replace(/^\s*<h2[^>]*>[\s\S]*?<\/h2>\s*/i, '')
    .replace(/^\s*<h3[^>]*>[\s\S]*?<\/h3>\s*/i, '');

  // 2) Eğer içerik başında "Mehmet KAYA" gibi plain text heading variasyonu varsa:
  // (bazı editörler <p><strong>Mehmet KAYA</strong></p> basıyor)
  if (name) {
    const escName = escapeRegExp(name);
    s = s.replace(
      new RegExp(
        `^\\s*<p[^>]*>\\s*(<strong[^>]*>)?\\s*${escName}\\s*(</strong>)?\\s*</p>\\s*`,
        'i',
      ),
      '',
    );
  }

  // 3) Role tekrarını temizle (role tek yerde gösterilecek)
  const r = safeStr(role);
  if (r) {
    const escRole = escapeRegExp(r);

    // role tek başına paragraf ise kaldır
    s = s.replace(
      new RegExp(
        `^\\s*<p[^>]*>\\s*(<strong[^>]*>)?\\s*${escRole}\\s*(</strong>)?\\s*</p>\\s*`,
        'i',
      ),
      '',
    );

    // role <p> içinde başlayıp devam ediyorsa (ör. "Kıdemli Proje Mühendisi" satırı):
    s = s.replace(
      new RegExp(`<p([^>]*)>\\s*(<strong[^>]*>)?\\s*${escRole}\\s*(</strong>)?\\s*</p>`, 'ig'),
      '',
    );
  }

  // 4) Boş kalan üst üste <p></p> temizliği
  s = s.replace(/<p>\s*<\/p>/gi, '').replace(/^\s+/g, '');

  return s;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const TeamDetail: React.FC<TeamDetailProps> = ({ slug }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_team', locale as any);

  const backLabel = ui('ui_team_detail_back', 'Back to team');
  const backAria = ui('ui_team_detail_back_aria', 'back to team list');
  const emptyText = ui('ui_team_detail_empty', 'Team member could not be found.');
  const untitled = ui('ui_team_untitled', 'Unnamed team member');
  const roleFallback = ui('ui_team_role_fallback', 'Expert engineer');

  const kickerPrefix = ui('ui_team_detail_subprefix', 'Ensotek');
  const kickerLabel = ui('ui_team_detail_sublabel', 'Team');

  const noContentText = ui(
    'ui_team_detail_no_content',
    'No additional information has been provided yet.',
  );

  const { data, isLoading } = useGetCustomPageBySlugPublicQuery({ slug, locale }, { skip: !slug });

  const backHref = localizePath(locale as any, '/team');

  const vm = useMemo(() => {
    if (!data) return null;

    const row: CustomPageDto = data as any;

    const name = safeStr((row as any)?.title) || untitled;

    // Role: summary tercih, yoksa meta_description, yoksa fallback
    const role =
      safeStr((row as any)?.summary) ||
      safeStr((row as any)?.meta_description) ||
      safeStr(roleFallback) ||
      '';

    const imgRaw = safeStr((row as any)?.featured_image);
    const hero = imgRaw ? toCdnSrc(imgRaw, HERO_W, HERO_H, 'fill') || imgRaw : '';
    const imgSrc = (hero as any) || (FallbackOne as any);

    const rawHtml = contentToHtml(row as any);
    const html = normalizeDetailHtml(rawHtml, name, role);

    return { name, role, imgSrc, html };
  }, [data, untitled, roleFallback]);

  return (
    <section className="team__area p-relative z-index-11 pt-120 pb-120 overflow-hidden ab-team ens-teamDetail">
      <div className="container">
        {/* Back link */}
        <div className="row">
          <div className="col-12">
            <div className="mb-40">
              <Link href={backHref} className="border__btn" aria-label={backAria}>
                ← {backLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="row align-items-start" data-aos="fade-up" data-aos-delay="300">
          {/* Image */}
          <div className="col-xl-5 col-lg-5">
            <div className="team__thumb mb-40 ens-teamDetail__thumb">
              {isLoading ? (
                <div className="ens-teamDetail__thumbSkel" aria-hidden />
              ) : vm ? (
                <Image
                  src={vm.imgSrc}
                  alt={vm.name || 'team member'}
                  width={HERO_W}
                  height={HERO_H}
                  className="ens-teamDetail__img"
                  loading="lazy"
                />
              ) : null}
            </div>
          </div>

          {/* Content */}
          <div className="col-xl-7 col-lg-7">
            {isLoading ? (
              <div className="ens-teamDetail__skel" aria-hidden>
                <div className="ens-teamDetail__skelLine ens-teamDetail__skelLine--h32" />
                <div className="ens-teamDetail__skelLine ens-teamDetail__skelLine--w60" />
                <div className="ens-teamDetail__skelLine" />
                <div className="ens-teamDetail__skelLine ens-teamDetail__skelLine--w90" />
                <div className="ens-teamDetail__skelLine ens-teamDetail__skelLine--w80" />
              </div>
            ) : !vm ? (
              <p className="mb-0">{emptyText}</p>
            ) : (
              <div className="team__detail-content ens-teamDetail__content">
                <div className="section__title-wrapper mb-30">
                  <span className="section__subtitle-2">
                    <span>{kickerPrefix}</span> {kickerLabel}
                  </span>

                  {/* ✅ Name ONLY once */}
                  <h1 className="section__title-2 ens-teamDetail__title">{vm.name}</h1>

                  {/* ✅ Role ONLY once */}
                  {vm.role ? <p className="ens-teamDetail__role">{vm.role}</p> : null}
                </div>

                {vm.html ? (
                  <div
                    className="ens-teamDetail__prose tp-postbox-details"
                    dangerouslySetInnerHTML={{ __html: vm.html }}
                  />
                ) : (
                  <p className="mb-0">{noContentText}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDetail;
