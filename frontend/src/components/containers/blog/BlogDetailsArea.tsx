// =============================================================
// FILE: src/components/containers/blog/BlogDetailsArea.tsx
// Ensotek – Blog Detail Content (NewsDetail pattern clone)
//   - Data: custom_pages/by-slug (module_key = "blog", by slug)
//   - UI i18n: site_settings.ui_blog
//   - Locale-aware routes with localizePath
//   - Reviews: common ReviewList + ReviewForm (target_type = "blog")
//   - Tags: simple chips (deterministic render)
//   - IMPORTANT: locale source = router.locale (hydration-safe)
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// RTK – Custom Pages (public)
import {
  useGetCustomPageBySlugPublicQuery,
} from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

// i18n helper'lar
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// Reviews – ortak komponentler
import ReviewList from "@/components/common/ReviewList";
import ReviewForm from "@/components/common/ReviewForm";

// Fallback görsel
import FallbackCover from "public/img/blog/3/1.jpg";

const HERO_W = 960;
const HERO_H = 540;

function shortLocale(v: unknown): string {
  return String(v || "tr")
    .trim()
    .toLowerCase()
    .replace("_", "-")
    .split("-")[0] || "tr";
}

function safeStr(v: any): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.map((x) => safeStr(x)).map((x) => x.trim()).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

const BlogDetailsArea: React.FC = () => {
  const router = useRouter();

  // ✅ Hydration-safe locale:
  // Server & Client aynı: Next i18n router.locale
  const localeShort = shortLocale(router.locale || router.defaultLocale || "tr");

  const { ui } = useUiSection("ui_blog", localeShort);

  const backToListText = ui(
    "ui_blog_back_to_list",
    localeShort === "tr" ? "Tüm bloglara dön" : "Back to all blog posts",
  );
  const loadingText = ui(
    "ui_blog_loading",
    localeShort === "tr" ? "Blog yükleniyor..." : "Loading blog...",
  );
  const notFoundText = ui(
    "ui_blog_not_found",
    localeShort === "tr" ? "Blog içeriği bulunamadı." : "Blog post not found.",
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

  const post = data as CustomPageDto | undefined;

  const blogListHref = localizePath(localeShort, "/blog");

  const title = (post?.title || "").trim();

  const heroSrc = useMemo(() => {
    const raw = (post?.featured_image || "").trim();
    if (!raw) return "";
    return toCdnSrc(raw, HERO_W, HERO_H, "fill") || raw;
  }, [post]);

  const contentHtml = useMemo(() => {
    const html = safeStr((post as any)?.content_html).trim();
    if (html) return html;

    const summary = safeStr((post as any)?.summary).trim();
    if (summary) return `<p>${summary}</p>`;

    const txt = excerpt(safeStr((post as any)?.content_text), 800).trim();
    return txt ? `<p>${txt}</p>` : "";
  }, [post]);

  const tags = useMemo(() => {
    return asStringArray(
      (post as any)?.tags ??
        (post as any)?.tag_list ??
        (post as any)?.tags_csv,
    );
  }, [post]);

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Back link */}
        <div className="row mb-30">
          <div className="col-12">
            <button
              type="button"
              className="link-more"
              onClick={() => router.push(blogListHref)}
            >
              ← {backToListText}
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="row">
            <div className="col-12">
              <p>{loadingText}</p>
              <div className="skeleton-line mt-10" style={{ height: 16 }} aria-hidden />
              <div className="skeleton-line mt-10" style={{ height: 16, width: "80%" }} aria-hidden />
            </div>
          </div>
        )}

        {/* Error / not found */}
        {!isLoading && (isError || !post) && (
          <div className="row">
            <div className="col-12">
              <p>{notFoundText}</p>
            </div>
          </div>
        )}

        {/* Detail + tags + reviews */}
        {!isLoading && !isError && post && (
          <>
            {/* Detay */}
            <div className="row" data-aos="fade-up" data-aos-delay="200">
              <div className="col-12">
                <article className="news__detail">
                  {/* Title + date */}
                  <header className="news__detail-header mb-30">
                    <h1 className="section__title-3 mb-20">
                      {title || notFoundText}
                    </h1>
                  </header>

                  {/* Hero */}
                  <div className="news__detail-hero w-img mb-30">
                    <Image
                      src={(heroSrc as any) || (FallbackCover as any)}
                      alt={(post as any)?.featured_image_alt || title || "blog image"}
                      width={HERO_W}
                      height={HERO_H}
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>

                  {/* Content */}
                  <div
                    className="news__detail-content tp-postbox-details"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />

                  {/* Tags (deterministic) */}
                  {tags.length > 0 && (
                    <div style={{ marginTop: 22 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {tags.map((t) => (
                          <Link
                            key={t}
                            href={blogListHref}
                            className="tag"
                            aria-label={`tag: ${t}`}
                          >
                            {t}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </div>

            {/* Reviews + Review form */}
            <div className="row mt-60" data-aos="fade-up" data-aos-delay="250">
              <div className="col-lg-7 col-md-12 mb-30">
                <ReviewList
                  targetType="blog"
                  targetId={post.id}
                  locale={localeShort}
                  showHeader={true}
                  className="blog__detail-reviews"
                />
              </div>

              <div className="col-lg-5 col-md-12 mb-30">
                <ReviewForm
                  targetType="blog"
                  targetId={post.id}
                  locale={localeShort}
                  className="blog__detail-review-form"
                  toggleLabel={ui(
                    "ui_blog_write_comment",
                    localeShort === "tr" ? "Yorum Gönder" : "Write a review",
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogDetailsArea;
