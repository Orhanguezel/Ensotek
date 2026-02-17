"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Plus, Minus } from "lucide-react";

import { useLibrary } from "@/features/library/library.action";
import type { LibraryItem } from "@/features/library/library.types";
import { useTranslations } from "next-intl";
import { resolveMediaUrl } from "@/lib/media";

import One from "public/img/shape/features-shape.png";
import Two from "public/img/features/1.png";

function stripHtml(input?: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const LibrarySection: React.FC = () => {
  const t = useTranslations("ensotek.library");
  const [open, setOpen] = useState<number>(0);

  const { data, isLoading } = useLibrary({ page: 1, limit: 2 });

  const items = useMemo(() => {
    const arr = Array.isArray(data)
      ? (data as LibraryItem[])
      : Array.isArray((data as { data?: unknown[] } | undefined)?.data)
        ? (((data as { data?: unknown[] }).data as unknown[]) as LibraryItem[])
        : [];

    return arr.slice(0, 2).map((it) => ({
      id: it.id,
      slug: it.slug,
      title: it.name || t("untitled"),
      summary: stripHtml(it.description || "").slice(0, 180) || t("summaryFallback"),
      hero: resolveMediaUrl(it.featured_image || it.image_url || ""),
    }));
  }, [data, t]);

  const leftHero = items[0]?.hero || Two;

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
                <Image src={leftHero} alt={t("coverAlt")} width={720} height={520} className="ens-media--fluid" />
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
                  <div className="accordion" id="libAccordionHome">
                    {items.map((it, idx) => {
                      const isOpen = open === idx;
                      return (
                        <div className="accordion-item" key={it.id || `${it.slug}-${idx}`}>
                          <h2 className="accordion-header" id={`lib-home-heading-${idx}`}>
                            <button
                              className={`accordion-button ens-acc-btn d-flex align-items-center${isOpen ? "" : " collapsed"}`}
                              aria-expanded={isOpen}
                              aria-controls={`lib-home-collapse-${idx}`}
                              onClick={() => setOpen(isOpen ? -1 : idx)}
                              type="button"
                            >
                              <span className="ens-acc-icon" aria-hidden="true">
                                {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                              </span>
                              <span className="ens-acc-text">{it.title}</span>
                            </button>
                          </h2>

                          <div id={`lib-home-collapse-${idx}`} className={`accordion-collapse collapse${isOpen ? " show" : ""}`}>
                            <div className="accordion-body">
                              <p className="ens-acc-summary">{it.summary}</p>
                              <Link href={`/library/${encodeURIComponent(it.slug)}`} className="link-more d-inline-flex align-items-center gap-1">
                                {t("viewDetail")} <ArrowRight size={16} />
                              </Link>
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

export default LibrarySection;
