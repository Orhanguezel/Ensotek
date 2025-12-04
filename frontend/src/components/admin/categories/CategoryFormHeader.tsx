// =============================================================
// FILE: src/components/admin/categories/CategoryFormHeader.tsx
// Kategori Form – Header (başlık + Form/JSON toggle + badges)
// =============================================================

import React from "react";

type CategoryFormMode = "create" | "edit";
type EditMode = "form" | "json";

export type CategoryFormHeaderProps = {
  mode: CategoryFormMode;
  moduleKey: string;
  locale: string;

  editMode: EditMode;
  onChangeEditMode: (mode: EditMode) => void;

  saving: boolean;
  isLocaleLoading: boolean;
};

export const CategoryFormHeader: React.FC<CategoryFormHeaderProps> = ({
  mode,
  moduleKey,
  locale,
  editMode,
  onChangeEditMode,
  saving,
  isLocaleLoading,
}) => {
  return (
    <div className="card-header py-2 d-flex justify-content-between align-items-center">
      <div>
        <h1 className="h5 mb-0">
          {mode === "create" ? "Yeni Kategori" : "Kategori Düzenle"}
        </h1>
        <div className="small text-muted">
          {moduleKey} · {locale.toUpperCase()}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn btn-outline-secondary ${
              editMode === "form" ? "active" : ""
            }`}
            onClick={() => onChangeEditMode("form")}
            disabled={saving}
          >
            Form
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${
              editMode === "json" ? "active" : ""
            }`}
            onClick={() => onChangeEditMode("json")}
            disabled={saving}
          >
            JSON
          </button>
        </div>

        {(saving || isLocaleLoading) && (
          <span className="badge bg-secondary small">
            {isLocaleLoading ? "Dil değiştiriliyor..." : "Kaydediliyor..."}
          </span>
        )}
      </div>
    </div>
  );
};
