import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import { toCdnSrc } from '@/shared/media';

import FallbackOne from 'public/img/team/01.jpg';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const SUB_TEAM_MGMT = 'bbbb9101-1111-4111-8111-bbbbbbbb9101';

const CARD_W = 520;
const CARD_H = 600;

const Team: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_team', locale as any);

  const sectionSubtitle = ui('ui_team_home_subtitle', 'Our expert team');
  const sectionTitle = ui('ui_team_home_title', "Let's Collaborate With Our Expert Team");
  const viewAll = ui('ui_team_home_view_all', 'View All');

  const { data } = useListCustomPagesPublicQuery({
    module_key: 'team',
    orderDir: 'asc',
    limit: 12,
    is_published: 1,
    locale,
  });

  const mgmt = useMemo(() => {
    const rows: any[] = (data?.items ?? []) as any[];
    return rows
      .filter((r) => safeStr(r?.sub_category_id) === SUB_TEAM_MGMT)
      .slice(0, 6)
      .map((r) => {
        const slug = safeStr(r?.slug);
        const name = safeStr(r?.title) || 'Team Member';
        const role = safeStr(r?.summary) || safeStr(r?.meta_description) || 'Management';

        const imgRaw = safeStr(r?.featured_image);
        const hero = imgRaw ? toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw : '';
        const imgSrc = (hero as any) || (FallbackOne as any);

        return { id: safeStr(r?.id) || slug, slug, name, role, imgSrc };
      })
      .filter((x) => !!x.slug);
  }, [data?.items]);

  const teamHref = localizePath(locale as any, '/team');

  return (
    <section className="expart__area p-relative z-index-11 pt-120 pb-60">
      <div className="expart__cercle-1"></div>
      <div className="expart__cercle-2"></div>

      <div className="container">
        <div className="expart__top mb-70">
          <div className="row align-items-center" data-aos="fade-up" data-aos-delay="300">
            <div className="col-xl-6 col-lg-6">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>Ensotek</span> {sectionSubtitle}
                </span>
                <h2 className="section__title">{sectionTitle}</h2>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6">
              <div className="expart__view text-lg-end">
                <Link className="border__btn" href={teamHref}>
                  {viewAll}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Management carousel */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            {mgmt.length ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{ 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }}
              >
                {mgmt.map((m) => {
                  const href = localizePath(locale as any, `/team/${encodeURIComponent(m.slug)}`);
                  return (
                    <SwiperSlide key={m.id}>
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image
                            src={m.imgSrc}
                            alt={m.name}
                            width={CARD_W}
                            height={CARD_H}
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href={href}>{m.name}</Link>
                          </h3>
                          <p>{m.role}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className="skeleton-line" style={{ height: 16 }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
