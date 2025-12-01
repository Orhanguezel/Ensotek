// =============================================================
// FILE: src/pages/admin/email-templates/index.tsx
// Ensotek – Admin Email Templates Sayfası
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListEmailTemplatesAdminQuery,
  useCreateEmailTemplateAdminMutation,
  useUpdateEmailTemplateAdminMutation,
  useDeleteEmailTemplateAdminMutation,
} from "@/integrations/rtk/endpoints/admin/email_templates_admin.endpoints";

import type {
  EmailTemplateAdminListItemDto,
  EmailTemplateAdminListQueryParams,
} from "@/integrations/types/email_templates.types";

import { EmailTemplateHeader } from "@/components/admin/email-templates/EmailTemplateHeader";
import { EmailTemplateList } from "@/components/admin/email-templates/EmailTemplateList";

type FormMode = "create" | "edit";

type EmailTemplateFormState = {
  id?: string;
  template_key: string;
  template_name: string;
  subject: string;
  content: string;
  locale: string;
  is_active: boolean;
  variablesText: string; // virgülle ayrılmış değişken listesi
};

const EmailTemplatesAdminPage: React.FC = () => {
  /* -------------------- Filtre state -------------------- */
  const [search, setSearch] = useState("");
  const [locale, setLocale] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<
    "" | "active" | "inactive"
  >("");

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<EmailTemplateAdminListQueryParams | void>(() => {
    const params: EmailTemplateAdminListQueryParams = {};

    if (search.trim()) {
      params.q = search.trim();
    }

    if (locale.trim()) {
      params.locale = locale.trim();
    }

    if (isActiveFilter === "active") {
      params.is_active = 1;
    } else if (isActiveFilter === "inactive") {
      params.is_active = 0;
    }

    return Object.keys(params).length > 0 ? params : {};
  }, [search, locale, isActiveFilter]);

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListEmailTemplatesAdminQuery(listParams);

  const [rows, setRows] = useState<EmailTemplateAdminListItemDto[]>([]);

  useEffect(() => {
    setRows(listData ?? []);
  }, [listData]);

  const total = rows.length;

  /* -------------------- Mutations ----------------------------- */

  const [createTemplate, { isLoading: isCreating }] =
    useCreateEmailTemplateAdminMutation();
  const [updateTemplate, { isLoading: isUpdating }] =
    useUpdateEmailTemplateAdminMutation();
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteEmailTemplateAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isCreating || isUpdating || isDeleting;

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] = useState<EmailTemplateFormState | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const parseVariablesText = (text: string): string[] | null => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    const parts = trimmed
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length ? parts : null;
  };

  const openCreateModal = () => {
    setFormMode("create");
    setFormState({
      id: undefined,
      template_key: "",
      template_name: "",
      subject: "",
      content: "",
      locale: "",
      is_active: true,
      variablesText: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: EmailTemplateAdminListItemDto) => {
    setFormMode("edit");
    setFormState({
      id: item.id,
      template_key: item.template_key,
      template_name: item.template_name ?? "",
      subject: item.subject ?? "",
      content: item.content ?? "",
      locale: item.locale ?? "",
      is_active: !!item.is_active,
      variablesText: (item.variables ?? item.detected_variables ?? []).join(
        ", ",
      ),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (busy) return;
    setShowModal(false);
    setFormState(null);
  };

  const handleFormChange = (
    field: keyof EmailTemplateFormState,
    value: string | boolean,
  ) => {
    setFormState((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  };

  const handleSaveForm = async () => {
    if (!formState) return;

    const template_key = formState.template_key.trim();
    const template_name = formState.template_name.trim();
    const subject = formState.subject.trim();
    const content = formState.content;
    const localeValue = formState.locale.trim() || null;

    if (!template_key || !template_name || !subject || !content) {
      toast.error("template_key, isim, subject ve content zorunludur.");
      return;
    }

    const variables = parseVariablesText(formState.variablesText);

    try {
      if (formMode === "create") {
        await createTemplate({
          template_key,
          template_name,
          subject,
          content,
          is_active: formState.is_active,
          variables: variables ?? undefined,
          locale: localeValue,
        }).unwrap();
        toast.success("Email şablonu oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        await updateTemplate({
          id: formState.id,
          patch: {
            template_key,
            template_name,
            subject,
            content,
            is_active: formState.is_active,
            variables: variables ?? undefined,
            locale: localeValue,
          },
        }).unwrap();
        toast.success("Email şablonu güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        "Şablon kaydedilirken bir hata oluştu.";
      if (msg === "key_exists_for_locale") {
        toast.error("Bu key ve locale kombinasyonu zaten mevcut.");
      } else {
        toast.error(msg);
      }
    }
  };

  /* -------------------- Delete / Toggle ----------------------- */

  const handleDelete = async (item: EmailTemplateAdminListItemDto) => {
    if (
      !window.confirm(
        `"${item.template_key}" şablonunu silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteTemplate(item.id).unwrap();
      toast.success(`"${item.template_key}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        "Şablon silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (
    item: EmailTemplateAdminListItemDto,
    value: boolean,
  ) => {
    try {
      await updateTemplate({
        id: item.id,
        patch: { is_active: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_active: value } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <EmailTemplateHeader
        search={search}
        onSearchChange={setSearch}
        locale={locale}
        onLocaleChange={setLocale}
        isActiveFilter={isActiveFilter}
        onIsActiveFilterChange={setIsActiveFilter}
        loading={busy}
        total={total}
        onRefresh={refetch}
        onCreateClick={openCreateModal}
      />

      <div className="row">
        <div className="col-12">
          <EmailTemplateList
            items={rows}
            loading={busy}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      {/* --------------------- Create/Edit Modal --------------------- */}
      {showModal && formState && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show" />

          {/* Modal */}
          <div
            className="modal d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    {formMode === "create"
                      ? "Yeni Email Şablonu Oluştur"
                      : "Email Şablonu Düzenle"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Kapat"
                    onClick={closeModal}
                    disabled={busy}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label small">
                        Template Key
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.template_key}
                        onChange={(e) =>
                          handleFormChange("template_key", e.target.value)
                        }
                      />
                      <div className="form-text small">
                        Örn: <code>contact_admin_notification</code>,{" "}
                        <code>contact_user_autoreply</code> vb.
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Locale
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.locale}
                        onChange={(e) =>
                          handleFormChange("locale", e.target.value)
                        }
                      />
                      <div className="form-text small">
                        Örn: <code>tr</code>, <code>en</code>,{" "}
                        <code>de</code>. Boş bırakılırsa varsayılan
                        locale kullanılır.
                      </div>
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <div className="form-check form-switch small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="email-tpl-modal-active"
                          checked={formState.is_active}
                          onChange={(e) =>
                            handleFormChange("is_active", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label ms-1"
                          htmlFor="email-tpl-modal-active"
                        >
                          Aktif
                        </label>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Değişkenler (virgülle ayır)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.variablesText}
                        onChange={(e) =>
                          handleFormChange("variablesText", e.target.value)
                        }
                      />
                      <div className="form-text small">
                        Örn: <code>name, subject, site_name</code>
                      </div>
                    </div>
                  </div>

                  <div className="row g-2 mt-2">
                    <div className="col-md-6">
                      <label className="form-label small">
                        Şablon İsmi (template_name)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.template_name}
                        onChange={(e) =>
                          handleFormChange("template_name", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Konu (subject)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.subject}
                        onChange={(e) =>
                          handleFormChange("subject", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label small">
                      İçerik (HTML content)
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={12}
                      value={formState.content}
                      onChange={(e) =>
                        handleFormChange("content", e.target.value)
                      }
                    />
                    <div className="form-text small">
                      HTML içeriğinde <code>{"{{variable}}"}</code> şeklinde
                      placeholder kullanabilirsin. Örn:{" "}
                      <code>{"Merhaba {{name}},"}</code>
                    </div>
                  </div>
                </div>

                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={closeModal}
                    disabled={busy}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveForm}
                    disabled={busy}
                  >
                    {busy
                      ? "Kaydediliyor..."
                      : formMode === "create"
                      ? "Oluştur"
                      : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailTemplatesAdminPage;
