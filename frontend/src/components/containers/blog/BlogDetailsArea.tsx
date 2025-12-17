// src/components/containers/blog/BlogDetailsArea.tsx

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import Arrow from "public/img/svg/arrow.svg";
import BlockquoteIcon from "public/img/svg/blockquote.svg";

import { useResolvedLocale } from "@/i18n/locale";
import { localizePath } from "@/i18n/url";

import {
  useGetCustomPageBySlugPublicQuery,
  useListCustomPagesPublicQuery,
} from "@/integrations/rtk/hooks";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";

import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

const BLOG_PATH = "/blog";

function safeStr(v: any): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function formatDateSafe(input?: any, locale?: string) {
  const raw = input ? String(input) : "";
  const d = raw ? new Date(raw) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.map((x) => safeStr(x)).filter(Boolean);
  if (typeof v === "string") {
    // "a,b,c" gibi
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

const BlogDetailsArea: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();

  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0]
        : "";

  const { data: page, isLoading } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !slug },
  );

  // Prev/Next için liste (hafif)
  const { data: listData } = useListCustomPagesPublicQuery(
    {
      module_key: "blog",
      locale,
      limit: 200,
      sort: "created_at",
      orderDir: "desc",
    },
    { skip: !slug },
  );

  const list = useMemo(() => {
    const raw: CustomPageDto[] = (listData?.items ?? []) as any;
    return raw.filter((x) => !!x?.is_published);
  }, [listData?.items]);

  const nav = useMemo(() => {
    const currentSlug = safeStr((page as any)?.slug || slug).trim();
    if (!currentSlug || !list.length) return { prev: null as any, next: null as any };

    const idx = list.findIndex((x: any) => safeStr(x?.slug).trim() === currentSlug);
    if (idx < 0) return { prev: null, next: null };

    // list desc: daha yeni -> daha eski
    const nextItem = idx > 0 ? list[idx - 1] : null; // daha yeni (sağa "Next" demek istiyorsan swap yapabilirsin)
    const prevItem = idx < list.length - 1 ? list[idx + 1] : null; // daha eski

    return { prev: prevItem, next: nextItem };
  }, [list, page, slug]);

  const hrefOf = (s?: string) => localizePath(`${BLOG_PATH}/${encodeURIComponent(String(s || ""))}`, locale);

  const featuredImage = useMemo(() => {
    const raw = safeStr((page as any)?.featured_image).trim();
    if (!raw) return "";
    return toCdnSrc(raw, 1200, 700, "fill") || raw;
  }, [page]);

  const title = useMemo(() => {
    return safeStr((page as any)?.title).trim() || (locale === "tr" ? "Blog" : "Blog");
  }, [page, locale]);

  const createdAtText = useMemo(() => {
    const raw = (page as any)?.created_at ?? (page as any)?.published_at ?? "";
    return formatDateSafe(raw, locale);
  }, [page, locale]);

  const authorName = useMemo(() => {
    return safeStr((page as any)?.author_name).trim() || "Ensotek";
  }, [page]);

  const contentHtml = useMemo(() => {
    const html = safeStr((page as any)?.content_html).trim();
    if (html) return html;

    // fallback: summary veya excerpt
    const summary = safeStr((page as any)?.summary).trim();
    if (summary) return `<p>${summary}</p>`;

    const txt = excerpt(safeStr((page as any)?.content_text), 600).trim();
    return txt ? `<p>${txt}</p>` : "";
  }, [page]);

  const tags = useMemo(() => {
    // varsa: page.tags veya page.tag_list vb.
    return asStringArray((page as any)?.tags ?? (page as any)?.tag_list ?? (page as any)?.tags_csv);
  }, [page]);

  // Loading / Not found
  if (isLoading) {
    return (
      <section className="postbox__area pt-120 pb-60">
        <div className="container">
          <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="300">
            <div className="col-xl-10 col-lg-12">
              <div className="alert alert-info">
                {locale === "tr" ? "Yükleniyor..." : "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!page && slug) {
    return (
      <section className="postbox__area pt-120 pb-60">
        <div className="container">
          <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="300">
            <div className="col-xl-10 col-lg-12">
              <div className="alert alert-warning">
                {locale === "tr"
                  ? "Blog içeriği bulunamadı."
                  : "Blog post not found."}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="postbox__area pt-120 pb-60">
      <div className="container">
        <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-10 col-lg-12">
            <div className="postbox__wrapper mb-60">
              {/* Featured image */}
              {featuredImage ? (
                <div className="blog__thumb w-img mb-45">
                  <Image
                    src={featuredImage}
                    alt={title}
                    width={1200}
                    height={700}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ) : null}

              {/* Meta */}
              <div className="blog__meta mb-45">
                {/* Author thumb: backend alanı varsa göster; yoksa gizle */}
                {safeStr((page as any)?.author_image).trim() ? (
                  <div className="blog__meta-thumb">
                    <Image
                      src={safeStr((page as any)?.author_image)}
                      alt={authorName}
                      width={48}
                      height={48}
                    />
                  </div>
                ) : null}

                <div className="blog__meta-author">
                  <span>{authorName}</span>
                  <span>{createdAtText}</span>
                </div>
              </div>

              {/* Title + Content */}
              <div className="postbox__text mb-35">
                <h3 className="postbox__title">{title}</h3>

                {contentHtml ? (
                  <div
                    className="postbox__content"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                ) : (
                  <p>
                    {locale === "tr"
                      ? "İçerik yakında eklenecek."
                      : "Content will be added soon."}
                  </p>
                )}
              </div>

              {/* Template’den blockquote: backend alanı varsa doldur, yoksa gizle */}
              {safeStr((page as any)?.quote_text).trim() ? (
                <div className="blockquote___wrapper mt-45 mb-40">
                  <div className="blockquote">
                    <div className="blockquote__icon">
                      <Image src={BlockquoteIcon} alt="Quote" />
                    </div>
                    <div className="blockquote__content">
                      <h3>{safeStr((page as any)?.quote_text)}</h3>
                      {safeStr((page as any)?.quote_author).trim() ? (
                        <span>{safeStr((page as any)?.quote_author)}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Template’den “features list”: backend alanı yoksa gizle */}
              {Array.isArray((page as any)?.feature_items) &&
                (page as any).feature_items.length ? (
                <div className="blog__features">
                  <div className="blog__features-content">
                    <h3>{safeStr((page as any)?.feature_title) || "Highlights"}</h3>
                    {safeStr((page as any)?.feature_intro).trim() ? (
                      <p>{safeStr((page as any)?.feature_intro)}</p>
                    ) : null}
                  </div>

                  <div className="blog__features__list">
                    <ul>
                      {(page as any).feature_items.map((it: any, idx: number) => (
                        <li key={idx}>
                          <Image src={Arrow} alt="Arrow" />
                          {safeStr(it)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Tags */}
            {tags.length ? (
              <div className="postbox__tag-wrapper mb-40">
                <div className="postbox__tag-title">Tags:</div>
                <div className="postbox__tag">
                  {tags.map((t) => (
                    <Link key={t} href={BLOG_PATH}>
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Author card: backend alanı yoksa minimal göster */}
            <div className="postbox-wrapper-2 mb-60">
              <div className="postbox__meta mb-40">
                {safeStr((page as any)?.author_avatar).trim() ? (
                  <div className="postbox__meta-icon">
                    <Image
                      src={safeStr((page as any)?.author_avatar)}
                      alt={authorName}
                      width={72}
                      height={72}
                    />
                  </div>
                ) : null}

                <div className="postbox__meta-content">
                  <div className="postbox__author-inner">
                    <div className="postbox__author">
                      <h4>{authorName}</h4>
                      <span>{safeStr((page as any)?.author_role).trim() || "Blog Admin"}</span>
                    </div>

                    {/* Sosyal linkler varsa göster */}
                    {isMemoizedSocial((page as any)) ? (
                      <div className="touch__social">
                        {renderSocialLink((page as any)?.social_facebook, "fa-facebook-f")}
                        {renderSocialLink((page as any)?.social_twitter, "fa-twitter")}
                        {renderSocialLink((page as any)?.social_youtube, "fa-youtube")}
                        {renderSocialLink((page as any)?.social_linkedin, "fa-linkedin")}
                      </div>
                    ) : null}
                  </div>

                  {safeStr((page as any)?.author_bio).trim() ? (
                    <p>{safeStr((page as any)?.author_bio)}</p>
                  ) : null}
                </div>
              </div>

              {/* Prev / Next */}
              <div className="blog__nav-items">
                <div className="single__nav">
                  <div className="single__nav-btn">
                    <Link href={nav.prev ? hrefOf(safeStr((nav.prev as any)?.slug)) : BLOG_PATH}>
                      <i className="fa-light fa-arrow-left-long"></i>
                    </Link>
                  </div>
                  <div className="blog-content">
                    <span>Previous Post</span>
                  </div>
                </div>

                <div className="dot-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
                    <g id="Group_5129" data-name="Group 5129" transform="translate(-633.197 -4179.197)">
                      <rect id="Rectangle_971" data-name="Rectangle 971" width="15" height="15" transform="translate(633.197 4179.197)" fill="#2f2f2f" />
                      <rect id="Rectangle_974" data-name="Rectangle 974" width="15" height="15" transform="translate(633.197 4197.197)" fill="#2f2f2f" />
                      <rect id="Rectangle_972" data-name="Rectangle 972" width="15" height="15" transform="translate(651.197 4179.197)" fill="#2f2f2f" />
                      <rect id="Rectangle_973" data-name="Rectangle 973" width="15" height="15" transform="translate(651.197 4197.197)" fill="#2f2f2f" />
                    </g>
                  </svg>
                </div>

                <div className="single__nav">
                  <div className="blog-content">
                    <span>Next Post</span>
                  </div>
                  <div className="single__nav-btn">
                    <Link href={nav.next ? hrefOf(safeStr((nav.next as any)?.slug)) : BLOG_PATH}>
                      <i className="fa-light fa-arrow-right-long"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Comment form: şu an BE yok; template’i koruyup submit’i noop bırak */}
              <div className="postbox__comment-form pt-50">
                <h3 className="postbox__comment-form-title">Leave A Comment</h3>
                <form
                  action="#"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="row">
                    <div className="col-xxl-12">
                      <div className="postbox__comment-input mb-30">
                        <textarea placeholder="Start type..."></textarea>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="postbox__comment-input mb-30">
                        <input type="text" placeholder="your name" />
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="postbox__comment-input mb-30">
                        <input type="email" placeholder="your email" />
                      </div>
                    </div>
                    <div className="col-xxl-12">
                      <div className="postbox__comment-btn mt-5">
                        <button className="solid__btn" type="submit">
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {/* /comment */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;

/** --- sosyal yardımcıları: template korunurken şartlı render --- */
function renderSocialLink(url: any, iconClass: string) {
  const u = safeStr(url).trim();
  if (!u) return null;
  return (
    <a href={u} target="_blank" rel="noreferrer" aria-label={iconClass}>
      <i className={`fa-brands ${iconClass}`}></i>
    </a>
  );
}

function isMemoizedSocial(page: any) {
  return (
    !!safeStr(page?.social_facebook).trim() ||
    !!safeStr(page?.social_twitter).trim() ||
    !!safeStr(page?.social_youtube).trim() ||
    !!safeStr(page?.social_linkedin).trim()
  );
}
