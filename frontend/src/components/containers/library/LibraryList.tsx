"use client";

import React, { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Plus, Minus } from "lucide-react";

import { useLibrary } from "@/features/library/library.action";
import type { LibraryItem } from "@/features/library/library.types";
import { useTranslations } from "next-intl";

import One from "public/img/shape/features-shape.png";
import Two from "public/img/features/1.png";

function safeStr(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

function stripHtml(input?: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(input: string, limit: number): string {
  if (input.length <= limit) return input;
  return `${input.slice(0, limit).trim()}...`;
}

type LibraryItemVM = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  hero: string;
};

const LibraryList: React.FC = () => {
  const t = useTranslations("ensotek.library");
  const [open, setOpen] = useState<number>(0);

  const { data, isLoading } = useLibrary({ page: 1, limit: 200 });

  const items: LibraryItemVM[] = useMemo(() => {
    const arr = Array.isArray(data)
      ? (data as LibraryItem[])
      : Array.isArray((data as { data?: unknown[] } | undefined)?.data)
        ? (((data as { data?: unknown[] }).data as unknown[]) as LibraryItem[])
        : [];

    const mapped = arr.map((it) => {
      const title = safeStr(it.name) || safeStr(it.slug) || t("untitled");
      const summary = excerpt(stripHtml(safeStr(it.description)), 220) || t("summaryFallback");
      const hero = safeStr(it.featured_image) || safeStr(it.image_url);

      return {
        id: safeStr(it.id),
        slug: safeStr(it.slug),
        title,
        summary,
        hero,
      };
    });

    return mapped;
  }, [data, t]);

  const firstWithHero = items.find((x) => !!x.hero);
  const leftHero: string | StaticImageData = firstWithHero?.hero || (Two as StaticImageData);
  const leftAlt = firstWithHero?.title || t("coverAlt");

  return (
    <section className="features__area p-relative features-bg pt-120 pb-35 cus-faq">
      <div className="features__pattern">
        <Image src={One} alt="pattern" loading="lazy" sizes="200px" />
      </div>

      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-6 col-lg-6">
            <div className="features__thumb-wrapper mb-60">
              <div className="features__thumb ens-library__thumb">
                <Image
                  src={leftHero as any}
                  alt={leftAlt}
                  width={720}
                  height={520}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  className="ens-media--fluid"
                  loading={typeof leftHero === "string" ? "lazy" : undefined}
                  priority={typeof leftHero !== "string"}
                />
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <div className="features__content-wrapper">
              <div className="section__title-wrapper mb-10">
                <span className="section__subtitle">
                  <span>{t("subprefix")}</span> {t("sublabel")}
                </span>

                <h2 className="section__title">
                  {t("titlePrefix")} <span className="down__mark-line">{t("titleMark")}</span>
                </h2>
              </div>

              <div className="bd-faq__wrapper mb-40">
                <div className="bd-faq__accordion" data-aos="fade-left" data-aos-duration="1000">
                  <div className="accordion" id="libAccordion">
                    {items.map((it, idx) => {
                      const isOpen = open === idx;
                      const headingId = `lib-heading-${idx}`;
                      const panelId = `lib-collapse-${idx}`;

                      return (
                        <div className="accordion-item" key={it.id || `${it.slug}-${idx}`}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                              className={`accordion-button ens-acc-btn d-flex align-items-center${
                                isOpen ? "" : " collapsed"
                              }`}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              onClick={() => setOpen(isOpen ? -1 : idx)}
                              type="button"
                            >
                              <span className="ens-acc-icon" aria-hidden="true">
                                {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                              </span>
                              <span className="ens-acc-text">{it.title}</span>
                            </button>
                          </h2>

                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={headingId}
                            className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
                          >
                            <div className="accordion-body">
                              <p className="ens-acc-summary">{it.summary}</p>
                              {it.slug ? (
                                <Link
                                  href={`/library/${encodeURIComponent(it.slug)}`}
                                  className="link-more d-inline-flex align-items-center gap-1"
                                  aria-label={`${it.title} - ${t("viewDetailAria")}`}
                                >
                                  {t("viewDetail")} <ArrowRight />
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading ? (
                      <div className="accordion-item" aria-hidden>
                        <div className="accordion-body">
                          <div className="skeleton-line ens-skel--h10" />
                        </div>
                      </div>
                    ) : null}

                    {!isLoading && items.length === 0 ? (
                      <div className="accordion-item">
                        <div className="accordion-body">{t("empty")}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="project__view">
                <Link href="/library" className="solid__btn">
                  {t("viewAll")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryList;
