// =============================================================
// FILE: src/components/admin/categories/CategoryFormPage.tsx
// Ensotek – Kategori Form Sayfası (Create/Edit + Görsel Upload)
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

import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  ModuleOption,
} from "./CategoriesHeader";

import {
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useLazyGetCategoryAdminQuery,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import { CategoryFormHeader } from "./CategoryFormHeader";
import {
  CategoryFormFields,
  type CategoryFormStateLike,
} from "./CategoryFormFields";
import { CategoryFormJsonSection } from "./CategoryFormJsonSection";
import { CategoryFormImageColumn } from "./CategoryFormImageColumn";
import { CategoryFormFooter } from "./CategoryFormFooter";

/* ------------------------------------------------------------- */

type CategoryFormState = CategoryFormStateLike & {
  id?: string; // base kategori id (tüm dillerde aynı)
};

type CategoryFormMode = "create" | "edit";
type EditMode = "form" | "json";

type CategoryFormPageProps = {
  mode: CategoryFormMode;
  initialData?: CategoryDto | null;
  loading?: boolean;
  onDone?: () => void;
};

/* ------------------------------------------------------------- */

const STATIC_MODULE_OPTIONS: ModuleOption[] = [
  { value: "about",      label: "Hakkımızda" },
  { value: "product",    label: "Ürünler" },
  { value: "services",   label: "Hizmetler" },
  { value: "sparepart",  label: "Yedek Parça" },
  { value: "news",       label: "Haberler" },
  { value: "library",    label: "Kütüphane" },
  { value: "references", label: "Referanslar" },
];

const mapDtoToFormState = (item: CategoryDto): CategoryFormState => ({
  id: item.id,
  locale: item.locale || "tr",
  module_key: item.module_key || "about",
  name: item.name,
  slug: item.slug,
  description: item.description || "",
  icon: item.icon || "",
  is_active: !!item.is_active,
  is_featured: !!item.is_featured,
  display_order: item.display_order ?? 0,
});

const slugify = (value: string): string => {
  if (!value) return "";

  let s = value.trim();

  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  s = s
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("");

  s = s.replace(/ß/g, "ss").replace(/ẞ/g, "ss");

  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const buildJsonModelFromForm = (state: CategoryFormState) => ({
  locale: state.locale,
  module_key: state.module_key,
  name: state.name,
  slug: state.slug,
  description: state.description || "",
  icon: state.icon || "",
  is_active: state.is_active,
  is_featured: state.is_featured,
  display_order: state.display_order,
});

/* ------------------------------------------------------------- */

const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();
  const currentLocaleFromRouter = (
    router.locale as string | undefined
  )?.toLowerCase();

  const [formState, setFormState] = useState<CategoryFormState | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("form");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryAdminMutation();

  const [triggerGetCategory, { isLoading: isLocaleLoading }] =
    useLazyGetCategoryAdminQuery();

  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const saving = isCreating || isUpdating;
  const loading = !!externalLoading || isLocalesLoading;

  /* -------------------- Locale options -------------------- */

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

  const moduleOptions: ModuleOption[] = useMemo(
    () => STATIC_MODULE_OPTIONS,
    [],
  );

  /* -------------------- Form state init -------------------- */

  useEffect(() => {
    if (mode === "edit") {
      if (initialData && !formState) {
        setFormState(mapDtoToFormState(initialData));
        setSlugTouched(false);
      }
      return;
    }

    if (mode === "create" && !formState && localeOptions.length > 0) {
      const defaultLocale =
        currentLocaleFromRouter || localeOptions[0]?.value || "tr";
      const defaultModule = moduleOptions[0]?.value ?? "about";

      setFormState({
        id: undefined,
        locale: defaultLocale,
        module_key: defaultModule,
        name: "",
        slug: "",
        description: "",
        icon: "",
        is_active: true,
        is_featured: false,
        display_order: 0,
      });
      setSlugTouched(false);
    }
  }, [
    mode,
    initialData,
    formState,
    localeOptions,
    moduleOptions,
    currentLocaleFromRouter,
  ]);

  /* -------------------- Görsel metadata -------------------- */

  const imageMetadata = useMemo(() => {
    if (!formState) return undefined;
    return {
      module_key: formState.module_key || "",
      locale: formState.locale || "",
      category_slug: formState.slug || "",
    };
  }, [formState]);

  /* -------------------- JSON → Form -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;
      const next: CategoryFormState = { ...prev };

      if (typeof json.locale === "string") next.locale = json.locale;
      if (typeof json.module_key === "string") next.module_key = json.module_key;
      if (typeof json.name === "string") next.name = json.name;

      if (typeof json.slug === "string") {
        next.slug = json.slug;
        setSlugTouched(true);
      }

      if (typeof json.description === "string")
        next.description = json.description;

      if (typeof json.icon === "string") next.icon = json.icon;

      if (typeof json.is_active === "boolean")
        next.is_active = json.is_active;
      if (typeof json.is_featured === "boolean")
        next.is_featured = json.is_featured;

      if (
        typeof json.display_order === "number" &&
        Number.isFinite(json.display_order)
      ) {
        next.display_order = json.display_order;
      }

      return next;
    });
  };

  /* -------------------- Handlers -------------------- */

  const handleFieldChange = (
    field: keyof CategoryFormStateLike,
    value: string | boolean | number,
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleNameChange = (nameValue: string) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const next: CategoryFormState = {
        ...prev,
        name: nameValue,
      };
      if (!slugTouched) {
        next.slug = slugify(nameValue);
      }
      return next;
    });
  };

  const handleSlugChange = (slugValue: string) => {
    setSlugTouched(true);
    setFormState((prev) =>
      prev ? { ...prev, slug: slugValue } : prev,
    );
  };

  /**
   * Locale değiştir:
   *  - Create modunda sadece formState.locale güncellenir.
   *  - Edit modunda aynı kategori id'si için backend'den id+locale ile çekilir.
   *  - 404 gelirse: aynı id korunarak, yeni dil için çeviri moduna geçilir.
   */
  const handleLocaleChange = async (nextLocale: string) => {
    if (!formState) return;

    if (mode === "create") {
      setFormState((prev) =>
        prev ? { ...prev, locale: nextLocale } : prev,
      );
      return;
    }

    const baseId = (initialData?.id ?? formState.id) as string | undefined;
    if (!baseId) {
      setFormState((prev) =>
        prev ? { ...prev, locale: nextLocale } : prev,
      );
      return;
    }

    try {
      const row = await triggerGetCategory({
        id: baseId,
        locale: nextLocale,
      }).unwrap();

      setFormState(mapDtoToFormState(row));
      setSlugTouched(false);
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;
      if (status === 404) {
        setFormState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            locale: nextLocale,
          };
        });
        setSlugTouched(false);
        toast.info(
          "Seçilen dil için kategori kaydı bulunamadı. Kaydettiğinde bu dil için yeni bir çeviri oluşturulacak (aynı kategori id ile).",
        );
      } else {
        console.error("Locale change error (category):", err);
        toast.error(
          "Seçilen dil için kategori yüklenirken bir hata oluştu.",
        );
        setFormState((prev) =>
          prev ? { ...prev, locale: nextLocale } : prev,
        );
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === "json" && jsonError) {
      toast.error("JSON geçerli değil. Lütfen JSON hatasını düzeltin.");
      return;
    }

    const payloadBase = {
      locale: formState.locale || "tr",
      module_key: formState.module_key || "about",
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || undefined,
      icon: formState.icon.trim() || undefined,
      is_active: formState.is_active,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,
    };

    if (!payloadBase.name || !payloadBase.slug) {
      toast.error("Ad ve slug alanları zorunludur.");
      return;
    }

    try {
      if (mode === "create") {
        await createCategory(payloadBase as any).unwrap();
        toast.success("Kategori oluşturuldu.");
      } else if (mode === "edit" && formState.id) {
        await updateCategory({
          id: formState.id,
          patch: payloadBase as any,
        }).unwrap();
        toast.success("Kategori güncellendi.");
      } else {
        await createCategory(payloadBase as any).unwrap();
        toast.success("Kategori oluşturuldu.");
      }

      if (onDone) onDone();
      else router.push("/admin/categories");
    } catch (err: any) {
      console.error("Category save error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kategori kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push("/admin/categories");
  };

  /* -------------------- Loading / not found state -------------------- */

  if (mode === "edit" && externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Kategori yükleniyor...
        </div>
      </div>
    );
  }

  if (mode === "edit" && !externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning small">
          Kategori bulunamadı veya silinmiş olabilir.
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleCancel}
        >
          ← Listeye dön
        </button>
      </div>
    );
  }

  if (!formState) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Form hazırlanıyor...
        </div>
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-link btn-sm px-0"
          onClick={handleCancel}
        >
          ← Kategori listesine dön
        </button>
      </div>

      <div className="card">
        <CategoryFormHeader
          mode={mode}
          moduleKey={formState.module_key}
          locale={formState.locale}
          editMode={editMode}
          onChangeEditMode={setEditMode}
          saving={saving}
          isLocaleLoading={isLocaleLoading}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-7">
                {editMode === "form" ? (
                  <CategoryFormFields
                    formState={formState}
                    localeOptions={localeOptions}
                    moduleOptions={moduleOptions}
                    disabled={saving || loading}
                    isLocaleLoading={isLocaleLoading}
                    onLocaleChange={handleLocaleChange}
                    onFieldChange={handleFieldChange}
                    onNameChange={handleNameChange}
                    onSlugChange={(slug) => {
                      setSlugTouched(true);
                      handleSlugChange(slug);
                    }}
                  />
                ) : (
                  <CategoryFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              <div className="col-md-5">
                <CategoryFormImageColumn
                  metadata={imageMetadata}
                  iconValue={formState.icon}
                  disabled={saving}
                  onIconChange={(url) =>
                    setFormState((prev) =>
                      prev ? { ...prev, icon: url } : prev,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <CategoryFormFooter
            mode={mode}
            saving={saving}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;
