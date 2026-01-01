// =============================================================
// FILE: src/components/admin/products/productForm/ProductFormImageColumn.tsx
// Ensotek – Products/Sparepart Form Right Column (Cover + Gallery Pool)
// - ✅ Cover persists reliably (supports different RTK arg shapes)
// - ✅ Cover is never removed from pool (product_images)
// - ✅ Selecting cover does NOT remove from gallery
// - ✅ Pool is canonical; cover is pointer (products.image_url + legacy featured_image)
// - ✅ Works for both: product + sparepart (main discriminator: products.item_type)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

import type {
  ProductImageDto,
  ProductImageCreatePayload,
} from '@/integrations/types/product_images_admin.types';

import {
  useListProductImagesAdminQuery,
  useCreateProductImageAdminMutation,
  useDeleteProductImageAdminMutation,
  useUpdateProductAdminMutation,
} from '@/integrations/rtk/hooks';

type Props = {
  productId?: string;
  locale: string;

  // DB'de gerçek ayrım: products.item_type = product | sparepart
  itemType?: 'product' | 'sparepart' | string;

  disabled: boolean;
  metadata?: Record<string, string | number | boolean>;

  // cover
  coverValue: string;
  onCoverChange: (url: string) => void;

  // optional
  onGalleryChange?: (items: ProductImageDto[]) => void;
};

const norm = (v: unknown) => String(v ?? '').trim();

const sortImages = (items: ProductImageDto[]) => {
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

export const ProductFormImageColumn: React.FC<Props> = ({
  productId,
  locale,
  itemType,
  disabled,
  metadata,
  coverValue,
  onCoverChange,
  onGalleryChange,
}) => {
  const router = useRouter();

  const {
    data: imageItemsRaw,
    isLoading: imagesLoading,
    isFetching: imagesFetching,
    refetch,
  } = useListProductImagesAdminQuery(productId as string, { skip: !productId });

  const imageItems = useMemo(
    () => sortImages((imageItemsRaw ?? []) as ProductImageDto[]),
    [imageItemsRaw],
  );

  const [createImage, { isLoading: isCreating }] = useCreateProductImageAdminMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteProductImageAdminMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductAdminMutation();

  const galleryUrls = useMemo(() => {
    return (imageItems ?? []).map((x) => norm((x as any)?.image_url)).filter(Boolean);
  }, [imageItems]);

  const uploadingDisabled =
    disabled || imagesLoading || imagesFetching || isCreating || isDeleting || isUpdatingProduct;

  const existsInPool = (urlRaw: string) => {
    const u = norm(urlRaw);
    if (!u) return false;
    return (imageItems ?? []).some((x: any) => norm(x?.image_url) === u);
  };

  const upsertOne = async (urlRaw: string) => {
    if (!productId) return null;

    const url = norm(urlRaw);
    if (!url) return null;

    if (existsInPool(url)) return (imageItems ?? null) as any;

    const payload: ProductImageCreatePayload = {
      image_url: url,
      image_asset_id: null,
      is_active: true,
      display_order: null,
      title: null,
      alt: null,
      caption: null,
      locale,
      replicate_all_locales: true,
    };

    const list = await createImage({ productId, payload } as any).unwrap();
    return list as ProductImageDto[];
  };

  const removeByUrl = async (urlRaw: string) => {
    if (!productId) return;

    const url = norm(urlRaw);
    if (!url) return;

    const row = (imageItems ?? []).find((x: any) => norm(x?.image_url) === url);
    if (!row) return;

    const next = await deleteImage({ productId, imageId: (row as any).id } as any).unwrap();
    onGalleryChange?.(next as ProductImageDto[]);
  };

  const persistCover = async (urlRaw: string) => {
    if (!productId) return;

    const url = norm(urlRaw);
    if (!url) return;

    // ✅ schema uyumu: products.image_url var, legacy featured_image backend'de varsa desteklenir
    // ✅ ayrım: item_type (product|sparepart)
    const patch: Record<string, any> = {
      image_url: url,
      featured_image: url,
      ...(itemType ? { item_type: itemType } : {}),
      locale,
    };

    const tries = [
      () => updateProduct({ id: productId, patch } as any).unwrap(),
      () => updateProduct({ productId, patch } as any).unwrap(),
      () => updateProduct({ id: productId, payload: patch } as any).unwrap(),
      () => updateProduct({ productId, payload: patch } as any).unwrap(),
      () => updateProduct({ id: productId, data: patch } as any).unwrap(),
      () => updateProduct({ productId, data: patch } as any).unwrap(),
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
    onCoverChange(url);
  };

  const handleSelectAsCover = (urlRaw: string) => {
    const url = norm(urlRaw);
    if (!url) return;

    setCoverUI(url);
    if (!productId) return;

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

    if (!productId || !url) return;

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
    if (!productId) return;

    const nextUrls = (nextUrlsRaw ?? []).map((u) => norm(u)).filter(Boolean);

    const prevSet = new Set(galleryUrls);
    const nextSet = new Set(nextUrls);

    const added = nextUrls.filter((u) => !prevSet.has(u));
    const removed = galleryUrls.filter((u) => !nextSet.has(u));

    const coverUrl = norm(coverValue);
    const removedSafe = removed.filter((u) => u !== coverUrl);

    if (added.length > 0) {
      void (async () => {
        let lastList: ProductImageDto[] | null = null;
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

  const coverMeta = {
    ...(metadata || {}),
    section: 'cover',
    ...(itemType ? { item_type: itemType } : {}),
  };

  const galleryMeta = {
    ...(metadata || {}),
    section: 'gallery',
    ...(itemType ? { item_type: itemType } : {}),
  };

  return (
    <div className="d-flex flex-column gap-3">
      <AdminImageUploadField
        label="Kapak Görseli"
        helperText={
          <>
            Kapak görseli <code>products.image_url</code> alanına yazılır (legacy:{' '}
            <code>featured_image</code>). Kapak seçilen görsel <strong>galeriden silinmez</strong>,
            havuzda kalır.
          </>
        }
        bucket="public"
        folder="products/cover"
        metadata={coverMeta}
        value={norm(coverValue)}
        onChange={handleCoverChange}
        disabled={disabled}
        openLibraryHref="/admin/storage"
        onOpenLibraryClick={() => router.push('/admin/storage')}
      />

      {productId ? (
        <AdminImageUploadField
          label="Görsel Havuzu (Galeri)"
          helperText={
            <>
              Tüm görseller havuzda durur (<code>product_images</code>). “Kapak” seçince sadece
              pointer güncellenir.
            </>
          }
          bucket="public"
          folder="products/gallery"
          metadata={galleryMeta}
          multiple
          values={galleryUrls}
          onChangeMultiple={handleGalleryUrlsChange}
          onSelectAsCover={handleSelectAsCover}
          coverValue={norm(coverValue)}
          disabled={uploadingDisabled}
          openLibraryHref="/admin/storage"
          onOpenLibraryClick={() => router.push('/admin/storage')}
        />
      ) : (
        <div className="border rounded-2 p-3 bg-light text-muted small">
          Galeri/havuz için önce kaydı oluştur (ID oluşmalı). Sonra görseller burada yönetilir.
        </div>
      )}
    </div>
  );
};
