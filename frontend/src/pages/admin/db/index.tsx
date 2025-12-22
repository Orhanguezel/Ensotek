// =============================================================
// FILE: src/pages/admin/db/index.tsx
// Ensotek – Admin Veritabanı Yedekleme & Snapshot Sayfası
// =============================================================

import React from "react";
import type { NextPage } from "next";
import { DbAdminHeader } from "@/components/admin/db/DbAdminHeader";
import { DbSnapshotsTable } from "@/components/admin/db/DbSnapshotsTable";
import { DbImportPanel } from "@/components/admin/db/DbImportPanel";
import { useListDbSnapshotsQuery } from "@/integrations/rtk/hooks";

const AdminDbPage: NextPage = () => {
  const {
    data: snapshots,
    isLoading,
    isFetching,
    refetch,
  } = useListDbSnapshotsQuery();

  const loading = isLoading || isFetching;

  return (
    <div className="container-fluid py-3">
      {/* Basit başlık – projede global admin layout varsa oraya uyarlanabilir */}
      <div className="mb-3">
        <h4 className="h5 mb-1">Veritabanı Yönetimi</h4>
        <p className="text-muted small mb-0">
          Snapshot noktaları oluştur, mevcut snapshot&apos;ları geri yükle,
          tam veritabanı yedeği indir veya SQL dump içe aktar.
        </p>
      </div>

      {/* Snapshot oluşturma + Export (SQL / JSON) */}
      <DbAdminHeader onSnapshotCreated={refetch} />

      {/* SQL import paneli (text / url / file) */}
      <DbImportPanel />

      {/* Snapshot listesi */}
      <DbSnapshotsTable
        items={snapshots}
        loading={loading}
        refetch={refetch}
      />
    </div>
  );
};

export default AdminDbPage;
