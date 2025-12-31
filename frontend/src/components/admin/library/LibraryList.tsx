// =============================================================
// FILE: src/components/admin/library/LibraryList.tsx
// Ensotek – Library Listesi (Responsive, Dense)
// - < lg: CARDS
// - lg..xxl: COMPACT TABLE
// - xxl+: WIDE TABLE
// ✅ Schema/DTO aligned:
//   - title -> name
//   - featured toggle -> featured
//   - active toggle -> is_active
// =============================================================

'use client';

import React from 'react';
import type { LibraryDto } from '@/integrations/types/library.types';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const isTruthy01 = (v: any) => v === 1 || v === true || v === '1' || v === 'true';

const getItemTitle = (item: LibraryDto): string => {
  const name = safeText((item as any).name).trim();
  if (name) return name;

  const slug = safeText((item as any).slug).trim();
  if (slug) return slug;

  return '(Başlık yok)';
};

const getItemSlug = (item: LibraryDto): string => {
  const slug = safeText((item as any).slug).trim();
  return slug || '(slug yok)';
};

const num0 = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export type LibraryListProps = {
  items: LibraryDto[];
  loading: boolean;

  onEdit: (item: LibraryDto) => void;
  onDelete: (item: LibraryDto) => void;

  onTogglePublished: (item: LibraryDto, value: boolean) => void;
  onToggleFeatured: (item: LibraryDto, value: boolean) => void;

  /** Active / Passive (backend: is_active) */
  onToggleActive: (item: LibraryDto, value: boolean) => void;
};

