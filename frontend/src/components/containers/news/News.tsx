// =============================================================
// FILE: src/components/containers/news/News.tsx
// Ensotek – News section (Home)
//   - Data: custom_pages (module_key = "news")
//   - i18n: site_settings.key = "ui_news"
//   - Locale-aware routes with localizePath
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// RTK – Custom Pages (public)
import {
  useListCustomPagesPublicQuery,
} from "@/integrations/rtk/endpoints/custom_pages.endpoints";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

// Yeni i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

import { localizePath } from "@/i18n/url";

const News: React.FC = () => {
  const locale = useResolvedLocale();

  // UI yazıları → site_settings.key = "ui_news"
  const { ui } = useUiSection("ui_news", locale);

  const subprefix = ui("ui_news_subprefix", "Ensotek");
  const sublabel = ui(
    "ui_news_sublabel",
    locale === "tr" ? "Haberler" : "News",
  );
  const titlePrefix = ui(
    "ui_news_title_prefix",
    locale === "tr" ? "Güncel" : "Latest",
  );
  const titleMark = ui(
    "ui_news_title_mark",
    locale === "tr" ? "Haberler" : "News",
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
  const viewAllText = ui(
    "ui_news_view_all",
    locale === "tr" ? "Tüm Haberler" : "All news",
  );

  // custom_pages → module_key = "news"
  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: "news",
    sort: "created_at",
    orderDir: "desc",
    limit: 4, // 2 gösteriyoruz ama biraz buffer olsun
    is_published: 1,
    locale,
  });

  const items = useMemo(() => {
    const list: CustomPageDto[] = data?.items ?? [];

    const mapped = list
      .filter((n) => n.is_published)
      .slice(0, 2)
      .map((n) => {
        const title = (n.title || "").trim() || untitled;
        const slug = (n.slug || "").trim();

        // Metin için: önce meta_description, yoksa content_html
        const baseText =
          (n.meta_description || "").trim() ||
          (n.content_html || "").trim();

        const textExcerpt = excerpt(baseText, 180);

        // Görsel
        const imgRaw = (n.featured_image || "").trim();
        const hero =
          (imgRaw && (toCdnSrc(imgRaw, 720, 480, "fill") || imgRaw)) || "";

        return {
          id: n.id,
          slug,
          title,
          excerpt: textExcerpt,
          hero, // boş string olabilir → o durumda img render etmeyeceğiz
        };
      });

    if (mapped.length === 1) {
      // Tek haber varsa layout bozulmasın diye ikinciyi klonla
      mapped.push({
        ...mapped[0],
        id: "dup-fallback",
      });
    }

    return mapped.slice(0, 2);
  }, [data, untitled]);

  const [first, second] = items;
  const newsListHref = localizePath(locale, "/news");

  return (
    <div className="news__area pt-120 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sublabel}
              </span>
              <h2 className="section__title">
                {titlePrefix}{" "}
                <span className="down__mark-line">{titleMark}</span>
              </h2>
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div
          className="row align-items-center"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {/* Sol: 2 haber metni */}
          <div className="col-xl-6 col-lg-6">
            <div className="news__content-wrapper mb-30">
              {items.map((n, idx) => {
                const href = n.slug
                  ? localizePath(
                    locale,
                    `/news/${encodeURIComponent(n.slug)}`,
                  )
                  : newsListHref;

                return (
                  <div
                    className="news__content-item"
                    key={n.id}
                    style={{
                      marginBottom: idx === items.length - 1 ? 0 : 22,
                    }}
                  >
                    <div className="news__content">
                      <h3
                        style={{
                          marginBottom: 10,
                          lineHeight: 1.25,
                        }}
                      >
                        <Link href={href}>{n.title}</Link>
                      </h3>
                      <p
                        className="news__excerpt"
                        style={{ marginBottom: 12, opacity: 0.85 }}
                      >
                        {n.excerpt}
                      </p>
                      <Link
                        href={href}
                        className="link-more"
                        aria-label={`${n.title} — ${readMoreAria}`}
                      >
                        {readMore} →
                      </Link>
                    </div>

                    {idx !== items.length - 1 && (
                      <div
                        aria-hidden
                        style={{
                          height: 1,
                          background: "currentColor",
                          opacity: 0.12,
                          marginTop: 16,
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div
                  className="skeleton-line mt-10"
                  style={{ height: 8 }}
                  aria-hidden
                />
              )}
            </div>
          </div>

          {/* Sağ: 2 görsel (sadece gerçek görsel varsa göster) */}
          <div className="col-xl-6 col-lg-6">
            <div className="news__thumb-wrapper mb-30">
              {first?.hero && (
                <div
                  className="news__thumb w-img"
                  style={{ marginBottom: 20 }}
                >
                  <Image
                    src={first.hero as any}
                    alt={first.title || "news image"}
                    width={720}
                    height={480}
                    priority
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
              {second?.hero && (
                <div className="news__thumb w-img">
                  <Image
                    src={second.hero as any}
                    alt={second.title || "news image"}
                    width={720}
                    height={480}
                    style={{ width: "100%", height: "auto" }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View all – locale-aware CTA */}
        <div className="row" style={{ marginTop: 24 }}>
          <div className="col-12">
            <div className="project__view text-lg-end">
              <Link className="solid__btn" href={newsListHref}>
                {viewAllText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
