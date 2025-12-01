// src/components/containers/library/LibraryDetail.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  useGetLibraryBySlugQuery,
  useListLibraryImagesQuery,
  useListLibraryFilesQuery,
} from "@/integrations/rtk/endpoints/library.endpoints";

import { toCdnSrc } from "@/lib/shared/media";
import { stripHtml } from "@/lib/shared/text";

import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";
import { localizePath } from "@/i18n/url";

// Library section’de kullandığımız pattern ile aynı
import ShapePattern from "public/img/shape/features-shape.png";

const LibraryDetail: React.FC = () => {
  const router = useRouter();

  // FE locale
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_library", locale, UI_KEYS.library);

  // slug param
  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
      ? slugParam[0]
      : "";

  // Router tam hazır + slug mevcut mu?
  const routerReady = router.isReady && !!slug;

  /* -------------------- ANA DOKÜMAN (by slug) -------------------- */

  const {
    data: library,
    isLoading,
    isError,
  } = useGetLibraryBySlugQuery(
    { slug, locale },
    {
      skip: !routerReady, // router hazır değilse hiç istek atma
    },
  );

  const loading = !routerReady || isLoading;

  /* -------------------- GÖRSELLER & DOSYALAR -------------------- */

  const { data: images = [] } = useListLibraryImagesQuery(
    { id: library?.id ?? "", locale },
    {
      skip: !routerReady || !library?.id,
    },
  );

  const {
    data: files = [],
    isLoading: filesLoading,
  } = useListLibraryFilesQuery(
    { id: library?.id ?? "", locale },
    {
      skip: !routerReady || !library?.id,
    },
  );

  /* -------------------- DERİVASYONLAR -------------------- */

  const heroImage = useMemo(() => {
    if (images.length) {
      const img: any = images[0];
      const src = img.webp || img.url || img.thumbnail || img.asset?.url || "";
      if (src) {
        return toCdnSrc(src, 720, 520, "fill");
      }
    }
    return "";
  }, [images]);

  const heroAlt = library?.title || ui("ui_library_cover_alt", "library cover");
  const title = library?.title || ui("ui_library_untitled", "Untitled content");

  const publishedAtLabel = useMemo(() => {
    if (!library?.published_at) return "";
    try {
      const d = new Date(library.published_at);
      return d.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return String(library.published_at);
    }
  }, [library?.published_at, locale]);

  const contentHtml = useMemo(() => {
    if (!library?.content) return "";
    const raw = library.content;
    if (typeof raw !== "string") return "";
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof (parsed as any).html === "string"
      ) {
        return (parsed as any).html;
      }
    } catch {
      // plain HTML string
    }
    return raw;
  }, [library?.content]);

  const shortSummary = useMemo(() => {
    if (!library?.summary) return "";
    return stripHtml(String(library.summary)).slice(0, 260);
  }, [library?.summary]);

  const backHref = localizePath(locale, "/library");

  /* -------------------- RENDER STATE'LERİ -------------------- */

  // 1) Router hazır değil / query yükleniyor
  if (loading) {
    return (
      <section className="features__area p-relative features-bg pt-120 pb-60 cus-faq">
        {/* Background pattern */}
        <div className="features__pattern">
          <Image
            src={ShapePattern}
            alt="pattern"
            loading="lazy"
            sizes="200px"
          />
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-8 text-center">
              <p>{ui("ui_library_detail_loading", "Loading document...")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2) İstek bitti, data yok veya hata → 404 state
  if (isError || !library) {
    return (
      <section className="features__area p-relative features-bg pt-120 pb-60 cus-faq">
        {/* Background pattern */}
        <div className="features__pattern">
          <Image
            src={ShapePattern}
            alt="pattern"
            loading="lazy"
            sizes="200px"
          />
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-8 text-center">
              <h3 className="mb-3">
                {ui("ui_library_detail_not_found", "Document not found")}
              </h3>
              <p className="mb-4">
                {ui(
                  "ui_library_detail_not_found_desc",
                  "The requested document could not be found or is not available.",
                )}
              </p>
              <Link href={backHref} className="solid__btn">
                {ui("ui_library_back_to_list", "Back to library")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3) Başarılı state
  return (
    <section className="features__area p-relative features-bg pt-120 pb-60 cus-faq">
      {/* Background pattern (Library section ile aynı) */}
      <div className="features__pattern">
        <Image
          src={ShapePattern}
          alt="pattern"
          loading="lazy"
          sizes="200px"
        />
      </div>

      <div className="container">
        <div className="row align-items-start">
          {/* Sol: hero görseli */}
          <div className="col-xl-6 col-lg-6">
            <div className="about__thumb-wrapper-3 mb-60">
              <div className="about__thumb-3">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={heroAlt}
                    width={720}
                    height={520}
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 320,
                      borderRadius: 18,
                      background:
                        "linear-gradient(135deg, rgba(90,87,255,.15), rgba(0,0,0,.04))",
                    }}
                  />
                )}
              </div>
            </div>

            {(filesLoading || files.length > 0) && (
              <div className="mb-40">
                <h4 className="mb-3">
                  {ui("ui_library_files_title", "Downloads")}
                </h4>
                {filesLoading ? (
                  <p className="small text-muted">
                    {ui("ui_library_files_loading", "Loading files...")}
                  </p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {files.map((f) => (
                      <li key={f.id} className="mb-2">
                        <a
                          href={f.url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-inline-flex align-items-center gap-2"
                        >
                          <span>{f.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Sağ: içerik */}
          <div className="col-xl-6 col-lg-6">
            <div className="about__content-wapper mb-60">
              <div className="section__title-wrapper mb-30">
                <div className="section__subtitle-3">
                  <span>
                    {ui("ui_library_detail_subtitle", "Technical document")}
                  </span>
                </div>
                <div className="section__title-3">{title}</div>
              </div>

              {publishedAtLabel && (
                <p className="text-muted small mb-3">
                  {ui("ui_library_published_at", "Published")}:{" "}
                  <strong>{publishedAtLabel}</strong>
                </p>
              )}

              {shortSummary && (
                <p style={{ fontSize: 15, opacity: 0.9 }}>{shortSummary}</p>
              )}

              {contentHtml && (
                <div
                  className="library-detail-body mt-3"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              )}

              <div className="mt-40">
                <Link href={backHref} className="border__btn">
                  {ui("ui_library_back_to_list", "Back to library")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .library-detail-body :global(h2),
        .library-detail-body :global(h3),
        .library-detail-body :global(h4) {
          margin-top: 1.6rem;
          margin-bottom: 0.6rem;
        }
        .library-detail-body :global(p) {
          margin-bottom: 0.8rem;
          line-height: 1.6;
        }
        .library-detail-body :global(ul),
        .library-detail-body :global(ol) {
          padding-left: 1.4rem;
          margin-bottom: 0.8rem;
        }
        .library-detail-body :global(a) {
          color: var(--tp-theme-1, #5a57ff);
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
};

export default LibraryDetail;
