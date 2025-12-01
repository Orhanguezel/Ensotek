// =============================================================
// FILE: src/pages/admin/reviews/[slug].tsx
// Ensotek – Admin Review Create/Edit Page (id/new)
// =============================================================

import React, { useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  ReviewsForm,
  type ReviewFormValues,
} from "@/components/admin/reviews/ReviewsForm";
import type { LocaleOption } from "@/components/admin/reviews/ReviewsHeader";

import {
  useGetReviewAdminQuery,
  useCreateReviewAdminMutation,
  useUpdateReviewAdminMutation,
} from "@/integrations/rtk/endpoints/admin/reviews_admin.endpoints";
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

const AdminReviewDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug: slugParam } = router.query;
  const isRouterReady = router.isReady;

  const idOrSlug = useMemo(
    () =>
      isRouterReady && typeof slugParam === "string"
        ? slugParam
        : undefined,
    [isRouterReady, slugParam],
  );

  const isCreateMode = idOrSlug === "new";
  const shouldSkipQuery = !isRouterReady || isCreateMode || !idOrSlug;

  const { locales, loading: localesLoading } = useLocaleOptions();

  const reviewId = !isCreateMode && idOrSlug ? idOrSlug : "";

  const {
    data: review,
    isLoading: isLoadingReview,
    isFetching: isFetchingReview,
    error: reviewError,
  } = useGetReviewAdminQuery(
    { id: reviewId },
    {
      skip: shouldSkipQuery,
    },
  );

  const [createReview, { isLoading: isCreating }] =
    useCreateReviewAdminMutation();
  const [updateReview, { isLoading: isUpdating }] =
    useUpdateReviewAdminMutation();

  const loading = isLoadingReview || isFetchingReview;
  const saving = isCreating || isUpdating;

  const handleCancel = () => {
    router.push("/admin/reviews");
  };

  const toIntOrUndefined = (val: string): number | undefined => {
    if (!val) return undefined;
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  };

  const handleSubmit = async (values: ReviewFormValues) => {
    try {
      const rating = toIntOrUndefined(values.rating) ?? 5;
      const display_order = toIntOrUndefined(values.display_order) ?? 0;

      const basePayload = {
        locale: values.locale || undefined,
        name: values.name.trim(),
        email: values.email.trim(),
        rating,
        comment: values.comment.trim(),
        is_active: values.is_active,
        is_approved: values.is_approved,
        display_order,
      };

      if (isCreateMode) {
        const created = await createReview(basePayload as any).unwrap();
        toast.success("Yorum başarıyla oluşturuldu.");

        const nextId = created.id;
        router.replace(`/admin/reviews/${encodeURIComponent(nextId)}`);
      } else {
        if (!review) {
          toast.error("Yorum verisi yüklenemedi.");
          return;
        }

        await updateReview({
          id: review.id,
          patch: basePayload as any,
        }).unwrap();
        toast.success("Yorum güncellendi.");
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
    ? "Yeni Yorum Oluştur"
    : review?.name || "Yorum Düzenle";

  if (!isRouterReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  if (!isCreateMode && reviewError && !loading && !review) {
    return (
      <div className="container-fluid py-3">
        <h4 className="h5 mb-2">Yorum bulunamadı</h4>
        <p className="text-muted small mb-3">
          Bu id için kayıtlı bir yorum yok:
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
          Müşteri yorumunun metni, puanı ve onay durumunu buradan
          yönetebilirsin.
        </p>
      </div>

      <ReviewsForm
        mode={isCreateMode ? "create" : "edit"}
        initialData={!isCreateMode && review ? review : undefined}
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

export default AdminReviewDetailPage;
