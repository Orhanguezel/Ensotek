// =============================================================
// FILE: src/components/admin/faqs/FaqsFormHeader.tsx
// Ensotek – FAQ Form Header
// =============================================================

"use client";

import React from "react";

export type FaqsFormEditMode = "form" | "json";

export type FaqsFormHeaderProps = {
  mode: "create" | "edit";
  editMode: FaqsFormEditMode;
  saving: boolean;
  onChangeEditMode: (m: FaqsFormEditMode) => void;
  onCancel: () => void;
};

export const FaqsFormHeader: React.FC<FaqsFormHeaderProps> = ({
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
          {mode === "create"
            ? "Yeni SSS Kaydı Oluştur"
            : "SSS Kaydını Düzenle"}
        </h5>
        <small className="text-muted">
          Form modunda alanları klasik form üzerinden; JSON modunda ise
          create / update payload&apos;ını doğrudan JSON olarak
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
