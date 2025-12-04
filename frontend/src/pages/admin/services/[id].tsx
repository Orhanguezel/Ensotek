// =============================================================
// FILE: src/pages/admin/services/[id].tsx
// Ensotek – Admin Hizmet Detay (Create / Edit by id)
// =============================================================

import React, { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  ServiceForm,
  type ServiceFormValues,
} from "@/components/admin/services/ServiceForm";

import {
  useGetServiceAdminQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
} from "@/integrations/rtk/endpoints/admin/services_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type {
  ServiceCreatePayload,
  ServiceUpdatePayload,
} from "@/integrations/types/services.types";

import type { LocaleOption } from "@/components/admin/custompage/CustomPageHeader";

const AdminServiceDetailPage: NextPage = () => {
  const router = useRouter();
  const { id: idParam } = router.query;
  const isRouterReady = router.isReady;

  const id = useMemo(
    () =>
      isRouterReady && typeof idParam === "string" ? idParam : undefined,
    [isRouterReady, idParam],
  );

  const isCreateMode = id === "new";
  const shouldSkipQuery = !isRouterReady || isCreateMode || !id;

  // 🔹 Aktif locale (formdaki select ile değişecek)
  const routerLocale =
    (router.locale as string | undefined)?.toLowerCase() || "tr";
  const [activeLocale, setActiveLocale] = useState<string>(routerLocale);

  // 🔹 Detail query – locale ile birlikte çağır
  const {
    data: service,
    isLoading: isLoadingService,
    isFetching: isFetchingService,
    error: serviceError,
  } = useGetServiceAdminQuery(
    { id: id as string, locale: activeLocale },
    { skip: shouldSkipQuery },
  );

  const [createService, { isLoading: isCreating }] =
    useCreateServiceAdminMutation();
  const [updateService, { isLoading: isUpdating }] =
    useUpdateServiceAdminMutation();

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

  const loading = isLoadingService || isFetchingService || isLocalesLoading;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    router.push("/admin/services");
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      if (isCreateMode) {
        const payload: ServiceCreatePayload = {

          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,

          featured: values.featured,
          is_active: values.is_active,
          display_order: values.display_order
            ? Number(values.display_order)
            : undefined,

          featured_image: values.featured_image || null,
          image_url: values.image_url || null,
          image_asset_id: values.image_asset_id || null,

          // tip spesifik
          area: values.area || null,
          duration: values.duration || null,
          maintenance: values.maintenance || null,
          season: values.season || null,
          thickness: values.thickness || null,
          equipment: values.equipment || null,

          // i18n
          locale: values.locale || undefined,
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description || undefined,
          material: values.material || undefined,
          price: values.price || undefined,
          includes: values.includes || undefined,
          warranty: values.warranty || undefined,
          image_alt: values.image_alt || undefined,

          // multi-locale davranış
          replicate_all_locales: values.replicate_all_locales,
        };

        const created = await createService(payload).unwrap();
        toast.success("Hizmet başarıyla oluşturuldu.");

        const nextId = created.id;
        router.replace(`/admin/services/${encodeURIComponent(nextId)}`);
      } else {
        if (!service) {
          toast.error("Hizmet verisi yüklenemedi.");
          return;
        }

        const payload: ServiceUpdatePayload = {
          // parent (non-i18n)

          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,

          featured: values.featured,
          is_active: values.is_active,
          display_order: values.display_order
            ? Number(values.display_order)
            : undefined,

          featured_image: values.featured_image || null,
          image_url: values.image_url || null,
          image_asset_id: values.image_asset_id || null,

          // tip spesifik
          area: values.area || null,
          duration: values.duration || null,
          maintenance: values.maintenance || null,
          season: values.season || null,
          thickness: values.thickness || null,
          equipment: values.equipment || null,

          // i18n
          locale: values.locale || undefined,
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description || undefined,
          material: values.material || undefined,
          price: values.price || undefined,
          includes: values.includes || undefined,
          warranty: values.warranty || undefined,
          image_alt: values.image_alt || undefined,

          // multi-locale davranış
          apply_all_locales: values.apply_all_locales,
        };

        const targetId = service.id;
        await updateService({ id: targetId, patch: payload }).unwrap();
        toast.success("Hizmet güncellendi.");
      }
    } catch (err: unknown) {
      const msg =
        (err as {
          data?: { error?: { message?: string } };
          message?: string;
        })?.data?.error?.message ||
        (err as { message?: string })?.message ||
        "İşlem sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  const pageTitle = isCreateMode
    ? "Yeni Hizmet Oluştur"
    : service?.name || "Hizmet Düzenle";

  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  if (!isCreateMode && serviceError && !loading && !service) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Hizmet bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu id için kayıtlı bir hizmet yok:
          <code className="ms-1">{id}</code>
        </p>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={handleCancel}
        >
          Listeye dön
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">{pageTitle}</h4>
        <p className="text-muted small mb-0">
          Ensotek endüstriyel soğutma kulesi hizmetlerini burada oluşturup
          düzenleyebilirsin. Çok dilli içerik, teknik alanlar, kategori ilişkisi
          ve storage tabanlı görseller desteklenir.
        </p>
      </div>

      <ServiceForm
        mode={isCreateMode ? "create" : "edit"}
        initialData={!isCreateMode && service ? service : undefined}
        loading={loading}
        saving={saving}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        defaultLocale={activeLocale}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onLocaleChange={setActiveLocale} // 🔹 formdaki select burayı tetikliyor
      />
    </div>
  );
};

export default AdminServiceDetailPage;
