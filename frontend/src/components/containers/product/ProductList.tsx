"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useProducts } from "@/features/products/products.action";
import type { ProductItemType } from "@/features/products/products.type";

import FallbackCover from "public/img/recent/slider/1.png";

type ProductListProps = {
  itemType: ProductItemType;
  basePath: "/product" | "/sparepart";
};

const ProductList = ({ itemType, basePath }: ProductListProps) => {
  const t = useTranslations("ensotek.products");
  const locale = useLocale();
  const isSparePart = itemType === "sparepart";

  const { data, isLoading } = useProducts({
    item_type: itemType,
    is_active: true,
    limit: 120,
    locale,
  });

  const items = data?.data || [];
  const fallbackSrc = FallbackCover.src;

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="service__list-area pt-120 pb-90">
      <div className="container">
        <div className="section__title-wrapper mb-60 text-center">
          <h2 className="section__title-3">
            {isSparePart ? t("spareListTitle") : t("listTitle")}
          </h2>
          <p>{isSparePart ? t("spareListDescription") : t("listDescription")}</p>
        </div>
        <div className="row">
          {items.map((item) => (
            <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
              <div className="blog__item-3 mb-30 p-relative fix">
                <div className="blog__thumb-3 w-img">
                  <Link href={`${basePath}/${item.slug}`}>
                    <img
                      src={item.image_url || fallbackSrc}
                      alt={item.alt || item.title}
                      width={400}
                      height={250}
                      style={{ objectFit: "cover", height: "250px", width: "100%" }}
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="blog__content-3 p-4 bg-white">
                  <h3 className="blog__title-3">
                    <Link href={`${basePath}/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="text-muted">
                    {(item.description || "")
                      .replace(/<[^>]*>/g, "")
                      .slice(0, 150)}
                  </p>
                  <Link href={`${basePath}/${item.slug}`} className="read-more-btn">
                    {t("readMore")} <i className="fal fa-arrow-right ml-5"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {!items.length && (
            <div className="col-12 text-center py-5">
              <p>{isSparePart ? t("spareEmpty") : t("empty")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
