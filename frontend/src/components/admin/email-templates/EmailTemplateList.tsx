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

export const EmailTemplateList: React.FC<EmailTemplateListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Key</th>
                <th>İsim / Konu</th>
                <th>Locale</th>
                <th>Değişkenler</th>
                <th style={{ width: "80px" }}>Aktif</th>
                <th style={{ width: "220px" }}>Tarih</th>
                <th style={{ width: "150px" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Yükleniyor...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((item) => {
                  const created =
                    typeof item.created_at === "string"
                      ? item.created_at
                      : item.created_at?.toISOString?.() ?? "";
                  const updated =
                    typeof item.updated_at === "string"
                      ? item.updated_at
                      : item.updated_at?.toISOString?.() ?? "";

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
                      <td className="small">
                        <div className="fw-semibold">
                          {item.template_key}
                        </div>
                      </td>

                      <td className="small">
                        <div className="fw-semibold">
                          {item.template_name || "(isim yok)"}
                        </div>
                        <div className="text-muted text-truncate">
                          {item.subject || "(subject yok)"}
                        </div>
                      </td>

                      <td className="small">
                        {item.locale || (
                          <span className="text-muted">(locale yok)</span>
                        )}
                      </td>

                      <td className="small">
                        {varsDisplay ? (
                          <span className="text-truncate d-inline-block" style={{ maxWidth: 200 }}>
                            {varsDisplay}
                          </span>
                        ) : (
                          <span className="text-muted">(değişken yok)</span>
                        )}
                      </td>

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

                      <td className="small">
                        <div>Oluşturma: {created}</div>
                        <div>Güncelleme: {updated}</div>
                      </td>

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
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
