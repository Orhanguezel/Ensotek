// =============================================================
// FILE: src/pages/admin/services/index.tsx
// Ensotek – Admin Hizmetler (Services) Liste + Filtre + Reorder
//  - Drag & drop sıralama (display_order parent üzerinde)
//  - Create/Edit ayrı sayfalarda
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  ServicesHeader,
  type ServicesFilterState,
} from "@/components/admin/services/ServicesHeader";
import { ServicesList } from "@/components/admin/services/ServicesList";

import {
  useListServicesAdminQuery,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
  useReorderServicesAdminMutation, // reorder endpoint
} from "@/integrations/rtk/endpoints/admin/services_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type { LocaleOption } from "@/components/admin/custompage/CustomPageHeader";

import type {
  ServiceListAdminQueryParams,
  ServiceDto,
} from "@/integrations/types/services.types";

const AdminServicesPage: NextPage = () => {
  const router = useRouter();

  /* ----------------------------------------------------------- */
  /*  Locale’ler – site_settings/app_locales                     */
  /* ----------------------------------------------------------- */

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

  const defaultLocale =
    (router.locale as string | undefined)?.toLowerCase() ||
    localeOptions[0]?.value ||
    "tr";

  const [filters, setFilters] = useState<ServicesFilterState>({});

  // 🔹 Sayfa açıldığında varsayılan locale’i filtreye yaz
  useEffect(() => {
    if (!router.isReady) return;
    if (!filters.locale && defaultLocale) {
      setFilters((prev) =>
        prev.locale ? prev : { ...prev, locale: defaultLocale },
      );
    }
  }, [router.isReady, defaultLocale, filters.locale]);

  /* ----------------------------------------------------------- */
  /*  Liste + mutations                                          */
  /* ----------------------------------------------------------- */

  const queryParams: ServiceListAdminQueryParams = {
    limit: 200,
    offset: 0,
    ...filters, // locale dahil tüm filtreler backend'e gider
  };

  const { data, isLoading, isFetching, refetch } =
    useListServicesAdminQuery(queryParams);

  const [updateService, { isLoading: isUpdating }] =
    useUpdateServiceAdminMutation();
  const [deleteService, { isLoading: isDeleting }] =
    useDeleteServiceAdminMutation();

  const [reorderServices, { isLoading: isReordering }] =
    useReorderServicesAdminMutation();

  // 🔹 API’den gelen items’i memoize et – eslint uyarısını çözer
  const items: ServiceDto[] = useMemo(
    () => (data?.items ? data.items : []),
    [data],
  );

  const total = data?.total ?? items.length;

  // 🔹 Drag & drop için lokal sıra state’i
  const [rows, setRows] = useState<ServiceDto[]>([]);

  useEffect(() => {
    setRows(items);
  }, [items]);

  const loading =
    isLoading ||
    isFetching ||
    isUpdating ||
    isDeleting ||
    isLocalesLoading ||
    isReordering;

  /* ----------------------------------------------------------- */
  /*  Filter & navigation handlers                               */
  /* ----------------------------------------------------------- */

  const handleFiltersChange = (patch: Partial<ServicesFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleCreateNew = () => {
    router.push("/admin/services/new");
  };

  /* ----------------------------------------------------------- */
  /*  Toggle / Delete                                            */
  /* ----------------------------------------------------------- */

  const handleToggleActive = async (svc: ServiceDto, value: boolean) => {
    try {
      await updateService({
        id: svc.id,
        patch: { is_active: value },
      }).unwrap();
      toast.success(
        `${svc.name || "Hizmet"} ${value ? "aktif" : "pasif"} yapıldı.`,
      );

      // Lokal state’i de güncel tut
      setRows((prev) =>
        prev.map((r) => (r.id === svc.id ? { ...r, is_active: value } : r)),
      );
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } }; message?: string })
          ?.data?.error?.message ||
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
      setRows((prev) =>
        prev.map((r) =>
          r.id === svc.id ? { ...r, featured: value } : r,
        ),
      );
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } }; message?: string })
          ?.data?.error?.message ||
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
      await refetch();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } }; message?: string })
          ?.data?.error?.message ||
        (err as { message?: string })?.message ||
        "Hizmet silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* ----------------------------------------------------------- */
  /*  Reorder (drag & drop)                                      */
  /* ----------------------------------------------------------- */

  const handleReorderLocal = (next: ServiceDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const itemsPayload = rows.map((r, index) => ({
        id: r.id,
        display_order: index, // parent (services.display_order) için index
      }));

      await reorderServices({ items: itemsPayload }).unwrap();
      toast.success("Hizmet sıralaması kaydedildi.");
      await refetch();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } }; message?: string })
          ?.data?.error?.message ||
        (err as { message?: string })?.message ||
        "Sıralama kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* ----------------------------------------------------------- */
  /*  Render                                                     */
  /* ----------------------------------------------------------- */

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">Hizmetler Yönetimi</h4>
        <p className="text-muted small mb-0">
          Ensotek&apos;in endüstriyel soğutma kulesi hizmetlerini (üretim,
          bakım, modernizasyon, mühendislik desteği vb.) listele, filtrele,
          sırala ve yönet.
        </p>
      </div>

      <ServicesHeader
        loading={loading}
        total={total}
        filters={filters}
        onChangeFilters={handleFiltersChange}
        onRefresh={refetch}
        onCreateNew={handleCreateNew}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
      />

      <ServicesList
        items={rows}
        loading={loading}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorderLocal}
        onSaveOrder={handleSaveOrder}
        savingOrder={isReordering}
      />
    </div>
  );
};

export default AdminServicesPage;
