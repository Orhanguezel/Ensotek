"use client";
import React from "react";
import PageDetail from "./PageDetail";
import { useCustomPageBySlug } from "@/features/custom-pages/customPages.action";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Banner from "@/components/layout/banner/Banner";

interface PageSwitchProps {
  slug: string;
}

const PageSwitch = ({ slug }: PageSwitchProps) => {
  const t = useTranslations("ensotek.customPage");
  const { data: item, isLoading, error } = useCustomPageBySlug(slug);

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <h2>{t("pageNotFound")}</h2>
        <Link href="/" className="mt-4 btn btn-primary">{t("returnHome")}</Link>
      </div>
    );
  }

  const pageContent = item.module_key === "team" ? <TeamDetail item={item} /> : <PageDetail item={item} />;

  return (
    <>
      <Banner title={item.title || t("pageDetailTitle")} />
      {pageContent}
    </>
  );
};

const TeamDetail = ({ item }: { item: any }) => {
    const t = useTranslations("ensotek.customPage");

    const cleanContentHtml = (html: string): string => {
      if (!html) return "";
      const noClass = html.replace(/\sclass="[^"]*"/gi, "");
      const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, "");
      const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
      return dropFirstH1.trim();
    };

    const resolveHtml = (raw: unknown): string => {
      const source = typeof raw === "string" ? raw.trim() : "";
      if (!source) return "";

      try {
        const parsed = JSON.parse(source);
        if (parsed && typeof parsed.html === "string") {
          return cleanContentHtml(parsed.html);
        }
      } catch {
        // plain html/text
      }

      return cleanContentHtml(source);
    };

    const contentHtml = resolveHtml(item.content);
    
    return (
        <section className="technical__area pt-120 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-xl-8 col-lg-8">
                        <div className="technical__main-wrapper">
                            {/* Back Link */}
                            <div className="mb-35">
                                <Link href="/team" className="text-primary font-weight-bold">
                                    <i className="fa-light fa-arrow-left-long mr-10"></i>
                                    {t("backToTeam")}
                                </Link>
                            </div>
                            <div className="blog__thumb w-img mb-45">
                                <Image 
                                    src={item.image_url || item.featured_image || "/img/team/team-1.jpg"} 
                                    alt={item.title} 
                                    width={800} 
                                    height={500} 
                                    layout="responsive"
                                    style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                                />
                            </div>
                            <div className="technical__content">
                                <div className="technical__title">
                                    <h2 className="postbox__title" style={{ fontSize: '42px', fontWeight: '700' }}>{item.title}</h2>
                                </div>
                                <h4 className="text-primary mb-30" style={{ fontSize: '22px', fontWeight: '500' }}>
                                    {item.summary}
                                </h4>
                                
                                <div className="postbox__text mb-50" style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
                                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-4 col-lg-4">
                        <div className="sideber__widget">
                            <div className="sideber__widget-item mb-40">
                                <div className="sidebar__contact">
                                        <div className="sidebar__contact-title mb-30">
                                        <h3>{t("quickContact")}</h3>
                                        </div>
                                    <div className="sidebar__contact-inner">
                                        <div className="sidebar__contact-item">
                                            <div className="sideber__contact-icon">
                                                <i className="fa-light fa-user"></i>
                                            </div>
                                            <div className="sideber__contact-text">
                                                <span>{item.title}</span>
                                            </div>
                                        </div>
                                        <div className="sidebar__contact-item">
                                            <div className="sideber__contact-icon">
                                                <i className="fa-light fa-briefcase"></i>
                                            </div>
                                            <div className="sideber__contact-text">
                                                <span>{item.summary}</span>
                                            </div>
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

export default PageSwitch;
