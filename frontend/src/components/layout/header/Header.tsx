"use client";
import React, { useState, useEffect, Fragment, useMemo, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { menuItemsService } from "@/features/menu-items/menuItems.service";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { useProfile } from "@/features/profiles/profiles.action";
import { AVAILABLE_LOCALES } from "@/i18n/locales";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteLogo from "../SiteLogo";

import UserAvatarFallback from "public/img/blog/blog-author-1.png";

const Header = () => {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuFits, setMenuFits] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated } = useAuthStore();
  const isLoggedIn = Boolean(isAuthenticated && user);
  const { data: profile } = useProfile({ enabled: isLoggedIn });

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const handleSubmenu = (submenu: string) => {
    if (submenu === openSubMenu) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const isSubMenuOpen = (submenu: string) => {
    return submenu === openSubMenu ? "sub-menu-open" : "";
  };

  const isSubMenuButton = (submenu: string) => {
    return submenu === openSubMenu ? " sm-btn-active" : " ";
  };

  // Check if the desktop nav menu fits without overflowing
  const checkMenuFit = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ul = nav.querySelector("ul");
    if (!ul) return;
    // Temporarily show the nav to measure
    const wasHidden = nav.closest(".header__nav-desktop")?.classList.contains("header__nav-hidden");
    if (wasHidden) {
      nav.closest(".header__nav-desktop")?.classList.remove("header__nav-hidden");
    }
    const fits = ul.scrollWidth <= nav.clientWidth + 60;
    if (wasHidden) {
      nav.closest(".header__nav-desktop")?.classList.add("header__nav-hidden");
    }
    setMenuFits(fits);
  }, []);

  useEffect(() => {
    const handleResizeHeader = (): void => {
      setToggleMenu(false);
      setOpenSubMenu(null);
      setShowUserMenu(false);
      checkMenuFit();
    };

    window.addEventListener("resize", handleResizeHeader);
    // Initial check
    checkMenuFit();

    return () => {
      window.removeEventListener("resize", handleResizeHeader);
    };
  }, [checkMenuFit]);

  const isHomePage = useMemo(() => {
    const segments = (pathname || "/").split("/").filter(Boolean);
    const normalizedSegments =
      segments.length > 0 && AVAILABLE_LOCALES.includes(segments[0])
        ? segments.slice(1)
        : segments;
    return normalizedSegments.length === 0;
  }, [pathname]);

  const [scrolled, setScrolled] = useState(!isHomePage);
  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    setScrolled(window.scrollY > 80);
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    setShowUserMenu(false);
  }, [pathname]);

  // Fetch menu items from backend
  const { data: allMenuItems } = useQuery({
    queryKey: queryKeys.menuItems.list(),
    queryFn: menuItemsService.getAll,
    staleTime: 10 * 60 * 1000, // 10 min cache
  });

  // Fetch site settings for logo and company info
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

  const companyBrand = getSetting("company_brand");
  const socialLinks = getSetting("socials");

  // Build header menu tree: items without section_id and without parent_id are main header links
  const headerMenu = useMemo(() => {
    if (!allMenuItems) return [];

    // Header items: no section_id (footer items have section_id)
    const headerItems = allMenuItems.filter((item: any) => !item.section_id);

    // Build tree: roots and children
    const roots = headerItems.filter((item: any) => !item.parent_id);
    const childMap: Record<string, any[]> = {};
    headerItems.forEach((item: any) => {
      if (item.parent_id) {
        if (!childMap[item.parent_id]) childMap[item.parent_id] = [];
        childMap[item.parent_id].push(item);
      }
    });

    // Sort and attach children
    return roots
      .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0))
      .map((root: any) => ({
        ...root,
        children: (childMap[root.id] || []).sort(
          (a: any, b: any) => (a.order_num || 0) - (b.order_num || 0)
        ),
      }));
  }, [allMenuItems]);

  // Fallback static menu
  const staticMenu = [
    { id: "home", title: "Home", url: "/", children: [] },
    { id: "about", title: "About", url: "/about", children: [] },
    { id: "services", title: "Services", url: "/service", children: [] },
    { id: "products", title: "Products", url: "/product", children: [] },
    { id: "offer", title: "Offer", url: "/offer", children: [] },
    { id: "contact", title: "Contact", url: "/contact", children: [] },
  ];

  const displayMenu = headerMenu.length > 0 ? headerMenu : staticMenu;

  // Re-check menu fit when menu items change
  useEffect(() => {
    checkMenuFit();
  }, [displayMenu.length, checkMenuFit]);

  const toLocalizedHref = (value?: string) => {
    const raw = (value || "/").trim();
    if (!raw) return `/${locale}`;

    if (raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("#")) {
      return raw;
    }

    let withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;

    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      try {
        const currentOrigin =
          typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        const parsed = new URL(raw);
        if (parsed.origin !== currentOrigin) return raw;
        withLeadingSlash = `${parsed.pathname}${parsed.search}${parsed.hash}`;
      } catch {
        return raw;
      }
    }

    const segments = withLeadingSlash.split("/").filter(Boolean);
    const normalizedSegments =
      segments.length > 0 && AVAILABLE_LOCALES.includes(segments[0])
        ? segments.slice(1)
        : segments;

    const suffix = normalizedSegments.join("/");
    // `Link` from `@/i18n/routing` injects current locale automatically.
    // Return locale-less internal path to avoid `/tr/tr/...` duplication.
    return suffix ? `/${suffix}` : "/";
  };

  // Render menu items
  const renderDesktopMenu = (items: any[]) => (
    <ul>
      {items.map((item: any) => {
        const hasChildren = item.children && item.children.length > 0;
        return (
          <li key={item.id} className={hasChildren ? "has-dropdown" : ""}>
            {hasChildren ? (
              <>
                <button aria-label="Select dropdown">{item.title}</button>
                <ul className="submenu">
                  {item.children.map((child: any) => (
                    <li key={child.id}>
                      <Link href={toLocalizedHref(child.url || child.href || "/")}>{child.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link href={toLocalizedHref(item.url || item.href || "/")}>{item.title}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  const renderMobileMenu = (items: any[]) => (
    <ul>
      {items.map((item: any) => {
        const hasChildren = item.children && item.children.length > 0;
        return (
          <li
            key={item.id}
            className={hasChildren ? "has-dropdown" : item === items[items.length - 1] ? "mean-last" : ""}
          >
            {hasChildren ? (
              <>
                <button
                  aria-label="Select Dropdown"
                  className={`nul ${isSubMenuButton(item.id)}`}
                  onClick={() => handleSubmenu(item.id)}
                >
                  {item.title}
                  <span className="mean-expand">
                    <i className="fa-regular fa-plus"></i>
                  </span>
                </button>
                <ul className={`sub-menu ${isSubMenuOpen(item.id)}`}>
                  {item.children.map((child: any) => (
                    <li key={child.id}>
                      <Link href={toLocalizedHref(child.url || child.href || "/")}>{child.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link href={toLocalizedHref(item.url || item.href || "/")}>{item.title}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  const userDisplayName =
    user?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "User";
  const userAvatarSrc = profile?.avatar_url || UserAvatarFallback;

  return (
    <Fragment>
      <div className="fix">
        <div className={(toggleMenu ? " info-open" : " ") + " offcanvas__info"}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-40 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href={toLocalizedHref("/")}>
                    <SiteLogo
                      variant="dark"
                      alt={companyBrand?.shortName || "Ensotek"}
                      className="header-logo__img"
                    />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button
                    aria-label="Close"
                    onClick={() => setToggleMenu(false)}
                  >
                    <i className="fa-light fa-xmark"></i>
                  </button>
                </div>
              </div>
              <div className="offcanvas__search mb-25">
                <form action={`/${locale}`}>
                  <input
                    type="text"
                    placeholder={t("search")}
                    required
                  />
                  <button type="submit">
                    <i className="fa-regular fa-magnifying-glass"></i>
                  </button>
                </form>
              </div>
              <div className="offcanvas__auth mb-30">
                <div className="mb-15">
                  <LanguageSwitcher className="w-100" />
                </div>
                {isLoggedIn ? (
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-3 px-2">
                      <Image
                        src={userAvatarSrc}
                        alt={userDisplayName}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" style={{ maxWidth: 220 }}>{userDisplayName}</div>
                        <div className="small text-muted text-truncate" style={{ maxWidth: 220 }}>{user?.email}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <Link
                        className="border__btn text-center"
                        href={toLocalizedHref("/dashboard")}
                        onClick={() => setToggleMenu(false)}
                        style={{ flex: 1, paddingLeft: "12px", paddingRight: "12px", minWidth: 120 }}
                      >
                        {t("dashboard")}
                      </Link>
                      <Link
                        className="border__btn text-center"
                        href={toLocalizedHref("/profile")}
                        onClick={() => setToggleMenu(false)}
                        style={{ flex: 1, paddingLeft: "12px", paddingRight: "12px", minWidth: 120 }}
                      >
                        {t("profile")}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Link
                      className="border__btn text-center"
                      href={toLocalizedHref("/login")}
                      onClick={() => setToggleMenu(false)}
                      style={{ flex: 1, paddingLeft: "12px", paddingRight: "12px" }}
                    >
                      {t("login")}
                    </Link>
                    <Link
                      className="border__btn text-center"
                      href={toLocalizedHref("/register")}
                      onClick={() => setToggleMenu(false)}
                      style={{ flex: 1, paddingLeft: "12px", paddingRight: "12px" }}
                    >
                      {t("register")}
                    </Link>
                  </div>
                )}
              </div>
              <div className="mobile-menu fix mb-40 mean-container">
                <div className="mean-bar">
                  <nav className="mean-nav">
                    {renderMobileMenu(displayMenu)}
                  </nav>
                </div>
              </div>
              <div className="offcanvas__contact mt-30 mb-20">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fa-regular fa-location-dot"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <span>{companyBrand?.name || "Ensotek"}</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fa-regular fa-globe"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        href={companyBrand?.website || "https://www.ensotek.de"}
                        target="_blank"
                      >
                        {companyBrand?.website || "www.ensotek.de"}
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
                <div className="offcanvas__social">
                  <div className="ens-social-links is-large is-light">
                    {socialLinks?.facebook && (
                      <Link href={socialLinks.facebook} target="_blank" className="ens-social-links__item facebook" aria-label="Facebook">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                    )}
                    {(socialLinks?.x || socialLinks?.twitter) && (
                      <Link href={socialLinks.x || socialLinks.twitter} target="_blank" className="ens-social-links__item twitter" aria-label="Twitter">
                        <i className="fa-brands fa-twitter"></i>
                      </Link>
                    )}
                    {socialLinks?.youtube && (
                      <Link href={socialLinks.youtube} target="_blank" className="ens-social-links__item youtube" aria-label="YouTube">
                        <i className="fa-brands fa-youtube"></i>
                      </Link>
                    )}
                    {socialLinks?.linkedin && (
                      <Link href={socialLinks.linkedin} target="_blank" className="ens-social-links__item linkedin" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </Link>
                    )}
                    {socialLinks?.instagram && (
                      <Link href={socialLinks.instagram} target="_blank" className="ens-social-links__item instagram" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    )}
                    {socialLinks?.tiktok && (
                      <Link href={socialLinks.tiktok} target="_blank" className="ens-social-links__item tiktok" aria-label="TikTok">
                        <i className="fa-brands fa-tiktok"></i>
                      </Link>
                    )}
                    {!socialLinks && (
                      <>
                        <Link href={toLocalizedHref("/")} className="ens-social-links__item facebook"><i className="fa-brands fa-facebook-f"></i></Link>
                        <Link href={toLocalizedHref("/")} className="ens-social-links__item twitter"><i className="fa-brands fa-twitter"></i></Link>
                        <Link href={toLocalizedHref("/")} className="ens-social-links__item youtube"><i className="fa-brands fa-youtube"></i></Link>
                        <Link href={toLocalizedHref("/")} className="ens-social-links__item linkedin"><i className="fa-brands fa-linkedin-in"></i></Link>
                      </>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={(toggleMenu ? " overlay-open" : " ") + " offcanvas__overlay"}
        onClick={() => setToggleMenu(false)}
      ></div>
      <div className="offcanvas__overlay-white"></div>
      <header>
        <div
          id="header-sticky"
          className={
            isHomePage
              ? (scrolled ? " sticky" : " is-home-initial") + " header__area-3 header__transparent"
              : " sticky header__area-3"
          }
        >
          <div className="container-fluid" style={{ maxWidth: 1580 }}>
            <div className="row align-items-center justify-content-between flex-nowrap">
              <div className="col-auto">
                <div className="header__logo">
                  <Link href={toLocalizedHref("/")}>
                    <SiteLogo
                      variant={isHomePage && !scrolled ? "light" : "dark"}
                      alt={companyBrand?.shortName || "Ensotek"}
                      className="header-logo__img"
                    />
                  </Link>
                </div>
              </div>
              <div
                className={`col d-none d-xl-block header__nav-desktop${menuFits ? "" : " header__nav-hidden"}`}
                style={{ minWidth: 0 }}
              >
                <div className="menu__main-wrapper-3 d-flex justify-content-center">
                  <div className="main-menu main-menu-3">
                    <nav id="mobile-menu" ref={navRef}>
                      {renderDesktopMenu(displayMenu)}
                    </nav>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <div className="header__right d-flex align-items-center justify-content-end">
                  {isLoggedIn && (
                    <div className={`position-relative d-none ${menuFits ? "d-xl-block" : ""} me-2`}>
                      <button
                        className="d-flex align-items-center justify-content-center border-0 bg-white shadow-sm p-0"
                        aria-label="Open account menu"
                        onClick={() => setShowUserMenu((prev) => !prev)}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={userAvatarSrc}
                          alt={userDisplayName}
                          width={44}
                          height={44}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </button>
                      {showUserMenu && (
                        <div
                          className="position-absolute bg-white shadow border rounded p-2"
                          style={{ right: 0, top: "calc(100% + 10px)", minWidth: 180, zIndex: 100002 }}
                        >
                          <Link
                            href={toLocalizedHref("/dashboard")}
                            className="d-block px-3 py-2 rounded text-dark"
                            onClick={() => setShowUserMenu(false)}
                          >
                            {t("dashboard")}
                          </Link>
                          <Link
                            href={toLocalizedHref("/profile")}
                            className="d-block px-3 py-2 rounded text-dark"
                            onClick={() => setShowUserMenu(false)}
                          >
                            {t("profile")}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`header__hamburger d-none ${menuFits ? "d-xl-block" : ""} ml-20`}>
                    <button
                      className="humbager__icon sidebar__active"
                      aria-label="Open menu"
                      onClick={handleToggleMenu}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="24"
                        viewBox="0 0 28 24"
                        fill="none"
                      >
                        <circle cx="2" cy="2" r="2" transform="translate(0 0)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(12 0)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(24 0)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(0 10)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(12 10)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(24 10)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(0 20)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(12 20)" fill="#828282" />
                        <circle cx="2" cy="2" r="2" transform="translate(24 20)" fill="#828282" />
                      </svg>
                    </button>
                  </div>
                  <div className={`header__toggle ${menuFits ? "d-xl-none" : ""}`}>
                    <button
                      className="sidebar__active"
                      aria-label="Toggle Sidebar"
                      onClick={handleToggleMenu}
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
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
