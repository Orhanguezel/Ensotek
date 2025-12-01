// =============================================================
// FILE: src/components/admin/custompage/CustomPageHeader.tsx
// Ensotek – Admin Custom Pages Header (Filtreler + Özet)
// =============================================================

import React from "react";

export type LocaleOption = {
  value: string;
  label: string;
};

export type CustomPageFilters = {
  search: string;
  moduleKey: string;
  /** "all" = hepsi, "published" = yayında, "draft" = taslak */
  publishedFilter: "all" | "published" | "draft";
  /** Boş ise tüm diller */
  locale: string;
};

export type CustomPageHeaderProps = {
  filters: CustomPageFilters;
  total: number;
  onFiltersChange: (next: CustomPageFilters) => void;
  onRefresh?: () => void;
  locales: LocaleOption[];
  localesLoading?: boolean;
};

export const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({
  filters,
  total,
  onFiltersChange,
  onRefresh,
  locales,
  localesLoading,
}) => {
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleModuleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onFiltersChange({
      ...filters,
      moduleKey: e.target.value,
    });
  };

  const handlePublishedChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value as CustomPageFilters["publishedFilter"];
    onFiltersChange({
      ...filters,
      publishedFilter: value,
    });
  };

  const handleLocaleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onFiltersChange({
      ...filters,
      locale: e.target.value,
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body py-3">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          {/* Sol: Başlık + açıklama */}
          <div style={{ minWidth: 0, flex: 2 }}>
            <div className="mb-2">
              <h5 className="mb-0 small fw-semibold">
                Özel Sayfalar (Blog / Haber / Hakkında vb.)
              </h5>
              <div className="text-muted small">
                Blog, haber, hakkında ve benzeri içerik sayfalarını burada
                kategorilere, dillere ve modüllere göre yönetebilirsin.
              </div>
            </div>

            <div className="row g-2 align-items-end">
              {/* Arama */}
              <div className="col-md-5">
                <label className="form-label small mb-1">
                  Başlık / Slug / Meta arama
                </label>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Örn: 'hakkımızda', 'duyuru', 'kampanya'"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Dil */}
              <div className="col-md-3">
                <label className="form-label small mb-1">
                  Dil
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.locale}
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
                {localesLoading && (
                  <div className="form-text small">
                    Diller yükleniyor...
                  </div>
                )}
              </div>

              {/* Modül */}
              <div className="col-md-2">
                <label className="form-label small mb-1">
                  Modül
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.moduleKey}
                  onChange={handleModuleChange}
                >
                  <option value="">Tümü</option>
                  <option value="blog">Blog</option>
                  <option value="news">Haber / Duyuru</option>
                  <option value="about">Hakkında / Statik</option>
                </select>
              </div>

              {/* Yayın durumu */}
              <div className="col-md-2">
                <label className="form-label small mb-1">
                  Yayın durumu
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.publishedFilter}
                  onChange={handlePublishedChange}
                >
                  <option value="all">Hepsi</option>
                  <option value="published">Yayında</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sağ: Özet + aksiyonlar */}
          <div
            className="border-start ps-lg-3 ms-lg-3 d-flex flex-column justify-content-between"
            style={{ minWidth: 0, flex: 1 }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="small fw-semibold">Toplam Kayıt</div>
                <div className="display-6 fs-4 fw-bold">{total}</div>
              </div>
              {onRefresh && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onRefresh}
                >
                  Yenile
                </button>
              )}
            </div>

            <div className="text-muted small">
              <ul className="mb-0 ps-3">
                <li>Liste backend üzerinde coalesced i18n olarak gelir.</li>
                <li>Slug çakışmaları backend tarafından kontrol edilir.</li>
              </ul>
            </div>

            {/* Yeni sayfa oluşturma – route: /admin/custompage/new */}
            <div className="mt-2 d-flex justify-content-end">
              <a
                href="/admin/custompage/new"
                className="btn btn-primary btn-sm"
              >
                Yeni Sayfa Oluştur
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
