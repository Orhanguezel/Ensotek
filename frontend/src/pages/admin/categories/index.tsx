// =============================================================
// FILE: src/pages/admin/categories/index.tsx
// Ensotek – Admin Kategoriler Sayfası (liste + filtre + reorder)
// Create/Edit artık ayrı form sayfalarında
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListCategoriesAdminQuery,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  ModuleOption,
} from "@/components/admin/categories/CategoriesHeader";
import { CategoriesHeader } from "@/components/admin/categories/CategoriesHeader";
import { CategoriesList } from "@/components/admin/categories/CategoriesList";

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const CategoriesAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

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

  // app_locales kaydını (site_settings) üzerinden dilleri çek
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  // Mutations
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryAdminMutation();
  const [reorderCategories, { isLoading: isReordering }] =
    useReorderCategoriesAdminMutation();
  const [toggleActive] = useToggleCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleCategoryFeaturedAdminMutation();

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

  /* -------------------- Module options (DB'den dinamik) -------------------- */

  const moduleCodes = useMemo(() => {
    const set = new Set<string>();

    // API'den gelen tüm kategorilerdeki module_key'leri topla
    (categories ?? []).forEach((c) => {
      if (c.module_key) {
        set.add(String(c.module_key));
      }
    });

    // Hiç kayıt yoksa fallback (boş sistemde bile en azından bunlar görünsün)
    if (!set.size) {
      [
        "about",
        "product",
        "services",
        "sparepart",
        "news",
        "library",
        "references",
      ].forEach((m) => set.add(m));
    }

    return Array.from(set);
  }, [categories]);

  const moduleOptions: ModuleOption[] = useMemo(
    () => [
      { value: "", label: "Tüm Modüller" },
      ...moduleCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = code;

        if (lower === "about") label = "Hakkımızda";
        else if (lower === "product") label = "Ürünler";
        else if (lower === "services") label = "Hizmetler";
        else if (lower === "sparepart") label = "Yedek Parça";
        else if (lower === "news") label = "Haberler";
        else if (lower === "library") label = "Kütüphane";
        else if (lower === "references") label = "Referanslar";

        return { value: code, label };
      }),
    ],
    [moduleCodes],
  );

  /* -------------------- Create/Edit navigasyonu -------------------- */

  const openCreatePage = () => {
    router.push("/admin/categories/new");
  };

  const openEditPage = (item: CategoryDto) => {
    router.push(`/admin/categories/${encodeURIComponent(item.id)}`);
  };

  /* -------------------- Silme / Toggle / Reorder -------------------- */

  const handleDelete = async (item: CategoryDto) => {
    if (
      !window.confirm(
        `"${item.name}" kategorisini silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteCategory(item.id).unwrap();
      toast.success(`"${item.name}" kategorisi silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kategori silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
      // Lokal state'i de güncelle
      setRows((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, is_active: value } : r)),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (item: CategoryDto, value: boolean) => {
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

  const handleReorderLocal = (next: CategoryDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const items = rows.map((r, index) => ({
        id: r.id,
        display_order: index,
      }));

      await reorderCategories({ items }).unwrap();
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
