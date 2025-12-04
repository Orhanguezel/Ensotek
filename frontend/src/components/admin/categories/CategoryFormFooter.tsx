// =============================================================
// FILE: src/components/admin/categories/CategoryFormFooter.tsx
// Kategori Form – Footer (İptal / Kaydet butonları)
// =============================================================

import React from "react";

type CategoryFormMode = "create" | "edit";

export type CategoryFormFooterProps = {
  mode: CategoryFormMode;
  saving: boolean;
  onCancel: () => void;
};

export const CategoryFormFooter: React.FC<CategoryFormFooterProps> = ({
  mode,
  saving,
  onCancel,
}) => {
  return (
    <div className="card-footer py-2 d-flex justify-content-between">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={onCancel}
        disabled={saving}
      >
        İptal
      </button>
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={saving}
      >
        {saving ? "Kaydediliyor..." : mode === "create" ? "Oluştur" : "Kaydet"}
      </button>
    </div>
  );
};
