// =============================================================
// FILE: src/components/containers/about/About.tsx
// Public About – Custom Pages (module_key="about") + UI i18n
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Şekiller + fallback görsel
import Two from "/public/img/shape/hero-shape-4.png";

// RTK – Custom Pages Public
import {
  useListCustomPagesPublicQuery,
} from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper'lar
import { excerpt } from "@/lib/shared/text";
import { toCdnSrc } from "@/lib/shared/media";

// Yeni i18n helper'lar
import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";
import { localizePath } from "@/i18n/url";

const About: React.FC = () => {
  const locale = useResolvedLocale();

  // UI strings (subtitle parçaları + buton + fallback başlık)
  // site_settings.key = "ui_about"
  const { ui } = useUiSection("ui_about", locale, UI_KEYS.about);

  // Custom pages → module_key = "about"
  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: "about",
    locale,
    limit: 3,
    sort: "created_at",
    orderDir: "asc",
  });

  const [first, second, third] = useMemo(() => {
    const items: CustomPageDto[] = data?.items ?? [];
    const published = items.filter((p) => p.is_published);
    const arr = published.slice(0, 3);
    return [arr[0], arr[1], arr[2]];
  }, [data]);

  // Ana blok (1. kayıt)
  const firstTitle =
    (first?.title ?? "").trim() ||
    ui("ui_about_fallback_title", "Ensotek Su Soğutma Kuleleri Hakkında");

  const firstSummary =
    excerpt(first?.content_html ?? "", 260) || "";

  const heroSrc =
    (first?.featured_image &&
      (toCdnSrc(first.featured_image, 720, 520, "fill") ||
        first.featured_image)) ||
    (Two as unknown as string);

  // Bullet 1 (2. kayıt)
  const secondTitle = (second?.title ?? "").trim();
  const secondText = excerpt(second?.content_html ?? "", 170);

  // Bullet 2 (3. kayıt)
  const thirdTitle = (third?.title ?? "").trim();
  const thirdText = excerpt(third?.content_html ?? "", 170);

  // /about linkini locale ile normalize et
  const aboutHref = localizePath(locale, "/about");

  return (
    <div className="about__area grey-bg z-index-11 p-relative pt-120 pb-60">
      {/* shapes */}
      <div className="about__shape-2">
        <Image src={Two} alt="shape" />
      </div>

      <div className="container">
        <div
          className="row align-items-center"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {/* Sol görsel */}
          <div className="col-xl-6 col-lg-6">
            <div className="about__thumb-wrapper mb-60">
              <div className="about__thumb w-img">
                <Image
                  src={heroSrc as any}
                  alt={firstTitle}
                  width={720}
                  height={520}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Sağ içerik */}
          <div className="col-xl-6 col-lg-6">
            <div className="about__content-wapper mb-60">
              <div className="section__title-wrapper mb-40">
                <span className="section__subtitle-2">
                  <span>{ui("ui_about_subprefix", "Ensotek")}</span>{" "}
                  {ui("ui_about_sublabel", "Hakkımızda")}
                </span>
                <h2 className="section__title-2">
                  {firstTitle}
                </h2>
              </div>

              {/* 1. kayıt özeti */}
              {firstSummary && <p>{firstSummary}</p>}

              {/* 2. ve 3. kayıt bullet olarak */}
              <div className="about__features-box">
                {second && (
                  <div className="about__features-item">
                    <div className="about__features-icon">
                      <i className="fa-solid fa-check" />
                    </div>
                    <div className="about__features-content">
                      <p>
                        <strong>{secondTitle}</strong>
                      </p>
                      {secondText && <p>{secondText}</p>}
                    </div>
                  </div>
                )}

                {third && (
                  <div className="about__features-item">
                    <div className="about__features-icon s-2">
                      <i className="fa-solid fa-check" />
                    </div>
                    <div className="about__features-content">
                      <p>
                        <strong>{thirdTitle}</strong>
                      </p>
                      {thirdText && <p>{thirdText}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* View All – locale'li /about */}
              <div className="project__view" style={{ marginTop: 18 }}>
                <Link
                  href={aboutHref}
                  className="solid__btn"
                  aria-label={ui("ui_about_view_all", "Tümünü Gör")}
                >
                  {ui("ui_about_view_all", "Tümünü Gör")}
                </Link>
              </div>

              {isLoading && (
                <div
                  className="skeleton-line mt-15"
                  style={{ height: 10 }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
