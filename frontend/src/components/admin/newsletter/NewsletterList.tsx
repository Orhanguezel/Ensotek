// =============================================================
// FILE: src/components/admin/newsletter/NewsletterList.tsx
// Ensotek – Admin Newsletter Listesi
//
// Responsive Strategy (Bootstrap 5):
// - < xxl: CARDS
// - xxl+: TABLE (fixed layout + truncation)
//
// Goal: Desktop/tablet landscape -> minimal/no horizontal scroll
// =============================================================

'use client';

import React from 'react';
import type { NewsletterAdminDto } from '@/integrations/types/newsletter.types';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const formatDate = (value: unknown): string => {
  if (!value) return '-';
  const s = typeof value === 'string' ? value : (value as any)?.toString?.() ?? '';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s || '-';
  return d.toLocaleString();
};

const normLocale = (v: unknown) =>
  safeText(v).trim().toLowerCase().replace('_', '-').split('-')[0].trim();

const boolBadge = (value: boolean, trueLabel: string, falseLabel: string) =>
  value ? (
    <span className="badge bg-success">{trueLabel}</span>
  ) : (
    <span className="badge bg-secondary">{falseLabel}</span>
  );

export interface NewsletterListProps {
  items: NewsletterAdminDto[];
  loading: boolean;
  onEdit: (item: NewsletterAdminDto) => void;
  onDelete: (item: NewsletterAdminDto) => void;
  onToggleVerified: (item: NewsletterAdminDto, value: boolean) => void;
  onToggleSubscribed: (item: NewsletterAdminDto, value: boolean) => void;
}

export const NewsletterList: React.FC<NewsletterListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleVerified,
  onToggleSubscribed,
}) => {
  const rows = items ?? [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;

  const busy = !!loading;

  const caption = (
    <span className="text-muted small">
      Newsletter kayıtlarını doğrulama ve abonelik durumuna göre yönetebilirsin.
    </span>
  );

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <div className="small fw-semibold">Bülten Aboneleri</div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {loading && (
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
                <col style={{ width: '360px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '260px' }} />
                <col style={{ width: '180px' }} />
              </colgroup>

              <thead className="table-light">
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>Email</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Dil</th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Doğrulama
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Abonelik
                  </th>
                  <th style={{ whiteSpace: 'nowrap' }}>Tarih</th>
                  <th className="text-end" style={{ whiteSpace: 'nowrap' }}>
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {!hasData ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 small text-muted">
                      {loading ? 'Yükleniyor...' : 'Kayıt bulunamadı.'}
                    </td>
                  </tr>
                ) : (
                  rows.map((item) => {
                    const email = safeText(item.email) || '(email yok)';
                    const id = safeText(item.id);
                    const locale = normLocale((item as any).locale);

                    const created = formatDate((item as any).created_at);
                    const updated = formatDate((item as any).updated_at);
                    const unsub = (item as any).unsubscribed_at
                      ? formatDate((item as any).unsubscribed_at)
                      : '';

                    const isVerified = !!(item as any).is_verified;
                    const isSubscribed = !!(item as any).is_subscribed;

                    return (
                      <tr key={String(item.id)}>
                        {/* Email */}
                        <td className="small" style={{ minWidth: 0 }}>
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold small text-truncate" title={email}>
                              {email}
                            </div>
                            <div className="text-muted small text-truncate" title={`ID: ${id}`}>
                              ID: <span className="text-monospace">{id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Locale */}
                        <td className="small text-nowrap">
                          {locale ? (
                            <code>{locale}</code>
                          ) : (
                            <span className="text-muted">(yok)</span>
                          )}
                        </td>

                        {/* Verified */}
                        <td className="text-center">
                          <div className="d-inline-flex flex-column align-items-center gap-1">
                            {boolBadge(isVerified, 'Doğrulandı', 'Bekliyor')}
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isVerified}
                                disabled={busy}
                                onChange={(e) => onToggleVerified(item, e.target.checked)}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Subscribed */}
                        <td className="text-center">
                          <div className="d-inline-flex flex-column align-items-center gap-1">
                            {boolBadge(isSubscribed, 'Aktif', 'Unsubscribed')}
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isSubscribed}
                                disabled={busy}
                                onChange={(e) => onToggleSubscribed(item, e.target.checked)}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="small" style={{ minWidth: 0 }}>
                          <div className="text-truncate" style={{ whiteSpace: 'nowrap' }}>
                            Oluşturma: {created}
                          </div>
                          <div
                            className="text-muted small text-truncate"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Güncelleme: {updated}
                          </div>
                          {unsub ? (
                            <div
                              className="text-muted small text-truncate"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              Unsub: {unsub}
                            </div>
                          ) : null}
                        </td>

                        {/* Actions */}
                        <td className="text-end text-nowrap">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => onEdit(item)}
                              disabled={busy}
                            >
                              Düzenle
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onDelete(item)}
                              disabled={busy}
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

              <caption className="px-3 py-2 text-start">{caption}</caption>
            </table>
          </div>
        </div>

        {/* ===================== < XXL : CARDS ===================== */}
        <div className="d-block d-xxl-none">
          {loading ? (
            <div className="px-3 py-3 text-center text-muted small">Yükleniyor...</div>
          ) : hasData ? (
            <div className="p-3">
              <div className="row g-3">
                {rows.map((item) => {
                  const email = safeText(item.email) || '(email yok)';
                  const id = safeText(item.id);
                  const locale = normLocale((item as any).locale);

                  const created = formatDate((item as any).created_at);
                  const updated = formatDate((item as any).updated_at);
                  const unsub = (item as any).unsubscribed_at
                    ? formatDate((item as any).unsubscribed_at)
                    : '';

                  const isVerified = !!(item as any).is_verified;
                  const isSubscribed = !!(item as any).is_subscribed;

                  return (
                    <div key={String(item.id)} className="col-12 col-lg-6">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                              {email}
                            </div>
                            <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                              ID: <span className="text-monospace">{id}</span>
                              {locale ? (
                                <>
                                  {' '}
                                  • Dil: <code>{locale}</code>
                                </>
                              ) : null}
                            </div>
                          </div>

                          <div className="d-flex flex-column align-items-end gap-2">
                            <div className="d-flex flex-wrap gap-2 justify-content-end">
                              {boolBadge(isVerified, 'Doğrulandı', 'Bekliyor')}
                              {boolBadge(isSubscribed, 'Aktif', 'Unsubscribed')}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 d-flex flex-wrap gap-3">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isVerified}
                              disabled={busy}
                              onChange={(e) => onToggleVerified(item, e.target.checked)}
                            />
                            <label className="form-check-label small">Doğrulama</label>
                          </div>

                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isSubscribed}
                              disabled={busy}
                              onChange={(e) => onToggleSubscribed(item, e.target.checked)}
                            />
                            <label className="form-check-label small">Abonelik</label>
                          </div>
                        </div>

                        <div className="text-muted small mt-2">
                          <div>Oluşturma: {created}</div>
                          <div>Güncelleme: {updated}</div>
                          {unsub ? <div>Unsub: {unsub}</div> : null}
                        </div>

                        <div className="mt-3 d-flex gap-2 flex-wrap justify-content-end">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onEdit(item)}
                            disabled={busy}
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDelete(item)}
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
          ) : (
            <div className="px-3 py-3 text-center text-muted small">Kayıt bulunamadı.</div>
          )}
        </div>
      </div>
    </div>
  );
};
