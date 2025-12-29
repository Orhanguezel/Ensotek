'use client';

// =============================================================
// FILE: src/components/containers/cta/CatalogCta.tsx
// Ensotek – Catalog CTA (Public) (I18N + SAFE) [FINAL]
// - i18n: site_settings.ui_catalog
// - POST: /catalog-requests (public)
// - Locale: useResolvedLocale()
// - Country code: optional, flexible, auto-uppercase, max 4 chars (TR/DE/US/EU etc.)
// - Types: aligns with CreateCatalogRequestPublicBody (NO null for optional string fields)
// - NO inline styles / keep SCSS/bootstrap classes only
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import one from 'public/img/svg/cta.svg';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateCatalogRequestPublicMutation } from '@/integrations/rtk/hooks';
import type { CreateCatalogRequestPublicBody } from '@/integrations/types/catalog_public.types';

const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || '')
      .trim()
      .toLowerCase(),
  );

type StatusState =
  | { type: 'idle' }
  | { type: 'success'; id: string }
  | { type: 'error'; message: string };

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function normalizeCountryCode(v: unknown): string {
  const s = safeStr(v).toUpperCase();
  // Esnek: TR/DE/US/EU vb. - sadece alfanumerik
  // Maks 4 karakter
  return s.replace(/[^A-Z0-9]/g, '').slice(0, 4);
}

