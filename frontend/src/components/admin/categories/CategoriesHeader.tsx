// =============================================================
// FILE: src/components/admin/categories/CategoriesHeader.tsx
// Ensotek – Kategori Header + Filtreler
// =============================================================

import React from "react";

export type LocaleOption = {
  value: string;
  label: string;
};

export type ModuleOption = {
  value: string;
  label: string;
};

export type CategoriesHeaderProps = {
  search: string;
  onSearchChange: (v: string) => void;

  locale: string;
  onLocaleChange: (v: string) => void;

  moduleKey: string;
  onModuleKeyChange: (v: string) => void;

  showOnlyActive: boolean;
  onShowOnlyActiveChange: (v: boolean) => void;

  showOnlyFeatured: boolean;
  onShowOnlyFeaturedChange: (v: boolean) => void;

  loading: boolean;
  onRefresh: () => void;

  locales: LocaleOption[];
  localesLoading?: boolean;

  modules: ModuleOption[];

  onCreateClick: () => void;
};

export const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  search,
  onSearchChange,
  locale,
  onLocaleChange,
  moduleKey,
  onModuleKeyChange,
  showOnlyActive,
  onShowOnlyActiveChange,
  showOnlyFeatured,
  onShowOnlyFeaturedChange,
  loading,
  onRefresh,
  locales,
  localesLoading,
  modules,
  onCreateClick,
}) => {
  return (
    <div className="row mb-3">
      {/* Sol: başlık */}
      <div className="col-12 col-lg-6 mb-2 mb-lg-0">
        <h1 className="h4 mb-1">Kategoriler</h1>
        <p className="text-muted small mb-0">
          Çok dilli kategori kayıtlarını listeler, sıralama (drag &amp; drop),
          aktif/öne çıkan durumlarını ve temel bilgileri yönetebilirsin.
        </p>
      </div>

      {/* Sağ: filtreler + aksiyonlar */}
      <div className="col-12 col-lg-6 d-flex align-items-end justify-content-lg-end">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
          {/* Arama */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">Ara</span>
            <input
              type="text"
              className="form-control"
              placeholder="İsim veya slug içinde ara"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Locale filtre */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              Dil
              {localesLoading && (
                <span className="ms-1 spinner-border spinner-border-sm" />
              )}
            </span>
            <select
              className="form-select"
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value)}
            >
              <option value="">Tüm Diller</option>
              {locales.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Module filtre */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">Modül</span>
            <select
              className="form-select"
              value={moduleKey}
              onChange={(e) => onModuleKeyChange(e.target.value)}
            >
              {modules.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alt satır: toggle filtreler + aksiyonlar */}
      <div className="col-12 mt-2 d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-md-between">
        <div className="d-flex flex-wrap gap-3 small">
          <div className="form-check form-switch">
            <input
              id="filter-active"
              className="form-check-input"
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => onShowOnlyActiveChange(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="filter-active">
              Sadece aktif
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              id="filter-featured"
              className="form-check-input"
              type="checkbox"
              checked={showOnlyFeatured}
              onChange={(e) => onShowOnlyFeaturedChange(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="filter-featured">
              Sadece öne çıkan
            </label>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-2 mt-md-0">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onRefresh}
            disabled={loading}
          >
            Yenile
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onCreateClick}
          >
            + Yeni Kategori
          </button>
        </div>
      </div>
    </div>
  );
};
