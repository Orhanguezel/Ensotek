// =============================================================
// FILE: src/components/containers/team/TeamPageContent.tsx
// Ensotek – Team Page Content
//   - Data: custom_pages (module_key = "team")
//   - UI i18n: site_settings.ui_team
//   - Locale-aware routes with localizePath
//   - Slider: Swiper (Autoplay + Navigation)
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

// RTK – Custom Pages (public)
import { useListCustomPagesPublicQuery } from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper’lar
import { toCdnSrc } from "@/shared/media";

// i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// Fallback görseller
import FallbackOne from "public/img/team/01.jpg";

const CARD_W = 480;
const CARD_H = 520;
const PAGE_LIMIT = 24; // ekip üyeleri için yeterli

const TeamPageContent: React.FC = () => {
    // Artık locale'yi split etmeden, sistemin çözdüğü haliyle kullanıyoruz
    const locale = useResolvedLocale() || "tr";

    const { ui } = useUiSection("ui_team", locale);

    const sectionSubtitlePrefix = ui("ui_team_subprefix", "Ensotek");
    const sectionSubtitleLabel = ui("ui_team_sublabel", "Our expert team");
    const sectionTitle = ui("ui_team_title", "Meet our engineering team");
    const readMore = ui("ui_team_read_more", "View details");
    const readMoreAria = ui(
        "ui_team_read_more_aria",
        "view team member details",
    );
    const emptyText = ui(
        "ui_team_empty",
        "There are no team members to display at the moment.",
    );
    const untitled = ui("ui_team_untitled", "Unnamed team member");
    const roleFallback = ui("ui_team_role_fallback", "Expert engineer");

    // Liste: module_key = "team"
    const { data, isLoading } = useListCustomPagesPublicQuery({
        module_key: "team",
        sort: "created_at",
        orderDir: "desc",
        limit: PAGE_LIMIT,
        is_published: 1,
        locale,
    });

    const items = useMemo(() => {
        const list: CustomPageDto[] = data?.items ?? [];

        return list.map((row, index) => {
            const name = (row.title || "").trim() || untitled;
            const slug = (row.slug || "").trim();

            // Rol / pozisyon: summary > meta_description > fallback
            const role =
                (row.summary || "").trim() ||
                (row.meta_description || "").trim() ||
                roleFallback;

            const imgRaw = (row.featured_image || "").trim();
            const hero =
                (imgRaw &&
                    (toCdnSrc(imgRaw, CARD_W, CARD_H, "fill") || imgRaw)) ||
                "";

            // Rating: şimdilik statik 5 – istersen tags içinden okuyabilirsin
            const rating = 5;

            return {
                id: row.id ?? `team-${index}`,
                name,
                role,
                slug,
                hero,
                rating,
            };
        });
    }, [data, untitled, roleFallback]);

    const teamListHref = localizePath(locale, "/team");

    return (
        <section className="team__area p-relative z-index-11 pt-120 pb-120 overflow-hidden">
            <div className="container">
                {/* Başlık + Navigation */}
                <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-6">
                        <div className="section__title-wrapper mb-60">
                            <span className="section__subtitle-2">
                                <span>{sectionSubtitlePrefix}</span> {sectionSubtitleLabel}
                            </span>
                            <h2 className="section__title-2">{sectionTitle}</h2>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                        <div className="team__navigation">
                            <button
                                className="team__button-prev"
                                aria-label="Previous"
                                type="button"
                            >
                                <i className="fa-solid fa-arrow-left-long" />
                            </button>
                            <button
                                className="team__button-next"
                                aria-label="Next"
                                type="button"
                            >
                                <i className="fa-solid fa-arrow-right-long" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <div className="row" data-aos="fade-up" data-aos-delay="300">
                    <div className="col-12">
                        {items.length === 0 && !isLoading && (
                            <p className="text-center mb-0">{emptyText}</p>
                        )}

                        {items.length > 0 && (
                            <div className="swiper">
                                <div className="swiper-wrapper">
                                    <Swiper
                                        slidesPerView={1}
                                        spaceBetween={30}
                                        loop
                                        roundLengths
                                        modules={[Autoplay, Navigation]}
                                        autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                        }}
                                        navigation={{
                                            nextEl: ".team__button-next",
                                            prevEl: ".team__button-prev",
                                        }}
                                        className="team__active"
                                        breakpoints={{
                                            576: {
                                                slidesPerView: 2,
                                            },
                                            992: {
                                                slidesPerView: 3,
                                            },
                                        }}
                                    >
                                        {items.map((t) => {
                                            const detailHref = t.slug
                                                ? localizePath(
                                                    locale,
                                                    `/team/${encodeURIComponent(t.slug)}`,
                                                )
                                                : teamListHref;

                                            const imgSrc =
                                                (t.hero as any) || (FallbackOne as any);

                                            return (
                                                <SwiperSlide key={t.id}>
                                                    <div className="swiper-slide">
                                                        <div className="team__item">
                                                            <div className="team__thumb">
                                                                <Image
                                                                    src={imgSrc}
                                                                    alt={t.name || "team member"}
                                                                    width={CARD_W}
                                                                    height={CARD_H}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "auto",
                                                                    }}
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <div className="team__content">
                                                                <h3>
                                                                    {/* Detay sayfası varsa link, yoksa plain text */}
                                                                    {t.slug ? (
                                                                        <Link href={detailHref}>
                                                                            {t.name}
                                                                        </Link>
                                                                    ) : (
                                                                        t.name
                                                                    )}
                                                                </h3>
                                                                <p>{t.role}</p>
                                                                <div className="team__reating">
                                                                    <span>{t.rating}</span>
                                                                    <span>
                                                                        <i className="fa-solid fa-star" />
                                                                    </span>
                                                                </div>
                                                                {t.slug && (
                                                                    <div style={{ marginTop: 8 }}>
                                                                        <Link
                                                                            href={detailHref}
                                                                            className="link-more"
                                                                            aria-label={`${t.name} — ${readMoreAria}`}
                                                                        >
                                                                            {readMore} →
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="accordion-item" aria-hidden>
                                <div className="accordion-body">
                                    <div
                                        className="skeleton-line"
                                        style={{ height: 16, marginBottom: 8 }}
                                    />
                                    <div
                                        className="skeleton-line"
                                        style={{ height: 16, width: "80%" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamPageContent;
