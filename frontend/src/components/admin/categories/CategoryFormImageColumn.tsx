// =============================================================
// FILE: src/components/admin/categories/CategoryFormImageColumn.tsx
// Kategori Form – Sağ kolon (görsel upload alanı)
// - FIX: Upload sonrası anlık preview render (local state sync + key remount)
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

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

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

export const CategoryFormImageColumn: React.FC<CategoryFormImageColumnProps> = ({
  metadata,
  iconValue,
  disabled,
  onIconChange,
}) => {
  // ✅ Controlled local state (AdminImageUploadField internal-state sync problemi için)
  const [localValue, setLocalValue] = useState<string>(safeStr(iconValue));

  // prop değişince (ör. edit locale switch / initialData load) local’i sync et
  useEffect(() => {
    setLocalValue(safeStr(iconValue));
  }, [iconValue]);

  // ✅ Remount key: value değişince component kesin refresh
  const remountKey = useMemo(() => {
    const m = metadata
      ? `${safeStr(metadata.module_key)}|${safeStr(metadata.locale)}|${safeStr(
          metadata.category_slug,
        )}`
      : 'no-meta';
    return `${m}|${safeStr(localValue) || 'empty'}`;
  }, [metadata, localValue]);

  return (
    <AdminImageUploadField
      key={remountKey}
      label="Kategori Görseli"
      helperText={
        <>
          Storage modülü üzerinden kategori için bir görsel yükleyebilirsin. Yüklenen görselin
          URL&apos;i anında önizleme olarak burada görünür.
        </>
      }
      bucket="public"
      folder="categories"
      metadata={metadata}
      value={localValue}
      onChange={(url) => {
        const nextUrl = safeStr(url);
        // ✅ önce UI’ı güncelle (anlık preview)
        setLocalValue(nextUrl);
        // ✅ sonra üst state’i güncelle
        onIconChange(nextUrl);
      }}
      disabled={disabled}
    />
  );
};
