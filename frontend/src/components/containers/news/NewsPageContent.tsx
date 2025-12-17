// =============================================================
// FILE: src/components/containers/news/NewsPageContent.tsx
// Ensotek – Full News Page Content
//   - Tüm haberlerin grid listesi
//   - Data: custom_pages (module_key = "news")
//   - UI i18n: site_settings.ui_news
//   - Locale-aware routes with localizePath
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// RTK – Custom Pages (public)
import { useListCustomPagesPublicQuery } from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

import { localizePath } from "@/i18n/url";

// Fallback görsel
import FallbackCover from "public/img/blog/3/1.jpg";

const CARD_W = 720;
const CARD_H = 480;
const PAGE_LIMIT = 12; // şimdilik tek seferde 12; backend offset ile büyütebiliriz

const formatDate = (value: string | null | undefined, intlLocale: string) => {
  if (!value) return "";
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(intlLocale, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
};

const NewsPageContent: React.FC = () => {
  const resolved = useResolvedLocale();
  const locale = (resolved || "tr").split("-")[0];
  const intlLocale =
    locale === "tr"
      ? "tr-TR"
      : locale === "de"
        ? "de-DE"
        : "en-US";

  const { ui } = useUiSection("ui_news", locale);

  const sectionSubtitlePrefix = ui("ui_news_subprefix", "Ensotek");
  const sectionSubtitleLabel = ui(
    "ui_news_sublabel",
    locale === "tr" ? "Haberler" : "News",
  );
  const sectionTitle = ui(
    "ui_news_page_title",
    locale === "tr" ? "Haberler" : "News",
  );
  const sectionIntro = ui(
    "ui_news_page_intro",
    locale === "tr"
      ? "Ensotek ile ilgili güncel haberler, duyurular ve basın paylaşımlarımız."
      : "Latest news, announcements and press releases about Ensotek.",
  );
  const readMore = ui(
    "ui_news_read_more",
    locale === "tr" ? "Devamını oku" : "Read more",
  );
  const readMoreAria = ui(
    "ui_news_read_more_aria",
    locale === "tr" ? "haberin detayını görüntüle" : "view news details",
  );
  const untitled = ui(
    "ui_news_untitled",
    locale === "tr" ? "Başlıksız haber" : "Untitled news",
  );
  const emptyText = ui(
    "ui_news_empty",
    locale === "tr"
      ? "Şu anda görüntülenecek haber bulunmamaktadır."
      : "There are no news items to display at the moment.",
  );

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: "news",
    sort: "created_at",
    orderDir: "desc",
    limit: PAGE_LIMIT,
    is_published: 1,
    locale, // <-- kısa locale backend'e gidiyor
  });

  const newsItems = useMemo(() => {
    const items: CustomPageDto[] = data?.items ?? [];

    return items.map((n) => {
      const title = (n.title || "").trim() || untitled;
      const slug = (n.slug || "").trim();

      const baseText =
        (n.meta_description || "").trim() ||
        (n.content_html || "").trim();

      const textExcerpt = excerpt(baseText, 220);

      const imgRaw = (n.featured_image || "").trim();
      const hero =
        (imgRaw &&
          (toCdnSrc(imgRaw, CARD_W, CARD_H, "fill") || imgRaw)) ||
        "";

      const dateStr = formatDate(n.created_at, intlLocale);

      return {
        id: n.id,
        slug,
        title,
        excerpt: textExcerpt,
        hero,
        date: dateStr,
      };
    });
  }, [data, intlLocale, untitled]);

  const newsListHref = localizePath(locale, "/news");

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>
                  {sectionSubtitlePrefix} {sectionSubtitleLabel}
                </span>
              </div>
              <div className="section__title-3 mb-20">
                {sectionTitle}
              </div>
              {sectionIntro && (
                <p
                  style={{
                    maxWidth: 640,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {sectionIntro}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Liste */}
        <div
          className="row"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {newsItems.length === 0 && !isLoading && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          {newsItems.map((n) => {
            // DETAY URL → /news/[slug] (locale-aware)
            const detailHref = n.slug
              ? localizePath(
                locale,
                `/news/${encodeURIComponent(n.slug)}`,
              )
              : newsListHref;

            return (
              <div
                className="col-xl-4 col-lg-6 col-md-6"
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
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
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
                      <Link href={detailHref}>{n.title}</Link>
                    </h3>
                    {n.excerpt && (
                      <p
                        style={{
                          marginTop: 8,
                          marginBottom: 10,
                          opacity: 0.85,
                          fontSize: 14,
                        }}
                      >
                        {n.excerpt}
                      </p>
                    )}
                    <Link
                      href={detailHref}
                      className="link-more"
                      aria-label={`${n.title} — ${readMoreAria}`}
                    >
                      {readMore} →
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

export default NewsPageContent;
