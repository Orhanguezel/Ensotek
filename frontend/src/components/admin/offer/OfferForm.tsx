// =============================================================
// FILE: src/components/admin/offer/OfferForm.tsx
// Ensotek – Offer Admin Form
//   - PDF üretimi ve email gönderimi ayrı süreç
//   - email_sent_at artık read-only (backend yazmalı)
// =============================================================

"use client";

import React, { useMemo } from "react";
import type { OfferStatus } from "@/integrations/types/offers.types";

export type OfferFormValues = {
  customer_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;

  locale: string | null;
  country_code: string | null;

  subject: string | null;
  message: string | null;

  product_id: string | null;

  consent_marketing: boolean;
  consent_terms: boolean;

  status: OfferStatus;
  currency: string;

  net_total: string;
  vat_rate: string;
  shipping_total: string;
  vat_total: string;
  gross_total: string;

  valid_until: string | null;
  offer_no: string | null;

  admin_notes: string | null;
  pdf_url: string | null;
  pdf_asset_id: string | null;

  // ✅ artık backend tarafından set edilir (read-only)
  email_sent_at: string | null;

  form_data: Record<string, any>;
};

export type OfferFormProps = {
  mode: "create" | "edit";
  values: OfferFormValues;
  saving: boolean;

  onChange: <K extends keyof OfferFormValues>(
    field: K,
    value: OfferFormValues[K],
  ) => void;
};

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "quoted", label: "Quoted" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const parseDecimal = (s: string): number | null => {
  if (!s) return null;
  const trimmed = s.replace(",", ".").trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : n;
};

