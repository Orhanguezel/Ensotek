"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CustomPage } from "@/features/custom-pages/customPages.type";
import SocialShare from "./SocialShare";
import { useTranslations } from "next-intl";

interface MissionVisionContentProps {
  mission: CustomPage | null;
  vision: CustomPage | null;
  title: string;
}

function cleanContentHtml(html: string): string {
  if (!html) return '';
  const noClass = html.replace(/\sclass="[^"]*"/gi, '');
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, '');
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  return dropFirstH1.trim();
}

const MissionVisionContent = ({ mission, vision, title }: MissionVisionContentProps) => {
  const t = useTranslations("ensotek.customPage");
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const renderSection = (item: CustomPage | null, label: string) => {
    if (!item) return null;

    let htmlContent = item.content;
    try {
      const parsed = JSON.parse(item.content);
      if (parsed.html) htmlContent = parsed.html;
    } catch (e) {
      // Not JSON
    }

    const cleanHtml = cleanContentHtml(htmlContent);

    return (
      <div className="technical__main-wrapper mb-60" key={item.id}>
        <div className="technical__content mb-25">
          <div className="technical__title">
            <h2 className="postbox__title" style={{ fontSize: '36px', fontWeight: '700', lineHeight: '1.2' }}>{item.title}</h2>
          </div>
          
          {item.summary && (
            <p className="postbox__lead" style={{ fontSize: '18px', lineHeight: '1.6', color: '#555', fontStyle: 'italic', marginBottom: '30px' }}>
              {item.summary}
            </p>
          )}

          {(item.image_url || item.featured_image) && (
            <div className="technical__thumb mb-40">
              <Image 
                src={item.image_url || item.featured_image || ""} 
                alt={item.title} 
                width={1200} 
                height={500} 
                layout="responsive"
                style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }}
              />
            </div>
          )}
        </div>

        <div className="technical__content">
          <div 
            className="tp-postbox-details"
            style={{ fontSize: '16px', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: cleanHtml }} 
          />
        </div>
      </div>
    );
  };

  return (
    <section className="technical__area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-12">
            <div className="section__title-wrapper mb-50">
              <h2 className="section__title-3">{title}</h2>
            </div>
            {mission ? renderSection(mission, "Mission") : null}
            {vision ? renderSection(vision, "Vision") : null}
            {!mission && !vision && (
              <div className="text-center py-5">
                <p>{t("noItems")}</p>
              </div>
            )}
          </div>

          <div className="col-xl-4 col-lg-6">
            <div className="sideber__widget">
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__category">
                  <div className="sidebar__contact-title mb-30">
                    <h3>{t("share")}</h3>
                  </div>
                  <SocialShare url={currentUrl} title={mission?.title || title} />
                </div>
              </div>

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

export default MissionVisionContent;
