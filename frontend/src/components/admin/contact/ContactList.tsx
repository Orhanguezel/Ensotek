// =============================================================
// FILE: src/components/admin/contact/ContactList.tsx
// Admin Contact Listesi (tablo)
// =============================================================

import React from "react";
import type {
  ContactDto,
  ContactStatus,
} from "@/integrations/types/contacts.types";

interface ContactListProps {
  items: ContactDto[];
  loading: boolean;
  onEdit: (item: ContactDto) => void;
  onDelete: (item: ContactDto) => void;
  onToggleResolved: (item: ContactDto, value: boolean) => void;
}

const statusBadgeClass = (status: ContactStatus): string => {
  switch (status) {
    case "new":
      return "bg-secondary";
    case "in_progress":
      return "bg-warning text-dark";
    case "closed":
      return "bg-success";
    default:
      return "bg-light text-muted";
  }
};

const statusLabel = (status: ContactStatus): string => {
  switch (status) {
    case "new":
      return "Yeni";
    case "in_progress":
      return "Üzerinde Çalışılıyor";
    case "closed":
      return "Kapalı";
    default:
      return status;
  }
};

export const ContactList: React.FC<ContactListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleResolved,
}) => {
  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Gönderen</th>
                <th>Konu</th>
                <th>Durum</th>
                <th style={{ width: "90px" }}>Çözüldü</th>
                <th style={{ width: "220px" }}>Tarih</th>
                <th style={{ width: "160px" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Yükleniyor...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
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

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold small">
                          {item.name}
                        </div>
                        <div className="text-muted small">
                          {item.email}{" "}
                          {item.phone && (
                            <>
                              • <span>{item.phone}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="small">
                        <div className="fw-semibold">
                          {item.subject || "(konu yok)"}
                        </div>
                        <div className="text-muted small text-truncate">
                          {item.message}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge ${statusBadgeClass(
                            item.status,
                          )}`}
                        >
                          {statusLabel(item.status)}
                        </span>
                      </td>

                      <td>
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!item.is_resolved}
                            onChange={(e) =>
                              onToggleResolved(item, e.target.checked)
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
                            Detay / Not
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
