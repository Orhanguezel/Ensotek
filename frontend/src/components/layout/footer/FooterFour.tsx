// =============================================================
// FILE: src/components/containers/footer/FooterFour.tsx
// Ensotek – Alternative Footer (Template v4 + FULL DB-backed)
// =============================================================

'use client';

import React, { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import One from 'public/img/index-4/arrow.svg';
import Two from 'public/img/index-4/footer-left.png';
import Three from 'public/img/index-4/footer-right.png';

import { SiteLogo } from '@/components/layout/SiteLogo';

import {
  useGetSiteSettingByKeyQuery,
  useListMenuItemsQuery,
  useSubscribeNewsletterMutation,
} from '@/integrations/rtk/hooks';
import type { PublicMenuItemDto } from '@/integrations/types/menu_items.types';

import { useResolvedLocale } from '@/i18n/locale';
import { localizePath } from '@/i18n/url';
import { useUiSection } from '@/i18n/uiDb';

const FooterFour: React.FC = () => {
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

  const { brandName, email, phone, addrLines, website, socials } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;
    const socialsVal = (socialsSetting?.value ?? {}) as Record<string, string>;

    const name = (brandVal?.name as string) || (contact?.companyName as string) || 'Ensotek';

    const emailVal =
      (brandVal?.email as string | undefined) || (contact?.email as string | undefined) || '';

    const phoneVal =
      (brandVal?.phone as string | undefined) ||
      (Array.isArray(contact?.phones) ? (contact.phones[0] as string | undefined) : undefined) ||
      (contact?.whatsappNumber as string | undefined) ||
      '';

    const site = (brandVal?.website as string) || (contact?.website as string) || '';

    const addrLinesComputed: string[] = [];
    if (contact?.address) addrLinesComputed.push(String(contact.address));
    if (contact?.addressSecondary) addrLinesComputed.push(String(contact.addressSecondary));

    const mergedSocials: Record<string, string> = {
      ...(brandVal?.socials as Record<string, string> | undefined),
      ...socialsVal,
    };

    return {
      brandName: name,
      email: (emailVal || '').trim(),
      phone: (phoneVal || '').trim(),
      addrLines: addrLinesComputed,
      website: (site || '').trim(),
      socials: mergedSocials,
    };
  }, [contactInfoSetting?.value, companyBrandSetting?.value, socialsSetting?.value]);

  // ---------- footer menu: important links ----------

  const { data: footerMenuData } = useListMenuItemsQuery({
    location: 'footer',
    is_active: true,
    locale,
  });

  const importantLinks: PublicMenuItemDto[] = useMemo(() => {
    const items = (footerMenuData?.items ?? []) as PublicMenuItemDto[];
    // Bu template'te sadece tek kolon "important link" var; ilk 5 item kullanılıyor
    return items.slice(0, 5);
  }, [footerMenuData]);

  const renderImportantLink = (item: PublicMenuItemDto) => {
    const rawUrl = (item.url || (item as any).href || '#') as string;
    const href = localizePath(locale, rawUrl || '/');

    return (
      <Link key={item.id} href={href} className="d-block text-dark mb-3">
        {item.title || rawUrl}
      </Link>
    );
  };

  // ---------- socials: settings -> ikonlar ----------

  type SocialIcon = {
    href: string;
    iconClass: string;
  };

  const socialIcons: SocialIcon[] = useMemo(() => {
    const entries: SocialIcon[] = [];
    const s = socials || {};

    const facebookUrl = s.facebook || s.facebook_url || s.fb || s['facebook-link'] || '';
    if (facebookUrl) {
      entries.push({ href: facebookUrl, iconClass: 'fab fa-facebook-f' });
    }

    const twitterUrl = s.twitter || s.twitter_url || s.x || s['twitter-link'] || '';
    if (twitterUrl) {
      entries.push({ href: twitterUrl, iconClass: 'fab fa-twitter' });
    }

    const youtubeUrl = s.youtube || s.youtube_url || s.yt || s['youtube-link'] || '';
    if (youtubeUrl) {
      entries.push({ href: youtubeUrl, iconClass: 'fab fa-youtube' });
    }

    const instagramUrl = s.instagram || s.instagram_url || s.ig || s['instagram-link'] || '';
    if (instagramUrl) {
      entries.push({ href: instagramUrl, iconClass: 'fab fa-instagram' });
    }

    const linkedinUrl = s.linkedin || s.linkedin_url || s['linkedin-link'] || '';
    if (linkedinUrl) {
      entries.push({ href: linkedinUrl, iconClass: 'fab fa-linkedin-in' });
    }

    return entries;
  }, [socials]);

  const homeHref = localizePath(locale, '/');

  // ---------- Newsletter (RTK) ----------

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeNewsletter, { isLoading: isSubscribing }] = useSubscribeNewsletterMutation();
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);

  const onSubmitNewsletter = async (e: FormEvent) => {
    e.preventDefault();
    setNewsletterMessage(null);

    const trimmed = newsletterEmail.trim();
    if (!trimmed) {
      setNewsletterMessage(ui('ui_footer_newsletter_error', 'Please enter a valid email.'));
      return;
    }

    try {
      await subscribeNewsletter({ email: trimmed } as any).unwrap();
      setNewsletterMessage(
        ui('ui_footer_newsletter_success', 'You have been subscribed successfully.'),
      );
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMessage(
        ui('ui_footer_newsletter_fail', 'Subscription could not be completed. Please try again.'),
      );
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="row section-gap">
          {/* Contact */}
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">{ui('ui_footer_contact', 'Contact')}</h4>
            <div className="content">
              {email && <p className="mb-3">{email}</p>}
              {phone && <p>{phone}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">{ui('ui_footer_address', 'Address')}</h4>
            <div className="content">
              {addrLines.length ? (
                <p>
                  {addrLines.map((ln, i) => (
                    <React.Fragment key={i}>
                      {ln}
                      {i < addrLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ) : website ? (
                <p>{website}</p>
              ) : (
                <p>{ui('ui_footer_address_placeholder', 'Address not defined')}</p>
              )}
            </div>
          </div>

          {/* Important links */}
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">{ui('ui_footer_important_links', 'Important link')}</h4>
            <div className="content">
              {importantLinks.length ? (
                importantLinks.map(renderImportantLink)
              ) : (
                <Link href={homeHref} className="d-block text-dark mb-3">
                  {ui('ui_footer_home', 'Home')}
                </Link>
              )}
            </div>
          </div>

          {/* Newsletter – stil aynen korunuyor */}
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">{ui('ui_footer_stay_connected', 'Stay connected')}</h4>

            <form
              onSubmit={onSubmitNewsletter}
              className="align-items-center bg-white border-btn d-flex justify-content-between ps-3 borderc-btn"
            >
              <input
                className="w-100 border-0 bg-transparent py-3 "
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={ui('ui_footer_newsletter_placeholder', 'Enter mail')}
                disabled={isSubscribing}
              />
              <button
                type="submit"
                className="border-0 bg-transparent p-0 m-0 d-flex align-items-center"
                aria-label={ui('ui_footer_newsletter_submit', 'Subscribe')}
                disabled={isSubscribing}
              >
                <Image className="me-2" src={One} alt="Submit" />
              </button>
            </form>

            {newsletterMessage && <p className="mt-2 small text-muted">{newsletterMessage}</p>}
          </div>
        </div>

        {/* Alt satır: logo + telif + sosyal ikonlar (stil değişmeden) */}
        <div className="row">
          <div className="col-12">
            <div className="align-items-center d-flex flex-column flex-md-row gap-4 gap-md-0 justify-content-center justify-content-md-between mb-4 mb-md-5">
              <Link href={homeHref}>
                <SiteLogo alt={brandName || 'Logo'} className="w-100" priority={false} />
              </Link>

              <p className="copy-write">
                {ui('ui_footer_copyright_prefix', 'Copyright')} {new Date().getFullYear()}{' '}
                {brandName || 'Ensotek'} {ui('ui_footer_copyright_suffix', 'All rights reserved.')}
              </p>

              <div className="d-flex gap-4">
                {socialIcons.map((s) => (
                  <Link key={s.href} href={s.href} className="social-icon" target="_blank">
                    <i className={s.iconClass} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orijinal template’in dekoratif görselleri – stil bozulmadan */}
      <div className="footer-thumbs">
        <Image className="position-absolute left" src={Two} alt="Image" />
        <Image className="position-absolute right" src={Three} alt="Image" />
      </div>
    </footer>
  );
};

export default FooterFour;
