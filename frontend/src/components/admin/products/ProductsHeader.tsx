// =============================================================
// FILE: src/components/admin/products/ProductsHeader.tsx
// Ensotek – Admin Products Header (Compact)
// Locale: parent provides options (DB)
// =============================================================

import React, { useEffect, useMemo } from 'react';

import { AdminLocaleSelect, type AdminLocaleOption } from '@/components/common/AdminLocaleSelect';

export type ProductFilters = {
  search: string;

  /**
   * "" => all locales (do NOT send locale param)
   * "tr" | "en" | ...
   */
  locale: string;

  /** "all" = hepsi, "active" = sadece aktif, "inactive" = pasif */
  isActiveFilter: 'all' | 'active' | 'inactive';
};

export type ProductsHeaderProps = {
  filters: ProductFilters;
  total: number;
  loading: boolean;

  locales: AdminLocaleOption[];
  localesLoading?: boolean;

  /** DB default_locale (short); used only for “All” label */
  defaultLocaleFromDb?: string;

  onFiltersChange: (next: ProductFilters) => void;
  onRefresh?: () => void;
  onCreateClick?: () => void;
};

const norm = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '');

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  filters,
  total,
  loading,
  locales,
  localesLoading,
  defaultLocaleFromDb,
  onFiltersChange,
  onRefresh,
  onCreateClick,
}) => {
  const effectiveDefault = norm(defaultLocaleFromDb);

  const localeOptions: AdminLocaleOption[] = useMemo(() => {
    const base = (locales ?? []).map((x) => ({
      value: norm(x.value),
      label: x.label,
    }));

    const allLabel = effectiveDefault ? `Hepsi (varsayılan: ${effectiveDefault})` : 'Hepsi';

    return [{ value: '', label: allLabel }, ...base];
  }, [locales, effectiveDefault]);

  // If filters.locale is set but not in list, reset to "" (All)
  useEffect(() => {
    const cur = norm(filters.locale);
    const list = new Set(localeOptions.map((x) => x.value));
    if (cur && !list.has(cur)) {
      onFiltersChange({ ...filters, locale: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeOptions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleLocaleChange = (nextLocale: string) => {
    onFiltersChange({ ...filters, locale: norm(nextLocale) });
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ProductFilters['isActiveFilter'];
    onFiltersChange({ ...filters, isActiveFilter: value });
  };

  const localeDisabled = loading || !!localesLoading || localeOptions.length === 0;

  return (
    <div className="card mb-3">
      <div className="card-body py-2">
        {/* Header row: title + actions */}
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div style={{ minWidth: 0 }}>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="mb-0 small fw-semibold">Ürün Yönetimi</h5>

              {/* mini KPI */}
              <span
                className={
                  'badge rounded-pill ' + (loading ? 'text-bg-secondary' : 'text-bg-light border')
                }
              >
                <span className="text-muted me-1">Toplam:</span>
                <strong className="ms-1">{total}</strong>
              </span>

              {loading && (
                <span className="text-muted small d-inline-flex align-items-center gap-1">
                  <span className="spinner-border spinner-border-sm" />
                  Güncelleniyor
                </span>
              )}
            </div>

            <div className="text-muted small mt-1">
              Ürünleri arama, dil ve durum filtreleriyle yönet.
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            {onRefresh && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onRefresh}
                disabled={loading}
              >
                Yenile
              </button>
            )}
            {onCreateClick && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onCreateClick}
                disabled={loading}
              >
                Yeni Ürün
              </button>
            )}
          </div>
        </div>

        <hr className="my-2" />

        {/* Filters row */}
        <div className="row g-2 align-items-end">
          {/* Search */}
          <div className="col-12 col-lg-6">
            <label className="form-label small mb-1">Arama</label>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Başlık, slug, kod..."
              value={filters.search}
              onChange={handleSearchChange}
              disabled={loading}
            />
          </div>

          {/* Locale */}
          <div className="col-12 col-sm-6 col-lg-3">
            <AdminLocaleSelect
              value={filters.locale}
              onChange={handleLocaleChange}
              options={localeOptions}
              loading={!!localesLoading}
              disabled={localeDisabled}
              label="Dil"
            />
          </div>

          {/* Active */}
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small mb-1">Durum</label>
            <select
              className="form-select form-select-sm"
              value={filters.isActiveFilter}
              onChange={handleIsActiveChange}
              disabled={loading}
            >
              <option value="all">Hepsi</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
