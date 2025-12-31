// =============================================================
// FILE: src/components/common/public/InfoContactCard.tsx
// Ensotek – Reusable Contact Card (site_settings.contact_info)
// - Reads contact_info from site_settings by locale + fallbackLocale
// - Renders: description + Phone / Email / Address / WhatsApp (+ optional CTAs)
// - WhatsApp number is taken from DB (contact_info.whatsappNumber OR phones[0])
// - No inline styles / No styled-jsx
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

// Icons
import PhoneIcon from 'public/img/svg/call.svg';
import MailIcon from 'public/img/svg/mail.svg';
import LocationIcon from 'public/img/svg/location.svg';
// ✅ You need to add this asset:
// public/img/svg/whatsapp.svg
import WhatsAppIcon from 'public/img/svg/whatsapp.svg';

type ContactInfo = {
  companyName?: string;
  phones?: string[];
  email?: string;
  address?: string;
  addressSecondary?: string;
  whatsappNumber?: string;
  website?: string;
};

export type InfoContactCardProps = {
  // required
  locale: string;
  title: string;

  // optional content (UI texts from caller)
  description?: string;

  // labels (UI texts from caller)
  phoneLabel?: string;
  whatsappLabel?: string;
  formLabel?: string;

  // CTA routes
  contactHref?: string;

  // behavior
  fallbackLocale?: string; // default: 'en'
  className?: string;
  forceShow?: boolean; // show even if no data

  // optional: show/hide rows
  showEmail?: boolean; // default true
  showAddress?: boolean; // default true
  showWebsite?: boolean; // default false
  showWhatsapp?: boolean; // default true
};

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function tryParseJson<T>(v: unknown): T | null {
  try {
    if (v == null) return null;
    if (typeof v === 'object') return v as T;
    const s = safeStr(v);
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function normalizePhoneForTel(phone: string): string {
  const s = safeStr(phone);
  if (!s) return '';
  return s.replace(/[^\d+]/g, '');
}

function normalizeWhatsappNumber(phoneOrNumber: string): string {
  // wa.me expects digits only (no +)
  const s = safeStr(phoneOrNumber);
  if (!s) return '';
  return s.replace(/[^\d]/g, '');
}

const InfoContactCard: React.FC<InfoContactCardProps> = ({
  locale,
  title,

  description,

  phoneLabel = 'Telefon',
  whatsappLabel = 'WhatsApp',

  contactHref,

  fallbackLocale = 'de',
  className,
  forceShow = false,

  showEmail = true,
  showAddress = true,
  showWebsite = false,
  showWhatsapp = true,
}) => {
  const loc = safeStr(locale);

  // contact_info (target locale)
  const { data: contactTrg } = useGetSiteSettingByKeyQuery(
    { key: 'contact_info', locale: loc } as any,
    { skip: !loc },
  );

  // fallback locale
  const { data: contactFb } = useGetSiteSettingByKeyQuery(
    { key: 'contact_info', locale: fallbackLocale } as any,
    { skip: !loc || loc === fallbackLocale },
  );

  const contactInfo = useMemo<ContactInfo>(() => {
    const primary = tryParseJson<ContactInfo>((contactTrg as any)?.value ?? contactTrg);
    const fallback = tryParseJson<ContactInfo>((contactFb as any)?.value ?? contactFb);

    const ok =
      primary &&
      (primary.email ||
        (Array.isArray(primary.phones) && primary.phones.length > 0) ||
        primary.address ||
        primary.addressSecondary ||
        primary.whatsappNumber ||
        primary.website);

    return (ok ? primary : fallback) ?? {};
  }, [contactTrg, contactFb]);

  const phone = useMemo(() => {
    const arr = Array.isArray(contactInfo?.phones) ? contactInfo.phones : [];
    return safeStr(arr[0] ?? '');
  }, [contactInfo]);

  const email = useMemo(() => safeStr(contactInfo?.email ?? ''), [contactInfo]);

  const address = useMemo(() => {
    const a1 = safeStr(contactInfo?.address ?? '');
    const a2 = safeStr(contactInfo?.addressSecondary ?? '');
    return [a1, a2].filter(Boolean).join(a1 && a2 ? ' ' : '');
  }, [contactInfo]);

  const website = useMemo(() => safeStr(contactInfo?.website ?? ''), [contactInfo]);

  // WhatsApp number from DB first; fallback to phone
  const whatsappNumber = useMemo(() => {
    const raw = safeStr(contactInfo?.whatsappNumber ?? '') || phone;
    return normalizeWhatsappNumber(raw);
  }, [contactInfo, phone]);

  const telHref = useMemo(() => {
    const n = normalizePhoneForTel(phone);
    return n ? `tel:${n}` : '';
  }, [phone]);

  const mailHref = useMemo(() => {
    const e = safeStr(email);
    return e ? `mailto:${e}` : '';
  }, [email]);

  const waHref = useMemo(() => {
    if (!whatsappNumber) return '';
    return `https://wa.me/${whatsappNumber}`;
  }, [whatsappNumber]);

  const hasAny =
    !!safeStr(description) ||
    !!phone ||
    (showEmail && !!email) ||
    (showAddress && !!address) ||
    (showWebsite && !!website) ||
    (showWhatsapp && !!whatsappNumber) ||
    !!safeStr(contactHref);

  if (!forceShow && !hasAny) return null;

  return (
    <div className={className ? className : ''}>
      <div className="sidebar__contact">
        <div className="sidebar__contact-title mb-35">
          <h3>{title}</h3>
        </div>

        <div className="sidebar__contact-inner">
          {safeStr(description) ? <p className="mb-20">{safeStr(description)}</p> : null}

          {/* Phone */}
          {phone ? (
            <div className="sidebar__contact-item">
              <div className="sideber__contact-icon">
                <Image src={PhoneIcon} alt="Phone" />
              </div>
              <div className="sideber__contact-text">
                <span>
                  {phoneLabel ? <strong>{phoneLabel}:</strong> : null}{' '}
                  {telHref ? <a href={telHref}>{phone}</a> : phone}
                </span>
              </div>
            </div>
          ) : null}

          {/* Email */}
          {showEmail && email ? (
            <div className="sidebar__contact-item">
              <div className="sideber__contact-icon">
                <Image src={MailIcon} alt="Email" />
              </div>
              <div className="sideber__contact-text">
                <span>{mailHref ? <a href={mailHref}>{email}</a> : email}</span>
              </div>
            </div>
          ) : null}

          {/* Address */}
          {showAddress && address ? (
            <div className="sidebar__contact-item">
              <div className="sideber__contact-icon">
                <Image src={LocationIcon} alt="Location" />
              </div>
              <div className="sideber__contact-text">
                <span>{address}</span>
              </div>
            </div>
          ) : null}

          {/* WhatsApp (✅ same pattern with icon) */}
          {showWhatsapp && waHref ? (
            <div className="sidebar__contact-item">
              <div className="sideber__contact-icon">
                <Image src={WhatsAppIcon} alt="WhatsApp" />
              </div>
              <div className="sideber__contact-text">
                <span>
                  <a href={waHref} target="_blank" rel="noreferrer">
                    {whatsappLabel}
                  </a>
                </span>
              </div>
            </div>
          ) : null}

          {/* Website (optional) */}
          {showWebsite && website ? (
            <div className="sidebar__contact-item">
              <div className="sideber__contact-text">
                <span>
                  <a href={website} target="_blank" rel="noreferrer">
                    {website}
                  </a>
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InfoContactCard;
