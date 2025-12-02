// =============================================================
// FILE: src/components/containers/sparepart/SparepartPageContent.tsx
// Ensotek – Full Spareparts Page Content
//   - Tüm yedek parçaların grid listesi
//   - Data: products (category: sparepart)
//   - i18n: site_settings.ui_spareparts
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

import FallbackCover from "public/img/blog/3/1.jpg";

const CARD_W = 720;
const CARD_H = 480;
const PAGE_LIMIT = 12;

const SPAREPART_ROOT_CATEGORY_ID =
  "aaaa1001-1111-4111-8111-aaaaaaaa1001";

const SparepartPageContent: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_spareparts", locale);

  const sectionSubtitlePrefix = ui(
    "ui_spareparts_kicker_prefix",
    "Ensotek",
  );
  const sectionSubtitleLabel = ui(
    "ui_spareparts_kicker_label",
    locale === "tr" ? "Yedek Parçalar" : "Spare Parts",
  );
  const sectionTitle = ui(
    "ui_spareparts_page_title",
    locale === "tr" ? "Yedek Parçalar" : "Spare Parts",
  );
  const sectionIntro = ui(
    "ui_spareparts_page_intro",
    locale === "tr"
      ? "Su soğutma kuleleri ve sistemleri için yedek parça ve sarf malzemeleri."
      : "Spare parts and consumables for cooling towers and related systems.",
  );
  const readMore = ui(
    "ui_spareparts_read_more",
    locale === "tr" ? "Detayları görüntüle" : "View details",
  );
  const readMoreAria = ui(
    "ui_spareparts_read_more_aria",
    locale === "tr"
      ? "yedek parça detayını görüntüle"
      : "view spare part details",
  );
  const priceLabel = ui(
    "ui_spareparts_price_label",
    locale === "tr" ? "Başlangıç fiyatı" : "Starting from",
  );
  const emptyText = ui(
    "ui_spareparts_empty",
    locale === "tr"
      ? "Şu anda görüntülenecek yedek parça bulunmamaktadır."
      : "There are no spare parts to display at the moment.",
  );

  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale,
    limit: PAGE_LIMIT,
    category_id: SPAREPART_ROOT_CATEGORY_ID,
  });

  const items = useMemo(() => {
    const list: ProductDto[] = data ?? [];

    return list.map((p) => {
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
                      style={{ marginTop: 6, marginBottom: 10 }}
                    >
                      {priceLabel}:{" "}
                      <strong>
                        {p.price.toLocaleString(locale, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}{" "}
                        €
                      </strong>
                    </p>
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

export default SparepartPageContent;
