// =============================================================
// FILE: src/components/public/offer/OfferPublicForm.tsx
// Ensotek – Public Teklif Talep Formu [FINAL+]
//  - i18n PATTERN: useLocaleShort + useUiSection
//  - UI: DB (site_settings.ui_offer) + EN-only fallback
//  - country_code esnek: backend-safe normalize + raw değeri form_data’da sakla
// =============================================================

'use client';

import React, { useMemo, useState, useCallback, type FormEvent } from 'react';

import {
  useCreateOfferPublicMutation,
  useListProductsQuery,
  useListServicesPublicQuery,
  useSubscribeNewsletterMutation,
} from '@/integrations/rtk/hooks';

import type {
  ServiceDto,
  ProductDto,
  OfferRequestPublic,
  NewsletterSubscribePayload
} from '@/integrations/types';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

export type OfferPublicFormProps = {
  defaultCountryCode?: string;
  productId?: string | null;
  productName?: string | null;
  onSuccess?: (offerId: string) => void;
};

type RelatedType = 'general' | 'product' | 'service';

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Country input'u kullanıcı açısından serbest:
 * - Boş olabilir
 * - "TR", "DE" gibi ISO-2 olabilir
 * - "Germany", "Deutschland", "EU" gibi serbest olabilir
 *
 * Backend safe: country_code sadece ISO-2 ise gönder.
 * Raw değer: form_data.country_code_raw
 */
function normalizeCountryCodeStrictISO2(raw: string): string | undefined {
  const s = String(raw || '')
    .trim()
    .toUpperCase();
  if (!s) return undefined;
  if (/^[A-Z]{2}$/.test(s)) return s;
  return undefined;
}

function normalizeCountryRawForStorage(raw: string): string {
  return String(raw || '').trim();
}

