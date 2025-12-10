// =============================================================
// FILE: src/components/admin/email-templates/EmailTemplateList.tsx
// Admin Email Templates – Liste Tablosu
// =============================================================

import React from "react";
import type { EmailTemplateAdminListItemDto } from "@/integrations/types/email_templates.types";

interface EmailTemplateListProps {
  items: EmailTemplateAdminListItemDto[];
  loading: boolean;
  onEdit: (item: EmailTemplateAdminListItemDto) => void;
  onDelete: (item: EmailTemplateAdminListItemDto) => void;
  onToggleActive: (item: EmailTemplateAdminListItemDto, value: boolean) => void;
}

const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

export const EmailTemplateList: React.FC<EmailTemplateListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const rows = items ?? [];

  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "20%" }}>Key</th>
                <th style={{ width: "30%" }}>İsim / Konu</th>
                <th style={{ width: "8%" }}>Locale</th>
                <th style={{ width: "18%" }}>Değişkenler</th>
                <th style={{ width: "8%" }}>Aktif</th>
                <th style={{ width: "16%" }}>Tarih</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Yükleniyor...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                rows.map((item) => {
                  const vars = item.variables ?? [];
                  const detected = item.detected_variables ?? [];
                  const varsDisplay =
                    vars.length > 0
                      ? vars.join(", ")
                      : detected.length > 0
                        ? detected.join(", ")
                        : "";

                  return (
                    <tr key={`${item.id}-${item.locale ?? "default"}`}>
                      {/* key */}
                      <td className="small">
                        <div className="fw-semibold text-truncate">
                          <code>{item.template_key}</code>
                        </div>
                      </td>

                      {/* isim + subject */}
                      <td className="small">
                        <div className="fw-semibold text-truncate">
                          {item.template_name || (
                            <span className="text-muted">(isim yok)</span>
                          )}
                        </div>
                        <div className="text-muted text-truncate">
                          {item.subject || "(subject yok)"}
                        </div>
                      </td>

                      {/* locale */}
                      <td className="small">
                        {item.locale ? (
                          <code>{item.locale}</code>
                        ) : (
                          <span className="text-muted">(yok)</span>
                        )}
                      </td>

                      {/* variables */}
                      <td className="small">
                        {varsDisplay ? (
                          <span
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: 220 }}
                          >
                            {varsDisplay}
                          </span>
                        ) : (
                          <span className="text-muted">(değişken yok)</span>
                        )}
                      </td>

                      {/* aktif toggle */}
                      <td>
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!item.is_active}
                            onChange={(e) =>
                              onToggleActive(item, e.target.checked)
                            }
                          />
                        </div>
                      </td>

                      {/* tarihler */}
                      <td className="small">
                        <div>Oluşturma: {formatDate(item.created_at)}</div>
                        <div className="text-muted small">
                          Güncelleme: {formatDate(item.updated_at)}
                        </div>
                      </td>

                      {/* işlemler */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onEdit(item)}
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDelete(item)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
