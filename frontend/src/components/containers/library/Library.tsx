// src/components/containers/library/Library.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

// RTK – PUBLIC library
import { useListLibraryQuery } from "@/integrations/rtk/endpoints/library.endpoints";

// Pattern + fallback görseller
import One from "public/img/shape/features-shape.png";
import Two from "public/img/features/1.png";

// React Icons
import { FiArrowRight, FiPlus, FiMinus } from "react-icons/fi";

// ORTAK yardımcılar + i18n
import { toCdnSrc } from "@/shared/media";
import { pickStrict, stripHtml, excerpt } from "@/shared/text";

// Yeni i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

import { localizePath } from "@/i18n/url";

const Library: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_library", locale);

  const listHref = localizePath(locale, "/library");
  const [open, setOpen] = useState<number>(0);

  // İlk 4 içerik, yayınlanmış + aktif, display_order & published_at’e göre
  const { data = [], isLoading } = useListLibraryQuery({
    locale,                           // 🔥 backend’e ?locale=tr/en
    limit: 4,
    order: "display_order.desc",      // backend tek kolon bekliyor
    sort: "published_at",
    orderDir: "desc",
    is_published: "1",
    is_active: "1",
  });

  const items = useMemo(() => {
    const base = (Array.isArray(data) ? data : []).map((it: any) => {
      const title =
        pickStrict(it.title, locale) ||
        it.slug ||
        ui("ui_library_untitled", "Untitled content");

      const sumRaw =
        pickStrict(it.summary, locale) ||
        pickStrict(it.content, locale) ||
        "";

      const img =
        Array.isArray(it.images) && it.images.length ? it.images[0] : null;

      const hero = toCdnSrc(
        img?.webp || img?.url || img?.thumbnail || "",
        720,
        520,
        "fill",
      );

      return {
        id: String(it.id ?? it._id ?? title),
        slug: (it.slug || "").trim(),
        title,
        summary: excerpt(stripHtml(sumRaw), 220),
        hero,
      };
    });

    if (!base.length) {
      return [
        {
          id: "ph-1",
          slug: "",
          title: ui("ui_library_sample_one", "Sample article 1"),
          summary: "—",
          hero: "",
        },
        {
          id: "ph-2",
          slug: "",
          title: ui("ui_library_sample_two", "Sample article 2"),
          summary: "—",
          hero: "",
        },
      ];
    }
    return base.slice(0, 4);
  }, [data, locale, ui]);

  const firstWithHero = items.find((x) => x.hero && x.hero.trim());
  const leftHero: string | StaticImageData =
    (firstWithHero?.hero as string) || (Two as StaticImageData);

  const leftAlt =
    firstWithHero?.title ||
    ui("ui_library_cover_alt", "library cover image");

  return (
    <section className="features__area p-relative features-bg pt-120 pb-35 cus-faq">
      <div className="features__pattern">
        <Image src={One} alt="pattern" loading="lazy" sizes="200px" />
      </div>

      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {/* Sol görsel */}
          <div className="col-xl-6 col-lg-6">
            <div className="features__thumb-wrapper mb-60">
              <div className="features__thumb">
                <Image
                  src={leftHero as any}
                  alt={leftAlt}
                  width={720}
                  height={520}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  style={{ width: "100%", height: "auto" }}
                  loading={typeof leftHero === "string" ? "lazy" : undefined}
                  priority={typeof leftHero !== "string"}
                />
              </div>
            </div>
          </div>

          {/* Sağ içerik (dinamik akordeon) */}
          <div className="col-xl-6 col-lg-6">
            <div className="features__content-wrapper">
              <div className="section__title-wrapper mb-10">
                <span className="section__subtitle">
                  <span>{ui("ui_library_subprefix", "Ensotek")}</span>{" "}
                  {ui("ui_library_sublabel", "Knowledge Hub")}
                </span>
                <h2 className="section__title">
                  {ui("ui_library_title_prefix", "Engineering and")}{" "}
                  <span className="down__mark-line">
                    {ui("ui_library_title_mark", "Documents")}
                  </span>
                </h2>
              </div>

              <div className="bd-faq__wrapper mb-40">
                <div
                  className="bd-faq__accordion"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                >
                  <div className="accordion" id="libAccordion">
                    {items.map((it, idx) => {
                      const isOpen = open === idx;
                      const href = it.slug
                        ? localizePath(
                          locale,
                          `/library/${encodeURIComponent(it.slug)}`,
                        )
                        : listHref;
                      const headingId = `lib-heading-${idx}`;
                      const panelId = `lib-collapse-${idx}`;
                      return (
                        <div className="accordion-item" key={it.id}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                              className={`accordion-button no-caret d-flex align-items-center${isOpen ? "" : " collapsed"
                                }`}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              onClick={() =>
                                setOpen(isOpen ? -1 : idx)
                              }
                              type="button"
                            >
                              <span className="acc-icon" aria-hidden="true">
                                {isOpen ? (
                                  <FiMinus size={22} />
                                ) : (
                                  <FiPlus size={22} />
                                )}
                              </span>
                              <span className="acc-text">{it.title}</span>
                            </button>
                          </h2>
                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={headingId}
                            className={`accordion-collapse collapse${isOpen ? " show" : ""
                              }`}
                          >
                            <div className="accordion-body">
                              <p style={{ marginBottom: 12 }}>
                                {it.summary}
                              </p>
                              <Link
                                href={href}
                                className="link-more d-inline-flex align-items-center gap-1"
                                aria-label={`${it.title} – ${ui(
                                  "ui_library_view_detail_aria",
                                  "view details",
                                )}`}
                              >
                                {ui(
                                  "ui_library_view_detail",
                                  "View details",
                                )}{" "}
                                <FiArrowRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="accordion-item" aria-hidden>
                        <div className="accordion-body">
                          <div
                            className="skeleton-line"
                            style={{ height: 10 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tümünü gör */}
              <div className="project__view">
                <Link href={listHref} className="solid__btn">
                  {ui(
                    "ui_library_view_all",
                    "View all documents",
                  )}
                </Link>
              </div>
            </div>
          </div>
          {/* /Sağ içerik */}
        </div>
      </div>

      {/* Varsayılan Bootstrap caret'ini gizle + ikonları büyüt */}
      <style jsx>{`
        .accordion-button.no-caret::after {
          display: none !important;
        }
        .accordion-button .acc-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          margin-right: 10px;
          flex: 0 0 auto;
        }
        @media (prefers-color-scheme: dark) {
          .accordion-button .acc-icon {
            border-color: rgba(255, 255, 255, 0.25);
          }
        }
        .accordion-button .acc-text {
          line-height: 1.2;
        }
      `}</style>
    </section>
  );
};

export default Library;
