"use client";
import React from "react";
import Image from "next/image";
import { CustomPage } from "@/features/custom-pages/customPages.type";
import SocialShare from "./SocialShare";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { resolveMediaUrl } from "@/lib/media";

interface QualityDetailContentProps {
  items: CustomPage[];
  ui: any; // data from site_settings (ui_quality)
}

const QualityDetailContent = ({ items, ui }: QualityDetailContentProps) => {
  const t = useTranslations("ensotek.customPage");
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // The first item in items should be our main quality page data (containing images)
  const mainPage = items[0];
  
  // Resolve featured image URL
  const featuredImageUrl = resolveMediaUrl(mainPage?.image_url);
  
  // Gallery images handling
  const galleryImages = mainPage?.images || [];
  
  // Logic: In our system, the first image in the 'images' array is often the same as the 'featured_image'.
  // However, we should be careful not to hide valid certificates.
  // We'll show all images unless they exactly match the featured image after resolution.
  const certificates = galleryImages.map(img => resolveMediaUrl(img)).filter(url => url && url !== featuredImageUrl);
  
  // If after filtering we have no certificates but we have gallery images, 
  // and the featured image is NOT a certificate, maybe we shouldn't have filtered.
  // But usually, it's safer to just show everything if filtering leaves us empty.
  const displayCertificates = certificates.length > 0 ? certificates : (galleryImages.length > 1 ? galleryImages.slice(1).map(img => resolveMediaUrl(img)) : []);

  return (
    <section className="technical__area pt-80 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-12">
            <div className="technical__main-wrapper">
              {/* Introduction Section */}
              <div className="technical__content mb-50">
                <div className="technical__title">
                  <h2 className="postbox__title mb-20" style={{ fontSize: '36px', fontWeight: '700' }}>
                    {ui?.ui_quality_intro_title || "Our Quality Certificates & Standards"}
                  </h2>
                </div>
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444' }}>
                  {ui?.ui_quality_intro_text}
                </p>
              </div>

              {/* Main Featured Image */}
              {featuredImageUrl && (
                <div className="technical__thumb mb-60">
                  <Image 
                    src={featuredImageUrl} 
                    alt={mainPage?.title || "Quality"} 
                    width={1200} 
                    height={600} 
                    layout="responsive"
                    style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Standards Section */}
              <div className="technical__content mb-50">
                <h3 className="mb-20" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {ui?.ui_quality_standards_title || "Our Standards"}
                </h3>
                <p className="mb-30" style={{ fontSize: '17px', fontWeight: '500', color: '#555' }}>
                  {ui?.ui_quality_standards_lead}
                </p>
                
                <div className="standards-list">
                  {Array.from({ length: Number(ui?.ui_quality_std_item_count || 0) }).map((_, i) => {
                    const idx = i + 1;
                    const strong = ui?.[`ui_quality_std_item_${idx}_strong` as keyof any];
                    const text = ui?.[`ui_quality_std_item_${idx}_text` as keyof any];
                    if (!strong && !text) return null;
                    return (
                      <div key={i} className="standard-item mb-15 d-flex align-items-start">
                        <i className="fa-solid fa-circle-check text-primary mt-1 mr-15"></i>
                        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          {strong && <strong>{strong}: </strong>}
                          {text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Commitment Section */}
              <div className="technical__content mb-60">
                <h3 className="mb-20" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {ui?.ui_quality_commitment_title || "Our Quality Commitment"}
                </h3>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
                  {ui?.ui_quality_commitment_text}
                </p>
              </div>

              {/* Certificates Gallery */}
              <div className="technical__content">
                <div className="section__title-wrapper mb-30">
                  <span className="section__subtitle-3">{ui?.ui_quality_certificates_kicker || "Documents"}</span>
                  <h3 className="section__title-3" style={{ fontSize: '32px' }}>{ui?.ui_quality_certificates_heading || "Our Certificates"}</h3>
                  {ui?.ui_quality_certificates_desc && (
                    <p className="mt-10">{ui.ui_quality_certificates_desc}</p>
                  )}
                </div>

                <div className="row">
                  {displayCertificates.length > 0 ? (
                    displayCertificates.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="col-md-4 col-sm-6 mb-30">
                        <div className="certificate-card p-3 bg-white text-center" style={{ 
                          borderRadius: '12px', 
                          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div className="cert-img-wrapper mb-20" style={{ cursor: 'pointer' }} onClick={() => window.open(imgUrl, '_blank')}>
                            {/* Using standard img tag to troubleshoot Next.js Image domain/loader issues */}
                            <img 
                              src={imgUrl} 
                              alt={`${ui?.ui_quality_certificate_label || 'Certificate'} ${idx+1}`}
                              style={{ 
                                borderRadius: '8px', 
                                objectFit: 'contain', 
                                width: '100%', 
                                height: 'auto',
                                maxHeight: '420px',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div className="cert-info">
                            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
                              {ui?.ui_quality_certificate_label || "Certificate"} {idx + 1}
                            </h4>
                            <a href={imgUrl} target="_blank" className="tp-btn TP-btn-sm w-100 text-center" rel="noreferrer" style={{ padding: '8px', fontSize: '14px' }}>
                              {ui?.ui_quality_certificate_open || "Open"}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <p className="text-muted">{ui?.ui_quality_no_certificates || "No certificate images found."}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-12">
            <div className="sideber__widget sticky-top" style={{ top: '100px' }}>
              {/* Quality Metrics Sidebar Widget */}
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__contact">
                  <div className="sidebar__contact-title mb-30 text-center">
                    <h3 style={{ fontSize: '24px' }}>{ui?.ui_quality_metrics_title || "Quality Metrics"}</h3>
                  </div>
                  <div className="quality-metrics-list">
                    {Array.from({ length: Number(ui?.ui_quality_metric_count || 0) }).map((_, i) => {
                       const idx = i + 1;
                       const mTitle = ui?.[`ui_quality_metric_${idx}_title` as keyof any];
                       const mValue = ui?.[`ui_quality_metric_${idx}_value` as keyof any];
                       const mDesc = ui?.[`ui_quality_metric_${idx}_desc` as keyof any];
                       if (!mTitle) return null;
                       return (
                         <div key={i} className="metric-item mb-25 text-center p-3" style={{ background: '#f8f9fa', borderRadius: '12px' }}>
                           <h4 className="text-primary mb-5" style={{ fontSize: '28px', fontWeight: '800' }}>{mValue}</h4>
                           <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#00264d' }}>{mTitle}</h5>
                           <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>{mDesc}</p>
                         </div>
                       );
                    })}
                  </div>
                </div>
              </div>

              {/* Share Widget */}
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__category">
                  <div className="sidebar__contact-title mb-30">
                    <h3>{t("share")}</h3>
                  </div>
                  <SocialShare url={currentUrl} title={ui?.ui_quality_intro_title || "Quality"} />
                </div>
              </div>

              {/* Contact Info Widget */}
              <div className="sideber__widget-item">
                <div className="sidebar__contact p-4" style={{ background: '#00264d', color: '#fff', borderRadius: '15px' }}>
                  <h3 className="mb-15" style={{ color: '#fff', fontSize: '22px' }}>{ui?.ui_quality_info_title || "Contact Information"}</h3>
                  <p className="mb-25" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                    {ui?.ui_quality_info_desc}
                  </p>
                  <div className="sidebar__contact-info">
                    <div className="d-flex align-items-center mb-15">
                      <div className="icon mr-15" style={{ fontSize: '20px', color: '#fff' }}>
                        <i className="fa-light fa-phone"></i>
                      </div>
                      <div className="text">
                        <span style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{ui?.ui_phone || "Phone"}</span>
                        <a href="tel:+902165181818" style={{ color: '#fff', fontWeight: '600' }}>+90 (216) 518 18 18</a>
                      </div>
                    </div>
                    <Link href="/contact" className="tp-btn w-100 text-center" style={{ padding: '12px', fontSize: '14px' }}>
                      {ui?.ui_contact_form || "Contact Form"}
                    </Link>
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

export default QualityDetailContent;
