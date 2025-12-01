// =============================================================
// FILE: src/components/admin/products/ProductsHeader.tsx
// Ensotek – Admin Products Header (Filtreler + Özet + Aksiyonlar)
// =============================================================

import React from "react";

export type LocaleOption = {
  value: string;
  label: string;
};

export type ProductFilters = {
  search: string;
  locale: string;
  /** "all" = hepsi, "active" = sadece aktif, "inactive" = pasif */
  isActiveFilter: "all" | "active" | "inactive";
};

export type ProductsHeaderProps = {
  filters: ProductFilters;
  total: number;
  loading: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  onFiltersChange: (next: ProductFilters) => void;
  onRefresh?: () => void;
  onCreateClick?: () => void;
};

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  filters,
  total,
  loading,
  locales,
  localesLoading,
  defaultLocale,
  onFiltersChange,
  onRefresh,
  onCreateClick,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      locale: e.target.value,
    });
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ProductFilters["isActiveFilter"];
    onFiltersChange({
      ...filters,
      isActiveFilter: value,
    });
  };

  const effectiveDefaultLocale = defaultLocale ?? "tr";

  return (
    <div className="card mb-3">
      <div className="card-body py-3">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          {/* Sol taraf: başlık + filtreler */}
          <div style={{ minWidth: 0, flex: 2 }}>
            <div className="mb-2">
              <h5 className="mb-0 small fw-semibold">Ürün Yönetimi</h5>
              <div className="text-muted small">
                Ürünleri dil, durum ve arama filtrelerine göre listeleyip
                yönetebilirsin.
              </div>
            </div>

            <div className="row g-2 align-items-end">
              {/* Arama */}
              <div className="col-md-6">
                <label className="form-label small mb-1">
                  Başlık / Slug / Kod arama
                </label>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Örn: 'kule', 'pompa', ürün kodu..."
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Locale filtre */}
              <div className="col-md-3">
                <label className="form-label small mb-1">
                  Dil (locale)
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.locale}
                  onChange={handleLocaleChange}
                  disabled={localesLoading && !locales.length}
                >
                  <option value="">
                    Hepsi
                    {effectiveDefaultLocale
                      ? ` (varsayılan: ${effectiveDefaultLocale})`
                      : ""}
                  </option>
                  {locales.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
                <div className="form-text small">
                  Dil listesi veritabanındaki{" "}
                  <code>site_settings.app_locales</code> kaydından gelir.
                </div>
              </div>

              {/* Aktif / pasif filtre */}
              <div className="col-md-3">
                <label className="form-label small mb-1">
                  Aktiflik durumu
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.isActiveFilter}
                  onChange={handleIsActiveChange}
                >
                  <option value="all">Hepsi</option>
                  <option value="active">Sadece aktif</option>
                  <option value="inactive">Pasif ürünler</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sağ taraf: özet + aksiyonlar */}
          <div
            className="border-start ps-lg-3 ms-lg-3 d-flex flex-column justify-content-between"
            style={{ minWidth: 0, flex: 1 }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="small fw-semibold">Toplam Ürün</div>
                <div className="display-6 fs-4 fw-bold">{total}</div>
                {loading && (
                  <div className="text-muted small">
                    Liste güncelleniyor...
                  </div>
                )}
              </div>
              <div className="d-flex flex-column gap-2 align-items-end">
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
                    Yeni Ürün Oluştur
                  </button>
                )}
              </div>
            </div>

            <div className="text-muted small">
              <ul className="mb-0 ps-3">
                <li>
                  Liste, backend üzerindeki{" "}
                  <code>products.locale, products.slug</code> benzersiz
                  kombinasyonuna göre tutulur.
                </li>
                <li>
                  Aktiflik ve öne çıkarma durumları ürün kartları için
                  kullanılır.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