export const OfferForm: React.FC<OfferFormProps> = ({
  values,
  saving,
  onChange,
}) => {
  const disabled = saving;

  const { computedVatTotalStr, computedGrossTotalStr } = useMemo(() => {
    const net = parseDecimal(values.net_total);
    const rate = parseDecimal(values.vat_rate);
    const shipping = parseDecimal(values.shipping_total) ?? 0;

    let vat = 0;
    let gross = 0;

    if (net != null) {
      if (rate != null) {
        vat = net * (rate / 100);
      }
      gross = net + vat + shipping;
    }

    const fmt = (n: number): string => (Number.isFinite(n) ? n.toFixed(2) : "");

    return {
      computedVatTotalStr: net != null ? fmt(vat) : "",
      computedGrossTotalStr: net != null ? fmt(gross) : "",
    };
  }, [values.net_total, values.vat_rate, values.shipping_total]);

  return (
    <div className="row g-2">
      {/* Satır 1: Locale / Country / Status / Currency */}
      <div className="col-md-3">
        <label className="form-label small">Dil (locale)</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="tr / en / de"
          disabled={disabled}
          value={values.locale ?? ""}
          onChange={(e) => onChange("locale", e.target.value || null)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">Ülke Kodu</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="TR / DE / ..."
          disabled={disabled}
          value={values.country_code ?? ""}
          onChange={(e) =>
            onChange(
              "country_code",
              e.target.value ? e.target.value.toUpperCase() : null,
            )
          }
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">Durum</label>
        <select
          className="form-select form-select-sm"
          disabled={disabled}
          value={values.status}
          onChange={(e) => onChange("status", e.target.value as OfferStatus)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label small">Para Birimi</label>
        <input
          type="text"
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.currency}
          onChange={(e) => onChange("currency", e.target.value || "EUR")}
        />
      </div>

      {/* Satır 2: Müşteri / Firma */}
      <div className="col-md-6">
        <label className="form-label small">Müşteri Adı *</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          required
          value={values.customer_name}
          onChange={(e) => onChange("customer_name", e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Firma Adı</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.company_name ?? ""}
          onChange={(e) => onChange("company_name", e.target.value || null)}
        />
      </div>

      {/* Satır 3: Email / Telefon */}
      <div className="col-md-6">
        <label className="form-label small">E-posta *</label>
        <input
          type="email"
          className="form-control form-control-sm"
          disabled={disabled}
          required
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Telefon</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.phone ?? ""}
          onChange={(e) => onChange("phone", e.target.value || null)}
        />
      </div>

      {/* Satır 4: Konu / Ürün */}
      <div className="col-md-8">
        <label className="form-label small">Konu (subject)</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.subject ?? ""}
          onChange={(e) => onChange("subject", e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">İlgili Ürün ID (UUID)</label>
        <input
          className="form-control form-control-sm font-monospace"
          disabled={disabled}
          value={values.product_id ?? ""}
          onChange={(e) => onChange("product_id", e.target.value || null)}
        />
      </div>

      {/* Satır 5: Mesaj */}
      <div className="col-12">
        <label className="form-label small">Müşteri Mesajı (message)</label>
        <textarea
          className="form-control form-control-sm"
          rows={4}
          disabled={disabled}
          value={values.message ?? ""}
          onChange={(e) => onChange("message", e.target.value || null)}
        />
      </div>

      {/* Satır 6: Fiyatlar */}
      <div className="col-md-3">
        <label className="form-label small">Net Tutar</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          inputMode="decimal"
          placeholder="Örn: 18500.00"
          value={values.net_total}
          onChange={(e) => onChange("net_total", e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">KDV Oranı (%)</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          inputMode="decimal"
          placeholder="Örn: 19.00"
          value={values.vat_rate}
          onChange={(e) => onChange("vat_rate", e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">Nakliye Tutarı</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          inputMode="decimal"
          placeholder="Örn: 500.00 (opsiyonel)"
          value={values.shipping_total}
          onChange={(e) => onChange("shipping_total", e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">KDV Tutarı (otomatik)</label>
        <input className="form-control form-control-sm" disabled value={computedVatTotalStr} readOnly />
      </div>

      <div className="col-md-3 mt-2">
        <label className="form-label small">Brüt Tutar (otomatik)</label>
        <input className="form-control form-control-sm" disabled value={computedGrossTotalStr} readOnly />
      </div>

      {/* Satır 7: Tarihler / Offer No / Email Sent (read-only) */}
      <div className="col-md-4">
        <label className="form-label small">Teklif No</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          placeholder="Örn: ENS-2025-0001"
          value={values.offer_no ?? ""}
          onChange={(e) => onChange("offer_no", e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">Geçerlilik Tarihi</label>
        <input
          type="date"
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.valid_until ? values.valid_until.substring(0, 10) : ""}
          onChange={(e) => onChange("valid_until", e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">E-posta Gönderim (read-only)</label>
        <input
          className="form-control form-control-sm"
          disabled
          value={values.email_sent_at ? values.email_sent_at : ""}
          readOnly
        />
      </div>

      {/* Satır 8: Admin notu */}
      <div className="col-12">
        <label className="form-label small">
          Admin Notları (iç not, müşteriye gitmez)
        </label>
        <textarea
          className="form-control form-control-sm"
          rows={3}
          disabled={disabled}
          value={values.admin_notes ?? ""}
          onChange={(e) => onChange("admin_notes", e.target.value || null)}
        />
      </div>

      {/* Satır 9: PDF alanları */}
      <div className="col-md-8">
        <label className="form-label small">PDF URL</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          placeholder="/uploads/offers/ENS-2025-0001.pdf"
          value={values.pdf_url ?? ""}
          onChange={(e) => onChange("pdf_url", e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">PDF Asset ID</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          placeholder="Storage asset id (36 char)"
          value={values.pdf_asset_id ?? ""}
          onChange={(e) => onChange("pdf_asset_id", e.target.value || null)}
        />
      </div>

      {/* Satır 10: KVKK / onaylar */}
      <div className="col-12">
        <div className="d-flex gap-3 small mt-1">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={disabled}
              checked={values.consent_marketing}
              onChange={(e) => onChange("consent_marketing", e.target.checked)}
            />
            <label className="form-check-label">Pazarlama izni (consent_marketing)</label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={disabled}
              checked={values.consent_terms}
              onChange={(e) => onChange("consent_terms", e.target.checked)}
            />
            <label className="form-check-label">Şartlar kabul edildi (consent_terms)</label>
          </div>
        </div>
      </div>
    </div>
  );
};
