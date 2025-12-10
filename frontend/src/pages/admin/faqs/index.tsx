// =============================================================
// FILE: src/pages/admin/faqs/index.tsx
// Ensotek – Admin FAQ Sayfası (Liste + filtreler)
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

import type {
  FaqDto,
  FaqListQueryParams,
} from "@/integrations/types/faqs.types";

import {
  FaqsHeader,
  type LocaleOption,
  type FaqOrderField,
} from "@/components/admin/faqs/FaqsHeader";
import { FaqsList } from "@/components/admin/faqs/FaqsList";

/* Param type'ı locale ile genişletiyoruz (BE için ekstra param sorun değil) */
type FaqListQueryWithLocale = FaqListQueryParams & {
  locale?: string;
};

/* ------------------------------------------------------------- */

const FaqsAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const [orderBy, setOrderBy] =
    useState<FaqOrderField>("display_order");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  // Dil filtresi – "" = tüm diller
  const [locale, setLocale] = useState<string>("");

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

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<FaqListQueryWithLocale>(
    () => ({
      // arama
      q: search || undefined,

      // filtreler
      is_active: showOnlyActive ? "1" : undefined,

      // sıralama
      sort: orderBy,
      orderDir,

      // pagination
      limit: 200,
      offset: 0,

      // locale (opsiyonel)
      locale: locale || undefined,
    }),
    [search, showOnlyActive, orderBy, orderDir, locale],
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
