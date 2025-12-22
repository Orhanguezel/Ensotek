// =============================================================
// FILE: src/components/admin/offer/OfferList.tsx
// Ensotek – Offer List
// Responsive Strategy (Bootstrap 5):
// - < xxl: Cards (tablet + mobile)
// - xxl+: Table
// =============================================================

'use client';

import React, { useMemo } from 'react';
import type { OfferRow } from '@/integrations/types/offers.types';

/* ---------------- Helpers ---------------- */

const formatText = (v: unknown, max = 80): string => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '...';
};

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const formatDate = (v: unknown): string => {
  const raw = safeText(v).trim();
  if (!raw) return '-';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw; // backend zaten string formatlı döndürüyor olabilir
  return d.toLocaleString();
};

const formatMoney = (amount: unknown, currency: unknown) => {
  const a = amount === null || amount === undefined ? '' : String(amount);
  if (!a) return '-';
  const c = safeText(currency) || 'EUR';
  return { amount: a, currency: c };
};

const statusBadgeClass = (statusRaw: unknown) => {
  const s = safeText(statusRaw).toLowerCase();
  if (!s) return 'bg-light text-dark border';

  // İstersen kendi status enum’larına göre genişlet
  if (s.includes('new') || s.includes('yeni'))
    return 'bg-info-subtle text-info border border-info-subtle';
  if (s.includes('pending') || s.includes('bek'))
    return 'bg-warning-subtle text-warning border border-warning-subtle';
  if (s.includes('sent') || s.includes('gönder'))
    return 'bg-primary-subtle text-primary border border-primary-subtle';
  if (s.includes('approved') || s.includes('onay'))
    return 'bg-success-subtle text-success border border-success-subtle';
  if (s.includes('cancel') || s.includes('iptal') || s.includes('rejected'))
    return 'bg-danger-subtle text-danger border border-danger-subtle';

  return 'bg-light text-dark border';
};

export type OfferListProps = {
  items: OfferRow[];
  loading: boolean;
  onEdit: (item: OfferRow) => void;
  onDelete: (item: OfferRow) => void;
};

