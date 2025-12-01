// =============================================================
// FILE: src/components/admin/email-templates/EmailTemplateHeader.tsx
// Admin Email Templates – Header / Filtreler / Actions
// =============================================================

import React from "react";

interface EmailTemplateHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;

  locale: string;
  onLocaleChange: (value: string) => void;

  isActiveFilter: "" | "active" | "inactive";
  onIsActiveFilterChange: (value: "" | "active" | "inactive") => void;

  loading: boolean;
  total: number;

  onRefresh: () => void;
  onCreateClick: () => void;
}

export const EmailTemplateHeader: React.FC<EmailTemplateHeaderProps> = ({
  search,
  onSearchChange,
  locale,
  onLocaleChange,
  isActiveFilter,
  onIsActiveFilterChange,
  loading,
  total,
  onRefresh,
  onCreateClick,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body py-2">
        <div className="row g-2 align-items-end">
          {/* Search */}
          <div className="col-md-4">
            <label className="form-label small mb-1">Arama (key / başlık)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="template_key, başlık veya konu içinde ara..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Locale */}
          <div className="col-md-3">
            <label className="form-label small mb-1">Locale (opsiyonel)</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="örn: tr, en, de"
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value)}
            />
            <div className="form-text small">
              Boş bırakılırsa tüm diller listelenir.
            </div>
          </div>

          {/* Active Filter */}
          <div className="col-md-3">
            <label className="form-label small mb-1">Aktiflik</label>
            <select
              className="form-select form-select-sm"
              value={isActiveFilter}
              onChange={(e) =>
                onIsActiveFilterChange(
                  e.target.value as "" | "active" | "inactive",
                )
              }
            >
              <option value="">Hepsi</option>
              <option value="active">Sadece aktif</option>
              <option value="inactive">Sadece pasif</option>
            </select>
          </div>

          {/* Actions */}
          <div className="col-md-2 d-flex justify-content-end gap-2">
            <div className="d-flex flex-column align-items-end w-100">
              <div className="small text-muted mb-1">
                Toplam:{" "}
                <span className="fw-semibold">
                  {loading ? "..." : total}
                </span>
              </div>
              <div className="btn-group btn-group-sm">
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
                  disabled={loading}
                >
                  Yeni Şablon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
