"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { footerSectionsService } from "@/features/footer-sections/footerSections.service";
import { menuItemsService } from "@/features/menu-items/menuItems.service";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";

import FallbackLogo from "public/img/logo/logo.png";

const Footer = () => {
  // Fetch footer sections
  const { data: footerSections } = useQuery({
    queryKey: queryKeys.footerSections.list(),
    queryFn: footerSectionsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch all menu items
  const { data: allMenuItems } = useQuery({
    queryKey: queryKeys.menuItems.list(),
    queryFn: menuItemsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch site settings
  const { data: siteSettings } = useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  // Helper to get a site setting value by key
  const getSetting = (key: string): any => {
    if (!siteSettings) return null;
    const setting = siteSettings.find((s: any) => s.key === key);
    return setting?.value || null;
  };

  const logoData = getSetting("site_logo");
  const logoUrl = logoData?.url || null;
  const companyBrand = getSetting("company_brand");
  const companyProfile = getSetting("company_profile");
  const socialLinks = getSetting("socials");
  const siteTitle = getSetting("site_title") || "Ensotek";

  // Group menu items by section_id for footer sections
  const getItemsForSection = (sectionId: string) => {
    if (!allMenuItems) return [];
    return allMenuItems
      .filter((item: any) => item.section_id === sectionId)
      .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
  };

  // Sort footer sections by display_order
  const sortedFooterSections = footerSections
    ? [...footerSections]
        .filter((s: any) => s.is_active)
        .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
    : [];

  // Separate social media section (usually slug "social-media")
  const socialSection = sortedFooterSections.find(
    (s: any) => s.slug === "social-media"
  );
  const linkSections = sortedFooterSections.filter(
    (s: any) => s.slug !== "social-media"
  );

  // Determine column size based on number of link sections
  const getColClass = () => {
    const count = linkSections.length;
    if (count <= 2) return "col-xl-3 col-lg-3 col-md-4 col-sm-6";
    if (count === 3) return "col-xl-2 col-lg-2 col-md-4 col-sm-6";
    return "col-xl-2 col-lg-2 col-md-3 col-sm-6";
  };

  // Social link icon mapping
  const socialIconMap: Record<string, string> = {
    facebook: "fa-brands fa-facebook-f",
    twitter: "fa-brands fa-twitter",
    x: "fa-brands fa-x-twitter",
    youtube: "fa-brands fa-youtube",
    linkedin: "fa-brands fa-linkedin-in",
    instagram: "fa-brands fa-instagram",
    tiktok: "fa-brands fa-tiktok",
  };

  const hasDynamicData = sortedFooterSections.length > 0;

  return (
    <footer>
      <section className="footer__border p-relative z-index-11 pt-120 pb-55 foot-one-bg">
        <div className="footer__style-3">
          <span className="footer__cercle"></span>
          <div className="container">
            <div className="footer__inner mb-50">
              <div className="row">
                {/* Company Info Column */}
                <div className="col-xl-4 col-lg-4 col-md-5 col-sm-6">
                  <div className="footer__widget mb-55">
                    <div className="footer__logo mb-20">
                      <Link href="/">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={companyBrand?.shortName || "Ensotek"}
                            width={logoData?.width || 160}
                            height={logoData?.height || 60}
                          />
                        ) : (
                          <Image src={FallbackLogo} alt="logo" />
                        )}
                      </Link>
                    </div>
                    <div className="footer__contact mb-30">
                      <span>
                        {companyBrand?.name || "ENSOTEK Kühltürme & Technologien"}
                      </span>
                      {companyProfile?.subline && (
                        <p className="mt-10" style={{ fontSize: "14px", opacity: 0.8 }}>
                          {companyProfile.subline}
                        </p>
                      )}
                    </div>
                    <div className="touch__social">
                      {socialLinks ? (
                        <>
                          {socialLinks.facebook && (
                            <Link href={socialLinks.facebook} target="_blank" aria-label="Facebook">
                              <i className="fa-brands fa-facebook-f"></i>
                            </Link>
                          )}
                          {(socialLinks.x || socialLinks.twitter) && (
                            <Link
                              href={socialLinks.x || socialLinks.twitter}
                              target="_blank"
                              aria-label="X / Twitter"
                            >
                              <i className="fa-brands fa-x-twitter"></i>
                            </Link>
                          )}
                          {socialLinks.youtube && (
                            <Link href={socialLinks.youtube} target="_blank" aria-label="YouTube">
                              <i className="fa-brands fa-youtube"></i>
                            </Link>
                          )}
                          {socialLinks.linkedin && (
                            <Link href={socialLinks.linkedin} target="_blank" aria-label="LinkedIn">
                              <i className="fa-brands fa-linkedin-in"></i>
                            </Link>
                          )}
                          {socialLinks.instagram && (
                            <Link href={socialLinks.instagram} target="_blank" aria-label="Instagram">
                              <i className="fa-brands fa-instagram"></i>
                            </Link>
                          )}
                          {socialLinks.tiktok && (
                            <Link href={socialLinks.tiktok} target="_blank" aria-label="TikTok">
                              <i className="fa-brands fa-tiktok"></i>
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          <Link href="/"><i className="fa-brands fa-facebook-f"></i></Link>
                          <Link href="/"><i className="fa-brands fa-x-twitter"></i></Link>
                          <Link href="/"><i className="fa-brands fa-youtube"></i></Link>
                          <Link href="/"><i className="fa-brands fa-linkedin-in"></i></Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Footer Link Sections */}
                {hasDynamicData ? (
                  linkSections.map((section: any) => {
                    const items = getItemsForSection(section.id);
                    if (items.length === 0) return null;

                    return (
                      <div key={section.id} className={getColClass()}>
                        <div className="footer__widget footer__col-1 mb-55">
                          <div className="footer__title">
                            <h3>{section.title}</h3>
                          </div>
                          <div className="footer__link">
                            <ul>
                              {items.map((item: any) => (
                                <li key={item.id}>
                                  <Link href={item.url || item.href || "/"}>
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {/* Static fallback columns */}
                    <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                      <div className="footer__widget footer__col-1 mb-55">
                        <div className="footer__title">
                          <h3>About us</h3>
                        </div>
                        <div className="footer__link">
                          <ul>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/service">Services</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
                      <div className="footer__widget footer__col-5 mb-55">
                        <div className="footer__title">
                          <h3>Quick Links</h3>
                        </div>
                        <div className="footer__link">
                          <ul>
                            <li><Link href="/product">Products</Link></li>
                            <li><Link href="/project">Portfolio</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="footer__copyright">
                  <div className="copyright__text text-center">
                    <p>
                      Copyright © {new Date().getFullYear()}{" "}
                      {companyBrand?.shortName || siteTitle}. All Rights
                      Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
