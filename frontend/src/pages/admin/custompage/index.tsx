// =============================================================
// FILE: src/pages/admin/custompage/index.tsx
// Ensotek – Admin Custom Pages Liste Sayfası
// =============================================================

import React, { useMemo, useState } from "react";
import type { NextPage } from "next";
import {
  CustomPageHeader,
  type CustomPageFilters,
  type LocaleOption,
} from "@/components/admin/custompage/CustomPageHeader";
import { CustomPageList } from "@/components/admin/custompage/CustomPageList";
import { useListCustomPagesAdminQuery } from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type {
  CustomPageListAdminQueryParams,
  BoolLike,
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
      limit: 50,
      offset: 0,
    };
  }, [filters]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListCustomPagesAdminQuery(queryParams);

  const loading = isLoading || isFetching;
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;

  return (
    <div className="container-fluid py-3">
      {/* Basit başlık – global admin layout varsa oraya uyarlanabilir */}
      <div className="mb-3">
        <h4 className="h5 mb-1">Özel Sayfalar Yönetimi</h4>
        <p className="text-muted small mb-0">
          Blog, haber, hakkında ve benzeri içerik sayfalarını görüntüle,
          filtrele ve yönet.
        </p>
      </div>

      <CustomPageHeader
        filters={filters}
        total={total}
        onFiltersChange={setFilters}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
      />

      <CustomPageList items={items} loading={loading} />
    </div>
  );
};

export default AdminCustomPageIndex;
