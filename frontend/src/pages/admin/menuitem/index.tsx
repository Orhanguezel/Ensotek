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
} from "@/components/admin/menuitem/MenuItemHeader";
import { MenuItemList } from "@/components/admin/menuitem/MenuItemList";

import {
  useListMenuItemsAdminQuery,
  useDeleteMenuItemAdminMutation,
  useReorderMenuItemsAdminMutation,
} from "@/integrations/rtk/endpoints/admin/menu_items_admin.endpoints";
import type {
  AdminMenuItemDto,
  AdminMenuItemListQueryParams,
} from "@/integrations/types/menu_items.types";

const AdminMenuItemIndexPage: NextPage = () => {
  const router = useRouter();

  // URL'den locale paramı (örn: ?locale=en)
  const localeFromQuery =
    typeof router.query.locale === "string"
      ? router.query.locale.trim().toLowerCase()
      : "";

  const [filters, setFilters] = useState<MenuItemFilters>({
    search: "",
    location: "all",
    active: "all",
    sort: "display_order",
    order: "asc",
    locale: localeFromQuery || "",
  });

  // URL'deki locale değişirse filtre ile senkron
  useEffect(() => {
    const normalized = localeFromQuery || "";
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

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListMenuItemsAdminQuery(queryParams);

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
