// =============================================================
// FILE: src/components/public/ContactCtaCard.tsx
// Ensotek – Reusable Contact CTA Card (I18N + settings-driven)
// - Matches InfoContactCard visual frame/spacing (sidebar__contact pattern)
// - Reads phone/whatsapp from site_settings
// - Provides tel / wa links + /contact navigation
// - NO tailwind / NO styled-jsx / NO inline styles
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';
import { pickSettingValue, useSiteSettingsContext } from '@/layout/SiteSettingsContext';

// Icons (same family as InfoContactCard)
import PhoneIcon from 'public/img/svg/call.svg';
import MailIcon from 'public/img/svg/mail.svg';
import WhatsAppIcon from 'public/img/svg/whatsapp.svg';

type Props = {
  className?: string;

  title: string;
  description?: string;

  phoneLabel?: string; // e.g. "Telefon"
  whatsappLabel?: string; // e.g. "WhatsApp"
  formLabel?: string; // e.g. "İletişim Formu"

  contactHref?: string; // default: /contact
};

const sanitizePhoneDigits = (s: string) =>
  String(s || '')
    .replace(/[^\d+]/g, '')
    .replace(/\s+/g, '');

const buildTelHref = (raw: string): string => {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('tel:')) return trimmed;

  const cleaned = sanitizePhoneDigits(trimmed);
  if (!cleaned) return '';
  // tel: can include +
  return cleaned.startsWith('+') ? `tel:${cleaned}` : `tel:+${cleaned}`;
};

const buildWhatsappHref = (raw: string): string => {
  const cleaned = sanitizePhoneDigits(raw).replace(/^\+/, '');
  if (!cleaned) return '';
  return `https://wa.me/${cleaned}`;
};

function asText(v: any): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  try {
    return String(v);
  } catch {
    return '';
  }
}

function safeSettingString(v: any): string {
  if (v == null) return '';
  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return '';
    try {
      const parsed = JSON.parse(s);
      if (typeof parsed === 'string') return parsed.trim();
      return asText(parsed).trim();
    } catch {
      return s;
    }
  }
  return asText(v).trim();
}

const ContactCtaCard: React.FC<Props> = ({
  className,
  title,
  description,

  phoneLabel = 'Telefon',
  whatsappLabel = 'WhatsApp',
  formLabel = 'İletişim Formu',

  contactHref = '/contact',
}) => {
  const settingsCtx = useSiteSettingsContext();

  const phoneDisplayQ = useGetSiteSettingByKeyQuery(
    { key: 'contact_phone_display' },
    { skip: !!settingsCtx },
  );
  const phoneTelQ = useGetSiteSettingByKeyQuery(
    { key: 'contact_phone_tel' },
    { skip: !!settingsCtx },
  );
  const waLinkQ = useGetSiteSettingByKeyQuery(
    { key: 'contact_whatsapp_link' },
    { skip: !!settingsCtx },
  );

  const phoneDisplayValue = settingsCtx
    ? pickSettingValue(settingsCtx, 'contact_phone_display')
    : (phoneDisplayQ.data as any)?.value;

  const phoneTelValue = settingsCtx
    ? pickSettingValue(settingsCtx, 'contact_phone_tel')
    : (phoneTelQ.data as any)?.value;

  const whatsappLinkValue = settingsCtx
    ? pickSettingValue(settingsCtx, 'contact_whatsapp_link')
    : (waLinkQ.data as any)?.value;

  const phoneDisplay = useMemo(() => {
    const s = safeSettingString(phoneDisplayValue);
    return s;
  }, [phoneDisplayValue]);

  const phoneRaw = useMemo(() => {
    const s = safeSettingString(phoneTelValue);
    return s || phoneDisplay;
  }, [phoneTelValue, phoneDisplay]);

  const telHref = useMemo(() => buildTelHref(phoneRaw), [phoneRaw]);

  const waHref = useMemo(() => {
    const explicit = safeSettingString(whatsappLinkValue);
    return explicit || buildWhatsappHref(phoneRaw);
  }, [whatsappLinkValue, phoneRaw]);

  const hasAny = !!phoneDisplay || !!telHref || !!waHref || !!contactHref || !!description;

  if (!hasAny) return null;

  return (
    <div className={className ? className : ''}>
      <div className="sidebar__contact">
        <div className="sidebar__contact-title mb-35">
          <h3>{title}</h3>
        </div>

        <div className="sidebar__contact-inner">
          {description ? <p className="mb-20">{description}</p> : null}

          {/* Phone (same row style) */}
          {phoneDisplay ? (
            <div className="sidebar__contact-item">
              <div className="sideber__contact-icon">
                <Image src={PhoneIcon} alt="Phone" />
              </div>
              <div className="sideber__contact-text">
                <span>
                  {phoneLabel ? <strong>{phoneLabel}:</strong> : null}{' '}
                  {telHref ? <a href={telHref}>{phoneDisplay}</a> : phoneDisplay}
                </span>
              </div>
            </div>
          ) : null}

          {/* WhatsApp row */}
          {waHref ? (
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

          {/* CTA Buttons (match InfoContactCard buttons) */}
          <div className="mt-20">
            {waHref ? (
              <a className="tp-btn w-100 mb-10" href={waHref} target="_blank" rel="noreferrer">
                {whatsappLabel}
              </a>
            ) : null}

            {telHref ? (
              <a className="tp-btn tp-btn-2 w-100 mb-10" href={telHref}>
                {phoneLabel}
              </a>
            ) : null}

            {contactHref ? (
              <Link className="tp-btn tp-btn-2 w-100" href={contactHref}>
                <span className="d-inline-flex align-items-center">
                  <span className="mr-10 d-inline-flex">
                    <Image src={MailIcon} alt="Contact" />
                  </span>
                  {formLabel}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCtaCard;
