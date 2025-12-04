// =============================================================
// FILE: src/components/admin/categories/CategoryFormJsonSection.tsx
// Kategori Form – JSON mod alanı (AdminJsonEditor sarmalayıcı)
// =============================================================

import React from "react";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

export type CategoryFormJsonSectionProps = {
  jsonModel: any;
  disabled: boolean;
  onChangeJson: (json: any) => void;
  onErrorChange: (err: string | null) => void;
};

export const CategoryFormJsonSection: React.FC<
  CategoryFormJsonSectionProps
> = ({ jsonModel, disabled, onChangeJson, onErrorChange }) => {
  return (
    <AdminJsonEditor
      label="Kategori JSON (create/update payload)"
      value={jsonModel}
      onChange={onChangeJson}
      onErrorChange={onErrorChange}
      disabled={disabled}
      height={340}
      helperText={
        <>
          Bu JSON, create / update isteğine gönderilecek payload ile uyumludur.{" "}
          <code>locale</code>, <code>module_key</code>, <code>name</code>,{" "}
          <code>slug</code>, <code>description</code>, <code>icon</code>,{" "}
          <code>is_active</code>, <code>is_featured</code>,{" "}
          <code>display_order</code> alanlarını düzenleyebilirsin. Geçerli
          JSON&apos;da yaptığın değişiklikler forma yansır.
        </>
      }
    />
  );
};
