// =============================================================
// FILE: src/components/admin/library/LibraryHeader.tsx
// Ensotek – Library Header + Filtreler
// =============================================================

import React from "react";

export type LibraryHeaderProps = {
  search: string;
  onSearchChange: (v: string) => void;

  showOnlyPublished: boolean;
  onShowOnlyPublishedChange: (v: boolean) => void;

  showOnlyActive: boolean;
  onShowOnlyActiveChange: (v: boolean) => void;

  loading: boolean;
  onRefresh: () => void;

  onCreateClick: () => void;
};

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  search,
  onSearchChange,
  showOnlyPublished,
  onShowOnlyPublishedChange,
  showOnlyActive,
  onShowOnlyActiveChange,
  loading,
  onRefresh,
  onCreateClick,
}) => {
  return (
    <div className="row mb-3">
      {/* Sol: başlık */}
      <div className="col-12 col-lg-6 mb-2 mb-lg-0">
        <h1 className="h4 mb-1">Kütüphane İçerikleri</h1>
        <p className="text-muted small mb-0">
          Çok dilli &quot;library&quot; kayıtlarını (makale, doküman, PDF vb.)
          yönetebilirsin. Yayın/aktif durumlarını, temel bilgileri ve SEO
          meta alanlarını buradan düzenle.
        </p>
      </div>

      {/* Sağ: arama + aksiyonlar */}
      <div className="col-12 col-lg-6 d-flex align-items-end justify-content-lg-end">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
          {/* Arama */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">Ara</span>
            <input
              type="text"
              className="form-control"
              placeholder="Başlık, slug veya özet içinde ara"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Alt satır: toggle filtreler + aksiyonlar */}
      <div className="col-12 mt-2 d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-md-between">
        <div className="d-flex flex-wrap gap-3 small">
          <div className="form-check form-switch">
            <input
              id="filter-published"
              className="form-check-input"
              type="checkbox"
              checked={showOnlyPublished}
              onChange={(e) => onShowOnlyPublishedChange(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="filter-published">
              Sadece yayında olanlar
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              id="filter-active"
              className="form-check-input"
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => onShowOnlyActiveChange(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="filter-active">
              Sadece aktif olanlar
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
            + Yeni İçerik
          </button>
        </div>
      </div>
    </div>
  );
};
