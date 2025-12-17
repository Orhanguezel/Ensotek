// src/components/containers/library/LibraryMore.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { useListLibraryQuery } from "@/integrations/rtk/hooks";

import { toCdnSrc } from "@/shared/media";
import { pickStrict, stripHtml, excerpt } from "@/shared/text";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

import { localizePath } from "@/i18n/url";

// Carousel (shadcn / embla)
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// BG pattern
import WorkflowBg from "public/img/shape/work-flow.png";

interface LibraryMoreProps {
  currentId?: string;
}

const LibraryMore: React.FC<LibraryMoreProps> = ({ currentId }) => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_library", locale);

  const { data = [], isLoading } = useListLibraryQuery({
    locale,
    limit: 12,
    is_published: "1",
    is_active: "1",
    order: "display_order.desc,published_at.desc",
  });

  const items = useMemo(() => {
    const base = (Array.isArray(data) ? data : [])
      .filter((it: any) => !currentId || String(it.id) !== String(currentId))
      .map((it: any) => {
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
          480,
          320,
          "fill",
        );

        const href = it.slug
          ? localizePath(locale, `/library/${encodeURIComponent(it.slug)}`)
          : localizePath(locale, "/library");

        return {
          id: String(it.id ?? it._id ?? title),
          title,
          summary: excerpt(stripHtml(sumRaw), 160),
          hero,
          href,
        };
      });

    return base;
  }, [data, locale, ui, currentId]);

  if (!isLoading && items.length === 0) {
    return null;
  }

  // Autoplay plugin
  const autoplay = Autoplay({
    delay: 4500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  return (
    <section className="blog__area library-more-section pt-70 pb-100">
      {/* BG pattern */}
      <div className="library-more-pattern">
        <Image
          src={WorkflowBg}
          alt="pattern"
          loading="lazy"
          sizes="400px"
        />
      </div>

      <div className="container library-more-inner">
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9 text-center">
            <div className="section__title-wrapper mb-10">
              <span className="section__subtitle">
                <span>
                  {ui("ui_library_more_subprefix", "Ensotek")}
                </span>{" "}
                {ui("ui_library_more_sublabel", "Knowledge Hub")}
              </span>
              <h2 className="section__title">
                {ui("ui_library_more_title", "More documents")}
              </h2>
            </div>
          </div>
        </div>

        {isLoading && items.length === 0 && (
          <div className="row">
            <div className="col-12">
              <div className="skeleton-line" style={{ height: 12 }} />
              <div className="skeleton-line mt-2" style={{ height: 12 }} />
            </div>
          </div>
        )}

        {items.length > 0 && (
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay]}
            className="library-more-carousel"
          >
            <CarouselContent>
              {items.map((it) => (
                <CarouselItem key={it.id} className="library-more-item">
                  <div className="library-more-card blog__item blog__item-3 mb-30">
                    {it.hero && (
                      <div className="blog__thumb w-img mb-20">
                        <Link href={it.href}>
                          <Image
                            src={it.hero}
                            alt={it.title}
                            width={480}
                            height={320}
                            sizes="(max-width: 992px) 100vw, 33vw"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Link>
                      </div>
                    )}

                    <div className="blog__content-3">
                      <h3 className="blog__title-3">
                        <Link href={it.href}>{it.title}</Link>
                      </h3>
                      <p className="library-more-summary">{it.summary}</p>
                      <div className="blog__btn-3 mt-15">
                        <Link href={it.href} className="link-more">
                          {ui("ui_library_view_detail", "View details")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Oklar – sadece ikon, sağ & sol */}
            <CarouselPrevious className="library-more-nav library-more-prev" />
            <CarouselNext className="library-more-nav library-more-next" />
          </Carousel>
        )}
      </div>

      <style jsx>{`
        .library-more-section {
          position: relative;
          overflow: hidden;
        }

        .library-more-inner {
          position: relative;
          z-index: 1;
        }

        /* BG pattern: sayfanın üst kısmına, hafif opak */
        .library-more-pattern {
          position: absolute;
          inset: -80px 0 auto 0;
          opacity: 0.28;
          pointer-events: none;
          z-index: 0;
        }

        /* Kartların yüksekliklerini eşitle */
        :global(.library-more-card) {
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.96);
          border-radius: 18px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
          backdrop-filter: blur(6px);
        }
        :global(.library-more-card .blog__content-3) {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          padding: 18px 20px 20px;
        }
        :global(.library-more-summary) {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 0.5rem;
          flex: 1 1 auto;
        }
        :global(.library-more-card .blog__btn-3) {
          margin-top: auto;
        }

        /* Embla içerik satırını yatay flex bırak – gap ver */
        :global(.library-more-carousel [data-slot="carousel-content"] > div) {
          display: flex;
          flex-wrap: nowrap;
          gap: 24px;
        }

        /* Slide genişlikleri: desktop 3, tablet 2, mobil 1 */
        :global(.library-more-item) {
          min-width: 0;
          flex: 0 0 100%;
          max-width: 100%;
        }
        @media (min-width: 768px) {
          :global(.library-more-item) {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }
        @media (min-width: 1200px) {
          :global(.library-more-item) {
            flex: 0 0 33.3333%;
            max-width: 33.3333%;
          }
        }

        /* Okları sağ ve sola yerleştir – sadece ikon görünsün */
        :global(.library-more-nav) {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          background-color: #ffffff;
          border: 1px solid rgba(148, 163, 184, 0.4);
        }
        :global(.library-more-prev) {
          left: -20px;
        }
        :global(.library-more-next) {
          right: -20px;
        }
        :global(.library-more-nav[disabled]) {
          opacity: 0.4;
          cursor: default;
        }

        /* Bölüm zemini – biraz daha koyu, hafif gradient */
        .blog__area {
          background: radial-gradient(
              circle at top left,
              rgba(90, 87, 255, 0.08),
              transparent 55%
            ),
            #f3f4f6;
        }

        @media (prefers-color-scheme: dark) {
          .blog__area {
            background: radial-gradient(
                circle at top left,
                rgba(90, 87, 255, 0.24),
                transparent 55%
              ),
              #020617;
          }
          :global(.library-more-card) {
            background-color: rgba(15, 23, 42, 0.96);
            border-color: rgba(148, 163, 184, 0.4);
          }
          :global(.library-more-nav) {
            background-color: #0b1120;
            border-color: rgba(148, 163, 184, 0.5);
          }
          .library-more-pattern {
            opacity: 0.22;
          }
        }
      `}</style>
    </section>
  );
};

export default LibraryMore;
