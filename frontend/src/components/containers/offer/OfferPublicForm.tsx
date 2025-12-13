// =============================================================
// FILE: src/components/public/offer/OfferPublicForm.tsx
// Ensotek – Public Teklif Talep Formu
//   - POST /offers (createOfferPublic)
//   - Genel / Ürün / Hizmet seçimi (DB'den)
//   - Seçimler form_data içinde detaylı saklanır
//   - Başlık / açıklama / bazı metinler: site_settings.ui_offer
// =============================================================

"use client";

import React, { useState, FormEvent, useMemo } from "react";
import { useCreateOfferPublicMutation } from "@/integrations/rtk/endpoints/offers_public.endpoints";
import type { OfferRequestPublic } from "@/integrations/types/offers.types";

// Products – public liste
import { useListProductsQuery } from "@/integrations/rtk/endpoints/products.endpoints";
import type { ProductDto } from "@/integrations/types/product.types";

// Services – public liste
import { useListServicesPublicQuery } from "@/integrations/rtk/endpoints/services.public.endpoints";
import type { ServiceDto } from "@/integrations/types/services.types";

// Newsletter – public
import {
    useSubscribeNewsletterMutation,
} from "@/integrations/rtk/endpoints/newsletter_public.endpoints";
import type { NewsletterSubscribePayload } from "@/integrations/types/newsletter.types";

// UI i18n – site_settings.ui_offer
import { useUiSection } from "@/i18n/uiDb";

export type OfferPublicFormProps = {
    // UI tarafında hangi dilde olduğumuzu biliyorsun (tr/en/de)
    locale: string;

    // Varsayılan ülke kodu (örn: "TR" veya "DE")
    defaultCountryCode?: string;

    // İlgili ürün – opsiyonel (ürün detay sayfasından gelir)
    productId?: string | null;
    productName?: string | null;

    // Submit sonrası callback (ör: "teşekkürler" modalı aç)
    onSuccess?: (offerId: string) => void;
};

type RelatedType = "general" | "product" | "service";

