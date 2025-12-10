// =============================================================
// FILE: src/components/admin/custompage/CustomPageFormImageColumn.tsx
// Ensotek – Custom Page Form – Sağ kolon (Öne çıkan görsel upload)
// =============================================================

import React from "react";
import { useRouter } from "next/router";
import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";

export type CustomPageFormImageColumnProps = {
  metadata?:
    | {
        module_key: string;
        locale: string;
        page_slug: string;
        page_id?: string;
      }
    | Record<string, string | number | boolean>
    | undefined;
  featuredImageValue: string;
  disabled: boolean;
  onFeaturedImageChange: (url: string) => void;
};

export const CustomPageFormImageColumn: React.FC<
  CustomPageFormImageColumnProps
> = ({ metadata, featuredImageValue, disabled, onFeaturedImageChange }) => {
  const router = useRouter();

  return (
    <AdminImageUploadField
      label="Öne Çıkan Görsel"
      helperText={
        <>
          Storage modülü üzerinden sayfa için bir{" "}
          <strong>öne çıkan görsel</strong> yükleyebilirsin.
          Yüklenen görselin URL&apos;i yukarıdaki{" "}
          <strong>Öne çıkan görsel URL</strong> alanına otomatik yazılır
          (ve JSON modeline de yansır).
        </>
      }
      bucket="public"
      folder="custom_pages"
      metadata={metadata}
      value={featuredImageValue}
      onChange={(url) => onFeaturedImageChange(url)}
      disabled={disabled}
      openLibraryHref="/admin/storage"
      onOpenLibraryClick={() => router.push("/admin/storage")}
    />
  );
};
