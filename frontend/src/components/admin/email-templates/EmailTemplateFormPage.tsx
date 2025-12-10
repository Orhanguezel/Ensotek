// ===================================================================
// FILE: src/components/admin/email-templates/EmailTemplateFormPage.tsx
// Email Templates – Form Container (create + edit)
// ===================================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useGetEmailTemplateAdminQuery,
  useCreateEmailTemplateAdminMutation,
  useUpdateEmailTemplateAdminMutation,
} from "@/integrations/rtk/endpoints/admin/email_templates_admin.endpoints";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type {
  EmailTemplateAdminDetailDto,
  EmailTemplateAdminTranslationDto,
} from "@/integrations/types/email_templates.types";

import type { LocaleOption } from "@/components/admin/email-templates/EmailTemplateHeader";

import { EmailTemplateForm } from "@/components/admin/email-templates/EmailTemplateForm";
import { EmailTemplateFormHeader } from "@/components/admin/email-templates/EmailTemplateFormHeader";
import { EmailTemplateFormJsonSection } from "@/components/admin/email-templates/EmailTemplateFormJsonSection";

/* ------------------------------------------------------------- */
/*  Props + Form tipi                                            */
/* ------------------------------------------------------------- */

export type EmailTemplateFormMode = "create" | "edit";

interface EmailTemplateFormPageProps {
  mode: EmailTemplateFormMode;
  id?: string;
}

export type EmailTemplateFormValues = {
  template_key: string;
  is_active: boolean;

  // aktif editlenen çeviri
  locale: string;
  template_name: string;
  subject: string;
  content: string;

  // parent JSON (variables)
  variablesValue: unknown;

  // sadece display için
  detectedVariables: string[];

  parentCreatedAt?: string | Date;
  parentUpdatedAt?: string | Date;
  translationCreatedAt?: string | Date;
  translationUpdatedAt?: string | Date;
};

/* ------------------------------------------------------------- */
/*  Yardımcı: locale listesi                                     */
/* ------------------------------------------------------------- */

