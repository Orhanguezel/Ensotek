// =============================================================
// FILE: src/pages/admin/categories/index.tsx
// Ensotek – Admin Kategoriler Sayfası (liste + filtre + reorder)
// Create/Edit artık ayrı form sayfalarında
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import {
  useListCategoriesAdminQuery,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
} from '@/integrations/rtk/hooks';

import type { CategoryDto } from '@/integrations/types';
import type { LocaleOption, ModuleOption } from '@/components/admin/categories/CategoriesHeader';
import { CategoriesHeader } from '@/components/admin/categories/CategoriesHeader';
import { CategoriesList } from '@/components/admin/categories/CategoriesList';

import { useAdminLocales } from '@/components/common/useAdminLocales';

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const CategoriesAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [localeFilter, setLocaleFilter] = useState<string>(''); // "" => all locales
  const [moduleFilter, setModuleFilter] = useState<string>(''); // "" => all modules
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // ✅ Locales: DB single source
  const { localeOptions: dbLocaleOptions, loading: isLocalesLoading } = useAdminLocales();

  // Liste + filtreler
  const {
    data: categories,
    isLoading,
    isFetching,
    refetch,
  } = useListCategoriesAdminQuery({
    q: search || undefined,
    locale: localeFilter || undefined,
    module_key: moduleFilter || undefined,
    is_active: showOnlyActive ? true : undefined,
    is_featured: showOnlyFeatured ? true : undefined,
  });

  // Sıralama için lokal state (drag & drop)
  const [rows, setRows] = useState<CategoryDto[]>([]);

  useEffect(() => {
    setRows(categories || []);
  }, [categories]);

  // Mutations
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryAdminMutation();
  const [reorderCategories, { isLoading: isReordering }] = useReorderCategoriesAdminMutation();
  const [toggleActive] = useToggleCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleCategoryFeaturedAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting || isReordering;

  /* -------------------- Locale options (DB'den) -------------------- */

  const localeOptions: LocaleOption[] = useMemo(() => {
    // header tarafında "" seçeneği gerekiyorsa burada ekle
    const allOption: LocaleOption = { value: '', label: 'Tüm Diller' };

    const opts: LocaleOption[] = (dbLocaleOptions ?? []).map((x) => ({
      value: x.value,
      label: x.label,
    }));

    return [allOption, ...opts];
  }, [dbLocaleOptions]);

  /* -------------------- Module options (dinamik) -------------------- */

  const moduleCodes = useMemo(() => {
    const set = new Set<string>();

    (categories ?? []).forEach((c) => {
      if (c.module_key) set.add(String(c.module_key));
    });

    return Array.from(set).sort();
  }, [categories]);

  const moduleOptions: ModuleOption[] = useMemo(
    () => [
      { value: '', label: 'Tüm Modüller' },
      ...moduleCodes.map((code) => ({ value: code, label: code })),
    ],
    [moduleCodes],
  );

  /* -------------------- Create/Edit navigasyonu -------------------- */

  const openCreatePage = () => {
    router.push('/admin/categories/new');
  };

  const openEditPage = (item: CategoryDto) => {
    router.push(`/admin/categories/${encodeURIComponent(item.id)}`);
  };

  /* -------------------- Silme / Toggle / Reorder -------------------- */

  const handleDelete = async (item: CategoryDto) => {
    if (
      !window.confirm(`"${item.name}" kategorisini silmek üzeresin. Devam etmek istiyor musun?`)
    ) {
      return;
    }

    try {
      await deleteCategory(item.id).unwrap();
      toast.success(`"${item.name}" kategorisi silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Kategori silinirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleToggleActive = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
      setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, is_active: value } : r)));
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Aktif durumu güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleFeatured({ id: item.id, is_featured: value }).unwrap();
      setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, is_featured: value } : r)));
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        'Öne çıkarma durumu güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleReorderLocal = (next: CategoryDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const items = rows.map((r, index) => ({ id: r.id, display_order: index }));
      await reorderCategories({ items }).unwrap();
      toast.success('Sıralama kaydedildi.');
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Sıralama kaydedilirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <CategoriesHeader
        search={search}
        onSearchChange={setSearch}
        locale={localeFilter}
        onLocaleChange={setLocaleFilter}
        moduleKey={moduleFilter}
        onModuleKeyChange={setModuleFilter}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
        loading={busy}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        modules={moduleOptions}
        onCreateClick={openCreatePage}
      />

      <div className="row">
        <div className="col-12">
          <CategoriesList
            items={rows}
            loading={busy}
            onEdit={openEditPage}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleFeatured={handleToggleFeatured}
            onReorder={handleReorderLocal}
            onSaveOrder={handleSaveOrder}
            savingOrder={isReordering}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesAdminPage;
