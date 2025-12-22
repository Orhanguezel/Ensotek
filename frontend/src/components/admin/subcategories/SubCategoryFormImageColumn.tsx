// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormImageColumn.tsx
// Ensotek – Alt Kategori Görsel/Icon Kolonu
// Kategori ile aynı storage upload pattern'i
// =============================================================

import React from 'react';
import { useRouter } from 'next/router';
import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

export type SubCategoryImageMetadata = {
  category_id?: string;
  locale?: string;
  sub_category_slug?: string;
};

export type SubCategoryFormImageColumnProps = {
  metadata?: SubCategoryImageMetadata;
  iconValue: string;
  disabled?: boolean;
  onIconChange: (url: string) => void;
};

export const SubCategoryFormImageColumn: React.FC<SubCategoryFormImageColumnProps> = ({
  metadata,
  iconValue,
  disabled,
  onIconChange,
}) => {
  const router = useRouter();

  return (
    <AdminImageUploadField
      label="Alt Kategori Görseli"
      helperText={
        <>
          Storage modülü üzerinden alt kategori için bir görsel yükleyebilirsin. Yüklenen görselin
          URL&apos;i formdaki <strong>Icon / Görsel URL</strong> alanına otomatik yazılabilir ve
          JSON modeline yansıtılabilir.
        </>
      }
      bucket="public"
      folder="subcategories"
      metadata={metadata}
      value={iconValue}
      onChange={onIconChange}
      disabled={disabled}
      openLibraryHref="/admin/storage"
      onOpenLibraryClick={() => router.push('/admin/storage')}
    />
  );
};
