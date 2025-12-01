// src/components/layout/header/HeaderClient.tsx
"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

import HeaderOffcanvas from "./HeaderOffcanvas";

import { useListMenuItemsQuery } from "@/integrations/rtk/endpoints/menu_items.endpoints";
import type { PublicMenuItemDto } from "@/integrations/types/menu_items.types";

import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";
import { localizePath } from "@/i18n/url";

import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";

type SimpleBrand = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: Record<string, string>;
};

type Props = { brand?: SimpleBrand; logoSrc?: StaticImageData | string };

const IMG_W = 160;
const IMG_H = 60;
const imgStyle: React.CSSProperties = {
  width: "auto",
  height: "auto",
  maxWidth: IMG_W,
  maxHeight: IMG_H,
};

const HeaderClient: React.FC<Props> = ({ brand, logoSrc }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // ✅ Ortak locale hook’u: app_locales + router.locale mantığı burada
  const locale = useResolvedLocale();

  // ✅ UI stringleri: DB (ui_header JSON) + i18n (UI_FALLBACK_EN) + hard fallback
  const { ui, raw: uiHeaderJson } = useUiSection(
    "ui_header",
    locale,
    UI_KEYS.header,
  );

  // Menü boş / yükleniyor mesajları – DB'de varsa onlardan, yoksa hard fallback
  const menuEmptyLabel =
    (typeof uiHeaderJson["menu_empty"] === "string" &&
      (uiHeaderJson["menu_empty"] as string).trim()) ||
    "(Menü tanımlı değil)";

  const menuLoadingLabel =
    (typeof uiHeaderJson["menu_loading"] === "string" &&
      (uiHeaderJson["menu_loading"] as string).trim()) ||
    "(Menü yükleniyor...)";

  // 🔹 site_settings - contact_info + socials + company_brand (aktif locale ile)
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({
    key: "contact_info",
    locale,
  });
  const { data: socialsSetting } = useGetSiteSettingByKeyQuery({
    key: "socials",
    locale,
  });
  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({
    key: "company_brand",
    locale,
  });

  // 🔹 site_settings → brand
  const brandFromSettings = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const socials = (socialsSetting?.value ?? {}) as Record<string, string>;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;

    const name =
      (brandVal.name as string) ||
      (contact.companyName as string) ||
      "ENSOTEK";

    const website =
      (brandVal.website as string) ||
      (contact.website as string) ||
      "https://ensotek.de";

    const phones = Array.isArray(contact.phones) ? contact.phones : [];
    const phone =
      (phones[0] as string | undefined) ||
      (contact.whatsappNumber as string | undefined) ||
      (brandVal.phone as string | undefined) ||
      "+90 212 000 00 00";

    const email =
      (contact.email as string) ||
      (brandVal.email as string) ||
      "info@ensotek.com";

    const mergedSocials: Record<string, string> = {
      ...(brandVal.socials as Record<string, string> | undefined),
      ...socials,
    };

    const logo = (brandVal.logo ||
      (Array.isArray(brandVal.images) ? brandVal.images[0] : null) ||
      {}) as { url?: string; width?: number; height?: number };

    return {
      name,
      website,
      phone,
      email,
      socials: mergedSocials,
      logo,
    };
  }, [contactInfoSetting, socialsSetting, companyBrandSetting]);

  // 🔹 dışarıdan gelen brand override edebilir
  const resolvedBrand = useMemo(
    () => ({
      ...brandFromSettings,
      ...(brand ?? {}),
      socials: {
        ...(brandFromSettings.socials ?? {}),
        ...(brand?.socials ?? {}),
      },
    }),
    [brandFromSettings, brand],
  );

  // Logo seçimi (önce prop, sonra site_settings, sonra hard fallback)
  const effectiveLogo: string | StaticImageData | undefined = useMemo(() => {
    if (typeof logoSrc === "string" && logoSrc.trim()) return logoSrc.trim();
    if (logoSrc) return logoSrc;

    const fromSettings = brandFromSettings.logo?.url;
    if (fromSettings && fromSettings.trim()) return fromSettings.trim();

    return "https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp";
  }, [logoSrc, brandFromSettings.logo]);

  // Header menü item'larını API'den al – aktif locale ile (tamamen dinamik)
  const { data: menuData, isLoading: isMenuLoading } = useListMenuItemsQuery({
    location: "header",
    is_active: true,
    locale,
  });

  const headerMenuItems: PublicMenuItemDto[] = useMemo(() => {
    const items = menuData?.items ?? [];
    // order_num varsa ona göre sırala
    return [...items].sort((a, b) => {
      const ao = (a as any)?.order_num ?? 0;
      const bo = (b as any)?.order_num ?? 0;
      return ao - bo;
    });
  }, [menuData]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Fragment>
      <HeaderOffcanvas
        open={open}
        onClose={() => setOpen(false)}
        brand={resolvedBrand}
        logoSrc={effectiveLogo}
      />

      <header>
        <div
          id="header-sticky"
          className={
            (scrolled ? " sticky" : " ") +
            " header__area header__transparent"
          }
        >
          <div className="container">
            <div className="row align-items-center">
              {/* Logo */}
              <div className="col-xl-2 col-lg-2 col-6">
                <div className="header__logo">
                  <Link href="/" aria-label={resolvedBrand.name}>
                    {effectiveLogo ? (
                      <Image
                        key={
                          typeof effectiveLogo === "string"
                            ? effectiveLogo
                            : "static"
                        }
                        src={effectiveLogo}
                        alt={resolvedBrand.name}
                        width={brandFromSettings.logo?.width ?? IMG_W}
                        height={brandFromSettings.logo?.height ?? IMG_H}
                        sizes="(max-width: 992px) 120px, 160px"
                        style={imgStyle}
                        priority
                      />
                    ) : null}
                  </Link>
                </div>
              </div>

              {/* Desktop menü – tamamen menu_items’den */}
              <div className="col-xl-8 col-lg-9 d-none d-lg-block">
                <div className="menu__main-wrapper d-flex justify-content-center">
                  <div className="main-menu d-none d-lg-block">
                    <nav id="mobile-menu">
                      <ul className="nav-inline">
                        {headerMenuItems.map((item) => {
                          const rawUrl = item.url || item.href || "#";
                          const href = localizePath(locale, rawUrl);
                          const isNowrap =
                            rawUrl === "/sparepart" || rawUrl === "/blog";

                          return (
                            <li key={item.id}>
                              <Link href={href}>
                                <span
                                  className={isNowrap ? "nowrap" : undefined}
                                >
                                  {item.title || rawUrl}
                                </span>
                              </Link>
                            </li>
                          );
                        })}

                        {!headerMenuItems.length && !isMenuLoading && (
                          <li>
                            <span className="text-muted small ps-2">
                              {menuEmptyLabel}
                            </span>
                          </li>
                        )}

                        {isMenuLoading && (
                          <li>
                            <span className="text-muted small ps-2">
                              {menuLoadingLabel}
                            </span>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Sağ: hamburgerler */}
              <div className="col-xl-2 col-lg-1 col-6">
                <div className="header__right d-flex align-items-center justify-content-end">
                  <div className="header__hamburger ml-60 d-none d-lg-inline-flex">
                    <button
                      className="humbager__icon sidebar__active"
                      aria-label={ui(
                        "ui_header_open_menu",
                        "Open Menu",
                      )}
                      onClick={() => setOpen(true)}
                      type="button"
                    >
                      {/* svg */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="24"
                        viewBox="0 0 28 24"
                        aria-hidden="true"
                      >
                        <g transform="translate(-1629 -60)">
                          <circle cx="2" cy="2" r="2" transform="translate(1641 60)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1653 60)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1629 60)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1641 70)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1653 70)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1629 70)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1641 80)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1653 80)" />
                          <circle cx="2" cy="2" r="2" transform="translate(1629 80)" />
                        </g>
                      </svg>
                    </button>
                  </div>

                  <div className="header__toggle d-lg-none">
                    <button
                      className="sidebar__active"
                      aria-label={ui(
                        "ui_header_open_sidebar",
                        "Open Sidebar",
                      )}
                      onClick={() => setOpen(true)}
                      type="button"
                    >
                      <div className="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              {/* row end */}
            </div>
          </div>
        </div>

        <style jsx>{`
          .nav-inline {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            gap: 20px;
            white-space: nowrap;
          }
          .nav-inline > li {
            margin: 0 !important;
          }
          .nav-inline > li > a {
            display: inline-block;
            padding: 6px 8px !important;
            line-height: 1.2;
            white-space: nowrap;
          }
          .nowrap {
            white-space: nowrap;
          }
          @media (min-width: 1200px) {
            .nav-inline {
              gap: 20px;
            }
          }
        `}</style>
      </header>
    </Fragment>
  );
};

export default HeaderClient;
