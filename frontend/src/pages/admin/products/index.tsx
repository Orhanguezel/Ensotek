// =============================================================
// FILE: src/pages/admin/products/index.tsx
// Ensotek – Admin Products List (module_key=product)
// Admin rule: locale URL'e yazılmaz (NO URL sync)
// NOT: Sparepart hariçleme artık kategori/subcategory ile değil; module_key ile
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { ProductsHeader, type ProductFilters } from '@/components/admin/products/ProductsHeader';
import { ProductsList } from '@/components/admin/products/ProductsList';

import type { ProductDto } from '@/integrations/types/product.types';
import type { AdminProductListResponse } from '@/integrations/types/product_admin.types';

import { useListProductsAdminQuery, useDeleteProductAdminMutation } from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';
import { resolveAdminApiLocale } from '@/i18n/adminLocale';
import { localeShortClient } from '@/i18n/localeShortClient';

const MODULE_KEY = 'product';

const AdminProductsIndexPage: NextPage = () => {
  const router = useRouter();

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const apiLocale = useMemo(
    () => resolveAdminApiLocale(localeOptions as any, defaultLocaleFromDb, 'de'),
    [localeOptions, defaultLocaleFromDb],
  );

  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    locale: '', // UI seçimi olabilir; URL sync yok
    isActiveFilter: 'all',
  });

  const effectiveLocale = useMemo(() => {
    const picked = localeShortClient(filters.locale);
    if (picked) return picked;
    return apiLocale;
  }, [filters.locale, apiLocale]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      module_key: MODULE_KEY,
      q: filters.search || undefined,
      limit: 50,
      offset: 0,
      locale: effectiveLocale,
    };

    if (filters.isActiveFilter === 'active') params.is_active = 1;
    if (filters.isActiveFilter === 'inactive') params.is_active = 0;

    return params;
  }, [filters.search, filters.isActiveFilter, effectiveLocale]);

  const { data, isLoading, isFetching, refetch } = useListProductsAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductAdminMutation();

  const list = data as AdminProductListResponse | undefined;

  const items: ProductDto[] = useMemo(() => (list?.items ?? []) as ProductDto[], [list?.items]);

  const [orderedItems, setOrderedItems] = useState<ProductDto[]>([]);
  useEffect(() => setOrderedItems(items), [items]);

  const total = orderedItems.length;

  const busy = isLoading || isFetching || isDeleting || localesLoading || localesFetching;

  const handleDelete = async (p: ProductDto) => {
    try {
      await deleteProduct({ id: p.id }).unwrap();
      toast.success('Ürün başarıyla silindi.');
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || 'Ürün silinirken bir hata oluştu.');
    }
  };

  const handleCreateClick = () => {
    void router.push('/admin/products/new');
  };

  const handleSaveOrder = async () => {
    if (!orderedItems.length) return;

    console.log(
      'Yeni sıralama:',
      orderedItems.map((p, index) => ({ index: index + 1, id: p.id })),
    );

    toast.info('Sıralama ekranda güncellendi.');
  };

  const isSavingOrder = false;

  return (
    <div className="container-fluid py-3">
      <ProductsHeader
        filters={filters}
        total={total}
        loading={busy}
        locales={localeOptions}
        localesLoading={localesLoading || localesFetching}
        defaultLocaleFromDb={defaultLocaleFromDb}
        onFiltersChange={setFilters}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <ProductsList
        items={orderedItems}
        loading={busy}
        onDelete={handleDelete}
        onReorder={setOrderedItems}
        onSaveOrder={handleSaveOrder}
        savingOrder={isSavingOrder}
        activeLocale={effectiveLocale}
      />
    </div>
  );
};

export default AdminProductsIndexPage;
