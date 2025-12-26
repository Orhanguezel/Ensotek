// =============================================================
// FILE: src/components/containers/footer/Footer.tsx
// CHANGE: add socialsSetting + Social section icon-render
// =============================================================
'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  useGetSiteSettingByKeyQuery,
  useListFooterSectionsQuery,
  useListMenuItemsQuery,
} from '@/integrations/rtk/hooks';

import type { FooterSectionDto } from '@/integrations/types/footer_sections.types';
import type { PublicMenuItemDto } from '@/integrations/types/menu_items.types';
import { localizePath } from '@/i18n/url';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

import SocialLinks from '@/components/common/SocialLinks';

const IMG_W = 160;
const IMG_H = 60;

const isExternalHref = (href: string) =>
  /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href) || /^#/i.test(href);

const Footer: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_footer', locale);

  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({ key: 'contact_info', locale });
  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({
    key: 'company_brand',
    locale,
  });

  // ✅ socials settings (locale-aware)
  const { data: socialsSetting } = useGetSiteSettingByKeyQuery({ key: 'socials', locale });

  const { brandName, phone, email, website, logoUrl, addrLines, socials } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;
    const socialsVal = (socialsSetting?.value ?? {}) as Record<string, string>;

    const name = (brandVal.name as string) || (contact.companyName as string) || 'Ensotek';
    const site =
      (brandVal.website as string) || (contact.website as string) || 'https://ensotek.de';

    const phoneVal =
      (brandVal.phone as string | undefined) ||
      (Array.isArray(contact.phones) ? (contact.phones[0] as string | undefined) : undefined) ||
      (contact.whatsappNumber as string | undefined) ||
      '+90 212 000 00 00';

    const emailVal =
      (brandVal.email as string | undefined) ||
      (contact.email as string | undefined) ||
      'info@ensotek.com';

    const mergedSocials: Record<string, string> = {
      ...(brandVal.socials as Record<string, string> | undefined),
      ...socialsVal,
    };

    const logoObj = (brandVal.logo ||
      (Array.isArray(brandVal.images) ? brandVal.images[0] : null) ||
      {}) as {
      url?: string;
      width?: number;
      height?: number;
    };

    const logo =
      (logoObj.url && String(logoObj.url).trim()) ||
      'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

    const addrLinesComputed: string[] = [];
    if (contact.address) addrLinesComputed.push(String(contact.address));
    if (contact.addressSecondary) addrLinesComputed.push(String(contact.addressSecondary));

    return {
      brandName: name,
      phone: phoneVal?.trim() || '',
      email: emailVal?.trim() || '',
      website: site?.trim() || '',
      logoUrl: logo,
      addrLines: addrLinesComputed,
      socials: mergedSocials,
    };
  }, [contactInfoSetting?.value, companyBrandSetting?.value, socialsSetting?.value]);

  const websiteHref = website
    ? /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`
    : '';
  const telHref = phone ? `tel:${phone.replace(/\s+/g, '')}` : '';
  const mailHref = email ? `mailto:${email}` : '';

  const { data: footerSections } = useListFooterSectionsQuery({
    is_active: true,
    order: 'display_order.asc',
    locale,
  });

  const sections: FooterSectionDto[] = useMemo(() => {
    return (footerSections ?? [])
      .slice()
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [footerSections]);

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

  // ✅ Social section detection (by slug/title) – no hard IDs
  const isSocialSection = (sec: FooterSectionDto) => {
    const s = `${sec.slug || ''}`.toLowerCase();
    const t = `${sec.title || ''}`.toLowerCase();
    return s === 'social' || s === 'sosyal' || t.includes('social') || t.includes('sosyal');
  };

  const sectionColClass =
    sections.length >= 4
      ? 'col-xl-2 col-lg-3 col-md-6 col-sm-6'
      : 'col-xl-3 col-lg-3 col-md-6 col-sm-6';

  return (
    <footer>
      <section className="footer__border grey__bg pt-115 pb-60">
        <div className="container">
          <div className="row">
            {/* DİNAMİK: Tüm footer_sections */}
            {sections.map((sec) => {
              const isSocial = isSocialSection(sec);
              const items = itemsBySectionId.get(sec.id) ?? [];

              return (
                <div key={sec.id} className={sectionColClass}>
                  <div className="footer__widget mb-55">
                    <div className="footer__title">
                      <h3>{sec.title || sec.slug || ui('ui_footer_section', 'Links')}</h3>
                    </div>

                    <div className="footer__link">
                      {isSocial ? (
                        // ✅ Social: icons only (no text)
                        <SocialLinks socials={socials} size="md" />
                      ) : (
                        <ul>{items.map(renderMenuItem)}</ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Contact – site_settings (her zaman en sonda) */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget mb-55">
                <div className="footer__title">
                  <h3>{ui('ui_footer_contact', 'Contact')}</h3>
                </div>
                <div className="footer__link">
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
                    style={{ width: 'auto', height: 'auto', maxWidth: IMG_W, maxHeight: IMG_H }}
                    loading="lazy"
                  />
                ) : null}
              </Link>
            </div>

            <div className="copyright__text">
              <p>
                {ui('ui_footer_copyright_prefix', 'Copyright')} © {new Date().getFullYear()}{' '}
                {brandName} {ui('ui_footer_copyright_suffix', 'All rights reserved.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
