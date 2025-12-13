// =============================================================
// FILE: src/pages/admin/menuitem/index.tsx
// Ensotek – Admin Menu Items List Page (locale aware)
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  MenuItemHeader,
  type MenuItemFilters,
  type LocaleOption,
} from "@/components/admin/menuitem/MenuItemHeader";
import { MenuItemList } from "@/components/admin/menuitem/MenuItemList";

import {
  useListMenuItemsAdminQuery,
  useDeleteMenuItemAdminMutation,
  useReorderMenuItemsAdminMutation,
} from "@/integrations/rtk/endpoints/admin/menu_items_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type {
  AdminMenuItemDto,
  AdminMenuItemListQueryParams,
} from "@/integrations/types/menu_items.types";

const AdminMenuItemIndexPage: NextPage = () => {
  const router = useRouter();

  // 🔹 Locale’leri site_settings üzerinden merkezi çekiyoruz
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const locales: LocaleOption[] = useMemo(() => {
    if (!appLocaleRows || !appLocaleRows.length) {
      // fallback
      return [
        { value: "tr", label: "Türkçe (tr)" },
        { value: "en", label: "İngilizce (en)" },
      ];
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
        // ignore parse error, fallback below
      }
    }

    if (!arr.length) {
      arr = ["tr", "en"];
    }

    const uniq = Array.from(new Set(arr.map((x) => x.toLowerCase())));
    return uniq.map((code) => {
      if (code === "tr") return { value: "tr", label: "Türkçe (tr)" };
      if (code === "en") return { value: "en", label: "İngilizce (en)" };
      if (code === "de") return { value: "de", label: "Almanca (de)" };
      return { value: code, label: code.toUpperCase() };
    });
  }, [appLocaleRows]);

  // URL'den locale paramı (örn: ?locale=en)
  const localeFromQuery =
    typeof router.query.locale === "string"
      ? router.query.locale.trim().toLowerCase()
      : "";

  const routerLocale =
    typeof router.locale === "string"
      ? router.locale.toLowerCase()
      : "";

  // Başlangıç locale'i: önce query, yoksa router.locale, yoksa boş (Hepsi)
  const initialLocale = localeFromQuery || routerLocale || "";

  const [filters, setFilters] = useState<MenuItemFilters>({
    search: "",
    location: "all",
    active: "all",
    sort: "display_order",
    order: "asc",
    locale: initialLocale,
  });

  // URL'deki locale değişirse filtre ile senkron (sadece parametrede gerçekten bir değer varsa)
  useEffect(() => {
    if (!localeFromQuery) return;

    const normalized = localeFromQuery;
    if (normalized !== filters.locale) {
      setFilters((prev) => ({
        ...prev,
        locale: normalized,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeFromQuery]);

  // filters.locale değişince URL'deki ?locale paramını güncelle
  useEffect(() => {
    const current =
      typeof router.query.locale === "string"
        ? router.query.locale.trim().toLowerCase()
        : "";

    const next = filters.locale || "";

    if (current === next) return;

    const query = { ...router.query };
    if (next) query.locale = next;
    else delete query.locale;

    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.locale]);

  const queryParams: AdminMenuItemListQueryParams = useMemo(() => {
    const params: AdminMenuItemListQueryParams = {
      q: filters.search || undefined,
      location:
        filters.location === "all" ? undefined : filters.location,
      sort: filters.sort,
      order: filters.order,
      limit: 100,
      offset: 0,
    };

    if (filters.active === "active") {
      params.is_active = 1;
    } else if (filters.active === "inactive") {
      params.is_active = 0;
    }

    if (filters.locale) {
      params.locale = filters.locale;
    }

    return params;
  }, [filters]);

  const { data, isLoading, isFetching, refetch } =
    useListMenuItemsAdminQuery(queryParams);

  const [deleteMenuItem, { isLoading: isDeleting }] =
    useDeleteMenuItemAdminMutation();

  const [reorderMenuItems, { isLoading: isSavingOrder }] =
    useReorderMenuItemsAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting || isSavingOrder;

  const items: AdminMenuItemDto[] = useMemo(
    () => data?.items ?? [],
    [data],
  );

  const total = data?.total ?? items.length;

  const [orderedItems, setOrderedItems] =
    useState<AdminMenuItemDto[]>([]);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleEdit = (item: AdminMenuItemDto) => {
    const effectiveLocale = filters.locale || localeFromQuery || "";
    const localeParam = effectiveLocale
      ? `?locale=${encodeURIComponent(effectiveLocale)}`
      : "";
    router.push(
      `/admin/menuitem/${encodeURIComponent(item.id)}${localeParam}`,
    );
  };

  const handleDelete = async (item: AdminMenuItemDto) => {
    const ok = window.confirm(
      `"${item.title}" menü öğesini silmek istediğinize emin misiniz?`,
    );
    if (!ok) return;

    try {
      await deleteMenuItem({ id: item.id }).unwrap();
      toast.success("Menü öğesi silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Menü öğesi silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCreateClick = () => {
    const effectiveLocale = filters.locale || localeFromQuery || "";
    const localeParam = effectiveLocale
      ? `?locale=${encodeURIComponent(effectiveLocale)}`
      : "";
    router.push(`/admin/menuitem/new${localeParam}`);
  };

  const handleReorder = (next: AdminMenuItemDto[]) => {
    setOrderedItems(next);
  };

  const handleSaveOrder = async () => {
    if (!orderedItems || orderedItems.length === 0) {
      toast.info("Sıralanacak menü öğesi bulunamadı.");
      return;
    }

    try {
      const payload = orderedItems.map((item, index) => ({
        id: item.id,
        display_order: index, // 0-based, istersen +1 yaparsın
      }));

      await reorderMenuItems({ items: payload }).unwrap();
      toast.success("Menü öğesi sıralaması kaydedildi.");
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
      <MenuItemHeader
        filters={filters}
        total={total}
        loading={busy}
        locales={locales}
        localesLoading={isLocalesLoading}
        defaultLocale={initialLocale || (router.locale as string)}
        onFiltersChange={setFilters}
        onRefresh={() => {
          void refetch();
        }}
        onCreateClick={handleCreateClick}
      />

      <MenuItemList
        items={orderedItems.length ? orderedItems : items}
        loading={busy}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
        onSaveOrder={handleSaveOrder}
        savingOrder={isSavingOrder}
      />
    </div>
  );
};

export default AdminMenuItemIndexPage;
