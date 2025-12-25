'use client';

import React from 'react';
import type { OfferStatus } from '@/integrations/types/offers.types';

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

  // ✅ OfferFormPage hesaplıyor ve state'e yazıyor
  vat_total: string;
  gross_total: string;

  valid_until: string | null;
  offer_no: string | null;

  admin_notes: string | null;
  pdf_url: string | null;
  pdf_asset_id: string | null;

  email_sent_at: string | null;

  form_data: Record<string, any>;
};

export type OfferFormProps = {
  mode: 'create' | 'edit';
  values: OfferFormValues;
  saving: boolean;
  onChange: <K extends keyof OfferFormValues>(field: K, value: OfferFormValues[K]) => void;
};

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const OfferForm: React.FC<OfferFormProps> = ({ values, saving, onChange }) => {
  const disabled = saving;

  return (
    <div className="row g-2">
      <div className="col-md-3">
        <label className="form-label small">Dil (locale)</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="tr / en / de"
          disabled={disabled}
          value={values.locale ?? ''}
          onChange={(e) => onChange('locale', e.target.value || null)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">Ülke Kodu</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="TR / DE / ..."
          disabled={disabled}
          value={values.country_code ?? ''}
          onChange={(e) =>
            onChange('country_code', e.target.value ? e.target.value.toUpperCase() : null)
          }
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">Durum</label>
        <select
          className="form-select form-select-sm"
          disabled={disabled}
          value={values.status}
          onChange={(e) => onChange('status', e.target.value as OfferStatus)}
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
          onChange={(e) => onChange('currency', e.target.value || 'EUR')}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Müşteri Adı *</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          required
          value={values.customer_name}
          onChange={(e) => onChange('customer_name', e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Firma Adı</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.company_name ?? ''}
          onChange={(e) => onChange('company_name', e.target.value || null)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">E-posta *</label>
        <input
          type="email"
          className="form-control form-control-sm"
          disabled={disabled}
          required
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Telefon</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.phone ?? ''}
          onChange={(e) => onChange('phone', e.target.value || null)}
        />
      </div>

      <div className="col-md-8">
        <label className="form-label small">Konu (subject)</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.subject ?? ''}
          onChange={(e) => onChange('subject', e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">İlgili Ürün ID (UUID)</label>
        <input
          className="form-control form-control-sm font-monospace"
          disabled={disabled}
          value={values.product_id ?? ''}
          onChange={(e) => onChange('product_id', e.target.value || null)}
        />
      </div>

      <div className="col-12">
        <label className="form-label small">Müşteri Mesajı (message)</label>
        <textarea
          className="form-control form-control-sm"
          rows={4}
          disabled={disabled}
          value={values.message ?? ''}
          onChange={(e) => onChange('message', e.target.value || null)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">Net Tutar</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          inputMode="decimal"
          placeholder="Örn: 18500.00"
          value={values.net_total}
          onChange={(e) => onChange('net_total', e.target.value)}
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
          onChange={(e) => onChange('vat_rate', e.target.value)}
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
          onChange={(e) => onChange('shipping_total', e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small">KDV Tutarı (otomatik)</label>
        <input
          className="form-control form-control-sm"
          disabled
          value={values.vat_total ?? ''}
          readOnly
        />
      </div>

      <div className="col-md-3 mt-2">
        <label className="form-label small">Brüt Tutar (otomatik)</label>
        <input
          className="form-control form-control-sm"
          disabled
          value={values.gross_total ?? ''}
          readOnly
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">Teklif No</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          placeholder="Örn: ENS-2025-0001"
          value={values.offer_no ?? ''}
          onChange={(e) => onChange('offer_no', e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">Geçerlilik Tarihi</label>
        <input
          type="date"
          className="form-control form-control-sm"
          disabled={disabled}
          value={values.valid_until ? values.valid_until.substring(0, 10) : ''}
          onChange={(e) => onChange('valid_until', e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">E-posta Gönderim (read-only)</label>
        <input
          className="form-control form-control-sm"
          disabled
          value={values.email_sent_at ?? ''}
          readOnly
        />
      </div>

      <div className="col-12">
        <label className="form-label small">Admin Notları (iç not, müşteriye gitmez)</label>
        <textarea
          className="form-control form-control-sm"
          rows={3}
          disabled={disabled}
          value={values.admin_notes ?? ''}
          onChange={(e) => onChange('admin_notes', e.target.value || null)}
        />
      </div>

      <div className="col-md-8">
        <label className="form-label small">PDF URL</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          placeholder="/uploads/offers/ENS-2025-0001.pdf"
          value={values.pdf_url ?? ''}
          onChange={(e) => onChange('pdf_url', e.target.value || null)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">PDF Asset ID</label>
        <input
          className="form-control form-control-sm"
          disabled={disabled}
          placeholder="Storage asset id (36 char)"
          value={values.pdf_asset_id ?? ''}
          onChange={(e) => onChange('pdf_asset_id', e.target.value || null)}
        />
      </div>

      <div className="col-12">
        <div className="d-flex gap-3 small mt-1">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={disabled}
              checked={values.consent_marketing}
              onChange={(e) => onChange('consent_marketing', e.target.checked)}
            />
            <label className="form-check-label">Pazarlama izni (consent_marketing)</label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={disabled}
              checked={values.consent_terms}
              onChange={(e) => onChange('consent_terms', e.target.checked)}
            />
            <label className="form-check-label">Şartlar kabul edildi (consent_terms)</label>
          </div>
        </div>
      </div>
    </div>
  );
};
