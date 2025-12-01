// =============================================================
// FILE: src/components/admin/site-settings/SiteSettingsList.tsx
// Ensotek – Site Ayarları Liste Bileşeni
// (Bootstrap table + mobile cards, external UI component yok)
// =============================================================

import React from "react";
import type { SiteSetting } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

// Küçük yardımcı – value için kısa özet
function formatValuePreview(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") {
    if (v.length <= 80) return v;
    return v.slice(0, 77) + "...";
  }
  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  try {
    const s = JSON.stringify(v);
    if (s.length <= 80) return s;
    return s.slice(0, 77) + "...";
  } catch {
    return String(v);
  }
}

export type SiteSettingsListProps = {
  settings?: SiteSetting[];
  loading: boolean;
  onEdit?: (setting: SiteSetting) => void;
  onDelete?: (setting: SiteSetting) => void;
};

export const SiteSettingsList: React.FC<SiteSettingsListProps> = ({
  settings,
  loading,
  onEdit,
  onDelete,
}) => {
  const hasData = !!settings && settings.length > 0;

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Ayar Listesi</span>
        {loading && <span className="badge bg-secondary">Yükleniyor...</span>}
      </div>

      <div className="card-body p-0">
        {/* ========= Desktop / Tablet (md ve üstü) – Table görünümü ========= */}
        <div className="d-none d-md-block">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Key</th>
                <th style={{ width: "10%" }}>Locale</th>
                <th style={{ width: "35%" }}>Değer (Özet)</th>
                <th style={{ width: "15%" }}>Güncellenme</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                settings!.map((s) => (
                  <tr
                    key={`${s.key}_${s.locale || "default"}`}
                    style={{ cursor: "default" }}
                  >
                    <td>{s.key}</td>
                    <td>
                      {s.locale || <span className="text-muted">-</span>}
                    </td>
                    <td>
                      <span className="text-muted small">
                        {formatValuePreview(s.value)}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted small">
                        {s.updated_at
                          ? new Date(s.updated_at).toLocaleString()
                          : "-"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        {onEdit && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onEdit(s)}
                          >
                            Düzenle
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(s)}
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center text-muted small py-3">
                      Kayıt bulunamadı.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <caption className="px-3 py-2 text-start">
              <span className="text-muted small">
                Bu tablo, filtrelere göre <code>site_settings</code> kayıtlarını
                gösterir. Çoklu dilde statik içerik yönetiminde, her dil için
                ayrı satırlar (ör. <code>homepage_hero_title</code> + locale{" "}
                <code>tr/en/de</code>) oluşturularak yönetilebilir.
              </span>
            </caption>
          </table>
        </div>

        {/* ========= Mobil (sm ve altı) – Card görünümü ========= */}
        <div className="d-block d-md-none">
          {hasData ? (
            settings!.map((s) => (
              <div
                key={`${s.key}_${s.locale || "default"}`}
                className="border-bottom px-3 py-2"
              >
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <div className="fw-semibold small">
                      {s.key}
                      {s.locale && (
                        <span className="badge bg-light text-dark border ms-2">
                          {s.locale}
                        </span>
                      )}
                    </div>
                    {!s.locale && (
                      <div className="text-muted small">
                        <em>Locale: varsayılan / fallback</em>
                      </div>
                    )}
                    <div className="text-muted small mt-1">
                      {formatValuePreview(s.value)}
                    </div>
                    <div className="text-muted small mt-1">
                      <span className="me-1">Güncellenme:</span>
                      {s.updated_at
                        ? new Date(s.updated_at).toLocaleString()
                        : "-"}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-1">
                    {onEdit && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onEdit(s)}
                      >
                        Düzenle
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(s)}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Kayıt bulunamadı.
            </div>
          )}

          <div className="px-3 py-2 border-top">
            <span className="text-muted small">
              Mobil görünümde kayıtlar kart formatında listelenir. Detaylı
              düzenleme için ilgili kaydı seçip üstteki sekmeler ve ayar
              formlarını kullanabilirsin.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
