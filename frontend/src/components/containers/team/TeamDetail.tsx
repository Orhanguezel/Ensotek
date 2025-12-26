// =============================================================
// FILE: src/components/containers/team/TeamDetail.tsx
// Ensotek – Team Detail Content
//   - Data: custom_pages (module_key = "team")
//   - Query: getCustomPageBySlugPublic (slug + locale)
//   - UI i18n: site_settings.ui_team
//   - Locale-aware routes with localizePath
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useGetCustomPageBySlugPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { toCdnSrc } from '@/shared/media';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Fallback görsel
import FallbackOne from 'public/img/team/01.jpg';

const HERO_W = 560;
const HERO_H = 640;

export interface TeamDetailProps {
  slug: string;
}

const TeamDetail: React.FC<TeamDetailProps> = ({ slug }) => {
  const locale = useResolvedLocale() || 'de';

  const { ui } = useUiSection('ui_team', locale);

  const backLabel = ui('ui_team_detail_back', locale === 'de' ? 'Ekibe geri dön' : 'Back to team');
  const backAria = ui(
    'ui_team_detail_back_aria',
    locale === 'de' ? 'ekip listesine geri dön' : 'back to team list',
  );
  const emptyText = ui(
    'ui_team_detail_empty',
    locale === 'de' ? 'Ekip üyesi bulunamadı.' : 'Team member could not be found.',
  );
  const untitled = ui(
    'ui_team_untitled',
    locale === 'de' ? 'İsimsiz ekip üyesi' : 'Unnamed team member',
  );
  const roleFallback = ui(
    'ui_team_role_fallback',
    locale === 'de' ? 'Uzman mühendis' : 'Expert engineer',
  );

  const kickerPrefix = ui('ui_team_detail_subprefix', 'Ensotek');
  const kickerLabel = ui(
    'ui_team_detail_sublabel',
    locale === 'de' ? 'Yönetim ekibimiz' : 'Management team',
  );

  const noContentText = ui(
    'ui_team_detail_no_content',
    locale === 'de'
      ? 'Bu ekip üyesi için henüz ek bilgi girilmemiştir.'
      : 'No additional information has been provided yet.',
  );

  const { data, isLoading } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    {
      skip: !slug,
    },
  );

  const backHref = localizePath(locale, '/team');

  const viewModel = useMemo(() => {
    if (!data) return null;

    const row: CustomPageDto = data;

    const name = (row.title || '').trim() || untitled;

    // Rol / pozisyon:
    //  1) summary (örn: kısa profil cümlesi)
    //  2) meta_description
    //  3) fallback
    const role = (row.summary || '').trim() || (row.meta_description || '').trim() || roleFallback;

    const imgRaw = (row.featured_image || '').trim();
    const hero = (imgRaw && (toCdnSrc(imgRaw, HERO_W, HERO_H, 'fill') || imgRaw)) || '';
    const imgSrc = (hero as any) || (FallbackOne as any);

    const html = (row.content_html || '').trim();

    return {
      name,
      role,
      imgSrc,
      html,
    };
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
          {/* Görsel */}
          <div className="col-xl-5 col-lg-5">
            <div className="team__thumb mb-40">
              {isLoading && (
                <div className="skeleton-line" style={{ width: '100%', paddingBottom: '120%' }} />
              )}
              {!isLoading && viewModel && (
                <Image
                  src={viewModel.imgSrc}
                  alt={viewModel.name || 'team member'}
                  width={HERO_W}
                  height={HERO_H}
                  style={{ width: '100%', height: 'auto' }}
                  loading="lazy"
                />
              )}
            </div>
          </div>

          {/* Metin / içerik */}
          <div className="col-xl-7 col-lg-7">
            {isLoading && (
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
            )}

            {!isLoading && !viewModel && <p className="mb-0">{emptyText}</p>}

            {!isLoading && viewModel && (
              <div className="team__detail-content">
                <div className="section__title-wrapper mb-30">
                  <span className="section__subtitle-2">
                    <span>{kickerPrefix}</span> {kickerLabel}
                  </span>
                  <h2 className="section__title-2">{viewModel.name}</h2>

                  {/* Rol / kısa profil */}
                  {viewModel.role && <p className="team__detail-role">{viewModel.role}</p>}
                </div>

                {/* Direkt içerik – ekstra "About this team member" başlığı yok */}
                {viewModel.html ? (
                  <div
                    className="prose-content"
                    dangerouslySetInnerHTML={{
                      __html: viewModel.html,
                    }}
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
