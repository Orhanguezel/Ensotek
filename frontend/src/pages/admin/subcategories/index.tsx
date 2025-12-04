// =============================================================
// FILE: src/pages/admin/subcategories/index.tsx
// Ensotek – Admin Alt Kategoriler Sayfası (liste + filtre + reorder)
// Create/Edit artık ayrı form sayfalarında
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListSubCategoriesAdminQuery,
  useDeleteSubCategoryAdminMutation,
  useReorderSubCategoriesAdminMutation,
  useToggleSubCategoryActiveAdminMutation,
  useToggleSubCategoryFeaturedAdminMutation,
} from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

import {
  useListCategoriesAdminQuery,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type { SubCategoryDto } from "@/integrations/types/subcategory.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  CategoryOption,
} from "@/components/admin/subcategories/SubCategoriesHeader";
import { SubCategoriesHeader } from "@/components/admin/subcategories/SubCategoriesHeader";
import { SubCategoriesList } from "@/components/admin/subcategories/SubCategoriesList";

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const SubCategoriesAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // Liste + filtreler
  const {
    data: subCategories,
    isLoading,
    isFetching,
    refetch,
  } = useListSubCategoriesAdminQuery({
    q: search || undefined,
    locale: localeFilter || undefined,
    category_id: categoryFilter || undefined,
    is_active: showOnlyActive ? true : undefined,
    is_featured: showOnlyFeatured ? true : undefined,
  });

  // Drag & drop sıralama için lokal state
  const [rows, setRows] = useState<SubCategoryDto[]>([]);

  useEffect(() => {
    setRows(subCategories || []);
  }, [subCategories]);

  // app_locales kaydını (site_settings) üzerinden dilleri çek
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  // Kategori listesi (filter + list header için)
  const {
    data: categoryRows,
    isLoading: isCategoriesLoading,
  } = useListCategoriesAdminQuery({
    q: undefined,
    locale: localeFilter || undefined,
    module_key: undefined,
    is_active: undefined,
    is_featured: undefined,
  });

  // Mutations
  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryAdminMutation();
  const [reorderSubCategories, { isLoading: isReordering }] =
    useReorderSubCategoriesAdminMutation();
  const [toggleActive] = useToggleSubCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleSubCategoryFeaturedAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting || isReordering;

  /* -------------------- Locale options (DB'den) -------------------- */

  const localeCodes = useMemo(() => {
    if (!appLocaleRows || appLocaleRows.length === 0) {
      return ["tr", "en"];
    }
    const row = appLocaleRows.find((r) => r.key === "app_locales");
    const v = row?.value;

    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v.map((x) => String(x)).filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed.map((x) => String(x)).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    if (!arr.length) {
      return ["tr", "en"];
    }

    return Array.from(new Set(arr));
  }, [appLocaleRows]);

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      localeCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = `${code.toUpperCase()} (${lower})`;

        if (lower === "tr") label = "Türkçe (tr)";
        else if (lower === "en") label = "İngilizce (en)";
        else if (lower === "de") label = "Almanca (de)";

        return { value: lower, label };
      }),
    [localeCodes],
  );

  /* -------------------- Category options + map --------------------- */

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const base: CategoryOption[] = [
      { value: "", label: "Tüm Kategoriler" },
    ];

    if (!categoryRows || categoryRows.length === 0) return base;

    return [
      ...base,
      ...categoryRows.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.locale || "tr"})`,
      })),
    ];
  }, [categoryRows]);

  const categoriesMap: Record<string, CategoryDto | undefined> =
    useMemo(() => {
      const map: Record<string, CategoryDto> = {};
      (categoryRows ?? []).forEach((c) => {
        map[c.id] = c;
      });
      return map;
    }, [categoryRows]);

  /* -------------------- Create/Edit navigasyonu -------------------- */

  const openCreatePage = () => {
    router.push("/admin/subcategories/new");
  };

  const openEditPage = (item: SubCategoryDto) => {
    router.push(
      `/admin/subcategories/${encodeURIComponent(item.id)}`,
    );
  };

  /* -------------------- Silme / Toggle / Reorder -------------------- */

  const handleDelete = async (item: SubCategoryDto) => {
    if (
      !window.confirm(
        `"${item.name}" alt kategorisini silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteSubCategory(item.id).unwrap();
      toast.success(`"${item.name}" alt kategorisi silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Alt kategori silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (
    item: SubCategoryDto,
    value: boolean,
  ) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_active: value } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (
    item: SubCategoryDto,
    value: boolean,
  ) => {
    try {
      await toggleFeatured({
        id: item.id,
        is_featured: value,
      }).unwrap();
      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_featured: value } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Öne çıkarma durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleReorderLocal = (next: SubCategoryDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const items = rows.map((r, index) => ({
        id: r.id,
        display_order: index,
      }));

      await reorderSubCategories({ items }).unwrap();
      toast.success("Sıralama kaydedildi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Sıralama kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <SubCategoriesHeader
        search={search}
        onSearchChange={setSearch}
        locale={localeFilter}
        onLocaleChange={setLocaleFilter}
        categoryId={categoryFilter}
        onCategoryIdChange={setCategoryFilter}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
        loading={busy}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        categories={categoryOptions}
        categoriesLoading={isCategoriesLoading}
        onCreateClick={openCreatePage}
      />

      <div className="row">
        <div className="col-12">
          <SubCategoriesList
            items={rows}
            loading={busy}
            categoriesMap={categoriesMap}
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

export default SubCategoriesAdminPage;
