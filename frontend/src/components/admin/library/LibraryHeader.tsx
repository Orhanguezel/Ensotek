// =============================================================
// FILE: src/components/admin/library/LibraryHeader.tsx
// Ensotek – Library Header (filtreler + aksiyonlar)
// LibraryListQueryParams.sort ile uyumlu
// =============================================================

'use client';

import React from 'react';

export type LocaleOption = {
  value: string;
  label: string;
};

/**
 * LibraryListQueryParams.sort ile uyumlu alanlar
 * (types/library.types.ts içindeki union’ın bire bir kopyası)
 */
export type OrderField =
  | 'created_at'
  | 'updated_at'
  | 'published_at'
  | 'display_order'
  | 'views'
  | 'download_count';

export type LibraryHeaderProps = {
  search: string;
  onSearchChange: (v: string) => void;

  // Dil filtre
  locale: string;
  onLocaleChange: (v: string) => void;
  locales: LocaleOption[];
  localesLoading?: boolean;

  // is_published filtresi
  showOnlyPublished: boolean;
  onShowOnlyPublishedChange: (v: boolean) => void;

  /**
   * UI state adı korunuyor ama backend filter: featured
   * (index.tsx içinde featured paramına bağlandı)
   */
  showOnlyFeatured: boolean;
  onShowOnlyFeaturedChange: (v: boolean) => void;

  orderBy: OrderField;
  orderDir: 'asc' | 'desc';
  onOrderByChange: (v: OrderField) => void;
  onOrderDirChange: (v: 'asc' | 'desc') => void;

  loading: boolean;
  onRefresh: () => void;
  onCreateClick: () => void;
};

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  search,
  onSearchChange,
  locale,
  onLocaleChange,
  locales,
  localesLoading,
  showOnlyPublished,
  onShowOnlyPublishedChange,
  showOnlyFeatured,
  onShowOnlyFeaturedChange,
  orderBy,
  orderDir,
  onOrderByChange,
  onOrderDirChange,
  loading,
  onRefresh,
  onCreateClick,
}) => {
  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    // "" → tüm diller, diğerleri lower-case locale kodu
    const nextLocale = raw ? raw.trim().toLowerCase() : '';
    onLocaleChange(nextLocale);
  };

  return (
    <div className="row mb-3 g-2 align-items-end">
      {/* Sol: Arama + dil + sıralama */}
      <div className="col-md-7">
        <div className="card">
          <div className="card-body py-2">
            <div className="row g-2 align-items-end">
              {/* Arama */}
              <div className="col-12 col-md-5">
                <label className="form-label small mb-1">Ara (ad / slug / açıklama)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ör: ‘soğutma kulesi’..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              {/* Dil */}
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">
                  Dil {localesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
                </label>
                <select
                  className="form-select form-select-sm"
                  value={locale}
                  onChange={handleLocaleChange}
                  disabled={localesLoading && !locales.length}
                >
                  <option value="">Tüm diller</option>
                  {locales.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sıralama alanı */}
              <div className="col-6 col-md-2">
                <label className="form-label small mb-1">Sıralama alanı</label>
                <select
                  className="form-select form-select-sm"
                  value={orderBy}
                  onChange={(e) => onOrderByChange(e.target.value as OrderField)}
                >
                  <option value="display_order">Sıra (display_order)</option>
                  <option value="created_at">Oluşturulma</option>
                  <option value="updated_at">Güncellenme</option>
                  <option value="published_at">Yayın tarihi</option>
                  <option value="views">Görüntülenme</option>
                  <option value="download_count">İndirme</option>
                </select>
              </div>

              {/* Yön */}
              <div className="col-6 col-md-2">
                <label className="form-label small mb-1">Yön</label>
                <select
                  className="form-select form-select-sm"
                  value={orderDir}
                  onChange={(e) => onOrderDirChange(e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Artan</option>
                  <option value="desc">Azalan</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ: Filtreler + aksiyonlar */}
      <div className="col-md-5">
        <div className="card">
          <div className="card-body py-2">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex flex-wrap gap-3 small">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lib-only-published"
                    checked={showOnlyPublished}
                    onChange={(e) => onShowOnlyPublishedChange(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="lib-only-published">
                    Sadece yayınlananlar
                  </label>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lib-only-featured"
                    checked={showOnlyFeatured}
                    onChange={(e) => onShowOnlyFeaturedChange(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="lib-only-featured">
                    Sadece öne çıkanlar
                  </label>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  {loading ? 'Yenileniyor...' : 'Yenile'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onCreateClick}
                  disabled={loading}
                >
                  Yeni Library
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
