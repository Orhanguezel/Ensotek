// =============================================================
// FILE: src/components/containers/sparepart/SparepartDetail.tsx
// Ensotek – Sparepart Detail Content
//   - Data: products (by slug, locale-aware, category: sparepart)
//   - i18n: site_settings.ui_spareparts
//   - Fiyat GÖSTERME, sadece "Teklif isteyiniz" CTA
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { useGetProductBySlugQuery } from "@/integrations/rtk/endpoints/products.endpoints";
import type { ProductDto } from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import FallbackCover from "public/img/blog/3/1.jpg";

const HERO_W = 960;
const HERO_H = 540;

const SparepartDetail: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_spareparts", locale);

  const backToListText = ui(
    "ui_spareparts_back_to_list",
    locale === "tr" ? "Tüm yedek parçalara dön" : "Back to all spare parts",
  );
  const loadingText = ui(
    "ui_spareparts_loading",
    locale === "tr" ? "Yedek parça yükleniyor..." : "Loading spare part...",
  );
  const notFoundText = ui(
    "ui_spareparts_not_found",
    locale === "tr" ? "Yedek parça bulunamadı." : "Spare part not found.",
  );
  const specsTitle = ui(
    "ui_spareparts_specs_title",
    locale === "tr" ? "Teknik Özellikler" : "Technical Specifications",
  );
  const tagsTitle = ui(
    "ui_spareparts_tags_title",
    locale === "tr" ? "Etiketler" : "Tags",
  );
  const requestQuoteText = ui(
    "ui_spareparts_request_quote",
    locale === "tr" ? "Teklif isteyiniz" : "Request a quote",
  );

  const slugParam = router.query.slug;
  const slug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || "",
    [slugParam],
  );

  const {
    data,
    isLoading,
    isError,
  } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !slug },
  );

  const sparepart = data as ProductDto | undefined;

  const sparepartListHref = localizePath(locale, "/sparepart");

  const title = (sparepart?.title || "").trim();
  const description = (sparepart?.description || "").trim();
  const sparepartId = sparepart?.id ?? "";

  const heroSrc = useMemo(() => {
    if (!sparepart) return "";
    const raw =
      (sparepart.image_url || "").trim() ||
      ((sparepart.images && sparepart.images[0]) || "").trim();
    if (!raw) return "";
    return toCdnSrc(raw, HERO_W, HERO_H, "fill") || raw;
  }, [sparepart]);

  const specsEntries = useMemo(() => {
    const specs = sparepart?.specifications || null;
    if (!specs) {
      return [] as Array<{ key: string; label: string; value: string }>;
    }

    const labels: Record<string, string> =
      locale === "tr"
        ? {
          dimensions: "Ölçüler",
          weight: "Ağırlık",
          thickness: "Kalınlık",
          surfaceFinish: "Yüzey",
          warranty: "Garanti",
          installationTime: "Montaj süresi",
        }
        : {
          dimensions: "Dimensions",
          weight: "Weight",
          thickness: "Thickness",
          surfaceFinish: "Surface finish",
          warranty: "Warranty",
          installationTime: "Installation time",
        };

    return Object.entries(specs)
      .filter(([, v]) => !!v)
      .map(([key, value]) => ({
        key,
        label: labels[key] ?? key,
        value: String(value),
      }));
  }, [sparepart, locale]);

  const tags = sparepart?.tags ?? [];

  const handleRequestQuote = () => {
    const contactPath = localizePath(
      locale,
      `/contact?sparepart=${encodeURIComponent(slug || sparepartId)}`,
    );
    void router.push(contactPath);
  };

  const showSkeleton =
    isLoading ||
    (!sparepart && !isError && !slug);

  return (
    <section className="product__detail-area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Back link */}
        <div className="row mb-30">
          <div className="col-12">
            <button
              type="button"
              className="link-more"
              onClick={() => router.push(sparepartListHref)}
            >
              ← {backToListText}
            </button>
          </div>
        </div>

        {/* Loading / error / not found */}
        {showSkeleton && (
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

        {!showSkeleton && (isError || !sparepart) && (
          <div className="row">
            <div className="col-12">
              <p>{notFoundText}</p>
            </div>
          </div>
        )}

        {!showSkeleton && !isError && sparepart && (
          <div
            className="row"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {/* Sol: görsel */}
            <div className="col-lg-6 mb-30">
              <div className="product__detail-hero w-img">
                <Image
                  src={(heroSrc as any) || (FallbackCover as any)}
                  alt={sparepart.alt || title || "sparepart image"}
                  width={HERO_W}
                  height={HERO_H}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              </div>
            </div>

            {/* Sağ: içerik */}
            <div className="col-lg-6 mb-30">
              <article className="product__detail">
                <header className="product__detail-header mb-20">
                  <h1 className="section__title-3 mb-15">
                    {title || notFoundText}
                  </h1>

                  {/* Fiyat YOK – sadece teklif CTA */}
                  <div className="product__detail-cta mt-15">
                    <button
                      type="button"
                      className="solid__btn"
                      onClick={handleRequestQuote}
                    >
                      {requestQuoteText}
                    </button>
                  </div>
                </header>

                {description && (
                  <div className="product__detail-desc mb-20">
                    <p>{description}</p>
                  </div>
                )}

                {/* Specs */}
                {!!specsEntries.length && (
                  <div
                    className="product__detail-specs mb-25 card p-3"
                    style={{ overflow: "hidden" }}
                  >
                    <h3 className="product__detail-subtitle mb-10">
                      {specsTitle}
                    </h3>
                    <ul
                      className="product__spec-list"
                      style={{
                        paddingLeft: "1.2rem",
                        marginBottom: 0,
                        overflowWrap: "break-word",
                      }}
                    >
                      {specsEntries.map((s) => (
                        <li key={s.key}>
                          <strong>{s.label}:</strong> {s.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {!!tags.length && (
                  <div className="product__detail-tags">
                    <h4 className="product__detail-subtitle mb-10">
                      {tagsTitle}
                    </h4>
                    <div className="product__tag-list">
                      {tags.map((t) => (
                        <span
                          className="tag"
                          key={t}
                          style={{ marginRight: 6, marginBottom: 4 }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SparepartDetail;
