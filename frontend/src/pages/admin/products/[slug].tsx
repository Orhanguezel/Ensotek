// =============================================================
// FILE: src/pages/admin/products/[slug].tsx
// Ensotek – Admin Product Create/Edit Page (module_key=product)
// Locale: DB (app_locales + default_locale)
// Admin rule: locale URL'e yazılmaz (NO URL sync)
// RTK: from "@/integrations/rtk/hooks"
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import {
  ProductsForm,
  type ProductFormValues,
} from '@/components/admin/products/productForm/ProductsForm';

import {
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient } from '@/i18n/localeShortClient';

const MODULE_KEY = 'product';

const AdminProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug: slugParam } = router.query;

  const idOrSlug = useMemo(
    () => (router.isReady && typeof slugParam === 'string' ? slugParam : undefined),
    [router.isReady, slugParam],
  );

  const isCreateMode = idOrSlug === 'new';
  const shouldSkipQuery = !router.isReady || isCreateMode || !idOrSlug;

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  // ✅ Admin API locale (NO URL sync)
  const apiLocale = useMemo(
    () => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'de'),
    [localeOptions, defaultLocaleFromDb],
  );

  // ✅ active locale state (form selector)
  const [activeLocale, setActiveLocale] = useState<string>('');

  useEffect(() => {
    if (!localeOptions || localeOptions.length === 0) return;

    setActiveLocale((prev) => {
      const p = localeShortClient(prev);
      if (p) return p;
      return apiLocale;
    });
  }, [localeOptions, apiLocale]);

  const queryLocale = useMemo(
    () => localeShortClient(activeLocale) || apiLocale,
    [activeLocale, apiLocale],
  );

  const {
    data: product,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
    error: productError,
  } = useGetProductAdminQuery(
    { id: idOrSlug ?? '', locale: queryLocale, module_key: MODULE_KEY } as any,
    { skip: shouldSkipQuery || !queryLocale },
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductAdminMutation();

  const loading = isLoadingProduct || isFetchingProduct;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    void router.push('/admin/products');
  };

  const toNumberOrUndefined = (val: string): number | undefined => {
    const n = Number(String(val ?? '').replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  };

  const parseCommaList = (val: string): string[] =>
    String(val || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const loc = localeShortClient(values.locale || queryLocale) || apiLocale;

      const allowed = new Set(
        (localeOptions ?? []).map((x: any) => localeShortClient(x?.value)).filter(Boolean),
      );
      if (!loc || !allowed.has(loc)) {
        toast.error('Geçerli bir locale seçilmedi. app_locales ve default_locale kontrol edin.');
        return;
      }

      const tags = parseCommaList(values.tags);
      const storageImageIds = parseCommaList(values.storage_image_ids);

      const commonPayload: Record<string, any> = {
        module_key: MODULE_KEY,
        locale: loc,

        is_active: values.is_active,
        is_featured: values.is_featured,

        title: values.title.trim(),
        slug: values.slug.trim(),
        price: toNumberOrUndefined(values.price) ?? 0,
        description: values.description.trim() || undefined,

        category_id: values.category_id || undefined,
        sub_category_id: values.sub_category_id || undefined,

        image_url: values.image_url.trim() || undefined,
        storage_asset_id: values.storage_asset_id.trim() || undefined,
        alt: values.alt.trim() || undefined,
        storage_image_ids: storageImageIds,

        tags,

        product_code: values.product_code.trim() || undefined,
        stock_quantity: toNumberOrUndefined(values.stock_quantity) ?? 0,
        rating: toNumberOrUndefined(values.rating),

        meta_title: values.meta_title.trim() || undefined,
        meta_description: values.meta_description.trim() || undefined,

        ...(values.order_num ? { order_num: toNumberOrUndefined(values.order_num) } : {}),
      };

      if (isCreateMode) {
        const created = await createProduct(commonPayload as any).unwrap();

        toast.success('Ürün başarıyla oluşturuldu.');

        const nextId = created.id;
        void router.replace(`/admin/products/${encodeURIComponent(nextId)}`);
      } else {
        if (!product) {
          toast.error('Ürün verisi yüklenemedi.');
          return;
        }

        await updateProduct({
          id: product.id,
          patch: { ...commonPayload, locale: loc } as any,
        }).unwrap();

        toast.success('Ürün güncellendi.');

        if (loc !== queryLocale) setActiveLocale(loc);
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || 'İşlem sırasında bir hata oluştu.');
    }
  };

  const pageTitle = isCreateMode ? 'Yeni Ürün Oluştur' : product?.title || 'Ürün Düzenle';

  if (!router.isReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  if (!localesLoading && !localesFetching && (!localeOptions || localeOptions.length === 0)) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Dil listesi bulunamadı</h4>
        <p className="text-muted small mb-3">
          <code>site_settings.app_locales</code> boş veya geçersiz. Önce Site Settings’ten dilleri
          ayarla.
        </p>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => void router.push('/admin/site-settings')}
        >
          Site Ayarlarına git
        </button>
      </div>
    );
  }

  if (!isCreateMode && productError && !loading && !product) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Ürün bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu id için kayıtlı bir ürün yok: <code className="ms-1">{idOrSlug}</code>
        </p>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCancel}>
          Listeye dön
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">{pageTitle}</h4>
        <p className="text-muted small mb-0">
          Ürün temel bilgilerini, fiyat, stok ve SEO alanlarını buradan yönetebilirsin. Dil seçimi
          DB’den gelir.
        </p>
      </div>

      <ProductsForm
        mode={isCreateMode ? 'create' : 'edit'}
        initialData={!isCreateMode && product ? product : undefined}
        loading={loading}
        saving={saving}
        locales={localeOptions}
        localesLoading={localesLoading || localesFetching}
        defaultLocale={queryLocale}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onLocaleChange={(nextLocale) => setActiveLocale(localeShortClient(nextLocale) || apiLocale)}
      />
    </div>
  );
};

export default AdminProductDetailPage;
