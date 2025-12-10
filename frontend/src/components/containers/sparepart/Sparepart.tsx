// =============================================================
// FILE: src/components/containers/sparepart/Sparepart.tsx
// Ensotek – Spareparts section (Home / Landing)
//   - Data: products (category: sparepart)
//   - i18n: site_settings.key = "ui_spareparts"
//   - Category bazlı filtre için optional categoryId prop
//   - Locale-aware routes with localizePath
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  useListProductsQuery,
} from "@/integrations/rtk/endpoints/products.endpoints";
import type { ProductDto } from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import FallbackCover from "public/img/blog/1/blog-01.jpg";

const CARD_W = 720;
const CARD_H = 480;

// Root sparepart category (011_catalog_categories.sql)
const SPAREPART_ROOT_CATEGORY_ID =
  "aaaa1001-1111-4111-8111-aaaaaaaa1001";

export interface SparepartSectionProps {
  /** İstenirse belli bir alt kategori ile override edilebilir */
  categoryId?: string;
}

const Sparepart: React.FC<SparepartSectionProps> = ({ categoryId }) => {
  const locale = useResolvedLocale();

  // UI yazıları → site_settings.key = "ui_spareparts"
  const { ui } = useUiSection("ui_spareparts", locale);

  const kickerPrefix = ui("ui_spareparts_kicker_prefix", "Ensotek");
  const kickerLabel = ui(
    "ui_spareparts_kicker_label",
    locale === "tr" ? "Yedek Parçalar" : "Spare Parts",
  );

  const titlePrefix = ui(
    "ui_spareparts_title_prefix",
    locale === "tr" ? "Kule" : "Tower",
  );
  const titleMark = ui(
    "ui_spareparts_title_mark",
    locale === "tr" ? "Yedek Parçaları" : "Spare Parts",
  );

  const readMore = ui(
    "ui_spareparts_read_more",
    locale === "tr" ? "Detayları görüntüle" : "View details",
  );
  const readMoreAria = ui(
    "ui_spareparts_read_more_aria",
    locale === "tr" ? "yedek parça detayını görüntüle" : "view spare part details",
  );
  const priceLabel = ui(
    "ui_spareparts_price_label",
    locale === "tr" ? "Başlangıç fiyatı" : "Starting from",
  );
  const viewAllText = ui(
    "ui_spareparts_view_all",
    locale === "tr" ? "Tüm Yedek Parçalar" : "All spare parts",
  );
  const emptyText = ui(
    "ui_spareparts_empty",
    locale === "tr"
      ? "Şu anda görüntülenecek yedek parça bulunmamaktadır."
      : "There are no spare parts to display at the moment.",
  );

  const effectiveCategoryId = categoryId ?? SPAREPART_ROOT_CATEGORY_ID;

  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale,
    limit: 6,
    ...(effectiveCategoryId ? { category_id: effectiveCategoryId } : {}),
  });

  const items = useMemo(() => {
    // data: ProductListResponse | undefined
    const list: ProductDto[] = data?.items ?? [];

    return list
      .filter((p) => p.is_active)
      .slice(0, 3)
      .map((p) => {
        const title = (p.title || "").trim();
        const slug = (p.slug || "").trim();

        const imgRaw =
          (p.image_url || "").trim() ||
          (p.images[0] || "").trim();

        const hero =
          (imgRaw &&
            (toCdnSrc(imgRaw, CARD_W, CARD_H, "fill") || imgRaw)) ||
          "";

        return {
          id: p.id,
          slug,
          title,
          price: p.price,
          hero,
          alt: p.alt || title || "sparepart image",
        };
      });
  }, [data]);


  const sparepartListHref = localizePath(locale, "/sparepart");

  return (
    <section className="product__area pt-120 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>{kickerPrefix}</span> {kickerLabel}
              </span>
              <h2 className="section__title">
                {titlePrefix}{" "}
                <span className="down__mark-line">{titleMark}</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div
          className="row"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {!isLoading && items.length === 0 && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          {items.map((p) => {
            const href = p.slug
              ? localizePath(
                locale,
                `/sparepart/${encodeURIComponent(p.slug)}`,
              )
              : sparepartListHref;

            return (
              <div
                className="col-xl-4 col-lg-4 col-md-6"
                key={p.id}
              >
                <div className="product__item mb-30">
                  <div className="product__thumb w-img mb-20">
                    <Image
                      src={(p.hero as any) || (FallbackCover as any)}
                      alt={p.alt}
                      width={CARD_W}
                      height={CARD_H}
                      style={{ width: "100%", height: "auto" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="product__content">
                    <h3 className="product__title">
                      <Link href={href}>{p.title}</Link>
                    </h3>
                    <div
                      className="product__meta"
                      style={{ marginTop: 8, marginBottom: 10 }}
                    >
                      <span className="product__price">
                        {priceLabel}:{" "}
                        <strong>
                          {p.price.toLocaleString(locale, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}{" "}
                          €
                        </strong>
                      </span>
                    </div>
                    <Link
                      href={href}
                      className="link-more"
                      aria-label={`${p.title} — ${readMoreAria}`}
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

        {/* Tüm spareparts CTA */}
        <div className="row" style={{ marginTop: 24 }}>
          <div className="col-12">
            <div className="project__view text-lg-end">
              <Link className="solid__btn" href={sparepartListHref}>
                {viewAllText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sparepart;
