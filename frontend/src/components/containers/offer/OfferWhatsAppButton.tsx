// =============================================================
// FILE: src/components/containers/offer/OfferWhatsAppButton.tsx
// Ensotek – WhatsApp CTA Button
//  - i18n PATTERN: useLocaleShort + useUiSection (UI DB) + EN-only fallback
//  - locale prop kaldırıldı (tek kaynak: useLocaleShort)
//  - phone normalize: + / 00 / boşluk / parantez vb. temizlenir
//  - message opsiyonel; verilmezse UI DB default mesaj kullanılır
// =============================================================

'use client';

import React, { useMemo } from 'react';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

export type OfferWhatsAppButtonProps = {
  /** Uluslararası formatta hedef telefon: +90..., 0049..., 49..., vb. olabilir */
  phone: string;

  /** Önceden doldurulacak mesaj (opsiyonel). Verilirse DB mesajını override eder. */
  message?: string;

  /** Link className */
  className?: string;

  /** Button label override (opsiyonel). Verilmezse DB label kullanılır. */
  children?: React.ReactNode;
};

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * wa.me için sadece digits gerekiyor.
 * - "+90 5xx..." -> "905xx..."
 * - "0049 15..." -> "4915..."
 * - " (0)..." -> digits kalır
 */
function normalizeWaDigits(rawPhone: string): string {
  const s = safeStr(rawPhone);
  if (!s) return '';
  // 00 prefix'i genelde uluslararası format; wa.me zaten digits bekliyor
  // burada sadece digits'e indiriyoruz
  return s.replace(/[^\d]/g, '');
}

export const OfferWhatsAppButton: React.FC<OfferWhatsAppButtonProps> = ({
  phone,
  message,
  className,
  children,
}) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_offer', locale as any);

  const t = useMemo(
    () => (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  const cleanedPhone = useMemo(() => normalizeWaDigits(phone), [phone]);

  // DB default mesaj (EN fallback only)
  const defaultMessage = useMemo(
    () =>
      t(
        'ui_offer_whatsapp_default_message',
        'Hello, I would like to get more information and a quotation about your services.',
      ),
    [t],
  );

  const label = useMemo(() => t('ui_offer_whatsapp_button_label', 'Write via WhatsApp'), [t]);

  const text = useMemo(
    () => encodeURIComponent(message || defaultMessage),
    [message, defaultMessage],
  );

  // Telefon boşsa link üretmeyelim (UX güvenliği)
  const href = useMemo(() => {
    if (!cleanedPhone) return '#';
    return `https://wa.me/${cleanedPhone}?text=${text}`;
  }, [cleanedPhone, text]);

  const finalClass = className ?? 'tp-btn w-100 text-center';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={finalClass}
      aria-disabled={!cleanedPhone}
      onClick={(e) => {
        if (!cleanedPhone) e.preventDefault();
      }}
    >
      {children ?? label}
    </a>
  );
};

export default OfferWhatsAppButton;
