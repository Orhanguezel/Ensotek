// =============================================================
// FILE: src/components/admin/services/serviceForm/ServiceFormImageColumn.tsx
// Ensotek – Services Form Right Column (FINAL FIX)
// - ✅ Cover persists reliably (supports different RTK arg shapes)
// - ✅ Cover image is never removed from pool (service_images)
// - ✅ Selecting cover does NOT remove from gallery
// - ✅ Pool is canonical; cover is just pointer (services.image_url + legacy featured_image)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

import type {
  ServiceImageDto,
  ServiceImageCreatePayload,
} from '@/integrations/types/services.types';

import {
  useListServiceImagesAdminQuery,
  useCreateServiceImageAdminMutation,
  useDeleteServiceImageAdminMutation,
  useUpdateServiceAdminMutation,
} from '@/integrations/rtk/hooks';

type Props = {
  serviceId?: string;
  locale: string;
  disabled: boolean;
  metadata?: Record<string, string | number | boolean>;

  featuredImageValue: string;

  onFeaturedImageChange: (url: string) => void;
  onGalleryChange?: (items: ServiceImageDto[]) => void;
};

const norm = (v: unknown) => String(v ?? '').trim();

const sortImages = (items: ServiceImageDto[]) => {
  return [...items].sort((a: any, b: any) => {
    const ao = Number(a?.display_order ?? 0);
    const bo = Number(b?.display_order ?? 0);
    if (ao !== bo) return ao - bo;

    const ac = String(a?.created_at ?? '');
    const bc = String(b?.created_at ?? '');
    if (ac < bc) return -1;
    if (ac > bc) return 1;
    return 0;
  });
};

