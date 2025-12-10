// =============================================================
// FILE: src/components/admin/library/LibraryFormImageColumn.tsx
// Ensotek – Library Form – Sağ kolon (görsel upload alanı)
// NOT: LibraryDto parent üzerinde görsel alanı yok; bu kolon
//      sadece storage üzerinden görsel seçmek / yüklemek ve
//      URL'i form state'ine yazmak için kullanılıyor.
// =============================================================

"use client";

import React from "react";
import { useRouter } from "next/router";
import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";

export type ReferenceImageMetadata = {
  module_key: string; // örn: "library"
  locale: string;
  reference_slug?: string;
  reference_id?: string;
  // Gerekirse ileride ek metadata alanları buraya eklenebilir
};

export type LibraryFormImageColumnProps = {
  metadata?:
    | ReferenceImageMetadata
    | Record<string, string | number | boolean>;
  imageUrl: string;
  disabled: boolean;
  onImageUrlChange: (url: string) => void;
};

export const LibraryFormImageColumn: React.FC<
  LibraryFormImageColumnProps
> = ({ metadata, imageUrl, disabled, onImageUrlChange }) => {
  const router = useRouter();

  return (
    <AdminImageUploadField
      label="Library Görseli"
      helperText={
        <>
          Storage modülü üzerinden bu library kaydı için bir{" "}
          <strong>kapak / temsil görseli</strong> yükleyebilirsin.
          Bu bileşen sadece seçilen görselin URL&apos;ini form
          state&apos;ine yazar; asıl kalıcı ilişkiyi istersen ileride{" "}
          <code>library_images</code> modülü ile kurabilirsin.
        </>
      }
      bucket="public"
      folder="library"
      metadata={metadata}
      value={imageUrl}
      onChange={(url) => onImageUrlChange(url)}
      disabled={disabled}
      openLibraryHref="/admin/storage"
      onOpenLibraryClick={() => router.push("/admin/storage")}
    />
  );
};
