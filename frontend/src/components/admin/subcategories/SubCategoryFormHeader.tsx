// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormHeader.tsx
// Ensotek – Alt Kategori Form Header
// =============================================================

import React from "react";

export type SubCategoryFormMode = "create" | "edit";
export type SubCategoryEditMode = "form" | "json";

export type SubCategoryFormHeaderProps = {
  mode: SubCategoryFormMode;
  locale: string;
  editMode: SubCategoryEditMode;
  onChangeEditMode: (mode: SubCategoryEditMode) => void;
  saving: boolean;
  isLocaleLoading?: boolean;
};

export const SubCategoryFormHeader: React.FC<
  SubCategoryFormHeaderProps
> = ({
  mode,
  locale,
  editMode,
  onChangeEditMode,
  saving,
  isLocaleLoading,
}) => {
  const title =
    mode === "create"
      ? "Yeni Alt Kategori Oluştur"
      : "Alt Kategori Düzenle";

  return (
    <div className="card-header py-2 d-flex justify-content-between align-items-center">
      <div>
        <h5 className="card-title small mb-1">{title}</h5>
        <div className="small text-muted">
          Aktif dil:{" "}
          <strong className="text-uppercase">{locale}</strong>{" "}
          {isLocaleLoading && (
            <span className="ms-1 spinner-border spinner-border-sm" />
          )}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={
              "btn btn-outline-secondary btn-sm" +
              (editMode === "form" ? " active" : "")
            }
            onClick={() => onChangeEditMode("form")}
            disabled={saving}
          >
            Form
          </button>
          <button
            type="button"
            className={
              "btn btn-outline-secondary btn-sm" +
              (editMode === "json" ? " active" : "")
            }
            onClick={() => onChangeEditMode("json")}
            disabled={saving}
          >
            JSON
          </button>
        </div>
      </div>
    </div>
  );
};
