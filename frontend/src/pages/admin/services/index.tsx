// =============================================================
// FILE: src/pages/admin/services/index.tsx
// Ensotek – Admin Hizmetler (Services) Liste Sayfası
// =============================================================

import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { ServicesHeader, type ServicesFilterState } from "@/components/admin/services/ServicesHeader";
import { ServicesList } from "@/components/admin/services/ServicesList";

import {
  useListServicesAdminQuery,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
} from "@/integrations/rtk/endpoints/admin/services_admin.endpoints";

import type {
  ServiceListAdminQueryParams,
  ServiceDto,
} from "@/integrations/types/services.types";

const AdminServicesPage: NextPage = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<ServicesFilterState>({});

  const queryParams: ServiceListAdminQueryParams = {
    limit: 200,
    offset: 0,
    ...filters,
  };

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListServicesAdminQuery(queryParams);

  const [updateService, { isLoading: isUpdating }] =
    useUpdateServiceAdminMutation();
  const [deleteService, { isLoading: isDeleting }] =
    useDeleteServiceAdminMutation();

  const loading = isLoading || isFetching || isUpdating || isDeleting;
  const items: ServiceDto[] = data?.items ?? [];
  const total = data?.total ?? items.length;

  const handleFiltersChange = (patch: Partial<ServicesFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleCreateNew = () => {
    // İleride detay sayfası / form hazır olunca buraya yönlendirme yapılır.
    // Şimdilik varsayılan olarak /admin/services/new kabul edelim.
    router.push("/admin/services/new");
  };

  const handleToggleActive = async (svc: ServiceDto, value: boolean) => {
    try {
      await updateService({
        id: svc.id,
        patch: { is_active: value },
      }).unwrap();
      toast.success(
        `${svc.name || "Hizmet"} ${value ? "aktif" : "pasif"} yapıldı.`,
      );
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: string }; message?: string })?.data?.error ||
        (err as { message?: string })?.message ||
        "Durum güncelleme sırasında hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (svc: ServiceDto, value: boolean) => {
    try {
      await updateService({
        id: svc.id,
        patch: { featured: value },
      }).unwrap();
      toast.success(
        `${svc.name || "Hizmet"} ${
          value ? "öne çıkarıldı" : "artık öne çıkan değil"
        }.`,
      );
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: string }; message?: string })?.data?.error ||
        (err as { message?: string })?.message ||
        "Öne çıkarma durumu güncellenemedi.";
      toast.error(msg);
    }
  };

  const handleEdit = (svc: ServiceDto) => {
    router.push(`/admin/services/${svc.id}`);
  };

  const handleDelete = async (svc: ServiceDto) => {
    const ok = window.confirm(
      `"${svc.name || "Bu hizmet"}" kaydını silmek üzeresin.\n\nDevam etmek istiyor musun?`,
    );
    if (!ok) return;

    try {
      await deleteService({ id: svc.id }).unwrap();
      toast.success("Hizmet silindi.");
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: string }; message?: string })?.data?.error ||
        (err as { message?: string })?.message ||
        "Hizmet silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">Hizmetler Yönetimi</h4>
        <p className="text-muted small mb-0">
          Mezarlık hizmetleri (bahçe, toprak dolgusu, bakım vb.) için kayıtları
          listele, filtrele ve yönet.
        </p>
      </div>

      <ServicesHeader
        loading={loading}
        total={total}
        filters={filters}
        onChangeFilters={handleFiltersChange}
        onRefresh={refetch}
        onCreateNew={handleCreateNew}
      />

      <ServicesList
        items={items}
        loading={loading}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminServicesPage;