const CatalogCta: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_catalog', locale);

  const [isOpen, setIsOpen] = useState(false);
  const [createCatalogRequest, { isLoading }] = useCreateCatalogRequestPublicMutation();

  // NOT: CreateCatalogRequestPublicBody ile birebir uyumlu: optional string alanlarda null yok.
  const [form, setForm] = useState<CreateCatalogRequestPublicBody>(() => {
    const defCc = normalizeCountryCode(ui('ui_catalog_default_country_code', ''));
    return {
      locale,
      country_code: defCc ? defCc : undefined,
      customer_name: '',
      company_name: '',

      email: '',
      phone: '',

      message: '',

      consent_marketing: false,
      consent_terms: false,
    };
  });

  const [status, setStatus] = useState<StatusState>({ type: 'idle' });

  // locale değişince sadece locale alanını güncelle
  useEffect(() => {
    setForm((p) => ({ ...p, locale }));
  }, [locale]);

  // ESC ile modal kapat
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // modal açıkken body scroll kapat
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const t = useMemo(
    () => ({
      title: safeStr(ui('ui_catalog_cta_title', 'Catalog Request')) || 'Catalog Request',
      desc:
        safeStr(
          ui(
            'ui_catalog_cta_text',
            'Request the product catalog. Your request will be forwarded to admins.',
          ),
        ) || 'Request the product catalog. Your request will be forwarded to admins.',
      openBtn: safeStr(ui('ui_catalog_cta_button', 'Request Catalog')) || 'Request Catalog',

      modalTitle: safeStr(ui('ui_catalog_modal_title', 'Catalog Request')) || 'Catalog Request',
      submitBtn: safeStr(ui('ui_catalog_submit_button', 'Submit Request')) || 'Submit Request',
      sending: safeStr(ui('ui_catalog_sending', 'Sending...')) || 'Sending...',

      closeBtn: safeStr(ui('ui_common_close', 'Close')) || 'Close',

      // fields
      fName: safeStr(ui('ui_catalog_field_name', 'Full Name *')) || 'Full Name *',
      fCompany:
        safeStr(ui('ui_catalog_field_company', 'Company (optional)')) || 'Company (optional)',
      fEmail: safeStr(ui('ui_catalog_field_email', 'Email *')) || 'Email *',
      fPhone: safeStr(ui('ui_catalog_field_phone', 'Phone (optional)')) || 'Phone (optional)',
      fCountry:
        safeStr(ui('ui_catalog_field_country', 'Country Code (optional)')) ||
        'Country Code (optional)',
      fMessage:
        safeStr(ui('ui_catalog_field_message', 'Message (optional)')) || 'Message (optional)',

      cTerms:
        safeStr(ui('ui_catalog_consent_terms', 'I accept the terms/privacy policy. *')) ||
        'I accept the terms/privacy policy. *',
      cMarketing:
        safeStr(ui('ui_catalog_consent_marketing', 'I want to receive marketing emails.')) ||
        'I want to receive marketing emails.',

      // validations / messages
      errName:
        safeStr(ui('ui_catalog_error_name_required', 'Full name is required.')) ||
        'Full name is required.',
      errEmail:
        safeStr(ui('ui_catalog_error_email_invalid', 'Please enter a valid email.')) ||
        'Please enter a valid email.',
      errTerms:
        safeStr(ui('ui_catalog_error_terms_required', 'You must accept the terms to continue.')) ||
        'You must accept the terms to continue.',
      errGeneric:
        safeStr(ui('ui_catalog_error_generic', 'Request failed. Please try again.')) ||
        'Request failed. Please try again.',

      okReceived:
        safeStr(ui('ui_catalog_success_received', 'Your request has been received.')) ||
        'Your request has been received.',
      okIdPrefix: safeStr(ui('ui_catalog_success_id', 'Request ID:')) || 'Request ID:',

      // aria
      iconAlt: safeStr(ui('ui_catalog_icon_alt', 'Catalog request')) || 'Catalog request',
      closeAria: safeStr(ui('ui_catalog_close_aria', 'Close')) || 'Close',
    }),
    [ui],
  );

  const labels = useMemo(
    () => ({
      customer_name: t.fName,
      company_name: t.fCompany,
      email: t.fEmail,
      phone: t.fPhone,
      country_code: t.fCountry,
      message: t.fMessage,
      consent_terms: t.cTerms,
      consent_marketing: t.cMarketing,
    }),
    [t],
  );

  const canSubmit = useMemo(() => {
    const nameOk = safeStr(form.customer_name).length > 0;
    const emailOk = isEmailValid(safeStr(form.email));
    const termsOk = !!form.consent_terms;
    return nameOk && emailOk && termsOk && !isLoading;
  }, [form.customer_name, form.email, form.consent_terms, isLoading]);

  const onChange =
    (key: keyof CreateCatalogRequestPublicBody) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const target = e.target as HTMLInputElement;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      if (key === 'country_code') {
        const cc = normalizeCountryCode(value);
        setForm((p) => ({ ...p, country_code: cc ? cc : undefined }));
        return;
      }

      setForm((p) => ({ ...p, [key]: value as any }));
    };

  const openModal = () => {
    setStatus({ type: 'idle' });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStatus({ type: 'idle' });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle' });

    const customer_name = safeStr(form.customer_name);
    const email = safeStr(form.email).toLowerCase();

    if (!customer_name) {
      setStatus({ type: 'error', message: t.errName });
      return;
    }
    if (!isEmailValid(email)) {
      setStatus({ type: 'error', message: t.errEmail });
      return;
    }
    if (!form.consent_terms) {
      setStatus({ type: 'error', message: t.errTerms });
      return;
    }

    const cc = normalizeCountryCode(form.country_code);

    // IMPORTANT:
    // - optional alanlarda null göndermiyoruz (type uyumu)
    // - boşsa undefined => request body'de property oluşmaz
    const payload: CreateCatalogRequestPublicBody = {
      locale: safeStr(form.locale || locale) || locale,
      country_code: cc ? cc : undefined,

      customer_name,
      company_name: safeStr(form.company_name) ? safeStr(form.company_name) : null,

      email,
      phone: safeStr(form.phone) ? safeStr(form.phone) : null,
      message: safeStr(form.message) ? safeStr(form.message) : null,

      consent_marketing: !!form.consent_marketing,
      consent_terms: !!form.consent_terms,
    };

    try {
      const res = await createCatalogRequest(payload).unwrap();
      const id = safeStr((res as any)?.id);

      setStatus({ type: 'success', id });

      // form reset: optional string alanları '' yap (null değil)
      setForm((p) => ({
        ...p,
        customer_name: '',
        company_name: '',
        email: '',
        phone: '',
        message: '',
        consent_marketing: false,
        consent_terms: false,
        // country_code resetleme: default'u koru
        country_code: p.country_code,
      }));
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.data?.message || err?.error || t.errGeneric;
      setStatus({ type: 'error', message: safeStr(msg) || t.errGeneric });
    }
  };

  return (
    <div className="cta__area pb-120">
      <div className="container">
        <div className="cta__main-wrappper">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-xl-12">
              <div className="cta__content-box text-center">
                <div className="cta__icon mb-20">
                  <Image src={one} alt={t.iconAlt} />
                </div>

                <div className="cta__title mb-20">{t.title}</div>
                <p className="mb-30">{t.desc}</p>

                <div className="cta__btn-wrap">
                  <button type="button" className="btn btn-primary" onClick={openModal}>
                    {t.openBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL */}
          {isOpen && (
            <div
              className="modal-backdrop-custom"
              role="dialog"
              aria-modal="true"
              aria-label={t.modalTitle}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeModal();
              }}
            >
              <div className="modal-card-custom">
                {/* Header */}
                <div className="modal-head-custom">
                  <div className="modal-title-custom">{t.modalTitle}</div>

                  <button
                    type="button"
                    className="btn btn-link modal-close-custom"
                    onClick={closeModal}
                    aria-label={t.closeAria}
                    title={t.closeBtn}
                  >
                    ×
                  </button>
                </div>

                {/* Body */}
                <div className="modal-body-custom">
                  <form onSubmit={onSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <Label>{labels.customer_name}</Label>
                        <Input
                          type="text"
                          value={form.customer_name ?? ''}
                          onChange={onChange('customer_name')}
                          autoComplete="name"
                        />
                      </div>

                      <div className="col-12">
                        <Label>{labels.company_name}</Label>
                        <Input
                          type="text"
                          value={(form.company_name as any) ?? ''}
                          onChange={onChange('company_name')}
                          autoComplete="organization"
                        />
                      </div>

                      <div className="col-md-6">
                        <Label>{labels.email}</Label>
                        <Input
                          type="email"
                          value={form.email ?? ''}
                          onChange={onChange('email')}
                          autoComplete="email"
                        />
                      </div>

                      <div className="col-md-6">
                        <Label>{labels.phone}</Label>
                        <Input
                          type="text"
                          value={(form.phone as any) ?? ''}
                          onChange={onChange('phone')}
                          autoComplete="tel"
                        />
                      </div>

                      <div className="col-md-4">
                        <Label>{labels.country_code}</Label>
                        <Input
                          type="text"
                          value={safeStr(form.country_code)}
                          onChange={onChange('country_code')}
                          maxLength={4}
                          inputMode="text"
                          autoComplete="country"
                        />
                      </div>

                      <div className="col-12">
                        <Label>{labels.message}</Label>
                        <textarea
                          className="form-control"
                          value={(form.message as any) ?? ''}
                          onChange={onChange('message')}
                          rows={4}
                        />
                      </div>

                      <div className="col-12">
                        <div className="d-flex flex-wrap gap-4 ens-catalog-consents">
                          <div className="form-check">
                            <input
                              id="catalog-consent-terms"
                              type="checkbox"
                              className="form-check-input"
                              checked={!!form.consent_terms}
                              onChange={onChange('consent_terms')}
                            />
                            <Label htmlFor="catalog-consent-terms" className="form-check-label">
                              {labels.consent_terms}
                            </Label>
                          </div>

                          <div className="form-check">
                            <input
                              id="catalog-consent-marketing"
                              type="checkbox"
                              className="form-check-input"
                              checked={!!form.consent_marketing}
                              onChange={onChange('consent_marketing')}
                            />
                            <Label htmlFor="catalog-consent-marketing" className="form-check-label">
                              {labels.consent_marketing}
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex gap-2 justify-content-end">
                          <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            {t.closeBtn}
                          </button>

                          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                            {isLoading ? t.sending : t.submitBtn}
                          </button>
                        </div>
                      </div>

                      {status.type === 'success' && (
                        <div className="col-12">
                          <div className="alert alert-success mb-0">
                            {t.okReceived}{' '}
                            {status.id ? (
                              <>
                                {t.okIdPrefix} <strong>{status.id}</strong>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )}

                      {status.type === 'error' && (
                        <div className="col-12">
                          <div className="alert alert-danger mb-0">{status.message}</div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {/* /MODAL */}
        </div>
      </div>
    </div>
  );
};

export default CatalogCta;
