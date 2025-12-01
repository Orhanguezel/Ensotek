// =============================================================
// FILE: src/components/admin/db/DbSnapshotsTable.tsx
// Ensotek – Admin DB Snapshot Tablosu
// =============================================================

import React from "react";
import { toast } from "sonner";
import type { DbSnapshot } from "@/integrations/rtk/endpoints/admin/db_admin.endpoints";
import {
  useRestoreDbSnapshotMutation,
  useDeleteDbSnapshotMutation,
} from "@/integrations/rtk/endpoints/admin/db_admin.endpoints";

export type DbSnapshotsTableProps = {
  items?: DbSnapshot[];
  loading: boolean;
  refetch: () => void;
};

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatSize(bytes?: number | null): string {
  if (bytes == null || Number.isNaN(bytes)) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

export const DbSnapshotsTable: React.FC<DbSnapshotsTableProps> = ({
  items,
  loading,
  refetch,
}) => {
  const rows = items || [];
  const hasData = rows.length > 0;

  const [restoreSnapshot, { isLoading: isRestoring }] =
    useRestoreDbSnapshotMutation();
  const [deleteSnapshot, { isLoading: isDeleting }] =
    useDeleteDbSnapshotMutation();

  const busy = loading || isRestoring || isDeleting;

  const handleRestore = async (snap: DbSnapshot) => {
    const ok = window.confirm(
      `Bu snapshot'tan geri yükleme yapacaksın.\n\n` +
        `Snapshot: ${snap.label || snap.filename || snap.id}\n` +
        `Bu işlem mevcut veritabanı içeriğini EZER (truncate). Devam etmek istiyor musun?`,
    );
    if (!ok) return;

    try {
      const res = await restoreSnapshot({
        id: snap.id,
        dryRun: false,
        truncateBefore: true,
      }).unwrap();

      if (res.ok === false) {
        toast.error(
          res.error || "Snapshot geri yükleme sırasında bir hata oluştu.",
        );
      } else {
        toast.success("Snapshot başarıyla geri yüklendi.");
      }
    } catch (err: any) {
      const msg = err?.data?.error || err?.message || "Snapshot restore failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (snap: DbSnapshot) => {
    const ok = window.confirm(
      `Bu snapshot dosyasını silmek üzeresin.\n\nSnapshot: ${
        snap.label || snap.filename || snap.id
      }\n\nDevam etmek istiyor musun?`,
    );
    if (!ok) return;

    try {
      const res = await deleteSnapshot({ id: snap.id }).unwrap();
      if (res.ok === false) {
        toast.error(res.message || "Snapshot silinemedi.");
      } else {
        toast.success(res.message || "Snapshot silindi.");
      }
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error || err?.message || "Snapshot delete failed";
      toast.error(msg);
    }
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Snapshot Noktaları</span>
        <div className="d-flex align-items-center gap-2">
          {busy && <span className="badge bg-secondary small">İşlem yapılıyor...</span>}
          <span className="text-muted small">
            Toplam: <strong>{rows.length}</strong>
          </span>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-sm mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "25%" }}>Etiket / Not</th>
                <th style={{ width: "30%" }}>Dosya</th>
                <th style={{ width: "20%" }}>Oluşturulma</th>
                <th style={{ width: "10%" }}>Boyut</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                rows.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td className="small">
                      <div className="fw-semibold">
                        {s.label || (
                          <span className="text-muted">Etiket yok</span>
                        )}
                      </div>
                      {s.note && (
                        <div className="text-muted small text-truncate" style={{ maxWidth: 260 }}>
                          {s.note}
                        </div>
                      )}
                    </td>
                    <td className="small">
                      <div className="text-truncate" style={{ maxWidth: 300 }}>
                        <code>{s.filename || "-"}</code>
                      </div>
                      <div className="text-muted small">
                        ID: <code>{s.id}</code>
                      </div>
                    </td>
                    <td className="small">{formatDate(s.created_at)}</td>
                    <td className="small">{formatSize(s.size_bytes ?? null)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          disabled={busy}
                          onClick={() => handleRestore(s)}
                        >
                          Geri Yükle
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={busy}
                          onClick={() => handleDelete(s)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center text-muted small py-3">
                      Henüz kayıtlı snapshot bulunmuyor.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
