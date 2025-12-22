// =============================================================
// FILE: src/pages/admin/sparepart/[slug].tsx
// Ensotek – Admin Sparepart Create/Edit Page (id/slug bazlı)
// Locale: DB (app_locales + default_locale)
// URL: ?locale=... sync (stable)
// RTK: from "@/integrations/rtk/hooks"
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { ProductsForm, type ProductFormValues } from '@/components/admin/products/ProductsForm';

import {
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

const AdminProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug: slugParam } = router.query;
  const isRouterReady = router.isReady;

  const idOrSlug = useMemo(
    () => (isRouterReady && typeof slugParam === 'string' ? slugParam : undefined),
    [isRouterReady, slugParam],
  );

  const isCreateMode = idOrSlug === 'new';
  const shouldSkipQuery = !isRouterReady || isCreateMode || !idOrSlug;

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const localeSet = useMemo(
    () => new Set((localeOptions ?? []).map((x) => toShortLocale(x.value))),
    [localeOptions],
  );

  const initialLocale = useMemo(() => {
    const qLocale = toShortLocale(router.query?.locale);
    if (qLocale && localeSet.has(qLocale)) return qLocale;

    const dbDef = toShortLocale(defaultLocaleFromDb);
    if (dbDef && localeSet.has(dbDef)) return dbDef;

    const first = toShortLocale(localeOptions?.[0]?.value);
    return first || '';
  }, [router.query?.locale, defaultLocaleFromDb, localeOptions, localeSet]);

  const [activeLocale, setActiveLocale] = useState<string>('');

  // ✅ ilk kurulum + option değişince SADECE gerekli ise onar
  useEffect(() => {
    // localeOptions daha gelmediyse dokunma
    if (!localeOptions || localeOptions.length === 0) return;

    setActiveLocale((prev) => {
      const p = toShortLocale(prev);

      // zaten geçerli bir locale seçiliyse koru
      if (p && localeSet.has(p)) return p;

      // değilse initialLocale'e düş
      return initialLocale;
    });
  }, [localeOptions, localeSet, initialLocale]);

  // ✅ activeLocale -> URL sync (ekle/kaldır)
  useEffect(() => {
    if (!router.isReady) return;

    const next = toShortLocale(activeLocale);
    const cur = toShortLocale(router.query?.locale);

    // boşsa url'den kaldır
    if (!next) {
      if (cur) {
        const q = { ...router.query };
        delete (q as any).locale;
        void router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
      }
      return;
    }

    // aynıysa dokunma
    if (next === cur) return;

    void router.replace(
      { pathname: router.pathname, query: { ...router.query, locale: next } },
      undefined,
      { shallow: true },
    );
  }, [activeLocale, router]);

  const queryLocale = toShortLocale(activeLocale);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
    error: productError,
  } = useGetProductAdminQuery(
    { id: idOrSlug ?? '', locale: queryLocale },
    { skip: shouldSkipQuery || !queryLocale },
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductAdminMutation();

  const loading = isLoadingProduct || isFetchingProduct;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    void router.push({
      pathname: '/admin/products',
      query: queryLocale ? { locale: queryLocale } : undefined,
    });
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
      const loc = toShortLocale(values.locale || queryLocale);

      if (!loc || !localeSet.has(loc)) {
        toast.error('Geçerli bir locale seçilmedi. app_locales ve default_locale kontrol edin.');
        return;
      }

      const tags = parseCommaList(values.tags);
      const storageImageIds = parseCommaList(values.storage_image_ids);

      const commonPayload: Record<string, any> = {
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
        const createBody = { ...commonPayload, locale: loc };
        const created = await createProduct(createBody as any).unwrap();

        toast.success('Ürün başarıyla oluşturuldu.');

        const nextId = created.id;
        void router.replace({
          pathname: `/admin/products/${encodeURIComponent(nextId)}`,
          query: { locale: loc },
        });
      } else {
        if (!product) {
          toast.error('Ürün verisi yüklenemedi.');
          return;
        }

        await updateProduct({ id: product.id, patch: commonPayload as any }).unwrap();
        toast.success('Ürün güncellendi.');

        // form locale’i ile sayfa locale’i farklıysa (kullanıcı değiştirdiyse) state'i güncelle
        if (loc !== queryLocale) setActiveLocale(loc);
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || 'İşlem sırasında bir hata oluştu.');
    }
  };

  const pageTitle = isCreateMode ? 'Yeni Ürün Oluştur' : product?.title || 'Ürün Düzenle';

  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  // app_locales yoksa net uyarı
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
          DB’den gelir ve URL ile senkron çalışır.
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
        onLocaleChange={(nextLocale) => setActiveLocale(toShortLocale(nextLocale))}
      />
    </div>
  );
};

export default AdminProductDetailPage;
