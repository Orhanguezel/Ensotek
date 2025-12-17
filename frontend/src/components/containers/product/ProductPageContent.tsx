// =============================================================
// FILE: src/components/containers/product/ProductPageContent.tsx
// Ensotek – Full Products Page Content
//   - Tüm ürünlerin grid listesi
//   - Data: products
//   - i18n: site_settings.ui_products
//   - Locale-aware routes with localizePath
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { useListProductsQuery } from "@/integrations/rtk/hooks";
import type { ProductDto } from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// Fallback görsel
import FallbackCover from "public/img/blog/3/1.jpg";

const CARD_W = 720;
const CARD_H = 480;
const PAGE_LIMIT = 12;

// Kısa açıklama helper'ı
function makeExcerpt(text: string, maxLength = 140): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength);
  return sliced.replace(/[,.;:\s]+$/g, "") + "…";
}

const ProductPageContent: React.FC = () => {
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_products", locale);

  const sectionSubtitlePrefix = ui("ui_products_kicker_prefix", "Ensotek");
  const sectionSubtitleLabel = ui(
    "ui_products_kicker_label",
    locale === "tr" ? "Ürünlerimiz" : "Our Products",
  );
  const sectionTitle = ui(
    "ui_products_page_title",
    locale === "tr" ? "Ürünlerimiz" : "Products",
  );
  const sectionIntro = ui(
    "ui_products_page_intro",
    locale === "tr"
      ? "Endüstriyel su soğutma kuleleri ve tamamlayıcı ekipmanlara ait seçili ürünler."
      : "Selected products for industrial cooling towers and related equipment.",
  );
  const readMore = ui(
    "ui_products_read_more",
    locale === "tr" ? "Detayları görüntüle" : "View details",
  );
  const readMoreAria = ui(
    "ui_products_read_more_aria",
    locale === "tr" ? "ürün detayını görüntüle" : "view product details",
  );
  const emptyText = ui(
    "ui_products_empty",
    locale === "tr"
      ? "Şu anda görüntülenecek ürün bulunmamaktadır."
      : "There are no products to display at the moment.",
  );

  // RTK: listProducts artık ProductListResponse döner (items + total)
  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale,
    limit: PAGE_LIMIT,
  });

  const items = useMemo(() => {
    const list: ProductDto[] = data?.items ?? [];

    return list.map((p) => {
      const title = (p.title || "").trim();
      const slug = (p.slug || "").trim();

      const imgRaw =
        (p.image_url || "").trim() ||
        ((p.images && p.images[0]) || "").trim();

      const hero =
        (imgRaw &&
          (toCdnSrc(imgRaw, CARD_W, CARD_H, "fill") || imgRaw)) ||
        "";

      const description = (p.description || "").trim();
      const excerpt = makeExcerpt(description);

      return {
        id: p.id,
        slug,
        title,
        hero,
        alt: p.alt || title || "product image",
        excerpt,
      };
    });
  }, [data]);

  const productListHref = localizePath(locale, "/product");

  return (
    <section className="product__area grey-bg-3 pt-120 pb-90">
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
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {!isLoading && items.length === 0 && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          {items.map((p) => {
            const href = p.slug
              ? localizePath(
                locale,
                `/product/${encodeURIComponent(p.slug)}`,
              )
              : productListHref;

            return (
              <div
                className="col-xl-4 col-lg-4 col-md-6"
                key={p.id}
              >
                <div className="product__item-3 mb-30">
                  <div className="product__thumb-3 w-img">
                    <Image
                      src={(p.hero as any) || (FallbackCover as any)}
                      alt={p.alt}
                      width={CARD_W}
                      height={CARD_H}
                      style={{ width: "100%", height: "auto" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="product__content-3">
                    <h3>
                      <Link href={href}>{p.title}</Link>
                    </h3>

                    {p.excerpt && (
                      <p
                        className="product__meta"
                        style={{ marginTop: 6, marginBottom: 10 }}
                      >
                        {p.excerpt}
                      </p>
                    )}

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
      </div>
    </section>
  );
};

export default ProductPageContent;
