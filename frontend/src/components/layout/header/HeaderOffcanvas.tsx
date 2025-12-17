// src/components/layout/header/HeaderOffcanvas.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/router";

import {
  SUPPORTED_LOCALES,
  LANG_LABELS,
  type SupportedLocale,
} from "@/types/common";
import { localizePath } from "@/i18n/url";
import { switchLocale } from "@/i18n/switchLocale";

import {
  FiX,
  FiSearch,
  FiGlobe,
  FiPhone,
  FiMail,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

import { useListMenuItemsQuery } from "@/integrations/rtk/endpoints/menu_items.endpoints";
import type { PublicMenuItemDto } from "@/integrations/types/menu_items.types";

import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const IMG_W = 160;
const IMG_H = 60;

const isSupportedLocale = (val: string): val is SupportedLocale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(val);

type SimpleBrand = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: Record<string, string>;
};

export type HeaderOffcanvasProps = {
  open: boolean;
  onClose: () => void;
  brand?: SimpleBrand;
  logoSrc?: StaticImageData | string;
};

type MenuItemWithChildren = PublicMenuItemDto & {
  children?: MenuItemWithChildren[];
};

const HeaderOffcanvas: React.FC<HeaderOffcanvasProps> = ({
  open,
  onClose,
  brand,
  logoSrc,
}) => {
  const router = useRouter();
  const locale = useResolvedLocale();

  // app_locales
  const { data: appLocalesSetting } = useGetSiteSettingByKeyQuery({
    key: "app_locales",
  });

  const availableLocales: SupportedLocale[] = useMemo(() => {
    const raw = appLocalesSetting?.value;

    const extract = (v: any): string[] => {
      if (Array.isArray(v)) return v.map(String);
      if (v && typeof v === "object" && Array.isArray((v as any).locales)) {
        return (v as any).locales.map(String);
      }
      return [];
    };

    const cleaned = extract(raw)
      .map((x) => String(x).toLowerCase().trim().split("-")[0])
      .filter(Boolean)
      .filter(isSupportedLocale);

    return cleaned.length
      ? (Array.from(new Set(cleaned)) as SupportedLocale[])
      : [...SUPPORTED_LOCALES];
  }, [appLocalesSetting?.value]);

  const { ui } = useUiSection("ui_header", locale);

  const loginHref = localizePath(locale, "/login");
  const registerHref = localizePath(locale, "/register");

  // brand settings
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

  const effectiveBrand: SimpleBrand & {
    logo?: { url?: string; width?: number; height?: number };
  } = useMemo(
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

  const effectiveLogo: string | StaticImageData | undefined = useMemo(() => {
    if (typeof logoSrc === "string" && logoSrc.trim()) return logoSrc.trim();
    if (logoSrc) return logoSrc;

    const fromSettings = effectiveBrand.logo?.url;
    if (fromSettings && fromSettings.trim()) return fromSettings.trim();

    return "https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp";
  }, [logoSrc, effectiveBrand.logo]);

  const socialItems = useMemo(() => {
    const s = (effectiveBrand.socials ?? {}) as any;
    const normalize = (u?: string) =>
      !u ? "" : /^https?:\/\//i.test(u) ? u : `https://${u}`;
    return [
      { key: "facebook", Icon: FaFacebookF, url: normalize(s.facebook || s.fb) },
      { key: "twitter", Icon: FaTwitter, url: normalize(s.twitter || s.x) },
      { key: "youtube", Icon: FaYoutube, url: normalize(s.youtube || s.yt) },
      { key: "linkedin", Icon: FaLinkedin, url: normalize(s.linkedin || s.li) },
      { key: "instagram", Icon: FaInstagram, url: normalize(s.instagram || s.ig) },
    ].filter((x) => x.url);
  }, [effectiveBrand.socials]);

  const webHost = useMemo(
    () =>
      (effectiveBrand.website || "https://ensotek.de").replace(/^https?:\/\//, ""),
    [effectiveBrand.website],
  );

  const safePhone = (effectiveBrand.phone || "").replace(/\s+/g, "");

  const onLangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as SupportedLocale;
    await switchLocale(router, next);
  };

  // menu
  const { data: menuData, isLoading: isMenuLoading } = useListMenuItemsQuery({
    location: "header",
    is_active: true,
    locale,
    nested: true,
  });

  const headerMenuItems: MenuItemWithChildren[] = useMemo(() => {
    const raw = menuData as any;
    const list: MenuItemWithChildren[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.items)
        ? raw.items
        : [];

    const sortRecursive = (
      items: MenuItemWithChildren[],
    ): MenuItemWithChildren[] =>
      items
        .slice()
        .sort((a, b) => {
          const ao = (a as any)?.order_num ?? 0;
          const bo = (b as any)?.order_num ?? 0;
          return ao - bo;
        })
        .map((it) => ({
          ...it,
          children: it.children
            ? sortRecursive(it.children as MenuItemWithChildren[])
            : undefined,
        }));

    return sortRecursive(list);
  }, [menuData]);

  // submenu state
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) setOpenSubmenus({});
  }, [open]);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const renderMobileMenuItem = (item: MenuItemWithChildren, depth = 0) => {
    const rawUrl = item.url || (item as any).href || "#";
    const href = localizePath(locale, rawUrl);

    const hasChildren = !!item.children && item.children.length > 0;
    const isNowrap = rawUrl === "/sparepart" || rawUrl === "/blog";

    const id = String(item.id ?? rawUrl ?? Math.random());
    const isOpen = !!openSubmenus[id];
    const submenuId = `submenu:${id}`;

    const indent = depth * 14;

    if (!hasChildren) {
      return (
        <li key={id} style={{ paddingLeft: indent }}>
          <Link href={href} onClick={onClose}>
            <span className={isNowrap ? "nowrap" : undefined}>
              {item.title || rawUrl}
            </span>
          </Link>
        </li>
      );
    }

    // Parent: sadece toggle (Go yok)
    return (
      <li
        key={id}
        className={`has-submenu ${isOpen ? "is-open" : ""}`}
        style={{ paddingLeft: indent }}
      >
        <button
          type="button"
          className="submenu-toggle"
          onClick={() => toggleSubmenu(id)}
          aria-expanded={isOpen}
          aria-controls={submenuId}
        >
          <span className={isNowrap ? "nowrap" : undefined}>
            {item.title || rawUrl}
          </span>
          <span className="caret" aria-hidden="true" />
        </button>

        <ul id={submenuId} className={`submenu ${isOpen ? "open" : ""}`}>
          {item.children!.map((child) => renderMobileMenuItem(child, depth + 1))}
        </ul>
      </li>
    );
  };

  return (
    <>
      <div className={(open ? " info-open" : " ") + " offcanvas__info"}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__content">
            {/* top */}
            <div className="offcanvas__top mb-40 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo">
                <Link
                  href={localizePath(locale, "/")}
                  aria-label={effectiveBrand.name}
                  onClick={onClose}
                >
                  {effectiveLogo ? (
                    <Image
                      key={
                        typeof effectiveLogo === "string" ? effectiveLogo : "static"
                      }
                      src={effectiveLogo}
                      alt={effectiveBrand.name}
                      width={effectiveBrand.logo?.width ?? IMG_W}
                      height={effectiveBrand.logo?.height ?? IMG_H}
                      sizes="(max-width: 992px) 120px, 160px"
                      style={{ height: "auto", width: "auto" }}
                      loading="lazy"
                    />
                  ) : null}
                </Link>
              </div>
              <div className="offcanvas__close">
                <button
                  aria-label={ui("ui_header_close", "Close")}
                  onClick={onClose}
                  type="button"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* language + auth */}
            <div className="d-flex flex-column gap-2 mb-25">
              <label
                htmlFor="lang-any"
                className="d-flex align-items-center gap-2"
                style={{ fontSize: 14 }}
              >
                <FiGlobe /> <span>{ui("ui_header_language", "Language")}</span>
              </label>

              <select
                id="lang-any"
                value={locale}
                onChange={onLangChange}
                className="form-select"
                style={{ maxWidth: 240 }}
              >
                {availableLocales.map((loc) => (
                  <option key={loc} value={loc}>
                    {LANG_LABELS[loc] ?? loc.toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="d-flex align-items-center gap-2">
                <Link
                  href={loginHref}
                  className="border__btn d-inline-flex align-items-center gap-1"
                  onClick={onClose}
                >
                  <FiLogIn /> {ui("ui_header_auth", "Login")}
                </Link>

                <Link
                  href={registerHref}
                  className="solid__btn d-inline-flex align-items-center gap-1"
                  onClick={onClose}
                >
                  <FiUserPlus /> {ui("ui_header_register", "Register")}
                </Link>
              </div>
            </div>

            {/* search */}
            <div className="offcanvas__search mb-25">
              <form action={localizePath(locale, "/")}>
                <input
                  type="text"
                  placeholder={ui("ui_header_search_placeholder", "Search...")}
                  required
                />
                <button
                  type="submit"
                  aria-label={ui("ui_header_search", "Search")}
                >
                  <FiSearch />
                </button>
              </form>
            </div>

            {/* menu */}
            <div className="mobile-menu fix mb-40 mean-container">
              <div className="mean-bar d-block">
                <nav className="mean-nav">
                  <ul>
                    {headerMenuItems.map((it) => renderMobileMenuItem(it, 0))}

                    {!headerMenuItems.length && !isMenuLoading && (
                      <li>
                        <span className="text-muted small">
                          {ui("menu_empty", "(Menü tanımlı değil)")}
                        </span>
                      </li>
                    )}

                    {isMenuLoading && (
                      <li>
                        <span className="text-muted small">
                          {ui("menu_loading", "(Menü yükleniyor...)")}
                        </span>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </div>

            {/* contact info */}
            <div className="offcanvas__contact mt-30 mb-20">
              <h4>{ui("ui_header_contact_info", "Contact Info")}</h4>
              <ul>
                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon mr-15">
                    <FiGlobe />
                  </div>
                  <div className="offcanvas__contact-text">
                    <Link target="_blank" href={effectiveBrand.website || "/"}>
                      {webHost}
                    </Link>
                  </div>
                </li>

                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon mr-15">
                    <FiPhone />
                  </div>
                  <div className="offcanvas__contact-text">
                    <Link
                      href={safePhone ? `tel:${safePhone}` : localizePath(locale, "/contact")}
                      aria-label={ui("ui_header_call", "Call")}
                    >
                      {effectiveBrand.phone || "—"}
                    </Link>
                  </div>
                </li>

                <li className="d-flex align-items-center">
                  <div className="offcanvas__contact-icon mr-15">
                    <FiMail />
                  </div>
                  <div className="offcanvas__contact-text">
                    <Link
                      href={`mailto:${effectiveBrand.email}`}
                      aria-label={ui("ui_header_email", "Email")}
                    >
                      <span>{effectiveBrand.email}</span>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            {/* social */}
            <div className="offcanvas__social">
              <ul>
                {socialItems.map(({ key, Icon, url }) => (
                  <li key={key}>
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      onClick={onClose}
                    >
                      <Icon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* overlay */}
      <div
        className={(open ? " overlay-open" : " ") + " offcanvas__overlay"}
        onClick={onClose}
      />
      <div className="offcanvas__overlay-white" />

      <style jsx>{`
        .nowrap {
          white-space: nowrap;
        }

        /* Parent satır: link gibi görünmesin */
        .submenu-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          background: transparent;
          border: 0;
          padding: 10px 0;
          margin: 0;

          text-align: left;
          cursor: pointer;

          font: inherit;
          color: inherit;
        }

        .submenu-toggle:focus {
          outline: none;
        }

        .caret {
          width: 8px;
          height: 8px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(45deg);
          transition: transform 160ms ease;
          margin-right: 2px;
          opacity: 0.8;
          flex: 0 0 auto;
        }

        li.has-submenu.is-open .caret {
          transform: rotate(-135deg);
        }

        /* submenu indent + open/close */
        ul.submenu {
          display: none;
          margin: 6px 0 8px 0;
          padding-left: 12px;
          border-left: 1px solid rgba(0, 0, 0, 0.08);
        }

        ul.submenu.open {
          display: block;
        }

        ul.submenu li {
          padding-left: 0; /* li inline style depth ile geliyor */
        }
      `}</style>
    </>
  );
};

export default HeaderOffcanvas;
