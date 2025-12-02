// =============================================================
// FILE: src/components/containers/news/NewsMore.tsx
// Ensotek – More News Section (detail page altı)
//   - Data: custom_pages (module_key = "news")
//   - Mevcut slug haricindeki son haberler
//   - UI i18n: site_settings.ui_news
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// RTK – Custom Pages (public)
import {
  useListCustomPagesPublicQuery,
} from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

import { localizePath } from "@/i18n/url";

// Fallback görsel
import FallbackCover from "public/img/blog/3/2.jpg";

const CARD_W = 480;
const CARD_H = 320;

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "";
  const lang = locale === "tr" ? "tr-TR" : "en-US";
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
};

const NewsMore: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_news", locale);

  const moreTitle = ui(
    "ui_news_more_title",
    locale === "tr" ? "Diğer Haberler" : "More News",
  );

  const slugParam = router.query.slug;
  const currentSlug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || "",
    [slugParam],
  );

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: "news",
    sort: "created_at",
    orderDir: "desc",
    limit: 6,
    is_published: 1,
    locale,
  });

  const newsListHref = localizePath(locale, "/news");

  const items = useMemo(() => {
    const list: CustomPageDto[] = data?.items ?? [];

    return list
      .filter((n) => {
        const slug = (n.slug || "").trim();
        if (!n.is_published) return false;
        if (!slug) return false;
        if (slug === currentSlug) return false;
        return true;
      })
      .slice(0, 3)
      .map((n) => {
        const slug = (n.slug || "").trim();
        const title = (n.title || "").trim();
        const imgRaw = (n.featured_image || "").trim();
        const hero =
          (imgRaw &&
            (toCdnSrc(imgRaw, CARD_W, CARD_H, "fill") || imgRaw)) ||
          "";

        return {
          id: n.id,
          slug,
          title,
          date: formatDate(n.created_at, locale),
          hero,
        };
      });
  }, [data, currentSlug, locale]);

  if (!items.length && !isLoading) {
    return null;
  }

  return (
    <section className="news__area pt-60 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="section__title-wrapper text-center">
              <div className="section__subtitle-3">
                <span>{moreTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div
          className="row"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {items.map((n) => {
            const href = n.slug
              ? localizePath(
                locale,
                `/news/${encodeURIComponent(n.slug)}`,
              )
              : newsListHref;

            return (
              <div
                className="col-xl-4 col-lg-4 col-md-6"
                key={n.id}
              >
                <div className="news__item-3 mb-30">
                  <div className="news__thumb-3 w-img">
                    <Image
                      src={
                        (n.hero as any) ||
                        (FallbackCover as any)
                      }
                      alt={n.title || "news image"}
                      width={CARD_W}
                      height={CARD_H}
                      style={{ width: "100%", height: "auto" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="news__content-3">
                    {n.date && (
                      <div className="news__meta">
                        <div className="news__meta-author">
                          <span>{n.date}</span>
                        </div>
                      </div>
                    )}
                    <h3>
                      <Link href={href}>{n.title}</Link>
                    </h3>
                    <Link
                      href={href}
                      className="link-more"
                    >
                      {/* Kısa CTA: aynı read more text'i kullanmak istersen
                         ui_news_read_more ile de çekebilirsin */}
                      {locale === "tr" ? "Habere git" : "View news"} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="col-12">
              <div
                className="skeleton-line"
                style={{ height: 16 }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsMore;
