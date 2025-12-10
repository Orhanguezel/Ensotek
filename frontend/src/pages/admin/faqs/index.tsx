// =============================================================
// FILE: src/pages/admin/faqs/index.tsx
// Ensotek – Admin FAQ Sayfası (Liste + filtreler)
// CustomPage pattern'ine göre kategori gösterimi
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListFaqsAdminQuery,
  useUpdateFaqAdminMutation,
  useDeleteFaqAdminMutation,
} from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import { useListCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSubCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

import type {
  FaqDto,
  FaqListQueryParams,
} from "@/integrations/types/faqs.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import type { SubCategoryDto } from "@/integrations/types/subcategory.types";

import {
  FaqsHeader,
  type LocaleOption,
} from "@/components/admin/faqs/FaqsHeader";
import { FaqsList } from "@/components/admin/faqs/FaqsList";

/* Param type'ı locale ile genişletiyoruz (BE için ekstra param sorun değil) */
type FaqListQueryWithLocale = FaqListQueryParams & {
  locale?: string;
};

/** SSS modülü için kategori module_key */
const FAQ_CATEGORY_MODULE_KEY = "faq"; // BE'de farklıysa buna göre düzelt

/* ------------------------------------------------------------- */

const FaqsAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const [orderBy, setOrderBy] =
    useState<"created_at" | "updated_at" | "display_order">(
      "display_order",
    );
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  // Dil filtresi – "" = tüm diller
  const [locale, setLocale] = useState<string>("");

  // Kategori / alt kategori filtreleri (ID bazlı)
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");

  /* -------------------- Locale options (site_settings.app_locales) -------------------- */

  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

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

    const uniqLower = Array.from(
      new Set(arr.map((x) => String(x).toLowerCase())),
    );
    return uniqLower;
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

  const handleLocaleChange = (next: string) => {
    const normalized = next ? next.trim().toLowerCase() : "";
    setLocale(normalized);
  };

  /* -------------------- Kategori / Alt kategori listeleri (header filtreleri için) -------------------- */

  const { data: categoryRows } = useListCategoriesAdminQuery(undefined);
  const { data: subCategoryRows } =
    useListSubCategoriesAdminQuery(undefined);

  // 1) Sadece SSS modülüne ait kategoriler
  const faqCategoryRows = useMemo(
    () =>
      (categoryRows ?? []).filter((c: CategoryDto) => {
        const cEx = c as CategoryDto & { module_key?: string };
        return cEx.module_key === FAQ_CATEGORY_MODULE_KEY;
      }),
    [categoryRows],
  );

  const faqCategoryIds = useMemo(
    () => faqCategoryRows.map((c) => c.id),
    [faqCategoryRows],
  );

  // 2) Bu kategorilere bağlı alt kategoriler
  const faqSubCategoryRows = useMemo(
    () =>
      (subCategoryRows ?? []).filter((s: SubCategoryDto) =>
        faqCategoryIds.includes(s.category_id),
      ),
    [subCategoryRows, faqCategoryIds],
  );

  // 3) Header select için options (label = name || slug || id)
  const categoryOptions = useMemo(
    () =>
      faqCategoryRows.map((c: CategoryDto) => {
        const cEx = c as CategoryDto & {
          name?: string;
          slug?: string;
        };
        const label = cEx.name ?? cEx.slug ?? c.id;
        return { value: c.id, label };
      }),
    [faqCategoryRows],
  );

  const subCategoryOptions = useMemo(
    () =>
      faqSubCategoryRows.map((s: SubCategoryDto) => {
        const sEx = s as SubCategoryDto & {
          name?: string;
          slug?: string;
        };
        const label = sEx.name ?? sEx.slug ?? s.id;
        return { value: s.id, label };
      }),
    [faqSubCategoryRows],
  );

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<FaqListQueryWithLocale>(
    () => ({
      // arama
      q: search || undefined,

      // filtreler
      is_active: showOnlyActive ? "1" : undefined,

      // kategori filtreleri – ID bazlı
      category_id: categoryId || undefined,
      sub_category_id: subCategoryId || undefined,

      // sıralama
      sort: orderBy,
      orderDir,

      // pagination
      limit: 200,
      offset: 0,

      // locale (opsiyonel)
      locale: locale || undefined,
    }),
    [
      search,
      showOnlyActive,
      orderBy,
      orderDir,
      categoryId,
      subCategoryId,
      locale,
    ],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListFaqsAdminQuery(listParams);

  const [rows, setRows] = useState<FaqDto[]>([]);

  useEffect(() => {
    setRows(listData ?? []);
  }, [listData]);

  const [updateFaq, { isLoading: isUpdating }] =
    useUpdateFaqAdminMutation();
  const [deleteFaq, { isLoading: isDeleting }] =
    useDeleteFaqAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting;

  /* -------------------- Handlers ----------------------------- */

  const handleCreateClick = () => {
    router.push("/admin/faqs/new");
  };

  const handleEditRow = (item: FaqDto) => {
    router.push(`/admin/faqs/${item.id}`);
  };

  const handleDelete = async (item: FaqDto) => {
    if (
      !window.confirm(
        `"${item.question || item.slug || item.id}" kayıtlı içeriği silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteFaq(item.id).unwrap();
      toast.success(
        `"${item.question || item.slug || item.id}" silindi.`,
      );
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kayıt silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (item: FaqDto, value: boolean) => {
    try {
      await updateFaq({
        id: item.id,
        patch: { is_active: value ? "1" : "0" },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_active: value ? 1 : 0 } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Aktiflik durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <FaqsHeader
        search={search}
        onSearchChange={setSearch}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        categoryId={categoryId}
        onCategoryIdChange={setCategoryId}
        subCategoryId={subCategoryId}
        onSubCategoryIdChange={setSubCategoryId}
        categoryOptions={categoryOptions}
        subCategoryOptions={subCategoryOptions}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        orderBy={orderBy}
        orderDir={orderDir}
        onOrderByChange={setOrderBy}
        onOrderDirChange={setOrderDir}
        loading={busy}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <div className="row">
        <div className="col-12">
          <FaqsList
            items={rows}
            loading={busy}
            onEdit={handleEditRow}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>
    </div>
  );
};

export default FaqsAdminPage;
