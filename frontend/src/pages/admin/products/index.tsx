// =============================================================
// FILE: src/pages/admin/products/index.tsx
// Ensotek – Admin Products List (Sparepart HARİÇ)
// FIX:
// - locale pattern aynı
// - sparepart filtre statik ID değil; categories + subcategories ile dinamik
// - response shape: array OR {items: []} normalize
// - root bulunamazsa: filtre uygulama (yanlış gizleme yapma)
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { ProductsHeader, type ProductFilters } from '@/components/admin/products/ProductsHeader';
import { ProductsList } from '@/components/admin/products/ProductsList';

import type { ProductDto } from '@/integrations/types/product.types';
import type { AdminProductListResponse } from '@/integrations/types/product_admin.types';
import type { CategoryDto } from '@/integrations/types/category.types';
import type { SubCategoryDto } from '@/integrations/types/subcategory.types';

import {
  useListProductsAdminQuery,
  useDeleteProductAdminMutation,
  useListCategoriesAdminQuery,
  useListSubCategoriesAdminQuery,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

const normText = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase();

const getId = (v: any): string => String(v?.id || '').trim();
const getParentId = (v: any): string => String(v?.parent_id || v?.parentId || '').trim();
const getCategoryIdFromSub = (v: any): string =>
  String(v?.category_id || v?.categoryId || '').trim();

function catHaystack(cat: CategoryDto): string {
  const c: any = cat as any;
  const slug = normText(c?.slug);
  const name = normText(c?.name ?? c?.title);
  const code = normText(c?.code);
  const key = normText(c?.key);
  return `${slug} ${name} ${code} ${key}`.trim();
}

function subHaystack(sub: SubCategoryDto): string {
  const s: any = sub as any;
  const slug = normText(s?.slug);
  const name = normText(s?.name ?? s?.title);
  const code = normText(s?.code);
  const key = normText(s?.key);
  return `${slug} ${name} ${code} ${key}`.trim();
}

function isSparepartLikeText(hay: string): boolean {
  const h = normText(hay);
  return (
    h.includes('sparepart') ||
    h.includes('spareparts') ||
    h.includes('spare part') ||
    h.includes('spare parts') ||
    h.includes('yedek') ||
    h.includes('yedek parça') ||
    h.includes('yedek parca')
  );
}

const AdminProductsIndexPage: NextPage = () => {
  const router = useRouter();

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const uiLocale = useMemo(() => toShortLocale((router as any).locale), [router]);

  const initialLocaleFromUrl = useMemo(() => {
    if (!router.isReady) return '';
    const q = toShortLocale(router.query?.locale);
    if (!q) return '';
    const exists = localeOptions.some((x) => x.value === q);
    return exists ? q : '';
  }, [router.isReady, router.query?.locale, localeOptions]);

  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    locale: '',
    isActiveFilter: 'all',
  });

  useEffect(() => {
    if (!router.isReady) return;
    setFilters((prev) => ({ ...prev, locale: initialLocaleFromUrl }));
  }, [router.isReady, initialLocaleFromUrl]);

  useEffect(() => {
    if (!router.isReady) return;

    const cur = toShortLocale(router.query?.locale);
    const next = toShortLocale(filters.locale);

    if (!next && cur) {
      const q = { ...router.query };
      delete (q as any).locale;
      void router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
      return;
    }

    if (next && next !== cur) {
      void router.replace(
        { pathname: router.pathname, query: { ...router.query, locale: next } },
        undefined,
        { shallow: true },
      );
    }
  }, [filters.locale, router]);

  const apiLocale = useMemo(() => {
    const f = toShortLocale(filters.locale);
    if (f && localeOptions.some((x) => x.value === f)) return f;

    const u = toShortLocale(uiLocale);
    if (u && localeOptions.some((x) => x.value === u)) return u;

    const d = toShortLocale(defaultLocaleFromDb);
    if (d && localeOptions.some((x) => x.value === d)) return d;

    return localeOptions?.[0]?.value || 'de';
  }, [filters.locale, uiLocale, defaultLocaleFromDb, localeOptions]);

  // ------------------------------
  // Categories + SubCategories
  // ------------------------------
  const {
    data: catsRaw,
    isLoading: catsLoading,
    isFetching: catsFetching,
  } = useListCategoriesAdminQuery(
    { locale: apiLocale } as any,
    {
      refetchOnMountOrArgChange: true,
    } as any,
  );

  const {
    data: subsRaw,
    isLoading: subsLoading,
    isFetching: subsFetching,
  } = useListSubCategoriesAdminQuery(
    { locale: apiLocale } as any,
    {
      refetchOnMountOrArgChange: true,
    } as any,
  );

  const categories: CategoryDto[] = useMemo(() => {
    if (Array.isArray(catsRaw)) return catsRaw as CategoryDto[];
    const anyRaw: any = catsRaw as any;
    if (anyRaw && Array.isArray(anyRaw.items)) return anyRaw.items as CategoryDto[];
    return [];
  }, [catsRaw]);

  const subCategories: SubCategoryDto[] = useMemo(() => {
    if (Array.isArray(subsRaw)) return subsRaw as SubCategoryDto[];
    const anyRaw: any = subsRaw as any;
    if (anyRaw && Array.isArray(anyRaw.items)) return anyRaw.items as SubCategoryDto[];
    return [];
  }, [subsRaw]);

  // sparepart setleri (root + 1 seviye child + bağlı subs)
  const { spareCategoryIds, spareSubCategoryIds } = useMemo(() => {
    const spareCategoryIds = new Set<string>();
    const spareSubCategoryIds = new Set<string>();

    // 1) root category
    const root = categories.find((c) => isSparepartLikeText(catHaystack(c)));
    const rootId = root ? getId(root) : '';

    if (rootId) {
      spareCategoryIds.add(rootId);

      // root + 1-level children
      for (const c of categories) {
        const pid = getParentId(c as any);
        if (pid === rootId) {
          const id = getId(c);
          if (id) spareCategoryIds.add(id);
        }
      }
    } else {
      // 2) kategori yoksa subcategory text üzerinden kategori seti türet
      const hitSubs = subCategories.filter((s) => isSparepartLikeText(subHaystack(s)));
      for (const sc of hitSubs) {
        const catId = getCategoryIdFromSub(sc as any);
        if (catId) spareCategoryIds.add(catId);
        const subId = getId(sc as any);
        if (subId) spareSubCategoryIds.add(subId);
      }
    }

    // 3) kategori setine bağlı subcategory’leri topla
    if (spareCategoryIds.size) {
      for (const sc of subCategories) {
        const catId = getCategoryIdFromSub(sc as any);
        const subId = getId(sc as any);
        if (!subId) continue;
        if (catId && spareCategoryIds.has(catId)) spareSubCategoryIds.add(subId);
      }
    }

    return { spareCategoryIds, spareSubCategoryIds };
  }, [categories, subCategories]);

  // ------------------------------
  // Products query
  // ------------------------------
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      q: filters.search || undefined,
      limit: 50,
      offset: 0,
      locale: apiLocale,
    };

    if (filters.isActiveFilter === 'active') params.is_active = 1;
    if (filters.isActiveFilter === 'inactive') params.is_active = 0;

    return params;
  }, [filters.search, filters.isActiveFilter, apiLocale]);

  const { data, isLoading, isFetching, refetch } = useListProductsAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductAdminMutation();

  const list = data as AdminProductListResponse | undefined;

  // ✅ Products: sparepart hariç
  const baseItems: ProductDto[] = useMemo(() => {
    const items = (list?.items ?? []) as ProductDto[];

    // root bulunamazsa filtre uygulama (yanlış saklama riskini sıfırla)
    if (!spareCategoryIds.size && !spareSubCategoryIds.size) return items;

    return items.filter((p: any) => {
      const catId = String(p?.category_id || '').trim();
      const subId = String(p?.sub_category_id || '').trim();

      if (catId && spareCategoryIds.has(catId)) return false;
      if (subId && spareSubCategoryIds.has(subId)) return false;
      return true;
    });
  }, [list, spareCategoryIds, spareSubCategoryIds]);

  const [orderedItems, setOrderedItems] = useState<ProductDto[]>([]);
  useEffect(() => setOrderedItems(baseItems), [baseItems]);

  const total = orderedItems.length;

  const busy =
    isLoading ||
    isFetching ||
    isDeleting ||
    localesLoading ||
    localesFetching ||
    catsLoading ||
    catsFetching ||
    subsLoading ||
    subsFetching;

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
    void router.push({
      pathname: '/admin/products/new',
      query: apiLocale ? { locale: apiLocale } : undefined,
    });
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
        activeLocale={apiLocale}
      />
    </div>
  );
};

export default AdminProductsIndexPage;
