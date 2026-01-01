// =============================================================
// FILE: src/components/containers/footer/FooterFive.tsx
// Ensotek – Alternative Footer (Template v5 + DB-backed sections)
// - 3 kolon: footer_sections (display_order sırasıyla)
// - 1 kolon: Contact (site_settings.contact_info / company_brand)
// - Alt satır: SiteLogo + dinamik copyright
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

import { SiteLogo } from '@/components/layout/SiteLogo';

import {
  useGetSiteSettingByKeyQuery,
  useListFooterSectionsQuery,
  useListMenuItemsQuery,
} from '@/integrations/rtk/hooks';

import type { FooterSectionDto } from '@/integrations/types/footer_sections.types';
import type { PublicMenuItemDto } from '@/integrations/types/menu_items.types';

import { useResolvedLocale } from '@/i18n/locale';
import { localizePath } from '@/i18n/url';
import { useUiSection } from '@/i18n/uiDb';

const isExternalHref = (href: string) =>
  /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href) || /^#/i.test(href);

const FooterFive: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_footer', locale);

  // ---------- site_settings: brand + contact + socials ----------
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({
    key: 'contact_info',
    locale,
  });

  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({
    key: 'company_brand',
    locale,
  });

  const { data: socialsSetting } = useGetSiteSettingByKeyQuery({
    key: 'socials',
    locale,
  });

  const { brandName, phone, email, website, addrLines } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;

    const name = (brandVal.name as string) || (contact.companyName as string) || 'Ensotek';

    const site =
      (brandVal.website as string) || (contact.website as string) || 'https://ensotek.de';

    const phoneVal =
      (brandVal.phone as string | undefined) ||
      (Array.isArray(contact.phones) ? (contact.phones[0] as string | undefined) : undefined) ||
      (contact.whatsappNumber as string | undefined) ||
      '';

    const emailVal =
      (brandVal.email as string | undefined) || (contact.email as string | undefined) || '';

    const addrLinesComputed: string[] = [];
    if (contact.address) addrLinesComputed.push(String(contact.address));
    if (contact.addressSecondary) addrLinesComputed.push(String(contact.addressSecondary));

    return {
      brandName: name,
      phone: (phoneVal || '').trim(),
      email: (emailVal || '').trim(),
      website: (site || '').trim(),
      addrLines: addrLinesComputed,
    };
  }, [contactInfoSetting?.value, companyBrandSetting?.value]);

  const websiteHref = website
    ? /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`
    : '';

  const telHref = phone ? `tel:${phone.replace(/\s+/g, '')}` : '';
  const mailHref = email ? `mailto:${email}` : '';

  // ---------- footer_sections ----------
  const { data: footerSections } = useListFooterSectionsQuery({
    is_active: true,
    order: 'display_order.asc',
    locale,
  });

  const sections: FooterSectionDto[] = useMemo(
    () =>
      (footerSections ?? [])
        .slice()
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [footerSections],
  );

  // İlk 3 section’ı bu template’teki 3 kolona dağıtacağız
  const section1 = sections[0];
  const section2 = sections[1];
  const section3 = sections[2];

  // ---------- menu_items(location='footer') ----------
  const { data: footerMenuData } = useListMenuItemsQuery({
    location: 'footer',
    is_active: true,
    locale,
  });

  const footerMenuItems: PublicMenuItemDto[] = useMemo(
    () => footerMenuData?.items ?? [],
    [footerMenuData],
  );

  const itemsBySectionId = useMemo(() => {
    const m = new Map<string, PublicMenuItemDto[]>();

    for (const item of footerMenuItems) {
      const sid = ((item as any).section_id ?? (item as any).sectionId) as string | undefined;
      if (!sid) continue;
      const arr = m.get(sid) ?? [];
      arr.push(item);
      m.set(sid, arr);
    }

    for (const [sid, arr] of m) {
      arr.sort((a: any, b: any) => (a.order_num ?? 0) - (b.order_num ?? 0));
      m.set(sid, arr);
    }

    return m;
  }, [footerMenuItems]);

  const renderMenuItem = (item: PublicMenuItemDto) => {
    const rawUrl = (item.url || (item as any).href || '#') as string;

    if (isExternalHref(rawUrl)) {
      const external = /^https?:\/\//i.test(rawUrl);
      return (
        <li key={item.id}>
          <a
            href={rawUrl}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {item.title || rawUrl}
          </a>
        </li>
      );
    }

    const href = localizePath(locale, rawUrl);

    return (
      <li key={item.id}>
        <Link href={href}>{item.title || rawUrl}</Link>
      </li>
    );
  };

  const renderSectionColumn = (
    sec: FooterSectionDto | undefined,
    colClass: string,
    extraWidgetClass?: string,
  ) => {
    if (!sec) return null;
    const items = itemsBySectionId.get(sec.id) ?? [];

    return (
      <div className={colClass}>
        <div className={`footer__widget mb-55 ${extraWidgetClass ?? ''}`}>
          <div className="footer__title">
            <h3>{sec.title || sec.slug || ui('ui_footer_section', 'Links')}</h3>
          </div>
          <div className="footer__link">
            <ul>{items.map(renderMenuItem)}</ul>
          </div>
        </div>
      </div>
    );
  };

  const homeHref = localizePath(locale, '/');

  return (
    <footer>
      <section className="footer__border grey__bg pt-115 pb-60">
        <div className="container">
          <div className="row">
            {/* 1. kolon – footer__col-1 */}
            {renderSectionColumn(section1, 'col-xl-2 col-lg-3 col-md-6 col-sm-6', 'footer__col-1')}

            {/* 2. kolon – footer__col-2 (geniş) */}
            {renderSectionColumn(section2, 'col-xl-4 col-lg-3 col-md-6 col-sm-6', 'footer__col-2')}

            {/* 3. kolon – footer__col-3 */}
            {renderSectionColumn(section3, 'col-xl-3 col-lg-3 col-md-6 col-sm-6', 'footer__col-3')}

            {/* 4. kolon – Contact (site_settings) */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget mb-55">
                <div className="footer__title">
                  <h3>{ui('ui_footer_contact', 'Contact')}</h3>
                </div>
                <div className="footer__link footer__contact">
                  <ul>
                    {addrLines.map((ln, i) => (
                      <li key={`addr-${i}`}>
                        <span>{ln}</span>
                      </li>
                    ))}

                    {phone && (
                      <li>
                        <a href={telHref} aria-label={ui('ui_footer_phone_aria', 'Phone')}>
                          {phone}
                        </a>
                      </li>
                    )}

                    {email && (
                      <li>
                        <a href={mailHref} aria-label={ui('ui_footer_email_aria', 'Email')}>
                          {email}
                        </a>
                      </li>
                    )}

                    {websiteHref && (
                      <li>
                        <a href={websiteHref} target="_blank" rel="noopener noreferrer">
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

      {/* Alt bar – stil aynı, logo + dinamik telif */}
      <div className="footer__copyright grey-bg">
        <div className="container">
          <div className="copyright__inner">
            <div className="copyright__logo">
              <Link href={homeHref} aria-label={brandName || 'Home'}>
                <SiteLogo alt={brandName || 'Logo'} priority={false} />
              </Link>
            </div>
            <div className="copyright__text">
              <p>
                {ui('ui_footer_copyright_prefix', 'Copyright')} © {new Date().getFullYear()}{' '}
                {brandName || 'Ensotek'} {ui('ui_footer_copyright_suffix', 'All rights reserved.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterFive;
