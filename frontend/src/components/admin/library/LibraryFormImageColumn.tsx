// =============================================================
// FILE: src/components/admin/library/LibraryFormImageColumn.tsx
// Ensotek – Library Form – Sağ kolon (Kapak + Opsiyonel Galeri)
// ✅ Schema aligned:
// - library parent: featured_image (legacy), image_url (legacy), image_asset_id (storage)
// Bu bileşen, kapak görselini image_url alanına yazar (mevcut akış).
// Ek olarak (opsiyonel) galeri URL listesi yönetebilir.
// =============================================================

'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

export type ReferenceImageMetadata = {
  module_key: string; // örn: "library"
  locale: string;
  reference_slug?: string;
  reference_id?: string;
};

export type LibraryFormImageColumnProps = {
  metadata?: ReferenceImageMetadata | Record<string, string | number | boolean>;

  /** Kapak görseli -> library.image_url */
  imageUrl: string;
  disabled: boolean;
  onImageUrlChange: (url: string) => void;

  /**
   * Opsiyonel: galeri URL listesi (henüz DB'ye yazmıyor, sadece FE state)
   * DB tarafında library_images endpoint’leri hazır olduğunda bunu LibraryImagesSection’a çeviririz.
   */
  galleryUrls?: string[];
  onGalleryUrlsChange?: (urls: string[]) => void;
};

export const LibraryFormImageColumn: React.FC<LibraryFormImageColumnProps> = ({
  metadata,
  imageUrl,
  disabled,
  onImageUrlChange,
  galleryUrls,
  onGalleryUrlsChange,
}) => {
  const router = useRouter();

  return (
    <div className="d-flex flex-column gap-3">
      {/* COVER */}
      <AdminImageUploadField
        label="Kapak / Temsil Görseli"
        helperText={
          <>
            Storage modülü üzerinden bu library kaydı için bir{' '}
            <strong>kapak / temsil görseli</strong> yükleyebilirsin. Bu seçim mevcut akışta{' '}
            <code>library.image_url</code> alanına yazılır.
          </>
        }
        bucket="public"
        folder="library/cover"
        metadata={metadata}
        value={imageUrl}
        onChange={(url) => onImageUrlChange(url)}
        disabled={disabled}
        openLibraryHref="/admin/storage"
        onOpenLibraryClick={() => router.push('/admin/storage')}
      />

      {/* GALLERY (optional) */}
      {onGalleryUrlsChange && (
        <AdminImageUploadField
          label="Galeri Görselleri (opsiyonel)"
          helperText={
            <>
              İstersen birden fazla görsel yükleyip galeri oluşturabilirsin. Buradaki “Kapak” butonu
              ile seçilen görseli kapak olarak atayabilirsin (yukarıdaki alanı günceller).
              <div className="mt-1">
                Not: Bu alan şu an sadece URL listesi yönetir. Kalıcı kayıt için{' '}
                <code>library_images</code> endpoint’leri ile ayrıca bağlarız.
              </div>
            </>
          }
          bucket="public"
          folder="library/gallery"
          metadata={metadata}
          multiple
          values={galleryUrls ?? []}
          onChangeMultiple={onGalleryUrlsChange}
          onSelectAsCover={(url) => onImageUrlChange(url)}
          coverValue={imageUrl}
          disabled={disabled}
          openLibraryHref="/admin/storage"
          onOpenLibraryClick={() => router.push('/admin/storage')}
        />
      )}
    </div>
  );
};
