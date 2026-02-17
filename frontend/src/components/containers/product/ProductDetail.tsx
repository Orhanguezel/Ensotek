"use client";

import React, { useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import { useProduct, useProducts } from "@/features/products/products.action";
import type { Product, ProductItemType } from "@/features/products/products.type";
import SocialShare from "@/components/containers/custom-pages/SocialShare";
import OfferForm from "@/components/containers/offer/OfferForm";
import Banner from "@/components/layout/banner/Banner";

function cleanContentHtml(html: string | null | undefined): string {
  if (!html) return "";
  const noClass = html.replace(/\sclass="[^"]*"/gi, "");
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, "");
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
  return dropFirstH1.trim();
}

type ProductDetailProps = {
  slug: string;
  itemType: ProductItemType;
  basePath: "/product" | "/sparepart";
};

const ProductDetail = ({ slug, itemType, basePath }: ProductDetailProps) => {
  const t = useTranslations("ensotek.products");
  const locale = useLocale();

  const { data: item, isLoading, isError } = useProduct(slug, {
    locale,
    item_type: itemType,
  });

  const { data: relatedData } = useProducts({
    item_type: itemType,
    is_active: true,
    limit: 8,
    locale,
  });

  const relatedItems = useMemo(() => {
    const list = relatedData?.data || [];
    return list.filter((x) => x.id !== item?.id).slice(0, 5);
  }, [relatedData, item?.id]);

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <h2>{t("notFoundTitle")}</h2>
        <p className="mb-4">{t("notFoundDescription")}</p>
        <Link href={basePath} className="btn btn-primary">
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const html = cleanContentHtml(item.description);
  const specEntries = Object.entries(item.specifications || {});

  return (
    <>
      <Banner title={item.title} />
      <section className="technical__area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-12">
              <div className="technical__main-wrapper mb-60">
                <div className="mb-35">
                  <Link href={basePath} className="text-primary font-weight-bold">
                    <i className="fa-light fa-arrow-left-long mr-10"></i>
                    {t("backToList")}
                  </Link>
                </div>

                {item.image_url && (
                  <div className="technical__thumb mb-40">
                    <img
                      src={item.image_url}
                      alt={item.alt || item.title}
                      width={1200}
                      height={600}
                      style={{ borderRadius: "20px", objectFit: "cover" }}
                      loading="eager"
                    />
                  </div>
                )}

                <div className="technical__content mb-25">
                  <div className="technical__title">
                    <h1 className="postbox__title">{item.title}</h1>
                  </div>
                </div>

                {html ? (
                  <div
                    className="tp-postbox-details"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ) : null}

                {specEntries.length > 0 && (
                  <div className="sidebar__contact mt-50">
                    <div className="sidebar__contact-title mb-30">
                      <h3>{t("specifications")}</h3>
                    </div>
                    <div className="sidebar__contact-inner">
                      {specEntries.map(([key, value]) => (
                        <div key={key} className="sidebar__contact-item">
                          <div className="sideber__contact-icon">
                            <i className="fa-light fa-circle-dot"></i>
                          </div>
                          <div className="sideber__contact-text">
                            <span>
                              <strong>{key}:</strong> {String(value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.tags.length > 0 && (
                  <div className="postbox__tag-wrapper mt-50 pt-30 border-top">
                    <span className="postbox__tag-title mr-15">{t("tags")}: </span>
                    <div className="postbox__tag">
                      {item.tags.map((tag) => (
                        <Link key={tag} href="#">
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-xl-4 col-lg-6">
              <div className="sideber__widget">
                {relatedItems.length > 0 && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__category">
                      <div className="sidebar__contact-title mb-30">
                        <h3>{t("otherItems")}</h3>
                      </div>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {relatedItems.map((rel: Product) => (
                          <li key={rel.id} style={{ borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                            <Link href={`${basePath}/${rel.slug}`} style={{ fontWeight: "500", fontSize: "15px" }}>
                              {rel.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-30">
                      <h3>{t("share")}</h3>
                    </div>
                    <SocialShare url={currentUrl} title={item.title} />
                  </div>
                </div>

                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__contact">
                    <div className="sidebar__contact-title mb-30">
                      <h3>{t("info")}</h3>
                    </div>
                    <div className="sidebar__contact-inner">
                      {item.product_code && (
                        <div className="sidebar__contact-item">
                          <div className="sideber__contact-icon">
                            <i className="fa-light fa-hashtag"></i>
                          </div>
                          <div className="sideber__contact-text">
                            <span>{t("productCode")}: {item.product_code}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact__area pb-120">
        <div className="container">
          <OfferForm productId={item.id} productName={item.title} />
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
