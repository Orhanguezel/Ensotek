// =============================================================
// FILE: src/components/containers/news/NewsDetail.tsx
// Ensotek – News Detail Content
//   - Data: custom_pages (module_key = "news", by slug)
//   - UI i18n: site_settings.ui_news
//   - Locale-aware routes with localizePath
//   - Reviews: common ReviewList + ReviewForm (target_type = "news")
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// RTK – Custom Pages (public)
import { useGetCustomPageBySlugPublicQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// Reviews – ortak komponentler
import ReviewList from "@/components/common/ReviewList";
import ReviewForm from "@/components/common/ReviewForm";

// Fallback görsel
import FallbackCover from "public/img/blog/3/1.jpg";

const HERO_W = 960;
const HERO_H = 540;

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "";
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
};

const NewsDetail: React.FC = () => {
  const router = useRouter();

  // FE locale:
  // - localeShort: "tr" | "en" | "de"  → backend + uiDb
  // - intlLocale: "tr-TR" | "en-US" | "de-DE" → tarih formatı
  const resolved = useResolvedLocale();
  const localeShort = (resolved || "tr").split("-")[0];
  const intlLocale =
    localeShort === "tr"
      ? "tr-TR"
      : localeShort === "de"
        ? "de-DE"
        : "en-US";

  const { ui } = useUiSection("ui_news", localeShort);

  const backToListText = ui(
    "ui_news_back_to_list",
    localeShort === "tr" ? "Tüm haberlere dön" : "Back to all news",
  );
  const loadingText = ui(
    "ui_news_loading",
    localeShort === "tr" ? "Haber yükleniyor..." : "Loading news...",
  );
  const notFoundText = ui(
    "ui_news_not_found",
    localeShort === "tr" ? "Haber bulunamadı." : "News not found.",
  );

  const slugParam = router.query.slug;
  const slug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || "",
    [slugParam],
  );

  const { data, isLoading, isError } = useGetCustomPageBySlugPublicQuery(
    { slug, locale: localeShort },
    { skip: !slug },
  );

  const news = data as CustomPageDto | undefined;

  const newsListHref = localizePath(localeShort, "/news");

  const title = (news?.title || "").trim();
  const dateStr = news ? formatDate(news.created_at, intlLocale) : "";

  const heroSrc = useMemo(() => {
    const raw = (news?.featured_image || "").trim();
    if (!raw) return "";
    return toCdnSrc(raw, HERO_W, HERO_H, "fill") || raw;
  }, [news]);

  const contentHtml = news?.content_html || "";

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Back link */}
        <div className="row mb-30">
          <div className="col-12">
            <button
              type="button"
              className="link-more"
              onClick={() => router.push(newsListHref)}
            >
              ← {backToListText}
            </button>
          </div>
        </div>

        {/* Loading / error / not found */}
        {isLoading && (
          <div className="row">
            <div className="col-12">
              <p>{loadingText}</p>
              <div
                className="skeleton-line mt-10"
                style={{ height: 16 }}
                aria-hidden
              />
              <div
                className="skeleton-line mt-10"
                style={{ height: 16, width: "80%" }}
                aria-hidden
              />
            </div>
          </div>
        )}

        {!isLoading && (isError || !news) && (
          <div className="row">
            <div className="col-12">
              <p>{notFoundText}</p>
            </div>
          </div>
        )}

        {/* Detay + yorumlar */}
        {!isLoading && !isError && news && (
          <>
            {/* Haber detayı */}
            <div
              className="row"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="col-12">
                <article className="news__detail">
                  {/* Başlık + tarih */}
                  <header className="news__detail-header mb-30">
                    {dateStr && (
                      <p
                        className="news__detail-date"
                        style={{
                          fontSize: 14,
                          opacity: 0.7,
                          marginBottom: 8,
                        }}
                      >
                        {dateStr}
                      </p>
                    )}
                    <h1 className="section__title-3 mb-20">
                      {title || notFoundText}
                    </h1>
                  </header>

                  {/* Hero görsel */}
                  <div className="news__detail-hero w-img mb-30">
                    <Image
                      src={(heroSrc as any) || (FallbackCover as any)}
                      alt={news.featured_image_alt || title || "news image"}
                      width={HERO_W}
                      height={HERO_H}
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>

                  {/* İçerik */}
                  <div
                    className="news__detail-content tp-postbox-details"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </article>
              </div>
            </div>

            {/* Yorumlar + Yorum formu */}
            <div
              className="row mt-60"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              {/* Yorum listesi */}
              <div className="col-lg-7 col-md-12 mb-30">
                <ReviewList
                  targetType="news"
                  targetId={news.id}
                  locale={localeShort}
                  showHeader={true}
                  className="news__detail-reviews"
                />
              </div>

              {/* Yorum formu */}
              <div className="col-lg-5 col-md-12 mb-30">
                <ReviewForm
                  targetType="news"
                  targetId={news.id}
                  locale={localeShort}
                  className="news__detail-review-form"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsDetail;
