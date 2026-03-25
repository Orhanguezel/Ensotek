"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Service } from "@/features/services/services.type";
import SocialShare from "../custom-pages/SocialShare";
import PageReaction from "../custom-pages/PageReaction";
import PageComments from "../custom-pages/PageComments";
import { useTranslations } from "next-intl";
import { useServices } from "@/features/services/services.action";
import { resolveMediaUrl } from "@/lib/media";

interface ServiceDetailProps {
  item: Service;
}

function cleanContentHtml(html: string): string {
  if (!html) return '';
  const dropFirstH1 = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  return dropFirstH1.trim();
}

const ServiceDetail = ({ item }: ServiceDetailProps) => {
  const t = useTranslations("ensotek.customPage");
  const ts = useTranslations("ensotek.staticPages");
  const tOffer = useTranslations("ensotek.offer");

  // Fetch related services
  const m = useServices({ limit: 6 });
  const relatedData = m.data;
  const relatedItems = (relatedData || [])
    .filter((x: any) => x.id !== item.id)
    .slice(0, 5);

  // Build gallery: cover image + images array
  const allImages = React.useMemo(() => {
    const imgs: string[] = [];
    const cover = item.image_url || item.featured_image;
    if (cover) imgs.push(cover);
    if (Array.isArray(item.images)) {
      for (const img of item.images) {
        const url = typeof img === 'string' ? img : (img as any)?.image_url;
        if (url && !imgs.includes(url)) imgs.push(url);
      }
    }
    return imgs;
  }, [item]);

  const [activeImg, setActiveImg] = useState(0);
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

  const cleanHtml = cleanContentHtml(item.description || "");
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <section className="technical__area pt-120 pb-120">
      <div className="container">
        <div className="row">
          {/* MAIN CONTENT */}
          <div className="col-xl-8 col-lg-12">
            <div className="technical__main-wrapper mb-60">
                {/* Back Link */}
                <div className="mb-35">
                    <Link href="/service" className="text-primary font-weight-bold" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <i className="fa-light fa-arrow-left-long mr-10"></i>
                        {t("backToList", { module: t("moduleNames.services") })}
                    </Link>
                </div>

                {/* Gallery */}
                {allImages.length > 0 && (
                  <div className="technical__thumb mb-40">
                    {/* Main Image */}
                    <div onClick={openLightbox} style={{ cursor: "zoom-in" }}>
                      <Image
                        src={resolveMediaUrl(allImages[activeImg])}
                        alt={item.image_alt || item.name}
                        width={1200}
                        height={600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
                        style={{
                          borderRadius: '20px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                          width: '100%',
                          height: 'auto',
                          objectFit: 'cover',
                          maxHeight: '600px'
                        }}
                        priority
                      />
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {allImages.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImg(i)}
                            style={{
                              flexShrink: 0,
                              width: '80px',
                              height: '80px',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: i === activeImg ? '3px solid var(--clr-theme-1, #0d6efd)' : '2px solid #e5e7eb',
                              cursor: 'pointer',
                              padding: 0,
                              background: '#f8f9fa',
                              position: 'relative',
                              transition: 'border-color 0.2s',
                            }}
                          >
                            <Image
                              src={resolveMediaUrl(img)}
                              alt={`${item.name} ${i + 1}`}
                              fill
                              sizes="80px"
                              style={{ objectFit: 'cover' }}
                            />
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
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.85)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: "relative", maxWidth: "90vw", width: "1100px" }}
                    >
                      <button
                        type="button"
                        onClick={closeLightbox}
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          zIndex: 60,
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.2)",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        &times;
                      </button>

                      <Image
                        src={resolveMediaUrl(allImages[activeImg])}
                        alt={item.name}
                        width={1200}
                        height={900}
                        style={{
                          width: "100%",
                          maxHeight: "80vh",
                          objectFit: "contain",
                          borderRadius: "16px",
                        }}
                      />

                      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "8px" }}>
                        {activeImg + 1} / {allImages.length}
                      </p>

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
                              borderRadius: "50%",
                              background: "rgba(0,0,0,0.4)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            &#8249;
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
                              borderRadius: "50%",
                              background: "rgba(0,0,0,0.4)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            &#8250;
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Box */}
                <div className="blog__content-wrapper" style={{ border: 'none', padding: '0' }}>
                    <div className="blog__content-item" style={{ border: 'none', margin: 0, padding: 0 }}>
                        <div className="technical__content mb-25">
                            <div className="technical__title">
                                <h1 className="postbox__title" style={{ fontSize: '42px', fontWeight: '700', lineHeight: '1.2' }}>{item.name}</h1>
                            </div>
                        </div>

                        <div className="technical__content">
                            <div
                                className="tp-postbox-details"
                                dangerouslySetInnerHTML={{ __html: cleanHtml }}
                            />
                        </div>

                        {item.tags && (
                            <div className="postbox__tag-wrapper mt-50 pt-30 border-top">
                                <span className="postbox__tag-title mr-15">{t("tags")?.toUpperCase() || "TAGS"}: </span>
                                <div className="postbox__tag">
                                    {item.tags.split(',').map((tag, i) => (
                                    <Link key={i} href="#">
                                        #{tag.trim()}
                                    </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-60">
                            <PageComments targetType="service" targetId={item.id} />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-xl-4 col-lg-6">
            <div className="sideber__widget">
                {/* Related Services */}
                {relatedItems.length > 0 && (
                    <div className="sideber__widget-item mb-40">
                        <div className="sidebar__category">
                            <div className="sidebar__contact-title mb-30">
                                <h3>{t("otherServices")}</h3>
                            </div>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {relatedItems.map((rel: any) => (
                                    <li key={rel.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                                        <Link href={`/service/${rel.slug}`} style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {rel.name}
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
                        <SocialShare url={currentUrl} title={item.name} />
                    </div>
                </div>

                <div className="sideber__widget-item mb-40">
                    <div className="sidebar__contact">
                        <div className="sidebar__contact-title mb-30">
                            <h3>{t("serviceInfo")}</h3>
                        </div>
                        <div className="sidebar__contact-inner">
                             <div className="sidebar__contact-item">
                                <div className="sideber__contact-icon">
                                    <i className="fa-light fa-gear"></i>
                                </div>
                                <div className="sideber__contact-text">
                                    <span>{item.type ? (ts.has(item.type) ? ts(item.type) : item.type.replace(/_/g, ' ')) : t("service")}</span>
                                </div>
                            </div>
                            <PageReaction pageId={item.id} />

                            <div className="mt-30">
                                <Link
                                    href={`/offer?type=service&id=${item.id}`}
                                    className="border__btn w-100 text-center"
                                    title={tOffer("getOffer")}
                                    style={{
                                        backgroundColor: 'var(--clr-theme-1)',
                                        color: 'white',
                                        borderColor: 'var(--clr-theme-1)',
                                        display: 'block'
                                    }}
                                >
                                    {tOffer("getOffer")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetail;
