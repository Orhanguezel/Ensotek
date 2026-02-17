"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CustomPage } from "@/features/custom-pages/customPages.type";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import SocialShare from "./SocialShare";
import PageComments from "./PageComments";
import PageReaction from "./PageReaction";

import { useTranslations } from "next-intl";

interface PageDetailProps {
  item: CustomPage;
}

/**
 * Netlestirilmis HTML temizleme:
 * - class ve style attr'lari temizlenir (backend'den gelen tailwind vb. cakismasin diye)
 * - Ilk h1 silinir (sayfa basligi zaten bilesen tarafindan basiliyor)
 */
function cleanContentHtml(html: string): string {
  if (!html) return '';
  const noClass = html.replace(/\sclass="[^"]*"/gi, '');
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, '');
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  return dropFirstH1.trim();
}

const PageDetail = ({ item }: PageDetailProps) => {
  const t = useTranslations("ensotek.customPage");
  const moduleRoutes: Record<string, string> = {
    blog: "blog",
    news: "news",
    solutions: "solutions",
    about: "about",
    missionVision: "mission-vision",
    mission: "mission-vision",
    vision: "mission-vision",
    quality: "quality",
    team: "team",
    services: "service",
  };
  const moduleLabels: Record<string, string> = {
    blog: t("moduleNames.blog"),
    news: t("moduleNames.news"),
    solutions: t("moduleNames.solutions"),
    about: t("moduleNames.about"),
    missionVision: t("moduleNames.missionVision"),
    mission: t("moduleNames.missionVision"),
    vision: t("moduleNames.missionVision"),
    quality: t("moduleNames.quality"),
    team: t("moduleNames.team"),
    services: t("moduleNames.services"),
  };
  const moduleRoute = moduleRoutes[item.module_key] || item.module_key;
  const moduleLabel =
    moduleLabels[item.module_key] || item.module_key;
  
  // Related items fetch
  const { data: relatedData } = useCustomPages({ 
    module_key: item.module_key, 
    limit: 6,
    is_published: true 
  });
  
  const relatedItems = (relatedData?.data || [])
    .filter((x: any) => x.id !== item.id)
    .slice(0, 5);

  let htmlContent = item.content;
  try {
    const parsed = JSON.parse(item.content);
    if (parsed.html) htmlContent = parsed.html;
  } catch (e) {
    // Not JSON
  }

  const cleanHtml = cleanContentHtml(htmlContent);
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
                    <Link href={`/${moduleRoute}`} className="text-primary font-weight-bold">
                        <i className="fa-light fa-arrow-left-long mr-10"></i>
                        {t("backToList", { module: moduleLabel })}
                    </Link>
                </div>

                {/* Featured Image */}
                {(item.image_url || item.featured_image) && (
                  <div className="technical__thumb mb-40">
                    <Image 
                        src={item.image_url || item.featured_image || ""} 
                        alt={item.title} 
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
                                <h1 className="postbox__title" style={{ fontSize: '42px', fontWeight: '700', lineHeight: '1.2' }}>{item.title}</h1>
                            </div>
                            
                            {item.summary && (
                                <p className="postbox__lead" style={{ fontSize: '20px', lineHeight: '1.6', color: '#555', fontStyle: 'italic', marginBottom: '30px' }}>
                                    {item.summary}
                                </p>
                            )}

                            <div className="interaction-bar mb-30 pb-20 border-bottom d-flex align-items-center justify-content-between">
                                <PageReaction pageId={item.id} />
                                {![
                                  "about",
                                  "quality",
                                  "mission",
                                  "vision",
                                  "missionVision",
                                  "services",
                                  "blog",
                                  "news",
                                  "solutions",
                                  "team",
                                ].includes(item.module_key) && (
                                  <div className="meta-right">
                                    <span className="text-muted">
                                      <i className="fal fa-calendar-alt mr-5"></i>
                                      {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                            </div>
                        </div>

                        <div className="technical__content">
                            <div 
                                className="tp-postbox-details"
                                dangerouslySetInnerHTML={{ __html: cleanHtml }} 
                            />
                        </div>

                        {/* Gallery Images */}
                        {item.images && item.images.length > 0 && (
                            <div className="technical__gallery mt-45">
                                <div className="row">
                                    {item.images.map((img, idx) => (
                                        <div key={idx} className="col-xl-4 col-lg-4 col-md-6 mb-30">
                                            <div className="technical__gallery-item" style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                                <Image 
                                                    src={img} 
                                                    alt={`${item.title} gallery ${idx + 1}`} 
                                                    width={400} 
                                                    height={300}
                                                    layout="responsive"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                            <PageComments targetType="custom_page" targetId={item.id} />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-xl-4 col-lg-6">
            <div className="sideber__widget">
                {/* Related Items */}
                {relatedItems.length > 0 && (
                    <div className="sideber__widget-item mb-40">
                        <div className="sidebar__category">
                            <div className="sidebar__contact-title mb-30">
                                <h3>{t("relatedTitle", { module: moduleLabel })}</h3>
                            </div>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {relatedItems.map((rel: any) => (
                                    <li key={rel.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                                        <Link href={`/${moduleRoute}/${rel.slug}`} style={{ fontWeight: '500', fontSize: '15px' }}>
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
                            <h3>{t("information")}</h3>
                        </div>
                        <div className="sidebar__contact-inner">
                            <div className="sidebar__contact-item">
                                <div className="sideber__contact-icon">
                                    <i className="fa-light fa-info"></i>
                                </div>
                                <div className="sideber__contact-text">
                                    <span>{item.category_name || t("general")}</span>
                                </div>
                            </div>
                            {![
                              "about",
                              "quality",
                              "mission",
                              "vision",
                              "missionVision",
                              "services",
                              "blog",
                              "news",
                              "solutions",
                              "team",
                            ].includes(item.module_key) && (
                              <div className="sidebar__contact-item">
                                <div className="sideber__contact-icon">
                                  <i className="fa-light fa-calendar"></i>
                                </div>
                                <div className="sideber__contact-text">
                                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            )}
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

export default PageDetail;
