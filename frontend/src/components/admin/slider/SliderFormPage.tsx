// =============================================================
// FILE: src/components/admin/slider/SliderFormPage.tsx
// Ensotek – Slider Form Sayfası (Create/Edit + JSON + Image Upload)
// CategoryFormPage pattern’ine birebir yakın
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

import type { SliderAdminDto } from "@/integrations/types/slider.types";
import type { LocaleOption } from "@/components/admin/categories/CategoriesHeader";

import {
  useCreateSliderAdminMutation,
  useUpdateSliderAdminMutation,
  useLazyGetSliderAdminQuery,
} from "@/integrations/rtk/endpoints/admin/sliders_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import { SliderForm, type SliderFormValues } from "./SliderForm";
import { SliderFormJsonSection } from "./SliderFormJsonSection";
import {
  SliderFormImageColumn,
  type SliderImageMetadata,
} from "./SliderFormImageColumn";

/* ------------------------------------------------------------- */

type SliderFormPageProps = {
  mode: "create" | "edit";
  initialData?: SliderAdminDto | null;
  loading?: boolean;
  onDone?: () => void;
};

type SliderFormState = SliderFormValues & {
  id?: string;
};

type SliderFormEditMode = "form" | "json";

/* map DTO → form state */
const mapDtoToFormState = (item: SliderAdminDto): SliderFormState => ({
  id: item.id,
  locale: item.locale || "tr",
  name: item.name || "",
  slug: item.slug || "",
  description: item.description || "",
  image_url: item.image_url || "",
  alt: item.alt || "",
  buttonText: item.buttonText || "",
  buttonLink: item.buttonLink || "",
  featured: !!item.featured,
  is_active: !!item.is_active,
  display_order: item.display_order ?? 0,
});

/* JSON model builder */
const buildJsonModelFromForm = (state: SliderFormState) => ({
  locale: state.locale,
  name: state.name,
  slug: state.slug,
  description: state.description || "",
  image_url: state.image_url || "",
  alt: state.alt || "",
  buttonText: state.buttonText || "",
  buttonLink: state.buttonLink || "",
  featured: !!state.featured,
  is_active: !!state.is_active,
  display_order: state.display_order,
});

/* ============================================================= */