export const OfferList: React.FC<OfferListProps> = ({ items, loading, onEdit, onDelete }) => {
  const rows = items ?? [];
  const hasData = rows.length > 0;

  const headerRight = useMemo(() => {
    if (!loading) return null;
    return (
      <span className="small text-muted d-flex align-items-center gap-1">
        <span className="spinner-border spinner-border-sm" role="status" aria-label="loading" />
        <span>Yükleniyor...</span>
      </span>
    );
  }, [loading]);

  const renderEmpty = (colSpan?: number) => (
    <>
      {!hasData && (
        <div className="px-3 py-3 text-center text-muted small">
          {loading ? 'Teklif kayıtları yükleniyor...' : 'Henüz teklif kaydı bulunmuyor.'}
        </div>
      )}
      {/* table body empty case handled separately */}
      {hasData ? null : colSpan ? null : null}
    </>
  );

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header py-2">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="small fw-semibold">Teklifler</div>
          {headerRight}
        </div>
      </div>

      <div className="card-body p-0">
        {/* =========================================================
            XXL+ TABLE
           ========================================================= */}
        <div className="d-none d-xxl-block">
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th style={{ width: 170 }}>Oluşturulma</th>
                  <th style={{ width: 140 }}>Durum</th>
                  <th style={{ minWidth: 260 }}>Müşteri / Firma</th>
                  <th style={{ minWidth: 220 }}>E-posta</th>
                  <th style={{ minWidth: 260 }}>Konu</th>
                  <th className="text-end" style={{ width: 160 }}>
                    Toplam (Brüt)
                  </th>
                  <th style={{ width: 160 }} className="text-end">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {!hasData ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 small text-muted">
                      {loading
                        ? 'Teklif kayıtları yükleniyor...'
                        : 'Henüz teklif kaydı bulunmuyor.'}
                    </td>
                  </tr>
                ) : (
                  rows.map((item, index) => {
                    const money = formatMoney((item as any).gross_total, (item as any).currency);
                    const created = formatDate((item as any).created_at);

                    return (
                      <tr key={(item as any).id ?? index}>
                        <td className="text-muted small">{index + 1}</td>

                        <td
                          className="small text-muted text-nowrap"
                          title={safeText((item as any).created_at)}
                        >
                          {created}
                        </td>

                        <td>
                          <span className={`badge small ${statusBadgeClass((item as any).status)}`}>
                            {safeText((item as any).status) || '-'}
                          </span>
                        </td>

                        <td>
                          <div
                            className="fw-semibold small text-truncate"
                            style={{ maxWidth: 360 }}
                          >
                            {safeText((item as any).customer_name) || (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: 360 }}>
                            {safeText((item as any).company_name)}
                          </div>
                        </td>

                        <td className="small text-truncate" style={{ maxWidth: 340 }}>
                          {safeText((item as any).email) || <span className="text-muted">-</span>}
                        </td>

                        <td className="small">
                          <span title={safeText((item as any).subject)}>
                            {formatText((item as any).subject ?? '', 80) || (
                              <span className="text-muted">-</span>
                            )}
                          </span>
                        </td>

                        <td className="text-end small text-nowrap">
                          {typeof money === 'string' ? (
                            <span className="text-muted">{money}</span>
                          ) : (
                            <>
                              <span className="fw-semibold">{money.amount}</span>{' '}
                              <span className="text-muted">{money.currency}</span>
                            </>
                          )}
                        </td>

                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => onEdit(item)}
                            >
                              Düzenle
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onDelete(item)}
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              <caption className="px-3 py-2 text-start">
                <span className="text-muted small">
                  Teklifler arama, durum filtresi ve diğer parametrelere göre yönetilebilir. Detay,
                  PDF üretimi ve e-posta gönderimi için <strong>“Düzenle”</strong> butonunu
                  kullanın.
                </span>
              </caption>
            </table>
          </div>
        </div>

        {/* =========================================================
            < XXL : CARDS (tablet + mobile)
           ========================================================= */}
        <div className="d-block d-xxl-none">
          {loading && !hasData ? (
            <div className="px-3 py-3 text-center text-muted small">
              Teklif kayıtları yükleniyor...
            </div>
          ) : hasData ? (
            <div className="p-3">
              <div className="row g-3">
                {rows.map((item, index) => {
                  const money = formatMoney((item as any).gross_total, (item as any).currency);
                  const created = formatDate((item as any).created_at);

                  return (
                    <div key={(item as any).id ?? index} className="col-12 col-lg-6">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        {/* top row */}
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="badge bg-light text-dark border">#{index + 1}</span>
                            <span className={`badge ${statusBadgeClass((item as any).status)}`}>
                              {safeText((item as any).status) || '-'}
                            </span>
                          </div>

                          <div className="text-end">
                            <div className="small text-muted text-nowrap">{created}</div>
                            <div className="small text-nowrap mt-1">
                              {typeof money === 'string' ? (
                                <span className="text-muted">{money}</span>
                              ) : (
                                <>
                                  <span className="fw-semibold">{money.amount}</span>{' '}
                                  <span className="text-muted">{money.currency}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* body */}
                        <div className="mt-2">
                          <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                            {safeText((item as any).customer_name) || (
                              <span className="text-muted">-</span>
                            )}
                          </div>

                          {safeText((item as any).company_name) ? (
                            <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                              {safeText((item as any).company_name)}
                            </div>
                          ) : null}

                          <div
                            className="text-muted small mt-2"
                            style={{ wordBreak: 'break-word' }}
                          >
                            <span className="me-1">E-posta:</span>
                            <span>{safeText((item as any).email) || '-'}</span>
                          </div>

                          <div
                            className="text-muted small mt-1"
                            style={{ wordBreak: 'break-word' }}
                          >
                            <span className="me-1">Konu:</span>
                            <span title={safeText((item as any).subject)}>
                              {formatText((item as any).subject ?? '', 120) || '-'}
                            </span>
                          </div>
                        </div>

                        {/* actions */}
                        <div className="mt-3 d-grid gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onEdit(item)}
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDelete(item)}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3">
                <span className="text-muted small">
                  Tablet ve mobil görünümde teklifler kart formatında listelenir. Çok büyük
                  ekranlarda (xxl+) tablo görünümü kullanılır.
                </span>
              </div>
            </div>
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Henüz teklif kaydı bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
