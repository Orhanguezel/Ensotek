// =============================================================
// FILE: src/components/admin/references/ReferencesList.tsx
// Ensotek – References Listesi
//
// Responsive Strategy (Bootstrap 5):
// - < xxl: CARDS (dar desktop + tablet + mobile) ✅
// - xxl+: TABLE (fixed layout + truncation) ✅
//
// Goal:
// - No broken table / minimal horizontal scroll
// - Clean truncation / nowrap where needed
// =============================================================

'use client';

import React from 'react';
import type { ReferenceDto } from '@/integrations/types/references.types';
import Image from 'next/image';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const formatText = (v: unknown, max = 80): string => {
  const s = safeText(v);
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '...';
};

const isTruthyBoolLike = (v: any) => v === true || v === 1 || v === '1' || v === 'true';

export type ReferencesListProps = {
  items: ReferenceDto[];
  loading: boolean;

  onEdit: (item: ReferenceDto) => void;
  onDelete: (item: ReferenceDto) => void;

  onTogglePublished: (item: ReferenceDto, value: boolean) => void;
  onToggleFeatured: (item: ReferenceDto, value: boolean) => void;
};

export const ReferencesList: React.FC<ReferencesListProps> = ({
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
      Referans listesi yayın durumu ve öne çıkarma bayraklarına göre filtrelenebilir. Detay içerik
      için <strong>&quot;Düzenle&quot;</strong> butonunu kullan.
    </span>
  );

  const resolveImg = (item: ReferenceDto) =>
    item.featured_image_url_resolved || item.featured_image || '';

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <div className="small fw-semibold">Referanslar</div>

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
        {/* ===================== XXL+ TABLE ONLY ===================== */}
        <div className="d-none d-xxl-block">
          <div className="table-responsive">
            <table
              className="table table-sm table-hover align-middle mb-0"
              style={{ tableLayout: 'fixed', width: '100%' }}
            >
              <colgroup>
                <col style={{ width: '56px' }} />
                <col style={{ width: '96px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '260px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '170px' }} />
              </colgroup>

              <thead className="table-light">
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>#</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Görsel</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Başlık / Slug</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Website</th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Yayın
                  </th>
                  <th className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    Öne Çıkan
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
                {!hasData ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 small text-muted">
                      {loading
                        ? 'Referans kayıtları yükleniyor...'
                        : 'Henüz referans kaydı bulunmuyor.'}
                    </td>
                  </tr>
                ) : (
                  rows.map((item, index) => {
                    const img = resolveImg(item);
                    const title = safeText(item.title) || '(Başlık yok)';
                    const slug = safeText(item.slug) || '(slug yok)';
                    const summary = safeText(item.summary);
                    const website = safeText(item.website_url);

                    const isPublished = isTruthyBoolLike((item as any).is_published);
                    const isFeatured = isTruthyBoolLike((item as any).is_featured);

                    return (
                      <tr key={String(item.id)}>
                        <td className="text-muted small text-nowrap">{index + 1}</td>

                        <td className="align-middle">
                          {img ? (
                            <div
                              className="border rounded bg-light"
                              style={{ width: 72, height: 44, overflow: 'hidden' }}
                            >
                              <Image
                                src={img}
                                alt={safeText(item.featured_image_alt) || title}
                                width={72}
                                height={44}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          ) : (
                            <span className="badge bg-light text-muted small">Görsel yok</span>
                          )}
                        </td>

                        {/* Title cell: must be shrinkable + truncate */}
                        <td className="align-middle" style={{ minWidth: 0 }}>
                          <div style={{ minWidth: 0 }}>
                            <div
                              className="fw-semibold small text-truncate"
                              title={title}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {title}
                            </div>

                            <div
                              className="text-muted small text-truncate"
                              title={slug}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              <code>{slug}</code>
                            </div>

                            {summary ? (
                              <div
                                className="text-muted small text-truncate mt-1"
                                title={summary}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {formatText(summary, 140)}
                              </div>
                            ) : null}
                          </div>
                        </td>

                        {/* Website: truncate to avoid overflow */}
                        <td className="align-middle small" style={{ minWidth: 0 }}>
                          {website ? (
                            <a
                              href={website}
                              target="_blank"
                              rel="noreferrer"
                              className="d-block text-truncate"
                              title={website}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {website}
                            </a>
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
                              checked={isFeatured}
                              disabled={busy}
                              onChange={(e) => onToggleFeatured(item, e.target.checked)}
                            />
                          </div>
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

        {/* ===================== < XXL : CARDS (dar desktop + tablet + mobile) ===================== */}
        <div className="d-block d-xxl-none">
          {loading ? (
            <div className="px-3 py-3 text-center text-muted small">
              Referans kayıtları yükleniyor...
            </div>
          ) : hasData ? (
            <div className="p-3">
              <div className="row g-3">
                {rows.map((item, index) => {
                  const img = resolveImg(item);
                  const title = safeText(item.title) || '(Başlık yok)';
                  const slug = safeText(item.slug) || '(slug yok)';
                  const summary = safeText(item.summary);
                  const website = safeText(item.website_url);

                  const isPublished = isTruthyBoolLike((item as any).is_published);
                  const isFeatured = isTruthyBoolLike((item as any).is_featured);

                  return (
                    <div key={String(item.id)} className="col-12 col-lg-6">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
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
                                checked={isFeatured}
                                disabled={busy}
                                onChange={(e) => onToggleFeatured(item, e.target.checked)}
                              />
                              <label className="form-check-label small">Öne çıkan</label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 d-flex gap-2">
                          {img ? (
                            <div
                              className="border rounded bg-light"
                              style={{
                                width: 96,
                                height: 60,
                                overflow: 'hidden',
                                flex: '0 0 auto',
                              }}
                            >
                              <Image
                                src={img}
                                alt={safeText(item.featured_image_alt) || title}
                                width={96}
                                height={60}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          ) : (
                            <div className="d-flex align-items-center">
                              <span className="badge bg-light text-muted small">Görsel yok</span>
                            </div>
                          )}

                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                              {title}
                            </div>

                            <div className="text-muted small" style={{ wordBreak: 'break-word' }}>
                              Slug: <code>{slug}</code>
                            </div>

                            {summary ? (
                              <div
                                className="text-muted small mt-1"
                                style={{ wordBreak: 'break-word' }}
                              >
                                {formatText(summary, 170)}
                              </div>
                            ) : null}

                            {website ? (
                              <div
                                className="text-muted small mt-1"
                                style={{ wordBreak: 'break-word' }}
                              >
                                Website:{' '}
                                <a href={website} target="_blank" rel="noreferrer">
                                  {website}
                                </a>
                              </div>
                            ) : (
                              <div className="text-muted small mt-1">Website: -</div>
                            )}
                          </div>
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
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Henüz referans kaydı bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
