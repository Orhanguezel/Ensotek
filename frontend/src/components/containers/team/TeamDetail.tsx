// =============================================================
// FILE: src/components/containers/team/TeamDetail.tsx
// Ensotek – Team Detail Content (DB seed compatible)
//   - Data: custom_pages/by-slug (module_key="team")
//   - Locale: useLocaleShort() (single source)
//   - UI i18n: site_settings.ui_team
//   - Content: prefers content_html; fallback: content.html (JSON/string)
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

function contentToHtml(row: any): string {
  const html1 = safeStr(row?.content_html);
  if (html1) return html1;

  const c = row?.content;

  // content object { html: "..." }
  if (c && typeof c === 'object' && safeStr((c as any).html)) return safeStr((c as any).html);

  // content string: JSON veya direkt HTML
  if (typeof c === 'string') {
    const s = c.trim();
    if (!s) return '';
    try {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object' && safeStr((parsed as any).html)) {
        return safeStr((parsed as any).html);
      }
      return s;
    } catch {
      return s;
    }
  }

  return '';
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

  const viewModel = useMemo(() => {
    if (!data) return null;

    const row: CustomPageDto = data as any;

    // ✅ name: seed’de title’ı “İbrahim YAĞAR” gibi sade tutacağız
    const name = safeStr((row as any)?.title) || untitled;

    // ✅ role: kısa görev
    const role =
      safeStr((row as any)?.summary) ||
      safeStr((row as any)?.meta_description) ||
      safeStr(roleFallback) ||
      '';

    const imgRaw = safeStr((row as any)?.featured_image);
    const hero = imgRaw ? toCdnSrc(imgRaw, HERO_W, HERO_H, 'fill') || imgRaw : '';
    const imgSrc = (hero as any) || (FallbackOne as any);

    const html = contentToHtml(row as any);

    return { name, role, imgSrc, html };
  }, [data, untitled, roleFallback]);

  return (
    <section className="team__area p-relative z-index-11 pt-120 pb-120 overflow-hidden ab-team">
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
            <div className="team__thumb mb-40">
              {isLoading ? (
                <div className="skeleton-line" style={{ width: '100%', paddingBottom: '120%' }} />
              ) : viewModel ? (
                <Image
                  src={viewModel.imgSrc}
                  alt={viewModel.name || 'team member'}
                  width={HERO_W}
                  height={HERO_H}
                  style={{ width: '100%', height: 'auto' }}
                  loading="lazy"
                />
              ) : null}
            </div>
          </div>

          {/* Content */}
          <div className="col-xl-7 col-lg-7">
            {isLoading ? (
              <div aria-hidden>
                <div className="skeleton-line" style={{ height: 32, marginBottom: 16 }} />
                <div
                  className="skeleton-line"
                  style={{ height: 20, width: '60%', marginBottom: 24 }}
                />
                <div className="skeleton-line" style={{ height: 16, marginBottom: 8 }} />
                <div
                  className="skeleton-line"
                  style={{ height: 16, width: '90%', marginBottom: 8 }}
                />
                <div className="skeleton-line" style={{ height: 16, width: '80%' }} />
              </div>
            ) : !viewModel ? (
              <p className="mb-0">{emptyText}</p>
            ) : (
              <div className="team__detail-content">
                <div className="section__title-wrapper mb-30">
                  <span className="section__subtitle-2">
                    <span>{kickerPrefix}</span> {kickerLabel}
                  </span>

                  <h2 className="section__title-2">{viewModel.name}</h2>

                  {viewModel.role ? <p className="team__detail-role">{viewModel.role}</p> : null}
                </div>

                {viewModel.html ? (
                  <div
                    className="prose-content"
                    dangerouslySetInnerHTML={{ __html: viewModel.html }}
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
