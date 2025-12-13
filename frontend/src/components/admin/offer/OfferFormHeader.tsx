// =============================================================
// FILE: src/components/admin/offer/OfferFormHeader.tsx
// Ensotek – Offer Admin Form Header (Form / JSON Toggle)
// =============================================================

"use client";

import React from "react";

// Bu tip artık burada tanımlı → başka dosyadan import edilmiyor
export type OfferFormEditMode = "form" | "json";

export interface OfferFormHeaderProps {
  mode: "create" | "edit";
  editMode: OfferFormEditMode;
  saving: boolean;
  onChangeEditMode: (m: OfferFormEditMode) => void;
  onCancel: () => void;
}

export const OfferFormHeader: React.FC<OfferFormHeaderProps> = ({
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
          {mode === "create" ? "Yeni Teklif Oluştur" : "Teklif Düzenle"}
        </h5>
        <small className="text-muted">
          Form modunda teklif alanlarını, JSON modunda teknik{" "}
          <code>form_data</code> içeriğini yönetebilirsin.
        </small>
      </div>

      <div className="d-flex gap-2 align-items-center">
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={
              "btn btn-outline-primary " + (editMode === "form" ? "active" : "")
            }
            disabled={saving}
            onClick={() => onChangeEditMode("form")}
          >
            Form
          </button>

          <button
            type="button"
            className={
              "btn btn-outline-primary " + (editMode === "json" ? "active" : "")
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