const buildLocaleOptions = (
  appLocaleRows: { key: string; value: unknown }[] | undefined,
): LocaleOption[] => {
  let codes: string[] = [];

  if (!appLocaleRows || appLocaleRows.length === 0) {
    codes = ["tr", "en"];
  } else {
    const row = appLocaleRows.find((r) => r.key === "app_locales");
    const v = row?.value;

    if (Array.isArray(v)) {
      codes = v.map((x) => String(x)).filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          codes = parsed.map((x) => String(x)).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    if (!codes.length) {
      codes = ["tr", "en"];
    }
  }

  const uniqLower = Array.from(
    new Set(codes.map((x) => String(x).toLowerCase())),
  );

  return uniqLower.map((code) => {
    const lower = code.toLowerCase();
    let label = `${code.toUpperCase()} (${lower})`;

    if (lower === "tr") label = "Türkçe (tr)";
    else if (lower === "en") label = "İngilizce (en)";
    else if (lower === "de") label = "Almanca (de)";

    return { value: lower, label };
  });
};

/* ------------------------------------------------------------- */
/*  Variables normalizasyonu (AdminJsonEditor → payload)         */
/* ------------------------------------------------------------- */

const normalizeVariablesForPayload = (
  raw: unknown,
): string[] | null => {
  if (raw == null) return null;

  if (Array.isArray(raw)) {
    const arr = raw
      .map((x) => String(x).trim())
      .filter((x) => x.length > 0);
    return arr.length ? arr : null;
  }

  if (typeof raw === "object") {
    const arr = Object.values(raw as any)
      .map((x) => String(x).trim())
      .filter((x) => x.length > 0);
    return arr.length ? arr : null;
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const arr = trimmed
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    return arr.length ? arr : null;
  }

  return null;
};

/* ------------------------------------------------------------- */
/*  Yardımcı: detail + selectedLocale → form values              */
/* ------------------------------------------------------------- */

const buildFormValuesFromDetail = (
  detail: EmailTemplateAdminDetailDto,
  selectedLocale: string,
): EmailTemplateFormValues => {
  const tr: EmailTemplateAdminTranslationDto | undefined =
    detail.translations.find(
      (t) => t.locale.toLowerCase() === selectedLocale.toLowerCase(),
    );

  return {
    template_key: detail.template_key,
    is_active: detail.is_active,
    locale: selectedLocale,
    template_name: tr?.template_name ?? "",
    subject: tr?.subject ?? "",
    content: tr?.content ?? "",
    variablesValue: detail.variables ?? [],
    detectedVariables: tr?.detected_variables ?? [],
    parentCreatedAt: detail.created_at,
    parentUpdatedAt: detail.updated_at,
    translationCreatedAt: tr?.created_at,
    translationUpdatedAt: tr?.updated_at,
  };
};

/* ------------------------------------------------------------- */
/*  Component                                                     */
/* ------------------------------------------------------------- */

export const EmailTemplateFormPage: React.FC<
  EmailTemplateFormPageProps
> = ({ mode, id }) => {
  const router = useRouter();
  const isEdit = mode === "edit";

  /* ----------- Locale options (site_settings.app_locales) ------------ */

  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const localeOptions = useMemo(
    () => buildLocaleOptions(appLocaleRows),
    [appLocaleRows],
  );

  const [selectedLocale, setSelectedLocale] = useState<string>("");

  /* ------------------ Edit mode: detail query ------------------ */

  const {
    data: detail,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useGetEmailTemplateAdminQuery(isEdit && id ? id : "", {
    skip: !isEdit || !id,
  });

  const [createTemplate, { isLoading: isCreating }] =
    useCreateEmailTemplateAdminMutation();
  const [updateTemplate, { isLoading: isUpdating }] =
    useUpdateEmailTemplateAdminMutation();

  const [form, setForm] = useState<EmailTemplateFormValues | null>(
    null,
  );

  const loading =
    isLocalesLoading || (isEdit && isDetailLoading) || isCreating || isUpdating;

  /* ------------------ Initial locale selection ------------------ */

  useEffect(() => {
    if (selectedLocale) return;

    const queryLocale =
      typeof router.query.locale === "string"
        ? router.query.locale.trim().toLowerCase()
        : "";

    if (queryLocale) {
      setSelectedLocale(queryLocale);
      return;
    }

    if (isEdit && detail && detail.translations.length > 0) {
      setSelectedLocale(detail.translations[0].locale.toLowerCase());
      return;
    }

    if (localeOptions.length > 0) {
      setSelectedLocale(localeOptions[0].value.toLowerCase());
      return;
    }

    setSelectedLocale("tr");
  }, [detail, isEdit, localeOptions, router.query, selectedLocale]);

  /* ------------------ Detail → form sync (edit) ------------------ */

  useEffect(() => {
    if (!isEdit) return;
    if (!detail) return;
    if (!selectedLocale) return;

    const nextForm = buildFormValuesFromDetail(detail, selectedLocale);
    setForm(nextForm);
  }, [detail, isEdit, selectedLocale]);

  /* ------------------ Create mode initial form ------------------ */

  useEffect(() => {
    if (!isEdit) {
      if (!selectedLocale) return;
      setForm((prev) => {
        if (prev) return prev;
        return {
          template_key: "",
          is_active: true,
          locale: selectedLocale,
          template_name: "",
          subject: "",
          content: "",
          variablesValue: [],
          detectedVariables: [],
          parentCreatedAt: undefined,
          parentUpdatedAt: undefined,
          translationCreatedAt: undefined,
          translationUpdatedAt: undefined,
        };
      });
    }
  }, [isEdit, selectedLocale]);

  /* ------------------ form.locale → selectedLocale sync ---------- */
  useEffect(() => {
    if (!form) return;
    const rawLocale = form.locale;
    const norm = rawLocale ? rawLocale.trim().toLowerCase() : "";
    if (norm && norm !== selectedLocale) {
      setSelectedLocale(norm);
    }
  }, [form, selectedLocale]);

  /* ------------------ Handlers ------------------ */

  const handleBackToList = () => {
    router.push("/admin/email-templates");
  };

  const handleFormChange = (patch: Partial<EmailTemplateFormValues>) => {
    setForm((prev) =>
      prev ? { ...prev, ...patch } : (prev as EmailTemplateFormValues | null),
    );
  };

  const handleVariablesChange = (next: unknown) => {
    handleFormChange({ variablesValue: next });
  };

  const handleSubmit = async () => {
    if (!form) return;

    const template_key = form.template_key.trim();
    const template_name = form.template_name.trim();
    const subject = form.subject.trim();
    const content = form.content;
    const localeValue = form.locale.trim();

    if (!template_key || !template_name || !subject || !content) {
      toast.error(
        "template_key, isim (template_name), subject ve content zorunludur.",
      );
      return;
    }

    if (!localeValue) {
      toast.error("Locale alanı boş olamaz.");
      return;
    }

    const variablesArray = normalizeVariablesForPayload(form.variablesValue);

    try {
      if (isEdit && id) {
        const result = await updateTemplate({
          id,
          patch: {
            template_key,
            is_active: form.is_active,
            variables: variablesArray ?? undefined,
            template_name,
            subject,
            content,
            locale: localeValue,
          },
        }).unwrap();

        toast.success("Email şablonu güncellendi.");
        await refetchDetail();

        if (result) {
          setForm(buildFormValuesFromDetail(result, localeValue));
        }
      } else {
        const result = await createTemplate({
          template_key,
          template_name,
          subject,
          content,
          is_active: form.is_active,
          variables: variablesArray ?? undefined,
          locale: localeValue,
        }).unwrap();

        toast.success("Email şablonu oluşturuldu.");

        if (result?.id) {
          router.push(`/admin/email-templates/${result.id}`);
        } else {
          handleBackToList();
        }
      }
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        "Şablon kaydedilirken bir hata oluştu.";
      if (msg === "key_exists_for_locale") {
        toast.error(
          "Bu template_key + locale kombinasyonu zaten mevcut.",
        );
      } else {
        toast.error(msg);
      }
    }
  };

  /* ------------------ Render ------------------ */

  if (!form) {
    return (
      <div className="container-fluid py-4">
        {loading ? (
          <div className="alert alert-info mb-0">Yükleniyor...</div>
        ) : (
          <div className="alert alert-warning mb-0">
            Form yüklenemedi.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <EmailTemplateFormHeader
        mode={mode}
        values={form}
        onChange={handleFormChange}
        localeOptions={localeOptions}
        localesLoading={isLocalesLoading}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={handleBackToList}
      />

      <div className="row g-3">
        <div className="col-lg-8">
          <EmailTemplateForm values={form} onChange={handleFormChange} />
        </div>
        <div className="col-lg-4">
          <EmailTemplateFormJsonSection
            values={form}
            onVariablesChange={handleVariablesChange}
          />
        </div>
      </div>
    </div>
  );
};

// İstersen pages tarafında default import kullanmak için:
export default EmailTemplateFormPage;
