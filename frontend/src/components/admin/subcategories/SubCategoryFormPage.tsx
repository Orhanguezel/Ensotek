// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormPage.tsx
// Ensotek – Alt Kategori Form Sayfası (Create/Edit + i18n + JSON + Icon)
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

import type { SubCategoryDto } from "@/integrations/types/subcategory.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  CategoryOption,
} from "./SubCategoriesHeader";

import {
  useCreateSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
  useLazyGetSubCategoryAdminQuery,
} from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

import {
  useListCategoriesAdminQuery,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import {
  SubCategoryFormFields,
  type SubCategoryFormStateLike,
} from "./SubCategoryFormFields";
import {
  SubCategoryFormJsonSection,
} from "./SubCategoryFormJsonSection";
import {
  SubCategoryFormImageColumn,
} from "./SubCategoryFormImageColumn";
import {
  SubCategoryFormHeader,
  type SubCategoryFormMode,
  type SubCategoryEditMode,
} from "./SubCategoryFormHeader";
import {
  SubCategoryFormFooter,
} from "./SubCategoryFormFooter";

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type SubCategoryFormState = SubCategoryFormStateLike & {
  id?: string; // base alt kategori id (tüm dillerde aynı)
};

type SubCategoryFormPageProps = {
  mode: SubCategoryFormMode;
  initialData?: SubCategoryDto | null;
  loading?: boolean; // Edit sayfasında data fetch loading
  onDone?: () => void;
};

/* ------------------------------------------------------------- */
/*  Helpers                                                       */
/* ------------------------------------------------------------- */

const mapDtoToFormState = (item: SubCategoryDto): SubCategoryFormState => ({
  id: item.id,
  category_id: item.category_id,
  locale: item.locale || "tr",
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

const buildJsonModelFromForm = (state: SubCategoryFormState) => ({
  category_id: state.category_id,
  locale: state.locale,
  name: state.name,
  slug: state.slug,
  description: state.description || "",
  icon: state.icon || "",
  is_active: state.is_active,
  is_featured: state.is_featured,
  display_order: state.display_order,
});

/* ------------------------------------------------------------- */
/*  Component                                                     */
/* ------------------------------------------------------------- */

const SubCategoryFormPage: React.FC<SubCategoryFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();
  const currentLocaleFromRouter = (
    router.locale as string | undefined
  )?.toLowerCase();

  const [formState, setFormState] =
    useState<SubCategoryFormState | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editMode, setEditMode] =
    useState<SubCategoryEditMode>("form");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [createSubCategory, { isLoading: isCreating }] =
    useCreateSubCategoryAdminMutation();
  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryAdminMutation();

  const [triggerGetSubCategory, { isLoading: isLocaleLoading }] =
    useLazyGetSubCategoryAdminQuery();

  // Locale’leri site_settings’ten
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  // Üst kategoriler listesi
  const {
    data: categoryRows,
    isLoading: isCategoriesLoading,
  } = useListCategoriesAdminQuery({
    q: undefined,
    locale: undefined,
    module_key: undefined,
    is_active: undefined,
    is_featured: undefined,
  });

  const saving = isCreating || isUpdating;
  const loading =
    !!externalLoading || isLocalesLoading || isCategoriesLoading;

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

  /* -------------------- Category options -------------------- */

  const categoryOptions: CategoryOption[] = useMemo(() => {
    if (!categoryRows || categoryRows.length === 0) {
      return [];
    }

    return categoryRows.map((c: CategoryDto) => ({
      value: c.id,
      label: `${c.name} (${c.locale || "tr"})`,
    }));
  }, [categoryRows]);

  /* -------------------- Form state init -------------------- */

  useEffect(() => {
    // Edit modunda: initialData geldiyse doldur
    if (mode === "edit") {
      if (initialData && !formState) {
        setFormState(mapDtoToFormState(initialData));
        setSlugTouched(false);
      }
      return;
    }

    // Create modunda: localeOptions + categoryOptions hazırsa default state kur
    if (
      mode === "create" &&
      !formState &&
      localeOptions.length > 0 &&
      categoryOptions.length > 0
    ) {
      const defaultLocale =
        currentLocaleFromRouter || localeOptions[0]?.value || "tr";
      const defaultCategory = categoryOptions[0]?.value || "";

      setFormState({
        id: undefined,
        category_id: defaultCategory,
        locale: defaultLocale,
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
    categoryOptions,
    currentLocaleFromRouter,
  ]);

  /* -------------------- Görsel metadata (storage için) -------------------- */

  const imageMetadata = useMemo(() => {
    if (!formState) return undefined;
    return {
      category_id: formState.category_id || "",
      locale: formState.locale || "",
      sub_category_slug: formState.slug || "",
    };
  }, [formState]);

  /* -------------------- JSON → Form normalize -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;
      const next: SubCategoryFormState = { ...prev };

      if (typeof json.category_id === "string")
        next.category_id = json.category_id;
      if (typeof json.locale === "string") next.locale = json.locale;
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
    field: keyof SubCategoryFormStateLike,
    value: string | boolean | number,
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleNameChange = (nameValue: string) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const next: SubCategoryFormState = {
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

  const handleLocaleChange = async (nextLocale: string) => {
    if (!formState) return;

    // Create modunda sadece locale değiştir
    if (mode === "create") {
      setFormState((prev) =>
        prev ? { ...prev, locale: nextLocale } : prev,
      );
      return;
    }

    // Edit modunda: base subcategory id (tüm diller için aynı)
    const baseId = initialData?.id || formState.id;
    if (!baseId) {
      setFormState((prev) =>
        prev ? { ...prev, locale: nextLocale } : prev,
      );
      return;
    }

    try {
      const row = await triggerGetSubCategory({
        id: baseId,
        locale: nextLocale,
      }).unwrap();

      setFormState(mapDtoToFormState(row));
      setSlugTouched(false);
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;
      if (status === 404) {
        // Bu dilde henüz i18n satırı yok → aynı id korunarak yeni çeviri
        setFormState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            locale: nextLocale,
          };
        });
        setSlugTouched(false);
        toast.info(
          "Seçilen dil için alt kategori kaydı bulunamadı. Kaydettiğinde bu dil için yeni bir çeviri oluşturulacak (aynı alt kategori id ile).",
        );
      } else {
        console.error("Locale change error (subcategory):", err);
        toast.error(
          "Seçilen dil için alt kategori yüklenirken bir hata oluştu.",
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
      category_id: formState.category_id,
      locale: formState.locale || "tr",
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || undefined,
      icon: formState.icon.trim() || undefined,
      is_active: formState.is_active,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,
    };

    if (!payloadBase.category_id) {
      toast.error("Bir üst kategori seçmelisin.");
      return;
    }

    if (!payloadBase.name || !payloadBase.slug) {
      toast.error("Ad ve slug alanları zorunludur.");
      return;
    }

    try {
      if (mode === "create") {
        await createSubCategory(payloadBase as any).unwrap();
        toast.success("Alt kategori oluşturuldu.");
      } else if (mode === "edit" && formState.id) {
        await updateSubCategory({
          id: formState.id,
          patch: payloadBase as any,
        }).unwrap();
        toast.success("Alt kategori güncellendi.");
      } else {
        // Fallback
        await createSubCategory(payloadBase as any).unwrap();
        toast.success("Alt kategori oluşturuldu.");
      }

      if (onDone) onDone();
      else router.push("/admin/subcategories");
    } catch (err: any) {
      console.error("Subcategory save error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Alt kategori kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push("/admin/subcategories");
  };

  /* -------------------- Loading / not found state -------------------- */

  if (mode === "edit" && externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Alt kategori yükleniyor...
        </div>
      </div>
    );
  }

  if (mode === "edit" && !externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning small">
          Alt kategori bulunamadı veya silinmiş olabilir.
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

  /* -------------------- Render form -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-link btn-sm px-0"
          onClick={handleCancel}
        >
          ← Alt kategori listesine dön
        </button>
      </div>

      <div className="card">
        <SubCategoryFormHeader
          mode={mode}
          locale={formState.locale}
          editMode={editMode}
          onChangeEditMode={setEditMode}
          saving={saving}
          isLocaleLoading={isLocaleLoading}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              {/* Sol kolon: Form veya JSON mode */}
              <div className="col-md-7">
                {editMode === "form" ? (
                  <SubCategoryFormFields
                    formState={formState}
                    localeOptions={localeOptions}
                    categoryOptions={categoryOptions}
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
                  <SubCategoryFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              {/* Sağ kolon – Görsel/Icon alanı */}
              <div className="col-md-5">
                <SubCategoryFormImageColumn
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

          <SubCategoryFormFooter
            mode={mode}
            saving={saving}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
};

export default SubCategoryFormPage;
