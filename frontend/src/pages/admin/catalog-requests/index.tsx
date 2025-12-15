// =============================================================
// FILE: src/pages/admin/catalog-requests/index.tsx
// Ensotek – Admin Catalog Requests List Page (Bootstrap pattern)
// =============================================================

"use client";

import React, { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  CatalogRequestsHeader,
  type CatalogFilters,
  type LocaleOption,
} from "@/components/admin/catalog/CatalogRequestsHeader";
import { CatalogRequestsList } from "@/components/admin/catalog/CatalogRequestsList";

import {
  useListCatalogRequestsAdminQuery,
  useRemoveCatalogRequestAdminMutation,
} from "@/integrations/rtk/endpoints/admin/catalog_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type {
  CatalogRequestDto,
  CatalogRequestListQueryParams,
  CatalogRequestStatus,
} from "@/integrations/types/catalog.types";

/* -------------------- Status guard -------------------- */

const CATALOG_STATUSES: CatalogRequestStatus[] = [
  "new",
  "sent",
  "failed",
  "archived",
];

const isCatalogStatus = (v: unknown): v is CatalogRequestStatus =>
  typeof v === "string" && (CATALOG_STATUSES as string[]).includes(v);

/* -------------------- Locale options (DB'den) -------------------- */

const useLocaleOptions = (): {
  locales: LocaleOption[];
  loading: boolean;
} => {
  const { data: appLocaleRows, isLoading } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const localeCodes = useMemo(() => {
    if (!appLocaleRows || appLocaleRows.length === 0) {
      return ["tr", "en"];
    }

    const row = appLocaleRows.find((r: any) => r.key === "app_locales");
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

    if (!arr.length) return ["tr", "en"];
    return Array.from(new Set(arr.map((x) => x.toLowerCase())));
  }, [appLocaleRows]);

  const locales = useMemo<LocaleOption[]>(
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

  return { locales, loading: isLoading };
};

const AdminCatalogRequestsIndexPage: NextPage = () => {
  const router = useRouter();
  const { locales, loading: localesLoading } = useLocaleOptions();

  const [filters, setFilters] = useState<CatalogFilters>({
    search: "",
    status: "",
    locale: "",
  });

  const queryParams = useMemo<CatalogRequestListQueryParams>(() => {
    const status =
      filters.status && isCatalogStatus(filters.status)
        ? filters.status
        : undefined;

    return {
      q: filters.search || undefined,
      status,
      locale: filters.locale || undefined,
      limit: 50,
      offset: 0,
      sort: "created_at",
      orderDir: "desc",
    };
  }, [filters]);

  const { data, isLoading, isFetching, refetch } =
    useListCatalogRequestsAdminQuery(queryParams);

  const [removeReq, { isLoading: isDeleting }] =
    useRemoveCatalogRequestAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting;

  const items: CatalogRequestDto[] = data ?? [];
  const total = items.length;

  const handleDelete = async (r: CatalogRequestDto) => {
    try {
      await removeReq({ id: r.id }).unwrap();
      toast.success("Talep silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Silme sırasında hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-3">
      <CatalogRequestsHeader
        filters={filters}
        total={total}
        loading={busy}
        locales={locales}
        localesLoading={localesLoading}
        defaultLocale={router.locale}
        onFiltersChange={setFilters}
        onRefresh={refetch}
      />

      <CatalogRequestsList
        items={items}
        loading={busy}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminCatalogRequestsIndexPage;
