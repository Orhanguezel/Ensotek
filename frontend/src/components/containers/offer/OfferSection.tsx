// =============================================================
// FILE: src/components/containers/offer/OfferSection.tsx
// Ensotek – Teklif Formu Bölümü – UI DB’den
// =============================================================

"use client";

import React from "react";
import Link from "next/link";
import { OfferPublicForm } from "./OfferPublicForm";

// i18n UI
import { useUiSection } from "@/i18n/uiDb";

export type OfferSectionContext = "product" | "service" | "general";

export type OfferSectionProps = {
    locale: string;

    productId?: string;
    productName?: string | null;

    contextType?: OfferSectionContext;
};

export const OfferSection: React.FC<OfferSectionProps> = ({
    locale,
    productId,
    productName,
    contextType,
}) => {

    const { ui } = useUiSection("ui_offer", locale);

    const effectiveContext: OfferSectionContext =
        contextType ?? (productId ? "product" : "general");

    const offerHref = `/${locale}/offer`;

    const heading = ui(
        effectiveContext === "product"
            ? "ui_offer_heading_product"
            : effectiveContext === "service"
                ? "ui_offer_heading_service"
                : "ui_offer_heading_general",
        effectiveContext === "product"
            ? locale === "tr"
                ? "Bu ürün için teklif isteyin"
                : "Request a quote for this product"
            : effectiveContext === "service"
                ? locale === "tr"
                    ? "Bu hizmet için teklif isteyin"
                    : "Request a quote for this service"
                : locale === "tr"
                    ? "Teklif isteyin"
                    : "Request a quote"
    );

    const intro = ui(
        effectiveContext === "product"
            ? "ui_offer_intro_product"
            : effectiveContext === "service"
                ? "ui_offer_intro_service"
                : "ui_offer_intro_general",
        effectiveContext === "product"
            ? locale === "tr"
                ? "Bu ürün için özel teklif talebi oluşturabilirsiniz."
                : "Fill in the form to request a tailored quotation for this product."
            : effectiveContext === "service"
                ? locale === "tr"
                    ? "Bu hizmet için özel teklif talebi oluşturabilirsiniz."
                    : "Fill in the form to request a tailored quotation for this service."
                : locale === "tr"
                    ? "İhtiyaçlarınıza özel teklif talep edebilirsiniz."
                    : "Request a tailored quotation for your needs."
    );

    const buttonLabel = ui(
        effectiveContext === "product"
            ? "ui_offer_button_product"
            : effectiveContext === "service"
                ? "ui_offer_button_service"
                : "ui_offer_button_general",
        effectiveContext === "product"
            ? locale === "tr"
                ? "Teklif sayfasına git"
                : "Go to offer page"
            : effectiveContext === "service"
                ? locale === "tr"
                    ? "Teklif sayfasına git"
                    : "Go to offer page"
                : locale === "tr"
                    ? "Teklif iste"
                    : "Request an offer"
    );

    return (
        <section className="my-4">
            <div className="row">
                <div className="col-12 mb-3">
                    <h3 className="h5 mb-1">{heading}</h3>
                    <p className="text-muted small mb-0">{intro}</p>

                    <div className="mt-2">
                        <Link href={offerHref} className="btn btn-primary btn-sm">
                            {buttonLabel}
                        </Link>
                    </div>
                </div>

                <div className="col-12">
                    <OfferPublicForm
                        locale={locale}
                        productId={productId ?? null}
                        productName={productName ?? null}
                    />
                </div>
            </div>
        </section>
    );
};
