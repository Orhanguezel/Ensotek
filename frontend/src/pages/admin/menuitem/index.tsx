// =============================================================
// FILE: src/pages/admin/menuitem/index.tsx
// Ensotek – Admin Menu Items List Page
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

  const [filters, setFilters] = useState<MenuItemFilters>({
    search: "",
    location: "all",
    active: "all",
    sort: "display_order",
    order: "asc",
  });

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

  // 🔹 items'i useMemo ile stabilize et
  const items: AdminMenuItemDto[] = useMemo(
    () => data?.items ?? [],
    [data],
  );

  const total = data?.total ?? items.length;

  // Drag & drop sonrası sıralamayı tutacağımız local state
  const [orderedItems, setOrderedItems] = useState<AdminMenuItemDto[]>([]);

  // API'den gelen data her değiştiğinde local sıralamayı güncelle
  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleEdit = (item: AdminMenuItemDto) => {
    router.push(`/admin/menuitem/${encodeURIComponent(item.id)}`);
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
    router.push("/admin/menuitem/new");
  };

  // Drag & drop sonrası yeni sıra
  const handleReorder = (next: AdminMenuItemDto[]) => {
    setOrderedItems(next);
  };

  // "Sıralamayı Kaydet" -> /admin/menu_items/reorder
  const handleSaveOrder = async () => {
    if (!orderedItems || orderedItems.length === 0) {
      toast.info("Sıralanacak menü öğesi bulunamadı.");
      return;
    }

    try {
      const payload = orderedItems.map((item, index) => ({
        id: item.id,
        display_order: index, // istersen index + 1 yapabilirsin
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
