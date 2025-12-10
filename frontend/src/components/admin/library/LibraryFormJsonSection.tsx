// =============================================================
// FILE: src/components/admin/library/LibraryFormJsonSection.tsx
// Ensotek – Library Form – JSON mod alanı
// (AdminJsonEditor sarmalayıcı – create/update payload ile uyumlu)
// =============================================================

"use client";

import React from "react";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

export type LibraryFormJsonSectionProps = {
  jsonModel: any;
  disabled: boolean;
  onChangeJson: (json: any) => void;
  onErrorChange: (err: string | null) => void;
};

export const LibraryFormJsonSection: React.FC<
  LibraryFormJsonSectionProps
> = ({ jsonModel, disabled, onChangeJson, onErrorChange }) => {
  return (
    <AdminJsonEditor
      label="Library JSON (create/update payload)"
      value={jsonModel}
      onChange={onChangeJson}
      onErrorChange={onErrorChange}
      disabled={disabled}
      height={380}
      helperText={
        <>
          Bu JSON, <code>/admin/library</code> create / update isteklerine
          gönderilen payload ile uyumludur. Başlıca alanlar:
          <ul className="mb-0 mt-1">
            <li>
              <code>locale</code> – içerik dili
            </li>
            <li>
              <code>title</code>, <code>slug</code>,{" "}
              <code>summary</code>, <code>content</code>
            </li>
            <li>
              <code>author</code>, <code>published_at</code> (ISO datetime
              string veya boş / <code>null</code>)
            </li>
            <li>
              <code>is_published</code>, <code>is_active</code>,{" "}
              <code>display_order</code>
            </li>
            <li>
              <code>meta_title</code>, <code>meta_description</code>
            </li>
          </ul>
          Gelişmiş kullanımda isteğe bağlı olarak{" "}
          <code>tags</code>, <code>category_id</code>,{" "}
          <code>sub_category_id</code> alanlarını da ekleyebilirsin (backend
          şemasına göre).
        </>
      }
    />
  );
};
