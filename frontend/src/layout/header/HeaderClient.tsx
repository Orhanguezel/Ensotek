// src/components/layout/header/HeaderClient.tsx
'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { type StaticImageData } from 'next/image';

import HeaderOffcanvas from './HeaderOffcanvas';
import { SiteLogo } from '@/layout/SiteLogo';

import { useListMenuItemsQuery, useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';
import type { PublicMenuItemDto } from '@/integrations/types';

import { localizePath } from '@/i18n/url';
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { pickSettingValue, useSiteSettingsContext } from '@/layout/SiteSettingsContext';

type SimpleBrand = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: Record<string, string>;
};

type Props = { brand?: SimpleBrand; logoSrc?: StaticImageData | string };

// Menü item + children (dropdown için local type)
type MenuItemWithChildren = PublicMenuItemDto & {
  children?: MenuItemWithChildren[];
};

const HeaderClient: React.FC<Props> = ({ brand, logoSrc }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // ✅ Tek kaynak: runtime locale resolver (app_locales + default + url/cookie)
  const locale = useResolvedLocale();

  const settingsCtx = useSiteSettingsContext();

  // ✅ UI stringleri
  const { ui, raw: uiHeaderJson } = useUiSection('ui_header', locale);

  const menuEmptyLabel =
    (typeof (uiHeaderJson as any)?.menu_empty === 'string' &&
      String((uiHeaderJson as any).menu_empty).trim()) ||
    '(Menü tanımlı değil)';

  const menuLoadingLabel =
    (typeof (uiHeaderJson as any)?.menu_loading === 'string' &&
      String((uiHeaderJson as any).menu_loading).trim()) ||
    '(Menü yükleniyor...)';

  // 🔹 site_settings - locale-aware
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery(
    {
      key: 'contact_info',
      locale,
    },
    { skip: !!settingsCtx },
  );

  const { data: socialsSetting } = useGetSiteSettingByKeyQuery(
    {
      key: 'socials',
      locale,
    },
    { skip: !!settingsCtx },
  );

  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery(
    {
      key: 'company_brand',
      locale,
    },
    { skip: !!settingsCtx },
  );

  const contactInfoValue = settingsCtx
    ? pickSettingValue(settingsCtx, 'contact_info')
    : contactInfoSetting?.value;

  const socialsValue = settingsCtx
    ? pickSettingValue(settingsCtx, 'socials')
    : socialsSetting?.value;

  const companyBrandValue = settingsCtx
    ? pickSettingValue(settingsCtx, 'company_brand')
    : companyBrandSetting?.value;

  const brandFromSettings = useMemo(() => {
    const contact = (contactInfoValue ?? {}) as any;
    const socials = (socialsValue ?? {}) as Record<string, string>;
    const brandVal = (companyBrandValue ?? {}) as any;

    const name = (brandVal?.name as string) || (contact?.companyName as string) || 'ENSOTEK';

    const website =
      (brandVal?.website as string) || (contact?.website as string) || 'https://www.ensotek.de';

    const phones = Array.isArray(contact?.phones) ? contact.phones : [];
    const phone =
      (phones[0] as string | undefined) ||
      (contact?.whatsappNumber as string | undefined) ||
      (brandVal?.phone as string | undefined) ||
      '+90 212 000 00 00';

    const email = (contact?.email as string) || (brandVal?.email as string) || 'info@ensotek.com';

    const mergedSocials: Record<string, string> = {
      ...(brandVal?.socials as Record<string, string> | undefined),
      ...(socials ?? {}),
    };

    const logo = (brandVal?.logo ||
      (Array.isArray(brandVal?.images) ? brandVal.images[0] : null) ||
      {}) as { url?: string; width?: number; height?: number };

    return {
      name,
      website,
      phone,
      email,
      socials: mergedSocials,
      logo,
    };
  }, [contactInfoValue, socialsValue, companyBrandValue]);

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

  const effectiveLogo: string | StaticImageData | undefined = useMemo(() => {
    // Only use logoSrc prop if explicitly provided
    if (typeof logoSrc === 'string' && logoSrc.trim()) return logoSrc.trim();
    if (logoSrc) return logoSrc;

    // ✅ REMOVED: company_brand.logo override
    // Let SiteLogo component use site_logo from database
    return undefined;
  }, [logoSrc]);

  // Menu items – locale-aware
  const { data: menuData, isLoading: isMenuLoading } = useListMenuItemsQuery({
    location: 'header',
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

    const sortRecursive = (items: MenuItemWithChildren[]): MenuItemWithChildren[] =>
      items
        .slice()
        .sort((a, b) => {
          const ao = (a as any)?.order_num ?? 0;
          const bo = (b as any)?.order_num ?? 0;
          return ao - bo;
        })
        .map((it) => ({
          ...it,
          children: it.children ? sortRecursive(it.children as MenuItemWithChildren[]) : undefined,
        }));

    return sortRecursive(list);
  }, [menuData]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const renderDesktopMenuItem = (item: MenuItemWithChildren) => {
    const rawUrl = item.url || (item as any).href || '#';
    const href = localizePath(locale, rawUrl);
    const hasChildren = !!item.children && item.children.length > 0;

    const isNowrap = rawUrl === '/sparepart' || rawUrl === '/blog';

    if (!hasChildren) {
      return (
        <li key={item.id}>
          <Link href={href}>
            <span className={isNowrap ? 'nowrap' : undefined}>{item.title || rawUrl}</span>
          </Link>
        </li>
      );
    }

    return (
      <li key={item.id} className="has-dropdown">
        <Link href={href}>
          <span className={isNowrap ? 'nowrap' : undefined}>{item.title || rawUrl}</span>
        </Link>
        <ul className="submenu">
          {item.children!.map((child) => {
            const childRawUrl = child.url || (child as any).href || '#';
            const childHref = localizePath(locale, childRawUrl);
            const childNowrap = childRawUrl === '/sparepart' || childRawUrl === '/blog';

            return (
              <li key={child.id}>
                <Link href={childHref}>
                  <span className={childNowrap ? 'nowrap' : undefined}>
                    {child.title || childRawUrl}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    );
  };

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
          className={(scrolled ? ' sticky' : ' ') + ' header__area header__transparent'}
        >
          <div className="container">
            <div className="row align-items-center">
              {/* Logo */}
              <div className="col-xl-2 col-lg-2 col-6">
                <div className="header__logo">
                  <Link href="/" aria-label={resolvedBrand.name}>
                    <SiteLogo alt={resolvedBrand.name} overrideSrc={effectiveLogo} />
                  </Link>
                </div>
              </div>

              {/* Desktop menu */}
              <div className="col-xl-8 col-lg-9 d-none d-lg-block">
                <div className="menu__main-wrapper d-flex justify-content-center">
                  <div className="main-menu d-none d-lg-block">
                    <nav id="mobile-menu">
                      <ul className="nav-inline">
                        {headerMenuItems.map(renderDesktopMenuItem)}

                        {!headerMenuItems.length && !isMenuLoading && (
                          <li>
                            <span className="text-muted small ps-2">{menuEmptyLabel}</span>
                          </li>
                        )}

                        {isMenuLoading && (
                          <li>
                            <span className="text-muted small ps-2">{menuLoadingLabel}</span>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="col-xl-2 col-lg-1 col-6">
                <div className="header__right d-flex align-items-center justify-content-end">
                  <div className="header__hamburger ml-60 d-none d-lg-inline-flex">
                    <button
                      className="humbager__icon sidebar__active"
                      aria-label={ui('ui_header_open_menu', 'Open Menu')}
                      onClick={() => setOpen(true)}
                      type="button"
                    >
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
                      aria-label={ui('ui_header_open_sidebar', 'Open Sidebar')}
                      onClick={() => setOpen(true)}
                      type="button"
                    >
                      <div className="bar-icon">
                        <span />
                        <span />
                        <span />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              {/* row end */}
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default HeaderClient;
