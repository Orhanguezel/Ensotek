"use client";

// src/components/containers/cta/CatalogCta.tsx

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import one from "public/img/svg/cta.svg";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateCatalogRequestPublicMutation } from "@/integrations/rtk/hooks";
import type { CreateCatalogRequestPublicBody } from "@/integrations/types/catalog_public.types";

const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());

type StatusState =
  | { type: "idle" }
  | { type: "success"; id: string }
  | { type: "error"; message: string };

const CatalogCta = () => {
  const locale = useResolvedLocale();
  const isTr = locale === "tr";

  const { ui } = useUiSection("ui_catalog", locale);

  const [isOpen, setIsOpen] = useState(false);

  const [createCatalogRequest, { isLoading }] =
    useCreateCatalogRequestPublicMutation();

  const title = ui(
    "ui_catalog_cta_title",
    isTr ? "Katalog Talep Formu" : "Catalog Request",
  );

  const description = ui(
    "ui_catalog_cta_text",
    isTr
      ? "Ürün kataloğunu talep edin. Talebiniz yöneticilere iletilecektir. (Müşteriye mail, admin panelden gönderilir.)"
      : "Request the product catalog. Your request will be forwarded to admins. (Customer email is sent from the admin panel.)",
  );

  const openButtonLabel = ui(
    "ui_catalog_cta_button",
    isTr ? "Katalog Talep Et" : "Request Catalog",
  );

  const modalTitle = ui(
    "ui_catalog_modal_title",
    isTr ? "Katalog Talebi" : "Catalog Request",
  );

  const submitLabel = ui(
    "ui_catalog_submit_button",
    isTr ? "Talebi Gönder" : "Submit Request",
  );

  const closeLabel = ui("ui_common_close", isTr ? "Kapat" : "Close");

  const labels = {
    customer_name: ui(
      "ui_catalog_field_name",
      isTr ? "Ad Soyad *" : "Full Name *",
    ),
    company_name: ui(
      "ui_catalog_field_company",
      isTr ? "Firma (opsiyonel)" : "Company (optional)",
    ),
    email: ui("ui_catalog_field_email", isTr ? "E-posta *" : "Email *"),
    phone: ui(
      "ui_catalog_field_phone",
      isTr ? "Telefon (opsiyonel)" : "Phone (optional)",
    ),
    country_code: ui(
      "ui_catalog_field_country",
      isTr ? "Ülke Kodu (TR/DE vb.)" : "Country Code (TR/DE etc.)",
    ),
    message: ui(
      "ui_catalog_field_message",
      isTr ? "Mesaj (opsiyonel)" : "Message (optional)",
    ),
    consent_terms: ui(
      "ui_catalog_consent_terms",
      isTr
        ? "KVKK / Şartlar’ı kabul ediyorum. *"
        : "I accept the terms/privacy policy. *",
    ),
    consent_marketing: ui(
      "ui_catalog_consent_marketing",
      isTr
        ? "Kampanya e-postaları almak istiyorum."
        : "I want to receive marketing emails.",
    ),
  };

  const [form, setForm] = useState<CreateCatalogRequestPublicBody>({
    locale,
    country_code: "DE",
    customer_name: "",
    company_name: "",
    email: "",
    phone: "",
    message: "",
    consent_marketing: false,
    consent_terms: false,
  });

  const [status, setStatus] = useState<StatusState>({ type: "idle" });

  // locale değişince form locale’ini güncelle
  useEffect(() => {
    setForm((p) => ({ ...p, locale }));
  }, [locale]);

  // ESC ile modal kapat
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // modal açıkken body scroll kapat
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    const nameOk = (form.customer_name ?? "").trim().length > 0;
    const emailOk = isEmailValid(form.email ?? "");
    const termsOk = !!form.consent_terms;
    return nameOk && emailOk && termsOk && !isLoading;
  }, [form, isLoading]);

  const onChange =
    (key: keyof CreateCatalogRequestPublicBody) =>
      (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ): void => {
        const value =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        setForm((p) => ({ ...p, [key]: value as any }));
      };

  const openModal = () => {
    setStatus({ type: "idle" });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStatus({ type: "idle" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "idle" });

    const payload: CreateCatalogRequestPublicBody = {
      locale: (form.locale ?? locale)?.toString(),
      country_code: (form.country_code ?? undefined)?.toString(),

      customer_name: (form.customer_name ?? "").trim(),
      company_name:
        typeof form.company_name === "string" && form.company_name.trim()
          ? form.company_name.trim()
          : null,

      email: (form.email ?? "").trim().toLowerCase(),
      phone:
        typeof form.phone === "string" && form.phone.trim()
          ? form.phone.trim()
          : null,

      message:
        typeof form.message === "string" && form.message.trim()
          ? form.message.trim()
          : null,

      consent_marketing: !!form.consent_marketing,
      consent_terms: !!form.consent_terms,
    };

    if (!payload.customer_name) {
      setStatus({
        type: "error",
        message: isTr ? "Ad Soyad zorunludur." : "Full name is required.",
      });
      return;
    }
    if (!isEmailValid(payload.email)) {
      setStatus({
        type: "error",
        message: isTr
          ? "Geçerli bir e-posta girin."
          : "Please enter a valid email.",
      });
      return;
    }
    if (!payload.consent_terms) {
      setStatus({
        type: "error",
        message: isTr
          ? "Devam etmek için KVKK/Şartlar onayı zorunludur."
          : "You must accept the terms to continue.",
      });
      return;
    }

    try {
      const res = await createCatalogRequest(payload).unwrap();
      const id = (res as any)?.id ? String((res as any).id) : "";
      setStatus({ type: "success", id });

      setForm((p) => ({
        ...p,
        customer_name: "",
        company_name: "",
        email: "",
        phone: "",
        message: "",
        consent_marketing: false,
        consent_terms: false,
      }));
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        (isTr
          ? "Talep gönderilemedi. Lütfen tekrar deneyin."
          : "Request failed. Please try again.");
      setStatus({ type: "error", message: String(msg) });
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
                  <Image src={one} alt="Catalog request" />
                </div>

                <div className="cta__title mb-20">{title}</div>
                <p className="mb-30">{description}</p>

                <div className="cta__btn-wrap">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openModal}
                  >
                    {openButtonLabel}
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
              aria-label={modalTitle}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeModal();
              }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <div
                className="modal-card-custom"
                style={{
                  width: "min(760px, 100%)",
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  className="modal-head-custom"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{modalTitle}</div>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={closeModal}
                    aria-label={closeLabel}
                    title={closeLabel}
                    style={{
                      padding: "4px 10px",
                      textDecoration: "none",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: 16 }}>
                  <form onSubmit={onSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <Label>{labels.customer_name}</Label>
                        <Input
                          type="text"
                          value={form.customer_name ?? ""}
                          onChange={onChange("customer_name")}
                          autoComplete="name"
                        />
                      </div>

                      <div className="col-12">
                        <Label>{labels.company_name}</Label>
                        <Input
                          type="text"
                          value={(form.company_name as any) ?? ""}
                          onChange={onChange("company_name")}
                          autoComplete="organization"
                        />
                      </div>

                      <div className="col-md-6">
                        <Label>{labels.email}</Label>
                        <Input
                          type="email"
                          value={form.email ?? ""}
                          onChange={onChange("email")}
                          autoComplete="email"
                        />
                      </div>

                      <div className="col-md-6">
                        <Label>{labels.phone}</Label>
                        <Input
                          type="text"
                          value={(form.phone as any) ?? ""}
                          onChange={onChange("phone")}
                          autoComplete="tel"
                        />
                      </div>

                      <div className="col-md-4">
                        <Label>{labels.country_code}</Label>
                        <Input
                          type="text"
                          value={(form.country_code as any) ?? ""}
                          onChange={onChange("country_code")}
                          maxLength={2}
                        />
                      </div>

                      <div className="col-12">
                        <Label>{labels.message}</Label>
                        <textarea
                          className="form-control"
                          value={(form.message as any) ?? ""}
                          onChange={onChange("message")}
                          rows={4}
                        />
                      </div>

                      <div className="col-12">
                        <div
                          className="d-flex flex-wrap gap-4"
                          style={{ fontSize: 14 }}
                        >
                          <div className="form-check">
                            <input
                              id="catalog-consent-terms"
                              type="checkbox"
                              className="form-check-input"
                              checked={!!form.consent_terms}
                              onChange={onChange("consent_terms")}
                            />
                            <Label
                              htmlFor="catalog-consent-terms"
                              className="form-check-label"
                            >
                              {labels.consent_terms}
                            </Label>
                          </div>

                          <div className="form-check">
                            <input
                              id="catalog-consent-marketing"
                              type="checkbox"
                              className="form-check-input"
                              checked={!!form.consent_marketing}
                              onChange={onChange("consent_marketing")}
                            />
                            <Label
                              htmlFor="catalog-consent-marketing"
                              className="form-check-label"
                            >
                              {labels.consent_marketing}
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeModal}
                          >
                            {closeLabel}
                          </button>

                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!canSubmit}
                          >
                            {isLoading
                              ? isTr
                                ? "Gönderiliyor..."
                                : "Sending..."
                              : submitLabel}
                          </button>
                        </div>
                      </div>

                      {status.type === "success" && (
                        <div className="col-12">
                          <div className="alert alert-success mb-0">
                            {isTr
                              ? "Talebiniz alındı."
                              : "Your request has been received."}{" "}
                            {status.id ? (
                              <>
                                {isTr ? "Talep ID:" : "Request ID:"}{" "}
                                <strong>{status.id}</strong>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )}

                      {status.type === "error" && (
                        <div className="col-12">
                          <div className="alert alert-danger mb-0">
                            {status.message}
                          </div>
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
