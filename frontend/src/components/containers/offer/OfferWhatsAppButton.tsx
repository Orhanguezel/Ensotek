// =============================================================
// FILE: src/components/containers/offer/OfferWhatsAppButton.tsx
// Ensotek – WhatsApp CTA Butonu
// =============================================================

"use client";

import React from "react";

export type OfferWhatsAppButtonProps = {
    locale: string;
    /** Uluslararası format: +90... şeklinde */
    phone: string;
    /** Önceden doldurulacak mesaj (opsiyonel) */
    message?: string;
    className?: string;
    children?: React.ReactNode;
};

export const OfferWhatsAppButton: React.FC<OfferWhatsAppButtonProps> = ({
    locale,
    phone,
    message,
    className,
    children,
}) => {
    const isTr = locale === "tr";

    const cleanedPhone = phone.replace(/[^\d]/g, "");

    const defaultMessage = isTr
        ? "Merhaba, hizmetleriniz hakkında bilgi ve fiyat teklifi almak istiyorum."
        : "Hello, I would like to get more information and a quotation about your services.";

    const text = encodeURIComponent(message || defaultMessage);
    const href = `https://wa.me/${cleanedPhone}?text=${text}`;

    const defaultLabel = isTr ? "WhatsApp ile yazın" : "Write via WhatsApp";

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className ?? "tp-btn w-100 text-center"}
        >
            {children ?? defaultLabel}
        </a>
    );
};
