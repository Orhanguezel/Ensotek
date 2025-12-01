// =============================================================
// FILE: src/pages/admin/menuitem/[slug].tsx
// Ensotek – Admin Menu Item Detail (Create / Edit)
// =============================================================

import React, { useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  MenuItemForm,
  type MenuItemFormValues,
} from "@/components/admin/menuitem/MenuItemForm";

import {
  useGetMenuItemAdminQuery,
  useCreateMenuItemAdminMutation,
  useUpdateMenuItemAdminMutation,
  useDeleteMenuItemAdminMutation,
} from "@/integrations/rtk/endpoints/admin/menu_items_admin.endpoints";

import type {
  AdminMenuItemDto,
  AdminMenuItemCreatePayload,
  AdminMenuItemUpdatePayload,
} from "@/integrations/types/menu_items.types";

const AdminMenuItemDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const id =
    typeof slug === "string"
      ? slug
      : Array.isArray(slug)
      ? slug[0]
      : "";

  const isNew = !id || id === "new";

  const {
    data,
    isLoading: isLoadingItem,
  } = useGetMenuItemAdminQuery(id, {
    skip: isNew || !id,
  });

  const [createMenuItem, { isLoading: isCreating }] =
    useCreateMenuItemAdminMutation();
  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemAdminMutation();
  const [deleteMenuItem, { isLoading: isDeleting }] =
    useDeleteMenuItemAdminMutation();

  const initialValues = useMemo(() => {
    if (!data) return undefined;
    const item = data as AdminMenuItemDto;
    return {
      title: item.title ?? "",
      url: item.url ?? "",
      type: item.type ?? "custom",
      page_id: item.page_id ?? null,
      parent_id: item.parent_id ?? null,
      location: item.location ?? "header",
      icon: item.icon ?? "",
      section_id: item.section_id ?? null,
      is_active: item.is_active ?? true,
      display_order: item.display_order ?? 0,
      locale: item.locale ?? "",
    } as MenuItemFormValues;
  }, [data]);

  const loading = !isNew && isLoadingItem;
  const saving = isCreating || isUpdating;

  const handleSubmit = async (values: MenuItemFormValues) => {
    try {
      if (isNew) {
        const payload: AdminMenuItemCreatePayload = {
          title: values.title.trim(),
          url:
            values.type === "custom"
              ? (values.url || "")
              : values.url || null,
          type: values.type,
          page_id: values.type === "page" ? values.page_id ?? null : null,
          parent_id: values.parent_id ?? null,
          location: values.location,
          icon: values.icon ? values.icon.trim() : null,
          section_id: values.section_id ?? null,
          is_active: values.is_active,
          display_order: values.display_order,
          locale: values.locale || undefined,
        };

        const created = await createMenuItem(payload).unwrap();
        toast.success("Menü öğesi oluşturuldu.");
        router.replace(`/admin/menuitem/${created.id}`);
      } else {
        const payload: AdminMenuItemUpdatePayload = {
          title: values.title.trim(),
          url:
            values.type === "custom"
              ? (values.url || "")
              : values.url || null,
          type: values.type,
          page_id: values.type === "page" ? values.page_id ?? null : null,
          parent_id: values.parent_id ?? null,
          location: values.location,
          icon: values.icon ? values.icon.trim() : null,
          section_id: values.section_id ?? null,
          is_active: values.is_active,
          display_order: values.display_order,
          locale: values.locale || undefined,
        };

        await updateMenuItem({ id, data: payload }).unwrap();
        toast.success("Menü öğesi güncellendi.");
      }
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "İşlem sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (isNew || !id) return;
    const ok = window.confirm(
      "Bu menü öğesini silmek istediğinize emin misiniz?",
    );
    if (!ok) return;

    try {
      await deleteMenuItem({ id }).unwrap();
      toast.success("Menü öğesi silindi.");
      router.push("/admin/menuitem");
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Silme işlemi sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    router.push("/admin/menuitem");
  };

  return (
    <div className="container-fluid py-3">
      <MenuItemForm
        mode={isNew ? "create" : "edit"}
        initialValues={initialValues}
        loading={loading}
        saving={saving || isDeleting}
        onSubmit={handleSubmit}
        onDelete={isNew ? undefined : handleDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminMenuItemDetailPage;
