// =============================================================
// FILE: src/pages/admin/custompage/index.tsx
// Ensotek – Admin Custom Pages Liste + Filtre + Reorder
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { toast } from "sonner";

import {
  CustomPageHeader,
  type CustomPageFilters,
  type LocaleOption,
} from "@/components/admin/custompage/CustomPageHeader";
import { CustomPageList } from "@/components/admin/custompage/CustomPageList";
import {
  useListCustomPagesAdminQuery,
  useReorderCustomPagesAdminMutation,
} from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type {
  CustomPageListAdminQueryParams,
  BoolLike,
  CustomPageDto,
} from "@/integrations/types/custom_pages.types";

const mapPublishedFilterToBoolLike = (
  f: CustomPageFilters["publishedFilter"],
): BoolLike | undefined => {
  if (f === "all") return undefined;
  if (f === "published") return 1;
  return 0; // draft
};

const AdminCustomPageIndex: NextPage = () => {
  const [filters, setFilters] = useState<CustomPageFilters>({
    search: "",
    moduleKey: "",
    publishedFilter: "all",
    locale: "",
  });

  /* --------- Locale options – site_settings.app_locales üzerinden --------- */

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

  /* -------------------- Liste sorgu parametreleri -------------------- */

  const queryParams: CustomPageListAdminQueryParams = useMemo(() => {
    const is_published = mapPublishedFilterToBoolLike(
      filters.publishedFilter,
    );

    return {
      q: filters.search || undefined,
      module_key: filters.moduleKey || undefined,
      locale: filters.locale || undefined,
      is_published,
      limit: 200,
      offset: 0,
    };
  }, [filters]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListCustomPagesAdminQuery(queryParams);

  // API'den gelen items'i stabil tutmak için useMemo
  const items: CustomPageDto[] = useMemo(
    () => data?.items ?? [],
    [data],
  );
  const total = data?.total ?? items.length;

  // Drag & drop için lokal sıralama state'i
  const [rows, setRows] = useState<CustomPageDto[]>([]);

  useEffect(() => {
    setRows(items);
  }, [items]);

  const [reorderCustomPages, { isLoading: isReordering }] =
    useReorderCustomPagesAdminMutation();

  const loading = isLoading || isFetching || isLocalesLoading || isReordering;

  const handleFiltersChange = (next: CustomPageFilters) => {
    setFilters(next);
  };

  /* -------------------- Reorder handlers -------------------- */

  const handleReorderLocal = (next: CustomPageDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const itemsPayload = rows.map((p, index) => ({
        id: p.id,
        display_order: index,
      }));

      await reorderCustomPages({ items: itemsPayload }).unwrap();
      toast.success("Sayfa sıralaması kaydedildi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Sıralama kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* Basit başlık – global admin layout varsa oraya uyarlanabilir */}
      <div className="mb-3">
        <h4 className="h5 mb-1">Özel Sayfalar Yönetimi</h4>
        <p className="text-muted small mb-0">
          Blog, haber, hakkında ve benzeri içerik sayfalarını görüntüle,
          filtrele, sırala ve yönet.
        </p>
      </div>

      <CustomPageHeader
        filters={filters}
        total={total}
        onFiltersChange={handleFiltersChange}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
      />

      <CustomPageList
        items={rows}
        loading={loading}
        onReorder={handleReorderLocal}
        onSaveOrder={handleSaveOrder}
        savingOrder={isReordering}
      />
    </div>
  );
};

export default AdminCustomPageIndex;