const Switch: React.FC<{
  checked: boolean;
  disabled?: boolean;
  ariaLabel: string;
  onChange: (checked: boolean) => void;
}> = ({ checked, disabled, ariaLabel, onChange }) => {
  return (
    <div className="form-check form-switch d-inline-flex m-0 align-items-center">
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        // Güvenlik: Switch tıklaması üst container event’lerine karışmasın
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
};

export const LibraryList: React.FC<LibraryListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
  onToggleActive,
}) => {
  const rows = items ?? [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;

  const busy = !!loading;

  const caption = (
    <span className="text-muted small">
      Library içerikleri yayın, öne çıkarma ve aktiflik durumuna göre yönetilebilir. Detay için{' '}
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

  // col widths
  const COL_WIDTHS_XXL = [
    '52px', // #
    '420px', // title/slug
    '86px', // aktif
    '86px', // yayın
    '110px', // öne çıkan
    '90px', // görünt
    '90px', // indirme
    '80px', // sıra
    '180px', // işlemler
  ] as const;

  const COL_WIDTHS_COMPACT = [
    '52px', // #
    'auto', // title/slug
    '86px', // aktif
    '86px', // yayın
    '110px', // öne çıkan
    '160px', // işlemler
  ] as const;

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <div className="small fw-semibold">Library İçerikleri</div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {busy && (
              <span className="small text-muted d-flex align-items-center gap-2">
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
        {/* ===================== XXL+ WIDE TABLE ===================== */}
        <div className="d-none d-xxl-block">
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0 ensotek-table-fixed ensotek-table-dense">
              <colgroup>
                {COL_WIDTHS_XXL.map((w, i) => (
                  <col key={i} style={{ width: w }} />
                ))}
              </colgroup>

              <thead className="table-light">
                <tr>
                  <th className="text-nowrap">#</th>
                  <th className="text-nowrap">Başlık / Slug</th>
                  <th className="text-center text-nowrap">Aktif</th>
                  <th className="text-center text-nowrap">Yayın</th>
                  <th className="text-center text-nowrap">Öne Çıkan</th>
                  <th className="text-center text-nowrap">Görünt.</th>
                  <th className="text-center text-nowrap">İndirme</th>
                  <th className="text-center text-nowrap">Sıra</th>
                  <th className="text-end text-nowrap">İşlemler</th>
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
                    const title = getItemTitle(item);
                    const slug = getItemSlug(item);

                    const isActive = isTruthy01((item as any).is_active);
                    const isPublished = isTruthy01((item as any).is_published);
                    const isFeatured = isTruthy01((item as any).featured);

                    const views = num0((item as any).views);
                    const downloads = num0((item as any).download_count);
                    const order = num0((item as any).display_order);

                    return (
                      <tr
                        key={String(item.id)}
                        className={!isActive ? 'ensotek-row-inactive' : undefined}
                      >
                        <td className="text-muted small text-nowrap">{index + 1}</td>

                        <td className="align-middle" style={{ minWidth: 0 }}>
                          <div className="fw-semibold small ensotek-truncate" title={title}>
                            {title}
                          </div>
                          <div className="text-muted small ensotek-truncate" title={slug}>
                            <code>{slug}</code>
                          </div>
                        </td>

                        <td className="align-middle text-center">
                          <Switch
                            checked={isActive}
                            disabled={busy}
                            ariaLabel="Aktif/Pasif"
                            onChange={(checked) => onToggleActive(item, checked)}
                          />
                        </td>

                        <td className="align-middle text-center">
                          <Switch
                            checked={isPublished}
                            disabled={busy}
                            ariaLabel="Yayın"
                            onChange={(checked) => onTogglePublished(item, checked)}
                          />
                        </td>

                        <td className="align-middle text-center">
                          <Switch
                            checked={isFeatured}
                            disabled={busy}
                            ariaLabel="Öne Çıkan"
                            onChange={(checked) => onToggleFeatured(item, checked)}
                          />
                        </td>

                        <td className="align-middle text-center small">{views}</td>
                        <td className="align-middle text-center small">{downloads}</td>
                        <td className="align-middle text-center small">{order}</td>

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

        {/* ===================== LG..XXL COMPACT TABLE ===================== */}
        <div className="d-none d-lg-block d-xxl-none">
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0 ensotek-table-dense">
              <colgroup>
                {COL_WIDTHS_COMPACT.map((w, i) => (
                  <col key={i} style={{ width: w === 'auto' ? undefined : w }} />
                ))}
              </colgroup>

              <thead className="table-light">
                <tr>
                  <th className="text-nowrap">#</th>
                  <th className="text-nowrap">Başlık / Slug</th>
                  <th className="text-center text-nowrap">Aktif</th>
                  <th className="text-center text-nowrap">Yayın</th>
                  <th className="text-center text-nowrap">Öne Çıkan</th>
                  <th className="text-end text-nowrap">İşlemler</th>
                </tr>
              </thead>

              <tbody>
                {busy ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted small">
                      Library içerikleri yükleniyor...
                    </td>
                  </tr>
                ) : (
                  rows.map((item, index) => {
                    const title = getItemTitle(item);
                    const slug = getItemSlug(item);

                    const isActive = isTruthy01((item as any).is_active);
                    const isPublished = isTruthy01((item as any).is_published);
                    const isFeatured = isTruthy01((item as any).featured);

                    return (
                      <tr
                        key={String(item.id)}
                        className={!isActive ? 'ensotek-row-inactive' : undefined}
                      >
                        <td className="text-muted small text-nowrap">{index + 1}</td>

                        <td className="align-middle" style={{ minWidth: 0 }}>
                          <div className="fw-semibold small ensotek-truncate" title={title}>
                            {title}
                          </div>
                          <div className="text-muted small ensotek-truncate" title={slug}>
                            <code>{slug}</code>
                          </div>
                        </td>

                        <td className="align-middle text-center">
                          <Switch
                            checked={isActive}
                            disabled={busy}
                            ariaLabel="Aktif/Pasif"
                            onChange={(checked) => onToggleActive(item, checked)}
                          />
                        </td>

                        <td className="align-middle text-center">
                          <Switch
                            checked={isPublished}
                            disabled={busy}
                            ariaLabel="Yayın"
                            onChange={(checked) => onTogglePublished(item, checked)}
                          />
                        </td>

                        <td className="align-middle text-center">
                          <Switch
                            checked={isFeatured}
                            disabled={busy}
                            ariaLabel="Öne Çıkan"
                            onChange={(checked) => onToggleFeatured(item, checked)}
                          />
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

        {/* ===================== < LG : CARDS ===================== */}
        <div className="d-block d-lg-none">
          {busy ? (
            <div className="px-3 py-3 text-center text-muted small">
              Library içerikleri yükleniyor...
            </div>
          ) : (
            <div className="p-3">
              <div className="row g-3">
                {rows.map((item, index) => {
                  const title = getItemTitle(item);
                  const slug = getItemSlug(item);

                  const isActive = isTruthy01((item as any).is_active);
                  const isPublished = isTruthy01((item as any).is_published);
                  const isFeatured = isTruthy01((item as any).featured);

                  const views = num0((item as any).views);
                  const downloads = num0((item as any).download_count);
                  const order = num0((item as any).display_order);

                  return (
                    <div key={String(item.id)} className="col-12">
                      <div
                        className={`border rounded-3 p-3 bg-white h-100 ${
                          !isActive ? 'ensotek-card-inactive' : ''
                        }`}
                      >
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="d-flex flex-wrap gap-2">
                            <span className="badge bg-light text-dark border">#{index + 1}</span>
                            <span className="badge bg-light text-dark border small">
                              Sıra: <strong>{order}</strong>
                            </span>
                          </div>

                          <div className="d-flex flex-column align-items-end gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="text-muted small">Aktif</span>
                              <Switch
                                checked={isActive}
                                disabled={busy}
                                ariaLabel="Aktif/Pasif"
                                onChange={(checked) => onToggleActive(item, checked)}
                              />
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <span className="text-muted small">Yayın</span>
                              <Switch
                                checked={isPublished}
                                disabled={busy}
                                ariaLabel="Yayın"
                                onChange={(checked) => onTogglePublished(item, checked)}
                              />
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <span className="text-muted small">Öne</span>
                              <Switch
                                checked={isFeatured}
                                disabled={busy}
                                ariaLabel="Öne Çıkan"
                                onChange={(checked) => onToggleFeatured(item, checked)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="fw-semibold text-break">{title}</div>
                          <div className="text-muted small text-break">
                            Slug: <code>{slug}</code>
                          </div>
                        </div>

                        <div className="mt-2 d-flex flex-wrap gap-2">
                          <span className="badge bg-light text-dark border small">
                            Görüntülenme: <strong>{views}</strong>
                          </span>
                          <span className="badge bg-light text-dark border small">
                            İndirme: <strong>{downloads}</strong>
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
