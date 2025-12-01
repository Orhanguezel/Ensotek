// =============================================================
// FILE: src/components/admin/newsletter/NewsletterList.tsx
// Admin Newsletter – Liste tablosu
// =============================================================

import React from "react";
import type { NewsletterAdminDto } from "@/integrations/types/newsletter.types";

interface NewsletterListProps {
  items: NewsletterAdminDto[];
  loading: boolean;
  onEdit: (item: NewsletterAdminDto) => void;
  onDelete: (item: NewsletterAdminDto) => void;
  onToggleVerified: (item: NewsletterAdminDto, value: boolean) => void;
  onToggleSubscribed: (item: NewsletterAdminDto, value: boolean) => void;
}

const boolBadge = (value: boolean, trueLabel: string, falseLabel: string) =>
  value ? (
    <span className="badge bg-success">{trueLabel}</span>
  ) : (
    <span className="badge bg-secondary">{falseLabel}</span>
  );

export const NewsletterList: React.FC<NewsletterListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleVerified,
  onToggleSubscribed,
}) => {
  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Email</th>
                <th style={{ width: "80px" }}>Dil</th>
                <th style={{ width: "110px" }}>Doğrulama</th>
                <th style={{ width: "110px" }}>Abonelik</th>
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
                  const unsubscribed =
                    item.unsubscribed_at == null
                      ? ""
                      : typeof item.unsubscribed_at === "string"
                        ? item.unsubscribed_at
                        : item.unsubscribed_at?.toISOString?.() ?? "";

                  const isVerified = !!item.is_verified;
                  const isSubscribed = !!item.is_subscribed;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold small">
                          {item.email}
                        </div>
                        <div className="text-muted small">
                          ID:{" "}
                          <span className="text-monospace">
                            {item.id}
                          </span>
                        </div>
                      </td>

                      <td className="small">
                        {item.locale || (
                          <span className="text-muted">(yok)</span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex flex-column align-items-center gap-1">
                          {boolBadge(
                            isVerified,
                            "Doğrulandı",
                            "Bekliyor",
                          )}
                          <div className="form-check form-switch small">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isVerified}
                              onChange={(e) =>
                                onToggleVerified(item, e.target.checked)
                              }
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="d-flex flex-column align-items-center gap-1">
                          {boolBadge(
                            isSubscribed,
                            "Aktif",
                            "Unsubscribed",
                          )}
                          <div className="form-check form-switch small">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isSubscribed}
                              onChange={(e) =>
                                onToggleSubscribed(
                                  item,
                                  e.target.checked,
                                )
                              }
                            />
                          </div>
                        </div>
                      </td>

                      <td className="small">
                        <div>Oluşturma: {created}</div>
                        <div>Güncelleme: {updated}</div>
                        {unsubscribed && (
                          <div>Unsub: {unsubscribed}</div>
                        )}
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