export const ServiceFormImageColumn: React.FC<Props> = ({
  serviceId,
  locale,
  disabled,
  metadata,
  featuredImageValue,
  onFeaturedImageChange,
  onGalleryChange,
}) => {
  const router = useRouter();

  const {
    data: imageItemsRaw,
    isLoading: imagesLoading,
    isFetching: imagesFetching,
    refetch,
  } = useListServiceImagesAdminQuery(serviceId as string, { skip: !serviceId });

  const imageItems = useMemo(
    () => sortImages((imageItemsRaw ?? []) as ServiceImageDto[]),
    [imageItemsRaw],
  );

  const [createImage, { isLoading: isCreating }] = useCreateServiceImageAdminMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteServiceImageAdminMutation();
  const [updateService, { isLoading: isUpdatingService }] = useUpdateServiceAdminMutation();

  const galleryUrls = useMemo(() => {
    return (imageItems ?? []).map((x) => norm((x as any)?.image_url)).filter(Boolean);
  }, [imageItems]);

  const uploadingDisabled =
    disabled || imagesLoading || imagesFetching || isCreating || isDeleting || isUpdatingService;

  const existsInPool = (urlRaw: string) => {
    const u = norm(urlRaw);
    if (!u) return false;
    return (imageItems ?? []).some((x) => norm((x as any)?.image_url) === u);
  };

  const upsertOne = async (urlRaw: string) => {
    if (!serviceId) return null;

    const url = norm(urlRaw);
    if (!url) return null;

    if (existsInPool(url)) return (imageItems ?? null) as any;

    const payload: ServiceImageCreatePayload = {
      image_url: url,
      image_asset_id: null,
      is_active: true,
      display_order: undefined,
      title: null,
      alt: null,
      caption: null,
      locale,
      replicate_all_locales: true,
    };

    const list = await createImage({ serviceId, payload } as any).unwrap();
    return list as ServiceImageDto[];
  };

  const removeByUrl = async (urlRaw: string) => {
    if (!serviceId) return;

    const url = norm(urlRaw);
    if (!url) return;

    const row = (imageItems ?? []).find((x: any) => norm(x?.image_url) === url);
    if (!row) return;

    const next = await deleteImage({ serviceId, imageId: (row as any).id } as any).unwrap();
    onGalleryChange?.(next as ServiceImageDto[]);
  };

  const persistCover = async (urlRaw: string) => {
    if (!serviceId) return;

    const url = norm(urlRaw);
    if (!url) return;

    const patch = { image_url: url, featured_image: url };

    const tries = [
      () => updateService({ id: serviceId, payload: patch } as any).unwrap(),
      () => updateService({ serviceId, payload: patch } as any).unwrap(),
      () => updateService({ id: serviceId, data: patch } as any).unwrap(),
      () => updateService({ serviceId, data: patch } as any).unwrap(),
    ];

    let lastErr: any = null;
    for (const fn of tries) {
      try {
        await fn();
        return;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  };

  const setCoverUI = (urlRaw: string) => {
    const url = norm(urlRaw);
    onFeaturedImageChange(url);
  };

  const handleSelectAsCover = (urlRaw: string) => {
    const url = norm(urlRaw);
    if (!url) return;

    setCoverUI(url);
    if (!serviceId) return;

    void (async () => {
      try {
        const list = await upsertOne(url);
        if (list) onGalleryChange?.(list);

        await persistCover(url);
        await refetch();

        toast.success('Kapak görseli kaydedildi.');
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.data?.message ||
          err?.message ||
          'Kapak kaydedilirken hata oluştu.';
        toast.error(msg);
      }
    })();
  };

  const handleCoverChange = (urlRaw: string) => {
    const url = norm(urlRaw);
    setCoverUI(url);

    if (!serviceId || !url) return;

    void (async () => {
      try {
        const list = await upsertOne(url);
        if (list) onGalleryChange?.(list);

        await persistCover(url);
        await refetch();

        toast.success('Kapak görseli kaydedildi.');
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.data?.message ||
          err?.message ||
          'Kapak kaydedilirken hata oluştu.';
        toast.error(msg);
      }
    })();
  };

  const handleGalleryUrlsChange = (nextUrlsRaw: string[]) => {
    if (!serviceId) return;

    const nextUrls = (nextUrlsRaw ?? []).map((u) => norm(u)).filter(Boolean);

    const prevSet = new Set(galleryUrls);
    const nextSet = new Set(nextUrls);

    const added = nextUrls.filter((u) => !prevSet.has(u));
    const removed = galleryUrls.filter((u) => !nextSet.has(u));

    const coverUrl = norm(featuredImageValue);
    const removedSafe = removed.filter((u) => u !== coverUrl);

    if (added.length > 0) {
      void (async () => {
        let lastList: ServiceImageDto[] | null = null;
        for (const url of added) {
          const list = await upsertOne(url);
          if (list) lastList = list;
        }
        if (lastList) onGalleryChange?.(lastList);
      })();
    }

    if (removedSafe.length > 0) {
      void (async () => {
        for (const url of removedSafe) {
          await removeByUrl(url);
        }
      })();
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <AdminImageUploadField
        label="Kapak Görseli"
        helperText={
          <>
            Kapak görseli <code>services.image_url</code> alanına yazılır (legacy: featured_image).
            Kapak seçilen görsel <strong>galeriden silinmez</strong>, havuzda kalır.
          </>
        }
        bucket="public"
        folder="services/cover"
        metadata={{ ...(metadata || {}), section: 'cover' }}
        value={norm(featuredImageValue)}
        onChange={handleCoverChange}
        disabled={disabled}
        openLibraryHref="/admin/storage"
        onOpenLibraryClick={() => router.push('/admin/storage')}
      />

      {serviceId ? (
        <AdminImageUploadField
          label="Görsel Havuzu (Galeri)"
          helperText={
            <>
              Tüm görseller havuzda durur (<code>service_images</code>). “Kapak” seçince sadece
              pointer güncellenir.
            </>
          }
          bucket="public"
          folder="services/gallery"
          metadata={{ ...(metadata || {}), section: 'gallery' }}
          multiple
          values={galleryUrls}
          onChangeMultiple={handleGalleryUrlsChange}
          onSelectAsCover={handleSelectAsCover}
          coverValue={norm(featuredImageValue)}
          disabled={uploadingDisabled}
          openLibraryHref="/admin/storage"
          onOpenLibraryClick={() => router.push('/admin/storage')}
        />
      ) : (
        <div className="border rounded-2 p-3 bg-light text-muted small">
          Galeri/havuz için önce hizmeti kaydet (ID oluşmalı). Sonra görseller burada yönetilir.
        </div>
      )}
    </div>
  );
};
