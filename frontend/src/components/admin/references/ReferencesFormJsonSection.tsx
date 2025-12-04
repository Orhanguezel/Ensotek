// =============================================================
// FILE: src/components/admin/references/ReferencesFormJsonSection.tsx
// Referans Form – JSON mod alanı (AdminJsonEditor sarmalayıcı)
// =============================================================

"use client";

import React from "react";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

export type ReferencesFormJsonSectionProps = {
  jsonModel: any;
  disabled: boolean;
  onChangeJson: (json: any) => void;
  onErrorChange: (err: string | null) => void;
};

export const ReferencesFormJsonSection: React.FC<
  ReferencesFormJsonSectionProps
> = ({ jsonModel, disabled, onChangeJson, onErrorChange }) => {
  return (
    <AdminJsonEditor
      label="Referans JSON (create/update payload)"
      value={jsonModel}
      onChange={onChangeJson}
      onErrorChange={onErrorChange}
      disabled={disabled}
      height={380}
      helperText={
        <>
          Bu JSON, referans create / update isteğine gönderilecek payload ile
          uyumludur. <code>locale</code>, <code>title</code>, <code>slug</code>,{" "}
          <code>summary</code>, <code>content</code>, <code>featured_image</code>,{" "}
          <code>website_url</code>, <code>is_published</code>,{" "}
          <code>is_featured</code>, <code>display_order</code>,{" "}
          <code>featured_image_alt</code>, <code>meta_title</code>,{" "}
          <code>meta_description</code> alanlarını düzenleyebilirsin.
        </>
      }
    />
  );
};
