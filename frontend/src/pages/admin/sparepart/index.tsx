// =============================================================
// FILE: src/pages/admin/sparepart/index.tsx
// Ensotek – Admin Sparepart List (module_key=sparepart)
// Admin rule: locale URL'e yazılmaz (NO URL sync)
// Data: same products endpoints, different module_key
// HARD FIX:
// - send module_key + item_type
// - client-side filter (safety) to avoid showing products if backend ignores module_key
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

const MODULE_KEY = 'sparepart';
const ITEM_TYPE = 'sparepart';

function isSparepartRow(p: any): boolean {
  // backend doğru dönüyorsa item_type ile zaten ayrışır
  const it = String(p?.item_type || '')
    .trim()
    .toLowerCase();
  if (it === 'sparepart') return true;

  // ekstra güvenlik: product_code "SP-" veya tags içinde sparepart
  const code = String(p?.product_code || '')
    .trim()
    .toUpperCase();
  if (code.startsWith('SP-')) return true;

  const tags = p?.tags;
  if (Array.isArray(tags)) {
    if (tags.map((t: any) => String(t).toLowerCase()).includes('sparepart')) return true;
  }
  if (typeof tags === 'string') {
    const s = tags.toLowerCase();
    if (s.includes('sparepart')) return true;
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        if (parsed.map((t: any) => String(t).toLowerCase()).includes('sparepart')) return true;
      }
    } catch {
      // ignore
    }
  }

  return false;
}

const AdminSparepartIndexPage: NextPage = () => {
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
    locale: '',
    isActiveFilter: 'all',
  });

  const effectiveLocale = useMemo(() => {
    const picked = localeShortClient(filters.locale);
    return picked || apiLocale;
  }, [filters.locale, apiLocale]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      module_key: MODULE_KEY,
      item_type: ITEM_TYPE, // ✅ backend module_key okumazsa bile genelde item_type okur
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

  const rawItems: ProductDto[] = useMemo(() => (list?.items ?? []) as ProductDto[], [list?.items]);

  // ✅ safety filter: backend karışık döndürse bile sparepart dışında göstermeyiz
  const items: ProductDto[] = useMemo(() => {
    return rawItems.filter((p: any) => isSparepartRow(p));
  }, [rawItems]);

  const [orderedItems, setOrderedItems] = useState<ProductDto[]>([]);
  useEffect(() => setOrderedItems(items), [items]);

  const total = orderedItems.length;

  const busy = isLoading || isFetching || isDeleting || localesLoading || localesFetching;

  const handleDelete = async (p: ProductDto) => {
    try {
      await deleteProduct({ id: p.id }).unwrap();
      toast.success('Yedek parça başarıyla silindi.');
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || 'Silinirken bir hata oluştu.');
    }
  };

  const handleCreateClick = () => {
    void router.push('/admin/sparepart/new');
  };

  const handleSaveOrder = async () => {
    if (!orderedItems.length) return;
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
        basePath="/admin/sparepart"
        title="Yedek Parça Listesi"
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

export default AdminSparepartIndexPage;
