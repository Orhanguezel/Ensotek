// =============================================================
// FILE: src/components/admin/products/productForm/ProductFormImageColumn.tsx
// Ensotek – Products/Sparepart Form Right Column (Cover + Gallery Pool + LEGACY FALLBACK)
// FINAL FIX:
// - ✅ Pool (product_images) varsa onu yönet
// - ✅ Pool boşsa legacy (products.images) göster + silme/ekleme PATCH ile çalışsın
// - ✅ Cover PATCH: sadece products.image_url (schema dışı featured_image YOK)
// - ✅ listProductImagesAdmin: locale param destekli
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

  // DB ayrımı: products.item_type
  itemType?: 'product' | 'sparepart' | string;

  disabled: boolean;
  metadata?: Record<string, string | number | boolean>;

  // cover (products.image_url)
  coverValue: string;
  onCoverChange: (url: string) => void;

  // pool callback (optional)
  onGalleryChange?: (items: ProductImageDto[]) => void;

  // ✅ LEGACY: products.images (seed burayı dolduruyor)
  legacyUrls?: string[];
  onLegacyUrlsChange?: (urls: string[]) => void;
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
  legacyUrls,
  onLegacyUrlsChange,
}) => {
  const router = useRouter();

  // ---------------- POOL (product_images) ----------------

  const {
    data: imageItemsRaw,
    isLoading: imagesLoading,
    isFetching: imagesFetching,
    refetch,
  } = useListProductImagesAdminQuery(productId ? { productId, locale } : (undefined as any), {
    skip: !productId,
  });

  const imageItems = useMemo(
    () => sortImages((imageItemsRaw ?? []) as ProductImageDto[]),
    [imageItemsRaw],
  );

  const poolUrls = useMemo(() => {
    return (imageItems ?? []).map((x) => norm((x as any)?.image_url)).filter(Boolean);
  }, [imageItems]);

  const poolHasAny = poolUrls.length > 0;

  const [createImage, { isLoading: isCreating }] = useCreateProductImageAdminMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteProductImageAdminMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductAdminMutation();

  const uploadingDisabled =
    disabled || imagesLoading || imagesFetching || isCreating || isDeleting || isUpdatingProduct;

  const existsInPool = (urlRaw: string) => {
    const u = norm(urlRaw);
    if (!u) return false;
    return (imageItems ?? []).some((x: any) => norm(x?.image_url) === u);
  };

  const upsertOneToPool = async (urlRaw: string) => {
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

    const res = await createImage({ productId, payload } as any).unwrap();

    // API bazen tek obje bazen liste döndürebilir → normalize
    const nextList = Array.isArray(res) ? res : null;
    return nextList as ProductImageDto[] | null;
  };

  const removeFromPoolByUrl = async (urlRaw: string) => {
    if (!productId) return;

    const url = norm(urlRaw);
    if (!url) return;

    const row = (imageItems ?? []).find((x: any) => norm(x?.image_url) === url);
    if (!row) return;

    const res = await deleteImage({ productId, imageId: (row as any).id } as any).unwrap();

    // normalize
    if (Array.isArray(res)) onGalleryChange?.(res as ProductImageDto[]);
  };

  // ---------------- LEGACY (products.images) ----------------

  const [legacyLocal, setLegacyLocal] = useState<string[]>(() =>
    Array.isArray(legacyUrls) ? legacyUrls.map(norm).filter(Boolean) : [],
  );

  useEffect(() => {
    setLegacyLocal(Array.isArray(legacyUrls) ? legacyUrls.map(norm).filter(Boolean) : []);
  }, [legacyUrls]);

  const persistLegacyImages = async (nextUrls: string[]) => {
    if (!productId) return;

    // Backend validation: images: url[]
    // Ayrıca locale gönderilebilir (opsiyonel); göndermezsek de olur.
    const patch: Record<string, any> = {
      images: nextUrls,
      ...(itemType ? { item_type: itemType } : {}),
      // locale: locale, // istersen aç (i18n update için bazı backendlere lazım olabilir)
    };

    try {
      await updateProduct({ id: productId, patch } as any).unwrap();
    } catch (err: any) {
      throw err;
    }
  };

  const handleLegacyUrlsChange = (nextUrlsRaw: string[]) => {
    const next = (nextUrlsRaw ?? []).map(norm).filter(Boolean);
    setLegacyLocal(next);
    onLegacyUrlsChange?.(next);

    if (!productId) return;

    void (async () => {
      try {
        await persistLegacyImages(next);
        toast.success('Galeri (legacy) güncellendi.');
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.data?.message ||
          err?.message ||
          'Galeri (legacy) kaydedilirken hata oluştu.';
        toast.error(msg);
      }
    })();
  };

  // ---------------- Cover persist ----------------

  const persistCover = async (urlRaw: string) => {
    if (!productId) return;

    const url = norm(urlRaw);
    if (!url) return;

    // ✅ schema uyumu: products.image_url var
    // ❌ featured_image yok → göndermiyoruz
    const patch: Record<string, any> = {
      image_url: url,
      ...(itemType ? { item_type: itemType } : {}),
      // locale: locale, // gerekirse aç
    };

    await updateProduct({ id: productId, patch } as any).unwrap();
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
        // cover seçildiğinde:
        // - pool varsa: pool’a ekle (yoksa bile eklemeye çalış)
        // - legacy ise: cover pointer set edilir, legacy list bozulmaz
        const list = await upsertOneToPool(url);
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
        const list = await upsertOneToPool(url);
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

  // ---------------- Gallery change (pool first, legacy fallback) ----------------

  const handleGalleryUrlsChange = (nextUrlsRaw: string[]) => {
    if (!productId) return;

    const nextUrls = (nextUrlsRaw ?? []).map((u) => norm(u)).filter(Boolean);
    const coverUrl = norm(coverValue);

    // cover galeriden kaldırılmasın
    const nextUrlsSafe = nextUrls.filter((u) => u !== coverUrl);
    const prevPoolSet = new Set(poolUrls);
    const nextPoolSet = new Set(nextUrlsSafe);

    // Eğer pool’da veri varsa: pool üzerinden yönet
    if (poolHasAny) {
      const added = nextUrlsSafe.filter((u) => !prevPoolSet.has(u));
      const removed = poolUrls.filter((u) => !nextPoolSet.has(u)).filter((u) => u !== coverUrl);

      if (added.length > 0) {
        void (async () => {
          let lastList: ProductImageDto[] | null = null;
          for (const url of added) {
            const list = await upsertOneToPool(url);
            if (list) lastList = list;
          }
          if (lastList) onGalleryChange?.(lastList);
          await refetch();
        })();
      }

      if (removed.length > 0) {
        void (async () => {
          for (const url of removed) {
            await removeFromPoolByUrl(url);
          }
          await refetch();
        })();
      }

      return;
    }

    // Pool boşsa: legacy images’ı patch’le (seed verisini yönetebilmek için)
    handleLegacyUrlsChange(nextUrlsSafe);
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

  // Galeride gösterilecek kaynak:
  // - pool doluysa: poolUrls
  // - pool boşsa: legacyLocal
  const galleryValues = poolHasAny ? poolUrls : legacyLocal;

  return (
    <div className="d-flex flex-column gap-3">
      <AdminImageUploadField
        label="Kapak Görseli"
        helperText={
          <>
            Kapak görseli <code>products.image_url</code> alanına yazılır. Galeriden silinmez.
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
          label={poolHasAny ? 'Görsel Havuzu (Galeri)' : 'Galeri (Legacy: products.images)'}
          helperText={
            poolHasAny ? (
              <>
                Tüm görseller havuzda durur (<code>product_images</code>). “Kapak” seçince sadece
                <code> products.image_url</code> güncellenir.
              </>
            ) : (
              <>
                Bu üründe <code>product_images</code> havuzu boş. Seed’den gelen{' '}
                <code>products.images</code> alanı gösteriliyor. Buradan sildiğin/eklediğin URL’ler
                direkt <code>products.images</code> içine kaydedilir.
              </>
            )
          }
          bucket="public"
          folder="products/gallery"
          metadata={galleryMeta}
          multiple
          values={galleryValues}
          onChangeMultiple={handleGalleryUrlsChange}
          onSelectAsCover={handleSelectAsCover}
          coverValue={norm(coverValue)}
          disabled={uploadingDisabled}
          openLibraryHref="/admin/storage"
          onOpenLibraryClick={() => router.push('/admin/storage')}
        />
      ) : (
        <div className="border rounded-2 p-3 bg-light text-muted small">
          Galeri için önce kaydı oluştur (ID oluşmalı). Sonra görseller burada yönetilir.
        </div>
      )}
    </div>
  );
};
