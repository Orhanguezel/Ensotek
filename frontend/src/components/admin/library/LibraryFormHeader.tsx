// =============================================================
// FILE: src/components/admin/library/LibraryFormHeader.tsx
// Ensotek – Library Form Header
// =============================================================

"use client";

import React from "react";

export type LibraryFormEditMode = "form" | "json";

export type LibraryFormHeaderProps = {
  mode: "create" | "edit";
  editMode: LibraryFormEditMode;
  saving: boolean;
  onChangeEditMode: (m: LibraryFormEditMode) => void;
  onCancel: () => void;
};

export const LibraryFormHeader: React.FC<LibraryFormHeaderProps> = ({
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
            ? "Yeni Library Kaydı Oluştur"
            : "Library Kaydını Düzenle"}
        </h5>
        <small className="text-muted">
          Form modunda alanları klasik form üzerinden; JSON modunda ise create /
          update payload&apos;ını doğrudan JSON olarak yönetebilirsin.
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