const SliderFormPage: React.FC<SliderFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const [formState, setFormState] =
    useState<SliderFormState | null>(null);

  const [editMode, setEditMode] =
    useState<SliderFormEditMode>("form");

  const [jsonError, setJsonError] =
    useState<string | null>(null);

  const [triggerGetSlider] =
    useLazyGetSliderAdminQuery();

  const [createSlider, { isLoading: isCreating }] =
    useCreateSliderAdminMutation();
  const [updateSlider, { isLoading: isUpdating }] =
    useUpdateSliderAdminMutation();

  const {
    data: localeRows,
    isLoading: localeLoading,
  } = useListSiteSettingsAdminQuery({ keys: ["app_locales"] });

  const saving = isCreating || isUpdating;
  const loading = !!externalLoading || localeLoading;

  /* ------------------------------------------------------------- */
  /* Locale Options */
  /* ------------------------------------------------------------- */

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
          arr = parsed.filter((x): x is string => typeof x === "string");
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

  /* ------------------------------------------------------------- */
  /* INITIAL FORM SETUP */
  /* ------------------------------------------------------------- */

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
        name: "",
        slug: "",
        description: "",
        image_url: "",
        alt: "",
        buttonText: "",
        buttonLink: "",
        featured: false,
        is_active: true,
        display_order: 0,
      });
    }
  }, [mode, initialData, formState, localeOptions]);

  /* ------------------------------------------------------------- */
  /* IMAGE METADATA */
  /* ------------------------------------------------------------- */

  const imageMetadata: SliderImageMetadata | undefined = formState
    ? {
        module_key: "slider",
        locale: formState.locale,
        slider_slug: formState.slug,
        slider_id: formState.id,
      }
    : undefined;

  /* ------------------------------------------------------------- */
  /* LOCALE CHANGE */
  /* ------------------------------------------------------------- */

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
      const data = await triggerGetSlider({
        id: formState.id,
        locale: nextLocale,
      }).unwrap();

      setFormState(mapDtoToFormState(data));
      toast.success("Dil içeriği yüklendi.");
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      if (status === 404) {
        setFormState((prev) =>
          prev ? { ...prev, locale: nextLocale } : prev,
        );
        toast.info(
          "Bu dil için çeviri yok. Kaydedildiğinde oluşturulacak.",
        );
      } else {
        toast.error("Dil yükleme hatası.");
      }
    }
  };

  /* ------------------------------------------------------------- */
  /* JSON → Form State uygulama */
  /* ------------------------------------------------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;

      const next: SliderFormState = { ...prev };

      if (typeof json.locale === "string") next.locale = json.locale;
      if (typeof json.name === "string") next.name = json.name;
      if (typeof json.slug === "string") next.slug = json.slug;
      if (typeof json.description === "string")
        next.description = json.description;
      if (typeof json.image_url === "string")
        next.image_url = json.image_url;
      if (typeof json.alt === "string") next.alt = json.alt;
      if (typeof json.buttonText === "string")
        next.buttonText = json.buttonText;
      if (typeof json.buttonLink === "string")
        next.buttonLink = json.buttonLink;

      if (typeof json.featured === "boolean")
        next.featured = json.featured;
      if (typeof json.is_active === "boolean")
        next.is_active = json.is_active;

      if (
        typeof json.display_order === "number" &&
        Number.isFinite(json.display_order)
      ) {
        next.display_order = json.display_order;
      }

      return next;
    });
  };

  /* ------------------------------------------------------------- */
  /* SUBMIT */
  /* ------------------------------------------------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === "json" && jsonError) {
      toast.error("JSON geçerli değil.");
      return;
    }

    const payload = {
      locale: formState.locale,
      name: formState.name.trim(),
      slug: formState.slug.trim() || undefined,
      description: formState.description.trim() || undefined,
      image_url: formState.image_url.trim() || undefined,
      alt: formState.alt.trim() || undefined,
      buttonText: formState.buttonText.trim() || undefined,
      buttonLink: formState.buttonLink.trim() || undefined,
      featured: formState.featured,
      is_active: formState.is_active,
      display_order: formState.display_order,
    };

    try {
      if (mode === "create") {
        await createSlider(payload).unwrap();
        toast.success("Slider oluşturuldu.");
      } else if (formState.id) {
        await updateSlider({ id: formState.id, patch: payload }).unwrap();
        toast.success("Slider güncellendi.");
      }

      if (onDone) onDone();
      else router.push("/admin/slider");
    } catch (err: any) {
      toast.error("Kaydedilirken hata oluştu.");
    }
  };

  /* ------------------------------------------------------------- */
  /* CANCEL */
  /* ------------------------------------------------------------- */

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push("/admin/slider");
  };

  /* ------------------------------------------------------------- */

  if (!formState) {
    return (
      <div className="container-fluid py-4 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" />
        Form hazırlanıyor...
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* ------------------------------------------------------------- */
  /* RENDER */
  /* ------------------------------------------------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="card">
        {/* HEADER */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">
              {mode === "create" ? "Yeni Slider Oluştur" : "Slider Düzenle"}
            </h5>
            <small className="text-muted">
              Form modunda alanları düzenleyebilir veya JSON modunda tüm
              payload’ı yönetebilirsin.
            </small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={
                  "btn btn-outline-primary " +
                  (editMode === "form" ? "active" : "")
                }
                disabled={saving}
                onClick={() => setEditMode("form")}
              >
                Form
              </button>
              <button
                type="button"
                className={
                  "btn btn-outline-primary " +
                  (editMode === "json" ? "active" : "")
                }
                disabled={saving}
                onClick={() => setEditMode("json")}
              >
                JSON
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={saving}
              onClick={handleCancel}
            >
              ← Geri
            </button>
          </div>
        </div>

        {/* BODY + FOOTER */}
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              {/* LEFT: FORM or JSON */}
              <div className="col-md-7">
                {editMode === "form" ? (
                  <SliderForm
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
                  <SliderFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving || loading}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              {/* RIGHT: IMAGE */}
              <div className="col-md-5">
                <SliderFormImageColumn
                  metadata={imageMetadata}
                  imageUrl={formState.image_url}
                  disabled={saving}
                  onImageUrlChange={(url) =>
                    setFormState((prev) =>
                      prev ? { ...prev, image_url: url } : prev,
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

export default SliderFormPage;
