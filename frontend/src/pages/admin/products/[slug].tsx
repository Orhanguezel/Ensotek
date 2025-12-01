// =============================================================
// FILE: src/pages/admin/products/[slug].tsx
// Ensotek – Admin Product Create/Edit Page (id/slug bazlı)
// =============================================================

import React, { useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  ProductsForm,
  type ProductFormValues,
} from "@/components/admin/products/ProductsForm";
import type { LocaleOption } from "@/components/admin/products/ProductsHeader";

import {
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

/* site_settings.app_locales -> LocaleOption[] */
const useLocaleOptions = (): {
  locales: LocaleOption[];
  loading: boolean;
} => {
  const { data, isLoading } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const locales = useMemo<LocaleOption[]>(() => {
    if (!data || !data.length) {
      return [
        { value: "tr", label: "Türkçe (tr)" },
        { value: "en", label: "İngilizce (en)" },
      ];
    }

    const row = data.find((r) => r.key === "app_locales");
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
      arr = ["tr", "en"];
    }

    const uniq = Array.from(new Set(arr.map((x) => x.toLowerCase())));
    return uniq.map((code) => {
      if (code === "tr") return { value: "tr", label: "Türkçe (tr)" };
      if (code === "en") return { value: "en", label: "İngilizce (en)" };
      if (code === "de") return { value: "de", label: "Almanca (de)" };
      return { value: code, label: code.toUpperCase() };
    });
  }, [data]);

  return { locales, loading: isLoading };
};

const AdminProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug: slugParam } = router.query;
  const isRouterReady = router.isReady;

  // /admin/products/new => create mode
  const idOrSlug: string | undefined = useMemo(
    () =>
      isRouterReady && typeof slugParam === "string"
        ? slugParam
        : undefined,
    [isRouterReady, slugParam],
  );

  const isCreateMode = idOrSlug === "new";
  const shouldSkipQuery = !isRouterReady || isCreateMode || !idOrSlug;

  const { locales, loading: localesLoading } = useLocaleOptions();

  const {
    data: product,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
    error: productError,
  } = useGetProductAdminQuery(
    // ⚠️ Burada string yerine { id: string } veriyoruz
    { id: idOrSlug ?? "" },
    {
      skip: shouldSkipQuery,
    },
  );

  const [createProduct, { isLoading: isCreating }] =
    useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductAdminMutation();

  const loading = isLoadingProduct || isFetchingProduct;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    router.push("/admin/products");
  };

  const toNumberOrUndefined = (val: string): number | undefined => {
    const n = Number(val.replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  };

  const parseCommaList = (val: string): string[] =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const tags = parseCommaList(values.tags);
      const storageImageIds = parseCommaList(values.storage_image_ids);

      const basePayload = {
        locale: values.locale || undefined,
        is_active: values.is_active,
        is_featured: values.is_featured,

        title: values.title.trim(),
        slug: values.slug.trim(),
        price: toNumberOrUndefined(values.price) ?? 0,
        description: values.description.trim() || undefined,

        category_id: values.category_id || undefined,
        sub_category_id: values.sub_category_id || undefined,

        image_url: values.image_url.trim() || undefined,
        storage_asset_id: values.storage_asset_id.trim() || undefined,
        alt: values.alt.trim() || undefined,
        storage_image_ids: storageImageIds,

        tags,

        product_code: values.product_code.trim() || undefined,
        stock_quantity: toNumberOrUndefined(values.stock_quantity) ?? 0,
        rating: toNumberOrUndefined(values.rating),

        meta_title: values.meta_title.trim() || undefined,
        meta_description: values.meta_description.trim() || undefined,
      };

      if (isCreateMode) {
        const created = await createProduct(basePayload as any).unwrap();
        toast.success("Ürün başarıyla oluşturuldu.");

        const nextId = created.id;
        router.replace(`/admin/products/${encodeURIComponent(nextId)}`);
      } else {
        if (!product) {
          toast.error("Ürün verisi yüklenemedi.");
          return;
        }

        await updateProduct({
          id: product.id,
          patch: basePayload as any,
        }).unwrap();
        toast.success("Ürün güncellendi.");
      }
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "İşlem sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  const pageTitle = isCreateMode
    ? "Yeni Ürün Oluştur"
    : product?.title || "Ürün Düzenle";

  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  if (!isCreateMode && productError && !loading && !product) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Ürün bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu id için kayıtlı bir ürün yok:
          <code className="ms-1">{idOrSlug}</code>
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
          Ürün temel bilgilerini, fiyat, stok ve SEO alanlarını buradan
          yönetebilirsin.
        </p>
      </div>

      <ProductsForm
        mode={isCreateMode ? "create" : "edit"}
        initialData={!isCreateMode && product ? product : undefined}
        loading={loading}
        saving={saving}
        locales={locales}
        localesLoading={localesLoading}
        defaultLocale={router.locale}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminProductDetailPage;
