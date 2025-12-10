// =============================================================
// FILE: src/components/admin/references/ReferencesFormPage.tsx
// Ensotek – Referans Form Sayfası (Create/Edit + JSON + Image)
// SliderFormPage pattern’i
// =============================================================

"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  FormEvent,
} from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import type { ReferenceDto } from "@/integrations/types/references.types";
import type { LocaleOption } from "@/components/admin/categories/CategoriesHeader";

import {
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useLazyGetReferenceAdminQuery,
} from "@/integrations/rtk/endpoints/admin/references_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import {
  ReferencesForm,
  type ReferencesFormValues,
} from "./ReferencesForm";
import {
  ReferencesFormHeader,
  type ReferencesFormEditMode,
} from "./ReferencesFormHeader";
import { ReferencesFormJsonSection } from "./ReferencesFormJsonSection";
import {
  ReferencesFormImageColumn,
  type ReferenceImageMetadata,
} from "./ReferencesFormImageColumn";

/* ------------------------------------------------------------- */

type ReferencesFormPageProps = {
  mode: "create" | "edit";
  initialData?: ReferenceDto | null;
  loading?: boolean;
  onDone?: () => void;
};

type ReferencesFormState = ReferencesFormValues & {
  id?: string;
};

/* map DTO → form state */
const mapDtoToFormState = (item: ReferenceDto): ReferencesFormState => ({
  id: item.id,
  locale: (item as any).locale || "tr",

  is_published: item.is_published === 1,
  is_featured: item.is_featured === 1,
  display_order: item.display_order ?? 0,

  featured_image: item.featured_image ?? "",
  website_url: item.website_url ?? "",

  title: item.title ?? "",
  slug: item.slug ?? "",
  summary: item.summary ?? "",
  content: (item as any).content ?? "",

  featured_image_alt: item.featured_image_alt ?? "",
  meta_title: item.meta_title ?? "",
  meta_description: item.meta_description ?? "",
});

/* JSON model builder */
const buildJsonModelFromForm = (s: ReferencesFormState) => ({
  locale: s.locale,
  is_published: s.is_published,
  is_featured: s.is_featured,
  display_order: s.display_order,

  featured_image: s.featured_image || "",
  website_url: s.website_url || "",

  title: s.title || "",
  slug: s.slug || "",
  summary: s.summary || "",
  content: s.content || "",

  featured_image_alt: s.featured_image_alt || "",
  meta_title: s.meta_title || "",
  meta_description: s.meta_description || "",
});

/* ============================================================= */

