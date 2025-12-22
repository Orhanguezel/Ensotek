// =============================================================
// FILE: src/components/admin/catalog/CatalogRequestsList.tsx
// Ensotek – Admin Catalog Requests List
//
// Responsive Strategy (Bootstrap 5):
// - < xxl: CARDS
// - xxl+: TABLE (table-layout: fixed + truncation)
//
// Notes:
// - Row click -> detail
// - Buttons stopPropagation()
// =============================================================

'use client';

import React from 'react';
import { useRouter } from 'next/router';
import type { CatalogRequestDto } from '@/integrations/types/catalog.types';
import { statusBadgeClass } from './CatalogStatus';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const fmtDate = (value: unknown) => {
  if (!value) return '-';
  const s = typeof value === 'string' ? value : (value as any)?.toString?.() ?? '';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s || '-';
  return d.toLocaleString('tr-TR');
};

const pickLocale = (r: CatalogRequestDto) => {
  const anyR = r as any;
  return anyR.locale ?? anyR.submitted_locale ?? anyR.locale_resolved ?? '-';
};

export type CatalogRequestsListProps = {
  items: CatalogRequestDto[];
  loading: boolean;
  onDelete: (item: CatalogRequestDto) => void;
};

export const CatalogRequestsList: React.FC<CatalogRequestsListProps> = ({
  items,
  loading,
  onDelete,
}) => {
  const router = useRouter();

  const rows = items ?? [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;
  const busy = !!loading;

  const handleRowClick = (item: CatalogRequestDto) => {
    router.push(`/admin/catalog-requests/${encodeURIComponent(String((item as any).id))}`);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, item: CatalogRequestDto) => {
    e.stopPropagation();
    if (!busy) onDelete(item);
  };

  const caption = (
    <span className="text-muted small">
      Satıra tıklayarak detaya gidebilirsin. Silme için “Sil” butonunu kullan.
    </span>
  );

  if (!busy && !hasData) {
    return (
      <div className="card">
        <div className="card-body py-4 text-center text-muted small">Henüz katalog talebi yok.</div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <div className="small fw-semibold">Katalog Talepleri</div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {busy && (
              <span className="small text-muted d-flex align-items-center gap-1">
                <span className="spinner-border spinner-border-sm" role="status" />
                <span>Yükleniyor...</span>
              </span>
            )}
            <span className="text-muted small">
              Toplam: <strong>{totalItems}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {/* ===================== XXL+ TABLE ===================== */}
        <div className="d-none d-xxl-block">
          <div className="table-responsive">
            <table
              className="table table-sm table-hover align-middle mb-0"
              style={{ tableLayout: 'fixed', width: '100%' }}
            >
              <colgroup>
                <col style={{ width: '120px' }} /> {/* Status */}
                <col style={{ width: '220px' }} /> {/* Customer */}
                <col style={{ width: '260px' }} /> {/* Email */}
                <col style={{ width: '220px' }} /> {/* Company */}
                <col style={{ width: '90px' }} /> {/* Locale */}
                <col style={{ width: '170px' }} /> {/* Sent */}
                <col style={{ width: '190px' }} /> {/* Created */}
                <col style={{ width: '160px' }} /> {/* Actions */}
              </colgroup>

              <thead className="table-light">
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Müşteri</th>
                  <th style={{ whiteSpace: 'nowrap' }}>E-posta</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Şirket</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Locale</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Sent</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Oluşturulma</th>
                  <th className="text-end" style={{ whiteSpace: 'nowrap' }}>
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => {
                  const anyR = r as any;
                  const id = String(anyR.id ?? r.id);
                  const customerName = safeText(anyR.customer_name) || '-';
                  const email = safeText(anyR.email) || '-';
                  const company = safeText(anyR.company_name) || '-';
                  const locale = pickLocale(r);
                  const sentAt = anyR.email_sent_at ? fmtDate(anyR.email_sent_at) : '-';
                  const createdAt = fmtDate(anyR.created_at);

                  return (
                    <tr key={id} onClick={() => handleRowClick(r)} style={{ cursor: 'pointer' }}>
                      <td className="small text-nowrap">
                        <span className={statusBadgeClass(anyR.status)}>
                          {safeText(anyR.status)}
                        </span>
                      </td>

                      <td className="small" style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" title={customerName}>
                          {customerName}
                        </div>
                      </td>

                      <td className="small text-muted" style={{ minWidth: 0 }}>
                        <div className="text-truncate" title={email}>
                          {email}
                        </div>
                      </td>

                      <td className="small text-muted" style={{ minWidth: 0 }}>
                        <div className="text-truncate" title={company}>
                          {company}
                        </div>
                      </td>

                      <td className="small text-muted text-nowrap">
                        <code>{safeText(locale) || '-'}</code>
                      </td>

                      <td className="small text-muted text-nowrap">{sentAt}</td>

                      <td className="small text-muted text-nowrap">{createdAt}</td>

                      <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleRowClick(r)}
                            disabled={busy}
                          >
                            Gör
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => handleDeleteClick(e, r)}
                            disabled={busy}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {busy && (
                  <tr>
                    <td colSpan={8} className="text-center py-3 text-muted small">
                      Yükleniyor...
                    </td>
                  </tr>
                )}
              </tbody>

              <caption className="px-3 py-2 text-start">{caption}</caption>
            </table>
          </div>
        </div>

        {/* ===================== < XXL : CARDS ===================== */}
        <div className="d-block d-xxl-none">
          {busy ? (
            <div className="px-3 py-3 text-center text-muted small">Yükleniyor...</div>
          ) : (
            <div className="p-3">
              <div className="row g-3">
                {rows.map((r) => {
                  const anyR = r as any;
                  const id = String(anyR.id ?? r.id);
                  const customerName = safeText(anyR.customer_name) || '-';
                  const email = safeText(anyR.email) || '-';
                  const company = safeText(anyR.company_name) || '-';
                  const locale = pickLocale(r);
                  const sentAt = anyR.email_sent_at ? fmtDate(anyR.email_sent_at) : '-';
                  const createdAt = fmtDate(anyR.created_at);
                  const status = safeText(anyR.status);

                  return (
                    <div key={id} className="col-12 col-lg-6">
                      <div
                        className="border rounded-3 p-3 bg-white h-100"
                        role="button"
                        onClick={() => handleRowClick(r)}
                      >
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="d-flex flex-wrap gap-2">
                            <span className={statusBadgeClass(anyR.status)}>{status}</span>
                            <span className="badge bg-light text-dark border small">
                              Locale: <code>{safeText(locale) || '-'}</code>
                            </span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                            {customerName}
                          </div>
                          <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                            {email}
                          </div>
                          {company !== '-' ? (
                            <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                              Şirket: {company}
                            </div>
                          ) : null}
                        </div>

                        <div className="text-muted small mt-2">
                          <div>Sent: {sentAt}</div>
                          <div>Oluşturulma: {createdAt}</div>
                        </div>

                        <div className="mt-3 d-flex gap-2 flex-wrap justify-content-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(r);
                            }}
                            disabled={busy}
                          >
                            Gör
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => handleDeleteClick(e, r)}
                            disabled={busy}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3">{caption}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
