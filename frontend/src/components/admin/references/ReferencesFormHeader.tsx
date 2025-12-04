// =============================================================
// FILE: src/components/admin/references/ReferencesFormHeader.tsx
// =============================================================

"use client";

import React from "react";

export type ReferencesFormEditMode = "form" | "json";

export type ReferencesFormHeaderProps = {
  mode: "create" | "edit";
  editMode: ReferencesFormEditMode;
  saving: boolean;
  onChangeEditMode: (m: ReferencesFormEditMode) => void;
  onCancel: () => void;
};

export const ReferencesFormHeader: React.FC<ReferencesFormHeaderProps> = ({
  mode,
  editMode,
  saving,
  onChangeEditMode,
  onCancel,
}) => {
  return (
    <div className="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 className="mb-0">
          {mode === "create" ? "Yeni Referans Oluştur" : "Referans Düzenle"}
        </h5>
        <small className="text-muted">
          Form modunda alanları düzenleyebilir veya JSON modunda tüm payload’ı
          yönetebilirsin.
        </small>
      </div>

      <div className="d-flex gap-2 align-items-center">
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={
              "btn btn-outline-primary " +
              (editMode === "form" ? "active" : "")
            }
            disabled={saving}
            onClick={() => onChangeEditMode("form")}
          >
            Form
          </button>
          <button
            type="button"
            className={
              "btn btn-outline-primary " +
              (editMode === "json" ? "active" : "")
            }
            disabled={saving}
            onClick={() => onChangeEditMode("json")}
          >
            JSON
          </button>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={saving}
          onClick={onCancel}
        >
          ← Geri
        </button>
      </div>
    </div>
  );
};
