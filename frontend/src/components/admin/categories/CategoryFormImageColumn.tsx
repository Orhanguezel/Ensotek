// =============================================================
// FILE: src/components/admin/categories/CategoryFormImageColumn.tsx
// Kategori Form – Sağ kolon (görsel upload alanı)
// =============================================================

import React from "react";
import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";
import { useRouter } from "next/router";

export type CategoryFormImageColumnProps = {
  metadata:
    | {
        module_key: string;
        locale: string;
        category_slug: string;
      }
    | undefined;
  iconValue: string;
  disabled: boolean;
  onIconChange: (url: string) => void;
};

export const CategoryFormImageColumn: React.FC<
  CategoryFormImageColumnProps
> = ({ metadata, iconValue, disabled, onIconChange }) => {
  const router = useRouter();

  return (
    <AdminImageUploadField
      label="Kategori Görseli"
      helperText={
        <>
          Storage modülü üzerinden kategori için bir görsel yükleyebilirsin.
          Yüklenen görselin URL&apos;i yukarıdaki{" "}
          <strong>Icon / Görsel URL</strong> alanına otomatik yazılır (ve JSON
          modeline de yansır).
        </>
      }
      bucket="public"
      folder="categories"
      metadata={metadata}
      value={iconValue}
      onChange={(url) => onIconChange(url)}
      disabled={disabled}
      openLibraryHref="/admin/storage"
      onOpenLibraryClick={() => router.push("/admin/storage")}
    />
  );
};
