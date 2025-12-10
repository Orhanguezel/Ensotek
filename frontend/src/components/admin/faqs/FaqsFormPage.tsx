// =============================================================
// FILE: src/components/admin/faqs/FaqsFormPage.tsx
// Ensotek – FAQ Form Sayfası (Create/Edit + JSON)
// RTK + faqs.types.ts ile uyumlu
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

import type {
  FaqDto,
  FaqCreatePayload,
  FaqUpdatePayload,
} from "@/integrations/types/faqs.types";
import type { LocaleOption } from "@/components/admin/faqs/FaqsHeader";

import {
  useCreateFaqAdminMutation,
  useUpdateFaqAdminMutation,
  useLazyGetFaqAdminQuery,
} from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import {
  FaqsForm,
  type FaqsFormValues,
} from "./FaqsForm";
import {
  FaqsFormHeader,
  type FaqsFormEditMode,
} from "./FaqsFormHeader";
import { FaqsFormJsonSection } from "./FaqsFormJsonSection";

/* ------------------------------------------------------------- */

type FaqsFormPageProps = {
  mode: "create" | "edit";
  initialData?: FaqDto | null;
  loading?: boolean;
  onDone?: () => void;
};

/**
 * Form state:
 * - FaqsFormValues: backend payload ile bire bir uyumlu alanlar
 * - id: mevcut kaydın id'si (edit mode)
 */
type FaqsFormState = FaqsFormValues & {
  id?: string;
};

/* map DTO → form state */
const mapDtoToFormState = (item: FaqDto): FaqsFormState => ({
  id: item.id,
  locale: item.locale_resolved || "tr",

  is_active: item.is_active === 1,
  display_order: item.display_order ?? 0,

  question: item.question ?? "",
  answer: item.answer ?? "",
  slug: item.slug ?? "",

  category_id: item.category_id ?? "",
  sub_category_id: item.sub_category_id ?? "",
});

/* JSON model builder – sadece contract'ta olan alanlar */
const buildJsonModelFromForm = (s: FaqsFormState) => ({
  question: s.question || "",
  answer: s.answer || "",
  slug: s.slug || "",
  locale: s.locale || undefined,

  is_active: s.is_active,
  display_order: s.display_order,

  category_id: s.category_id || undefined,
  sub_category_id: s.sub_category_id || undefined,
});

/* ============================================================= */

const FaqsFormPage: React.FC<FaqsFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const [formState, setFormState] =
    useState<FaqsFormState | null>(null);

  const [editMode, setEditMode] =
    useState<FaqsFormEditMode>("form");

  const [jsonError, setJsonError] =
    useState<string | null>(null);

  const [triggerGetFaq] = useLazyGetFaqAdminQuery();

  const [createFaq, { isLoading: isCreating }] =
    useCreateFaqAdminMutation();
  const [updateFaq, { isLoading: isUpdating }] =
    useUpdateFaqAdminMutation();

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

    // create mode
    if (!formState && localeOptions.length > 0) {
      setFormState({
        id: undefined,
        locale: localeOptions[0].value,

        is_active: true,
        display_order: 0,

        question: "",
        answer: "",
        slug: "",

        category_id: "",
        sub_category_id: "",
      });
    }
  }, [mode, initialData, formState, localeOptions]);

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
      const data = await triggerGetFaq({
        id: formState.id,
        locale: nextLocale,
      }).unwrap();

      setFormState(mapDtoToFormState(data as FaqDto));
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
      const next: FaqsFormState = { ...prev };

      if (typeof json.locale === "string") next.locale = json.locale;

      if (typeof json.is_active === "boolean")
        next.is_active = json.is_active;

      if (
        typeof json.display_order === "number" &&
        Number.isFinite(json.display_order)
      ) {
        next.display_order = json.display_order;
      }

      if (typeof json.question === "string")
        next.question = json.question;
      if (typeof json.answer === "string")
        next.answer = json.answer;
      if (typeof json.slug === "string") next.slug = json.slug;

      if (typeof json.category_id === "string")
        next.category_id = json.category_id;
      if (typeof json.sub_category_id === "string")
        next.sub_category_id = json.sub_category_id;

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

    const question = formState.question.trim();
    const answer = formState.answer.trim();
    const slug = formState.slug.trim();

    if (!question || !answer || !slug) {
      toast.error("Soru, cevap ve slug zorunludur.");
      return;
    }

    if (mode === "create") {
      const payload: FaqCreatePayload = {
        question,
        answer,
        slug,
        locale: formState.locale || undefined,
        is_active: formState.is_active ? "1" : "0",
        display_order: formState.display_order ?? 0,
        category_id: formState.category_id || undefined,
        sub_category_id: formState.sub_category_id || undefined,
      };

      try {
        await createFaq(payload).unwrap();
        toast.success("SSS kaydı oluşturuldu.");
        if (onDone) onDone();
        else router.push("/admin/faqs");
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.message ||
          "SSS kaydedilirken hata oluştu.";
        toast.error(msg);
      }
    } else if (mode === "edit" && formState.id) {
      const payload: FaqUpdatePayload = {
        question: question || undefined,
        answer: answer || undefined,
        slug: slug || undefined,
        locale: formState.locale || undefined,
        is_active: formState.is_active ? "1" : "0",
        display_order: formState.display_order ?? undefined,
        category_id: formState.category_id || undefined,
        sub_category_id: formState.sub_category_id || undefined,
      };

      try {
        await updateFaq({
          id: formState.id,
          patch: payload,
        }).unwrap();
        toast.success("SSS kaydı güncellendi.");
        if (onDone) onDone();
        else router.push("/admin/faqs");
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.message ||
          "SSS kaydedilirken hata oluştu.";
        toast.error(msg);
      }
    }
  };

  /* -------------------- CANCEL -------------------- */

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push("/admin/faqs");
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
        <FaqsFormHeader
          mode={mode}
          editMode={editMode}
          saving={saving}
          onChangeEditMode={setEditMode}
          onCancel={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                {editMode === "form" ? (
                  <FaqsForm
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
                  <FaqsFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving || loading}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
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

export default FaqsFormPage;
