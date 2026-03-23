// =============================================================
// CustomPageSidebarColumn — Sadece icerik icine gorsel ekleme
// SEO alanlari ayri tab'da (FormTabs > SEO)
// =============================================================

'use client';

import React from 'react';

import { AdminImageUploadField } from '@/app/(main)/admin/_components/common/AdminImageUploadField';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import type { ContentImageSize, CustomPageFormValues } from './custom-page-form';

type Props = {
  values: CustomPageFormValues;
  disabled: boolean;
  imageMetadata: Record<string, string | number | boolean>;
  contentImageSize: ContentImageSize;
  setContentImageSize: (s: ContentImageSize) => void;
  contentImagePreview: string;
  handleAddContentImage: (url: string, alt?: string) => void;
  manualImageUrl: string;
  manualImageAlt: string;
  setManualImageUrl: (v: string) => void;
  setManualImageAlt: (v: string) => void;
  handleAddManualImage: () => void;
  setValues: React.Dispatch<React.SetStateAction<CustomPageFormValues>>;
};

export const CustomPageSidebarColumn: React.FC<Props> = ({
  disabled,
  imageMetadata,
  contentImageSize,
  setContentImageSize,
  contentImagePreview,
  handleAddContentImage,
  manualImageUrl,
  manualImageAlt,
  setManualImageUrl,
  setManualImageAlt,
  handleAddManualImage,
}) => {
  const t = useAdminT();

  return (
    <div className="rounded-lg border bg-card p-3 space-y-4">
      <div className="text-xs font-medium text-muted-foreground">Icerige Gorsel Ekle</div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{t('admin.customPage.form.imageSize')}</label>
        <select
          className="w-full rounded-md border bg-background px-2 py-2 text-sm"
          value={contentImageSize}
          onChange={(e) => setContentImageSize(e.target.value as ContentImageSize)}
          disabled={disabled}
        >
          <option value="sm">{t('admin.customPage.form.imageSizeSm')}</option>
          <option value="md">{t('admin.customPage.form.imageSizeMd')}</option>
          <option value="lg">{t('admin.customPage.form.imageSizeLg')}</option>
          <option value="full">{t('admin.customPage.form.imageSizeFull')}</option>
        </select>
      </div>

      <AdminImageUploadField
        label="Gorsel Yukle"
        helperText={<>{t('admin.customPage.form.uploadHelperText')}</>}
        bucket="public"
        folder="custom_pages/content"
        metadata={{ ...(imageMetadata || {}), section: 'content' }}
        value={contentImagePreview}
        onChange={(url) => handleAddContentImage(url)}
        disabled={disabled}
        openLibraryHref="/admin/storage"
      />

      <div className="space-y-2">
        <label className="block text-xs text-muted-foreground">
          {t('admin.customPage.form.manualUrl')}
        </label>
        <input
          type="url"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="https://..."
          value={manualImageUrl}
          onChange={(e) => setManualImageUrl(e.target.value)}
          disabled={disabled}
        />
        <input
          type="text"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Alt metin"
          value={manualImageAlt}
          onChange={(e) => setManualImageAlt(e.target.value)}
          disabled={disabled}
        />
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-xs disabled:opacity-60"
          onClick={handleAddManualImage}
          disabled={disabled}
        >
          Icerige Ekle
        </button>
      </div>
    </div>
  );
};