const OfferPublicForm: React.FC<OfferPublicFormProps> = ({
  defaultCountryCode = 'DE',
  productId = null,
  productName = null,
  onSuccess,
}) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_offer', locale as any);

  // EN-only fallback helper
  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  // -----------------------------
  // 1) Müşteri / firma bilgileri
  // -----------------------------
  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // kullanıcı serbest yazacak (opsiyonel)
  const [countryCode, setCountryCode] = useState(defaultCountryCode);

  // -----------------------------
  // 2) Teknik / kule / hizmet bilgileri
  // -----------------------------
  const [towerProcess, setTowerProcess] = useState('');
  const [towerCity, setTowerCity] = useState('');
  const [towerDistrict, setTowerDistrict] = useState('');
  const [waterFlowM3h, setWaterFlowM3h] = useState('');
  const [inletTemp, setInletTemp] = useState('');
  const [outletTemp, setOutletTemp] = useState('');
  const [wetBulbTemp, setWetBulbTemp] = useState('');
  const [capacity, setCapacity] = useState('');
  const [waterQuality, setWaterQuality] = useState('');
  const [poolType, setPoolType] = useState('');
  const [towerLocation, setTowerLocation] = useState('');
  const [existingTowerInfo, setExistingTowerInfo] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  // KVKK / izin
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const [createOffer, createState] = useCreateOfferPublicMutation();
  const [subscribeNewsletter] = useSubscribeNewsletterMutation();

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const isLockedToProduct = Boolean(productId);

  // -----------------------------
  // 3) İlgili ürün / hizmet seçimi
  // -----------------------------
  const [relatedType, setRelatedType] = useState<RelatedType>(
    isLockedToProduct ? 'product' : 'general',
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(productId ?? '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  const productQueryParams = useMemo(() => ({ locale }), [locale]);
  const servicesQueryParams = useMemo(() => ({ locale, default_locale: locale }), [locale]);

  const productsQ = useListProductsQuery(productQueryParams);
  const servicesQ = useListServicesPublicQuery(servicesQueryParams);

  const productItems: ProductDto[] = useMemo(() => productsQ.data?.items ?? [], [productsQ.data]);
  const serviceItems: ServiceDto[] = useMemo(() => servicesQ.data?.items ?? [], [servicesQ.data]);

  const selectedProduct = useMemo(() => {
    const effectiveId = productId ?? selectedProductId;
    return productItems.find((p) => p.id === effectiveId);
  }, [productItems, productId, selectedProductId]);

  const selectedService = useMemo(
    () => serviceItems.find((s) => s.id === selectedServiceId),
    [serviceItems, selectedServiceId],
  );

  // -----------------------------
  // UI strings (DB -> EN fallback only)
  // -----------------------------
  const formHeading = useMemo(() => t('ui_offer_form_heading', 'Request an Offer'), [t]);
  const formIntro = useMemo(
    () =>
      t(
        'ui_offer_form_intro',
        'Share details about your company and request; we will get back to you with a tailored quotation.',
      ),
    [t],
  );

  const countryHelp = useMemo(
    () =>
      t(
        'ui_offer_country_help',
        'Optional. You can leave this blank or enter ISO-2 (e.g., TR, DE). If you type a longer value, we will still keep it in the message details.',
      ),
    [t],
  );

  const radioGeneralLabel = useMemo(() => t('ui_offer_form_radio_general', 'General quote'), [t]);
  const radioProductLabel = useMemo(
    () => t('ui_offer_form_radio_product', 'Product / Spare Part'),
    [t],
  );
  const radioServiceLabel = useMemo(
    () => t('ui_offer_form_radio_service', 'Service (Engineering / Retrofit)'),
    [t],
  );

  const generalIntroText = useMemo(
    () => t('ui_offer_form_general_text', 'Please describe your general quotation request.'),
    [t],
  );
  const productIntroText = useMemo(
    () => t('ui_offer_form_product_text', 'Please fill in the technical details.'),
    [t],
  );
  const serviceIntroText = useMemo(
    () => t('ui_offer_form_service_text', 'Please fill in the details for the requested service.'),
    [t],
  );

  const errorText = useMemo(
    () => t('ui_offer_form_error', 'An error occurred while submitting your request.'),
    [t],
  );

  const successPrefix = useMemo(
    () => t('ui_offer_form_success', 'Your request has been received. Reference no: '),
    [t],
  );

  const submitLabel = useMemo(() => t('ui_offer_form_submit', 'Request an Offer'), [t]);
  const submittingLabel = useMemo(() => t('ui_offer_form_submitting', 'Submitting...'), [t]);

  const kvkkLabel = useMemo(
    () =>
      t(
        'ui_offer_form_kvkk_label',
        'I have read and accept the privacy policy and terms of use (mandatory).',
      ),
    [t],
  );

  const marketingLabel = useMemo(
    () =>
      t(
        'ui_offer_form_marketing_label',
        'I would like to receive promotional and information e-mails (optional).',
      ),
    [t],
  );

  const kvkkAlertText = useMemo(
    () => t('ui_offer_form_kvkk_alert', 'Please accept the privacy terms.'),
    [t],
  );

  const ph = useMemo(
    () => ({
      company: t('ui_offer_ph_company', 'Company *'),
      contact: t('ui_offer_ph_contact_person', 'Contact Person *'),
      role: t('ui_offer_ph_position', 'Position *'),
      email: t('ui_offer_ph_email', 'E-mail *'),
      phone: t('ui_offer_ph_phone', 'Phone *'),
      country: t('ui_offer_ph_country_code', 'Country (optional)'),
      locale: t('ui_offer_ph_locale', 'Locale'),

      generalNotes: t(
        'ui_offer_ph_general_notes',
        'Requested product/service, quantity, details...',
      ),

      productSelectEmpty: t('ui_offer_ph_product_select', 'Please select a product / spare part'),
      serviceSelectEmpty: t('ui_offer_ph_service_select', 'Please select a service'),

      towerProcess: t('ui_offer_ph_tower_process', 'Process where the tower will be used'),
      city: t('ui_offer_ph_city', 'City'),
      district: t('ui_offer_ph_district', 'District'),
      waterFlow: t('ui_offer_ph_water_flow', 'Water Flow Rate (m³/h)'),
      inlet: t('ui_offer_ph_inlet_temp', 'Inlet Temperature (°C)'),
      outlet: t('ui_offer_ph_outlet_temp', 'Outlet Temperature (°C)'),
      wetBulb: t('ui_offer_ph_wet_bulb', 'Wet Bulb Temperature (°C)'),
      capacity: t('ui_offer_ph_capacity', 'Capacity (kcal/h, kW)'),
      waterQuality: t('ui_offer_ph_water_quality', 'Water Quality'),
      poolType: t('ui_offer_ph_pool_type', 'Pool (FRP basin / concrete etc.)'),
      towerLocation: t(
        'ui_offer_ph_tower_location',
        'Tower Location (steel frame / concrete base)',
      ),
      existing: t('ui_offer_ph_existing_tower', 'Existing tower? (model/year if any)'),
      referral: t('ui_offer_ph_referral', 'How did you hear about us?'),
      extraNotes: t('ui_offer_ph_extra_notes', 'Additional Notes / Comments'),
      serviceExpectations: t(
        'ui_offer_ph_service_expectations',
        'Your expectations, planned date, other notes...',
      ),
    }),
    [t],
  );

  const productsLoadingText = useMemo(() => t('ui_offer_products_loading', 'Loading...'), [t]);
  const productsErrorText = useMemo(
    () => t('ui_offer_products_error', 'Failed to load product list.'),
    [t],
  );
  const servicesLoadingText = useMemo(() => t('ui_offer_services_loading', 'Loading...'), [t]);
  const servicesErrorText = useMemo(
    () => t('ui_offer_services_error', 'Failed to load service list.'),
    [t],
  );

  // -----------------------------
  // Radio change (reset dependent selections)
  // -----------------------------
  const handleRelatedTypeChange = useCallback(
    (next: RelatedType) => {
      setRelatedType(next);
      setSubmittedId(null);

      if (next !== 'product' && !isLockedToProduct) setSelectedProductId('');
      if (next !== 'service') setSelectedServiceId('');
    },
    [isLockedToProduct],
  );

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (createState.isLoading) return;

    if (!consentTerms) {
      // mevcut pattern: basit uyarı
      alert(kvkkAlertText);
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedCompany = companyName.trim();
    const trimmedCustomer = customerName.trim();

    const effectiveProductId =
      relatedType === 'product' ? productId ?? (selectedProductId || null) : productId ?? null;

    const rawCountry = normalizeCountryRawForStorage(countryCode);
    const iso2Country = normalizeCountryCodeStrictISO2(rawCountry);

    const payload: OfferRequestPublic = {
      locale,

      // ✅ backend-safe: yalnızca ISO-2 ise gönder
      country_code: iso2Country,

      customer_name: trimmedCustomer,
      company_name: trimmedCompany || null,
      email: trimmedEmail,
      phone: phone.trim() || null,

      subject: t('ui_offer_default_subject', 'Quotation request'),
      message: extraNotes.trim() || null,

      product_id: effectiveProductId ?? null,

      form_data: {
        contact_role: contactRole || undefined,
        related_type: relatedType,

        // ✅ raw değeri kaybetme
        country_code_raw: rawCountry || undefined,

        related_product_id:
          relatedType === 'product' && effectiveProductId ? effectiveProductId : undefined,
        related_product_name:
          relatedType === 'product'
            ? productName || selectedProduct?.title || selectedProduct?.slug || undefined
            : undefined,

        related_service_id:
          relatedType === 'service' && selectedServiceId ? selectedServiceId : undefined,
        related_service_name:
          relatedType === 'service'
            ? selectedService?.name || selectedService?.slug || undefined
            : undefined,

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

        product_name:
          productName ||
          (relatedType === 'product'
            ? selectedProduct?.title || selectedProduct?.slug || undefined
            : undefined),

        notes: extraNotes || undefined,
      },

      consent_marketing: consentMarketing,
      consent_terms: consentTerms,
    };

    try {
      const res = (await createOffer(payload).unwrap()) as any;

      if (res?.id) {
        setSubmittedId(String(res.id));
        onSuccess?.(String(res.id));
      }

      if (consentMarketing && trimmedEmail) {
        try {
          await subscribeNewsletter({
            email: trimmedEmail,
            locale,
            name: trimmedCustomer || undefined,
            company_name: trimmedCompany || undefined,
            consent_source: 'offer_public_form',
          } as NewsletterSubscribePayload).unwrap();
        } catch (err) {
          console.error('newsletter_subscribe_failed', err);
        }
      }

      // Reset
      setCompanyName('');
      setCustomerName('');
      setContactRole('');
      setEmail('');
      setPhone('');
      setCountryCode(defaultCountryCode);

      setTowerProcess('');
      setTowerCity('');
      setTowerDistrict('');
      setWaterFlowM3h('');
      setInletTemp('');
      setOutletTemp('');
      setWetBulbTemp('');
      setCapacity('');
      setWaterQuality('');
      setPoolType('');
      setTowerLocation('');
      setExistingTowerInfo('');
      setReferralSource('');
      setExtraNotes('');

      setConsentMarketing(false);
      setConsentTerms(false);

      if (!isLockedToProduct) {
        setRelatedType('general');
        setSelectedProductId('');
      }
      setSelectedServiceId('');
    } catch (err) {
      console.error('offer_public_submit_failed', err);
    }
  };

  const canShowRadio = !isLockedToProduct;
  const showProductSelect = relatedType === 'product' && !isLockedToProduct;
  const showServiceSelect = relatedType === 'service';

  const showGeneral = relatedType === 'general';
  const showProduct = relatedType === 'product';
  const showService = relatedType === 'service';

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <h3 className="h5 mb-1">{formHeading}</h3>
        <p className="text-muted small mb-2">{formIntro}</p>
      </div>

      {/* Contact block */}
      <div className="col-12">
        <div className="row g-2">
          <div className="col-12">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={ph.company}
              required
              disabled={createState.isLoading}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={ph.contact}
              required
              disabled={createState.isLoading}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={ph.role}
              required
              disabled={createState.isLoading}
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              type="email"
              className="form-control form-control-sm"
              placeholder={ph.email}
              required
              disabled={createState.isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col-12">
            <input
              type="tel"
              className="form-control form-control-sm"
              placeholder={ph.phone}
              required
              disabled={createState.isLoading}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Country + Locale */}
      <div className="col-12">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-sm"
              disabled={createState.isLoading}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder={ph.country}
              maxLength={32}
            />
            <div className="form-text small">{countryHelp}</div>
          </div>

          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-sm"
              disabled
              value={locale}
              placeholder={ph.locale}
            />
          </div>
        </div>
      </div>

      {/* Product name if locked */}
      {productName ? (
        <div className="col-12">
          <input
            type="text"
            className="form-control form-control-sm"
            disabled
            value={productName}
          />
        </div>
      ) : null}

      {/* Related type */}
      <div className="col-12">
        {canShowRadio ? (
          <div className="mb-2">
            <div className="form-check form-check-inline small">
              <input
                className="form-check-input"
                type="radio"
                id="offer-related-general"
                name="offer-related-type"
                value="general"
                disabled={createState.isLoading}
                checked={relatedType === 'general'}
                onChange={() => handleRelatedTypeChange('general')}
              />
              <label className="form-check-label" htmlFor="offer-related-general">
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
                disabled={createState.isLoading}
                checked={relatedType === 'product'}
                onChange={() => handleRelatedTypeChange('product')}
              />
              <label className="form-check-label" htmlFor="offer-related-product">
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
                disabled={createState.isLoading}
                checked={relatedType === 'service'}
                onChange={() => handleRelatedTypeChange('service')}
              />
              <label className="form-check-label" htmlFor="offer-related-service">
                {radioServiceLabel}
              </label>
            </div>
          </div>
        ) : null}

        {/* Product select */}
        {showProductSelect ? (
          <div className="mt-1">
            <select
              className="form-select form-select-sm"
              disabled={createState.isLoading || productsQ.isLoading}
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">{ph.productSelectEmpty}</option>
              {productItems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.slug}
                </option>
              ))}
            </select>

            {productsQ.isLoading ? (
              <div className="form-text small">{productsLoadingText}</div>
            ) : null}

            {productsQ.isError ? (
              <div className="form-text small text-danger">{productsErrorText}</div>
            ) : null}
          </div>
        ) : null}

        {/* Service select */}
        {showServiceSelect ? (
          <div className="mt-1">
            <select
              className="form-select form-select-sm"
              disabled={createState.isLoading || servicesQ.isLoading}
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              <option value="">{ph.serviceSelectEmpty}</option>
              {serviceItems.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.slug}
                </option>
              ))}
            </select>

            {servicesQ.isLoading ? (
              <div className="form-text small">{servicesLoadingText}</div>
            ) : null}

            {servicesQ.isError ? (
              <div className="form-text small text-danger">{servicesErrorText}</div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Dynamic content blocks */}
      {showGeneral ? (
        <div className="col-12">
          <p className="small mb-2">{generalIntroText}</p>
          <textarea
            className="form-control form-control-sm"
            rows={4}
            disabled={createState.isLoading}
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder={ph.generalNotes}
          />
        </div>
      ) : null}

      {showProduct ? (
        <div className="col-12">
          <p className="small mb-2">{productIntroText}</p>

          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={towerProcess}
                onChange={(e) => setTowerProcess(e.target.value)}
                placeholder={ph.towerProcess}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={towerCity}
                onChange={(e) => setTowerCity(e.target.value)}
                placeholder={ph.city}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={towerDistrict}
                onChange={(e) => setTowerDistrict(e.target.value)}
                placeholder={ph.district}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={waterFlowM3h}
                onChange={(e) => setWaterFlowM3h(e.target.value)}
                placeholder={ph.waterFlow}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={inletTemp}
                onChange={(e) => setInletTemp(e.target.value)}
                placeholder={ph.inlet}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={outletTemp}
                onChange={(e) => setOutletTemp(e.target.value)}
                placeholder={ph.outlet}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={wetBulbTemp}
                onChange={(e) => setWetBulbTemp(e.target.value)}
                placeholder={ph.wetBulb}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder={ph.capacity}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={waterQuality}
                onChange={(e) => setWaterQuality(e.target.value)}
                placeholder={ph.waterQuality}
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={poolType}
                onChange={(e) => setPoolType(e.target.value)}
                placeholder={ph.poolType}
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={towerLocation}
                onChange={(e) => setTowerLocation(e.target.value)}
                placeholder={ph.towerLocation}
              />
            </div>

            <div className="col-12">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={existingTowerInfo}
                onChange={(e) => setExistingTowerInfo(e.target.value)}
                placeholder={ph.existing}
              />
            </div>

            <div className="col-12">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                placeholder={ph.referral}
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                rows={4}
                disabled={createState.isLoading}
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder={ph.extraNotes}
              />
            </div>
          </div>
        </div>
      ) : null}

      {showService ? (
        <div className="col-12">
          <p className="small mb-2">{serviceIntroText}</p>

          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={towerCity}
                onChange={(e) => setTowerCity(e.target.value)}
                placeholder={ph.city}
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                disabled={createState.isLoading}
                value={towerDistrict}
                onChange={(e) => setTowerDistrict(e.target.value)}
                placeholder={ph.district}
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                rows={4}
                disabled={createState.isLoading}
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder={ph.serviceExpectations}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Consents */}
      <div className="col-12">
        <div className="form-check small">
          <input
            className="form-check-input"
            type="checkbox"
            id="offer-consent-terms"
            checked={consentTerms}
            disabled={createState.isLoading}
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
            disabled={createState.isLoading}
            onChange={(e) => setConsentMarketing(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="offer-consent-marketing">
            {marketingLabel}
          </label>
        </div>
      </div>

      {/* Status */}
      <div className="col-12" aria-live="polite">
        {createState.isError ? (
          <div className="alert alert-danger py-2 small mb-2">{errorText}</div>
        ) : null}

        {createState.isSuccess && submittedId ? (
          <div className="alert alert-success py-2 small mb-2">
            {successPrefix} <code>{submittedId}</code>
          </div>
        ) : null}
      </div>

      {/* Submit */}
      <div className="col-12 d-flex justify-content-end">
        <button type="submit" className="btn btn-primary btn-sm" disabled={createState.isLoading}>
          {createState.isLoading ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default OfferPublicForm;
