// =============================================================
// FILE: src/components/admin/library/LibraryList.tsx
// Ensotek – Library Listesi (Responsive)
// - < xxl: CARDS (tablet + mobile)
// - xxl+: TABLE (scroll-free table-layout fixed + truncation)
// Backend LibraryDto + RTK tipleri ile uyumlu
// =============================================================

'use client';

import React from 'react';
import type { LibraryDto } from '@/integrations/types/library.types';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const formatText = (v: unknown, max = 80): string => {
  const s = safeText(v);
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '...';
};

const isTruthy01 = (v: any) => v === 1 || v === true || v === '1' || v === 'true';

export type LibraryListProps = {
  items: LibraryDto[];
  loading: boolean;

  onEdit: (item: LibraryDto) => void;
  onDelete: (item: LibraryDto) => void;

  onTogglePublished: (item: LibraryDto, value: boolean) => void;
  // UI: "Öne Çıkan" switch'i is_active ile eşlenmiş durumda
  onToggleFeatured: (item: LibraryDto, value: boolean) => void;
};

export const LibraryList: React.FC<LibraryListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}) => {
  const rows = items ?? [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;

  const busy = !!loading;

  const caption = (
    <span className="text-muted small">
      Library içerikleri yayın ve aktiflik durumuna göre yönetilebilir. Detay için{' '}
      <strong>&quot;Düzenle&quot;</strong> butonunu kullan.
    </span>
  );

  if (!busy && !hasData) {
    return (
      <div className="card">
        <div className="card-body py-4 text-center text-muted small">
          Henüz kayıtlı library içeriği bulunmuyor.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <div className="small fw-semibold">Library İçerikleri</div>

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
                <col style={{ width: '56px' }} /> {/* # */}
                <col style={{ width: '360px' }} /> {/* Title/Slug */}
                <col style={{ width: '420px' }} /> {/* Summary */}
                <col style={{ width: '90px' }} /> {/* Published */}
                <col style={{ width: '90px' }} /> {/* Active */}
                <col style={{ width: '120px' }} /> {/* Views */}
                <col style={{ width: '120px' }} /> {/* Downloads */}
                <col style={{ width: '80px' }} /> {/* Order */}
                <col style={{ width: '180px' }} /> {/* Actions */}
              </colgroup>

              <thead className="table-light">
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>#</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Başlık / Slug</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Özet</th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Yayın
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Aktif
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Görünt.
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    İndirme
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Sıra
                  </th>
                  <th className="text-end" style={{ whiteSpace: 'nowrap' }}>
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {busy ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-muted small">
                      Library içerikleri yükleniyor...
                    </td>
                  </tr>
                ) : (
                  rows.map((item, index) => {
                    const title = safeText(item.title) || '(Başlık yok)';
                    const slug = safeText(item.slug) || '(slug yok)';
                    const summary = safeText(item.summary);
                    const isPublished = isTruthy01((item as any).is_published);
                    const isActive = isTruthy01((item as any).is_active);

                    return (
                      <tr key={String(item.id)}>
                        <td className="text-muted small text-nowrap">{index + 1}</td>

                        <td className="align-middle" style={{ minWidth: 0 }}>
                          <div className="fw-semibold small text-truncate" title={title}>
                            {title}
                          </div>
                          <div className="text-muted small text-truncate" title={slug}>
                            <code>{slug}</code>
                          </div>
                        </td>

                        <td className="align-middle small" style={{ minWidth: 0 }}>
                          {summary ? (
                            <div className="text-truncate" title={summary}>
                              {formatText(summary, 160)}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>

                        <td className="align-middle text-center">
                          <div className="form-check form-switch d-inline-flex m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isPublished}
                              disabled={busy}
                              onChange={(e) => onTogglePublished(item, e.target.checked)}
                            />
                          </div>
                        </td>

                        <td className="align-middle text-center">
                          <div className="form-check form-switch d-inline-flex m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isActive}
                              disabled={busy}
                              onChange={(e) => onToggleFeatured(item, e.target.checked)}
                            />
                          </div>
                        </td>

                        <td className="align-middle text-center small">
                          {(item as any).views ?? 0}
                        </td>

                        <td className="align-middle text-center small">
                          {(item as any).download_count ?? 0}
                        </td>

                        <td className="align-middle text-center small">
                          {(item as any).display_order ?? 0}
                        </td>

                        <td className="align-middle text-end text-nowrap">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
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
          {busy ? (
            <div className="px-3 py-3 text-center text-muted small">
              Library içerikleri yükleniyor...
            </div>
          ) : (
            <div className="p-3">
              <div className="row g-3">
                {rows.map((item, index) => {
                  const title = safeText(item.title) || '(Başlık yok)';
                  const slug = safeText(item.slug) || '(slug yok)';
                  const summary = safeText(item.summary);
                  const isPublished = isTruthy01((item as any).is_published);
                  const isActive = isTruthy01((item as any).is_active);

                  return (
                    <div key={String(item.id)} className="col-12 col-lg-6">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="d-flex flex-wrap gap-2">
                            <span className="badge bg-light text-dark border">#{index + 1}</span>
                            <span className="badge bg-light text-dark border small">
                              Sıra: <strong>{(item as any).display_order ?? 0}</strong>
                            </span>
                          </div>

                          <div className="d-flex flex-column align-items-end gap-1">
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isPublished}
                                disabled={busy}
                                onChange={(e) => onTogglePublished(item, e.target.checked)}
                              />
                              <label className="form-check-label small">Yayın</label>
                            </div>

                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isActive}
                                disabled={busy}
                                onChange={(e) => onToggleFeatured(item, e.target.checked)}
                              />
                              <label className="form-check-label small">Aktif</label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                            {title}
                          </div>
                          <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                            Slug: <code>{slug}</code>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="text-muted small">Özet</div>
                          {summary ? (
                            <div className="small" style={{ wordBreak: 'break-word' }}>
                              {formatText(summary, 200)}
                            </div>
                          ) : (
                            <div className="text-muted small">-</div>
                          )}
                        </div>

                        <div className="mt-2 d-flex flex-wrap gap-2">
                          <span className="badge bg-light text-dark border small">
                            Görüntülenme: <strong>{(item as any).views ?? 0}</strong>
                          </span>
                          <span className="badge bg-light text-dark border small">
                            İndirme: <strong>{(item as any).download_count ?? 0}</strong>
                          </span>
                        </div>

                        <div className="mt-3 d-flex gap-2 flex-wrap justify-content-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
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
          )}
        </div>
      </div>
    </div>
  );
};
