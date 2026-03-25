"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import { useProduct, useProducts } from "@/features/products/products.action";
import type { Product, ProductItemType } from "@/features/products/products.type";
import SocialShare from "@/components/containers/custom-pages/SocialShare";
import OfferForm from "@/components/containers/offer/OfferForm";
import Banner from "@/components/layout/banner/Banner";
import { resolveMediaUrl } from "@/lib/media";

function cleanContentHtml(html: string | null | undefined): string {
  if (!html) return "";
  // Keep images and their styles, only drop the first H1 (already shown as page title)
  const dropFirstH1 = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
  return dropFirstH1.trim();
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match?.[1] || null;
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

  // Combine main image + gallery images (must be before early returns)
  const allImages = useMemo(() => {
    if (!item) return [];
    const imgs: string[] = [];
    if (item.image_url) imgs.push(item.image_url);
    if (item.images?.length) {
      for (const img of item.images) {
        if (img && !imgs.includes(img)) imgs.push(img);
      }
    }
    if (item.product_images?.length) {
      for (const pi of item.product_images) {
        if (pi.image_url && pi.is_active && !imgs.includes(pi.image_url)) imgs.push(pi.image_url);
      }
    }
    return imgs;
  }, [item]);

  const [activeImg, setActiveImg] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  const prevLightbox = useCallback(() => {
    setActiveImg((i) => (i - 1 + (allImages.length || 1)) % (allImages.length || 1));
  }, [allImages.length]);

  const nextLightbox = useCallback(() => {
    setActiveImg((i) => (i + 1) % (allImages.length || 1));
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prevLightbox, nextLightbox]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

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
  const specEntries = Object.entries(item.specifications || {}).filter(([k]) => k !== "youtube_url");
  const youtubeUrl = item.specifications?.youtube_url || "";
  const youtubeId = youtubeUrl ? getYoutubeId(youtubeUrl) : null;

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

                {allImages.length > 0 && (
                  <div className="technical__thumb mb-40">
                    <div
                      onClick={openLightbox}
                      style={{ cursor: "zoom-in" }}
                    >
                      <Image
                        src={resolveMediaUrl(allImages[activeImg] || allImages[0])}
                        alt={item.alt || item.title}
                        width={1200}
                        height={600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
                        style={{ borderRadius: "20px", objectFit: "cover", width: "100%", height: "auto" }}
                        priority
                      />
                    </div>
                    {allImages.length > 1 && (
                      <div className="d-flex gap-2 mt-15 flex-wrap">
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImg(idx)}
                            style={{
                              border: idx === activeImg ? "2px solid var(--clr-theme-1)" : "2px solid #eee",
                              borderRadius: "8px",
                              overflow: "hidden",
                              width: "80px",
                              height: "60px",
                              padding: 0,
                              cursor: "pointer",
                              background: "none",
                              position: "relative",
                            }}
                          >
                            <Image src={resolveMediaUrl(img)} alt="" fill sizes="80px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Lightbox Modal */}
                {lightboxOpen && allImages.length > 0 && (
                  <div
                    onClick={closeLightbox}
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 99999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.85)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: "relative", maxWidth: "1100px", width: "100%", margin: "0 1rem" }}
                    >
                      {/* Close button */}
                      <button
                        type="button"
                        onClick={closeLightbox}
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          zIndex: 100000,
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "22px",
                        }}
                        aria-label="Close"
                      >
                        ✕
                      </button>

                      {/* Image */}
                      <div style={{ borderRadius: "16px", overflow: "hidden", background: "#000" }}>
                        <Image
                          src={resolveMediaUrl(allImages[activeImg])}
                          alt={item.alt || item.title}
                          width={1200}
                          height={900}
                          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
                        />
                      </div>

                      {/* Counter */}
                      <p style={{ marginTop: "8px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                        {activeImg + 1} / {allImages.length}
                      </p>

                      {/* Prev / Next */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={prevLightbox}
                            style={{
                              position: "absolute",
                              left: "8px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "44px",
                              height: "44px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            aria-label="Previous"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={nextLightbox}
                            style={{
                              position: "absolute",
                              right: "8px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "44px",
                              height: "44px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            aria-label="Next"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {youtubeId && (
                  <div className="mb-40" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "12px", border: 0 }}
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