export const OfferPublicForm: React.FC<OfferPublicFormProps> = ({
    locale,
    defaultCountryCode = "TR",
    productId = null,
    productName = null,
    onSuccess,
}) => {
    const isTr = locale === "tr";

    const { ui } = useUiSection("ui_offer", locale);

    // -----------------------------
    // 1) Müşteri / firma bilgileri
    // -----------------------------
    const [companyName, setCompanyName] = useState("");
    const [customerName, setCustomerName] = useState(""); // Yetkili
    const [contactRole, setContactRole] = useState(""); // Görevi
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [countryCode, setCountryCode] = useState(defaultCountryCode);

    // -----------------------------
    // 2) Teknik / kule / hizmet bilgileri
    // -----------------------------
    const [towerProcess, setTowerProcess] = useState(""); // Kule / hizmet prosesi
    const [towerCity, setTowerCity] = useState(""); // İl
    const [towerDistrict, setTowerDistrict] = useState(""); // İlçe
    const [waterFlowM3h, setWaterFlowM3h] = useState(""); // Saatlik su debisi
    const [inletTemp, setInletTemp] = useState(""); // Giriş sıcaklığı
    const [outletTemp, setOutletTemp] = useState(""); // Çıkış sıcaklığı
    const [wetBulbTemp, setWetBulbTemp] = useState(""); // Yaş termometre
    const [capacity, setCapacity] = useState(""); // Kapasite (kcal/h, kW)
    const [waterQuality, setWaterQuality] = useState(""); // Su kalitesi
    const [poolType, setPoolType] = useState(""); // Havuz durumu
    const [towerLocation, setTowerLocation] = useState(""); // Konulacağı yer
    const [existingTowerInfo, setExistingTowerInfo] = useState(""); // Mevcut kule
    const [referralSource, setReferralSource] = useState(""); // Bizi nereden tanıyorsunuz
    const [extraNotes, setExtraNotes] = useState(""); // Mesaj / ek notlar (genel için de kullanılıyor)

    // KVKK / izin
    const [consentMarketing, setConsentMarketing] = useState(false);
    const [consentTerms, setConsentTerms] = useState(false);

    const [createOffer, { isLoading, isError, isSuccess }] =
        useCreateOfferPublicMutation();

    const [subscribeNewsletter] = useSubscribeNewsletterMutation();

    const [submittedId, setSubmittedId] = useState<string | null>(null);

    // -----------------------------
    // 3) İlgili ürün / hizmet seçimi
    // -----------------------------

    const isLockedToProduct = Boolean(productId); // Ürün detay sayfasından geliyorsa kilitli
    const [relatedType, setRelatedType] = useState<RelatedType>(
        isLockedToProduct ? "product" : "general",
    );

    const [selectedProductId, setSelectedProductId] = useState<string>(
        productId ?? "",
    );
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");

    // Query param'larını locale'e göre hazırlayalım (RTK Query için stable olsun)
    const productQueryParams = useMemo(
        () => ({ locale }),
        [locale],
    );

    const servicesQueryParams = useMemo(
        () => ({ locale, default_locale: locale }),
        [locale],
    );

    // Ürün listesi (kule + yedek parça hepsi products tablosundan)
    const {
        data: productListResp,
        isLoading: isProductsLoading,
        isError: isProductsError,
    } = useListProductsQuery(productQueryParams);

    const productItems: ProductDto[] = useMemo(
        () => productListResp?.items ?? [],
        [productListResp],
    );

    // Hizmet listesi (mühendislik, revizyon, bakım vs.)
    const {
        data: serviceListResp,
        isLoading: isServicesLoading,
        isError: isServicesError,
    } = useListServicesPublicQuery(servicesQueryParams);

    const serviceItems: ServiceDto[] = useMemo(
        () => serviceListResp?.items ?? [],
        [serviceListResp],
    );

    // Seçilen product / service'in adını kolay almak için
    const selectedProduct = useMemo(
        () =>
            productItems.find(
                (p) => p.id === (productId ?? selectedProductId),
            ),
        [productItems, productId, selectedProductId],
    );

    const selectedService = useMemo(
        () => serviceItems.find((s) => s.id === selectedServiceId),
        [serviceItems, selectedServiceId],
    );

    // -----------------------------
    // UI – DB’den gelen ana metinler
    // -----------------------------

    const formHeading = ui(
        "ui_offer_form_heading",
        isTr ? "Teklif Talep Formu" : "Request an Offer",
    );

    const formIntro = ui(
        "ui_offer_form_intro",
        isTr
            ? "Firmanız ve talebiniz ile ilgili bilgileri paylaşın; en kısa sürede size özel teklif ile dönüş yapalım."
            : "Share details about your company and request; we will get back to you with a tailored quotation.",
    );

    const radioGeneralLabel = ui(
        "ui_offer_form_radio_general",
        isTr ? "Genel teklif" : "General quote",
    );

    const radioProductLabel = ui(
        "ui_offer_form_radio_product",
        isTr ? "Ürün / Yedek Parça" : "Product / Spare Part",
    );

    const radioServiceLabel = ui(
        "ui_offer_form_radio_service",
        isTr ? "Hizmet (Mühendislik / Revizyon)" : "Service (Engineering / Retrofit)",
    );

    const generalIntroText = ui(
        "ui_offer_form_general_text",
        isTr
            ? "Genel teklif talebinizi kısaca açıklayınız."
            : "Please describe your general quotation request.",
    );

    const productIntroText = ui(
        "ui_offer_form_product_text",
        isTr
            ? "İhtiyaç duyduğunuz kule ile ilgili teknik bilgileri doldurunuz."
            : "Please fill in the technical details of the cooling tower you need.",
    );

    const serviceIntroText = ui(
        "ui_offer_form_service_text",
        isTr
            ? "Talep ettiğiniz hizmet ile ilgili bilgileri doldurunuz."
            : "Please fill in the details for the requested service.",
    );

    const errorText = ui(
        "ui_offer_form_error",
        isTr
            ? "Teklif talebi gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
            : "An error occurred while submitting your request. Please try again later.",
    );

    const successPrefix = ui(
        "ui_offer_form_success",
        isTr
            ? "Teklif talebiniz alındı. Referans numarası: "
            : "Your request has been received. Reference no: ",
    );

    const submitLabel = ui(
        "ui_offer_form_submit",
        isTr ? "Teklif Talep Et" : "Request an Offer",
    );

    const submittingLabel = ui(
        "ui_offer_form_submitting",
        isTr ? "Gönderiliyor..." : "Submitting...",
    );

    const kvkkLabel = ui(
        "ui_offer_form_kvkk_label",
        isTr
            ? "KVKK / gizlilik politikası ve kullanım şartlarını okudum, kabul ediyorum. (zorunlu)"
            : "I have read and accept the privacy policy and terms of use (mandatory).",
    );

    const marketingLabel = ui(
        "ui_offer_form_marketing_label",
        isTr
            ? "Kampanya ve bilgilendirme e-postaları almak istiyorum. (opsiyonel)"
            : "I would like to receive promotional and information e-mails (optional).",
    );

    const kvkkAlertText = ui(
        "ui_offer_form_kvkk_alert",
        isTr
            ? "Lütfen KVKK / şartlar onayını işaretleyin."
            : "Please accept the privacy terms.",
    );

    // -----------------------------
    // Submit
    // -----------------------------
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        if (!consentTerms) {
            alert(kvkkAlertText);
            return;
        }

        // Ürün ID'sini efektif olarak belirle:
        // - Ürün detay sayfasından geldiyse productId sabit
        // - Normal /offer sayfasında "Ürün" seçilmişse dropdown'dan gelir
        const effectiveProductId =
            relatedType === "product"
                ? productId ?? (selectedProductId || null)
                : productId ?? null;

        const defaultSubject = isTr ? "Teklif talebi" : "Quotation request";

        const trimmedEmail = email.trim();
        const trimmedCompanyName = companyName.trim();
        const trimmedCustomerName = customerName.trim();

        const payload: OfferRequestPublic = {
            locale,
            country_code: countryCode || undefined,
            customer_name: trimmedCustomerName, // Yetkili
            company_name: trimmedCompanyName || null,
            email: trimmedEmail,
            phone: phone.trim() || null,
            subject: defaultSubject,

            // Genel mesaj – tüm tiplerde extraNotes içeriğini mesaj olarak da saklıyoruz
            message: extraNotes.trim() || null,

            // Mevcut kolon – products ile ilişki için
            product_id: effectiveProductId ?? null,

            // Genişletilmiş form_data – ürün / hizmet + kule / hizmet detayları
            form_data: {
                // İletişim
                contact_role: contactRole || undefined,

                // Ürün / hizmet bağlamı
                related_type: relatedType, // "general" | "product" | "service"

                // Ürün tarafı (sadece relatedType === "product" ise doldurulur)
                related_product_id:
                    relatedType === "product" && effectiveProductId
                        ? effectiveProductId
                        : undefined,
                related_product_name:
                    relatedType === "product"
                        ? productName ||
                        selectedProduct?.title ||
                        selectedProduct?.slug ||
                        undefined
                        : undefined,

                // Hizmet tarafı (sadece relatedType === "service" ise doldurulur)
                related_service_id:
                    relatedType === "service" && selectedServiceId
                        ? selectedServiceId
                        : undefined,
                related_service_name:
                    relatedType === "service"
                        ? selectedService?.name || selectedService?.slug || undefined
                        : undefined,

                // Kule / proses alanları (ürün ve bazı hizmet tipleri için anlamlı)
                tower_process: towerProcess || undefined,
                tower_city: towerCity || undefined,
                tower_district: towerDistrict || undefined,
                water_flow_m3h: waterFlowM3h || undefined,
                inlet_temperature_c: inletTemp || undefined,
                outlet_temperature_c: outletTemp || undefined,
                wet_bulb_temperature_c: wetBulbTemp || undefined,
                capacity_kcal_kw: capacity || undefined,
                water_quality: waterQuality || undefined,
                pool_type: poolType || undefined,
                tower_location: towerLocation || undefined,
                existing_tower_info: existingTowerInfo || undefined,
                referral_source: referralSource || undefined,

                // Eski alanlarla geri uyumluluk
                product_name:
                    productName ||
                    (relatedType === "product"
                        ? selectedProduct?.title || selectedProduct?.slug || undefined
                        : undefined),

                notes: extraNotes || undefined,
            },

            consent_marketing: consentMarketing,
            consent_terms: consentTerms,
        };

        try {
            const res = (await createOffer(payload).unwrap()) as any;
            // Backend /offers 201 → OfferRow döndürüyor
            if (res?.id) {
                setSubmittedId(res.id);
                onSuccess?.(res.id);
            }

            // Kampanya / newsletter onayı verildiyse, newsletter'a kayıt et
            if (consentMarketing && trimmedEmail) {
                try {
                    await subscribeNewsletter(
                        {
                            email: trimmedEmail,
                            locale,
                            name: trimmedCustomerName || undefined,
                            company_name: trimmedCompanyName || undefined,
                            consent_source: "offer_public_form",
                        } as NewsletterSubscribePayload,
                    ).unwrap();
                } catch (err) {
                    console.error("newsletter_subscribe_failed", err);
                    // Bilerek UI'de hata göstermiyoruz; teklif kaydı öncelikli.
                }
            }

            // Reset
            setCompanyName("");
            setCustomerName("");
            setContactRole("");
            setEmail("");
            setPhone("");
            setCountryCode(defaultCountryCode);

            setTowerProcess("");
            setTowerCity("");
            setTowerDistrict("");
            setWaterFlowM3h("");
            setInletTemp("");
            setOutletTemp("");
            setWetBulbTemp("");
            setCapacity("");
            setWaterQuality("");
            setPoolType("");
            setTowerLocation("");
            setExistingTowerInfo("");
            setReferralSource("");
            setExtraNotes("");

            setConsentMarketing(false);
            setConsentTerms(false);

            if (!isLockedToProduct) {
                setRelatedType("general");
                setSelectedProductId("");
                setSelectedServiceId("");
            }
        } catch (err) {
            console.error("offer_public_submit_failed", err);
        }
    };

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <form onSubmit={handleSubmit} className="row g-3">
            {/* Başlık */}
            <div className="col-12">
                <h3 className="h5 mb-1">{formHeading}</h3>
                <p className="text-muted small mb-2">{formIntro}</p>
            </div>

            {/* 1. BLOK – Firma / Yetkili */}
            <div className="col-12">
                <div className="row g-2">
                    <div className="col-12">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={isTr ? "Firma *" : "Company *"}
                            required
                            disabled={isLoading}
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className="col-12">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={isTr ? "Yetkili *" : "Contact Person *"}
                            required
                            disabled={isLoading}
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>

                    <div className="col-12">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={isTr ? "Görevi *" : "Position *"}
                            required
                            disabled={isLoading}
                            value={contactRole}
                            onChange={(e) => setContactRole(e.target.value)}
                        />
                    </div>

                    <div className="col-12">
                        <input
                            type="email"
                            className="form-control form-control-sm"
                            placeholder={isTr ? "E-Posta *" : "E-mail *"}
                            required
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="col-12">
                        <input
                            type="tel"
                            className="form-control form-control-sm"
                            placeholder={isTr ? "Telefon *" : "Phone *"}
                            required
                            disabled={isLoading}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Ülke + locale */}
            <div className="col-12">
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            disabled={isLoading}
                            value={countryCode}
                            onChange={(e) =>
                                setCountryCode(e.target.value.toUpperCase())
                            }
                            placeholder={isTr ? "Ülke Kodu (ISO-2)" : "Country Code (ISO-2)"}
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            disabled
                            value={locale}
                            placeholder={isTr ? "Dil" : "Locale"}
                        />
                    </div>
                </div>
            </div>

            {/* Ürün detay sayfasından geldiyse ürün adı */}
            {productName && (
                <div className="col-12">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        disabled
                        value={productName}
                        placeholder={isTr ? "Ürün" : "Product"}
                    />
                </div>
            )}

            {/* 2. BLOK – Teklif türü (Genel / Ürün / Hizmet) + Select'ler */}
            <div className="col-12">
                {!isLockedToProduct && (
                    <div className="mb-2">
                        <div className="form-check form-check-inline small">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="offer-related-general"
                                name="offer-related-type"
                                value="general"
                                disabled={isLoading}
                                checked={relatedType === "general"}
                                onChange={() => setRelatedType("general")}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="offer-related-general"
                            >
                                {radioGeneralLabel}
                            </label>
                        </div>

                        <div className="form-check form-check-inline small">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="offer-related-product"
                                name="offer-related-type"
                                value="product"
                                disabled={isLoading}
                                checked={relatedType === "product"}
                                onChange={() => setRelatedType("product")}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="offer-related-product"
                            >
                                {radioProductLabel}
                            </label>
                        </div>

                        <div className="form-check form-check-inline small">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="offer-related-service"
                                name="offer-related-type"
                                value="service"
                                disabled={isLoading}
                                checked={relatedType === "service"}
                                onChange={() => setRelatedType("service")}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="offer-related-service"
                            >
                                {radioServiceLabel}
                            </label>
                        </div>
                    </div>
                )}

                {/* Ürün seçimi – Ürün / Yedek parça için */}
                {relatedType === "product" && !isLockedToProduct && (
                    <div className="mt-1">
                        <select
                            className="form-select form-select-sm"
                            disabled={isLoading || isProductsLoading}
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">
                                {isTr
                                    ? "Lütfen ürün / yedek parça seçin"
                                    : "Please select a product / spare part"}
                            </option>
                            {productItems.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title || p.slug}
                                </option>
                            ))}
                        </select>
                        {isProductsLoading && (
                            <div className="form-text small">
                                {isTr ? "Ürünler yükleniyor..." : "Loading products..."}
                            </div>
                        )}
                        {isProductsError && (
                            <div className="form-text small text-danger">
                                {isTr
                                    ? "Ürün listesi yüklenirken hata oluştu."
                                    : "Failed to load product list."}
                            </div>
                        )}
                    </div>
                )}

                {/* Hizmet seçimi – Hizmet teklifleri için */}
                {relatedType === "service" && (
                    <div className="mt-1">
                        <select
                            className="form-select form-select-sm"
                            disabled={isLoading || isServicesLoading}
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                        >
                            <option value="">
                                {isTr
                                    ? "Lütfen hizmet seçin (mühendislik, revizyon, bakım vb.)"
                                    : "Please select a service (engineering, retrofit, maintenance, etc.)"}
                            </option>
                            {serviceItems.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name || s.slug}
                                </option>
                            ))}
                        </select>
                        {isServicesLoading && (
                            <div className="form-text small">
                                {isTr ? "Hizmetler yükleniyor..." : "Loading services..."}
                            </div>
                        )}
                        {isServicesError && (
                            <div className="form-text small text-danger">
                                {isTr
                                    ? "Hizmet listesi yüklenirken hata oluştu."
                                    : "Failed to load service list."}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3. BLOK – Dinamik içerik */}
            {/* GENEL TEKLİF: Ucu açık form */}
            {relatedType === "general" && (
                <div className="col-12">
                    <p className="small mb-2">{generalIntroText}</p>
                    <textarea
                        className="form-control form-control-sm"
                        rows={4}
                        disabled={isLoading}
                        value={extraNotes}
                        onChange={(e) => setExtraNotes(e.target.value)}
                        placeholder={
                            isTr
                                ? "Talep ettiğiniz ürün / hizmet, miktar, özel istekleriniz vb."
                                : "Requested product/service, quantity, special requirements, etc."
                        }
                    />
                </div>
            )}

            {/* ÜRÜN / YEDEK PARÇA: Teknik kule formu */}
            {relatedType === "product" && (
                <div className="col-12">
                    <p className="small mb-2">{productIntroText}</p>

                    <div className="row g-2">
                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerProcess}
                                onChange={(e) => setTowerProcess(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Kulenin Kullanılacağı Proses"
                                        : "Process where the tower will be used"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerCity}
                                onChange={(e) => setTowerCity(e.target.value)}
                                placeholder={isTr ? "Kulenin Kurulacağı İl" : "City"}
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerDistrict}
                                onChange={(e) => setTowerDistrict(e.target.value)}
                                placeholder={isTr ? "Kulenin Kurulacağı İlçe" : "District"}
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={waterFlowM3h}
                                onChange={(e) => setWaterFlowM3h(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Saatlik Su Debisi (m³/h)"
                                        : "Water Flow Rate (m³/h)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={inletTemp}
                                onChange={(e) => setInletTemp(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Giriş Sıcaklığı (°C)"
                                        : "Inlet Temperature (°C)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={outletTemp}
                                onChange={(e) => setOutletTemp(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Çıkış Sıcaklığı (°C)"
                                        : "Outlet Temperature (°C)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={wetBulbTemp}
                                onChange={(e) => setWetBulbTemp(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Yaş Termometre Değeri (°C)"
                                        : "Wet Bulb Temperature (°C)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Kapasite (Kcal/h, kW)"
                                        : "Capacity (kcal/h, kW)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={waterQuality}
                                onChange={(e) => setWaterQuality(e.target.value)}
                                placeholder={isTr ? "Su Kalitesi" : "Water Quality"}
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={poolType}
                                onChange={(e) => setPoolType(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Havuz (CTP havuzlu olsun / Beton yapacağım)"
                                        : "Pool (FRP basin / concrete etc.)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerLocation}
                                onChange={(e) => setTowerLocation(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Kulenin Konulacağı Yer (Çelik Şase / Beton Zemin)"
                                        : "Tower Location (steel frame / concrete base)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={existingTowerInfo}
                                onChange={(e) => setExistingTowerInfo(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Mevcut Kule Var mı? (varsa modeli/yılı)"
                                        : "Existing tower? (model/year if any)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={referralSource}
                                onChange={(e) => setReferralSource(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Bizi Nereden Tanıyorsunuz?"
                                        : "How did you hear about us?"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <textarea
                                className="form-control form-control-sm"
                                rows={2}
                                disabled={isLoading}
                                value={extraNotes}
                                onChange={(e) => setExtraNotes(e.target.value)}
                                placeholder={
                                    isTr ? "Ek Notlar" : "Additional Notes / Comments"
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* HİZMET: Hizmete yönelik sade form */}
            {relatedType === "service" && (
                <div className="col-12">
                    <p className="small mb-2">{serviceIntroText}</p>

                    <div className="row g-2">
                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerProcess}
                                onChange={(e) => setTowerProcess(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Hizmetin Konusu / Proses"
                                        : "Service scope / process"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerCity}
                                onChange={(e) => setTowerCity(e.target.value)}
                                placeholder={isTr ? "Tesisi̇n Bulunduğu İl" : "City"}
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={towerDistrict}
                                onChange={(e) => setTowerDistrict(e.target.value)}
                                placeholder={isTr ? "Tesisi̇n Bulunduğu İlçe" : "District"}
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Sistem Kapasitesi / Kule Sayısı"
                                        : "System capacity / number of towers"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={existingTowerInfo}
                                onChange={(e) => setExistingTowerInfo(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Mevcut Durum (kule modeli, yılı, sorun vb.)"
                                        : "Current situation (tower model, year, issues, etc.)"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <input
                                className="form-control form-control-sm"
                                disabled={isLoading}
                                value={referralSource}
                                onChange={(e) => setReferralSource(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Bizi Nereden Tanıyorsunuz?"
                                        : "How did you hear about us?"
                                }
                            />
                        </div>

                        <div className="col-12">
                            <textarea
                                className="form-control form-control-sm"
                                rows={3}
                                disabled={isLoading}
                                value={extraNotes}
                                onChange={(e) => setExtraNotes(e.target.value)}
                                placeholder={
                                    isTr
                                        ? "Hizmetten beklentileriniz, planlanan tarih, diğer notlarınız..."
                                        : "Your expectations from the service, planned date, other notes..."
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* KVKK / izinler */}
            <div className="col-12">
                <div className="form-check small">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="offer-consent-terms"
                        checked={consentTerms}
                        disabled={isLoading}
                        onChange={(e) => setConsentTerms(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="offer-consent-terms">
                        {kvkkLabel}
                    </label>
                </div>

                <div className="form-check small mt-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="offer-consent-marketing"
                        checked={consentMarketing}
                        disabled={isLoading}
                        onChange={(e) => setConsentMarketing(e.target.checked)}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="offer-consent-marketing"
                    >
                        {marketingLabel}
                    </label>
                </div>
            </div>

            {/* Hata / başarı mesajları */}
            <div className="col-12">
                {isError && (
                    <div className="alert alert-danger py-2 small mb-2">
                        {errorText}
                    </div>
                )}
                {isSuccess && submittedId && (
                    <div className="alert alert-success py-2 small mb-2">
                        {successPrefix}
                        <code>{submittedId}</code>
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="col-12 d-flex justify-content-end">
                <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isLoading}
                >
                    {isLoading ? submittingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
};
