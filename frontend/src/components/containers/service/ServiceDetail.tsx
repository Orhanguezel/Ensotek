"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Service } from "@/features/services/services.type";
import SocialShare from "../custom-pages/SocialShare";
import PageReaction from "../custom-pages/PageReaction";
import PageComments from "../custom-pages/PageComments";
import { useTranslations } from "next-intl";
import { useServices } from "@/features/services/services.action";

interface ServiceDetailProps {
  item: Service;
}

/**
 * HTML cleaning for service description
 */
function cleanContentHtml(html: string): string {
  if (!html) return '';
  const noClass = html.replace(/\sclass="[^"]*"/gi, '');
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, '');
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  return dropFirstH1.trim();
}

const ServiceDetail = ({ item }: ServiceDetailProps) => {
  const t = useTranslations("ensotek.customPage");
  
  // Fetch related services
  const { data: relatedData } = useServices({ limit: 6 });
  const relatedItems = (relatedData || [])
    .filter((x: any) => x.id !== item.id)
    .slice(0, 5);

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
                    <Link href="/service" className="text-primary font-weight-bold">
                        <i className="fa-light fa-arrow-left-long mr-10"></i>
                        {t("backToList", { module: t("moduleNames.services") })}
                    </Link>
                </div>

                {/* Featured Image */}
                {(item.image_url || item.featured_image) && (
                  <div className="technical__thumb mb-40">
                    <Image 
                        src={item.image_url || item.featured_image || ""} 
                        alt={item.name} 
                        width={1200} 
                        height={600} 
                        layout="responsive"
                        priority
                        style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                    />
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
                                    <span>{item.type || t("service")}</span>
                                </div>
                            </div>
                            <PageReaction pageId={item.id} />
                            
                            <div className="mt-30">
                                <Link 
                                    href={`/offer?type=service&id=${item.id}`} 
                                    className="border__btn w-100 text-center"
                                    style={{ 
                                        backgroundColor: 'var(--clr-theme-1)', 
                                        color: 'white', 
                                        borderColor: 'var(--clr-theme-1)',
                                        display: 'block'
                                    }}
                                >
                                    {useTranslations("ensotek.offer")("getOffer")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Image Placeholder */}
                <div className="sideber__widget-item">
                    <div className="slideber__thumb w-img" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <Image 
                            src="/img/others/sidebar.jpg" 
                            alt={t("sidebarAlt")} 
                            width={400} 
                            height={500}
                        />
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
