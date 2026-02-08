// =============================================================
// FILE: src/components/admin/references/ReferencesFormImageColumn.tsx
// Ensotek – Referans Form – Sağ kolon (görsel upload alanı)
// CategoryFormImageColumn pattern’i
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

/**
 * Storage metadata pattern:
 * - module_key: "references"
 * - locale
 * - reference_slug
 * - reference_id
 */
export type ReferenceImageMetadata = {
  module_key?: string; // default: "references"
  locale?: string;
  reference_slug?: string;
  reference_id?: string;
};

export type ReferencesFormImageColumnProps = {
  metadata?: ReferenceImageMetadata | Record<string, string | number | boolean>;
  imageUrl: string;
  disabled: boolean;
  onImageUrlChange: (url: string) => void;
};

export const ReferencesFormImageColumn: React.FC<ReferencesFormImageColumnProps> = ({
  metadata,
  imageUrl,
  disabled,
  onImageUrlChange,
}) => {
  // AdminImageUploadField metadata: Record<string, string | number | boolean>
  // Biz string’e normalize ederek stabil hale getiriyoruz.
  const effectiveMeta: Record<string, string> | undefined = useMemo(() => {
    const base =
      metadata && 'module_key' in (metadata as any)
        ? (metadata as ReferenceImageMetadata)
        : (metadata as any);

    const normalized: ReferenceImageMetadata = {
      module_key: (base as any)?.module_key ?? 'references',
      locale: (base as any)?.locale,
      reference_slug: (base as any)?.reference_slug,
      reference_id: (base as any)?.reference_id,
    };

    const entries = Object.entries(normalized).filter(
      ([, v]) => v !== undefined && v !== null && String(v).length > 0,
    );
    if (!entries.length) return undefined;

    return Object.fromEntries(entries.map(([k, v]) => [k, String(v)]));
  }, [metadata]);

  return (
    <AdminImageUploadField
      label="Referans Görseli"
      helperText={
        <>
          <strong>Yeni görsel yükle</strong> veya <strong>Resim Havuzu</strong> üzerinden mevcut
          görseller arasından seç. Seçilen görselin URL&apos;i soldaki formda{' '}
          <strong>Öne çıkan görsel URL (featured_image)</strong> alanına otomatik yazılır.
        </>
      }
      bucket="public"
      folder="references"
      metadata={effectiveMeta}
      value={imageUrl}
      onChange={(url) => onImageUrlChange(url)}
      disabled={disabled}
    />
  );
};
