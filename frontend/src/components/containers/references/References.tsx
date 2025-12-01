// =============================================================
// FILE: src/components/containers/references/References.tsx
// Public References – logos slider + UI i18n
//   - Öne çıkan referanslar (is_featured=1) slider
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
// @ts-expect-error Swiper CSS side-effect import
import "swiper/css";

// Icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// RTK – References public
import {
  useListReferencesQuery,
} from "@/integrations/rtk/endpoints/references.endpoints";
import type { ReferenceDto } from "@/integrations/types/references.types";

// Placeholders
import One from "public/img/brand/1.png";
import Two from "public/img/brand/2.png";
import Three from "public/img/brand/3.png";
import Four from "public/img/brand/4.png";
import Five from "public/img/brand/5.png";

// Ortak helper'lar
import { toCdnSrc } from "@/lib/shared/media";

// Yeni i18n helper'lar
import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";
import { localizePath } from "@/i18n/url";

const CARD_W = 160;
const CARD_H = 60;

const altFromSlug = (slug?: string | null) =>
  (slug || "reference").replace(/[-_]+/g, " ").trim();

/** Başlığın son kelimesini .down__mark-line ile işaretle */
function decorateTitleWithMarkLine(title: string) {
  const parts = (title || "").split(" ").filter(Boolean);
  if (parts.length <= 1)
    return <span className="down__mark-line">{title}</span>;
  const last = parts.pop()!;
  return (
    <>
      {parts.join(" ")} <span className="down__mark-line">{last}</span>
    </>
  );
}

const References: React.FC = () => {
  const locale = useResolvedLocale();

  // UI metinleri → site_settings.key = "ui_references"
  const { ui } = useUiSection("ui_references", locale, UI_KEYS.references);

  // Public references listesi
  // NOT: Burada tüm yayınlananları çekiyoruz, öne çıkan filtresini
  // sadece front-end tarafında uygulayacağız.
  const { data, isLoading } = useListReferencesQuery({
    limit: 30,
    sort: "display_order",
    orderDir: "asc",
    is_published: 1,
  });

  const logos = useMemo(() => {
    const list: ReferenceDto[] = data?.items ?? [];

    // Önce sadece yayınlanan + öne çıkanları al
    const featured = list.filter(
      (r) => r.is_published === 1 && r.is_featured === 1,
    );

    // Eğer hiç öne çıkan yoksa, fallback olarak tüm yayınlananları kullan
    const source =
      featured.length > 0
        ? featured
        : list.filter((r) => r.is_published === 1);

    const base = source
      .slice(0, 30)
      .map((r) => {
        const imgRaw =
          r.featured_image_url_resolved ||
          r.featured_asset?.url ||
          r.featured_image ||
          null;

        const src =
          (imgRaw && toCdnSrc(imgRaw, CARD_W, CARD_H, "fit")) ||
          imgRaw ||
          "";

        if (!src) return null;

        const title = (r.title ?? "").trim();
        const alt =
          title ||
          r.featured_image_alt ||
          altFromSlug(r.slug) ||
          "reference";

        return {
          id: r.id,
          alt,
          src,
        };
      })
      .filter(Boolean) as { id: string; alt: string; src: string }[];

    if (!base.length) {
      return [
        { id: "ph-1", alt: "brand", src: One as any },
        { id: "ph-2", alt: "brand", src: Two as any },
        { id: "ph-3", alt: "brand", src: Three as any },
        { id: "ph-4", alt: "brand", src: Four as any },
        { id: "ph-5", alt: "brand", src: Five as any },
      ];
    }

    return base;
  }, [data]);

  const title = ui("ui_references_title", "Referanslarımız");
  const subprefix = ui("ui_references_subprefix", "Ensotek");
  const sublabel = ui("ui_references_sublabel", "Referanslar");
  const viewAllText = ui("ui_references_view_all", "Tüm Referanslar");
  const prevLabel = ui("ui_references_prev", "Önceki");
  const nextLabel = ui("ui_references_next", "Sonraki");

  // /references linkini locale ile normalize et
  const referencesHref = localizePath(locale, "/references");

  return (
    <div
      className="brand__area grey-bg pt-60 pb-60"
      style={{ overflow: "visible" }}
    >
      <div className="container">
        {/* Başlık + oklar + View All */}
        <div
          className="row align-items-center mb-25"
          style={{ rowGap: 10 }}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="col-12 col-md-7">
            <div className="section__title-wrapper text-center text-md-start mb-0">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sublabel}
              </span>
              <h2
                className="section__title"
                style={{ marginBottom: 0 }}
              >
                {decorateTitleWithMarkLine(title)}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end align-items-center gap-2">
            <div className="feedback__navigation me-2 d-none d-sm-flex">
              <button
                className="references__button-prev"
                aria-label={prevLabel}
              >
                <FiChevronLeft />
              </button>
              <button
                className="references__button-next"
                aria-label={nextLabel}
              >
                <FiChevronRight />
              </button>
            </div>

            <Link
              href={referencesHref}
              className="solid__btn"
              aria-label={viewAllText}
            >
              {viewAllText}
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div
          className="row justify-content-center"
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="1000"
        >
          <div className="col-12">
            <Swiper
              modules={[Autoplay, Navigation]}
              navigation={{
                nextEl: ".references__button-next",
                prevEl: ".references__button-prev",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={logos.length > 6}
              spaceBetween={24}
              slidesPerView={2.2}
              breakpoints={{
                480: { slidesPerView: 3.2 },
                768: { slidesPerView: 4.2 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
              }}
              className="brand__active"
            >
              {logos.map((logo, i) => (
                <SwiperSlide key={`${logo.id}-${i}`}>
                  <div
                    className="brand__line"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div className="singel__brand">
                      <Image
                        src={logo.src as any}
                        alt={logo.alt}
                        width={CARD_W}
                        height={CARD_H}
                        loading={i < 2 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {isLoading && (
              <div className="skeleton-line mt-20" aria-hidden />
            )}
          </div>
        </div>
      </div>

      {/* Okların stili */}
      <style jsx>{`
        .feedback__navigation button {
          display: inline-flex;
          width: 50px;
          height: 50px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          color: #111;
          transition: all 0.2s ease;
        }
        .feedback__navigation button + button {
          margin-left: 6px;
        }
        .feedback__navigation button:hover {
          background: var(--tp-theme-1, #5a57ff);
          color: #fff;
          border-color: transparent;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default References;
