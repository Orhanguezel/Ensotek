// =============================================================
// FILE: src/components/admin/references/ReferencesFormImageColumn.tsx
// Ensotek – Referans Form – Sağ kolon (görsel upload alanı)
// CategoryFormImageColumn pattern’i
// =============================================================

"use client";

import React from "react";
import { useRouter } from "next/router";
import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";

export type ReferenceImageMetadata = {
  module_key: string; // örn: "references"
  locale: string;
  reference_slug?: string;
  reference_id?: string;
  // Gerekirse ileride ek metadata alanları buraya eklenebilir
};

export type ReferencesFormImageColumnProps = {
  metadata?: ReferenceImageMetadata | Record<string, string | number | boolean>;
  imageUrl: string;
  disabled: boolean;
  onImageUrlChange: (url: string) => void;
};

export const ReferencesFormImageColumn: React.FC<
  ReferencesFormImageColumnProps
> = ({ metadata, imageUrl, disabled, onImageUrlChange }) => {
  const router = useRouter();

  return (
    <AdminImageUploadField
      label="Referans Görseli"
      helperText={
        <>
          Storage modülü üzerinden referans için bir{" "}
          <strong>öne çıkan görsel</strong> yükleyebilirsin.
          Yüklenen görselin URL&apos;i soldaki formda{" "}
          <strong>Öne çıkan görsel URL (featured_image)</strong>{" "}
          alanına otomatik yazılabilir (burada direkt state&apos;e yazıyoruz).
        </>
      }
      bucket="public"
      folder="references"
      metadata={metadata}
      value={imageUrl}
      onChange={(url) => onImageUrlChange(url)}
      disabled={disabled}
      openLibraryHref="/admin/storage"
      onOpenLibraryClick={() => router.push("/admin/storage")}
    />
  );
};
