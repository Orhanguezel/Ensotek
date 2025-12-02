// =============================================================
// FILE: src/components/containers/about/AboutPageContent.tsx
// Ensotek – Full About Page (custom_pages module_key="about")
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";

// Şekil + fallback
import Two from "/public/img/shape/hero-shape-4.png";

// RTK – Custom Pages Public
import {
  useListCustomPagesPublicQuery,
} from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Helper'lar
import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";


const AboutPageContent: React.FC = () => {
  const locale = useResolvedLocale();

  // UI başlık vs. için (istersen burada da kullanırız)
  const { ui } = useUiSection("ui_about", locale);

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: "about",
    locale,
    limit: 10,          // güvenli, 3 tane seeded ama esnek kalsın
    sort: "created_at",
    orderDir: "asc",
  });

  const pages: CustomPageDto[] = useMemo(() => {
    const items: CustomPageDto[] = data?.items ?? [];
    return items.filter((p) => p.is_published);
  }, [data]);

  return (
    <section className="about__area grey-bg z-index-11 p-relative pt-120 pb-60">
      {/* Arka plan şekli */}
      <div className="about__shape-2">
        <Image src={Two} alt="shape" />
      </div>

      <div className="container">
        {/* Sayfa başlığı (opsiyonel) */}
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper mb-40 text-center">
              <span className="section__subtitle-2">
                <span>{ui("ui_about_subprefix", "Ensotek")}</span>{" "}
                {ui("ui_about_sublabel", "Hakkımızda")}
              </span>
              <h2 className="section__title-2">
                {ui(
                  "ui_about_page_title",
                  "Ensotek Su Soğutma Kuleleri Hakkında",
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="row mb-40">
            <div className="col-12">
              <div
                className="skeleton-line"
                style={{ height: 12 }}
                aria-hidden
              />
            </div>
          </div>
        )}

        {/* Her custom_page için blok */}
        {pages.map((page, idx) => {
          // 1. kayıt → resim solda, yazı sağda
          // 2. ve 3. kayıt → resim sağda, yazı solda
          const imageLeft = idx === 0 ? true : false;

          const imgRaw = page.featured_image || "";
          const imgSrc =
            (imgRaw &&
              (toCdnSrc(imgRaw, 900, 600, "fill") || imgRaw)) ||
            (Two as unknown as string);

          const title = (page.title ?? "").trim() || ui(
            "ui_about_fallback_title",
            "Ensotek Su Soğutma Kuleleri",
          );

          const alt =
            page.featured_image_alt ||
            title ||
            "about image";

          return (
            <div
              className="row align-items-center mb-80"
              data-aos="fade-up"
              data-aos-delay={300 + idx * 100}
              key={page.id}
            >
              {imageLeft ? (
                <>
                  {/* Resim SOL */}
                  <div className="col-xl-6 col-lg-6">
                    <div className="about__thumb-wrapper mb-30 mb-lg-0">
                      <div className="about__thumb w-img">
                        <Image
                          src={imgSrc as any}
                          alt={alt}
                          width={900}
                          height={600}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Yazı SAĞ */}
                  <div className="col-xl-6 col-lg-6">
                    <div className="about__content-wapper mb-30 mb-lg-0">
                      <h3 className="about__title mb-20">{title}</h3>
                      <div
                        className="about__text tp-post-content"
                        // Backend’ten gelen HTML
                        dangerouslySetInnerHTML={{
                          __html: page.content_html,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Yazı SOL */}
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="about__content-wapper mb-30 mb-lg-0">
                      <h3 className="about__title mb-20">{title}</h3>
                      <div
                        className="about__text tp-post-content"
                        dangerouslySetInnerHTML={{
                          __html: page.content_html,
                        }}
                      />
                    </div>
                  </div>

                  {/* Resim SAĞ */}
                  <div className="col-xl-6 col-lg-6 order-1 order-lg-2">
                    <div className="about__thumb-wrapper mb-30 mb-lg-0">
                      <div className="about__thumb w-img">
                        <Image
                          src={imgSrc as any}
                          alt={alt}
                          width={900}
                          height={600}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AboutPageContent;
