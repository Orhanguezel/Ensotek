// =============================================================
// FILE: src/components/admin/support/SupportForm.tsx
// Ensotek – Admin Support Ticket Form (Create / Edit)
// =============================================================

import React, { useEffect, useState } from "react";
import type {
  AdminSupportTicketDto,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/integrations/types/support.types";

export type SupportFormValues = {
  user_id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
};

export type SupportFormMode = "create" | "edit";

export type SupportFormProps = {
  mode: SupportFormMode;
  initialData?: AdminSupportTicketDto;
  loading: boolean;
  saving: boolean;
  onSubmit: (values: SupportFormValues) => void | Promise<void>;
  onDelete?: () => void;
  onToggleStatus?: () => void;
};

const buildInitialValues = (
  initial?: AdminSupportTicketDto,
  mode: SupportFormMode = "edit",
): SupportFormValues => {
  if (!initial || mode === "create") {
    return {
      user_id: initial?.user_id ?? "",
      subject: initial?.subject ?? "",
      message: initial?.message ?? "",
      status: "open",
      priority: "medium",
    };
  }

  return {
    user_id: initial.user_id,
    subject: initial.subject,
    message: initial.message,
    status: initial.status,
    priority: initial.priority,
  };
};

export const SupportForm: React.FC<SupportFormProps> = ({
  mode,
  initialData,
  loading,
  saving,
  onSubmit,
  onDelete,
  onToggleStatus,
}) => {
  const [values, setValues] = useState<SupportFormValues>(
    buildInitialValues(initialData, mode),
  );

  useEffect(() => {
    setValues(buildInitialValues(initialData, mode));
  }, [initialData, mode]);

  const disabled = loading || saving;
  const isEdit = mode === "edit";

  const handleChange =
    (field: keyof SupportFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value as any;
      setValues((prev) => ({ ...prev, [field]: val }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit(values);
  };

  const statusBadge =
    initialData?.status === "closed"
      ? { text: "Kapalı", className: "badge bg-secondary-subtle text-muted" }
      : initialData?.status === "in_progress"
        ? { text: "İşlemde", className: "badge bg-info-subtle text-info" }
        : initialData?.status === "waiting_response"
          ? {
              text: "Müşteri Yanıtı Bekleniyor",
              className: "badge bg-warning-subtle text-warning",
            }
          : initialData?.status === "open"
            ? { text: "Açık", className: "badge bg-success-subtle text-success" }
            : null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create"
                ? "Yeni Destek Talebi Oluştur"
                : "Destek Talebi Düzenle"}
            </h5>
            <div className="text-muted small">
              Müşteri talebinin konu, mesaj, öncelik ve durum bilgilerini
              yönetebilirsin.
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {statusBadge && (
              <span className={statusBadge.className}>{statusBadge.text}</span>
            )}

            {isEdit && onToggleStatus && initialData && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={disabled}
                onClick={onToggleStatus}
              >
                {initialData.status === "closed"
                  ? "Tekrar Aç"
                  : "Talebi Kapat"}
              </button>
            )}

            {onDelete && isEdit && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                disabled={disabled}
                onClick={onDelete}
              >
                Sil
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={disabled}
            >
              {saving
                ? mode === "create"
                  ? "Oluşturuluyor..."
                  : "Kaydediliyor..."
                : mode === "create"
                  ? "Talebi Oluştur"
                  : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* Sol kolon – temel bilgiler */}
            <div className="col-lg-8">
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Kullanıcı ID
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={values.user_id}
                  onChange={handleChange("user_id")}
                  disabled={disabled || isEdit} // edit modunda genelde değiştirmeyiz
                />
                <div className="form-text small">
                  Talebi oluşturan kullanıcının ID değeri.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">Konu</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={values.subject}
                  onChange={handleChange("subject")}
                  disabled={disabled}
                  required
                />
              </div>

              <div className="mb-0">
                <label className="form-label small mb-1">Mesaj</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={6}
                  value={values.message}
                  onChange={handleChange("message")}
                  disabled={disabled}
                  required
                />
              </div>
            </div>

            {/* Sağ kolon – durum + meta */}
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Öncelik
                </label>
                <select
                  className="form-select form-select-sm"
                  value={values.priority}
                  onChange={handleChange("priority")}
                  disabled={disabled}
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">
                  Durum
                </label>
                <select
                  className="form-select form-select-sm"
                  value={values.status}
                  onChange={handleChange("status")}
                  disabled={disabled || mode === "create"}
                >
                  <option value="open">Açık</option>
                  <option value="in_progress">İşlemde</option>
                  <option value="waiting_response">
                    Müşteri Yanıtı Bekleniyor
                  </option>
                  <option value="closed">Kapalı</option>
                </select>
                {mode === "create" && (
                  <div className="form-text small">
                    Yeni talepler varsayılan olarak{" "}
                    <strong>açık (open)</strong> başlar.
                  </div>
                )}
              </div>

              {isEdit && initialData && (
                <>
                  <div className="mb-2">
                    <div className="form-label small mb-1">
                      Oluşturulma Tarihi
                    </div>
                    <div className="text-muted small">
                      {initialData.created_at
                        ? new Date(initialData.created_at).toLocaleString(
                            "tr-TR",
                          )
                        : "-"}
                    </div>
                  </div>
                  <div className="mb-0">
                    <div className="form-label small mb-1">
                      Son Güncelleme
                    </div>
                    <div className="text-muted small">
                      {initialData.updated_at
                        ? new Date(initialData.updated_at).toLocaleString(
                            "tr-TR",
                          )
                        : "-"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
