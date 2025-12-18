// =============================================================
// FILE: src/components/containers/product/ProductMore.tsx
// Ensotek – More Products Section (detail page altı)
//   - Data: products
//   - Mevcut slug haricindeki ürünler
//   - i18n: site_settings.ui_products
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useListProductsQuery } from "@/integrations/rtk/hooks";
import type { ProductDto } from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import FallbackCover from "public/img/blog/3/2.jpg";

const CARD_W = 480;
const CARD_H = 320;

const ProductMore: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_products", locale);

  const moreTitle = ui(
    "ui_products_more_title",
    locale === "tr" ? "Diğer Ürünler" : "More Products",
  );

  const slugParam = router.query.slug;
  const currentSlug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || "",
    [slugParam],
  );

  // RTK: listProducts → ProductListResponse (items + total)
  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale,
    limit: 8,
  });

  const productListHref = localizePath(locale, "/product");

  const items = useMemo(() => {
    const list: ProductDto[] = data?.items ?? [];

    return list
      .filter((p) => {
        const slug = (p.slug || "").trim();
        if (!p.is_active) return false;
        if (!slug) return false;
        if (slug === currentSlug) return false;
        return true;
      })
      .slice(0, 3)
      .map((p) => {
        const slug = (p.slug || "").trim();
        const title = (p.title || "").trim();

        const imgRaw =
          (p.image_url || "").trim() ||
          ((p.images && p.images[0]) || "").trim();

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
          alt: p.alt || title || "product image",
        };
      });
  }, [data, currentSlug]);

  if (!items.length && !isLoading) {
    return null;
  }

  return (
    <section className="product__more-area pt-60 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="section__title-wrapper text-center">
              <div className="section__subtitle-3">
                <span>{moreTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="row" data-aos="fade-up" data-aos-delay="200">
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
                    <p
                      className="product__meta"
                      style={{ marginTop: 6 }}
                    >
                    </p>
                    <Link href={href} className="link-more">
                      {locale === "tr" ? "Ürüne git" : "View product"} →
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

export default ProductMore;
