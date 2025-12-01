// =============================================================
// FILE: src/pages/admin/custompage/[slug].tsx
// Ensotek – Admin Custom Page Create/Edit Page (slug bazlı)
// =============================================================

import React, { useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";
import {
  CustomPageForm,
  type CustomPageFormValues,
} from "@/components/admin/custompage/CustomPageForm";
import {
  useGetCustomPageBySlugAdminQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
} from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type {
  CustomPageCreatePayload,
  CustomPageUpdatePayload,
} from "@/integrations/types/custom_pages.types";
import type { LocaleOption } from "@/components/admin/custompage/CustomPageHeader";

const AdminCustomPageDetail: NextPage = () => {
  const router = useRouter();
  const { slug: slugParam } = router.query;

  // Next.js'te ilk render'da router.query boş gelebilir
  const isRouterReady = router.isReady;

  const slug = useMemo(
    () =>
      isRouterReady && typeof slugParam === "string"
        ? slugParam
        : undefined,
    [isRouterReady, slugParam],
  );

  // /admin/custompage/new => create mode
  const isCreateMode = slug === "new";

  // RTK Query'yi ne zaman çalıştıracağımızı netleştirelim
  const shouldSkipQuery =
    !isRouterReady || isCreateMode || !slug;

  const {
    data: page,
    isLoading: isLoadingPage,
    isFetching: isFetchingPage,
    error: pageError,
  } = useGetCustomPageBySlugAdminQuery(slug as string, {
    skip: shouldSkipQuery,
  });

  const [createPage, { isLoading: isCreating }] =
    useCreateCustomPageAdminMutation();
  const [updatePage, { isLoading: isUpdating }] =
    useUpdateCustomPageAdminMutation();

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

    return Array.from(new Set(arr));
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

  const defaultLocale = localeOptions[0]?.value ?? "tr";

  const loading = isLoadingPage || isFetchingPage || isLocalesLoading;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    router.push("/admin/custompage");
  };

  // Form submit handler (create + update)
  const handleSubmit = async (values: CustomPageFormValues) => {
    try {
      if (isCreateMode) {
        const payload: CustomPageCreatePayload = {
          // i18n
          locale: values.locale || undefined,
          title: values.title.trim(),
          slug: values.slug.trim(),
          content: values.content,

          // parent
          is_published: values.is_published,
          featured_image: values.featured_image || null,
          featured_image_asset_id:
            values.featured_image_asset_id || null,
          featured_image_alt:
            values.featured_image_alt || null,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,

          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,
        };

        const created = await createPage(payload).unwrap();
        toast.success("Sayfa başarıyla oluşturuldu.");

        const nextSlug = created.slug || values.slug.trim();
        router.replace(
          `/admin/custompage/${encodeURIComponent(nextSlug)}`,
        );
      } else {
        if (!page) {
          toast.error("Sayfa verisi yüklenemedi.");
          return;
        }

        const payload: CustomPageUpdatePayload = {
          locale: values.locale || undefined,
          is_published: values.is_published,

          title: values.title.trim(),
          slug: values.slug.trim(),
          content: values.content,

          featured_image: values.featured_image || null,
          featured_image_asset_id:
            values.featured_image_asset_id || null,
          featured_image_alt:
            values.featured_image_alt || null,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,

          category_id: values.category_id || null,
          sub_category_id: values.sub_category_id || null,
        };

        await updatePage({ id: page.id, patch: payload }).unwrap();
        toast.success("Sayfa güncellendi.");

        // Slug değiştiyse URL'i de güncelle
        const nextSlug = values.slug.trim();
        if (slug !== nextSlug) {
          router.replace(
            `/admin/custompage/${encodeURIComponent(nextSlug)}`,
          );
        }
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
    ? "Yeni Sayfa Oluştur"
    : page?.title || "Sayfa Düzenle";

  // Router hazır değilken hiçbir şey göstermeyelim
  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  // Backend slug’ı bulamazsa – 404 yerine kendi mesajımız
  if (!isCreateMode && pageError && !loading && !page) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Sayfa bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu slug için kayıtlı bir özel sayfa yok:
          <code className="ms-1">{slug}</code>
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
      {/* Basit başlık – layout içinde breadcrumb vs. eklenebilir */}
      <div className="mb-3">
        <h4 className="h5 mb-1">{pageTitle}</h4>
        <p className="text-muted small mb-0">
          Özel sayfaları (blog, haber, hakkında vb.) burada
          oluşturup düzenleyebilirsin.
        </p>
      </div>

      <CustomPageForm
        mode={isCreateMode ? "create" : "edit"}
        initialData={!isCreateMode && page ? page : undefined}
        loading={loading}
        saving={saving}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        defaultLocale={defaultLocale}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminCustomPageDetail;
