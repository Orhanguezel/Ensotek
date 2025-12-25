// src/components/containers/footer/Footer.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  useGetSiteSettingByKeyQuery,
  useListFooterSectionsQuery,
  useListMenuItemsQuery
} from "@/integrations/rtk/hooks";

import type { FooterSectionDto } from "@/integrations/types/footer_sections.types";
import type { PublicMenuItemDto } from "@/integrations/types/menu_items.types";
import { localizePath } from "@/i18n/url";

// Yeni i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const IMG_W = 160;
const IMG_H = 60;

const Footer: React.FC = () => {
  // ✅ Ortak locale hook’u (router + app_locales logic bunun içinde)
  const locale = useResolvedLocale();

  // ✅ UI yazıları: DB (ui_footer JSON) + eski i18n + hard fallback
  const { ui } = useUiSection("ui_footer", locale);

  // 🔹 site_settings – contact_info + company_brand
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({
    key: "contact_info",
    locale,
  });

  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({
    key: "company_brand",
    locale,
  });

  // 🔹 site_settings → marka + logo + iletişim
  const {
    brandName,
    phone,
    email,
    website,
    logoUrl,
    addrLines,
  } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;

    const name =
      (brandVal.name as string) ||
      (contact.companyName as string) ||
      "Ensotek";

    const site =
      (brandVal.website as string) ||
      (contact.website as string) ||
      "https://ensotek.de";

    const phoneVal =
      (brandVal.phone as string | undefined) ||
      (Array.isArray(contact.phones)
        ? (contact.phones[0] as string | undefined)
        : undefined) ||
      (contact.whatsappNumber as string | undefined) ||
      "+90 212 000 00 00";

    const emailVal =
      (brandVal.email as string | undefined) ||
      (contact.email as string | undefined) ||
      "info@ensotek.com";

    const logoObj =
      (brandVal.logo ||
        (Array.isArray(brandVal.images) ? brandVal.images[0] : null) ||
        {}) as { url?: string; width?: number; height?: number };

    const logo =
      (logoObj.url && String(logoObj.url).trim()) ||
      // hard fallback – Cloudinary logo
      "https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp";

    const addrLinesComputed: string[] = [];
    if (contact.address) addrLinesComputed.push(String(contact.address));
    if (contact.addressSecondary)
      addrLinesComputed.push(String(contact.addressSecondary));

    return {
      brandName: name,
      phone: phoneVal?.trim() || "",
      email: emailVal?.trim() || "",
      website: site?.trim() || "",
      logoUrl: logo,
      addrLines: addrLinesComputed,
    };
  }, [contactInfoSetting, companyBrandSetting]);

  const websiteHref = website
    ? /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`
    : "";
  const telHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : "";
  const mailHref = email ? `mailto:${email}` : "";

  // 🔹 Footer sections (RTK – locale aware)
  const { data: footerSections } = useListFooterSectionsQuery({
    is_active: true,
    order: "display_order.asc",
    locale,
  });

  const sortedSections: FooterSectionDto[] = useMemo(
    () =>
      (footerSections ?? [])
        .slice()
        .sort((a, b) => a.display_order - b.display_order),
    [footerSections],
  );

  // Sıralamaya göre 2 ana kolon kullanıyoruz: 1: Company, 2: Services
  const [companySection, servicesSection] = sortedSections;

  // 🔹 Footer menu item'ları (RTK – menu_items, location: "footer", locale aware)
  const { data: footerMenuData } = useListMenuItemsQuery({
    location: "footer",
    is_active: true,
    locale,
  });

  const footerMenuItems: PublicMenuItemDto[] = useMemo(
    () => footerMenuData?.items ?? [],
    [footerMenuData],
  );

  const itemsForSection = (section?: FooterSectionDto | null) => {
    if (!section) return [] as PublicMenuItemDto[];
    return footerMenuItems.filter((item) => {
      const sid = (item as any).section_id ?? (item as any).sectionId;
      return sid && sid === section.id;
    });
  };

  const companyLinks = itemsForSection(companySection);
  const servicesLinks = itemsForSection(servicesSection);

  const mapLink = (item: PublicMenuItemDto) => {
    const rawUrl = item.url || item.href || "#";
    const href = localizePath(locale, rawUrl);
    return (
      <li key={item.id}>
        <Link href={href}>{item.title || rawUrl}</Link>
      </li>
    );
  };

  return (
    <footer>
      <section className="footer__border grey__bg pt-115 pb-60">
        <div className="container">
          <div className="row">
            {/* COMPANY */}
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget footer__col-1 mb-55">
                <div className="footer__title">
                  <h3>
                    {companySection?.title ||
                      ui("ui_footer_company", "Company")}
                  </h3>
                </div>
                <div className="footer__link">
                  <ul>{companyLinks.map(mapLink)}</ul>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="col-xl-4 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget footer__col-2 mb-55">
                <div className="footer__title">
                  <h3>
                    {servicesSection?.title ||
                      ui("ui_footer_services", "Services")}
                  </h3>
                </div>
                <div className="footer__link">
                  <ul>{servicesLinks.map(mapLink)}</ul>
                </div>
              </div>
            </div>

            {/* Contact – DİNAMİK (site_settings) */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget mb-55">
                <div className="footer__title">
                  <h3>{ui("ui_footer_contact", "Contact")}</h3>
                </div>
                <div className="footer__link">
                  <ul>
                    {/* Adres satırları */}
                    {addrLines.map((ln, i) => (
                      <li key={`addr-${i}`}>
                        <span>{ln}</span>
                      </li>
                    ))}
                    {/* Telefon */}
                    {phone && (
                      <li>
                        <a
                          href={telHref}
                          aria-label={ui("ui_footer_phone_aria", "Phone")}
                        >
                          {phone}
                        </a>
                      </li>
                    )}
                    {/* E-posta */}
                    {email && (
                      <li>
                        <a
                          href={mailHref}
                          aria-label={ui("ui_footer_email_aria", "Email")}
                        >
                          {email}
                        </a>
                      </li>
                    )}
                    {/* Website */}
                    {websiteHref && (
                      <li>
                        <a
                          href={websiteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {website}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Contact */}
          </div>
        </div>
      </section>

      <div className="footer__copyright grey-bg">
        <div className="container">
          <div className="copyright__inner">
            <div className="copyright__logo">
              <Link href="/" aria-label={brandName}>
                {logoUrl ? (
                  <Image
                    key={logoUrl}
                    src={logoUrl}
                    alt={brandName}
                    width={IMG_W}
                    height={IMG_H}
                    sizes="(max-width: 992px) 120px, 160px"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: IMG_W,
                      maxHeight: IMG_H,
                    }}
                    loading="lazy"
                  />
                ) : null}
              </Link>
            </div>
            <div className="copyright__text">
              <p>
                {ui("ui_footer_copyright_prefix", "Copyright")} ©{" "}
                {new Date().getFullYear()} {brandName}{" "}
                {ui("ui_footer_copyright_suffix", "All rights reserved.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
