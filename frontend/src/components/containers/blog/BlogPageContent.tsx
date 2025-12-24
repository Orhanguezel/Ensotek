// =============================================================
// FILE: src/components/containers/blog/BlogPageContent.tsx
// Ensotek – Full Blog Page Content (NewsPageContent clone)
//   - Data: custom_pages (module_key = "blog")
//   - UI i18n: site_settings.ui_blog
//   - Locale source = router.locale (hydration-safe)
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useListCustomPagesPublicQuery } from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import FallbackCover from "public/img/blog/3/1.jpg";

const CARD_W = 720;
const CARD_H = 480;
const PAGE_LIMIT = 12;

function shortLocale(v: unknown): string {
  return String(v || "tr").trim().toLowerCase().replace("_", "-").split("-")[0] || "tr";
}

const BlogPageContent: React.FC = () => {
  const router = useRouter();

  // ✅ Hydration-safe locale
  const locale = shortLocale(router.locale || router.defaultLocale || "tr");

  const { ui } = useUiSection("ui_blog", locale);

  const sectionSubtitlePrefix = ui("ui_blog_subprefix", "Ensotek");
  const sectionSubtitleLabel = ui("ui_blog_sublabel", locale === "tr" ? "Blog" : "Blog");
  const sectionTitle = ui("ui_blog_page_title", locale === "tr" ? "Blog" : "Blog");
  const sectionIntro = ui(
    "ui_blog_page_intro",
    locale === "tr"
      ? "Ensotek blog yazıları, teknik içerikler ve duyurular."
      : "Ensotek blog posts, technical content and updates."
  );

  const readMore = ui("ui_blog_read_more", locale === "tr" ? "Devamını oku" : "Read more");
  const readMoreAria = ui(
    "ui_blog_read_more_aria",
    locale === "tr" ? "blog detayını görüntüle" : "view blog details"
  );
  const untitled = ui("ui_blog_untitled", locale === "tr" ? "Başlıksız blog" : "Untitled post");
  const emptyText = ui(
    "ui_blog_empty",
    locale === "tr"
      ? "Şu anda görüntülenecek blog yazısı bulunmamaktadır."
      : "There are no blog posts to display at the moment."
  );

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: "blog",
    sort: "created_at",
    orderDir: "desc",
    limit: PAGE_LIMIT,
    is_published: 1,
    locale,
  });

  const blogItems = useMemo(() => {
    const items: CustomPageDto[] = data?.items ?? [];

    return items.map((p) => {
      const title = (p.title || "").trim() || untitled;
      const slug = (p.slug || "").trim();

      const baseText =
        (p.meta_description || "").trim() ||
        (p.content_html || "").trim();

      const textExcerpt = excerpt(baseText, 220);

      const imgRaw = (p.featured_image || "").trim();
      const hero =
        (imgRaw && (toCdnSrc(imgRaw, CARD_W, CARD_H, "fill") || imgRaw)) || "";

      return { id: p.id, slug, title, excerpt: textExcerpt, hero };
    });
  }, [data, untitled]);

  const blogListHref = localizePath(locale, "/blog");

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>
                  {sectionSubtitlePrefix} {sectionSubtitleLabel}
                </span>
              </div>
              <div className="section__title-3 mb-20">{sectionTitle}</div>
              {sectionIntro && (
                <p style={{ maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
                  {sectionIntro}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {blogItems.length === 0 && !isLoading && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          {blogItems.map((p) => {
            const detailHref = p.slug
              ? localizePath(locale, `/blog/${encodeURIComponent(p.slug)}`)
              : blogListHref;

            return (
              <div className="col-xl-4 col-lg-6 col-md-6" key={p.id}>
                <div className="news__item-3 mb-30">
                  <div className="news__thumb-3 w-img">
                    <Image
                      src={(p.hero as any) || (FallbackCover as any)}
                      alt={p.title || "blog image"}
                      width={CARD_W}
                      height={CARD_H}
                      style={{ width: "100%", height: "auto" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="news__content-3">
                    <h3>
                      <Link href={detailHref}>{p.title}</Link>
                    </h3>
                    {p.excerpt && (
                      <p style={{ marginTop: 8, marginBottom: 10, opacity: 0.85, fontSize: 14 }}>
                        {p.excerpt}
                      </p>
                    )}
                    <Link href={detailHref} className="link-more" aria-label={`${p.title} — ${readMoreAria}`}>
                      {readMore} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="col-12">
              <div className="skeleton-line" style={{ height: 16 }} aria-hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPageContent;