const ReferencesFormPage: React.FC<ReferencesFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const [formState, setFormState] =
    useState<ReferencesFormState | null>(null);

  const [editMode, setEditMode] =
    useState<ReferencesFormEditMode>("form");

  const [jsonError, setJsonError] =
    useState<string | null>(null);

  const [triggerGetReference] =
    useLazyGetReferenceAdminQuery();

  const [createReference, { isLoading: isCreating }] =
    useCreateReferenceAdminMutation();
  const [updateReference, { isLoading: isUpdating }] =
    useUpdateReferenceAdminMutation();

  const {
    data: localeRows,
    isLoading: localesLoading,
  } = useListSiteSettingsAdminQuery({ keys: ["app_locales"] });

  const saving = isCreating || isUpdating;
  const loading = !!externalLoading || localesLoading;

  /* -------------------- Locale options -------------------- */

  const localeCodes = useMemo(() => {
    if (!localeRows?.length) return ["tr", "en"];
    const row = localeRows.find((r) => r.key === "app_locales");
    const v = row?.value;

    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v.filter((x): x is string => typeof x === "string");
    } else if (typeof v === "string") {
      try {
        const parsed: unknown = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed.filter(
            (x): x is string => typeof x === "string",
          );
        }
      } catch {
        // ignore
      }
    }

    return arr.length ? arr : ["tr", "en"];
  }, [localeRows]);

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      localeCodes.map((c) => ({
        value: c,
        label:
          c === "tr"
            ? "Türkçe (tr)"
            : c === "en"
            ? "İngilizce (en)"
            : c === "de"
            ? "Almanca (de)"
            : c,
      })),
    [localeCodes],
  );

  /* -------------------- INITIAL FORM SETUP -------------------- */

  useEffect(() => {
    if (mode === "edit") {
      if (initialData && !formState) {
        setFormState(mapDtoToFormState(initialData));
      }
      return;
    }

    if (!formState && localeOptions.length > 0) {
      setFormState({
        id: undefined,
        locale: localeOptions[0].value,

        is_published: true,
        is_featured: false,
        display_order: 0,

        featured_image: "",
        website_url: "",

        title: "",
        slug: "",
        summary: "",
        content: "",

        featured_image_alt: "",
        meta_title: "",
        meta_description: "",
      });
    }
  }, [mode, initialData, formState, localeOptions]);

  /* -------------------- IMAGE METADATA -------------------- */

  const imageMetadata: ReferenceImageMetadata | undefined = formState
    ? {
        module_key: "references",
        locale: formState.locale,
        reference_slug: formState.slug,
        reference_id: formState.id,
      }
    : undefined;

  /* -------------------- LOCALE CHANGE -------------------- */

  const handleLocaleChange = async (nextLocale: string) => {
    if (!formState) return;

    if (mode === "create") {
      setFormState((prev) =>
        prev ? { ...prev, locale: nextLocale } : prev,
      );
      return;
    }

    if (!formState.id) return;

    try {
      const data = await triggerGetReference({
        id: formState.id,
        locale: nextLocale,
      }).unwrap();

      setFormState(mapDtoToFormState(data as ReferenceDto));
      toast.success("Dil içeriği yüklendi.");
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      if (status === 404) {
        setFormState((prev) =>
          prev ? { ...prev, locale: nextLocale } : prev,
        );
        toast.info(
          "Bu dil için çeviri yok. Kaydettiğinde bu dil için yeni kayıt oluşturulacak.",
        );
      } else {
        toast.error("Dil yükleme hatası.");
      }
    }
  };

  /* -------------------- JSON → FORM -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;
      const next: ReferencesFormState = { ...prev };

      if (typeof json.locale === "string") next.locale = json.locale;

      if (typeof json.is_published === "boolean")
        next.is_published = json.is_published;
      if (typeof json.is_featured === "boolean")
        next.is_featured = json.is_featured;
      if (
        typeof json.display_order === "number" &&
        Number.isFinite(json.display_order)
      ) {
        next.display_order = json.display_order;
      }

      if (typeof json.featured_image === "string")
        next.featured_image = json.featured_image;
      if (typeof json.website_url === "string")
        next.website_url = json.website_url;

      if (typeof json.title === "string") next.title = json.title;
      if (typeof json.slug === "string") next.slug = json.slug;
      if (typeof json.summary === "string") next.summary = json.summary;
      if (typeof json.content === "string") next.content = json.content;

      if (typeof json.featured_image_alt === "string")
        next.featured_image_alt = json.featured_image_alt;
      if (typeof json.meta_title === "string")
        next.meta_title = json.meta_title;
      if (typeof json.meta_description === "string")
        next.meta_description = json.meta_description;

      return next;
    });
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === "json" && jsonError) {
      toast.error("JSON geçerli değil.");
      return;
    }

    const payload = {
      locale: formState.locale,

      is_published: formState.is_published,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,

      featured_image: formState.featured_image.trim() || undefined,
      website_url: formState.website_url.trim() || undefined,

      title: formState.title.trim() || undefined,
      slug: formState.slug.trim() || undefined,
      summary: formState.summary.trim() || undefined,
      content: formState.content.trim() || undefined,

      featured_image_alt:
        formState.featured_image_alt.trim() || undefined,
      meta_title: formState.meta_title.trim() || undefined,
      meta_description:
        formState.meta_description.trim() || undefined,
    };

    try {
      if (mode === "create") {
        await createReference(payload as any).unwrap();
        toast.success("Referans oluşturuldu.");
      } else if (mode === "edit" && formState.id) {
        await updateReference({
          id: formState.id,
          patch: payload as any,
        }).unwrap();
        toast.success("Referans güncellendi.");
      }

      if (onDone) onDone();
      else router.push("/admin/references");
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Referans kaydedilirken hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- CANCEL -------------------- */

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push("/admin/references");
  };

  /* -------------------- LOADING -------------------- */

  if (!formState) {
    return (
      <div className="container-fluid py-4 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" />
        Form hazırlanıyor...
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <ReferencesFormHeader
          mode={mode}
          editMode={editMode}
          saving={saving}
          onChangeEditMode={setEditMode}
          onCancel={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              {/* LEFT: FORM / JSON */}
              <div className="col-md-7">
                {editMode === "form" ? (
                  <ReferencesForm
                    mode={mode}
                    values={formState}
                    onChange={(field, value) =>
                      setFormState((prev) =>
                        prev ? { ...prev, [field]: value } : prev,
                      )
                    }
                    onLocaleChange={handleLocaleChange}
                    saving={saving || loading}
                    localeOptions={localeOptions}
                    localesLoading={loading}
                  />
                ) : (
                  <ReferencesFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving || loading}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              {/* RIGHT: IMAGE */}
              <div className="col-md-5">
                <ReferencesFormImageColumn
                  metadata={imageMetadata}
                  imageUrl={formState.featured_image}
                  disabled={saving || loading}
                  onImageUrlChange={(url) =>
                    setFormState((prev) =>
                      prev ? { ...prev, featured_image: url } : prev,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving
                ? "Kaydediliyor..."
                : mode === "create"
                ? "Oluştur"
                : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferencesFormPage;
