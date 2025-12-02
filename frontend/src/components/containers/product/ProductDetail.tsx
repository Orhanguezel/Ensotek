// =============================================================
// FILE: src/components/containers/product/ProductDetail.tsx
// Ensotek – Product Detail Content
//   - Data: products (by slug, locale-aware)
//   - i18n: site_settings.ui_products
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  useGetProductBySlugQuery,
} from "@/integrations/rtk/endpoints/products.endpoints";
import type { ProductDto } from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import FallbackCover from "public/img/blog/3/1.jpg";

const HERO_W = 960;
const HERO_H = 540;

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_products", locale);

  const backToListText = ui(
    "ui_products_back_to_list",
    locale === "tr" ? "Tüm ürünlere dön" : "Back to all products",
  );
  const loadingText = ui(
    "ui_products_loading",
    locale === "tr" ? "Ürün yükleniyor..." : "Loading product...",
  );
  const notFoundText = ui(
    "ui_products_not_found",
    locale === "tr" ? "Ürün bulunamadı." : "Product not found.",
  );
  const priceLabel = ui(
    "ui_products_price_label",
    locale === "tr" ? "Fiyat" : "Price",
  );
  const specsTitle = ui(
    "ui_products_specs_title",
    locale === "tr" ? "Teknik Özellikler" : "Technical Specifications",
  );
  const tagsTitle = ui(
    "ui_products_tags_title",
    locale === "tr" ? "Etiketler" : "Tags",
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

  const product = data as ProductDto | undefined;

  const productListHref = localizePath(locale, "/product");

  const title = (product?.title || "").trim();
  const description = (product?.description || "").trim();
  const price = product?.price ?? 0;

  const heroSrc = useMemo(() => {
    if (!product) return "";
    const raw =
      (product.image_url || "").trim() ||
      (product.images[0] || "").trim();
    if (!raw) return "";
    return toCdnSrc(raw, HERO_W, HERO_H, "fill") || raw;
  }, [product]);

  const specsEntries = useMemo(() => {
    const specs = product?.specifications || null;
    if (!specs) return [] as Array<{ key: string; label: string; value: string }>;

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
  }, [product, locale]);

  const tags = product?.tags ?? [];

  return (
    <section className="product__detail-area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Back link */}
        <div className="row mb-30">
          <div className="col-12">
            <button
              type="button"
              className="link-more"
              onClick={() => router.push(productListHref)}
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

        {!isLoading && (isError || !product) && (
          <div className="row">
            <div className="col-12">
              <p>{notFoundText}</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && product && (
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
                  alt={product.alt || title || "product image"}
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

                  <div className="product__detail-price">
                    <span>{priceLabel}:</span>{" "}
                    <strong>
                      {price.toLocaleString(locale, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}{" "}
                      €
                    </strong>
                  </div>
                </header>

                {description && (
                  <div className="product__detail-desc mb-20">
                    <p>{description}</p>
                  </div>
                )}

                {/* Specs */}
                {!!specsEntries.length && (
                  <div className="product__detail-specs mb-25">
                    <h3 className="product__detail-subtitle mb-10">
                      {specsTitle}
                    </h3>
                    <ul className="product__spec-list">
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

export default ProductDetail;
