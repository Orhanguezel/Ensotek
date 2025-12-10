// =============================================================
// FILE: src/pages/admin/library/index.tsx
// Ensotek – Admin Library Sayfası (Liste + filtreler)
// Create/Edit ayrı sayfalarda
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListLibraryAdminQuery,
  useUpdateLibraryAdminMutation,
  useRemoveLibraryAdminMutation,
} from "@/integrations/rtk/endpoints/admin/library_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type {
  LibraryDto,
  LibraryListQueryParams,
} from "@/integrations/types/library.types";

import {
  LibraryHeader,
  type LocaleOption,
} from "@/components/admin/library/LibraryHeader";
import { LibraryList } from "@/components/admin/library/LibraryList";

/* ------------------------------------------------------------- */

const LibraryAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  // UI'de ismini şimdilik koruyoruz ama backend'de is_active filtresine bağlı
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const [orderBy, setOrderBy] =
    useState<
      | "created_at"
      | "updated_at"
      | "published_at"
      | "display_order"
      | "views"
      | "download_count"
    >("display_order");
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

    // uniq + lower
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
    // Header zaten lower-case yapıyor ama garanti olsun:
    const normalized = next ? next.trim().toLowerCase() : "";
    setLocale(normalized);
  };

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<LibraryListQueryParams>(
    () => ({
      // arama
      q: search || undefined,

      // filtreler
      is_published: showOnlyPublished ? "1" : undefined,
      // UI: "Öne çıkan" filtresini backend'de is_active'e bağlıyoruz
      is_active: showOnlyFeatured ? "1" : undefined,

      // sıralama (BE shared util: sort + orderDir destekli)
      sort: orderBy,
      orderDir,

      // pagination
      limit: 200,
      offset: 0,

      // locale
      locale: locale || undefined,
    }),
    [
      search,
      showOnlyPublished,
      showOnlyFeatured,
      orderBy,
      orderDir,
      locale,
    ],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryAdminQuery(listParams);

  const [rows, setRows] = useState<LibraryDto[]>([]);

  useEffect(() => {
    // listLibraryAdmin: LibraryDto[] döndürüyor
    setRows(listData ?? []);
  }, [listData]);

  const [updateLibrary, { isLoading: isUpdating }] =
    useUpdateLibraryAdminMutation();
  const [deleteLibrary, { isLoading: isDeleting }] =
    useRemoveLibraryAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting;

  /* -------------------- Handlers ----------------------------- */

  const handleCreateClick = () => {
    router.push("/admin/library/new");
  };

  const handleEditRow = (item: LibraryDto) => {
    router.push(`/admin/library/${item.id}`);
  };

  const handleDelete = async (item: LibraryDto) => {
    if (
      !window.confirm(
        `"${item.title || item.slug || item.id}" kayıtlı içeriği silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteLibrary(item.id).unwrap();
      toast.success(`"${item.title || item.slug || item.id}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kayıt silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleTogglePublished = async (
    item: LibraryDto,
    value: boolean,
  ) => {
    try {
      await updateLibrary({
        id: item.id,
        patch: { is_published: value ? "1" : "0" }, // BoolLike
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_published: value ? 1 : 0 } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yayın durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  // UI: "Öne Çıkan" switch'ini is_active ile eşliyoruz
  const handleToggleFeatured = async (
    item: LibraryDto,
    value: boolean,
  ) => {
    try {
      await updateLibrary({
        id: item.id,
        patch: { is_active: value ? "1" : "0" }, // BoolLike
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
      <LibraryHeader
        search={search}
        onSearchChange={setSearch}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        showOnlyPublished={showOnlyPublished}
        onShowOnlyPublishedChange={setShowOnlyPublished}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
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
          <LibraryList
            items={rows}
            loading={busy}
            onEdit={handleEditRow}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
            onToggleFeatured={handleToggleFeatured}
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryAdminPage;
