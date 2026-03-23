// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormHeader.tsx
// Ensotek – Alt Kategori Form Header (Category pattern)
// =============================================================

import type React from "react";

export type SubCategoryFormMode = "create" | "edit";
export type SubCategoryEditMode = "form" | "json";

export type SubCategoryFormHeaderProps = {
  mode: SubCategoryFormMode;
  locale: string;

  editMode: SubCategoryEditMode;
  onChangeEditMode: (mode: SubCategoryEditMode) => void;

  saving: boolean;
  isLocaleLoading: boolean;
};

export const SubCategoryFormHeader: React.FC<SubCategoryFormHeaderProps> = ({
  mode,
  locale,
  editMode,
  onChangeEditMode,
  saving,
  isLocaleLoading,
}) => {
  const title = mode === "create" ? "Yeni Alt Kategori" : "Alt Kategori Düzenle";

  return (
    <div className="card-header d-flex justify-content-between py-2 align-items-center">
      <div>
        <h1 className="h5 mb-0">{title}</h1>
        <div className="small text-muted">
          {locale ? (
            <>
              Dil: <strong>{locale.toUpperCase()}</strong>
            </>
          ) : (
            <>
              Dil: <strong>-</strong>
            </>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 align-items-center">
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn btn-outline-secondary ${editMode === "form" ? "active" : ""}`}
            onClick={() => onChangeEditMode("form")}
            disabled={saving}
          >
            Form
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${editMode === "json" ? "active" : ""}`}
            onClick={() => onChangeEditMode("json")}
            disabled={saving}
          >
            JSON
          </button>
        </div>

        {(saving || isLocaleLoading) && (
          <span className="badge small bg-secondary">
            {isLocaleLoading ? "Dil değiştiriliyor..." : "Kaydediliyor..."}
          </span>
        )}
      </div>
    </div>
  );
};
